import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Dumbbell, 
  Apple, 
  Activity, 
  BookOpen, 
  PlayCircle, 
  Clock, 
  Info,
  ShieldAlert,
  Moon,
  Zap,
  Flame,
  Plus,
  Trash2,
  LineChart,
  Timer,
  X,
  Pause,
  Play,
  CalendarPlus,
  Watch
} from 'lucide-react';

// --- DATOS MAESTROS: Ejercicios y Rutinas ---
const WARMUP_ROUTINE = [
  { name: "Marcha rápida o Shadow Boxing", duration: "2-3 min", desc: "Elevar frecuencia cardíaca sin impacto." },
  { name: "Rotaciones de Hombros", duration: "15 fwd / 15 back", desc: "Prepara manguitos rotadores." },
  { name: "Aperturas de Pecho", duration: "15 reps", desc: "Aperturas explosivas hacia atrás." },
  { name: "Balanceo de Piernas", duration: "10/pierna", desc: "Adelante y atrás como péndulo." },
  { name: "Puente de Glúteo", duration: "15 reps", desc: "Activa glúteos para sentadilla." },
  { name: "Bird-Dog (Core)", duration: "5/lado", desc: "Activa faja natural." }
];

const BLOCK_A = [
  { name: "Sentadilla con Barra Libre", sets: 4, reps: "8-10", tempo: "3-1-2-1", rest: "120s", yt: "Barbell back squat proper form", notes: "Exhala y mete el ombligo al subir. Bajar hasta romper el paralelo." },
  { name: "Hip Thrust con Barra", sets: 4, reps: "10-12", tempo: "2-0-X-2", rest: "90s", yt: "Barbell hip thrust form", notes: "Usa banco y colchoneta en cadera. Empuje explosivo." },
  { name: "Sentadilla Búlgara", sets: 3, reps: "10-12/pierna", tempo: "3-1-2-1", rest: "60s", yt: "Dumbbell Bulgarian Split Squat proper form", notes: "Apoya empeine atrás. Equilibra fuerza." },
  { name: "Curl de Isquiotibiales (Mancuerna)", sets: 3, reps: "12-15", tempo: "3-1-2-1", rest: "60s", yt: "Dumbbell lying leg curl bench", notes: "Acostado boca abajo en banco." },
  { name: "Elevación de Talones", sets: 4, reps: "15-20", tempo: "2-1-1-2", rest: "60s", yt: "Standing calf raise form", notes: "Con barra o mancuernas." },
  { name: "Toques de Talón (Heel Taps)", sets: 3, reps: "10-12/pierna", tempo: "Muy lento", rest: "45s", yt: "Heel taps for diastasis recti safe core", notes: "Core terapéutico." }
];

const BLOCK_B = [
  { name: "Press Inclinado con Barra/Mancuernas", sets: 4, reps: "8-10", tempo: "3-1-2-1", rest: "90s", yt: "Incline dumbbell press form", notes: "Banco a 30-45 grados. Empuja exhalando." },
  { name: "Aperturas Inclinadas", sets: 3, reps: "10-12", tempo: "3-1-2-1", rest: "90s", yt: "Incline dumbbell chest fly form", notes: "Expansión torácica." },
  { name: "Press Militar Sentado", sets: 3, reps: "10-12", tempo: "Regular", rest: "90s", yt: "Seated dumbbell shoulder press form", notes: "Respaldo a 90 grados para proteger lumbar." },
  { name: "Elevaciones Laterales", sets: 4, reps: "12-15", tempo: "2-0-1-1", rest: "60s", yt: "Dumbbell lateral raise form", notes: "Hombro medio." },
  { name: "Rompecráneos (Skullcrushers)", sets: 3, reps: "12-15", tempo: "2-0-1-1", rest: "60s", yt: "Dumbbell skullcrushers form", notes: "Lleva mancuernas hacia orejas y extiende." }
];

const BLOCK_C = [
  { name: "Remo a Una Mano en Banco", sets: 4, reps: "10-12/brazo", tempo: "2-1-2-1", rest: "90s", yt: "Single arm dumbbell row bench form", notes: "Espalda paralela al suelo. Cero estrés lumbar." },
  { name: "Pull-over con Mancuerna", sets: 3, reps: "10-12", tempo: "3-1-2-1", rest: "90s", yt: "Dumbbell pullover chest and lats", notes: "Excelente para ginecomastia y expansión." },
  { name: "Pájaros Acostado (Banco Inclinado)", sets: 3, reps: "15", tempo: "2-0-2-2", rest: "60s", yt: "Chest supported incline reverse fly", notes: "Corrige postura/hombros caídos." },
  { name: "Curl de Bíceps Alterno", sets: 3, reps: "10-12/brazo", tempo: "2-0-1-1", rest: "60s", yt: "Alternating dumbbell bicep curl form", notes: "" },
  { name: "Bird-Dog (Estabilización)", sets: 3, reps: "10/lado", tempo: "2-1-2-1", rest: "45s", yt: "Bird dog exercise diastasis recti safe", notes: "Mantener core firme." }
];

