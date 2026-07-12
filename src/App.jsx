import { useState, useEffect, useRef, useCallback } from "react";

const AN_SHIELD = "data:image/png;base64,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";

const G = {
  green: "#006600", greenDark: "#004400", greenBright: "#00CC00",
  white: "#FFFFFF", red: "#CC0000", yellow: "#FFB300", blue: "#004488",
  bg: "#001500",
};
const POSITIONS = ["POR","DEF","LAT","MED","EXT","DEL"];
const T1_CLOCK = 45;

// ── Timer (timestamp-based — survives screen lock) ──────
function useTimer() {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [half, setHalf] = useState(1);
  const intervalRef = useRef(null);
  const startTsRef  = useRef(null); // timestamp when started
  const baseSecsRef = useRef(0);    // seconds accumulated before this start

  const tick = useCallback(() => {
    if (startTsRef.current === null) return;
    const elapsed = Math.floor((Date.now() - startTsRef.current) / 1000);
    setSeconds(baseSecsRef.current + elapsed);
  }, []);

  const start = useCallback(() => {
    if (!running) {
      startTsRef.current = Date.now();
      setRunning(true);
      intervalRef.current = setInterval(tick, 500); // 500ms for accuracy
    }
  }, [running, tick]);

  const pause = useCallback(() => {
    // Save accumulated seconds before pausing
    if (startTsRef.current !== null) {
      baseSecsRef.current += Math.floor((Date.now() - startTsRef.current) / 1000);
      startTsRef.current = null;
    }
    setRunning(false);
    clearInterval(intervalRef.current);
  }, []);

  const secondHalf = useCallback(() => {
    clearInterval(intervalRef.current);
    startTsRef.current = null;
    baseSecsRef.current = 0;
    setRunning(false);
    setSeconds(0);
    setHalf(2);
  }, []);

  // When app comes back from background, recalculate elapsed time
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && running && startTsRef.current !== null) {
        tick(); // immediate recalculation
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [running, tick]);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const mins = Math.floor(seconds / 60);
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
// ── PDF Generator (diseño profesional: tarjetas con acento de color, sin emojis, buen espaciado, sin textos superpuestos) ─

