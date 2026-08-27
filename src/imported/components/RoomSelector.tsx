'use client';

import { useState } from 'react';
import {
  Leaf,
  Fish,
  Dog,
  Cat,
  Presentation,
  Briefcase,
  Coffee,
  Phone,
  Monitor,
  Video,
  Home,
  MapPin,
  ChevronDown,
  Check,
  type LucideIcon,
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { rooms, type Room } from '@/data/rooms';

const iconMap: Record<string, LucideIcon> = {
  Leaf,
  Fish,
  Dog,
  Cat,
  Presentation,
  Briefcase,
  Coffee,
  Phone,
  Monitor,
  Video,
  Home,
  MapPin,
};

function getRoomIconComponent(iconName: string): LucideIcon {
  return iconMap[iconName] ?? MapPin;
}

interface RoomSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  showCapacity?: boolean;
}

export function RoomSelector({
  value,
  onChange,
  placeholder = 'Select a room...',
  className,
  showCapacity = false,
}: RoomSelectorProps) {
  const [open, setOpen] = useState(false);

  const selectedRoom = rooms.find((room) => room.name === value);
  const SelectedIcon = selectedRoom ? getRoomIconComponent(selectedRoom.icon) : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'h-8 w-full justify-between px-2.5 text-sm font-normal',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <span className="flex items-center gap-2 truncate">
            {SelectedIcon && <SelectedIcon className="size-4 shrink-0" />}
            {value || placeholder}
          </span>
          <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-1" align="start">
        <div className="max-h-64 overflow-y-auto">
          {/* Physical Rooms */}
          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            Physical Rooms
          </div>
          {rooms
            .filter((room) => room.type === 'physical')
            .map((room) => {
              const Icon = getRoomIconComponent(room.icon);
              return (
                <button
                  key={room.id}
                  onClick={() => {
                    onChange(room.name);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent',
                    value === room.name && 'bg-accent'
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="flex-1 text-left">{room.name}</span>
                  {showCapacity && room.capacity && (
                    <span className="text-xs text-muted-foreground">{room.capacity} ppl</span>
                  )}
                  {value === room.name && <Check className="size-4 shrink-0" />}
                </button>
              );
            })}

          {/* Virtual Rooms */}
          <div className="mt-2 px-2 py-1.5 text-xs font-medium text-muted-foreground">
            Virtual
          </div>
          {rooms
            .filter((room) => room.type === 'virtual')
            .map((room) => {
              const Icon = getRoomIconComponent(room.icon);
              return (
                <button
                  key={room.id}
                  onClick={() => {
                    onChange(room.name);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent',
                    value === room.name && 'bg-accent'
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="flex-1 text-left">{room.name}</span>
                  {value === room.name && <Check className="size-4 shrink-0" />}
                </button>
              );
            })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { getRoomIconComponent, iconMap };
