import { useState, useRef, useEffect } from "react";

// ─── GAME DATA ───────────────────────────────────────────────────────────────
const LEVELS = [
  {
    id: 1,
    name: "¡Carnaval de Rio!",
    theme: "festival",
    free: true,
    bg: "#FF6B35",
    bgGrad: "linear-gradient(135deg, #FF6B35 0%, #FFD23F 50%, #EE4266 100%)",
    description: "Encuentra a los personajes perdidos entre miles de festivaleros",
    targets: [
      { id: "chef", emoji: "👨‍🍳", name: "El Chef Perdido", hint: "Lleva un sombrero blanco alto", x: 18, y: 35 },
      { id: "alien", emoji: "👽", name: "El Alien Disfrazado", hint: "Verde y con antenas", x: 65, y: 55 },
      { id: "clown", emoji: "🤡", name: "Mimo Triste", hint: "Llora pero sonríe", x: 42, y: 72 },
      { id: "knight", emoji: "🧝", name: "El Elfo Perdido", hint: "Orejas puntiagudas", x: 80, y: 28 },
    ],
    characters: generateSceneCharacters(120, 1),
  },
  {
    id: 2,
    name: "Mercado Medieval",
    theme: "historico",
    free: true,
    bg: "#6B4226",
    bgGrad: "linear-gradient(135deg, #3D1C02 0%, #8B5E3C 50%, #C9A96E 100%)",
    description: "Busca en el bullicioso mercado de la Edad Media",
    targets: [
      { id: "wizard", emoji: "🧙", name: "El Mago Errante", hint: "Sombrero estrellado", x: 22, y: 45 },
      { id: "princess", emoji: "👸", name: "La Princesa Escapada", hint: "Corona de oro", x: 70, y: 30 },
      { id: "jester", emoji: "🃏", name: "El Bufón Real", hint: "Cascabeles en el sombrero", x: 48, y: 65 },
    ],
    characters: generateSceneCharacters(100, 2),
  },
  {
    id: 3,
    name: "Ciudad Espacial 2349",
    theme: "scifi",
    free: false,
    bg: "#0A0E27",
    bgGrad: "linear-gradient(135deg, #0A0E27 0%, #1A1B4B 50%, #0D324D 100%)",
    description: "Entre robots y naves, ¿puedes encontrar a los humanos?",
    targets: [
      { id: "astronaut", emoji: "👨‍🚀", name: "El Astronauta", hint: "Traje blanco espacial", x: 30, y: 40 },
      { id: "alien2", emoji: "👾", name: "El Invasor", hint: "Morado con ojos múltiples", x: 60, y: 60 },
      { id: "robot", emoji: "🤖", name: "El Robot Rebelde", hint: "Sin antenas", x: 75, y: 35 },
      { id: "hacker", emoji: "👩‍💻", name: "La Hacker", hint: "Lentes de neón", x: 20, y: 70 },
    ],
    characters: generateSceneCharacters(140, 3),
  },
  {
    id: 4,
    name: "Puerto Pirata del Caribe",
    theme: "historico",
    free: false,
    bg: "#0D4C6E",
    bgGrad: "linear-gradient(135deg, #0D4C6E 0%, #1A7A6E 40%, #C17A2B 100%)",
    description: "¡Ahoy! Encuentra a los tripulantes perdidos en el caos del puerto",
    targets: [
      { id: "pirate", emoji: "🏴‍☠️", name: "El Capitán", hint: "Parche en el ojo derecho", x: 25, y: 50 },
      { id: "mermaid", emoji: "🧜", name: "La Sirena", hint: "Cola azul brillante", x: 55, y: 75 },
      { id: "ghost", emoji: "👻", name: "El Marinero Fantasma", hint: "Transparente y asustado", x: 78, y: 42 },
    ],
    characters: generateSceneCharacters(110, 4),
  },
];

function generateSceneCharacters(count, seed) {
  const emojis = [
    "🧑","👩","👨","🧓","👦","👧","🧑‍🦱","👩‍🦰","👨‍🦳","🧑‍🦲",
    "👩‍🦱","👨‍🦰","🧑‍🦳","👩‍🦲","🧔","👲","🧕","👳","💂","🕵️",
    "👮","🧑‍⚕️","👩‍🌾","👨‍🍳","🧑‍🔧","👩‍🏭","👨‍💼","🧑‍🎨","👩‍🏫","👨‍🚒",
    "🧑‍✈️","👩‍🚀","🦸","🦹","🧟","🧛","🧜","🧚","🎅","🤶",
  ];
  const chars = [];
  let r = seed * 9301 + 49297;
  const next = () => { r = (r * 9301 + 49297) % 233280; return r / 233280; };
  for (let i = 0; i < count; i++) {
    chars.push({
      id: `bg_${i}`,
      emoji: emojis[Math.floor(next() * emojis.length)],
      x: next() * 94 + 1,
      y: next() * 88 + 4,
      scale: 0.7 + next() * 0.7,
      rotate: (next() - 0.5) * 30,
    });
  }
  return chars;
}

