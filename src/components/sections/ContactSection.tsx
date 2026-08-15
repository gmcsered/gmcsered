import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { churchContent } from "../../content/churchContent";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

export function ContactSection() {
  const { contact, address, facebook, youtube, site, location } = churchContent;

  const links = [
    contact.phone
      ? { label: contact.phone, href: `tel:${contact.phone.replace(/\s+/g, "")}`, icon: Phone, external: false }
      : null,
    contact.email ? { label: contact.email, href: `mailto:${contact.email}`, icon: Mail, external: false } : null,
    facebook.url ? { label: facebook.name, href: facebook.url, icon: ExternalLink, external: true } : null,
    youtube.enabled && youtube.channelUrl ? { label: "YouTube kanál Ján Tagaj", href: youtube.channelUrl, icon: ExternalLink, external: true } : null,
    site.nationalWebsiteUrl
      ? { label: site.nationalWebsiteLabel, href: site.nationalWebsiteUrl, icon: ExternalLink, external: true }
      : null,
  ].filter(Boolean) as {
    label: string;
    href: string;
    icon: typeof Mail;
    external: boolean;
  }[];

  return (
    <section className="section section--warm contact" id="kontakt">
      <div className="container contact-grid">
        <Reveal>
          <SectionHeading title="Kontakt" />
          <p>
            {address.street}, {address.city}
          </p>
          <p>Nedeľná bohoslužba o {churchContent.service.time}</p>
          <a className="button button--primary" href={location.mapUrl} target="_blank" rel="noopener noreferrer">
            <MapPin aria-hidden="true" />
            Otvoriť v Mapách
          </a>
        </Reveal>

        <Reveal className="contact-links" aria-label="Kontaktné odkazy">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
              >
                <Icon aria-hidden="true" />
                {link.label}
              </a>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
