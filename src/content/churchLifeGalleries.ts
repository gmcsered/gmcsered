import { siteAsset } from "../utils/site";

export type GalleryPhoto = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
};

export type ChurchLifeGalleryCategory = {
  id: string;
  category: string;
  title: string;
  cover: GalleryPhoto;
  photos: GalleryPhoto[];
};

const photo = (file: string, width: number, height: number, caption: string): GalleryPhoto => ({
  src: siteAsset(`/assets/church/${file}`),
  width,
  height,
  alt: `${caption} v GMC Sereď`,
  caption,
});

const sundayServices = [
  photo("ia/home-worship-hero.webp", 1800, 1125, "Spoločná nedeľná bohoslužba"),
  photo("hero/hero-bohosluzba-01.webp", 1920, 1440, "Zbor počas biblického posolstva"),
  photo("gallery/bohosluzba-01.webp", 1200, 900, "Nedeľné stretnutie zboru"),
  photo("first-visit/chvaly-spolocenstvo.webp", 1200, 900, "Spoločné chvály v nedeľu"),
  photo("first-visit/prva-navsteva-chvaly.webp", 1200, 900, "Chvály a modlitba"),
  photo("first-visit/prva-navsteva-wow-chvaly.webp", 1600, 1000, "Nedeľné chvály zo zadnej časti sály"),
  photo("ia/about-full-room.jpg", 1400, 1050, "Plná miestnosť počas bohoslužby"),
  photo("ia/community-room-full.jpg", 1400, 1050, "Spoločné počúvanie Božieho slova"),
  photo("sermons/kazen-01.webp", 1440, 1080, "Biblické vyučovanie počas bohoslužby"),
  photo("editorial/prva-navsteva-kazen.webp", 1200, 900, "Nedeľné posolstvo"),
];

const worshipMusic = [
  photo("ia/worship-team.webp", 1400, 980, "Hudobníci počas spoločných chvál"),
  photo("ia/contact-worship-team.jpg", 1400, 1050, "Chválový tím GMC Sereď"),
  photo("hero/hero-spolocne-chvaly-desktop.webp", 1920, 1080, "Kapela a speváci počas chvál"),
  photo("worship/chvaly-01.webp", 1440, 1080, "Spoločenstvo pri chválach"),
  photo("gallery/chvaly-01.webp", 1200, 900, "Hudba počas nedeľnej bohoslužby"),
  photo("activities/spolocne-uctievame.webp", 1000, 720, "Spoločne uctievame Boha"),
];

const childrenAndYouth = [
  photo("activities/spolocne-rastieme.webp", 1000, 720, "Deti rastú spolu"),
  photo("children/deti-01.webp", 1440, 1080, "Program pre najmenšie deti"),
  photo("editorial/deti-mladez-program.webp", 1400, 900, "Deti počas vlastného programu"),
  photo("families/rodiny-01.webp", 1440, 1080, "Deti a mladí pred zborom"),
  photo("gallery/deti-a-rodiny-01.webp", 1200, 900, "Deti a rodiny spolu"),
  photo("gallery/deti-v-bohosluzbe-01.webp", 900, 1294, "Deti sú súčasťou bohoslužby"),
  photo("gallery/mladi-01.webp", 1200, 846, "Mladí pri spoločnom programe"),
  photo("gallery/rodiny-02.webp", 1200, 900, "Deti počas spoločného dňa vonku"),
  photo("gallery/sportovy-den-01.webp", 1200, 900, "Športový program pre mladých"),
  photo("ia/about-children-moment.jpg", 1050, 1400, "Priestor pre deti a rodiny"),
  photo("ia/children-and-youth-stage.webp", 1400, 980, "Deti a mladí počas programu v sále"),
  photo("ia/children-room.webp", 1400, 980, "Hry v detskej miestnosti"),
  photo("ia/first-visit-family.webp", 1000, 1250, "Rodinný moment v zbore"),
  photo("first-visit/prva-navsteva-rodiny.webp", 1200, 900, "Spoločný program detí"),
  photo("hopestreet/hopestreet-spolocenstvo.jpg", 1400, 990, "Mladí počas programu HopeStreet"),
];

const fellowship = [
  photo("ia/about-friendship.webp", 1000, 1250, "Priateľstvo a prijatie"),
  photo("ia/about-men-table.jpg", 1400, 1050, "Rozhovory pri spoločnom stole"),
  photo("ia/about-people-laughing.webp", 1400, 980, "Radosť zo spoločného času"),
  photo("ia/about-two-women.jpg", 1536, 2048, "Vzťahy a blízkosť"),
  photo("ia/about-women.webp", 1200, 900, "Priateľské stretnutie po bohoslužbe"),
  photo("ia/community-coffee.webp", 1000, 1250, "Rozhovory pri káve"),
  photo("ia/community-conversations.webp", 1400, 980, "Rozhovory po bohoslužbe"),
  photo("ia/community-roses.jpg", 1050, 1400, "Radosť a vďačnosť v spoločenstve"),
  photo("ia/first-visit-entrance.webp", 1400, 980, "Privítanie pri vstupe"),
  photo("ia/welcome-embrace.webp", 1000, 1250, "Srdečné privítanie"),
];

const sharedTime = [
  photo("activities/spolocne-zijeme.webp", 1000, 720, "Spoločný čas pri káve a jedle"),
  photo("editorial/finalne-pozvanie.webp", 1600, 900, "Rodinný deň vonku"),
  photo("editorial/spolu-family-day.webp", 1400, 900, "Hry počas rodinného dňa"),
  photo("editorial/spolu-jedlo.webp", 1000, 760, "Občerstvenie pre spoločný čas"),
  photo("editorial/spolu-kolac.webp", 900, 1100, "Domáci koláč pre spoločenstvo"),
  photo("editorial/spolu-pizza.webp", 820, 980, "Pizza pripravená pre priateľov"),
  photo("fellowship/spolocny-obed-01.webp", 1440, 1080, "Spoločný obed"),
  photo("first-visit/prva-navsteva-wow-stol.webp", 1200, 900, "Pri spoločnom stole"),
  photo("gallery/spolocny-obed-01.webp", 1200, 900, "Rozhovory počas spoločného obeda"),
  photo("ia/community-desserts.jpg", 1050, 1400, "Koláče pripravené pre hostí"),
  photo("people/spolocenstvo-01.webp", 1440, 1080, "Rodiny a priatelia pri stole"),
];

export const churchLifeGalleries: ChurchLifeGalleryCategory[] = [
  {
    id: "nedelne-chvaly",
    category: "Bohoslužby",
    title: "Nedeľné chvály",
    cover: sundayServices[0],
    photos: sundayServices,
  },
  {
    id: "hudba-a-chvaly",
    category: "Bohoslužby",
    title: "Hudba a chvály",
    cover: worshipMusic[0],
    photos: worshipMusic,
  },
  {
    id: "deti-a-mladez",
    category: "Deti a mládež",
    title: "Vlastný program",
    cover: childrenAndYouth[1],
    photos: childrenAndYouth,
  },
  {
    id: "spolocenstvo",
    category: "Spoločenstvo",
    title: "Rozhovory a blízkosť",
    cover: fellowship[2],
    photos: fellowship,
  },
  {
    id: "spolocne-stretnutia",
    category: "Spoločné stretnutia",
    title: "Rodiny a spoločný stôl",
    cover: sharedTime[1],
    photos: sharedTime,
  },
];
