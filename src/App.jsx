import React, { useState, useEffect, useRef } from 'react';
import {
  Home, Dumbbell, Apple, Activity, BookOpen, PlayCircle, Clock, Info,
  ShieldAlert, Zap, Flame, Plus, Trash2, LineChart, Timer, X,
  Pause, Play, CalendarPlus, CheckCircle, ArrowRight, Wind, ChevronRight, ActivitySquare,
  Camera, Image as ImageIcon, Bot, Send, Loader2, Heart, Moon, Award,
  Settings, Bike, Footprints, KeyRound, AlertTriangle, HeartPulse, Stethoscope
} from 'lucide-react';

// ========================================================================
// DATA MASTER — PLAN REDISEÑADO (full-body 3x + cardio, sincronizado con Mounjaro)
// Perfil: Pedro Falcón, MÉDICO de profesión · 44 años, 84→77 kg (bajando), 170 cm, perímetro 95 cm en descenso
// Clínica: SAHOS severa (IAH residual 0.1-1.6 con CPAP), DRA, ED ansiogénica.
// Tirzepatide (Mounjaro) 5 mg/sem (escaló desde 2.5), inyección Jue PM. Valle más profundo/ancho.
// Hallazgos jul-2026: piel descolgándose + ginecomastia SIMÉTRICA (palpación normal → benigna, auto-valorada por Pedro). Ver VALORACIONES_MEDICAS.
// Restricción lumbar RELATIVA: NO peso muerto; sentadilla/back squat con barra SOLO tras clearance CV + fisio DRA.
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

// BLOQUE A — LUNES: Full-Body Superior + Bisagra segura (post-tirada larga del domingo)
const BLOCK_A = [
  { name: "Press de Pecho en Multifuncional", sets: 4, reps: "8-10", tempo: "RIR 2", rest: "75", yt: "cable chest press machine form", notes: "SUPERSERIE A1 con Jalón al Pecho (estaciones distintas, no compiten por barra). Controlado, sin tempo fijo — foco técnica + RIR 2." },
  { name: "Jalón al Pecho en Polea Alta", sets: 4, reps: "8-10", tempo: "RIR 2", rest: "75", yt: "lat pulldown cable form", notes: "SUPERSERIE A2 con Press de Pecho. Retracción escapular previa al tirón." },
  { name: "Press Militar Sentado Mancuernas", sets: 3, reps: "8-10", tempo: "RIR 2", rest: "90", yt: "seated dumbbell shoulder press form", notes: "SUPERSERIE B1 con Remo en Polea. 2ª exposición semanal de empuje vertical (la 1ª es el jueves en máquina)." },
  { name: "Remo en Polea Baja (agarre neutro)", sets: 3, reps: "10", tempo: "RIR 2", rest: "90", yt: "seated cable row neutral grip", notes: "SUPERSERIE B2 con Press Militar. Codos pegados al torso." },
  { name: "Puente de Glúteo / Hip Thrust ligero (2 piernas)", sets: 3, reps: "10-12", tempo: "Sin apnea", rest: "60", yt: "glute bridge hip thrust two legs", notes: "Bisagra SEGURA: exhala en el empuje, sin hiperextensión ni Valsalva. NO peso muerto, NO extensión 45° cargada. MÍNIMA VIABLE si el tiempo aprieta (25-30 min): Press de Pecho + Jalón + Dead Bug." }
];

// BLOQUE B — MIÉRCOLES: Fuerza primaria de tren inferior (único día de sentadilla pesada)
const BLOCK_B = [
  { name: "Sentadilla (GATE médico — variante según clearance)", sets: 4, reps: "PRE 8-10 · POST 6", tempo: "RIR 2-3", rest: "150", yt: "goblet squat form OR back squat safety pins rack", notes: "GATE DURO. SIN clearance de fisio (DRA) ni cardiovascular → GOBLET o sentadilla a caja, ligera, exhalando, sin doming. CON clearance + pines de seguridad en el rack → back/front squat con brace breve modulado (NO Valsalva explosiva). PROHIBIDO el grinding: si falla la técnica, bajas carga la próxima serie, nunca fuerzas. Las aproximaciones cuentan dentro del calentamiento." },
  { name: "Press Banca con Mancuernas", sets: 3, reps: "8", tempo: "RIR 2", rest: "90", yt: "dumbbell bench press flat form", notes: "SUPERSERIE con la sentadilla (estaciones distintas, no compiten por la barra). MANCUERNAS a propósito: se pueden soltar al fallar. NUNCA press de banca con barra libre en solitario sin pines de seguridad ni ayudante." },
  { name: "Hip Thrust a 1 pierna (o bipodal con pausa)", sets: 3, reps: "8-10", tempo: "Pausa arriba", rest: "90", yt: "single leg hip thrust form", notes: "Cadena posterior segura. Compensa el techo de 85 kg con unilateral/densidad. NO peso muerto. Sin apnea. MÍNIMA VIABLE (25-30 min): Sentadilla + Press Banca + Bird Dog." }
];

// BLOQUE C — JUEVES: Full-Body de volumen efectivo en máquina (ANTES de la inyección de Mounjaro)
const BLOCK_C = [
  { name: "Prensa o Extensión de Cuádriceps (multifuncional)", sets: 3, reps: "10-12", tempo: "RIR 2", rest: "75", yt: "leg press machine form", notes: "RIR 2 REAL (no de relleno). Bajo estrés espinal, seguro en solitario, DRA-amable." },
  { name: "Curl Femoral en Máquina", sets: 3, reps: "10-12", tempo: "RIR 2", rest: "75", yt: "lying leg curl machine form", notes: "RIR 2. Segundo estímulo de isquios de la semana." },
  { name: "Press de Hombro en Máquina", sets: 3, reps: "10", tempo: "RIR 2", rest: "75", yt: "machine shoulder press form", notes: "2ª exposición EFECTIVA de empuje vertical (objetivo ≥10 series duras por patrón/semana)." },
  { name: "Jalón o Remo en Polea", sets: 3, reps: "10-12", tempo: "RIR 2", rest: "75", yt: "cable lat pulldown or seated row machine", notes: "Cierra tracción a 2x/semana efectivas." },
  { name: "Mariposa / Aperturas (Pec Deck)", sets: 2, reps: "12", tempo: "RIR 2", rest: "60", yt: "pec deck fly machine form", notes: "INYECCIÓN MOUNJARO: termina la sesión ≥3-4h ANTES de pincharte; evita una comida proteica grande justo antes (empeora la náusea). Todo en máquina/mancuerna, sin singles pesados ni fallo estructural." }
];

