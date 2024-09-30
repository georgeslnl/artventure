// src/app/components/AddEventForm.tsx
"use client";

import { useState } from 'react';

const AddEventForm = () => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [museum, setMuseum] = useState('');
  const [link, setLink] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create the new event object
    const newEvent = {
      name,
      date,
      museum,
      link,
    };

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) {
        throw new Error('Failed to add event');
      }

      // Clear the form after submission
      setName('');
      setDate('');
      setMuseum('');
      setLink('');

      // Optionally, you can handle the response or update the state in your app
      const result = await response.json();
      console.log('Event added:', result);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Event</h2>
      <div>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
      </div>
      {/* <div>
        <label>
          Status:
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="wishlist">Wishlist</option>
            <option value="booked">Booked</option>
            <option value="attended">Attended</option>
          </select>
        </label>
      </div> */}
      <div>
        <label>
          Museum:
          <input
            type="text"
            value={museum}
            onChange={(e) => setMuseum(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Link:
          <input
          type='text'
            value={link}
            onChange={(e) => setLink(e.target.value)}
          ></input>
        </label>
      </div>
      <button type="submit">Add Event</button>
    </form>
  );
};


export default AddEventForm;
