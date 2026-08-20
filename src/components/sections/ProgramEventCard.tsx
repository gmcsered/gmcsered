import { Eye } from "lucide-react";
import type { ProgramEvent } from "../../content/program";
import type { InvitationImage } from "../ui/InvitationLightbox";

type ProgramEventCardProps = {
  event: ProgramEvent;
  onOpenInvitation?: (invitation: InvitationImage) => void;
};

export function ProgramEventCard({ event, onOpenInvitation }: ProgramEventCardProps) {
  const invitation = event.invitationImage
    ? {
        src: event.invitationImage,
        alt: event.invitationAlt ?? `Pozvánka na ${event.title}, ${event.date}`,
        width: event.invitationWidth,
        height: event.invitationHeight,
      }
    : null;

  const content = (
    <>
      <div className="program-event__date">
        <strong>{event.date}</strong>
        <span>{event.time}</span>
      </div>
      <div className="program-event__details">
        <h3>{event.title}</h3>
        <p>{event.description}</p>
      </div>
      {invitation ? (
        <span className="program-event__invitation-action">
          <span className="program-event__invitation-thumb" aria-hidden="true">
            <img src={invitation.src} width={invitation.width} height={invitation.height} alt="" loading="lazy" />
          </span>
          <span className="program-event__invitation-cue">
            <Eye aria-hidden="true" />
            Pozrieť pozvánku
          </span>
        </span>
      ) : null}
    </>
  );

  if (invitation && onOpenInvitation) {
    return (
      <button
        className="program-event program-event--interactive"
        type="button"
        aria-label={`Zobraziť pozvánku: ${event.title}, ${event.date}`}
        aria-controls="program-invitation-dialog"
        aria-haspopup="dialog"
        onClick={() => onOpenInvitation(invitation)}
      >
        {content}
      </button>
    );
  }

  return (
    <article className="program-event" tabIndex={0}>
      {content}
    </article>
  );
}
