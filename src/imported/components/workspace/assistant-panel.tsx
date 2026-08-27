"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Bot, PanelRightClose, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Chat } from "@/components/chat/chat-parts";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const STORAGE_KEY = "assistant.collapsed";

// Context for assistant panel state
type AssistantContextProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  toggle: () => void;
  setMobileOpen: (open: boolean) => void;
};

const AssistantContext = createContext<AssistantContextProps | null>(null);

export function useAssistant() {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error("useAssistant must be used within an AssistantProvider.");
  }
  return context;
}

export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Hydration-safe: the persisted choice is only available after mount.
    setCollapsed(window.localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  const toggle = useCallback(() => {
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => {
        window.localStorage.setItem(STORAGE_KEY, String(!prev));
        return !prev;
      });
    }
  }, [isMobile]);

  const contextValue = useMemo<AssistantContextProps>(
    () => ({ collapsed, mobileOpen, toggle, setMobileOpen }),
    [collapsed, mobileOpen, toggle]
  );

  return (
    <AssistantContext.Provider value={contextValue}>
      {children}
    </AssistantContext.Provider>
  );
}

export function AssistantPanel() {
  const { collapsed, mobileOpen, toggle, setMobileOpen } = useAssistant();

  return (
    <>
      {/* Mobile: Floating button + Sheet overlay */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open assistant"
        className="fixed right-4 bottom-4 z-40 flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg outline-none hover:opacity-90 focus-visible:ring-1 focus-visible:ring-ring/50 md:hidden"
      >
        <Bot className="size-6" />
      </button>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="flex h-[85svh] flex-col rounded-t-2xl p-0"
        >
          <SheetHeader className="flex-row items-center gap-2.5 border-b px-4 py-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Bot className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-sm leading-none font-semibold">
                Assistant
              </SheetTitle>
              <p className="mt-1 text-xs text-muted-foreground">Online</p>
            </div>
            <SheetClose asChild>
              <Button size="icon-sm" variant="ghost" aria-label="Close assistant">
                <X />
              </Button>
            </SheetClose>
          </SheetHeader>
          <Chat className="min-h-0 flex-1" />
        </SheetContent>
      </Sheet>

      {/* Desktop: Side panel */}
      <aside
        className={cn(
          "sticky top-0 hidden h-svh shrink-0 flex-col self-start border-l bg-card md:flex",
          collapsed ? "w-12" : "w-80"
        )}
        aria-label="Assistant panel"
      >
        {collapsed ? (
          <div className="flex flex-col items-center py-3">
            <button
              type="button"
              onClick={toggle}
              aria-label="Open assistant"
              className="flex size-8 items-center justify-center rounded-full bg-accent text-accent-foreground outline-none hover:opacity-90 focus-visible:ring-1 focus-visible:ring-ring/50"
            >
              <Bot className="size-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2.5 border-b px-4 py-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Bot className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-none font-semibold">Assistant</p>
                <p className="mt-1 text-xs text-muted-foreground">Online</p>
              </div>
              <Button
                size="icon-sm"
                variant="ghost"
                aria-label="Collapse assistant"
                onClick={toggle}
              >
                <PanelRightClose />
              </Button>
            </div>
            <Chat className="min-h-0 flex-1" />
          </>
        )}
      </aside>
    </>
  );
}
