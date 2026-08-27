'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  MapIcon,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getRoomByName, type Room } from '@/data/rooms';
import { getRoomIconComponent } from '@/components/RoomSelector';

// Meeting data structure
export interface Meeting {
  id: string;
  title: string;
  startTime: string; // HH:MM format
  endTime: string;
  attendees: string[];
}

export interface RoomPageProps {
  /** The room to display */
  room: Room;
  /** Previous meeting (just ended or earlier) */
  previousMeeting?: Meeting;
  /** Next meeting (upcoming) */
  nextMeeting?: Meeting;
  /** Current time for display (optional, defaults to now) */
  currentTime?: Date;
  /** Callback when the book button is clicked */
  onBookRoom?: () => void;
  /** Callback when view schedule is clicked */
  onViewSchedule?: () => void;
  /** Additional class names */
  className?: string;
}

/**
 * Format time string (HH:MM) to display format
 */
function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Meeting display card component
 */
function MeetingDisplay({
  meeting,
  label,
  variant,
}: {
  meeting?: Meeting;
  label: string;
  variant: 'previous' | 'next';
}) {
  if (!meeting) {
    return (
      <div className="flex-1 rounded-lg border border-dashed bg-muted/30 p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
          {label}
        </p>
        <p className="text-sm text-muted-foreground">No meetings</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex-1 rounded-lg border p-4',
        variant === 'previous'
          ? 'bg-muted/30 border-muted-foreground/20'
          : 'bg-violet-500/10 border-violet-500/30'
      )}
    >
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
        {label}
      </p>
      <p
        className={cn(
          'text-sm font-medium truncate',
          variant === 'next' ? 'text-violet-700 dark:text-violet-400' : ''
        )}
      >
        {meeting.title}
      </p>
      <div className="flex items-center gap-1 mt-1.5">
        <Clock className="size-3 text-muted-foreground flex-shrink-0" />
        <span className="text-xs text-muted-foreground">
          {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
        </span>
      </div>
      <div className="flex items-center gap-1 mt-1">
        <Users className="size-3 text-muted-foreground flex-shrink-0" />
        <span className="text-xs text-muted-foreground truncate">
          {meeting.attendees.length === 1
            ? meeting.attendees[0]
            : meeting.attendees.length <= 3
              ? meeting.attendees.join(', ')
              : `${meeting.attendees.slice(0, 2).join(', ')} +${meeting.attendees.length - 2} more`}
        </span>
      </div>
    </div>
  );
}

/**
 * Photo carousel with map placeholder
 */
function PhotoCarousel({ image, floorplan, roomName }: { image?: string; floorplan?: string; roomName: string }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { type: 'photo' as const, label: 'Room Photo' },
    { type: 'map' as const, label: 'Floor Map' },
  ];

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative">
      {/* Carousel container */}
      <div className="relative aspect-video rounded-lg bg-muted overflow-hidden">
        {/* Slides */}
        <div
          className="flex transition-transform duration-300 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full h-full flex flex-col items-center justify-center gap-3 text-muted-foreground relative"
            >
              {slide.type === 'photo' ? (
                image ? (
                  <Image
                    src={image}
                    alt={`${roomName} room`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                ) : (
                  <>
                    <ImageIcon className="size-12" />
                    <span className="text-sm">{slide.label}</span>
                  </>
                )
              ) : floorplan ? (
                <Image
                  src={floorplan}
                  alt={`${roomName} floor plan`}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              ) : (
                <>
                  <MapIcon className="size-12" />
                  <span className="text-sm">{slide.label}</span>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center gap-2 mt-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              'size-2 rounded-full transition-colors',
              index === currentSlide
                ? 'bg-foreground'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * A room detail page component for displaying room information.
 * Shows room header, previous/next meetings, photo carousel, and action buttons.
 *
 * @example
 * ```tsx
 * <RoomPage
 *   room={roomData}
 *   previousMeeting={{
 *     id: '1',
 *     title: 'Team Standup',
 *     startTime: '09:00',
 *     endTime: '09:30',
 *     attendees: ['Alice', 'Bob', 'Charlie'],
 *   }}
 *   nextMeeting={{
 *     id: '2',
 *     title: 'Client Demo',
 *     startTime: '14:00',
 *     endTime: '15:00',
 *     attendees: ['Alice', 'Client A'],
 *   }}
 *   onBookRoom={() => console.log('Book room')}
 * />
 * ```
 */
export function RoomPage({
  room,
  previousMeeting,
  nextMeeting,
  currentTime = new Date(),
  onBookRoom,
  onViewSchedule,
  className,
}: RoomPageProps) {
  const Icon = getRoomIconComponent(room.icon);

  return (
    <Card className={cn('max-w-md', className)}>
      <CardHeader className="pb-4">
        {/* Room header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-12 items-center justify-center rounded-lg bg-violet-500/15">
              <Icon className="size-6 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-lg truncate">{room.name}</CardTitle>
              {room.floor && (
                <p className="text-xs text-muted-foreground">
                  Floor {room.floor}
                  {room.office && ` • ${room.office}`}
                </p>
              )}
            </div>
          </div>
          {room.capacity && (
            <Badge variant="outline" className="flex-shrink-0">
              <Users className="size-3 mr-1" />
              {room.capacity}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current time indicator */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="size-3" />
          <span>
            {currentTime.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })}
          </span>
        </div>

        {/* Previous/Next meetings */}
        <div className="flex gap-3">
          <MeetingDisplay
            meeting={previousMeeting}
            label="Previous"
            variant="previous"
          />
          <MeetingDisplay meeting={nextMeeting} label="Next" variant="next" />
        </div>

        {/* Photo carousel with map */}
        <PhotoCarousel image={room.image} floorplan={room.floorplan} roomName={room.name} />

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button onClick={onBookRoom} className="flex-1">
            <CalendarIcon className="size-4 mr-2" />
            Book this room
          </Button>
          <Button variant="outline" onClick={onViewSchedule}>
            View schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Helper function to create a RoomPage with a room name lookup
 */
export function RoomPageByName({
  roomName,
  ...props
}: Omit<RoomPageProps, 'room'> & { roomName: string }) {
  const room = getRoomByName(roomName);

  if (!room) {
    return (
      <Card className={cn('max-w-md', props.className)}>
        <CardContent className="py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Room "{roomName}" not found
          </p>
        </CardContent>
      </Card>
    );
  }

  return <RoomPage room={room} {...props} />;
}