// CORE DRA-SAFE — al final de cada sesión de fuerza (anti-extensión / anti-rotación, sin Valsalva)
const CORE_DRA_LUNES = [
  { name: "Dead Bug", sets: 3, reps: "8/lado", rest: "45", yt: "dead bug exercise diastasis safe", notes: "DRA-safe: lumbar pegada al suelo, sin doming de la línea alba. Exhala al extender." },
  { name: "Pallof Press en Polea", sets: 3, reps: "10/lado", rest: "45", yt: "pallof press cable anti rotation", notes: "Anti-rotación. Respiración 360°. NADA de contracciones máximas de suelo pélvico hasta el alta del fisio." }
];

const CORE_DRA_MIERCOLES = [
  { name: "Bird Dog", sets: 3, reps: "8/lado", rest: "45", yt: "bird dog exercise core stability", notes: "DRA-safe. Pelvis estable, sin rotación de cadera." },
  { name: "Plancha SIN doming (inclinada o de rodillas)", sets: 3, reps: "20-30 seg", rest: "45", yt: "incline plank diastasis safe form", notes: "Progresa a plancha completa SOLO si la línea alba controla la presión (valoración del fisio). Detén ante abombamiento o dolor." }
];

const CORE_DRA_JUEVES = [
  { name: "Pallof Press en Polea", sets: 2, reps: "12/lado", rest: "45", yt: "pallof press cable anti rotation", notes: "Anti-rotación, DRA-safe." },
  { name: "Respiración Diafragmática 360°", sets: 1, reps: "8-10 resp.", rest: "45", yt: "360 diaphragmatic breathing core", notes: "Sin contracciones máximas de suelo pélvico hasta valoración del fisio." }
];

// ACCESORIOS DE FUERZA — Martes (tras la carrera Z2): prevención de isquios + salud de hombro
const ACCESORIOS_MARTES = [
  { name: "Curl Femoral en Máquina", sets: 3, reps: "12", rest: "60", yt: "lying leg curl machine form", notes: "Isquios en contracción." },
  { name: "Nordic Curl EXCÉNTRICO progresivo", sets: 3, reps: "3-5", rest: "90", yt: "nordic hamstring curl eccentric progression", notes: "Solo fase excéntrica, columna neutra. Entrena el isquio en LONGITUD (el hip thrust no lo hace) → previene lesión de isquio al correr. Progresa muy gradual." },
  { name: "Face Pull / Mariposa Invertida", sets: 2, reps: "15", rest: "45", yt: "face pull rear delt cable form", notes: "Salud de hombro. Rotación externa al final del recorrido." }
];

// SUELO PÉLVICO — GATE: hasta el alta del fisio de suelo pélvico, SOLO respiración/coordinación.
// En un suelo potencialmente hipertónico (plausible con ED ansiogénica) los Kegels máximos EMPEORAN el cuadro.
const SUELO_PELVICO = [
  { name: "Respiración Diafragmática 360°", reps: "3×8 resp.", desc: "Coordina respiración y suelo pélvico SIN contraer al máximo. Al exhalar, el suelo pélvico sube suave al 20-30%, no al 100%." },
  { name: "Relajación / Reverse Kegels", reps: "10 lentas", desc: "Empuja suavemente hacia afuera al exhalar. Si hay tensión o ansiedad, la RELAJACIÓN es la prioridad — más contracción empeora el cuadro." },
  { name: "GATE del fisio", reps: "—", desc: "NADA de Kegels máximos progresivos hasta que un fisio de suelo pélvico te valore y confirme si necesitas fortalecer (hipotonía) o relajar (hipertonía). El componente ansiogénico de la ED se deriva a medicina sexual/psicología." }
];

const SCHEDULE = [
  { day: "Lunes", type: "Fuerza Full-Body A — Superior + Bisagra segura", target: "Preservar masa magra (energía ALTA, ingesta MEDIA). Post-tirada larga: SIN sentadilla pesada.", time: "≤55 min · PM", exercises: BLOCK_A, hasWarmup: true, coreDRA: CORE_DRA_LUNES },
  { day: "Martes", type: "Carrera Z2 + Accesorios (isquios/hombro)", target: "Base aeróbica 21K + prevención de lesión de isquio", time: "≤60 min", isRunning: true, zone: "Z2 puro conversacional (Z3 SOLO tras clearance CV)", duration: "25-40 min según base real (si retomas: run/walk, ej. 5× [3' trote / 1' caminar])", notes: "Banda de FC de pecho para asegurar que Z2 sea Z2 real. GATE: la calidad/Z3 está BLOQUEADA hasta el clearance cardiovascular (44 años, perímetro 95 cm, SAHOS severa, ED como marcador endotelial) — el clearance va ANTES de iniciar ejercicio vigoroso, no solo antes de escalarlo. FUERA los 4 AM: corre en PM o mañana sin recortar las 7h de sueño con CPAP.", accessories: ACCESORIOS_MARTES },
  { day: "Miércoles", type: "Fuerza Full-Body B — Sentadilla primaria", target: "Único estímulo pesado de piernas (energía ALTA, ingesta ALTA, ≥72h de la tirada larga)", time: "≤55 min · PM", exercises: BLOCK_B, hasWarmup: true, coreDRA: CORE_DRA_MIERCOLES },
  { day: "Jueves", type: "Fuerza Full-Body C — Volumen en máquina (antes de la inyección)", target: "Volumen efectivo en el pico de ingesta, bajo estrés axial", time: "≤55 min · terminar ≥3-4h antes de Mounjaro", exercises: BLOCK_C, hasWarmup: true, coreDRA: CORE_DRA_JUEVES },
  { day: "Viernes", type: "Descanso Protegido (fondo del valle)", target: "Recuperar en el día de menor energía e ingesta por el fármaco", time: "0-20 min", isRest: true, notes: "Por DEFECTO: descanso total. Opcional si hay energía: 10-20 min de movilidad suave (cadera, torácica, tobillos) + respiración 360° + caminata. Cero fuerza, cero carrera. Hidratación + electrolitos + fibra OBLIGATORIOS (náusea y estreñimiento del fármaco). Levántate LENTO del suelo (hipotensión ortostática). El valle Vie-Sáb es la curva del fármaco funcionando: descansar no es fallar. A 5 mg el valle es más marcado y puede correrse hacia el fin de semana: si el viernes está peor que a 2.5 mg, no es alarma — sostén el descanso, no lo compenses con más movilidad." },
  { day: "Sábado", type: "Flexible: Bici Z2 corta o Descanso", target: "Volumen aeróbico OPCIONAL sin impacto — subordinado a ingesta/hidratación recuperadas", time: "0-45 min (energía MEDIA, ingesta MÍNIMA)", isBike: true, zone: "Z2 real, cadencia cómoda, sin intervalos", duration: "30-45 min SOLO si la ingesta/hidratación se recuperaron y no hay náusea; si no, DESCANSO TOTAL", notes: "NO es fondo largo (eso pasó al domingo). No entrenes aeróbico largo en baja disponibilidad energética (riesgo óseo por estrés, catabolismo, RED-S). Electrolitos + algo de carbohidrato ligero, nunca en ayuno prolongado. Para ante mareo/hipotensión/náusea. La bici NO da la adaptación ósea de correr (eso lo cubren martes/domingo). DELOAD DE ESCALADA: en las 1-2 semanas alrededor de cada cambio de dosis (2.5→5 mg y siguientes), trata el sábado como descanso FIRME (no opcional) y baja el volumen de fuerza 30-50% (menos series, misma técnica, RIR≥3) para no acumular fatiga sobre un valle más ancho." },
  { day: "Domingo", type: "Tirada Larga Z2 — sesión clave 21K", target: "La sesión aeróbica más larga, en la mejor ventana (energía MEDIA-ALTA, 2h, ingesta recuperando)", time: "hasta 2h", isRunning: true, zone: "Z2 estable (10' Z1 de entrada + cuerpo en Z2)", duration: "Según base real (empieza donde HOY toleras, no en 60' asumidos). DURACIÓN CONGELADA (sin progresión) hasta el clearance CV — el bloque hacia el 21K está en PAUSA durante la escalada a 5 mg", notes: "A 5 mg el valle es más profundo/ancho y puede correrse a domingo-lunes: si hoy caes en el nadir real (energía/ingesta bajas), ACORTA o cambia por caminata/bici Z2 — no fuerces kilómetros en déficit + valle. CONDICIONADO a que la ingesta/hidratación se recuperen. FUELLING: carbohidrato 2-3h antes (vaciamiento gástrico retrasado → evita reflujo); electrolitos; gel si supera 75 min. La fecha del 21K se condiciona a la distancia lograda, no al calendario." }
];

