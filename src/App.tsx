import { type ReactElement, useEffect, useState } from "react";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { MetaTags } from "./components/layout/MetaTags";
import { churchContent } from "./content/churchContent";
import { FirstVisitPage } from "./pages/FirstVisitPage";
import { HomePage } from "./pages/HomePage";
import {
  AboutPage,
  BeliefsPage,
  ChurchLifePage,
  CommunityPage,
  ContactPage,
  ProgramPage,
  SermonsPage,
} from "./pages/ContentPages";

const normalizePath = (pathname: string) =>
  pathname.replace(/\/+$/, "") || "/";

export default function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const updatePath = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", updatePath);

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest<HTMLAnchorElement>("a[data-route]");

      if (!anchor || anchor.target || anchor.origin !== window.location.origin) {
        return;
      }

      event.preventDefault();
      window.history.pushState({}, "", anchor.href);
      updatePath();
      window.dispatchEvent(new Event("routechange"));

      if (anchor.hash) {
        requestAnimationFrame(() => {
          document.querySelector(anchor.hash)?.scrollIntoView({ behavior: "smooth" });
        });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("popstate", updatePath);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const routes: Record<string, { page: ReactElement; seo: typeof churchContent.seo.home }> = {
    "/": { page: <HomePage />, seo: churchContent.seo.home },
    "/kto-sme": { page: <AboutPage />, seo: churchContent.seo.about },
    "/comu-verime": { page: <BeliefsPage />, seo: churchContent.seo.beliefs },
    "/spolocenstvo": { page: <CommunityPage />, seo: churchContent.seo.community },
    "/zivot-zboru": { page: <ChurchLifePage />, seo: churchContent.seo.churchLife },
    "/program": { page: <ProgramPage />, seo: churchContent.seo.program },
    "/kazne": { page: <SermonsPage />, seo: churchContent.seo.sermons },
    "/prva-navsteva": { page: <FirstVisitPage />, seo: churchContent.seo.firstVisit },
    "/kontakt": { page: <ContactPage />, seo: churchContent.seo.contact },
  };

  const route = routes[path] ?? routes["/"];

  return (
    <>
      <MetaTags page={route.seo} path={routes[path] ? path : "/"} />
      <a className="skip-link" href="#hlavny-obsah">
        Preskočiť na obsah
      </a>
      <Header />
      <main id="hlavny-obsah">
        {route.page}
      </main>
      <Footer />
    </>
  );
}
