"use client";

import { KeyboardNavigablePage } from "@/components/KeyboardNavigablePage";
import { RoomFinder } from "@/components/workspace/room-finder";

export default function AvailableRoomsPage() {
  return (
    <KeyboardNavigablePage>
      <div className="mx-auto w-full max-w-4xl flex-1 space-y-8 px-6 py-16">
        {/* Header */}
        <header className="space-y-2">
          <p className="text-xs text-muted-foreground">Workspace / calendar / available rooms</p>
          <h1 className="text-3xl font-semibold tracking-tight">Available Rooms</h1>
          <p className="text-muted-foreground">
            Find and book a room for your next meeting.
          </p>
        </header>

        {/* Room Finder */}
        <section data-keyboard-nav-section>
          <RoomFinder
            onRoomSelect={(room, slot) => {
              console.log('Selected room:', room.name, 'at', slot.start);
              // TODO: Navigate to booking or open booking modal
            }}
          />
        </section>
      </div>
    </KeyboardNavigablePage>
  );
}
