'use client';

import { useEffect, useCallback } from 'react';
import { useKeyboardManager } from '@/hooks/useKeyboardManager';
import { useSidebar } from '@/components/ui/sidebar';
import { useAssistant } from '@/components/workspace/assistant-panel';

/**
 * Connects the keyboard manager to sidebar and assistant contexts.
 * This component registers callbacks so keyboard shortcuts can toggle these panels.
 */
export function KeyboardConnector() {
  const { registerCallbacks } = useKeyboardManager();
  const { toggleSidebar, setOpen, state } = useSidebar();
  const { toggle: toggleAssistant } = useAssistant();

  const handleMenuToggle = useCallback(() => {
    const wasCollapsed = state === 'collapsed';
    toggleSidebar();

    // Focus sidebar after expanding
    if (wasCollapsed) {
      setTimeout(() => {
        const links = Array.from(document.querySelectorAll('[data-sidebar-nav]')) as HTMLAnchorElement[];
        if (links.length > 0) {
          // Focus active link or first link
          const activeLink = links.find((link) => link.classList.contains('bg-muted'));
          (activeLink || links[0]).focus();
        }
      }, 50);
    }
  }, [toggleSidebar, state]);

  const handleChatToggle = useCallback(() => {
    toggleAssistant();
    // Focus the chat input after opening
    setTimeout(() => {
      const chatInput = document.querySelector<HTMLInputElement>(
        '[aria-label="Message the assistant"]'
      );
      chatInput?.focus();
    }, 100);
  }, [toggleAssistant]);

  const handleStartMessage = useCallback(() => {
    // Focus the chat input field
    const chatInput = document.querySelector<HTMLInputElement>(
      '[aria-label="Message the assistant"]'
    );
    if (chatInput) {
      chatInput.focus();
    } else {
      // If chat is not visible, open it first then focus
      toggleAssistant();
      setTimeout(() => {
        const input = document.querySelector<HTMLInputElement>(
          '[aria-label="Message the assistant"]'
        );
        input?.focus();
      }, 100);
    }
  }, [toggleAssistant]);

  // Register callbacks on mount
  useEffect(() => {
    registerCallbacks({
      onMenuToggle: handleMenuToggle,
      onChatToggle: handleChatToggle,
      onStartMessage: handleStartMessage,
    });
  }, [registerCallbacks, handleMenuToggle, handleChatToggle, handleStartMessage]);

  // Close sidebar when Enter is pressed on a sidebar navigation link
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const target = e.target as HTMLElement;
        // Check if the target is a sidebar navigation link
        if (target?.hasAttribute('data-sidebar-nav')) {
          // Close the sidebar after a brief delay to allow navigation to start
          setTimeout(() => {
            setOpen(false);
          }, 50);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setOpen]);

  return null;
}
