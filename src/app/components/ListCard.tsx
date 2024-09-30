import React from 'react';
import ExhibCard from '../components/ExhibCard';

interface ListCardProps {
  title: string;
  bgColor: string;
}

const ListCard: React.FC<ListCardProps> = ({ title, bgColor }) => (
    <div className={`${bgColor} w-1/4 h-full p-3 rounded-lg shadow-2xl m-auto`}>
        <h2 className="text-2xl font-bold text-text-900">{title}</h2>
        <div className="overflow-scroll flex flex-col h-5/6 p-4 mx-auto">
            <ExhibCard name="The Starry Night" museum="Museum of Modern Art" link="https://www.moma.org/collection/works/79802" />
        </div>
        <button className="mt-4 p-2">Add</button>
    </div>
);

export default ListCard;
