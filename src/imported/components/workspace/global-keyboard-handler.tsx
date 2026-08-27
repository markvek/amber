"use client";

import { useEffect, useCallback } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { useAssistant } from "@/components/workspace/assistant-panel";

/**
 * Get all navigable sidebar links
 */
function getSidebarLinks(): HTMLAnchorElement[] {
  return Array.from(document.querySelectorAll("[data-sidebar-nav]")) as HTMLAnchorElement[];
}

/**
 * Get the currently focused sidebar link index
 */
function getCurrentLinkIndex(links: HTMLAnchorElement[]): number {
  const focused = document.activeElement as HTMLElement;
  return links.indexOf(focused as HTMLAnchorElement);
}

/**
 * Focus a sidebar link by index
 */
function focusSidebarLink(index: number) {
  const links = getSidebarLinks();
  if (links.length > 0 && index >= 0 && index < links.length) {
    links[index].focus();
  }
}

/**
 * Focus the first sidebar link, or the currently active page link
 */
function focusSidebar() {
  const links = getSidebarLinks();
  if (links.length === 0) return;

  // Try to focus the currently active page link first
  const activeLink = links.find((link) => link.classList.contains("bg-muted"));
  if (activeLink) {
    activeLink.focus();
  } else {
    links[0].focus();
  }
}

/**
 * Handles global keyboard shortcuts that work across all pages.
 * - M: Toggle sidebar menu (focuses sidebar when opening)
 * - C: Toggle chat panel
 * - Left/Right arrows: Navigate between sidebar links when sidebar is focused
 */
export function GlobalKeyboardHandler() {
  const { toggleSidebar, state } = useSidebar();
  const { toggle: toggleAssistant } = useAssistant();

  const handleMenuToggle = useCallback(() => {
    const wasCollapsed = state === "collapsed";
    toggleSidebar();

    // If we're expanding the sidebar, focus it after a brief delay
    if (wasCollapsed) {
      setTimeout(() => {
        focusSidebar();
      }, 50);
    }
  }, [toggleSidebar, state]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const key = e.key.toLowerCase();

      // Check if we're in the sidebar (for arrow navigation)
      const isInSidebar = target.hasAttribute("data-sidebar-nav");

      // Handle left/right arrow navigation within sidebar
      if (isInSidebar && (key === "arrowleft" || key === "arrowright")) {
        e.preventDefault();
        const links = getSidebarLinks();
        const currentIndex = getCurrentLinkIndex(links);

        if (key === "arrowleft" && currentIndex > 0) {
          focusSidebarLink(currentIndex - 1);
        } else if (key === "arrowright" && currentIndex < links.length - 1) {
          focusSidebarLink(currentIndex + 1);
        }
        return;
      }

      // Ignore other shortcuts if user is typing in an input field
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // M: Toggle sidebar menu
      if (key === "m" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        handleMenuToggle();
      }

      // C: Toggle chat panel
      if (key === "c" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        toggleAssistant();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleMenuToggle, toggleAssistant]);

  return null;
}
