import type { ProgramEvent } from "../../content/programData";

type ProgramEventCardProps = {
  event: ProgramEvent;
};

export function ProgramEventCard({ event }: ProgramEventCardProps) {
  return (
    <article className="program-event" tabIndex={0}>
      <div className="program-event__date">
        <strong>{event.date}</strong>
        <span>{event.time}</span>
      </div>
      <div className="program-event__details">
        <h3>{event.title}</h3>
        <p>{event.description}</p>
      </div>
    </article>
  );
}
