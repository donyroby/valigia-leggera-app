
/* ---------- Dati simulati ---------- */
const DEPS=[
 {id:"MXP",lat:45.63,lon:8.72,n:"Milano Malpensa",z:"n"},{id:"BGY",lat:45.67,lon:9.7,n:"Bergamo Orio al Serio",z:"n"},{id:"TRN",lat:45.2,lon:7.65,n:"Torino",z:"n"},
 {id:"VCE",lat:45.5,lon:12.35,n:"Venezia",z:"n",ex:"venezia"},{id:"VRN",lat:45.4,lon:10.9,n:"Verona",z:"n"},{id:"BLQ",lat:44.53,lon:11.29,n:"Bologna",z:"n",ex:"bologna"},
 {id:"TRS",lat:45.83,lon:13.47,n:"Trieste",z:"n"},{id:"GOA",lat:44.41,lon:8.85,n:"Genova",z:"n"},{id:"PSA",lat:43.68,lon:10.39,n:"Pisa",z:"c"},
 {id:"FLR",lat:43.81,lon:11.2,n:"Firenze",z:"c",ex:"firenze"},{id:"FCO",lat:41.8,lon:12.25,n:"Roma Fiumicino",z:"c"},{id:"AOI",lat:43.62,lon:13.36,n:"Ancona",z:"c"},
 {id:"NAP",lat:40.88,lon:14.29,n:"Napoli",z:"s",ex:"napoli"},{id:"BRI",lat:41.14,lon:16.76,n:"Bari",z:"s"},{id:"BDS",lat:40.66,lon:17.95,n:"Brindisi",z:"s"},
 {id:"PMO",lat:38.18,lon:13.1,n:"Palermo",z:"s",ex:"palermo"},{id:"CTA",lat:37.47,lon:15.07,n:"Catania",z:"s"},{id:"CAG",lat:39.25,lon:9.05,n:"Cagliari",z:"s",ex:"cagliari"}
];
const A=s=>s.split(";").map(x=>{const [n,c]=x.split("|");return {n,c:parseFloat(c)}});
/* D(id,nome,paese,iata,italia,modo,[nord,centro,sud],ostello,hotel,appartamento,cibo,spostamenti,attività,tag,nota,giorno,sera,gita) */
const D=(id,name,cc,iata,it,mode,f,h,ho,ap,fo,tr,ac,tags,note,day,eve,gita)=>({id,name,cc,iata,it,mode,f:{n:f[0],c:f[1],s:f[2]},h,ho,ap,fo,tr,ac,tags,note,day:A(day),eve:A(eve),gita});
const DESTS=[
 D("lis","Lisbona","Portogallo","LIS",0,"volo",[95,85,120],22,85,95,28,6,14,["arte","cibo","mare"],"Tram gialli, pastéis de nata e tramonti sul Tago.","Torre di Belém|8;Monastero dei Gerónimos|12;Alfama e Castelo São Jorge|15;Tram 28 e quartiere Graça|3;LX Factory e Time Out Market|0;Miradouros al tramonto|0","Fado ad Alfama|15;Pastéis de nata|3;Cena a Bairro Alto|22","Sintra"),
 D("opo","Porto","Portogallo","OPO",0,"volo",[90,80,115],20,75,85,25,5,12,["arte","cibo"],"Cantine di vino, azulejos e una città a misura di passeggiata.","Libreria Lello|8;Ponte Dom Luís e Ribeira|0;Cantine di Vila Nova de Gaia|15;Stazione São Bento|0;Palácio da Bolsa|14;Fondazione Serralves|12","Francesinha|12;Tramonto al Jardim do Morro|0;Bar in Rua Galeria de Paris|10","Valle del Douro"),
 D("bcn","Barcellona","Spagna","BCN",0,"volo",[60,55,70],28,110,120,32,8,18,["mare","arte","cibo"],"Gaudí la mattina, spiaggia il pomeriggio, tapas la sera.","Sagrada Família|26;Parc Güell|10;Barri Gòtic e Ramblas|0;Facciate di Casa Batlló e Pedrera|0;Bunkers del Carmel|0;Spiaggia della Barceloneta|0","Tapas a El Born|20;Font Màgica|0;Aperitivo a Gràcia|10","Montserrat"),
 D("vlc","Valencia","Spagna","VLC",0,"volo",[65,60,75],22,80,90,27,6,12,["mare","cibo"],"Paella, spiagge urbane e la Città delle Arti e delle Scienze.","Città delle Arti e delle Scienze|10;Mercato Centrale|0;Cattedrale e Miguelete|8;Giardini del Turia in bici|4;Spiaggia della Malvarrosa|0;Oceanogràfic|33","Paella tipica|16;Quartiere El Carmen|10;Horchata ad Alboraya|3","Parco dell'Albufera"),
 D("agp","Malaga","Spagna","AGP",0,"volo",[75,70,80],22,80,90,26,5,12,["mare","arte"],"Sole quasi tutto l'anno, musei e spiaggia a 15 minuti dal centro.","Alcazaba|3.5;Castello di Gibralfaro|3.5;Museo Picasso|9;Centro storico e cattedrale|0;Spiaggia La Malagueta|0;Mercato Atarazanas|0","Tapas e vermut|15;Tramonto da Gibralfaro|0;Calle Larios illuminata|0","Ronda"),
 D("bud","Budapest","Ungheria","BUD",0,"volo",[70,65,90],16,60,65,20,5,10,["arte","cibo"],"Terme, ruin bar e un centro splendido a prezzi bassi.","Terme Széchenyi|30;Parlamento (esterno)|0;Bastione dei Pescatori|0;Castello di Buda|0;Mercato Centrale|0;Quartiere ebraico|0","Ruin bar Szimpla|8;Crociera sul Danubio|15;Cena con goulash|14","Ansa del Danubio"),
 D("prg","Praga","Cechia","PRG",0,"volo",[65,70,95],17,65,70,20,6,11,["arte"],"Centro fiabesco e birra a prezzi che non spaventano.","Castello di Praga|15;Ponte Carlo|0;Piazza della Città Vecchia e Orloj|0;Quartiere ebraico|10;Collina di Petřín|0;Malá Strana e Lennon Wall|0","Birreria storica|8;Ponte Carlo di sera|0;Cena boema|14","Kutná Hora"),
 D("krk","Cracovia","Polonia","KRK",0,"volo",[60,65,85],15,55,60,18,4,10,["arte","cibo"],"Una delle capitali europee più economiche per mangiare e dormire.","Castello del Wawel|12;Piazza del Mercato|0;Kazimierz|0;Fabbrica di Schindler|9;Miniere di sale di Wieliczka|22;Parco Planty|0","Pierogi in un bar mleczny|6;Cocktail bar a Kazimierz|8;Passeggiata sulla Vistola|0","Zakopane"),
 D("tia","Tirana","Albania","TIA",0,"volo",[85,70,60],14,45,50,16,3,8,["natura","cibo"],"Colorata, giovane e sorprendentemente economica.","Piazza Skanderbeg|0;Bunk'Art 1|6;Funivia del Monte Dajti|6;Quartiere Blloku|0;Museo Nazionale|5;Grande Parco di Tirana|0","Cena albanese|10;Caffè a Blloku|3;Rakia bar|4","Berat"),
 D("sof","Sofia","Bulgaria","SOF",0,"volo",[70,75,85],13,45,50,15,3,8,["natura","arte"],"Montagna a mezz'ora dal centro e prezzi tra i più bassi d'Europa.","Cattedrale Alexander Nevsky|0;Monte Vitosha|5;Chiesa di Boyana|8;Mercato delle donne|0;Bulevard Vitosha|0;Free walking tour|0","Cena bulgara|10;Rakia bar|4;Giardino Borisova|0","Monastero di Rila"),
 D("ath","Atene","Grecia","ATH",0,"volo",[90,85,70],22,75,85,24,6,14,["arte","mare"],"Acropoli, taverne e mare raggiungibile in tram.","Acropoli e Partenone|30;Museo dell'Acropoli|20;Plaka e Anafiotika|0;Agorà antica|10;Collina del Licabetto|0;Mercato di Monastiraki|0","Souvlaki|5;Tramonto sul colle Filopappo|0;Cena a Psyrri|18","Capo Sounion"),
 D("vie","Vienna","Austria","VIE",0,"volo",[85,90,110],24,95,105,32,9,16,["arte"],"Palazzi, caffè storici e musica a portata di tram.","Palazzo di Schönbrunn|24;Belvedere|16;Cattedrale di Santo Stefano|0;Ringstrasse a piedi|0;Naschmarkt|0;Prater|0","Caffè viennese|6;Heuriger (taverna del vino)|20;Opera, posto in piedi|13","Valle della Wachau"),
 D("ber","Berlino","Germania","BER",0,"volo",[80,90,120],22,85,95,30,9,15,["arte"],"Storia, street art e una vita notturna senza pari.","Porta di Brandeburgo|0;East Side Gallery|0;Isola dei Musei|12;Cupola del Reichstag|0;Tempelhofer Feld|0;Street art a Kreuzberg|0","Currywurst e döner|5;Serata in un club|15;Cena a Kreuzberg|14","Potsdam"),
 D("ams","Amsterdam","Paesi Bassi","AMS",0,"volo",[110,115,140],40,150,160,38,12,22,["arte"],"Canali e musei: bellissima, ma una delle mete più care.","Rijksmuseum|25;Giro in barca sui canali|18;Vondelpark|0;Quartiere Jordaan|0;Mercato Albert Cuyp|0;Casa di Anna Frank|16","Cena low cost in Chinatown|14;Brown cafe|8;Passeggiata sui canali|0","Zaanse Schans"),
 D("par","Parigi","Francia","CDG",0,"volo",[95,100,125],40,140,150,38,12,20,["arte","cibo"],"I grandi classici, con qualche trucco per non svuotare il portafoglio.","Giardini della Torre Eiffel|0;Louvre|22;Montmartre e Sacré-Cœur|0;Notre-Dame (esterno)|0;Marais|0;Giardini del Lussemburgo|0","Picnic sulla Senna|12;Aperitivo al Canal Saint-Martin|10;Torre Eiffel illuminata|0","Versailles"),
 D("dbv","Dubrovnik","Croazia","DBV",0,"volo",[100,95,85],28,95,110,28,5,12,["mare","arte"],"Mura antiche e mare cristallino, meglio fuori stagione.","Mura di Dubrovnik|35;Funivia del Monte Srđ|20;Città vecchia|0;Spiaggia di Banje|0;Kayak sotto le mura|30;Isola di Lokrum|25","Cena dalmata|20;Tramonto sulle mura|0;Aperitivo al Buža Bar|6","Isole Elafiti"),
 D("nap","Napoli","Italia","NAP",1,"treno",[45,25,8],20,75,80,22,4,10,["cibo","arte","mare"],"Pizza, vicoli e il Vesuvio sullo sfondo.","Museo Archeologico Nazionale|22;Napoli sotterranea|15;Spaccanapoli|0;Cappella Sansevero|10;Lungomare e Castel dell'Ovo|0;Vomero e Certosa di San Martino|6","Pizza a portafoglio|5;Pizzeria storica|8;Passeggiata a Posillipo|0","Pompei"),
 D("flr","Firenze","Italia","FLR",1,"treno",[25,10,45],26,100,110,26,5,16,["arte","cibo"],"Rinascimento a piedi, dal Duomo all'Oltrarno.","Galleria degli Uffizi|25;Duomo e Cupola|30;Ponte Vecchio|0;Giardino di Boboli|10;Piazzale Michelangelo|0;Mercato Centrale|0","Lampredotto|5;Aperitivo in Oltrarno|10;Trattoria toscana|22","Siena e San Gimignano"),
 D("vce","Venezia","Italia","VCE",1,"treno",[15,30,65],30,115,125,28,9,18,["arte"],"Un labirinto d'acqua: la si gira meglio con tempo e scarpe comode.","Piazza San Marco e Basilica|3;Rialto e mercato|0;Murano e Burano in vaporetto|9;Gallerie dell'Accademia|15;Cannaregio|0;Giudecca|2","Cicchetti e ombra|12;Tramonto alle Zattere|0;Cena in un bacaro|22","Padova"),
 D("pmo","Palermo","Italia","PMO",1,"volo",[90,85,70],18,65,70,20,4,9,["cibo","mare","arte"],"Street food, mosaici normanni e Mondello a due passi.","Cattedrale e Palazzo dei Normanni|15;Mercato di Ballarò|0;Teatro Massimo|10;Quattro Canti|0;Kalsa e Palazzo Abatellis|8;Spiaggia di Mondello|0","Street food (arancine, panelle)|8;Cena in trattoria|20;Aperitivo alla Kalsa|8","Cefalù"),
 D("lcc","Lecce","Italia","BDS",1,"treno",[75,55,15],19,70,75,21,4,8,["mare","cibo","arte"],"Barocco in pietra dorata e mare salentino vicinissimo.","Centro barocco|0;Basilica di Santa Croce|0;Anfiteatro romano|0;Porta Napoli|0;Spiaggia di Torre dell'Orso|0;Otranto|0","Pasticciotto|2;Orecchiette e tavernette|15;Aperitivo in centro|8","Gallipoli"),
 D("blq","Bologna","Italia","BLQ",1,"treno",[12,20,45],22,85,90,27,4,10,["cibo","arte"],"Portici, tortellini e una vita universitaria vivace.","Piazza Maggiore|0;Due Torri|5;Portico di San Luca|0;Quadrilatero|0;Museo Civico Medievale|6;Giardini Margherita|0","Tagliatelle al ragù|14;Osteria con tigelle|12;Aperitivo tra studenti|6","Ravenna"),
 D("cag","Cagliari","Italia","CAG",1,"volo",[70,65,60],20,75,85,22,4,10,["mare","natura"],"Città e spiaggia insieme: il Poetto è a 15 minuti dal centro.","Quartiere Castello|0;Bastione Saint Remy|0;Spiaggia del Poetto|0;Anfiteatro romano|5;Saline di Molentargius|0;Torre di San Pancrazio|4","Culurgiones|14;Tramonto a Buoncammino|0;Aperitivo alla Marina|8","Villasimius")
];
const TIPS={
 amici:["Chiedi all'ostello i free walking tour e le serate organizzate: costano zero o quasi.","Pranzo a base di street food e cena condivisa: si spende meno e si assaggia di più.","Un abbonamento ai mezzi di 24-72 ore conviene già dopo quattro corse.","Usate un'app per dividere le spese, così i conti non rovinano il viaggio."],
 coppia:["Prenota il tavolo per la cena in anticipo: nel fine settimana i posti migliori finiscono.","Cerca un punto panoramico per il tramonto: è gratis e resta il ricordo della giornata.","Alterna una cena speciale a un pranzo semplice: la spesa resta sotto controllo.","Lascia mezza giornata senza programma: spesso è la più bella."],
 famiglia:["Fai la spesa al mercato e cena in appartamento un paio di sere: risparmi e i bambini mangiano tranquilli.","Tieni una pausa dopo pranzo: un ritmo rilassato evita stanchezza e capricci.","Controlla le tariffe ridotte o gratuite per i minori di 12 anni negli ingressi.","Cerca un parco giochi vicino all'alloggio: mezz'ora libera vale più di una visita in più."]
};
const SAVE_TIPS=[
 ["Viaggia fuori stagione","Da novembre a marzo voli e alloggi costano fino al 15% in meno, tranne nei periodi di festa."],
 ["Parti a metà settimana","Martedì e mercoledì sono spesso i giorni più economici per i voli."],
 ["Scegli l'aeroporto giusto","Confronta gli scali vicini a casa: a volte cambiare aeroporto risparmia decine di euro."],
 ["Bagaglio a mano","Un solo zaino evita i supplementi e velocizza gli spostamenti."],
 ["Mangia dove mangiano i locali","Mercati, forni e locali fuori dalle vie turistiche costano meno e sono più buoni."],
 ["Pesca la gratuità","Molte città hanno musei gratis la prima domenica del mese o free walking tour a offerta."]
];

