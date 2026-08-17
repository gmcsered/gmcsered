import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { churchContent } from "../../content/churchContent";
import { routePath, withSiteBase } from "../../utils/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState(() => routePath(window.location.pathname));

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  useEffect(() => {
    const updateRouteState = () => setActiveHref(routePath(window.location.pathname));
    window.addEventListener("popstate", updateRouteState);
    window.addEventListener("routechange", updateRouteState);
    return () => {
      window.removeEventListener("popstate", updateRouteState);
      window.removeEventListener("routechange", updateRouteState);
    };
  }, []);

  const closeMenu = () => setOpen(false);
  const navClass = (href: string) => (routePath(href) === activeHref ? "is-active" : "");
  const ariaCurrent = (href: string) => (routePath(href) === activeHref ? "location" : undefined);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="brand" href={withSiteBase("/")} data-route onClick={closeMenu}>
          <img
            src={churchContent.identity.logo.src}
            width={churchContent.identity.logo.width}
            height={churchContent.identity.logo.height}
            alt={churchContent.identity.logo.alt}
          />
          <span>{churchContent.identity.shortName}</span>
        </a>

        <nav className="desktop-nav" aria-label="Hlavná navigácia">
          {churchContent.nav.map((item) => (
            <a key={item.href} href={withSiteBase(item.href)} data-route className={navClass(item.href)} aria-current={ariaCurrent(item.href)}>
              {item.label}
            </a>
          ))}
        </nav>

        <a className="button button--primary header-action" href={withSiteBase("/prva-navsteva")} data-route>
          Navštív nás
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? "Zavrieť navigáciu" : "Otvoriť navigáciu"}
          aria-expanded={open}
          aria-controls="mobilna-navigacia"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      <div className={`mobile-panel ${open ? "is-open" : ""}`} id="mobilna-navigacia">
        <nav aria-label="Mobilná navigácia">
          {churchContent.nav.map((item) => (
            <a key={item.href} href={withSiteBase(item.href)} data-route onClick={closeMenu} className={navClass(item.href)} aria-current={ariaCurrent(item.href)}>
              {item.label}
            </a>
          ))}
          <a className="button button--primary" href={withSiteBase("/prva-navsteva")} data-route onClick={closeMenu}>
            Navštív nás
          </a>
        </nav>
      </div>
    </header>
  );
}
