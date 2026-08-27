'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  Users,
  Clock,
  Calendar as CalendarIcon,
  Sparkles,
  CheckCircle2,
  Building2,
  Video,
  Coffee,
  Phone,
  Home,
  Presentation,
  Dog,
  Star,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

// Room data
export interface Room {
  id: string;
  name: string;
  capacity: number;
  type: 'conference' | 'huddle' | 'boardroom' | 'virtual' | 'lounge' | 'phone' | 'home';
  amenities: string[];
  floor?: string;
}

export interface TimeSlot {
  start: string; // HH:MM format
  end: string;
}

export interface RoomAvailability {
  room: Room;
  availableSlots: TimeSlot[];
}

// Sample rooms data
const SAMPLE_ROOMS: Room[] = [
  {
    id: '1',
    name: 'Conference A',
    capacity: 10,
    type: 'conference',
    amenities: ['Whiteboard', 'Video conferencing', 'Screen sharing'],
    floor: '2nd Floor',
  },
  {
    id: '2',
    name: 'Conference B',
    capacity: 8,
    type: 'conference',
    amenities: ['Whiteboard', 'Video conferencing'],
    floor: '2nd Floor',
  },
  {
    id: '3',
    name: 'Boardroom',
    capacity: 16,
    type: 'boardroom',
    amenities: ['Video conferencing', 'Screen sharing', 'Catering available'],
    floor: '3rd Floor',
  },
  {
    id: '4',
    name: 'Bao',
    capacity: 4,
    type: 'huddle',
    amenities: ['Whiteboard', 'Pet-friendly'],
    floor: '1st Floor',
  },
  {
    id: '5',
    name: 'Lounge',
    capacity: 6,
    type: 'lounge',
    amenities: ['Coffee machine', 'Comfortable seating'],
    floor: '1st Floor',
  },
  {
    id: '6',
    name: 'Virtual',
    capacity: 100,
    type: 'virtual',
    amenities: ['Zoom', 'Recording', 'Breakout rooms'],
  },
  {
    id: '7',
    name: 'Phone Booth',
    capacity: 1,
    type: 'phone',
    amenities: ['Soundproof', 'Standing desk'],
    floor: '1st Floor',
  },
  {
    id: '8',
    name: 'Home Office',
    capacity: 1,
    type: 'home',
    amenities: ['Remote work'],
  },
];

// Generate sample availability
function generateAvailability(rooms: Room[], date: Date): RoomAvailability[] {
  return rooms.map((room) => {
    // Simulate some booked slots
    const bookedSlots = Math.floor(Math.random() * 3);
    const allSlots: TimeSlot[] = [
      { start: '08:00', end: '09:00' },
      { start: '09:00', end: '10:00' },
      { start: '10:00', end: '11:00' },
      { start: '11:00', end: '12:00' },
      { start: '13:00', end: '14:00' },
      { start: '14:00', end: '15:00' },
      { start: '15:00', end: '16:00' },
      { start: '16:00', end: '17:00' },
      { start: '17:00', end: '18:00' },
    ];

    // Remove some random slots to simulate bookings
    const availableSlots = allSlots.filter(() => Math.random() > 0.3);

    return {
      room,
      availableSlots,
    };
  });
}