async function generatePDF(matchData, score, events, t1Real, t2Real) {
  const { jsPDF } = window.jspdf;
  const PW = 210;
  const ML = 13, MR = 13, MT = 12, MB = 12;
  const CW = PW - ML - MR;
  const GAP = 6;
  const HALF = (CW - GAP) / 2;

  // Colors
  const BG      = [0,28,0];
  const GREEN   = [0,68,0];
  const GBAR    = [0,163,68];
  const GLIGHT  = [237,247,238];
  const BLUE    = [0,52,102];
  const YELLOW  = [230,165,0];
  const RED     = [176,26,26];
  const GRAY    = [128,132,138];
  const GRAY2   = [95,102,110];
  const WHITE   = [255,255,255];
  const BLACK   = [24,24,26];
  const BORDER  = [222,225,222];

  const goals   = events.filter(e=>e.type==="goal");
  const yellows = events.filter(e=>e.type==="yellow");
  const reds    = events.filter(e=>e.type==="red");
  const subs    = events.filter(e=>e.type==="sub");
  const cardRows = [...yellows.map(e=>({...e,card:"Y"})), ...reds.map(e=>({...e,card:"R"}))];

  const t1R = t1Real || 45;
  const t2R = t2Real || 45;
  const allWithMins = matchData.players.map(p=>({
    ...p, mins: calcMins(p.name, p.type, events, t1R, t2R)
  })).filter(p=>p.mins!==null).sort((a,b)=>b.mins-a.mins);
  const maxMins = Math.max(...allWithMins.map(p=>p.mins), 1);
  const nBars = Math.max(allWithMins.length, 1);

  const HEADER_H   = 9;
  const CONTENT_PAD = 2;
  const CONTENT_START = HEADER_H + CONTENT_PAD;

  const COVER_H = 42;
  const COVER_GAP = 6;

  const GOAL_ROW_H = 13;
  const goalsContentH = goals.length>0 ? goals.length*GOAL_ROW_H + 5 : 11;
  const goalsBoxH = CONTENT_START + goalsContentH;
  const goalsGapH = goalsBoxH + GAP;

  const CARD_ROW_H = 10;
  const cardsContentH = cardRows.length>0 ? cardRows.length*CARD_ROW_H + 4 : 11;
  const subsContentH  = subs.length>0     ? subs.length*CARD_ROW_H + 4     : 11;
  const cardsSubsBoxH = CONTENT_START + Math.max(cardsContentH, subsContentH);
  const cardsSubsGapH = cardsSubsBoxH + GAP;

  const CHART_TOP_PAD    = 9;
  const CHART_INNER_H    = 27;
  const CHART_BOTTOM_PAD = 23;
  const CHART_BOX_H = CONTENT_START + CHART_TOP_PAD + CHART_INNER_H + CHART_BOTTOM_PAD;
  const chartGapH = CHART_BOX_H + GAP;

  const LINEUP_ROW_H = 9;
  const lineupContentH = n => n>0 ? n*LINEUP_ROW_H + 4 : 11;
  const lineupBoxH = CONTENT_START + Math.max(lineupContentH(matchData.starters.length), lineupContentH(matchData.subs.length));
  const lineupGapH = lineupBoxH + GAP;

  const STAFF_ROW_H = 9;
  const staffContentH = matchData.staff.length>0 ? matchData.staff.length*STAFF_ROW_H + 4 : 11;
  const staffBoxH = CONTENT_START + staffContentH;
  const staffGapH = staffBoxH + GAP;

  const FOOTER_H = 14;

  const totalH = MT + COVER_H + COVER_GAP + goalsGapH + cardsSubsGapH + chartGapH
               + lineupGapH + staffGapH + FOOTER_H + MB;

  const doc = new jsPDF({ orientation:"portrait", unit:"mm", format:[PW, totalH] });

  let y = MT;

  const setFill   = c => doc.setFillColor(...c);
  const setStroke = c => doc.setDrawColor(...c);
  const setTxt    = c => doc.setTextColor(...c);
  const setFont   = (s,w="normal") => { doc.setFontSize(s); doc.setFont("helvetica",w); };

  const section = (rx,ry,w,h,accentColor,title) => {
    setFill(WHITE); setStroke(BORDER); doc.setLineWidth(0.35);
    doc.roundedRect(rx, ry, w, h, 2.5, 2.5, "FD");
    setFill(GLIGHT);
    doc.rect(rx+0.4, ry+0.4, w-0.8, HEADER_H-0.4, "F");
    setFill(accentColor);
    doc.roundedRect(rx+4.5, ry+2.4, 1.8, HEADER_H-4.8, 0.9, 0.9, "F");
    setFont(10.5,"bold"); setTxt(GREEN);
    doc.text(title, rx+9, ry+HEADER_H/2+1.5);
    setStroke(BORDER); doc.setLineWidth(0.35);
    doc.line(rx+4.5, ry+HEADER_H, rx+w-4.5, ry+HEADER_H);
    return ry + CONTENT_START;
  };

  const emptyState = (x,contentY,msg) => {
    setFont(8.5,"italic"); setTxt(GRAY);
    doc.text(msg, x, contentY+3.5);
  };

  const minBadge = (x,by,min,bg) => {
    setFill(bg); doc.roundedRect(x,by-3.3,12,5.4,1.6,1.6,"F");
    setFont(7.8,"bold"); setTxt(WHITE);
    doc.text(`${min}'`, x+6, by+0.9, {align:"center"});
  };

  const loadImg = (src) => new Promise(resolve => {
    if (!src) return resolve(null);
    const tryLoad = (url, onFail) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const c = document.createElement("canvas");
          c.width = img.naturalWidth || img.width;
          c.height = img.naturalHeight || img.height;
          c.getContext("2d").drawImage(img,0,0);
          resolve(c.toDataURL("image/png"));
        } catch (err) { onFail(); }
      };
      img.onerror = onFail;
      img.src = url;
    };
    tryLoad(src, () => {
      if (/^https?:\/\//i.test(src)) {
        const proxied = `https://images.weserv.nl/?url=${encodeURIComponent(src.replace(/^https?:\/\//,""))}`;
        tryLoad(proxied, () => resolve(null));
      } else resolve(null);
    });
  });

  const anImg = await loadImg(AN_SHIELD);
  const rvImg = matchData.rivalLogo ? await loadImg(matchData.rivalLogo) : null;

  setFill(BG);
  doc.roundedRect(ML, y, CW, COVER_H, 4, 4, "F");

  const colW    = CW/3;
  const leftCx  = ML + colW/2;
  const midCx   = ML + CW/2;
  const rightCx = ML + CW - colW/2;

  if (anImg) doc.addImage(anImg,"PNG", leftCx-7.5, y+5, 15, 19);
  setFont(9,"bold"); setTxt([0,214,0]);
  doc.text("Atlético Nacional", leftCx, y+28, {align:"center", maxWidth: colW-6});

  if (rvImg) doc.addImage(rvImg,"PNG", rightCx-7.5, y+6, 15, 15);
  setFont(9,"bold"); setTxt(WHITE);
  doc.text(matchData.rival || "Rival", rightCx, y+28, {align:"center", maxWidth: colW-6});

  setFont(28,"bold"); setTxt(WHITE);
  doc.text(`${score[0]}   -   ${score[1]}`, midCx, y+18, {align:"center"});
  setFont(7.8,"normal"); setTxt([175,175,175]);
  doc.text("Resultado Final", midCx, y+23.5, {align:"center"});

  setStroke([255,255,255]); doc.setLineWidth(0.15);
  doc.line(midCx-CW/2+14, y+34.5, midCx+CW/2-14, y+34.5);

  setFont(7.3,"normal"); setTxt([182,255,182]);
  const meta = [
    matchData.tournament && `Torneo: ${matchData.tournament}`,
    matchData.jornada    && `Jornada: ${matchData.jornada}`,
    matchData.date       && `Fecha: ${matchData.date}`,
    (t1R && t2R)          && `Duración: ${t1R}' + ${t2R}' = ${t1R+t2R}'`,
  ].filter(Boolean).join("     |     ");
  doc.text(meta, midCx, y+39.5, {align:"center", maxWidth: CW-14});
  y += COVER_H + COVER_GAP;

  let gy = section(ML, y, CW, goalsBoxH, GREEN, `Goles (${goals.length})`);

  if (goals.length===0) {
    emptyState(ML+6, gy, "Sin goles registrados");
  } else {
    goals.forEach((g,i) => {
      const rowY = gy + i*GOAL_ROW_H + 1;
      minBadge(ML+5, rowY+3.2, g.minute, g.isOpponent ? RED : GREEN);
      setFont(9.5,"bold"); setTxt(BLACK);
      doc.text(g.isOpponent ? matchData.rival : (g.player?.name||""), ML+21, rowY+3.7);

      if (!g.isOpponent) {
        const parts = [];
        if (g.zoneLabel || g.zone) parts.push(`Zona: ${g.zoneLabel || g.zone}`);
        parts.push(g.assist ? `Asistencia: ${g.assist.name}` : "Sin asistencia");
        setFont(8,"normal"); setTxt(GRAY2);
        doc.text(parts.join("     ·     "), ML+21, rowY+8.6);
      }
      if (i < goals.length-1) {
        setStroke([236,236,236]); doc.setLineWidth(0.3);
        doc.line(ML+5, rowY+11, ML+CW-5, rowY+11);
      }
    });
  }
  y += goalsGapH;

  let cy = section(ML, y, HALF, cardsSubsBoxH, YELLOW, "Tarjetas");
  if (cardRows.length===0) {
    emptyState(ML+6, cy, "Sin tarjetas");
  } else {
    cardRows.forEach((e,i) => {
      const ry2 = cy + i*CARD_ROW_H + 2.5;
      const bg = e.card==="Y" ? YELLOW : RED;
      const fg = WHITE;
      setFill(bg); doc.roundedRect(ML+5, ry2-3.3, 12, 5.4, 1.6,1.6,"F");
      setFont(7.8,"bold"); setTxt(fg);
      doc.text(`${e.minute}'`, ML+11, ry2+0.9, {align:"center"});
      setFont(8.8,"normal"); setTxt(BLACK);
      doc.text(`${e.card==="Y"?"Amarilla":"Roja"}: ${e.player?.name||""}`, ML+21, ry2+0.9);
      if (i < cardRows.length-1) { setStroke([236,236,236]); doc.setLineWidth(0.3); doc.line(ML+5, ry2+4.8, ML+HALF-5, ry2+4.8); }
    });
  }

  const SX = ML+HALF+GAP;
  let sy = section(SX, y, HALF, cardsSubsBoxH, BLUE, "Cambios");
  if (subs.length===0) {
    emptyState(SX+6, sy, "Sin cambios");
  } else {
    subs.forEach((s,i) => {
      const ry2 = sy + i*CARD_ROW_H + 2.5;
      setFill(BLUE); doc.roundedRect(SX+5, ry2-3.3, 12, 5.4, 1.6,1.6,"F");
      setFont(7.8,"bold"); setTxt(WHITE);
      doc.text(`${s.minute}'`, SX+11, ry2+0.9, {align:"center"});
      setFont(8.6,"normal"); setTxt(RED);
      doc.text(`Sale: ${s.out?.name||""}`, SX+21, ry2+0.9);
      const outW = doc.getTextWidth(`Sale: ${s.out?.name||""}`);
      setFont(8.6,"normal"); setTxt(GRAY);
      doc.text("   >   ", SX+21+outW, ry2+0.9);
      const arrW = doc.getTextWidth("   >   ");
      setFont(8.6,"normal"); setTxt(GREEN);
      doc.text(`Entra: ${s.in?.name||""}`, SX+21+outW+arrW, ry2+0.9);
      if (i < subs.length-1) { setStroke([236,236,236]); doc.setLineWidth(0.3); doc.line(SX+5, ry2+4.8, SX+HALF-5, ry2+4.8); }
    });
  }
  y += cardsSubsGapH;

  const CHART_ML = 17;
  const chartW = CW - CHART_ML - 3;
  const bw = chartW / nBars;
  const iw = Math.min(bw*0.6, 9.5);

  let mh = section(ML, y, CW, CHART_BOX_H, GREEN, `Minutos Jugados  (${t1R+t2R}' — ${t1R}' + ${t2R}')`);

  const chartBaseY = mh + CHART_TOP_PAD + CHART_INNER_H;
  const chartLeft  = ML + CHART_ML;

  [25,50,75,t1R+t2R].forEach(val => {
    if (val > maxMins+2) return;
    const lineY = chartBaseY - (val/maxMins)*CHART_INNER_H;
    setStroke([228,228,228]); doc.setLineWidth(0.25);
    doc.line(chartLeft, lineY, chartLeft+chartW-2, lineY);
    setFont(5.6,"normal"); setTxt(GRAY);
    doc.text(String(val), chartLeft-1.5, lineY+1, {align:"right"});
  });

  allWithMins.forEach((p,i) => {
    const xc = chartLeft + (i+0.5)*bw;
    const xb = xc - iw/2;
    const bh = (p.mins/maxMins)*CHART_INNER_H;
    const isTit = p.type==="titular";
    const bc = isTit ? GBAR : BLUE;

    setFill(GLIGHT); doc.rect(xb, chartBaseY-CHART_INNER_H, iw, CHART_INNER_H, "F");
    setFill(bc); doc.rect(xb, chartBaseY-bh, iw, bh, "F");
    setFont(6.2,"bold"); setTxt(isTit ? GREEN : BLUE);
    doc.text(`${p.mins}'`, xc, chartBaseY-bh-1.6, {align:"center"});
    const num = p.number||"";
    if (num) {
      setFill(bc);
      doc.roundedRect(xc-3.6, chartBaseY+1.8, 7.2, 4.6, 1,1,"F");
      setFont(6.2,"bold"); setTxt(WHITE);
      doc.text(num, xc, chartBaseY+5.1, {align:"center"});
    }
    const parts = p.name.split(" ");
    const display = parts.length>1 ? `${parts[0][0]}. ${parts[parts.length-1]}` : p.name;
    setFont(5.9,"bold"); setTxt(BLACK);
    doc.text(display, xc, chartBaseY+9.6, {align:"center"});
  });

  setStroke(GREEN); doc.setLineWidth(0.7);
  doc.line(chartLeft, chartBaseY, chartLeft+chartW-2, chartBaseY);
  doc.line(chartLeft, chartBaseY-CHART_INNER_H, chartLeft, chartBaseY);

  const legendY = chartBaseY + 18;
  setFill(GBAR); doc.rect(ML+CW-32, legendY-2.2, 3.2, 3.2, "F");
  setFont(6.8,"normal"); setTxt(BLACK); doc.text("Titular", ML+CW-27.5, legendY+0.5);
  setFill(BLUE); doc.rect(ML+CW-16, legendY-2.2, 3.2, 3.2, "F");
  doc.text("Suplente", ML+CW-11.5, legendY+0.5);

  y += chartGapH;

  const drawLineup = (players, sx, sw, numBg, title, accentColor) => {
    let ly = section(sx, y, sw, lineupBoxH, accentColor, title);
    if (players.length===0) { emptyState(sx+6, ly, "Sin jugadores"); return; }
    players.forEach((p,i) => {
      const ry2 = ly + i*LINEUP_ROW_H + 1.5;
      if (i%2===0) { setFill([248,251,248]); doc.rect(sx+2, ry2-1.8, sw-4, LINEUP_ROW_H-1, "F"); }
      if (p.number) {
        setFill(numBg); doc.roundedRect(sx+4, ry2-1.4, 8, 5.4, 1.2,1.2,"F");
        setFont(7.2,"bold"); setTxt(WHITE);
        doc.text(p.number, sx+8, ry2+2.7, {align:"center"});
      }
      setFont(8.8,"normal"); setTxt(BLACK);
      doc.text(p.name, sx+14.5, ry2+2.7);
      if (p.pos) {
        setFont(7.6,"bold"); setTxt(numBg);
        doc.text(p.pos, sx+sw-5, ry2+2.7, {align:"right"});
      }
    });
  };

  drawLineup(matchData.starters, ML,       HALF, GREEN, "Titulares",  GREEN);
  drawLineup(matchData.subs,     ML+HALF+GAP, HALF, BLUE,  "Suplentes",  BLUE);
  y += lineupGapH;

  let sty = section(ML, y, CW, staffBoxH, GREEN, "Cuerpo Técnico");
  if (matchData.staff.length===0) {
    emptyState(ML+6, sty, "Sin datos");
  } else {
    matchData.staff.forEach((s,i) => {
      const ry2 = sty + i*STAFF_ROW_H + 1.5;
      setFont(8.8,"bold"); setTxt(BLACK);
      doc.text(s.name, ML+6, ry2+2.7);
      setFont(8.4,"normal"); setTxt(GRAY2);
      doc.text(`—  ${s.role}`, ML+6+doc.getTextWidth(s.name)+3, ry2+2.7);
      if (i < matchData.staff.length-1) { setStroke([236,236,236]); doc.setLineWidth(0.3); doc.line(ML+5, ry2+5.8, ML+CW-5, ry2+5.8); }
    });
  }
  y += staffGapH;

  setStroke(BORDER); doc.setLineWidth(0.4);
  doc.line(ML, y, ML+CW, y);
  setFont(8,"italic"); setTxt(GRAY);
  doc.text("PF Simón Duque Villegas  ·  Atlético Nacional", PW/2, y+6, {align:"center"});

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

  // ── Smart squad tracking ───────────────────────────────
  // Returns the 11 players currently on the field
  const getPlayersOnField = () => {
    const onField = new Set(matchData.starters.map(p => p.name));
    const expelled = new Set();
    events.forEach(ev => {
      if (ev.type === "sub") {
        onField.delete(ev.out?.name);
        onField.add(ev.in?.name);
      }
      if (ev.type === "red") expelled.add(ev.player?.name);
    });
    expelled.forEach(n => onField.delete(n));
    return allP.filter(p => onField.has(p.name));
  };

  // Returns players NOT yet on field (available to come in)
  const getAvailableSubs = () => {
    const havePlayed = new Set();
    matchData.starters.forEach(p => havePlayed.add(p.name));
    events.forEach(ev => {
      if (ev.type === "sub") {
        havePlayed.add(ev.in?.name);
      }
    });
    return allP.filter(p => !havePlayed.has(p.name));
  };
  const addEv = (type,data) => setEvents(prev=>[...prev,{id:Date.now(),type,...data}]);

  // Goal flow: player → zone → assist → minute
  const onGP = p => {
    setPending({player:p});
    // Rival goal: skip zone and assist, go straight to minute
    if (p.isOpponent) setModal("gm");
    else setModal("gz");
  };
  const onGZ = (id,label) => {
    setPending(v=>({...v,zone:id,zoneLabel:label}));
    // Skip assist for opponent goals
    if (pending.player?.isOpponent) setModal("gm");
    else setModal("ga");
  };
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
      {modal==="gp" && <PlayerSelect players={getPlayersOnField()} label="⚽ ¿Quién hizo el gol?" onSelect={onGP} onClose={()=>setModal(null)}
        extra={<button onClick={()=>onGP({name:`Gol ${matchData.rival}`,isOpponent:true})}
          style={{display:"block",width:"100%",padding:"11px 12px",marginBottom:7,background:"#880000",
            color:"white",border:"none",borderRadius:9,cursor:"pointer",fontFamily:"Georgia,serif",fontSize:14}}>
          ⚽ Gol del rival
        </button>}/>}
      {modal==="gz" && <ZonePicker onSelect={onGZ} onClose={()=>setModal(null)}/>}
      {modal==="ga" && !pending.player?.isOpponent && <AssistSelect players={getPlayersOnField().filter(p=>p.name!==pending.player?.name)} onSelect={onGA} onClose={()=>setModal(null)}/>}
      {modal==="gm" && <MinuteInput autoMin={timer.matchMin} label="⚽ Minuto del gol" onConfirm={onGM} onClose={()=>setModal(null)}/>}
      {modal==="yp" && <PlayerSelect players={allP} label="🟨 Amarilla a..." onSelect={onYP} onClose={()=>setModal(null)}/>}
      {modal==="ym" && <MinuteInput autoMin={timer.matchMin} label="🟨 Minuto amarilla" onConfirm={onYM} onClose={()=>setModal(null)}/>}
      {modal==="rp" && <PlayerSelect players={allP} label="🟥 Roja a..." onSelect={onRP} onClose={()=>setModal(null)}/>}
      {modal==="rm" && <MinuteInput autoMin={timer.matchMin} label="🟥 Minuto roja" onConfirm={onRM} onClose={()=>setModal(null)}/>}
      {modal==="ip" && <PlayerSelect players={allP} label="🚑 ¿Quién se lesionó?" onSelect={onIP} onClose={()=>setModal(null)}/>}
      {modal==="so" && <PlayerSelect players={getPlayersOnField()} label="🔄 ¿Quién sale?" onSelect={onSO} onClose={()=>setModal(null)}/>}
      {modal==="si" && <PlayerSelect players={getAvailableSubs()} label="🔄 ¿Quién entra?" onSelect={onSI} onClose={()=>setModal(null)}/>}
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

