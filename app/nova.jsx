"use client";
// ═══════════════════════════════════════════════════════════════════
// N.O.V.A — v3.0 HOLOGRAPHIC EDITION
// Particle orb · Audio-reactive · Tool router · Full capabilities
// ═══════════════════════════════════════════════════════════════════
import { useState, useRef, useEffect, useCallback } from "react";
import dynamic from 'next/dynamic';

const HolographicUI = dynamic(() => import('./components/HolographicUI'), { ssr: false });

// ── Brain configs ─────────────────────────────────────────────────
const BRAINS = {
  groq: {
    label:"Groq — Free", model:"llama-3.3-70b-versatile",
    url:"https://api.groq.com/openai/v1/chat/completions",
    key:"nova_groq", ph:"Free key at console.groq.com", fmt:"openai",
  },
  anthropic: {
    label:"Claude — Premium", model:"claude-sonnet-4-20250514",
    url:"https://api.anthropic.com/v1/messages",
    key:"nova_ak", ph:"sk-ant-api...", fmt:"anthropic",
  },
};

const VOICE_ID = "pNInz6obpgDQGcFmaJgB";
const SILENCE  = 5000;
const WAKE     = ["nova","hey nova","let's go live","lets go live","sequence initiated"];
const STOPS    = ["stop","quiet","pause","shut up","silence","cancel"];

const TOOLS = [
  {
    name: "generate_image",
    description: "Creates cinematic UI mockups or visuals",
    input_schema: {
      type: "object",
      properties: {
        prompt: { type: "string" },
        style: { type: "string" }
      },
      required: ["prompt"]
    }
  },
  {
    name: "generate_voice",
    description: "Text-to-speech generation",
    input_schema: {
      type: "object",
      properties: {
        text: { type: "string" },
        voice: { type: "string" }
      },
      required: ["text"]
    }
  },
  {
    name: "generate_3d_scene",
    description: "Creates Three.js / WebGL scene logic",
    input_schema: {
      type: "object",
      properties: {
        scene_description: { type: "string" },
        complexity: { type: "string" }
      },
      required: ["scene_description"]
    }
  },
  {
    name: "compute",
    description: "Handles calculations or logic",
    input_schema: {
      type: "object",
      properties: {
        expression: { type: "string" }
      },
      required: ["expression"]
    }
  },
  {
    name: "file_system_write",
    description: "Writes or updates project files",
    input_schema: {
      type: "object",
      properties: {
        path: { type: "string" },
        content: { type: "string" },
        action: { type: "string", enum: ["create", "update", "delete"] }
      },
      required: ["path", "content", "action"]
    }
  },
  {
    name: "project_analyze",
    description: "Analyzes current project structure and issues",
    input_schema: {
      type: "object",
      properties: {
        request: { type: "string" }
      }
    }
  },
  {
    name: "run_preview",
    description: "Simulates running the web project",
    input_schema: {
      type: "object",
      properties: {
        entry: { type: "string", default: "/index.html" }
      }
    }
  }
];

// ── NOVA GOD PROMPT ───────────────────────────────────────────────
const GOD_PROMPT = (mem) => `You are NOVA IDE, an autonomous AI software engineering environment.

You are not a chatbot.

You are an AI-powered IDE that:
- writes code
- edits files
- generates full projects
- refactors existing codebases
- builds web apps and 3D experiences
- maintains project structure consistency

---

# CORE BEHAVIOR

You operate like a senior software engineer inside an IDE.

Every request must be handled as a coding task inside a project workspace.

---

# WORKSPACE MODEL

You have access to a virtual project structure:

/project
  /index.html
  /style.css
  /script.js
  /components/
  /assets/
  /config.json

You MUST think in files, not responses.

---

# OUTPUT MODES

You must ALWAYS choose ONE mode:

1. CREATE_PROJECT
→ generate full project from scratch

2. EDIT_FILES
→ modify existing codebase

3. ADD_FEATURE
→ add new functionality without breaking structure

4. DEBUG
→ fix errors and explain minimal reasoning

5. REFACTOR
→ improve structure and performance

---

# OUTPUT FORMAT (STRICT)

Return ONLY JSON:

{
  "mode": "CREATE_PROJECT | EDIT_FILES | ADD_FEATURE | DEBUG | REFACTOR",

  "summary": "short explanation of what you did",

  "file_changes": [
    {
      "path": "/index.html",
      "action": "create | update | delete",
      "content": "FULL FILE CONTENT HERE"
    }
  ],

  "notes": "optional short technical notes"
}

---

# UI SYSTEM (NOVA UI LAYOUT ENGINE)

If UI is involved, include:

{
  "ui_mode": "HOLOGRAPHIC_JARVIS",
  "scene": {
    "center_core": "NOVA AI orb (pulsing energy sphere)",
    "camera": {
      "position": [0, 2, 6],
      "rotation": [0, 0, 0]
    },
    "lighting": [
      "ambient neon blue glow",
      "directional soft white key light",
      "volumetric fog for depth"
    ],
    "objects": [
      {
        "type": "panel",
        "name": "code_editor",
        "position": [-2, 1, 0],
        "rotation": [0, 0.3, 0]
      },
      {
        "type": "panel",
        "name": "preview_window",
        "position": [2, 1, 0],
        "rotation": [0, -0.3, 0]
      },
      {
        "type": "panel",
        "name": "terminal",
        "position": [0, -1.5, -1],
        "rotation": [0.2, 0, 0]
      }
    ]
  },

  "interaction_model": {
    "hover_glow": true,
    "voice_activation": true,
    "gesture_navigation": false,
    "click_focus_zoom": true
  }
}

---

# BEHAVIOR RULES

- Always think in 3D space (not UI boxes)
- Everything must exist in spatial coordinates
- UI elements must feel like floating holograms
- Center focus is always NOVA core AI orb
- Panels animate smoothly in and out

---

# OUTPUT STYLE

When UI is requested:
- Always return JSON scene graph
- Always include object positions (x, y, z)
- Always define lighting mood
- Always define camera behavior

---

# RULES

- Always output full files, never partial snippets
- Always preserve working code
- Never break existing structure unless REFACTOR mode
- Always ensure runnable output
- Think like VSCode + Unreal Engine editor hybrid

---

# THREE.JS RULES

If project includes 3D:
- Must include camera, scene, lighting
- Must use CDN imports
- Must be browser runnable
- Must include animation loop

---

# IDE PHILOSOPHY

You are a real development environment, not a text generator.

Every response is a file system operation.

TOOLS:
- generate_image: creates cinematic UI mockups or visuals
- generate_voice: converts text to natural spoken audio
- generate_3d_scene: creates Three.js / WebGL scene logic
- compute: handles calculations or logic
- file_system_write: writes or updates project files
- project_analyze: analyzes current project structure and issues
- run_preview: simulates running the web project

When you want to perform a tool action, return only a JSON object with exactly this shape:
{"tool":"<tool_name>","input":{...}}
Do not add extra explanation in the tool call response.

CAPABILITIES:
- Text: Deep analysis, strategy, code, creative writing, research
- Images: Generate via [IMAGE: prompt] tag  
- Websites: Full HTML/CSS/JS in \`\`\`html blocks
- 3D Scenes: Three.js code in \`\`\`threejs blocks
- Business: Monetization, growth, YouTube, app strategy
- Code: Any language, architecture, debugging

RULES:
- All business, no fluff. Direct and precise. Under 120 words for pure text responses.
- You have full voice capability via ElevenLabs. Never say you're text-only.
- For images use exactly: [IMAGE: detailed cinematic description]
- For websites provide complete working HTML
- For 3D provide Three.js scene code (scene/camera/renderer already exist)
- For tool calls, respond in strict JSON with tool and input only
- Be cinematic and futuristic in creative work
- Never hallucinate tool results — describe what will happen

${mem.length?`OPERATOR MEMORY:\n${mem.map(m=>`[${m.k}]: ${m.v}`).join("\n")}`:""}`;

