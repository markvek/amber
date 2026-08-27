"use client";

import { useState } from "react";
import { FileText, ImageIcon, Sparkles, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useSectionNavigation } from "@/hooks/useSectionNavigation";

type MediaMode = "none" | "image" | "attachment-box" | "attachment-zone";

const partList = [
  { key: "introIcon", label: "Intro icon" },
  { key: "title", label: "Title" },
  { key: "subtitle", label: "Subtitle" },
  { key: "primaryButton", label: "Button" },
  { key: "footnote", label: "Footnote" },
  { key: "secondaryButton", label: "Secondary button" },
] as const;

type PartKey = (typeof partList)[number]["key"];

const mediaOptions: { value: MediaMode; label: string }[] = [
  { value: "image", label: "Image" },
  { value: "attachment-box", label: "File attachment box" },
  { value: "attachment-zone", label: "File attachment zone" },
  { value: "none", label: "None" },
];

export function CardPlayground() {
  const [parts, setParts] = useState<Record<PartKey, boolean>>({
    introIcon: true,
    title: true,
    subtitle: true,
    primaryButton: true,
    footnote: true,
    secondaryButton: true,
  });
  const [media, setMedia] = useState<MediaMode>("image");
  const { focusNextSection, focusPreviousSection } = useSectionNavigation();

  const togglePart = (key: PartKey) =>
    setParts((prev) => ({ ...prev, [key]: !prev[key] }));

  const hasHeader = parts.introIcon || parts.title || parts.subtitle;
  const hasContent = media !== "none" || parts.footnote;
  const hasFooter = parts.primaryButton || parts.secondaryButton;
  const isEmpty = !hasHeader && !hasContent && !hasFooter;

  return (
    <div className="grid gap-8 lg:grid-cols-[15rem_1fr]">
      <div className="space-y-5">
        <fieldset className="space-y-3">
          <legend className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Parts
          </legend>
          {partList.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between gap-3">
              <Label htmlFor={`card-part-${key}`} className="font-normal">
                {label}
              </Label>
              <Switch
                id={`card-part-${key}`}
                checked={parts[key]}
                onCheckedChange={() => togglePart(key)}
              />
            </div>
          ))}
        </fieldset>

        <Separator />

        <fieldset className="space-y-3">
          <legend className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Media slot
          </legend>
          <RadioGroup
            value={media}
            onValueChange={(v) => setMedia(v as MediaMode)}
            onExitBottom={focusNextSection}
            onExitTop={focusPreviousSection}
          >
            {mediaOptions.map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <RadioGroupItem value={option.value} id={`card-media-${option.value}`} />
                <Label htmlFor={`card-media-${option.value}`} className="font-normal">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </fieldset>
      </div>

      <div className="flex items-start justify-center rounded-xl bg-muted/40 p-6 sm:p-10">
        {isEmpty ? (
          <p className="self-center text-sm text-muted-foreground">
            Everything is toggled off — flip a switch to rebuild the card.
          </p>
        ) : (
          <Card className="w-full max-w-sm">
            {hasHeader && (
              <CardHeader>
                {parts.introIcon && (
                  <div className="mb-1 flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Sparkles className="size-4" />
                  </div>
                )}
                {parts.title && <CardTitle>Q3 launch review</CardTitle>}
                {parts.subtitle && (
                  <CardDescription>
                    A working summary of where the release stands.
                  </CardDescription>
                )}
              </CardHeader>
            )}

            {hasContent && (
              <CardContent className="space-y-3">
                {media === "image" && (
                  <div className="flex aspect-video items-center justify-center rounded-lg bg-secondary text-secondary-foreground/50">
                    <ImageIcon className="size-8" />
                  </div>
                )}
                {media === "attachment-box" && (
                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <FileText className="size-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">launch-brief.pdf</p>
                      <p className="text-xs text-muted-foreground">1.2 MB · PDF</p>
                    </div>
                    <Button size="xs" variant="outline">
                      View
                    </Button>
                  </div>
                )}
                {media === "attachment-zone" && (
                  <div className="flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors hover:border-border-accent">
                    <UploadCloud className="size-6 text-muted-foreground" />
                    <p className="text-sm font-medium">Drop a file here</p>
                    <p className="text-xs text-muted-foreground">
                      or <span className="cursor-pointer text-accent underline underline-offset-2">browse</span> — up to 10 MB
                    </p>
                  </div>
                )}
                {parts.footnote && (
                  <p className="text-xs text-muted-foreground">
                    * Figures are provisional until the finance review closes.
                  </p>
                )}
              </CardContent>
            )}

            {hasFooter && (
              <CardFooter className="gap-2">
                {parts.primaryButton && <Button size="sm">Continue</Button>}
                {parts.secondaryButton && (
                  <Button size="sm" variant="outline">
                    Share
                  </Button>
                )}
              </CardFooter>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