// Parse natural language query (simplified)
function parseNaturalLanguage(query: string): {
  capacity?: number;
  timePreference?: 'morning' | 'afternoon' | 'evening';
  roomType?: Room['type'];
  isClientMeeting?: boolean;
} {
  const result: ReturnType<typeof parseNaturalLanguage> = {};
  const lowerQuery = query.toLowerCase();

  // Extract capacity
  const peopleMatch = lowerQuery.match(/(\d+)\s*(people|person|attendees|guests)/);
  if (peopleMatch) {
    result.capacity = parseInt(peopleMatch[1]);
  }

  // Extract time preference
  if (lowerQuery.includes('morning')) {
    result.timePreference = 'morning';
  } else if (lowerQuery.includes('afternoon')) {
    result.timePreference = 'afternoon';
  } else if (lowerQuery.includes('evening')) {
    result.timePreference = 'evening';
  }

  // Extract room type
  if (lowerQuery.includes('conference')) {
    result.roomType = 'conference';
  } else if (lowerQuery.includes('boardroom') || lowerQuery.includes('board room')) {
    result.roomType = 'boardroom';
  } else if (lowerQuery.includes('huddle') || lowerQuery.includes('small')) {
    result.roomType = 'huddle';
  } else if (lowerQuery.includes('virtual') || lowerQuery.includes('remote') || lowerQuery.includes('zoom')) {
    result.roomType = 'virtual';
  } else if (lowerQuery.includes('lounge') || lowerQuery.includes('casual')) {
    result.roomType = 'lounge';
  } else if (lowerQuery.includes('phone') || lowerQuery.includes('call')) {
    result.roomType = 'phone';
  }

  // Check for client meeting
  if (lowerQuery.includes('client') || lowerQuery.includes('external') || lowerQuery.includes('customer')) {
    result.isClientMeeting = true;
  }

  return result;
}

// Room type icons
function RoomTypeIcon({ type }: { type: Room['type'] }) {
  const className = 'size-4';
  switch (type) {
    case 'conference':
      return <Presentation className={className} />;
    case 'boardroom':
      return <Building2 className={className} />;
    case 'huddle':
      return <Dog className={className} />;
    case 'virtual':
      return <Video className={className} />;
    case 'lounge':
      return <Coffee className={className} />;
    case 'phone':
      return <Phone className={className} />;
    case 'home':
      return <Home className={className} />;
    default:
      return <Building2 className={className} />;
  }
}

export interface RoomFinderProps {
  rooms?: Room[];
  onRoomSelect?: (room: Room, slot: TimeSlot) => void;
}

