import { useState, useEffect, useRef, useCallback } from "react";

const AN_SHIELD = "https://upload.wikimedia.org/wikipedia/en/thumb/6/sixty/Atletico_Nacional.svg/200px-Atletico_Nacional.svg.png";

const G = {
  green: "#006600", greenDark: "#004400", greenBright: "#00CC00",
  white: "#FFFFFF", red: "#CC0000", yellow: "#FFB300", blue: "#004488",
  bg: "#001500",
};
const POSITIONS = ["POR","DEF","LAT","MED","EXT","DEL"];
const T1_CLOCK = 45;

// ── Timer ──────────────────────────────────────────────
function useTimer() {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [half, setHalf] = useState(1);
  const ref = useRef(null);
  const start = useCallback(() => {
    if (!running) { setRunning(true); ref.current = setInterval(() => setSeconds(s => s+1), 1000); }
  }, [running]);
  const pause = useCallback(() => { setRunning(false); clearInterval(ref.current); }, []);
  const secondHalf = useCallback(() => { setRunning(false); clearInterval(ref.current); setSeconds(0); setHalf(2); }, []);
  useEffect(() => () => clearInterval(ref.current), []);
  const mins = Math.floor(seconds/60);
  const display = `${String(mins).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;
  const matchMin = Math.max(1, mins+1) + (half===2 ? 45 : 0);
  return { running, display, matchMin, half, start, pause, secondHalf };
}

// ── Minutes played (corrected formula) ─────────────────
function calcMins(name, ptype, events, t1Real, t2Real) {
  let entryClock = ptype==="titular" ? 1 : null;
  let exitClock  = null;
  events.forEach(ev => {
    if (ev.type==="sub") { if (ev.in?.name===name) entryClock=ev.minute; if (ev.out?.name===name) exitClock=ev.minute; }
    if (ev.type==="red" && ev.player?.name===name) exitClock=ev.minute;
  });
  if (entryClock===null) return null;
  const toReal = c => c<=T1_CLOCK ? Math.round(c*t1Real/T1_CLOCK) : t1Real+Math.min(c-T1_CLOCK, t2Real);
  return Math.max(0, toReal(exitClock||9999) - toReal(entryClock));
}

// ── Modals ─────────────────────────────────────────────
function Overlay({ children, wide }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:200,
      display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"#fff",borderRadius:20,padding:24,width:"100%",
        maxWidth:wide?600:440,maxHeight:"88vh",overflowY:"auto",
        boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}>
        {children}
      </div>
    </div>
  );
}

function PlayerSelect({ players, label, onSelect, onClose, extra }) {
  const [q, setQ] = useState("");
  const filtered = players.filter(p=>p.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <Overlay>
      <h3 style={{margin:"0 0 12px",color:G.greenDark,fontFamily:"Georgia,serif",textAlign:"center",fontSize:19}}>{label}</h3>
      <input placeholder="Buscar..." value={q} onChange={e=>setQ(e.target.value)}
        style={{width:"100%",padding:"9px 12px",border:"2px solid #ddd",borderRadius:10,
          fontSize:15,fontFamily:"Georgia,serif",boxSizing:"border-box",marginBottom:10}}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:7}}>
        {filtered.map((p,i)=>(
          <button key={i} onClick={()=>onSelect(p)}
            style={{padding:"11px 12px",background:G.greenDark,color:"white",border:"none",
              borderRadius:9,cursor:"pointer",fontFamily:"Georgia,serif",fontSize:14,textAlign:"left"}}>
            {p.number?`#${p.number} `:""}{p.name}
          </button>
        ))}
      </div>
      {extra}
      <button onClick={onClose} style={{marginTop:4,width:"100%",padding:11,background:"#e0e0e0",
        border:"none",borderRadius:9,cursor:"pointer",fontWeight:"bold",fontSize:14}}>Cancelar</button>
    </Overlay>
  );
}

function AssistSelect({ players, onSelect, onClose }) {
  const [q, setQ] = useState("");
  const filtered = players.filter(p=>p.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <Overlay>
      <h3 style={{margin:"0 0 12px",color:G.greenDark,fontFamily:"Georgia,serif",textAlign:"center",fontSize:19}}>🎯 ¿Quién asistió?</h3>
      <input placeholder="Buscar..." value={q} onChange={e=>setQ(e.target.value)}
        style={{width:"100%",padding:"9px 12px",border:"2px solid #ddd",borderRadius:10,
          fontSize:15,fontFamily:"Georgia,serif",boxSizing:"border-box",marginBottom:10}}/>
      <button onClick={()=>onSelect(null)}
        style={{display:"block",width:"100%",padding:"11px 12px",marginBottom:9,
          background:"#555",color:"white",border:"none",borderRadius:9,
          cursor:"pointer",fontFamily:"Georgia,serif",fontSize:14,fontWeight:"bold"}}>
        — Sin asistencia
      </button>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
        {filtered.map((p,i)=>(
          <button key={i} onClick={()=>onSelect(p)}
            style={{padding:"11px 12px",background:"#004488",color:"white",border:"none",
              borderRadius:9,cursor:"pointer",fontFamily:"Georgia,serif",fontSize:14,textAlign:"left"}}>
            {p.number?`#${p.number} `:""}{p.name}
          </button>
        ))}
      </div>
      <button onClick={onClose} style={{marginTop:9,width:"100%",padding:11,background:"#e0e0e0",
        border:"none",borderRadius:9,cursor:"pointer",fontWeight:"bold",fontSize:14}}>Cancelar</button>
    </Overlay>
  );
}

function MinuteInput({ onConfirm, onClose, autoMin, label }) {
  const [min, setMin] = useState(String(autoMin));
  return (
    <Overlay>
      <h3 style={{margin:"0 0 8px",color:G.greenDark,fontFamily:"Georgia,serif",textAlign:"center",fontSize:19}}>{label}</h3>
      <p style={{textAlign:"center",color:"#666",fontSize:13,margin:"0 0 12px"}}>Minuto del partido</p>
      <input type="number" value={min} onChange={e=>setMin(e.target.value)} min="1" max="120"
        style={{display:"block",width:"100%",fontSize:34,textAlign:"center",padding:10,
          border:"2px solid "+G.green,borderRadius:9,fontFamily:"'Courier New',monospace",
          fontWeight:"bold",boxSizing:"border-box"}}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:8,marginTop:14}}>
        <button onClick={onClose} style={{padding:13,background:"#e0e0e0",border:"none",borderRadius:9,cursor:"pointer",fontWeight:"bold",fontSize:14}}>Cancelar</button>
        <button onClick={()=>onConfirm(parseInt(min)||1)}
          style={{padding:13,background:G.green,color:"white",border:"none",borderRadius:9,cursor:"pointer",fontWeight:"bold",fontSize:16}}>✓ Confirmar</button>
      </div>
    </Overlay>
  );
}