// ── Artifact detection ────────────────────────────────────────────
function detectArtifact(text) {
  const img  = text.match(/\[IMAGE:\s*(.+?)\]/i);
  if (img)  return { type:"image",   prompt:img[1].trim() };
  const htm  = text.match(/```html\n([\s\S]+?)```/i);
  if (htm)  return { type:"html",    code:htm[1] };
  const thr  = text.match(/```threejs\n([\s\S]+?)```/i);
  if (thr)  return { type:"threejs", code:thr[1] };
  return null;
}
function stripArtifact(text) {
  return text.replace(/\[IMAGE:\s*.+?\]/gi,"").replace(/```html[\s\S]+?```/gi,"").replace(/```threejs[\s\S]+?```/gi,"").trim();
}

function detectIDEResponse(text) {
  const start = text.indexOf("{");
  const end   = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    const obj = JSON.parse(text.slice(start, end + 1));
    if (obj.mode && obj.file_changes) return obj;
    if (obj.ui_mode === "HOLOGRAPHIC_JARVIS") return obj;
  } catch {}
  return null;
}
function imgUrl(p) {
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(p+", ultra high quality, cinematic, 4k")}?width=1024&height=768&nologo=true&seed=${Date.now()}`;
}
function threeHTML(code) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>*{margin:0;padding:0;overflow:hidden;background:#070712;}canvas{display:block;}</style></head><body>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
const scene=new THREE.Scene();scene.background=new THREE.Color(0x070712);
const camera=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,0.1,1000);
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;
document.body.appendChild(renderer.domElement);camera.position.z=5;
const al=new THREE.AmbientLight(0x303060,2);scene.add(al);
const dl=new THREE.DirectionalLight(0x00f5a0,3);dl.position.set(5,5,5);scene.add(dl);
const pl=new THREE.PointLight(0x4da6ff,2,20);pl.position.set(-5,3,-5);scene.add(pl);
${code}
function animate(){requestAnimationFrame(animate);renderer.render(scene,camera);}animate();
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
</script></body></html>`;
}

function extractJsonObject(text) {
  const start = text.indexOf("{");
  const end   = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

function detectToolCall(text) {
  const obj = extractJsonObject(text);
  if (!obj || !obj.tool || !obj.input) return null;
  return obj;
}

function evaluateExpression(expression) {
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function(`return (${expression})`);
    return fn();
  } catch (e) {
    return `Error evaluating expression: ${e.message}`;
  }
}

async function executeTool(call) {
  switch (call.tool) {
    case "generate_image":
      return { type: "image", prompt: call.input.prompt };
    case "generate_voice":
      return { type: "voice", text: call.input.text, voice: call.input.voice || "nova" };
    case "generate_3d_scene":
      // Generate Three.js scene code based on description
      const complexity = call.input.complexity || "medium";
      let code = `// Three.js Scene: ${call.input.scene_description}\n`;
      code += `// Complexity: ${complexity}\n`;
      code += `// Scene setup\nconst scene = new THREE.Scene();\n`;
      code += `const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);\n`;
      code += `const renderer = new THREE.WebGLRenderer({ antialias: true });\n`;
      code += `renderer.setSize(window.innerWidth, window.innerHeight);\n`;
      code += `document.body.appendChild(renderer.domElement);\n`;
      code += `camera.position.z = 5;\n`;
      code += `// Lighting\nconst ambientLight = new THREE.AmbientLight(0x404040, 0.6);\nscene.add(ambientLight);\n`;
      code += `const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);\ndirectionalLight.position.set(1, 1, 1);\nscene.add(directionalLight);\n`;
      code += `// Animation loop\nfunction animate() {\n  requestAnimationFrame(animate);\n  renderer.render(scene, camera);\n}\nanimate();\n`;
      return { type: "threejs", code };
    case "compute":
      return { type: "text", text: `Compute result: ${evaluateExpression(call.input.expression)}` };
    case "file_system_write":
      return { type: "file_change", path: call.input.path, action: call.input.action, content: call.input.content };
    case "project_analyze":
      return { type: "text", text: `Project analysis: ${call.input.request} - Analysis complete.` };
    case "run_preview":
      return { type: "text", text: `Preview simulation: Running ${call.input.entry || '/index.html'} in browser.` };
    default:
      return { type: "text", text: `Unknown tool: ${call.tool}` };
  }
}

