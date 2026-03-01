import { useRouter } from "next/router";
import { getFilteredEvents } from "../../../dummy-data";
import { EventList } from "../../../components/events/event-list";

function FilteredEventsPage() {
  const router = useRouter();

  if (!router.query.slug) {
    return <p className='center'>Loading...</p>;
  }

  const numericYear = parseInt(router.query.slug[0]);
  const numericMonth = parseInt(router.query.slug[1]);

  if (isNaN(numericYear) || isNaN(numericMonth) || numericYear > 2030 || numericYear < 2021 || numericMonth < 1 || numericMonth > 12) {
    return <p className='center'>Invalid filter. Please adjust your values!</p>;
  }

  const filteredEvents = getFilteredEvents({
    year: numericYear,
    month: numericMonth,
  });

  if (!filteredEvents || filteredEvents.length === 0) {
    return <p className='center'>No events found for the chosen filter!</p>;
  }

  return (
    <div>
      <h1>Filtered Events Page</h1>
      <EventList items={filteredEvents} />
    </div>
  );
}
export default FilteredEventsPage;