function ZonePicker({ onSelect, onClose }) {
  const zones = [
    {id:"SI",x:0,y:0,w:33,h:50,label:"Sup. Izq."},
    {id:"SC",x:33,y:0,w:34,h:50,label:"Sup. Centro"},
    {id:"SD",x:67,y:0,w:33,h:50,label:"Sup. Der."},
    {id:"II",x:0,y:50,w:33,h:50,label:"Inf. Izq."},
    {id:"AG",x:33,y:50,w:34,h:50,label:"Área Grande"},
    {id:"ID",x:67,y:50,w:33,h:50,label:"Inf. Der."},
  ];
  return (
    <Overlay wide>
      <h3 style={{margin:"0 0 12px",color:G.greenDark,fontFamily:"Georgia,serif",textAlign:"center",fontSize:19}}>⚽ ¿Desde qué zona?</h3>
      <div style={{position:"relative",width:"100%",paddingBottom:"60%",background:"#3a7d2c",borderRadius:10,overflow:"hidden",border:"3px solid white"}}>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}} viewBox="0 0 300 180">
          <rect x="4" y="4" width="292" height="172" fill="none" stroke="white" strokeWidth="2"/>
          <line x1="150" y1="4" x2="150" y2="176" stroke="white" strokeWidth="1.5"/>
          <circle cx="150" cy="90" r="26" fill="none" stroke="white" strokeWidth="1.5"/>
          <rect x="4" y="55" width="44" height="70" fill="none" stroke="white" strokeWidth="1.5"/>
          <rect x="252" y="55" width="44" height="70" fill="none" stroke="white" strokeWidth="1.5"/>
          {zones.map(z=>(
            <g key={z.id} onClick={()=>onSelect(z.id,z.label)} style={{cursor:"pointer"}}>
              <rect x={z.x/100*292+4} y={z.y/100*172+4} width={z.w/100*292} height={z.h/100*172}
                fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.35)" strokeWidth="1"
                onMouseEnter={e=>e.target.setAttribute("fill","rgba(255,220,0,0.38)")}
                onMouseLeave={e=>e.target.setAttribute("fill","rgba(255,255,255,0.07)")}/>
              <text x={(z.x+z.w/2)/100*292+4} y={(z.y+z.h/2)/100*172+4}
                textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="13" fontWeight="bold">{z.label}</text>
            </g>
          ))}
        </svg>
      </div>
      <button onClick={onClose} style={{marginTop:12,width:"100%",padding:11,background:"#e0e0e0",border:"none",borderRadius:9,cursor:"pointer",fontWeight:"bold",fontSize:14}}>Cancelar</button>
    </Overlay>
  );
}

function HalfTimeModal({ onConfirm, onClose }) {
  const [t1, setT1] = useState("45");
  return (
    <Overlay>
      <h3 style={{margin:"0 0 8px",color:G.greenDark,fontFamily:"Georgia,serif",textAlign:"center",fontSize:19}}>⏱ Fin del 1° Tiempo</h3>
      <p style={{textAlign:"center",color:"#666",fontSize:13,margin:"0 0 14px"}}>¿Cuántos minutos duró el primer tiempo?</p>
      <input type="number" value={t1} onChange={e=>setT1(e.target.value)} min="40" max="60"
        style={{display:"block",width:"100%",fontSize:34,textAlign:"center",padding:10,
          border:"2px solid "+G.green,borderRadius:9,fontFamily:"'Courier New',monospace",
          fontWeight:"bold",boxSizing:"border-box"}}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:8,marginTop:14}}>
        <button onClick={onClose} style={{padding:13,background:"#e0e0e0",border:"none",borderRadius:9,cursor:"pointer",fontWeight:"bold",fontSize:14}}>Cancelar</button>
        <button onClick={()=>onConfirm(parseInt(t1)||45)}
          style={{padding:13,background:G.green,color:"white",border:"none",borderRadius:9,cursor:"pointer",fontWeight:"bold",fontSize:16}}>✓ Iniciar 2°T</button>
      </div>
    </Overlay>
  );
}