/* ---------- Città stimate (ricerca libera) ---------- */
const LV={1:{h:13,ho:45,ap:50,fo:15,tr:3,ac:8},2:{h:16,ho:58,ap:65,fo:19,tr:4,ac:10},3:{h:22,ho:82,ap:92,fo:25,tr:5,ac:13},4:{h:30,ho:115,ap:125,fo:31,tr:9,ac:17},5:{h:42,ho:155,ap:165,fo:40,tr:12,ac:22}};
const CITY_RAW="Roma|Italia|FCO|41.9|12.5|3;Milano|Italia|MXP|45.46|9.19|3;Torino|Italia|TRN|45.07|7.69|3;Verona|Italia|VRN|45.44|10.99|3;Genova|Italia|GOA|44.41|8.93|3;Pisa|Italia|PSA|43.72|10.4|3;Siena|Italia|FLR|43.32|11.33|3;Bari|Italia|BRI|41.12|16.87|3;Matera|Italia|BRI|40.67|16.6|3;Catania|Italia|CTA|37.5|15.09|3;Siracusa|Italia|CTA|37.07|15.29|3;Trieste|Italia|TRS|45.65|13.78|3;Olbia|Italia|OLB|40.92|9.5|3;Alghero|Italia|AHO|40.56|8.32|3;Rimini|Italia|RMI|44.06|12.57|3;Perugia|Italia|PEG|43.11|12.39|3;Ancona|Italia|AOI|43.62|13.52|3;Reggio Calabria|Italia|REG|38.11|15.65|3;Pescara|Italia|PSR|42.46|14.21|3;Bolzano|Italia|BZO|46.5|11.35|3;Sorrento|Italia|NAP|40.63|14.38|3;Como|Italia|MXP|45.81|9.08|3;La Spezia|Italia|PSA|44.1|9.82|3;Lucca|Italia|PSA|43.84|10.5|3;Assisi|Italia|PEG|43.07|12.62|3;Orvieto|Italia|FCO|42.72|11.79|3;Gubbio|Italia|PEG|43.35|12.58|3;Urbino|Italia|AOI|43.72|12.64|3;San Gimignano|Italia|FLR|43.47|11.04|3;Monterosso al Mare|Italia|PSA|44.15|9.65|3;Portofino|Italia|GOA|44.3|9.21|3;Positano|Italia|NAP|40.63|14.48|3;Amalfi|Italia|NAP|40.63|14.6|3;Ravello|Italia|NAP|40.65|14.61|3;Capri|Italia|NAP|40.55|14.24|3;Ischia|Italia|NAP|40.73|13.95|3;Procida|Italia|NAP|40.76|14.02|3;Alberobello|Italia|BRI|40.78|17.24|3;Polignano a Mare|Italia|BRI|40.99|17.22|3;Ostuni|Italia|BDS|40.73|17.58|3;Otranto|Italia|BDS|40.15|18.49|3;Gallipoli|Italia|BDS|40.06|18.02|3;Tropea|Italia|REG|38.68|15.9|3;Taormina|Italia|CTA|37.85|15.29|3;Cefalù|Italia|PMO|38.04|14.02|3;Trapani|Italia|TPS|38.02|12.51|3;Ragusa|Italia|CTA|36.93|14.73|3;Modica|Italia|CTA|36.85|14.77|3;Noto|Italia|CTA|36.89|15.07|3;Padova|Italia|VCE|45.41|11.88|3;Vicenza|Italia|VCE|45.55|11.55|3;Mantova|Italia|VRN|45.16|10.79|3;Ferrara|Italia|BLQ|44.84|11.62|3;Parma|Italia|BLQ|44.8|10.33|3;Modena|Italia|BLQ|44.65|10.92|3;Ravenna|Italia|BLQ|44.42|12.2|3;San Marino|San Marino|RMI|43.94|12.45|3;Sirmione|Italia|VRN|45.49|10.61|3;Bellagio|Italia|MXP|45.99|9.26|3;Courmayeur|Italia|TRN|45.79|6.97|4;Cortina d'Ampezzo|Italia|VCE|46.54|12.14|4;Livigno|Italia|MXP|46.54|10.13|4;Merano|Italia|BZO|46.67|11.16|3;Asti|Italia|TRN|44.9|8.21|3;Alba|Italia|TRN|44.7|8.03|3;Cuneo|Italia|TRN|44.39|7.55|3;Aosta|Italia|TRN|45.74|7.31|3;Chioggia|Italia|VCE|45.22|12.28|3;Orta San Giulio|Italia|MXP|45.8|8.41|3;Stresa|Italia|MXP|45.88|8.53|3;Sperlonga|Italia|FCO|41.25|13.43|3;Gaeta|Italia|FCO|41.22|13.57|3;Numana|Italia|AOI|43.52|13.62|3;Madrid|Spagna|MAD|40.42|-3.7|3;Siviglia|Spagna|SVQ|37.39|-5.98|3;Granada|Spagna|AGP|37.18|-3.6|3;Bilbao|Spagna|BIO|43.26|-2.93|3;San Sebastián|Spagna|BIO|43.32|-1.98|3;Palma di Maiorca|Spagna|PMI|39.57|2.65|3;Ibiza|Spagna|IBZ|38.91|1.43|3;Tenerife|Spagna|TFS|28.05|-16.57|3;Faro|Portogallo|FAO|37.02|-7.93|3;Funchal (Madeira)|Portogallo|FNC|32.65|-16.91|3;Coimbra|Portogallo|OPO|40.21|-8.43|3;Nizza|Francia|NCE|43.7|7.27|4;Marsiglia|Francia|MRS|43.3|5.37|4;Lione|Francia|LYS|45.76|4.84|4;Bordeaux|Francia|BOD|44.84|-0.58|4;Tolosa|Francia|TLS|43.6|1.44|4;Strasburgo|Francia|SXB|48.57|7.75|4;Nantes|Francia|NTE|47.22|-1.55|4;Montpellier|Francia|MPL|43.61|3.88|4;Monaco di Baviera|Germania|MUC|48.14|11.58|4;Amburgo|Germania|HAM|53.55|9.99|4;Francoforte|Germania|FRA|50.11|8.68|4;Colonia|Germania|CGN|50.94|6.96|4;Dresda|Germania|DRS|51.05|13.74|4;Norimberga|Germania|NUE|49.45|11.08|4;Stoccarda|Germania|STR|48.78|9.18|4;Lipsia|Germania|LEJ|51.34|12.37|4;Salisburgo|Austria|SZG|47.8|13.04|4;Innsbruck|Austria|INN|47.27|11.39|4;Zurigo|Svizzera|ZRH|47.37|8.54|5;Ginevra|Svizzera|GVA|46.2|6.14|5;Lucerna|Svizzera|ZRH|47.05|8.31|5;Basilea|Svizzera|BSL|47.56|7.59|5;Bruxelles|Belgio|BRU|50.85|4.35|4;Bruges|Belgio|BRU|51.21|3.22|4;Anversa|Belgio|BRU|51.22|4.4|4;Gand|Belgio|BRU|51.05|3.72|4;Rotterdam|Paesi Bassi|RTM|51.92|4.48|5;L'Aia|Paesi Bassi|AMS|52.08|4.31|5;Utrecht|Paesi Bassi|AMS|52.09|5.12|5;Londra|Regno Unito|LHR|51.51|-0.13|5;Edimburgo|Regno Unito|EDI|55.95|-3.19|5;Manchester|Regno Unito|MAN|53.48|-2.24|5;Liverpool|Regno Unito|LPL|53.41|-2.98|5;Dublino|Irlanda|DUB|53.35|-6.26|5;Cork|Irlanda|ORK|51.9|-8.47|5;Varsavia|Polonia|WAW|52.23|21.01|2;Danzica|Polonia|GDN|54.35|18.65|2;Breslavia|Polonia|WRO|51.11|17.04|2;Poznań|Polonia|POZ|52.41|16.93|2;Bratislava|Slovacchia|BTS|48.15|17.11|2;Lubiana|Slovenia|LJU|46.05|14.51|3;Zagabria|Croazia|ZAG|45.81|15.98|3;Spalato|Croazia|SPU|43.51|16.44|3;Zara|Croazia|ZAD|44.12|15.23|3;Pola|Croazia|PUY|44.87|13.85|3;Sarajevo|Bosnia ed Erzegovina|SJJ|43.86|18.41|1;Mostar|Bosnia ed Erzegovina|SJJ|43.34|17.81|1;Belgrado|Serbia|BEG|44.79|20.45|1;Kotor|Montenegro|TIV|42.42|18.77|2;Podgorica|Montenegro|TGD|42.44|19.26|2;Skopje|Macedonia del Nord|SKP|42.0|21.43|1;Ocrida|Macedonia del Nord|OHD|41.12|20.8|1;Bucarest|Romania|OTP|44.43|26.1|1;Cluj-Napoca|Romania|CLJ|46.77|23.6|1;Brașov|Romania|OTP|45.65|25.61|1;Varna|Bulgaria|VAR|43.21|27.91|1;Salonicco|Grecia|SKG|40.64|22.94|3;Creta (Heraklion)|Grecia|HER|35.34|25.13|3;Santorini|Grecia|JTR|36.39|25.46|3;Corfù|Grecia|CFU|39.62|19.92|3;Rodi|Grecia|RHO|36.43|28.22|3;Mykonos|Grecia|JMK|37.45|25.33|3;Istanbul|Turchia|IST|41.01|28.98|2;Antalya|Turchia|AYT|36.9|30.7|2;Larnaca|Cipro|LCA|34.92|33.63|3;La Valletta|Malta|MLA|35.9|14.51|3;Reykjavik|Islanda|KEF|64.15|-21.94|5;Oslo|Norvegia|OSL|59.91|10.75|5;Bergen|Norvegia|BGO|60.39|5.32|5;Stoccolma|Svezia|ARN|59.33|18.07|5;Göteborg|Svezia|GOT|57.71|11.97|5;Copenaghen|Danimarca|CPH|55.68|12.57|5;Helsinki|Finlandia|HEL|60.17|24.94|5;Tallinn|Estonia|TLL|59.44|24.75|2;Riga|Lettonia|RIX|56.95|24.11|2;Vilnius|Lituania|VNO|54.69|25.28|2;Tbilisi|Georgia|TBS|41.72|44.79|1";
const norm=s=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
const CITIES=CITY_RAW.split(";").map(x=>{
  const [name,cc,iata,lat,lon,lv]=x.split("|"),L=LV[+lv];
  return {id:"c_"+norm(name).replace(/[^a-z0-9]/g,""),name,cc,iata,lat:+lat,lon:+lon,it:cc==="Italia",est:true,...L,tags:[],
    note:"Stima basata sulla distanza e sul costo medio della vita in "+cc+".",
    day:[{n:"Free walking tour del centro storico",c:0},{n:"Museo o monumento principale",c:Math.round(L.ac*1.2)},{n:"Mercato locale e pranzo tipico",c:0},{n:"Quartiere più vivace o panoramico",c:0},{n:"Parco, lungofiume o lungomare",c:0},{n:"Seconda attrazione a scelta",c:Math.round(L.ac*1.2)}],
    eve:[{n:"Cena tipica in un locale frequentato dai residenti",c:Math.round(L.fo*0.7)},{n:"Aperitivo in centro",c:8},{n:"Passeggiata serale e dolce tipico",c:4}],
    gita:"Gita di un giorno nei dintorni (chiedi consiglio all'ufficio turistico)"};
});
const COORD={lis:[38.72,-9.14],opo:[41.15,-8.61],bcn:[41.39,2.17],vlc:[39.47,-0.38],agp:[36.72,-4.42],bud:[47.5,19.04],prg:[50.08,14.44],krk:[50.06,19.94],tia:[41.33,19.82],sof:[42.7,23.32],ath:[37.98,23.73],vie:[48.21,16.37],ber:[52.52,13.4],ams:[52.37,4.9],par:[48.86,2.35],dbv:[42.65,18.09],nap:[40.85,14.27],flr:[43.77,11.25],vce:[45.44,12.32],pmo:[38.12,13.36],lcc:[40.35,18.17],blq:[44.49,11.34],cag:[39.22,9.12]};
DESTS.forEach(d=>{const c=COORD[d.id];d.lat=c[0];d.lon=c[1]});
const WORLD_RAW="Marrakech|Marocco|RAK|31.63|-7.99|1;Il Cairo|Egitto|CAI|30.04|31.24|1;Dubai|Emirati Arabi Uniti|DXB|25.2|55.27|4;Tel Aviv|Israele|TLV|32.08|34.78|4;New York|Stati Uniti|JFK|40.71|-74.01|5;Miami|Stati Uniti|MIA|25.76|-80.19|4;Toronto|Canada|YYZ|43.65|-79.38|4;Città del Messico|Messico|MEX|19.43|-99.13|2;Rio de Janeiro|Brasile|GIG|-22.91|-43.17|2;Buenos Aires|Argentina|EZE|-34.6|-58.38|2;Tokyo|Giappone|NRT|35.68|139.76|4;Bangkok|Thailandia|BKK|13.75|100.5|1;Singapore|Singapore|SIN|1.35|103.82|4;Seoul|Corea del Sud|ICN|37.57|126.98|3;Pechino|Cina|PEK|39.9|116.4|2;Hanoi|Vietnam|HAN|21.03|105.85|1;Nairobi|Kenya|NBO|-1.29|36.82|2;Città del Capo|Sudafrica|CPT|-33.92|18.42|2;Sydney|Australia|SYD|-33.87|151.21|5";
const WORLD=WORLD_RAW.split(";").map(x=>{
  const [name,cc,iata,lat,lon,lv]=x.split("|"),L=LV[+lv];
  return {id:"w_"+norm(name).replace(/[^a-z0-9]/g,""),name,cc,iata,lat:+lat,lon:+lon,it:false,world:true,est:true,...L,tags:[],
    note:"Stima su un volo intercontinentale, di solito con uno scalo, e sul costo medio della vita in "+cc+".",
    day:[{n:"Free walking tour del centro",c:0},{n:"Il quartiere o il mercato più caratteristico",c:0},{n:"Il monumento o museo principale",c:Math.round(L.ac*1.4)},{n:"Un parco o un punto panoramico",c:0},{n:"Un secondo quartiere da scoprire",c:0},{n:"Una gita fuori città",c:Math.round(L.ac*1.6)}],
    eve:[{n:"Cena in un locale frequentato dai residenti",c:Math.round(L.fo*0.8)},{n:"Mercato serale o zona con locali",c:6},{n:"Passeggiata serale",c:0}],
    gita:"Gita di un giorno nei dintorni (informati in loco su come raggiungerla)"};
});
const WORLD_NOTES={
 w_marrakech:"Clima gradevole in primavera e in autunno; in piena estate le temperature sono molto alte.",
 w_ilcairo:"Meglio evitare i mesi più caldi dell'estate; il resto dell'anno il clima è secco e piacevole.",
 w_dubai:"Da ottobre ad aprile le temperature sono più gestibili; in estate il caldo è molto intenso.",
 w_telaviv:"Clima mediterraneo, piacevole per gran parte dell'anno.",
 w_newyork:"Le stagioni sono marcate: primavera e autunno hanno il clima più gradevole per girare a piedi.",
 w_miami:"Clima caldo tutto l'anno; l'estate porta anche molta umidità e il rischio di uragani.",
 w_toronto:"Gli inverni sono molto rigidi: la stagione migliore va da maggio a settembre.",
 w_cittadelmessico:"Il clima è gradevole quasi tutto l'anno, grazie all'altitudine della città.",
 w_riodejaneiro:"Clima caldo tutto l'anno, più intenso durante l'estate carioca (dicembre-marzo).",
 w_buenosaires:"Le stagioni sono invertite rispetto all'Italia: qui fa caldo quando in Europa è inverno.",
 w_tokyo:"Primavera e autunno, con clima mite, sono le stagioni più indicate per visitarla.",
 w_bangkok:"Il periodo più fresco e secco va da novembre a febbraio; nel resto dell'anno è più caldo e umido.",
 w_singapore:"Clima caldo e umido tutto l'anno, molto vicino all'equatore.",
 w_seoul:"Gli inverni sono freddi e le estati calde e umide: primavera e autunno restano le stagioni migliori.",
 w_pechino:"Inverni freddi e secchi, estati calde: primavera e autunno sono le stagioni più equilibrate.",
 w_hanoi:"Il nord del Vietnam ha una stagione secca e fresca da ottobre ad aprile.",
 w_nairobi:"Il clima è mite quasi tutto l'anno grazie all'altitudine, con due stagioni delle piogge.",
 w_cittadelcapo:"Le stagioni sono invertite rispetto all'Italia: qui è estate quando in Europa è inverno.",
 w_sydney:"Le stagioni sono invertite rispetto all'Italia: qui è estate quando in Europa è inverno."
};
const ALL=DESTS.concat(CITIES).concat(WORLD);
const hav=(a,b,c,d)=>{const R=6371,r=x=>x*Math.PI/180,dl=r(c-a),dn=r(d-b);const q=Math.sin(dl/2)**2+Math.cos(r(a))*Math.cos(r(c))*Math.sin(dn/2)**2;return 2*R*Math.asin(Math.sqrt(q))};
const ISL_FORCE=["PMI","IBZ","TFS","FNC","HER","JTR","CFU","RHO","JMK","MLA","LCA","KEF"];
const islandOf=id=>["PMO","CTA","TPS"].includes(id)?"si":["CAG","OLB","AHO"].includes(id)?"sa":null;
const fmtH=h=>{let hh=Math.floor(h),mm=Math.round((h-hh)*2)*30;if(mm===60){hh++;mm=0}return hh+" h"+(mm?" 30":"")};
function travelOpt(d,dep,pref){
  const km=hav(dep.lat,dep.lon,d.lat,d.lon);
  if(d.world){
    const cost=90+0.045*km,hrs=fmtH(2+km/800);
    return {mode:"volo",cost,km,canTrain:false,canFly:true,hrs,note:"Stima per un volo intercontinentale, spesso con uno scalo: orari e scali variano molto, verificali sempre prima di prenotare."};
  }
  const isl=ISL_FORCE.includes(d.iata)||islandOf(dep.id)!==islandOf(d.iata);
  const canTrain=!isl&&km<=1400,canFly=isl||km>=250;
  const trainCost=Math.max(12,10+0.16*km),flyCost=Math.max(45,30+0.03*km);
  let mode,note="";
  if(pref==="treno"&&canTrain)mode="treno";
  else if(pref==="volo"&&canFly)mode="volo";
  else{
    mode=d.mode||(km<450&&!isl?"treno":"volo");
    if(mode==="treno"&&!canTrain)mode="volo";
    if(mode==="volo"&&!canFly)mode="treno";
    if(pref==="treno")note="Il treno non è praticabile su questa tratta: la stima è in "+(mode==="volo"?"aereo":"treno")+".";
    if(pref==="volo")note="Un volo su questa tratta non è praticabile: la stima è in treno.";
  }
  const cost=(d.f&&mode===d.mode)?d.f[dep.z]:(mode==="treno"?trainCost:flyCost);
  const hrs=fmtH(mode==="treno"?km*1.15/140:0.5+km/750);
  return {mode,cost,km,canTrain,canFly,hrs,note};
}
const isHere=d=>{const dep=DEPS.find(x=>x.id===state.from);return norm(dep.n).includes(norm(d.name))||(dep.ex&&norm(d.name)===dep.ex)};
const contOf=d=>d.world?"mondo":d.it?"italia":"europa";

