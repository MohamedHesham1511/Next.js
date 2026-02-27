import { getFeaturedEvents } from "../dummy-data";
import { EventList } from "../components/events/event-list";

function HomePage() {
  const feturedEvents = getFeaturedEvents();

  return (
    <div>
      <EventList items={feturedEvents} />
    </div>
  );
}

export default HomePage;
