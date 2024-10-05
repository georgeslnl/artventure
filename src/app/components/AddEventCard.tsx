import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Event } from '../types/types';

const eventSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be 100 characters or less"),
  museum: z.string().min(1, "Museum is required").max(100, "Museum name must be 100 characters or less"),
  link: z.string().url("Must be a valid URL").max(2048, "URL must be 2048 characters or less"),
  status: z.enum(["Horizon", "Itinerary", "Travelogue"])
});

type EventFormData = z.infer<typeof eventSchema>;

interface AddEventCardProps {
  status: "Horizon" | "Itinerary" | "Travelogue";
  onEventAdded: (event: Event) => void;
  onClose: () => void;
}

const AddEventCard: React.FC<AddEventCardProps> = ({ status, onEventAdded, onClose }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: { status }
  });

  const onSubmit = async (data: EventFormData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add event');
      }

      const addedEvent = await response.json();
      onEventAdded(addedEvent);
      reset();
      onClose();
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-secondary-500 rounded-lg p-4 hover:shadow-xl w-full flex flex-col gap-1 group">
        <div className="flex flex-col justify-start items-start max-w-full">
          <label htmlFor="add-event-name" className='font-semibold text-text-900 text-lg'>Name</label>
          <input
            id="add-event-name"
            {...register("name")}
            placeholder="Medieval Art"
            className="text-text-800 p-1 text-lg w-full placeholder:text-base rounded-md bg-background-50"
          />
          {errors.name && <p className="text-background-900 font-semibold text-sm">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col justify-start items-start max-w-full">
          <label htmlFor="add-event-museum" className='font-semibold text-text-900 text-lg'>Museum</label>
          <input
            id="add-event-museum"
            type="text"
            {...register("museum")}
            placeholder="Louvre Museum"
            className="text-text-800 p-1 text-lg w-full placeholder:text-base rounded-md bg-background-50"
          />
          {errors.museum && <p className="text-background-900 font-semibold text-sm">{errors.museum.message}</p>}
        </div>
        <div className="flex flex-col justify-start items-start max-w-full">
          <label htmlFor="add-event-link" className='font-semibold text-text-900 text-lg'>Link</label>
          <input
            id="add-event-link"
            type="text"
            {...register("link")}
            placeholder="https://www.louvre.fr/en"
            className="text-text-800 p-1 text-lg w-full placeholder:text-base rounded-md bg-background-50"
          />
          {errors.link && <p className="text-background-900 font-semibold text-sm">{errors.link.message}</p>}
        </div>

        <input type="hidden" {...register("status")} />

        <div className="flex-row justify-center lg:justify-end items-center flex">
          <button 
            type="submit"
            disabled={isSubmitting}
            className={`bg-primary-500 mt-4 text-text-900 p-1 rounded-lg text-lg lg:text-md min-w-fit w-1/4 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddEventCard;