"use client";

import { useState } from "react";
import { Check, ChevronDown, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const LOCATIONS = [
  "Floor A — Machine 12",
  "Floor A — Machine 07",
  "Floor B — Bay 1",
  "Storage — Rack 12",
  "In transit",
];

export function MoldLocation({ initial }: { initial: string }) {
  const [location, setLocation] = useState(initial);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Update mold location">
          <MapPin data-icon="inline-start" className="text-muted-foreground" />
          {location}
          <ChevronDown data-icon="inline-end" className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {LOCATIONS.map((loc) => (
          <DropdownMenuItem key={loc} onSelect={() => setLocation(loc)}>
            <Check
              className={cn("size-3.5", loc === location ? "opacity-100" : "opacity-0")}
            />
            {loc}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