/* ---------- Stato ---------- */
const pad=n=>String(n).padStart(2,"0");
const isoOf=d=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const todayISO=()=>isoOf(new Date());
const addDays=(iso,n)=>{const d=new Date(iso+"T12:00:00");d.setDate(d.getDate()+n);return isoOf(d)};
function defaultDate(){const d=new Date();d.setDate(d.getDate()+35);while(d.getDay()!==5)d.setDate(d.getDate()+1);return isoOf(d)}
const state={tab:"cerca",profile:"coppia",from:"FCO",date:defaultDate(),nights:3,fc:true,tm:"auto",themes:["classico"],dest:"tutte",ret:addDays(defaultDate(),3),people:2,kids:0,kidsAges:[],budget:300,filter:"tutte",lc:{nights:2,cap:200,month:new Date().getMonth()+1},piggy:{monthly:0,saved:0,target:0}};
let saved=[];
try{const s=JSON.parse(localStorage.getItem("vl.state")||"null");if(s)Object.assign(state,s,{tab:"cerca"});}catch(e){}
try{saved=JSON.parse(localStorage.getItem("vl.saved")||"[]")||[];}catch(e){saved=[]}
if(state.date<todayISO())state.date=defaultDate();
const daysBetween=(a,b)=>Math.round((new Date(b+"T12:00:00")-new Date(a+"T12:00:00"))/864e5);
if(!state.ret||state.ret<=state.date)state.ret=addDays(state.date,state.nights||3);
if(daysBetween(state.date,state.ret)>30)state.ret=addDays(state.date,30);
state.nights=daysBetween(state.date,state.ret);
if(!Number.isInteger(state.kids)||state.kids<0)state.kids=0;
if(state.kids>state.people-1)state.kids=Math.max(0,state.people-1);
if(!Array.isArray(state.kidsAges))state.kidsAges=[];
if(state.dest!=="tutte"&&state.dest!=="?"&&!ALL.some(d=>d.id===state.dest))state.dest="tutte";
const persist=()=>{try{localStorage.setItem("vl.state",JSON.stringify(state))}catch(e){}};
const persistSaved=()=>{try{localStorage.setItem("vl.saved",JSON.stringify(saved))}catch(e){}};

/* ---------- Calcolo costi ---------- */
const fmt=n=>Math.round(n).toLocaleString("it-IT")+" €";
const fmtD=iso=>new Date(iso+"T12:00:00").toLocaleDateString("it-IT",{day:"numeric",month:"short"});
const dfmtR=iso=>new Date(iso+"T12:00:00").toLocaleDateString("it-IT",{day:"numeric",month:"long",year:"numeric"});
function seasonF(iso){const m=new Date(iso+"T12:00:00").getMonth()+1;
  if(m===7||m===8)return 1.35; if(m===12||m===4)return 1.15; if(m===6||m===9)return 1.08; if(m===1||m===2||m===11)return 0.85; return 1}
function seasonLabel(iso){const f=seasonF(iso);return f>=1.3?"alta stagione":f>=1.1?"stagione medio-alta":f<1?"bassa stagione":"stagione media"}
function calc(d,p){
  const dep=DEPS.find(x=>x.id===p.from), n=p.nights, days=n+1, pe=p.people, f=seasonF(p.date);
  const t=travelOpt(d,dep,p.tm||"auto");
  const d0={...d,mode:t.mode};
  const trF=d0.mode==="treno"?1+(f-1)/2:f;
  const trav=t.cost*pe*trF;
  let lodg,lodgLabel;
  if(p.profile==="amici"){lodg=d.h*pe*n*f;lodgLabel="Ostello o camere condivise";}
  else if(p.profile==="coppia"){const r=Math.ceil(pe/2);lodg=d.ho*r*n*f;lodgLabel="Hotel o B&B ("+r+(r>1?" camere":" camera")+")";}
  else{const a=Math.ceil(pe/4);lodg=d.ap*a*n*f;lodgLabel="Appartamento ("+a+(a>1?" appartamenti":" appartamento")+")";}
  const food=d.fo*pe*days*(p.profile==="famiglia"?0.85:1);
  const trans=d.tr*pe*days;
  const act=d.ac*pe*n*(p.profile==="coppia"?1.2:p.profile==="famiglia"?1.1:1);
  const parts={trav,lodg,food,trans,act};
  Object.keys(parts).forEach(k=>parts[k]=Math.round(parts[k]));
  const total=Object.values(parts).reduce((a,b)=>a+b,0);
  return {d:d0,dep,p:{...p},parts,total,pp:Math.round(total/pe),lodgLabel,t,hrs:t.hrs,note:t.note};
}
const usable=p=>{const dep=DEPS.find(x=>x.id===p.from);return DESTS.filter(d=>!(dep.ex&&d.name.toLowerCase()===dep.ex))};
const PARTS=[["trav","Trasporto","var(--c1)"],["lodg","Alloggio","var(--c2)"],["food","Pasti","var(--c3)"],["trans","Spostamenti","var(--c4)"],["act","Attività","var(--c5)"]];

