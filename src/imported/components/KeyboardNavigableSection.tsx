'use client';

import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { ReactNode, useEffect, useState } from 'react';

interface KeyboardNavigableSectionProps {
  children: ReactNode;
  onMenuToggle?: () => void;
  onPageEdit?: () => void;
  onComponentEdit?: () => void;
  onChatToggle?: () => void;
  onStartMessage?: () => void;
  showShortcuts?: boolean;
  hideRing?: boolean;
}

export function KeyboardNavigableSection({
  children,
  onMenuToggle,
  onPageEdit,
  onComponentEdit,
  onChatToggle,
  onStartMessage,
  showShortcuts = true,
  hideRing = false,
}: KeyboardNavigableSectionProps) {
  const [showPanel, setShowPanel] = useState(false);

  useKeyboardNavigation({
    onMenuToggle,
    onPageEdit,
    onComponentEdit,
    onChatToggle,
    onStartMessage,
  });

  useEffect(() => {
    if (!showShortcuts) return;

    const handleMouseMove = () => {
      setShowPanel(false);
      document.documentElement.classList.add('keyboard-nav-hidden');
    };

    const handleMouseClick = () => {
      setShowPanel(false);
      document.documentElement.classList.add('keyboard-nav-hidden');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Show panel on any keyboard input
      if (
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight' ||
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        e.key.toLowerCase() === 'm' ||
        e.key.toLowerCase() === 'c' ||
        e.key.toLowerCase() === 'e' ||
        e.key === '/'
      ) {
        setShowPanel(true);
        document.documentElement.classList.remove('keyboard-nav-hidden');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleMouseClick);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleMouseClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showShortcuts]);

  return (
    <div className={`relative ${hideRing ? 'keyboard-nav-ring-hidden' : ''}`}>
      {children}

      {showShortcuts && (
        <div
          data-keyboard-shortcuts
          className={showPanel ? '' : 'hidden'}
        >
          <ul>
            <li>
              <span>Navigate</span>
              <kbd>←</kbd>
              <kbd>→</kbd>
            </li>
            <li>
              <span>Expand</span>
              <kbd>↓</kbd>
            </li>
            <li>
              <span>Collapse</span>
              <kbd>↑</kbd>
            </li>
            <li>
              <span>Menu</span>
              <kbd>M</kbd>
            </li>
            <li>
              <span>Chat</span>
              <kbd>C</kbd>
            </li>
            <li>
              <span>Message</span>
              <kbd>/</kbd>
            </li>
            <li>
              <span>Edit Page</span>
              <kbd>E</kbd>
            </li>
            <li>
              <span>Edit Component</span>
              <kbd>⇧E</kbd>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
