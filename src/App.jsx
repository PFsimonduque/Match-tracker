import { useState, useEffect, useRef, useCallback } from "react";

const AN_SHIELD = "https://upload.wikimedia.org/wikipedia/en/thumb/6/sixty/Atletico_Nacional.svg/200px-Atletico_Nacional.svg.png";

const G = {
  green: "#006600", greenDark: "#004400", greenBright: "#00CC00",
  greenLight: "#e8f5e9", white: "#FFFFFF", red: "#CC0000",
  yellow: "#FFB300", blue: "#004488", orange: "#CC5500",
  bg: "#f0f4f0", cardBg: "#ffffff",
};

const POSITIONS = ["POR","DEF","LAT","MED","EXT","DEL"];

// ── Timer ──────────────────────────────────────────────
function useTimer() {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [half, setHalf] = useState(1);
  const ref = useRef(null);

  const start = useCallback(() => {
    if (!running) {
      setRunning(true);
      ref.current = setInterval(() => setSeconds(s => s + 1), 1000);
    }
  }, [running]);

  const pause = useCallback(() => {
    setRunning(false);
    clearInterval(ref.current);
  }, []);

  const secondHalf = useCallback(() => {
    setRunning(false);
    clearInterval(ref.current);
    setSeconds(0);
    setHalf(2);
  }, []);

  useEffect(() => () => clearInterval(ref.current), []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = `${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
  const matchMin = Math.max(1, mins + 1) + (half === 2 ? 45 : 0);
  return { running, display, matchMin, half, start, pause, secondHalf };
}

// ── Shared Modals ──────────────────────────────────────
function Overlay({ children, wide }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:200,
      display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:"#fff",borderRadius:20,padding:28,
        width:"100%",maxWidth:wide?600:440,maxHeight:"88vh",overflowY:"auto",
        boxShadow:"0 20px 60px rgba(0,0,0,0.4)"}}>
        {children}
      </div>
    </div>
  );
}

function PlayerSelect({ players, label, onSelect, onClose, extra }) {
  const [q, setQ] = useState("");
  const filtered = players.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <Overlay>
      <h3 style={{margin:"0 0 14px",color:G.greenDark,fontFamily:"Georgia,serif",
        textAlign:"center",fontSize:20}}>{label}</h3>
      <input placeholder="Buscar jugador..." value={q} onChange={e=>setQ(e.target.value)}
        style={{width:"100%",padding:"10px 14px",border:"2px solid #ddd",borderRadius:10,
          fontSize:16,fontFamily:"Georgia,serif",boxSizing:"border-box",marginBottom:12}}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
        {filtered.map((p,i) => (
          <button key={i} onClick={() => onSelect(p)}
            style={{padding:"12px 14px",background:G.greenDark,color:"white",border:"none",
              borderRadius:10,cursor:"pointer",fontFamily:"Georgia,serif",fontSize:15,textAlign:"left"}}>
            {p.number ? `#${p.number} ` : ""}{p.name}
          </button>
        ))}
      </div>
      {extra}
      <button onClick={onClose} style={{marginTop:6,width:"100%",padding:12,background:"#e0e0e0",
        border:"none",borderRadius:10,cursor:"pointer",fontWeight:"bold",fontSize:15}}>
        Cancelar
      </button>
    </Overlay>
  );
}