// ── PDF Generator ───────────────────────────────────────
async function generatePDF(matchData, score, events, t1Real, t2Real) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
  const PW = 210, PH = 297;
  const ML = 11, MR = 11, MT = 10;
  const CW = PW - ML - MR;
  const HALF = (CW - 4) / 2;

  // Colors
  const BG      = [0,30,0];
  const GREEN   = [0,68,0];
  const GBAR    = [0,170,68];
  const GLIGHT  = [232,245,233];
  const BLUE    = [0,52,102];
  const YELLOW  = [255,215,0];
  const RED     = [170,0,0];
  const GRAY    = [136,136,136];
  const WHITE   = [255,255,255];
  const BLACK   = [26,26,26];
  const BORDER  = [221,221,221];
  const TITBG   = [240,255,240];
  const SUBBG   = [240,244,255];

  let y = MT;

  const setFill   = c => doc.setFillColor(...c);
  const setStroke = c => doc.setDrawColor(...c);
  const setTxt    = c => doc.setTextColor(...c);
  const setFont   = (s,w="normal") => { doc.setFontSize(s); doc.setFont("helvetica",w); };

  // Rounded rect helper
  const rRect = (x,ry,w,h,r,fill=true,stroke=false) => {
    doc.roundedRect(x,ry,w,h,r,r,fill&&stroke?"FD":fill?"F":"S");
  };

  // Section header
  const secHeader = (rx,ry,w,icon,title) => {
    setFill(WHITE); setStroke(BORDER);
    rRect(rx,ry,w,7,2);
    setFont(9.5,"bold"); setTxt(GREEN);
    doc.text(`${icon}  ${title}`, rx+4, ry+4.8);
    setStroke(GLIGHT); doc.setLineWidth(0.4);
    doc.line(rx+4,ry+7,rx+w-4,ry+7);
    return ry+8;
  };

  const minBadge = (x,by,min,bg) => {
    setFill(bg); doc.roundedRect(x,by-3.2,11,5,1.5,1.5,"F");
    setFont(7.5,"bold"); setTxt(WHITE);
    doc.text(`${min}'`, x+5.5, by+0.8, {align:"center"});
  };

  // ── Load images ───────────────────────────────────────
  const loadImg = src => new Promise(res => {
    const img = new Image(); img.crossOrigin="anonymous";
    img.onload = () => { const c=document.createElement("canvas"); c.width=img.width; c.height=img.height; c.getContext("2d").drawImage(img,0,0); res(c.toDataURL("image/png")); };
    img.onerror = () => res(null);
    img.src = src;
  });

  const anImg = await loadImg(AN_SHIELD);
  const rvImg = matchData.rivalLogo ? await loadImg(matchData.rivalLogo) : null;

  // ── COVER ─────────────────────────────────────────────
  setFill(BG);
  rRect(ML, y, CW, 38, 4);

  // AN shield
  if (anImg) doc.addImage(anImg,"PNG", ML+3, y+3, 14, 20);
  // Rival logo
  if (rvImg) doc.addImage(rvImg,"PNG", ML+CW-17, y+5, 14, 14);

  // Team names
  setFont(9.5,"bold"); setTxt([0,204,0]);
  doc.text("Atlético Nacional", ML+10, y+26, {align:"center"});
  if (rvImg || matchData.rival) doc.text(matchData.rival, ML+CW-10, y+26, {align:"right"});

  // Score
  setFont(32,"bold"); setTxt(WHITE);
  doc.text(`${score[0]}  —  ${score[1]}`, PW/2, y+18, {align:"center"});
  setFont(8,"normal"); setTxt([170,170,170]);
  doc.text("Resultado Final", PW/2, y+22, {align:"center"});

  // Meta
  setFont(7.5,"normal"); setTxt([180,255,180]);
  const meta = [
    matchData.tournament && `Torneo: ${matchData.tournament}`,
    matchData.jornada    && `Jornada: ${matchData.jornada}`,
    matchData.date       && `Fecha: ${matchData.date}`,
    t1Real && t2Real     && `Duración: ${t1Real}' + ${t2Real}' = ${t1Real+t2Real}'`,
  ].filter(Boolean).join("   |   ");
  doc.text(meta, PW/2, y+31, {align:"center", maxWidth: CW-8});
  y += 42;

  // ── GOLES ─────────────────────────────────────────────
  const goals   = events.filter(e=>e.type==="goal");
  const yellows = events.filter(e=>e.type==="yellow");
  const reds    = events.filter(e=>e.type==="red");
  const subs    = events.filter(e=>e.type==="sub");
  const injuries= events.filter(e=>e.type==="injury");

  let gy = secHeader(ML, y, CW, "⚽", `Goles (${goals.length})`);
  setFill(WHITE); setStroke(BORDER);
  doc.rect(ML, y, CW, goals.length>0 ? goals.length*12+10 : 14, "FD");

  if (goals.length===0) {
    setFont(8,"normal"); setTxt(GRAY);
    doc.text("Sin goles", ML+6, gy+5);
    gy += 9;
  } else {
    goals.forEach((g,i) => {
      const rowY = gy + i*12 + 2;
      minBadge(ML+4, rowY+3, g.minute, g.isOpponent ? RED : GREEN);
      setFont(9,"bold"); setTxt(BLACK);
      doc.text(g.isOpponent ? matchData.rival : (g.player?.name||""), ML+17, rowY+3.5);
      if (!g.isOpponent && g.zone) {
        setFont(8,"normal"); setTxt(GRAY);
        doc.text(`— ${g.zone}`, ML+17 + doc.getTextWidth((g.player?.name||"")+"  "), rowY+3.5);
      }
      setFont(7.5,"normal"); setTxt([50,68,85]);
      const at = g.assist ? `🎯 Asistencia: ${g.assist.name}` : "Sin asistencia";
      doc.text(at, ML+17, rowY+8);
      if (i < goals.length-1) { setStroke([238,238,238]); doc.setLineWidth(0.3); doc.line(ML+4, rowY+10.5, ML+CW-4, rowY+10.5); }
    });
    gy += goals.length*12 + 3;
  }
  y = gy + 4;

  // ── TARJETAS + CAMBIOS (two-col) ──────────────────────
  const cardsH = Math.max((yellows.length+reds.length)*9+12, 18);
  const subsH  = Math.max(subs.length*9+12, 18);
  const tcH    = Math.max(cardsH, subsH);

  // Cards
  let cy = secHeader(ML, y, HALF, "🟨🟥", "Tarjetas");
  setFill(WHITE); setStroke(BORDER);
  doc.rect(ML, y, HALF, tcH, "FD");
  [...yellows.map(e=>({...e,card:"Y"})), ...reds.map(e=>({...e,card:"R"}))].forEach((e,i) => {
    const ry2 = cy + i*9 + 2;
    const bg = e.card==="Y" ? YELLOW : RED;
    const fg = e.card==="Y" ? BLACK  : WHITE;
    setFill(bg); doc.roundedRect(ML+4, ry2-3, 11, 5, 1.5,1.5,"F");
    setFont(7.5,"bold"); setTxt(fg);
    doc.text(`${e.minute}'`, ML+9.5, ry2+0.8, {align:"center"});
    setFont(8.5,"normal"); setTxt(BLACK);
    doc.text(`${e.card==="Y"?"🟨":"🟥"} ${e.player?.name||""}`, ML+17, ry2+0.8);
    if (i < yellows.length+reds.length-1) { setStroke([238,238,238]); doc.setLineWidth(0.3); doc.line(ML+4, ry2+4, ML+HALF-4, ry2+4); }
  });

  // Subs
  const SX = ML+HALF+4;
  let sy = secHeader(SX, y, HALF, "🔄", "Cambios");
  setFill(WHITE); setStroke(BORDER);
  doc.rect(SX, y, HALF, tcH, "FD");
  subs.forEach((s,i) => {
    const ry2 = sy + i*9 + 2;
    setFill(BLUE); doc.roundedRect(SX+4, ry2-3, 11, 5, 1.5,1.5,"F");
    setFont(7.5,"bold"); setTxt(WHITE);
    doc.text(`${s.minute}'`, SX+9.5, ry2+0.8, {align:"center"});
    setFont(8.5,"bold"); setTxt(RED);
    doc.text(`⬇ ${s.out?.name||""}`, SX+17, ry2+0.8);
    setFont(8.5,"normal"); setTxt(GRAY);
    doc.text(" → ", SX+17+doc.getTextWidth(`⬇ ${s.out?.name||""}`), ry2+0.8);
    setFont(8.5,"bold"); setTxt(GREEN);
    doc.text(`⬆ ${s.in?.name||""}`, SX+17+doc.getTextWidth(`⬇ ${s.out?.name||""}`) + doc.getTextWidth(" → "), ry2+0.8);
    if (i < subs.length-1) { setStroke([238,238,238]); doc.setLineWidth(0.3); doc.line(SX+4, ry2+4, SX+HALF-4, ry2+4); }
  });
  y += tcH + 4;

  // ── MINUTOS JUGADOS ───────────────────────────────────
  const t1R = t1Real || 47;
  const t2R = t2Real || 50;
  const allWithMins = matchData.players.map(p=>({
    ...p,
    mins: calcMins(p.name, p.type, events, t1R, t2R)
  })).filter(p=>p.mins!==null).sort((a,b)=>b.mins-a.mins);

  const maxMins = Math.max(...allWithMins.map(p=>p.mins), 1);
  const n = allWithMins.length;
  const chartH = 50;
  const CHART_ML = 16;
  const chartW = CW - CHART_ML - 2;
  const bw = chartW / n;
  const iw = Math.min(bw*0.58, 9);
  const pb = 20; const chartInnerH = chartH - pb - 6;

  let mh = secHeader(ML, y, CW, "⏱", `Minutos Jugados (${t1R+t2R}' — ${t1R}' + ${t2R}')`);
  setFill(WHITE); setStroke(BORDER);
  doc.rect(ML, y, CW, chartH+12, "FD");

  const chartBaseY = mh + chartInnerH;
  const chartLeft  = ML + CHART_ML;

  // Grid lines
  [25,50,75,t1R+t2R].forEach(val => {
    if (val > maxMins+2) return;
    const lineY = chartBaseY - (val/maxMins)*chartInnerH;
    setStroke([224,224,224]); doc.setLineWidth(0.25);
    doc.line(chartLeft, lineY, chartLeft+chartW-2, lineY);
    setFont(5.5,"normal"); setTxt(GRAY);
    doc.text(String(val), chartLeft-1, lineY+1, {align:"right"});
  });

  allWithMins.forEach((p,i) => {
    const xc = chartLeft + (i+0.5)*bw;
    const xb = xc - iw/2;
    const bh = (p.mins/maxMins)*chartInnerH;
    const isTit = p.type==="titular";
    const bc = isTit ? GBAR : BLUE;

    // Background bar
    setFill(GLIGHT); doc.rect(xb, chartBaseY-chartInnerH, iw, chartInnerH, "F");
    // Fill
    setFill(bc); doc.rect(xb, chartBaseY-bh, iw, bh, "F");
    // Value on top
    setFont(6,"bold"); setTxt(isTit ? GREEN : BLUE);
    doc.text(`${p.mins}'`, xc, chartBaseY-bh-1.5, {align:"center"});
    // Number badge
    const num = p.number||"";
    if (num) {
      setFill(bc);
      doc.roundedRect(xc-3.5, chartBaseY+1.5, 7, 4.5, 1,1,"F");
      setFont(6,"bold"); setTxt(WHITE);
      doc.text(num, xc, chartBaseY+4.8, {align:"center"});
    }
    // Name bold below
    const parts = p.name.split(" ");
    const display = parts.length>1 ? `${parts[0][0]}. ${parts[parts.length-1]}` : p.name;
    setFont(5.8,"bold"); setTxt(BLACK);
    doc.text(display, xc, chartBaseY+9, {align:"center"});
  });

  // Axes
  setStroke(GREEN); doc.setLineWidth(0.7);
  doc.line(chartLeft, chartBaseY, chartLeft+chartW-2, chartBaseY);
  doc.line(chartLeft, chartBaseY-chartInnerH, chartLeft, chartBaseY);

  // Legend
  setFill(GBAR); doc.rect(ML+CW-30, mh+chartInnerH+9, 3, 3, "F");
  setFont(6.5,"normal"); setTxt(BLACK); doc.text("Titular", ML+CW-26, mh+chartInnerH+11.5);
  setFill(BLUE); doc.rect(ML+CW-17, mh+chartInnerH+9, 3, 3, "F");
  doc.text("Suplente", ML+CW-13, mh+chartInnerH+11.5);

  y += chartH + 16;

  // ── ALINEACIÓN + SUPLENTES ────────────────────────────
  const startersH = matchData.starters.length*8 + 14;
  const subsListH = matchData.subs.length*8 + 14;
  const lineupH   = Math.max(startersH, subsListH);

  const drawLineup = (players, sx, sw, bg, numBg, title, icon) => {
    let ly = secHeader(sx, y, sw, icon, title);
    setFill(WHITE); setStroke(BORDER); doc.rect(sx, y, sw, lineupH, "FD");
    players.forEach((p,i) => {
      const ry2 = ly + i*8 + 1;
      if (i%2===0) { setFill([248,255,248]); doc.rect(sx+1, ry2-1.5, sw-2, 7.5, "F"); }
      if (p.number) {
        setFill(numBg); doc.roundedRect(sx+3, ry2-1.2, 7.5, 5, 1,1,"F");
        setFont(7,"bold"); setTxt(WHITE);
        doc.text(p.number, sx+6.75, ry2+2.5, {align:"center"});
      }
      setFont(8.5,"normal"); setTxt(BLACK);
      doc.text(p.name, sx+12.5, ry2+2.5);
      if (p.pos) {
        setFont(7.5,"bold"); setTxt(numBg);
        doc.text(p.pos, sx+sw-4, ry2+2.5, {align:"right"});
      }
    });
  };

  drawLineup(matchData.starters, ML,       HALF, TITBG, GREEN, "Titulares",  "🟢");
  drawLineup(matchData.subs,     ML+HALF+4, HALF, SUBBG, BLUE,  "Suplentes",  "🔵");
  y += lineupH + 4;

  // ── CUERPO TÉCNICO ────────────────────────────────────
  const staffH = matchData.staff.length*8 + 14;
  let sty = secHeader(ML, y, CW, "👔", "Cuerpo Técnico");
  setFill(WHITE); setStroke(BORDER); doc.rect(ML, y, CW, staffH, "FD");
  matchData.staff.forEach((s,i) => {
    const ry2 = sty + i*8 + 1;
    setFont(8.5,"bold"); setTxt(BLACK);
    doc.text(s.name, ML+5, ry2+2.5);
    setFont(8.5,"normal"); setTxt(GRAY);
    doc.text(`— ${s.role}`, ML+5+doc.getTextWidth(s.name)+3, ry2+2.5);
    if (i < matchData.staff.length-1) { setStroke([238,238,238]); doc.setLineWidth(0.3); doc.line(ML+4, ry2+5.5, ML+CW-4, ry2+5.5); }
  });
  y += staffH + 5;

  // ── FOOTER ────────────────────────────────────────────
  setStroke(BORDER); doc.setLineWidth(0.4);
  doc.line(ML, y, ML+CW, y);
  setFont(8,"normal"); setTxt(GRAY);
  doc.text("PF Simón Duque Villegas · Atlético Nacional", PW/2, y+5, {align:"center"});

  // Save
  const fname = `Informe_AN_vs_${matchData.rival.replace(/\s+/g,"_")}.pdf`;
  doc.save(fname);
}

