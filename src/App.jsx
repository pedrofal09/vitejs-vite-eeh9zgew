import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Dumbbell, Apple, Activity, BookOpen, PlayCircle, Clock, Info,
  ShieldAlert, Zap, Flame, Plus, Trash2, LineChart, Timer, X,
  Pause, Play, CalendarPlus, CheckCircle, ArrowRight, Wind, ChevronRight, ActivitySquare,
  Camera, Image as ImageIcon, Bot, Send, Loader2
} from 'lucide-react';

// --- DATA MASTER: ESTRUCTURA DEL PLAN ---

const WARMUP_WEIGHTS = [
  { name: "Elevación Térmica", duration: "3 min", desc: "Marcha rápida o Shadow Boxing ligero para activar el sistema nervioso." },
  { name: "Movilidad Articular", duration: "3 min", desc: "Rotaciones hombros (15/lado) + Aperturas pecho dinámicas." },
  { name: "Activación Core/Base", duration: "2 min", desc: "Bird-Dog (5/lado) + Puente de glúteo (15 reps) para proteger la diástasis." }
];

const RUNNING_WARMUP = [
  { name: "Movilidad Activa", duration: "5 min", desc: "Círculos de tobillo, balanceo de piernas y rotación de cadera." },
  { name: "Trote Progresivo", duration: "5 min", desc: "Iniciar caminando rápido y subir paulatinamente a trote muy suave." }
];

const RUNNING_COOLDOWN = [
  { name: "Vuelta a la Calma", duration: "5 min", desc: "Caminata lenta hasta bajar pulsaciones por debajo de 100 bpm." },
  { name: "Estiramiento Estático", duration: "5 min", desc: "Foco en gemelos, psoas e isquiotibiales (30 seg por posición)." }
];

const BLOCK_A = [
  { name: "Sentadilla con Barra Libre", sets: 4, reps: "8-10", tempo: "3-1-2-1", rest: "120", yt: "Barbell back squat proper form", notes: "MOTOR DE TESTOSTERONA. Exhala y mete el ombligo al subir." },
  { name: "Hip Thrust con Barra", sets: 4, reps: "10-12", tempo: "2-0-X-2", rest: "90", yt: "Barbell hip thrust form", notes: "Usa banco y colchoneta en cadera. Empuje explosivo." },
  { name: "Sentadilla Búlgara", sets: 3, reps: "10-12/p", tempo: "3-1-2-1", rest: "60", yt: "Dumbbell Bulgarian Split Squat", notes: "Apoya empeine atrás. Equilibra fuerza unilateral." },
  { name: "Zancada Inversa (Mancuernas)", sets: 3, reps: "10-12/p", tempo: "3-1-2-1", rest: "60", yt: "Dumbbell reverse lunge proper form", notes: "Paso hacia atrás. Protege las rodillas y activa fuertemente glúteos y piernas." },
  { name: "Elevación de Talones", sets: 4, reps: "15-20", tempo: "2-1-1-2", rest: "60", yt: "Standing calf raise form", notes: "" },
  { name: "Toques de Talón (Heel Taps)", sets: 3, reps: "10-12/p", tempo: "Muy lento", rest: "45", yt: "Heel taps diastasis recti safe core", notes: "Core terapéutico para cerrar diástasis." }
];

const BLOCK_B = [
  { name: "Press Inclinado (Barra/Manc.)", sets: 4, reps: "8-10", tempo: "3-1-2-1", rest: "90", yt: "Incline dumbbell press form", notes: "Ataca la Ginecomastia. Banco a 30-45 grados." },
  { name: "Aperturas Inclinadas", sets: 3, reps: "10-12", tempo: "3-1-2-1", rest: "90", yt: "Incline dumbbell fly", notes: "Expansión torácica." },
  { name: "Press Militar Sentado", sets: 3, reps: "10-12", tempo: "Regular", rest: "90", yt: "Seated shoulder press dumbbell", notes: "Respaldo a 90 grados para proteger lumbar." },
  { name: "Elevaciones Laterales", sets: 4, reps: "12-15", tempo: "2-0-1-1", rest: "60", yt: "Dumbbell lateral raise", notes: "" },
  { name: "Rompecráneos", sets: 3, reps: "12-15", tempo: "2-0-1-1", rest: "60", yt: "Dumbbell skullcrushers", notes: "Codos cerrados." }
];

const BLOCK_C = [
  { name: "Remo a Una Mano (Banco)", sets: 4, reps: "10-12/b", tempo: "2-1-2-1", rest: "90", yt: "Single arm dumbbell row bench", notes: "Espalda paralela al suelo. Cero estrés lumbar." },
  { name: "Pull-over con Mancuerna", sets: 3, reps: "10-12", tempo: "3-1-2-1", rest: "90", yt: "Dumbbell pullover chest lats", notes: "Excelente para ginecomastia." },
  { name: "Pájaros (Banco Inclinado)", sets: 3, reps: "15", tempo: "2-0-2-2", rest: "60", yt: "Chest supported reverse fly", notes: "Corrige postura y hombros caídos." },
  { name: "Curl de Bíceps Alterno", sets: 3, reps: "10-12/b", tempo: "2-0-1-1", rest: "60", yt: "Alternating bicep curl", notes: "" },
  { name: "Bird-Dog (Estabilización)", sets: 3, reps: "10/lado", tempo: "2-1-2-1", rest: "45", yt: "Bird dog exercise diastasis safe", notes: "" }
];

const SCHEDULE = [
  { day: "Lunes", type: "Pierna & Core (A)", target: "Testosterona", time: "4AM / 7PM", exercises: BLOCK_A, hasWarmup: true },
  { day: "Martes", type: "Empuje (B)", target: "Pectoral / Gineco", time: "4AM / 7PM", exercises: BLOCK_B, hasWarmup: true },
  { day: "Miércoles", type: "Cardio Zona 2", target: "Grasa Visceral", time: "4AM / 7PM", isRunning: true, zone: "105-123 ppm", duration: "45-60 min" },
  { day: "Jueves", type: "Tracción (C) + HIIT", target: "Postura / GH", time: "4AM / 7PM", exercises: BLOCK_C, hasWarmup: true, hasHIIT: true },
  { day: "Viernes", type: "Pierna & Core (A)", target: "Salud Pélvica", time: "4AM / 7PM", exercises: BLOCK_A, hasWarmup: true },
  { day: "Sábado", type: "Movilidad Activa", target: "Cortisol", time: "Mañana", isMobility: true },
  { day: "Domingo", type: "Carrera Controlada", target: "Base Aeróbica", time: "Mañana", isRunning: true, zone: "115-135 ppm", duration: "60-75 min", notes: "LÍMITE CORTISOL: No exceder los 75 min. Mantener FC controlada." },
];