function MinuteInput({ onConfirm, onClose, autoMin, label }) {
  const [min, setMin] = useState(String(autoMin));
  return (
    <Overlay>
      <h3 style={{margin:"0 0 8px",color:G.greenDark,fontFamily:"Georgia,serif",
        textAlign:"center",fontSize:20}}>{label}</h3>
      <p style={{textAlign:"center",color:"#666",fontSize:14,margin:"0 0 14px"}}>
        Minuto del partido
      </p>
      <input type="number" value={min} onChange={e=>setMin(e.target.value)} min="1" max="120"
        style={{display:"block",width:"100%",fontSize:36,textAlign:"center",padding:12,
          border:"2px solid "+G.green,borderRadius:10,fontFamily:"'Courier New',monospace",
          fontWeight:"bold",boxSizing:"border-box"}}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:10,marginTop:16}}>
        <button onClick={onClose} style={{padding:14,background:"#e0e0e0",border:"none",
          borderRadius:10,cursor:"pointer",fontWeight:"bold",fontSize:15}}>Cancelar</button>
        <button onClick={()=>onConfirm(parseInt(min)||1)}
          style={{padding:14,background:G.green,color:"white",border:"none",
            borderRadius:10,cursor:"pointer",fontWeight:"bold",fontSize:17}}>✓ Confirmar</button>
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
      <h3 style={{margin:"0 0 14px",color:G.greenDark,fontFamily:"Georgia,serif",
        textAlign:"center",fontSize:20}}>⚽ ¿Desde qué zona?</h3>
      <div style={{position:"relative",width:"100%",paddingBottom:"60%",
        background:"#3a7d2c",borderRadius:12,overflow:"hidden",border:"3px solid white"}}>
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}} viewBox="0 0 300 180">
          <rect x="4" y="4" width="292" height="172" fill="none" stroke="white" strokeWidth="2"/>
          <line x1="150" y1="4" x2="150" y2="176" stroke="white" strokeWidth="1.5"/>
          <circle cx="150" cy="90" r="26" fill="none" stroke="white" strokeWidth="1.5"/>
          <rect x="4" y="55" width="44" height="70" fill="none" stroke="white" strokeWidth="1.5"/>
          <rect x="252" y="55" width="44" height="70" fill="none" stroke="white" strokeWidth="1.5"/>
          {zones.map(z=>(
            <g key={z.id} onClick={()=>onSelect(z.id,z.label)} style={{cursor:"pointer"}}>
              <rect x={z.x/100*292+4} y={z.y/100*172+4}
                width={z.w/100*292} height={z.h/100*172}
                fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.35)" strokeWidth="1"
                onMouseEnter={e=>e.target.setAttribute("fill","rgba(255,220,0,0.38)")}
                onMouseLeave={e=>e.target.setAttribute("fill","rgba(255,255,255,0.07)")}/>
              <text x={(z.x+z.w/2)/100*292+4} y={(z.y+z.h/2)/100*172+4}
                textAnchor="middle" dominantBaseline="middle"
                fill="white" fontSize="13" fontWeight="bold">{z.label}</text>
            </g>
          ))}
        </svg>
      </div>
      <button onClick={onClose} style={{marginTop:14,width:"100%",padding:12,
        background:"#e0e0e0",border:"none",borderRadius:10,cursor:"pointer",
        fontWeight:"bold",fontSize:15}}>Cancelar</button>
    </Overlay>
  );
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
  const [staff, setStaff] = useState([{name:"",role:""},{name:"",role:""},{name:"",role:""}]);

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

  const inp = {width:"100%",padding:"11px 14px",border:"2px solid #ddd",borderRadius:10,
    fontSize:16,fontFamily:"Georgia,serif",boxSizing:"border-box",marginBottom:6,
    transition:"border-color 0.2s"};
  const lbl = {display:"block",fontWeight:"bold",color:G.greenDark,
    marginBottom:5,fontFamily:"Georgia,serif",fontSize:14};
  const card = {background:G.cardBg,borderRadius:16,padding:24,marginBottom:16,
    boxShadow:"0 2px 12px rgba(0,80,0,0.1)"};

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#002500,#005500)",paddingBottom:50}}>
      {/* Header */}
      <div style={{background:"#001a00",padding:"20px 24px",
        boxShadow:"0 4px 24px rgba(0,0,0,0.5)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:18,
          maxWidth:900,margin:"0 auto"}}>
          <img src={AN_SHIELD} style={{width:64,height:74,objectFit:"contain"}} alt="AN"
            onError={e=>{e.target.style.display="none"}}/>
          <div>
            <div style={{color:G.greenBright,fontFamily:"Georgia,serif",fontSize:26,
              fontWeight:"bold",letterSpacing:3}}>ATLÉTICO NACIONAL</div>
            <div style={{color:"rgba(255,255,255,0.55)",fontSize:13,letterSpacing:4,marginTop:2}}>
              MATCH TRACKER — iPad
            </div>
          </div>
        </div>
      </div>

      <div style={{maxWidth:900,margin:"0 auto",padding:"22px 20px"}}>
        {/* Two-column layout for iPad */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
          {/* Left: Match info */}
          <div style={card}>
            <h2 style={{margin:"0 0 16px",color:G.greenDark,fontFamily:"Georgia,serif",fontSize:19}}>
              📋 Información del Partido
            </h2>
            <label style={lbl}>Rival *</label>
            <input style={inp} placeholder="Ej: Millonarios FC" value={rival} onChange={e=>setRival(e.target.value)}/>
            <label style={lbl}>Torneo</label>
            <input style={inp} placeholder="Ej: Torneo BetPlay BCA" value={tournament} onChange={e=>setTournament(e.target.value)}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div>
                <label style={lbl}>Fecha</label>
                <input type="date" style={inp} value={date} onChange={e=>setDate(e.target.value)}/>
              </div>
              <div>
                <label style={lbl}>Jornada</label>
                <input style={inp} placeholder="Fecha 10" value={jornada} onChange={e=>setJornada(e.target.value)}/>
              </div>
            </div>
            <label style={lbl}>Escudo del rival</label>
            <div style={{border:"2px dashed #bbb",borderRadius:10,padding:16,textAlign:"center",
              cursor:"pointer",position:"relative",background:"#fafafa",minHeight:70,
              display:"flex",alignItems:"center",justifyContent:"center"}}>
              {rivalLogo
                ? <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <img src={rivalLogo} style={{width:56,height:56,objectFit:"contain"}} alt="rival"/>
                    <span style={{color:G.greenDark,fontFamily:"Georgia,serif",fontSize:15}}>✓ Escudo cargado</span>
                  </div>
                : <span style={{color:"#aaa",fontFamily:"Georgia,serif",fontSize:15}}>📁 Cargar escudo del rival</span>
              }
              <input type="file" accept="image/*" onChange={handleLogo}
                style={{position:"absolute",inset:0,opacity:0,cursor:"pointer"}}/>
            </div>

            {/* Staff */}
            <h2 style={{margin:"18px 0 12px",color:G.greenDark,fontFamily:"Georgia,serif",fontSize:19}}>
              👔 Cuerpo Técnico
            </h2>
            {staff.map((s,i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 110px",gap:8,marginBottom:8}}>
                <input placeholder="Nombre" style={{...inp,marginBottom:0}}
                  value={s.name} onChange={e=>upd(staff,setStaff,i,"name",e.target.value)}/>
                <input placeholder="Cargo" style={{...inp,marginBottom:0}}
                  value={s.role} onChange={e=>upd(staff,setStaff,i,"role",e.target.value)}/>
              </div>
            ))}
            <button onClick={()=>setStaff([...staff,{name:"",role:""}])}
              style={{padding:"8px 14px",background:"transparent",border:"2px solid "+G.green,
                borderRadius:8,color:G.green,cursor:"pointer",fontFamily:"Georgia,serif",fontSize:14}}>
              + Agregar
            </button>
          </div>

          {/* Right: Players */}
          <div>
            <div style={card}>
              <h2 style={{margin:"0 0 12px",color:G.greenDark,fontFamily:"Georgia,serif",fontSize:19}}>
                🟢 Titulares
              </h2>
              {starters.map((p,i)=>(
                <div key={i} style={{display:"grid",gridTemplateColumns:"44px 1fr 70px",gap:6,marginBottom:6}}>
                  <input placeholder="#" style={{...inp,marginBottom:0,textAlign:"center",fontSize:14}}
                    value={p.number} onChange={e=>upd(starters,setStarters,i,"number",e.target.value)}/>
                  <input placeholder={`Jugador ${i+1}`} style={{...inp,marginBottom:0,fontSize:14}}
                    value={p.name} onChange={e=>upd(starters,setStarters,i,"name",e.target.value)}/>
                  <select style={{...inp,marginBottom:0,fontSize:14}} value={p.pos}
                    onChange={e=>upd(starters,setStarters,i,"pos",e.target.value)}>
                    <option value="">Pos</option>
                    {POSITIONS.map(pos=><option key={pos}>{pos}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div style={card}>
              <h2 style={{margin:"0 0 12px",color:G.greenDark,fontFamily:"Georgia,serif",fontSize:19}}>
                🔵 Suplentes
              </h2>
              {subs.map((p,i)=>(
                <div key={i} style={{display:"grid",gridTemplateColumns:"44px 1fr 70px",gap:6,marginBottom:6}}>
                  <input placeholder="#" style={{...inp,marginBottom:0,textAlign:"center",fontSize:14}}
                    value={p.number} onChange={e=>upd(subs,setSubs,i,"number",e.target.value)}/>
                  <input placeholder={`Suplente ${i+1}`} style={{...inp,marginBottom:0,fontSize:14}}
                    value={p.name} onChange={e=>upd(subs,setSubs,i,"name",e.target.value)}/>
                  <select style={{...inp,marginBottom:0,fontSize:14}} value={p.pos}
                    onChange={e=>upd(subs,setSubs,i,"pos",e.target.value)}>
                    <option value="">Pos</option>
                    {POSITIONS.map(pos=><option key={pos}>{pos}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button onClick={handleStart}
          style={{width:"100%",padding:20,background:"linear-gradient(135deg,#004400,#008800)",
            color:"white",border:"none",borderRadius:14,fontSize:22,fontWeight:"bold",
            cursor:"pointer",fontFamily:"Georgia,serif",
            boxShadow:"0 8px 24px rgba(0,100,0,0.4)",letterSpacing:2}}>
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

  const allP = matchData.players;

  const addEv = (type, data) => setEvents(prev=>[...prev,{id:Date.now(),type,...data}]);

  // Goal flow
  const onGP = p => { setPending({player:p}); setModal("gz"); };
  const onGZ = (id,label) => { setPending(v=>({...v,zone:id,zoneLabel:label})); setModal("gm"); };
  const onGM = min => {
    const opp = pending.player?.isOpponent;
    setScore(s => opp?[s[0],s[1]+1]:[s[0]+1,s[1]]);
    addEv("goal",{player:pending.player,zone:pending.zone,zoneLabel:pending.zoneLabel,minute:min,isOpponent:opp});
    setPending({}); setModal(null);
  };
  const onYP = p => { setPending({player:p}); setModal("ym"); };
  const onYM = min => { addEv("yellow",{player:pending.player,minute:min}); setPending({}); setModal(null); };
  const onRP = p => { setPending({player:p}); setModal("rm"); };
  const onRM = min => { addEv("red",{player:pending.player,minute:min}); setPending({}); setModal(null); };
  const onIP = p => { addEv("injury",{player:p,minute:timer.matchMin}); setModal(null); };
  const onSO = p => { setPending({out:p}); setModal("si"); };
  const onSI = p => { addEv("sub",{out:pending.out,in:p,minute:timer.matchMin}); setPending({}); setModal(null); };

  const icon = t => ({goal:"⚽",yellow:"🟨",red:"🟥",injury:"🚑",sub:"🔄"}[t]||"•");

  const ActionBtn = ({label, emoji, bg, action}) => (
    <button onClick={action}
      style={{padding:"18px 10px",background:bg,color:"white",border:"none",borderRadius:14,
        cursor:"pointer",fontFamily:"Georgia,serif",fontSize:14,fontWeight:"bold",
        display:"flex",flexDirection:"column",alignItems:"center",gap:6,
        minHeight:90,boxShadow:"0 4px 14px rgba(0,0,0,0.25)",
        transition:"transform 0.1s,box-shadow 0.1s",touchAction:"manipulation"}}>
      <span style={{fontSize:32}}>{emoji}</span>
      <span style={{fontSize:13,letterSpacing:0.5}}>{label}</span>
    </button>
  );

  return (
    <div style={{height:"100vh",background:"#001500",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      {/* Top bar */}
      <div style={{background:"#000e00",padding:"12px 20px",
        boxShadow:"0 4px 20px rgba(0,0,0,0.6)",flexShrink:0}}>
        <div style={{maxWidth:980,margin:"0 auto",display:"flex",alignItems:"center",
          justifyContent:"space-between",gap:16}}>

          {/* Team left */}
          <div style={{display:"flex",alignItems:"center",gap:10,flex:1}}>
            <img src={AN_SHIELD} style={{width:46,height:52,objectFit:"contain"}} alt="AN"
              onError={e=>{e.target.style.display="none"}}/>
            <div>
              <div style={{color:G.greenBright,fontFamily:"Georgia,serif",fontWeight:"bold",fontSize:15}}>
                Atlético Nacional
              </div>
              <div style={{color:"rgba(255,255,255,0.5)",fontSize:12}}>{matchData.tournament}</div>
            </div>
          </div>

          {/* Score + timer center */}
          <div style={{textAlign:"center",flex:"0 0 auto"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:16,
              background:"rgba(0,180,0,0.12)",borderRadius:14,padding:"8px 28px",
              border:"1px solid rgba(0,180,0,0.25)"}}>
              <span style={{color:"white",fontFamily:"Georgia,serif",fontSize:48,fontWeight:"bold",lineHeight:1}}>
                {score[0]}
              </span>
              <span style={{color:"#555",fontSize:28}}>–</span>
              <span style={{color:"white",fontFamily:"Georgia,serif",fontSize:48,fontWeight:"bold",lineHeight:1}}>
                {score[1]}
              </span>
            </div>
            <div style={{marginTop:4,display:"flex",alignItems:"center",
              justifyContent:"center",gap:12}}>
              <span style={{color:G.greenBright,fontFamily:"'Courier New',monospace",
                fontSize:24,fontWeight:"bold"}}>{timer.display}</span>
              <span style={{color:"rgba(255,255,255,0.4)",fontSize:12}}>
                {timer.half}° Tiempo
              </span>
            </div>
            {/* Timer buttons */}
            <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:8}}>
              {!timer.running
                ? <button onClick={timer.start}
                    style={{padding:"7px 18px",background:G.green,color:"white",border:"none",
                      borderRadius:20,cursor:"pointer",fontFamily:"Georgia,serif",
                      fontWeight:"bold",fontSize:13}}>▶ {timer.display==="00:00"?"Iniciar":"Reanudar"}</button>
                : <button onClick={timer.pause}
                    style={{padding:"7px 18px",background:"#AA5500",color:"white",border:"none",
                      borderRadius:20,cursor:"pointer",fontFamily:"Georgia,serif",
                      fontWeight:"bold",fontSize:13}}>⏸ Pausar</button>
              }
              {timer.half===1 &&
                <button onClick={timer.secondHalf}
                  style={{padding:"7px 16px",background:"#003366",color:"white",border:"none",
                    borderRadius:20,cursor:"pointer",fontFamily:"Georgia,serif",
                    fontWeight:"bold",fontSize:13}}>2° Tiempo</button>
              }
            </div>
          </div>

          {/* Team right */}
          <div style={{display:"flex",alignItems:"center",gap:10,flex:1,justifyContent:"flex-end"}}>
            <div style={{textAlign:"right"}}>
              <div style={{color:"rgba(255,255,255,0.85)",fontFamily:"Georgia,serif",
                fontWeight:"bold",fontSize:15}}>{matchData.rival}</div>
              <div style={{color:"rgba(255,255,255,0.4)",fontSize:12}}>{matchData.jornada}</div>
            </div>
            {matchData.rivalLogo
              ? <img src={matchData.rivalLogo} style={{width:46,height:52,objectFit:"contain"}} alt="rival"/>
              : <div style={{width:46,height:52,background:"rgba(255,255,255,0.06)",borderRadius:8}}/>
            }
          </div>
        </div>
      </div>

      {/* Main content: buttons left, log right */}
      <div style={{flex:1,overflow:"hidden",display:"flex",
        maxWidth:980,margin:"0 auto",width:"100%",padding:"16px 20px",gap:16,boxSizing:"border-box"}}>

        {/* Action buttons */}
        <div style={{flex:"0 0 auto",display:"flex",flexDirection:"column",gap:10,width:280}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,flex:1}}>
            <ActionBtn label="GOL" emoji="⚽" bg="#004d00" action={()=>setModal("gp")}/>
            <ActionBtn label="AMARILLA" emoji="🟨" bg="#995500" action={()=>setModal("yp")}/>
            <ActionBtn label="ROJA" emoji="🟥" bg="#880000" action={()=>setModal("rp")}/>
            <ActionBtn label="CAMBIO" emoji="🔄" bg="#003366" action={()=>setModal("so")}/>
            <ActionBtn label="LESIÓN" emoji="🚑" bg="#663300" action={()=>setModal("ip")}/>
            <button onClick={()=>onEnd(score,events)}
              style={{padding:"18px 10px",background:"#2a0044",color:"white",border:"none",
                borderRadius:14,cursor:"pointer",fontFamily:"Georgia,serif",fontSize:13,
                fontWeight:"bold",display:"flex",flexDirection:"column",alignItems:"center",
                gap:4,minHeight:90,boxShadow:"0 4px 14px rgba(0,0,0,0.25)"}}>
              <span style={{fontSize:28}}>📄</span>
              <span>FIN / INFORME</span>
            </button>
          </div>
        </div>

        {/* Events log */}
        <div style={{flex:1,background:"rgba(0,30,0,0.6)",borderRadius:16,padding:16,
          border:"1px solid rgba(0,120,0,0.3)",display:"flex",flexDirection:"column",
          overflow:"hidden"}}>
          <h3 style={{margin:"0 0 12px",color:G.greenBright,fontFamily:"Georgia,serif",
            fontSize:17,flexShrink:0}}>📋 Eventos del partido</h3>
          <div style={{flex:1,overflowY:"auto"}}>
            {events.length===0
              ? <div style={{color:"rgba(255,255,255,0.3)",textAlign:"center",
                  paddingTop:40,fontFamily:"Georgia,serif",fontSize:15}}>
                  Sin eventos aún
                </div>
              : [...events].reverse().map(ev=>(
                <div key={ev.id} style={{display:"flex",alignItems:"center",gap:12,
                  padding:"9px 0",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
                  <span style={{fontSize:20}}>{icon(ev.type)}</span>
                  <span style={{color:G.greenBright,fontFamily:"'Courier New',monospace",
                    fontWeight:"bold",minWidth:42,fontSize:14}}>{ev.minute}&apos;</span>
                  <span style={{color:"rgba(255,255,255,0.88)",
                    fontFamily:"Georgia,serif",fontSize:14,flex:1}}>
                    {ev.type==="goal" && (ev.isOpponent
                      ? `Gol de ${matchData.rival}`
                      : `${ev.player?.name||""}${ev.zoneLabel?" — "+ev.zoneLabel:""}`)}
                    {ev.type==="yellow" && `Amarilla: ${ev.player?.name||""}`}
                    {ev.type==="red" && `Roja: ${ev.player?.name||""}`}
                    {ev.type==="injury" && `Lesión: ${ev.player?.name||""}`}
                    {ev.type==="sub" && `${ev.out?.name||""} → ${ev.in?.name||""}`}
                  </span>
                  <span style={{color:"rgba(255,255,255,0.3)",fontSize:12}}>{ev.half}°T</span>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal==="gp" && <PlayerSelect players={allP} label="⚽ ¿Quién hizo el gol?" onSelect={onGP} onClose={()=>setModal(null)}
        extra={<button onClick={()=>onGP({name:`Gol ${matchData.rival}`,isOpponent:true})}
          style={{display:"block",width:"100%",padding:"12px 14px",marginBottom:8,background:"#880000",
            color:"white",border:"none",borderRadius:10,cursor:"pointer",fontFamily:"Georgia,serif",fontSize:15}}>
          ⚽ Gol del rival
        </button>}/>}
      {modal==="gz" && <ZonePicker onSelect={onGZ} onClose={()=>setModal(null)}/>}
      {modal==="gm" && <MinuteInput autoMin={timer.matchMin} label="⚽ Minuto del gol" onConfirm={onGM} onClose={()=>setModal(null)}/>}
      {modal==="yp" && <PlayerSelect players={allP} label="🟨 Amarilla a..." onSelect={onYP} onClose={()=>setModal(null)}/>}
      {modal==="ym" && <MinuteInput autoMin={timer.matchMin} label="🟨 Minuto amarilla" onConfirm={onYM} onClose={()=>setModal(null)}/>}
      {modal==="rp" && <PlayerSelect players={allP} label="🟥 Roja a..." onSelect={onRP} onClose={()=>setModal(null)}/>}
      {modal==="rm" && <MinuteInput autoMin={timer.matchMin} label="🟥 Minuto roja" onConfirm={onRM} onClose={()=>setModal(null)}/>}
      {modal==="ip" && <PlayerSelect players={allP} label="🚑 ¿Quién se lesionó?" onSelect={onIP} onClose={()=>setModal(null)}/>}
      {modal==="so" && <PlayerSelect players={matchData.starters} label="🔄 ¿Quién sale?" onSelect={onSO} onClose={()=>setModal(null)}/>}
      {modal==="si" && <PlayerSelect players={matchData.subs} label="🔄 ¿Quién entra?" onSelect={onSI} onClose={()=>setModal(null)}/>}
    </div>
  );
}

// ── Report Screen ───────────────────────────────────────
function ReportScreen({ matchData, score, events, onBack, onNewMatch }) {
  const goals    = events.filter(e=>e.type==="goal");
  const yellows  = events.filter(e=>e.type==="yellow");
  const reds     = events.filter(e=>e.type==="red");
  const injuries = events.filter(e=>e.type==="injury");
  const subs     = events.filter(e=>e.type==="sub");

  const fmtDate = d => {
    if (!d) return "";
    const [y,m,day] = d.split("-");
    const months=["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
    return `${parseInt(day)} de ${months[parseInt(m)-1]} de ${y}`;
  };

  const card = {background:"white",borderRadius:14,padding:20,marginBottom:14,
    boxShadow:"0 2px 10px rgba(0,0,0,0.07)"};
  const st = {color:G.greenDark,fontFamily:"Georgia,serif",fontWeight:"bold",fontSize:16,
    marginBottom:12,borderBottom:"2px solid #e8f5e9",paddingBottom:8};
  const minBadge = (min, bg="#004400") =>
    <span style={{background:bg,color:"white",borderRadius:20,padding:"2px 12px",
      fontFamily:"'Courier New',monospace",fontWeight:"bold",fontSize:13,
      flexShrink:0}}>{min}&apos;</span>;

  return (
    <div style={{minHeight:"100vh",background:"#eef2ee",paddingBottom:60}}>
      <style>{`@media print{#rpt-act{display:none!important}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}`}</style>

      {/* Actions */}
      <div id="rpt-act" style={{position:"sticky",top:0,background:"#002200",
        padding:"12px 20px",zIndex:10,display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
        <button onClick={()=>window.print()}
          style={{padding:"11px 22px",background:G.greenBright,color:"#001a00",border:"none",
            borderRadius:22,cursor:"pointer",fontFamily:"Georgia,serif",fontWeight:"bold",fontSize:15}}>
          🖨️ Guardar PDF
        </button>
        <button onClick={onBack}
          style={{padding:"11px 18px",background:"rgba(255,255,255,0.15)",color:"white",
            border:"none",borderRadius:22,cursor:"pointer",fontFamily:"Georgia,serif",fontSize:14}}>
          ← Volver al partido
        </button>
        <button onClick={onNewMatch}
          style={{padding:"11px 18px",background:"rgba(255,255,255,0.15)",color:"white",
            border:"none",borderRadius:22,cursor:"pointer",fontFamily:"Georgia,serif",fontSize:14}}>
          + Nuevo partido
        </button>
      </div>

      <div style={{maxWidth:800,margin:"0 auto",padding:"22px 20px"}}>
        {/* Cover */}
        <div style={{background:"linear-gradient(135deg,#001e00,#005000)",borderRadius:18,
          padding:"30px 28px",marginBottom:16,color:"white",textAlign:"center",
          boxShadow:"0 10px 36px rgba(0,80,0,0.35)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",
            gap:28,marginBottom:16,flexWrap:"wrap"}}>
            <div style={{textAlign:"center"}}>
              <img src={AN_SHIELD} style={{width:76,height:86,objectFit:"contain"}} alt="AN"
                onError={e=>{e.target.style.display="none"}}/>
              <div style={{fontSize:12,color:G.greenBright,fontWeight:"bold",marginTop:6}}>
                Atlético Nacional
              </div>
            </div>
            <div>
              <div style={{fontFamily:"Georgia,serif",fontWeight:"bold",fontSize:54,lineHeight:1}}>
                {score[0]}&nbsp;<span style={{fontSize:28,opacity:0.4}}>—</span>&nbsp;{score[1]}
              </div>
              <div style={{fontSize:13,opacity:0.6,marginTop:6}}>Resultado Final</div>
            </div>
            <div style={{textAlign:"center"}}>
              {matchData.rivalLogo
                ? <img src={matchData.rivalLogo} style={{width:76,height:86,objectFit:"contain"}} alt="rival"/>
                : <div style={{width:76,height:86,background:"rgba(255,255,255,0.06)",
                    borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:12,opacity:0.4}}>Rival</div>
              }
              <div style={{fontSize:12,color:G.greenBright,fontWeight:"bold",marginTop:6}}>
                {matchData.rival}
              </div>
            </div>
          </div>
          <div style={{borderTop:"1px solid rgba(255,255,255,0.15)",paddingTop:12,
            display:"flex",justifyContent:"center",gap:24,flexWrap:"wrap",fontSize:14}}>
            {matchData.tournament&&<span><b>Torneo:</b> {matchData.tournament}</span>}
            {matchData.jornada&&<span><b>Jornada:</b> {matchData.jornada}</span>}
            <span><b>Fecha:</b> {fmtDate(matchData.date)}</span>
          </div>
        </div>

        {/* Two-col layout on iPad */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
          {/* Goals */}
          <div style={card}>
            <div style={st}>⚽ Goles ({goals.length})</div>
            {goals.length===0
              ? <p style={{color:"#bbb",fontSize:14,margin:0}}>Sin goles</p>
              : goals.map((g,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,
                  padding:"8px 0",borderBottom:"1px solid #f0f0f0"}}>
                  {minBadge(g.minute, g.isOpponent?"#880000":G.greenDark)}
                  <span style={{fontFamily:"Georgia,serif",fontSize:14,flex:1}}>
                    {g.isOpponent
                      ? <b style={{color:"#880000"}}>{matchData.rival}</b>
                      : <><b>{g.player?.name}</b>
                          {g.zoneLabel&&<span style={{color:"#888",fontSize:12}}> — {g.zoneLabel}</span>}</>
                    }
                  </span>
                </div>
              ))
            }
          </div>

          {/* Cards + Injuries */}
          <div>
            {(yellows.length>0||reds.length>0) && (
              <div style={card}>
                <div style={st}>🟨🟥 Tarjetas</div>
                {yellows.map((y,i)=>(
                  <div key={i} style={{display:"flex",gap:10,alignItems:"center",
                    padding:"7px 0",borderBottom:"1px solid #f0f0f0"}}>
                    {minBadge(y.minute,"#AA7700")}
                    <span style={{fontFamily:"Georgia,serif",fontSize:14}}>🟨 {y.player?.name}</span>
                  </div>
                ))}
                {reds.map((r,i)=>(
                  <div key={i} style={{display:"flex",gap:10,alignItems:"center",
                    padding:"7px 0",borderBottom:"1px solid #f0f0f0"}}>
                    {minBadge(r.minute,"#880000")}
                    <span style={{fontFamily:"Georgia,serif",fontSize:14}}>🟥 {r.player?.name}</span>
                  </div>
                ))}
              </div>
            )}
            {subs.length>0 && (
              <div style={card}>
                <div style={st}>🔄 Cambios</div>
                {subs.map((s,i)=>(
                  <div key={i} style={{display:"flex",gap:10,alignItems:"center",
                    padding:"7px 0",borderBottom:"1px solid #f0f0f0"}}>
                    {minBadge(s.minute,"#003366")}
                    <span style={{fontFamily:"Georgia,serif",fontSize:14}}>
                      ⬇️ {s.out?.name} → ⬆️ {s.in?.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {injuries.length>0 && (
              <div style={card}>
                <div style={st}>🚑 Lesiones</div>
                {injuries.map((inj,i)=>(
                  <div key={i} style={{display:"flex",gap:10,alignItems:"center",
                    padding:"7px 0",borderBottom:"1px solid #f0f0f0"}}>
                    {minBadge(inj.minute,"#663300")}
                    <span style={{fontFamily:"Georgia,serif",fontSize:14}}>🚑 {inj.player?.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Lineup two-col */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
          {matchData.starters?.length>0 && (
            <div style={card}>
              <div style={st}>🟢 Alineación Titular</div>
              {matchData.starters.map((p,i)=>(
                <div key={i} style={{display:"flex",gap:8,alignItems:"center",
                  padding:"6px 8px",background:"#f6fff6",borderRadius:7,
                  border:"1px solid #d4ecd4",marginBottom:5}}>
                  {p.number&&<span style={{background:G.greenDark,color:"white",borderRadius:4,
                    padding:"1px 6px",fontWeight:"bold",fontSize:12,minWidth:24,textAlign:"center"}}>
                    {p.number}</span>}
                  <span style={{fontFamily:"Georgia,serif",fontSize:14,flex:1}}>{p.name}</span>
                  {p.pos&&<span style={{color:G.greenDark,fontSize:12,fontWeight:"bold"}}>{p.pos}</span>}
                </div>
              ))}
            </div>
          )}
          <div>
            {matchData.subs?.length>0 && (
              <div style={card}>
                <div style={st}>🔵 Suplentes</div>
                {matchData.subs.map((p,i)=>(
                  <div key={i} style={{display:"flex",gap:8,alignItems:"center",
                    padding:"6px 8px",background:"#f5f8ff",borderRadius:7,
                    border:"1px solid #d0dcf0",marginBottom:5}}>
                    {p.number&&<span style={{background:"#003366",color:"white",borderRadius:4,
                      padding:"1px 6px",fontWeight:"bold",fontSize:12,minWidth:24,textAlign:"center"}}>
                      {p.number}</span>}
                    <span style={{fontFamily:"Georgia,serif",fontSize:14,flex:1}}>{p.name}</span>
                    {p.pos&&<span style={{color:"#003366",fontSize:12,fontWeight:"bold"}}>{p.pos}</span>}
                  </div>
                ))}
              </div>
            )}
            {matchData.staff?.length>0 && (
              <div style={card}>
                <div style={st}>👔 Cuerpo Técnico</div>
                {matchData.staff.map((s,i)=>(
                  <div key={i} style={{display:"flex",gap:8,padding:"6px 0",borderBottom:"1px solid #f0f0f0"}}>
                    <span style={{fontFamily:"Georgia,serif",fontSize:14,fontWeight:"bold"}}>{s.name}</span>
                    {s.role&&<span style={{color:"#888",fontSize:13}}>— {s.role}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{textAlign:"center",padding:"18px 0",color:"#aaa",
          fontFamily:"Georgia,serif",fontSize:13}}>
          PF Simón Duque Villegas · Atlético Nacional
        </div>
      </div>
    </div>
  );
}

// ── Persistence ─────────────────────────────────────────
const SK = "an_match_v3";
const loadH = () => { try { return JSON.parse(localStorage.getItem(SK)||"[]"); } catch { return []; } };
const saveH = r => {
  try {
    const h = loadH(); h.unshift({...r,id:Date.now()});
    localStorage.setItem(SK,JSON.stringify(h.slice(0,20)));
  } catch {}
};

// ── Main App ─────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("setup");
  const [matchData, setMatchData] = useState(null);
  const [score, setScore] = useState([0,0]);
  const [events, setEvents] = useState([]);
  const [history, setHistory] = useState([]);
  const [showH, setShowH] = useState(false);
  const [histDetail, setHistDetail] = useState(null);

  useEffect(()=>setHistory(loadH()),[]);

  const handleStart = d => { setMatchData(d); setScore([0,0]); setEvents([]); setScreen("live"); };
  const handleEnd = (s,e) => {
    setScore(s); setEvents(e);
    if (matchData) { saveH({matchData,score:s,events:e}); setHistory(loadH()); }
    setScreen("report");
  };

  if (histDetail) return (
    <ReportScreen matchData={histDetail.matchData} score={histDetail.score} events={histDetail.events}
      onBack={()=>setHistDetail(null)} onNewMatch={()=>setHistDetail(null)}/>
  );
  if (screen==="live") return <LiveScreen matchData={matchData} onEnd={handleEnd}/>;
  if (screen==="report") return (
    <ReportScreen matchData={matchData} score={score} events={events}
      onBack={()=>setScreen("live")} onNewMatch={()=>{setMatchData(null);setScreen("setup");}}/>
  );

  return (
    <>
      <SetupScreen onStart={handleStart}/>
      <button onClick={()=>setShowH(true)}
        style={{position:"fixed",bottom:24,right:24,padding:"12px 20px",
          background:"rgba(0,70,0,0.92)",color:"white",border:"none",borderRadius:24,
          cursor:"pointer",fontFamily:"Georgia,serif",fontSize:14,
          boxShadow:"0 4px 14px rgba(0,0,0,0.4)"}}>
        📚 Historial
      </button>
      {showH && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:300,
          display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{background:"white",borderRadius:18,padding:26,maxWidth:480,
            width:"90%",maxHeight:"80vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.4)"}}>
            <h3 style={{margin:"0 0 16px",color:G.greenDark,fontFamily:"Georgia,serif",fontSize:20}}>
              📚 Partidos Guardados
            </h3>
            {history.length===0
              ? <p style={{color:"#aaa",fontSize:14}}>Sin partidos guardados</p>
              : history.map(h=>(
                <div key={h.id} onClick={()=>{setHistDetail(h);setShowH(false);}}
                  style={{padding:"12px 14px",marginBottom:8,background:"#f5fff5",
                    borderRadius:10,border:"1px solid #ddd",cursor:"pointer",
                    transition:"background 0.15s"}}
                  onMouseEnter={e=>e.currentTarget.style.background="#e8ffe8"}
                  onMouseLeave={e=>e.currentTarget.style.background="#f5fff5"}>
                  <div style={{fontFamily:"Georgia,serif",fontWeight:"bold",
                    fontSize:16,color:G.greenDark}}>
                    AN {h.score[0]} – {h.score[1]} {h.matchData?.rival}
                  </div>
                  <div style={{fontSize:13,color:"#888",marginTop:3}}>
                    {h.matchData?.tournament} · {h.matchData?.date}
                  </div>
                </div>
              ))
            }
            <button onClick={()=>setShowH(false)}
              style={{marginTop:12,width:"100%",padding:12,background:"#e0e0e0",
                border:"none",borderRadius:10,cursor:"pointer",fontWeight:"bold",fontSize:15}}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
