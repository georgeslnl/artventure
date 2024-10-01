import React, { useState } from 'react';
import { PiBuilding, PiLinkSimpleBold } from "react-icons/pi";
import { ExhibCardProps } from "../types/types";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const eventSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be 100 characters or less"),
    museum: z.string().min(1, "Museum is required").max(100, "Museum name must be 100 characters or less"),
    link: z.string().url("Must be a valid URL").max(2048, "URL must be 2048 characters or less"),
    status: z.enum(["Horizon", "Itinerary", "Travelogue"])
});

type EventFormData = z.infer<typeof eventSchema>;

const ExhibCard: React.FC<ExhibCardProps> = ({ _id, name, museum, link, status, onEventEdit, onEventDelete }) => {
    const [isEditMode, setIsEditMode] = useState(false);

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EventFormData>({
        resolver: zodResolver(eventSchema),
        defaultValues: { name, museum, link, status }
    });

    const onSubmit = async (data: EventFormData) => {
        try {
            const response = await fetch(`/api/events?id=${_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update event');
            }

            const updatedEvent = await response.json();
            console.log('Updated event:', updatedEvent); // Debugging log
            onEventEdit({ ...updatedEvent.event, _id }); // Pass the entire updated event object
            setIsEditMode(false);
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/events/${_id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete event');
            }

            onEventDelete(_id);
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const handleCancel = () => {
        reset({ name, museum, link, status });
        setIsEditMode(false);
    };

    return (
        <div className="bg-background-100 rounded-lg p-4 hover:shadow-xl w-full flex flex-col gap-1 group">
            {!isEditMode ? (
                <>
                    <h3 className="text-xl font-bold text-text-900">{name}</h3>
                    <div className="flex flex-row gap-2 justify-start items-center">
                        <PiBuilding className="text-lg text-text-800" />
                        <p className="text-text-800 text-lg">{museum}</p>
                    </div>
                    <div className="flex flex-row gap-2 justify-start items-center">
                        <PiLinkSimpleBold className="text-lg text-text-800" />
                        <a href={link}><p className="text-text-800 text-lg hover:underline font-semibold">More info</p></a>
                    </div>
                </>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col">
                            <label className="font-semibold text-text-900 text-lg">Name</label>
                            <input
                                {...register("name")}
                                className="text-text-800 p-1 text-lg w-full rounded-md bg-background-50"
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold text-text-900 text-lg">Museum</label>
                            <input
                                {...register("museum")}
                                className="text-text-800 p-1 text-lg w-full rounded-md bg-background-50"
                            />
                            {errors.museum && <p className="text-red-500 text-sm">{errors.museum.message}</p>}
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold text-text-900 text-lg">Link</label>
                            <input
                                {...register("link")}
                                className="text-text-800 p-1 text-lg w-full rounded-md bg-background-50"
                            />
                            {errors.link && <p className="text-red-500 text-sm">{errors.link.message}</p>}
                        </div>
                    </div>
                    <div className="flex-row gap-2 justify-center lg:justify-end items-center flex mt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-primary-500 text-text-900 p-1 rounded-lg text-lg lg:text-md w-1/4 min-w-fit"
                        >
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-secondary-500 text-text-900 p-1 rounded-lg text-lg lg:text-md w-1-4 min-w-fit"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
            {!isEditMode && (
                <div className="flex-row gap-2 justify-center lg:justify-end items-center flex mt-2">
                    <button
                        onClick={handleDelete}
                        className="bg-primary-500 text-text-900 p-1 rounded-lg text-lg lg:text-md w-1/4 min-w-fit"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => setIsEditMode(true)}
                        className="bg-primary-500 text-text-900 p-1 rounded-lg text-lg lg:text-md w-1/4 min-w-fit"
                    >
                        Edit
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExhibCard;