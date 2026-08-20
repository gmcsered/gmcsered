import { useEffect, useRef } from "react";

export type InvitationImage = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

type InvitationLightboxProps = {
  invitation: InvitationImage;
  id: string;
  label: string;
  onClose: () => void;
};

export function InvitationLightbox({ invitation, id, label, onClose }: InvitationLightboxProps) {
  const dialogRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.classList.add("program-invitation-open");
    document.addEventListener("keydown", closeOnEscape);
    window.requestAnimationFrame(() => dialogRef.current?.focus());

    return () => {
      document.body.classList.remove("program-invitation-open");
      document.removeEventListener("keydown", closeOnEscape);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div className="program-invitation-modal" role="presentation">
      <button className="program-invitation-modal__backdrop" type="button" aria-label="Zatvoriť pozvánku" onClick={onClose} />
      <section
        className="program-invitation-modal__panel"
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        ref={dialogRef}
        tabIndex={-1}
      >
        <div className="program-invitation-modal__header">
          <button className="program-invitation-modal__close" type="button" aria-label="Zatvoriť pozvánku" onClick={onClose}>
            ×
          </button>
        </div>
        <img src={invitation.src} width={invitation.width} height={invitation.height} alt={invitation.alt} />
      </section>
    </div>
  );
}
