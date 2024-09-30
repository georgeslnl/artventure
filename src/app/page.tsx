"use client";
import { useState, useEffect } from "react";
import ListCard from "./components/ListCard";
import { Event } from "./types/types";


export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
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
        setEvents(data); // Update the state with fetched events
        console.log("Events fetched:", data);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchEvents();
  }, []);

  const horizonEvents = events.filter((event) => event.status === "Horizon");
  const itineraryEvents = events.filter((event) => event.status === "Itinerary");
  const travelogueEvents = events.filter((event) => event.status === "Travelogue");

  return (
    <div className="p-4 h-screen">
      <h1 className="text-5xl font-bold text-text-900">ARTventure</h1>
      <div className="flex flex-row justify-around my-4 h-4/5">
        <ListCard title="Horizons" events={horizonEvents} bgColor="bg-primary-300" />
        <ListCard title="Itinerary" events={itineraryEvents} bgColor="bg-secondary-200" />
        <ListCard title="Travelogue" events={travelogueEvents} bgColor="bg-accent-300" />
      </div>
    </div>
  );
}
