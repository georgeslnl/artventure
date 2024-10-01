import React, { useState, useEffect } from 'react';
import ExhibCard from './ExhibCard';
import AddEventCard from './AddEventCard';
import { ListCardProps, Event } from '../types/types';
import { IoIosAddCircleOutline, IoIosCloseCircle } from "react-icons/io";

const ListCard: React.FC<ListCardProps> = ({ title, bgColor, events, onEventAdded, onEventDelete, onEventEdit }) => {
    const [isAddMode, setIsAddMode] = useState(false);
    const [localEvents, setLocalEvents] = useState<Event[]>(events);

    useEffect(() => {
        setLocalEvents(events);
    }, [events]);

    const handleToggle = () => {
        setIsAddMode(!isAddMode);
    };

    const handleEventAdded = (newEvent: Event) => {
        setLocalEvents(prevEvents => [...prevEvents, newEvent]);
        onEventAdded(newEvent);
    };

    const handleEventDelete = (id: string) => {
        setLocalEvents(prevEvents => prevEvents.filter(event => event._id !== id));
        onEventDelete(id);
    }

    const handleEventEdit = (updatedEvent: Event) => {
        setLocalEvents(prevEvents => prevEvents.map(event => event._id === updatedEvent._id ? updatedEvent : event));
        onEventEdit(updatedEvent);
    }

    return (
        <div className={`${bgColor} w-11/12 lg:w-1/4 h-full p-4 rounded-lg shadow-2xl m-auto`}>
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-text-900">{title}</h2>
                <button
                    aria-label={isAddMode ? 'Close' : 'Add Event'}
                    onClick={handleToggle}
                    className="text-4xl font-semibold transition-transform duration-300"
                >
                    {isAddMode ? (
                        <IoIosCloseCircle className="transition-transform duration-800 ease-in-out rotate-0 text-secondary-500" />
                    ) : (
                        <IoIosAddCircleOutline className="transition-transform duration-800 ease-in-out rotate-0" />
                    )}
                </button>
            </div>

            <div className="overflow-scroll flex flex-col h-5/6 p-2 mx-auto gap-3">
                {isAddMode && (
                    <AddEventCard
                        status={title as "Horizon" | "Itinerary" | "Travelogue"}
                        onEventAdded={handleEventAdded}
                        onClose={() => setIsAddMode(false)}
                    />
                )}
                {localEvents.map((event) => (
                    <ExhibCard key={event._id} _id={event._id} name={event.name} museum={event.museum} link={event.link} status={event.status} onEventDelete={handleEventDelete} onEventEdit={handleEventEdit}/>
                ))}
            </div>
        </div>
    );
};

export default ListCard;