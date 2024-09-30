import { PiBuilding, PiLinkSimpleBold } from "react-icons/pi";

interface ExhibCardProps {
    name: string;
    museum: string;
    link: string;
}

const ExhibCard: React.FC<ExhibCardProps> = ({ name, museum, link }) => (
    <div className="bg-background-100 rounded-lg p-4 hover:shadow-xl w-full flex flex-col gap-1">
        <h3 className="text-xl font-bold text-text-900">{name}</h3>
        <div className="flex flex-row gap-2 justify-start items-center">
            <PiBuilding className="text-lg text-text-800" />
            <p className="text-text-800 text-lg">{museum}</p>
        </div>
        <div className="flex flex-row gap-2 justify-start items-center">
            <PiLinkSimpleBold className="text-lg text-text-800" />
            <a href={link}><p className="text-text-800 text-lg hover:underline font-semibold">More info</p></a>
        </div>
    </div>
);

export default ExhibCard;