import React, { useState } from 'react';
import ExhibCard from '../components/ExhibCard';
import { ListCardProps } from '../types/types';
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";

const ListCard: React.FC<ListCardProps> = ({ title, bgColor, events }) => {
  // State to toggle between Add and Close icons
  const [isAddMode, setIsAddMode] = useState(false);

  // Function to toggle state
  const handleToggle = () => {
    setIsAddMode(!isAddMode); // Toggle between add and close icons
  };

  return (
    <div className={`${bgColor} w-11/12 lg:w-1/4 h-full p-4 rounded-lg shadow-2xl m-auto`}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text-900">{title}</h2>
        <button
          aria-label={isAddMode ? 'Add Event' : 'Close'}
          onClick={handleToggle}
          className="text-2xl font-semibold transition-transform duration-300"
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
            <div className="bg-secondary-500 rounded-lg p-4 hover:shadow-xl w-full flex flex-col gap-1 group">
                <h3 className="text-xl font-bold text-text-900">Add Event</h3>
                <div className="flex flex-row gap-2 justify-start items-center">
                    <input type="text" placeholder="Event Name" className="text-text-800 text-lg" />
                    </div>
                    <div className="flex flex-row gap-2 justify-start items-center">
                        <input type="text" placeholder="Museum Name" className="text-text-800 text-lg" />
                        </div>
                        <div className="flex flex-row gap-2 justify-start items-center">
                            <input type="text" placeholder="Link" className="text-text-800 text-lg" />
                            </div>
                            <div className="flex-row gap-2 justify-end items-center hidden group-hover:flex">
                                <button className="bg-primary-600 text-text-900 p-2 rounded-lg text-xs">Add</button>
                                </div>
                                </div>)}
        {events.map((event) => (
          <ExhibCard key={event._id} name={event.name} museum={event.museum} link={event.link} />
        ))}
      </div>
    </div>
  );
};

export default ListCard;
