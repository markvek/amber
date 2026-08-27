'use client';

import { useEffect, type ReactNode } from 'react';
import { useKeyboardManager } from '@/hooks/useKeyboardManager';

interface KeyboardNavigablePageProps {
  children: ReactNode;
}

/**
 * Wrapper component that enables keyboard section navigation for a page.
 *
 * Usage:
 * ```tsx
 * <KeyboardNavigablePage>
 *   <section data-keyboard-nav-section>Section 1</section>
 *   <section data-keyboard-nav-section>Section 2</section>
 * </KeyboardNavigablePage>
 * ```
 *
 * Arrow keys will navigate between sections marked with `data-keyboard-nav-section`.
 */
export function KeyboardNavigablePage({
  children,
}: KeyboardNavigablePageProps) {
  const { enableSectionNavigation } = useKeyboardManager();

  // Enable section navigation when this page mounts
  useEffect(() => {
    enableSectionNavigation(true);

    return () => {
      enableSectionNavigation(false);
    };
  }, [enableSectionNavigation]);

  return <>{children}</>;
}
