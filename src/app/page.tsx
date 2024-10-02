'use client';
import { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ListCard from "./components/ListCard";
import { Event } from "./types/types";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [userName, setUserName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedName = localStorage.getItem('userName');
    setIsAuthenticated(!!token);
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("/api/events", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error fetching events:", err);
      return [];
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true);
      fetchEvents().then(data => {
        setEvents(data);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [fetchEvents, isAuthenticated]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    // router.push('/auth/login');
  };

  const handleEventAdded = useCallback((newEvent: Event) => {
    setEvents(prevEvents => [...prevEvents, newEvent]);
  }, []);

  const handleEventDelete = useCallback((id: string) => {
    setEvents(prevEvents => prevEvents.filter(event => event._id !== id));
  }, []);

  const handleEventUpdate = useCallback((updatedEvent: Event) => {
    setEvents(prevEvents => prevEvents.map(event =>
      event._id === updatedEvent._id ? updatedEvent : event
    ));
  }, []);

  const horizonEvents = events.filter((event) => event.status === "Horizon");
  const itineraryEvents = events.filter((event) => event.status === "Itinerary");
  const travelogueEvents = events.filter((event) => event.status === "Travelogue");

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-2xl font-bold text-text-900 mb-4">Loading...</p>
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2  border-text-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6 h-screen">
      <div className="flex flex-col lg:flex-row lg:justify-between items-center mb-4">
        <h1 className="text-5xl font-bold text-text-900">ARTventure.</h1>
        <div>
          {isAuthenticated ? (
            <div className="flex flex-col gap-0">
              <p className="text-text-900 text-lg lg:text-2xl font-bold p-2 ">Welcome, {userName}!</p>
              <button
                onClick={handleSignOut}
                className="text-lg lg:text-2xl font-bold text-text-900 rounded-lg p-2"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link href="/auth/signup">
                <button className="lg:text-2xl font-bold text-text-900 p-2 rounded-lg">
                  Sign Up
                </button>
              </Link>
              <Link href="/auth/login">
                <button className="lg:text-2xl font-bold text-text-900 p-2 rounded-lg">
                  Login
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
      {isAuthenticated ? (
        <div className="flex flex-col gap-6 lg:flex-row justify-around mt-4 lg:h-5/6">
          <ListCard title="Horizon" events={horizonEvents} bgColor="bg-primary-300" onEventAdded={handleEventAdded} onEventDelete={handleEventDelete} onEventEdit={handleEventUpdate} />
          <ListCard title="Itinerary" events={itineraryEvents} bgColor="bg-secondary-200" onEventAdded={handleEventAdded} onEventDelete={handleEventDelete} onEventEdit={handleEventUpdate} />
          <ListCard title="Travelogue" events={travelogueEvents} bgColor="bg-accent-300" onEventAdded={handleEventAdded} onEventDelete={handleEventDelete} onEventEdit={handleEventUpdate} />
        </div>
      ) : (
        <div className="text-center m-">
          <p className="text-2xl">Please sign up or log in to view and manage your events.</p>
        </div>
      )}
    </div>
  );
}