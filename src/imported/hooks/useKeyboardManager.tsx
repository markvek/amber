'use client';

import { useEffect, useCallback, useRef, createContext, useContext, useState, type ReactNode } from 'react';

// ============================================================================
// Types
// ============================================================================

interface KeyboardManagerState {
  // Section navigation
  currentSectionIndex: number;
  currentItemIndex: number; // -1 = section-level focus, >=0 = item within section
  expandedSections: Set<number>;
  sectionsCount: number;

  // Feature flags
  sectionNavigationEnabled: boolean;
}

interface KeyboardManagerActions {
  // Section navigation
  navigateToSection: (index: number) => void;
  navigateLeft: () => void;
  navigateRight: () => void;
  navigateUp: () => void;
  navigateDown: () => void;

  // UI toggles (callbacks registered by consumers)
  toggleSidebar: () => void;
  toggleChat: () => void;
  startMessage: () => void;
  editPage: () => void;
  editComponent: () => void;

  // Configuration
  enableSectionNavigation: (enabled: boolean) => void;
  registerCallbacks: (callbacks: KeyboardCallbacks) => void;
}

interface KeyboardCallbacks {
  onMenuToggle?: () => void;
  onChatToggle?: () => void;
  onStartMessage?: () => void;
  onPageEdit?: () => void;
  onComponentEdit?: () => void;
}

type KeyboardManagerContextType = KeyboardManagerState & KeyboardManagerActions;

// ============================================================================
// Context
// ============================================================================

const KeyboardManagerContext = createContext<KeyboardManagerContextType | null>(null);

export function useKeyboardManager() {
  const context = useContext(KeyboardManagerContext);
  if (!context) {
    throw new Error('useKeyboardManager must be used within a KeyboardManagerProvider');
  }
  return context;
}

// ============================================================================
// DOM Helpers
// ============================================================================

function getSections(): HTMLElement[] {
  return Array.from(document.querySelectorAll('[data-keyboard-nav-section]'));
}

function getDetails(sectionIndex: number): HTMLElement[] {
  const sections = getSections();
  if (sections[sectionIndex]) {
    return Array.from(sections[sectionIndex].querySelectorAll('[data-keyboard-nav-detail]'));
  }
  return [];
}

// Selector for interactive and navigable elements
const INTERACTIVE_SELECTOR = [
  // Standard interactive elements
  'a[href]',
  'button',
  'input',
  'select',
  'textarea',
  '[role="button"]',
  '[tabindex]:not([tabindex="-1"])',
  // Card and item patterns
  '[data-slot="card"]',
  '[data-card]',
  '[data-keyboard-nav-item]',
  '[role="article"]',
  '[role="listitem"]',
  '[role="option"]',
  '[role="gridcell"]',
].join(', ');

// Additional selector for card-like elements (checked separately due to class matching)
function isCardElement(el: HTMLElement): boolean {
  const classList = el.className;
  if (typeof classList !== 'string') return false;
  // Match elements with "card" in class name but not sub-components like "card-content"
  return /\bcard\b/i.test(classList) && !/(card-|card_)/i.test(classList);
}

function getInteractiveItemsInSection(sectionIndex: number): HTMLElement[] {
  const sections = getSections();
  if (!sections[sectionIndex]) return [];

  const section = sections[sectionIndex];

  // Get elements matching the selector
  const selectorMatches = Array.from(section.querySelectorAll<HTMLElement>(INTERACTIVE_SELECTOR));

  // Also find card-like elements by class name
  const allElements = Array.from(section.querySelectorAll<HTMLElement>('*'));
  const cardMatches = allElements.filter(el => isCardElement(el));

  // Combine and dedupe
  const combined = [...new Set([...selectorMatches, ...cardMatches])];

  // Filter and sort by DOM order
  const filtered = combined
    .filter(el => {
      // Filter out disabled elements
      if (el.hasAttribute('disabled')) return false;
      // Filter out hidden elements
      if (el.offsetParent === null && getComputedStyle(el).position !== 'fixed') return false;
      // Filter out elements with display:none or visibility:hidden
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      // Filter out nested items (e.g., button inside a card - prefer the card)
      // Skip this element if it's inside another matched element
      const isNested = combined.some(other => other !== el && other.contains(el));
      if (isNested) return false;
      return true;
    })
    // Sort by DOM position
    .sort((a, b) => {
      const position = a.compareDocumentPosition(b);
      if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
      if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
      return 0;
    });

  return filtered;
}

