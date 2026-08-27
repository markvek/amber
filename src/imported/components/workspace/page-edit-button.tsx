"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  FilePlus,
  FolderInput,
  LayoutGrid,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWorkspace, type TemplateType } from "@/components/workspace/workspace-store";

export function PageEditButton() {
  const pathname = usePathname();
  const router = useRouter();
  const { sections, addPageFromTemplate, deletePage, movePage, ready } = useWorkspace();

  if (!ready) return null;

  // Check if this is a workspace page (dynamic /p/[id] route)
  const isWorkspacePage = pathname.startsWith("/p/");
  const pageId = isWorkspacePage ? pathname.split("/")[2] : null;

  // Check if this is a template page that can be split
  const isTemplatePage = pathname.startsWith("/templates/");

  // Determine template type from pathname
  const getTemplateType = (): TemplateType | null => {
    if (pathname === "/templates/machine") return "machine";
    if (pathname === "/templates/customer") return "customer";
    if (pathname === "/templates/mold") return "mold";
    return null;
  };

  // Find current page info
  let currentPage: { id: string; title: string; sectionId: string } | null = null;
  for (const section of sections) {
    const page = section.pages.find(
      (p) => p.href === pathname || (isWorkspacePage && p.id === pageId)
    );
    if (page) {
      currentPage = { id: page.id, title: page.title, sectionId: section.id };
      break;
    }
  }

  // Handle split action for template pages
  const handleSplit = () => {
    const templateType = getTemplateType();
    if (!templateType) return;
    const newPage = addPageFromTemplate(templateType);
    router.push(newPage.href);
  };

  // Handle delete for workspace pages
  const handleDelete = () => {
    if (!pageId || !deletePage) return;
    deletePage(pageId);
    router.push("/");
  };

  // Handle move to different section
  const handleMove = (targetSectionId: string) => {
    if (!pageId || !movePage || !currentPage) return;
    movePage(pageId, targetSectionId);
  };

  if (isTemplatePage) {
    // Template pages get the Create New Page button
    return (
      <Button size="sm" variant="outline" onClick={handleSplit}>
        <FilePlus className="mr-1.5 size-4" />
        Create New Page
      </Button>
    );
  }

  if (isWorkspacePage) {
    // Workspace pages get the full edit menu
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline">
            <Pencil className="mr-1.5 size-4" />
            Edit
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Page actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <FolderInput className="mr-2 size-4" />
              Move to folder
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {sections.map((section) => (
                <DropdownMenuItem
                  key={section.id}
                  disabled={currentPage ? section.id === currentPage.sectionId : false}
                  onClick={() => handleMove(section.id)}
                >
                  {section.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuItem disabled>
            <LayoutGrid className="mr-2 size-4" />
            Edit layout
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 size-4" />
            Delete page
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Built-in pages (like machine-12, customer) - no edit button
  return null;
}