// ── Edit Match Screen ───────────────────────────────────
function EditMatchScreen({ match, onSave, onClose }) {
  const [score, setScore]   = useState([...match.score]);
  const [events, setEvents] = useState([...match.events]);
  const [modal, setModal]   = useState(null);
  const [pending, setPending] = useState({});
  const [tab, setTab]       = useState("eventos"); // eventos | jugadores | staff

  // Players editable lists
  const [starters, setStarters] = useState(
    (match.matchData.starters||[]).map(p=>({...p}))
  );
  const [subs, setSubs] = useState(
    (match.matchData.subs||[]).map(p=>({...p}))
  );
  // Staff editable list
  const [staff, setStaff] = useState(
    (match.matchData.staff||[]).map(s=>({...s}))
  );

  // New player form
  const [newP, setNewP] = useState({name:"",number:"",pos:"",type:"titular"});
  // New staff form
  const [newS, setNewS] = useState({name:"",role:""});

  const allP = [
    ...starters.map(p=>({...p,type:"titular"})),
    ...subs.map(p=>({...p,type:"suplente"})),
  ];

  const removeEvent = (id) => setEvents(prev => prev.filter(e => e.id !== id));

  const addEv = (type, data) => {
    setEvents(prev => [...prev, {id: Date.now(), type, ...data}].sort((a,b)=>a.minute-b.minute));
  };

  // Add goal
  const onGP = p => { setPending({player:p}); setModal(p.isOpponent?"gm":"gz"); };
  const onGZ = (id,label) => { setPending(v=>({...v,zone:id,zoneLabel:label})); setModal("ga"); };
  const onGA = a => { setPending(v=>({...v,assist:a})); setModal("gm"); };
  const onGM = min => {
    const opp = pending.player?.isOpponent;
    if (!opp) setScore(s=>[s[0]+1,s[1]]); else setScore(s=>[s[0],s[1]+1]);
    addEv("goal",{player:pending.player,zone:pending.zone,zoneLabel:pending.zoneLabel,
      assist:pending.assist,minute:min,isOpponent:opp});
    setPending({}); setModal(null);
  };

  // Add yellow
  const onYP = p => { setPending({player:p}); setModal("ym"); };
  const onYM = min => { addEv("yellow",{player:pending.player,minute:min}); setPending({}); setModal(null); };

  // Add red
  const onRP = p => { setPending({player:p}); setModal("rm"); };
  const onRM = min => { addEv("red",{player:pending.player,minute:min}); setPending({}); setModal(null); };

  // Add sub
  const onSO = p => { setPending({out:p}); setModal("si"); };
  const onSI = p => { addEv("sub",{out:pending.out,in:p,minute:pending.minute||0}); setPending({}); setModal(null); };

  const icon = t => ({goal:"⚽",yellow:"🟨",red:"🟥",injury:"🚑",sub:"🔄"}[t]||"•");

  const evLabel = (ev) => {
    if (ev.type==="goal") return ev.isOpponent ? `Gol rival` : `${ev.player?.name||""}${ev.zoneLabel?" ("+ev.zoneLabel+")":""}`;
    if (ev.type==="yellow") return `Amarilla: ${ev.player?.name||""}`;
    if (ev.type==="red")    return `Roja: ${ev.player?.name||""}`;
    if (ev.type==="injury") return `Lesión: ${ev.player?.name||""}`;
    if (ev.type==="sub")    return `${ev.out?.name||""} → ${ev.in?.name||""}`;
    return "";
  };

  const [addMin, setAddMin] = useState("1");

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:400,
      display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"white",borderRadius:16,padding:0,width:"100%",maxWidth:600,
        maxHeight:"92vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}>

        {/* Header */}
        <div style={{background:G.greenDark,borderRadius:"16px 16px 0 0",padding:"16px 20px",
          display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{color:"white",fontFamily:"Georgia,serif",fontWeight:"bold",fontSize:16}}>
              ✏️ Editando: AN vs {match.matchData.rival}
            </div>
            <div style={{color:"rgba(255,255,255,0.6)",fontSize:12,marginTop:2}}>
              {match.matchData.date} · {match.matchData.jornada}
            </div>
          </div>
          <button onClick={onClose}
            style={{background:"rgba(255,255,255,0.15)",border:"none",color:"white",
              borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:14}}>
            Cancelar
          </button>
        </div>

        <div style={{padding:20}}>

          {/* Tabs */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:16}}>
            {[
              {id:"eventos",  label:"📋 Eventos"},
              {id:"jugadores",label:"👥 Jugadores"},
              {id:"staff",    label:"👔 Cuerpo Técnico"},
            ].map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)}
                style={{padding:"9px 4px",border:"none",borderRadius:8,cursor:"pointer",
                  fontFamily:"Georgia,serif",fontSize:12,fontWeight:"bold",
                  background: tab===t.id ? G.greenDark : "#f0f0f0",
                  color: tab===t.id ? "white" : G.greenDark}}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── TAB: JUGADORES ── */}
          {tab==="jugadores" && (
            <div>
              {/* Agregar jugador */}
              <div style={{background:"#f0fff0",borderRadius:12,padding:14,marginBottom:14,
                border:"1px solid #c8e6c9"}}>
                <div style={{fontFamily:"Georgia,serif",fontWeight:"bold",color:G.greenDark,
                  fontSize:13,marginBottom:10}}>➕ Agregar jugador</div>
                <div style={{display:"grid",gridTemplateColumns:"50px 1fr 70px",gap:6,marginBottom:8}}>
                  <input placeholder="#" value={newP.number}
                    onChange={e=>setNewP(v=>({...v,number:e.target.value}))}
                    style={{padding:"8px",border:"1px solid #ddd",borderRadius:7,
                      fontSize:14,textAlign:"center",fontFamily:"Georgia,serif"}}/>
                  <input placeholder="Nombre del jugador" value={newP.name}
                    onChange={e=>setNewP(v=>({...v,name:e.target.value}))}
                    style={{padding:"8px",border:"1px solid #ddd",borderRadius:7,
                      fontSize:14,fontFamily:"Georgia,serif"}}/>
                  <select value={newP.pos} onChange={e=>setNewP(v=>({...v,pos:e.target.value}))}
                    style={{padding:"8px",border:"1px solid #ddd",borderRadius:7,
                      fontSize:13,fontFamily:"Georgia,serif"}}>
                    <option value="">Pos</option>
                    {POSITIONS.map(p=><option key={p}>{p}</option>)}
                  </select>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:8}}>
                  <select value={newP.type} onChange={e=>setNewP(v=>({...v,type:e.target.value}))}
                    style={{padding:"8px",border:"1px solid #ddd",borderRadius:7,
                      fontSize:13,fontFamily:"Georgia,serif"}}>
                    <option value="titular">Titular</option>
                    <option value="suplente">Suplente</option>
                  </select>
                  <button onClick={()=>{
                    if(!newP.name.trim()) return;
                    if(newP.type==="titular") setStarters(s=>[...s,{...newP}]);
                    else setSubs(s=>[...s,{...newP}]);
                    setNewP({name:"",number:"",pos:"",type:"titular"});
                  }} style={{padding:"8px",background:G.greenDark,color:"white",border:"none",
                    borderRadius:7,cursor:"pointer",fontFamily:"Georgia,serif",
                    fontSize:14,fontWeight:"bold"}}>
                    + Agregar
                  </button>
                </div>
              </div>

              {/* Titulares */}
              <div style={{marginBottom:14}}>
                <div style={{fontFamily:"Georgia,serif",fontWeight:"bold",color:G.greenDark,
                  fontSize:13,marginBottom:8}}>🟢 Titulares ({starters.length})</div>
                {starters.map((p,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,
                    padding:"7px 10px",marginBottom:5,background:"#f6fff6",
                    borderRadius:8,border:"1px solid #d4ecd4"}}>
                    {p.number&&<span style={{background:G.greenDark,color:"white",
                      borderRadius:4,padding:"1px 6px",fontWeight:"bold",fontSize:11,
                      minWidth:22,textAlign:"center"}}>{p.number}</span>}
                    <span style={{fontFamily:"Georgia,serif",fontSize:13,flex:1}}>{p.name}</span>
                    {p.pos&&<span style={{color:G.greenDark,fontSize:11,fontWeight:"bold"}}>{p.pos}</span>}
                    <button onClick={()=>setStarters(s=>s.filter((_,j)=>j!==i))}
                      style={{background:"#ffeeee",border:"1px solid #ffcccc",color:"#cc0000",
                        borderRadius:5,padding:"3px 7px",cursor:"pointer",fontSize:12}}>
                      🗑
                    </button>
                  </div>
                ))}
              </div>

              {/* Suplentes */}
              <div>
                <div style={{fontFamily:"Georgia,serif",fontWeight:"bold",color:"#003366",
                  fontSize:13,marginBottom:8}}>🔵 Suplentes ({subs.length})</div>
                {subs.map((p,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,
                    padding:"7px 10px",marginBottom:5,background:"#f5f8ff",
                    borderRadius:8,border:"1px solid #d0dcf0"}}>
                    {p.number&&<span style={{background:"#003366",color:"white",
                      borderRadius:4,padding:"1px 6px",fontWeight:"bold",fontSize:11,
                      minWidth:22,textAlign:"center"}}>{p.number}</span>}
                    <span style={{fontFamily:"Georgia,serif",fontSize:13,flex:1}}>{p.name}</span>
                    {p.pos&&<span style={{color:"#003366",fontSize:11,fontWeight:"bold"}}>{p.pos}</span>}
                    <button onClick={()=>setSubs(s=>s.filter((_,j)=>j!==i))}
                      style={{background:"#ffeeee",border:"1px solid #ffcccc",color:"#cc0000",
                        borderRadius:5,padding:"3px 7px",cursor:"pointer",fontSize:12}}>
                      🗑
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB: CUERPO TÉCNICO ── */}
          {tab==="staff" && (
            <div>
              {/* Agregar miembro */}
              <div style={{background:"#f0fff0",borderRadius:12,padding:14,marginBottom:14,
                border:"1px solid #c8e6c9"}}>
                <div style={{fontFamily:"Georgia,serif",fontWeight:"bold",color:G.greenDark,
                  fontSize:13,marginBottom:10}}>➕ Agregar miembro</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 100px",gap:6,marginBottom:8}}>
                  <input placeholder="Nombre" value={newS.name}
                    onChange={e=>setNewS(v=>({...v,name:e.target.value}))}
                    style={{padding:"8px",border:"1px solid #ddd",borderRadius:7,
                      fontSize:14,fontFamily:"Georgia,serif"}}/>
                  <input placeholder="Cargo" value={newS.role}
                    onChange={e=>setNewS(v=>({...v,role:e.target.value}))}
                    style={{padding:"8px",border:"1px solid #ddd",borderRadius:7,
                      fontSize:14,fontFamily:"Georgia,serif"}}/>
                </div>
                <button onClick={()=>{
                  if(!newS.name.trim()) return;
                  setStaff(s=>[...s,{...newS}]);
                  setNewS({name:"",role:""});
                }} style={{width:"100%",padding:"9px",background:G.greenDark,color:"white",
                  border:"none",borderRadius:7,cursor:"pointer",fontFamily:"Georgia,serif",
                  fontSize:14,fontWeight:"bold"}}>
                  + Agregar
                </button>
              </div>

              {/* Staff list */}
              <div>
                <div style={{fontFamily:"Georgia,serif",fontWeight:"bold",color:G.greenDark,
                  fontSize:13,marginBottom:8}}>👔 Miembros ({staff.length})</div>
                {staff.length===0 && <p style={{color:"#bbb",fontSize:13}}>Sin miembros</p>}
                {staff.map((s,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,
                    padding:"8px 10px",marginBottom:6,background:"#f9f9f9",
                    borderRadius:8,border:"1px solid #eee"}}>
                    <div style={{flex:1}}>
                      <span style={{fontFamily:"Georgia,serif",fontSize:13,fontWeight:"bold"}}>
                        {s.name}
                      </span>
                      {s.role&&<span style={{color:"#888",fontSize:12,marginLeft:6}}>
                        — {s.role}
                      </span>}
                    </div>
                    <button onClick={()=>setStaff(st=>st.filter((_,j)=>j!==i))}
                      style={{background:"#ffeeee",border:"1px solid #ffcccc",color:"#cc0000",
                        borderRadius:5,padding:"3px 7px",cursor:"pointer",fontSize:12}}>
                      🗑
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB: EVENTOS ── */}
          {tab==="eventos" && (<div>
          {/* Score editor */}
          <div style={{background:"#f0fff0",borderRadius:12,padding:16,marginBottom:16,
            border:"1px solid #c8e6c9"}}>
            <div style={{fontFamily:"Georgia,serif",fontWeight:"bold",color:G.greenDark,
              fontSize:14,marginBottom:10}}>⚽ Resultado</div>
            <div style={{display:"flex",alignItems:"center",gap:12,justifyContent:"center"}}>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:11,color:"#666",marginBottom:4}}>Nacional</div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <button onClick={()=>setScore(s=>[Math.max(0,s[0]-1),s[1]])}
                    style={{width:32,height:32,background:"#880000",color:"white",border:"none",
                      borderRadius:8,cursor:"pointer",fontSize:18,fontWeight:"bold"}}>−</button>
                  <span style={{fontFamily:"Georgia,serif",fontWeight:"bold",fontSize:28,
                    minWidth:32,textAlign:"center"}}>{score[0]}</span>
                  <button onClick={()=>setScore(s=>[s[0]+1,s[1]])}
                    style={{width:32,height:32,background:G.greenDark,color:"white",border:"none",
                      borderRadius:8,cursor:"pointer",fontSize:18,fontWeight:"bold"}}>+</button>
                </div>
              </div>
              <span style={{fontFamily:"Georgia,serif",fontSize:24,color:"#888"}}>—</span>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:11,color:"#666",marginBottom:4}}>{match.matchData.rival}</div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <button onClick={()=>setScore(s=>[s[0],Math.max(0,s[1]-1)])}
                    style={{width:32,height:32,background:"#880000",color:"white",border:"none",
                      borderRadius:8,cursor:"pointer",fontSize:18,fontWeight:"bold"}}>−</button>
                  <span style={{fontFamily:"Georgia,serif",fontWeight:"bold",fontSize:28,
                    minWidth:32,textAlign:"center"}}>{score[1]}</span>
                  <button onClick={()=>setScore(s=>[s[0],s[1]+1])}
                    style={{width:32,height:32,background:"#880000",color:"white",border:"none",
                      borderRadius:8,cursor:"pointer",fontSize:18,fontWeight:"bold"}}>+</button>
                </div>
              </div>
            </div>
          </div>

          {/* Add event buttons */}
          <div style={{background:"#f8f8f8",borderRadius:12,padding:14,marginBottom:16,
            border:"1px solid #eee"}}>
            <div style={{fontFamily:"Georgia,serif",fontWeight:"bold",color:G.greenDark,
              fontSize:14,marginBottom:10}}>➕ Agregar evento</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
              {[
                {label:"Gol",emoji:"⚽",bg:"#004d00",action:()=>setModal("gp")},
                {label:"Amarilla",emoji:"🟨",bg:"#885500",action:()=>setModal("yp")},
                {label:"Roja",emoji:"🟥",bg:"#880000",action:()=>setModal("rp")},
                {label:"Cambio",emoji:"🔄",bg:"#003366",action:()=>setModal("so")},
              ].map((b,i)=>(
                <button key={i} onClick={b.action}
                  style={{padding:"10px 4px",background:b.bg,color:"white",border:"none",
                    borderRadius:9,cursor:"pointer",fontFamily:"Georgia,serif",fontSize:12,
                    fontWeight:"bold",display:"flex",flexDirection:"column",
                    alignItems:"center",gap:3}}>
                  <span style={{fontSize:20}}>{b.emoji}</span>
                  <span>{b.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Events list */}
          <div style={{marginBottom:16}}>
            <div style={{fontFamily:"Georgia,serif",fontWeight:"bold",color:G.greenDark,
              fontSize:14,marginBottom:8}}>📋 Eventos ({events.length}) — tocá 🗑 para eliminar</div>
            {events.length===0 && <p style={{color:"#bbb",fontSize:13}}>Sin eventos</p>}
            {events.map(ev=>(
              <div key={ev.id} style={{display:"flex",alignItems:"center",gap:8,
                padding:"8px 10px",marginBottom:6,background:"#f9f9f9",
                borderRadius:8,border:"1px solid #eee"}}>
                <span style={{fontSize:16}}>{icon(ev.type)}</span>
                <span style={{fontFamily:"'Courier New',monospace",fontWeight:"bold",
                  fontSize:12,color:G.greenDark,minWidth:32}}>{ev.minute}&apos;</span>
                <span style={{fontFamily:"Georgia,serif",fontSize:13,flex:1}}>{evLabel(ev)}</span>
                <button onClick={()=>removeEvent(ev.id)}
                  style={{background:"#ffeeee",border:"1px solid #ffcccc",color:"#cc0000",
                    borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:13}}>
                  🗑
                </button>
              </div>
            ))}
          </div>

          </div>)}

          {/* Save */}
          <button onClick={()=>onSave({
              ...match,
              score,
              events,
              matchData:{
                ...match.matchData,
                starters,
                subs,
                staff,
                players: [
                  ...starters.map(p=>({...p,type:"titular"})),
                  ...subs.map(p=>({...p,type:"suplente"})),
                ],
              }
            })}
            style={{width:"100%",padding:14,background:"linear-gradient(135deg,#004400,#008800)",
              color:"white",border:"none",borderRadius:10,cursor:"pointer",
              fontFamily:"Georgia,serif",fontWeight:"bold",fontSize:16}}>
            ✓ Guardar cambios
          </button>
        </div>
      </div>

      {/* Modals */}
      {modal==="gp" && <PlayerSelect players={allP} label="⚽ ¿Quién hizo el gol?" onSelect={onGP} onClose={()=>setModal(null)}
        extra={<button onClick={()=>onGP({name:`Gol ${match.matchData.rival}`,isOpponent:true})}
          style={{display:"block",width:"100%",padding:"11px 12px",marginBottom:7,background:"#880000",
            color:"white",border:"none",borderRadius:9,cursor:"pointer",fontFamily:"Georgia,serif",fontSize:14}}>
          ⚽ Gol del rival
        </button>}/>}
      {modal==="gz" && <ZonePicker onSelect={onGZ} onClose={()=>setModal(null)}/>}
      {modal==="ga" && <AssistSelect players={allP.filter(p=>p.name!==pending.player?.name)} onSelect={onGA} onClose={()=>setModal(null)}/>}
      {modal==="gm" && <MinuteInput autoMin={pending.minute||1} label="⚽ Minuto del gol" onConfirm={onGM} onClose={()=>setModal(null)}/>}
      {modal==="yp" && <PlayerSelect players={allP} label="🟨 Amarilla a..." onSelect={onYP} onClose={()=>setModal(null)}/>}
      {modal==="ym" && <MinuteInput autoMin={1} label="🟨 Minuto amarilla" onConfirm={onYM} onClose={()=>setModal(null)}/>}
      {modal==="rp" && <PlayerSelect players={allP} label="🟥 Roja a..." onSelect={onRP} onClose={()=>setModal(null)}/>}
      {modal==="rm" && <MinuteInput autoMin={1} label="🟥 Minuto roja" onConfirm={onRM} onClose={()=>setModal(null)}/>}
      {modal==="so" && <PlayerSelect players={allP.filter(p=>p.type==="titular")} label="🔄 ¿Quién sale?" onSelect={onSO} onClose={()=>setModal(null)}/>}
      {modal==="si" && <PlayerSelect players={allP.filter(p=>p.type==="suplente")} label="🔄 ¿Quién entra?" onSelect={onSI} onClose={()=>setModal(null)}/>}
    </div>
  );
}