/* ---------- Itinerario ---------- */
function itinerary(r){
  const d=r.d,p=r.p,n=p.nights,days=Math.min(n+1,8),out=[];
  const tips=TIPS[p.profile];let k=1,gitaDone=false;
  for(let i=0;i<days;i++){
    let title,items=[];
    if(i===0){title="Arrivo e primo giro";items=[["Pomeriggio",d.day[0]],["Sera",d.eve[0]]]}
    else if(i===n){title="Rientro";items=[["Mattina",{n:"Ultima colazione e acquisti dell'ultimo minuto",c:0}],["Poi",{n:"Trasferimento verso "+(d.mode==="treno"?"la stazione":"l'aeroporto"),c:0}]]}
    else if(k<d.day.length){title="Giornata "+(i+1);items=[["Mattina",d.day[k]],["Pomeriggio",d.day[k+1]||{n:"Relax e shopping",c:0}],["Sera",d.eve[i%d.eve.length]]];k+=2}
    else if(!gitaDone){gitaDone=true;title="Gita fuori porta";items=[["Giornata",{n:d.gita+" (trasporti compresi nel budget spostamenti)",c:0}],["Sera",d.eve[i%d.eve.length]]]}
    else{title="Giornata libera";items=[["Mattina",{n:"Riprendi il posto che ti è piaciuto di più",c:0}],["Pomeriggio",{n:"Quartiere non ancora visto o relax",c:0}],["Sera",d.eve[i%d.eve.length]]]}
    out.push({title,items,hint:tips[i%tips.length]});
  }
  return out;
}

const TP_MARKER="782207";
const GOCITY_SLUGS={ams:"amsterdam",bcn:"barcelona",par:"paris",w_singapore:"singapore",w_sydney:"sydney",w_miami:"miami",c_roma:"rome",c_dublino:"dublin",c_stoccolma:"stockholm",c_londra:"london"};
const ddmm=iso=>iso.slice(8,10)+iso.slice(5,7);
const aviasalesUrl=(oIata,dIata,dateOut,dateBack,pax)=>"https://www.aviasales.it/search/"+oIata+ddmm(dateOut)+dIata+ddmm(dateBack)+Math.max(1,Math.min(9,pax))+"?marker="+TP_MARKER;

/* ---------- Link partner ---------- */
function links(r){
  const p=r.p,d=r.d,dep=r.dep,out=addDays(p.date,p.nights),pe=p.people,q=encodeURIComponent;
  const kids=Math.min(p.kids||0,pe-1),kidsAges=(p.kidsAges||[]).slice(0,kids),adults=pe-kids;
  const rooms=p.profile==="famiglia"?Math.ceil(pe/4):Math.ceil(pe/2);
  const yy=x=>x.slice(2).replace(/-/g,"");
  const t=r.t,voli=[],treni=[];
  if(t.canFly){
    voli.push(["Aviasales (con tratta e date, i tuoi link)",aviasalesUrl(dep.id,d.iata,p.date,out,pe)]);
    voli.push(["Skyscanner","https://www.skyscanner.it/trasporti/voli/"+dep.id.toLowerCase()+"/"+d.iata.toLowerCase()+"/"+yy(p.date)+"/"+yy(out)+"/?adultsv2="+pe]);
    voli.push(["Google Voli","https://www.google.com/travel/flights?hl=it&curr=EUR&q="+q("Flights from "+dep.id+" to "+d.iata+" on "+p.date+" through "+out)]);
    voli.push(["Kayak","https://www.kayak.it/flights/"+dep.id+"-"+d.iata+"/"+p.date+"/"+out+"/"+pe+"adults"]);
  }
  if(t.canTrain){
    const from=dep.n.split(" ")[0];
    if(d.it){treni.push(["Trenitalia (sito)","https://www.trenitalia.com/it.html"]);treni.push(["Italo (sito)","https://www.italotreno.com/it"]);}
    treni.push(["Trainline (sito)","https://www.thetrainline.com/it"]);
    treni.push(["Omio (sito)","https://www.omio.it"]);
    treni.push(["Indicazioni mezzi pubblici · Google Maps","https://www.google.com/maps/dir/?api=1&origin="+q(from+", Italia")+"&destination="+q(d.name+", "+d.cc)+"&travelmode=transit"]);
    treni.push(["FlixBus (sito)","https://www.flixbus.it"]);
  }
  const fc=state.fc!==false,place=d.name+", "+d.cc;
  const nightlyCap=Math.max(30,Math.round((r.parts.lodg/p.nights/rooms)*2.2));
  const bk=(label,flt,extra)=>{const f=flt.slice();if(fc)f.push("fc=2");f.push("price=EUR-0-"+nightlyCap+"-1");
    return [label,"https://www.booking.com/searchresults.it.html?ss="+q(place)+"&checkin="+p.date+"&checkout="+out+"&group_adults="+adults+"&group_children="+kids+kidsAges.map(a=>"&age="+a).join("")+"&no_rooms="+rooms+(f.length?"&nflt="+q(f.join(";")):"")+(extra||"")]};
  const ab=()=>["Case e appartamenti · Airbnb","https://www.airbnb.it/s/"+q(place)+"/homes?checkin="+p.date+"&checkout="+out+"&adults="+adults+(kids?"&children="+kids:"")+(fc?"&flexible_cancellation=true":"")+"&price_max="+nightlyCap];
  const avHotel=()=>["Aviasales — alloggi (con la tua commissione)","https://www.aviasales.it/hotels?checkin="+p.date+"&checkout="+out+"&adults="+pe+"&marker="+TP_MARKER];
  let alloggi;
  if(p.profile==="amici")alloggi=[avHotel(),bk("Ostelli · Booking.com",["ht_id=203"],"&order=price"),bk("Alloggi più economici · Booking.com",[],"&order=price"),ab()];
  else if(p.profile==="coppia")alloggi=[avHotel(),bk("Hotel · Booking.com",["ht_id=204"]),bk("B&B · Booking.com",["ht_id=208"]),ab()];
  else alloggi=[avHotel(),bk("Appartamenti · Booking.com",["ht_id=201"]),ab(),bk("Hotel · Booking.com",["ht_id=204"])];
  const gcSlug=GOCITY_SLUGS[d.id];
  const offerte=[["Tour ed esperienze · KKday","https://www.kkday.com/en/product/productlist/"+q(d.name)+"?marker="+TP_MARKER+"&currency=EUR"],["Transfer aeroporto-hotel · intui.travel","https://it.intui.travel/?marker="+TP_MARKER]];
  if(gcSlug)offerte.push(["Pass per le attrazioni · Go City","https://gocity.com/en/"+gcSlug+"?marker="+TP_MARKER]);
  const dfmt=iso=>new Date(iso+"T12:00:00").toLocaleDateString("it-IT",{weekday:"short",day:"numeric",month:"short"});
  const sum=dep.n+" → "+d.name+" · andata "+dfmt(p.date)+" · ritorno "+dfmt(out)+" · "+pe+(pe===1?" persona":" persone");
  return {voli,treni,alloggi,offerte,sum,nightlyCap};
}

/* ---------- Proposte del mese ---------- */
const MESI=["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"];
const MONTH_PICKS={
 1:[["bud","Le terme all'aperto sono perfette col freddo, e i prezzi sono tra i più bassi dell'anno."],["sof","Aria di montagna a un'ora dal centro e tariffe tra le più basse d'Europa."],["lis","Inverno mite, si cammina bene e i voli costano meno che in altre stagioni."],["krk","Atmosfera invernale nel centro storico, con alloggi ancora a prezzi bassi."]],
 2:[["prg","Bassa stagione: meno file ai musei e alloggi più economici."],["ath","Clima mite, pochi turisti rispetto all'estate e prezzi in calo."],["tia","Tra le capitali più economiche d'Europa in ogni periodo dell'anno."],["vlc","Il sud della Spagna resta mite e i prezzi sono ancora bassi."]],
 3:[["agp","Le prime giornate calde, prima dell'arrivo della folla estiva."],["bcn","Clima piacevole e prezzi più bassi rispetto alla stagione estiva."],["sof","Prezzi contenuti tutto l'anno, ideale per un weekend economico."],["krk","Le giornate si allungano e il centro storico si gira comodamente a piedi."]],
 4:[["prg","Clima gradevole per girare a piedi, prima dell'afflusso estivo."],["dbv","Le mura e il centro storico senza la calca e i prezzi dell'estate."],["vie","Stagione intermedia: musei e palazzi con codificamento (visitabili) senza il pieno turistico."],["lis","Primavera mite, ottima per le lunghe passeggiate in centro."]],
 5:[["bcn","Bel clima prima del caldo intenso dell'estate, con prezzi ancora contenuti."],["flr","Le giornate lunghe aiutano a visitare senza fretta, prima del pieno turistico estivo."],["vlc","Mare piacevole e prezzi non ancora al livello dell'alta stagione."],["bud","Stagione intermedia, comoda per unire terme e visite in città."]],
 6:[["cag","Mare e centro storico insieme, prima del pieno di luglio e agosto."],["pmo","Spiagge vicine e prezzi ancora ragionevoli a inizio stagione."],["dbv","Inizio d'estate, prima dei prezzi più alti di luglio e agosto."],["nap","Buona stagione per girare a piedi tra vicoli e lungomare."]],
 7:[["bud","In piena estate resta più economica delle mete di mare, con le terme come sollievo dal caldo."],["krk","Città interna, con prezzi che salgono meno rispetto alle coste in alta stagione."],["sof","Tra le mete più economiche anche nel pieno dell'estate."],["tia","Prezzi bassi anche nei mesi di punta, con la possibilità di raggiungere il mare vicino."]],
 8:[["prg","Meno cara delle mete balneari, anche se è comunque piena di visitatori."],["krk","Un'alternativa economica alle mete di mare nel mese più caro dell'anno."],["ber","Molte attrazioni gratuite o economiche, utile quando i prezzi generali salgono."],["sof","Prezzi tra i più bassi d'Europa anche ad agosto inoltrato."]],
 9:[["dbv","Fine della stagione estiva, con meno folla e prezzi che iniziano a scendere."],["ath","Il mare resta caldo e i prezzi calano rispetto ad agosto."],["bcn","Meno affollata di luglio e agosto, con il mare ancora piacevole."],["vlc","Settembre unisce mare caldo e prezzi in discesa rispetto all'estate."]],
 10:[["flr","Clima gradevole per camminare, con l'afflusso estivo ormai alle spalle."],["vce","Meno turisti che in primavera o in estate, con prezzi più accessibili."],["blq","Buona stagione per il centro storico e la cucina locale, senza il caldo estivo."],["ams","La bassa stagione fa scendere un po' i prezzi, tra i più alti d'Europa."]],
 11:[["krk","Prezzi bassi prima dell'arrivo dei mercatini di dicembre."],["bud","Stagione economica, comoda per unire terme al chiuso e visite in città."],["prg","Bassa stagione: alloggi più economici e meno code ai musei."],["sof","Tra le città più economiche d'Europa anche nei mesi più freddi."]],
 12:[["vie","I mercatini di Natale nel centro storico sono un classico della stagione."],["krk","Atmosfera natalizia nel centro storico, con prezzi ancora contenuti fuori dalle feste."],["bud","Le terme all'aperto d'inverno sono un'esperienza particolare, con prezzi bassi."],["lis","Inverno mite rispetto al resto d'Europa, buono per chi cerca clima più tiepido."]]
};
function repDate(month,nights){
  const y=new Date().getFullYear();
  let d=new Date(y,month-1,15,12);
  if(isoOf(d)<todayISO())d=new Date(y+1,month-1,15,12);
  return isoOf(d);
}
const usableAll=()=>ALL.filter(d=>!isHere(d));
function reasonFor(id,cont){
  if(cont==="mondo")return WORLD_NOTES[id]||null;
  const p=(MONTH_PICKS[state.lc.month]||[]).find(x=>x[0]===id);
  return p?p[1]:null;
}
function monthTile(r,reason,badge){
  const {d,pp}=r;
  return `<button class="mtile" data-open="${d.id}" data-nights="${r.p.nights}" data-date="${r.p.date}">${badge?`<span class="mbadge">${badge}</span>`:""}<h5>${d.name}</h5><span class="cc">${d.cc} · ${r.p.nights} notti</span><span class="price">${fmt(pp)}<small> /persona</small></span>${reason?`<span class="note">${reason}</span>`:""}</button>`;
}
function contList(cont,cap,date,nights,limit){
  let list=usableAll().filter(d=>contOf(d)===cont).map(d=>{
    const r=calc(d,{...state,date,nights}),reason=reasonFor(d.id,cont);
    return {r,reason,badge:cont!=="mondo"&&reason?"Consigliata per il mese":null};
  }).filter(x=>x.r.pp<=cap);
  list.sort((a,b)=>{const ra=a.reason?0:1,rb=b.reason?0:1;return ra!==rb?ra-rb:a.r.pp-b.r.pp;});
  return list.slice(0,limit);
}
function renderContGroup(elId,cont,label,cap,date,nights,limit,m){
  const list=contList(cont,cap,date,nights,limit),el=$("#"+elId);
  if(list.length){el.innerHTML=list.map(x=>monthTile(x.r,x.reason,x.badge)).join("");return}
  const cheapest=usableAll().filter(d=>contOf(d)===cont).map(d=>calc(d,{...state,date,nights})).sort((a,b)=>a.pp-b.pp)[0];
  el.innerHTML=`<div class="mempty">Nessuna meta ${label} sotto ${cap} € per ${MESI[m-1]}.${cheapest?" La più economica è "+cheapest.d.name+" a "+fmt(cheapest.pp)+".":""}</div>`;
}
function renderMonthPicks(){
  const m=state.lc.month,cap=state.lc.cap,nights=state.lc.nights||2,date=repDate(m,nights),dep=DEPS.find(x=>x.id===state.from);
  if(!$("#lcMonth").options||!$("#lcMonth").options.length){
    $("#lcMonth").innerHTML=MESI.map((mm,i)=>`<option value="${i+1}">${mm[0].toUpperCase()+mm.slice(1)}</option>`).join("");
    $("#lcNightsSel").innerHTML=[2,3,4,6,8].map(v=>`<option value="${v}">${v} notti</option>`).join("");
    $("#lcCapSel").innerHTML=[150,200,250,300,400,600,900].map(v=>`<option value="${v}">Sotto ${v} €</option>`).join("");
  }
  $("#lcMonth").value=m;$("#lcNightsSel").value=nights;$("#lcCapSel").value=cap;
  $("#monthTitle").textContent="La proposta del mese: "+MESI[m-1]+", sotto "+cap+" € a persona · da "+dep.n;
  renderContGroup("monthRowsIT","italia","in Italia",cap,date,nights,4,m);
  renderContGroup("monthRowsEU","europa","in Europa",cap,date,nights,4,m);
  renderContGroup("monthRowsW","mondo","nel mondo",cap,date,nights,3,m);
}

