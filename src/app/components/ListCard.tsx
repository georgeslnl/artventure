import React from 'react';
import ExhibCard from '../components/ExhibCard';
import { ListCardProps } from '../types/types';


const ListCard: React.FC<ListCardProps> = ({ title, bgColor, events }) => (
    <div className={`${bgColor} w-11/12 lg:w-1/4 h-full p-3 rounded-lg shadow-2xl m-auto`}>
        <h2 className="text-2xl font-bold text-text-900">{title}</h2>
        <div className="overflow-scroll flex flex-col h-5/6 p-2 mx-auto gap-3">
        {events.map((event) => (
            <ExhibCard key={event._id} name={event.name} museum={event.museum} link={event.link} />
        ))}
        </div>
        <button className="">Add</button>
    </div>
);

export default ListCard;