export function RoomFinder({ rooms = SAMPLE_ROOMS, onRoomSelect }: RoomFinderProps) {
  const [naturalQuery, setNaturalQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [capacity, setCapacity] = useState<number | ''>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [roomType, setRoomType] = useState<Room['type'] | ''>('');
  const [showResults, setShowResults] = useState(false);

  // Parse natural language when user types
  const parsedQuery = useMemo(() => {
    if (!naturalQuery.trim()) return null;
    return parseNaturalLanguage(naturalQuery);
  }, [naturalQuery]);

  // Get all room availability
  const allAvailability = useMemo(() => {
    const date = new Date(selectedDate);
    return generateAvailability(rooms, date);
  }, [rooms, selectedDate]);

  // Check if any filters are applied
  const hasFilters = useMemo(() => {
    const requiredCapacity = parsedQuery?.capacity || (capacity ? Number(capacity) : 0);
    const requiredType = parsedQuery?.roomType || roomType;
    const timePreference = parsedQuery?.timePreference;
    return requiredCapacity > 0 || requiredType || timePreference || selectedTime;
  }, [parsedQuery, capacity, roomType, selectedTime]);

  // Filter rooms based on criteria
  const filteredAvailability = useMemo(() => {
    // Apply capacity from natural language or filter
    const requiredCapacity = parsedQuery?.capacity || (capacity ? Number(capacity) : 0);
    const requiredType = parsedQuery?.roomType || roomType;
    const timePreference = parsedQuery?.timePreference;

    return allAvailability.filter(({ room, availableSlots }) => {
      // Filter by capacity
      if (requiredCapacity && room.capacity < requiredCapacity) {
        return false;
      }

      // Filter by room type
      if (requiredType && room.type !== requiredType) {
        return false;
      }

      // Filter by time preference
      if (timePreference) {
        const hasMatchingSlot = availableSlots.some((slot) => {
          const hour = parseInt(slot.start.split(':')[0]);
          if (timePreference === 'morning' && hour >= 8 && hour < 12) return true;
          if (timePreference === 'afternoon' && hour >= 12 && hour < 17) return true;
          if (timePreference === 'evening' && hour >= 17) return true;
          return false;
        });
        if (!hasMatchingSlot) return false;
      }

      // Filter by specific time
      if (selectedTime) {
        const hasSlot = availableSlots.some((slot) => slot.start === selectedTime);
        if (!hasSlot) return false;
      }

      return availableSlots.length > 0;
    });
  }, [allAvailability, capacity, roomType, selectedTime, parsedQuery]);

  // Get recommended room (best match - highest capacity match or first available)
  const recommendedRoom = useMemo(() => {
    if (filteredAvailability.length === 0) return null;

    const requiredCapacity = parsedQuery?.capacity || (capacity ? Number(capacity) : 0);

    // Sort by best capacity match (closest to required without going under)
    const sorted = [...filteredAvailability].sort((a, b) => {
      if (requiredCapacity > 0) {
        // Prefer rooms closer to required capacity
        const aDiff = a.room.capacity - requiredCapacity;
        const bDiff = b.room.capacity - requiredCapacity;
        return aDiff - bDiff;
      }
      // Default: prefer more available slots
      return b.availableSlots.length - a.availableSlots.length;
    });

    return sorted[0];
  }, [filteredAvailability, parsedQuery, capacity]);

  // Alternative rooms (matches criteria but not recommended)
  const alternativeRooms = useMemo(() => {
    if (!recommendedRoom) return filteredAvailability;
    return filteredAvailability.filter(({ room }) => room.id !== recommendedRoom.room.id);
  }, [filteredAvailability, recommendedRoom]);

  // Other available rooms (open but don't match filters)
  const otherAvailableRooms = useMemo(() => {
    if (!hasFilters) return [];

    const filteredIds = new Set(filteredAvailability.map(({ room }) => room.id));
    return allAvailability.filter(
      ({ room, availableSlots }) =>
        !filteredIds.has(room.id) && availableSlots.length > 0
    );
  }, [allAvailability, filteredAvailability, hasFilters]);

  const handleSearch = () => {
    setShowResults(true);
  };

  const handleRoomSelect = (room: Room, slot: TimeSlot) => {
    onRoomSelect?.(room, slot);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Find a Room</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Natural language input */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Sparkles className="size-4 text-accent" />
            Describe what you need
          </Label>
          <div className="relative">
            <Input
              type="text"
              placeholder="e.g., I need a conference room for 8 people tomorrow afternoon..."
              value={naturalQuery}
              onChange={(e) => setNaturalQuery(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          {parsedQuery && Object.keys(parsedQuery).length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs text-muted-foreground">Detected:</span>
              {parsedQuery.capacity && (
                <Badge variant="secondary" className="text-xs">
                  <Users className="size-3 mr-1" />
                  {parsedQuery.capacity}
                </Badge>
              )}
              {parsedQuery.timePreference && (
                <Badge variant="secondary" className="text-xs">
                  <Clock className="size-3 mr-1" />
                  {parsedQuery.timePreference}
                </Badge>
              )}
              {parsedQuery.roomType && (
                <Badge variant="secondary" className="text-xs capitalize">
                  <RoomTypeIcon type={parsedQuery.roomType} />
                  <span className="ml-1">{parsedQuery.roomType}</span>
                </Badge>
              )}
              {parsedQuery.isClientMeeting && (
                <Badge variant="secondary" className="text-xs">
                  Client meeting
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Or filter by
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="space-y-1.5">
              <Label htmlFor="date" className="text-xs">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="time" className="text-xs">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="capacity" className="text-xs">
                Attendees
              </Label>
              <Input
                id="capacity"
                type="number"
                min={1}
                placeholder="Any"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value ? parseInt(e.target.value) : '')}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="roomType" className="text-xs">
                Room type
              </Label>
              <select
                id="roomType"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value as Room['type'] | '')}
                className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Any</option>
                <option value="conference">Conference</option>
                <option value="boardroom">Boardroom</option>
                <option value="huddle">Huddle</option>
                <option value="lounge">Lounge</option>
                <option value="virtual">Virtual</option>
                <option value="phone">Phone Booth</option>
              </select>
            </div>
          </div>
        </div>

        <Button onClick={handleSearch} className="w-full">
          <Search className="size-4 mr-2" />
          Find Available Rooms
        </Button>

        {/* Results */}
        {showResults && (
          <div className="space-y-6 border-t pt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {filteredAvailability.length} rooms match your criteria
              </p>
              <span className="text-xs text-muted-foreground">
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>

            {/* Recommended Room */}
            {recommendedRoom && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Star className="size-4 text-amber-500 fill-amber-500" />
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Recommended
                  </p>
                </div>
                <div className="rounded-lg border-2 border-accent bg-accent/5 p-4">
                  <div className="flex items-start justify-between gap-4 min-w-0">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <RoomTypeIcon type={recommendedRoom.room.type} />
                        <span className="font-medium truncate">{recommendedRoom.room.name}</span>
                        <Badge className="text-xs flex-shrink-0 bg-accent text-accent-foreground">
                          <Users className="size-3 mr-1" />
                          {recommendedRoom.room.capacity}
                        </Badge>
                      </div>
                      {recommendedRoom.room.floor && (
                        <p className="text-xs text-muted-foreground truncate">{recommendedRoom.room.floor}</p>
                      )}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {recommendedRoom.room.amenities.slice(0, 4).map((amenity) => (
                          <Badge key={amenity} variant="secondary" className="text-[10px]">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-accent/20">
                    <p className="text-xs text-muted-foreground mb-2">Available times:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {recommendedRoom.availableSlots.slice(0, 6).map((slot) => (
                        <Button
                          key={slot.start}
                          size="xs"
                          onClick={() => handleRoomSelect(recommendedRoom.room, slot)}
                          className="text-xs"
                        >
                          <CheckCircle2 className="size-3 mr-1" />
                          {slot.start}
                        </Button>
                      ))}
                      {recommendedRoom.availableSlots.length > 6 && (
                        <span className="text-xs text-muted-foreground self-center">
                          +{recommendedRoom.availableSlots.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Alternative Rooms */}
            {alternativeRooms.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Alternatives ({alternativeRooms.length})
                </p>
                <div className="space-y-2">
                  {alternativeRooms.map(({ room, availableSlots }) => (
                    <div
                      key={room.id}
                      className="rounded-lg border bg-card p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4 min-w-0">
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <RoomTypeIcon type={room.type} />
                            <span className="font-medium truncate">{room.name}</span>
                            <Badge variant="outline" className="text-xs flex-shrink-0">
                              <Users className="size-3 mr-1" />
                              {room.capacity}
                            </Badge>
                          </div>
                          {room.floor && (
                            <p className="text-xs text-muted-foreground truncate">{room.floor}</p>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex flex-wrap gap-1.5">
                          {availableSlots.slice(0, 4).map((slot) => (
                            <Button
                              key={slot.start}
                              variant="outline"
                              size="xs"
                              onClick={() => handleRoomSelect(room, slot)}
                              className="text-xs"
                            >
                              {slot.start}
                            </Button>
                          ))}
                          {availableSlots.length > 4 && (
                            <span className="text-xs text-muted-foreground self-center">
                              +{availableSlots.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No matches */}
            {filteredAvailability.length === 0 && (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  No rooms match your criteria. Try adjusting your filters.
                </p>
              </div>
            )}

            {/* Other Available Rooms */}
            {otherAvailableRooms.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ChevronDown className="size-4 text-muted-foreground" />
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Other available rooms ({otherAvailableRooms.length})
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  These rooms are available but don&apos;t match your current filters.
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {otherAvailableRooms.map(({ room, availableSlots }) => (
                    <div
                      key={room.id}
                      className="rounded-lg border border-dashed bg-muted/30 p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <RoomTypeIcon type={room.type} />
                        <span className="text-sm font-medium truncate">{room.name}</span>
                        <Badge variant="outline" className="text-[10px] flex-shrink-0 ml-auto">
                          {room.capacity}
                        </Badge>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {availableSlots.slice(0, 3).map((slot) => (
                          <Button
                            key={slot.start}
                            variant="ghost"
                            size="xs"
                            onClick={() => handleRoomSelect(room, slot)}
                            className="text-[10px] h-6 px-2 text-muted-foreground hover:text-foreground"
                          >
                            {slot.start}
                          </Button>
                        ))}
                        {availableSlots.length > 3 && (
                          <span className="text-[10px] text-muted-foreground self-center">
                            +{availableSlots.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