/* ---------- Rendering ---------- */
const $=s=>document.querySelector(s);
function passCard(r,over){
  const {d,parts,total,pp,p}=r, diff=pp-state.budget, L=links(r);
  const bar=PARTS.map(([k,,c])=>`<b style="width:${(parts[k]/total*100).toFixed(1)}%;background:${c}"></b>`).join("");
  const leg=PARTS.map(([k,l,c])=>`<li><i style="background:${c}"></i>${k==="trav"?(d.mode==="treno"?"Treno/bus":"Volo")+" (~"+r.hrs+")":l} ${fmt(parts[k])}</li>`).join("");
  return `<article class="pass ${over?"over":""}">
   <div class="pass-main">
    <div class="pass-top"><h3>${d.name}</h3><span class="tag">${d.it?"Italia":d.cc}</span></div>
    <p class="note">${d.note}</p>
    <div class="bar" role="img" aria-label="Ripartizione dei costi">${bar}</div>
    <ul class="legend">${leg}</ul>
    ${r.note?`<p class="fine" style="margin:8px 0 0">${r.note}</p>`:""}
   </div>
   <div class="pass-stub">
    <div class="pp">${fmt(pp)}<small>a persona</small></div>
    <div class="tot">${fmt(total)} per ${p.people} ${p.people===1?"persona":"persone"}, ${p.nights} notti</div>
    <div class="status ${diff<=0?"ok":"no"}">${diff<=0?"Dentro il budget":"+"+fmt(diff)+" oltre il budget"}</div>
    <button class="btn" data-open="${d.id}" data-nights="${p.nights}">Dettagli e itinerario</button>
    <div class="qlinks">${L.voli.length?`<a class="btn ghost sm" href="${L.voli[0][1]}" target="_blank" rel="noopener noreferrer">Voli</a>`:""}${L.treni.length?`<a class="btn ghost sm" href="${L.treni[0][1]}" target="_blank" rel="noopener noreferrer">Treni</a>`:""}<a class="btn ghost sm" href="${L.alloggi[0][1]}" target="_blank" rel="noopener noreferrer">Alloggi</a></div>
   </div>
  </article>`;
}
function renderSearch(){
  const f=state.filter;
  let list=usable(state).filter(d=>f==="tutte"||(f==="italia"?d.it:f==="europa"?!d.it:d.tags.includes(f)));
  let chosen=null,notFound=false;
  if(state.dest==="?")notFound=true;
  else if(state.dest!=="tutte"){const cd=ALL.find(x=>x.id===state.dest);chosen=cd&&!isHere(cd)?calc(cd,state):false;}
  const rs=list.filter(d=>!(chosen&&d.id===chosen.d.id)).map(d=>calc(d,state)).sort((a,b)=>a.pp-b.pp);
  const inb=rs.filter(r=>r.pp<=state.budget), over=rs.filter(r=>r.pp>state.budget);
  const dep=DEPS.find(x=>x.id===state.from);
  $("#sumTitle").textContent=notFound?"Città non trovata":chosen?"Il tuo viaggio a "+chosen.d.name:chosen===false?"Meta non disponibile da qui":(inb.length?(inb.length===1?"1 meta dentro il budget":inb.length+" mete dentro il budget"):"Nessuna meta dentro il budget");
  $("#sumMeta").textContent="Da "+dep.n+" · "+fmtD(state.date)+" - "+fmtD(state.ret)+" ("+state.nights+(state.nights===1?" notte":" notti")+") · "+seasonLabel(state.date)+" · prezzi a persona";
  const res=$("#results");
  const alt=inb.map(r=>passCard(r,false)).join("");
  if(notFound){res.innerHTML=notFoundHtml()}
  else if(chosen!==null){
    let h=chosen?passCard(chosen,false):`<div class="empty"><strong>Parti già da lì.</strong><br>Scegli una destinazione diversa dalla città di partenza.</div>`;
    if(alt)h+=`<h3 class="sub">Altre idee nello stesso budget</h3>`+alt;
    res.innerHTML=h;
  }
  else if(inb.length)res.innerHTML=alt;
  else{const m=rs[0];res.innerHTML=`<div class="empty"><strong>Con ${fmt(state.budget)} a persona non c'è una meta adatta per queste date.</strong><br>${m?"La più economica è "+m.d.name+" a "+fmt(m.pp)+" a persona. ":""}Prova ad alzare il budget, a ridurre le notti o a scegliere un periodo di bassa stagione.</div>`}
  const ow=$("#overWrap");
  ow.hidden=!over.length||notFound;
  $("#overSum").textContent="Oltre il budget ("+over.length+")";
  $("#overList").innerHTML=over.map(r=>passCard(r,true)).join("");
}
function notFoundHtml(){
  const q=norm(state.destQ||""),head=q.slice(0,3);
  const sug=ALL.filter(d=>{const n=norm(d.name);return q&&(n.includes(q)||n.startsWith(head)||q.includes(n))}).slice(0,6);
  return `<div class="empty"><strong>Non conosco ancora "${(state.destQ||"").replace(/[<>&"]/g,"")}".</strong><br>Il prototipo copre ${ALL.length} città in Italia e in Europa. Nella versione completa la ricerca userà un database mondiale di città.${sug.length?'<div class="links" style="margin-top:12px">'+sug.map(d=>`<button class="btn ghost" data-pick="${d.id}">${d.name}</button>`).join("")+"</div>":""}</div>`;
}
function renderFilters(){
  const F=[["tutte","Tutte"],["italia","Italia"],["europa","Europa"],["mare","Mare"],["arte","Arte e città"],["cibo","Enogastronomia"],["natura","Natura"]];
  $("#filters").innerHTML=F.map(([k,l])=>`<button class="chip" data-filter="${k}" aria-pressed="${state.filter===k}">${l}</button>`).join("");
}
function rowCard(r){
  return `<div class="rowcard"><div><h4>${r.d.name}</h4><small>${r.d.it?"Italia":r.d.cc} · ${r.p.nights} notti · totale ${fmt(r.total)} per ${r.p.people}</small></div>
   <div class="pp">${fmt(r.pp)}<small>a persona</small></div>
   <button class="btn ghost" data-open="${r.d.id}" data-nights="${r.p.nights}">Vedi dettagli</button></div>`;
}
function renderLow(){
  renderMonthPicks();
  const dep=DEPS.find(x=>x.id===state.from);
  $("#lcMeta").textContent="Da "+dep.n+" · partenza "+new Date(state.date+"T12:00:00").toLocaleDateString("it-IT",{day:"numeric",month:"long"})+" · "+state.people+(state.people===1?" persona":" persone");
  const N=[[2,"Weekend (2 notti)"],[4,"4 notti"],[6,"Una settimana (6 notti)"]];
  $("#lcNights").innerHTML=N.map(([v,l])=>`<button class="chip" data-lcn="${v}" aria-pressed="${state.lc.nights===v}">${l}</button>`).join("");
  const C=[150,200,250,300,400];
  $("#lcCap").innerHTML=C.map(v=>`<button class="chip" data-lcc="${v}" aria-pressed="${state.lc.cap===v}">Sotto ${v} €</button>`).join("");
  const p={...state,nights:state.lc.nights};
  const rs=usable(p).map(d=>calc(d,p)).sort((a,b)=>a.pp-b.pp);
  const ok=rs.filter(r=>r.pp<=state.lc.cap).slice(0,10);
  $("#lcRows").innerHTML=ok.length?ok.map(rowCard).join(""):`<div class="empty"><strong>Nessuna idea sotto ${state.lc.cap} € a persona.</strong><br>La più economica è ${rs[0].d.name} a ${fmt(rs[0].pp)}. Prova un limite più alto, meno notti o un aeroporto diverso.</div>`;
  $("#tips").innerHTML=SAVE_TIPS.map(([t,x])=>`<div class="tip"><b>${t}</b><p>${x}</p></div>`).join("");
}
function renderSaved(){
  $("#savedCount").textContent=saved.length?"("+saved.length+")":"";
  const box=$("#savedRows");
  if(!saved.length){box.innerHTML=`<div class="empty"><strong>Non hai ancora salvato nessun viaggio.</strong><br>Apri i dettagli di una meta e usa "Salva viaggio".</div>`;return}
  box.innerHTML=saved.map((s,i)=>{const d=ALL.find(x=>x.id===s.id);if(!d)return"";const r=calc(d,s.p);
    return `<div class="rowcard"><div><h4>${d.name}</h4><small>Da ${r.dep.n} · ${new Date(s.p.date+"T12:00:00").toLocaleDateString("it-IT",{day:"numeric",month:"short",year:"numeric"})} · ${s.p.nights} notti · ${s.p.people} pers. · ${s.p.profile}</small></div>
    <div class="pp">${fmt(r.pp)}<small>a persona</small></div>
    <div style="display:flex;gap:8px"><button class="btn ghost" data-openp="${i}">Apri</button><button class="btn ghost" data-del="${i}" aria-label="Rimuovi ${d.name}">Rimuovi</button></div></div>`}).join("");
}
function piggyDate(i){const d=new Date();d.setDate(1);d.setMonth(d.getMonth()+i,15);return isoOf(d);}
function renderPiggyGoal(){
  const box=$("#piggyGoalBox"),monthly=state.piggy.monthly||1,total=state.piggy.saved||0;
  if(!saved.length){box.innerHTML=`<div class="mempty">Non hai ancora salvato nessun viaggio. Apri i dettagli di una meta e usa "Salva viaggio": comparirà qui come obiettivo, con una barra che si riempie ogni volta che aggiungi denaro.</div>`;return}
  const priced=saved.map(s=>{const d=ALL.find(x=>x.id===s.id);if(!d)return null;return {d,r:calc(d,s.p)};}).filter(Boolean).sort((a,b)=>a.r.pp-b.r.pp);
  if(!priced.length){box.innerHTML="";return}
  const cards=priced.map(({d,r})=>{
    const cost=r.pp,pct=Math.min(100,Math.round(total/cost*100)),done=total>=cost,remain=Math.max(0,cost-total);
    let sub;
    if(done)sub="Puoi già permettertelo!";
    else if(monthly>0){const m=Math.max(1,Math.ceil(remain/monthly));sub=fmt(remain)+" ancora da mettere via · circa "+m+" mes"+(m===1?"e":"i")+" al ritmo scelto";}
    else sub=fmt(remain)+" ancora da mettere via";
    const quick=done?"":`<div class="padd" style="margin-top:10px"><button class="chip" data-add="10">+10 €</button><button class="chip" data-add="20">+20 €</button><button class="chip" data-add="${remain}">Completa (+${fmt(remain)})</button></div>`;
    return `<div class="pgoal ${done?"done":""}"><h4>${d.name}<span>${fmt(cost)} a persona</span></h4><div class="bar"><b style="width:${pct}%"></b></div><p class="fine" style="margin:0">${fmt(total)} su ${fmt(cost)} · ${sub}</p>${quick}</div>`;
  }).join("");
  box.innerHTML=`<h3 style="font-size:1.05rem;font-family:var(--display);margin:22px 0 4px">I tuoi obiettivi</h3><div class="pgoals">${cards}</div>`;
}
function renderPiggyNow(){
  const total=Math.max(0,state.piggy.saved||0),today=todayISO(),el=$("#piggyNowRow");
  if(total<=0){el.innerHTML=`<div class="mempty">Aggiungi qualcosa al salvadanaio per vedere qui le prime mete a portata di mano.</div>`;return}
  const list=usableAll().map(d=>calc(d,{...state,date:today,nights:3})).filter(r=>r.pp<=total).sort((a,b)=>a.pp-b.pp).slice(0,8);
  if(!list.length){
    const cheapest=usableAll().map(d=>calc(d,{...state,date:today,nights:3})).sort((a,b)=>a.pp-b.pp)[0];
    el.innerHTML=`<div class="mempty">Con ${fmt(total)} non c'è ancora nulla: alla più economica (${cheapest.d.name}) mancano circa ${fmt(cheapest.pp-total)}.</div>`;
    return;
  }
  el.innerHTML=list.map(r=>monthTile(r,null,null)).join("");
}
function renderPiggyTarget(){
  const box=$("#piggyTargetBox"),target=state.piggy.target||0,total=state.piggy.saved||0,monthly=state.piggy.monthly||0;
  $("#piggyTarget").value=target||"";
  if(target<=0){box.innerHTML="";return}
  const pct=Math.min(100,Math.round(total/target*100)),remain=Math.max(0,target-total),done=total>=target;
  let extra="";
  if(!done&&monthly>0){
    const m=Math.max(1,Math.ceil(remain/monthly)),dt=new Date();dt.setDate(1);dt.setMonth(dt.getMonth()+m);
    extra=" · circa "+m+" mes"+(m===1?"e":"i")+" al ritmo scelto ("+MESI[dt.getMonth()]+" "+dt.getFullYear()+")";
  }
  box.innerHTML=`<div class="pgoal ptarget ${done?"done":""}"><h4>Il tuo obiettivo<span>${fmt(target)}</span></h4><div class="bar"><b style="width:${pct}%"></b></div><p class="fine" style="margin:0">${fmt(total)} su ${fmt(target)}${done?" · Obiettivo raggiunto! 🎉":" · mancano "+fmt(remain)+extra}</p></div>`;
}
function renderPiggy(){
  $("#piggyFrom").textContent=(DEPS.find(x=>x.id===state.from)||{}).n||"";
  $("#piggyTotalOut").textContent=fmt(state.piggy.saved||0);
  $("#piggyMonthly").value=state.piggy.monthly||0;
  $("#piggyMonthlyOut").textContent=state.piggy.monthly?fmt(state.piggy.monthly)+"/mese":"nessuna stima impostata";
  renderPiggyNow();
  renderPiggyTarget();
  renderPiggyGoal();
  const monthly=Math.max(0,state.piggy.monthly||0),already=Math.max(0,state.piggy.saved||0);
  const rows=[];
  for(let i=0;i<8;i++){
    const date=piggyDate(i),cum=already+monthly*i;
    const dt=new Date();dt.setDate(1);dt.setMonth(dt.getMonth()+i);
    const label=MESI[dt.getMonth()][0].toUpperCase()+MESI[dt.getMonth()].slice(1)+(dt.getFullYear()!==new Date().getFullYear()?" "+dt.getFullYear():"");
    const list=usableAll().map(d=>calc(d,{...state,date,nights:3})).filter(r=>r.pp<=cum).sort((a,b)=>a.pp-b.pp);
    let destTxt;
    if(list.length){
      destTxt=list.slice(0,2).map(r=>"<b>"+r.d.name+"</b> "+fmt(r.pp)).join(", ");
    }else{
      const cheapest=usableAll().map(d=>calc(d,{...state,date,nights:3})).sort((a,b)=>a.pp-b.pp)[0];
      destTxt=cheapest?"ti mancano circa "+fmt(cheapest.pp-cum)+" per "+cheapest.d.name:"";
    }
    rows.push(`<div class="pmonth"><span class="m">${i===0?"Adesso":label}<span class="save">${fmt(cum)} risparmiati</span></span><span class="dest">${destTxt}</span></div>`);
  }
  $("#piggyRows").innerHTML=monthly>0?rows.join(""):`<div class="mempty">Imposta una cifra mensile qui sopra per vedere come cambia nel tempo quello che potrai permetterti.</div>`;
}
function addMoney(n){if(n>0){state.piggy.saved=(state.piggy.saved||0)+n;persist();if(state.tab==="piggy")renderPiggy()}}
function renderAll(){renderFilters();renderSearch();renderLow();renderSaved()}

