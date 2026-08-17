import { churchLifeGalleries } from "./churchLifeGalleries";
import { siteAsset, withSiteBase } from "../utils/site";

export type ImageAsset = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
};

export type ResponsiveImageAsset = ImageAsset & {
  sources: {
    src: string;
    width: number;
    height: number;
    media?: string;
  }[];
};

export type LinkTarget = {
  label: string;
  href: string;
};

export type Activity = {
  title: string;
  text: string;
  image?: ImageAsset;
};

export type ActivityGroup = {
  title: string;
  text: string;
  image: ImageAsset;
  items: string[];
  reveal: string;
};

export type GalleryImage = ImageAsset & {
  category: string;
};

export type EventItem = {
  title: string;
  when: string;
  where: string;
  text: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type SeoPage = {
  title: string;
  description: string;
  image: string;
};

export type LeadershipPerson = {
  role: "Kazateľ" | "Superintendentka" | "Biskup";
  name: string;
  image: ImageAsset | null;
  description: string;
  profileUrl?: string;
  enabled: boolean;
};

const asset = (src: string, width: number, height: number, alt: string, caption?: string): ImageAsset => ({
  src,
  width,
  height,
  alt,
  caption,
});

const mapUrl = "https://www.google.com/maps/search/?api=1&query=48.29376336953857%2C17.733573520375433";

const iaAsset = (file: string, width: number, height: number, alt: string, caption?: string) =>
  asset(`/assets/church/ia/${file}`, width, height, alt, caption);

const iaImages = {
  homeWorship: iaAsset(
    "home-worship-hero.webp",
    1800,
    1125,
    "Zbor GMC Sereď počas spoločných chvál",
  ),
  aboutPeople: iaAsset(
    "about-people-laughing.webp",
    1400,
    980,
    "Ľudia zo zboru GMC Sereď počas spoločného času pri káve",
  ),
  aboutFriendship: iaAsset(
    "about-friendship.webp",
    1000,
    1250,
    "Dve ženy zo zboru GMC Sereď v srdečnom objatí",
  ),
  aboutWomen: iaAsset(
    "about-women.webp",
    1200,
    900,
    "Tri ženy zo zboru GMC Sereď po spoločnom stretnutí",
  ),
  beliefsCross: {
    ...iaAsset(
      "beliefs-cross-hero.jpg",
      1536,
      1024,
      "Monumentálny kríž na vrchu pri východe slnka",
    ),
    sources: [
      {
        src: "/assets/church/ia/beliefs-cross-hero.jpg",
        width: 1536,
        height: 1024,
        media: "(min-width: 0px)",
      },
    ],
  } satisfies ResponsiveImageAsset,
  communityCoffee: iaAsset(
    "community-coffee.webp",
    1000,
    1250,
    "Dve ženy zo zboru GMC Sereď pri káve",
    "Rozhovory pri káve",
  ),
  communityConversations: iaAsset(
    "community-conversations.webp",
    1400,
    980,
    "Ľudia zo zboru GMC Sereď pri rozhovoroch a občerstvení",
    "Po bohoslužbe",
  ),
  communityFood: iaAsset(
    "community-food.webp",
    1200,
    900,
    "Koláče a občerstvenie pripravené na spoločný čas",
    "Niečo dobré pod zub",
  ),
  communityFamilyDay: iaAsset(
    "community-family-day.webp",
    1400,
    980,
    "Rodiny a priatelia z GMC Sereď počas spoločného dňa vonku",
    "Spoločný deň",
  ),
  childrenRoom: iaAsset(
    "children-room.webp",
    1400,
    980,
    "Deti počas programu v priestoroch zboru GMC Sereď",
  ),
  childrenStage: iaAsset(
    "children-and-youth-stage.webp",
    1400,
    980,
    "Deti a mladí počas spoločného programu v zbore GMC Sereď",
  ),
  worshipTeam: iaAsset(
    "worship-team.webp",
    1400,
    980,
    "Hudobníci počas chvál v zbore GMC Sereď",
  ),
  worshipCongregation: iaAsset(
    "worship-congregation-wide.webp",
    1400,
    980,
    "Zbor GMC Sereď počas nedeľnej bohoslužby",
  ),
  firstVisitEntrance: iaAsset(
    "first-visit-entrance.webp",
    1400,
    980,
    "Ľudia pri vstupe do priestorov zboru GMC Sereď",
  ),
  firstVisitFamily: iaAsset(
    "first-visit-family.webp",
    1000,
    1250,
    "Rodinný moment v zbore GMC Sereď",
  ),
  welcomeEmbrace: iaAsset(
    "welcome-embrace.webp",
    1000,
    1250,
    "Srdečné privítanie v zbore GMC Sereď",
  ),
  sermonsBible: iaAsset(
    "sermons-bible-hero.webp",
    1800,
    1125,
    "Otvorená Biblia pri okne s modrou oblohou",
  ),
  sermonsPreacher: iaAsset(
    "sermons-preacher.webp",
    1200,
    900,
    "Ján Tagaj v priestore zboru GMC Sereď",
    "Pastor Ján Tagaj",
  ),
  contactExterior: asset(
    "/assets/church/location/vstup-01.webp",
    1200,
    900,
    "Vstup do budovy, kde sa stretáva zbor GMC Sereď",
  ),
  contactBanner: asset(
    "/assets/church/location/banner-gmc-contain.webp",
    1200,
    900,
    "Označenie GMC Sereď v priestoroch zboru",
  ),
  aboutChildrenMoment: iaAsset(
    "about-children-moment.jpg",
    1050,
    1400,
    "Mladý človek drží malé dieťa počas stretnutia zboru GMC Sereď",
    "Miesto pre rodiny",
  ),
  aboutMenTable: iaAsset(
    "about-men-table.jpg",
    1400,
    1050,
    "Dvaja muži zo zboru GMC Sereď pri spoločnom stole",
    "Vzťahy pri stole",
  ),
  aboutFullRoom: iaAsset(
    "about-full-room.jpg",
    1400,
    1050,
    "Plná miestnosť zboru GMC Sereď počas bohoslužby",
    "Spoločné chvály",
  ),
  aboutTwoWomen: iaAsset(
    "about-two-women.jpg",
    1536,
    2048,
    "Dve ženy zo zboru GMC Sereď počas spoločného stretnutia",
    "Vzťahy a prijatie",
  ),
  communityRoomFull: iaAsset(
    "community-room-full.jpg",
    1400,
    1050,
    "Plná miestnosť zboru GMC Sereď počas biblického posolstva",
    "Spoločné stretnutie",
  ),
  communityDesserts: iaAsset(
    "community-desserts.jpg",
    1050,
    1400,
    "Koláče a zákusky pripravené na spoločný čas v GMC Sereď",
    "Sladké rozhovory",
  ),
  communityRoses: iaAsset(
    "community-roses.jpg",
    1050,
    1400,
    "Ján Tagaj s ružami počas spoločného stretnutia zboru",
    "Radosť a vďačnosť",
  ),
  contactWorshipTeam: iaAsset(
    "contact-worship-team.jpg",
    1400,
    1050,
    "Chválový tím počas bohoslužby v zbore GMC Sereď",
  ),
  augustProgram: asset(
    "/assets/church/events/august-program.jpg",
    1120,
    1400,
    "Letný augustový program zboru GMC Sereď",
  ),
  hopestreetPhoto: asset(
    "/assets/church/hopestreet/hopestreet-spolocenstvo.jpg",
    1400,
    990,
    "Spoločný čas detí a mladých pri stole v spolupráci s HopeStreet",
    "HopeStreet",
  ),
  hopestreetLogo: asset(
    "/assets/church/hopestreet/hopestreet-logo.jpg",
    500,
    500,
    "Logo HopeStreet",
  ),
  hopestreetProgram: asset(
    "/assets/church/hopestreet/hopestreet-summer-program.jpg",
    1080,
    905,
    "Letný program HopeStreet v GMC Sereď",
  ),
  contactExteriorBanner: asset(
    "/assets/church/location/gmc-sered-exterior-banner.jpg",
    1800,
    1350,
    "Vonkajšie označenie GMC Sereď pri vstupe z Dlhej ulice",
  ),
};

export const churchContent = {
  identity: {
    shortName: "GMC Sereď",
    displayName: "GMC Sereď",
    officialName: "Evanjelická cirkev metodistická",
    denomination: "Global Methodist Church",
    localName: "Zbor Sereď",
    tagline: "Miesto, kde si vítaný.",
    logo: asset(
      "/assets/church/logo/logo-gmc-sered-transparent.png",
      1200,
      1090,
      "Logo zboru GMC Sereď",
    ),
  },
  site: {
    siteUrl: "",
    nationalWebsiteUrl: "https://metodisti.sk",
    nationalWebsiteLabel: "metodisti.sk",
  },
  facebook: {
    name: "GMC Sereď",
    url: "https://www.facebook.com/share/1LUpwXzPsU/?mibextid=wwXIfr",
  },
  youtube: {
    channelName: "Ján Tagaj",
    channelUrl: "https://www.youtube.com/@JanTagaj",
    latestSermonUrl: "",
    enabled: true,
    weeklyMessage: "Nedeľné kázne a biblické vyučovanie",
    latestSermon: {
      enabled: false,
      label: "Posledná kázeň",
      title: "",
      date: "",
      speaker: "",
      url: "",
      image: asset(
        "/assets/church/sermons/kazen-mudrost.webp",
        1400,
        900,
        "Biblické vyučovanie v zbore GMC Sereď",
      ),
    },
  },
  contact: {
    churchName: "GMC Sereď",
    email: "sered@metodisti.sk",
    phone: "",
    messengerUrl: "",
  },
  address: {
    street: "Dlhá 6",
    city: "Sereď",
    country: "Slovensko",
    postalCode: "926 01",
    formatted: "Dlhá 6, Sereď",
  },
  location: {
    coordinates: {
      latitude: 48.29376336953857,
      longitude: 17.733573520375433,
    },
    mapUrl,
    entranceDirections:
      "Zbor sa nachádza na Dlhej ulici č. 6. Hľadajte tabuľu s označením GMC Sereď (viď foto).",
    parkingDescription: "",
    accessibility: "",
  },
  service: {
    title: "Nedeľná bohoslužba",
    day: "Každú nedeľu",
    time: "9:30",
    welcome: "Každý je vítaný.",
    childrenYouthProgram: "Pre deti a mládež je pripravený vlastný program.",
    orientation: [
      "Každú nedeľu o 9:30",
      "Dlhá 6, Sereď",
      "Každý je vítaný",
      "Vlastný program pre deti a mládež",
    ],
  },
  visualFeatures: {
    editorialHeroes: true,
    beliefCrossScroll: true,
    layeredPhotography: true,
    scrollReveal: true,
    firstVisitJourney: true,
    reducedMotionFallback: true,
    sectionDecorations: true,
    contextualSundayMessage: true,
    galleryLightbox: true,
    activeNavigation: true,
  },
  seo: {
    home: {
      title: "GMC Sereď | Miesto, kde si vítaný",
      description:
        "GMC Sereď je kresťanské spoločenstvo v Seredi, kde je každý vítaný. Nedeľné bohoslužby každú nedeľu o 9:30 na Dlhej 6, s vlastným programom pre deti a mládež.",
      image: iaImages.homeWorship.src,
    },
    about: {
      title: "Kto sme | GMC Sereď",
      description:
        "Spoznajte GMC Sereď ako spoločenstvo ľudí, ktorých spája viera v Ježiša Krista, láska, prijatie a skutočné vzťahy.",
      image: iaImages.aboutPeople.src,
    },
    beliefs: {
      title: "Čomu veríme | GMC Sereď",
      description:
        "Naša viera stojí na Ježišovi Kristovi, Božom slove, milosti a láske, ktorá premieňa ľudský život.",
      image: iaImages.beliefsCross.src,
    },
    community: {
      title: "Spoločenstvo | GMC Sereď",
      description:
        "V GMC Sereď radi trávime čas spolu, rozprávame sa, kávičkujeme, jeme, modlíme sa a budujeme skutočné vzťahy.",
      image: iaImages.communityConversations.src,
    },
    churchLife: {
      title: "Život nášho zboru | GMC Sereď",
      description:
        "Pozrite si krátky vizuálny pohľad na nedeľné bohoslužby, chvály, deti, mládež a spoločný život zboru GMC Sereď.",
      image: iaImages.worshipCongregation.src,
    },
    program: {
      title: "Program a zapojenie | GMC Sereď",
      description:
        "Aktuálny program zboru GMC Sereď, augustové stretnutia, pripravované 100. výročie, vodný krst a možnosti zapojenia.",
      image: iaImages.augustProgram.src,
    },
    sermons: {
      title: "Nedeľné kázne | GMC Sereď",
      description:
        "Nedeľné kázne a biblické vyučovanie z GMC Sereď môžete sledovať cez verejný YouTube kanál Ján Tagaj.",
      image: iaImages.sermonsBible.src,
    },
    firstVisit: {
      title: "Prvýkrát u nás | GMC Sereď",
      description:
        "Pokojný a stručný sprievodca prvou návštevou zboru GMC Sereď. Príďte bez prihlasovania, v pohodlnom oblečení a bez tlaku.",
      image: iaImages.aboutChildrenMoment.src,
    },
    contact: {
      title: "Kontakt a návšteva | GMC Sereď",
      description:
        "Adresa, čas nedeľnej bohoslužby, správny vstup do budovy, kontakt a odkazy na GMC Sereď.",
      image: iaImages.worshipCongregation.src,
    },
  },
  pages: {
    home: {
      path: "/",
      hero: {
        eyebrow: "Viera. Spoločenstvo. Nádej.",
        heading: "Miesto, kde si vítaný.",
        text:
          "Sme spoločenstvo ľudí, ktorých spája viera v Ježiša Krista, láska k Bohu a túžba vytvárať miesto prijatia.",
        image: iaImages.homeWorship,
        primaryAction: { label: "Prvýkrát u nás", href: "/prva-navsteva", route: true },
        secondaryAction: { label: "Čomu veríme", href: "/comu-verime", route: true },
      },
      invitation: {
        heading: "Každý je vítaný.",
        text:
          "Pre deti a mládež je pripravený vlastný program. Nemusíte prísť pripravení, stačí prísť otvorene a prirodzene.",
        facts: ["Každú nedeľu o 9:30", "Dlhá 6, Sereď", "Vlastný program pre deti a mládež"],
        promoVideo: {
          heading: "Pozrite si, ako vyzerá život nášho zboru.",
          text: "Niekoľko chvíľ zo spoločenstva, chvál a spoločného času v GMC Sereď.",
          src: "/assets/church/media/promo-video-final-sk.mp4",
          poster: iaImages.homeWorship,
          label: "Promo video zboru GMC Sereď",
        },
      },
      chapters: [
        {
          title: "Kto sme",
          href: "/kto-sme",
          text: "Sme ľudia, ktorí našli nádej v Ježišovi Kristovi a chcú žiť vieru v reálnych vzťahoch.",
          image: iaImages.aboutPeople,
          route: true,
        },
        {
          title: "Čomu veríme",
          href: "/comu-verime",
          text: "Naša viera stojí na Ježišovi Kristovi, Božom slove a milosti, ktorá premieňa život.",
          image: iaImages.beliefsCross,
          route: true,
        },
        {
          title: "Spoločenstvo",
          href: "/spolocenstvo",
          text: "Radi sa rozprávame, kávičkujeme, jeme, modlíme sa a budujeme skutočné vzťahy.",
          image: iaImages.communityConversations,
          route: true,
        },
        {
          title: "Život zboru",
          href: "/zivot-zboru",
          text: "Krátky vizuálny pohľad na bohoslužby, chvály, deti, mládež a spoločné stretnutia.",
          image: iaImages.worshipCongregation,
          route: true,
        },
        {
          title: "Program",
          href: "/program",
          text: "Augustové stretnutia, krst, 100. výročie a možnosti zapojenia do života zboru.",
          image: iaImages.augustProgram,
          route: true,
        },
        {
          title: "Nedeľné kázne",
          href: "/kazne",
          text: "Biblické posolstvá si môžete pozrieť pokojne z domu cez YouTube kanál Ján Tagaj.",
          image: iaImages.sermonsBible,
          route: true,
        },
        {
          title: "Prvýkrát u nás",
          href: "/prva-navsteva",
          text: "Stručne a ľudsky: kam prísť, čo čakať a prečo sa nemusíte báť prvej návštevy.",
          image: iaImages.aboutChildrenMoment,
          route: true,
        },
        {
          title: "Kontakt a návšteva",
          href: "/kontakt",
          text: "Adresa, správny vstup, čas bohoslužby, mapa a priame kontakty na zbor.",
          image: iaImages.worshipCongregation,
          route: true,
        },
      ],
      finalCta: {
        heading: "Príďte medzi nás.",
        text:
          "Najlepšie sa spoločenstvo spozná osobne. V nedeľu o 9:30 vás radi privítame na Dlhej 6 v Seredi.",
        action: { label: "Prídem v nedeľu", href: "/prva-navsteva", route: true },
        leadership: [
          { label: "Pastor", name: "Ján Tagaj" },
          { label: "Konferenčná superintendentka", name: "Mgr. Gabriella Kopas, PhD." },
        ],
      },
    },
    about: {
      path: "/kto-sme",
      eyebrow: "Kto sme",
      heading: "Sme ľudia, ktorí našli nádej v Ježišovi Kristovi.",
      intro: "Spoločenstvo, do ktorého môžete prísť presne takí, akí ste.",
      image: iaImages.aboutFullRoom,
      paragraphs: [
        "Sme Evanjelická cirkev metodistická na Slovensku a patríme medzi štátom registrované cirkvi. Prívlastok evanjelická v jej názve vyjadruje, že zvestuje evanjelium: posolstvo o Božej láske ku všetkým ľuďom v osobe Ježiša Krista.",
        "V Seredi sa stretávame už od roku 1926. Aktuálne je naším pastorom Ján Tagaj.",
        "Spolu sa modlíme, radujeme, rastieme, pomáhame si, rozprávame sa a zdieľame život. Radi medzi nami privítame aj vás.",
      ],
      quote: "Cirkev nie je budova. Cirkev sú ľudia.",
      collage: [iaImages.aboutTwoWomen],
      cta: { label: "Spoznajte život nášho zboru", href: "/zivot-zboru", route: true },
      next: { label: "Pokračovať na Čomu veríme", href: "/comu-verime", route: true, image: iaImages.beliefsCross },
    },
    beliefs: {
      path: "/comu-verime",
      eyebrow: "Čomu veríme",
      heading: "Čomu veríme",
      subheading: "Naša nádej stojí na Ježišovi Kristovi.",
      intro:
        "Naša viera stojí na Ježišovi Kristovi, Božom slove a Božej láske, ktorá premieňa ľudský život.",
      image: iaImages.beliefsCross,
      scripture: {
        citation: "Ján 3:16",
        text:
          "„Lebo tak Boh miloval svet, že dal svojho jednorodeného Syna, aby nezahynul nik, kto v neho verí, ale mal večný život.“",
      },
      items: [
        {
          title: "Ježiš Kristus je našou nádejou.",
          text: "V Ježišovi Kristovi nachádzame odpustenie, nový začiatok a skutočnú nádej.",
        },
        {
          title: "Boh miluje každého človeka.",
          text: "Každý človek má hodnotu a je hodný lásky, prijatia a úcty.",
        },
        {
          title: "Biblia je naším základom.",
          text: "V Božom slove hľadáme pravdu, múdrosť a smer pre každodenný život.",
        },
        {
          title: "Milosť mení život.",
          text: "Božia milosť je dostupná každému a vedie nás k slobode, uzdraveniu a novému životu.",
        },
        {
          title: "Láska sa prejavuje vo vzťahoch.",
          text: "Vieru chceme žiť cez lásku, porozumenie, odpustenie, službu a pomoc druhým.",
        },
      ],
      cta: { label: "Spoznať naše spoločenstvo", href: "/spolocenstvo", route: true },
      next: { label: "Pokračovať na Spoločenstvo", href: "/spolocenstvo", route: true, image: iaImages.communityConversations },
    },
    community: {
      path: "/spolocenstvo",
      eyebrow: "Spoločenstvo",
      heading: "Spolu je život krajší.",
      intro:
        "Pre nás cirkev nekončí poslednou piesňou. Zostávame spolu, rozprávame sa, zdieľame radosti aj starosti a budujeme skutočné vzťahy.",
      image: iaImages.communityRoomFull,
      statements: [
        "Radi sa rozprávame.",
        "Radi kávičkujeme.",
        "Radi spolu jeme.",
        "Radi si navzájom pomáhame.",
        "Radi zdieľame radosti aj starosti.",
      ],
      quote: "Pri dobrom jedle a káve sa často začínajú tie najlepšie rozhovory.",
      collage: [iaImages.communityRoomFull, iaImages.communityDesserts, iaImages.communityRoses],
      cta: { label: "Príďte nás osobne spoznať", href: "/prva-navsteva", route: true },
      next: { label: "Pokračovať na Život zboru", href: "/zivot-zboru", route: true, image: iaImages.worshipCongregation },
    },
    churchLife: {
      path: "/zivot-zboru",
      eyebrow: "Život zboru",
      heading: "Skutočné chvíle zo života nášho zboru.",
      intro:
        "Krátky výber fotografií ukazuje to najdôležitejšie: spoločné chvály, deti a mládež, rozhovory, rodiny a obyčajný čas, ktorý nás spája.",
      image: iaImages.worshipCongregation,
      galleries: churchLifeGalleries,
      hopestreet: {
        eyebrow: "Spolupráca",
        heading: "Spolupráca s HopeStreet",
        text:
          "Sme vďační za spoluprácu s HopeStreet, ktorá prináša priestor pre deti, mladých a vzťahy v prirodzenom prostredí.",
        facebookUrl: "https://www.facebook.com/hopestreet.sk",
        logo: iaImages.hopestreetLogo,
        poster: iaImages.hopestreetProgram,
      },
      cta: { label: "Pozrieť program", href: "/program", route: true },
      next: { label: "Pokračovať na Program", href: "/program", route: true, image: iaImages.augustProgram },
    },
    program: {
      path: "/program",
      eyebrow: "Program",
      heading: "Program a zapojenie",
      intro:
        "Najbližšie stretnutia, pripravované chvíle a možnosti, ako sa zapojiť do života zboru GMC Sereď.",
      image: iaImages.augustProgram,
      contextImage: iaImages.communityRoomFull,
      actionsHeading: "Čo pripravujeme a kde sa dá zapojiť",
      actions: [
        {
          title: "Pripravujeme 100. výročie",
          text: "Pripravujeme 100. výročie stretávania metodistického spoločenstva v Seredi.",
        },
        {
          title: "Vodný krst",
          text: "Ak premýšľate nad krstom alebo máte otázky, radi sa s vami osobne porozprávame.",
        },
        {
          title: "Zapojenie do služby",
          text: "Do života zboru sa dá zapojiť praktickou pomocou, hudbou, modlitbou alebo službou ľuďom.",
        },
        {
          title: "Chcem sa stať členom",
          text: "Radi vysvetlíme, čo členstvo znamená a ako môže vyzerať ďalší krok.",
        },
        {
          title: "Možnosť prispieť cez QR kód",
          text: "Možnosť prispieť cez QR kód pripravujeme a doplníme po schválení.",
        },
      ],
      cta: { label: "Napísať nám", href: "mailto:sered@metodisti.sk" },
      next: { label: "Pokračovať na Nedeľné kázne", href: "/kazne", route: true, image: iaImages.sermonsBible },
    },
    sermons: {
      path: "/kazne",
      eyebrow: "Nedeľné kázne",
      heading: "Božie slovo zrozumiteľne pre dnešný život.",
      intro:
        "Ak nás chcete najskôr spoznať pokojne z domu, môžete si pozrieť nedeľné kázne a biblické vyučovanie.",
      image: iaImages.sermonsBible,
      previewImage: iaImages.sermonsPreacher,
      channelAction: { label: "Pozrieť YouTube kanál Jána Tagaja", href: "https://www.youtube.com/@JanTagaj" },
      latestLabel: "Posledná kázeň",
      latestUnavailable: "Konkrétny odkaz na poslednú kázeň doplníme po overení.",
      cta: { label: "Prvýkrát u nás", href: "/prva-navsteva", route: true },
      next: { label: "Pokračovať na Prvýkrát u nás", href: "/prva-navsteva", route: true, image: iaImages.aboutChildrenMoment },
    },
    firstVisit: {
      path: "/prva-navsteva",
      eyebrow: "Prvýkrát u nás?",
      heading: "To je úplne v poriadku.",
      intro:
        "Možno neviete, čo očakávať. Možno máte otázky alebo trochu obáv. Nemusíte sa ničoho báť, radi vás privítame presne takých, akí ste.",
      image: iaImages.aboutChildrenMoment,
      secondaryImage: iaImages.aboutChildrenMoment,
      steps: [
        { title: "Prídete", text: "Na adresu Dlhá 6 v Seredi môžete prísť niekoľko minút pred začiatkom." },
        { title: "Nájdete si miesto", text: "Sadnite si tam, kde sa budete cítiť príjemne. Ak nebudete vedieť kam, radi pomôžeme." },
        { title: "Bohoslužba", text: "Spoločné chvály, modlitba a biblické posolstvo. Môžete sa iba pozerať." },
        { title: "Spoločný čas", text: "Po bohoslužbe sa radi rozprávame, kávičkujeme a pri niektorých stretnutiach spolu aj jeme." },
      ],
      reassurances: [
        "Každý je vítaný.",
        "Bez prihlasovania.",
        "Nemusíte byť veriaci.",
        "Pre deti a mládež je pripravený vlastný program.",
        "Môžete sa iba pozerať.",
        "Príďte v pohodlnom oblečení.",
      ],
      cta: { label: "Prídem v nedeľu", href: "/kontakt", route: true },
      routeAction: { label: "Zobraziť cestu", href: mapUrl },
      sermonAction: { label: "Pozrieť nedeľnú kázeň", href: "https://www.youtube.com/@JanTagaj" },
      next: { label: "Pokračovať na Kontakt a návštevu", href: "/kontakt", route: true, image: iaImages.worshipCongregation },
    },
    contact: {
      path: "/kontakt",
      eyebrow: "Kontakt a návšteva",
      heading: "Radi vás osobne privítame.",
      intro: "Stretávame sa každú nedeľu o 9:30 na adrese Dlhá 6 v Seredi.",
      image: iaImages.worshipCongregation,
      secondaryImage: iaImages.contactWorshipTeam,
      exteriorImage: iaImages.contactExteriorBanner,
      facts: ["Každú nedeľu o 9:30", "Dlhá 6, Sereď", "Každý je vítaný", "Vlastný program pre deti a mládež"],
      cta: { label: "Otvoriť v Mapách", href: mapUrl },
      next: { label: "Späť na domov", href: "/", route: true, image: iaImages.homeWorship },
    },
  },
  hero: {
    eyebrow: "Viera. Spoločenstvo. Nádej.",
    image: {
      ...asset(
        "/assets/church/hero/hero-spolocenstvo-nedela-desktop.webp",
        1920,
        1080,
        "Zbor GMC Sereď počas spoločných chvál",
      ),
      sources: [
        {
          src: "/assets/church/hero/hero-spolocenstvo-nedela-mobile.webp",
          width: 900,
          height: 1200,
          media: "(max-width: 640px)",
        },
        {
          src: "/assets/church/hero/hero-spolocenstvo-nedela-tablet.webp",
          width: 1400,
          height: 1050,
          media: "(max-width: 1040px)",
        },
      ],
    } satisfies ResponsiveImageAsset,
    headline: "Miesto, kde si vítaný.",
    text: [
      "Sme ľudia, ktorých spája viera v Ježiša Krista, láska k Bohu a túžba vytvárať miesto, kde sa môže každý cítiť prijatý.",
      "Každý je vítaný.",
      "Pre deti a mládež je počas bohoslužby pripravený vlastný program.",
    ],
    primaryAction: "Príď na bohoslužbu",
    secondaryAction: "Pozrieť nedeľné kázne",
  },
  firstVisitPreview: {
    eyebrow: "Prvýkrát u nás",
    heading: "Stačí jeden krok. Medzi nami máte miesto.",
    intro:
      "Možno prídete s otázkami alebo trochu s obavou. Nemusíte nič predstierať ani vedieť, ako bohoslužba prebieha. Jednoducho príďte takí, akí ste.",
    highlight: "Každý je vítaný. Aj vy.",
    backgroundImage: asset(
      "/assets/church/first-visit/prva-navsteva-wow-chvaly.webp",
      1600,
      1000,
      "Zbor GMC Sereď počas spoločných chvál",
    ),
    image: asset(
      "/assets/church/first-visit/prva-navsteva-wow-kava.webp",
      900,
      1200,
      "Rozhovor pri káve v zbore GMC Sereď",
      "Rozhovory pri káve",
    ),
    secondaryImage: asset(
      "/assets/church/first-visit/prva-navsteva-wow-stol.webp",
      1200,
      900,
      "Spoločný čas pri stole v zbore GMC Sereď",
      "Spoločný čas pri stole",
    ),
    serviceCard: {
      label: "Nedeľa",
      time: "9:30",
      place: "Dlhá 6, Sereď",
    },
    items: [
      {
        title: "Môžete prísť takí, akí ste",
        text:
          "Nemusíte mať pripravené odpovede ani špeciálne oblečenie. Stačí prísť prirodzene.",
      },
      {
        title: "Pomôžeme vám zorientovať sa",
        text:
          "Ak nebudete vedieť, kam ísť alebo kde si sadnúť, radi vám s tým pomôžeme.",
      },
      {
        title: "Deti a mládež majú svoj program",
        text:
          "Počas bohoslužby je pre deti a mládež pripravený vlastný program primeraný ich veku.",
      },
    ],
  },
  about: {
    eyebrow: "Kto sme",
    heading: "Sme ľudia, ktorí našli nádej v Ježišovi Kristovi.",
    text: [
      "Každý z nás prišiel z iného prostredia a s iným životným príbehom.",
      "Spája nás viera, láska k Bohu a túžba vytvárať miesto, kde sa môže každý cítiť prijatý, vypočutý a pochopený.",
      "Veríme, že cirkev nie je budova.",
      "Cirkev sú ľudia.",
      "Ľudia, ktorí sa spolu modlia, radujú, rastú, pomáhajú si, rozprávajú sa a zdieľajú život.",
      "Radi medzi nami privítame aj vás.",
    ],
    pullQuote: "Cirkev nie je miesto, kam prídete. Cirkev je spoločenstvo, do ktorého patríte.",
    image: asset(
      "/assets/church/editorial/kto-sme-objatie.webp",
      1200,
      1500,
      "Srdečné objatie počas stretnutia zboru GMC Sereď",
    ),
    secondaryImage: asset(
      "/assets/church/editorial/kto-sme-spolocenstvo.webp",
      1200,
      900,
      "Ľudia zo zboru GMC Sereď pri spoločnom stretnutí",
    ),
    nationalLink: {
      label: "Viac o Evanjelickej cirkvi metodistickej",
      href: "https://metodisti.sk",
    },
  },
  beliefs: {
    heading: "Čomu veríme",
    intro:
      "Naša viera stojí na Ježišovi Kristovi, Božom slove a Božej láske, ktorá premieňa ľudský život.",
    background: {
      ...asset(
        "/assets/church/editorial/comu-verime-kriz-desktop.webp",
        1920,
        1080,
        "Kríž na vrchu pri východe slnka",
      ),
      sources: [
        {
          src: "/assets/church/editorial/comu-verime-kriz-mobile.webp",
          width: 900,
          height: 1200,
          media: "(max-width: 640px)",
        },
        {
          src: "/assets/church/editorial/comu-verime-kriz-tablet.webp",
          width: 1400,
          height: 1050,
          media: "(max-width: 1040px)",
        },
      ],
    } satisfies ResponsiveImageAsset,
    items: [
      {
        title: "Ježiš Kristus je našou nádejou.",
        text: "Veríme, že v Ježišovi Kristovi nachádzame odpustenie, nový začiatok a skutočnú nádej.",
        support: "On je stredom našej viery aj spoločného života.",
      },
      {
        title: "Boh miluje každého človeka.",
        text: "Každý človek má hodnotu a je hodný lásky, prijatia a úcty.",
        support: "Preto chceme vytvárať priestor, kde nikto nemusí predstierať dokonalosť.",
      },
      {
        title: "Biblia je naším základom.",
        text: "V Božom slove hľadáme pravdu, múdrosť a smer pre každodenný život.",
        support: "Čítame ju zrozumiteľne, prakticky a s otvoreným srdcom.",
      },
      {
        title: "Milosť mení život.",
        text: "Veríme, že Božia milosť je dostupná každému a vedie nás k slobode, uzdraveniu a novému životu.",
        support: "Nikto neprichádza hotový. Boh nás pozýva rásť krok za krokom.",
      },
      {
        title: "Láska sa prejavuje vo vzťahoch.",
        text:
          "Vieru nechceme iba vyznávať slovami. Chceme ju žiť cez lásku, porozumenie, odpustenie, službu a pomoc druhým.",
        support: "Viera rastie v konkrétnych rozhovoroch, rodinách, priateľstvách a rozhodnutiach.",
      },
    ],
    link: {
      label: "Viac o našej viere",
      href: "https://metodisti.sk/o-nas/",
    },
  },
  chapterQuotes: [
    {
      text: "Každý je vítaný.",
      image: asset(
        "/assets/church/editorial/kto-sme-spolocenstvo.webp",
        1200,
        900,
        "Ľudia zo zboru GMC Sereď pri spoločnom stretnutí",
      ),
    },
    {
      text: "Cirkev nie je budova. Cirkev sú ľudia.",
      image: asset(
        "/assets/church/editorial/kto-sme-objatie.webp",
        1200,
        1500,
        "Srdečné objatie počas stretnutia zboru GMC Sereď",
      ),
    },
    {
      text: "Viera rastie vo vzťahoch.",
      image: asset(
        "/assets/church/editorial/spolu-family-day.webp",
        1400,
        900,
        "Rodiny a priatelia počas spoločného času zboru",
      ),
    },
  ],
  activities: [
    {
      title: "Nedeľné bohoslužby",
      text: "Spoločne chválime Boha, modlíme sa a počúvame biblické vyučovanie.",
    },
    {
      title: "Chvály a hudba",
      text: "Hudbou a spevom vyjadrujeme vďačnosť Bohu a vytvárame priestor na spoločné uctievanie.",
    },
    {
      title: "Biblické vyučovanie",
      text: "Hľadáme, ako Božie slovo uplatniť v našich vzťahoch, rodinách a každodennom živote.",
    },
    {
      title: "Deti a mládež",
      text: "Počas bohoslužby je pre deti a mládež pripravený vlastný program.",
    },
    {
      title: "Spoločné obedy a stretnutia",
      text: "Radi trávime čas spolu, rozprávame sa a budujeme skutočné vzťahy.",
    },
    {
      title: "Rodinné a komunitné dni",
      text: "Pri niektorých stretnutiach prepájame rozhovory, hry, pohyb a spoločný čas naprieč generáciami.",
    },
  ] satisfies Activity[],
  activityGroups: [
    {
      title: "Spoločne uctievame",
      text: "Nedeľa je pre nás časom modlitby, chvál a počúvania Božieho slova.",
      image: asset(
        "/assets/church/hero/hero-spolocenstvo-nedela-tablet.webp",
        1400,
        1050,
        "Zbor GMC Sereď počas spoločných chvál",
      ),
      items: ["Nedeľné bohoslužby", "Chvály", "Modlitby", "Biblické vyučovanie"],
      reveal: "Srdcom stretnutia je Ježiš Kristus a spoločné hľadanie Božej blízkosti.",
    },
    {
      title: "Spoločne rastieme",
      text: "Viera dozrieva v rozhovoroch, otázkach, rodinách a ochote učiť sa.",
      image: asset(
        "/assets/church/editorial/deti-mladez-program.webp",
        1400,
        900,
        "Program pre deti a mládež v priestoroch zboru",
      ),
      items: ["Deti", "Mládež", "Rodiny", "Duchovný rast"],
      reveal: "Vytvárame priestor, kde sa môžu pýtať deti, mladí aj dospelí.",
    },
    {
      title: "Spoločne žijeme",
      text: "Spoločenstvo pokračuje aj po bohoslužbe pri stole, káve a obyčajných rozhovoroch.",
      image: asset(
        "/assets/church/editorial/spolu-jedlo.webp",
        1000,
        760,
        "Jedlo pripravené na spoločný čas zboru GMC Sereď",
      ),
      items: ["Spoločné obedy", "Spoločná pizza", "Rodinný deň", "Vzťahy a pomoc"],
      reveal: "Pri dobrom jedle a káve sa často začínajú tie najlepšie rozhovory.",
    },
  ] satisfies ActivityGroup[],
  relationships: {
    eyebrow: "Život spolu",
    heading: "Spolu je život krajší",
    text: [
      "Radi spolu trávime čas. Radi sa rozprávame. Radi sa počúvame.",
      "Pre nás cirkev nekončí poslednou piesňou. Zostávame spolu, zdieľame radosti aj starosti a budujeme skutočné vzťahy.",
      "A pri dobrom jedle a káve sa rozhovory vedú ešte o niečo lepšie.",
    ],
    statements: [
      "Radi sa spolu modlíme.",
      "Radi si navzájom pomáhame.",
      "Radi spolu aj jeme, kávičkujeme a dlho sedíme pri rozhovoroch.",
    ],
    images: [
      asset(
        "/assets/church/editorial/spolu-family-day.webp",
        1400,
        900,
        "Spoločný rodinný deň zboru GMC Sereď",
        "Rodinný deň",
      ),
      asset(
        "/assets/church/editorial/spolu-jedlo.webp",
        1000,
        760,
        "Koláče a občerstvenie pripravené na spoločný čas zboru",
        "Niečo dobré pod zub",
      ),
      asset(
        "/assets/church/editorial/spolu-kolac.webp",
        900,
        1100,
        "Dve ženy s domácim koláčom počas spoločného stretnutia",
        "Rozhovory pri jedle",
      ),
      asset(
        "/assets/church/editorial/spolu-vonku.webp",
        1200,
        900,
        "Spoločný čas rodín a priateľov vonku",
        "Vzťahy a radosť",
      ),
    ],
  },
  childrenYouth: {
    eyebrow: "Deti a mládež",
    heading: "Miesto aj pre deti a mladých",
    text: [
      "Počas bohoslužby je pre deti a mládež pripravený vlastný program primeraný ich veku.",
      "Chceme, aby aj oni mohli spoznávať Boha, budovať priateľstvá a cítiť sa medzi nami dobre.",
    ],
    confirmedStatement: "Pre deti a mládež je zabezpečený vlastný program.",
    image: asset(
      "/assets/church/editorial/deti-mladez-program.webp",
      1400,
      900,
      "Program pre deti a mládež počas stretnutia zboru GMC Sereď",
    ),
  },
  leadership: [
    {
      role: "Kazateľ",
      name: "Ján Tagaj",
      image: asset(
        "/assets/church/leadership/jan-tagaj.webp",
        760,
        940,
        "Ján Tagaj, kazateľ zboru GMC Sereď",
      ),
      description: "Kazateľ zboru GMC Sereď",
      enabled: true,
    },
    {
      role: "Superintendentka",
      name: "Gabriella Kopas",
      image: null,
      description: "Konferenčná superintendentka Evanjelickej cirkvi metodistickej na Slovensku",
      enabled: false,
    },
    {
      role: "Biskup",
      name: "Mark Webb",
      image: null,
      description: "Biskup Global Methodist Church pre strednú Európu",
      enabled: false,
    },
  ] satisfies LeadershipPerson[],
  churchLife: {
    heading: "Život nášho zboru",
    text:
      "Sú chvíle chvál, modlitby, detského programu, rozhovorov, rodinných dní aj spoločného jedla. Všetko drží pokope jedna túžba: žiť vieru v reálnych vzťahoch.",
    gallery: [
      {
        ...asset(
          "/assets/church/hero/hero-spolocenstvo-nedela-tablet.webp",
          1400,
          1050,
          "Zbor počas spoločnej nedeľnej bohoslužby",
          "Bohoslužba",
        ),
        category: "Bohoslužba",
      },
      {
        ...asset(
          "/assets/church/worship/chvaly-01.webp",
          1200,
          900,
          "Hudobníci a zbor pri spoločných chválach",
          "Chvály",
        ),
        category: "Chvály",
      },
      {
        ...asset(
          "/assets/church/editorial/deti-mladez-program.webp",
          1400,
          900,
          "Program pre deti a mládež počas stretnutia zboru",
          "Deti a mládež",
        ),
        category: "Deti a mládež",
      },
      {
        ...asset(
          "/assets/church/editorial/kto-sme-spolocenstvo.webp",
          1200,
          900,
          "Ľudia zo zboru pri spoločnom stretnutí",
          "Spoločenstvo",
        ),
        category: "Spoločenstvo",
      },
      {
        ...asset(
          "/assets/church/gallery/spolocny-obed-01.webp",
          1200,
          900,
          "Ľudia zo zboru pri stole počas spoločného obeda",
          "Spoločný obed",
        ),
        category: "Spoločný obed",
      },
      {
        ...asset(
          "/assets/church/editorial/spolu-family-day.webp",
          1400,
          900,
          "Rodiny a priatelia počas spoločného času vonku",
          "Rodinný deň",
        ),
        category: "Rodiny",
      },
      {
        ...asset(
          "/assets/church/editorial/spolu-jedlo.webp",
          1000,
          760,
          "Občerstvenie pripravené pre spoločný čas zboru",
          "Pri stole",
        ),
        category: "Spoločný čas",
      },
      {
        ...asset(
          "/assets/church/gallery/deti-v-bohosluzbe-01.webp",
          900,
          1294,
          "Dieťa počas nedeľnej bohoslužby",
          "Deti sú vítané",
        ),
        category: "Deti",
      },
    ] satisfies GalleryImage[],
  },
  sermons: {
    heading: "Nedeľné kázne online",
    text: [
      "Ak nás chcete najskôr spoznať pokojne z domu, môžete si pozrieť nedeľné kázne a biblické vyučovanie.",
      "Pokojne a bez tlaku. Len otvorené Božie slovo, ktoré hovorí do bežného života.",
    ],
    image: asset(
      "/assets/church/sermons/kazen-mudrost.webp",
      1400,
      900,
      "Ján Tagaj počas biblického vyučovania v zbore GMC Sereď",
    ),
  },
  events: {
    heading: "Najbližšie stretnutie",
    items: [
      {
        title: "Nedeľná bohoslužba",
        when: "Každú nedeľu o 9:30",
        where: "Dlhá 6, Sereď",
        text:
          "Spoločné chvály, modlitba a biblické posolstvo. Nie je potrebné sa vopred prihlasovať.",
      },
    ] satisfies EventItem[],
  },
  visit: {
    eyebrow: "Navštívte nás",
    heading: "Príďte medzi nás.",
    text: [
      "Nemusíte byť veriaci.",
      "Nemusíte vedieť, ako bohoslužba prebieha.",
      "Nemusíte sa špeciálne obliekať ani mať pripravené odpovede.",
      "Môžete jednoducho prísť.",
      "Radi vás privítame, pomôžeme vám zorientovať sa a dáme vám priestor cítiť sa prirodzene.",
      "Každý je vítaný.",
      "Pre deti a mládež je pripravený vlastný program.",
      "A po bohoslužbe sa radi ešte chvíľu porozprávame pri káve alebo niečom dobrom pod zub.",
    ],
    image: asset(
      "/assets/church/location/vstup-interier-01.webp",
      1200,
      900,
      "Vstupný priestor zboru GMC Sereď",
    ),
    secondaryImage: asset(
      "/assets/church/ia/worship-congregation-wide.webp",
      1800,
      1100,
      "Zbor GMC Sereď počas nedeľnej bohoslužby",
    ),
    peopleImage: asset(
      "/assets/church/editorial/kto-sme-spolocenstvo.webp",
      1200,
      900,
      "Ľudia zo zboru GMC Sereď pri spoločnom stretnutí",
    ),
    checklist: [
      "Každú nedeľu o 9:30",
      "Dlhá 6, Sereď",
      "Každý je vítaný",
      "Vlastný program pre deti a mládež",
      "Bez prihlasovania",
    ],
    primaryAction: "Prídem v nedeľu",
    secondaryAction: "Zobraziť cestu",
    sermonAction: "Pozrieť kázeň",
    practical: {
      parking: "",
      entrance:
        "Zbor nájdete v budove naľavo pri vstupe z Dlhej ulice. V budove hľadajte označenie GMC Sereď.",
      accessibility: "",
      childrenProgram: "Pre deti a mládež je pripravený vlastný program.",
      serviceDuration: "",
    },
  },
  faq: [
    {
      id: "clenstvo",
      question: "Musím byť členom cirkvi?",
      answer: "Nie. Na bohoslužbu môže prísť každý.",
    },
    {
      id: "prihlasenie",
      question: "Musím sa vopred prihlásiť?",
      answer: "Nie. Stačí prísť.",
    },
    {
      id: "viera",
      question: "Musím byť veriaci?",
      answer: "Nie. Prísť môže aj človek, ktorý iba hľadá odpovede alebo chce zbor najskôr spoznať.",
    },
    {
      id: "oblecenie",
      question: "Čo si mám obliecť?",
      answer: "Príďte v oblečení, v ktorom sa cítite prirodzene a pohodlne.",
    },
    {
      id: "deti",
      question: "Môžem prísť s deťmi alebo mladými?",
      answer: "Áno. Pre deti a mládež je počas bohoslužby pripravený vlastný program.",
    },
    {
      id: "zapojenie",
      question: "Musím sa počas bohoslužby zapájať?",
      answer: "Nie. Pokojne môžete prísť, sadnúť si a iba sledovať priebeh.",
    },
    {
      id: "prvykrat",
      question: "Čo ak som nikdy predtým v cirkvi nebol?",
      answer: "To vôbec neprekáža. Radi vás privítame a v prípade potreby vám pomôžeme zorientovať sa.",
    },
  ] satisfies FaqItem[],
  bibleVerse: {
    heading: "Slovo nádeje",
    text:
      "„Poďte ku mne všetci, ktorí sa namáhate a ste preťažení, a ja vám dám odpočinutie.“",
    reference: "Matúš 11,28",
    image: asset(
      "/assets/church/editorial/slovo-nadeje-spolocenstvo.webp",
      1600,
      900,
      "Ľudia zo zboru GMC Sereď pri spoločnom stretnutí",
    ),
  },
  finalCta: {
    heading: "Tešíme sa na stretnutie s vami",
    text:
      "Nemusíte mať všetky odpovede ani vedieť, ako bohoslužba prebieha. Stačí prísť.",
    image: asset(
      "/assets/church/editorial/finalne-pozvanie.webp",
      1600,
      900,
      "Spoločný čas zboru GMC Sereď vonku",
    ),
    actions: [
      { label: "Naplánovať prvú návštevu", href: "/prva-navsteva", route: true },
      { label: "Zobraziť cestu", href: mapUrl },
      { label: "Pozrieť kázeň", href: "https://www.youtube.com/@JanTagaj" },
    ],
  },
  firstVisitPage: {
    title: "Prvá návšteva",
    eyebrow: "Prvýkrát u nás?",
    heading: "Prvýkrát u nás?",
    supportingLine: "To je úplne v poriadku.",
    intro: [
      "Možno neviete, čo očakávať.",
      "Možno ste nikdy predtým v kostole neboli.",
      "Možno máte otázky alebo trochu obáv.",
      "Nemusíte sa ničoho báť.",
      "Radi vás privítame presne takých, akí ste.",
      "Každý je vítaný.",
    ],
    image: asset(
      "/assets/church/first-visit/prva-navsteva-objatie.webp",
      1200,
      1500,
      "Úprimné privítanie v zbore GMC Sereď",
    ),
    secondaryImage: asset(
      "/assets/church/first-visit/prva-navsteva-spolu-vonku.webp",
      1200,
      900,
      "Spoločný rodinný čas zboru GMC Sereď",
    ),
    locationImage: asset(
      "/assets/church/ia/worship-congregation-wide.webp",
      1800,
      1100,
      "Zbor GMC Sereď počas nedeľnej bohoslužby",
    ),
    reassurance: {
      heading: "Nemusíte nič dokazovať.",
      lines: [
        "Nemusíte mať všetky odpovede.",
        "Nemusíte sa tváriť, že je všetko v poriadku.",
        "Môžete prísť takí, akí ste.",
      ],
    },
    belonging: {
      heading: "Nech je váš dôvod akýkoľvek, radi vás spoznáme.",
      lines: [
        "Možno prídete iba zo zvedavosti.",
        "Možno hľadáte Boha.",
        "Možno hľadáte pokoj, odpovede alebo ľudí, s ktorými sa dá úprimne rozprávať.",
      ],
    },
    steps: [
      {
        title: "Prídete",
        text: "Na adresu Dlhá 6 v Seredi môžete prísť niekoľko minút pred začiatkom.",
        image: asset(
          "/assets/church/location/vstup-interier-01.webp",
          1200,
          900,
          "Vstupný priestor zboru GMC Sereď",
        ),
      },
      {
        title: "Vojdete",
        text: "Nemusíte vedieť, kam ísť alebo čo robiť. Radi vám pomôžeme zorientovať sa.",
      },
      {
        title: "Nájdete si miesto",
        text: "Sadnite si tam, kde sa budete cítiť príjemne.",
      },
      {
        title: "Začnú chvály",
        text: "Spoločne spievame Bohu. Nemusíte spievať ani sa zapájať, ak nechcete.",
        image: asset(
          "/assets/church/first-visit/prva-navsteva-chvaly.webp",
          1200,
          900,
          "Spoločné chvály počas nedeľnej bohoslužby",
        ),
      },
      {
        title: "Deti a mládež majú svoj program",
        text: "Počas bohoslužby je pre deti a mládež zabezpečený vlastný program.",
        image: asset(
          "/assets/church/editorial/deti-mladez-program.webp",
          1400,
          900,
          "Program pre deti a mládež počas stretnutia zboru",
        ),
      },
      {
        title: "Vypočujete si biblické posolstvo",
        text: "Kázeň prináša Božie slovo zrozumiteľne a prakticky pre dnešný život.",
        image: asset(
          "/assets/church/editorial/prva-navsteva-kazen.webp",
          1200,
          900,
          "Biblické vyučovanie počas nedeľnej bohoslužby",
        ),
      },
      {
        title: "Zostaneme spolu",
        text: "Po bohoslužbe sa radi rozprávame, kávičkujeme a pri niektorých stretnutiach spolu aj jeme.",
        image: asset(
          "/assets/church/first-visit/prva-navsteva-kava-jedlo.webp",
          1200,
          900,
          "Občerstvenie pripravené na spoločný čas zboru",
        ),
      },
    ],
    practical: [
      {
        title: "Kedy a kde",
        text: "Nedeľná bohoslužba sa začína každú nedeľu o 9:30 na adrese Dlhá 6 v Seredi.",
      },
      {
        title: "Vstup do budovy",
        text: "Zbor nájdete v budove naľavo pri vstupe z Dlhej ulice. V budove hľadajte označenie GMC Sereď.",
      },
      {
        title: "Deti a mládež",
        text: "Pre deti a mládež je počas bohoslužby pripravený vlastný program.",
      },
      {
        title: "Oblečenie",
        text: "Nie je určený žiadny špeciálny spôsob obliekania. Príďte v tom, v čom sa cítite pohodlne.",
      },
      {
        title: "Bez prihlasovania",
        text: "Nemusíte sa vopred hlásiť. Stačí prísť.",
      },
      {
        title: "Kontakt pred návštevou",
        text: "Ak si nie ste istí cestou alebo sa chcete na niečo opýtať, pokojne nám napíšte e-mail alebo cez Facebook stránku GMC Sereď.",
      },
      {
        title: "Parkovanie a bezbariérovosť",
        text:
          "Podrobnosti o parkovaní a bezbariérovosti doplníme po overení. Ak potrebujete praktickú pomoc, napíšte nám pred návštevou.",
      },
      {
        title: "Kázeň vopred",
        text: "Ak nás chcete najskôr spoznať, môžete si pozrieť nedeľné kázne na YouTube kanáli Ján Tagaj.",
      },
    ],
    closing: {
      heading: "Budeme sa na vás tešiť.",
      text:
        "Nemusíte sa vopred hlásiť. Stačí prísť. A možno zistíte, že ste našli miesto, kde môžete byť sami sebou, budovať vzťahy a spoločne rásť vo viere.",
      actions: [
        { label: "Prídem v nedeľu", href: "/#navsteva", route: true },
        { label: "Zobraziť cestu", href: mapUrl },
        { label: "Pozrieť nedeľnú kázeň", href: "https://www.youtube.com/@JanTagaj" },
      ],
    },
  },
  nav: [
    { label: "Domov", href: "/" },
    { label: "Kto sme", href: "/kto-sme" },
    { label: "Čomu veríme", href: "/comu-verime" },
    { label: "Spoločenstvo", href: "/spolocenstvo" },
    { label: "Život zboru", href: "/zivot-zboru" },
    { label: "Program", href: "/program" },
    { label: "Kázne", href: "/kazne" },
    { label: "Prvýkrát", href: "/prva-navsteva" },
    { label: "Kontakt", href: "/kontakt" },
  ],
};

const normalizeSitePaths = (value: unknown): void => {
  if (Array.isArray(value)) {
    value.forEach(normalizeSitePaths);
    return;
  }

  if (!value || typeof value !== "object") {
    return;
  }

  const record = value as Record<string, unknown>;
  Object.entries(record).forEach(([key, entry]) => {
    if (typeof entry === "string" && key === "src" && entry.startsWith("/assets/")) {
      record[key] = siteAsset(entry);
      return;
    }

    if (typeof entry === "string" && key === "href" && entry.startsWith("/")) {
      record[key] = withSiteBase(entry);
      return;
    }

    normalizeSitePaths(entry);
  });
};

normalizeSitePaths(churchContent);

export const getContactLinks = (): LinkTarget[] => {
  const { contact, facebook, youtube, site } = churchContent;
  return [
    contact.phone ? { label: "Zavolať", href: `tel:${contact.phone.replace(/\s+/g, "")}` } : null,
    contact.email ? { label: "Napísať e-mail", href: `mailto:${contact.email}` } : null,
    facebook.url ? { label: "Facebook GMC Sereď", href: facebook.url } : null,
    youtube.enabled && youtube.channelUrl ? { label: "YouTube kanál Ján Tagaj", href: youtube.channelUrl } : null,
    site.nationalWebsiteUrl ? { label: site.nationalWebsiteLabel, href: site.nationalWebsiteUrl } : null,
  ].filter(Boolean) as LinkTarget[];
};