// --- COMPONENTES DE UI ---

const SectionHeader = ({ children, icon: Icon, color = "text-emerald-500" }) => (
  <h3 className={`text-xs font-black uppercase tracking-[0.3em] flex items-center mb-5 ${color}`}>
    {Icon && <Icon size={18} className="mr-3" />}
    {children}
  </h3>
);

const ExerciseCard = ({ ex, index, startTimer }) => {
  const [completed, setCompleted] = useState([]);
  const toggle = (i) => {
    if (completed.includes(i)) setCompleted(completed.filter(s => s !== i));
    else { setCompleted([...completed, i]); if(startTimer) startTimer(parseInt(ex.rest)); }
  };

  return (
    <div className="bg-white rounded-[35px] border border-slate-100 shadow-sm mb-6 overflow-hidden transition-all active:shadow-md">
      <div className="p-6">
        <div className="flex justify-between items-start mb-5">
          <div className="flex-1 pr-4">
             <h4 className="font-black text-slate-800 text-lg leading-tight uppercase tracking-tight">{index + 1}. {ex.name}</h4>
          </div>
          <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.yt)}`} target="_blank" rel="noopener noreferrer" className="bg-red-50 text-red-500 p-3 rounded-2xl active:scale-90 transition-transform shadow-sm">
            <PlayCircle size={24} />
          </a>
        </div>
        
        <div className="grid grid-cols-4 gap-2.5 mb-5 font-black text-slate-900">
          {[ 
            { l: 'Sets', v: ex.sets }, { l: 'Reps', v: ex.reps }, { l: 'Tempo', v: ex.tempo }, { l: 'Desc.', v: ex.rest+'s' }
          ].map((item, i) => (
            <div key={i} className="bg-slate-50 p-2.5 rounded-2xl text-center border border-slate-100/50 shadow-inner">
              <p className="text-[9px] text-slate-400 uppercase tracking-widest mb-1">{item.l}</p>
              <p className="text-[12px] tracking-tighter">{item.v}</p>
            </div>
          ))}
        </div>

        {ex.notes && (
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 flex items-start mb-5 shadow-sm">
            <Info size={16} className="text-emerald-600 mr-3 mt-0.5 shrink-0" />
            <p className="text-[11px] font-bold text-emerald-800 leading-snug">{ex.notes}</p>
          </div>
        )}

        <div className="flex gap-2.5 pt-4 border-t border-slate-50">
          {Array.from({ length: ex.sets }).map((_, s) => (
            <button key={s} onClick={() => toggle(s)} className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all border-2 ${completed.includes(s) ? 'bg-emerald-500 text-white border-emerald-600 shadow-lg scale-95' : 'bg-white text-slate-300 border-slate-100 active:border-emerald-200'}`}>
              {s + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const WorkoutView = ({ selectedDay, setSelectedDay, startTimer }) => {
  if (selectedDay === null) {
    return (
      <div className="animate-fade-in space-y-6">
        <SectionHeader icon={Dumbbell}>Escoger Rutina Diaria</SectionHeader>
        <div className="grid gap-4">
          {SCHEDULE.map((day, idx) => (
            <button key={idx} onClick={() => setSelectedDay(idx)} className="w-full text-left bg-white border-2 border-slate-50 rounded-[35px] p-7 shadow-sm border-l-[12px] border-l-emerald-500 flex justify-between items-center active:scale-[0.98] transition-all group">
              <div>
                <span className="font-black text-xl text-slate-900 tracking-tighter uppercase group-active:text-emerald-600">{day.day}</span>
                <p className="text-emerald-600 font-black text-[11px] uppercase tracking-widest mt-1.5">{day.type}</p>
              </div>
              <div className="bg-slate-100 px-4 py-2 rounded-2xl">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{day.time}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const dayData = SCHEDULE[selectedDay];
  return (
    <div className="animate-fade-in space-y-8 pb-10">
      <button onClick={() => setSelectedDay(null)} className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-6 py-3 rounded-[20px] uppercase tracking-widest shadow-sm active:scale-90 transition-all border border-emerald-100">← Volver al Menú</button>
      
      <div className="bg-slate-900 text-white rounded-[55px] p-8 sm:p-10 shadow-2xl border-b-[14px] border-emerald-500 relative overflow-hidden border border-slate-800">
         <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full -mr-24 -mb-24 blur-3xl"></div>
         <h2 className="text-4xl sm:text-6xl font-black text-emerald-400 uppercase tracking-tighter leading-none italic">{dayData.day}</h2>
         <p className="text-xl sm:text-2xl font-bold text-slate-200 mt-3 tracking-tight">{dayData.type}</p>
         <div className="flex gap-4 mt-8 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">
           <span className="flex items-center bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700 shadow-inner"><Activity size={16} className="mr-3 text-emerald-500"/> {dayData.target}</span>
         </div>
      </div>

      {dayData.isRunning && (
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white p-8 rounded-[45px] shadow-2xl shadow-emerald-500/20 border-b-8 border-emerald-900">
            <SectionHeader color="text-emerald-100" icon={Activity}>Estrategia de Running</SectionHeader>
            <div className="grid grid-cols-2 gap-5 mt-4">
              <div className="bg-white/10 p-5 rounded-3xl border border-white/10 shadow-inner text-center"><p className="text-[10px] uppercase font-black opacity-60 tracking-widest mb-1">Duración</p><p className="text-2xl font-black">{dayData.duration}</p></div>
              <div className="bg-white/10 p-5 rounded-3xl border border-white/10 shadow-inner text-center"><p className="text-[10px] uppercase font-black opacity-60 tracking-widest mb-1">Zona FC</p><p className="text-2xl font-black">{dayData.zone}</p></div>
            </div>
            {dayData.notes && (
              <div className="mt-5 bg-red-500/20 border border-red-400/50 p-4 rounded-2xl flex items-start">
                <ShieldAlert size={18} className="text-red-200 mr-3 shrink-0 mt-0.5" />
                <p className="text-[11px] font-bold text-red-100 leading-snug tracking-wide">{dayData.notes}</p>
              </div>
            )}
          </div>
          
          <SectionHeader icon={Zap}>Fase 1: Preparación (10 min)</SectionHeader>
          <div className="space-y-4">
            {RUNNING_WARMUP.map((p, i) => (
              <div key={i} className="bg-white p-6 rounded-[35px] border border-slate-100 shadow-sm flex items-center">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center font-black mr-5 shadow-inner border border-orange-100">{i+1}</div>
                <div><p className="font-black text-sm text-slate-900 uppercase tracking-tight">{p.name} <span className="text-orange-500">[{p.duration}]</span></p><p className="text-[11px] text-slate-500 font-bold mt-1 leading-snug">{p.desc}</p></div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 text-white p-10 rounded-[50px] border-l-[18px] border-emerald-500 shadow-2xl border border-slate-800">
             <SectionHeader color="text-emerald-400" icon={Zap}>Fase 2: Bloque Central</SectionHeader>
             <p className="text-2xl font-black leading-tight italic tracking-tight uppercase">Carrera continua a {dayData.zone}.</p>
             <div className="mt-5 p-5 bg-slate-800/50 rounded-3xl border border-slate-700">
                <p className="text-[11px] text-slate-400 font-bold italic text-center">Utiliza respiración nasal controlada para maximizar la quema de grasas y oxigenación celular.</p>
             </div>
          </div>

          <SectionHeader icon={Wind}>Fase 3: Recuperación (10 min)</SectionHeader>
          <div className="space-y-4">
            {RUNNING_COOLDOWN.map((p, i) => (
              <div key={i} className="bg-white p-6 rounded-[35px] border border-slate-100 shadow-sm flex items-center opacity-85">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center font-black mr-5 shadow-inner border border-blue-100">√</div>
                <div><p className="font-black text-sm text-slate-900 uppercase tracking-tight">{p.name} <span className="text-blue-500">[{p.duration}]</span></p><p className="text-[11px] text-slate-500 font-bold mt-1 leading-snug">{p.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {dayData.exercises && (
        <div className="space-y-8">
          <SectionHeader icon={Zap}>Calentamiento de Fuerza</SectionHeader>
          <div className="bg-orange-50 rounded-[40px] border border-orange-100 p-8 space-y-5 shadow-inner">
            {WARMUP_WEIGHTS.map((w, i) => (
              <div key={i} className="flex items-start">
                <div className="w-8 h-8 rounded-xl bg-orange-200 text-orange-900 flex items-center justify-center text-[11px] font-black shrink-0 mt-0.5 shadow-sm border border-orange-300">{i+1}</div>
                <div className="ml-5"><p className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{w.name} <span className="text-orange-600 font-bold ml-1">[{w.duration}]</span></p><p className="text-[11px] text-slate-600 font-bold mt-1 leading-snug">{w.desc}</p></div>
              </div>
            ))}
          </div>
          <SectionHeader icon={Dumbbell}>Rutina de Pesas</SectionHeader>
          {dayData.exercises.map((ex, i) => <ExerciseCard key={i} ex={ex} index={i} startTimer={startTimer} />)}
        </div>
      )}

      {dayData.hasHIIT && (
        <div className="bg-red-600 text-white rounded-[50px] p-8 sm:p-10 shadow-2xl shadow-red-500/20 mt-12 border-b-[12px] border-red-900 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10"><Flame size={120} /></div>
          <SectionHeader color="text-white" icon={Flame}>Reset Metabólico: HIIT</SectionHeader>
          <div className="space-y-5 relative z-10 font-black">
             <div className="bg-white/10 p-6 rounded-[32px] border border-white/20 backdrop-blur-sm shadow-inner text-center">
                <p className="text-xl leading-tight italic uppercase tracking-tighter">"8 Rondas de Intensidad Máxima"</p>
                <p className="text-[10px] text-red-200 mt-2 tracking-[0.2em] uppercase">Objetivo: Frecuencia Cardíaca {">"} 155 PPM</p>
             </div>
             <div className="grid gap-4">
               <div className="bg-red-700/50 p-5 rounded-[28px] border border-red-400/20 shadow-sm">
                 <div className="flex items-start space-x-4 mb-4">
                   <ArrowRight size={24} className="text-red-300 shrink-0"/>
                   <p className="text-xs uppercase tracking-tight leading-snug">30 seg: Sprints (High Knees) o Shadow Boxing explosivo.</p>
                 </div>
                 <div className="flex flex-col sm:flex-row gap-2 ml-10">
                   <a href="https://www.youtube.com/results?search_query=High+Knees+exercise+form" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-red-900/50 text-white px-4 py-2.5 rounded-xl text-[10px] uppercase tracking-widest active:bg-red-800 transition-colors">
                     <PlayCircle size={16} className="mr-2" /> High Knees
                   </a>
                   <a href="https://www.youtube.com/results?search_query=Shadow+Boxing+workout" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-red-900/50 text-white px-4 py-2.5 rounded-xl text-[10px] uppercase tracking-widest active:bg-red-800 transition-colors">
                     <PlayCircle size={16} className="mr-2" /> Shadow Boxing
                   </a>
                 </div>
               </div>
               <div className="flex items-center space-x-4 bg-slate-900/40 p-5 rounded-[28px] border border-slate-700/50 shadow-sm"><ArrowRight size={24} className="text-slate-300 shrink-0"/><p className="text-xs uppercase tracking-tight leading-snug">60 seg: Marcha suave activa para recuperación.</p></div>
             </div>
          </div>
        </div>
      )}

      {dayData.isMobility && (
        <div className="space-y-8 pb-10">
          <SectionHeader icon={BookOpen}>Recuperación Parasimpática</SectionHeader>
          {[ 
            { n: 'Postura de la Rana', d: '3 min', yt: 'Frog pose mobility yoga hip stretch', desc: 'Apertura profunda de cadera y flujo pélvico.' },
            { n: 'Estiramiento de Psoas', d: '2 min/lado', yt: 'Psoas stretch hip flexor mobility', desc: 'Alivia la tensión lumbar acumulada en la semana.' }
          ].map((m, i) => (
            <div key={i} className="bg-white p-7 rounded-[40px] border border-slate-100 shadow-sm flex justify-between items-center active:scale-[0.98] transition-transform">
              <div className="pr-4">
                 <p className="font-black text-slate-900 text-xl tracking-tighter leading-none uppercase italic">{m.n}</p>
                 <p className="text-[11px] text-emerald-600 font-black uppercase tracking-widest mt-3">{m.d} • {m.desc}</p>
              </div>
              <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(m.yt)}`} target="_blank" rel="noopener noreferrer" className="bg-emerald-50 text-emerald-600 p-4 rounded-3xl shadow-inner active:bg-emerald-100 transition-colors shadow-emerald-500/20 border border-emerald-100 shrink-0">
                <PlayCircle size={28} />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- COACH IA COMPONENT ---
// FIX #8: Lee la apiKey desde localStorage en lugar de string vacío hardcodeado
const CoachIA = () => {
  const [messages, setMessages] = useState([
    { role: 'model', text: '¡Hola Pedro! Soy tu Coach de Bio-Hacking. Conozco perfectamente tu plan: priorizamos la testosterona, cero peso muerto por la diástasis, y controlamos tu IAH con el CPAP. ¿En qué te puedo ayudar hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // FIX #8: Leer apiKey desde localStorage en lugar de string vacío
      const apiKey = (() => {
        try {
          const saved = localStorage.getItem('btp_perfil');
          return saved ? JSON.parse(saved).apiKey || "" : "";
        } catch { return ""; }
      })();

      if (!apiKey) {
        setMessages(prev => [...prev, { role: 'model', text: "No hay API Key configurada. Ve a la pestaña de Perfil en BodyTrack Pro para añadirla." }]);
        setIsLoading(false);
        return;
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }],
          systemInstruction: { parts: [{ text: "Eres el Coach IA personal de Pedro Falcon, un hombre de más de 44 años. Tu objetivo es ayudarle a optimizar su testosterona, mantener a raya el cortisol, y guiarlo en su plan híbrido (pesas + running zona 2). Reglas de Pedro: NUNCA hace peso muerto por su diástasis abdominal, debe exhalar al hacer fuerza, y usa CPAP (meta: IAH < 5.0). Responde de manera motivadora, científica, al punto y siempre en español." }] }
        })
      });
      
      const data = await response.json();
      // FIX #1: optional chaining con índices [0] correctos
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Mmm, tuve un problema de conexión. ¿Puedes repetir eso?";
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Error de red. Intenta conectarte de nuevo." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <div className="bg-indigo-600 text-white p-8 rounded-[40px] shadow-lg border-b-[10px] border-indigo-800 mb-4 shrink-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <SectionHeader color="text-indigo-100" icon={Bot}>Coach Bio-Hacking IA</SectionHeader>
        <p className="text-sm font-black leading-tight italic tracking-tight">Análisis en tiempo real de tu metabolismo y rutinas.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-4 no-scrollbar pb-10">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-[25px] text-sm font-bold leading-snug shadow-sm ${m.role === 'user' ? 'bg-emerald-500 text-white rounded-br-sm' : 'bg-white border border-slate-100 text-slate-700 rounded-bl-sm'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 p-4 rounded-[25px] rounded-bl-sm shadow-sm flex items-center space-x-2 text-indigo-500">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-xs font-black uppercase tracking-widest">Analizando...</span>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="mt-4 bg-white p-2 rounded-full shadow-lg border border-slate-100 flex items-center shrink-0">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Pregúntame sobre tu plan..." 
          className="flex-1 bg-transparent px-4 text-sm font-bold text-slate-700 outline-none"
        />
        <button onClick={handleSend} disabled={isLoading || !input.trim()} className="bg-indigo-500 text-white p-3 rounded-full shadow-md active:scale-95 disabled:opacity-50 transition-all">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

// --- APP COMPONENT MAIN ---
// FIX #7: Eliminado el segundo "export default function App" duplicado.
// Solo existe un único componente App exportado.

export default function App() {
  const [tab, setTab] = useState('home');
  const [statTab, setStatTab] = useState('bio');
  const [selectedDay, setSelectedDay] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [logs, setLogs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('f_logs_v_final_4')) || []; }
    catch { return []; }
  });
  const [form, setForm] = useState({ 
    height: '1.75', weight: '', iah: '', erec: 'Sí', 
    waist: '', hip: '', neck: '', chest: '', arm: '', leg: '', calf: '',
    fat: '', muscle: '', water: '', lean: '', photo: null
  });

  const [cardioLogs, setCardioLogs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('f_cardio_logs_v4')) || []; }
    catch { return []; }
  });
  const [cardioForm, setCardioForm] = useState({ distance: '', time: '', hr: '' });

  useEffect(() => { try { localStorage.setItem('f_logs_v_final_4', JSON.stringify(logs)); } catch {} }, [logs]);
  useEffect(() => { try { localStorage.setItem('f_cardio_logs_v4', JSON.stringify(cardioLogs)); } catch {} }, [cardioLogs]);

  // FIX #3: logs[0].height en lugar de logs.height (logs es un array)
  useEffect(() => {
    if (logs.length > 0 && logs[0].height && !form.height) {
      setForm(prev => ({...prev, height: logs[0].height}));
    }
  }, [logs]);

  useEffect(() => {
    let int = null;
    if (isRunning && timer > 0) int = setInterval(() => setTimer(t => t - 1), 1000);
    else if (timer === 0 && isRunning) {
      setIsRunning(false);
      // FIX #6: vibrate con duración en ms
      if (navigator.vibrate) navigator.vibrate(300);
    }
    return () => clearInterval(int);
  }, [isRunning, timer]);

  const startTimer = (s) => { setTimer(s); setIsRunning(true); };

  const handlePhotoUpload = (e) => {
    // FIX #2: files[0] para obtener el primer archivo; guard si no hay archivo
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
        setForm({ ...form, photo: compressedBase64 });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const saveMetrics = () => {
    if(!form.weight) return;
    
    let icc = '-';
    let imc = '-';
    
    if (form.waist && form.hip && parseFloat(form.hip) > 0) {
      icc = (parseFloat(form.waist) / parseFloat(form.hip)).toFixed(2);
    }
    if (form.weight && form.height && parseFloat(form.height) > 0) {
      imc = (parseFloat(form.weight) / Math.pow(parseFloat(form.height), 2)).toFixed(1);
    }
    
    setLogs([{ id: Date.now(), date: new Date().toLocaleDateString(), ...form, icc, imc }, ...logs]);
    
    setForm(prev => ({ 
      ...prev, weight: '', iah: '', erec: 'Sí', 
      waist: '', hip: '', neck: '', chest: '', arm: '', leg: '', calf: '',
      fat: '', muscle: '', water: '', lean: '', photo: null
    }));
  };

  const saveCardio = () => {
    if(!cardioForm.distance || !cardioForm.time) return;
    const d = parseFloat(cardioForm.distance);
    const t = parseFloat(cardioForm.time);
    let paceFormatted = "0:00";
    if(d > 0 && t > 0) {
      const rawPace = t / d;
      const mins = Math.floor(rawPace);
      const secs = Math.round((rawPace - mins) * 60).toString().padStart(2, '0');
      paceFormatted = `${mins}:${secs}`;
    }
    setCardioLogs([{ id: Date.now(), date: new Date().toLocaleDateString(), ...cardioForm, pace: paceFormatted }, ...cardioLogs]);
    setCardioForm({ distance: '', time: '', hr: '' });
  };

  const handleCalendar = (day) => {
    const dayMap = { "Lunes": "MO", "Martes": "TU", "Miércoles": "WE", "Jueves": "TH", "Viernes": "FR", "Sábado": "SA", "Domingo": "SU" };
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Entreno Falcon: ' + day.type)}&recur=RRULE:FREQ=WEEKLY;BYDAY=${dayMap[day.day]}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] text-slate-900 pb-36 sm:pb-40 font-sans antialiased overflow-x-hidden">
      
      <header className="bg-slate-900 text-white p-5 sm:p-6 sticky top-0 z-50 shadow-xl pt-[max(1.25rem,env(safe-area-inset-top))] border-b border-emerald-500/20 backdrop-blur-xl bg-opacity-95">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div onClick={() => {setTab('home'); setSelectedDay(null);}} className="cursor-pointer active:opacity-70 transition-opacity">
            <h1 className="text-xl sm:text-2xl font-black text-white leading-none tracking-tighter uppercase italic">
              Falcon<span className="text-emerald-400">44+</span>
            </h1>
            <p className="text-[8px] sm:text-[9px] text-emerald-500/80 uppercase font-black tracking-[0.4em] mt-1.5 opacity-80 leading-none">Bio-Hormonal Mastery</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[18px] sm:rounded-[20px] bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center font-black text-white text-base sm:text-lg shadow-xl shadow-emerald-500/30 border border-white/20">PF</div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 sm:p-5">
        
        {tab === 'home' && selectedDay === null && (
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            <div className="bg-slate-900 rounded-[35px] sm:rounded-[45px] p-6 sm:p-7 text-white shadow-xl relative overflow-hidden border border-slate-800 ring-1 ring-white/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -mr-16 -mt-16 blur-3xl animate-pulse"></div>
              <div className="relative z-10 flex items-start space-x-4">
                <div className="bg-red-600 p-3 sm:p-4 rounded-2xl shadow-lg border border-red-500/50">
                  <ShieldAlert size={28} className="text-white" />
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-red-500 mb-1.5">Protocolo Clínico</p>
                  <p className="text-[13px] sm:text-[15px] font-black leading-snug text-slate-100 uppercase tracking-tight italic">Peso muerto prohibido.<br/><span className="text-slate-400 font-bold lowercase text-[11px] sm:text-[12px] opacity-90 tracking-normal">Cierra tu diástasis con exhalación biomecánica.</span></p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <SectionHeader icon={Clock}>Calendario de Optimización</SectionHeader>
              <div className="grid gap-4 sm:gap-5">
                {SCHEDULE.map((d, i) => (
                  <div key={i} onClick={() => { setTab('workout'); setSelectedDay(i); }} className="bg-white p-5 sm:p-7 rounded-[30px] sm:rounded-[40px] border border-slate-100 shadow-sm flex justify-between items-center border-l-[10px] sm:border-l-[14px] border-l-emerald-500 active:scale-[0.96] transition-all hover:shadow-md">
                    <div>
                      <p className="font-black text-slate-900 text-xl sm:text-2xl leading-none tracking-tighter uppercase">{d.day}</p>
                      <p className="text-[10px] sm:text-[11px] text-emerald-600 font-black mt-2 sm:mt-2.5 uppercase tracking-widest leading-none">{d.type}</p>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                       <button onClick={(e) => {e.stopPropagation(); handleCalendar(d);}} className="p-2 sm:p-3.5 text-slate-300 active:text-emerald-500 bg-slate-50 rounded-2xl transition-all shadow-inner"><CalendarPlus size={22}/></button>
                       <ChevronRight size={20} className="text-slate-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'workout' && (
          <WorkoutView selectedDay={selectedDay} setSelectedDay={setSelectedDay} startTimer={startTimer} />
        )}

        {tab === 'diet' && (
          <div className="space-y-6 sm:space-y-8 animate-fade-in text-slate-900">
             <div className="bg-slate-900 text-white rounded-[45px] sm:rounded-[55px] p-10 sm:p-12 text-center shadow-xl border-b-[12px] border-emerald-500 relative overflow-hidden border border-slate-800">
               <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-400/10 rounded-full -mr-20 -mt-20 blur-[80px]"></div>
               <h2 className="text-7xl sm:text-8xl font-black text-emerald-400 tracking-tighter leading-none italic drop-shadow-md">151<span className="text-2xl sm:text-3xl ml-1 uppercase tracking-normal text-white">g</span></h2>
               <p className="text-[10px] sm:text-[12px] font-black uppercase tracking-[0.4em] text-slate-500 mt-6 opacity-80 leading-none">Proteína Diaria Meta</p>
            </div>
            
            <SectionHeader icon={Apple}>Plan de Nutrición</SectionHeader>
            <div className="bg-white p-6 sm:p-8 rounded-[35px] sm:rounded-[45px] border border-slate-100 shadow-sm flex items-center group transition-all active:bg-slate-50">
               <div className="bg-orange-50 p-4 sm:p-5 rounded-[25px] mr-5 sm:mr-7 shrink-0 shadow-inner border border-orange-100"><Apple className="text-orange-500" size={32}/></div>
               <div><h3 className="font-black text-slate-900 uppercase text-sm sm:text-base tracking-tight leading-none">Sólidos (~100g)</h3><p className="text-[11px] sm:text-[13px] text-slate-400 font-bold leading-tight mt-1.5 italic text-slate-500">3 huevos enteros (desayuno) + 200g proteína magra en las comidas principales.</p></div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-[35px] sm:rounded-[45px] border border-slate-100 shadow-sm flex items-center group transition-all active:bg-slate-50">
               <div className="bg-blue-50 p-4 sm:p-5 rounded-[25px] mr-5 sm:mr-7 shrink-0 shadow-inner border border-blue-100"><Activity className="text-blue-500" size={32}/></div>
               <div>
                  <h3 className="font-black text-slate-900 uppercase text-sm sm:text-base tracking-tight leading-none">Isolate (~50g)</h3>
                  <p className="text-[11px] sm:text-[13px] text-slate-500 font-bold leading-tight mt-1.5 italic">1 scoop post-entreno y 1 scoop a las 4:00 PM (con AGUA). Cero lactosa para evitar picos de estrógenos.</p>
               </div>
            </div>

            <div className="bg-slate-900 p-8 sm:p-10 rounded-[45px] sm:rounded-[55px] text-white shadow-2xl border border-slate-800">
               <SectionHeader color="text-emerald-400" icon={Zap}>Stack de Suplementación</SectionHeader>
               <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
                 {[ 
                   { n: 'Zinc', v: '50mg', l: 'Anti-Aromatasa' },
                   { n: 'Citrulina', v: '6g', l: 'Óxido Nítrico' },
                   { n: 'Magnesio', v: '400mg', l: 'Recuperación' },
                   { n: 'D3+K2', v: '5000 UI', l: 'Hormona Base' }
                 ].map((s, i) => (
                   <div key={i} className="bg-slate-800/40 p-5 rounded-[28px] border border-slate-700 shadow-inner">
                     <p className="text-[8px] sm:text-[9px] text-slate-500 uppercase font-black mb-1.5 tracking-widest leading-none">{s.l}</p>
                     <p className="text-base sm:text-lg font-black text-white leading-none">{s.n}</p>
                     <p className="text-[10px] sm:text-[12px] font-bold text-emerald-400 mt-2 leading-none">{s.v}</p>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {tab === 'stats' && (
          <div className="space-y-6 animate-fade-in pb-12 text-slate-900">
            
            <div className="bg-slate-200/60 p-1.5 rounded-full flex mx-auto w-full max-w-[240px] shadow-inner mb-6">
              <button onClick={() => setStatTab('bio')} className={`flex-1 py-3 px-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${statTab === 'bio' ? 'bg-white text-emerald-600 shadow-sm scale-100' : 'text-slate-500 hover:text-slate-700'}`}>Físico & Salud</button>
              <button onClick={() => setStatTab('cardio')} className={`flex-1 py-3 px-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${statTab === 'cardio' ? 'bg-white text-emerald-600 shadow-sm scale-100' : 'text-slate-500 hover:text-slate-700'}`}>Cardio Z2</button>
            </div>

            {statTab === 'bio' && (
              <div className="space-y-6">
                <div className="bg-white rounded-[35px] border border-slate-100 p-6 shadow-sm">
                  <SectionHeader icon={LineChart} color="text-indigo-500">Evaluación Biológica</SectionHeader>
                  
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">1. Medidas Base & Descanso</h4>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-[0.1em]">Altura (m)</label>
                      <input type="number" step="0.01" value={form.height} onChange={e=>setForm({...form, height:e.target.value})} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black outline-none focus:border-indigo-500 transition-all text-center shadow-inner font-mono" placeholder="1.75" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-[0.1em]">Peso (kg)</label>
                      <input type="number" step="0.1" value={form.weight} onChange={e=>setForm({...form, weight:e.target.value})} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black outline-none focus:border-indigo-500 transition-all text-center shadow-inner font-mono" placeholder="00.0" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-indigo-500 uppercase ml-2 tracking-[0.1em]">IAH (CPAP)</label>
                      <input type="number" step="0.1" value={form.iah} onChange={e=>setForm({...form, iah:e.target.value})} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black outline-none focus:border-indigo-500 transition-all text-center shadow-inner font-mono" placeholder="0.0" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-[0.1em]">Erección</label>
                      <select value={form.erec} onChange={e=>setForm({...form, erec:e.target.value})} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black outline-none appearance-none text-center shadow-inner bg-no-repeat">
                        <option>Sí</option><option>No</option>
                      </select>
                    </div>
                  </div>

                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">2. Composición (Báscula)</h4>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-emerald-500 uppercase ml-2 tracking-[0.1em]">Grasa %</label>
                      <input type="number" step="0.1" value={form.fat} onChange={e=>setForm({...form, fat:e.target.value})} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black outline-none focus:border-emerald-500 transition-all text-center shadow-inner font-mono text-emerald-700" placeholder="00.0" />
                      <p className="text-[8px] text-center text-slate-400 font-bold uppercase mt-1">Normal: 15-20%</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-blue-500 uppercase ml-2 tracking-[0.1em]">Músculo %</label>
                      <input type="number" step="0.1" value={form.muscle} onChange={e=>setForm({...form, muscle:e.target.value})} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black outline-none focus:border-blue-500 transition-all text-center shadow-inner font-mono text-blue-700" placeholder="00.0" />
                      <p className="text-[8px] text-center text-slate-400 font-bold uppercase mt-1">Normal: 33-39%</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-cyan-500 uppercase ml-2 tracking-[0.1em]">Agua %</label>
                      <input type="number" step="0.1" value={form.water} onChange={e=>setForm({...form, water:e.target.value})} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black outline-none focus:border-cyan-500 transition-all text-center shadow-inner font-mono text-cyan-700" placeholder="00.0" />
                      <p className="text-[8px] text-center text-slate-400 font-bold uppercase mt-1">Normal: 50-65%</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-orange-500 uppercase ml-2 tracking-[0.1em]">M. Magra (kg)</label>
                      <input type="number" step="0.1" value={form.lean} onChange={e=>setForm({...form, lean:e.target.value})} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black outline-none focus:border-orange-500 transition-all text-center shadow-inner font-mono text-orange-700" placeholder="00.0" />
                      <p className="text-[8px] text-center text-slate-400 font-bold uppercase mt-1">Hueso + Músculo</p>
                    </div>
                  </div>

                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">3. Perímetros (Cinta)</h4>
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {['Cintura', 'Cadera', 'Cuello', 'Pecho', 'Brazo', 'Pierna', 'Pantorrilla'].map((metric, i) => {
                      const keys = ['waist', 'hip', 'neck', 'chest', 'arm', 'leg', 'calf'];
                      return (
                        <div key={i} className="space-y-1">
                          <label className="text-[8px] font-black text-slate-400 uppercase ml-1 tracking-tight">{metric}</label>
                          <input type="number" step="0.1" value={form[keys[i]]} onChange={e=>setForm({...form, [keys[i]]:e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black outline-none focus:border-indigo-500 transition-all text-center shadow-inner font-mono" placeholder="00" />
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {form.weight && form.height && (
                      <div className="bg-indigo-50 p-4 rounded-[20px] border border-indigo-100 flex flex-col justify-center items-center shadow-inner">
                        <p className="text-[9px] font-black uppercase text-indigo-800 tracking-widest mb-1">IMC</p>
                        <span className="text-2xl font-black text-indigo-600">{(parseFloat(form.weight) / Math.pow(parseFloat(form.height), 2)).toFixed(1)}</span>
                        <p className="text-[8px] font-bold text-indigo-400 mt-1 uppercase">Normal: 18.5 - 24.9</p>
                      </div>
                    )}
                    {form.waist && form.hip && (
                      <div className={`p-4 rounded-[20px] border flex flex-col justify-center items-center shadow-inner ${(form.waist/form.hip).toFixed(2) >= 0.90 ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                        <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${(form.waist/form.hip).toFixed(2) >= 0.90 ? 'text-red-800' : 'text-emerald-800'}`}>ICC</p>
                        <span className={`text-2xl font-black ${(form.waist/form.hip).toFixed(2) >= 0.90 ? 'text-red-500' : 'text-emerald-600'}`}>{(form.waist/form.hip).toFixed(2)}</span>
                        <p className={`text-[8px] font-bold mt-1 uppercase ${(form.waist/form.hip).toFixed(2) >= 0.90 ? 'text-red-400' : 'text-emerald-500'}`}>Riesgo si {">"} 0.90</p>
                      </div>
                    )}
                  </div>

                  <div className="mb-2">
                    <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-indigo-200 rounded-2xl bg-indigo-50/50 cursor-pointer active:bg-indigo-50 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-2">
                        {form.photo ? <CheckCircle size={24} className="text-emerald-500 mb-1" /> : <Camera size={24} className="text-indigo-400 mb-1" />}
                        <p className="text-[9px] font-black text-indigo-900 uppercase tracking-widest mt-1">
                          {form.photo ? 'Foto Adjuntada' : 'Tomar Foto Progreso'}
                        </p>
                      </div>
                      <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload} />
                    </label>
                  </div>

                  <button onClick={saveMetrics} className="w-full bg-indigo-600 text-white p-4 rounded-2xl font-black text-xs active:scale-95 shadow-md shadow-indigo-500/30 uppercase tracking-[0.2em] mt-3 transition-all border-b-4 border-indigo-800">
                    Guardar Evaluación
                  </button>
                </div>

                {logs.length > 0 && (
                  <div className="space-y-4">
                    <SectionHeader icon={ImageIcon} color="text-slate-400">Historial de Revisiones</SectionHeader>
                    {logs.map(l => (
                      <div key={l.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                           <span className="text-xs font-black text-slate-800 uppercase tracking-widest">{l.date}</span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase">Erec: <span className="text-slate-700">{l.erec}</span> | IAH: <span className="text-indigo-500">{l.iah || '-'}</span></span>
                        </div>
                        
                        <div className="flex items-start space-x-4">
                          {l.photo ? (
                            <div className="w-24 h-28 rounded-2xl bg-slate-200 shrink-0 overflow-hidden shadow-inner border border-slate-300">
                              <img src={l.photo} alt="Progreso" className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-24 h-28 rounded-2xl bg-slate-50 shrink-0 flex flex-col items-center justify-center shadow-inner border border-slate-200 border-dashed">
                               <ImageIcon size={24} className="text-slate-300 mb-2" />
                               <span className="text-[8px] text-slate-400 font-bold uppercase">Sin Foto</span>
                            </div>
                          )}
                          <div className="flex-1 grid grid-cols-2 gap-x-2 gap-y-3 text-[10px] font-bold text-slate-500">
                            <div><span className="block text-[8px] uppercase tracking-widest text-slate-400">Peso / IMC</span><span className="text-sm font-black text-slate-800">{l.weight}k <span className="text-xs text-indigo-500">({l.imc})</span></span></div>
                            <div><span className="block text-[8px] uppercase tracking-widest text-slate-400">ICC (Cint/Cad)</span><span className="text-sm font-black text-slate-800">{l.icc}</span></div>
                            <div><span className="block text-[8px] uppercase tracking-widest text-slate-400">Grasa / Músc.</span><span className="text-sm font-black text-slate-800">{l.fat?l.fat+'%':'-'} / {l.muscle?l.muscle+'%':'-'}</span></div>
                            <div><span className="block text-[8px] uppercase tracking-widest text-slate-400">Pecho / Brazo</span><span className="text-sm font-black text-slate-800">{l.chest || '-'} / {l.arm || '-'}</span></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {statTab === 'cardio' && (
              <div className="bg-white rounded-[35px] border border-slate-100 p-5 sm:p-6 shadow-sm animate-fade-in">
                <SectionHeader icon={ActivitySquare} color="text-orange-500">Progreso Zona 2</SectionHeader>
                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 mb-5 shadow-inner">
                   <p className="text-[10px] text-orange-800 font-bold text-center italic leading-tight">"La meta no es correr más rápido, es recorrer más distancia manteniendo la misma frecuencia cardíaca baja."</p>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-5">
                  <div className="space-y-1 col-span-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-tight">Dist(km)</label>
                    <input type="number" step="0.01" value={cardioForm.distance} onChange={e=>setCardioForm({...cardioForm, distance:e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black outline-none focus:border-orange-500 transition-all text-center shadow-inner font-mono" placeholder="5.0" />
                  </div>
                  <div className="space-y-1 col-span-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-1 tracking-tight">Tiem(min)</label>
                    <input type="number" value={cardioForm.time} onChange={e=>setCardioForm({...cardioForm, time:e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black outline-none focus:border-orange-500 transition-all text-center shadow-inner font-mono" placeholder="45" />
                  </div>
                  <div className="space-y-1 col-span-1">
                    <label className="text-[9px] font-black text-red-500 uppercase ml-1 tracking-tight">FC(ppm)</label>
                    <input type="number" value={cardioForm.hr} onChange={e=>setCardioForm({...cardioForm, hr:e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black outline-none focus:border-red-500 transition-all text-center shadow-inner font-mono text-red-600" placeholder="115" />
                  </div>
                  <button onClick={saveCardio} className="col-span-3 bg-orange-500 text-white p-3.5 rounded-xl font-black text-xs active:scale-95 shadow-md shadow-orange-500/30 uppercase tracking-[0.2em] mt-2 transition-all border-b-4 border-orange-700">
                    Guardar Carrera
                  </button>
                </div>

                {cardioLogs.length > 0 && (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100 shadow-sm bg-white">
                    <table className="w-full text-left text-[10px] sm:text-[11px]">
                      <thead className="bg-slate-900 text-white font-black uppercase tracking-widest">
                        <tr className="border-b border-slate-800">
                          <th className="px-1 py-3 text-center">Fecha</th>
                          <th className="px-1 py-3 text-center">Dist</th>
                          <th className="px-1 py-3 text-center text-orange-400">Ritmo</th>
                          <th className="px-1 py-3 text-center text-red-400">PPM</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {cardioLogs.map(l => {
                          // FIX #4: Formato de fecha correcto usando split y join
                          const dateParts = l.date.split('/');
                          const shortDate = dateParts.length >= 2 ? `${dateParts[0]}/${dateParts[1]}` : l.date;
                          return (
                            <tr key={l.id} className="font-bold text-slate-700 active:bg-slate-50">
                              <td className="px-1 py-3 text-center text-slate-400 tracking-tight">{shortDate}</td>
                              <td className="px-1 py-3 text-center tracking-tight">{l.distance}k</td>
                              <td className="px-1 py-3 text-center text-orange-600 font-black italic tracking-tighter">{l.pace} <span className="text-[8px] opacity-60">/k</span></td>
                              <td className="px-1 py-3 text-center text-red-600">{l.hr || '-'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {tab === 'coach' && (
          <div className="animate-fade-in">
            <CoachIA />
          </div>
        )}
      </main>

      {/* FIX #5: z-50 en lugar de z- (clase CSS inválida) */}
      {(timer > 0 || isRunning) && (
        <div className="fixed bottom-[85px] sm:bottom-28 left-1/2 -translate-x-1/2 w-[90%] max-w-[360px] bg-slate-900 text-white px-5 py-4 sm:px-6 sm:py-5 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex items-center justify-between z-50 border-2 border-emerald-500/30 animate-fade-in backdrop-blur-2xl bg-opacity-95 ring-4 ring-slate-900/40">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative">
              <Timer size={28} className={timer === 0 ? "text-red-500 animate-pulse" : "text-emerald-400"} />
              {isRunning && <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-30 animate-pulse"></div>}
            </div>
            <span className="font-mono font-black text-4xl sm:text-5xl tracking-tighter tabular-nums text-emerald-400 drop-shadow-md italic">{Math.floor(timer/60)}:{(timer%60).toString().padStart(2, '0')}</span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button onClick={() => setIsRunning(!isRunning)} className="bg-slate-800 p-3 sm:p-4 rounded-[20px] active:scale-90 transition-transform border border-slate-700 shadow-lg">
              {isRunning ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" />}
            </button>
            <button onClick={() => {setTimer(0); setIsRunning(false)}} className="text-red-400 font-black text-3xl sm:text-4xl leading-none hover:text-red-500 active:scale-75 transition-all px-2">×</button>
          </div>
        </div>
      )}

      <nav className="bg-slate-900 fixed bottom-0 w-full border-t border-slate-800 z-50 pb-[env(safe-area-inset-bottom)] shadow-[0_-15px_40px_rgba(0,0,0,0.6)] backdrop-blur-md bg-opacity-98">
        <div className="max-w-md mx-auto flex justify-between items-center px-1 sm:px-2">
          {[
            { id: 'home', icon: Home, label: 'Inicio' },
            { id: 'workout', icon: Dumbbell, label: 'Entreno' },
            { id: 'diet', icon: Apple, label: 'Dieta' },
            { id: 'stats', icon: Activity, label: 'Avance' },
            { id: 'coach', icon: Bot, label: 'Coach IA' }
          ].map((item) => (
            <button key={item.id} onClick={() => {setTab(item.id); setSelectedDay(null);}} className={`flex flex-col items-center justify-center w-[20%] py-4 sm:py-5 transition-all duration-300 ${tab === item.id ? 'text-emerald-400 -translate-y-1' : 'text-slate-500 hover:text-slate-400'}`}>
              <item.icon size={22} className={tab === item.id ? "drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" : ""} />
              <span className="text-[8px] sm:text-[9px] mt-1.5 font-black tracking-widest uppercase w-full text-center truncate px-0.5">{item.label}</span>
              {tab === item.id && <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 shadow-[0_0_8px_rgba(52,211,153,1)]"></div>}
            </button>
          ))}
        </div>
      </nav>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s cubic-bezier(0.19, 0.22, 1) forwards; }
        body { -webkit-tap-highlight-color: transparent; background-color: #fcfdfe; }
        * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}