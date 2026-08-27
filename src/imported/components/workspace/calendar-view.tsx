'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { MeetingCard } from '@/components/workspace/meeting-card';

// Types
export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time?: string; // Start time in HH:MM format
  endTime?: string; // End time in HH:MM format
  duration?: number; // Duration in minutes (alternative to endTime)
  description?: string;
  type?: 'production' | 'maintenance' | 'meeting' | 'deadline';
  room?: string; // Room/location for the event
  attendeeCount?: number; // Number of attendees
  isClientMeeting?: boolean; // Whether this is a client meeting
}

export interface CalendarViewProps {
  events?: CalendarEvent[];
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onEventsChange?: (events: CalendarEvent[]) => void;
  view?: 'day' | 'week';
  startHour?: number; // Default 6 (6 AM)
  endHour?: number; // Default 18 (6 PM)
  rooms?: string[]; // Available rooms for filtering
  showRoomFilter?: boolean; // Show the room filter section
}

// Constants
const HOUR_HEIGHT = 60; // pixels per hour
const START_HOUR_DEFAULT = 6;
const END_HOUR_DEFAULT = 18;

// Utility functions
function getWeekDays(date: Date): Date[] {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1);
  start.setDate(diff);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatHour(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
}

function parseTime(time: string): { hours: number; minutes: number } {
  const [hours, minutes] = time.split(':').map(Number);
  return { hours, minutes };
}

function timeToMinutes(time: string): number {
  const { hours, minutes } = parseTime(time);
  return hours * 60 + minutes;
}

function getEventDuration(event: CalendarEvent): number {
  if (event.duration) return event.duration;
  if (event.endTime && event.time) {
    return timeToMinutes(event.endTime) - timeToMinutes(event.time);
  }
  return 60; // Default 1 hour
}

const EVENT_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  production: {
    bg: 'bg-chart-1/15',
    border: 'border-l-chart-1',
    text: 'text-chart-1',
  },
  maintenance: {
    bg: 'bg-chart-3/15',
    border: 'border-l-chart-3',
    text: 'text-chart-3',
  },
  meeting: {
    bg: 'bg-violet-500/15',
    border: 'border-l-violet-500',
    text: 'text-violet-700 dark:text-violet-400',
  },
  deadline: {
    bg: 'bg-destructive/15',
    border: 'border-l-destructive',
    text: 'text-destructive',
  },
  default: {
    bg: 'bg-blue-500/15',
    border: 'border-l-blue-500',
    text: 'text-blue-700 dark:text-blue-400',
  },
};

// Current Time Indicator
function CurrentTimeIndicator({ startHour }: { startHour: number }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  const startMinutes = startHour * 60;
  const top = ((totalMinutes - startMinutes) / 60) * HOUR_HEIGHT;

  const timeLabel = currentTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div
      className="absolute left-0 right-0 z-20 flex items-center pointer-events-none"
      style={{ top: `${top}px` }}
    >
      <span className="text-[10px] font-medium text-destructive pr-1 -ml-1">
        {timeLabel}
      </span>
      <div className="size-2 rounded-full bg-destructive -ml-1" />
      <div className="flex-1 h-px bg-destructive" />
    </div>
  );
}

// Time Grid (shared between day and week views)
function TimeGrid({
  startHour,
  endHour,
  children,
  showCurrentTime = true,
}: {
  startHour: number;
  endHour: number;
  children: React.ReactNode;
  showCurrentTime?: boolean;
}) {
  const hours = Array.from(
    { length: endHour - startHour + 1 },
    (_, i) => startHour + i
  );

  const now = new Date();
  const currentHour = now.getHours();
  const isCurrentTimeVisible = currentHour >= startHour && currentHour <= endHour;

  return (
    <div className="relative flex">
      {/* Time labels column */}
      <div className="w-12 flex-shrink-0 pr-2">
        {hours.map((hour) => (
          <div
            key={hour}
            className="relative"
            style={{ height: `${HOUR_HEIGHT}px` }}
          >
            <span className="absolute -top-2 right-2 text-xs text-muted-foreground">
              {formatHour(hour)}
            </span>
          </div>
        ))}
      </div>

      {/* Grid area */}
      <div className="relative flex-1 border-l border-border">
        {/* Hour lines */}
        {hours.map((hour) => (
          <div
            key={hour}
            className="border-t border-border"
            style={{ height: `${HOUR_HEIGHT}px` }}
          />
        ))}

        {/* Current time indicator */}
        {showCurrentTime && isCurrentTimeVisible && (
          <CurrentTimeIndicator startHour={startHour} />
        )}

        {/* Content (events) */}
        {children}
      </div>
    </div>
  );
}

