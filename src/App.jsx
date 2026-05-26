import React, { useState, useEffect, useRef } from 'react';
import {
  Home, Dumbbell, Apple, Activity, BookOpen, PlayCircle, Clock, Info,
  ShieldAlert, Zap, Flame, Plus, Trash2, LineChart, Timer, X,
  Pause, Play, CalendarPlus, CheckCircle, ArrowRight, Wind, ChevronRight, ActivitySquare,
  Camera, Image as ImageIcon, Bot, Send, Loader2, Heart, Moon, Award,
  Settings, Bike, Footprints, KeyRound, AlertTriangle
} from 'lucide-react';

// ========================================================================
// DATA MASTER — PLAN HÍBRIDO FASE 1 (semanas 1-6)
// Perfil: Pedro Falcon, 44 años, 80 kg, 170 cm, perímetro 95 cm
// Clínica: SAHOS severa (IAH residual 0.1-1.6 con CPAP), DRA, ED ansiogénica,
// Tirzepatide 2.5 mg/sem. Restricción lumbar RELATIVA: peso muerto convencional
// sigue restringido; back squat liberado tras tolerar sentadillas sin dolor
// (manejar con bracing 360° + técnica revisada).
// ========================================================================

const WARMUP_WEIGHTS = [
  { name: "Elevación Térmica", duration: "3 min", desc: "Marcha rápida o shadow boxing ligero para activar el SNC." },
  { name: "Movilidad Articular", duration: "3 min", desc: "Rotación hombros 15/lado + aperturas pecho dinámicas + cat-cow 10 reps." },
  { name: "Activación Core 360° + Glúteo", duration: "3 min", desc: "Respiración diafragmática 360° (5 ciclos) + Bird Dog 5/lado + Puente glúteo 15 reps. Protege la DRA." }
];

const RUNNING_WARMUP = [
  { name: "Movilidad Activa", duration: "5 min", desc: "Círculos de tobillo, balanceo de piernas, rotación de cadera, leg swings." },
  { name: "Trote Progresivo", duration: "5 min", desc: "Iniciar caminando rápido y subir paulatinamente a trote muy suave." }
];

const RUNNING_COOLDOWN = [
  { name: "Vuelta a la Calma", duration: "5 min", desc: "Caminata lenta hasta bajar FC por debajo de 100 ppm." },
  { name: "Estiramiento Estático", duration: "5 min", desc: "Foco en gemelos, psoas e isquiotibiales (30 seg por posición)." }
];

const BIKE_WARMUP = [
  { name: "Spin-up Suave", duration: "8 min", desc: "Pedaleo plato chico, cadencia 80-90 rpm, FC < Z1. Activación articular sin carga." },
  { name: "Activación Glúteo+Core", duration: "4 min", desc: "Bajar de la bici: 10 puentes glúteo + bird dog 5/lado + respiración 360°. Despierta cadena posterior antes de cargar." }
];

const BIKE_COOLDOWN = [
  { name: "Spin-down", duration: "5 min", desc: "Cadencia ligera plato chico hasta FC < 100 ppm." },
  { name: "Estiramiento Cadena Anterior", duration: "5 min", desc: "Psoas, cuádriceps, flexores de cadera y dorsales — antídoto a la postura aerodinámica." }
];

// BLOQUE A — LUNES: Empuje y Cuádriceps (spine-safe + back squat liberado)
const BLOCK_A = [
  { name: "Front Squat o Back Squat", sets: 4, reps: "6-8", tempo: "3-1-2-1", rest: "120", yt: "Front squat vs back squat technique", notes: "ALTERNAR semana a semana. Front Squat (carga anterior, menos cizalla L4-L5) ↔ Back Squat (más carga total). Back squat liberado tras tolerar sentadillas sin dolor lumbar — bracing 360° obligatorio, técnica revisada, cinturón en serie pico. Empieza 55 kg → 65 → 75 → 85. Si reaparece dolor, vuelve solo a Front." },
  { name: "Press Inclinado Mancuernas 30°", sets: 4, reps: "8-10", tempo: "3-1-2-1", rest: "90", yt: "Incline dumbbell press 30 degrees", notes: "Hipertrofia haz clavicular. Mancuernas 20 kg actuales — cuando saturas, baja tempo 3-1-2 y sube reps a 12-15." },
  { name: "Bulgarian Split Squat", sets: 3, reps: "10/pierna", tempo: "3-1-2-1", rest: "75", yt: "Dumbbell Bulgarian split squat", notes: "Mancuernas 15-20 kg/mano. Pie trasero en banco. Unilateral, sin carga axial." },
  { name: "Press Pectoral Multifuncional", sets: 3, reps: "10-12", tempo: "2-1-2-1", rest: "75", yt: "Chest press machine form", notes: "Reemplaza fondos en paralelas. Inclinación ligera del torso para reclutar haz inferior." },
  { name: "Pallof Press Polea Baja", sets: 3, reps: "12/lado", tempo: "2-1-2-1", rest: "45", yt: "Pallof press cable anti rotation", notes: "Anti-rotación pura. Ideal para DRA y blindaje lumbar para correr." }
];

// BLOQUE B — MIÉRCOLES: Tracción y Cadena Posterior
const BLOCK_B = [
  { name: "Hip Thrust con Barra + Almohadilla", sets: 4, reps: "8-10", tempo: "2-0-X-2", rest: "120", yt: "Barbell hip thrust form glutes", notes: "TU EJERCICIO REY. Empieza 45-55 kg, progresa rápido a 75-85 kg. Pausa isométrica 2 seg en contracción." },
  { name: "RDL con Mancuernas", sets: 3, reps: "10", tempo: "4-1-2-1", rest: "90", yt: "Romanian deadlift dumbbells form", notes: "Mancuernas 20 kg. Bisagra de cadera estricta, columna neutra, isquios estirados. Tempo lento en excéntrica." },
  { name: "Jalón al Pecho Multifuncional", sets: 4, reps: "8-10", tempo: "2-1-2-1", rest: "90", yt: "Lat pulldown wide grip form", notes: "Sustituto principal de dominadas. Retracción escapular previa al tirón. Agarre prono ancho." },
  { name: "Remo Bajo en Polea", sets: 4, reps: "10-12", tempo: "2-1-2-1", rest: "75", yt: "Seated cable row neutral grip", notes: "Asa V o agarre estrecho neutro. Pecho fuera, codos pegados al torso." },
  { name: "Face Pulls Polea Alta", sets: 3, reps: "15", tempo: "2-1-2-1", rest: "60", yt: "Face pull rope cable form", notes: "Cuerda o asa simple. Codos altos, rotación externa al final del recorrido." },
  { name: "Farmer's Carry", sets: 3, reps: "40 seg", tempo: "Continuo", rest: "60", yt: "Farmers walk carry form posture", notes: "Mancuernas 20 kg c/mano. Postura erguida, hombros bajos, anti-flexión lateral del core." },
  { name: "Curl Bíceps Alterno", sets: 3, reps: "10-12/brazo", tempo: "2-0-1-1", rest: "60", yt: "Alternating dumbbell curl form", notes: "Mancuernas 10-15 kg, alternado." }
];

// BLOQUE C — VIERNES: Hombros y Full Body Metabólico
const BLOCK_C = [
  { name: "Press Militar Mancuernas SENTADO", sets: 4, reps: "10-12", tempo: "2-1-2-1", rest: "90", yt: "Seated dumbbell shoulder press", notes: "Banco 90°. Reduce compresión lumbar vs. parado. Mancuernas 15-20 kg." },
  { name: "Goblet Squat con KB 16 kg", sets: 3, reps: "12", tempo: "3-1-2-1", rest: "75", yt: "Goblet squat kettlebell form", notes: "Profundidad máxima controlada. Core exigido. Reemplaza zancadas como movimiento principal del día." },
  { name: "Zancadas Inversas Mancuernas", sets: 3, reps: "10/pierna", tempo: "3-1-2-1", rest: "75", yt: "Reverse lunge dumbbells form", notes: "Mancuernas 15-20 kg. Inversas vs. frontales: menos estrés en rodilla." },
  { name: "Mariposa (Pec Deck)", sets: 3, reps: "15", tempo: "3-1-2-1", rest: "60", yt: "Pec deck fly machine form", notes: "Multifuncional. Aperturas estrictas. Contracción isométrica 1 seg en cierre." },
  { name: "Elevaciones Laterales", sets: 3, reps: "15-20", tempo: "2-0-2-1", rest: "60", yt: "Dumbbell lateral raise form", notes: "Mancuernas 5-6 kg. Codos lideran. Ligero ángulo 'verter agua'." },
  { name: "Pullover con Mancuerna", sets: 3, reps: "12", tempo: "3-1-2-1", rest: "75", yt: "Dumbbell pullover bench form", notes: "1 mancuerna 15-20 kg atravesado en banco. Expande caja torácica — clave con CPAP." },
  { name: "Swing con KB 16 kg", sets: 3, reps: "15", tempo: "Explosivo", rest: "60", yt: "Kettlebell hardstyle swing form", notes: "FINISHER METABÓLICO. Hardstyle: bisagra explosiva cadera, swing hasta pecho, glúteo contraído arriba. Cero compresión axial. Excelente para grasa visceral." }
];

const CORE_DRA_LUNES = [
  { name: "Respiración Diafragmática 360°", sets: 3, reps: "10 respiraciones", rest: "30", yt: "360 diaphragmatic breathing core", notes: "Acostado boca arriba, rodillas flexionadas. Inhala expandiendo costillas LATERALES y espalda. Exhala activando suavemente TA ('ombligo hacia columna sin meter panza')." },
  { name: "Dead Bug con TA activo", sets: 3, reps: "8/lado", rest: "45", yt: "Dead bug exercise diastasis safe", notes: "Lumbar pegada al suelo SIEMPRE. Si aparece doming en línea media = pausa, no continúes." }
];

