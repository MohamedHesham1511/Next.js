import { useRouter } from "next/router";
import { getFilteredEvents } from "../../../dummy-data";
import { EventList } from "../../../components/events/event-list";
import { Fragment } from "react/jsx-runtime";
import { ResultsTitle } from "../../../components/events/results-title";
import { Button } from "../../../components/ui/button";
import { ErrorAlert } from "../../../components/events/error-alert";

function FilteredEventsPage() {
  const router = useRouter();

  if (!router.query.slug) {
    return <p className='center'>Loading...</p>;
  }

  const numericYear = parseInt(router.query.slug[0]);
  const numericMonth = parseInt(router.query.slug[1]);

  if (isNaN(numericYear) || isNaN(numericMonth) || numericYear > 2030 || numericYear < 2021 || numericMonth < 1 || numericMonth > 12) {
    return (
      <Fragment>
        <ErrorAlert>
          <p>Invalid filter. Please adjust your values!</p>
        </ErrorAlert>
        <div className='center'>
          <Button link='/events'>Show all events</Button>
        </div>
      </Fragment>
    );
  }

  const filteredEvents = getFilteredEvents({
    year: numericYear,
    month: numericMonth,
  });

  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <Fragment>
        <ErrorAlert>
          <p>No events found for the chosen filter!</p>
        </ErrorAlert>
        <div className='center'>
          <Button link='/events'>Show all events</Button>
        </div>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <ResultsTitle date={new Date(numericYear, numericMonth - 1)} />
      <EventList items={filteredEvents} />
    </Fragment>
  );
}
export default FilteredEventsPage;