/* ---------- Dettaglio ---------- */
let current=null;
function openDetail(r){
  current=r;
  const {d,parts,total,pp,p}=r;
  const it=itinerary(r), L=links(r);
  const groups=d.mode==="treno"?[["Prenota il treno o il bus",L.treni],["Oppure vai in aereo",L.voli]]:[["Prenota il volo",L.voli],["Oppure vai in treno o bus",L.treni]];
  const trLabel=d.mode==="treno"?"Treno o bus, andata e ritorno":"Volo andata e ritorno";
  const rows=[[trLabel,"da "+r.dep.n+", "+p.people+" pers. · circa "+r.hrs,parts.trav],[r.lodgLabel,p.nights+" notti · "+seasonLabel(p.date),parts.lodg],["Pasti e cibo",(p.nights+1)+" giorni",parts.food],["Spostamenti locali","mezzi pubblici e taxi occasionali",parts.trans],["Attività e ingressi","musei, visite, esperienze",parts.act]];
  const days=it.map(day=>`<div class="day"><h4>${day.title}</h4><ul>${day.items.map(([slot,a])=>`<li><span><b>${slot}</b>${a.n}</span><span>${a.c?"~"+a.c+" € a persona":"gratis"}</span></li>`).join("")}</ul><p class="hint">${day.hint}</p></div>`).join("");
  const isSaved=saved.some(s=>s.id===d.id&&JSON.stringify(s.p)===JSON.stringify(p));
  $("#dlgBody").innerHTML=`
   <div class="dlg-head"><div><h2 id="dlgTitle">${d.name}</h2><p class="note" style="margin:6px 0 0">${d.note}</p></div><button class="close" data-close aria-label="Chiudi">×</button></div>
   <h3>Quanto costa</h3>
   <table class="cost"><tbody>${rows.map(([a,b,c])=>`<tr><td>${a}<small>${b}</small></td><td>${fmt(c)}</td></tr>`).join("")}
   <tr class="sum"><td>Totale<small>${fmt(pp)} a persona</small></td><td>${fmt(total)}</td></tr></tbody></table>
   <h3>Itinerario proposto</h3>
   <div id="itinBox"></div>
   <div class="actions itinactions" role="group" aria-label="Azioni sull'itinerario"><button class="btn" data-save ${isSaved?"disabled":""}>${isSaved?"Viaggio salvato":"Salva viaggio"}</button><button class="btn ghost" data-share>Condividi</button><button class="btn ghost" data-print>Stampa</button></div>
   <p class="fine noprint" style="margin:8px 0 0">Se la stampa non si apre da qui, usa Condividi e poi Copia testo.</p>
   <div id="sharePanel"></div>
   ${p.nights+1>8?'<p class="fine">Mostrati i primi 8 giorni.</p>':""}
   <p class="sumline"><b>La tua ricerca:</b> ${L.sum}</p>
   ${r.note?`<p class="fine" style="margin:14px 0 0">${r.note}</p>`:""}
   ${groups.map(([tt,arr])=>arr.length?`<h3>${tt}</h3><div class="links">${arr.map(([n,u])=>`<a class="btn sun" href="${u}" target="_blank" rel="noopener noreferrer">${n}</a>`).join("")}</div>`:"").join("")}
   <h3>Prenota l'alloggio</h3>
   <p class="fine" style="margin:0 0 10px">${state.fc!==false?"Filtro cancellazione gratuita attivo sul sito del partner. Controlla sempre la data entro cui puoi annullare. ":""}I link a Booking.com e Airbnb sono già filtrati per un prezzo a notte fino a circa ${L.nightlyCap} €, calcolato sulla nostra stima con un margine di sicurezza: è un aiuto per restare vicino al budget, non una garanzia che troverai proprio quel prezzo. Il link Aviasales porta a un accordo diretto con Booking.com (con la tua commissione): date e persone sono già inserite, ma la città va scritta a mano, usando il riepilogo qui sopra.
   <div class="links">${L.alloggi.map(([n,u])=>`<a class="btn sun" href="${u}" target="_blank" rel="noopener noreferrer">${n}</a>`).join("")}</div>
   ${L.offerte.length?`<h3>Trova le offerte del momento</h3><p class="fine" style="margin:0 0 10px">Tour, esperienze, transfer aeroporto-hotel e (dove disponibili) pass per le attrazioni, con la tua commissione. Non promettiamo uno sconto preciso: apri il link e vedi le offerte davvero attive in quel momento, decise dal partner.</p><div class="links">${L.offerte.map(([n,u])=>`<a class="btn sun" href="${u}" target="_blank" rel="noopener noreferrer">${n}</a>`).join("")}</div>`:""}
   <p class="fine">Voli e alloggi si aprono con destinazione, date, persone e un tetto di prezzo già compilati. Per i treni non ho trovato un modo affidabile per precompilare anche la tratta: i link portano al sito o a Google Maps, e la tratta e le date vanno inserite a mano usando il riepilogo qui sopra. Il link a Google Maps mostra i mezzi pubblici, non solo i treni: su alcune tratte, soprattutto internazionali, può proporre un autobus al posto del treno. Per i treni veri, affidati ai siti delle compagnie ferroviarie elencati sopra. I filtri (tipo di struttura, cancellazione, prezzo) usano parametri che ho verificato ma che i siti possono cambiare senza preavviso: se un filtro non risulta applicato, attivalo dalla barra dei filtri del sito. Le tariffe con cancellazione gratuita possono costare qualcosa in più e i prezzi reali possono differire dalle stime.
   <div class="actions"><button class="btn ghost" data-close>Chiudi</button></div>`;
  renderItin(r);
  const dlg=$("#dlg"); if(!dlg.open)dlg.showModal(); dlg.scrollTop=0;
}

/* ---------- Itinerari su misura (Claude) ---------- */
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const mapsUrl=(name,city)=>"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(name+", "+city);
let ITIN={};try{ITIN=JSON.parse(localStorage.getItem("vl.itin")||"{}")||{}}catch(e){ITIN={}}
const saveItin=()=>{try{const k=Object.keys(ITIN);while(k.length>15){delete ITIN[k.shift()]}localStorage.setItem("vl.itin",JSON.stringify(ITIN))}catch(e){}};
const curThemes=()=>{const t=state.themes;return Array.isArray(t)&&t.length?t:["classico"]};
const themesKey=()=>curThemes().slice().sort().join("+");
const itinKey=r=>["v2",r.d.id,r.p.nights,r.p.profile,r.p.date.slice(0,7),themesKey()].join("|");
const samplePromise=(async()=>{try{return window.claude&&window.claude.use?await window.claude.use("sample"):null}catch(e){return null}})();
let ctl=null;
const ERR={not_granted:"Per creare l'itinerario devi consentire a questa pagina di usare Claude.",sampling_disabled:"Claude non è disponibile per questo account.",rate_limited:"Troppe richieste o limite di utilizzo raggiunto: riprova tra poco.",session_expired:"La sessione è scaduta: accedi di nuovo.",invalid_json:"Non sono riuscito a leggere la risposta. Riprova.",empty_completion:"Nessuna risposta ricevuta. Riprova.",refused:"Non è stato possibile creare l'itinerario per questa richiesta."};