const SCHEDULE = [
  { day: "Lunes", type: "Bloque A: Tren Inferior", time: "4AM/7PM", exercises: BLOCK_A, warmup: true, target: "Estímulo de Testosterona" },
  { day: "Martes", type: "Cardio Zona 2", time: "4AM/7PM", desc: "45-60 min trote/bici. FC: 105-123 ppm.", target: "Quema Grasa Visceral" },
  { day: "Miércoles", type: "Bloque B: Empuje", time: "4AM/7PM", exercises: BLOCK_B, warmup: true, target: "Pecho Sup. (Anti-Ginecomastia)" },
  { day: "Jueves", type: "Bloque A: Tren Inferior", time: "4AM/7PM", exercises: BLOCK_A, warmup: true, target: "Salud Pélvica y Glúteo" },
  { day: "Viernes", type: "Bloque C + HIIT", time: "4AM/7PM", exercises: BLOCK_C, warmup: true, target: "Corrección Postural y GH", cardio: "HIIT: 8x (30s Sprint Max / 60s Marcha suave)" },
  { day: "Sábado", type: "Resistencia 10k", time: "Mañana", desc: "Simulación 10k. FC: 125-145 ppm.", target: "Salud Cardiovascular" },
  { day: "Domingo", type: "Movilidad Activa", time: "Mañana", desc: "Postura de Rana (3 min) + Estiramiento Psoas (2 min/lado)", target: "Control de Cortisol" },
];

// --- FUNCIONES DE CALENDARIO ---
const dayMap = { "Lunes": "MO", "Martes": "TU", "Miércoles": "WE", "Jueves": "TH", "Viernes": "FR", "Sábado": "SA", "Domingo": "SU" };

const handleGoogleCalendar = (e, day) => {
  e.stopPropagation();
  const baseUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE";
  const text = `Entreno: ${day.type}`;
  const details = `Plan Pedro Falcon\nObjetivo: ${day.target}`;
  const recur = `RRULE:FREQ=WEEKLY;BYDAY=${dayMap[day.day]}`;
  window.open(`${baseUrl}&text=${encodeURIComponent(text)}&details=${encodeURIComponent(details)}&recur=${recur}`, '_blank');
};

const downloadWeeklyICS = () => {
  const events = SCHEDULE.map((day, idx) => {
    const baseDate = `2024010${1 + idx}T110000Z`;
    const endDate = `2024010${1 + idx}T123000Z`;
    return `BEGIN:VEVENT\nSUMMARY:Entreno: ${day.type}\nDESCRIPTION:Objetivo: ${day.target}\nRRULE:FREQ=WEEKLY;BYDAY=${dayMap[day.day]}\nDTSTART:${baseDate}\nDTEND:${endDate}\nEND:VEVENT`;
  }).join('\n');
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Pedro Falcon App//ES\n${events}\nEND:VCALENDAR`;
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = `Calendario_Falcon.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// --- COMPONENTES DE UI ---

const TopNav = () => (
  <div className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-md pt-[max(1rem,env(safe-area-inset-top))]">
    <div className="max-w-2xl mx-auto flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold text-emerald-400">Plan Optimización 44+</h1>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Pedro Falcon • Home Gym</p>
      </div>
      <img src={`https://ui-avatars.com/api/?name=Pedro+Falcon&background=10b981&color=fff&rounded=true`} alt="Profile" className="w-9 h-9 border-2 border-slate-700 rounded-full" />
    </div>
  </div>
);

const NavButton = ({ id, icon, label, activeTab, setActiveTab, setSelectedDay }) => (
  <button 
    onClick={() => { setActiveTab(id); setSelectedDay(null); }}
    className={`flex flex-col items-center justify-center flex-1 py-2 transition-all ${activeTab === id ? 'text-emerald-400' : 'text-slate-500'}`}
  >
    <div className={`p-1 rounded-lg ${activeTab === id ? 'bg-emerald-500/10' : ''}`}>
      {icon}
    </div>
    <span className="text-[10px] mt-1 font-bold">{label}</span>
  </button>
);

