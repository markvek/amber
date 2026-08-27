"use client";

import { useCallback } from "react";

/**
 * Hook to navigate between keyboard-navigable sections
 */
export function useSectionNavigation() {
  const getSections = useCallback(() => {
    return Array.from(
      document.querySelectorAll("[data-keyboard-nav-section]")
    ) as HTMLElement[];
  }, []);

  const getCurrentSectionIndex = useCallback(
    (element: HTMLElement) => {
      const sections = getSections();
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].contains(element)) {
          return i;
        }
      }
      return -1;
    },
    [getSections]
  );

  const focusNextSection = useCallback(() => {
    const activeElement = document.activeElement as HTMLElement;
    const currentIndex = getCurrentSectionIndex(activeElement);
    const sections = getSections();

    if (currentIndex >= 0 && currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1];
      // Find first focusable element in the next section
      const focusable = nextSection.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable) {
        focusable.focus();
      } else {
        nextSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [getSections, getCurrentSectionIndex]);

  const focusPreviousSection = useCallback(() => {
    const activeElement = document.activeElement as HTMLElement;
    const currentIndex = getCurrentSectionIndex(activeElement);
    const sections = getSections();

    if (currentIndex > 0) {
      const prevSection = sections[currentIndex - 1];
      // Find last focusable element in the previous section
      const focusables = prevSection.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length > 0) {
        focusables[focusables.length - 1].focus();
      } else {
        prevSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [getSections, getCurrentSectionIndex]);

  return {
    focusNextSection,
    focusPreviousSection,
    getSections,
    getCurrentSectionIndex,
  };
}