function itinPrompt(r){
  const d=r.d,p=r.p,themes=curThemes(),days=Math.min(p.nights+1,themes.length>1?5:6),themeLong=themes.length>1;
  const THEME_TXT={
    classico:`
TEMA: LUOGHI DA VISITARE. Le tappe sono i luoghi più significativi della città: monumenti, musei, chiese e palazzi storici, piazze, quartieri caratteristici e punti panoramici. Alterna i luoghi più celebri con qualche scorcio meno noto ma reale. Nel campo "what" spiega cosa si vede.`,
    enogastronomico:`
TEMA: viaggio ENOGASTRONOMICO. Le tappe sono luoghi legati al cibo e al vino: mercati storici, botteghe e salumerie, forni e pasticcerie, gelaterie storiche, osterie e trattorie note, enoteche, cantine visitabili (anche nei dintorni), laboratori di cucina. Per ogni tappa indica in "dish" il piatto o prodotto tipico da provare, con la denominazione corretta (per esempio DOP o IGP quando esiste). Per i locali cita solo quelli storici o molto noti di cui sei certo; se non sei certo del nome di un locale, indica il mercato, la via o il quartiere e il piatto, senza inventare il locale. ${themeLong?'Quando è combinato con altri temi, il cibo occupa i pasti: ogni giorno pranzo e cena (slot "Pranzo" e "Cena"), più a scelta una colazione o una merenda tipica; il resto della giornata segue gli altri temi.':'Ogni giorno ha colazione, pranzo, merenda o aperitivo e cena (slot "Colazione", "Pranzo", "Merenda", "Cena"), più al massimo una visita non legata al cibo.'} In "cost" indica la spesa indicativa a persona per quel pasto o assaggio. Il budget per pasti e assaggi è circa ${Math.round(d.fo*1.3)} euro a persona al giorno. Per questo tema le regole 4 e 5 valgono in modo adattato: niente conteggio fisso di tappe.${p.profile==="famiglia"?" Viaggiano bambini: niente degustazioni di alcolici, proponi mercati, dolci, laboratori e pasti adatti a tutta la famiglia.":""}`,
    natura:`
TEMA: NATURA E ARIA APERTA. Le tappe sono parchi, sentieri, belvedere, laghi, coste, giardini e gite in luoghi naturali reali della città e dei dintorni, raggiungibili con mezzi pubblici. Nel campo "what" indica difficoltà e durata indicative. Se la città ha poca natura, scrivilo nel campo "tip" e proponi luoghi vicini reali.`,
    relax:`
TEMA: RELAX. Ritmo lento: al massimo 2 tappe al giorno e mattine senza sveglia. Le tappe sono terme, spa e centri benessere noti, giardini e parchi, belvedere tranquilli, caffè storici, librerie, passeggiate brevi, mercati da girare senza fretta. Nel campo "what" indica quanto tempo serve. Evita luoghi affollati o faticosi.`,
    notte:`
TEMA: VITA NOTTURNA. Le mattine sono libere (al massimo una tappa leggera prima di pranzo); il programma vero parte dal tardo pomeriggio: aperitivo, quartieri serali, locali di musica dal vivo, cocktail bar, birrerie storiche, club noti, piazze animate. Cita solo locali storici o molto noti di cui sei certo; se non sei certo del nome, indica il quartiere o la via. Nel campo "tip" aggiungi consigli su sicurezza e rientro (ultimi mezzi, zone da evitare a tarda ora). Solo per maggiorenni.${p.profile==="famiglia"?" Viaggiano bambini: limita il programma a passeggiate serali, piazze animate e gelaterie.":""}`,
    bambini:`
TEMA: CON BAMBINI. Le tappe sono adatte ai più piccoli: parchi e giardini con giochi, musei interattivi o della scienza, acquari e zoo, fattorie didattiche, giri in battello o trenino, gelaterie, spiagge sicure. Nel campo "what" indica l'età consigliata e se serve il passeggino. Ritmo lento: al massimo 2 attività al giorno, con una pausa dopo pranzo.`
  };
  const who={amici:"gruppo di amici giovani: budget contenuto, street food, vita serale",coppia:"coppia: atmosfera romantica e buon rapporto qualità/prezzo",famiglia:"famiglia con bambini: ritmo rilassato, attrazioni adatte ai più piccoli"}[p.profile];
  return `Sei una guida turistica esperta di ${d.name} (${d.cc}). Crea un itinerario di ${days} giorni.${themes.map(t=>THEME_TXT[t]).join("")}${themes.length>1?`\nTEMI COMBINATI: questo itinerario unisce ${themes.map(t=>(THEMES.find(x=>x[0]===t)||[t,t])[1]).join(" + ")}. Ogni tema deve essere ben rappresentato in ogni giornata, non solo uno. ${themes.includes("enogastronomico")?"I pasti seguono il tema enogastronomico; mattina e pomeriggio sono dedicati agli altri temi, con 2 o 3 tappe vere al giorno (escluso il giorno di arrivo e quello di partenza).":"Dai a ciascun tema circa metà delle tappe, con giornate coerenti."} Le indicazioni di struttura valgono in modo adattato.`:""}

REGOLE OBBLIGATORIE
1. Cita SOLO luoghi che esistono davvero a ${d.name} (o nei dintorni, solo per un'eventuale gita), con il nome proprio esatto. Indica il quartiere o la via.
2. Vietato inventare. Se non sei sicuro al 100% che un luogo esista, omettilo: meglio meno tappe che una tappa sbagliata.
3. Vietate le voci generiche ("passeggiata in centro", "lungofiume", "museo principale"): ogni tappa ha un nome proprio. Non nominare fiumi, laghi, spiagge, montagne o mezzi di trasporto che la città non ha.
4. Ogni giorno raggruppa tappe vicine tra loro, in ordine geografico sensato: 2 o 3 tappe di giorno e 1 la sera.
5. Primo giorno: arrivo nel pomeriggio, solo una o due tappe leggere. Ultimo giorno: solo la mattina, poi il rientro.
6. Nel campo "what" spiega in una frase perché vale la pena, con un dettaglio concreto (cosa si vede o si fa).
7. "cost" è il costo indicativo dell'ingresso a persona in euro: 0 se gratuito, null se non lo sai. Non inventare orari di apertura né prezzi precisi.
8. Il budget per attività è circa ${Math.round(d.ac*1.3)} euro a persona al giorno: alterna luoghi a pagamento e gratuiti.
9. Se i giorni sono più di 3, un giorno può essere una gita in un luogo reale vicino, raggiungibile con treno o bus.
10. Aggiungi 3 o 4 specialità o locali storici veri in "food".
${themes.includes("classico")?"Livello atteso, per esempio per Verona: Arena, Casa di Giulietta in via Cappello, Piazza delle Erbe, Ponte Pietra sull'Adige, Castelvecchio.":""}

CONTESTO
Viaggiatori: ${who}. Partenza ${p.date}, ${p.nights} notti, ${seasonLabel(p.date)}. Scrivi in italiano.

Nel campo "kind" scrivi "cibo" per mercati, locali, botteghe, cantine e assaggi, "visita" per tutto il resto.

Rispondi SOLO con JSON in questa forma:
{"days":[{"title":"titolo del giorno","items":[{"slot":"Mattina","kind":"visita","name":"nome esatto del luogo","area":"quartiere o via","what":"una frase","dish":"piatto o prodotto tipico (solo tema enogastronomico, altrimenti stringa vuota)","cost":0}],"tip":"consiglio pratico breve"}],"food":[{"name":"nome del locale o piatto","what":"una frase"}]}`;
}
function curatedHtml(r){
  return itinerary(r).map(day=>`<div class="day"><h4>${day.title}</h4><ul>${day.items.map(([slot,a])=>{
    const link=(r.d.day.includes(a)||r.d.eve.includes(a))?` <a class="map" href="${mapsUrl(a.n,r.d.name)}" target="_blank" rel="noopener noreferrer">mappa</a>`:"";
    return `<li><span><b>${slot}</b>${a.n}${link}</span><span>${a.c?"~"+a.c+" € a persona":"gratis"}</span></li>`}).join("")}</ul><p class="hint">${day.hint}</p></div>`).join("");
}
function aiHtml(data,r){
  const days=data.days.map((day,i)=>`<div class="day"><h4>${esc(day.title||"Giorno "+(i+1))}</h4><ul>${(day.items||[]).map(a=>`<li><span><b>${esc(a.slot)}</b><a class="map" href="${mapsUrl(a.name,r.d.name)}" target="_blank" rel="noopener noreferrer">${esc(a.name)}</a>${a.area?` <small>(${esc(a.area)})</small>`:""}<br><small>${esc(a.what)}${a.dish?" Da provare: "+esc(a.dish)+".":""}</small></span><span>${a.cost===0?"gratis":typeof a.cost==="number"?"~"+a.cost+" € a persona":""}</span></li>`).join("")}</ul>${day.tip?`<p class="hint">${esc(day.tip)}</p>`:""}</div>`).join("");
  const food=(data.food||[]).length?`<div class="day"><h4>Da assaggiare</h4><ul>${data.food.map(f=>`<li><span><a class="map" href="${mapsUrl(f.name,r.d.name)}" target="_blank" rel="noopener noreferrer">${esc(f.name)}</a><br><small>${esc(f.what)}</small></span><span></span></li>`).join("")}</ul></div>`:"";
  return `<p class="fine" style="margin:0 0 12px">Itinerario creato da Claude per ${esc(r.d.name)}. Ogni tappa ha il link alla mappa: prima di partire verifica orari, aperture e prezzi.</p>`+days+food;
}
const THEMES=[["classico","Luoghi da visitare"],["enogastronomico","Enogastronomico"],["natura","Natura"],["relax","Relax"],["notte","Vita notturna"],["bambini","Con bambini"]];
const THEME_BTN={classico:"Crea itinerario su misura",enogastronomico:"Crea itinerario enogastronomico",natura:"Crea itinerario natura",relax:"Crea itinerario relax",notte:"Crea itinerario vita notturna",bambini:"Crea itinerario per bambini"};
const THEME_MAPS={classico:"cosa vedere a ",enogastronomico:"dove mangiare a ",natura:"parchi e natura a ",relax:"spa e relax a ",notte:"locali e vita notturna a ",bambini:"cosa fare con bambini a "};
function renderItin(r,msg){
  const box=$("#itinBox");if(!box)return;
  const th=curThemes(),data=ITIN[itinKey(r)];
  const chips=`<div class="chips" style="margin:0 0 6px" role="group" aria-label="Tipo di itinerario">${THEMES.map(([k,l])=>`<button class="chip" data-theme="${k}" aria-pressed="${th.includes(k)}">${l}</button>`).join("")}</div><p class="fine" style="margin:0 0 14px">Puoi combinare fino a due temi.</p>`;
  if(data){box.innerHTML=chips+aiHtml(data,r)+`<button class="btn ghost" data-gen style="margin-top:6px">Rigenera itinerario</button>`;return}
  const only=th.length===1?th[0]:null,classicOnly=only==="classico";
  const gm="https://www.google.com/maps/search/"+encodeURIComponent(THEME_MAPS[th[0]]+r.d.name);
  const lab=only?THEME_BTN[only]:"Crea itinerario combinato";
  box.innerHTML=chips+((r.d.est||!classicOnly)?"":curatedHtml(r))+`<div class="genbox">${msg?`<p class="status no" style="margin:0 0 10px">${esc(msg)}</p>`:""}<button class="btn sun" data-gen>${lab}</button><p class="fine">Claude sceglie luoghi reali della città, adatti a profilo, durata e stagione, con link alla mappa per verificarli. Impiega di solito 20-60 secondi, anche di più per viaggi lunghi o con due temi insieme. Usa il tuo abbonamento Claude.${r.d.est||!classicOnly?` In alternativa: <a href="${gm}" target="_blank" rel="noopener noreferrer">cerca su Google Maps</a>.`:""}</p></div>`;
}
async function generate(r){
  const key=itinKey(r),live=()=>current&&itinKey(current)===key;
  const sample=await samplePromise;
  if(!sample){if(live())renderItin(r,"Questa funzione è disponibile solo aprendo la pagina da Claude.");return}
  ctl=new AbortController();
  const t0=Date.now();
  const stageMsg=n=>n<8?"Sto pensando ai luoghi giusti a "+esc(r.d.name)+"…":n<20?"Sto scrivendo l'itinerario…":"Ci sto mettendo più del solito, ma sto ancora lavorando…";
  const setProgress=(extra)=>{if(!live())return;const box=$("#itinBox");if(!box)return;
    const p1=box.querySelector("#genProgress");const n=Math.round((Date.now()-t0)/1000);
    const msg=stageMsg(n)+(extra?" ("+extra+" caratteri scritti)":"")+" · "+n+" s";
    if(p1)p1.textContent=msg;
    else box.innerHTML=`<p class="fine" id="genProgress" style="margin:0 0 10px" role="status">${msg}</p><button class="btn ghost" data-stop>Annulla</button>`;
  };
  if(live()){$("#itinBox").innerHTML="";setProgress()}
  const timer=setInterval(setProgress,1000);
  try{
    const data=await sample.json(itinPrompt(r),{signal:ctl.signal,cache:false,onText:({text})=>setProgress(text.length)});
    clearInterval(timer);
    if(!data||!Array.isArray(data.days)||!data.days.length)throw {code:"invalid_json"};
    ITIN[key]=data;saveItin();
    if(live())renderItin(r);
  }catch(e){
    clearInterval(timer);
    if(e&&e.code==="cancelled"){if(live())renderItin(r);return}
    if(live())renderItin(r,ERR[e&&e.code]||"Si è verificato un errore. Riprova.");
  }
}

