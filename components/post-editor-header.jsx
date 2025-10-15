"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Save,
  Send,
  Calendar as CalendarIcon,
  Settings,
  Loader2,
} from "lucide-react";

export default function PostEditorHeader({
  mode,
  initialData,
  isPublishing,
  onSave,
  onPublish,
  onSchedule,
  onSettingsOpen,
  onBack,
}) {
  const [isPublishMenuOpen, setIsPublishMenuOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(null);

  const isDraft = initialData?.status === "draft";
  const isEdit = mode === "edit";

  const handleScheduleClick = () => {
    setIsCalendarOpen(true);
    setIsPublishMenuOpen(false);
  };

  const handleDateSelect = (date) => {
    setScheduledDate(date);
    setIsCalendarOpen(false);
    onSchedule(date);
  };

  return (
    <header className="sticky top-0 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-50">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost2"
            size="sm"
            onClick={onBack}
            className="text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {isDraft && (
            <Badge
              variant="secondary"
              className="bg-orange-500/20 text-orange-300 border-orange-500/30"
            >
              Draft
            </Badge>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center space-x-3 relative">
          <Button
            variant="ghost2"
            size="sm"
            onClick={onSettingsOpen}
            className="text-slate-400 hover:text-white transition"
          >
            <Settings className="h-4 w-4" />
          </Button>

          {!isEdit && (
            <Button
              onClick={onSave}
              disabled={isPublishing}
              variant="ghost2"
              size="sm"
              className="text-slate-400 hover:text-white transition"
            >
              {isPublishing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
            </Button>
          )}

          {isEdit ? (
            <Button
              variant="primary"
              disabled={isPublishing}
              onClick={() => onPublish()}
            >
              {isPublishing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Update
            </Button>
          ) : (
            <>
              <DropdownMenu
                open={isPublishMenuOpen}
                onOpenChange={setIsPublishMenuOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="primary"
                    disabled={isPublishing}
                    className="bg-purple-600 hover:bg-purple-700 text-white transition"
                  >
                    {isPublishing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Publish
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-52 bg-slate-900 border border-slate-700 text-white shadow-lg rounded-lg"
                >
                  <DropdownMenuItem
                    onClick={() => {
                      onPublish();
                      setIsPublishMenuOpen(false);
                    }}
                    className="hover:bg-purple-600 hover:text-white cursor-pointer"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Publish now
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleScheduleClick}
                    className="hover:bg-purple-600 hover:text-white cursor-pointer"
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Schedule for later
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Calendar Popup */}
              {isCalendarOpen && (
                <div className="absolute right-0 mt-2 z-50 p-4 rounded-lg shadow-xl bg-slate-900 border border-slate-700 text-white">
                  <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={handleDateSelect}
                    className="bg-slate-900 text-white rounded-md"
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      variant="ghost2"
                      size="sm"
                      className="text-slate-400 hover:text-white"
                      onClick={() => setIsCalendarOpen(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
