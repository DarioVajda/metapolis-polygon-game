# nft
Veoma kul NFT igrica

Link sa planom: https://docs.google.com/document/d/1N5JJ_vFZnwMK2x3V3N10S3gp2jUgTS2vrKhAAfvktEs/edit


TODO lista:
1. Dario:
- ✓ napraviti funkcije koje isplacuju weth i matic nagrade igracima koji su ispunili odgovarajuci achievement (funkcija za MATIC jos nije proverena, ali trebalo bi da radi)
- ✓ poraditi na funkciji za racunanje zarade tako da uzima u obzir boostove koji su dobijeni zbog ispunjenih achievementova (uradjeno za educatedBoost i incomeBoost, ali kad se budu dodavali drugi tipovi nagrada dodati i funkcije za njih)
- ✓ napraviti sistem prodavanja specijalnih gradjevina po ceni koja je proporcionalna broju prodatih gradjevina tog tipa (minimalni procenat koji se vraca je npr. 50%, a maksimalni 100%) - URADJENO, NIJE TESTIRANO, ALI TREBALO BI DA RADI
- ✓ napraviti funkciju koja racuna 'total value' nekog grada (sabira vrednosti svake gradjevine koja je na mapi i specijalnih gradjevina isto, vrednost moze da se racuna po trenutnom najvecem offeru) - SVE PROVERENO OSIM OFFEROVA
- napraviti sve 'loading' screenove
- napraviti/pronaci ikone za sve achievementove
- optimizovati leaderboard stranicu, ne treba svaki element liste da se renderuje ispocetka kad se naki drugi expanduje ili collapseuje

2. Marko:
- napraviti nove modele za landscape i gradjevine (gradjevine nek ispunjavaju vecinu polja na kojem se nalaze da ne bude previse praznog okolo jer je sad sve previse "prazno" i neka modeli budu vise sareni jer je ovo bezbojnije i sivlje i depresivnije od beograda)
- napraviti modele za specijalne gradjevine (za sad postoje u igri samo 'statue', 'fountain' i 'stadium', ali dodavacemo jos)
- napraviti 3d popup koji se pojavi kad se klikne na gradjevinu (moja ideja je da tamo budu dugmadi za 'info', 'upgrade', 'remove/sell' i 'rotate')
- prilagoditi stvari novom api-u
- omoguciti igracima da prave offerove za specijalne gradjevine
- kod prodavanja specijalnih gradjevina proveriti da li je gradjevina rasprodata i da li trebaju da se posmatraju offerovi ili se redovno prodaje
