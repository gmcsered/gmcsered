# Information Architecture

## Dôvod Zmeny

Predchádzajúca verzia niesla príliš veľa obsahu na homepage. Návštevník musel prechádzať dlhý sled sekcií bez jasného pocitu, kde sa nachádza a koľko ešte zostáva.

Nová architektúra rozdeľuje obsah do samostatných krátkych stránok. Domovská stránka je pozvanie a navigačný rozcestník, nie sklad všetkých informácií.

## Route Štruktúra

| Route | Stránka | Úloha |
|---|---|---|
| `/` | Domov | Krátke pozvanie a obrazové odkazy na hlavné témy. |
| `/kto-sme` | Kto sme | Vzťahy, prijatie, nádej v Ježišovi Kristovi. |
| `/comu-verime` | Čomu veríme | Päť stručných výrokov viery pri reálnom monumentálnom kríži. |
| `/spolocenstvo` | Spoločenstvo | Káva, jedlo, rozhovory a zdieľaný život. |
| `/zivot-zboru` | Život zboru | Kurátorovaná galéria bez nekonečného zoznamu fotiek. |
| `/kazne` | Nedeľné kázne | Pokojný vstup k biblickému vyučovaniu a YouTube kanálu. |
| `/prva-navsteva` | Prvýkrát u nás | Štyri kroky a praktické uistenia pre nového návštevníka. |
| `/kontakt` | Kontakt a návšteva | Čas, adresa, vstup, mapa, kontaktné odkazy a živý obraz zborovej miestnosti. |

## Vlastníctvo Obsahu

Verejný obsah patrí do `src/content/churchContent.ts`.

- `pages.home` riadi domovskú stránku a obrazové odkazy.
- `pages.about` riadi `/kto-sme`.
- `pages.beliefs` riadi `/comu-verime`.
- `pages.community` riadi `/spolocenstvo`.
- `pages.churchLife` riadi `/zivot-zboru`.
- `pages.sermons` riadi `/kazne`.
- `pages.firstVisit` riadi `/prva-navsteva`.
- `pages.contact` riadi `/kontakt`.

Komponenty majú zobrazovať dáta z konfigurácie, nie vlastné pevne vložené verejné texty, okrem krátkych stabilných nadpisov layoutu.

## Pravidlá Homepage

Homepage nesmie opakovať plný obsah ostatných stránok. Má obsahovať iba:

1. hlavné pozvanie,
2. krátke uistenie, že každý je vítaný,
3. obrazové vstupy do kategórií,
4. finálne pozvanie.

Ak sa pridá nový obsah, najprv rozhodnite, či patrí na existujúcu route. Na homepage pridávajte iba krátky preview odkaz.

## Cieľová Dĺžka

Desktop stránky majú pôsobiť ako jedna až dve pohodlné obrazovky. Pri vizuálnych stránkach s galériou alebo kontaktnými údajmi môže byť dĺžka mierne väčšia, ale stránka musí mať jasný koniec a iba jednu hlavnú tému.

Mobilné stránky môžu byť dlhšie kvôli skladaniu obsahu, cieľom je približne dve až štyri obrazovky bez pocitu nekonečnej landing page.

## Zdieľaný Hero Systém

Väčšina stránok používa `PageHero`:

- konzistentná výška,
- jeden hlavný nadpis,
- krátky úvod,
- jedna až dve CTA,
- reálna fotografia alebo schválený symbolický obrázok,
- žiadne zakryté tváre a žiadny text cez príliš rušné miesto fotografie.

Stránka `/comu-verime` používa vlastný hero layout, pretože kríž má byť hlavné architektonické dielo stránky.

Kontaktná stránka nepoužíva fotografiu banneru s kreslom ako hero ani hlavný kontaktný obraz. Ak nie je k dispozícii overený exteriér správnej budovy, použije sa radšej zborová miestnosť počas bohoslužby a praktické smerovanie zostáva v texte a tlačidle do máp.

## Next-Page Navigácia

Každá obsahová stránka končí veľkým vizuálnym odkazom na ďalší krok:

- Kto sme -> Čomu veríme
- Čomu veríme -> Spoločenstvo
- Spoločenstvo -> Život zboru
- Život zboru -> Nedeľné kázne
- Nedeľné kázne -> Prvýkrát u nás
- Prvýkrát u nás -> Kontakt a návšteva
- Kontakt a návšteva -> Domov

Tým sa nahrádza nekonečné scrollovanie cez všetky témy naraz.

## Scroll Správanie

Web používa prirodzené vertikálne scrollovanie.

Nepoužíva sa:

- povinné scroll snapping,
- ovládanie kolieska myši,
- horizontálny scroll stránok,
- dlhé sticky sekvencie,
- skryté informácie dostupné iba po veľkej vzdialenosti scrollu.

Jemné smooth scroll a hover/focus interakcie sú povolené, ak nezakrývajú obsah.

## Mobilné Pravidlá

- Navigácia sa skladá do jednoduchého menu.
- Hero text má pevné veľkosti podľa breakpointov, nie agresívne škálovanie podľa šírky.
- Koláže sa menia na čitateľné stacky alebo dvojstĺpcové galérie.
- Next-page odkaz ostáva krátky a jasný.
- Stránky nesmú mať horizontálny overflow.

## SEO

Každá route má vlastný slovenský titulok a popis v `churchContent.seo`. `MetaTags` číta route z `App.tsx`, takže po pridaní novej route treba doplniť aj SEO konfiguráciu.