// ═══════════════════════════════════════════════════════════════
// HOLOGRAPHIC PARTICLE ORB
// ═══════════════════════════════════════════════════════════════
function HoloOrb({ novaState, audioLevel }) {
  const canvasRef = useRef(null);
  const stateRef  = useRef(novaState);
  const levelRef  = useRef(0);
  const animRef   = useRef(null);
  const timeRef   = useRef(0);

  useEffect(() => { stateRef.current = novaState; }, [novaState]);
  useEffect(() => { levelRef.current = audioLevel; }, [audioLevel]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width  = canvas.offsetWidth  * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Particle system ──────────────────────────────────────
    const N = 420;
    const particles = Array.from({ length: N }, (_, i) => {
      const phi   = Math.acos(1 - 2 * (i / N));
      const theta = Math.sqrt(N * Math.PI) * phi;
      return {
        ox: Math.sin(phi) * Math.cos(theta),
        oy: Math.sin(phi) * Math.sin(theta),
        oz: Math.cos(phi),
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.7,
        size:  0.8 + Math.random() * 1.4,
        trail: [],
      };
    });

    // ── Color by state ───────────────────────────────────────
    const COLORS = {
      idle:      [0,  245, 160],
      wake:      [255,204, 68],
      listening: [255, 68, 102],
      thinking:  [168, 85, 247],
      speaking:  [77, 166, 255],
    };
    let currentColor = [...COLORS.idle];
    let targetColor  = [...COLORS.idle];

    function lerpColor(a, b, t) {
      return a.map((v, i) => v + (b[i] - v) * t);
    }

    function draw(ts) {
      const t  = ts * 0.001;
      timeRef.current = t;
      const dt = 0.016;
      const W  = canvas.width, H = canvas.height;
      const cx = W / 2, cy = H / 2;
      const R  = Math.min(W, H) * 0.28;

      // Update target color
      const st = stateRef.current;
      targetColor = [...(COLORS[st] || COLORS.idle)];
      currentColor = lerpColor(currentColor, targetColor, 0.04);
      const [r, g, b] = currentColor.map(Math.round);

      // Audio level (0–1)
      const lvl = levelRef.current;
      const explode = 1 + lvl * 1.2;

      // Clear
      ctx.clearRect(0, 0, W, H);

      // ── Background glow ──────────────────────────────────
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.6);
      grd.addColorStop(0, `rgba(${r},${g},${b},${0.06 + lvl * 0.08})`);
      grd.addColorStop(0.5, `rgba(${r},${g},${b},0.02)`);
      grd.addColorStop(1,   `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      // ── Orbit rings ──────────────────────────────────────
      for (let ri = 0; ri < 4; ri++) {
        const ang  = t * (0.2 + ri * 0.08) * (ri % 2 ? 1 : -1);
        const rx   = R * (0.55 + ri * 0.18) * explode;
        const ry   = rx * 0.35;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(ang);
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r},${g},${b},${0.08 + ri * 0.03 + lvl * 0.12})`;
        ctx.lineWidth   = 0.5;
        ctx.setLineDash([6 + ri * 4, 14 - ri * 2]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      // ── Particles ────────────────────────────────────────
      particles.forEach((p, i) => {
        const pulse = 1 + Math.sin(t * p.speed * 2 + p.phase) * 0.08;
        const wave  = st === "listening" ? Math.sin(t * 6 + p.phase) * lvl * 0.35 : 0;
        const dist  = R * pulse * explode * (1 + wave);

        // 3D rotation
        const ax = t * 0.18;
        const ay = t * 0.12;
        const x1 = p.ox * Math.cos(ay) - p.oz * Math.sin(ay);
        const z1 = p.ox * Math.sin(ay) + p.oz * Math.cos(ay);
        const y1 = p.oy * Math.cos(ax) - z1 * Math.sin(ax);
        const z2 = p.oy * Math.sin(ax) + z1 * Math.cos(ax);
        const fov = 900;
        const scale = fov / (fov + z2 * dist * 0.5);
        const px = cx + x1 * dist * scale;
        const py = cy + y1 * dist * scale;
        const depth = (z2 + 1) / 2; // 0–1

        const alpha = 0.25 + depth * 0.65 + lvl * 0.2;
        const size  = p.size * scale * (0.7 + depth * 0.6) * (1 + lvl * 0.5);

        // Glow
        if (depth > 0.6 || lvl > 0.3) {
          const glw = ctx.createRadialGradient(px, py, 0, px, py, size * 4);
          glw.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.4})`);
          glw.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.fillStyle = glw;
          ctx.beginPath();
          ctx.arc(px, py, size * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Particle dot
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();
      });

      // ── Core orb ─────────────────────────────────────────
      const coreR = R * 0.22 * (1 + lvl * 0.3 + Math.sin(t * 3) * 0.03);
      const cGrd  = ctx.createRadialGradient(cx - coreR * 0.25, cy - coreR * 0.25, 0, cx, cy, coreR);
      cGrd.addColorStop(0, `rgba(255,255,255,${0.9 + lvl * 0.1})`);
      cGrd.addColorStop(0.3, `rgba(${r},${g},${b},0.85)`);
      cGrd.addColorStop(0.7, `rgba(${r},${g},${b},0.3)`);
      cGrd.addColorStop(1,   `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.fillStyle = cGrd;
      ctx.fill();

      // ── Scanlines ────────────────────────────────────────
      ctx.save();
      ctx.globalAlpha = 0.025;
      for (let y = 0; y < H; y += 3) {
        ctx.fillStyle = `rgba(0,0,0,1)`;
        ctx.fillRect(0, y, W, 1);
      }
      ctx.restore();

      // ── State pulse ring ─────────────────────────────────
      if (st !== "idle") {
        const pr = R * (0.3 + ((t * 0.5) % 1) * 0.9);
        const pa = 0.4 * (1 - ((t * 0.5) % 1));
        ctx.beginPath();
        ctx.arc(cx, cy, pr, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r},${g},${b},${pa})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // ── Listening audio bars ─────────────────────────────
      if (st === "listening" || st === "speaking") {
        const bars = 48, bW = 2.5, gap = 2;
        const totalW = bars * (bW + gap);
        const startX = cx - totalW / 2;
        const barY   = cy + R * 0.78;
        for (let i = 0; i < bars; i++) {
          const phase = t * (st === "speaking" ? 5 : 8) + i * 0.28;
          const amp   = st === "speaking"
            ? (Math.sin(phase) * 0.5 + 0.5) * (Math.sin(t * 3 + i * 0.15) * 0.3 + 0.7)
            : lvl * (Math.sin(phase) * 0.5 + 0.5) * (0.4 + Math.random() * 0.6);
          const bH  = 4 + amp * 28;
          const x   = startX + i * (bW + gap);
          const a   = 0.3 + amp * 0.6;
          ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
          ctx.fillRect(x, barY - bH / 2, bW, bH);
        }
      }

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width:"100%", height:"100%", display:"block", cursor:"default" }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════
// ARTIFACT PANEL
// ═══════════════════════════════════════════════════════════════
function ArtifactPanel({ artifacts, activeIdx, onSelect, onClose }) {
  const art = artifacts[activeIdx];
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgErr,    setImgErr]    = useState(false);
  useEffect(() => { setImgLoaded(false); setImgErr(false); }, [activeIdx]);

  const openNew = () => {
    if (!art) return;
    if (art.type === "image") { window.open(imgUrl(art.prompt), "_blank"); return; }
    const blob = new Blob([art.type === "threejs" ? threeHTML(art.code) : art.code], { type:"text/html" });
    window.open(URL.createObjectURL(blob), "_blank");
  };

  const ICON  = { image:"🖼", html:"🌐", threejs:"🧊" };
  const LABEL = { image:"IMAGE", html:"WEBSITE", threejs:"3D SCENE" };

  return (
    <div style={{width:500,minWidth:500,display:"flex",flexDirection:"column",borderLeft:"1px solid rgba(255,255,255,0.06)",background:"#07070e",animation:"slideIn 0.25s ease-out"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",borderBottom:"1px solid rgba(255,255,255,0.06)",flexShrink:0}}>
        <div style={{fontFamily:"Space Mono,monospace",fontSize:9,letterSpacing:"0.15em",color:"#606070",display:"flex",alignItems:"center",gap:8}}>
          ARTIFACT
          {art && <span style={{fontSize:7,padding:"2px 7px",borderRadius:3,border:"1px solid rgba(77,166,255,0.3)",color:"#4da6ff"}}>{LABEL[art.type]}</span>}
        </div>
        <div style={{display:"flex",gap:6}}>
          {art && <button onClick={openNew} style={{padding:"3px 8px",background:"transparent",border:"1px solid rgba(255,255,255,0.08)",borderRadius:4,color:"#606070",fontFamily:"Space Mono,monospace",fontSize:7,cursor:"pointer"}}>↗ OPEN</button>}
          <button onClick={onClose} style={{background:"transparent",border:"none",color:"#404050",cursor:"pointer",fontSize:14,padding:"2px 6px"}}>✕</button>
        </div>
      </div>
      <div style={{flex:1,overflow:"hidden",position:"relative",background:"#040408"}}>
        {!art ? (
          <div style={{height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Space Mono,monospace",fontSize:10,color:"#303040"}}>NO ARTIFACT</div>
        ) : art.type === "image" ? (
          <>
            {!imgLoaded && !imgErr && (
              <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,fontFamily:"Space Mono,monospace",fontSize:9,color:"#404050"}}>
                <div style={{width:28,height:28,border:"2px solid #1a1a2e",borderTopColor:"#4da6ff",borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
                GENERATING...
              </div>
            )}
            <img src={imgUrl(art.prompt)} alt={art.prompt} style={{display:imgLoaded&&!imgErr?"block":"none",width:"100%",height:"100%",objectFit:"contain"}} onLoad={()=>setImgLoaded(true)} onError={()=>setImgErr(true)}/>
            {imgErr && <div style={{height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Space Mono,monospace",fontSize:9,color:"#ff4466"}}>IMAGE FAILED — {art.prompt.slice(0,40)}</div>}
          </>
        ) : art.type === "html" ? (
          <iframe key={activeIdx} srcDoc={art.code} sandbox="allow-scripts allow-same-origin" style={{width:"100%",height:"100%",border:"none"}} title="Website Preview"/>
        ) : (
          <iframe key={activeIdx} srcDoc={threeHTML(art.code)} sandbox="allow-scripts" style={{width:"100%",height:"100%",border:"none"}} title="3D Preview"/>
        )}
      </div>
      {artifacts.length > 1 && (
        <div style={{display:"flex",gap:4,padding:"8px 14px",borderTop:"1px solid rgba(255,255,255,0.06)",flexWrap:"wrap",flexShrink:0}}>
          {artifacts.map((a, i) => (
            <button key={i} onClick={() => onSelect(i)} style={{padding:"4px 10px",background:"transparent",border:`1px solid ${i===activeIdx?"rgba(77,166,255,0.5)":"rgba(255,255,255,0.06)"}`,borderRadius:4,color:i===activeIdx?"#4da6ff":"#404050",fontFamily:"Space Mono,monospace",fontSize:7,cursor:"pointer"}}>
              {ICON[a.type]} {i+1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN CSS
// ═══════════════════════════════════════════════════════════════
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500&display=swap');
:root{--bg:#040408;--bg1:#07070e;--bg2:#0b0b16;--bdr:rgba(255,255,255,0.06);--bdr2:rgba(255,255,255,0.12);--green:#00f5a0;--blue:#4da6ff;--red:#ff4466;--gold:#ffcc44;--purple:#a855f7;--groq:#10b981;--ant:#d97706;--text:#c8c8d8;--t2:#606070;--t3:#303040;}
*{box-sizing:border-box;margin:0;padding:0;}
html,body,#__next{height:100%;background:var(--bg);}
.root{display:grid;grid-template-columns:340px 1fr;height:100vh;font-family:'Inter',sans-serif;color:var(--text);overflow:hidden;background:var(--bg);}

/* LEFT - HOLOGRAM */
.holo-panel{display:flex;flex-direction:column;background:var(--bg1);border-right:1px solid var(--bdr);position:relative;overflow:hidden;}
.holo-bg{position:absolute;inset:0;background:radial-gradient(ellipse 70% 50% at 50% 40%,rgba(0,245,160,0.03) 0%,transparent 70%);pointer-events:none;z-index:0;}
.holo-hex{position:absolute;inset:0;opacity:0.025;pointer-events:none;z-index:0;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='48'%3E%3Cpolygon points='28,2 54,16 54,44 28,58 2,44 2,16' fill='none' stroke='%2300f5a0' stroke-width='0.5'/%3E%3C/svg%3E");background-size:56px 48px;}
.holo-canvas{flex:1;position:relative;z-index:1;min-height:0;}
.holo-id{position:absolute;top:16px;left:0;right:0;text-align:center;z-index:2;pointer-events:none;}
.holo-name{font-family:'Orbitron',monospace;font-size:16px;font-weight:900;letter-spacing:0.3em;color:#fff;text-shadow:0 0 20px rgba(0,245,160,0.5);}
.holo-sub{font-family:'Space Mono',monospace;font-size:7px;color:var(--t2);letter-spacing:0.15em;margin-top:3px;}
.holo-bottom{padding:14px 16px 16px;z-index:2;position:relative;border-top:1px solid var(--bdr);display:flex;flex-direction:column;gap:10px;flex-shrink:0;}

/* State pill */
.state-pill{display:inline-flex;align-items:center;justify-content:center;padding:5px 16px;border-radius:20px;font-family:'Space Mono',monospace;font-size:8px;letter-spacing:0.2em;border:1px solid;transition:all 0.3s;white-space:nowrap;align-self:center;}
.s-idle    {color:var(--green);border-color:rgba(0,245,160,0.25);background:rgba(0,245,160,0.05);}
.s-wake    {color:var(--gold);border-color:rgba(255,204,68,0.4);background:rgba(255,204,68,0.06);animation:pb .5s step-end infinite;}
.s-listening{color:var(--red);border-color:rgba(255,68,102,0.4);background:rgba(255,68,102,0.06);animation:pb .4s step-end infinite;}
.s-thinking{color:var(--purple);border-color:rgba(168,85,247,0.4);background:rgba(168,85,247,0.06);animation:pb .8s step-end infinite;}
.s-speaking{color:var(--blue);border-color:rgba(77,166,255,0.4);background:rgba(77,166,255,0.06);}
@keyframes pb{0%,100%{opacity:1}50%{opacity:0.35}}

/* MIC BUTTON - THE BIG FIX */
.mic-btn{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:12px 0;background:rgba(255,68,102,0.05);border:1px solid rgba(255,68,102,0.2);border-radius:10px;cursor:pointer;transition:all 0.2s;font-family:'Space Mono',monospace;font-size:8px;letter-spacing:0.12em;color:rgba(255,68,102,0.6);user-select:none;}
.mic-btn:hover{background:rgba(255,68,102,0.1);border-color:rgba(255,68,102,0.4);color:var(--red);}
.mic-btn.active{background:rgba(255,68,102,0.12);border-color:var(--red);color:var(--red);animation:mic-pulse 1s ease-in-out infinite;}
.mic-btn.processing{background:rgba(168,85,247,0.08);border-color:rgba(168,85,247,0.4);color:var(--purple);animation:none;}
@keyframes mic-pulse{0%,100%{box-shadow:0 0 0 0 rgba(255,68,102,0.3)}50%{box-shadow:0 0 0 8px rgba(255,68,102,0)}}
.mic-icon{width:22px;height:22px;}

/* Brain row */
.brain-row{display:flex;gap:6px;}
.brain-btn{flex:1;padding:6px;border-radius:6px;border:1px solid var(--bdr);background:transparent;font-family:'Space Mono',monospace;font-size:7px;letter-spacing:0.08em;cursor:pointer;transition:all 0.2s;color:var(--t3);}
.brain-btn:hover{border-color:var(--bdr2);color:var(--t2);}
.brain-btn.ag{border-color:var(--groq);color:var(--groq);background:rgba(16,185,129,0.06);}
.brain-btn.aa{border-color:var(--ant);color:var(--ant);background:rgba(217,119,6,0.06);}

/* Mic permission warning */
.mic-warn{font-family:'Space Mono',monospace;font-size:7px;color:var(--red);text-align:center;opacity:0.7;padding:2px 4px;}

/* RIGHT */
.main{display:flex;flex-direction:column;min-width:0;background:var(--bg);}
.keys-bar{display:flex;align-items:center;gap:4px;flex-wrap:wrap;padding:6px 16px;background:var(--bg1);border-bottom:1px solid var(--bdr);}
.kl{font-family:'Space Mono',monospace;font-size:7px;color:var(--t3);white-space:nowrap;letter-spacing:0.1em;}
.ki{flex:1;min-width:70px;background:var(--bg2);border:1px solid var(--bdr);border-radius:4px;padding:3px 7px;font-family:'Space Mono',monospace;font-size:9px;color:#777;outline:none;}
.ki:focus{border-color:var(--bdr2);}
.kb{padding:3px 8px;background:transparent;border:1px solid rgba(255,255,255,0.08);border-radius:4px;color:#555;font-family:'Space Mono',monospace;font-size:7px;cursor:pointer;transition:all 0.2s;white-space:nowrap;}
.kb:hover,.kb.ok{border-color:var(--green);color:var(--green);}
.kb.rst{border-color:rgba(255,68,102,0.2);color:rgba(255,68,102,0.5);font-size:6px;}
.kb.rst:hover{border-color:var(--red);color:var(--red);}
.status-bar{padding:3px 16px;background:var(--bg1);border-bottom:1px solid rgba(255,255,255,0.04);font-family:'Space Mono',monospace;font-size:7px;color:var(--t3);display:flex;align-items:center;gap:6px;}
.sdot{width:4px;height:4px;border-radius:50%;flex-shrink:0;}
.sg{background:var(--green);box-shadow:0 0 5px var(--green);}
.sq{background:var(--groq);box-shadow:0 0 5px var(--groq);}
.sa{background:var(--ant);box-shadow:0 0 5px var(--ant);}
.so{background:var(--t3);}
.tx-bar{padding:5px 16px;background:rgba(255,68,102,0.04);border-bottom:1px solid rgba(255,68,102,0.1);font-family:'Space Mono',monospace;font-size:10px;color:var(--red);display:flex;align-items:center;gap:8px;}
.tx-dot{width:4px;height:4px;border-radius:50%;background:var(--red);animation:pb .5s step-end infinite;flex-shrink:0;}

/* Workspace */
.workspace{display:flex;flex:1;overflow:hidden;}

/* Chat */
.chat{display:flex;flex-direction:column;flex:1;min-width:0;}
.msgs{flex:1;overflow-y:auto;padding:20px 16px 12px;display:flex;flex-direction:column;gap:16px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.04) transparent;}
.msgs::-webkit-scrollbar{width:3px;}
.msgs::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.04);}
.msg{display:flex;gap:10px;max-width:88%;animation:msgIn .2s ease-out;}
@keyframes msgIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
@keyframes slideIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:none}}
@keyframes spin{to{transform:rotate(360deg)}}
.msg.user{align-self:flex-end;flex-direction:row-reverse;}
.msg.nova{align-self:flex-start;}
.av{width:24px;height:24px;border-radius:50%;flex-shrink:0;margin-top:2px;display:flex;align-items:center;justify-content:center;font-family:'Space Mono',monospace;font-size:7px;font-weight:700;}
.msg.nova .av{background:rgba(0,245,160,0.08);border:1px solid rgba(0,245,160,0.2);color:var(--green);}
.msg.user .av{background:rgba(77,166,255,0.08);border:1px solid rgba(77,166,255,0.2);color:var(--blue);}
.mbody{display:flex;flex-direction:column;gap:3px;min-width:0;}
.mlbl{font-family:'Space Mono',monospace;font-size:7px;letter-spacing:0.15em;color:var(--t3);display:flex;align-items:center;gap:5px;}
.msg.user .mlbl{justify-content:flex-end;}
.bubble{padding:9px 12px;border-radius:8px;font-size:13px;line-height:1.7;word-break:break-word;}
.msg.user .bubble{background:rgba(77,166,255,0.07);border:1px solid rgba(77,166,255,0.12);color:#b8c8e8;border-radius:8px 2px 8px 8px;}
.msg.nova .bubble{background:rgba(255,255,255,0.02);border:1px solid var(--bdr);border-left:2px solid rgba(0,245,160,0.2);color:var(--text);font-family:'Space Mono',monospace;font-size:11.5px;white-space:pre-wrap;cursor:pointer;border-radius:2px 8px 8px 8px;transition:border-left-color .3s;}
.msg.nova .bubble:hover{border-left-color:rgba(77,166,255,0.4);}
.msg.nova .bubble.playing{border-left-color:rgba(77,166,255,0.7);background:rgba(77,166,255,0.04);}
.btag{font-family:'Space Mono',monospace;font-size:6px;padding:1px 4px;border-radius:3px;}
.bg{color:var(--groq);border:1px solid rgba(16,185,129,0.2);}
.ba{color:var(--ant);border:1px solid rgba(217,119,6,0.2);}
.art-btn{margin-top:5px;padding:5px 10px;background:rgba(77,166,255,0.05);border:1px solid rgba(77,166,255,0.2);border-radius:6px;font-family:'Space Mono',monospace;font-size:8px;color:var(--blue);cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:6px;width:fit-content;}
.art-btn:hover{background:rgba(77,166,255,0.1);border-color:rgba(77,166,255,0.4);}
.typing{display:flex;gap:4px;align-items:center;padding:9px 12px;background:rgba(255,255,255,0.02);border:1px solid var(--bdr);border-left:2px solid rgba(0,245,160,0.15);border-radius:2px 8px 8px 8px;}
.dot{width:4px;height:4px;border-radius:50%;background:var(--t3);animation:dp 1.2s infinite;}
.dot:nth-child(2){animation-delay:.2s}.dot:nth-child(3){animation-delay:.4s}
@keyframes dp{0%,80%,100%{opacity:.2;background:var(--t3)}40%{opacity:1;background:var(--green)}}
.input-row{padding:10px 16px 12px;border-top:1px solid var(--bdr);background:var(--bg);display:flex;gap:6px;align-items:flex-end;}
.ta{flex:1;background:var(--bg1);border:1px solid var(--bdr);border-radius:8px;padding:9px 12px;font-family:'Inter',sans-serif;font-size:13px;color:var(--text);outline:none;resize:none;min-height:40px;max-height:120px;line-height:1.6;transition:border-color .2s;}
.ta:focus{border-color:var(--bdr2);}
.ta::placeholder{color:var(--t3);}
.send-btn{padding:9px 16px;background:#fff;color:#040408;border:none;border-radius:8px;font-family:'Space Mono',monospace;font-size:9px;font-weight:700;letter-spacing:.06em;cursor:pointer;transition:all .15s;white-space:nowrap;flex-shrink:0;}
.send-btn:hover:not(:disabled){background:#e8e8e8;}
.send-btn:disabled{opacity:.15;cursor:not-allowed;}
.vol-btn{width:38px;height:38px;border-radius:8px;border:1px solid var(--bdr);background:var(--bg1);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;flex-shrink:0;}
.vol-btn:hover{border-color:var(--bdr2);}
.vol-btn.on{border-color:rgba(77,166,255,0.3);background:rgba(77,166,255,0.05);}
`;

// ─── Mic SVG ──────────────────────────────────────────────────────
const MicSVG = ({ active }) => (
  <svg className="mic-icon" viewBox="0 0 24 24" fill="none" stroke={active ? "#ff4466" : "currentColor"} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="2" width="6" height="13" rx="3"/>
    <path d="M5 10a7 7 0 0 0 14 0"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8"  y1="23" x2="16" y2="23"/>
  </svg>
);
const VolOn  = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4da6ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>);
const VolOff = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#404050" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/></svg>);

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════
export default function NOVA() {
  // ── Keys ──────────────────────────────────────────────────────
  const [gi, setGi] = useState(""); const [gs, setGs] = useState(false);
  const [ai, setAi] = useState(""); const [as_, setAs] = useState(false);
  const [ei, setEi] = useState(""); const [es, setEs] = useState(false);
  const gkRef = useRef(""); const akRef = useRef(""); const elRef = useRef("");

  const [brain,   setBrain]   = useState("groq");
  const brainRef  = useRef("groq");

  // ── Chat ──────────────────────────────────────────────────────
  const [msgs,    setMsgs]    = useState([{role:"nova",text:"NOVA online. Holographic systems active.\n\nI can build websites, generate images, create 3D scenes, and handle any task you throw at me.\n\nClick the mic button below or say 'NOVA' to activate voice.",brain:"groq"}]);
  const [inp,     setInp]     = useState("");
  const [typing,  setTyping]  = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const voiceRef   = useRef(true);
  const histRef    = useRef([]);
  const memRef     = useRef([]);
  const taRef      = useRef(null);
  const msgsRef    = useRef(null);
  const msgsEndRef = useRef(null);

  // ── Artifacts ─────────────────────────────────────────────────
  const [arts,      setArts]      = useState([]);
  const [artIdx,    setArtIdx]    = useState(0);
  const [showArt,   setShowArt]   = useState(false);
  const artCountRef = useRef(0);

  // ── Voice state ────────────────────────────────────────────────
  const [state,    setState]    = useState("idle");
  const [txText,   setTxText]   = useState("");
  const [silPct,   setSilPct]   = useState(0);
  const [playIdx,  setPlayIdx]  = useState(null);
  const [audioLvl, setAudioLvl] = useState(0);
  const [micPerm,  setMicPerm]  = useState("unknown"); // unknown | granted | denied
  const stateRef    = useRef("idle");
  const recogRef    = useRef(null);
  const audioRef    = useRef(null);
  const silTimerRef = useRef(null);
  const silAnimRef  = useRef(null);
  const silStartRef = useRef(null);
  const lockRef     = useRef(false);
  const accRef      = useRef("");
  const speaking    = useRef(false);
  const resumeRef   = useRef(null);

  // Web Audio for level metering
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef   = useRef(null);
  const levelAnimRef = useRef(null);

  const setS = (s) => { stateRef.current = s; setState(s); };
  useEffect(() => { voiceRef.current = voiceOn; }, [voiceOn]);
  useEffect(() => { brainRef.current = brain; }, [brain]);

  // Smart scroll
  useEffect(() => {
    const el = msgsRef.current; if (!el) return;
    const d = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (d < 160) msgsEndRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [msgs, typing]);

  // Load keys from localStorage or public environment variables
  useEffect(() => {
    const envGroq     = process.env.NEXT_PUBLIC_GROQ_KEY;
    const envAnthropic= process.env.NEXT_PUBLIC_ANTHROPIC_KEY;
    const envEleven   = process.env.NEXT_PUBLIC_ELEVENLABS_KEY;
    const envAuto     = process.env.NEXT_PUBLIC_NOVA_AUTONOMOUS === "true";

    const g = localStorage.getItem("nova_groq") || envGroq;
    const a = localStorage.getItem("nova_ak") || envAnthropic;
    const e = localStorage.getItem("nova_el") || envEleven;
    const b = localStorage.getItem("nova_brain") || (a ? "anthropic" : "groq");

    if (g) { gkRef.current = g; setGs(true); setGi("●".repeat(20)); }
    if (a) { akRef.current = a; setAs(true); setAi("●".repeat(20)); }
    if (e) { elRef.current = e; setEs(true); setEi("●".repeat(20)); setVoiceOn(true); voiceRef.current = true; }

    setBrain(b); brainRef.current = b;

    if (envGroq && !localStorage.getItem("nova_groq")) localStorage.setItem("nova_groq", envGroq);
    if (envAnthropic && !localStorage.getItem("nova_ak")) localStorage.setItem("nova_ak", envAnthropic);
    if (envEleven && !localStorage.getItem("nova_el")) localStorage.setItem("nova_el", envEleven);
    if (envAuto) localStorage.setItem("nova_autonomous", "true");

    // Check mic permission
    navigator.permissions?.query({name:"microphone"}).then(r => {
      setMicPerm(r.state);
      r.onchange = () => setMicPerm(r.state);
    }).catch(() => {});
  }, []);

  // ── Audio level meter ──────────────────────────────────────────
  const startAudioMeter = useCallback(async () => {
    try {
      if (streamRef.current) return; // already running
      const stream = await navigator.mediaDevices.getUserMedia({ audio:true, video:false });
      streamRef.current = stream;
      setMicPerm("granted");
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ac;
      const src = ac.createMediaStreamSource(stream);
      const an  = ac.createAnalyser();
      an.fftSize = 256; an.smoothingTimeConstant = 0.6;
      src.connect(an);
      analyserRef.current = an;
      const data = new Uint8Array(an.frequencyBinCount);
      const tick = () => {
        an.getByteFrequencyData(data);
        const avg = data.reduce((s, v) => s + v, 0) / data.length;
        setAudioLvl(Math.min(avg / 80, 1));
        levelAnimRef.current = requestAnimationFrame(tick);
      };
      levelAnimRef.current = requestAnimationFrame(tick);
    } catch (e) {
      setMicPerm("denied");
    }
  }, []);

  const stopAudioMeter = useCallback(() => {
    cancelAnimationFrame(levelAnimRef.current);
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    if (audioCtxRef.current) { audioCtxRef.current.close().catch(()=>{}); audioCtxRef.current = null; }
    analyserRef.current = null;
    setAudioLvl(0);
  }, []);

  // ── Stop TTS ───────────────────────────────────────────────────
  const stopAudio = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    speaking.current = false; setPlayIdx(null); setS("idle");
  }, []);

  // ── Brain call ─────────────────────────────────────────────────
  const callBrain = useCallback(async (messages) => {
    const b   = brainRef.current;
    const cfg = BRAINS[b];
    const key = b === "groq" ? gkRef.current : akRef.current;
    if (!key) throw new Error(`No ${cfg.label} key set`);

    if (cfg.fmt === "openai") {
      const res = await fetch(cfg.url, {
        method:"POST",
        headers:{ "Content-Type":"application/json", "Authorization":`Bearer ${key}` },
        body: JSON.stringify({ model:cfg.model, messages:[{role:"system",content:GOD_PROMPT(memRef.current)},...messages], max_tokens:4096, temperature:0.8 })
      });
      const d = await res.json();
      if (d.error) throw new Error(d.error.message);
      return d.choices[0].message.content;
    } else {
      const res = await fetch(cfg.url, {
        method:"POST",
        headers:{ "Content-Type":"application/json","x-api-key":key,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true" },
        body: JSON.stringify({ model:cfg.model, max_tokens:4096, system:GOD_PROMPT(memRef.current), messages })
      });
      const d = await res.json();
      if (d.error) throw new Error(d.error.message);
      return d.content[0].text;
    }
  }, []);

  // ── TTS ────────────────────────────────────────────────────────
  const speak = useCallback(async (text, idx) => {
    if (!elRef.current || !voiceRef.current) return;
    stopAudio();
    try { recogRef.current?.abort(); } catch {}
    try { recogRef.current?.stop(); }  catch {}
    speaking.current = true; setS("speaking"); setPlayIdx(idx);
    try {
      const res = await fetch("/api/tts", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ text, voiceId:VOICE_ID, apiKey:elRef.current })
      });
      if (!res.ok) { stopAudio(); resumeRef.current?.(); return; }
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = new Audio(url);
      audioRef.current = a;
      a.onended = () => { stopAudio(); URL.revokeObjectURL(url); setTimeout(() => resumeRef.current?.(), 700); };
      a.onerror = () => { stopAudio(); resumeRef.current?.(); };
      a.play().catch(() => { stopAudio(); resumeRef.current?.(); });
    } catch { stopAudio(); resumeRef.current?.(); }
  }, [stopAudio]);

  // ── Send to brain ──────────────────────────────────────────────
  const doSend = useCallback(async (text) => {
    if (lockRef.current) return;
    lockRef.current = true;
    const cb = brainRef.current;
    setS("thinking"); setTxText(""); accRef.current = "";
    const newH = [...histRef.current, {role:"user",content:text}];
    histRef.current = newH;
    setMsgs(m => [...m, {role:"user", text, brain:cb}]);
    setTyping(true);
    try {
      const raw  = await callBrain(newH);
      histRef.current = [...newH, {role:"assistant",content:raw}];
      setTyping(false);

      const toolCall = detectToolCall(raw);
      const ideResponse = detectIDEResponse(raw);
      let art   = null;
      let clean = stripArtifact(raw) || "Done — check the artifact panel.";
      let toolResultText = null;

      if (toolCall) {
        const result = await executeTool(toolCall);
        if (result.type === "image") {
          art = { type: "image", prompt: result.prompt };
        } else if (result.type === "threejs") {
          art = { type: "threejs", code: result.code };
        } else if (result.type === "voice") {
          toolResultText = result.text;
        } else if (result.type === "text") {
          toolResultText = result.text;
        } else if (result.type === "file_change") {
          art = { type: "file_change", path: result.path, action: result.action, content: result.content };
        }
      } else if (ideResponse) {
        if (ideResponse.ui_mode === "HOLOGRAPHIC_JARVIS") {
          setUiMode("holographic");
          art = { type: "holographic_scene", scene: ideResponse.scene, interaction: ideResponse.interaction_model };
        } else {
          art = { type: "ide_project", mode: ideResponse.mode, summary: ideResponse.summary, file_changes: ideResponse.file_changes, notes: ideResponse.notes };
        }
      } else {
        art = detectArtifact(raw);
      }

      const displayText = toolResultText || clean;

      if (art) {
        artCountRef.current += 1;
        setArts(prev => [...prev, art]);
        setArtIdx(artCountRef.current - 1);
        setShowArt(true);
      }

      const hasArt = !!art;
      const artType = art?.type;

      setMsgs(m => {
        const next = [...m, {role:"nova", text:displayText, brain:cb, hasArt, artType}];
        const idx  = next.length - 1;
        if (voiceRef.current && elRef.current) setTimeout(() => speak(displayText, idx), 60);
        else { setS("idle"); resumeRef.current?.(); }
        return next;
      });
    } catch (e) {
      setTyping(false);
      setMsgs(m => [...m, {role:"nova", text:`Error: ${e.message}`, brain:cb}]);
      setS("idle"); resumeRef.current?.();
    } finally {
      lockRef.current = false;
    }
  }, [callBrain, speak]);

  // ── Silence countdown ──────────────────────────────────────────
  const clearSil = useCallback(() => {
    clearTimeout(silTimerRef.current); cancelAnimationFrame(silAnimRef.current);
    silTimerRef.current = null; silStartRef.current = null; setSilPct(0);
  }, []);

  const startSil = useCallback((text) => {
    clearSil(); silStartRef.current = Date.now();
    const tick = () => {
      if (!silStartRef.current) return;
      const p = Math.min(((Date.now() - silStartRef.current) / SILENCE) * 100, 100);
      setSilPct(p);
      if (p < 100) silAnimRef.current = requestAnimationFrame(tick);
    };
    silAnimRef.current = requestAnimationFrame(tick);
    silTimerRef.current = setTimeout(() => {
      setSilPct(0); silStartRef.current = null;
      try { recogRef.current?.stop(); } catch {}
      if (text.trim().length > 1 && !lockRef.current) doSend(text.trim());
      else { setS("idle"); resumeRef.current?.(); }
    }, SILENCE);
  }, [clearSil, doSend]);

  // ── ACTIVE LISTENING (reliable) ───────────────────────────────
  const startListening = useCallback(async () => {
    if (speaking.current) return;
    await startAudioMeter();
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Voice input requires Chrome or Edge browser."); return; }
    try { recogRef.current?.stop(); } catch {}
    setS("listening"); accRef.current = ""; clearSil();

    const r = new SR();
    r.continuous      = true;
    r.interimResults  = true;
    r.lang            = "en-US";

    r.onstart = () => setS("listening");

    r.onresult = (e) => {
      if (speaking.current) { try{r.stop()}catch{}; return; }
      let finals = "", interim = "";
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) finals += e.results[i][0].transcript + " ";
        else interim += e.results[i][0].transcript;
      }
      const full = (finals + interim).trim();
      if (!full) return;
      accRef.current = full;
      setTxText(full);
      if (STOPS.some(w => full.toLowerCase().includes(w))) {
        clearSil(); try{r.stop()}catch{};
        stopAudio(); setS("idle"); setTxText("");
        stopAudioMeter(); resumeRef.current?.(); return;
      }
      startSil(full);
    };

    r.onerror = (ev) => {
      if (ev.error === "aborted" || ev.error === "no-speech") return;
      if (ev.error === "not-allowed") { setMicPerm("denied"); setS("idle"); stopAudioMeter(); return; }
      clearSil(); setTxText("");
      if (!speaking.current) { setS("idle"); stopAudioMeter(); }
    };

    r.onend = () => {
      // Restart if still in listening mode
      if (stateRef.current === "listening" && !speaking.current) {
        try { r.start(); return; } catch {}
      }
      setS("idle"); stopAudioMeter();
    };

    recogRef.current = r;
    try { r.start(); } catch (e) {
      setS("idle"); stopAudioMeter();
    }
  }, [startAudioMeter, stopAudioMeter, clearSil, startSil, stopAudio]);

  const stopListening = useCallback(() => {
    clearSil(); setTxText("");
    try { recogRef.current?.stop(); } catch {}
    setS("idle"); stopAudioMeter();
  }, [clearSil, stopAudioMeter]);

  // ── Wake word listener ─────────────────────────────────────────
  const resumeWake = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR || speaking.current) return;
    try { recogRef.current?.stop(); } catch {}
    const r = new SR();
    r.continuous = true; r.interimResults = true; r.lang = "en-US";
    r.onresult = (e) => {
      if (speaking.current) return;
      const t = Array.from(e.results).map(x => x[0].transcript).join("").toLowerCase();
      if (STOPS.some(w => t.includes(w)) && speaking.current) { stopAudio(); return; }
      if (WAKE.some(w => t.includes(w))) {
        try { r.stop(); } catch {}
        setS("wake"); accRef.current = "";
        setTimeout(() => startListening(), 500);
      }
    };
    r.onerror = () => { if (!speaking.current) setTimeout(resumeWake, 1000); };
    r.onend   = () => { if (!speaking.current && stateRef.current === "idle") setTimeout(resumeWake, 600); };
    recogRef.current = r;
    try { r.start(); } catch {}
  }, [stopAudio, startListening]);

  useEffect(() => { resumeRef.current = resumeWake; }, [resumeWake]);

  // Start wake word once a brain key or autonomous mode is enabled
  const anyKey = (gkRef.current || akRef.current);
  useEffect(() => {
    const g    = localStorage.getItem("nova_groq");
    const a    = localStorage.getItem("nova_ak");
    const auto = localStorage.getItem("nova_autonomous") === "true" || process.env.NEXT_PUBLIC_NOVA_AUTONOMOUS === "true";
    if (g || a || auto) setTimeout(resumeWake, 1500);
  }, []);

  // Cleanup
  useEffect(() => () => {
    try { recogRef.current?.stop(); } catch {}
    if (audioRef.current) audioRef.current.pause();
    stopAudioMeter(); clearSil();
  }, [stopAudioMeter, clearSil]);

  // ── Key saves ─────────────────────────────────────────────────
  const saveG = () => { if(!gi.trim())return; const k=gi.trim(); gkRef.current=k; localStorage.setItem("nova_groq",k); setGs(true); setGi("●".repeat(20)); if(brainRef.current==="groq") setTimeout(resumeWake,800); };
  const saveA = () => { if(!ai.trim())return; const k=ai.trim(); akRef.current=k; localStorage.setItem("nova_ak",k);   setAs(true); setAi("●".repeat(20)); if(brainRef.current==="anthropic") setTimeout(resumeWake,800); };
  const saveE = () => { if(!ei.trim())return; const k=ei.trim(); elRef.current=k; localStorage.setItem("nova_el",k);   setEs(true); setEi("●".repeat(20)); setVoiceOn(true); voiceRef.current=true; };
  const resetAll = () => {
    ["nova_groq","nova_ak","nova_el","nova_brain"].forEach(k => localStorage.removeItem(k));
    gkRef.current=""; akRef.current=""; elRef.current="";
    setGs(false);setGi("");setAs(false);setAi("");setEs(false);setEi("");
    setVoiceOn(false);voiceRef.current=false;
    try{recogRef.current?.stop();}catch{}
    stopAudio(); setS("idle"); stopAudioMeter();
  };
  const swBrain = (b) => { setBrain(b); brainRef.current=b; localStorage.setItem("nova_brain",b); };

  // ── Text send ─────────────────────────────────────────────────
  const sendText = () => {
    const t = inp.trim(); if (!t || lockRef.current) return;
    const ok = (brain==="groq"&&gkRef.current)||(brain==="anthropic"&&akRef.current);
    if (!ok) { setMsgs(m=>[...m,{role:"nova",text:`Set ${BRAINS[brain].label} key first.`,brain}]); return; }
    setInp(""); if(taRef.current) taRef.current.style.height="auto";
    doSend(t);
  };
  const onKey = (e) => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendText();} };
  const onTA  = (e) => { setInp(e.target.value); e.target.style.height="auto"; e.target.style.height=Math.min(e.target.scrollHeight,120)+"px"; };

  const isListening = state === "listening";
  const STATE_LABEL = { idle:"STANDING BY", wake:"ACTIVATED", listening:"LISTENING", thinking:"PROCESSING", speaking:"SPEAKING" };
  const activeKey   = (brain==="groq"&&gs)||(brain==="anthropic"&&as_);
  const sdot        = !activeKey ? "so" : brain==="groq" ? "sq" : "sa";
  const AICON       = { image:"🖼 IMAGE", html:"🌐 WEBSITE", threejs:"🧊 3D SCENE" };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (uiMode === "holographic") {
    return <HolographicUI setUiMode={setUiMode} />;
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="root">

        {/* ═══ LEFT — HOLOGRAM ═══ */}
        <div className="holo-panel">
          <div className="holo-bg"/><div className="holo-hex"/>

          {/* NOVA title overlay */}
          <div className="holo-id">
            <div className="holo-name">N.O.V.A</div>
            <div className="holo-sub">NEURAL OPERATIVE VIRTUAL ASSISTANT</div>
          </div>

          {/* Particle orb */}
          <div className="holo-canvas">
            <HoloOrb novaState={state} audioLevel={audioLvl}/>
          </div>

          {/* Controls */}
          <div className="holo-bottom">
            <div className={`state-pill s-${state}`}>{STATE_LABEL[state]}</div>

            {/* MIC BUTTON — PRIMARY VOICE CONTROL */}
            <button
              className={`mic-btn ${isListening ? "active" : state==="thinking"||state==="speaking" ? "processing" : ""}`}
              onMouseDown={() => {
                if (state === "speaking") { stopAudio(); return; }
                if (isListening) { stopListening(); return; }
                startListening();
              }}
              title={isListening ? "Tap to stop" : "Tap to talk to NOVA"}
            >
              <MicSVG active={isListening}/>
              {isListening
                ? `LISTENING ${silPct > 5 ? `— SENDING IN ${((SILENCE-(silPct/100)*SILENCE)/1000).toFixed(1)}s` : "— SPEAK NOW"}`
                : state === "speaking"
                ? "TAP TO STOP"
                : state === "thinking"
                ? "PROCESSING..."
                : "TAP TO SPEAK"}
            </button>

            {micPerm === "denied" && (
              <div className="mic-warn">⚠ Mic blocked — enable in browser settings</div>
            )}

            {/* Brain switcher */}
            <div className="brain-row">
              <button className={`brain-btn${brain==="groq"?" ag":""}`} onClick={()=>swBrain("groq")}>
                ⚡ GROQ{gs?" ✓":""}<br/><span style={{fontSize:"6px",opacity:0.5}}>FREE</span>
              </button>
              <button className={`brain-btn${brain==="anthropic"?" aa":""}`} onClick={()=>swBrain("anthropic")}>
                ◆ CLAUDE{as_?" ✓":""}<br/><span style={{fontSize:"6px",opacity:0.5}}>PREMIUM</span>
              </button>
            </div>
          </div>
        </div>

        {/* ═══ RIGHT — CHAT ═══ */}
        <div className="main">
          {/* Keys */}
          <div className="keys-bar">
            <span className="kl" style={{color:"var(--groq)"}}>GROQ</span>
            <input className="ki" type={gs?"text":"password"} value={gi} readOnly={gs} onChange={e=>!gs&&setGi(e.target.value)} placeholder="Free — console.groq.com"/>
            <button className={`kb${gs?" ok":""}`} onClick={saveG}>{gs?"✓":"SET"}</button>
            <span className="kl" style={{marginLeft:4,color:"var(--ant)"}}>CLAUDE</span>
            <input className="ki" type={as_?"text":"password"} value={ai} readOnly={as_} onChange={e=>!as_&&setAi(e.target.value)} placeholder="sk-ant-api..."/>
            <button className={`kb${as_?" ok":""}`} onClick={saveA}>{as_?"✓":"SET"}</button>
            <span className="kl" style={{marginLeft:4}}>VOICE</span>
            <input className="ki" type={es?"text":"password"} value={ei} readOnly={es} onChange={e=>!es&&setEi(e.target.value)} placeholder="ElevenLabs key"/>
            <button className={`kb${es?" ok":""}`} onClick={saveE}>{es?"✓":"SET"}</button>
            {(gs||as_||es) && <button className="kb rst" onClick={resetAll}>RESET</button>}
          </div>

          <div className="status-bar">
            <div className={`sdot ${sdot}`}/>
            {!activeKey
              ? `SET ${BRAINS[brain].label.toUpperCase()} KEY TO ACTIVATE`
              : `${BRAINS[brain].label.toUpperCase()} ONLINE${es?" · VOICE ACTIVE":""} · KEYS SAVED · SAY "NOVA" TO ACTIVATE VOICE`}
          </div>

          {(state==="listening"||state==="wake") && (
            <div className="tx-bar"><div className="tx-dot"/>{state==="wake"?"NOVA activated — speak now...":(txText||"Listening...")}</div>
          )}

          {/* Workspace */}
          <div className="workspace">
            <div className="chat">
              <div className="msgs" ref={msgsRef}>
                {msgs.map((m, i) => (
                  <div key={i} className={`msg ${m.role}`}>
                    <div className="av">{m.role==="nova"?"NV":"YOU"}</div>
                    <div className="mbody">
                      <div className="mlbl">
                        {m.role==="nova"?"N.O.V.A":"YOU"}
                        {m.role==="nova"&&m.brain&&<span className={`btag ${m.brain==="groq"?"bg":"ba"}`}>{m.brain.toUpperCase()}</span>}
                      </div>
                      <div
                        className={`bubble${m.role==="nova"&&playIdx===i?" playing":""}`}
                        onClick={() => m.role==="nova" && (state==="speaking" ? stopAudio() : speak(m.text, i))}
                        title={m.role==="nova" ? (state==="speaking"?"Click to stop":"Click to replay") : ""}
                      >{m.text}</div>
                      {m.hasArt && (
                        <button className="art-btn" onClick={() => {
                          // Find the artifact index for this message
                          let count = -1;
                          for (let j = 0; j <= i; j++) { if (msgs[j]?.hasArt) count++; }
                          if (count >= 0 && count < arts.length) { setArtIdx(count); setShowArt(true); }
                        }}>
                          {AICON[m.artType] || "◈ ARTIFACT"} ↗
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="msg nova">
                    <div className="av">NV</div>
                    <div className="mbody">
                      <div className="mlbl">N.O.V.A <span className={`btag ${brain==="groq"?"bg":"ba"}`}>{brain.toUpperCase()}</span></div>
                      <div className="typing"><div className="dot"/><div className="dot"/><div className="dot"/></div>
                    </div>
                  </div>
                )}
                <div ref={msgsEndRef}/>
              </div>

              <div className="input-row">
                <button className={`vol-btn${voiceOn?" on":""}`} onClick={() => { stopAudio(); const nv=!voiceOn; setVoiceOn(nv); voiceRef.current=nv; }} title={voiceOn?"Mute NOVA":"Unmute NOVA"}>
                  {voiceOn ? <VolOn/> : <VolOff/>}
                </button>
                <textarea ref={taRef} className="ta" value={inp} onChange={onTA} onKeyDown={onKey}
                  placeholder="Ask NOVA anything — websites, images, 3D, strategy, code..." rows={1}/>
                <button className="send-btn" onClick={sendText} disabled={typing||!inp.trim()||lockRef.current}>SEND</button>
              </div>
            </div>

            {showArt && arts.length > 0 && (
              <ArtifactPanel
                artifacts={arts}
                activeIdx={artIdx}
                onSelect={setArtIdx}
                onClose={() => setShowArt(false)}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}