import { CalendarDays, MapPin } from "lucide-react";
import { churchContent } from "../../content/churchContent";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

export function EventsSection() {
  const { events } = churchContent;

  if (!events.items.length) {
    return null;
  }

  return (
    <section className="section section--compact events-section">
      <div className="container">
        <Reveal>
          <SectionHeading title={events.heading} align="center" />
        </Reveal>
        <div className="event-grid">
          {events.items.map((event) => (
            <Reveal as="article" className="event-card" key={event.title}>
              <h3>{event.title}</h3>
              <p>
                <CalendarDays aria-hidden="true" />
                {event.when}
              </p>
              <p>
                <MapPin aria-hidden="true" />
                {event.where}
              </p>
              <p>{event.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