// ─── SCENE DECORATIONS ───────────────────────────────────────────────────────
const DECORATIONS = {
  festival: ["🎪","🎭","🥁","🎺","🎸","🌺","🎊","🎉","🏮","🎠","🎡","🎢","🍹","🌴"],
  historico: ["⚔️","🛡️","🏰","🗡️","🍖","🍺","🐎","🏹","🪄","📜","🔑","💰","🕯️","🐉"],
  scifi: ["🚀","🛸","⭐","🌙","🤖","💫","🔭","🛰️","⚡","🔬","💡","🌌","🪐","🧬"],
};

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function SuccessRing({ x, y }) {
  return (
    <div style={{
      position: "absolute",
      left: `${x}%`,
      top: `${y}%`,
      transform: "translate(-50%, -50%)",
      width: 60,
      height: 60,
      borderRadius: "50%",
      border: "4px solid #00FF88",
      boxShadow: "0 0 20px #00FF88, 0 0 40px #00FF88",
      animation: "pulse-ring 1s ease-out infinite",
      pointerEvents: "none",
      zIndex: 10,
    }} />
  );
}

function ClickFeedback({ x, y, hit }) {
  return (
    <div style={{
      position: "absolute",
      left: `${x}%`,
      top: `${y}%`,
      transform: "translate(-50%, -50%)",
      width: 50,
      height: 50,
      borderRadius: "50%",
      border: `3px solid ${hit ? "#00FF88" : "#FF4444"}`,
      animation: "click-fade 0.6s ease-out forwards",
      pointerEvents: "none",
      zIndex: 20,
    }} />
  );
}

function TargetCard({ target, found, onClick }) {
  return (
    <div onClick={() => !found && onClick(target)} style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 14px",
      borderRadius: 14,
      background: found ? "rgba(0,255,136,0.15)" : "rgba(255,255,255,0.08)",
      border: `2px solid ${found ? "#00FF88" : "rgba(255,255,255,0.2)"}`,
      cursor: found ? "default" : "pointer",
      transition: "all 0.3s",
      backdropFilter: "blur(10px)",
      transform: found ? "none" : "scale(1)",
    }}>
      <span style={{ fontSize: 28, filter: found ? "none" : "grayscale(80%)" }}>{target.emoji}</span>
      <div>
        <div style={{ color: found ? "#00FF88" : "white", fontWeight: 700, fontSize: 13, fontFamily: "Fredoka One, cursive" }}>{target.name}</div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>{found ? "✅ ¡Encontrado!" : `💡 ${target.hint}`}</div>
      </div>
    </div>
  );
}