// VALORACIONES MÉDICAS A AGENDAR — del panel clínico (jul-2026, 5 mg + gineco + piel).
// Triaje ESCALONADO: primero exploración presencial (Etapa 0); labs/imagen SOLO si confirma glandular o hay bandera.
// urgencia: 'Urgente' (días/ya) · 'Prioritaria' (semanas) · 'Condicional' (según hallazgo) · 'Diferida' (a peso estable)
const VALORACIONES_MEDICAS = [
  { titulo: "Ginecomastia — auto-valorada por Pedro (médico): SIMÉTRICA, palpación normal, sin nódulo sospechoso", especialista: "A criterio de Pedro (Endocrinología si desea caracterización etiológica)", urgencia: "Rutina", pruebas: "Patrón benigno (simétrico + palpación normal) → malignidad muy improbable (esa es unilateral, dura, excéntrica): NO indica imagen ni descarte urgente. Abordaje = caracterización etiológica OPCIONAL en el contexto de pérdida rápida + 5 mg: glandular vs pseudo y balance estradiol/testosterona (ver panel hormonal). Revisar fármacos gineco-inductores.", motivo: "El examen benigno reencuadra: no es descarte de cáncer, es etiología opcional. La testosterona se interpreta mejor con peso estable; no auto-medicar T (empeora la ginecomastia)." },
  { titulo: "Contacto con el prescriptor por el RITMO de pérdida (84→77 ≈ 8,3%)", especialista: "Endocrinología / bariatría (prescriptor de Mounjaro)", urgencia: "Urgente", pruebas: "Calcular %/semana con el registro de peso de la app. Documentar estatus glucémico y fármacos hipoglucemiantes.", motivo: "Si supera ~1%/semana sostenido, decisión compartida HOY sobre moderar dosis/ritmo o subir proteína (protege masa magra y hueso, y así la piel). Es decisión del prescriptor, no del entrenamiento." },
  { titulo: "Clearance CARDIOVASCULAR pre-esfuerzo (gate duro)", especialista: "Cardiología / Medicina del Deporte", urgencia: "Prioritaria", pruebas: "PA con toma ortostática, ECG de reposo, perfil lipídico, glucosa/HbA1c; prueba de esfuerzo a criterio del cardiólogo.", motivo: "SAHOS severa + la ED como posible marcador vascular (no la des por psicógena) lo exigen. Bloquea Z3, back squat con barra y la progresión de volumen hacia el 21K hasta el visto bueno." },
  { titulo: "Fisioterapia de DRA + suelo pélvico (gate duro)", especialista: "Fisioterapia de abdomen/suelo pélvico", urgencia: "Prioritaria", pruebas: "Distancia inter-rectos, función del transverso, manejo de presión intraabdominal, evaluación de suelo pélvico.", motivo: "Guiar el core sin subir la presión, avanzar al cierre de la DRA y habilitar la carga axial. También relevante para la ED." },
  { titulo: "Valoración NUTRICIONAL formal (piso proteico + estrategia de valle)", especialista: "Nutrición deportiva / dietista", urgencia: "Prioritaria", pruebas: "Diario de ingesta + síntomas GI + energía + FC reposo 7-14 días; cálculo proteico (~123-170 g/día) y distribución con líquidos en el valle.", motivo: "Con el valle más profundo a 5 mg, proteína 1.6-2.2 g/kg TODOS los días y déficit no agresivo es la palanca principal para preservar masa magra y limitar el empeoramiento de la piel." },
  { titulo: "Panel HORMONAL dirigido (condicional a la Etapa 0)", especialista: "Endocrinología / prescriptor", urgencia: "Condicional", pruebas: "En ayuno AM: beta-hCG, estradiol, LH, FSH, prolactina, TSH/T4L, hepático y renal. Testosterona + SHBG con CAUTELA (NO etiquetar hipogonadismo en plena pérdida; reevaluar con peso estable).", motivo: "SOLO si la exploración confirma tejido glandular o hay bandera. Descarta hiperprolactinemia, tiroides, hígado/riñón y tumores productores de hCG/estrógenos. Secuencial, no en escopetazo." },
  { titulo: "Labs nutricionales DIRIGIDOS (aprovechar la misma extracción)", especialista: "Nutrición clínica / Medicina Interna", urgencia: "Condicional", pruebas: "25-OH vit D, B12, ferritina/hierro, HbA1c/glucosa, perfil lipídico, hemograma. Lipasa SOLO si dolor abdominal.", motivo: "Línea base razonable durante el déficit con menor volumen de comida, sin panel amplio 'por si acaso'." },
  { titulo: "Ecografía mamaria — NO indicada con el examen actual", especialista: "Radiología (solo si cambia el patrón)", urgencia: "Condicional", pruebas: "Con tu examen actual (simétrico, palpación normal) NO está indicada. Reservada SOLO si el patrón cambia: se vuelve asimétrico, aparece un nódulo duro/fijo/excéntrico, o hay cambios de pezón/piel.", motivo: "En ginecomastia simétrica benigna la imagen no aporta; se reserva para caracterizar hallazgos indeterminados o descartar malignidad si surgen banderas." },
  { titulo: "Ecografía testicular — solo si labs/examen lo indican", especialista: "Radiología / Urología si hay masa", urgencia: "Condicional", pruebas: "Eco escrotal bilateral SOLO si estradiol y/o beta-hCG elevados o masa/asimetría testicular.", motivo: "Descartar tumor testicular productor de hormonas. No se pide 'de rutina'." },
  { titulo: "DEXA de composición corporal (sin bioimpedancia)", especialista: "Medicina del Deporte / Endocrinología", urgencia: "Diferida", pruebas: "DEXA de cuerpo entero (masa magra/grasa). DMO ósea SOLO con factores de riesgo, no de rutina.", motivo: "Forma objetiva de vigilar masa magra al no tener báscula de bioimpedancia; refuerza el seguimiento con fuerza + perímetros/fotos." },
  { titulo: "Piel laxa + componente glandular residual", especialista: "Dermatología y/o Cirugía plástica", urgencia: "Diferida", pruebas: "Valoración clínica cuando el peso lleve varios meses ESTABLE.", motivo: "Honestidad: la piel sobrante y el tejido glandular establecido no se revierten con dieta ni ejercicio — su solución es quirúrgica. Tamoxifeno es off-label y solo fase temprana/dolorosa." }
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
            { l: 'Sets', v: ex.sets }, { l: 'Reps', v: ex.reps }, { l: 'RIR', v: ex.tempo }, { l: 'Desc.', v: ex.rest + 's' }
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

          {dayData.accessories && (
            <div className="space-y-4">
              <SectionHeader icon={Dumbbell} color="text-orange-500">Accesorios de Fuerza (12-15 min)</SectionHeader>
              {dayData.accessories.map((ex, i) => (
                <div key={i} className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight flex-1 pr-3">{i + 1}. {ex.name}</h4>
                    <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.yt)}`} target="_blank" rel="noopener noreferrer" className="bg-orange-50 text-orange-500 p-2.5 rounded-2xl active:scale-90 transition-transform shrink-0"><PlayCircle size={18} /></a>
                  </div>
                  <div className="flex gap-2 mb-2 text-[11px] font-black text-slate-700">
                    <span className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">{ex.sets} × {ex.reps}</span>
                    <span className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">Desc {ex.rest}s</span>
                  </div>
                  {ex.notes && <p className="text-[11px] font-bold text-slate-500 leading-snug">{ex.notes}</p>}
                </div>
              ))}
            </div>
          )}
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

const COACH_SYSTEM_PROMPT = `Eres el coach de Falcon44+ para Pedro (44 años, MÉDICO de profesión — háblale como a un colega clínico: preciso y directo, con terminología médica cuando aplique, sin lenguaje alarmista de lego; aun así NO diagnostiques ni prescribas por él, él decide su propio manejo médico), acompañándolo en un plan de entrenamiento rediseñado que corre en paralelo a su tratamiento con tirzepatida (Mounjaro, inyección semanal el JUEVES por la tarde/noche) y a dos objetivos: preservar masa magra y completar un 21K. Tu rol es guiar día a día, adaptar la sesión escrita a cómo llega Pedro esa mañana, y recordar límites de seguridad — nunca sustituyes al médico prescriptor, al fisioterapeuta de diástasis (DRA)/suelo pélvico ni el clearance cardiovascular.

FILOSOFÍA DEL PLAN — acompañar la curva, no combatirla:
La semana tiene una curva de energía e ingesta predecible por la farmacocinética del fármaco (pico de acción y efectos GI 8-72h post-inyección). Lunes a jueves son los días de energía e ingesta ALTA: ahí vive TODA la fuerza dura y la carrera de calidad. Viernes y sábado son el fondo del valle (energía e ingesta BAJAS): se acompañan con descanso protegido y movilidad suave, NUNCA se les mete un fondo largo o fuerza pesada. El domingo, con la ingesta ya recuperándose y 2h disponibles, aloja la tirada larga hacia el 21K. Esta curva es una hipótesis inicial: en las primeras 1-2 semanas hay que verificarla con un diario de síntomas (el valle real puede no caer en Vie-Sáb, sobre todo a dosis de 2.5 mg) y remapearla en cada escalada de dosis.

ESTRUCTURA SEMANAL (referencia rápida, ver SCHEDULE para el detalle exacto):
- Lunes: full-body énfasis tren superior + bisagra segura en máquina/mancuerna. SIN sentadilla pesada (viene de la tirada larga del domingo).
- Martes: carrera Z2 + accesorios de isquios excéntricos (Nordic) y tracción/hombro.
- Miércoles: ÚNICO día de sentadilla pesada de la semana (mejor ingesta y recuperación, ≥72h de la tirada larga).
- Jueves: full-body de volumen efectivo en máquina, SIEMPRE terminado ≥3-4h antes de la inyección de Mounjaro.
- Viernes: descanso protegido (fondo del valle).
- Sábado: flexible — bici Z2 corta SOLO si la ingesta/hidratación ya se recuperaron; si no, descanso.
- Domingo: tirada larga Z2, la sesión aeróbica clave de la semana.

GATES MÉDICOS DUROS — no negociables, van ANTES de progresar, no después:
1. Clearance CARDIOVASCULAR (evaluación clínica ± ECG/ergometría) ANTES de cualquier fuerza casi-máxima y de cualquier carrera de calidad/Z3 — no solo antes de "escalar". El perfil de riesgo de Pedro (44 años, perímetro abdominal 95 cm, SAHOS severa, disfunción eréctil como marcador endotelial) lo exige.
2. Valoración de FISIO de diástasis (DRA) y suelo pélvico, con medición basal inter-rectos y ausencia confirmada de doming bajo carga, ANTES de cualquier carga axial progresiva con barra (sentadilla pesada, brace).
3. Analítica hormonal/metabólica basal con el prescriptor (testosterona total/libre, descartar hipogonadismo) antes de prometer o esperar cambios de testosterona.
Mientras estos gates no estén cumplidos: sentadilla ligera (goblet/caja) a RIR≥3 con exhalación, nunca brace pesado ni Valsalva; carrera solo en Z2 puro, sin bloques de calidad.

BANDERAS ROJAS — detener la sesión y escalar:
- Cardiovasculares (atención urgente): dolor u opresión torácica, síncope o presíncope, disnea desproporcionada al esfuerzo, palpitaciones sostenidas al correr.
- Del fármaco (contactar al prescriptor): dolor epigástrico intenso irradiado a la espalda (posible pancreatitis), vómito persistente o deshidratación, náusea incapacitante, reflujo/regurgitación durante el brace o al correr (riesgo de aspiración por vaciamiento gástrico retrasado).
- De la pared abdominal (parar el ejercicio): abombamiento (doming) o dolor de la línea alba, protrusión o sospecha de hernia en sentadilla o brace.
- Lumbares/óseas: dolor lumbar que reaparece o irradia, o dolor óseo focal que empeora con el impacto (riesgo de lesión por estrés, aumentado bajo el déficit del GLP-1).
- Deshidratación/hipotensión: mareo postural o presíncope al levantarse del suelo — criterio de parada inmediata.
Si Pedro reporta cualquiera de estos síntomas, indícaselo con claridad y detén la progresión de esa sesión; no minimices.

REGLAS DE SESIÓN QUE NUNCA SE SALTAN:
- Sentadilla siempre con pines de seguridad ajustados a la profundidad (si hay rack) o en variante segura (goblet, hack en multifuncional, split squat); PROHIBIDO el grinding (forzar una rep de estancamiento) — si la técnica se compromete, se baja la carga la próxima serie, nunca se fuerza.
- Core siempre DRA-safe: dead bug, bird dog, Pallof press, plancha sin doming. Nada de crunch/sit-up ni Valsalva agresiva.
- Suelo pélvico: SOLO respiración diafragmática 360° y coordinación hasta que el fisio de suelo pélvico dé el alta. NUNCA prescribas un protocolo de Kegels a ciegas — en un suelo potencialmente hipertónico (plausible dado que la disfunción eréctil de Pedro es de perfil ansiogénico), más Kegels empeoran el cuadro.
- La disfunción eréctil ansiogénica de Pedro NO se trata con ejercicio aeróbico (esa evidencia es para ED vasculogénica). El aeróbico se hace por salud endotelial/cardiovascular general; el componente ansiogénico se deriva a medicina sexual o psicología.

AUTORREGULACIÓN — una lectura simple cada mañana, dos triajes:
1) Por ENERGÍA: combina en una sola impresión (sin fórmulas numéricas) la calidad del sueño (¿llegaste a las 7h con CPAP?), tu energía/RPE al despertar, dolor muscular, síntomas GI/náusea y motivación. El Body Battery/HRV del Garmin es UN insumo blando más, nunca una compuerta numérica dura (no está validado para esto). Con eso, clasifica el día:
   - VERDE → ejecuta la sesión tal como está escrita (carga alta o calidad solo de lunes a jueves, y solo si los gates médicos están cumplidos).
   - AMARILLO → versión reducida: quita el último accesorio, baja 1 serie en los básicos manteniendo RIR 2-3, y si es carrera, recorta el Z2 puro 10-15 minutos.
   - ROJO (náusea marcada, sueño <6h, dolor, fatiga alta) → solo movilidad + respiración + caminata, o descanso total.
2) Por TIEMPO: si el día aprieta, no se salta la sesión — se ejecuta la SESIÓN MÍNIMA VIABLE (2 ejercicios básicos + 1 ejercicio de core DRA-safe, 25-30 min) para que un día corto cuente como entrenado.
Viernes y sábado se ESPERA una lectura baja — no es un fallo, es la curva del fármaco funcionando como se predijo. Nunca le digas a Pedro que "recupere" el domingo cargando de más lo que se perdió en el valle.

PISO ANTI-CATABÓLICO para semanas malas (más náusea, o semana de escalada de dosis): si todo lo demás se cae, garantiza al menos 2 microsesiones full-body de ~20 minutos en máquina (RIR 3-4, sin buscar DOMS) para no perder masa magra justo cuando el catabolismo del fármaco es más agresivo.

ESCALADA DE DOSIS — VALLE MÁS PROFUNDO Y ANCHO, DELOAD Y RITMO DE PÉRDIDA (Pedro YA está en 5 mg/semana):
Cada escalada de dosis (2.5 → 5 mg y las siguientes) profundiza y ensancha el valle: la ventana de baja energía/ingesta puede volverse más intensa y derramarse a domingo-lunes, no solo viernes-sábado. Alrededor de la primera dosis a la nueva concentración, indica un DELOAD deliberado de 1-2 semanas: baja el VOLUMEN 30-50% (menos series por grupo) manteniendo la técnica y una intensidad relativa moderada (RIR≥3) — en el valle se MANTIENE el estímulo, no se buscan récords. Pide a Pedro un diario de 7-14 días tras la inyección (energía, náusea/síntomas GI, apetito/ingesta, sueño, FC en reposo/HRV) para RE-MAPEAR la semana real, no la del calendario previo: si la tirada larga del domingo o el Full-Body A del lunes caen en el nadir real, se mueven, se acortan o se convierten en Z1-Z2 suave/caminata — nunca se fuerzan kilómetros ni series en pleno déficit + valle. Reubica siempre la sesión más exigente en el día de mejor energía y pasa los días valle a máquina, movilidad y Z1-Z2 suave o descanso; autorregula por sensación y FC/HRV, nunca por el calendario. Congela también el VOLUMEN/duración de carrera (no solo la intensidad) hasta el clearance cardiovascular, y PAUSA explícitamente la progresión hacia el 21K durante la escalada y la pérdida rápida (riesgo de baja disponibilidad energética); ese bloque de volumen se retoma solo tras revisar la disponibilidad energética con nutrición/medicina del deporte. Vigila el RITMO de pérdida: Pedro va de 84 a 77 kg (~8%); si el %/semana retrospectivo (calculado con los pesos que registra en la app) supera ~1%/semana sostenido, dile que lo hable HOY con su prescriptor para moderar dosis/ritmo o subir proteína — no esperes 14 días de diario para lanzar esa alerta. Si Pedro es diabético o toma otros fármacos hipoglucemiantes, refuerza las reglas antihipoglucemia (nada de ayuno prolongado, medir peri-entreno). Si la energía cae mucho en el valle, lo primero que se recorta es el CARDIO — nunca la proteína ni el estímulo de fuerza.

GINECOMASTIA — CUADRO SIMÉTRICO BENIGNO, YA AUTO-VALORADO POR PEDRO (MÉDICO):
Pedro ya se examinó: las masas son SIMÉTRICAS, de palpación normal, sin nódulo sospechoso — patrón benigno de ginecomastia, con malignidad muy improbable (que es unilateral, dura, excéntrica). NO empujes un descarte urgente de cáncer ni "que lo vea un médico en días": él ES el médico y ya lo valoró. El abordaje pasa a ser caracterización etiológica OPCIONAL (glandular vs pseudo; balance estradiol/testosterona en el contexto de pérdida rápida + 5 mg), a su criterio. Lo que SÍ sostienes con honestidad es el límite del entrenamiento: la reducción localizada de grasa no existe. Sé honesto sobre las dos posibilidades, que solo un médico distingue por palpación/imagen: la pseudoginecomastia (grasa subcutánea difusa) solo responde a un déficit calórico GLOBAL, sin ejercicio localizado que la disuelva; la ginecomastia verdadera (tejido glandular firme, subareolar) NO se elimina ni entrenando pecho ni bajando más grasa — su manejo es médico (posible tamoxifeno, off-label y limitado a la fase temprana/dolorosa) o quirúrgico si el tejido ya está establecido. Ten en cuenta el efecto contrario: entrenar el pectoral hipertrofia el músculo debajo de la glándula y puede hacer la zona verse MÁS marcada, no menos — sirve para fuerza y postura, no como estrategia estética de esa zona. Adelgazar también puede "desenmascarar" un componente glandular que la grasa tapaba: es solo una hipótesis a confirmar por el médico, no una explicación tranquilizadora que tú debas dar por cerrada. BANDERAS ROJAS que exigen adelantar la consulta sin esperar: nódulo duro, fijo, de bordes irregulares o EXCÉNTRICO (fuera del centro subareolar), o marcadamente unilateral; retracción o secreción del pezón; enrojecimiento fijo o piel en cáscara de naranja; ganglio palpable en la axila; crecimiento rápido, muy asimétrico y doloroso. Nunca minimices estos signos ni ofrezcas tú un diagnóstico.

PIEL LAXA — EL MÚSCULO AYUDA, NO RETRAE LA PIEL:
Sé honesto: el ejercicio NO retrae la piel sobrante. Construir músculo puede rellenar algo el contorno y mejorar la firmeza percibida, pero no revierte un excedente real de piel — eso depende de la edad, la genética y, sobre todo, de la magnitud y VELOCIDAD de la pérdida. Por eso perder más rápido NO mejora la piel, la EMPEORA: si Pedro pregunta si conviene acelerar el déficit para "ganarle" a la piel, dile que es al revés — moderar el ritmo (regla del ~1%/semana) y preservar masa magra con proteína + fuerza es lo que más ayuda. Nunca prometas que el entrenamiento "arregla" la piel laxa ni recomiendes colágeno + vitamina C como solución (sin evidencia para piel sobrante tras pérdida grande). Si la laxitud persiste con el peso ya estable, la única vía es dermatología o cirugía plástica; solo indícaselo.

VALORACIONES MÉDICAS A AGENDAR — MENCIÓNALAS, NUNCA LAS REEMPLACES:
Pedro tiene un paquete de valoraciones pendientes (ver la pestaña "Salud" de la app): en DÍAS — exploración mamaria y testicular presencial + contacto con el prescriptor por el ritmo de pérdida; en SEMANAS — clearance cardiovascular (reforzado porque la ED puede ser marcador vascular, no asumas que es solo psicógena), fisioterapia de DRA/suelo pélvico, valoración nutricional y labs dirigidos; CONDICIONAL — imagen mamaria/testicular/suprarrenal, y revalorar la piel y el eje hormonal (testosterona) con el peso ya estable. Recuérdale AGENDAR o dar seguimiento a estas citas — nunca sugieras que el entrenamiento las sustituye, ni interpretes labs/imagen, ni sugieras ajustar dosis de fármacos (tirzepatide, tamoxifeno, testosterona): eso es de sus médicos.

REGLA TRANSVERSAL — NUNCA DIAGNOSTIQUES:
Ante ginecomastia, piel laxa, disfunción eréctil o cualquier síntoma nuevo, tu trabajo es reconocer la señal, dar el contexto honesto de lo que el ejercicio SÍ y NO puede hacer, y derivar a la valoración médica correspondiente — jamás emitas un diagnóstico, un pronóstico definitivo ni una recomendación de tratamiento médico o quirúrgico.

NUTRICIÓN — la proteína es el seguro anti-catabólico, y NO se banca:
Objetivo 1.6-2.2 g/kg/día (unos 128-176 g), en 4 tomas de 30-40 g. La síntesis de proteína muscular es AGUDA: comer 200 g el jueves no compensa un déficit el viernes, así que CADA día debe alcanzar su propio mínimo. Lunes-jueves (ingesta media a pico): apunta al objetivo pleno 1.8-2.2 g/kg, con carbohidrato peri-entreno el miércoles (sentadilla) y el martes (carrera). Viernes-sábado (valle, saciedad baja por el GLP-1): estrategia "proteína primero" en formatos líquidos o blandos (whey isolate, skyr, yogur griego, requesón, batidos, caldos/sopas fortificadas) en tomas pequeñas y frecuentes, apuntando lo más alto tolerable hacia 1.6-2.0 g/kg; sé honesto si la náusea no lo permite — el objetivo es MINIMIZAR el déficit, no fingir que desaparece. Hidratación + electrolitos proactivos TODOS los días del valle (no solo el sábado), más fibra y líquido para el estreñimiento del fármaco. Domingo: carbohidrato 2-3h antes de la tirada larga (el vaciamiento gástrico está retrasado por el fármaco, así que ese margen evita reflujo corriendo) y fuelling intra-sesión si pasa de 75 minutos. Regla transversal: separa las comidas sólidas ≥2-3h de las sesiones con brace y de correr, y recomienda una cena ligera y temprana antes del CPAP (el reflujo nocturno fragmenta el sueño y empeora la apnea). El timing/reparto de comidas es secundario al total diario — no generes ansiedad por el "momento perfecto". La hipoglucemia es un riesgo BAJO en monoterapia con tirzepatida (efecto insulinotrópico glucosa-dependiente), pero igual recomienda llevar carbohidrato de acción rápida en toda sesión aeróbica.

EL JUEVES Y LA INYECCIÓN DE MOUNJARO:
El entrenamiento del jueves va SIEMPRE antes de la inyección, terminando la sesión con ≥3-4 horas de margen. No recomiendes una comida proteica grande justo antes de pinchar (empeora la náusea) — separa esa carga proteica del momento de la inyección. Si Pedro tiene flexibilidad, sugiérele desacoplar con su prescriptor el día/hora exacta de la inyección para que no dependa siempre de la ventana de esa aguja.

SUEÑO Y CPAP:
El sueño es una palanca que se protege, no se negocia: si una sesión (sobre todo de fuerza en la tarde/noche) amenaza las 7 horas de sueño con CPAP, gana el sueño — termina la fuerza al menos 3 horas antes de acostarse, y evita cualquier sesión a las 4 AM. A medida que Pedro pierda peso, recuérdale retitular el CPAP con su especialista del sueño (la anatomía de la vía aérea superior cambia).

JERARQUÍA REALISTA DE OBJETIVOS bajo déficit calórico — sé honesto con Pedro sobre esto:
1) pérdida de grasa, 2) preservación (no ganancia) de masa magra, 3) "terminar" el 21K. El rendimiento de resistencia y la subida de testosterona son resultados SECUNDARIOS, no garantizados: no se pueden maximizar los cuatro frentes a la vez en déficit. La testosterona puede subir de forma modesta, pero sobre todo por la pérdida de grasa que produce el fármaco (vía SHBG), no por el entrenamiento en sí; el sueño protegido previene una CAÍDA de testosterona, no la sube por encima de su basal.

