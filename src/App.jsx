import React, { useState, useEffect } from 'react';
import { 
  Home, Dumbbell, Apple, Activity, BookOpen, PlayCircle, Clock, Info,
  ShieldAlert, Zap, Flame, Plus, Trash2, LineChart, Timer, X,
  Pause, Play, CalendarPlus, CheckCircle, ArrowRight, Wind, ChevronRight
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
  { name: "Curl de Isquiotibiales", sets: 3, reps: "12-15", tempo: "3-1-2-1", rest: "60", yt: "Dumbbell lying leg curl bench", notes: "Acuéstate boca abajo en el banco." },
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
  { day: "Martes", type: "Cardio Zona 2", target: "Grasa Visceral", time: "4AM / 7PM", isRunning: true, zone: "105-123 ppm", duration: "45-60 min" },
  { day: "Miércoles", type: "Empuje (B)", target: "Pectoral / Gineco", time: "4AM / 7PM", exercises: BLOCK_B, hasWarmup: true },
  { day: "Jueves", type: "Pierna & Core (A)", target: "Salud Pélvica", time: "4AM / 7PM", exercises: BLOCK_A, hasWarmup: true },
  { day: "Viernes", type: "Tracción (C) + HIIT", target: "Postura / GH", time: "4AM / 7PM", exercises: BLOCK_C, hasWarmup: true, hasHIIT: true },
  { day: "Sábado", type: "Resistencia 10k", target: "Salud Cardíaca", time: "Mañana", isRunning: true, zone: "125-145 ppm", duration: "80-100 min" },
  { day: "Domingo", type: "Movilidad Activa", target: "Cortisol", time: "Mañana", isMobility: true },
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
      
      <div className="bg-slate-900 text-white rounded-[55px] p-10 shadow-2xl border-b-[14px] border-emerald-500 relative overflow-hidden border border-slate-800">
         <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full -mr-24 -mb-24 blur-3xl"></div>
         <h2 className="text-6xl font-black text-emerald-400 uppercase tracking-tighter leading-none italic">{dayData.day}</h2>
         <p className="text-2xl font-bold text-slate-200 mt-3 tracking-tight">{dayData.type}</p>
         <div className="flex gap-4 mt-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">
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
        <div className="bg-red-600 text-white rounded-[50px] p-10 shadow-2xl shadow-red-500/20 mt-12 border-b-[12px] border-red-900 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10"><Flame size={120} /></div>
          <SectionHeader color="text-white" icon={Flame}>Reset Metabólico: HIIT</SectionHeader>
          <div className="space-y-5 relative z-10 font-black">
             <div className="bg-white/10 p-6 rounded-[32px] border border-white/20 backdrop-blur-sm shadow-inner text-center">
                <p className="text-xl leading-tight italic uppercase tracking-tighter">"8 Rondas de Intensidad Máxima"</p>
                <p className="text-[10px] text-red-200 mt-2 tracking-[0.2em] uppercase">Objetivo: Frecuencia Cardíaca {">"} 155 PPM</p>
             </div>
             <div className="grid gap-4">
               <div className="flex items-center space-x-5 bg-red-700/50 p-5 rounded-[28px] border border-red-400/20 shadow-sm transition-transform active:scale-95"><ArrowRight size={24} className="text-red-300"/><p className="text-xs uppercase tracking-tight">30 seg: Sprints (High Knees) o Shadow Boxing explosivo.</p></div>
               <div className="flex items-center space-x-5 bg-slate-900/40 p-5 rounded-[28px] border border-slate-700/50 shadow-sm transition-transform active:scale-95"><ArrowRight size={24} className="text-slate-300"/><p className="text-xs uppercase tracking-tight">60 seg: Marcha suave activa para recuperación parcial.</p></div>
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
              <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(m.yt)}`} target="_blank" rel="noopener noreferrer" className="bg-emerald-50 text-emerald-600 p-4 rounded-3xl shadow-inner active:bg-emerald-100 transition-colors shadow-emerald-500/20 border border-emerald-100">
                <PlayCircle size={28} />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- APP COMPONENT ---

export default function App() {
  const [tab, setTab] = useState('home');
  const [selectedDay, setSelectedDay] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Persistencia de Logs
  const [logs, setLogs] = useState(() => JSON.parse(localStorage.getItem('f_logs_v_final_1')) || []);
  const [form, setForm] = useState({ weight: '', waist: '', iah: '', erec: 'Sí' });

  useEffect(() => localStorage.setItem('f_logs_v_final_1', JSON.stringify(logs)), [logs]);

  useEffect(() => {
    let int = null;
    if (isRunning && timer > 0) int = setInterval(() => setTimer(t => t - 1), 1000);
    else if (timer === 0 && isRunning) {
      setIsRunning(false);
      if (navigator.vibrate) navigator.vibrate([500, 200, 500]);
    }
    return () => clearInterval(int);
  }, [isRunning, timer]);

  const startTimer = (s) => { setTimer(s); setIsRunning(true); };

  const saveMetrics = () => {
    if(!form.weight && !form.iah) return;
    setLogs([{ id: Date.now(), date: new Date().toLocaleDateString(), ...form }, ...logs]);
    setForm({ weight: '', waist: '', iah: '', erec: 'Sí' });
  };

  const handleCalendar = (day) => {
    const dayMap = { "Lunes": "MO", "Martes": "TU", "Miércoles": "WE", "Jueves": "TH", "Viernes": "FR", "Sábado": "SA", "Domingo": "SU" };
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Entreno Falcon: ' + day.type)}&recur=RRULE:FREQ=WEEKLY;BYDAY=${dayMap[day.day]}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] text-slate-900 pb-40 font-sans antialiased overflow-x-hidden">
      
      {/* HEADER PREMIUM */}
      <header className="bg-slate-900 text-white p-6 sticky top-0 z-50 shadow-2xl pt-[max(1.5rem,env(safe-area-inset-top))] border-b border-emerald-500/20 backdrop-blur-xl bg-opacity-95">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div onClick={() => {setTab('home'); setSelectedDay(null);}} className="cursor-pointer active:opacity-70 transition-opacity">
            <h1 className="text-2xl font-black text-white leading-none tracking-tighter uppercase italic">
              Falcon<span className="text-emerald-400">44+</span>
            </h1>
            <p className="text-[9px] text-emerald-500/80 uppercase font-black tracking-[0.4em] mt-2 ml-0.5 opacity-80 leading-none">Bio-Hormonal Mastery</p>
          </div>
          <div className="w-12 h-12 rounded-[20px] bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center font-black text-white text-lg shadow-2xl shadow-emerald-500/30 border border-white/20">PF</div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-5">
        
        {/* TAB: INICIO */}
        {tab === 'home' && selectedDay === null && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-slate-900 rounded-[45px] p-7 text-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden border border-slate-800 ring-1 ring-white/5 transition-transform active:scale-[0.98]">
              <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/10 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse"></div>
              <div className="relative z-10 flex items-start space-x-5">
                <div className="bg-red-600 p-4 rounded-[22px] shadow-2xl shadow-red-600/40 border border-red-500/50">
                  <ShieldAlert size={32} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 mb-2">Protocolo Clínico</p>
                  <p className="text-[15px] font-black leading-snug text-slate-100 uppercase tracking-tight italic">Peso muerto prohibido.<br/><span className="text-slate-400 font-bold lowercase text-[12px] opacity-90 tracking-normal">Cierra tu diástasis con exhalación biomecánica.</span></p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <SectionHeader icon={Clock}>Calendario de Optimización</SectionHeader>
              <div className="grid gap-5">
                {SCHEDULE.map((d, i) => (
                  <div key={i} onClick={() => { setTab('workout'); setSelectedDay(i); }} className="bg-white p-7 rounded-[40px] border border-slate-100 shadow-sm flex justify-between items-center border-l-[14px] border-l-emerald-500 active:scale-[0.96] transition-all hover:shadow-md">
                    <div>
                      <p className="font-black text-slate-900 text-2xl leading-none tracking-tighter uppercase">{d.day}</p>
                      <p className="text-[11px] text-emerald-600 font-black mt-2.5 uppercase tracking-widest leading-none">{d.type}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                       <button onClick={(e) => {e.stopPropagation(); handleCalendar(d);}} className="p-3.5 text-slate-300 active:text-emerald-500 bg-slate-50 rounded-2xl transition-all shadow-inner"><CalendarPlus size={24}/></button>
                       <ChevronRight size={22} className="text-slate-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: ENTRENO */}
        {tab === 'workout' && (
          <WorkoutView selectedDay={selectedDay} setSelectedDay={setSelectedDay} startTimer={startTimer} />
        )}

        {/* TAB: DIETA */}
        {tab === 'diet' && (
          <div className="space-y-8 animate-fade-in text-slate-900">
             <div className="bg-slate-900 text-white rounded-[55px] p-12 text-center shadow-[0_30px_60px_-12px_rgba(0,0,0,0.6)] border-b-[15px] border-emerald-500 relative overflow-hidden border border-slate-800">
               <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/10 rounded-full -mr-24 -mt-24 blur-[100px]"></div>
               <h2 className="text-8xl font-black text-emerald-400 tracking-tighter leading-none italic drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]">151<span className="text-3xl ml-2 uppercase tracking-normal text-white">g</span></h2>
               <p className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-500 mt-8 ml-2 opacity-80 leading-none">Proteína Diaria Meta</p>
            </div>
            
            <SectionHeader icon={Apple}>Plan de Nutrición</SectionHeader>
            <div className="bg-white p-8 rounded-[45px] border border-slate-100 shadow-sm flex items-center group transition-all active:bg-slate-50">
               <div className="bg-orange-50 p-5 rounded-[30px] mr-7 shrink-0 shadow-inner border border-orange-100"><Apple className="text-orange-500" size={40}/></div>
               <div><h3 className="font-black text-slate-900 uppercase text-base tracking-tight leading-none">Sólidos (~100g)</h3><p className="text-[13px] text-slate-400 font-bold leading-tight mt-2 italic text-slate-500">3 huevos enteros (desayuno) + 200g proteína magra en las comidas principales. Prioriza brócoli y coliflor.</p></div>
            </div>

            <div className="bg-slate-900 p-10 rounded-[55px] text-white shadow-2xl border border-slate-800">
               <SectionHeader color="text-emerald-400" icon={Zap}>Stack de Suplementación</SectionHeader>
               <div className="grid grid-cols-2 gap-6 mt-8">
                 {[ 
                   { n: 'Zinc', v: '50mg', l: 'Anti-Aromatasa' },
                   { n: 'Citrulina', v: '6g', l: 'Vasodilatación' },
                   { n: 'Magnesio', v: '400mg', l: 'Recuperación' },
                   { n: 'D3+K2', v: '5000 UI', l: 'Hormona Base' }
                 ].map((s, i) => (
                   <div key={i} className="bg-slate-800/40 p-6 rounded-[35px] border border-slate-700 shadow-inner active:bg-emerald-500/10 transition-colors">
                     <p className="text-[9px] text-slate-500 uppercase font-black mb-2 tracking-widest leading-none">{s.l}</p>
                     <p className="text-lg font-black text-white leading-none">{s.n}</p>
                     <p className="text-[12px] font-bold text-emerald-400 mt-2.5 leading-none">{s.v}</p>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {/* TAB: MÉTRICAS */}
        {tab === 'stats' && (
          <div className="space-y-8 animate-fade-in pb-12 text-slate-900">
            <div className="bg-white rounded-[50px] border border-slate-100 p-10 shadow-sm">
              <SectionHeader icon={LineChart}>Monitoreo Biométrico</SectionHeader>
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="space-y-2 col-span-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase ml-4 tracking-[0.3em]">Peso (kg)</label>
                  <input type="number" value={form.weight} onChange={e=>setForm({...form, weight:e.target.value})} className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[30px] text-2xl font-black outline-none focus:border-emerald-500 transition-all text-center shadow-inner font-mono" placeholder="00" />
                </div>
                <div className="space-y-2 col-span-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase ml-4 tracking-[0.3em]">Cintura (cm)</label>
                  <input type="number" value={form.waist} onChange={e=>setForm({...form, waist:e.target.value})} className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[30px] text-2xl font-black outline-none focus:border-emerald-500 transition-all text-center shadow-inner font-mono" placeholder="00" />
                </div>
                <div className="space-y-2 col-span-1">
                  <label className="text-[11px] font-black text-indigo-500 uppercase ml-4 tracking-[0.3em]">IAH (CPAP)</label>
                  <input type="number" value={form.iah} onChange={e=>setForm({...form, iah:e.target.value})} className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[30px] text-2xl font-black outline-none focus:border-indigo-500 transition-all text-center shadow-inner font-mono" placeholder="0.0" />
                </div>
                <div className="space-y-2 col-span-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase ml-4 tracking-[0.3em]">Erección</label>
                  <select value={form.erec} onChange={e=>setForm({...form, erec:e.target.value})} className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[30px] text-sm font-black outline-none appearance-none text-center shadow-inner bg-no-repeat">
                    <option>Sí</option><option>No</option>
                  </select>
                </div>
                <button onClick={saveMetrics} className="col-span-2 bg-emerald-600 text-white p-7 rounded-[30px] font-black text-sm active:scale-95 shadow-[0_20px_40px_rgba(16,185,129,0.3)] uppercase tracking-[0.4em] mt-6 transition-all border-b-8 border-emerald-800">
                  Registrar Avance
                </button>
              </div>

              {logs.length > 0 && (
                <div className="mt-12 overflow-hidden rounded-[40px] border border-slate-100 shadow-2xl bg-white">
                  <table className="w-full text-left text-[12px]">
                    <thead className="bg-slate-900 text-white font-black uppercase tracking-[0.15em]"><tr className="border-b border-slate-800">
                      <th className="p-5 text-center">Fecha</th><th className="p-5 text-center">Kg</th><th className="p-5 text-center">IAH</th><th className="p-5 text-center">Erec.</th>
                    </tr></thead>
                    <tbody className="divide-y divide-slate-50">
                      {logs.map(l => <tr key={l.id} className="font-black text-slate-700 active:bg-slate-50 transition-colors">
                        <td className="p-5 text-center text-slate-400 font-bold tracking-tighter">{l.date.split('/')[0]+'/'+l.date.split('/')[1]}</td>
                        <td className="p-5 text-center text-emerald-600 font-black italic tracking-tighter">{l.weight}k</td>
                        <td className="p-5 text-center text-indigo-600 tracking-tighter">{l.iah || '-'}</td>
                        <td className="p-5 text-center uppercase text-[10px] tracking-widest">{l.erec}</td>
                      </tr>)}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: GUÍA */}
        {tab === 'guide' && (
          <div className="space-y-8 animate-fade-in pb-12">
            <div className="bg-emerald-600 text-white p-12 rounded-[60px] shadow-[0_25px_50px_-12px_rgba(16,185,129,0.4)] border-b-[15px] border-emerald-800 relative overflow-hidden transition-transform active:scale-[0.98]">
               <div className="absolute top-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mt-24 blur-3xl opacity-60"></div>
              <SectionHeader color="text-emerald-100" icon={ShieldAlert}>Respiración Biomecánica</SectionHeader>
              <p className="text-lg font-black leading-tight italic border-l-4 border-white/30 pl-7 tracking-tight uppercase">"Sopla el aire con fuerza absoluta y contrae el ombligo mientras vences la carga."</p>
              <p className="text-[12px] font-bold text-emerald-100 mt-5 opacity-90 leading-snug">Esto activa el transverso abdominal, creando una faja de seguridad biológica para tu diástasis en cada esfuerzo.</p>
            </div>
            
            <div className="bg-white p-10 rounded-[45px] border-l-[20px] border-indigo-500 shadow-sm hover:shadow-md transition-shadow ring-1 ring-slate-100">
              <h4 className="font-black text-indigo-900 text-lg uppercase mb-3 tracking-tighter">Oxigenación CPAP</h4>
              <p className="text-sm text-slate-500 font-black leading-snug tracking-tight">"Sin oxigenación nocturna, el entreno no servirá para ganar músculo, solo te fatigará más. Mantén tu IAH bajo 5.0 siempre."</p>
            </div>

            <div className="bg-white p-10 rounded-[45px] border-l-[20px] border-orange-500 shadow-sm hover:shadow-md transition-shadow ring-1 ring-slate-100">
              <h4 className="font-black text-orange-900 text-lg uppercase mb-3 tracking-tighter">Doble Progresión</h4>
              <p className="text-sm text-slate-500 font-black leading-snug tracking-tight uppercase">Prioriza el TEMPO 3-1-2-1.<br/><span className="text-slate-400 font-bold lowercase text-[12px]">Sube peso solo si mantienes el control abdominal perfecto en cada repetición.</span></p>
            </div>
          </div>
        )}
      </main>

      {/* TIMER PREMIUM FLOTANTE */}
      {(timer > 0 || isRunning) && (
        <div className="fixed bottom-36 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-12 py-8 rounded-[80px] shadow-[0_50px_100px_rgba(0,0,0,0.6)] flex items-center space-x-12 z-[100] border-2 border-emerald-500/30 animate-fade-in backdrop-blur-3xl bg-opacity-95 ring-8 ring-slate-900/40">
          <div className="relative">
            <Timer size={44} className={timer === 0 ? "text-red-500 animate-pulse" : "text-emerald-400"} />
            {isRunning && <div className="absolute inset-0 bg-emerald-400 rounded-full blur-3xl opacity-40 animate-pulse"></div>}
          </div>
          <span className="font-mono font-black text-7xl w-44 text-center tracking-tighter tabular-nums text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.4)] italic">{Math.floor(timer/60)}:{(timer%60).toString().padStart(2, '0')}</span>
          <div className="flex space-x-6">
            <button onClick={() => setIsRunning(!isRunning)} className="bg-slate-800 p-6 rounded-[35px] active:scale-90 transition-transform border border-slate-700 shadow-2xl">
              {isRunning ? <Pause size={40} fill="white" /> : <Play size={40} fill="white" />}
            </button>
            <button onClick={() => {setTimer(0); setIsRunning(false)}} className="text-red-400 font-black text-6xl leading-none hover:text-red-500 active:scale-75 transition-all">×</button>
          </div>
        </div>
      )}

      {/* NAVEGACIÓN INFERIOR PREMIUM */}
      <nav className="bg-slate-900 fixed bottom-0 w-full border-t border-slate-800 z-50 pb-[env(safe-area-inset-bottom)] shadow-[0_-25px_60px_rgba(0,0,0,0.6)] backdrop-blur-md bg-opacity-98">
        <div className="max-w-md mx-auto flex justify-around items-center px-6">
          {[
            { id: 'home', icon: Home, label: 'Inicio' },
            { id: 'workout', icon: Dumbbell, label: 'Entreno' },
            { id: 'diet', icon: Apple, label: 'Dieta' },
            { id: 'stats', icon: Activity, label: 'Logs' },
            { id: 'guide', icon: BookOpen, label: 'Guía' }
          ].map((item) => (
            <button key={item.id} onClick={() => {setTab(item.id); setSelectedDay(null);}} className={`flex flex-col items-center justify-center flex-1 py-8 transition-all duration-700 ${tab === item.id ? 'text-emerald-400 -translate-y-3 scale-110' : 'text-slate-600 opacity-60 hover:opacity-100'}`}>
              <item.icon size={28} className={tab === item.id ? "drop-shadow-[0_0_12px_rgba(52,211,153,0.6)]" : ""} />
              <span className="text-[10px] mt-2.5 font-black tracking-[0.25em] uppercase">{item.label}</span>
              {tab === item.id && <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 shadow-[0_0_10px_rgba(52,211,153,1)]"></div>}
            </button>
          ))}
        </div>
      </nav>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(25px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
        body { -webkit-tap-highlight-color: transparent; background-color: #fcfdfe; }
        * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        ::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
}