const BottomNav = ({ activeTab, setActiveTab, setSelectedDay }) => (
  <div className="bg-slate-900 fixed bottom-0 w-full border-t border-slate-800 z-50 pb-[env(safe-area-inset-bottom)]">
    <div className="max-w-2xl mx-auto flex justify-around items-center">
      <NavButton id="home" icon={<Home size={22} />} label="INICIO" activeTab={activeTab} setActiveTab={setActiveTab} setSelectedDay={setSelectedDay} />
      <NavButton id="workout" icon={<Dumbbell size={22} />} label="ENTRENO" activeTab={activeTab} setActiveTab={setActiveTab} setSelectedDay={setSelectedDay} />
      <NavButton id="nutrition" icon={<Apple size={22} />} label="DIETA" activeTab={activeTab} setActiveTab={setActiveTab} setSelectedDay={setSelectedDay} />
      <NavButton id="metrics" icon={<Activity size={22} />} label="MÉTRICAS" activeTab={activeTab} setActiveTab={setActiveTab} setSelectedDay={setSelectedDay} />
      <NavButton id="info" icon={<BookOpen size={22} />} label="GUÍA" activeTab={activeTab} setActiveTab={setActiveTab} setSelectedDay={setSelectedDay} />
    </div>
  </div>
);

const ExerciseCard = ({ ex, index, startTimer }) => {
  const [completedSets, setCompletedSets] = useState([]);
  const toggleSet = (setIdx) => {
    if (completedSets.includes(setIdx)) {
      setCompletedSets(completedSets.filter(s => s !== setIdx));
    } else {
      setCompletedSets([...completedSets, setIdx]);
      const restTime = parseInt(ex.rest.replace(/\D/g, '')) || 60;
      if (startTimer) startTimer(restTime);
    }
  };
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(ex.yt)}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-4">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-extrabold text-slate-900 text-base leading-tight pr-4">{index + 1}. {ex.name}</h4>
          <a href={searchUrl} target="_blank" rel="noopener noreferrer" className="text-red-600 bg-red-50 p-2 rounded-full active:bg-red-100 shrink-0">
            <PlayCircle size={20} />
          </a>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center text-[10px] my-3 font-bold">
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <span className="text-slate-400 block mb-0.5">SERIES</span>
            <span className="text-slate-800 text-sm">{ex.sets}</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <span className="text-slate-400 block mb-0.5">REPS</span>
            <span className="text-slate-800 text-sm">{ex.reps}</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <span className="text-slate-400 block mb-0.5">TEMPO</span>
            <span className="text-slate-800 text-[11px]">{ex.tempo}</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <span className="text-slate-400 block mb-0.5">DESC.</span>
            <span className="text-slate-800 text-sm">{ex.rest}</span>
          </div>
        </div>
        {ex.notes && (
          <div className="flex items-start bg-blue-50 text-blue-800 p-3 rounded-xl text-[11px] mb-3 border border-blue-100">
            <Info size={14} className="shrink-0 mt-0.5 mr-2 text-blue-500" />
            <p className="leading-tight">{ex.notes}</p>
          </div>
        )}
        <div className="border-t border-slate-50 pt-3">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: ex.sets }).map((_, s) => (
              <button
                key={s}
                onClick={() => toggleSet(s)}
                className={`flex-1 min-w-[3.5rem] py-3 rounded-xl font-black text-sm transition-all border-2 ${
                  completedSets.includes(s) 
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-lg scale-95' 
                    : 'bg-white text-slate-300 border-slate-100 active:border-emerald-200'
                }`}
              >
                {s + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- VISTAS ---

const HomeView = ({ setActiveTab, setSelectedDay }) => (
  <div className="p-4 space-y-6 animate-fade-in max-w-2xl mx-auto pb-24">
    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start space-x-3">
      <ShieldAlert className="text-red-600 shrink-0 mt-1" />
      <div>
        <h3 className="font-black text-red-600 text-sm">RESTRICCIÓN MÉDICA</h3>
        <p className="text-[12px] text-slate-700 mt-0.5 leading-snug">PROHIBIDO EL PESO MUERTO. Sentadillas permitidas con técnica respiratoria estricta.</p>
      </div>
    </div>

    <div>
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="text-lg font-black text-slate-800 flex items-center tracking-tight"><Clock className="mr-2 text-emerald-500" size={20}/> CALENDARIO</h2>
        <button onClick={downloadWeeklyICS} className="text-[10px] bg-slate-900 text-white px-3 py-2 rounded-xl flex items-center font-bold uppercase tracking-wider">
          <Watch size={14} className="mr-1.5"/> Exportar
        </button>
      </div>
      <div className="grid gap-3">
        {SCHEDULE.map((day, idx) => (
          <div key={idx} onClick={() => { setActiveTab('workout'); setSelectedDay(idx); }} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 flex justify-between items-center active:scale-[0.98] transition-all border-l-4 border-l-emerald-500">
            <div>
              <p className="font-black text-slate-900 text-base">{day.day}</p>
              <p className="text-sm text-emerald-600 font-bold">{day.type}</p>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{day.target}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={(e) => handleGoogleCalendar(e, day)} className="p-2.5 text-slate-300 active:text-blue-500 active:bg-blue-50 rounded-full transition-colors"><CalendarPlus size={22}/></button>
              <div className="w-px h-8 bg-slate-100"></div>
              <PlayCircle className="text-slate-200" size={24}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const WorkoutView = ({ selectedDay, setSelectedDay, startTimer }) => {
  if (selectedDay === null) {
    return (
      <div className="p-4 max-w-2xl mx-auto pb-24">
        <h2 className="text-2xl font-black text-slate-800 mb-5 tracking-tight px-1 uppercase">Entrenamiento</h2>
        <div className="grid gap-3">
          {SCHEDULE.map((day, idx) => (
            <button key={idx} onClick={() => setSelectedDay(idx)} className="w-full text-left bg-white border border-slate-200 rounded-2xl p-5 active:bg-slate-50 shadow-sm border-l-4 border-l-slate-800">
              <div className="flex justify-between items-center">
                <span className="font-black text-lg text-slate-900">{day.day}</span>
                <span className="text-[10px] font-black px-3 py-1 bg-slate-100 text-slate-600 rounded-full tracking-widest">{day.time}</span>
              </div>
              <p className="text-emerald-600 font-bold mt-1 text-sm">{day.type}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const dayData = SCHEDULE[selectedDay];
  return (
    <div className="p-4 max-w-2xl mx-auto pb-24 animate-fade-in">
      <button onClick={() => setSelectedDay(null)} className="text-emerald-600 text-xs font-black mb-5 flex items-center uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-full">← Volver al menú</button>
      <div className="bg-slate-900 text-white rounded-3xl p-6 mb-6 shadow-xl border-b-8 border-emerald-500">
        <h2 className="text-3xl font-black text-emerald-400 leading-tight uppercase tracking-tighter">{dayData.day}</h2>
        <p className="text-lg font-bold mt-0.5 text-slate-200">{dayData.type}</p>
        <div className="flex gap-4 mt-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span className="flex items-center"><Clock size={14} className="mr-1.5 text-emerald-500"/> {dayData.time}</span>
          <span className="flex items-center"><Activity size={14} className="mr-1.5 text-emerald-500"/> {dayData.target}</span>
        </div>
      </div>

      {dayData.warmup && (
        <div className="mb-8">
          <h3 className="text-sm font-black text-slate-400 mb-3 ml-1 uppercase tracking-widest">Calentamiento</h3>
          <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 space-y-4 shadow-sm">
            {WARMUP_ROUTINE.map((w, i) => (
              <div key={i} className="flex items-start">
                <div className="w-6 h-6 rounded-lg bg-orange-200 text-orange-800 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 shadow-sm">{i+1}</div>
                <div className="ml-3">
                  <p className="font-black text-slate-900 text-sm leading-none">{w.name} <span className="text-orange-600 font-bold ml-1">[{w.duration}]</span></p>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium leading-tight">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-1">
        {dayData.exercises && dayData.exercises.map((ex, i) => (
          <ExerciseCard key={i} ex={ex} index={i} startTimer={startTimer} />
        ))}
      </div>

      {dayData.cardio && (
        <div className="mt-8 bg-red-50 rounded-2xl p-5 border border-red-100 shadow-sm">
          <h3 className="text-base font-black text-red-800 mb-2 flex items-center uppercase tracking-tight"><Flame className="mr-2" size={20}/> HIIT / Quema Grasa</h3>
          <p className="text-sm text-slate-800 font-bold leading-relaxed">{dayData.cardio}</p>
        </div>
      )}

      {dayData.desc && !dayData.exercises && (
        <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm text-center">
          <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Activity className="text-emerald-500" size={40} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-3 uppercase tracking-tighter">{dayData.type}</h3>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">{dayData.desc}</p>
        </div>
      )}
    </div>
  );
};

const NutritionView = () => (
  <div className="p-4 space-y-6 animate-fade-in max-w-2xl mx-auto pb-24">
    <div className="text-center bg-slate-900 text-white rounded-3xl p-8 shadow-2xl border-b-8 border-emerald-500">
      <h2 className="text-5xl font-black text-emerald-400 tracking-tighter">151<span className="text-2xl ml-1 uppercase">g</span></h2>
      <p className="text-xs text-slate-400 mt-2 uppercase tracking-[0.2em] font-black">Meta Proteína Diaria</p>
    </div>
    <div className="grid gap-4">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-start shadow-sm">
        <div className="bg-orange-50 text-orange-600 p-3 rounded-2xl mr-4"><Apple size={24}/></div>
        <div>
          <h3 className="font-black text-slate-900 text-base uppercase tracking-tight">Sólidos (~100g)</h3>
          <p className="text-slate-500 text-xs mt-1 leading-relaxed font-medium">3 huevos (desayuno) + 200g carne/pollo (comidas). Focalizado en alimentos reales.</p>
        </div>
      </div>
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-start shadow-sm">
        <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl mr-4"><Activity size={24}/></div>
        <div>
          <h3 className="font-black text-slate-900 text-base uppercase tracking-tight">Isolate (~50g)</h3>
          <p className="text-slate-500 text-xs mt-1 leading-relaxed font-medium italic">2 scoops con AGUA solamente. Evita lactosa y estrógenos.</p>
          <div className="flex gap-2 mt-3">
            <span className="bg-slate-100 px-2 py-1 rounded-lg text-[9px] font-black text-slate-500 uppercase">Post-entreno</span>
            <span className="bg-slate-100 px-2 py-1 rounded-lg text-[9px] font-black text-slate-500 uppercase">4:00 PM</span>
          </div>
        </div>
      </div>
    </div>
    <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-lg">
      <h3 className="font-black text-emerald-400 mb-4 flex items-center text-sm uppercase tracking-widest"><Zap className="mr-2 text-emerald-400" size={18}/> Stack Hormonal</h3>
      <div className="grid grid-cols-2 gap-3 text-[10px] font-black uppercase tracking-widest">
        <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700">Zinc: 30-50mg</div>
        <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 text-emerald-400">Citrulina: 6g</div>
        <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 text-indigo-400">Magnesio: 400mg</div>
        <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700">D3+K2: 5000 UI</div>
      </div>
    </div>
  </div>
);

const MetricsView = () => {
  const [bodyLogs, setBodyLogs] = useState(() => JSON.parse(localStorage.getItem('f_body')) || []);
  const [bForm, setBForm] = useState({ date: new Date().toISOString().split('T')[0], weight: '', waist: '', chest: '' });

  useEffect(() => localStorage.setItem('f_body', JSON.stringify(bodyLogs)), [bodyLogs]);

  const addBody = () => {
    if(!bForm.weight && !bForm.waist) return;
    setBodyLogs([{ id: Date.now(), ...bForm }, ...bodyLogs]);
    setBForm({...bForm, weight: '', waist: '', chest: ''});
  };

  return (
    <div className="p-4 space-y-6 animate-fade-in max-w-2xl mx-auto pb-24">
      <div className="bg-white rounded-3xl shadow-sm border p-6">
        <h3 className="font-black text-slate-900 mb-4 border-b pb-2 flex items-center text-base uppercase tracking-tight"><LineChart className="mr-2 text-emerald-500"/> Registro Corporal</h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 ml-1 uppercase">Peso (kg)</label>
            <input type="number" value={bForm.weight} onChange={e => setBForm({...bForm, weight: e.target.value})} className="w-full p-3 border-2 border-slate-100 rounded-xl text-sm font-bold bg-slate-50 focus:border-emerald-500 outline-none transition-all" />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 ml-1 uppercase">Cintura (cm)</label>
            <input type="number" value={bForm.waist} onChange={e => setBForm({...bForm, waist: e.target.value})} className="w-full p-3 border-2 border-slate-100 rounded-xl text-sm font-bold bg-slate-50 focus:border-emerald-500 outline-none transition-all" />
          </div>
          <button onClick={addBody} className="col-span-2 bg-emerald-600 text-white p-4 rounded-2xl font-black text-sm active:scale-95 shadow-lg shadow-emerald-500/20 uppercase tracking-widest">
            Guardar Medición
          </button>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-100 mt-6">
          <table className="w-full text-[10px] text-left">
            <thead className="bg-slate-50 text-slate-400 font-black uppercase tracking-widest border-b border-slate-100">
              <tr><th className="p-3">Fecha</th><th className="p-3">Kg</th><th className="p-3">Cm</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {bodyLogs.map(l => <tr key={l.id} className="text-slate-700 font-bold"><td className="p-3">{l.date}</td><td className="p-3 text-emerald-600">{l.weight}</td><td className="p-3">{l.waist}</td></tr>)}
            </tbody>
          </table>
          {bodyLogs.length === 0 && <p className="text-center p-6 text-[11px] text-slate-400 italic">No hay registros almacenados.</p>}
        </div>
      </div>
    </div>
  );
};

const InfoView = () => (
  <div className="p-4 space-y-5 animate-fade-in max-w-2xl mx-auto pb-24 text-sm">
    <div className="bg-emerald-600 text-white p-6 rounded-3xl shadow-xl shadow-emerald-500/20">
      <h3 className="font-black flex items-center mb-3 text-base uppercase tracking-tight"><ShieldAlert className="mr-2" size={22}/> Técnica Diástasis</h3>
      <p className="text-[12px] leading-relaxed font-bold italic opacity-90 border-l-2 border-white/30 pl-3">"Exhala fuerte y mete el ombligo al subir la sentadilla. Piensa en abrochar un cinturón apretado. Prohibido aguantar el aire."</p>
    </div>
    <div className="bg-white p-5 rounded-2xl border-l-8 border-indigo-500 shadow-sm">
      <h4 className="font-black text-indigo-900 text-sm uppercase tracking-tight mb-1">Hormonas & Sueño</h4>
      <p className="text-[11px] text-slate-500 leading-tight font-medium">Sin oxigenación nocturna (CPAP) no hay reparación muscular ni testosterona. Tu IAH debe estar bajo 5.0.</p>
    </div>
    <div className="bg-white p-5 rounded-2xl border-l-8 border-orange-500 shadow-sm">
      <h4 className="font-black text-orange-900 text-sm uppercase tracking-tight mb-1">Doble Progresión</h4>
      <p className="text-[11px] text-slate-500 leading-tight font-medium">Anota tus pesos. Sube la carga solo cuando controles el tempo 3-1-2-1 perfectamente sin abultar el abdomen.</p>
    </div>
  </div>
);

// --- APP PRINCIPAL ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedDay, setSelectedDay] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds(prev => prev - 1), 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      if ("vibrate" in navigator) navigator.vibrate([200, 100, 200]);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const startTimer = (seconds) => {
    setTimerSeconds(seconds);
    setIsTimerRunning(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden antialiased">
      <TopNav />
      <main className="transition-all duration-300">
        {activeTab === 'home' && <HomeView setActiveTab={setActiveTab} setSelectedDay={setSelectedDay} />}
        {activeTab === 'workout' && <WorkoutView selectedDay={selectedDay} setSelectedDay={setSelectedDay} startTimer={startTimer} />}
        {activeTab === 'nutrition' && <NutritionView />}
        {activeTab === 'metrics' && <MetricsView />}
        {activeTab === 'info' && <InfoView />}
      </main>

      {/* Temporizador Flotante */}
      {(timerSeconds > 0 || isTimerRunning) && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-4 rounded-3xl shadow-2xl flex items-center space-x-4 z-[100] border border-slate-700 animate-fade-in backdrop-blur-md bg-opacity-90">
          <Timer size={20} className={timerSeconds === 0 ? "text-red-500 animate-pulse" : "text-emerald-400"} />
          <span className="font-mono font-black text-xl w-14 text-center">
            {Math.floor(timerSeconds/60)}:{(timerSeconds%60).toString().padStart(2, '0')}
          </span>
          <button onClick={() => setIsTimerRunning(!isTimerRunning)} className="bg-slate-800 p-2 rounded-xl active:bg-slate-700">
            {isTimerRunning ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          </button>
          <button onClick={() => { setTimerSeconds(0); setIsTimerRunning(false); }} className="text-red-400 font-bold p-1">
            <X size={22} />
          </button>
        </div>
      )}

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} setSelectedDay={setSelectedDay} />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        body { -webkit-tap-highlight-color: transparent; }
      `}} />
    </div>
  );
}