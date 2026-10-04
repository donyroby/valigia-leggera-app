// Calcoli dei costi, collegamenti ai partner e itinerario di base,
// presi dal prototipo. Uniche differenze: "isHere" riceve l'aeroporto di partenza
// e "links" legge la cancellazione gratuita dai parametri del viaggio (p.fc).
import {DEPS,DESTS,TIPS,ALL,norm,MONTH_PICKS} from "./dati";

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
const isHere=(d,from)=>{const dep=DEPS.find(x=>x.id===from);return norm(dep.n).includes(norm(d.name))||(dep.ex&&norm(d.name)===dep.ex)};
const contOf=d=>d.world?"mondo":d.it?"italia":"europa";
const pad=n=>String(n).padStart(2,"0");
const isoOf=d=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const todayISO=()=>isoOf(new Date());
const addDays=(iso,n)=>{const d=new Date(iso+"T12:00:00");d.setDate(d.getDate()+n);return isoOf(d)};
function defaultDate(){const d=new Date();d.setDate(d.getDate()+35);while(d.getDay()!==5)d.setDate(d.getDate()+1);return isoOf(d)}
const daysBetween=(a,b)=>Math.round((new Date(b+"T12:00:00")-new Date(a+"T12:00:00"))/864e5);
// Separatore delle migliaia scritto a mano: il server e i browser formattano "it-IT" in modo diverso
const fmt=n=>{const v=Math.round(n),a=String(Math.abs(v)).replace(/\B(?=(\d{3})+(?!\d))/g,".");return (v<0?"-":"")+a+" €"};
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
  const fc=p.fc!==false,place=d.name+", "+d.cc;
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

function repDate(month,nights){
  const y=new Date().getFullYear();
  let d=new Date(y,month-1,15,12);
  if(isoOf(d)<todayISO())d=new Date(y+1,month-1,15,12);
  return isoOf(d);
}

export {hav,travelOpt,isHere,contOf,isoOf,todayISO,addDays,defaultDate,daysBetween,fmt,fmtD,dfmtR,seasonF,seasonLabel,calc,usable,PARTS,itinerary,TP_MARKER,GOCITY_SLUGS,aviasalesUrl,links,repDate};
