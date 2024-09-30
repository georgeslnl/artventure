
export default function Home() {
  return (
    <div className="p-4 h-screen">
      <h1 className="text-5xl font-bold text-text-900">ARTventure</h1>
      <div className="flex flex-row justify-around my-4 h-4/5">
        <div className="bg-primary-300 w-1/4 min-h-full p-3 rounded-lg shadow-2xl overflow-scroll">
          <h2 className="text-2xl font-bold text-text-900">Horizons</h2>
        </div>
        <div className="bg-secondary-200 w-1/4 min-h-full p-3 rounded-lg shadow-2xl">
        <h2 className="text-2xl font-bold text-text-900">Itinerary</h2></div>
        <div className="bg-accent-300 w-1/4 min-h-full p-3 rounded-lg shadow-2xl">
        <h2 className="text-2xl font-bold text-text-900">Travelogue</h2></div>
      </div>
    </div>
  );
}
