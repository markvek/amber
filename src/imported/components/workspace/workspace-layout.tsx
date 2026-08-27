"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/workspace/app-sidebar";
import { AssistantPanel, AssistantProvider } from "@/components/workspace/assistant-panel";
import { KeyboardConnector } from "@/components/workspace/keyboard-connector";
import { WorkspaceProvider } from "@/components/workspace/workspace-store";
import { KeyboardManagerProvider } from "@/hooks/useKeyboardManager";

export function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <KeyboardManagerProvider>
      <WorkspaceProvider>
        <TooltipProvider>
          <SidebarProvider>
            <AssistantProvider>
              <KeyboardConnector />
              <AppSidebar />
              <SidebarInset className="h-svh">
                <div className="flex min-h-0 flex-1">
                  <div className="min-h-0 min-w-0 flex-1 overflow-y-auto">{children}</div>
                  <AssistantPanel />
                </div>
              </SidebarInset>
            </AssistantProvider>
          </SidebarProvider>
        </TooltipProvider>
      </WorkspaceProvider>
    </KeyboardManagerProvider>
  );
}
