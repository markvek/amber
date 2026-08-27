import { Bot, ArrowUp, Mic } from "lucide-react";

export function ChatExample() {
  return (
    <div className="flex flex-col overflow-hidden bg-card max-w-md rounded-xl ring-1 ring-foreground/10">
      <div className="flex items-center gap-2.5 border-b px-4 py-3">
        <div className="flex size-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
          <Bot className="size-4" />
        </div>
        <div className="flex-1">
          <p className="text-sm leading-none font-semibold">Assistant</p>
          <p className="mt-1 text-xs text-muted-foreground">Online</p>
        </div>
      </div>

      {/* Static cosmetic chat area */}
      <div className="flex flex-col overflow-hidden flex-1">
        <div className="space-y-3 px-4 py-5 flex-1">
          {/* Sample messages for visual demo */}
          <div className="flex justify-end">
            <p className="max-w-[75%] rounded-2xl bg-accent px-3.5 py-2 text-sm text-accent-foreground">
              What&apos;s the status of machine 12?
            </p>
          </div>
          <div className="flex justify-start">
            <p className="max-w-[75%] rounded-2xl bg-muted px-3.5 py-2 text-sm">
              Machine 12 is currently running at 94% efficiency with no alerts.
            </p>
          </div>
        </div>

        {/* Cosmetic input area - non-interactive */}
        <div className="border-t p-3">
          <div className="flex items-center gap-1 rounded-xl border bg-background py-1 pr-1 pl-3 opacity-60">
            <span className="min-w-0 flex-1 text-sm text-muted-foreground">
              Message the assistant…
            </span>
            <div className="flex size-7 items-center justify-center rounded-lg text-muted-foreground">
              <Mic className="size-4" />
            </div>
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/50 text-primary-foreground">
              <ArrowUp className="size-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