// ── Persistence ─────────────────────────────────────────
const SK = "an_match_v5";
const loadH = () => { try { return JSON.parse(localStorage.getItem(SK)||"[]"); } catch { return []; } };
const saveH = r => { try { const h=loadH(); h.unshift({...r,id:Date.now()}); localStorage.setItem(SK,JSON.stringify(h.slice(0,20))); } catch {} };

// ── Accumulated stats engine ────────────────────────────
const RANGES = ["1-15","16-30","31-45","46-60","61-75","76-90","90+"];
function getRange(min) {
  if (min <= 15)  return "1-15";
  if (min <= 30)  return "16-30";
  if (min <= 45)  return "31-45";
  if (min <= 60)  return "46-60";
  if (min <= 75)  return "61-75";
  if (min <= 90)  return "76-90";
  return "90+";
}

function buildAccumStats(history) {
  const players = {};
  const matches = [];
  const goalRanges = {};
  RANGES.forEach(r => { goalRanges[r] = { an:0, rival:0 }; });

  const getP = (name, number="", pos="") => {
    if (!players[name]) players[name] = { name, number, pos, mins:0, goals:0, assists:0, yellows:0, reds:0, appearances:0 };
    if (number && !players[name].number) players[name].number = number;
    if (pos    && !players[name].pos)    players[name].pos    = pos;
    return players[name];
  };

  [...history].reverse().forEach(h => {
    const { matchData, score, events, t1Real=45, t2Real=45 } = h;
    if (!matchData) return;

    matchData.players?.forEach(p => getP(p.name, p.number, p.pos));

    matchData.players?.forEach(p => {
      const m = calcMins(p.name, p.type, events, t1Real, t2Real);
      if (m !== null && m > 0) {
        getP(p.name, p.number, p.pos).mins        += m;
        getP(p.name, p.number, p.pos).appearances += 1;
      }
    });

    events.filter(e=>e.type==="goal").forEach(e => {
      const r = getRange(e.minute||0);
      if (e.isOpponent) {
        goalRanges[r].rival++;
      } else {
        goalRanges[r].an++;
        if (e.player?.name) getP(e.player.name).goals++;
        if (e.assist?.name) getP(e.assist.name).assists++;
      }
    });

    events.filter(e=>e.type==="yellow").forEach(e => { if (e.player?.name) getP(e.player.name).yellows++; });
    events.filter(e=>e.type==="red"   ).forEach(e => { if (e.player?.name) getP(e.player.name).reds++;    });

    matches.push({
      rival: matchData.rival, date: matchData.date,
      tournament: matchData.tournament, jornada: matchData.jornada,
      scoreAN: score[0], scoreRv: score[1],
      result: score[0]>score[1]?"W": score[0]<score[1]?"L":"D",
    });
  });

  return { players: Object.values(players), matches, goalRanges };
}

