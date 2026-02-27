import { EventItem } from "./event-item";

export const EventList = (props) => {
  const { items } = props;

  return (
    <ul>
      {items.map((event) => (
        <EventItem key={event.id} title={event.title} />
      ))}
    </ul>
  );
};