function LevelCard({ level, onSelect, unlocked }) {
  return (
    <div onClick={() => unlocked && onSelect(level)} style={{
      borderRadius: 20,
      overflow: "hidden",
      background: level.bgGrad,
      border: "3px solid rgba(255,255,255,0.2)",
      cursor: unlocked ? "pointer" : "not-allowed",
      transition: "transform 0.2s, box-shadow 0.2s",
      position: "relative",
      minHeight: 160,
    }}
    onMouseEnter={e => { if(unlocked) e.currentTarget.style.transform = "scale(1.03)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      {!unlocked && (
        <div style={{
          position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          zIndex: 5, backdropFilter: "blur(4px)",
        }}>
          <span style={{ fontSize: 40 }}>🔒</span>
          <div style={{ color: "#FFD700", fontFamily: "Fredoka One, cursive", fontSize: 14, marginTop: 6 }}>Desbloquear — $1.99</div>
        </div>
      )}
      <div style={{ padding: "20px 18px" }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontFamily: "Fredoka One, cursive", marginBottom: 4 }}>
          {level.free ? "🆓 GRATIS" : "⭐ PREMIUM"}
        </div>
        <div style={{ fontSize: 22, fontWeight: 900, color: "white", fontFamily: "Fredoka One, cursive", lineHeight: 1.2, marginBottom: 8 }}>
          {level.name}
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>{level.description}</div>
        <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {(level.targets || []).map(t => (
            <span key={t.id} style={{ fontSize: 20 }}>{t.emoji}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN GAME COMPONENT ─────────────────────────────────────────────────────
export default function FindThemGame() {
  const [screen, setScreen] = useState("menu"); // menu | game | win
  const [currentLevel, setCurrentLevel] = useState(null);
  const [found, setFound] = useState([]);
  const [clicks, setClicks] = useState([]);
  const [time, setTime] = useState(0);
  const [activeHint, setActiveHint] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const sceneRef = useRef(null);
  const timerRef = useRef(null);
  const [unlockedPremium, setUnlockedPremium] = useState(false);

  useEffect(() => {
    if (screen === "game") {
      timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [screen]);

  useEffect(() => {
    if (currentLevel && found.length === currentLevel.targets.length && found.length > 0) {
      clearInterval(timerRef.current);
      setTimeout(() => setScreen("win"), 600);
    }
  }, [found, currentLevel]);

  const startLevel = (level) => {
    setCurrentLevel(level);
    setFound([]);
    setClicks([]);
    setTime(0);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setActiveHint(null);
    setScreen("game");
  };

  const handleSceneClick = (e) => {
    if (isDragging) return;
    const rect = sceneRef.current.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * 100;
    const rawY = ((e.clientY - rect.top) / rect.height) * 100;

    // Adjust for zoom and pan
    const adjustedX = (rawX - 50) / zoom + 50 - pan.x / zoom;
    const adjustedY = (rawY - 50) / zoom + 50 - pan.y / zoom;

    let hit = false;
    for (const target of currentLevel.targets) {
      if (found.includes(target.id)) continue;
      const dist = Math.sqrt(Math.pow(adjustedX - target.x, 2) + Math.pow(adjustedY - target.y, 2));
      if (dist < 5) {
        setFound(f => [...f, target.id]);
        hit = true;
        break;
      }
    }
    const clickId = Date.now();
    setClicks(c => [...c, { id: clickId, x: rawX, y: rawY, hit }]);
    setTimeout(() => setClicks(c => c.filter(cl => cl.id !== clickId)), 700);
  };

  const handleMouseDown = (e) => {
    setIsDragging(false);
    setDragStart({ x: e.clientX, y: e.clientY });
    setPanStart({ ...pan });
  };

  const handleMouseMove = (e) => {
    if (!e.buttons) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      setIsDragging(true);
      setPan({ x: panStart.x + dx * 0.1, y: panStart.y + dy * 0.1 });
    }
  };

  const formatTime = (s) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const decs = DECORATIONS[currentLevel?.theme] || DECORATIONS.festival;

  // ── MENU ──
  if (screen === "menu") return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1A0533 0%, #2D1B69 50%, #11103A 100%)",
      fontFamily: "system-ui, sans-serif",
      padding: "0 0 40px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;900&display=swap');
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes pulse-ring { 0%{transform:translate(-50%,-50%) scale(1);opacity:1} 100%{transform:translate(-50%,-50%) scale(2);opacity:0} }
        @keyframes click-fade { 0%{transform:translate(-50%,-50%) scale(0.5);opacity:1} 100%{transform:translate(-50%,-50%) scale(2);opacity:0} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes bounce-in { 0%{transform:scale(0) rotate(-10deg);opacity:0} 60%{transform:scale(1.15) rotate(3deg)} 100%{transform:scale(1) rotate(0);opacity:1} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", padding: "40px 20px 20px" }}>
        <div style={{ fontSize: 60, animation: "float 3s ease-in-out infinite" }}>🔍</div>
        <h1 style={{
          fontFamily: "Fredoka One, cursive",
          fontSize: "clamp(32px, 8vw, 56px)",
          color: "white",
          margin: "10px 0 4px",
          textShadow: "0 4px 20px rgba(255,100,200,0.5)",
          letterSpacing: 1,
        }}>¡ENCUÉNTRALOS!</h1>
        <p style={{ color: "rgba(255,255,255,0.6)", fontFamily: "Nunito, sans-serif", fontSize: 16 }}>
          Busca personajes ocultos en escenas llenas de caricaturas
        </p>
      </div>

      {/* Stats bar */}
      <div style={{
        display: "flex", justifyContent: "center", gap: 30,
        padding: "16px", margin: "0 20px 30px",
        background: "rgba(255,255,255,0.06)", borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.1)",
        maxWidth: 500, marginLeft: "auto", marginRight: "auto",
      }}>
        {[["🎮","4 Niveles"],["🆓","2 Gratis"],["⭐","2 Premium"]].map(([e,t]) => (
          <div key={t} style={{ textAlign:"center" }}>
            <div style={{ fontSize: 24 }}>{e}</div>
            <div style={{ color: "white", fontFamily: "Fredoka One, cursive", fontSize: 13 }}>{t}</div>
          </div>
        ))}
      </div>

      {/* Level Grid */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 20px", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
        {LEVELS.map(level => (
          <LevelCard
            key={level.id}
            level={level}
            unlocked={level.free || unlockedPremium}
            onSelect={startLevel}
          />
        ))}
      </div>

      {/* Unlock all button */}
      {!unlockedPremium && (
        <div style={{ textAlign: "center", marginTop: 30 }}>
          <button onClick={() => setUnlockedPremium(true)} style={{
            background: "linear-gradient(135deg, #FFD700, #FF8C00)",
            border: "none", borderRadius: 50, padding: "14px 36px",
            fontFamily: "Fredoka One, cursive", fontSize: 18, color: "#1A0533",
            cursor: "pointer", boxShadow: "0 8px 30px rgba(255,200,0,0.4)",
            transition: "transform 0.2s",
          }}
          onMouseEnter={e => e.target.style.transform="scale(1.05)"}
          onMouseLeave={e => e.target.style.transform="scale(1)"}
          >
            🔓 Desbloquear Todo — $2.99
          </button>
        </div>
      )}
    </div>
  );

  // ── WIN SCREEN ──
  if (screen === "win") return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0A2E0A, #1A5C1A, #0A2E0A)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "Fredoka One, cursive",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap');
        @keyframes bounce-in { 0%{transform:scale(0);opacity:0} 60%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        * { box-sizing:border-box; }
      `}</style>
      <div style={{ animation: "bounce-in 0.6s ease-out forwards", textAlign: "center", padding: 30 }}>
        <div style={{ fontSize: 80, animation: "float 2s ease-in-out infinite" }}>🏆</div>
        <h1 style={{ color: "#00FF88", fontSize: 48, margin: "16px 0 8px", textShadow: "0 0 30px #00FF88" }}>
          ¡Nivel Completado!
        </h1>
        <p style={{ color: "white", fontSize: 20 }}>{currentLevel?.name}</p>
        <div style={{ display: "flex", gap: 30, justifyContent: "center", margin: "24px 0" }}>
          {[["⏱️", formatTime(time), "Tiempo"],["✅", currentLevel?.targets.length, "Encontrados"]].map(([e,v,l]) => (
            <div key={l} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 16, padding: "16px 24px" }}>
              <div style={{ fontSize: 32 }}>{e}</div>
              <div style={{ color: "#FFD700", fontSize: 28 }}>{v}</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => startLevel(currentLevel)} style={{
            background: "#00FF88", border: "none", borderRadius: 50,
            padding: "12px 28px", fontSize: 16, fontFamily: "Fredoka One, cursive",
            color: "#0A2E0A", cursor: "pointer",
          }}>🔄 Reintentar</button>
          <button onClick={() => setScreen("menu")} style={{
            background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.3)",
            borderRadius: 50, padding: "12px 28px", fontSize: 16, fontFamily: "Fredoka One, cursive",
            color: "white", cursor: "pointer",
          }}>🏠 Menú</button>
        </div>
      </div>
    </div>
  );

  // ── GAME SCREEN ──
  const remaining = currentLevel.targets.filter(t => !found.includes(t.id));

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#0A0A1A", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@700&display=swap');
        @keyframes pulse-ring { 0%{transform:translate(-50%,-50%) scale(1);opacity:1} 100%{transform:translate(-50%,-50%) scale(2.5);opacity:0} }
        @keyframes click-fade { 0%{opacity:1;transform:translate(-50%,-50%) scale(0.8)} 100%{opacity:0;transform:translate(-50%,-50%) scale(2)} }
        @keyframes found-pop { 0%{transform:scale(0);opacity:0} 60%{transform:scale(1.3)} 100%{transform:scale(1);opacity:1} }
        * { box-sizing:border-box; user-select:none; }
      `}</style>

      {/* Top HUD */}
      <div style={{
        background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)",
        padding: "10px 16px", display: "flex", alignItems: "center",
        justifyContent: "space-between", borderBottom: "2px solid rgba(255,255,255,0.1)",
        flexShrink: 0, gap: 10,
      }}>
        <button onClick={() => setScreen("menu")} style={{
          background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 10,
          color: "white", padding: "6px 12px", cursor: "pointer", fontSize: 18,
        }}>←</button>
        <div style={{ textAlign: "center", flex: 1 }}>
          <div style={{ color: "white", fontFamily: "Fredoka One, cursive", fontSize: 16, lineHeight: 1 }}>{currentLevel.name}</div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>⏱ {formatTime(time)}</div>
        </div>
        <div style={{
          background: remaining.length === 0 ? "#00FF88" : "rgba(255,255,255,0.15)",
          borderRadius: 20, padding: "6px 14px",
          fontFamily: "Fredoka One, cursive", fontSize: 15,
          color: remaining.length === 0 ? "#0A2E0A" : "white",
        }}>
          {found.length}/{currentLevel.targets.length} ✓
        </div>
      </div>

      {/* Scene */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative", cursor: isDragging ? "grabbing" : "crosshair" }}
        ref={sceneRef}
        onClick={handleSceneClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        {/* Scene background */}
        <div style={{
          position: "absolute", inset: 0,
          background: currentLevel.bgGrad,
          transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
          transformOrigin: "center",
          transition: isDragging ? "none" : "transform 0.1s",
        }}>
          {/* Decorations background */}
          {Array.from({length:30}).map((_,i) => {
            const x = (i * 33.7) % 97;
            const y = (i * 51.3) % 93;
            return (
              <div key={i} style={{
                position:"absolute", left:`${x}%`, top:`${y}%`,
                fontSize: 22 + (i % 4) * 8, opacity: 0.15,
                pointerEvents:"none",
              }}>{decs[i % decs.length]}</div>
            );
          })}

          {/* Background crowd characters */}
          {currentLevel.characters.map(c => (
            <div key={c.id} style={{
              position: "absolute",
              left: `${c.x}%`,
              top: `${c.y}%`,
              fontSize: `${Math.floor(18 * c.scale)}px`,
              transform: `translate(-50%,-50%) rotate(${c.rotate}deg)`,
              pointerEvents: "none",
              lineHeight: 1,
            }}>{c.emoji}</div>
          ))}

          {/* Target characters */}
          {currentLevel.targets.map(target => (
            <div key={target.id} style={{
              position: "absolute",
              left: `${target.x}%`,
              top: `${target.y}%`,
              fontSize: 30,
              transform: "translate(-50%,-50%)",
              pointerEvents: "none",
              zIndex: 5,
              filter: found.includes(target.id) ? "none" : "none",
            }}>
              {target.emoji}
              {found.includes(target.id) && <SuccessRing x={50} y={50} />}
            </div>
          ))}

          {/* Click feedback */}
          {clicks.map(c => <ClickFeedback key={c.id} x={c.x} y={c.y} hit={c.hit} />)}
        </div>

        {/* Zoom controls */}
        <div style={{ position:"absolute", bottom:16, right:16, display:"flex", flexDirection:"column", gap:6, zIndex:20 }}>
          {[["+", () => setZoom(z => Math.min(z + 0.3, 3))],["−", () => setZoom(z => Math.max(z - 0.3, 1))],["⊙", () => { setZoom(1); setPan({x:0,y:0}); }]].map(([label, action]) => (
            <button key={label} onClick={e => { e.stopPropagation(); action(); }} style={{
              width: 44, height: 44, borderRadius: 12,
              background: "rgba(0,0,0,0.8)", border: "2px solid rgba(255,255,255,0.2)",
              color: "white", fontSize: 20, cursor: "pointer",
              fontFamily: "Fredoka One, cursive",
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Bottom targets panel */}
      <div style={{
        background: "rgba(0,0,0,0.9)", backdropFilter: "blur(10px)",
        borderTop: "2px solid rgba(255,255,255,0.1)",
        padding: "12px 14px", flexShrink: 0,
        maxHeight: "35vh", overflowY: "auto",
      }}>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontFamily:"Fredoka One,cursive", marginBottom: 8, textTransform:"uppercase", letterSpacing:1 }}>
          🎯 Busca estos personajes
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 8 }}>
          {currentLevel.targets.map(target => (
            <TargetCard
              key={target.id}
              target={target}
              found={found.includes(target.id)}
              onClick={t => setActiveHint(t.id === activeHint ? null : t.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
