'use client';

import { MapPin, Users, Briefcase, type LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getRoomByName, ROOM_NAMES } from '@/data/rooms';
import { getRoomIconComponent } from '@/components/RoomSelector';

// Re-export ROOM_NAMES for backwards compatibility
export { ROOM_NAMES };

/**
 * Room icon component that renders the appropriate icon based on room name.
 * Uses the rooms.json data as the source of truth.
 */
function RoomIcon({ room, className }: { room: string; className?: string }) {
  const roomData = getRoomByName(room);
  const iconProps: LucideProps = { className };

  if (roomData) {
    const Icon = getRoomIconComponent(roomData.icon);
    return <Icon {...iconProps} />;
  }

  return <MapPin {...iconProps} />;
}

export interface MeetingCardProps {
  /** The meeting title to display */
  title: string;
  /** The meeting room name */
  room: string;
  /** Number of attendees */
  attendeeCount: number;
  /** Whether this is a client meeting */
  isClientMeeting: boolean;
  /** Height in pixels - represents meeting duration */
  height: number;
  /** Top position in pixels - for absolute positioning in calendar grid */
  top?: number;
  /** Optional click handler */
  onClick?: () => void;
  /** Additional class names */
  className?: string;
}

/**
 * A meeting card component for calendar views.
 * Displays meeting details with dynamic height based on duration.
 *
 * @example
 * ```tsx
 * <MeetingCard
 *   title="Olivia x Riley"
 *   room="Bao"
 *   attendeeCount={4}
 *   isClientMeeting={true}
 *   height={60}
 *   top={240}
 * />
 * ```
 */
export function MeetingCard({
  title,
  room,
  attendeeCount,
  isClientMeeting,
  height,
  top,
  onClick,
  className,
}: MeetingCardProps) {
  const minHeight = 24;
  const effectiveHeight = Math.max(height, minHeight);

  // Determine what details to show based on available height
  const showRoomDetails = effectiveHeight >= 48;
  const showAttendees = effectiveHeight >= 64;
  const showClientIndicator = effectiveHeight >= 80;

  return (
    <button
      onClick={onClick}
      className={cn(
        'absolute left-1 right-1 rounded-md border-l-4 px-2 py-1 text-left transition-colors hover:opacity-80',
        'bg-violet-500/15 border-l-violet-500',
        className
      )}
      style={{
        top: top !== undefined ? `${top}px` : undefined,
        height: `${effectiveHeight}px`,
        minHeight: `${minHeight}px`,
      }}
    >
      {/* Meeting Title - Always shown */}
      <p className="text-xs font-medium truncate text-violet-700 dark:text-violet-400">
        {title}
      </p>

      {/* Room with Icon - Show if height allows */}
      {showRoomDetails && (
        <div className="flex items-center gap-1 mt-0.5">
          <RoomIcon
            room={room}
            className="size-3 text-violet-600/70 dark:text-violet-400/70 flex-shrink-0"
          />
          <span className="text-[10px] text-muted-foreground truncate">
            {room}
          </span>
        </div>
      )}

      {/* Attendees - Show if height allows */}
      {showAttendees && (
        <div className="flex items-center gap-1 mt-0.5">
          <Users className="size-3 text-violet-600/70 dark:text-violet-400/70 flex-shrink-0" />
          <span className="text-[10px] text-muted-foreground">
            {attendeeCount} {attendeeCount === 1 ? 'attendee' : 'attendees'}
          </span>
        </div>
      )}

      {/* Client Indicator - Show if height allows */}
      {showClientIndicator && (
        <div className="flex items-center gap-1 mt-0.5">
          <Briefcase className="size-3 text-violet-600/70 dark:text-violet-400/70 flex-shrink-0" />
          <span className="text-[10px] text-muted-foreground">
            {isClientMeeting ? 'Client meeting' : 'Internal'}
          </span>
        </div>
      )}
    </button>
  );
}

/**
 * Compact variant that only shows title and room icon inline.
 * Useful for tight calendar grid layouts.
 */
export function MeetingCardCompact({
  title,
  room,
  height,
  top,
  onClick,
  className,
}: Omit<MeetingCardProps, 'attendeeCount' | 'isClientMeeting'>) {
  const minHeight = 24;
  const effectiveHeight = Math.max(height, minHeight);

  return (
    <button
      onClick={onClick}
      className={cn(
        'absolute left-1 right-1 rounded-md border-l-4 px-2 py-1 text-left transition-colors hover:opacity-80',
        'bg-violet-500/15 border-l-violet-500',
        className
      )}
      style={{
        top: top !== undefined ? `${top}px` : undefined,
        height: `${effectiveHeight}px`,
        minHeight: `${minHeight}px`,
      }}
    >
      <div className="flex items-center gap-1.5">
        <RoomIcon
          room={room}
          className="size-3 text-violet-600/70 dark:text-violet-400/70 flex-shrink-0"
        />
        <p className="text-xs font-medium truncate text-violet-700 dark:text-violet-400">
          {title}
        </p>
      </div>
    </button>
  );
}

// Re-export the RoomIcon component for external use
export { RoomIcon };