// Make an element focusable if it isn't already
function ensureFocusable(el: HTMLElement): void {
  if (!el.hasAttribute('tabindex') &&
      !['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName)) {
    el.setAttribute('tabindex', '-1');
    // Mark so we can clean up later if needed
    el.setAttribute('data-keyboard-nav-focusable', 'true');
  }
}

function getSidebarLinks(): HTMLAnchorElement[] {
  return Array.from(document.querySelectorAll('[data-sidebar-nav]'));
}

function isTextInputElement(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  const tagName = target.tagName;

  // Text inputs where arrow keys should scroll/move cursor
  if (tagName === 'TEXTAREA' || target.isContentEditable) return true;
  if (tagName === 'INPUT') {
    const type = (target as HTMLInputElement).type;
    // Only block for text-like inputs, not buttons/checkboxes/radios
    return ['text', 'email', 'password', 'search', 'url', 'tel', 'number'].includes(type);
  }
  return false;
}

function isInsideCompositeWidget(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  // Check if inside a radiogroup, listbox, menu, combobox, or similar composite widget
  // These widgets use up/down for internal navigation
  return !!target.closest(
    '[role="radiogroup"], [role="listbox"], [role="menu"], [role="menubar"], [role="tablist"], ' +
    '[role="combobox"], [role="tree"], [role="grid"], [data-radix-collection-item]'
  );
}

function isOpenDropdown(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  // Check if this is an open dropdown/select (Radix pattern)
  const el = target.closest('[data-state="open"], [aria-expanded="true"]');
  return !!el;
}

function isInsideSheet(): boolean {
  // Check if there's an open sheet/dialog
  const sheet = document.querySelector('[data-slot="sheet-content"], [role="dialog"][data-state="open"]');
  return !!sheet;
}

function getSheetInteractiveItems(): HTMLElement[] {
  const sheet = document.querySelector('[data-slot="sheet-content"], [role="dialog"][data-state="open"]');
  if (!sheet) return [];

  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[role="radio"]',
    '[role="checkbox"]',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  return Array.from(sheet.querySelectorAll<HTMLElement>(selector))
    .filter(el => {
      if (el.offsetParent === null && getComputedStyle(el).position !== 'fixed') return false;
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      return true;
    });
}

function isDropdownTrigger(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  // Check if this element is a dropdown/select trigger that would open on arrow keys
  const tagName = target.tagName;

  // Native select elements
  if (tagName === 'SELECT') return true;

  // Custom dropdown triggers (Radix, etc.)
  if (target.hasAttribute('aria-haspopup')) return true;
  if (target.getAttribute('role') === 'combobox') return true;
  if (target.hasAttribute('data-state') && target.hasAttribute('aria-expanded')) return true;

  // Radix Select trigger pattern
  if (target.closest('[data-radix-select-trigger]')) return true;
  if (target.hasAttribute('data-placeholder')) return true;

  return false;
}

function isSelectableElement(el: HTMLElement): boolean {
  const role = el.getAttribute('role');
  const type = (el as HTMLInputElement).type;
  return (
    role === 'radio' ||
    role === 'checkbox' ||
    role === 'option' ||
    role === 'menuitem' ||
    role === 'tab' ||
    type === 'radio' ||
    type === 'checkbox'
  );
}

function isInSidebar(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  return target.hasAttribute('data-sidebar-nav');
}

// ============================================================================
// Provider
// ============================================================================

interface KeyboardManagerProviderProps {
  children: ReactNode;
  hideRing?: boolean;
}

export function KeyboardManagerProvider({ children, hideRing = false }: KeyboardManagerProviderProps) {
  // State
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentItemIndex, setCurrentItemIndex] = useState(-1); // -1 = section-level focus
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const [sectionsCount, setSectionsCount] = useState(0);
  const [sectionNavigationEnabled, setSectionNavigationEnabled] = useState(false);

  // Refs for stable callbacks
  const callbacksRef = useRef<KeyboardCallbacks>({});
  const isInitializedRef = useRef(false);

  // -------------------------------------------------------------------------
  // DOM Updates
  // -------------------------------------------------------------------------

  const updateSectionFocus = useCallback((index: number) => {
    const sections = getSections();

    sections.forEach((section, i) => {
      const isFocused = i === index;
      section.setAttribute('data-focused', String(isFocused));

      if (isFocused) {
        section.classList.add('keyboard-nav-active');
        // Smooth scroll into view
        requestAnimationFrame(() => {
          section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
      } else {
        section.classList.remove('keyboard-nav-active');
      }
    });

    console.log(`[KeyboardManager] Focus moved to section ${index} of ${sections.length}`);
  }, []);

  const updateSectionDetails = useCallback((sectionIndex: number, isExpanded: boolean) => {
    const details = getDetails(sectionIndex);
    details.forEach((detail) => {
      detail.setAttribute('data-expanded', String(isExpanded));
    });
    console.log(`[KeyboardManager] Section ${sectionIndex} details ${isExpanded ? 'expanded' : 'collapsed'}`);
  }, []);

  // -------------------------------------------------------------------------
  // Navigation Actions
  // -------------------------------------------------------------------------

  const navigateToSection = useCallback((index: number) => {
    const sections = getSections();
    const clampedIndex = Math.max(0, Math.min(sections.length - 1, index));
    setCurrentSectionIndex(clampedIndex);
    setCurrentItemIndex(-1); // Clear item focus
    setExpandedSections(new Set());
    updateSectionFocus(clampedIndex);
    updateSectionDetails(clampedIndex, false);
    // Blur any focused element
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [updateSectionFocus, updateSectionDetails]);

  const navigateLeft = useCallback(() => {
    setCurrentSectionIndex((prev) => {
      const newIndex = Math.max(0, prev - 1);
      setCurrentItemIndex(-1); // Clear item focus
      setExpandedSections(new Set());
      updateSectionFocus(newIndex);
      updateSectionDetails(newIndex, false);
      // Blur any focused element
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      return newIndex;
    });
  }, [updateSectionFocus, updateSectionDetails]);

  const navigateRight = useCallback(() => {
    const sections = getSections();
    setCurrentSectionIndex((prev) => {
      const newIndex = Math.min(sections.length - 1, prev + 1);
      setCurrentItemIndex(-1); // Clear item focus
      setExpandedSections(new Set());
      updateSectionFocus(newIndex);
      updateSectionDetails(newIndex, false);
      // Blur any focused element
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      return newIndex;
    });
  }, [updateSectionFocus, updateSectionDetails]);

  const navigateDown = useCallback(() => {
    const items = getInteractiveItemsInSection(currentSectionIndex);
    if (items.length === 0) return;

    setCurrentItemIndex((prev) => {
      const newIndex = prev < 0 ? 0 : Math.min(items.length - 1, prev + 1);
      const targetItem = items[newIndex];
      if (targetItem) {
        ensureFocusable(targetItem);
        targetItem.focus();
        targetItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        console.log(`[KeyboardManager] Focus item ${newIndex} of ${items.length} in section ${currentSectionIndex}`);
      }
      return newIndex;
    });
  }, [currentSectionIndex]);

  const navigateUp = useCallback(() => {
    setCurrentItemIndex((prev) => {
      if (prev <= 0) {
        // Back to section-level focus
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        console.log(`[KeyboardManager] Back to section-level focus`);
        return -1;
      }

      const items = getInteractiveItemsInSection(currentSectionIndex);
      const newIndex = prev - 1;
      const targetItem = items[newIndex];
      if (targetItem) {
        ensureFocusable(targetItem);
        targetItem.focus();
        targetItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        console.log(`[KeyboardManager] Focus item ${newIndex} of ${items.length} in section ${currentSectionIndex}`);
      }
      return newIndex;
    });
  }, [currentSectionIndex]);

  // -------------------------------------------------------------------------
  // Callback Actions
  // -------------------------------------------------------------------------

  const toggleSidebar = useCallback(() => {
    console.log('[KeyboardManager] Sidebar toggle');
    callbacksRef.current.onMenuToggle?.();
  }, []);

  const toggleChat = useCallback(() => {
    console.log('[KeyboardManager] Chat toggle');
    callbacksRef.current.onChatToggle?.();
  }, []);

  const startMessage = useCallback(() => {
    console.log('[KeyboardManager] Start message');
    callbacksRef.current.onStartMessage?.();
  }, []);

  const editPage = useCallback(() => {
    console.log('[KeyboardManager] Page edit');
    callbacksRef.current.onPageEdit?.();
  }, []);

  const editComponent = useCallback(() => {
    console.log('[KeyboardManager] Component edit');
    callbacksRef.current.onComponentEdit?.();
  }, []);

  // -------------------------------------------------------------------------
  // Configuration
  // -------------------------------------------------------------------------

  const enableSectionNavigation = useCallback((enabled: boolean) => {
    setSectionNavigationEnabled(enabled);
  }, []);

  const registerCallbacks = useCallback((callbacks: KeyboardCallbacks) => {
    callbacksRef.current = { ...callbacksRef.current, ...callbacks };
  }, []);

  // -------------------------------------------------------------------------
  // Sidebar Navigation (when focus is in sidebar)
  // -------------------------------------------------------------------------

  const handleSidebarNavigation = useCallback((key: string) => {
    const links = getSidebarLinks();
    const currentIndex = links.indexOf(document.activeElement as HTMLAnchorElement);

    if (key === 'arrowleft' || key === 'arrowup') {
      if (currentIndex > 0) {
        links[currentIndex - 1].focus();
      }
    } else if (key === 'arrowright' || key === 'arrowdown') {
      if (currentIndex < links.length - 1) {
        links[currentIndex + 1].focus();
      }
    }
  }, []);

  // -------------------------------------------------------------------------
  // Main Keyboard Handler
  // -------------------------------------------------------------------------

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target;
      const key = e.key.toLowerCase();

      // Handle sidebar navigation separately (when focus is in sidebar)
      if (isInSidebar(target)) {
        if (['arrowleft', 'arrowright', 'arrowup', 'arrowdown'].includes(key)) {
          e.preventDefault();
          handleSidebarNavigation(key);
          return;
        }
      }

      // Handle Escape to blur any focused element and close dropdowns
      if (key === 'escape') {
        if (target instanceof HTMLElement) {
          target.blur();
        }
        // Also try clicking outside to close any open dropdowns
        document.body.click();
        e.preventDefault();
        return;
      }

      // Check context
      const isInTextInput = isTextInputElement(target);
      const isInCompositeWidget = isInsideCompositeWidget(target);
      const hasOpenDropdown = isOpenDropdown(target);
      const onDropdownTrigger = isDropdownTrigger(target);
      const sheetIsOpen = isInsideSheet();

      // Sheet/Dialog navigation - when a sheet is open, handle navigation within it
      if (sheetIsOpen && !isInTextInput) {
        const sheetItems = getSheetInteractiveItems();

        if (sheetItems.length > 0) {
          const currentIndex = sheetItems.indexOf(document.activeElement as HTMLElement);

          if (key === 'arrowdown') {
            // In composite widgets (radiogroup), let native handle
            if (isInCompositeWidget && !onDropdownTrigger) {
              return;
            }
            e.preventDefault();
            e.stopPropagation();
            const nextIndex = currentIndex < 0 ? 0 : Math.min(sheetItems.length - 1, currentIndex + 1);
            sheetItems[nextIndex].focus();
            sheetItems[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            return;
          }

          if (key === 'arrowup') {
            // In composite widgets (radiogroup), let native handle
            if (isInCompositeWidget && !onDropdownTrigger) {
              return;
            }
            e.preventDefault();
            e.stopPropagation();
            const prevIndex = currentIndex <= 0 ? 0 : currentIndex - 1;
            sheetItems[prevIndex].focus();
            sheetItems[prevIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            return;
          }

          // Left/Right in sheet: do nothing (don't navigate sections)
          if (key === 'arrowleft' || key === 'arrowright') {
            return;
          }
        }
      }

      // Section navigation (only if enabled, sections exist, and no sheet is open)
      if (sectionNavigationEnabled && !sheetIsOpen) {
        const sections = getSections();

        if (sections.length > 0) {
          // Left/Right: ALWAYS navigate sections (except in text inputs)
          // This ensures we never get "stuck" in a widget
          // We blur the current element first to escape any widget
          if (key === 'arrowleft' && !isInTextInput) {
            e.preventDefault();
            e.stopPropagation();
            // Blur current element to escape from any widget
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement.blur();
            }
            navigateLeft();
            return;
          }
          if (key === 'arrowright' && !isInTextInput) {
            e.preventDefault();
            e.stopPropagation();
            // Blur current element to escape from any widget
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement.blur();
            }
            navigateRight();
            return;
          }

          // Up/Down: Navigate items within section
          // - If dropdown is OPEN: let native behavior handle selection
          // - If on dropdown TRIGGER (closed): prevent opening, navigate instead
          // - If in composite widget (radiogroup, etc.): let native handle
          if (key === 'arrowdown' && !isInTextInput) {
            // Only let native behavior through for OPEN dropdowns or composite widgets
            if (hasOpenDropdown || (isInCompositeWidget && !onDropdownTrigger)) {
              return;
            }
            // Prevent dropdown from opening - navigate to next item instead
            e.preventDefault();
            e.stopPropagation();
            navigateDown();
            return;
          }
          if (key === 'arrowup' && !isInTextInput) {
            // Only let native behavior through for OPEN dropdowns or composite widgets
            if (hasOpenDropdown || (isInCompositeWidget && !onDropdownTrigger)) {
              return;
            }
            // Prevent dropdown from opening - navigate to prev item instead
            e.preventDefault();
            e.stopPropagation();
            navigateUp();
            return;
          }

          // Enter: Activate focused element
          // - Dropdowns: let native behavior open the dropdown
          // - Selectable elements (radio, checkbox): select and advance
          // - Links/buttons: let native behavior handle
          if (key === 'enter' && target instanceof HTMLElement) {
            const focusedEl = document.activeElement as HTMLElement;

            // Let dropdown triggers open on Enter (native behavior)
            if (onDropdownTrigger) {
              return;
            }

            // If focused on a selectable element (radio, checkbox), click it
            if (focusedEl && isSelectableElement(focusedEl)) {
              // Let the click happen naturally, then advance to next item
              setTimeout(() => {
                navigateDown();
              }, 50);
              return;
            }

            // For links and buttons, let native behavior handle (navigate/click)
            // Don't prevent default
          }
        }
      }

      // Skip letter shortcuts when in any input/form element
      if (isInTextInput) {
        return;
      }

      // Global shortcuts (no modifiers)
      if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        if (key === 'm') {
          e.preventDefault();
          toggleSidebar();
          return;
        }
        if (key === 'c') {
          e.preventDefault();
          toggleChat();
          return;
        }
        if (key === '/') {
          e.preventDefault();
          startMessage();
          return;
        }
        if (key === 'e') {
          e.preventDefault();
          if (e.shiftKey) {
            editComponent();
          } else {
            editPage();
          }
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    sectionNavigationEnabled,
    navigateLeft,
    navigateRight,
    navigateUp,
    navigateDown,
    toggleSidebar,
    toggleChat,
    startMessage,
    editPage,
    editComponent,
    handleSidebarNavigation,
  ]);

  // -------------------------------------------------------------------------
  // Initialize sections on mount
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (!sectionNavigationEnabled) return;

    const initTimer = setTimeout(() => {
      const sections = getSections();
      setSectionsCount(sections.length);
      console.log(`[KeyboardManager] Initialized with ${sections.length} sections`);

      if (sections.length > 0 && !isInitializedRef.current) {
        isInitializedRef.current = true;
        setCurrentSectionIndex(0);
        updateSectionFocus(0);
        updateSectionDetails(0, false);
      }
    }, 100);

    return () => clearTimeout(initTimer);
  }, [sectionNavigationEnabled, updateSectionFocus, updateSectionDetails]);

  // Reset initialization flag when navigation is disabled
  useEffect(() => {
    if (!sectionNavigationEnabled) {
      isInitializedRef.current = false;
    }
  }, [sectionNavigationEnabled]);

  // -------------------------------------------------------------------------
  // Context Value
  // -------------------------------------------------------------------------

  const contextValue: KeyboardManagerContextType = {
    // State
    currentSectionIndex,
    currentItemIndex,
    expandedSections,
    sectionsCount,
    sectionNavigationEnabled,

    // Actions
    navigateToSection,
    navigateLeft,
    navigateRight,
    navigateUp,
    navigateDown,
    toggleSidebar,
    toggleChat,
    startMessage,
    editPage,
    editComponent,
    enableSectionNavigation,
    registerCallbacks,
  };

  return (
    <KeyboardManagerContext.Provider value={contextValue}>
      <div className={hideRing ? 'keyboard-nav-ring-hidden' : ''}>
        {children}
      </div>
    </KeyboardManagerContext.Provider>
  );
}
