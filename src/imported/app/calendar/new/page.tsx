"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  UploadCloud,
  Calendar,
  Clock,
  MapPin,
  Users,
  X,
  FileImage,
  Loader2,
  PenLine,
} from "lucide-react";

import { KeyboardNavigablePage } from "@/components/KeyboardNavigablePage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RoomSelector } from "@/components/RoomSelector";
import { rooms } from "@/data/rooms";

interface ParsedMeeting {
  title?: string;
  date?: string;
  time?: string;
  duration?: string;
  room?: string;
  attendees?: string[];
}

export default function NewMeetingPage() {
  const router = useRouter();
  const [naturalLanguageInput, setNaturalLanguageInput] = useState("");
  const [parsedMeeting, setParsedMeeting] = useState<ParsedMeeting | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // Manual input state
  const [manualTitle, setManualTitle] = useState("");
  const [manualDate, setManualDate] = useState("");
  const [manualTime, setManualTime] = useState("");
  const [manualDuration, setManualDuration] = useState("30");
  const [manualRoom, setManualRoom] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateMeeting = useCallback(() => {
    router.push("/calendar/avail-rooms");
  }, [router]);

  // Simulate parsing natural language input
  const handleParseInput = useCallback(async () => {
    if (!naturalLanguageInput.trim()) return;

    setIsParsing(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simple mock parsing - in a real app this would call an AI API
    const input = naturalLanguageInput.toLowerCase();
    const parsed: ParsedMeeting = {};

    // Extract meeting title (text before "with" or first part)
    if (input.includes("meeting")) {
      parsed.title = "Meeting";
    }
    if (input.includes("with")) {
      const withMatch = input.match(/with\s+(\w+)/);
      if (withMatch) {
        parsed.attendees = [withMatch[1].charAt(0).toUpperCase() + withMatch[1].slice(1)];
        parsed.title = `Meeting with ${parsed.attendees[0]}`;
      }
    }
    if (input.includes("standup")) {
      parsed.title = "Standup";
    }
    if (input.includes("review")) {
      parsed.title = "Review";
    }
    if (input.includes("sync")) {
      parsed.title = "Sync";
    }

    // Extract time
    const timeMatch = input.match(/(\d{1,2})(:\d{2})?\s*(am|pm)?/i);
    if (timeMatch) {
      let hour = parseInt(timeMatch[1]);
      const minutes = timeMatch[2] || ":00";
      const period = timeMatch[3]?.toLowerCase();
      if (period === "pm" && hour < 12) hour += 12;
      if (period === "am" && hour === 12) hour = 0;
      parsed.time = `${hour.toString().padStart(2, "0")}${minutes}`;
    }

    // Extract duration
    const durationMatch = input.match(/(\d+)\s*(hour|hr|minute|min)/i);
    if (durationMatch) {
      const value = parseInt(durationMatch[1]);
      const unit = durationMatch[2].toLowerCase();
      if (unit.startsWith("hour") || unit.startsWith("hr")) {
        parsed.duration = `${value} hour${value > 1 ? "s" : ""}`;
      } else {
        parsed.duration = `${value} minutes`;
      }
    }

    // Extract date
    if (input.includes("tomorrow")) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      parsed.date = tomorrow.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
    } else if (input.includes("today")) {
      parsed.date = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
    }

    // Extract room from rooms data
    for (const room of rooms) {
      if (input.includes(room.name.toLowerCase())) {
        parsed.room = room.name;
        break;
      }
    }

    setParsedMeeting(Object.keys(parsed).length > 0 ? parsed : null);
    setIsParsing(false);
  }, [naturalLanguageInput]);

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  }, []);

  const processFile = (file: File) => {
    setUploadedFile(file);
    setIsProcessingImage(true);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Simulate processing delay
    setTimeout(() => {
      setIsProcessingImage(false);
      // In a real app, this would send the image to an OCR/AI service
      setParsedMeeting({
        title: "Team Planning Meeting",
        date: "Friday, Aug 8",
        time: "14:00",
        duration: "1 hour",
        room: "Conference A",
        attendees: ["Alex", "Jordan", "Sam"],
      });
    }, 1500);
  };

  const clearUpload = useCallback(() => {
    setUploadedFile(null);
    setUploadedPreview(null);
    setParsedMeeting(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const clearParsedMeeting = useCallback(() => {
    setParsedMeeting(null);
    setNaturalLanguageInput("");
  }, []);

  const handleManualSubmit = useCallback(() => {
    if (!manualTitle.trim() || !manualDate || !manualTime) return;

    const dateObj = new Date(manualDate);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });

    setParsedMeeting({
      title: manualTitle,
      date: formattedDate,
      time: manualTime,
      duration: `${manualDuration} minutes`,
      room: manualRoom || undefined,
    });
  }, [manualTitle, manualDate, manualTime, manualDuration, manualRoom]);

  return (
    <KeyboardNavigablePage>
      <div className="mx-auto w-full max-w-4xl flex-1 space-y-8 px-6 py-16">
        {/* Header */}
        <header className="space-y-2">
          <p className="text-xs text-muted-foreground">
            <Link href="/calendar" className="hover:underline">
              Workspace / calendar
            </Link>{" "}
            / new
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">New Meeting</h1>
          <p className="text-muted-foreground">
            Describe your meeting in plain language or upload a screenshot of an invite.
          </p>
        </header>

        {/* Natural Language Input Section */}
        <section data-keyboard-nav-section className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="size-4 text-primary" />
                </div>
                <div>
                  <CardTitle>Describe your meeting</CardTitle>
                  <CardDescription>
                    Use natural language to create a meeting instantly
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder='e.g., "Schedule a meeting with Sam tomorrow at 2pm in Bao for 1 hour" or "Team standup in Conference A at 9am for 30 minutes"'
                value={naturalLanguageInput}
                onChange={(e) => setNaturalLanguageInput(e.target.value)}
                className="min-h-24 resize-none"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  AI will parse your description into meeting details
                </p>
                <Button
                  onClick={handleParseInput}
                  disabled={!naturalLanguageInput.trim() || isParsing}
                  className="gap-2"
                >
                  {isParsing ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Parsing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4" />
                      Parse
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* OR Divider */}
        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-xs font-medium text-muted-foreground uppercase">
            or
          </span>
        </div>

        {/* Drag and Drop Screenshot Section */}
        <section data-keyboard-nav-section className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-secondary">
                  <FileImage className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle>Upload a screenshot</CardTitle>
                  <CardDescription>
                    Drag and drop a screenshot of a calendar invite or meeting details
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!uploadedFile ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed py-12 transition-colors ${
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/20 hover:border-muted-foreground/40 hover:bg-muted/30"
                  }`}
                >
                  <UploadCloud
                    className={`size-10 ${
                      isDragging ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <div className="text-center">
                    <p className="text-sm font-medium">
                      {isDragging ? "Drop your screenshot here" : "Upload screenshot"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Drop a file here or{" "}
                      <span className="underline underline-offset-2">browse</span> — PNG, JPG up to
                      10 MB
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <Button
                      size="icon-sm"
                      variant="secondary"
                      onClick={clearUpload}
                      className="absolute right-2 top-2 z-10"
                    >
                      <X className="size-4" />
                    </Button>
                    {uploadedPreview && (
                      <img
                        src={uploadedPreview}
                        alt="Uploaded screenshot"
                        className="max-h-64 w-full rounded-lg border object-contain"
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <FileImage className="size-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{uploadedFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(uploadedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    {isProcessingImage && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" />
                        Processing...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* OR Divider */}
        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-xs font-medium text-muted-foreground uppercase">
            or
          </span>
        </div>

        {/* Manual Input Section */}
        <section data-keyboard-nav-section className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                  <PenLine className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle>Enter details manually</CardTitle>
                  <CardDescription>
                    Fill in the meeting details directly
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="manual-title">Meeting title</Label>
                  <Input
                    id="manual-title"
                    placeholder="e.g., Team standup, Client review..."
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manual-date">Date</Label>
                  <Input
                    id="manual-date"
                    type="date"
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manual-time">Time</Label>
                  <Input
                    id="manual-time"
                    type="time"
                    value={manualTime}
                    onChange={(e) => setManualTime(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manual-duration">Duration</Label>
                  <select
                    id="manual-duration"
                    value={manualDuration}
                    onChange={(e) => setManualDuration(e.target.value)}
                    className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manual-room">Room</Label>
                  <RoomSelector
                    value={manualRoom}
                    onChange={setManualRoom}
                    showCapacity
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    handleManualSubmit();
                    router.push("/calendar/avail-rooms");
                  }}
                  disabled={!manualTitle.trim() || !manualDate || !manualTime}
                  className="gap-2"
                >
                  <Calendar className="size-4" />
                  Create Meeting
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Parsed Meeting Preview */}
        {parsedMeeting && (
          <section data-keyboard-nav-section className="space-y-4">
            <Card className="border-accent/30 bg-accent/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-accent/20">
                      <Calendar className="size-4 text-accent" />
                    </div>
                    <div>
                      <CardTitle>Meeting Preview</CardTitle>
                      <CardDescription>Review the parsed meeting details</CardDescription>
                    </div>
                  </div>
                  <Button size="icon-sm" variant="ghost" onClick={clearParsedMeeting}>
                    <X className="size-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {parsedMeeting.title && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Title
                      </p>
                      <p className="text-sm font-medium">{parsedMeeting.title}</p>
                    </div>
                  )}
                  {parsedMeeting.date && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Date
                      </p>
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-muted-foreground" />
                        <p className="text-sm">{parsedMeeting.date}</p>
                      </div>
                    </div>
                  )}
                  {parsedMeeting.time && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Time
                      </p>
                      <div className="flex items-center gap-2">
                        <Clock className="size-4 text-muted-foreground" />
                        <p className="text-sm">{parsedMeeting.time}</p>
                      </div>
                    </div>
                  )}
                  {parsedMeeting.duration && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Duration
                      </p>
                      <p className="text-sm">{parsedMeeting.duration}</p>
                    </div>
                  )}
                  {parsedMeeting.room && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Room
                      </p>
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-muted-foreground" />
                        <p className="text-sm">{parsedMeeting.room}</p>
                      </div>
                    </div>
                  )}
                  {parsedMeeting.attendees && parsedMeeting.attendees.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Attendees
                      </p>
                      <div className="flex items-center gap-2">
                        <Users className="size-4 text-muted-foreground" />
                        <div className="flex flex-wrap gap-1">
                          {parsedMeeting.attendees.map((attendee) => (
                            <Badge key={attendee} variant="secondary" className="text-xs">
                              {attendee}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" onClick={clearParsedMeeting}>
                    Clear
                  </Button>
                  <Button className="gap-2" onClick={handleCreateMeeting}>
                    <Calendar className="size-4" />
                    Create Meeting
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </KeyboardNavigablePage>
  );
}