// Event Block Component
function EventBlock({
  event,
  startHour,
  onClick,
  compact = false,
}: {
  event: CalendarEvent;
  startHour: number;
  onClick?: (event: CalendarEvent) => void;
  compact?: boolean;
}) {
  if (!event.time) return null;

  const { hours, minutes } = parseTime(event.time);
  const startMinutes = startHour * 60;
  const eventStartMinutes = hours * 60 + minutes;
  const duration = getEventDuration(event);

  const top = ((eventStartMinutes - startMinutes) / 60) * HOUR_HEIGHT;
  const height = (duration / 60) * HOUR_HEIGHT;

  // Use MeetingCard for meeting-type events
  if (event.type === 'meeting') {
    return (
      <MeetingCard
        title={event.title}
        room={event.room || 'No room'}
        attendeeCount={event.attendeeCount ?? 1}
        isClientMeeting={event.isClientMeeting ?? false}
        height={Math.max(height, 24)}
        top={top}
        onClick={() => onClick?.(event)}
      />
    );
  }

  // Use default styling for other event types (production, maintenance, deadline)
  const colors = EVENT_COLORS[event.type || 'default'];
  const timeLabel = event.time
    ? new Date(`2000-01-01T${event.time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    : '';

  return (
    <button
      onClick={() => onClick?.(event)}
      className={cn(
        'absolute left-1 right-1 rounded-md border-l-4 px-2 py-1 text-left transition-colors hover:opacity-80',
        colors.bg,
        colors.border
      )}
      style={{
        top: `${top}px`,
        height: `${Math.max(height, 24)}px`,
        minHeight: '24px',
      }}
    >
      <p className={cn('text-xs font-medium truncate', colors.text)}>
        {event.title}
      </p>
      {!compact && height >= 40 && (
        <p className="text-[10px] text-muted-foreground truncate">{timeLabel}</p>
      )}
    </button>
  );
}

// Single Day Time View
function DayTimeView({
  date,
  events,
  startHour,
  endHour,
  onEventClick,
}: {
  date: Date;
  events: CalendarEvent[];
  startHour: number;
  endHour: number;
  onEventClick?: (event: CalendarEvent) => void;
}) {
  const dayEvents = events.filter((e) => isSameDay(e.date, date) && e.time);
  const isToday = isSameDay(date, new Date());

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 pb-2">
        <span
          className={cn(
            'flex size-8 items-center justify-center rounded-full text-sm font-semibold',
            isToday && 'bg-primary text-primary-foreground'
          )}
        >
          {date.getDate()}
        </span>
        <span className="text-sm text-muted-foreground">
          {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long' })}
        </span>
      </div>

      <TimeGrid startHour={startHour} endHour={endHour} showCurrentTime={isToday}>
        <div className="absolute inset-0">
          {dayEvents.map((event) => (
            <EventBlock
              key={event.id}
              event={event}
              startHour={startHour}
              onClick={onEventClick}
            />
          ))}
        </div>
      </TimeGrid>
    </div>
  );
}

// Week Time View
function WeekTimeView({
  weekDays,
  events,
  startHour,
  endHour,
  selectedDate,
  onDateSelect,
  onEventClick,
}: {
  weekDays: Date[];
  events: CalendarEvent[];
  startHour: number;
  endHour: number;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
}) {
  const today = new Date();
  const hours = Array.from(
    { length: endHour - startHour + 1 },
    (_, i) => startHour + i
  );

  const currentHour = today.getHours();
  const currentMinutes = today.getMinutes();
  const isCurrentTimeVisible = currentHour >= startHour && currentHour <= endHour;
  const currentTimeTop =
    ((currentHour * 60 + currentMinutes - startHour * 60) / 60) * HOUR_HEIGHT;

  return (
    <div className="space-y-2">
      {/* Day headers */}
      <div className="flex">
        <div className="w-12 flex-shrink-0" />
        <div className="flex-1 grid grid-cols-7 gap-px">
          {weekDays.map((day) => {
            const isToday = isSameDay(day, today);
            const isSelected = isSameDay(day, selectedDate);

            return (
              <button
                key={day.toISOString()}
                onClick={() => onDateSelect(day)}
                className={cn(
                  'flex flex-col items-center py-2 rounded-t-lg transition-colors',
                  'hover:bg-muted',
                  isSelected && 'bg-muted'
                )}
              >
                <span className="text-[10px] font-medium uppercase text-muted-foreground">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span
                  className={cn(
                    'mt-1 flex size-7 items-center justify-center rounded-full text-sm font-semibold',
                    isToday && 'bg-primary text-primary-foreground'
                  )}
                >
                  {day.getDate()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time grid with events */}
      <div className="relative flex overflow-hidden">
        {/* Time labels */}
        <div className="w-12 flex-shrink-0 pr-2">
          {hours.map((hour) => (
            <div
              key={hour}
              className="relative"
              style={{ height: `${HOUR_HEIGHT}px` }}
            >
              <span className="absolute -top-2 right-2 text-xs text-muted-foreground">
                {formatHour(hour)}
              </span>
            </div>
          ))}
        </div>

        {/* Day columns */}
        <div className="flex-1 grid grid-cols-7 gap-px relative">
          {weekDays.map((day) => {
            const dayEvents = events.filter(
              (e) => isSameDay(e.date, day) && e.time
            );
            const isToday = isSameDay(day, today);

            return (
              <div key={day.toISOString()} className="relative border-l border-border">
                {/* Hour lines */}
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="border-t border-border"
                    style={{ height: `${HOUR_HEIGHT}px` }}
                  />
                ))}

                {/* Events */}
                {dayEvents.map((event) => (
                  <EventBlock
                    key={event.id}
                    event={event}
                    startHour={startHour}
                    onClick={onEventClick}
                    compact
                  />
                ))}

                {/* Current time indicator for today */}
                {isToday && isCurrentTimeVisible && (
                  <div
                    className="absolute left-0 right-0 z-20 pointer-events-none"
                    style={{ top: `${currentTimeTop}px` }}
                  >
                    <div className="flex items-center">
                      <div className="size-2 rounded-full bg-destructive -ml-1" />
                      <div className="flex-1 h-px bg-destructive" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Main Calendar View Component
export function CalendarView({
  events = [],
  selectedDate: controlledSelectedDate,
  onDateSelect,
  onEventClick,
  onEventsChange,
  view: initialView = 'week',
  startHour = START_HOUR_DEFAULT,
  endHour = END_HOUR_DEFAULT,
  rooms = [],
  showRoomFilter = false,
}: CalendarViewProps) {
  const [internalSelectedDate, setInternalSelectedDate] = useState(new Date());
  const [internalEvents, setInternalEvents] = useState(events);
  const [view, setView] = useState<'day' | 'week'>(initialView);
  const [roomFilter, setRoomFilter] = useState('');

  // Force day view on mobile
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 640 && view === 'week') {
        setView('day');
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [view]);

  const selectedDate = controlledSelectedDate ?? internalSelectedDate;
  const handleDateSelect = (date: Date) => {
    if (onDateSelect) {
      onDateSelect(date);
    } else {
      setInternalSelectedDate(date);
    }
  };

  const allEvents = onEventsChange ? events : internalEvents;

  // Filter events by room
  const currentEvents = useMemo(() => {
    if (!roomFilter.trim()) return allEvents;
    const filter = roomFilter.toLowerCase();
    return allEvents.filter(
      (event) => event.room?.toLowerCase().includes(filter)
    );
  }, [allEvents, roomFilter]);
  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate]);

  const handlePrevPeriod = () => {
    const prev = new Date(selectedDate);
    if (view === 'day') {
      prev.setDate(prev.getDate() - 1);
    } else {
      prev.setDate(prev.getDate() - 7);
    }
    handleDateSelect(prev);
  };

  const handleNextPeriod = () => {
    const next = new Date(selectedDate);
    if (view === 'day') {
      next.setDate(next.getDate() + 1);
    } else {
      next.setDate(next.getDate() + 7);
    }
    handleDateSelect(next);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Calendar</CardTitle>
          <div className="flex items-center gap-2">
            {/* View toggle - Week hidden on mobile */}
            <div className="flex rounded-lg border border-border p-0.5">
              <Button
                variant={view === 'day' ? 'secondary' : 'ghost'}
                size="xs"
                onClick={() => setView('day')}
              >
                Day
              </Button>
              <Button
                variant={view === 'week' ? 'secondary' : 'ghost'}
                size="xs"
                onClick={() => setView('week')}
                className="hidden sm:inline-flex"
              >
                Week
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handlePrevPeriod}
                aria-label={view === 'day' ? 'Previous day' : 'Previous week'}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleNextPeriod}
                aria-label={view === 'day' ? 'Next day' : 'Next week'}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>

            {/* Add event button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    asChild
                  >
                    <Link href="/calendar/new">
                      <Plus className="size-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Create a new meeting</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>

      {/* Room filter section */}
      {showRoomFilter && (
        <div className="border-t px-6 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search rooms..."
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      )}

      <CardContent className="space-y-6">
        {view === 'day' && (
          <DayTimeView
            date={selectedDate}
            events={currentEvents}
            startHour={startHour}
            endHour={endHour}
            onEventClick={onEventClick}
          />
        )}

        {view === 'week' && (
          <WeekTimeView
            weekDays={weekDays}
            events={currentEvents}
            startHour={startHour}
            endHour={endHour}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onEventClick={onEventClick}
          />
        )}
      </CardContent>
    </Card>
  );
}