// ── Accumulated PDF ─────────────────────────────────────
async function generateAccumPDF(history) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
  const PW=210, ML=11, MR=11, MT=10;
  const CW=PW-ML-MR, HALF=(CW-4)/2;

  const BG=[0,30,0], GREEN=[0,68,0], GBAR=[0,170,68], GLIGHT=[232,245,233];
  const BLUE=[0,52,102], YELLOW=[255,215,0], RED=[170,0,0];
  const GRAY=[136,136,136], WHITE=[255,255,255], BLACK=[26,26,26], BORDER=[221,221,221];
  const GOLD=[180,140,0], SILVER=[120,120,120], BRONZE=[140,80,40];

  const setFill=c=>doc.setFillColor(...c);
  const setStroke=c=>doc.setDrawColor(...c);
  const setTxt=c=>doc.setTextColor(...c);
  const setFont=(s,w="normal")=>{doc.setFontSize(s);doc.setFont("helvetica",w);};
  const rRect=(x,y,w,h,r,fill=true,stroke=false)=>doc.roundedRect(x,y,w,h,r,r,fill&&stroke?"FD":fill?"F":"S");
  const secHdr=(rx,ry,w,icon,title)=>{
    setFill(WHITE);setStroke(BORDER);rRect(rx,ry,w,7,2);
    setFont(9.5,"bold");setTxt(GREEN);doc.text(`${icon}  ${title}`,rx+4,ry+4.8);
    setStroke(GLIGHT);doc.setLineWidth(0.4);doc.line(rx+4,ry+7,rx+w-4,ry+7);
    return ry+8;
  };

  const anImg = await new Promise(res=>{
    const img=new Image(); img.crossOrigin="anonymous";
    img.onload=()=>{const c=document.createElement("canvas");c.width=img.width;c.height=img.height;c.getContext("2d").drawImage(img,0,0);res(c.toDataURL("image/png"));};
    img.onerror=()=>res(null); img.src=AN_SHIELD;
  });

  const { players, matches, goalRanges } = buildAccumStats(history);
  const totalMatches = matches.length;
  const W=matches.filter(m=>m.result==="W").length;
  const D=matches.filter(m=>m.result==="D").length;
  const L=matches.filter(m=>m.result==="L").length;
  const goalsF=matches.reduce((a,m)=>a+m.scoreAN,0);
  const goalsA=matches.reduce((a,m)=>a+m.scoreRv,0);

  let y = MT;

  // ── COVER ──────────────────────────────────────────────
  setFill(BG); rRect(ML,y,CW,36,4);
  if (anImg) doc.addImage(anImg,"PNG",ML+3,y+3,13,19);
  setFont(14,"bold"); setTxt([0,204,0]);
  doc.text("Atlético Nacional", PW/2, y+10, {align:"center"});
  setFont(10,"normal"); setTxt([180,255,180]);
  doc.text("Informe Acumulado de Temporada", PW/2, y+16, {align:"center"});
  // Record pill
  setFont(9,"bold"); setTxt(WHITE);
  doc.text(`${totalMatches} PJ  ·  ${W} G  ·  ${D} E  ·  ${L} P  ·  ${goalsF}:${goalsA}`, PW/2, y+24, {align:"center"});
  setFont(8,"normal"); setTxt([170,170,170]);
  const lastMatch = matches[matches.length-1];
  const firstMatch = matches[0];
  if (firstMatch && lastMatch)
    doc.text(`${firstMatch.date||""} al ${lastMatch.date||""}`, PW/2, y+31, {align:"center"});
  y += 40;

  // ── RESULTADOS (tabla compacta) ─────────────────────────
  let ry = secHdr(ML,y,CW,"RES","Resultados");
  setFill(WHITE); setStroke(BORDER); doc.rect(ML,y,CW,matches.length*7+10,"FD");
  // Header
  setFont(7.5,"bold"); setTxt(GRAY);
  doc.text("Rival",       ML+5,  ry+2);
  doc.text("Torneo",      ML+52, ry+2);
  doc.text("Fecha",       ML+100,ry+2);
  doc.text("Resultado",   ML+130,ry+2);
  ry += 5;
  matches.forEach((m,i)=>{
    const rowY=ry+i*7;
    if (i%2===0){ setFill([248,255,248]); doc.rect(ML+1,rowY-2,CW-2,6.5,"F"); }
    const resColor = m.result==="W"?GREEN: m.result==="L"?RED:GRAY;
    const resLabel = m.result==="W"?"Victoria": m.result==="L"?"Derrota":"Empate";
    setFont(8,"normal"); setTxt(BLACK);
    doc.text(m.rival||"",        ML+5,  rowY+2.5);
    doc.text(m.tournament||"",   ML+52, rowY+2.5);
    doc.text(m.date||"",         ML+100,rowY+2.5);
    setFont(8,"bold"); setTxt(resColor);
    doc.text(`${m.scoreAN}-${m.scoreRv} ${resLabel}`, ML+130, rowY+2.5);
    if (i<matches.length-1){ setStroke([238,238,238]); doc.setLineWidth(0.2); doc.line(ML+3,rowY+4.8,ML+CW-3,rowY+4.8); }
  });
  y += matches.length*7 + 14;

  // ── MINUTOS JUGADOS (bar chart) ─────────────────────────
  const sorted_mins = [...players].filter(p=>p.mins>0).sort((a,b)=>b.mins-a.mins);
  const maxMins = Math.max(...sorted_mins.map(p=>p.mins),1);
  const n = sorted_mins.length;
  const chartH=52, CHART_ML=16, chartW=CW-CHART_ML-2;
  const bw=chartW/n, iw=Math.min(bw*0.58,9);
  const pb=20, cih=chartH-pb-6;
  const chartLeft=ML+CHART_ML;

  let mh = secHdr(ML,y,CW,"MIN","Minutos Jugados Acumulados");
  setFill(WHITE); setStroke(BORDER); doc.rect(ML,y,CW,chartH+12,"FD");
  const cBaseY = mh+cih;
  [25,50,100,200,300,500,maxMins].forEach(val=>{
    if (val>maxMins+10||val<1) return;
    const lineY=cBaseY-(val/maxMins)*cih;
    setStroke([224,224,224]); doc.setLineWidth(0.25); doc.line(chartLeft,lineY,chartLeft+chartW-2,lineY);
    setFont(5.5,"normal"); setTxt(GRAY); doc.text(String(val),chartLeft-1,lineY+1,{align:"right"});
  });
  sorted_mins.forEach((p,i)=>{
    const xc=chartLeft+(i+0.5)*bw, xb=xc-iw/2;
    const bh=(p.mins/maxMins)*cih;
    setFill(GLIGHT); doc.rect(xb,cBaseY-cih,iw,cih,"F");
    setFill(GBAR);   doc.rect(xb,cBaseY-bh,iw,bh,"F");
    setFont(5.5,"bold"); setTxt(GREEN);
    doc.text(`${p.mins}'`,xc,cBaseY-bh-1.5,{align:"center"});
    const num=p.number||"";
    if(num){ setFill(GBAR); doc.roundedRect(xc-3.5,cBaseY+1.5,7,4.5,1,1,"F"); setFont(5.5,"bold"); setTxt(WHITE); doc.text(num,xc,cBaseY+4.8,{align:"center"}); }
    const parts=p.name.split(" ");
    const disp=parts.length>1?`${parts[0][0]}. ${parts[parts.length-1]}`:p.name;
    setFont(5.5,"bold"); setTxt(BLACK); doc.text(disp,xc,cBaseY+9,{align:"center"});
  });
  setStroke(GREEN); doc.setLineWidth(0.7);
  doc.line(chartLeft,cBaseY,chartLeft+chartW-2,cBaseY);
  doc.line(chartLeft,cBaseY-cih,chartLeft,cBaseY);
  y += chartH+16;

  // ── PODIOS (goles + asistencias + tarjetas) ─────────────
  const allGoals   = [...players].filter(p=>p.goals>0)  .sort((a,b)=>b.goals-a.goals);
  const allAssists = [...players].filter(p=>p.assists>0).sort((a,b)=>b.assists-a.assists);
  const allYellows = [...players].filter(p=>p.yellows>0).sort((a,b)=>b.yellows-a.yellows);
  const allReds    = [...players].filter(p=>p.reds>0)   .sort((a,b)=>b.reds-a.reds);

  const podiumColors = [[180,140,0],[120,120,120],[140,80,40],[100,100,100]];
  const podiumLabels = ["1°","2°","3°","4°","5°","6°","7°","8°","9°","10°"];

  const drawPodium = (sx,sy,sw,icon,title,data,valKey) => {
    const rows = Math.max(data.length,1);
    let py = secHdr(sx,sy,sw,icon,title);
    setFill(WHITE); setStroke(BORDER); doc.rect(sx,sy,sw,rows*9+10,"FD");
    if (data.length===0) { setFont(8,"normal"); setTxt(GRAY); doc.text("-",sx+6,py+5); return sy+rows*9+14; }
    data.forEach((p,i)=>{
      const ry2=py+i*9+1;
      const mc=podiumColors[i]||[100,100,100];
      setFill(mc); doc.roundedRect(sx+3,ry2-0.5,8,6,1,1,"F");
      setFont(6,"bold"); setTxt(WHITE); doc.text(podiumLabels[i]||`${i+1}°`,sx+7,ry2+3.5,{align:"center"});
      setFont(8.5,"normal"); setTxt(BLACK); doc.text(p.name, sx+13, ry2+3.5);
      setFont(8.5,"bold"); setTxt(GREEN); doc.text(`${p[valKey]}`, sx+sw-4, ry2+3.5, {align:"right"});
      if(i<data.length-1){ setStroke([238,238,238]); doc.setLineWidth(0.2); doc.line(sx+4,ry2+7,sx+sw-4,ry2+7); }
    });
    return sy + rows*9 + 14;
  };

  // ── Goal timing chart ──────────────────────────────────
  const rangeKeys = RANGES;
  const maxRangeVal = Math.max(...rangeKeys.map(r=>Math.max(goalRanges[r].an, goalRanges[r].rival)),1);
  const rcW = CW; const rcH = 38;
  const rcLeft = ML; const rcPb = 16; const rcPt = 6;
  const rcCH = rcH - rcPb - rcPt;
  const grpW = rcW / rangeKeys.length;
  const barW = grpW * 0.28;

  let rhy = secHdr(ML,y,CW,"GOLES x FRANJA","Distribucion de Goles por Franja de 15 min");
  setFill(WHITE); setStroke(BORDER); doc.rect(ML,y,CW,rcH+10,"FD");
  const rcBaseY = rhy + rcCH;

  // Legend
  setFill([0,170,68]); doc.rect(ML+CW-30,rhy+1,4,3,"F");
  setFont(6.5,"normal"); setTxt(BLACK); doc.text("Nacional",ML+CW-24,rhy+3.5);
  setFill([170,0,0]); doc.rect(ML+CW-13,rhy+1,4,3,"F");
  doc.text("Rival",ML+CW-7,rhy+3.5);

  rangeKeys.forEach((r,i)=>{
    const xCenter = rcLeft + (i+0.5)*grpW;
    const anH  = maxRangeVal>0 ? (goalRanges[r].an/maxRangeVal)*rcCH    : 0;
    const rvH  = maxRangeVal>0 ? (goalRanges[r].rival/maxRangeVal)*rcCH : 0;
    // Background
    setFill([240,248,240]); doc.rect(xCenter-barW-0.5,rcBaseY-rcCH,barW,rcCH,"F");
    setFill([248,240,240]); doc.rect(xCenter+0.5,rcBaseY-rcCH,barW,rcCH,"F");
    // AN bar (green, left)
    if(anH>0){ setFill([0,170,68]); doc.rect(xCenter-barW-0.5,rcBaseY-anH,barW,anH,"F"); }
    // Rival bar (red, right)
    if(rvH>0){ setFill([170,0,0]); doc.rect(xCenter+0.5,rcBaseY-rvH,barW,rvH,"F"); }
    // Values
    if(goalRanges[r].an>0){ setFont(6,"bold"); setTxt([0,100,0]); doc.text(String(goalRanges[r].an),xCenter-barW/2-0.5,rcBaseY-anH-1.5,{align:"center"}); }
    if(goalRanges[r].rival>0){ setFont(6,"bold"); setTxt([150,0,0]); doc.text(String(goalRanges[r].rival),xCenter+barW/2+0.5,rcBaseY-rvH-1.5,{align:"center"}); }
    // Range label
    setFont(6,"normal"); setTxt(GRAY); doc.text(r,xCenter,rcBaseY+4,{align:"center"});
  });
  setStroke([200,200,200]); doc.setLineWidth(0.5);
  doc.line(rcLeft+2,rcBaseY,rcLeft+CW-2,rcBaseY);
  y += rcH + 14;

  const maxPH = Math.max(allGoals.length, allAssists.length)*9+14;
  drawPodium(ML,    y, HALF, "GOL","Goleadores",    allGoals,   "goals");
  drawPodium(ML+HALF+4, y, HALF, "ASI","Asistencias",allAssists,"assists");
  y += maxPH + 2;

  const maxCH = Math.max(allYellows.length, allReds.length)*9+14;
  drawPodium(ML,        y, HALF, "AMA","Amarillas",  allYellows,"yellows");
  drawPodium(ML+HALF+4, y, HALF, "ROJ","Rojas",      allReds,   "reds");
  y += maxCH + 2;

  // ── TABLA COMPLETA JUGADORES ────────────────────────────
  const allSorted=[...players].filter(p=>p.appearances>0).sort((a,b)=>b.mins-a.mins);
  let ty = secHdr(ML,y,CW,"JUG","Estadísticas Individuales");
  setFill(WHITE); setStroke(BORDER); doc.rect(ML,y,CW,allSorted.length*8+16,"FD");
  // Table header
  setFont(7.5,"bold"); setTxt(GRAY);
  const cols=[
    {label:"Jugador", x:ML+5},  {label:"PJ",x:ML+72}, {label:"Min",x:ML+84},
    {label:"G",x:ML+96},  {label:"A",x:ML+106}, {label:"🟨",x:ML+116}, {label:"🟥",x:ML+126},
  ];
  cols.forEach(c=>doc.text(c.label,c.x,ty+2));
  setStroke(GLIGHT); doc.setLineWidth(0.5); doc.line(ML+3,ty+4,ML+CW-3,ty+4);
  ty += 6;
  allSorted.forEach((p,i)=>{
    const rowY=ty+i*8;
    if(i%2===0){ setFill([248,255,248]); doc.rect(ML+1,rowY-1.5,CW-2,7,"F"); }
    if(p.number){ setFill(GREEN); doc.roundedRect(ML+3,rowY-1,6,5.5,1,1,"F"); setFont(6.5,"bold"); setTxt(WHITE); doc.text(p.number,ML+6,rowY+2.8,{align:"center"}); }
    setFont(8.5,"normal"); setTxt(BLACK); doc.text(p.name,ML+11,rowY+2.8);
    setFont(8.5,"normal"); setTxt(GRAY);
    doc.text(String(p.appearances), ML+72, rowY+2.8);
    doc.text(String(p.mins)+"'",    ML+84, rowY+2.8);
    setFont(8.5,"bold");
    if(p.goals>0){   setTxt(GREEN);  doc.text(String(p.goals),   ML+96, rowY+2.8); } else { setTxt(GRAY); doc.text("—",ML+96,rowY+2.8); }
    if(p.assists>0){ setTxt(BLUE);   doc.text(String(p.assists), ML+106,rowY+2.8); } else { setTxt(GRAY); doc.text("—",ML+106,rowY+2.8); }
    if(p.yellows>0){ setTxt([150,100,0]); doc.text(String(p.yellows),ML+116,rowY+2.8); } else { setTxt(GRAY); doc.text("—",ML+116,rowY+2.8); }
    if(p.reds>0){    setTxt(RED);    doc.text(String(p.reds),    ML+126,rowY+2.8); } else { setTxt(GRAY); doc.text("—",ML+126,rowY+2.8); }
    if(i<allSorted.length-1){ setStroke([238,238,238]); doc.setLineWidth(0.2); doc.line(ML+3,rowY+5.5,ML+CW-3,rowY+5.5); }
  });
  y += allSorted.length*8+20;

  // ── FOOTER ──────────────────────────────────────────────
  setStroke(BORDER); doc.setLineWidth(0.4); doc.line(ML,y,ML+CW,y);
  setFont(8,"normal"); setTxt(GRAY);
  doc.text("PF Simon Duque Villegas - Atletico Nacional", PW/2, y+5, {align:"center"});

  // Multi-page support
  doc.save("Informe_Acumulado_AN.pdf");
}

