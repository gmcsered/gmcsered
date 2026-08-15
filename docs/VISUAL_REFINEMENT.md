# Visual Refinement

## Problémy Po Predchádzajúcej Verzii

- Homepage bola príliš dlhá a pôsobila ako sled samostatných sekcií pod sebou.
- Návštevník nemal jasnú orientáciu, koľko obsahu ešte zostáva.
- Dôležité témy nemali vlastné miesto a miešali sa na jednej stránke.
- „Čomu veríme“ predtým používalo vizuály, ktoré pôsobili technicky, nie jasne kresťansky.
- Niektoré časti boli stále príliš kartové a informačné.

## Nový Smer

Web je rozdelený na krátke tematické stránky. Domov je pozvanie a vizuálny rozcestník, nie plný obsah celého webu.

Cieľový pocit:

- moderný,
- teplý,
- osobný,
- pokojný,
- jasne kresťanský,
- postavený na ľuďoch a vzťahoch.

## Kľúčové Dizajnové Rozhodnutia

- Zdieľaný `PageHero` drží jednotný rytmus stránok.
- Každá stránka má jednu hlavnú tému a jeden dominantný vizuál.
- Karty sú obmedzené na miesta, kde pomáhajú čitateľnosti.
- Galéria je kurátorovaná na 8 silných fotografií.
- Next-page navigácia dáva návštevníkovi jasnú cestu ďalej.
- Scroll je prirodzený, bez slide efektov, scroll snapu a dlhých sticky sekvencií.

## Kríž

Stránka `/comu-verime` používa reálnu monumentálnu fotografiu kríža:

- zdroj: `/Users/patus/Downloads/ChatGPT Image Jul 20, 2026 at 05_30_30 PM.png`,
- výstupy: `public/assets/church/ia/beliefs-cross-desktop.webp` a `public/assets/church/ia/beliefs-cross-portrait.webp`,
- kríž je veľký, pevný, stojí na vrchu a je okamžite rozpoznateľný,
- fotografia kríža pokrýva celú plochu sekcie ako hero pozadie,
- kompozícia drží kríž vľavo a vyššie, aby bol okamžite rozpoznateľný a text mohol dýchať napravo,
- pri ďalšom doladení bol kríž posunutý ešte viac doľava, aby nezanikol pri textových taboch,
- text je v bielych transparentných taboch, aby zostal čitateľný a kríž nebol prekrytý ťažkou kartou,
- odstránené sú kreslené kríže, outline, kruhové technické ornamenty, vertikálne tyče a blueprint geometria.

## Dodatočné Doladenie Stránok

- `/kazne`: hero s otvorenou Bibliou je posunutý vyššie, obraz zostáva ostrý, text už nie je v bielom paneli a overlay je iba veľmi jemný kvôli čitateľnosti.
- `/`: pod pozvaním „Každý je vítaný“ je vložené lokálne promo video bez autoplayu a bez externých prehrávačov.
- `/kto-sme`: doplnený je overený inštitucionálny a historický kontext ECM na Slovensku, stretnutia v Seredi od roku 1926 a aktuálny pastor Ján Tagaj.
- `/kontakt`: kontaktný hero aj kontaktná fotografia používajú záber zborovej miestnosti počas bohoslužby. Fotografia banneru s kreslom sa z kontaktnej stránky odstránila, pretože nie je vhodná na identifikáciu správnej budovy.

## Vybrané Obrázky

- Domov: `home-worship-hero.webp`.
- Domovské video: `promo.mp4`.
- Kto sme: `about-people-laughing.webp`, `about-friendship.webp`, `about-women.webp`.
- Čomu veríme: `beliefs-cross-desktop.webp`, `beliefs-cross-portrait.webp`.
- Spoločenstvo: `community-coffee.webp`, `community-food.webp`, `community-family-day.webp`, `community-conversations.webp`.
- Život zboru: 8 fotografií z bohoslužby, chvál, detí, mladých a spoločného času.
- Kázne: `sermons-bible-hero.webp`, `sermons-preacher.webp`.
- Prvýkrát u nás: `first-visit-entrance.webp`, `first-visit-family.webp`.
- Kontakt: `worship-congregation-wide.webp` ako hlavný živý obraz zborovej miestnosti; banner s kreslom sa na kontaktnej stránke nepoužíva.

## Interakcie

- Navigácia má aktívnu route podľa aktuálnej adresy.
- Interné odkazy používajú SPA navigáciu bez reloadu.
- Obrázkové odkazy majú hover aj keyboard focus stav.
- YouTube a Mapy sa otvárajú bezpečne v novej karte.
- Nepoužíva sa autoplay, externé video SDK ani mapový skript.

## Reduced Motion

Pri `prefers-reduced-motion: reduce`:

- hero animácie sa vypnú,
- image hover transformy sa vypnú,
- reveal prvky sú okamžite viditeľné,
- stránka zostáva rovnako čitateľná.

## Page Length

Kontrola prebehla na šírkach 375, 430, 768, 1024 a 1440 px. Desktopové stránky sa držia krátkej route štruktúry; najdlhšie stránky sú tie, ktoré obsahujú galériu alebo praktický kontakt, ale už nejde o jednu nekonečnú homepage.

## Pred / Po

Pred:

- jedna veľmi dlhá stránka,
- opakované sekcie a gridy,
- nejasná orientácia,
- technicky pôsobiace kresťanské motívy,
- veľa obsahu na jednom mieste.

Po:

- jasné route kategórie,
- domov ako stručný rozcestník,
- reálny monumentálny kríž na stránke viery,
- viac prirodzenej fotografie ľudí a vzťahov,
- konzistentný hero systém,
- jasný ďalší krok na každej stránke,
- všetok verejný text zostáva po slovensky.