const CORE_DRA_MIERCOLES = [
  { name: "Bird Dog", sets: 3, reps: "10/lado", rest: "45", yt: "Bird dog exercise core stability", notes: "Cuadrupedia. Brazo y pierna opuestos extendidos. Pelvis estable, sin rotación de caderas." },
  { name: "Heel Slides", sets: 3, reps: "10/pierna", rest: "45", yt: "Heel slides core diastasis exercise", notes: "Activa TA primero, luego desliza talón estirando pierna sin perder activación." }
];

const CORE_DRA_VIERNES = [
  { name: "Side Plank de Rodillas", sets: 3, reps: "20-30 seg/lado", rest: "45", yt: "Side plank knees modified form", notes: "Anti-flexión lateral. Cero doming. Progresar a pies cuando domines 45 seg limpios." },
  { name: "Pallof Press Extra", sets: 3, reps: "12/lado", rest: "45", yt: "Pallof press cable anti rotation", notes: "Repaso anti-rotación al final de la sesión." }
];

const SUELO_PELVICO = [
  { name: "Kegels Rápidos", reps: "10 reps", desc: "1 seg arriba / 1 seg abajo. Contracción específica del bulboesponjoso." },
  { name: "Kegels Sostenidos", reps: "10 reps", desc: "5 seg arriba / 5 seg descanso. Construye resistencia." },
  { name: "Kegels Escalonados", reps: "5 reps", desc: "Sube en 4 niveles 25-50-75-100% y sostén 5 seg arriba." },
  { name: "Reverse Kegels (Relajación)", reps: "10 reps lentas", desc: "Empuja suavemente hacia afuera. CRÍTICO: la relajación es tan importante como la contracción para ED y refractariedad." }
];

const SCHEDULE = [
  { day: "Lunes", type: "Fuerza A: Empuje + Cuádriceps", target: "Testosterona / Cuádriceps", time: "PM", exercises: BLOCK_A, hasWarmup: true, coreDRA: CORE_DRA_LUNES },
  { day: "Martes", type: "Running CACOS / Z2", target: "Base Aeróbica", time: "4 AM", isRunning: true, zone: "106-123 ppm", duration: "30-35 min", notes: "Sem 1-2: CACOS (4 min trote Z2 + 1 min caminata). Sem 3+: continuo Z2. Sem 4: tempo Z3 baja (20 min) en lugar de HIIT." },
  { day: "Miércoles", type: "Fuerza B: Tracción + Cadena Posterior", target: "Glúteo / Espalda", time: "PM", exercises: BLOCK_B, hasWarmup: true, coreDRA: CORE_DRA_MIERCOLES },
  { day: "Jueves", type: "Running Rodaje Z2", target: "Base Lipolítica", time: "4 AM", isRunning: true, zone: "106-123 ppm", duration: "30-40 min", notes: "Trote continuo estricto en Zona 2. Respiración nasal preferida. Sem 6 = deload (-40% volumen)." },
  { day: "Viernes", type: "Fuerza C: Hombros + Metabólico", target: "GH / Postura", time: "PM", exercises: BLOCK_C, hasWarmup: true, coreDRA: CORE_DRA_VIERNES },
  { day: "Sábado", type: "Running Fondo Z2", target: "Resistencia 21K", time: "AM", isRunning: true, zone: "106-123 ppm", duration: "45-70 min", notes: "Progresión: sem1 45min → sem4 70min. Faja abdominal compresiva durante el rodaje por DRA." },
  { day: "Domingo", type: "Bici Gravel Z1-Z2 (Opcional)", target: "Volumen aeróbico sin impacto", time: "AM Libre", isBike: true, zone: "100-118 ppm (Z1-Z2 baja)", duration: "60-120 min", notes: "Salida en gravel Specialized a paso conversacional. NO empujes potencia, esto es recuperación activa + base aeróbica + cero impacto para DRA/rodillas. Si vienes cansado del fondo del sábado o body battery < 30, salta y haz descanso absoluto. Foco: cadencia 80-90 rpm, terreno ondulado, sin sprints." }
];

// ========================================================================
// HIG · Helpers de accesibilidad y feedback
// ========================================================================

const haptic = (ms = 10) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(ms);
  }
};
const hapticSuccess = () => haptic(15);
const hapticWarning = () => { if (navigator.vibrate) navigator.vibrate([10, 40, 10]); };
const withHaptic = (fn, pattern = 10) => (e) => { haptic(pattern); fn?.(e); };

// ========================================================================
// COMPONENTES DE UI
// ========================================================================

const SectionHeader = ({ children, icon: Icon, color = "text-emerald-500" }) => (
  <h3 className={`text-xs font-black uppercase tracking-[0.3em] flex items-center mb-5 ${color}`}>
    {Icon && <Icon size={18} className="mr-3" />}
    {children}
  </h3>
);

