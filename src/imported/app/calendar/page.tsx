"use client";

import { useState } from "react";
import { KeyboardNavigablePage } from "@/components/KeyboardNavigablePage";
import { CalendarView } from "@/components/workspace/calendar-view";
import { ROOM_NAMES } from "@/components/workspace/meeting-card";
import { RoomFinder } from "@/components/workspace/room-finder";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [capacity, setCapacity] = useState<string>("");
  const [roomType, setRoomType] = useState<string>("");

  return (
    <KeyboardNavigablePage>
      <div className="mx-auto w-full max-w-4xl flex-1 space-y-8 px-6 py-16">
        {/* Header */}
        <header className="space-y-2">
          <p className="text-xs text-muted-foreground">Workspace / calendar</p>
          <h1 className="text-3xl font-semibold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            Schedule and upcoming events.
          </p>
        </header>

        {/* Filters */}
        <section data-keyboard-nav-section>
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Filter by
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
                  onChange={(e) => setCapacity(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="roomType" className="text-xs">
                  Room type
                </Label>
                <select
                  id="roomType"
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
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
        </section>

        {/* Calendar view */}
        <section data-keyboard-nav-section>
          <CalendarView
            view="week"
            showRoomFilter
            rooms={[...ROOM_NAMES]}
            events={[
              {
                id: "1",
                title: "Olivia x Riley",
                date: new Date(),
                time: "09:00",
                endTime: "10:00",
                type: "meeting",
                room: "Bao",
                attendeeCount: 2,
                isClientMeeting: false,
              },
              {
                id: "2",
                title: "Q3 Planning Session",
                date: new Date(),
                time: "10:15",
                endTime: "11:45",
                type: "meeting",
                room: "Conference A",
                attendeeCount: 8,
                isClientMeeting: false,
              },
              {
                id: "3",
                title: "Client Review - Northwind",
                date: new Date(),
                time: "13:00",
                endTime: "15:00",
                type: "meeting",
                room: "Boardroom",
                attendeeCount: 5,
                isClientMeeting: true,
              },
              {
                id: "4",
                title: "1:1 with Sam",
                date: new Date(Date.now() + 86400000),
                time: "14:00",
                endTime: "14:45",
                type: "meeting",
                room: "Lounge",
                attendeeCount: 2,
                isClientMeeting: false,
              },
              {
                id: "5",
                title: "Remote Standup",
                date: new Date(Date.now() + 86400000 * 2),
                time: "09:00",
                endTime: "09:30",
                type: "meeting",
                room: "Virtual",
                attendeeCount: 12,
                isClientMeeting: false,
              },
            ]}
          />
        </section>

        {/* Room Finder */}
        <section data-keyboard-nav-section>
          <RoomFinder
            onRoomSelect={(room, slot) => {
              console.log('Selected room:', room.name, 'at', slot.start);
            }}
          />
        </section>
      </div>
    </KeyboardNavigablePage>
  );
}
