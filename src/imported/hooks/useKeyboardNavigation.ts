'use client';

import { useEffect, useCallback, useRef } from 'react';

interface NavigationCallbacks {
  onMenuToggle?: () => void;
  onPageEdit?: () => void;
  onComponentEdit?: () => void;
  onChatToggle?: () => void;
  onStartMessage?: () => void;
}

export function useKeyboardNavigation(callbacks: NavigationCallbacks = {}) {
  const currentIndexRef = useRef(0);
  const expandedRef = useRef<Set<number>>(new Set());
  const isInitializedRef = useRef(false);

  const getSections = useCallback(() => {
    return Array.from(document.querySelectorAll('[data-keyboard-nav-section]')) as HTMLElement[];
  }, []);

  const getDetails = useCallback((sectionIndex: number) => {
    const sections = getSections();
    if (sections[sectionIndex]) {
      return Array.from(
        sections[sectionIndex].querySelectorAll('[data-keyboard-nav-detail]')
      ) as HTMLElement[];
    }
    return [];
  }, [getSections]);

  const updateFocus = useCallback(() => {
    const sections = getSections();
    if (sections.length === 0) return;

    sections.forEach((section, index) => {
      const isFocused = index === currentIndexRef.current;
      section.setAttribute('data-focused', String(isFocused));

      if (isFocused) {
        section.classList.add('keyboard-nav-active');
        // Scroll into view after a brief delay to ensure DOM is ready
        setTimeout(() => {
          section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 50);
      } else {
        section.classList.remove('keyboard-nav-active');
      }
    });

    console.log(`[KeyboardNav] Focus moved to section ${currentIndexRef.current} of ${sections.length}`);
  }, [getSections]);

  const updateDetails = useCallback((sectionIndex: number) => {
    const details = getDetails(sectionIndex);
    const isExpanded = expandedRef.current.has(sectionIndex);

    details.forEach((detail) => {
      detail.setAttribute('data-expanded', String(isExpanded));
    });

    console.log(`[KeyboardNav] Section ${sectionIndex} details ${isExpanded ? 'expanded' : 'collapsed'}`);
  }, [getDetails]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const sections = getSections();
      if (sections.length === 0) return;

      const key = e.key.toLowerCase();

      // Navigation: Left/Right between sections
      if (key === 'arrowleft') {
        e.preventDefault();
        currentIndexRef.current = Math.max(0, currentIndexRef.current - 1);
        expandedRef.current.clear();
        updateFocus();
        updateDetails(currentIndexRef.current);
      } else if (key === 'arrowright') {
        e.preventDefault();
        currentIndexRef.current = Math.min(
          sections.length - 1,
          currentIndexRef.current + 1
        );
        expandedRef.current.clear();
        updateFocus();
        updateDetails(currentIndexRef.current);
      }

      // Expand/Collapse: Down/Up for details
      else if (key === 'arrowdown') {
        e.preventDefault();
        const sectionIndex = currentIndexRef.current;
        expandedRef.current.add(sectionIndex);
        updateDetails(sectionIndex);
      } else if (key === 'arrowup') {
        e.preventDefault();
        const sectionIndex = currentIndexRef.current;
        expandedRef.current.delete(sectionIndex);
        updateDetails(sectionIndex);
      }

      // Special actions
      else if (key === 'm') {
        e.preventDefault();
        console.log('[KeyboardNav] Menu toggle');
        callbacks.onMenuToggle?.();
      } else if (key === 'e') {
        if (e.shiftKey) {
          e.preventDefault();
          console.log('[KeyboardNav] Component edit');
          callbacks.onComponentEdit?.();
        } else {
          e.preventDefault();
          console.log('[KeyboardNav] Page edit');
          callbacks.onPageEdit?.();
        }
      } else if (key === 'c') {
        e.preventDefault();
        console.log('[KeyboardNav] Chat toggle');
        callbacks.onChatToggle?.();
      } else if (key === '/') {
        e.preventDefault();
        console.log('[KeyboardNav] Start message');
        callbacks.onStartMessage?.();
      }
    },
    [getSections, updateFocus, updateDetails, callbacks]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    // Initialize focus on first section after a small delay to ensure DOM is painted
    const initTimer = setTimeout(() => {
      const sections = getSections();
      console.log(`[KeyboardNav] Initialized with ${sections.length} sections`);

      if (sections.length > 0 && !isInitializedRef.current) {
        isInitializedRef.current = true;
        currentIndexRef.current = 0;
        updateFocus();
        updateDetails(0);
      }
    }, 100);

    return () => clearTimeout(initTimer);
  }, [getSections, updateFocus, updateDetails]);
}

export function useShowKeyboardShortcuts(enabled: boolean = false) {
  useEffect(() => {
    if (!enabled) return;

    const shortcuts = document.querySelector('[data-keyboard-shortcuts]');
    if (shortcuts) {
      shortcuts.classList.remove('hidden');
    }
  }, [enabled]);
}
