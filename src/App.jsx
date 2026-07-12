async function generatePDF(matchData, score, events, t1Real, t2Real) {
  const { jsPDF } = window.jspdf;
  const PW = 210;
  const ML = 11, MR = 11, MT = 10, MB = 10;
  const CW = PW - ML - MR;
  const HALF = (CW - 4) / 2;

  // Colors
  const BG      = [0,30,0];
  const GREEN   = [0,68,0];
  const GBAR    = [0,170,68];
  const GLIGHT  = [232,245,233];
  const BLUE    = [0,52,102];
  const YELLOW  = [255,180,0];
  const RED     = [170,0,0];
  const GRAY    = [136,136,136];
  const WHITE   = [255,255,255];
  const BLACK   = [26,26,26];
  const BORDER  = [221,221,221];

  // ── 1) Pre-calcular datos (se necesitan ANTES de crear el PDF,
  //       para poder medir cuánta página hace falta) ─────────────
  const goals   = events.filter(e=>e.type==="goal");
  const yellows = events.filter(e=>e.type==="yellow");
  const reds    = events.filter(e=>e.type==="red");
  const subs    = events.filter(e=>e.type==="sub");

  const t1R = t1Real || 45;
  const t2R = t2Real || 45;
  const allWithMins = matchData.players.map(p=>({
    ...p, mins: calcMins(p.name, p.type, events, t1R, t2R)
  })).filter(p=>p.mins!==null).sort((a,b)=>b.mins-a.mins);
  const maxMins = Math.max(...allWithMins.map(p=>p.mins), 1);
  const nBars = Math.max(allWithMins.length, 1);

  // ── 2) Fórmulas de altura de cada sección (las mismas fórmulas se
  //       usan para medir la página Y para dibujar, así siempre coinciden) ──
  const COVER_H = 40;
  const goalsBoxH  = 8 + (goals.length>0 ? goals.length*12+3 : 9);
  const goalsGapH  = goalsBoxH + 4;

  const cardsSubsBoxH = Math.max(
    Math.max((yellows.length+reds.length)*9+12, 18),
    Math.max(subs.length*9+12, 18)
  );
  const cardsSubsGapH = cardsSubsBoxH + 4;

  const CHART_TOP_PAD = 8;            // aire entre el título del gráfico y la barra más alta
  const CHART_H = 58;                 // alto "físico" del gráfico (antes 50; +8 por el padding de arriba)
  const CHART_BOX_H = CHART_H + 12;   // caja completa del gráfico
  const chartGapH = CHART_H + 16;     // avance en Y tras el gráfico (deja 4mm libres)

  const lineupBoxH = Math.max(matchData.starters.length*8+14, matchData.subs.length*8+14);
  const lineupGapH = lineupBoxH + 4;

  const staffBoxH = matchData.staff.length*8 + 14;
  const staffGapH = staffBoxH + 5;

  const FOOTER_H = 12;

  const totalH = MT + COVER_H + 4 + goalsGapH + cardsSubsGapH + chartGapH
               + lineupGapH + staffGapH + FOOTER_H + MB;

  // ── 3) Crear el PDF con la ALTURA EXACTA que necesita el contenido
  //       (ya no es A4 fijo, así nunca se corta nada) ────────────
  const doc = new jsPDF({ orientation:"portrait", unit:"mm", format:[PW, totalH] });

  let y = MT;

  const setFill   = c => doc.setFillColor(...c);
  const setStroke = c => doc.setDrawColor(...c);
  const setTxt    = c => doc.setTextColor(...c);
  const setFont   = (s,w="normal") => { doc.setFontSize(s); doc.setFont("helvetica",w); };
  const rRect = (x,ry,w,h,r,fill=true,stroke=false) => doc.roundedRect(x,ry,w,h,r,r,fill&&stroke?"FD":fill?"F":"S");

  // Dibuja PRIMERO la caja de contenido y DESPUÉS la barra del título
  // encima, con un pequeño cuadro de color como "ícono" en vez de un
  // emoji (jsPDF con la fuente helvetica estándar no soporta emojis:
  // por eso salían símbolos raros tipo "Ø=ßâ" en los títulos).
  const section = (rx,ry,w,h,iconColor,title) => {
    setFill(WHITE); setStroke(BORDER); doc.setLineWidth(0.3);
    doc.rect(rx,ry,w,h,"FD");
    setFill(WHITE); setStroke(BORDER);
    rRect(rx,ry,w,7,2);
    setFill(iconColor);
    doc.roundedRect(rx+4, ry+2.3, 3, 3, 0.6, 0.6, "F");
    setFont(9.5,"bold"); setTxt(GREEN);
    doc.text(title, rx+9.5, ry+4.8);
    setStroke(GLIGHT); doc.setLineWidth(0.4);
    doc.line(rx+4,ry+7,rx+w-4,ry+7);
    return ry+8;
  };

  const minBadge = (x,by,min,bg) => {
    setFill(bg); doc.roundedRect(x,by-3.2,11,5,1.5,1.5,"F");
    setFont(7.5,"bold"); setTxt(WHITE);
    doc.text(`${min}'`, x+5.5, by+0.8, {align:"center"});
  };

  // ── 4) Cargador de imágenes robusto (arregla el escudo AN) ─────
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

  // ── COVER ─────────────────────────────────────────────
  setFill(BG);
  doc.roundedRect(ML, y, CW, COVER_H, 4, 4, "F");

  const colW    = CW/3;
  const leftCx  = ML + colW/2;
  const midCx   = ML + CW/2;
  const rightCx = ML + CW - colW/2;

  if (anImg) doc.addImage(anImg,"PNG", leftCx-7, y+4, 14, 18);
  setFont(8.5,"bold"); setTxt([0,204,0]);
  doc.text("Atlético Nacional", leftCx, y+26, {align:"center", maxWidth: colW-4});

  if (rvImg) doc.addImage(rvImg,"PNG", rightCx-7, y+4, 14, 14);
  setFont(8.5,"bold"); setTxt(WHITE);
  doc.text(matchData.rival || "Rival", rightCx, y+26, {align:"center", maxWidth: colW-4});

  setFont(26,"bold"); setTxt(WHITE);
  doc.text(`${score[0]}  -  ${score[1]}`, midCx, y+17, {align:"center"});
  setFont(7.5,"normal"); setTxt([170,170,170]);
  doc.text("Resultado Final", midCx, y+22, {align:"center"});

  setFont(7,"normal"); setTxt([180,255,180]);
  const meta = [
    matchData.tournament && `Torneo: ${matchData.tournament}`,
    matchData.jornada    && `Jornada: ${matchData.jornada}`,
    matchData.date       && `Fecha: ${matchData.date}`,
    (t1R && t2R)          && `Duración: ${t1R}' + ${t2R}' = ${t1R+t2R}'`,
  ].filter(Boolean).join("   |   ");
  doc.text(meta, midCx, y+34, {align:"center", maxWidth: CW-10});
  y += COVER_H + 4;

  // ── GOLES ─────────────────────────────────────────────
  let gy = section(ML, y, CW, goalsBoxH, GREEN, `Goles (${goals.length})`);

  if (goals.length===0) {
    setFont(8,"normal"); setTxt(GRAY);
    doc.text("Sin goles", ML+6, gy+5);
  } else {
    goals.forEach((g,i) => {
      const rowY = gy + i*12 + 2;
      minBadge(ML+4, rowY+3, g.minute, g.isOpponent ? RED : GREEN);
      setFont(9,"bold"); setTxt(BLACK);
      doc.text(g.isOpponent ? matchData.rival : (g.player?.name||""), ML+17, rowY+3.5);
      if (!g.isOpponent && g.zone) {
        setFont(8,"normal"); setTxt(GRAY);
        doc.text(`- ${g.zone}`, ML+17 + doc.getTextWidth((g.player?.name||"")+"  "), rowY+3.5);
      }
      setFont(7.5,"normal"); setTxt([50,68,85]);
      const at = g.assist ? `Asist: ${g.assist.name}` : "Sin asistencia";
      doc.text(at, ML+17, rowY+8);
      if (i < goals.length-1) { setStroke([238,238,238]); doc.setLineWidth(0.3); doc.line(ML+4, rowY+10.5, ML+CW-4, rowY+10.5); }
    });
  }
  y += goalsGapH;

  // ── TARJETAS + CAMBIOS (dos columnas) ─────────────────
  let cy = section(ML, y, HALF, cardsSubsBoxH, YELLOW, "Tarjetas");
  const cardRows = [...yellows.map(e=>({...e,card:"Y"})), ...reds.map(e=>({...e,card:"R"}))];
  if (cardRows.length===0) {
    setFont(8,"normal"); setTxt(GRAY); doc.text("Sin tarjetas", ML+6, cy+5);
  } else {
    cardRows.forEach((e,i) => {
      const ry2 = cy + i*9 + 2;
      const bg = e.card==="Y" ? YELLOW : RED;
      const fg = e.card==="Y" ? BLACK  : WHITE;
      setFill(bg); doc.roundedRect(ML+4, ry2-3, 11, 5, 1.5,1.5,"F");
      setFont(7.5,"bold"); setTxt(fg);
      doc.text(`${e.minute}'`, ML+9.5, ry2+0.8, {align:"center"});
      setFont(8.5,"normal"); setTxt(BLACK);
      doc.text(`${e.card==="Y"?"Amarilla":"Roja"}: ${e.player?.name||""}`, ML+17, ry2+0.8);
      if (i < cardRows.length-1) { setStroke([238,238,238]); doc.setLineWidth(0.3); doc.line(ML+4, ry2+4, ML+HALF-4, ry2+4); }
    });
  }

  const SX = ML+HALF+4;
  let sy = section(SX, y, HALF, cardsSubsBoxH, BLUE, "Cambios");
  if (subs.length===0) {
    setFont(8,"normal"); setTxt(GRAY); doc.text("Sin cambios", SX+6, sy+5);
  } else {
    subs.forEach((s,i) => {
      const ry2 = sy + i*9 + 2;
      setFill(BLUE); doc.roundedRect(SX+4, ry2-3, 11, 5, 1.5,1.5,"F");
      setFont(7.5,"bold"); setTxt(WHITE);
      doc.text(`${s.minute}'`, SX+9.5, ry2+0.8, {align:"center"});
      setFont(8.5,"normal"); setTxt(RED);
      doc.text(`Sale: ${s.out?.name||""}`, SX+17, ry2+0.8);
      const outW = doc.getTextWidth(`Sale: ${s.out?.name||""}`);
      setFont(8.5,"normal"); setTxt(GRAY);
      doc.text(" > ", SX+17+outW, ry2+0.8);
      const arrW = doc.getTextWidth(" > ");
      setFont(8.5,"normal"); setTxt(GREEN);
      doc.text(`Entra: ${s.in?.name||""}`, SX+17+outW+arrW, ry2+0.8);
      if (i < subs.length-1) { setStroke([238,238,238]); doc.setLineWidth(0.3); doc.line(SX+4, ry2+4, SX+HALF-4, ry2+4); }
    });
  }
  y += cardsSubsGapH;

  // ── MINUTOS JUGADOS ───────────────────────────────────
  const CHART_ML = 16;
  const chartW = CW - CHART_ML - 2;
  const bw = chartW / nBars;
  const iw = Math.min(bw*0.58, 9);
  const pb = 20;
  const chartInnerH = CHART_H - pb - 6 - CHART_TOP_PAD;

  let mh = section(ML, y, CW, CHART_BOX_H, GREEN, `Minutos Jugados (${t1R+t2R}' — ${t1R}' + ${t2R}')`);

  const chartBaseY = mh + CHART_TOP_PAD + chartInnerH;
  const chartLeft  = ML + CHART_ML;

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

    setFill(GLIGHT); doc.rect(xb, chartBaseY-chartInnerH, iw, chartInnerH, "F");
    setFill(bc); doc.rect(xb, chartBaseY-bh, iw, bh, "F");
    setFont(6,"bold"); setTxt(isTit ? GREEN : BLUE);
    doc.text(`${p.mins}'`, xc, chartBaseY-bh-1.5, {align:"center"});
    const num = p.number||"";
    if (num) {
      setFill(bc);
      doc.roundedRect(xc-3.5, chartBaseY+1.5, 7, 4.5, 1,1,"F");
      setFont(6,"bold"); setTxt(WHITE);
      doc.text(num, xc, chartBaseY+4.8, {align:"center"});
    }
    const parts = p.name.split(" ");
    const display = parts.length>1 ? `${parts[0][0]}. ${parts[parts.length-1]}` : p.name;
    setFont(5.8,"bold"); setTxt(BLACK);
    doc.text(display, xc, chartBaseY+9, {align:"center"});
  });

  setStroke(GREEN); doc.setLineWidth(0.7);
  doc.line(chartLeft, chartBaseY, chartLeft+chartW-2, chartBaseY);
  doc.line(chartLeft, chartBaseY-chartInnerH, chartLeft, chartBaseY);

  const legendY = chartBaseY + 20;
  setFill(GBAR); doc.rect(ML+CW-30, legendY-2, 3, 3, "F");
  setFont(6.5,"normal"); setTxt(BLACK); doc.text("Titular", ML+CW-26, legendY+0.5);
  setFill(BLUE); doc.rect(ML+CW-17, legendY-2, 3, 3, "F");
  doc.text("Suplente", ML+CW-13, legendY+0.5);

  y += chartGapH;

  // ── ALINEACIÓN + SUPLENTES ────────────────────────────
  const drawLineup = (players, sx, sw, numBg, title, iconColor) => {
    let ly = section(sx, y, sw, lineupBoxH, iconColor, title);
    if (players.length===0) { setFont(8,"normal"); setTxt(GRAY); doc.text("—", sx+6, ly+5); return; }
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

  drawLineup(matchData.starters, ML,       HALF, GREEN, "Titulares",  GREEN);
  drawLineup(matchData.subs,     ML+HALF+4, HALF, BLUE,  "Suplentes",  BLUE);
  y += lineupGapH;

  // ── CUERPO TÉCNICO ────────────────────────────────────
  let sty = section(ML, y, CW, staffBoxH, GREEN, "Cuerpo Técnico");
  if (matchData.staff.length===0) {
    setFont(8,"normal"); setTxt(GRAY); doc.text("—", ML+6, sty+5);
  } else {
    matchData.staff.forEach((s,i) => {
      const ry2 = sty + i*8 + 1;
      setFont(8.5,"bold"); setTxt(BLACK);
      doc.text(s.name, ML+5, ry2+2.5);
      setFont(8.5,"normal"); setTxt(GRAY);
      doc.text(`- ${s.role}`, ML+5+doc.getTextWidth(s.name)+3, ry2+2.5);
      if (i < matchData.staff.length-1) { setStroke([238,238,238]); doc.setLineWidth(0.3); doc.line(ML+4, ry2+5.5, ML+CW-4, ry2+5.5); }
    });
  }
  y += staffGapH;

  // ── FOOTER ────────────────────────────────────────────
  setStroke(BORDER); doc.setLineWidth(0.4);
  doc.line(ML, y, ML+CW, y);
  setFont(8,"normal"); setTxt(GRAY);
  doc.text("PF Simon Duque Villegas - Atletico Nacional", PW/2, y+5, {align:"center"});

  // Save
  const fname = `Informe_AN_vs_${matchData.rival.replace(/\s+/g,"_")}.pdf`;
  doc.save(fname);
}