/* ---------- Condivisione ---------- */
const mapsShort=(n,c)=>"https://maps.google.com/?q="+encodeURIComponent(n+", "+c);
const FOOD_RE=/pizza|cena|aperitivo|street food|trattoria|osteria|tigelle|tagliatelle|lampredotto|cicchetti|pasticciotto|orecchiette|culurgiones|francesinha|paella|tapas|horchata|pierogi|goulash|souvlaki|currywurst|past[eé]is|caff[eè]|birr|rakia|picnic|vodka|cafe|heuriger|mercato|ristorante|forno|gelat|cantina|enoteca/i;
const kindOf=(a,curated)=>{
  if(/^cibo/i.test(a.kind||""))return "cibo";
  if(/^visita/i.test(a.kind||""))return "visita";
  return (/^(Colazione|Pranzo|Merenda|Cena|Aperitivo)$/i.test(a.slot||"")||a.dish||(curated&&FOOD_RE.test(a.name||"")))?"cibo":"visita";
};
function shareText(r,o){
  o=o||{};const compact=!!o.compact;
  const d=r.d,L=links(r),data=ITIN[itinKey(r)],th=curThemes(),out=[];
  const url=n=>"  "+mapsShort(n,d.name);
  const item=x=>"• "+(compact?"":x.slot+": ")+x.name+(compact?"":x.extra||"")+(x.link===false?"":"\n"+url(x.name));
  const dayBlock=(title,items,tip)=>{
    out.push(title.toUpperCase());
    const vis=items.filter(x=>x.kind!=="cibo"),eat=items.filter(x=>x.kind==="cibo");
    if(vis.length){out.push("Da visitare");vis.forEach(x=>out.push(item(x)));}
    if(eat.length){out.push("Dove mangiare");eat.forEach(x=>out.push(item(x)));}
    if(!compact&&tip)out.push("Consiglio: "+tip);
    out.push("");
  };
  out.push("Viaggio a "+d.name+" · Valigia Leggera");
  out.push(L.sum);
  out.push("Costo stimato: "+fmt(r.pp)+" a persona ("+fmt(r.total)+" in tutto). È una stima: verifica prezzi e orari prima di prenotare.");
  out.push("");
  if(data){
    data.days.forEach((day,i)=>dayBlock(day.title||"Giorno "+(i+1),(day.items||[]).map(a=>({slot:a.slot,name:a.name,kind:kindOf(a),extra:(a.area?" ("+a.area+")":"")+(a.what?" – "+a.what:"")+(a.dish?" Da provare: "+a.dish+".":"")})),day.tip));
    if((data.food||[]).length){
      out.push("DOVE MANGIARE (SPECIALITÀ)");
      data.food.forEach(f=>out.push(item({slot:"",name:f.name,extra:f.what?" – "+f.what:""}).replace(/^• : /,"• ")));
      out.push("");
    }
  }else if(!d.est&&th.length===1&&th[0]==="classico"){
    itinerary(r).forEach(day=>dayBlock(day.title,day.items.map(([slot,a])=>({slot,name:a.n,extra:"",kind:kindOf({slot,name:a.n},true),link:d.day.includes(a)||d.eve.includes(a)}))));
  }else{out.push("L'itinerario su misura non è ancora stato creato: generalo dall'app e poi condividilo.");out.push("");}
  if(o.book){
    out.push("PRENOTA");
    if(L.voli.length)out.push(L.voli[0][0]+": "+L.voli[0][1]);
    if(L.treni.length)out.push(L.treni[0][0]+": "+L.treni[0][1]);
    out.push(L.alloggi[0][0]+(state.fc!==false?" (cancellazione gratuita)":"")+": "+L.alloggi[0][1]);
  }
  return out.join("\n").trim();
}
function openShare(r){
  const box=document.getElementById("sharePanel");if(!box)return;
  const enc=t=>encodeURIComponent(t).length;
  const texts=[{compact:false,book:true},{compact:false,book:false},{compact:true,book:true},{compact:true,book:false}].map(o=>shareText(r,o));
  const full=texts[0];
  const wi=Math.max(0,texts.findIndex(t=>enc(t)<=6000)),wa=texts[wi<0?3:wi];
  let mi=texts.findIndex(t=>enc(t)<=1900);if(mi<0)mi=3;
  const mail=texts[mi];
  let note="Il testo contiene il link alla mappa di ogni luogo da visitare e di ogni posto dove mangiare, più i link di prenotazione: chi lo riceve li apre con un tocco.";
  if(wi===1)note="Per WhatsApp il testo completo era troppo lungo: ho tolto i link di prenotazione e tenuto quelli dei luoghi.";
  if(wi>=2)note="Per WhatsApp ho accorciato il testo: restano i nomi e i link a tutti i luoghi. Con Copia testo ottieni la versione completa.";
  if(mi>0)note+=" Nell'email il testo è più corto: usa Copia testo per la versione completa.";
  box.innerHTML=`<div class="genbox" style="margin-top:14px"><textarea id="shareTxt" class="sharetxt" rows="10" readonly aria-label="Testo da condividere">${esc(full)}</textarea>
   <div class="links" style="margin-top:10px"><a class="btn sun" href="https://wa.me/?text=${encodeURIComponent(wa)}" target="_blank" rel="noopener noreferrer">WhatsApp</a><a class="btn sun" href="mailto:?subject=${encodeURIComponent("Viaggio a "+r.d.name)}&body=${encodeURIComponent(mail)}">Email</a><button class="btn ghost" data-copy>Copia testo</button>${navigator.share?'<button class="btn ghost" data-native>Condividi con…</button>':""}</div>
   <p class="fine" id="shareMsg" role="status">${note}</p></div>`;
  box.scrollIntoView({block:"nearest"});
}
async function copyStr(v){
  try{await navigator.clipboard.writeText(v);return true}catch(e){
    try{const ta=document.createElement("textarea");ta.value=v;ta.style.position="fixed";ta.style.left="-9999px";document.body.appendChild(ta);ta.select();const ok=document.execCommand("copy");document.body.removeChild(ta);return ok}catch(e2){return false}
  }
}
async function copyShare(){
  const ta=document.getElementById("shareTxt"),msg=document.getElementById("shareMsg");if(!ta)return;
  ta.select();
  let ok=false;
  try{await navigator.clipboard.writeText(ta.value);ok=true}catch(e){try{ok=document.execCommand("copy")}catch(e2){}}
  if(msg)msg.textContent=ok?"Testo copiato.":"Non riesco a copiare in automatico: il testo è selezionato, usa Copia dal menu del telefono o Ctrl+C.";
}

/* ---------- Eventi ---------- */
document.addEventListener("click",e=>{
  const t=e.target.closest("button,summary");if(!t)return;
  if(t.dataset.tab){state.tab=t.dataset.tab;setTab();}
  else if(t.dataset.filter){const k=t.dataset.filter;state.filter=k;if(k==="cibo")state.themes=["enogastronomico"];else if(k==="natura")state.themes=["natura"];else if(k==="arte")state.themes=["classico"];persist();renderFilters();renderSearch();}
  else if(t.dataset.theme){const k=t.dataset.theme;let th=curThemes().slice();
    if(th.includes(k)){if(th.length>1)th=th.filter(x=>x!==k);}else{th.push(k);if(th.length>2)th.shift();}
    state.themes=th;persist();if(current)renderItin(current);}
  else if(t.dataset.open){const d=ALL.find(x=>x.id===t.dataset.open);const pp={...state,nights:+t.dataset.nights};if(t.dataset.date)pp.date=t.dataset.date;openDetail(calc(d,pp));}
  else if(t.dataset.openp!==undefined){const s=saved[+t.dataset.openp];openDetail(calc(ALL.find(x=>x.id===s.id),s.p));}
  else if(t.dataset.add){const v=+t.dataset.add;if(v>0)addMoney(v);}
  else if(t.dataset.pick){const d=ALL.find(x=>x.id===t.dataset.pick);state.dest=d.id;state.destQ=d.name;$("#dest").value=d.name;persist();renderSearch();}
  else if(t.dataset.print!==undefined){try{window.print()}catch(e){}}
  else if(t.dataset.share!==undefined){openShare(current);}
  else if(t.dataset.copy!==undefined){copyShare();}
  else if(t.dataset.native!==undefined){try{navigator.share({title:"Viaggio a "+current.d.name,text:document.getElementById("shareTxt").value}).catch(()=>{})}catch(e){}}
  else if(t.dataset.gen!==undefined){generate(current);}
  else if(t.dataset.stop!==undefined){if(ctl)ctl.abort();}
  else if(t.dataset.del!==undefined){saved.splice(+t.dataset.del,1);persistSaved();renderSaved();}
  else if(t.dataset.save!==undefined){saved.push({id:current.d.id,p:current.p});persistSaved();renderSaved();t.disabled=true;t.textContent="Viaggio salvato";}
  else if(t.dataset.close!==undefined){$("#dlg").close();}
});
$("#dlg").addEventListener("click",e=>{if(e.target===$("#dlg"))$("#dlg").close()});
function setTab(){
  document.querySelectorAll("[data-tab]").forEach(b=>b.setAttribute("aria-selected",b.dataset.tab===state.tab));
  ["cerca","low","salvati","piggy"].forEach(k=>$("#tab-"+k).hidden=state.tab!==k);
  if(state.tab==="low")renderLow(); if(state.tab==="salvati")renderSaved(); if(state.tab==="piggy")renderPiggy();
}
function syncDates(){
  state.nights=daysBetween(state.date,state.ret);
  $("#date").value=state.date;$("#ret").value=state.ret;
  $("#ret").min=addDays(state.date,1);$("#ret").max=addDays(state.date,30);
  $("#nightsInfo").textContent=state.nights+(state.nights===1?" notte":" notti");
}
function syncKidsAges(){
  const n=state.kids;
  if(!Array.isArray(state.kidsAges))state.kidsAges=[];
  while(state.kidsAges.length<n)state.kidsAges.push(8);
  state.kidsAges.length=n;
  const wrap=$("#kidsAgesWrap"),row=$("#kidsAgesRow");
  wrap.hidden=n===0;
  if(n>0){
    row.innerHTML=state.kidsAges.map((a,i)=>`<select data-kidage="${i}" aria-label="Età bambino ${i+1}">${Array.from({length:18},(_,y)=>`<option value="${y}" ${y===a?"selected":""}>${y} anni</option>`).join("")}</select>`).join("");
    row.querySelectorAll("select[data-kidage]").forEach(sel=>sel.onchange=e=>{state.kidsAges[+e.target.dataset.kidage]=+e.target.value;persist();renderSearch();});
  }
}
const DEFAULT_PEOPLE={amici:3,coppia:2,famiglia:4};
function bind(){
  $("#from").innerHTML=DEPS.map(x=>`<option value="${x.id}">${x.n} (${x.id})</option>`).join("");
  $("#cityList").innerHTML=ALL.slice().sort((a,b)=>a.name.localeCompare(b.name,"it")).map(d=>`<option value="${d.name}">${d.cc}</option>`).join("");
  $("#people").innerHTML=[1,2,3,4,5,6,7,8].map(v=>`<option value="${v}">${v} ${v===1?"persona":"persone"}</option>`).join("");
  $("#kids").innerHTML=[0,1,2,3,4].map(v=>`<option value="${v}">${v}</option>`).join("");
  $("#from").value=state.from;$("#people").value=state.people;$("#kids").value=state.kids;syncKidsAges();$("#dest").value=state.dest==="tutte"?"":state.dest==="?"?(state.destQ||""):ALL.find(d=>d.id===state.dest).name;
  $("#date").min=todayISO();syncDates();
  $("#fc").checked=state.fc!==false;$("#tm").value=state.tm||"auto";$("#budget").value=state.budget;$("#budgetOut").textContent=fmt(state.budget);
  document.querySelector('input[name=profile][value='+state.profile+']').checked=true;
  document.documentElement.setAttribute('data-profile',state.profile);
  const upd=()=>{persist();renderSearch();if(state.tab==="low")renderLow();};
  $("#from").onchange=e=>{state.from=e.target.value;upd()};
  $("#dest").onchange=e=>{const q=e.target.value,n=norm(q);state.destQ=q;
    if(!n)state.dest="tutte";else{const m=ALL.find(d=>norm(d.name)===n);state.dest=m?m.id:"?";if(m)e.target.value=m.name;}
    upd()};
  $("#tm").onchange=e=>{state.tm=e.target.value;upd()};
  $("#fc").onchange=e=>{state.fc=e.target.checked;upd()};
  $("#dest").onkeydown=e=>{if(e.key==="Enter")e.target.blur()};
  $("#date").onchange=e=>{const v=e.target.value;if(v&&v>=todayISO()){const keep=state.nights||3;state.date=v;state.ret=addDays(v,keep);syncDates();upd()}else e.target.value=state.date};
  $("#ret").onchange=e=>{const v=e.target.value;if(v&&v>state.date&&daysBetween(state.date,v)<=30){state.ret=v;syncDates();upd()}else e.target.value=state.ret};
  $("#people").onchange=e=>{state.people=+e.target.value;if(state.kids>state.people-1){state.kids=Math.max(0,state.people-1);$("#kids").value=state.kids;}syncKidsAges();persist();upd()};
  $("#kids").onchange=e=>{state.kids=Math.min(+e.target.value,state.people-1);$("#kids").value=state.kids;syncKidsAges();persist();upd()};
  $("#budget").oninput=e=>{state.budget=+e.target.value;$("#budgetOut").textContent=fmt(state.budget);upd()};
  document.querySelectorAll("input[name=profile]").forEach(r=>r.onchange=e=>{state.profile=e.target.value;document.documentElement.setAttribute("data-profile",state.profile);state.people=DEFAULT_PEOPLE[state.profile];$("#people").value=state.people;if(state.kids>state.people-1){state.kids=Math.max(0,state.people-1);$("#kids").value=state.kids;}syncKidsAges();upd()});
  $("#lcMonth").onchange=e=>{state.lc.month=+e.target.value;persist();renderLow()};
  $("#lcNightsSel").onchange=e=>{state.lc.nights=+e.target.value;persist();renderLow()};
  $("#lcCapSel").onchange=e=>{state.lc.cap=+e.target.value;persist();renderLow()};
  $("#piggyMonthly").oninput=e=>{state.piggy.monthly=+e.target.value;$("#piggyMonthlyOut").textContent=fmt(state.piggy.monthly)+"/mese";persist();renderPiggy()};
  $("#piggyAddCustom").onclick=()=>{const v=Math.round(+$("#piggyCustom").value);addMoney(v);if(v>0)$("#piggyCustom").value="";};
  $("#piggyTarget").onchange=e=>{state.piggy.target=Math.max(0,Math.round(+e.target.value||0));persist();renderPiggy()};
  $("#piggyCustom").onkeydown=e=>{if(e.key==="Enter")$("#piggyAddCustom").click()};
  let resetArmed=false,resetTimer=null;
  $("#piggyReset").onclick=e=>{
    const btn=e.currentTarget;
    if(!resetArmed){
      resetArmed=true;btn.textContent="Sicuro? Tocca ancora";btn.classList.add("armed");
      clearTimeout(resetTimer);
      resetTimer=setTimeout(()=>{resetArmed=false;btn.textContent="Azzera";btn.classList.remove("armed")},4000);
      return;
    }
    clearTimeout(resetTimer);resetArmed=false;
    state.piggy.saved=0;state.piggy.monthly=0;state.piggy.target=0;persist();
    btn.textContent="Azzera";btn.classList.remove("armed");
    renderPiggy();
  };
}
bind();renderAll();setTab();