const ExerciseCard = ({ ex, index, startTimer }) => {
  const [completed, setCompleted] = useState([]);
  const toggle = (i) => {
    if (completed.includes(i)) {
      haptic();
      setCompleted(completed.filter(s => s !== i));
    } else {
      hapticSuccess();
      setCompleted([...completed, i]);
      if (startTimer) startTimer(parseInt(ex.rest));
    }
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
            { l: 'Sets', v: ex.sets }, { l: 'Reps', v: ex.reps }, { l: 'Tempo', v: ex.tempo }, { l: 'Desc.', v: ex.rest + 's' }
          ].map((item, i) => (
            <div key={i} className="bg-slate-50 p-2.5 rounded-2xl text-center border border-slate-100/50 shadow-inner">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">{item.l}</p>
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
            <button
              key={s}
              type="button"
              aria-label={`Serie ${s + 1} ${completed.includes(s) ? 'completada' : 'pendiente'}`}
              aria-pressed={completed.includes(s)}
              onClick={() => toggle(s)}
              className={`flex-1 min-h-[44px] py-4 rounded-2xl font-black text-sm transition-all border-2 ${completed.includes(s) ? 'bg-emerald-500 text-white border-emerald-600 shadow-lg scale-95' : 'bg-white text-slate-300 border-slate-100 active:border-emerald-200'}`}
            >
              {s + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const CoreDRACard = ({ ex, index }) => (
  <div className="bg-purple-50/60 border border-purple-100 rounded-[28px] p-5 mb-4 shadow-sm">
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1 pr-3">
        <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-1">Core DRA-Safe</p>
        <h4 className="font-black text-slate-800 text-base leading-tight uppercase tracking-tight">{index + 1}. {ex.name}</h4>
      </div>
      <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.yt)}`} target="_blank" rel="noopener noreferrer" className="bg-purple-100 text-purple-600 p-2.5 rounded-2xl active:scale-90 transition-transform">
        <PlayCircle size={20} />
      </a>
    </div>
    <div className="flex gap-2 mb-3 text-[11px] font-black text-slate-700">
      <span className="bg-white px-3 py-1.5 rounded-xl border border-purple-100">{ex.sets} × {ex.reps}</span>
      <span className="bg-white px-3 py-1.5 rounded-xl border border-purple-100">Desc {ex.rest}s</span>
    </div>
    {ex.notes && <p className="text-[11px] font-bold text-purple-900 leading-snug">{ex.notes}</p>}
  </div>
);

const WorkoutView = ({ selectedDay, setSelectedDay, startTimer }) => {
  if (selectedDay === null) {
    return (
      <div className="animate-fade-in space-y-6">
        <SectionHeader icon={Dumbbell}>Escoger Rutina Diaria</SectionHeader>
        <div className="grid gap-4">
          {SCHEDULE.map((day, idx) => (
            <button key={idx} onClick={() => setSelectedDay(idx)} className={`w-full text-left bg-white border-2 border-slate-50 rounded-[35px] p-7 shadow-sm border-l-[12px] ${day.isRest ? 'border-l-slate-400' : day.isRunning ? 'border-l-orange-500' : day.isBike ? 'border-l-sky-500' : 'border-l-emerald-500'} flex justify-between items-center active:scale-[0.98] transition-all group`}>
              <div>
                <span className="font-black text-xl text-slate-900 tracking-tighter uppercase group-active:text-emerald-600">{day.day}</span>
                <p className={`font-black text-[11px] uppercase tracking-widest mt-1.5 ${day.isRest ? 'text-slate-500' : day.isRunning ? 'text-orange-600' : day.isBike ? 'text-sky-600' : 'text-emerald-600'}`}>{day.type}</p>
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

      <div className={`text-white rounded-[55px] p-8 sm:p-10 shadow-2xl border-b-[14px] relative overflow-hidden border border-slate-800 ${dayData.isRest ? 'bg-slate-700 border-slate-500' : 'bg-slate-900 border-emerald-500'}`}>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full -mr-24 -mb-24 blur-3xl"></div>
        <h2 className={`text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none italic ${dayData.isRest ? 'text-slate-300' : 'text-emerald-400'}`}>{dayData.day}</h2>
        <p className="text-xl sm:text-2xl font-bold text-slate-200 mt-3 tracking-tight">{dayData.type}</p>
        <div className="flex gap-4 mt-8 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">
          <span className="flex items-center bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700 shadow-inner"><Activity size={16} className="mr-3 text-emerald-500" /> {dayData.target}</span>
        </div>
      </div>

      {dayData.isRest && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-600 to-slate-800 text-white p-8 rounded-[40px] shadow-xl border-b-8 border-slate-900">
            <SectionHeader color="text-slate-200" icon={Moon}>Descanso Absoluto Programado</SectionHeader>
            <p className="text-base font-bold leading-snug">{dayData.notes}</p>
          </div>
          <div className="bg-white p-6 rounded-[35px] border border-slate-100 shadow-sm">
            <SectionHeader icon={Heart} color="text-purple-500">Suelo Pélvico (3 min)</SectionHeader>
            {SUELO_PELVICO.map((s, i) => (
              <div key={i} className="border-b border-slate-50 last:border-0 py-3">
                <p className="font-black text-sm text-slate-900 uppercase tracking-tight">{s.name} <span className="text-purple-500 ml-2">[{s.reps}]</span></p>
                <p className="text-[11px] text-slate-500 font-bold mt-1 leading-snug">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-[28px] p-6 shadow-inner">
            <SectionHeader icon={Wind} color="text-blue-500">Respiración 4-7-8 (Pre-Sueño)</SectionHeader>
            <p className="text-[12px] font-bold text-blue-900 leading-snug">10 ciclos: inhala 4s por nariz, retén 7s, exhala 8s por boca. Activa parasimpático, reduce ansiedad, mejora calidad de sueño con CPAP.</p>
          </div>
        </div>
      )}

      {dayData.isRunning && (
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-orange-600 to-orange-800 text-white p-8 rounded-[45px] shadow-2xl shadow-orange-500/20 border-b-8 border-orange-900">
            <SectionHeader color="text-orange-100" icon={Activity}>Estrategia de Running</SectionHeader>
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
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center font-black mr-5 shadow-inner border border-orange-100">{i + 1}</div>
                <div><p className="font-black text-sm text-slate-900 uppercase tracking-tight">{p.name} <span className="text-orange-500">[{p.duration}]</span></p><p className="text-[11px] text-slate-500 font-bold mt-1 leading-snug">{p.desc}</p></div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 text-white p-10 rounded-[50px] border-l-[18px] border-orange-500 shadow-2xl border border-slate-800">
            <SectionHeader color="text-orange-400" icon={Zap}>Fase 2: Bloque Central</SectionHeader>
            <p className="text-2xl font-black leading-tight italic tracking-tight uppercase">Carrera continua a {dayData.zone}.</p>
            <div className="mt-5 p-5 bg-slate-800/50 rounded-3xl border border-slate-700">
              <p className="text-[11px] text-slate-400 font-bold italic text-center">Respiración nasal controlada. Si usas faja abdominal (DRA), revisa que no apriete diafragma.</p>
            </div>
          </div>

          <SectionHeader icon={Wind}>Fase 3: Recuperación (10 min)</SectionHeader>
          <div className="space-y-4">
            {RUNNING_COOLDOWN.map((p, i) => (
              <div key={i} className="bg-white p-6 rounded-[35px] border border-slate-100 shadow-sm flex items-center opacity-85">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center font-black mr-5 shadow-inner border border-blue-100">✓</div>
                <div><p className="font-black text-sm text-slate-900 uppercase tracking-tight">{p.name} <span className="text-blue-500">[{p.duration}]</span></p><p className="text-[11px] text-slate-500 font-bold mt-1 leading-snug">{p.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {dayData.isBike && (
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-sky-600 to-sky-900 text-white p-8 rounded-[45px] shadow-2xl shadow-sky-500/20 border-b-8 border-sky-950">
            <SectionHeader color="text-sky-100" icon={Bike}>Bici Gravel · Specialized</SectionHeader>
            <div className="grid grid-cols-2 gap-5 mt-4">
              <div className="bg-white/10 p-5 rounded-3xl border border-white/10 shadow-inner text-center"><p className="text-[10px] uppercase font-black opacity-60 tracking-widest mb-1">Duración</p><p className="text-2xl font-black">{dayData.duration}</p></div>
              <div className="bg-white/10 p-5 rounded-3xl border border-white/10 shadow-inner text-center"><p className="text-[10px] uppercase font-black opacity-60 tracking-widest mb-1">Zona FC</p><p className="text-2xl font-black">{dayData.zone}</p></div>
            </div>
            {dayData.notes && (
              <div className="mt-5 bg-amber-500/20 border border-amber-400/40 p-4 rounded-2xl flex items-start">
                <AlertTriangle size={18} className="text-amber-200 mr-3 shrink-0 mt-0.5" />
                <p className="text-[11px] font-bold text-amber-100 leading-snug tracking-wide">{dayData.notes}</p>
              </div>
            )}
          </div>

          <SectionHeader icon={Zap}>Fase 1: Activación (12 min)</SectionHeader>
          <div className="space-y-4">
            {BIKE_WARMUP.map((p, i) => (
              <div key={i} className="bg-white p-6 rounded-[35px] border border-slate-100 shadow-sm flex items-center">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center font-black mr-5 shadow-inner border border-sky-100">{i + 1}</div>
                <div><p className="font-black text-sm text-slate-900 uppercase tracking-tight">{p.name} <span className="text-sky-500">[{p.duration}]</span></p><p className="text-[11px] text-slate-500 font-bold mt-1 leading-snug">{p.desc}</p></div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 text-white p-10 rounded-[50px] border-l-[18px] border-sky-500 shadow-2xl border border-slate-800">
            <SectionHeader color="text-sky-400" icon={Bike}>Fase 2: Rodada Principal</SectionHeader>
            <p className="text-2xl font-black leading-tight italic tracking-tight uppercase">Cadencia 80-90 rpm · {dayData.zone}.</p>
            <div className="mt-5 p-5 bg-slate-800/50 rounded-3xl border border-slate-700 space-y-2">
              <p className="text-[11px] text-slate-300 font-bold leading-snug">• Conversacional: deberías poder hablar frases completas sin jadear.</p>
              <p className="text-[11px] text-slate-300 font-bold leading-snug">• Si la FC sube a Z3 por subidas, baja plato y mantén Z2 promedio.</p>
              <p className="text-[11px] text-slate-300 font-bold leading-snug">• Hidratación: 500-750 ml/hora. Carbo líquido si supera 90 min.</p>
              <p className="text-[11px] text-slate-300 font-bold leading-snug">• Postura: revisa que la faja/short no comprima el diafragma.</p>
            </div>
          </div>

          <SectionHeader icon={Wind}>Fase 3: Recuperación (10 min)</SectionHeader>
          <div className="space-y-4">
            {BIKE_COOLDOWN.map((p, i) => (
              <div key={i} className="bg-white p-6 rounded-[35px] border border-slate-100 shadow-sm flex items-center opacity-85">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center font-black mr-5 shadow-inner border border-blue-100">✓</div>
                <div><p className="font-black text-sm text-slate-900 uppercase tracking-tight">{p.name} <span className="text-blue-500">[{p.duration}]</span></p><p className="text-[11px] text-slate-500 font-bold mt-1 leading-snug">{p.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {dayData.exercises && (
        <div className="space-y-8">
          <SectionHeader icon={Zap}>Calentamiento + Activación</SectionHeader>
          <div className="bg-orange-50 rounded-[40px] border border-orange-100 p-8 space-y-5 shadow-inner">
            {WARMUP_WEIGHTS.map((w, i) => (
              <div key={i} className="flex items-start">
                <div className="w-8 h-8 rounded-xl bg-orange-200 text-orange-900 flex items-center justify-center text-[11px] font-black shrink-0 mt-0.5 shadow-sm border border-orange-300">{i + 1}</div>
                <div className="ml-5"><p className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{w.name} <span className="text-orange-600 font-bold ml-1">[{w.duration}]</span></p><p className="text-[11px] text-slate-600 font-bold mt-1 leading-snug">{w.desc}</p></div>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border-2 border-amber-200 rounded-[28px] p-5 shadow-sm">
            <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-2 flex items-center"><ShieldAlert size={14} className="mr-2" />Bracing 360° en TODOS los levantamientos pesados</p>
            <p className="text-[11px] font-bold text-amber-900 leading-snug">1) Inhala expandiendo costillas laterales y espalda baja. 2) Activa cinturón circunferencial: abdomen + oblicuos + lumbar + suelo pélvico. 3) Suelo pélvico al 30% (no 100%). 4) Ejecuta. 5) Exhala controlado en concéntrica. NO Valsalva agresiva — empeora DRA.</p>
          </div>

          <SectionHeader icon={Dumbbell}>Rutina de Pesas</SectionHeader>
          {dayData.exercises.map((ex, i) => <ExerciseCard key={i} ex={ex} index={i} startTimer={startTimer} />)}

          {dayData.coreDRA && (
            <div className="mt-6">
              <SectionHeader icon={Heart} color="text-purple-500">Core DRA-Safe (5 min finales)</SectionHeader>
              {dayData.coreDRA.map((ex, i) => <CoreDRACard key={i} ex={ex} index={i} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ========================================================================
// COACH IA — System prompt actualizado con contexto clínico completo
// ========================================================================

const COACH_SYSTEM_PROMPT = `Eres el Coach Bio-Hormonal de Pedro Falcon. Conoces su perfil completo:

PERFIL CLÍNICO:
- 44 años, 80 kg, 170 cm, perímetro abdominal 95 cm
- SAHOS severa controlada con CPAP (IAH residual 0.1-1.6 — excelente titulación)
- Diástasis de rectos abdominales (DRA) activa
- Disfunción eréctil ansiogénica + refractariedad larga
- Tirzepatide 2.5 mg/semana (dosis inicial, 2 meses más)
- Sueño: 7 horas con CPAP

RESTRICCIONES (actualizadas mayo 2026):
- NO peso muerto convencional (lumbar) — sigue restringido
- Back squat LIBERADO: Pedro tolera sentadillas sin dolor lumbar. Permitido alternando con Front Squat, bracing 360° obligatorio, cinturón en serie pico, técnica revisada. Si reaparece dolor → vuelve solo a Front.
- Remo con barra libre: precaución, prefiere remo con apoyo de pecho o polea
- NO heel taps, reverse crunch, hollow hold, elevación piernas colgado (DRA)
- NO Valsalva agresiva — empeora DRA

PLAN HÍBRIDO FASE 1 (semanas 1-6):
- Lun: Fuerza A (Empuje + Cuádriceps, alternando Front/Back Squat) PM
- Mar: Running CACOS/Z2 4 AM
- Mie: Fuerza B (Tracción + Cadena Posterior) PM
- Jue: Running Rodaje Z2 4 AM
- Vie: Fuerza C (Hombros + Metabólico) PM
- Sab: Running Fondo Z2 AM
- Dom: Bici Gravel Specialized Z1-Z2 60-120 min (OPCIONAL — saltable si fatiga)
- Semana 6: deload obligatorio (-40% volumen)
- Zona 2 FC running: 106-123 ppm (FC máx estimada 176)
- Zona Z1-Z2 baja bici: 100-118 ppm (conversacional, recuperación activa)

EQUIPO DISPONIBLE:
- Multifuncional 150 lb (press, jalón, polea baja, mariposa, ext/curl pierna)
- Barra olímpica 15 kg + 70 kg discos (max 85 kg)
- Mancuernas hasta 20 kg/mano
- Kettlebell 16 kg
- Banco multiejercicio, almohadilla hip thrust
- Garmin Forerunner 970 + banda FC de pecho

NUTRICIÓN:
- Proteína meta: 180 g/día (2.25 g/kg) — crítico por Tirzepatide
- Distribuir en 4-5 tomas de 35-45 g

STACK SUPLEMENTOS:
- Magnesio bisglicinato 400 mg PM
- Zinc 25-30 mg AM (bajó de 50 mg)
- D3 5000 UI + K2 100 mcg AM con grasa
- L-Citrulina 6 g (pre-evento o pre-sueño)
- Creatina monohidrato 5 g/día
- Ashwagandha KSM-66 600 mg PM (opcional pero recomendada)

PROTOCOLOS DIARIOS:
- Bracing 360° en todos los levantamientos pesados
- Suelo pélvico diario (Kegels + Reverse Kegels, 3 min)
- Respiración 4-7-8 pre-sueño
- Caminata ligera permitida en día de descanso

REGLAS DE RESPUESTA:
- Responde en español, motivador, científico, al punto
- Si Pedro propone algo que viole una restricción, explícalo brevemente y ofrece alternativa
- Recuerda que el Domingo NO se entrena
- Para dudas clínicas serias (dolor agudo, refractariedad sin mejora, labs anormales), recomienda consulta médica
- Mantén foco en sus objetivos: bajar grasa visceral, optimizar T natural, cerrar DRA, mejorar ED ansiogénica, preparar 21K`;

const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_KEY_STORAGE = "f_gemini_key_v1";
const COACH_HISTORY_STORAGE = "f_coach_history_v1";

const CoachIA = () => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(GEMINI_KEY_STORAGE) || "");
  const [showSettings, setShowSettings] = useState(() => !localStorage.getItem(GEMINI_KEY_STORAGE));
  const [keyDraft, setKeyDraft] = useState("");

  const [messages, setMessages] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(COACH_HISTORY_STORAGE));
      if (Array.isArray(saved) && saved.length) return saved;
    } catch (_) {}
    return [
      { role: 'model', text: '¡Hola Pedro! Soy tu Coach Bio-Hormonal. Conozco tu plan completo: 3 fuerza + 3 running Z2 + bici gravel dominical, bracing 360° por DRA, back squat ya liberado, stack de 6 suplementos. ¿En qué te ayudo hoy?' }
    ];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState(null);
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(COACH_HISTORY_STORAGE, JSON.stringify(messages.slice(-30)));
  }, [messages]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const saveKey = () => {
    const clean = keyDraft.trim();
    if (!clean) return;
    localStorage.setItem(GEMINI_KEY_STORAGE, clean);
    setApiKey(clean);
    setKeyDraft("");
    setShowSettings(false);
    setLastError(null);
    hapticSuccess();
  };

  const clearKey = () => {
    localStorage.removeItem(GEMINI_KEY_STORAGE);
    setApiKey("");
    setShowSettings(true);
    hapticWarning();
  };

  const clearHistory = () => {
    const fresh = [{ role: 'model', text: 'Historial limpio. ¿En qué te ayudo, Pedro?' }];
    setMessages(fresh);
    haptic();
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!apiKey) {
      setShowSettings(true);
      setLastError("Necesitas pegar tu API key de Google AI Studio antes de chatear.");
      hapticWarning();
      return;
    }
    const userMessage = input;
    setInput('');
    setLastError(null);
    haptic();
    const nextMessages = [...messages, { role: 'user', text: userMessage }];
    setMessages(nextMessages);
    setIsLoading(true);

    try {
      const history = nextMessages
        .filter(m => m.role === 'user' || m.role === 'model')
        .map(m => ({ role: m.role === 'model' ? 'model' : 'user', parts: [{ text: m.text }] }));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: history,
            systemInstruction: { parts: [{ text: COACH_SYSTEM_PROMPT }] },
            generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const apiMsg = data?.error?.message || `HTTP ${response.status}`;
        throw new Error(apiMsg);
      }

      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!reply) {
        const blocked = data?.promptFeedback?.blockReason;
        throw new Error(blocked ? `Respuesta bloqueada: ${blocked}` : "Respuesta vacía del modelo.");
      }
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
    } catch (error) {
      const msg = error?.message || "Error desconocido";
      setLastError(msg);
      setMessages(prev => [...prev, { role: 'model', text: `⚠ No pude responder: ${msg}` }]);
      hapticWarning();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <div className="bg-indigo-600 text-white p-8 rounded-[40px] shadow-lg border-b-[10px] border-indigo-800 mb-4 shrink-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <SectionHeader color="text-indigo-100" icon={Bot}>Coach Bio-Hormonal IA</SectionHeader>
            <p className="text-sm font-black leading-tight italic tracking-tight">Análisis en tiempo real adaptado a tu plan híbrido y perfil clínico.</p>
          </div>
          <button type="button" onClick={() => { haptic(); setShowSettings(s => !s); }} className="bg-white/15 hover:bg-white/25 min-w-[44px] min-h-[44px] p-3 rounded-2xl border border-white/20 ml-3 shrink-0 flex items-center justify-center" aria-label="Ajustes del Coach">
            <Settings size={18} className="text-white" />
          </button>
        </div>
        <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-100/80">
          <span className={`w-2 h-2 rounded-full ${apiKey ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
          {apiKey ? `Key conectada · ${GEMINI_MODEL}` : 'Key no configurada'}
        </div>
      </div>

      {showSettings && (
        <div className="bg-white border border-indigo-100 rounded-3xl p-5 mb-4 shadow-sm shrink-0">
          <div className="flex items-center mb-3">
            <KeyRound size={16} className="text-indigo-500 mr-2" />
            <p className="text-[11px] font-black uppercase tracking-widest text-indigo-700">API Key de Google AI Studio</p>
          </div>
          <p className="text-[11px] text-slate-500 font-bold leading-snug mb-3">
            Obtén una key gratis en <span className="font-mono text-indigo-600">aistudio.google.com/app/apikey</span> y pégala aquí. Se guarda solo en este navegador.
          </p>
          <input
            type="password"
            value={keyDraft}
            onChange={e => setKeyDraft(e.target.value)}
            placeholder={apiKey ? "•••• reemplazar key ••••" : "AIza..."}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono outline-none focus:border-indigo-500 mb-3"
          />
          <div className="flex gap-2 flex-wrap">
            <button onClick={saveKey} disabled={!keyDraft.trim()} className="flex-1 min-w-[100px] bg-indigo-600 text-white p-3 rounded-xl font-black text-[11px] uppercase tracking-widest disabled:opacity-40 active:scale-95">
              Guardar
            </button>
            {apiKey && (
              <button onClick={clearKey} className="bg-red-50 text-red-600 p-3 rounded-xl font-black text-[11px] uppercase tracking-widest active:scale-95 border border-red-100">
                Borrar
              </button>
            )}
            <button onClick={clearHistory} className="bg-slate-100 text-slate-600 p-3 rounded-xl font-black text-[11px] uppercase tracking-widest active:scale-95">
              Limpiar chat
            </button>
          </div>
          {lastError && (
            <div className="mt-3 bg-red-50 border border-red-100 rounded-xl p-3 flex items-start">
              <AlertTriangle size={14} className="text-red-500 mr-2 mt-0.5 shrink-0" />
              <p className="text-[11px] font-bold text-red-700 leading-snug">{lastError}</p>
            </div>
          )}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-2 space-y-4 no-scrollbar pb-10 ios-scroll">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-[25px] text-sm font-bold leading-snug shadow-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-emerald-500 text-white rounded-br-sm' : 'bg-white border border-slate-100 text-slate-700 rounded-bl-sm'}`}>
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
          aria-label="Mensaje al Coach"
          className="flex-1 bg-transparent px-4 text-sm font-bold text-slate-700 outline-none min-h-[44px]"
        />
        <button onClick={handleSend} disabled={isLoading || !input.trim()} aria-label="Enviar mensaje" className="bg-indigo-500 text-white min-w-[44px] min-h-[44px] p-3 rounded-full shadow-md active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

// ========================================================================
// APP PRINCIPAL
// ========================================================================

export default function App() {
  const [tab, setTab] = useState('home');
  const [statTab, setStatTab] = useState('bio');
  const [selectedDay, setSelectedDay] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [logs, setLogs] = useState(() => JSON.parse(localStorage.getItem('f_logs_v5')) || []);
  const [form, setForm] = useState({
    height: '1.70', weight: '', iah: '', erec: 'Sí',
    waist: '', hip: '', neck: '', chest: '', arm: '', leg: '', calf: '',
    fat: '', muscle: '', water: '', lean: '',
    photoFront: null, photoSide: null, photoBack: null, note: ''
  });
  const [galleryPhoto, setGalleryPhoto] = useState(null);

  const [cardioLogs, setCardioLogs] = useState(() => JSON.parse(localStorage.getItem('f_cardio_v5')) || []);
  const [cardioForm, setCardioForm] = useState({ mode: 'run', distance: '', time: '', hr: '', elev: '' });

  useEffect(() => localStorage.setItem('f_logs_v5', JSON.stringify(logs)), [logs]);
  useEffect(() => localStorage.setItem('f_cardio_v5', JSON.stringify(cardioLogs)), [cardioLogs]);

  useEffect(() => {
    if (logs.length > 0 && logs[0]?.height && !form.height) {
      setForm(prev => ({ ...prev, height: logs[0].height }));
    }
  }, [logs]);

  useEffect(() => {
    let int = null;
    if (isRunning && timer > 0) int = setInterval(() => setTimer(t => t - 1), 1000);
    else if (timer === 0 && isRunning) {
      setIsRunning(false);
      if (navigator.vibrate) navigator.vibrate([100, 60, 100, 60, 200]);
    }
    return () => clearInterval(int);
  }, [isRunning, timer]);

  const startTimer = (s) => { setTimer(s); setIsRunning(true); };

  const handlePhotoUpload = (slot) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 500;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.65);
        setForm(prev => ({ ...prev, [slot]: compressedBase64 }));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const removePhotoFromCurrentForm = (slot) => setForm(prev => ({ ...prev, [slot]: null }));

  const deleteLog = (id) => {
    if (!window.confirm('¿Eliminar esta evaluación?')) return;
    setLogs(prev => prev.filter(l => l.id !== id));
  };

  const saveMetrics = () => {
    if (!form.weight) { hapticWarning(); return; }
    hapticSuccess();
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
      fat: '', muscle: '', water: '', lean: '',
      photoFront: null, photoSide: null, photoBack: null, note: ''
    }));
  };

  const saveCardio = () => {
    if (!cardioForm.distance || !cardioForm.time) { hapticWarning(); return; }
    hapticSuccess();
    const d = parseFloat(cardioForm.distance);
    const t = parseFloat(cardioForm.time);
    let paceFormatted = "0:00";
    let speedKmh = "-";
    if (d > 0 && t > 0) {
      const rawPace = t / d;
      const mins = Math.floor(rawPace);
      const secs = Math.round((rawPace - mins) * 60).toString().padStart(2, '0');
      paceFormatted = `${mins}:${secs}`;
      speedKmh = ((d / t) * 60).toFixed(1);
    }
    setCardioLogs([{ id: Date.now(), date: new Date().toLocaleDateString(), ...cardioForm, pace: paceFormatted, speed: speedKmh }, ...cardioLogs]);
    setCardioForm({ mode: cardioForm.mode, distance: '', time: '', hr: '', elev: '' });
  };

  const deleteCardio = (id) => {
    if (!window.confirm('¿Eliminar esta sesión de cardio?')) return;
    setCardioLogs(prev => prev.filter(l => l.id !== id));
  };

  const getLogPhotos = (l) => {
    const out = [];
    if (l.photoFront) out.push({ type: 'Frontal', data: l.photoFront });
    if (l.photoSide) out.push({ type: 'Lateral', data: l.photoSide });
    if (l.photoBack) out.push({ type: 'Posterior', data: l.photoBack });
    if (!out.length && l.photo) out.push({ type: 'Foto', data: l.photo });
    return out;
  };
  const logsWithPhotos = logs.filter(l => getLogPhotos(l).length > 0);
  const firstLog = logs[logs.length - 1];
  const latestLog = logs[0];
  const delta = (key) => {
    if (!firstLog || !latestLog || firstLog.id === latestLog.id) return null;
    const a = parseFloat(firstLog[key]);
    const b = parseFloat(latestLog[key]);
    if (isNaN(a) || isNaN(b)) return null;
    const diff = b - a;
    return { from: a, to: b, diff: diff.toFixed(1), sign: diff > 0 ? '+' : '' };
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
          <button
            type="button"
            aria-label="Volver al inicio"
            onClick={() => { haptic(); setTab('home'); setSelectedDay(null); }}
            className="text-left active:opacity-70 transition-opacity bg-transparent border-0 p-0"
          >
            <h1 className="text-xl sm:text-2xl font-black text-white leading-none tracking-tighter uppercase italic">
              Falcon<span className="text-emerald-400">44+</span>
            </h1>
            <p className="text-[10px] sm:text-[11px] text-emerald-500/80 uppercase font-bold tracking-[0.3em] mt-1.5 opacity-80 leading-none">Bio-Hormonal Mastery</p>
          </button>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[18px] sm:rounded-[20px] bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center font-black text-white text-base sm:text-lg shadow-xl shadow-emerald-500/30 border border-white/20" aria-hidden="true">PF</div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 sm:p-5">

        {/* TAB: INICIO */}
        {tab === 'home' && selectedDay === null && (
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            <div className="bg-slate-900 rounded-[35px] sm:rounded-[45px] p-6 sm:p-7 text-white shadow-xl relative overflow-hidden border border-slate-800 ring-1 ring-white/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -mr-16 -mt-16 blur-3xl animate-pulse"></div>
              <div className="relative z-10 flex items-start space-x-4">
                <div className="bg-red-600 p-3 sm:p-4 rounded-2xl shadow-lg border border-red-500/50">
                  <ShieldAlert size={28} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-red-500 mb-1.5">Protocolo Clínico</p>
                  <p className="text-[13px] sm:text-[15px] font-black leading-snug text-slate-100 uppercase tracking-tight italic">Bracing 360° + Cero peso muerto convencional.<br /><span className="text-slate-400 font-bold lowercase text-[11px] sm:text-[12px] opacity-90 tracking-normal">Back squat liberado tras tolerar sentadillas sin dolor — alterna con Front. Suelo pélvico diario para cerrar DRA y mejorar ED.</span></p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-100 rounded-[28px] p-5 shadow-sm">
              <SectionHeader icon={Heart} color="text-purple-500">Recordatorio Diario</SectionHeader>
              <div className="space-y-2 text-[11px] font-bold text-purple-900">
                <p>• <span className="font-black">Suelo pélvico</span>: 3 min (Kegels + Reverse Kegels)</p>
                <p>• <span className="font-black">Bracing 360°</span> en cada serie pesada</p>
                <p>• <span className="font-black">Respiración 4-7-8</span> pre-sueño (10 ciclos)</p>
                <p>• <span className="font-black">Proteína</span>: 180 g distribuidos en 4-5 tomas</p>
              </div>
            </div>

            <div className="space-y-4">
              <SectionHeader icon={Clock}>Calendario de Optimización</SectionHeader>
              <div className="grid gap-4 sm:gap-5">
                {SCHEDULE.map((d, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`${d.day}: ${d.type}`}
                    onClick={() => { haptic(); setTab('workout'); setSelectedDay(i); }}
                    className={`w-full text-left bg-white p-5 sm:p-7 rounded-[30px] sm:rounded-[40px] border border-slate-100 shadow-sm flex justify-between items-center border-l-[10px] sm:border-l-[14px] ${d.isRest ? 'border-l-slate-400' : d.isRunning ? 'border-l-orange-500' : d.isBike ? 'border-l-sky-500' : 'border-l-emerald-500'} active:scale-[0.97] transition-transform duration-150 hover:shadow-md`}
                  >
                    <div>
                      <p className="font-black text-slate-900 text-xl sm:text-2xl leading-none tracking-tighter uppercase">{d.day}</p>
                      <p className={`text-[11px] sm:text-[12px] font-black mt-2 sm:mt-2.5 uppercase tracking-widest leading-none ${d.isRest ? 'text-slate-500' : d.isRunning ? 'text-orange-600' : d.isBike ? 'text-sky-600' : 'text-emerald-600'}`}>{d.type}</p>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <span
                        role="button"
                        tabIndex={0}
                        aria-label={`Agendar ${d.day} en Google Calendar`}
                        onClick={(e) => { e.stopPropagation(); haptic(); handleCalendar(d); }}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); haptic(); handleCalendar(d); } }}
                        className="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 text-slate-400 active:text-emerald-500 bg-slate-50 rounded-2xl transition-colors shadow-inner cursor-pointer"
                      >
                        <CalendarPlus size={20} />
                      </span>
                      <ChevronRight size={20} className="text-slate-300" aria-hidden="true" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: ENTRENO */}
        {tab === 'workout' && (
          <WorkoutView selectedDay={selectedDay} setSelectedDay={setSelectedDay} startTimer={startTimer} />
        )}

        {/* TAB: DIETA + SUPLEMENTACIÓN */}
        {tab === 'diet' && (
          <div className="space-y-6 sm:space-y-8 animate-fade-in text-slate-900">
            <div className="bg-slate-900 text-white rounded-[45px] sm:rounded-[55px] p-10 sm:p-12 text-center shadow-xl border-b-[12px] border-emerald-500 relative overflow-hidden border border-slate-800">
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-400/10 rounded-full -mr-20 -mt-20 blur-[80px]"></div>
              <h2 className="text-7xl sm:text-8xl font-black text-emerald-400 tracking-tighter leading-none italic drop-shadow-md">180<span className="text-2xl sm:text-3xl ml-1 uppercase tracking-normal text-white">g</span></h2>
              <p className="text-[10px] sm:text-[12px] font-black uppercase tracking-[0.4em] text-slate-500 mt-6 opacity-80 leading-none">Proteína Diaria · 2.25 g/kg</p>
              <p className="text-[10px] sm:text-[11px] font-bold text-emerald-300/80 mt-3 italic">Crítico con Tirzepatide para preservar masa magra</p>
            </div>

            <SectionHeader icon={Apple}>Distribución Proteica</SectionHeader>
            <div className="bg-white p-6 sm:p-8 rounded-[35px] sm:rounded-[45px] border border-slate-100 shadow-sm flex items-center transition-all active:bg-slate-50">
              <div className="bg-orange-50 p-4 sm:p-5 rounded-[25px] mr-5 sm:mr-7 shrink-0 shadow-inner border border-orange-100"><Apple className="text-orange-500" size={32} /></div>
              <div><h3 className="font-black text-slate-900 uppercase text-sm sm:text-base tracking-tight leading-none">Sólidos (~130 g)</h3><p className="text-[11px] sm:text-[13px] text-slate-500 font-bold leading-tight mt-1.5 italic">3 huevos enteros desayuno + 200 g proteína magra en almuerzo y cena. Distribuir en 4-5 tomas de 35-45 g.</p></div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-[35px] sm:rounded-[45px] border border-slate-100 shadow-sm flex items-center transition-all active:bg-slate-50">
              <div className="bg-blue-50 p-4 sm:p-5 rounded-[25px] mr-5 sm:mr-7 shrink-0 shadow-inner border border-blue-100"><Activity className="text-blue-500" size={32} /></div>
              <div>
                <h3 className="font-black text-slate-900 uppercase text-sm sm:text-base tracking-tight leading-none">Whey Isolate (~50 g)</h3>
                <p className="text-[11px] sm:text-[13px] text-slate-500 font-bold leading-tight mt-1.5 italic">1 scoop post-entreno + 1 scoop a las 4:00 PM (con agua). Cero lactosa para evitar picos estrogénicos.</p>
              </div>
            </div>

            <div className="bg-slate-900 p-8 sm:p-10 rounded-[45px] sm:rounded-[55px] text-white shadow-2xl border border-slate-800">
              <SectionHeader color="text-emerald-400" icon={Zap}>Stack de Suplementación</SectionHeader>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
                {[
                  { n: 'Magnesio', v: '400 mg', l: 'Bisglicinato · PM' },
                  { n: 'Zinc', v: '25-30 mg', l: 'AM con comida' },
                  { n: 'D3+K2', v: '5000 UI / 100 mcg', l: 'AM con grasa' },
                  { n: 'L-Citrulina', v: '6 g', l: 'Pre-evento o PM' },
                  { n: 'Creatina', v: '5 g', l: 'Monohidrato · libre' },
                  { n: 'Ashwagandha', v: '600 mg', l: 'KSM-66 · PM' }
                ].map((s, i) => (
                  <div key={i} className="bg-slate-800/40 p-5 rounded-[28px] border border-slate-700 shadow-inner">
                    <p className="text-[10px] text-slate-500 uppercase font-black mb-1.5 tracking-widest leading-none">{s.l}</p>
                    <p className="text-base sm:text-lg font-black text-white leading-none">{s.n}</p>
                    <p className="text-[10px] sm:text-[12px] font-bold text-emerald-400 mt-2 leading-none">{s.v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4">
                <p className="text-[11px] font-bold text-amber-200 leading-snug">⚠ Zinc bajó de 50 a 25-30 mg para evitar bloqueo de absorción de cobre con uso crónico. Si mantienes 50 mg, agrega 2 mg de cobre o cicla 4 días de descanso.</p>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-100 rounded-[35px] p-6 shadow-sm">
              <SectionHeader icon={Heart} color="text-purple-500">Labs Pendientes</SectionHeader>
              <div className="text-[11px] font-bold text-purple-900 leading-snug space-y-1">
                <p>• T total, T libre, SHBG, estradiol</p>
                <p>• Prolactina, DHT, cortisol matinal (8 AM ayuno)</p>
                <p>• Glucosa + insulina ayuno + HOMA-IR</p>
                <p>• Ferritina, HbA1c, Vit D, PSA, lipidograma + apoB</p>
                <p className="mt-2 text-purple-700 italic">+ Ecografía abdominal para medir ancho DRA</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB: SEGUIMIENTO */}
        {tab === 'stats' && (
          <div className="space-y-6 animate-fade-in pb-12 text-slate-900">
            <div role="tablist" aria-label="Tipo de avance" className="bg-slate-200/60 p-1.5 rounded-full flex mx-auto w-full max-w-[280px] shadow-inner mb-6">
              <button role="tab" aria-selected={statTab === 'bio'} onClick={() => { haptic(); setStatTab('bio'); }} className={`flex-1 min-h-[40px] py-2.5 px-2 rounded-full text-[11px] font-bold transition-all ${statTab === 'bio' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}>Físico & Salud</button>
              <button role="tab" aria-selected={statTab === 'cardio'} onClick={() => { haptic(); setStatTab('cardio'); }} className={`flex-1 min-h-[40px] py-2.5 px-2 rounded-full text-[11px] font-bold transition-all ${statTab === 'cardio' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}>Cardio Z2</button>
            </div>

            {statTab === 'bio' && (
              <div className="space-y-6">
                <div className="bg-white rounded-[35px] border border-slate-100 p-6 shadow-sm">
                  <SectionHeader icon={LineChart} color="text-indigo-500">Evaluación Biológica</SectionHeader>

                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">1. Medidas Base & Descanso</h4>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-[0.1em]">Altura (m)</label>
                      <input type="number" step="0.01" value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black outline-none focus:border-indigo-500 transition-all text-center shadow-inner font-mono" placeholder="1.70" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-[0.1em]">Peso (kg)</label>
                      <input type="number" step="0.1" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black outline-none focus:border-indigo-500 transition-all text-center shadow-inner font-mono" placeholder="00.0" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-indigo-500 uppercase ml-2 tracking-[0.1em]">IAH (CPAP)</label>
                      <input type="number" step="0.1" value={form.iah} onChange={e => setForm({ ...form, iah: e.target.value })} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black outline-none focus:border-indigo-500 transition-all text-center shadow-inner font-mono" placeholder="0.0" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-[0.1em]">Erección</label>
                      <select value={form.erec} onChange={e => setForm({ ...form, erec: e.target.value })} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black outline-none appearance-none text-center shadow-inner">
                        <option>Sí</option><option>No</option>
                      </select>
                    </div>
                  </div>

                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">2. Composición (Báscula Bioimpedancia)</h4>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-emerald-500 uppercase ml-2 tracking-[0.1em]">Grasa %</label>
                      <input type="number" step="0.1" value={form.fat} onChange={e => setForm({ ...form, fat: e.target.value })} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black outline-none focus:border-emerald-500 transition-all text-center shadow-inner font-mono text-emerald-700" placeholder="00.0" />
                      <p className="text-[10px] text-center text-slate-400 font-bold uppercase mt-1">Meta: 15-18%</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-blue-500 uppercase ml-2 tracking-[0.1em]">Músculo %</label>
                      <input type="number" step="0.1" value={form.muscle} onChange={e => setForm({ ...form, muscle: e.target.value })} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black outline-none focus:border-blue-500 transition-all text-center shadow-inner font-mono text-blue-700" placeholder="00.0" />
                      <p className="text-[10px] text-center text-slate-400 font-bold uppercase mt-1">Meta: 35-40%</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-cyan-500 uppercase ml-2 tracking-[0.1em]">Agua %</label>
                      <input type="number" step="0.1" value={form.water} onChange={e => setForm({ ...form, water: e.target.value })} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black outline-none focus:border-cyan-500 transition-all text-center shadow-inner font-mono text-cyan-700" placeholder="00.0" />
                      <p className="text-[10px] text-center text-slate-400 font-bold uppercase mt-1">Meta: 55-60%</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-orange-500 uppercase ml-2 tracking-[0.1em]">M. Magra (kg)</label>
                      <input type="number" step="0.1" value={form.lean} onChange={e => setForm({ ...form, lean: e.target.value })} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black outline-none focus:border-orange-500 transition-all text-center shadow-inner font-mono text-orange-700" placeholder="00.0" />
                      <p className="text-[10px] text-center text-slate-400 font-bold uppercase mt-1">Hueso + Músculo</p>
                    </div>
                  </div>

                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">3. Perímetros (Cinta)</h4>
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {['Cintura', 'Cadera', 'Cuello', 'Pecho', 'Brazo', 'Pierna', 'Pantorrilla'].map((metric, i) => {
                      const keys = ['waist', 'hip', 'neck', 'chest', 'arm', 'leg', 'calf'];
                      return (
                        <div key={i} className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-tight">{metric}</label>
                          <input type="number" step="0.1" value={form[keys[i]]} onChange={e => setForm({ ...form, [keys[i]]: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black outline-none focus:border-indigo-500 transition-all text-center shadow-inner font-mono" placeholder="00" />
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {form.weight && form.height && parseFloat(form.height) > 0 && (
                      <div className="bg-indigo-50 p-4 rounded-[20px] border border-indigo-100 flex flex-col justify-center items-center shadow-inner">
                        <p className="text-[10px] font-black uppercase text-indigo-800 tracking-widest mb-1">IMC</p>
                        <span className="text-2xl font-black text-indigo-600">{(parseFloat(form.weight) / Math.pow(parseFloat(form.height), 2)).toFixed(1)}</span>
                        <p className="text-[10px] font-bold text-indigo-400 mt-1 uppercase">Normal: 18.5 - 24.9</p>
                      </div>
                    )}
                    {form.waist && form.hip && parseFloat(form.hip) > 0 && (
                      <div className={`p-4 rounded-[20px] border flex flex-col justify-center items-center shadow-inner ${(parseFloat(form.waist) / parseFloat(form.hip)) >= 0.90 ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${(parseFloat(form.waist) / parseFloat(form.hip)) >= 0.90 ? 'text-red-800' : 'text-emerald-800'}`}>ICC</p>
                        <span className={`text-2xl font-black ${(parseFloat(form.waist) / parseFloat(form.hip)) >= 0.90 ? 'text-red-500' : 'text-emerald-600'}`}>{(parseFloat(form.waist) / parseFloat(form.hip)).toFixed(2)}</span>
                        <p className={`text-[10px] font-bold mt-1 uppercase ${(parseFloat(form.waist) / parseFloat(form.hip)) >= 0.90 ? 'text-red-400' : 'text-emerald-500'}`}>Riesgo si {">"} 0.90</p>
                      </div>
                    )}
                  </div>

                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">4. Fotos de Progreso Corporal</h4>
                  <p className="text-[11px] text-slate-500 font-bold mb-3 italic">Tip: misma luz, mismo punto, sin filtro. 3 ángulos te dan mejor lectura que un solo frente.</p>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { slot: 'photoFront', label: 'Frontal' },
                      { slot: 'photoSide', label: 'Lateral' },
                      { slot: 'photoBack', label: 'Posterior' }
                    ].map(({ slot, label }) => (
                      <div key={slot} className="relative">
                        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-indigo-200 rounded-2xl bg-indigo-50/50 cursor-pointer active:bg-indigo-50 overflow-hidden">
                          {form[slot] ? (
                            <img src={form[slot]} alt={label} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center justify-center">
                              <Camera size={20} className="text-indigo-400 mb-1" />
                              <p className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">{label}</p>
                            </div>
                          )}
                          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload(slot)} aria-label={`Subir foto ${label}`} />
                        </label>
                        {form[slot] && (
                          <button onClick={() => removePhotoFromCurrentForm(slot)} aria-label={`Quitar foto ${label}`} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md min-h-[24px]">
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mb-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-[0.1em]">Nota subjetiva (energía, libido, sueño...)</label>
                    <textarea value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} rows={2} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-indigo-500 shadow-inner mt-1" placeholder="Ej: dormí 7h, energía 8/10, sin doming en hip thrust." />
                  </div>

                  <button onClick={saveMetrics} className="w-full bg-indigo-600 text-white p-4 rounded-2xl font-black text-xs active:scale-95 shadow-md shadow-indigo-500/30 uppercase tracking-[0.2em] mt-1 transition-all border-b-4 border-indigo-800">
                    Guardar Evaluación
                  </button>
                </div>

                {logs.length >= 2 && (
                  <div className="bg-gradient-to-br from-emerald-50 to-white rounded-[35px] border border-emerald-100 p-6 shadow-sm">
                    <SectionHeader icon={LineChart} color="text-emerald-600">Tendencia: Primera vs Última</SectionHeader>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { k: 'weight', label: 'Peso', unit: 'kg', goodDown: true },
                        { k: 'waist', label: 'Cintura', unit: 'cm', goodDown: true },
                        { k: 'fat', label: 'Grasa', unit: '%', goodDown: true },
                        { k: 'muscle', label: 'Músculo', unit: '%', goodDown: false }
                      ].map(({ k, label, unit, goodDown }) => {
                        const d = delta(k);
                        if (!d) return null;
                        const isGood = goodDown ? d.diff < 0 : d.diff > 0;
                        const color = parseFloat(d.diff) === 0 ? 'text-slate-500' : isGood ? 'text-emerald-600' : 'text-red-500';
                        return (
                          <div key={k} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-inner">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
                            <p className="text-sm font-black text-slate-700 mt-1">{d.from}{unit} → <span className="text-slate-900">{d.to}{unit}</span></p>
                            <p className={`text-[11px] font-black mt-1 ${color}`}>{d.sign}{d.diff} {unit}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {logsWithPhotos.length > 0 && (
                  <div className="bg-white rounded-[35px] border border-slate-100 p-5 shadow-sm">
                    <SectionHeader icon={ImageIcon} color="text-indigo-500">Galería de Composición Corporal</SectionHeader>
                    <p className="text-[11px] text-slate-500 font-bold mb-4 italic">Toca una foto para verla en grande. {logsWithPhotos.length} evaluación(es) con foto.</p>
                    <div className="overflow-x-auto -mx-2 px-2 no-scrollbar">
                      <div className="flex gap-3">
                        {[...logsWithPhotos].reverse().map(l => {
                          const photos = getLogPhotos(l);
                          return (
                            <div key={l.id} className="shrink-0 w-32">
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center mb-1.5">{l.date}</p>
                              <div className="grid gap-1.5">
                                {photos.map((p, i) => (
                                  <button key={i} onClick={() => { haptic(); setGalleryPhoto({ ...p, date: l.date, weight: l.weight }); }} className="w-32 h-40 rounded-2xl overflow-hidden border border-slate-200 shadow-sm active:scale-95 transition-transform relative" aria-label={`Ver foto ${p.type} del ${l.date}`}>
                                    <img src={p.data} alt={p.type} className="w-full h-full object-cover" />
                                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase">{p.type}</span>
                                  </button>
                                ))}
                              </div>
                              <p className="text-[10px] text-center text-slate-500 font-bold mt-1.5">{l.weight ? `${l.weight} kg` : '—'} {l.fat ? `· ${l.fat}%` : ''}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {logsWithPhotos.length >= 2 && (
                      <div className="mt-5 pt-4 border-t border-slate-100">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Comparativo Inicio ↔ Hoy</p>
                        <div className="grid grid-cols-2 gap-2">
                          {(() => {
                            const oldest = [...logsWithPhotos].reverse()[0];
                            const newest = logsWithPhotos[0];
                            const oldFront = getLogPhotos(oldest)[0];
                            const newFront = getLogPhotos(newest)[0];
                            return (
                              <>
                                <div>
                                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1 text-center">{oldest.date}</p>
                                  {oldFront && <img src={oldFront.data} alt="inicio" className="w-full rounded-2xl object-cover h-48 border border-slate-200" />}
                                </div>
                                <div>
                                  <p className="text-[10px] font-black text-emerald-600 uppercase mb-1 text-center">{newest.date}</p>
                                  {newFront && <img src={newFront.data} alt="hoy" className="w-full rounded-2xl object-cover h-48 border-2 border-emerald-300" />}
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {logs.length > 0 && (
                  <div className="space-y-4">
                    <SectionHeader icon={ImageIcon} color="text-slate-400">Historial de Revisiones</SectionHeader>
                    {logs.map(l => {
                      const photos = getLogPhotos(l);
                      return (
                        <div key={l.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col space-y-4">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <span className="text-xs font-black text-slate-800 uppercase tracking-widest">{l.date}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Erec: <span className="text-slate-700">{l.erec}</span> | IAH: <span className="text-indigo-500">{l.iah || '-'}</span></span>
                              <button onClick={() => deleteLog(l.id)} className="text-red-400 hover:text-red-600 active:scale-90" aria-label="Eliminar evaluación"><Trash2 size={14} /></button>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            {photos.length > 0 ? (
                              <div className="flex gap-1.5 shrink-0">
                                {photos.map((p, i) => (
                                  <button key={i} onClick={() => { haptic(); setGalleryPhoto({ ...p, date: l.date, weight: l.weight }); }} className="w-16 h-20 rounded-xl bg-slate-200 overflow-hidden shadow-inner border border-slate-300 active:scale-95" aria-label={`Ver ${p.type}`}>
                                    <img src={p.data} alt={p.type} className="w-full h-full object-cover" />
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className="w-20 h-24 rounded-2xl bg-slate-50 shrink-0 flex flex-col items-center justify-center shadow-inner border border-slate-200 border-dashed">
                                <ImageIcon size={20} className="text-slate-300 mb-1" />
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Sin Foto</span>
                              </div>
                            )}
                            <div className="flex-1 grid grid-cols-2 gap-x-2 gap-y-3 text-[10px] font-bold text-slate-500">
                              <div><span className="block text-[10px] uppercase tracking-widest text-slate-400">Peso / IMC</span><span className="text-sm font-black text-slate-800">{l.weight}k <span className="text-xs text-indigo-500">({l.imc})</span></span></div>
                              <div><span className="block text-[10px] uppercase tracking-widest text-slate-400">ICC (Cint/Cad)</span><span className="text-sm font-black text-slate-800">{l.icc}</span></div>
                              <div><span className="block text-[10px] uppercase tracking-widest text-slate-400">Grasa / Músc.</span><span className="text-sm font-black text-slate-800">{l.fat ? l.fat + '%' : '-'} / {l.muscle ? l.muscle + '%' : '-'}</span></div>
                              <div><span className="block text-[10px] uppercase tracking-widest text-slate-400">Cintura / Pecho</span><span className="text-sm font-black text-slate-800">{l.waist || '-'} / {l.chest || '-'}</span></div>
                            </div>
                          </div>
                          {l.note && (
                            <p className="text-[11px] text-slate-600 font-bold italic bg-slate-50 rounded-xl p-3 border border-slate-100 leading-snug">"{l.note}"</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {statTab === 'cardio' && (
              <div className="bg-white rounded-[35px] border border-slate-100 p-5 sm:p-6 shadow-sm animate-fade-in">
                <SectionHeader icon={ActivitySquare} color="text-orange-500">Progreso Zona 2</SectionHeader>
                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 mb-5 shadow-inner">
                  <p className="text-[11px] text-orange-800 font-bold text-center italic leading-tight">"La meta no es correr más rápido ni pedalear con más watts, es sostener más distancia con la misma FC baja."</p>
                </div>

                <div role="tablist" aria-label="Modo de cardio" className="bg-slate-100 p-1.5 rounded-full flex mb-5 shadow-inner">
                  <button role="tab" aria-selected={cardioForm.mode === 'run'} onClick={() => { haptic(); setCardioForm(f => ({ ...f, mode: 'run' })); }} className={`flex-1 min-h-[40px] py-2.5 rounded-full text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${cardioForm.mode === 'run' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'}`}>
                    <Footprints size={14} /> Running
                  </button>
                  <button role="tab" aria-selected={cardioForm.mode === 'bike'} onClick={() => { haptic(); setCardioForm(f => ({ ...f, mode: 'bike' })); }} className={`flex-1 min-h-[40px] py-2.5 rounded-full text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${cardioForm.mode === 'bike' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}>
                    <Bike size={14} /> Bici Gravel
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-tight">Dist (km)</label>
                    <input type="number" step="0.01" value={cardioForm.distance} onChange={e => setCardioForm({ ...cardioForm, distance: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black outline-none focus:border-orange-500 transition-all text-center shadow-inner font-mono" placeholder={cardioForm.mode === 'bike' ? '30.0' : '5.0'} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-tight">Tiempo (min)</label>
                    <input type="number" value={cardioForm.time} onChange={e => setCardioForm({ ...cardioForm, time: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black outline-none focus:border-orange-500 transition-all text-center shadow-inner font-mono" placeholder={cardioForm.mode === 'bike' ? '90' : '45'} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-red-500 uppercase ml-1 tracking-tight">FC media (ppm)</label>
                    <input type="number" value={cardioForm.hr} onChange={e => setCardioForm({ ...cardioForm, hr: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black outline-none focus:border-red-500 transition-all text-center shadow-inner font-mono text-red-600" placeholder={cardioForm.mode === 'bike' ? '110' : '115'} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-tight">{cardioForm.mode === 'bike' ? 'Desnivel (m)' : 'Cad/Paso'}</label>
                    <input type="number" value={cardioForm.elev} onChange={e => setCardioForm({ ...cardioForm, elev: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black outline-none focus:border-emerald-500 transition-all text-center shadow-inner font-mono" placeholder={cardioForm.mode === 'bike' ? '350' : '175'} />
                  </div>
                </div>
                <button onClick={saveCardio} className={`w-full p-3.5 rounded-xl text-white font-black text-xs active:scale-95 shadow-md uppercase tracking-[0.2em] mt-1 transition-all border-b-4 ${cardioForm.mode === 'bike' ? 'bg-sky-500 shadow-sky-500/30 border-sky-700' : 'bg-orange-500 shadow-orange-500/30 border-orange-700'}`}>
                  Guardar {cardioForm.mode === 'bike' ? 'Salida Bici' : 'Carrera'}
                </button>

                {cardioLogs.length > 0 && (
                  <div className="mt-5 overflow-hidden rounded-2xl border border-slate-100 shadow-sm bg-white">
                    <table className="w-full text-left text-[10px] sm:text-[11px]">
                      <thead className="bg-slate-900 text-white font-black uppercase tracking-widest">
                        <tr className="border-b border-slate-800">
                          <th className="px-1 py-3 text-center">Tipo</th>
                          <th className="px-1 py-3 text-center">Fecha</th>
                          <th className="px-1 py-3 text-center">Dist</th>
                          <th className="px-1 py-3 text-center text-orange-400">Ritmo/Vel</th>
                          <th className="px-1 py-3 text-center text-red-400">PPM</th>
                          <th className="px-1 py-3 text-center"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {cardioLogs.map(l => {
                          const parts = (l.date || '').split('/');
                          const shortDate = parts.length >= 2 ? `${parts[0]}/${parts[1]}` : l.date;
                          const isBike = l.mode === 'bike';
                          return (
                            <tr key={l.id} className="font-bold text-slate-700 active:bg-slate-50">
                              <td className="px-1 py-3 text-center">
                                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg ${isBike ? 'bg-sky-100 text-sky-600' : 'bg-orange-100 text-orange-600'}`}>
                                  {isBike ? <Bike size={13} /> : <Footprints size={13} />}
                                </span>
                              </td>
                              <td className="px-1 py-3 text-center text-slate-400 tracking-tight">{shortDate}</td>
                              <td className="px-1 py-3 text-center tracking-tight">{l.distance}k</td>
                              <td className="px-1 py-3 text-center font-black italic tracking-tighter">
                                {isBike
                                  ? <span className="text-sky-600">{l.speed || '-'}<span className="text-[10px] opacity-60"> km/h</span></span>
                                  : <span className="text-orange-600">{l.pace}<span className="text-[10px] opacity-60"> /k</span></span>
                                }
                              </td>
                              <td className="px-1 py-3 text-center text-red-600">{l.hr || '-'}</td>
                              <td className="px-1 py-3 text-center">
                                <button onClick={() => deleteCardio(l.id)} aria-label="Eliminar sesión" className="text-slate-300 hover:text-red-500 active:scale-90"><Trash2 size={12} /></button>
                              </td>
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

        {/* TAB: COACH IA */}
        {tab === 'coach' && (
          <div className="animate-fade-in">
            <CoachIA />
          </div>
        )}
      </main>

      {/* LIGHTBOX GALERÍA — HIG modal */}
      {galleryPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Foto de progreso ${galleryPhoto.type} del ${galleryPhoto.date}`}
          onClick={() => setGalleryPhoto(null)}
          onKeyDown={(e) => { if (e.key === 'Escape') setGalleryPhoto(null); }}
          tabIndex={-1}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <button
            type="button"
            aria-label="Cerrar galería"
            onClick={() => { haptic(); setGalleryPhoto(null); }}
            className="absolute top-[calc(env(safe-area-inset-top)+1rem)] right-6 bg-white/10 text-white min-w-[44px] min-h-[44px] p-3 rounded-full border border-white/20 active:scale-90 flex items-center justify-center"
          >
            <X size={20} />
          </button>
          <div className="max-w-md w-full" onClick={e => e.stopPropagation()}>
            <img src={galleryPhoto.data} alt={galleryPhoto.type} className="w-full rounded-3xl shadow-2xl" />
            <div className="mt-4 bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20 text-white text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">{galleryPhoto.type}</p>
              <p className="text-lg font-black mt-1">{galleryPhoto.date}</p>
              {galleryPhoto.weight && <p className="text-[11px] font-bold text-slate-300 mt-1">{galleryPhoto.weight} kg</p>}
            </div>
          </div>
        </div>
      )}

      {/* TIMER FLOTANTE */}
      {(timer > 0 || isRunning) && (
        <div role="timer" aria-live="polite" aria-label={`Descanso ${Math.floor(timer / 60)} minutos ${timer % 60} segundos`} className="fixed bottom-[85px] sm:bottom-28 left-1/2 -translate-x-1/2 w-[90%] max-w-[360px] bg-slate-900 text-white px-5 py-4 sm:px-6 sm:py-5 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex items-center justify-between z-50 border-2 border-emerald-500/30 animate-fade-in backdrop-blur-2xl bg-opacity-95 ring-4 ring-slate-900/40">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative">
              <Timer size={28} className={timer === 0 ? "text-red-500 animate-pulse" : "text-emerald-400"} />
              {isRunning && <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-30 animate-pulse"></div>}
            </div>
            <span className="font-mono font-black text-4xl sm:text-5xl tracking-tighter tabular-nums text-emerald-400 drop-shadow-md italic">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              type="button"
              aria-label={isRunning ? 'Pausar descanso' : 'Reanudar descanso'}
              onClick={() => { haptic(); setIsRunning(!isRunning); }}
              className="bg-slate-800 min-w-[44px] min-h-[44px] p-3 sm:p-4 rounded-[20px] active:scale-90 transition-transform border border-slate-700 shadow-lg"
            >
              {isRunning ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" />}
            </button>
            <button
              type="button"
              aria-label="Cancelar descanso"
              onClick={() => { haptic(); setTimer(0); setIsRunning(false); }}
              className="text-red-400 font-black text-3xl sm:text-4xl leading-none active:scale-75 transition-all px-3 min-w-[44px] min-h-[44px]"
            >×</button>
          </div>
        </div>
      )}

      {/* NAVEGACIÓN — HIG Tab Bar */}
      <nav role="tablist" aria-label="Navegación principal" className="bg-slate-900 fixed bottom-0 w-full border-t border-slate-800 z-50 pb-[env(safe-area-inset-bottom)] shadow-[0_-15px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl bg-opacity-95">
        <div className="max-w-md mx-auto flex justify-between items-center px-1 sm:px-2">
          {[
            { id: 'home', icon: Home, label: 'Inicio' },
            { id: 'workout', icon: Dumbbell, label: 'Entreno' },
            { id: 'diet', icon: Apple, label: 'Dieta' },
            { id: 'stats', icon: Activity, label: 'Avance' },
            { id: 'coach', icon: Bot, label: 'Coach IA' }
          ].map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={active}
                aria-label={item.label}
                onClick={() => { haptic(); setTab(item.id); setSelectedDay(null); }}
                className={`flex flex-col items-center justify-center w-[20%] py-3 sm:py-4 transition-all duration-200 ${active ? 'text-emerald-400' : 'text-slate-500'}`}
              >
                <item.icon size={24} aria-hidden="true" className={active ? "drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" : ""} />
                <span className="text-[10px] sm:text-[11px] mt-1 font-bold tracking-tight w-full text-center truncate px-0.5">{item.label}</span>
                {active && <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1 shadow-[0_0_8px_rgba(52,211,153,1)]" aria-hidden="true"></div>}
              </button>
            );
          })}
        </div>
      </nav>

      <style dangerouslySetInnerHTML={{
        __html: `
        /* HIG · Tipografía nativa */
        html, body {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", system-ui, sans-serif;
          font-feature-settings: "kern", "liga", "ss01", "tnum";
          text-rendering: optimizeLegibility;
        }
        body { -webkit-tap-highlight-color: transparent; background-color: #fcfdfe; }
        * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

        /* HIG · Tap targets 44pt mínimo */
        button, a[role="button"], label[role="button"], [data-tap] {
          min-height: 44px;
          touch-action: manipulation;
        }
        nav button { min-height: 56px; }

        /* HIG · Focus visible (a11y teclado) */
        button:focus-visible, a:focus-visible, input:focus-visible, textarea:focus-visible, select:focus-visible {
          outline: 2px solid #10b981;
          outline-offset: 2px;
          border-radius: 12px;
        }

        /* HIG · Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }

        /* HIG · Dark mode neutral */
        @media (prefers-color-scheme: dark) {
          html, body { background-color: #0b1220; color: #e5e7eb; }
        }

        /* HIG · Dynamic Type */
        @supports (font: -apple-system-body) {
          html { font: -apple-system-body; }
        }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s cubic-bezier(0.19, 1, 0.22, 1) forwards; }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .ios-scroll { -webkit-overflow-scrolling: touch; overscroll-behavior-y: contain; }
      `}} />
    </div>
  );
}
