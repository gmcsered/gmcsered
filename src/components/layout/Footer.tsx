import { ExternalLink } from "lucide-react";
import { churchContent, getContactLinks } from "../../content/churchContent";

const isExternal = (href: string) => href.startsWith("http");

export function Footer() {
  const links = getContactLinks();

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <div className="footer-brand">{churchContent.identity.displayName}</div>
          <p>
            {churchContent.identity.officialName}
            <br />
            {churchContent.identity.denomination}
          </p>
          <p className="footer-tagline">{churchContent.identity.tagline}</p>
        </div>

        <div>
          <h2>Adresa</h2>
          <p>
            {churchContent.address.street}
            <br />
            {churchContent.address.city}
          </p>
          <p>{churchContent.service.title} o {churchContent.service.time}</p>
        </div>

        <div>
          <h2>Odkazy</h2>
          <ul className="footer-links">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target={isExternal(link.href) ? "_blank" : undefined}
                  rel={isExternal(link.href) ? "noopener noreferrer" : undefined}
                >
                  {link.label}
                  {isExternal(link.href) ? <ExternalLink aria-hidden="true" /> : null}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {churchContent.identity.displayName}</span>
      </div>
    </footer>
  );
}
