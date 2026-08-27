import type { Metadata } from "next";

import { KeyboardNavigablePage } from "@/components/KeyboardNavigablePage";
import { PageEditButton } from "@/components/workspace/page-edit-button";
import { ScaffoldBuilder } from "@/components/scaffold/scaffold-builder";

export const metadata: Metadata = {
  title: "Page Scaffolding",
};

export default function ScaffoldingPage() {
  return (
    <KeyboardNavigablePage>
      <div className="mx-auto w-full max-w-4xl flex-1 space-y-8 px-6 py-16">
        <header className="space-y-2">
          <p className="text-xs text-muted-foreground">Design System / scaffolding</p>
          <div className="flex items-start gap-4">
            <h1 className="min-w-0 flex-1 text-3xl font-semibold tracking-tight">Page Scaffolding</h1>
            <PageEditButton />
          </div>
          <p className="text-muted-foreground">
            Lay out a page from full-width and half-width boxes, then click the + in any box
            to choose what it holds.
          </p>
        </header>
        <section data-keyboard-nav-section>
          <ScaffoldBuilder />
        </section>
      </div>
    </KeyboardNavigablePage>
  );
}