// ── Accumulated Report Screen ───────────────────────────
function AccumReportScreen({ history, onBack }) {
  const [generating, setGenerating] = useState(false);
  const { players, matches, goalRanges } = buildAccumStats(history);

  const W=matches.filter(m=>m.result==="W").length;
  const D=matches.filter(m=>m.result==="D").length;
  const L=matches.filter(m=>m.result==="L").length;
  const goalsF=matches.reduce((a,m)=>a+m.scoreAN,0);
  const goalsA=matches.reduce((a,m)=>a+m.scoreRv,0);

  const sorted_mins   = [...players].filter(p=>p.mins>0)   .sort((a,b)=>b.mins-a.mins);
  const allGoals   = [...players].filter(p=>p.goals>0)  .sort((a,b)=>b.goals-a.goals);
  const allAssists = [...players].filter(p=>p.assists>0).sort((a,b)=>b.assists-a.assists);
  const allYellows = [...players].filter(p=>p.yellows>0).sort((a,b)=>b.yellows-a.yellows);
  const allReds    = [...players].filter(p=>p.reds>0)   .sort((a,b)=>b.reds-a.reds);
  const allSorted     = [...players].filter(p=>p.appearances>0).sort((a,b)=>b.mins-a.mins);
  const maxMins       = Math.max(...sorted_mins.map(p=>p.mins),1);

  const handlePDF = async () => {
    setGenerating(true);
    try { await generateAccumPDF(history); }
    catch(e) { console.error(e); alert("Error generando PDF."); }
    setGenerating(false);
  };

  const podiumColors = ["#B8860B","#787878","#8C5028","#667","#778","#889","#99a","#aab","#bbc","#ccd"];
  const podiumEmojis = ["🥇","🥈","🥉","4°","5°","6°","7°","8°","9°","10°"];

  const card = {background:"white",borderRadius:12,padding:16,marginBottom:12,boxShadow:"0 2px 8px rgba(0,0,0,0.07)"};
  const st   = {color:G.greenDark,fontFamily:"Georgia,serif",fontWeight:"bold",fontSize:15,marginBottom:10,borderBottom:"2px solid #e8f5e9",paddingBottom:7};

  const StatPill = ({label,val,color="#004400"}) => (
    <div style={{textAlign:"center",background:"rgba(0,68,0,0.08)",borderRadius:10,padding:"8px 16px"}}>
      <div style={{fontFamily:"Georgia,serif",fontWeight:"bold",fontSize:22,color}}>{val}</div>
      <div style={{fontSize:11,color:"#666",marginTop:2}}>{label}</div>
    </div>
  );

  const PodiumList = ({data,valKey,color}) => (
    <div>
      {data.length===0 && <p style={{color:"#bbb",fontSize:13,margin:0}}>—</p>}
      {data.map((p,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #f0f0f0"}}>
          <div style={{width:26,height:26,borderRadius:"50%",background:podiumColors[i],
            display:"flex",alignItems:"center",justifyContent:"center",
            flexShrink:0,fontSize:11,fontWeight:"bold",color:"white"}}>
            {podiumEmojis[i]}
          </div>
          <span style={{fontFamily:"Georgia,serif",fontSize:14,flex:1}}>{p.name}</span>
          <span style={{fontFamily:"Georgia,serif",fontWeight:"bold",fontSize:16,color}}>{p[valKey]}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"#eef2ee",paddingBottom:60}}>
      {/* Actions bar */}
      <div style={{position:"sticky",top:0,background:"#002200",padding:"11px 18px",zIndex:10,
        display:"flex",gap:9,justifyContent:"center",flexWrap:"wrap"}}>
        <button onClick={handlePDF} disabled={generating}
          style={{padding:"11px 22px",background:generating?"#888":G.greenBright,color:"#001a00",
            border:"none",borderRadius:20,cursor:generating?"wait":"pointer",
            fontFamily:"Georgia,serif",fontWeight:"bold",fontSize:14}}>
          {generating?"⏳ Generando...":"📄 Descargar PDF Acumulado"}
        </button>
        <button onClick={onBack}
          style={{padding:"11px 16px",background:"rgba(255,255,255,0.15)",color:"white",
            border:"none",borderRadius:20,cursor:"pointer",fontFamily:"Georgia,serif",fontSize:13}}>
          ← Volver
        </button>
      </div>

      <div style={{maxWidth:820,margin:"0 auto",padding:"20px 16px"}}>
        {/* Cover */}
        <div style={{background:"linear-gradient(135deg,#001e00,#005000)",borderRadius:16,
          padding:"24px 22px",marginBottom:14,color:"white",textAlign:"center",
          boxShadow:"0 8px 28px rgba(0,80,0,0.35)"}}>
          <img src={AN_SHIELD} style={{width:52,height:60,objectFit:"contain",marginBottom:10}} alt="AN"
            onError={e=>e.target.style.display="none"}/>
          <div style={{fontFamily:"Georgia,serif",fontWeight:"bold",fontSize:22,letterSpacing:2,marginBottom:4}}>
            ATLÉTICO NACIONAL
          </div>
          <div style={{fontSize:13,opacity:0.7,marginBottom:16}}>Informe Acumulado de Temporada</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,maxWidth:500,margin:"0 auto"}}>
            <StatPill label="Partidos" val={matches.length} color="#00CC44"/>
            <StatPill label="Victorias" val={W} color="#00CC44"/>
            <StatPill label="Empates" val={D} color="#FFB300"/>
            <StatPill label="Derrotas" val={L} color="#CC4444"/>
            <StatPill label="Goles" val={`${goalsF}:${goalsA}`} color="#00CC44"/>
          </div>
        </div>

        {/* Resultados */}
        <div style={card}>
          <div style={st}>📋 Resultados ({matches.length} partidos)</div>
          {matches.length===0 && <p style={{color:"#bbb",fontSize:13}}>Sin partidos</p>}
          {matches.map((m,i)=>{
            const resColor = m.result==="W"?"#004400": m.result==="L"?"#880000":"#885500";
            const resLabel = m.result==="W"?"Victoria": m.result==="L"?"Derrota":"Empate";
            return (
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",
                borderBottom:"1px solid #f0f0f0",background:i%2===0?"#f8fff8":"white",
                paddingLeft:6,paddingRight:6}}>
                <span style={{fontFamily:"Georgia,serif",fontSize:13,flex:1,fontWeight:"bold"}}>{m.rival}</span>
                <span style={{fontSize:11,color:"#888",minWidth:80}}>{m.tournament}</span>
                <span style={{fontSize:11,color:"#888",minWidth:70}}>{m.date}</span>
                <span style={{fontFamily:"'Courier New',monospace",fontWeight:"bold",fontSize:14,minWidth:30}}>
                  {m.scoreAN}–{m.scoreRv}
                </span>
                <span style={{background:resColor,color:"white",borderRadius:12,
                  padding:"2px 9px",fontSize:11,fontWeight:"bold",minWidth:60,textAlign:"center"}}>
                  {resLabel}
                </span>
              </div>
            );
          })}
        </div>

        {/* Minutos jugados — bar chart */}
        {sorted_mins.length>0&&(
          <div style={card}>
            <div style={st}>⏱ Minutos Jugados Acumulados</div>
            <div style={{display:"flex",gap:2,alignItems:"flex-end",height:120,
              padding:"0 4px 0 30px",position:"relative"}}>
              {[100,200,300,500].map(v=>v<=maxMins&&(
                <div key={v} style={{position:"absolute",left:0,bottom:20+((v/maxMins)*90),
                  color:"#aaa",fontSize:9,fontFamily:"'Courier New',monospace"}}>{v}</div>
              ))}
              {sorted_mins.map((p,i)=>{
                const barH=Math.max(4,(p.mins/maxMins)*90);
                return (
                  <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
                    <span style={{fontSize:8,fontFamily:"'Courier New',monospace",fontWeight:"bold",
                      color:G.greenDark,marginBottom:1}}>{p.mins}&apos;</span>
                    <div style={{width:"65%",background:"#e8f5e9",borderRadius:"3px 3px 0 0",
                      height:90,display:"flex",alignItems:"flex-end"}}>
                      <div style={{width:"100%",height:barH,background:"#00AA44",borderRadius:"3px 3px 0 0"}}/>
                    </div>
                    {p.number&&(
                      <div style={{background:G.greenDark,color:"white",borderRadius:3,
                        padding:"1px 4px",fontSize:8,fontWeight:"bold",marginTop:2}}>{p.number}</div>
                    )}
                    <div style={{fontSize:7.5,fontWeight:"bold",color:"#1a1a1a",
                      textAlign:"center",maxWidth:30,lineHeight:1.1,marginTop:1}}>
                      {p.name.split(" ").length>1
                        ? `${p.name.split(" ")[0][0]}. ${p.name.split(" ").slice(-1)[0]}`
                        : p.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Goles por franja — bar chart grouped */}
        <div style={card}>
          <div style={st}>🕐 Goles por Franja de 15 min</div>
          <div style={{display:"flex",alignItems:"flex-end",gap:0,height:100,paddingBottom:20,position:"relative"}}>
            {RANGES.map((r,i)=>{
              const an=goalRanges[r].an, rv=goalRanges[r].rival;
              const maxV=Math.max(...RANGES.map(rx=>Math.max(goalRanges[rx].an,goalRanges[rx].rival)),1);
              const anH=Math.max(0,(an/maxV)*70), rvH=Math.max(0,(rv/maxV)*70);
              return (
                <div key={r} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"flex-end",gap:2,height:80}}>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:12}}>
                      {an>0&&<span style={{fontSize:8,fontWeight:"bold",color:"#004400",marginBottom:1}}>{an}</span>}
                      <div style={{width:12,height:anH,background:"#00AA44",borderRadius:"2px 2px 0 0",minHeight:an>0?2:0}}/>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:12}}>
                      {rv>0&&<span style={{fontSize:8,fontWeight:"bold",color:"#880000",marginBottom:1}}>{rv}</span>}
                      <div style={{width:12,height:rvH,background:"#CC2200",borderRadius:"2px 2px 0 0",minHeight:rv>0?2:0}}/>
                    </div>
                  </div>
                  <div style={{width:"100%",borderTop:"1px solid #ccc"}}/>
                  <div style={{fontSize:9,color:"#666",marginTop:3,textAlign:"center",fontWeight:"bold"}}>{r}</div>
                </div>
              );
            })}
          </div>
          <div style={{display:"flex",gap:14,justifyContent:"flex-end",marginTop:4}}>
            <span style={{fontSize:11,color:"#555"}}><span style={{color:"#00AA44",fontWeight:"bold"}}>■</span> Nacional</span>
            <span style={{fontSize:11,color:"#555"}}><span style={{color:"#CC2200",fontWeight:"bold"}}>■</span> Rival</span>
          </div>
        </div>

        {/* Podios */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <div style={card}>
            <div style={st}>⚽ Goleadores</div>
            <PodiumList data={allGoals} valKey="goals" color={G.greenDark}/>
          </div>
          <div style={card}>
            <div style={st}>🎯 Asistencias</div>
            <PodiumList data={allAssists} valKey="assists" color="#004488"/>
          </div>
          <div style={card}>
            <div style={st}>🟨 Amarillas</div>
            <PodiumList data={allYellows} valKey="yellows" color="#885500"/>
          </div>
          <div style={card}>
            <div style={st}>🟥 Rojas</div>
            <PodiumList data={allReds} valKey="reds" color="#880000"/>
          </div>
        </div>

        {/* Tabla individual */}
        <div style={card}>
          <div style={st}>👤 Estadísticas Individuales</div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"Georgia,serif",fontSize:13}}>
              <thead>
                <tr style={{background:"#f0fff0"}}>
                  {["#","Jugador","PJ","Min","Goles","Asist.","🟨","🟥"].map(h=>(
                    <th key={h} style={{padding:"6px 8px",textAlign:"left",color:G.greenDark,
                      fontSize:11,fontWeight:"bold",borderBottom:"2px solid #e8f5e9"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allSorted.map((p,i)=>(
                  <tr key={i} style={{background:i%2===0?"#f8fff8":"white"}}>
                    <td style={{padding:"5px 8px"}}>
                      {p.number&&<span style={{background:G.greenDark,color:"white",borderRadius:4,
                        padding:"1px 5px",fontWeight:"bold",fontSize:11}}>{p.number}</span>}
                    </td>
                    <td style={{padding:"5px 8px",fontWeight:"bold"}}>{p.name}</td>
                    <td style={{padding:"5px 8px"}}>
                      <span style={{background:"#e8f5e9",color:G.greenDark,borderRadius:6,
                        padding:"2px 7px",fontWeight:"bold",fontSize:12}}>{p.appearances}</span>
                    </td>
                    <td style={{padding:"5px 8px",fontFamily:"'Courier New',monospace",fontWeight:"bold",color:G.greenDark}}>{p.mins}&apos;</td>
                    <td style={{padding:"5px 8px",fontWeight:"bold",color:p.goals>0?G.greenDark:"#ccc",fontSize:14}}>{p.goals||"—"}</td>
                    <td style={{padding:"5px 8px",fontWeight:"bold",color:p.assists>0?"#004488":"#ccc",fontSize:14}}>{p.assists||"—"}</td>
                    <td style={{padding:"5px 8px",fontWeight:"bold",color:p.yellows>0?"#885500":"#ccc"}}>{p.yellows||"—"}</td>
                    <td style={{padding:"5px 8px",fontWeight:"bold",color:p.reds>0?"#880000":"#ccc"}}>{p.reds||"—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{textAlign:"center",padding:"16px 0",color:"#aaa",fontFamily:"Georgia,serif",fontSize:12}}>
          PF Simón Duque Villegas · Atlético Nacional
        </div>
      </div>
    </div>
  );
}

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
  const [editMatch, setEditMatch] = useState(null);

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
  if (screen==="live")   return <LiveScreen matchData={matchData} onEnd={handleEnd}/>;
  if (screen==="report") return (
    <ReportScreen matchData={matchData} score={score} events={events} t1Real={t1Real} t2Real={t2Real}
      onBack={()=>setScreen("live")} onNewMatch={()=>{ setMatchData(null); setScreen("setup"); }}/>
  );
  if (screen==="accum")  return <AccumReportScreen history={history} onBack={()=>setScreen("setup")}/>;

  return (
    <>
      <SetupScreen onStart={handleStart}/>
      {/* Informe acumulado */}
      <button onClick={()=>setScreen("accum")}
        style={{position:"fixed",bottom:22,left:22,padding:"11px 18px",
          background:"linear-gradient(135deg,#004400,#008800)",color:"white",border:"none",borderRadius:22,
          cursor:"pointer",fontFamily:"Georgia,serif",fontSize:13,fontWeight:"bold",
          boxShadow:"0 4px 12px rgba(0,0,0,0.4)"}}>
        📊 Informe Acumulado
      </button>
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
          <div style={{background:"white",borderRadius:16,padding:24,maxWidth:500,
            width:"90%",maxHeight:"80vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.4)"}}>
            <h3 style={{margin:"0 0 14px",color:G.greenDark,fontFamily:"Georgia,serif",fontSize:19}}>📚 Partidos Guardados</h3>
            {history.length===0
              ? <p style={{color:"#aaa",fontSize:13}}>Sin partidos guardados</p>
              : history.map(h=>(
                <div key={h.id} style={{marginBottom:8,background:"#f5fff5",
                    borderRadius:9,border:"1px solid #ddd",overflow:"hidden"}}>
                  {/* Match info row */}
                  <div onClick={()=>{setHistDetail(h);setShowH(false);}}
                    style={{padding:"11px 13px",cursor:"pointer"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#e8ffe8"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <div style={{fontFamily:"Georgia,serif",fontWeight:"bold",fontSize:15,color:G.greenDark}}>
                      AN {h.score[0]} – {h.score[1]} {h.matchData?.rival}
                    </div>
                    <div style={{fontSize:12,color:"#888",marginTop:2}}>
                      {h.matchData?.tournament} · {h.matchData?.date}
                    </div>
                  </div>
                  {/* Action buttons */}
                  <div style={{display:"flex",borderTop:"1px solid #e8f5e9"}}>
                    <button onClick={()=>{setEditMatch(h);setShowH(false);}}
                      style={{flex:1,padding:"8px",background:"transparent",border:"none",
                        borderRight:"1px solid #e8f5e9",cursor:"pointer",
                        color:G.greenDark,fontFamily:"Georgia,serif",fontSize:13,fontWeight:"bold"}}>
                      ✏️ Editar
                    </button>
                    <button onClick={()=>{
                        if(window.confirm(`¿Eliminar partido AN vs ${h.matchData?.rival}? Esta acción no se puede deshacer.`)){
                          const updated = history.filter(m=>m.id!==h.id);
                          localStorage.setItem(SK, JSON.stringify(updated));
                          setHistory(updated);
                        }
                      }}
                      style={{flex:1,padding:"8px",background:"transparent",border:"none",
                        cursor:"pointer",color:"#880000",fontFamily:"Georgia,serif",
                        fontSize:13,fontWeight:"bold"}}>
                      🗑 Eliminar
                    </button>
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
      {/* Edit match modal */}
      {editMatch && (
        <EditMatchScreen
          match={editMatch}
          onSave={(updated)=>{
            const newHistory = history.map(m=>m.id===updated.id?updated:m);
            localStorage.setItem(SK, JSON.stringify(newHistory));
            setHistory(newHistory);
            setEditMatch(null);
          }}
          onClose={()=>setEditMatch(null)}
        />
      )}
    </>
  );
}
