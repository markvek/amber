import type { Metadata } from "next";
import { GlobalsPageContent } from "./globals-client";

export const metadata: Metadata = {
  title: "Globals — Design Reference",
};

export default function GlobalsPage() {
  return <GlobalsPageContent />;
}
