import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'
import ExhibCard from '../components/ExhibCard';
import { ListCardProps } from '../types/types';
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import { Event } from '../types/types';

// Define the schema for event validation
const eventSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be 100 characters or less"),
    museum: z.string().min(1, "Museum is required").max(100, "Museum name must be 100 characters or less"),
    link: z.string().url("Must be a valid URL").max(2048, "URL must be 2048 characters or less"),
    status: z.enum(["Horizon", "Itinerary", "Travelogue"])
  });
  
  type EventFormData = z.infer<typeof eventSchema>;
  

const ListCard: React.FC<ListCardProps> = ({ title, bgColor, events, onEventAdded }) => {
    const [isAddMode, setIsAddMode] = useState(false);
    const [localEvents, setLocalEvents] = useState<Event[]>(events);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EventFormData>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            status: title as "Horizon" | "Itinerary" | "Travelogue"
        }
    });

    useEffect(() => {
        setLocalEvents(events);
    }, [events]);

    const handleToggle = () => {
        setIsAddMode(!isAddMode);
        reset();
    };

    const onSubmit = async (data: EventFormData) => {
        console.log("Form submitted with data:", data);
        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json(); // Capture error response
                console.error('Failed to add event:', errorData);
                throw new Error(errorData.message || 'Failed to add event');
            }

            const addedEvent = await response.json();
            setLocalEvents(prevEvents => [...prevEvents, addedEvent]);
            onEventAdded(addedEvent);

            reset(); // Reset form after successful submission
            setIsAddMode(false);
        } catch (error) {
            console.error('Error adding event:', error);
        }
    };

    return (
        <div className={`${bgColor} w-11/12 lg:w-1/4 h-full p-4 rounded-lg shadow-2xl m-auto`}>
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-text-900">{title}</h2>
                <button
                    aria-label={isAddMode ? 'Add Event' : 'Close'}
                    onClick={handleToggle}
                    className="text-4xl font-semibold transition-transform duration-300"
                >
                    {/* Animate between Add and Close icons */}
                    {isAddMode ? (
                        <IoIosCloseCircleOutline className=" transition-transform duration-800 ease-in-out rotate-0 text-secondary-500" />

                    ) : (
                        <IoIosAddCircleOutline className=" transition-transform duration-800 ease-in-out rotate-0" />
                    )}
                </button>
            </div>

            <div className="overflow-scroll flex flex-col h-5/6 p-2 mx-auto gap-3">
                {/* Render AddEvent component when isAddMode is true */}
                {isAddMode && (
                    <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="bg-secondary-500 rounded-lg p-4 hover:shadow-xl w-full flex flex-col gap-1 group">
                        <div className="flex flex-col justify-start items-start max-w-full">
                            <label className='font-semibold text-text-900 text-lg'>Name</label>
                            <input
                                {...register("name")}
                                placeholder="Medieval Art"
                                className="text-text-800 p-1 text-lg w-full placeholder:text-lg rounded-md bg-background-50"
                            />
                            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                        </div>
                        <div className="flex flex-col justify-start items-start max-w-full">
                            <label className='font-semibold text-text-900 text-lg'>Museum</label>
                            <input
                                type="text"
                                {...register("museum")}
                                placeholder="Louvre Museum"
                                className="text-text-800 p-1 text-lg w-full placeholder:text-lg rounded-md bg-background-50"
                            />
                            {errors.museum && <p className="text-red-500">{errors.museum.message}</p>}
                        </div>
                        <div className="flex flex-col justify-start items-start max-w-full">
                            <label className='font-semibold text-text-900 text-lg'>Link</label>
                            <input
                                type="text"
                                {...register("link")}
                                placeholder="https://www.louvre.fr/en"
                                className="text-text-800 p-1 text-lg w-full placeholder:text-lg rounded-md bg-background-50"
                            />
                            {errors.link && <p className="text-red-500">{errors.link.message}</p>}
                        </div>
                
                        {/* Register the hidden status input */}
                        <input type="hidden" {...register("status")} />
                
                        <div className="flex-row justify-center lg:justify-end items-center flex">
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className={`bg-primary-500 text-text-900 p-1 rounded-lg text-lg lg:text-md w-1/4 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? 'Adding...' : 'Add'}
                            </button>
                        </div>
                    </div>
                </form>
                )}
                {localEvents.map((event) => (
                    <ExhibCard key={ event.name} name={event.name} museum={event.museum} link={event.link} />
                ))}
            </div>
        </div>
    );
};

export default ListCard;