CARRERA HACIA EL 21K:
El bloque dura ≥10-12 semanas, no menos. Antes de fijar ritmos o duraciones, hay que medir la base REAL de Pedro (cuánto corre hoy sin molestia) — si está retomando, usar run/walk progresivo por tiempo en pie y frecuencia, nunca asumir 60 minutos continuos. La progresión ~10%/semana es un heurístico de orientación, no evidencia dura — prioriza siempre la ausencia de dolor óseo focal sobre la regla. La tercera carrera semanal y los bloques de calidad (Z3) se introducen SOLO tras el clearance cardiovascular. La tirada larga debe llegar a 100-120 minutos / 16-18 km ANTES de intentar el 21K — la fecha del intento se condiciona a la distancia lograda, no al calendario. La bici del sábado es un complemento de bajo impacto, nunca un sustituto de la especificidad de correr.

CÓMO DEBES HABLARLE A PEDRO:
Responde siempre en español, con tono cercano pero riguroso — nada de sobreventa ni promesas que la evidencia no sostiene. Sitúa cada respuesta en el día de la semana y el estado de energía/ingesta correspondiente. Pregúntale por su lectura de readiness cuando sea relevante para decidir verde/amarillo/rojo. Nunca lo empujes a cargar axialmente pesado (sentadilla con barra, brace fuerte) sin haber confirmado antes que sus gates médicos están cumplidos. Si reporta síntomas de una bandera roja, dilo con claridad y prioriza la seguridad sobre el plan. Y recuérdale, cuando haga falta, que nada de esto sustituye la supervisión presencial de su médico prescriptor de tirzepatida, de su fisioterapeuta de DRA/suelo pélvico, ni el clearance cardiovascular.`;

const GEMINI_MODEL = "gemini-2.5-flash-lite";
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
                  <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-red-500 mb-1.5">Plan sincronizado con Mounjaro</p>
                  <p className="text-[13px] sm:text-[15px] font-black leading-snug text-slate-100 uppercase tracking-tight italic">Carga en energía alta (Lun-Jue), recupera en el valle (Vie-Sáb).<br /><span className="text-slate-400 font-bold lowercase text-[11px] sm:text-[12px] opacity-90 tracking-normal">Fondo largo el domingo. Sentadilla pesada solo tras clearance CV + fisio de DRA. El jueves, termina 3-4h antes de inyectarte.</span></p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border-2 border-red-200 rounded-[28px] p-5 shadow-sm">
              <SectionHeader icon={ShieldAlert} color="text-red-500">Gates médicos antes de cargar pesado</SectionHeader>
              <div className="space-y-2 text-[11px] font-bold text-red-900">
                <p>1. <span className="font-black">Clearance cardiovascular</span> antes de fuerza casi-máxima y de calidad Z3 (44 años, perímetro 95, SAHOS, ED).</p>
                <p>2. <span className="font-black">Fisio de DRA + suelo pélvico</span> con medición inter-rectos antes de sentadilla pesada con barra.</p>
                <p>3. <span className="font-black">Labs basales</span> (testosterona total/libre) con tu médico antes de esperar cambios hormonales.</p>
                <p className="text-red-700 italic pt-1">Hasta cumplirlos: sentadilla ligera (goblet/caja) RIR≥3 con exhalación, y carrera solo Z2 puro.</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-[28px] p-5 shadow-sm">
              <SectionHeader icon={Activity} color="text-emerald-500">Mapa de la semana · energía vs fármaco</SectionHeader>
              <div className="space-y-1.5 text-[11px] font-bold text-slate-600">
                <p><span className="text-emerald-600 font-black">Lun-Jue (energía alta)</span> → 3 fuerza full-body + 1 carrera Z2. El jueves, antes de inyectar.</p>
                <p><span className="text-red-500 font-black">Vie-Sáb (valle Mounjaro)</span> → descanso protegido / bici Z2 opcional. Nada duro.</p>
                <p><span className="text-sky-600 font-black">Dom (recuperando)</span> → tirada larga Z2 hacia el 21K.</p>
                <p><span className="text-amber-600 font-black">Escalada a 5 mg</span> → deload 1-2 sem (−30-50% series), valle más profundo; re-mapea con diario. 21K en pausa hasta el clearance.</p>
                <p className="text-slate-400 italic pt-1">Tus valoraciones médicas a agendar están en la pestaña <span className="font-black text-slate-500">Salud</span>.</p>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-100 rounded-[28px] p-5 shadow-sm">
              <SectionHeader icon={Heart} color="text-purple-500">Recordatorio Diario</SectionHeader>
              <div className="space-y-2 text-[11px] font-bold text-purple-900">
                <p>• <span className="font-black">Proteína</span>: 1.6-2.2 g/kg CADA día (no se "banca"); líquida Vie-Sáb</p>
                <p>• <span className="font-black">Hidratación + electrolitos</span> todo el valle (Vie-Sáb)</p>
                <p>• <span className="font-black">Dormir 7h con CPAP</span> — gana sobre cualquier sesión</p>
                <p>• <span className="font-black">Core DRA-safe</span>: nada de crunch ni Valsalva agresiva</p>
                <p>• <span className="font-black">Autorregula</span>: verde/amarillo/rojo; si aprieta el tiempo, sesión mínima viable</p>
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
              <h2 className="text-7xl sm:text-8xl font-black text-emerald-400 tracking-tighter leading-none italic drop-shadow-md">160<span className="text-2xl sm:text-3xl ml-1 uppercase tracking-normal text-white">g</span></h2>
              <p className="text-[10px] sm:text-[12px] font-black uppercase tracking-[0.4em] text-slate-500 mt-6 opacity-80 leading-none">Proteína · 1.6–2.2 g/kg · cada día su mínimo</p>
              <p className="text-[10px] sm:text-[11px] font-bold text-emerald-300/80 mt-3 italic">Seguro anti-catabólico #1 bajo Tirzepatide — NO se "banca" entre días</p>
            </div>

            <SectionHeader icon={Apple}>Distribución Proteica</SectionHeader>
            <div className="bg-white p-6 sm:p-8 rounded-[35px] sm:rounded-[45px] border border-slate-100 shadow-sm flex items-center transition-all active:bg-slate-50">
              <div className="bg-orange-50 p-4 sm:p-5 rounded-[25px] mr-5 sm:mr-7 shrink-0 shadow-inner border border-orange-100"><Apple className="text-orange-500" size={32} /></div>
              <div><h3 className="font-black text-slate-900 uppercase text-sm sm:text-base tracking-tight leading-none">Lun-Jue · Sólidos (objetivo pleno)</h3><p className="text-[11px] sm:text-[13px] text-slate-500 font-bold leading-tight mt-1.5 italic">Días de alta tolerancia: apunta a 1.8-2.2 g/kg. 3 huevos + 200 g proteína magra por comida, en 4 tomas de 30-40 g. Carbohidrato peri-entreno el miércoles (sentadilla) y martes (carrera).</p></div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-[35px] sm:rounded-[45px] border border-slate-100 shadow-sm flex items-center transition-all active:bg-slate-50">
              <div className="bg-blue-50 p-4 sm:p-5 rounded-[25px] mr-5 sm:mr-7 shrink-0 shadow-inner border border-blue-100"><Activity className="text-blue-500" size={32} /></div>
              <div>
                <h3 className="font-black text-slate-900 uppercase text-sm sm:text-base tracking-tight leading-none">Whey Isolate · base del valle</h3>
                <p className="text-[11px] sm:text-[13px] text-slate-500 font-bold leading-tight mt-1.5 italic">1 scoop post-entreno + 1 scoop a media tarde. Cero lactosa. Es el formato líquido clave para llegar a la proteína en los días de baja tolerancia (Vie-Sáb).</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-[35px] p-6 shadow-sm">
              <SectionHeader icon={AlertTriangle} color="text-amber-600">Estrategia del Valle (Vie-Sáb)</SectionHeader>
              <p className="text-[12px] font-bold text-amber-900 leading-snug">Con la saciedad del Mounjaro, "proteína primero" en formatos líquidos/blandos: whey isolate, skyr, yogur griego, requesón, batidos, caldos y sopas fortificadas. Tomas pequeñas y frecuentes hacia 1.6-2.0 g/kg. La náusea puede impedir llegar — el objetivo es MINIMIZAR el déficit, no fingir que desaparece. Hidratación + electrolitos proactivos todos los días del valle.</p>
            </div>

            <div className="bg-slate-900 text-white rounded-[35px] p-6 shadow-sm border border-slate-800">
              <SectionHeader icon={Zap} color="text-emerald-400">Jueves · timing de la inyección</SectionHeader>
              <p className="text-[12px] font-bold text-slate-200 leading-snug">Entrena ANTES de inyectar Mounjaro, terminando ≥3-4h antes. NO comas una comida proteica grande justo antes de pincharte (empeora la náusea). Domingo: carbohidrato 2-3h antes de la tirada larga. Cena ligera y temprana antes del CPAP para no fragmentar el sueño.</p>
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

        {/* TAB: SALUD — Valoraciones médicas a agendar */}
        {tab === 'salud' && (
          <div className="space-y-6 animate-fade-in pb-12 text-slate-900">
            <div className="bg-slate-900 text-white rounded-[40px] p-8 shadow-xl border-b-8 border-red-500 relative overflow-hidden border border-slate-800">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <SectionHeader color="text-red-400" icon={Stethoscope}>Valoraciones a agendar</SectionHeader>
              <p className="text-[12px] font-bold text-slate-200 leading-snug">La ginecomastia ya la valoraste tú (médico): <span className="text-white font-black">simétrica, palpación normal</span> → cuadro benigno, sin descarte urgente de cáncer. Lo que queda para AGENDAR es el <span className="text-white font-black">clearance CV</span>, fisio de DRA, nutrición y el ritmo de pérdida con tu prescriptor. La caracterización etiológica de la ginecomastia es opcional, a tu criterio.</p>
            </div>

            <div className="bg-red-50 border-2 border-red-200 rounded-[28px] p-5 shadow-sm">
              <SectionHeader icon={AlertTriangle} color="text-red-500">Vigila un cambio de patrón</SectionHeader>
              <div className="space-y-2 text-[11px] font-bold text-red-900">
                <p>• Mama: el cuadro actual es simétrico y benigno; reevalúa si <span className="font-black">cambia a asimétrico</span>, aparece un nódulo duro/fijo/excéntrico, o hay retracción/secreción del pezón, piel en cáscara de naranja o ganglio axilar.</p>
                <p>• Testículo: masa, dureza, asimetría o pesadez nueva.</p>
                <p>• Esfuerzo: dolor u opresión en el pecho, falta de aire desproporcionada, palpitaciones, mareo o síncope → para y valora (aún sin clearance CV).</p>
                <p>• Mounjaro 5 mg: dolor abdominal intenso irradiado a la espalda con vómito (pancreatitis); dolor en costado derecho con fiebre (vesícula); mareo/hipotensión por deshidratación.</p>
              </div>
            </div>

            {VALORACIONES_MEDICAS.map((v, i) => {
              const chip = v.urgencia === 'Urgente' ? 'bg-red-100 text-red-700 border-red-200'
                : v.urgencia === 'Prioritaria' ? 'bg-amber-100 text-amber-700 border-amber-200'
                : v.urgencia === 'Condicional' ? 'bg-sky-100 text-sky-700 border-sky-200'
                : 'bg-slate-100 text-slate-600 border-slate-200';
              return (
                <div key={i} className="bg-white rounded-[28px] border border-slate-100 p-5 shadow-sm">
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <h4 className="font-black text-slate-800 text-[13px] leading-snug flex-1">{v.titulo}</h4>
                    <span className={`shrink-0 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${chip}`}>{v.urgencia}</span>
                  </div>
                  <p className="text-[11px] font-bold text-indigo-600 mb-2">{v.especialista}</p>
                  <p className="text-[11px] font-bold text-slate-600 leading-snug mb-1"><span className="text-slate-400 uppercase text-[9px] tracking-widest">Qué pedir: </span>{v.pruebas}</p>
                  <p className="text-[11px] text-slate-500 font-bold leading-snug italic">{v.motivo}</p>
                </div>
              );
            })}

            <div className="bg-slate-100 rounded-[28px] p-5 border border-slate-200">
              <p className="text-[11px] font-bold text-slate-600 leading-snug">Nada de esto reemplaza a tus médicos. Las decisiones de dosis del Mounjaro y de cualquier tratamiento (tamoxifeno, testosterona) son de tu prescriptor. La testosterona se evalúa mejor con el peso ya estable — medirla en plena bajada puede dar un valor engañoso.</p>
            </div>
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
            { id: 'salud', icon: HeartPulse, label: 'Salud' },
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
                className={`flex flex-col items-center justify-center flex-1 min-w-0 py-3 sm:py-4 transition-all duration-200 ${active ? 'text-emerald-400' : 'text-slate-500'}`}
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
