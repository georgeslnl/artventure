"use client";
import { useState, useEffect, useCallback } from "react";
import ListCard from "./components/ListCard";
import { Event } from "./types/types";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch("/api/events", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      console.log("Fetched events:", data); // Debugging log
      return data;
    } catch (err) {
      console.error("Error fetching events:", err);
      setError((err as Error).message);
      return [];
    }
  }, []);

  useEffect(() => {
    fetchEvents().then(data => setEvents(data));
  }, [fetchEvents]);

  const handleEventAdded = useCallback((newEvent: Event) => {
    setEvents(prevEvents => [...prevEvents, newEvent]);
  }, []);

  const horizonEvents = events.filter((event) => event.status === "Horizon");
  const itineraryEvents = events.filter((event) => event.status === "Itinerary");
  const travelogueEvents = events.filter((event) => event.status === "Travelogue");

  console.log("Rendering Home with events:", events); // Debugging log

  return (
    <div className="p-6 h-screen">
      <h1 className="text-5xl font-bold text-text-900 text-center lg:text-start">ARTventure.</h1>
      <div className="flex flex-col gap-6 lg:flex-row justify-around mt-4 lg:h-5/6">
        <ListCard title="Horizon" events={horizonEvents} bgColor="bg-primary-300" onEventAdded={handleEventAdded} />
        <ListCard title="Itinerary" events={itineraryEvents} bgColor="bg-secondary-200" onEventAdded={handleEventAdded} />
        <ListCard title="Travelogue" events={travelogueEvents} bgColor="bg-accent-300" onEventAdded={handleEventAdded} />
      </div>
    </div>
  );
}