// ── Setup Screen ────────────────────────────────────────
function SetupScreen({ onStart }) {
  const [rival, setRival] = useState("");
  const [tournament, setTournament] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [jornada, setJornada] = useState("");
  const [rivalLogo, setRivalLogo] = useState(null);
  const [starters, setStarters] = useState(Array(11).fill(null).map(()=>({name:"",number:"",pos:""})));
  const [subs, setSubs] = useState(Array(9).fill(null).map(()=>({name:"",number:"",pos:""})));
  const [staff, setStaff] = useState([
    {name:"",role:""},{name:"",role:""},{name:"",role:""},
  ]);

  const handleLogo = e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader(); r.onload = ev => setRivalLogo(ev.target.result); r.readAsDataURL(f);
  };
  const upd = (arr,set,i,field,val) => { const a=[...arr]; a[i]={...a[i],[field]:val}; set(a); };

  const handleStart = () => {
    if (!rival.trim()) { alert("Ingresa el nombre del rival"); return; }
    onStart({
      rival, tournament, date, jornada, rivalLogo,
      players:[
        ...starters.filter(p=>p.name.trim()).map(p=>({...p,type:"titular"})),
        ...subs.filter(p=>p.name.trim()).map(p=>({...p,type:"suplente"})),
      ],
      starters: starters.filter(p=>p.name.trim()),
      subs: subs.filter(p=>p.name.trim()),
      staff: staff.filter(s=>s.name.trim()),
    });
  };

  const inp = {width:"100%",padding:"10px 12px",border:"2px solid #ddd",borderRadius:9,
    fontSize:15,fontFamily:"Georgia,serif",boxSizing:"border-box",marginBottom:5};
  const lbl = {display:"block",fontWeight:"bold",color:G.greenDark,
    marginBottom:4,fontFamily:"Georgia,serif",fontSize:13};
  const card = {background:"#fff",borderRadius:14,padding:22,marginBottom:14,
    boxShadow:"0 2px 10px rgba(0,80,0,0.1)"};

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#002500,#005500)",paddingBottom:50}}>
      <div style={{background:"#001a00",padding:"18px 22px",boxShadow:"0 4px 24px rgba(0,0,0,0.5)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16,maxWidth:900,margin:"0 auto"}}>
          <img src={AN_SHIELD} style={{width:58,height:68,objectFit:"contain"}} alt="AN"
            onError={e=>e.target.style.display="none"}/>
          <div>
            <div style={{color:G.greenBright,fontFamily:"Georgia,serif",fontSize:24,fontWeight:"bold",letterSpacing:3}}>ATLÉTICO NACIONAL</div>
            <div style={{color:"rgba(255,255,255,0.55)",fontSize:12,letterSpacing:4,marginTop:2}}>MATCH TRACKER</div>
          </div>
        </div>
      </div>

      <div style={{maxWidth:900,margin:"0 auto",padding:"20px 18px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
          <div style={card}>
            <h2 style={{margin:"0 0 14px",color:G.greenDark,fontFamily:"Georgia,serif",fontSize:18}}>📋 Información del Partido</h2>
            <label style={lbl}>Rival *</label>
            <input style={inp} placeholder="Ej: Millonarios FC" value={rival} onChange={e=>setRival(e.target.value)}/>
            <label style={lbl}>Torneo</label>
            <input style={inp} placeholder="Ej: Torneo BetPlay BCA" value={tournament} onChange={e=>setTournament(e.target.value)}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div><label style={lbl}>Fecha</label><input type="date" style={inp} value={date} onChange={e=>setDate(e.target.value)}/></div>
              <div><label style={lbl}>Jornada</label><input style={inp} placeholder="Fecha 10" value={jornada} onChange={e=>setJornada(e.target.value)}/></div>
            </div>
            <label style={lbl}>Escudo del rival</label>
            <div style={{border:"2px dashed #bbb",borderRadius:9,padding:14,textAlign:"center",
              cursor:"pointer",position:"relative",background:"#fafafa",minHeight:64,
              display:"flex",alignItems:"center",justifyContent:"center"}}>
              {rivalLogo
                ? <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <img src={rivalLogo} style={{width:50,height:50,objectFit:"contain"}} alt="rival"/>
                    <span style={{color:G.greenDark,fontFamily:"Georgia,serif",fontSize:14}}>✓ Escudo cargado</span>
                  </div>
                : <span style={{color:"#aaa",fontFamily:"Georgia,serif",fontSize:14}}>📁 Cargar escudo del rival</span>
              }
              <input type="file" accept="image/*" onChange={handleLogo} style={{position:"absolute",inset:0,opacity:0,cursor:"pointer"}}/>
            </div>
            <h2 style={{margin:"16px 0 10px",color:G.greenDark,fontFamily:"Georgia,serif",fontSize:18}}>👔 Cuerpo Técnico</h2>
            {staff.map((s,i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 100px",gap:6,marginBottom:6}}>
                <input placeholder="Nombre" style={{...inp,marginBottom:0}} value={s.name} onChange={e=>upd(staff,setStaff,i,"name",e.target.value)}/>
                <input placeholder="Cargo" style={{...inp,marginBottom:0}} value={s.role} onChange={e=>upd(staff,setStaff,i,"role",e.target.value)}/>
              </div>
            ))}
            <button onClick={()=>setStaff([...staff,{name:"",role:""}])}
              style={{padding:"7px 13px",background:"transparent",border:"2px solid "+G.green,
                borderRadius:7,color:G.green,cursor:"pointer",fontFamily:"Georgia,serif",fontSize:13}}>
              + Agregar
            </button>
          </div>
          <div>
            <div style={card}>
              <h2 style={{margin:"0 0 10px",color:G.greenDark,fontFamily:"Georgia,serif",fontSize:18}}>🟢 Titulares</h2>
              {starters.map((p,i)=>(
                <div key={i} style={{display:"grid",gridTemplateColumns:"44px 1fr 68px",gap:5,marginBottom:5}}>
                  <input placeholder="#" style={{...inp,marginBottom:0,textAlign:"center",fontSize:13}} value={p.number} onChange={e=>upd(starters,setStarters,i,"number",e.target.value)}/>
                  <input placeholder={`Jugador ${i+1}`} style={{...inp,marginBottom:0,fontSize:13}} value={p.name} onChange={e=>upd(starters,setStarters,i,"name",e.target.value)}/>
                  <select style={{...inp,marginBottom:0,fontSize:13}} value={p.pos} onChange={e=>upd(starters,setStarters,i,"pos",e.target.value)}>
                    <option value="">Pos</option>
                    {POSITIONS.map(pos=><option key={pos}>{pos}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div style={card}>
              <h2 style={{margin:"0 0 10px",color:G.greenDark,fontFamily:"Georgia,serif",fontSize:18}}>🔵 Suplentes</h2>
              {subs.map((p,i)=>(
                <div key={i} style={{display:"grid",gridTemplateColumns:"44px 1fr 68px",gap:5,marginBottom:5}}>
                  <input placeholder="#" style={{...inp,marginBottom:0,textAlign:"center",fontSize:13}} value={p.number} onChange={e=>upd(subs,setSubs,i,"number",e.target.value)}/>
                  <input placeholder={`Suplente ${i+1}`} style={{...inp,marginBottom:0,fontSize:13}} value={p.name} onChange={e=>upd(subs,setSubs,i,"name",e.target.value)}/>
                  <select style={{...inp,marginBottom:0,fontSize:13}} value={p.pos} onChange={e=>upd(subs,setSubs,i,"pos",e.target.value)}>
                    <option value="">Pos</option>
                    {POSITIONS.map(pos=><option key={pos}>{pos}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button onClick={handleStart}
          style={{width:"100%",padding:18,background:"linear-gradient(135deg,#004400,#008800)",
            color:"white",border:"none",borderRadius:12,fontSize:21,fontWeight:"bold",
            cursor:"pointer",fontFamily:"Georgia,serif",boxShadow:"0 8px 22px rgba(0,100,0,0.4)",letterSpacing:2}}>
          ⚽ INICIAR PARTIDO
        </button>
      </div>
    </div>
  );
}

// ── Live Screen ─────────────────────────────────────────
function LiveScreen({ matchData, onEnd }) {
  const timer = useTimer();
  const [score, setScore] = useState([0,0]);
  const [events, setEvents] = useState([]);
  const [modal, setModal] = useState(null);
  const [pending, setPending] = useState({});
  const [t1Real, setT1Real] = useState(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const allP = matchData.players;
  const addEv = (type,data) => setEvents(prev=>[...prev,{id:Date.now(),type,...data}]);

  // Goal flow: player → zone → assist → minute
  const onGP = p => { setPending({player:p}); setModal("gz"); };
  const onGZ = (id,label) => { setPending(v=>({...v,zone:id,zoneLabel:label})); setModal("ga"); };
  const onGA = assist => { setPending(v=>({...v,assist})); setModal("gm"); };
  const onGM = min => {
    const opp=pending.player?.isOpponent;
    setScore(s=>opp?[s[0],s[1]+1]:[s[0]+1,s[1]]);
    addEv("goal",{player:pending.player,zone:pending.zone,zoneLabel:pending.zoneLabel,assist:pending.assist,minute:min,isOpponent:opp});
    setPending({}); setModal(null);
  };

  const onYP = p => { setPending({player:p}); setModal("ym"); };
  const onYM = min => { addEv("yellow",{player:pending.player,minute:min}); setPending({}); setModal(null); };
  const onRP = p => { setPending({player:p}); setModal("rm"); };
  const onRM = min => { addEv("red",{player:pending.player,minute:min}); setPending({}); setModal(null); };
  const onIP = p => { addEv("injury",{player:p,minute:timer.matchMin}); setModal(null); };
  const onSO = p => { setPending({out:p}); setModal("si"); };
  const onSI = p => { addEv("sub",{out:pending.out,in:p,minute:timer.matchMin}); setPending({}); setModal(null); };

  const handleHalfTime = (t1) => { setT1Real(t1); timer.secondHalf(); setModal(null); };

  const icon = t=>({goal:"⚽",yellow:"🟨",red:"🟥",injury:"🚑",sub:"🔄"}[t]||"•");

  const ActionBtn = ({label,emoji,bg,action}) => (
    <button onClick={action}
      style={{padding:"16px 8px",background:bg,color:"white",border:"none",borderRadius:13,
        cursor:"pointer",fontFamily:"Georgia,serif",fontSize:13,fontWeight:"bold",
        display:"flex",flexDirection:"column",alignItems:"center",gap:5,minHeight:86,
        boxShadow:"0 4px 12px rgba(0,0,0,0.25)",touchAction:"manipulation"}}>
      <span style={{fontSize:30}}>{emoji}</span>
      <span style={{fontSize:12}}>{label}</span>
    </button>
  );

  const handleEndMatch = () => { setModal("t2"); };
  const onT2Confirm = (t2) => {
    setModal(null);
    onEnd(score, events, t1Real||45, t2);
  };

  return (
    <div style={{height:"100vh",background:G.bg,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      {/* Top bar */}
      <div style={{background:"#000e00",padding:"11px 18px",boxShadow:"0 4px 18px rgba(0,0,0,0.6)",flexShrink:0}}>
        <div style={{maxWidth:980,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",gap:14}}>
          <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
            <img src={AN_SHIELD} style={{width:42,height:48,objectFit:"contain"}} alt="AN" onError={e=>e.target.style.display="none"}/>
            <div>
              <div style={{color:G.greenBright,fontFamily:"Georgia,serif",fontWeight:"bold",fontSize:14}}>Atlético Nacional</div>
              <div style={{color:"rgba(255,255,255,0.45)",fontSize:11}}>{matchData.tournament}</div>
            </div>
          </div>
          <div style={{textAlign:"center",flex:"0 0 auto"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:14,
              background:"rgba(0,180,0,0.12)",borderRadius:12,padding:"6px 24px",
              border:"1px solid rgba(0,180,0,0.25)"}}>
              <span style={{color:"white",fontFamily:"Georgia,serif",fontSize:44,fontWeight:"bold",lineHeight:1}}>{score[0]}</span>
              <span style={{color:"#444",fontSize:24}}>–</span>
              <span style={{color:"white",fontFamily:"Georgia,serif",fontSize:44,fontWeight:"bold",lineHeight:1}}>{score[1]}</span>
            </div>
            <div style={{marginTop:4,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
              <span style={{color:G.greenBright,fontFamily:"'Courier New',monospace",fontSize:22,fontWeight:"bold"}}>{timer.display}</span>
              <span style={{color:"rgba(255,255,255,0.4)",fontSize:11}}>{timer.half}° Tiempo</span>
            </div>
            <div style={{display:"flex",gap:7,justifyContent:"center",marginTop:7}}>
              {!timer.running
                ? <button onClick={timer.start} style={{padding:"6px 16px",background:G.green,color:"white",border:"none",borderRadius:18,cursor:"pointer",fontFamily:"Georgia,serif",fontWeight:"bold",fontSize:12}}>
                    ▶ {timer.display==="00:00"?"Iniciar":"Reanudar"}
                  </button>
                : <button onClick={timer.pause} style={{padding:"6px 16px",background:"#AA5500",color:"white",border:"none",borderRadius:18,cursor:"pointer",fontFamily:"Georgia,serif",fontWeight:"bold",fontSize:12}}>
                    ⏸ Pausar
                  </button>
              }
              {timer.half===1 &&
                <button onClick={()=>setModal("ht")} style={{padding:"6px 14px",background:"#003366",color:"white",border:"none",borderRadius:18,cursor:"pointer",fontFamily:"Georgia,serif",fontWeight:"bold",fontSize:12}}>
                  2° Tiempo
                </button>
              }
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,flex:1,justifyContent:"flex-end"}}>
            <div style={{textAlign:"right"}}>
              <div style={{color:"rgba(255,255,255,0.85)",fontFamily:"Georgia,serif",fontWeight:"bold",fontSize:14}}>{matchData.rival}</div>
              <div style={{color:"rgba(255,255,255,0.4)",fontSize:11}}>{matchData.jornada}</div>
            </div>
            {matchData.rivalLogo
              ? <img src={matchData.rivalLogo} style={{width:42,height:48,objectFit:"contain"}} alt="rival"/>
              : <div style={{width:42,height:48,background:"rgba(255,255,255,0.05)",borderRadius:7}}/>
            }
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{flex:1,overflow:"hidden",display:"flex",maxWidth:980,margin:"0 auto",
        width:"100%",padding:"14px 18px",gap:14,boxSizing:"border-box"}}>
        {/* Buttons */}
        <div style={{flex:"0 0 auto",width:270}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
            <ActionBtn label="GOL"      emoji="⚽" bg="#004d00" action={()=>setModal("gp")}/>
            <ActionBtn label="AMARILLA" emoji="🟨" bg="#995500" action={()=>setModal("yp")}/>
            <ActionBtn label="ROJA"     emoji="🟥" bg="#880000" action={()=>setModal("rp")}/>
            <ActionBtn label="CAMBIO"   emoji="🔄" bg="#003366" action={()=>setModal("so")}/>
            <ActionBtn label="LESIÓN"   emoji="🚑" bg="#663300" action={()=>setModal("ip")}/>
            <button onClick={handleEndMatch}
              style={{padding:"16px 8px",background:"#220033",color:"white",border:"none",
                borderRadius:13,cursor:"pointer",fontFamily:"Georgia,serif",fontSize:12,
                fontWeight:"bold",display:"flex",flexDirection:"column",alignItems:"center",
                gap:3,minHeight:86,boxShadow:"0 4px 12px rgba(0,0,0,0.25)"}}>
              <span style={{fontSize:26}}>📄</span>
              <span>FIN /</span>
              <span>INFORME</span>
            </button>
          </div>
        </div>
        {/* Events */}
        <div style={{flex:1,background:"rgba(0,30,0,0.55)",borderRadius:14,padding:14,
          border:"1px solid rgba(0,120,0,0.3)",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <h3 style={{margin:"0 0 10px",color:G.greenBright,fontFamily:"Georgia,serif",fontSize:16,flexShrink:0}}>📋 Eventos</h3>
          <div style={{flex:1,overflowY:"auto"}}>
            {events.length===0
              ? <div style={{color:"rgba(255,255,255,0.3)",textAlign:"center",paddingTop:36,fontFamily:"Georgia,serif",fontSize:14}}>Sin eventos aún</div>
              : [...events].reverse().map(ev=>(
                <div key={ev.id} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
                  <span style={{fontSize:18}}>{icon(ev.type)}</span>
                  <span style={{color:G.greenBright,fontFamily:"'Courier New',monospace",fontWeight:"bold",minWidth:40,fontSize:13,paddingTop:1}}>{ev.minute}&apos;</span>
                  <div style={{flex:1}}>
                    <div style={{color:"rgba(255,255,255,0.88)",fontFamily:"Georgia,serif",fontSize:13}}>
                      {ev.type==="goal"   && (ev.isOpponent?`Gol de ${matchData.rival}`:`${ev.player?.name||""}${ev.zoneLabel?" — "+ev.zoneLabel:""}`)}
                      {ev.type==="yellow" && `Amarilla: ${ev.player?.name||""}`}
                      {ev.type==="red"    && `Roja: ${ev.player?.name||""}`}
                      {ev.type==="injury" && `Lesión: ${ev.player?.name||""}`}
                      {ev.type==="sub"    && `${ev.out?.name||""} → ${ev.in?.name||""}`}
                    </div>
                    {ev.type==="goal"&&!ev.isOpponent&&(
                      <div style={{color:"rgba(255,255,255,0.45)",fontFamily:"Georgia,serif",fontSize:11,marginTop:1}}>
                        {ev.assist?`🎯 ${ev.assist.name}`:"Sin asistencia"}
                      </div>
                    )}
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal==="gp" && <PlayerSelect players={allP} label="⚽ ¿Quién hizo el gol?" onSelect={onGP} onClose={()=>setModal(null)}
        extra={<button onClick={()=>onGP({name:`Gol ${matchData.rival}`,isOpponent:true})}
          style={{display:"block",width:"100%",padding:"11px 12px",marginBottom:7,background:"#880000",
            color:"white",border:"none",borderRadius:9,cursor:"pointer",fontFamily:"Georgia,serif",fontSize:14}}>
          ⚽ Gol del rival
        </button>}/>}
      {modal==="gz" && <ZonePicker onSelect={onGZ} onClose={()=>setModal(null)}/>}
      {modal==="ga" && <AssistSelect players={allP.filter(p=>p.name!==pending.player?.name)} onSelect={onGA} onClose={()=>setModal(null)}/>}
      {modal==="gm" && <MinuteInput autoMin={timer.matchMin} label="⚽ Minuto del gol" onConfirm={onGM} onClose={()=>setModal(null)}/>}
      {modal==="yp" && <PlayerSelect players={allP} label="🟨 Amarilla a..." onSelect={onYP} onClose={()=>setModal(null)}/>}
      {modal==="ym" && <MinuteInput autoMin={timer.matchMin} label="🟨 Minuto amarilla" onConfirm={onYM} onClose={()=>setModal(null)}/>}
      {modal==="rp" && <PlayerSelect players={allP} label="🟥 Roja a..." onSelect={onRP} onClose={()=>setModal(null)}/>}
      {modal==="rm" && <MinuteInput autoMin={timer.matchMin} label="🟥 Minuto roja" onConfirm={onRM} onClose={()=>setModal(null)}/>}
      {modal==="ip" && <PlayerSelect players={allP} label="🚑 ¿Quién se lesionó?" onSelect={onIP} onClose={()=>setModal(null)}/>}
      {modal==="so" && <PlayerSelect players={matchData.starters} label="🔄 ¿Quién sale?" onSelect={onSO} onClose={()=>setModal(null)}/>}
      {modal==="si" && <PlayerSelect players={matchData.subs} label="🔄 ¿Quién entra?" onSelect={onSI} onClose={()=>setModal(null)}/>}
      {modal==="ht" && <HalfTimeModal onConfirm={handleHalfTime} onClose={()=>setModal(null)}/>}
      {modal==="t2" && (
        <Overlay>
          <h3 style={{margin:"0 0 8px",color:G.greenDark,fontFamily:"Georgia,serif",textAlign:"center",fontSize:19}}>⏱ Fin del Partido</h3>
          <p style={{textAlign:"center",color:"#666",fontSize:13,margin:"0 0 12px"}}>¿Cuántos minutos duró el 2° tiempo?</p>
          <MinuteInput autoMin={50} label="⏱ Duración 2° Tiempo" onConfirm={onT2Confirm} onClose={()=>setModal(null)}/>
        </Overlay>
      )}
    </div>
  );
}

// ── Report Screen ───────────────────────────────────────
function ReportScreen({ matchData, score, events, t1Real, t2Real, onBack, onNewMatch }) {
  const [generating, setGenerating] = useState(false);

  const handlePDF = async () => {
    setGenerating(true);
    try { await generatePDF(matchData, score, events, t1Real, t2Real); }
    catch(e) { console.error(e); alert("Error generando PDF. Intentá de nuevo."); }
    setGenerating(false);
  };

  const goals    = events.filter(e=>e.type==="goal");
  const yellows  = events.filter(e=>e.type==="yellow");
  const reds     = events.filter(e=>e.type==="red");
  const subs     = events.filter(e=>e.type==="sub");
  const injuries = events.filter(e=>e.type==="injury");

  const t1R = t1Real||45; const t2R = t2Real||45;
  const allWithMins = matchData.players.map(p=>({
    ...p, mins: calcMins(p.name, p.type, events, t1R, t2R)
  })).filter(p=>p.mins!==null).sort((a,b)=>b.mins-a.mins);
  const maxMins = Math.max(...allWithMins.map(p=>p.mins),1);

  const fmtDate = d => {
    if (!d) return ""; const [y,m,day]=d.split("-");
    const months=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
    return `${parseInt(day)} de ${months[parseInt(m)-1]} de ${y}`;
  };

  const card = {background:"white",borderRadius:12,padding:16,marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.07)"};
  const st   = {color:G.greenDark,fontFamily:"Georgia,serif",fontWeight:"bold",fontSize:15,
    marginBottom:10,borderBottom:"2px solid #e8f5e9",paddingBottom:7};
  const bdg  = (min,bg,fg="#fff") => (
    <span style={{background:bg,color:fg,borderRadius:20,padding:"2px 10px",
      fontFamily:"'Courier New',monospace",fontWeight:"bold",fontSize:13,flexShrink:0}}>
      {min}&apos;
    </span>
  );

  return (
    <div style={{minHeight:"100vh",background:"#eef2ee",paddingBottom:60}}>
      {/* Load jsPDF */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"/>

      <div style={{position:"sticky",top:0,background:"#002200",
        padding:"11px 18px",zIndex:10,display:"flex",gap:9,justifyContent:"center",flexWrap:"wrap"}}>
        <button onClick={handlePDF} disabled={generating}
          style={{padding:"11px 22px",background:generating?"#888":G.greenBright,color:"#001a00",
            border:"none",borderRadius:20,cursor:generating?"wait":"pointer",
            fontFamily:"Georgia,serif",fontWeight:"bold",fontSize:14}}>
          {generating ? "⏳ Generando..." : "📄 Descargar Informe PDF"}
        </button>
        <button onClick={onBack}
          style={{padding:"11px 16px",background:"rgba(255,255,255,0.15)",color:"white",
            border:"none",borderRadius:20,cursor:"pointer",fontFamily:"Georgia,serif",fontSize:13}}>
          ← Volver al partido
        </button>
        <button onClick={onNewMatch}
          style={{padding:"11px 16px",background:"rgba(255,255,255,0.15)",color:"white",
            border:"none",borderRadius:20,cursor:"pointer",fontFamily:"Georgia,serif",fontSize:13}}>
          + Nuevo partido
        </button>
      </div>

      <div style={{maxWidth:780,margin:"0 auto",padding:"20px 16px"}}>
        {/* Cover */}
        <div style={{background:"linear-gradient(135deg,#001e00,#005000)",borderRadius:16,
          padding:"24px 22px",marginBottom:14,color:"white",textAlign:"center",
          boxShadow:"0 8px 28px rgba(0,80,0,0.35)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:22,marginBottom:12,flexWrap:"wrap"}}>
            <div style={{textAlign:"center"}}>
              <img src={AN_SHIELD} style={{width:52,height:60,objectFit:"contain"}} alt="AN"
                onError={e=>e.target.style.display="none"}/>
              <div style={{fontSize:10,color:G.greenBright,fontWeight:"bold",marginTop:5}}>Atlético Nacional</div>
            </div>
            <div>
              <div style={{fontFamily:"Georgia,serif",fontWeight:"bold",fontSize:48,lineHeight:1}}>
                {score[0]}&nbsp;<span style={{fontSize:24,opacity:0.4}}>—</span>&nbsp;{score[1]}
              </div>
              <div style={{fontSize:12,opacity:0.6,marginTop:5}}>Resultado Final</div>
            </div>
            <div style={{textAlign:"center"}}>
              {matchData.rivalLogo
                ? <img src={matchData.rivalLogo} style={{width:52,height:60,objectFit:"contain"}} alt="rival"/>
                : <div style={{width:52,height:60,background:"rgba(255,255,255,0.06)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,opacity:0.4}}>Rival</div>
              }
              <div style={{fontSize:10,color:G.greenBright,fontWeight:"bold",marginTop:5}}>{matchData.rival}</div>
            </div>
          </div>
          <div style={{borderTop:"1px solid rgba(255,255,255,0.15)",paddingTop:10,
            display:"flex",justifyContent:"center",gap:20,flexWrap:"wrap",fontSize:13}}>
            {matchData.tournament&&<span><b>Torneo:</b> {matchData.tournament}</span>}
            {matchData.jornada&&<span><b>Jornada:</b> {matchData.jornada}</span>}
            {matchData.date&&<span><b>Fecha:</b> {fmtDate(matchData.date)}</span>}
            <span><b>Duración:</b> {t1R}' + {t2R}' = {t1R+t2R}'</span>
          </div>
        </div>

        {/* Goles */}
        <div style={card}>
          <div style={st}>⚽ Goles ({goals.length})</div>
          {goals.length===0
            ? <p style={{color:"#bbb",fontSize:13,margin:0}}>Sin goles</p>
            : goals.map((g,i)=>(
              <div key={i} style={{padding:"9px 0",borderBottom:"1px solid #f0f0f0"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  {bdg(g.minute, g.isOpponent?"#880000":G.greenDark)}
                  <span style={{fontFamily:"Georgia,serif",fontSize:14,flex:1}}>
                    {g.isOpponent
                      ? <b style={{color:"#880000"}}>{matchData.rival}</b>
                      : <><b>{g.player?.name}</b>{g.zoneLabel&&<span style={{color:"#888",fontSize:12}}> — {g.zoneLabel}</span>}</>}
                  </span>
                </div>
                {!g.isOpponent&&<div style={{marginTop:3,marginLeft:52,color:"#555",fontFamily:"Georgia,serif",fontSize:12}}>
                  🎯 {g.assist?`Asistencia: ${g.assist.name}`:"Sin asistencia"}
                </div>}
              </div>
            ))
          }
        </div>

        {/* Tarjetas + Cambios */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          {(yellows.length>0||reds.length>0)&&(
            <div style={card}>
              <div style={st}>🟨🟥 Tarjetas</div>
              {yellows.map((y,i)=>(
                <div key={i} style={{display:"flex",gap:9,alignItems:"center",padding:"6px 0",borderBottom:"1px solid #f0f0f0"}}>
                  {bdg(y.minute,"#AA7700")}
                  <span style={{fontFamily:"Georgia,serif",fontSize:13}}>🟨 {y.player?.name}</span>
                </div>
              ))}
              {reds.map((r,i)=>(
                <div key={i} style={{display:"flex",gap:9,alignItems:"center",padding:"6px 0",borderBottom:"1px solid #f0f0f0"}}>
                  {bdg(r.minute,"#880000")}
                  <span style={{fontFamily:"Georgia,serif",fontSize:13}}>🟥 {r.player?.name}</span>
                </div>
              ))}
            </div>
          )}
          {subs.length>0&&(
            <div style={card}>
              <div style={st}>🔄 Cambios</div>
              {subs.map((s,i)=>(
                <div key={i} style={{display:"flex",gap:9,alignItems:"center",padding:"6px 0",borderBottom:"1px solid #f0f0f0"}}>
                  {bdg(s.minute,"#003366")}
                  <span style={{fontFamily:"Georgia,serif",fontSize:13}}>
                    <span style={{color:"#880000",fontWeight:"bold"}}>⬇ {s.out?.name}</span>
                    <span style={{color:"#888"}}> → </span>
                    <span style={{color:"#004400",fontWeight:"bold"}}>⬆ {s.in?.name}</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Minutos jugados */}
        {allWithMins.length>0&&(
          <div style={card}>
            <div style={st}>⏱ Minutos Jugados ({t1R+t2R}' — {t1R}' + {t2R}')</div>
            <div style={{display:"flex",gap:3,alignItems:"flex-end",height:110,padding:"0 4px 0 28px",position:"relative"}}>
              {/* Y axis */}
              {[25,50,75,t1R+t2R].map(v=>(
                <div key={v} style={{position:"absolute",left:0,bottom:20+((v/maxMins)*80),
                  color:"#aaa",fontSize:10,fontFamily:"'Courier New',monospace"}}>{v}</div>
              ))}
              {allWithMins.map((p,i)=>{
                const isTit=p.type==="titular";
                const barH=Math.max(4,(p.mins/maxMins)*80);
                return (
                  <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
                    <span style={{fontSize:9,fontFamily:"'Courier New',monospace",fontWeight:"bold",
                      color:isTit?G.greenDark:G.blue,marginBottom:1}}>{p.mins}&apos;</span>
                    <div style={{width:"70%",background:"#e8f5e9",borderRadius:"3px 3px 0 0",
                      height:80,display:"flex",alignItems:"flex-end",overflow:"hidden"}}>
                      <div style={{width:"100%",height:barH,
                        background:isTit?"#00AA44":"#004488",borderRadius:"3px 3px 0 0",
                        transition:"height 0.3s"}}/>
                    </div>
                    {p.number&&(
                      <div style={{background:isTit?G.greenDark:G.blue,color:"white",
                        borderRadius:3,padding:"1px 4px",fontSize:9,fontWeight:"bold",marginTop:2}}>
                        {p.number}
                      </div>
                    )}
                    <div style={{fontSize:8,fontWeight:"bold",color:"#1a1a1a",textAlign:"center",
                      maxWidth:28,lineHeight:1.1,marginTop:1}}>
                      {p.name.split(" ").length>1
                        ? `${p.name.split(" ")[0][0]}. ${p.name.split(" ").slice(-1)[0]}`
                        : p.name}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{display:"flex",gap:12,justifyContent:"flex-end",marginTop:6}}>
              <span style={{fontSize:10,color:"#555"}}><span style={{color:"#00AA44",fontWeight:"bold"}}>■</span> Titular</span>
              <span style={{fontSize:10,color:"#555"}}><span style={{color:"#004488",fontWeight:"bold"}}>■</span> Suplente</span>
            </div>
          </div>
        )}

        {/* Alineación + Suplentes */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          {matchData.starters?.length>0&&(
            <div style={card}>
              <div style={st}>🟢 Titulares</div>
              {matchData.starters.map((p,i)=>(
                <div key={i} style={{display:"flex",gap:7,alignItems:"center",padding:"5px 7px",
                  background:i%2===0?"#f6fff6":"white",borderRadius:6,marginBottom:4}}>
                  {p.number&&<span style={{background:G.greenDark,color:"white",borderRadius:4,
                    padding:"1px 5px",fontWeight:"bold",fontSize:11,minWidth:22,textAlign:"center"}}>{p.number}</span>}
                  <span style={{fontFamily:"Georgia,serif",fontSize:13,flex:1}}>{p.name}</span>
                  {p.pos&&<span style={{color:G.greenDark,fontSize:11,fontWeight:"bold"}}>{p.pos}</span>}
                </div>
              ))}
            </div>
          )}
          {matchData.subs?.length>0&&(
            <div style={card}>
              <div style={st}>🔵 Suplentes</div>
              {matchData.subs.map((p,i)=>(
                <div key={i} style={{display:"flex",gap:7,alignItems:"center",padding:"5px 7px",
                  background:i%2===0?"#f5f8ff":"white",borderRadius:6,marginBottom:4}}>
                  {p.number&&<span style={{background:"#003366",color:"white",borderRadius:4,
                    padding:"1px 5px",fontWeight:"bold",fontSize:11,minWidth:22,textAlign:"center"}}>{p.number}</span>}
                  <span style={{fontFamily:"Georgia,serif",fontSize:13,flex:1}}>{p.name}</span>
                  {p.pos&&<span style={{color:"#003366",fontSize:11,fontWeight:"bold"}}>{p.pos}</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Staff */}
        {matchData.staff?.length>0&&(
          <div style={card}>
            <div style={st}>👔 Cuerpo Técnico</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3px 12px"}}>
              {matchData.staff.map((s,i)=>(
                <div key={i} style={{display:"flex",gap:7,padding:"5px 0",borderBottom:"1px solid #f0f0f0"}}>
                  <span style={{fontFamily:"Georgia,serif",fontSize:13,fontWeight:"bold"}}>{s.name}</span>
                  {s.role&&<span style={{color:"#888",fontSize:12}}>— {s.role}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{textAlign:"center",padding:"16px 0",color:"#aaa",fontFamily:"Georgia,serif",fontSize:12}}>
          PF Simón Duque Villegas · Atlético Nacional
        </div>
      </div>
    </div>
  );
}

// ── Persistence ─────────────────────────────────────────
const SK = "an_match_v5";
const loadH = () => { try { return JSON.parse(localStorage.getItem(SK)||"[]"); } catch { return []; } };
const saveH = r => { try { const h=loadH(); h.unshift({...r,id:Date.now()}); localStorage.setItem(SK,JSON.stringify(h.slice(0,20))); } catch {} };

// ── Main App ─────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]     = useState("setup");
  const [matchData, setMatchData] = useState(null);
  const [score, setScore]       = useState([0,0]);
  const [events, setEvents]     = useState([]);
  const [t1Real, setT1Real]     = useState(45);
  const [t2Real, setT2Real]     = useState(45);
  const [history, setHistory]   = useState([]);
  const [showH, setShowH]       = useState(false);
  const [histDetail, setHistDetail] = useState(null);

  // Load jsPDF script once
  useEffect(() => {
    if (!window.jspdf) {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      document.head.appendChild(s);
    }
    setHistory(loadH());
  }, []);

  const handleStart = d => { setMatchData(d); setScore([0,0]); setEvents([]); setScreen("live"); };
  const handleEnd   = (s,e,t1,t2) => {
    setScore(s); setEvents(e); setT1Real(t1||45); setT2Real(t2||45);
    if (matchData) { saveH({matchData,score:s,events:e,t1Real:t1||45,t2Real:t2||45}); setHistory(loadH()); }
    setScreen("report");
  };

  if (histDetail) return (
    <ReportScreen matchData={histDetail.matchData} score={histDetail.score}
      events={histDetail.events} t1Real={histDetail.t1Real||45} t2Real={histDetail.t2Real||45}
      onBack={()=>setHistDetail(null)} onNewMatch={()=>setHistDetail(null)}/>
  );
  if (screen==="live") return <LiveScreen matchData={matchData} onEnd={handleEnd}/>;
  if (screen==="report") return (
    <ReportScreen matchData={matchData} score={score} events={events} t1Real={t1Real} t2Real={t2Real}
      onBack={()=>setScreen("live")} onNewMatch={()=>{ setMatchData(null); setScreen("setup"); }}/>
  );

  return (
    <>
      <SetupScreen onStart={handleStart}/>
      <button onClick={()=>setShowH(true)}
        style={{position:"fixed",bottom:22,right:22,padding:"11px 18px",
          background:"rgba(0,70,0,0.92)",color:"white",border:"none",borderRadius:22,
          cursor:"pointer",fontFamily:"Georgia,serif",fontSize:13,
          boxShadow:"0 4px 12px rgba(0,0,0,0.4)"}}>
        📚 Historial
      </button>
      {showH&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.78)",zIndex:300,
          display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{background:"white",borderRadius:16,padding:24,maxWidth:460,
            width:"90%",maxHeight:"80vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.4)"}}>
            <h3 style={{margin:"0 0 14px",color:G.greenDark,fontFamily:"Georgia,serif",fontSize:19}}>📚 Partidos Guardados</h3>
            {history.length===0
              ? <p style={{color:"#aaa",fontSize:13}}>Sin partidos guardados</p>
              : history.map(h=>(
                <div key={h.id} onClick={()=>{setHistDetail(h);setShowH(false);}}
                  style={{padding:"11px 13px",marginBottom:7,background:"#f5fff5",
                    borderRadius:9,border:"1px solid #ddd",cursor:"pointer"}}
                  onMouseEnter={e=>e.currentTarget.style.background="#e8ffe8"}
                  onMouseLeave={e=>e.currentTarget.style.background="#f5fff5"}>
                  <div style={{fontFamily:"Georgia,serif",fontWeight:"bold",fontSize:15,color:G.greenDark}}>
                    AN {h.score[0]} – {h.score[1]} {h.matchData?.rival}
                  </div>
                  <div style={{fontSize:12,color:"#888",marginTop:2}}>
                    {h.matchData?.tournament} · {h.matchData?.date}
                  </div>
                </div>
              ))
            }
            <button onClick={()=>setShowH(false)}
              style={{marginTop:10,width:"100%",padding:11,background:"#e0e0e0",
                border:"none",borderRadius:9,cursor:"pointer",fontWeight:"bold",fontSize:14}}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
