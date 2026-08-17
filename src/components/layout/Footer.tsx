import { ExternalLink } from "lucide-react";
import { churchContent, getContactLinks } from "../../content/churchContent";

const isExternal = (href: string) => href.startsWith("http");

export function Footer() {
  const links = getContactLinks();

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__column site-footer__column--identity">
          <div className="site-footer__identity">
            <img
              className="site-footer__logo"
              src={churchContent.identity.logo.src}
              width={churchContent.identity.logo.width}
              height={churchContent.identity.logo.height}
              alt=""
              aria-hidden="true"
            />
            <div className="site-footer__identity-copy">
              <div className="footer-brand">{churchContent.identity.displayName}</div>
              <p>
                {churchContent.identity.officialName}
                <br />
                {churchContent.identity.denomination}
              </p>
              <p className="footer-office">
                sídlo ústredie: Panenská 10
                <br />
                811 03 Bratislava 1, IČO: 00468053
                <br />
                Zbor Sereď
              </p>
            </div>
          </div>
        </div>

        <div className="site-footer__column">
          <h2>Adresa</h2>
          <p>
            Dlhá 2337/6 (Dlhá 6)
            <br />
            926 01 Sereď
          </p>
          <p>Nedeľná bohoslužba o 9:30</p>
          <p className="footer-tagline">Miesto, kde si vítaný.</p>
        </div>

        <div className="site-footer__column">
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
