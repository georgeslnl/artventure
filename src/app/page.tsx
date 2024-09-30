import ListCard from "./components/ListCard";


export default function Home() {
  return (
    <div className="p-4 h-screen">
      <h1 className="text-5xl font-bold text-text-900">ARTventure</h1>
      <div className="flex flex-row justify-around my-4 h-4/5">
        <ListCard title="Horizons" bgColor="bg-primary-300" />
        <ListCard title="Itinerary" bgColor="bg-secondary-200" />
        <ListCard title="Travelogue" bgColor="bg-accent-300" />
      </div>
    </div>
  );
}
