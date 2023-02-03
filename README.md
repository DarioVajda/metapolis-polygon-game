# nft
Veoma kul NFT igrica

Link sa planom: https://docs.google.com/document/d/1N5JJ_vFZnwMK2x3V3N10S3gp2jUgTS2vrKhAAfvktEs/edit

TODO lista:
1. Dario:
    - ✓ napraviti funkcije koje isplacuju weth i matic nagrade igracima koji su ispunili odgovarajuci achievement (funkcija za MATIC jos nije proverena, ali trebalo bi da radi)
    - ✓ poraditi na funkciji za racunanje zarade tako da uzima u obzir boostove koji su dobijeni zbog ispunjenih achievementova (uradjeno za educatedBoost i incomeBoost, ali kad se budu dodavali drugi tipovi nagrada dodati i funkcije za njih)
    - ✓ napraviti sistem prodavanja specijalnih gradjevina po ceni koja je proporcionalna broju prodatih gradjevina tog tipa (minimalni procenat koji se vraca je npr. 50%, a maksimalni 100%) - URADJENO, NIJE TESTIRANO, ALI TREBALO BI DA RADI
    - ✓ napraviti funkciju koja racuna 'total value' nekog grada (sabira vrednosti svake gradjevine koja je na mapi i specijalnih gradjevina isto, vrednost moze da se racuna po trenutnom najvecem offeru) - SVE PROVERENO OSIM OFFEROVA
    - ✓ optimizovati leaderboard stranicu, ne treba svaki element liste da se renderuje ispocetka kad se naki drugi expanduje ili collapseuje
    - ✓ napraviti/pronaci ikone za sve achievementove
    - ✓ napraviti loading screen za achievementove
    - ✓ napraviti loading screen za profile
    - ✓ napraviti loading screen za leaderboard
    - ✓ napraviti achievement badge-ove u leaderboard itemu (da se prikazu oni koji su uradjeni)
    - ✓ popraviti da se hover-popupovi ne mogu slucajno naci sa strane skroz pa da se ne vide celi nego da se ogranici njihovo pomeranje do ivice ekrana (sve uraditi u Hover komponenti)
    - ✓ napraviti neku animaciju kad se hoveruje preko achievement badge-a u leaderboard itemu - npr da predje onakav zrak preko njega i da se vrati kad se zavrsi hover (onakav zrak kao kad se completeuje achievement)
    - ✓ Napraviti "City" komponentu - treba da primi id kao argument i da vrati komponentu sa 3d gradom, treba napraviti opcije za to koliko detaljno da se prikazuje grad, da li da rotira ili da stoji u mestu itd.
    - ✓ napraviti 3d popup koji se pojavi kad se klikne na gradjevinu (moja ideja je da tamo budu dugmadi za 'info', 'upgrade', 'remove/sell' i 'rotate')
    - ✓ prilagoditi stvari novom api-u
    - ✓ omoguciti igracima da prave offerove za specijalne gradjevine
    - ✓ dodati dugme u UI u igrici koje ce prikazati mini verziju leaderboard-a i pored dugmeta da pise koji si na listi (i evenentualno koja ti nagrada sledi i koliko je vremena ostalo do toga)
    - ✓ srediti da bolje izgleda meni koji se pojavi kad stisnes na one 3 crte u navigation baru
    - ✓ kod prodavanja specijalnih gradjevina proveriti da li je gradjevina rasprodata i da li trebaju da se posmatraju offerovi ili se redovno prodaje
    - ✓ napraviti provere u severu za to da li je u url-u "id" argument int ili nesto drugo
    - ✓ implementirati theme-ove
    - ✓ napraviti funkciju koja renderuje grad na serveru i exportuje sliku
    - ✓ srediti izlged profilne stranice i fetchovati podatke o profulu iz opensea-a
    - ✓ srediti LEADERBOARD STRANICU i prikazivanje liste kad ima puno gradova (kao u komponenti koja je u igrici)
    - ✓ DOBIJANJE ZARADE i prikaz preostalog vremena
- ANIMACIJE MODELA u igrici (gradjenje, upgradeovanje, prodavanje,...)
- manji prioritet: refferal linkovi kod mintovanja NFT-ova




2. Marko:
- napraviti nove modele za landscape i gradjevine (gradjevine nek ispunjavaju vecinu polja na kojem se nalaze da ne bude previse praznog okolo jer je sad sve previse "prazno" i neka modeli budu vise sareni jer je ovo bezbojnije i sivlje i depresivnije od beograda)
- napraviti modele za specijalne gradjevine (za sad postoje u igri samo 'statue', 'fountain' i 'stadium', ali dodavacemo jos)




- Malo zidarski poslovi (achievementovi, specijalne gradjevine itd):
    - BRAINSTORMING - smisliti puno themeova, specijalnih gradjevina, achievementova, nagrada itd.
    - dodati jos vrsta specijalnih gradjevina
    - implementirati extraEducated preview funkciju u achievements.js fajlu
    - implementirati jos achievementova - da imaju veze sa specijalnim gradjevinama, da bude posebnih achievementova za razlicite themeove itd.
    - implementirati nove vrste nagrada