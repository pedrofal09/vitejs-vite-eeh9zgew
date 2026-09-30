import React, { useState, useEffect, useRef } from 'react';
import {
  Home, Dumbbell, Apple, Activity, BookOpen, PlayCircle, Clock, Info,
  ShieldAlert, Zap, Flame, Plus, Trash2, LineChart, Timer, X,
  Pause, Play, CalendarPlus, CheckCircle, ArrowRight, Wind, ChevronRight, ActivitySquare,
  Camera, RefreshCw, Image as ImageIcon, Bot, Send, Loader2, Heart, Moon, Award,
  Settings, Bike, Footprints, KeyRound, AlertTriangle, HeartPulse, Stethoscope
} from 'lucide-react';

// ========================================================================
// DATA MASTER — PLAN «DOMINGO FUERTE» (30-sep-2026; opción 3 elegida por Pedro): sin valle · bici con el grupo Jue y Sáb · fuerza Mar, Vie y Dom
// Perfil: Pedro Falcón, MÉDICO de profesión · 44 años, 74 kg (bajó desde 84), 170 cm, IMC 25.6, ICC 0.98; cintura 89 cm y cadera 91 (30-sep-2026), pecho 97, cuello 40 (ago-2026).
// Composición estimada (antropometría Navy, no DEXA): ~19% grasa / ~59.6 kg masa magra = igual que en agosto. La cinta NO mide músculo; la pérdida durante el descenso 84→74 es plausible (con GLP-1, 25-40 % de lo perdido es magra). FOCO NUEVO: RECUPERAR masa muscular (antes era preservar).
// Cómo se mide la recuperación: perímetros de brazo (relajado y contraído), muslo medio y pantorrilla cada 2 jueves en ayunas (3 medidas) + cargas de 3 ejercicios índice (prensa, press de pecho, jalón). DEXA opcional como árbitro.
// Clínica: SAHOS severa (IAH residual 0.1-1.6 con CPAP), DRA no valorada aún por fisio, ED ansiogénica, ADORMECIMIENTO PERINEAL FRECUENTE en bici (reportado 30-sep-2026): sillín y ajuste son condición, no consejo.
// TIRZEPATIDA SUSPENDIDA el 27-sep-2026 (5 mg/sem durante meses). Lavado ~3-4 semanas (hasta ~18-oct): el apetito y el "ruido de comida" vuelven entre las semanas 2-6 → FASE DE ESTABILIDAD de 6 semanas (peso 74-75 ±1 kg, cintura estable o bajando), NO de pérdida. Alimentación: plan de la nutricionista (V. Higuita, Ecopetrol Cali, sep-2026) AJUSTADO — base del día + 450-600 kcal por hora de bici (promedio ~2.200 kcal), proteína 2.0-2.2 g/kg en 5 tomas ≥28-30 g, cena ≥2-2,5 h antes de la cama.
// SEMANAS (misma numeración del lavado): S1 = 28-sep→4-oct · S4 = 19→25-oct (viernes COMPLETO si la adherencia va ≥80 %) · S6 termina el 8-nov · S7 = descarga (−30-40 %) y mediciones.
// ADHERENCIA = métrica #1: OBLIGATORIOS (4/4) = Mar superior A · Jue bici con el grupo · Sáb salida larga · Dom full body. Vie superior B = OPCIONAL PROMOVIBLE (corto S1-3, completo desde S4). Lun caminata y Mié trote de mantenimiento = opcionales. La mínima viable CUENTA como cumplido. Regla de los 10 minutos.
// Hallazgos jul-2026: piel descolgándose + ginecomastia SIMÉTRICA (palpación normal → benigna, auto-valorada por Pedro). Ver VALORACIONES_MEDICAS.
// Cardio: bici Z2 con el grupo — Jue 60' puerta a puerta y Sáb 75-120' en llano/ondulado. SIN clearance CV: alarma a 135 lpm, tope 138, sin relevos; subidas largas (Km 18, Dapa, La Buitrera) y salidas de más de 2 h SOLO tras la prueba de esfuerzo. Carrera SIN meta de 10K (decisión de Pedro, 30-sep): dosis mínima de mantenimiento, run-walk de 20' una vez por semana o cada dos, opcional el miércoles.
// Restricción lumbar RELATIVA: NO peso muerto; sentadilla con barra solo LIGERA (15-20 kg, tier goblet) hasta clearance CV + fisio DRA + pines probados; press supino SOLO mancuernas/máquina.
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
  { name: "Check ortostático + activación (en casa)", duration: "4 min", desc: "De pie 1 min: si la FC sube más de 20 lpm o hay mareo → salida corta sola o caminata. Luego 10 puentes de glúteo + 5 respiraciones 360°. Alarma del Garmin puesta en 135 lpm y banda de pecho (la muñeca falla en bici)." },
  { name: "Spin-up Suave", duration: "8 min", desc: "Plato chico, cadencia 80-90 rpm, por debajo de Z2. Si el grupo arranca fuerte no persigas: ya avisaste que vas en Z2." }
];

const BIKE_COOLDOWN = [
  { name: "Spin-down", duration: "5 min", desc: "Cadencia ligera en plato chico hasta FC < 100 ppm." },
  { name: "Estiramiento Cadena Anterior", duration: "5 min", desc: "Psoas, cuádriceps, flexores de cadera y dorsales — antídoto a la postura sobre la bici." },
  { name: "Suelo pélvico: soltar", duration: "3 min", desc: "Acostado: respiración 360° + relajación suave (reverse Kegel). NADA de Kegels máximos. Anota si hubo adormecimiento perineal: a qué minuto empezó y cuánto tardó en irse." }
];

// BLOQUE A — MARTES noche (≤60'): Superior A + hip thrust + cuádriceps ligero + brazos — OBLIGATORIA
const BLOCK_A = [
  { name: "Press de Pecho en Multiestación", sets: 4, reps: "8-10", tempo: "RIR 2", rest: "90", yt: "seated cable chest press machine form", notes: "SUPERSERIE A1 con Jalón al Pecho (estaciones distintas): 0 s entre press y jalón, 90 s al cerrar la pareja. Sentado, espalda y cabeza pegadas al respaldo, costillas abajo, exhala al empujar, cero apnea. Regla objetiva (sin clearance CV): antes del siguiente par la FC baja a ≤120-125 lpm o salen frases completas; si no, espera más. PROGRESIÓN (objetivo nuevo = recuperar músculo): cuando las 4 series lleguen a 10 reps con RIR 2, sube 1 placa. Nunca al fallo." },
  { name: "Jalón al Pecho en Polea Alta (agarre ancho prono)", sets: 4, reps: "8-10", tempo: "RIR 2", rest: "90", yt: "wide grip lat pulldown proper form", notes: "SUPERSERIE A2 con Press de Pecho. Agarre ancho prono HOY (el viernes va la barra Z supina — estímulos distintos sin agregar ejercicios). Retracción escapular, barra a la clavícula exhalando, torso casi vertical (reclinación máx 15°): reclinarse para arrancar las últimas reps es extensión lumbar cargada (gate DRA). Si aparece doming, baja 1-2 placas." },
  { name: "Press Militar Sentado Mancuernas (respaldo 85-90°)", sets: 3, reps: "8-10", tempo: "RIR 2", rest: "90", yt: "seated dumbbell shoulder press back support", notes: "SUPERSERIE B1 con Remo en Polea. SIEMPRE sentado con respaldo alto (gate DRA: de pie multiplica la presión intraabdominal y tienta el Valsalva). Sube las mancuernas con impulso de rodillas (kick-up), no arqueando la lumbar; exhala al empujar, RIR 2 estricto. 1ª exposición vertical de la semana (la 2ª es el viernes, inclinado a 70-75°)." },
  { name: "Remo en Polea Baja (agarre neutro)", sets: 3, reps: "10", tempo: "RIR 2", rest: "90", yt: "seated cable row neutral grip form", notes: "SUPERSERIE B2 con Press Militar. Codos pegados al torso, torso casi vertical y quieto: tira exhalando, sin balanceo (el impulso lumbar es una mini-extensión cargada, gate DRA). Chequeo de coning en cada serie; si el abdomen abomba al tirar, baja una placa." },
  { name: "Hip Thrust con Mancuerna/KB en Cadera (2 piernas)", sets: 3, reps: "10-12", tempo: "Pausa 2s · RIR 3", rest: "75", yt: "dumbbell hip thrust on bench form", notes: "Sobrecarga de cadena posterior SIN bisagra cargada (peso muerto sigue PROHIBIDO por DRA). Mancuerna o kettlebell sobre la cadera, exhala al subir, pausa arriba SIN apnea, chequeo de coning por serie; abombamiento o pesadez pélvica → suspender. RIR 3 y énfasis concéntrico: la salida en bici del jueves queda a 47 h y no debe notarlo (RIR 2-3 solo si el miércoles NO corres). MÍNIMA VIABLE si el tiempo aprieta: Press de Pecho + Jalón + Dead Bug (20-25 min) — cuenta como cumplido." },
  { name: "Extensión de Rodilla o Prensa — LIGERA", sets: 2, reps: "12-15", tempo: "RIR 3", rest: "60", yt: "leg extension machine form", notes: "2ª frecuencia semanal de cuádriceps (la pesada es el domingo). LIGERA a propósito: RIR 3, bajada controlada, cero fallo — la salida del jueves queda a 47 h. Exhala al extender o empujar, sin Valsalva; en la prensa no bajes tan profundo que la pelvis se enrolle (gate DRA). Dolor anterior de rodilla → menos rango. Si el reloj no da, este slot o una ronda de brazos son los únicos recortes permitidos del martes." },
  { name: "Superserie: Curl Barra Z ⇄ Tríceps Cuerda (polea)", sets: 2, reps: "10-12 c/u", tempo: "RIR 2", rest: "60", yt: "ez bar cable curl and rope pushdown superset", notes: "Brazos DIRECTOS: curl con barra Z en polea baja y extensión de tríceps con cuerda, espalda con espalda, 60 s al cerrar la pareja. RIR 2, exhala en el esfuerzo, codos pegados al torso, cero balanceo. 1ª exposición semanal de brazos (la 2ª, con predicador, es el viernes). Desde la semana 4: 3ª ronda SOLO si el martes viene cerrando en 57 min o menos." }
];

// BLOQUE B — VIERNES noche: Superior B, SIN pierna (la salida larga es mañana a las 07:00) — OPCIONAL PROMOVIBLE
// Semanas 1-3 = versión CORTA (~35'): solo los ejercicios SIN la etiqueta «desde la semana 4». Desde la semana 4 (si la adherencia va ≥80 %) = COMPLETA (~54'). A las 20:00 se para donde vaya.
const BLOCK_B = [
  { name: "Press Inclinado Alto con Mancuernas (70-75°)", sets: 3, reps: "10", tempo: "RIR 2", rest: "75", yt: "high incline dumbbell press 75 degrees", notes: "2ª exposición de empuje vertical de la semana, ángulo DISTINTO al press militar 90° del martes. Respaldo fijado a 70-75°, espalda SIEMPRE apoyada por la DRA, exhala al empujar, sin arquear la lumbar, RIR 2 real. Nada al fallo: la salida larga es mañana a las 07:00 y hoy NO se toca pierna. Ante abombamiento o pesadez pélvica, baja carga o suspende. MÍNIMA VIABLE del viernes: este press + la superserie Jalón Z ⇄ Remo + Pallof (~25 min)." },
  { name: "Jalón Barra Z Supino", sets: 3, reps: "8-12", tempo: "RIR 2", rest: "90", yt: "underhand ez bar lat pulldown form", notes: "SUPERSERIE A1 con el Remo: 0 s entre jalón y remo, 90 s al cerrar la pareja. Agarre supino con barra Z (distinto al ancho prono del martes). Exhala en cada tirón, torso quieto, chequeo de coning. Antes era BONUS del sábado; ahora es FIJO: la tracción pasa de 7 a 15 series semanales." },
  { name: "Remo en Polea Baja (agarre prono ancho)", sets: 3, reps: "10-12", tempo: "RIR 2", rest: "90", yt: "wide grip seated cable row form", notes: "SUPERSERIE A2 con el Jalón Z. Barra recta, agarre prono ancho (distinto al neutro del martes): codos abiertos, tira hacia el esternón bajo, torso casi vertical y quieto — sin balanceo lumbar (gate DRA). Test del habla al cerrar la pareja." },
  { name: "Press Banca con Mancuernas — desde la semana 4", sets: 2, reps: "8-12", tempo: "RIR 2", rest: "90", yt: "dumbbell bench press flat form", notes: "Entra con la versión COMPLETA (semana 4 en adelante): 2 series; 3 series en las semanas 5-6. MANCUERNAS a propósito: se pueden soltar al fallar. NUNCA banca con barra libre en solitario sin pines ni ayudante. Mancuernas a las rodillas y kick-back para posicionarte, exhala al empujar, escápulas atrás." },
  { name: "Elevaciones Laterales — desde la semana 4", sets: 3, reps: "12-15", tempo: "RIR 2", rest: "45", yt: "dumbbell lateral raise form", notes: "SUPERSERIE B1 con Face Pull (45 s al cerrar la pareja). Las semanas 1-3 las laterales se hacen el DOMINGO; desde la semana 4 viven aquí. Ligeras, sin balanceo, codos suaves, sube hasta la horizontal exhalando. Sentado si aparece doming." },
  { name: "Face Pull con Cuerda — desde la semana 4", sets: 3, reps: "15", tempo: "RIR 3", rest: "45", yt: "rope face pull form external rotation", notes: "SUPERSERIE B2 con las Laterales. Cuerda a la cara separando los extremos al final (rotación externa). Ligero, torso vertical, exhala al tirar: salud de hombro para los 4 presses de la semana." },
  { name: "Curl en Predicador con Mancuerna", sets: 2, reps: "10-12", tempo: "RIR 2", rest: "60", yt: "single arm dumbbell preacher curl form", notes: "SUPERSERIE C1 con Tríceps en Cuerda (60 s al cerrar la pareja). Semanas 1-3: 2 rondas; desde la semana 4: 3 rondas. Curl estricto en el atril, sin ayuda del tronco (DRA-amable por diseño); un brazo por vez, exhala al subir, bajada controlada de 2 s." },
  { name: "Tríceps en Polea con Cuerda", sets: 2, reps: "10-12", tempo: "RIR 2", rest: "60", yt: "rope triceps pushdown form", notes: "SUPERSERIE C2 con el Predicador. Codos pegados, separa la cuerda abajo, exhala al extender, torso vertical. Semanas 1-3: 2 rondas; desde la semana 4: 3. A las 20:00 se para donde vayas: el sueño de esta noche es parte de la salida de mañana." }
];

// BLOQUE C — DOMINGO día (10:00, o 15:00 si el sábado pasó de 105'): FULL BODY LARGO sin tope de reloj (~80-88') — OBLIGATORIA
// Orden: pierna fresca primero → Nordic al cierre de pierna → superior POSTURAL (nada de pecho ni brazos a RIR 2: el viernes fue hace 38 h). Comida sólida 2-3 h antes.
const BLOCK_C = [
  { name: "Sentadilla — Goblet/Caja o Barra LIGERA (15-20 kg)", sets: 3, reps: "8-12", tempo: "RIR ≥3", rest: "120", yt: "goblet box squat and light barbell squat form", notes: "APROXIMACIÓN (no cuenta como volumen): prepara rodilla y cadera para la prensa. Barra LIGERA permitida (15-20 kg), RIR ≥3, exhalando al subir, SIN Valsalva, con chequeo de coning/doming y pesadez pélvica en CADA serie — si aparece cualquiera, vuelve al goblet. VETO QUE SIGUE: pasar de ~20 kg exige LAS TRES condiciones (clearance CV + alta de fisio DRA + pines de seguridad probados con carga). AUTORREGULACIÓN DEL DOMINGO: si la salida de ayer pasó de 105' o las piernas amanecen pesadas (3/10 o más) → sentadilla y prensa a RIR 3, 1 serie menos y Nordic 1×2 o fuera; o corre la sesión a las 15:00." },
  { name: "Prensa de Piernas — día PESADO", sets: 4, reps: "10-12", tempo: "RIR 3 (sem 1-2) → RIR 2", rest: "120", yt: "leg press machine form", notes: "EL compuesto de pierna de la semana: espalda apoyada, SIN carga axial, seguro en solitario. 2 series de aproximación (50 % y 75 %) y 4 de trabajo. Semanas 1-2 con carga conocida a RIR 3; RIR 2 desde la 3ª. 5ª serie desde la semana 3-4 SOLO si las dos últimas salen con RIR real de 3 o más. Descanso COMPLETO de 120 s: lo que recupera músculo son repeticiones de calidad, y la FC debe bajar antes de la siguiente serie. Exhala al empujar, SIN Valsalva y sin bajar tan profundo que la pelvis se enrolle (gate DRA). PROGRESIÓN: 4 series en 12 reps con RIR 2 → sube carga. Si la torre de placas topa: prensa a 1 pierna o tempo 3-1-1. MÍNIMA VIABLE del domingo: prensa 3× + puente de isquios 3× + bird dog 3× (25-30 min) — el Nordic se salta sin culpa." },
  { name: "Hip Thrust a 1 pierna (o bipodal con pausa)", sets: 3, reps: "8-12/pierna", tempo: "Pausa arriba · RIR 3", rest: "60", yt: "single leg hip thrust form", notes: "Cadena posterior segura, autolimitante en carga, sin bisagra de pie. NO peso muerto. Alternar piernas ya descansa la contralateral: 60 s bastan. Sin apnea, chequeo de coning/doming en CADA serie (DRA no valorada); abombamiento, pesadez pélvica o escape → baja carga o suspende. Si la unilateral pierde técnica, bipodal con pausa de 2 s." },
  { name: "Puente de Isquios con Pies en Banco + Mancuerna en Cadera", sets: 4, reps: "12-15", tempo: "Pausa 2s · RIR 2", rest: "60", yt: "feet elevated hamstring bridge bench form", notes: "Ahora CARGADO para que sea estímulo real (tu estación de pierna solo EXTIENDE; no hay curl femoral): talones sobre el banco, piernas casi extendidas (palanca larga = sesga ISQUIO), mancuerna sujeta con las manos sobre la cadera. Sube con los isquios —no con la lumbar—, pausa 2 s arriba, baja controlado. Exhala al subir, sin apnea, chequeo de coning. Si el isquio amenaza calambre, suelta la mancuerna y sigue con peso corporal." },
  { name: "Pantorrillas en Prensa (calf press)", sets: 4, reps: "10-15", tempo: "Pausa arriba · RIR 2", rest: "60", yt: "leg press calf raise form", notes: "Dosis PRINCIPAL de pantorrilla de la semana (la bici la carga poco): pies bajos en la placa, empuja con el antepié, pausa arriba y estiramiento abajo controlado. Exhala al empujar. 5ª serie en las semanas 5-6. Ya no hay que cuidarla por la tirada: la siguiente salida es el jueves." },
  { name: "Pantorrilla de Pie con Kettlebell", sets: 2, reps: "15", tempo: "RIR 3", rest: "45", yt: "standing calf raise kettlebell form", notes: "2ª dosis de pantorrilla en la misma sesión, rango completo con pausa arriba. KB en una mano, la otra de apoyo. Primer recorte si el domingo se alarga más de 90 min." },
  { name: "Isquios Excéntrico ASISTIDO (Nordic)", sets: 1, reps: "3", tempo: "Excéntrico lento", rest: "120", yt: "assisted eccentric nordic hamstring lower", notes: "Cierre de la pierna y ÚNICO excéntrico fuerte de la semana. Se queda aunque la carrera baje: protege los isquios y recupera músculo. Queda a 103 h de la salida del jueves y a 139 h de la del sábado. Dosis 1×3 las semanas 1-2; escalones 1×4 → 1×5 → 2×4, cada uno SOLO tras 2 domingos seguidos con isquios en 2/10 o menos a las 48 h y pedaleo normal el jueves. Nunca sube el mismo domingo en que sube la prensa. Rodillas en colchoneta, tobillos anclados firmes (PRUEBA el anclaje SIN carga primero), exhala toda la bajada, manos listas para recibirte. Si ayer la salida fue dura: 1×2 o se salta." },
  { name: "Jalón con Agarre Neutro o Cuerda — LIGERO", sets: 2, reps: "12", tempo: "RIR 3", rest: "60", yt: "neutral grip lat pulldown form", notes: "3ª frecuencia semanal de tracción, LIGERA (RIR 3): postura y volumen barato, no otra sesión de espalda. Torso casi vertical, exhala al tirar." },
  { name: "Elevaciones Laterales — solo semanas 1-3", sets: 3, reps: "12-15", tempo: "RIR 2", rest: "45", yt: "dumbbell lateral raise form", notes: "Mientras el viernes es corto (semanas 1-3) las laterales viven aquí. Desde la semana 4 pasan al viernes y este slot se ELIMINA. Ligeras, sin balanceo, sentado si aparece doming." },
  { name: "Rotación Externa Tumbado con Mancuerna", sets: 2, reps: "15/lado", tempo: "RIR 3", rest: "45", yt: "side lying dumbbell external rotation form", notes: "Salud de hombro para 4 presses por semana: de lado, codo pegado al costado a 90°, mancuerna muy ligera, rota hacia arriba sin despegar el codo. Lento y sin dolor." },
  { name: "Face Pull con Cuerda — desde la semana 4", sets: 2, reps: "15", tempo: "RIR 3", rest: "45", yt: "rope face pull form external rotation", notes: "Entra en la semana 4 junto con el viernes completo. Cuerda a la cara separando los extremos, torso vertical, exhala al tirar." }
];

// CORE DRA-SAFE — al final de cada sesión de fuerza (anti-extensión / anti-rotación, sin Valsalva). Descanso 30 s: es submáximo y de control respiratorio.
const CORE_DRA_MARTES = [
  { name: "Dead Bug", sets: 3, reps: "8/lado", rest: "30", yt: "dead bug exercise diastasis safe", notes: "DRA-safe: lumbar pegada al suelo, sin doming de la línea alba. Exhala al extender. NADA de contracciones máximas de suelo pélvico hasta el alta del fisio." }
];

const CORE_DRA_VIERNES = [
  { name: "Pallof Press en Polea", sets: 2, reps: "12/lado", rest: "30", yt: "pallof press cable anti rotation", notes: "Anti-rotación, DRA-safe. Respiración 360°." },
  { name: "Plancha SIN doming — desde la semana 4", sets: 2, reps: "20-30 seg", rest: "30", yt: "incline plank diastasis safe form", notes: "Entra con el viernes completo. Inclinada (manos en banco) o de rodillas; progresa a plancha completa SOLO si la línea alba controla la presión (valoración del fisio). Al PRIMER doming → inclinada. Respira todo el tiempo; una plancha en apnea no cuenta." }
];

const CORE_DRA_DOMINGO = [
  { name: "Bird Dog", sets: 3, reps: "8/lado", rest: "30", yt: "bird dog exercise core stability", notes: "DRA-safe. Pelvis estable, sin rotación de cadera." },
  { name: "Pallof Press en Polea", sets: 2, reps: "12/lado", rest: "30", yt: "pallof press cable anti rotation", notes: "Anti-rotación, DRA-safe." },
  { name: "Respiración Diafragmática 360°", sets: 1, reps: "8-10 resp.", rest: "30", yt: "360 diaphragmatic breathing core", notes: "Cierre PARASIMPÁTICO deliberado de la sesión más larga de la semana. Sin contracciones máximas de suelo pélvico hasta valoración del fisio." }
];

// SUELO PÉLVICO — GATE: hasta el alta del fisio de suelo pélvico, SOLO respiración/coordinación.
// En un suelo potencialmente hipertónico (plausible con ED ansiogénica) los Kegels máximos EMPEORAN el cuadro.
const SUELO_PELVICO = [
  { name: "Respiración Diafragmática 360°", reps: "3×8 resp.", desc: "Coordina respiración y suelo pélvico SIN contraer al máximo. Al exhalar, el suelo pélvico sube suave al 20-30%, no al 100%." },
  { name: "Relajación / Reverse Kegels", reps: "10 lentas", desc: "Empuja suavemente hacia afuera al exhalar. Si hay tensión o ansiedad, la RELAJACIÓN es la prioridad — más contracción empeora el cuadro." },
  { name: "GATE del fisio", reps: "—", desc: "NADA de Kegels máximos progresivos hasta que un fisio de suelo pélvico te valore y confirme si necesitas fortalecer (hipotonía) o relajar (hipertonía). El componente ansiogénico de la ED se deriva a medicina sexual/psicología." }
];

const SCHEDULE = [
  { day: "Lunes", type: "Descanso — caminata opcional", target: "Recuperación: ayer fue la pierna pesada y el Nordic. Sin fuerza ni accesorios; descansar CUENTA.", time: "0-30 min opcional", isRest: true, notes: "Sin entrenamiento estructurado. Opcional y solo de mañana: caminata fácil 20-30 min + respiración diafragmática suave (DRA-safe). Día de descanso: ~1.800-1.950 kcal con proteína 2.0-2.2 g/kg en 5 tomas de ≥28-30 g — hoy se repara lo del domingo, así que la proteína NO baja. Hasta ~18-oct (lavado del fármaco) se come POR PLAN aunque el apetito no aparezca; desde la semana 4, por plan y por hambre. Cena terminada ≥2-2,5 h antes de la cama. Cafeína: corte a las 15:00. Priorizar sueño con CPAP." },
  { day: "Martes", type: "Fuerza — Superior A (NOCHE ≤60') · OBLIGATORIA", target: "1ª obligatoria de la semana: pares antagonistas de superior + hip thrust + cuádriceps ligero + brazos. Plato sólido a las 17:15 (sin grasa añadida) → entrenar 19:00-20:00 → batido con fruta y avena → nada después de las 21:00. Día de fuerza ~2.100-2.200 kcal.", time: "~55 min · 19:00-20:00 · cerrar ≥2h antes de la cama", exercises: BLOCK_A, hasWarmup: true, coreDRA: CORE_DRA_MARTES },
  { day: "Miércoles", type: "Libre — trote suave de mantenimiento 20' · OPCIONAL", target: "Colchón de la semana: descansar CUENTA. El 10K dejó de ser meta; el trote es la dosis mínima para no perder la tolerancia al impacto: basta una vez por semana o cada dos.", time: "0-20 min · PM", isRunning: true, zone: "Z2 puro conversacional por FC (tope práctico 135-138 lpm + test del habla); Z3 SOLO tras clearance CV", duration: "Run-walk 4'/1' × 4 (20'). NO progresa: es mantenimiento, no entrenamiento de carrera. Mínima viable: 15' de caminata rápida.", notes: "SIN META DE 10K (decisión tuya, 30-sep): no vas a practicar mucho running, pero tampoco a abandonarlo. La tolerancia del tendón y del hueso al impacto se pierde en 3-4 semanas sin correr, y con 20' suaves cada 7-14 días se conserva. Si el miércoles no sale, el trote va como calentamiento del domingo (10-15' antes del full body) — nunca los dos en la misma semana. Si pasan 3 semanas o más sin correr: reinicia con 15' y más caminata. Si dos semanas seguidas llegas fundido al viernes, el trote sale del miércoles y queda solo el del domingo. Comida: si corres, la merienda de las 17:15 es tu pre-carrera, día ~1.900-2.000 kcal y cena ligera (≤450 kcal, ≤10 g de grasa) terminada ≥2 h antes de acostarte; si no corres, día de descanso ~1.850-1.950 kcal." },
  { day: "Jueves", type: "Bici Z2 con el grupo (NOCHE · 60' puerta a puerta) · OBLIGATORIA", target: "Cardio anclado a los amigos: la mejor palanca de adherencia del plan. Llano, corto y conversacional. En casa a las 20:15 pase lo que pase con el grupo (cama 22:30 con CPAP).", time: "60 min · 19:00 → en casa 20:15", isBike: true, zone: "Z2 puro: alarma a 135 lpm, tope 138 + test del habla", duration: "60' puerta a puerta: spin-up 8' + ~47' con el grupo + vuelta suave 5'. Si la ruta del grupo es de 90', haces el bucle de 60' y vuelves solo por ruta conocida (pactado antes). Si el grupo sale después de las 19:10 → 45'. Mínima viable: 30' sola en ruta plana o caminata rápida 30' — cuenta como cumplido.", notes: "SIN PRUEBA DE ESFUERZO = Z2 PURO. Avísalo antes de salir: «voy en Z2, no persigo». A rueda o en cola, nunca tirando; sin relevos ni sprints. Más de 30 s sobre 138 lpm → suelta la rueda, plato chico; más de 2 min acumulados sobre 138 → la salida termina ahí. Luces delantera y trasera + reflectivo, ruta iluminada y conocida. SILLÍN: de pie 10-15 s cada 10 min; si se duerme el periné → de pie hasta que ceda; si vuelve → a casa. COMIDA (60' de bici ≈ 450-600 kcal; día ~2.250-2.400): plato sólido a las 17:15, solo agua durante, 1 banano 30 min antes si el día vino corto; al volver batido o yogur con fruta antes de las 20:45 y nada sólido después de las 21:00. PARADA DURA: dolor u opresión torácica, presíncope, disnea desproporcionada o palpitaciones sostenidas → parar y consultar." },
  { day: "Viernes", type: "Fuerza — Superior B (NOCHE): corta 35' sem 1-3 → completa desde la 4 · OPCIONAL promovible", target: "SOLO tren superior: la salida larga es mañana a las 07:00 (cero pierna, cero excéntricos, nada al fallo). Semanas 1-3 versión corta (los ejercicios SIN la etiqueta «desde la semana 4»); desde la semana 4 completa y fija SI llevas 3 semanas con ≥80% de adherencia. A las 20:00 se para donde vaya. Plato sólido 17:00-17:30 con carbohidrato: la recarga para mañana se reparte en almuerzo + plato + batido (la cena cargada no existe). Día ~2.000-2.100 kcal (corta) o 2.100-2.200 (completa). Si el viernes se cae 2 semanas seguidas, se elimina y el domingo NO crece.", time: "35-54 min · 19:00-20:00 · cama 22:30", exercises: BLOCK_B, hasWarmup: true, coreDRA: CORE_DRA_VIERNES },
  { day: "Sábado", type: "Salida larga en bici con el grupo (MAÑANA) · OBLIGATORIA", target: "La sesión aeróbica principal, con los amigos. Hasta tener la prueba de esfuerzo: llano u ondulado, Z2 y máximo 2 horas. Si el grupo sube, vas hasta la base y regresas a tu ritmo — eso CUENTA como cumplido.", time: "75-120 min · 07:00", isBike: true, zone: "Z2 puro: alarma a 135 lpm, tope 138 + test del habla", duration: "Rampa: semanas 1-2 → 75-90' · semanas 3-4 → 90-105' · semanas 5-6 → 105-120' (TOPE sin prueba de esfuerzo). Terreno llano u ondulado, hasta 300-400 m de desnivel (Jamundí, Rozo/El Cerrito, Yumbo-Vijes). Km 18, Dapa y La Buitrera: SOLO tras el clearance. Subes escalón si en las dos salidas previas la FC media fue Z2, sin adormecimiento perineal y sin síntomas. Mínima viable: 45-60' sola en plano o caminata 45'.", notes: "ADORMECIMIENTO PERINEAL (te pasa a menudo): es frecuente en ciclistas pero NO es inocuo — son el nervio pudendo y las arterias del periné comprimidos entre el sillín y el pubis. Mientras siga apareciendo, el tope es 90' aunque toque subir escalón. De pie 10-15 s cada 10 min; si se duerme, de pie hasta que vuelva la sensibilidad; si reaparece, la salida termina. Sillín con canal central o sin nariz, del ancho de tus isquiones, horizontal o con la punta 1-3° abajo; altura que no haga balancear la cadera; manillar no tan bajo; badana sin ropa interior. Adormecimiento que dura más de 24 h, dolor al sentarte o cambio en la erección → urología antes de la siguiente salida larga. COMIDA (salida 07:00): despertar 06:00; 06:05-06:15 banano + arepa o pan con bocadillo + café (40-60 g de carbohidrato); desde el minuto 45-60, 30-60 g de carbohidrato por hora (banano, dátiles, bocadillo, agua de panela) y 500-750 ml/h con electrolitos; en la primera hora al volver ≥30 g de proteína + 75-90 g de carbohidrato (los pancakes van AQUÍ). Día ~2.500-2.700 kcal (90') o 2.700-2.900 (120'). GRUPO: a rueda, sin relevos, subidas cortas sentado y a tu ritmo («reagrupamos arriba»); más de 2 min acumulados sobre 138 lpm → la salida termina y la próxima se recorta 25%. Check ortostático antes de salir. PARADA DURA: dolor torácico, presíncope, disnea desproporcionada, palpitaciones sostenidas." },
  { day: "Domingo", type: "Fuerza — Full body LARGO (DÍA, sin tope) · OBLIGATORIA", target: "La sesión más importante para recuperar músculo: pierna pesada y Nordic donde el reloj no manda, a más de 100 h de la siguiente salida. Comida sólida 2-3 h antes (desayuno 07:00-07:30 para entrenar a las 10:00). Si ayer la salida pasó de 105' o las piernas amanecen pesadas: RIR 3, 1 serie menos, o correr la sesión a las 15:00 — nunca a la noche. Día de fuerza ~2.200-2.300 kcal; almuerzo con ½ cucharón de fríjol o lenteja (legumbres solo el finde; nada de mar).", time: "~80-88 min · 10:00 (o 15:00)", exercises: BLOCK_C, hasWarmup: true, coreDRA: CORE_DRA_DOMINGO }
];

// VALORACIONES MÉDICAS A AGENDAR — del panel clínico (jul-2026, 5 mg + gineco + piel).
// Triaje ESCALONADO: primero exploración presencial (Etapa 0); labs/imagen SOLO si confirma glandular o hay bandera.
// urgencia: 'Urgente' (días/ya) · 'Prioritaria' (semanas) · 'Condicional' (según hallazgo) · 'Diferida' (a peso estable)
const VALORACIONES_MEDICAS = [
  { titulo: "Ginecomastia — auto-valorada por Pedro (médico): SIMÉTRICA, palpación normal, sin nódulo sospechoso", especialista: "A criterio de Pedro (Endocrinología si desea caracterización etiológica)", urgencia: "Rutina", pruebas: "Patrón benigno (simétrico + palpación normal) → malignidad muy improbable (esa es unilateral, dura, excéntrica): NO indica imagen ni descarte urgente. Abordaje = caracterización etiológica OPCIONAL en el contexto de pérdida rápida + 5 mg: glandular vs pseudo y balance estradiol/testosterona (ver panel hormonal). Revisar fármacos gineco-inductores.", motivo: "El examen benigno reencuadra: no es descarte de cáncer, es etiología opcional. La testosterona se interpreta mejor con peso estable; no auto-medicar T (empeora la ginecomastia)." },
  { titulo: "Seguimiento POST-SUSPENSIÓN de tirzepatida con el prescriptor (suspendida 27-sep-2026)", especialista: "Endocrinología / bariatría (prescriptor de Mounjaro)", urgencia: "Prioritaria", pruebas: "Informarle motivo y fecha de la suspensión si no fue con él, y acordar el umbral de reinicio. Peso diario en ayunas → promedio semanal (el único número que se interpreta) + cintura semanal. Línea base 'día 0' (3 mañanas seguidas ya) y línea base operativa = promedio de la semana 3.", motivo: "Tras retirar un GLP-1 la evidencia (SURMOUNT-4) muestra reganancia de la mitad a dos tercios de lo perdido en un año, sobre todo grasa. Volver al prescriptor si reganancia ≥3% (≥2,2 kg → promedio ≥76,6 kg) sostenida 4 semanas pese a los ajustes, o hambre ingobernable con atracones: reiniciar a dosis baja de mantenimiento es una decisión legítima, y es mejor tomarla a +3% que a +8%." },
  { titulo: "Clearance CARDIOVASCULAR pre-esfuerzo (gate duro)", especialista: "Cardiología / Medicina del Deporte", urgencia: "Prioritaria", pruebas: "PA con toma ortostática, ECG de reposo, perfil lipídico, glucosa/HbA1c; prueba de esfuerzo a criterio del cardiólogo.", motivo: "SAHOS severa + la ED como posible marcador vascular (no la des por psicógena) lo exigen. Bloquea Z3, back squat con barra y, en la bici, rodar a ritmo de grupo, relevos, subidas largas (Km 18, Dapa, La Buitrera) y salidas de más de 2 h. Es la PRIMERA acción del plan nuevo: agendarla esta semana y tenerla hecha antes del 25-oct (semana 4)." },
  { titulo: "Fisioterapia de DRA + suelo pélvico (gate duro)", especialista: "Fisioterapia de abdomen/suelo pélvico", urgencia: "Prioritaria", pruebas: "Distancia inter-rectos, función del transverso, manejo de presión intraabdominal, evaluación de suelo pélvico.", motivo: "Guiar el core sin subir la presión, avanzar al cierre de la DRA y habilitar la carga axial. También relevante para la ED." },
  { titulo: "Adormecimiento perineal en bici (frecuente) — ajuste de sillín y posición; urología si hay banderas", especialista: "Bike fit (biomecánico de ciclismo) · Urología / fisio de suelo pélvico si persiste", urgencia: "Prioritaria", pruebas: "ANTES de la primera salida de 90' o más: sillín con canal central o sin nariz, del ancho de los isquiones (se mide), horizontal o con la punta 1-3° abajo; altura que no haga balancear la cadera; manillar no tan bajo; badana. Registrar en cada salida: minuto en que empieza, zona (pene, escroto, periné) y cuánto tarda en ceder.", motivo: "Es compresión del nervio pudendo y de las arterias perineales entre el sillín y el pubis. Repetida se asocia a neuropatía pudenda y puede sumar un componente neurovascular a la disfunción eréctil; lo corrige la bici, no el aguante. Banderas para consultar: dura más de 24 h, dolor perineal al sentarse, cambio en la erección o en la sensibilidad genital, síntomas urinarios." },
  { titulo: "Control con la nutricionista (V. Higuita, Ecopetrol) a las 4-6 semanas — fines de octubre, fármaco ya lavado", especialista: "Nutrición (Promoción y Prevención Ecopetrol Cali)", urgencia: "Prioritaria", pruebas: "Llevar: 1 semana de registro con báscula de cocina sobre el plan tal como lo comés; peso promedio semanal y cintura; cargas de 3 ejercicios índice; sueño con CPAP (AHI residual); hambre 0-10; y BIA repetida en las MISMAS condiciones que la de septiembre (mañana, ayuno, post-micción, sin entrenar 12-24 h) o DXA como árbitro del 25,9% (BIA) vs ~20% (cinta).", motivo: "Su plan se estimó en ~1.550 kcal (déficit 30-40%) y se ajustó a ~2.000 kcal por tipo de día para la retirada del GLP-1; hay que reconciliarlo con su VET prescrito. Preguntas: VET y tabla del NÚMERO de intercambios/día (la guía no la incluye), si sabía del Mounjaro y de su suspensión, menú del domingo, sus restricciones (nada de mar; legumbres solo fin de semana por intolerancia) y el omega-3 EPA+DHA suplementario que las reemplaza (de microalgas si el motivo es alergia), proteína 1.8-2.0 g/kg con desayunos ≥30 g, creatina 3-5 g/día, y la reasignación de kcal por día del plan nuevo (fuerza Mar/Vie/Dom y bici con el grupo Jue/Sáb: base del día + 450-600 kcal por hora de bici, con carbohidrato durante la salida larga; promedio ~2.200 kcal)." },
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
// COMPOSICIÓN CORPORAL INDIRECTA (método Navy, hombre) — desde cinta + peso,
// SIN báscula de bioimpedancia. Necesita: peso, altura, cintura, cuello (cadera para ICC).
// ========================================================================
const round1 = (n) => Math.round(n * 10) / 10;
const bodyComp = (o) => {
  if (!o) return {};
  const w = parseFloat(o.weight), hM = parseFloat(o.height), waist = parseFloat(o.waist), neck = parseFloat(o.neck), hip = parseFloat(o.hip);
  const r = {};
  const hCm = hM > 0 ? hM * 100 : null;
  if (w > 0 && hM > 0) r.bmi = round1(w / (hM * hM));
  if (waist > 0 && hCm) r.whtr = +(waist / hCm).toFixed(2);
  if (waist > 0 && hip > 0) r.icc = +(waist / hip).toFixed(2);
  if (waist > 0 && neck > 0 && hCm && waist > neck) {
    const bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(hCm)) - 450;
    if (bf > 3 && bf < 60) {
      r.bf = round1(bf);
      if (w > 0) { r.fatKg = round1(w * bf / 100); r.leanKg = round1(w - w * bf / 100); r.ffmi = round1((w - w * bf / 100) / (hM * hM)); }
    }
  }
  return r;
};
// Peso objetivo para un %grasa meta, preservando la masa magra actual
const targetWeight = (leanKg, bfTargetPct) => (leanKg && bfTargetPct != null) ? round1(leanKg / (1 - bfTargetPct / 100)) : null;

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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5 font-black text-slate-900">
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
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-xl text-slate-900 tracking-tighter uppercase group-active:opacity-70">{day.day}</span>
                  {!day.isRest && (
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${day.type.includes('OBLIGATORIA') ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>{day.type.includes('OBLIGATORIA') ? 'Obligatoria' : 'Opcional'}</span>
                  )}
                </div>
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

      <div className={`text-white rounded-[55px] p-8 sm:p-10 shadow-2xl border-b-[14px] relative overflow-hidden border border-slate-800 ${dayData.isRest ? 'bg-slate-700 border-slate-500' : dayData.isRunning ? 'bg-slate-900 border-orange-500' : dayData.isBike ? 'bg-slate-900 border-sky-500' : 'bg-slate-900 border-emerald-500'}`}>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full -mr-24 -mb-24 blur-3xl"></div>
        <h2 className={`text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none italic ${dayData.isRest ? 'text-slate-300' : dayData.isRunning ? 'text-orange-400' : dayData.isBike ? 'text-sky-400' : 'text-emerald-400'}`}>{dayData.day}</h2>
        <p className="text-xl sm:text-2xl font-bold text-slate-200 mt-3 tracking-tight">{dayData.type}</p>
        <div className="flex gap-4 mt-8 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-slate-300">
          <span className="flex items-start bg-slate-800/80 px-4 py-3 rounded-2xl border border-slate-700 shadow-inner tracking-widest leading-relaxed break-words"><Activity size={16} className="mr-3 mt-0.5 shrink-0 text-emerald-500" /> {dayData.target}</span>
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
            <div className="grid grid-cols-1 gap-3 mt-4">
              <div className="bg-white/10 p-4 rounded-3xl border border-white/10 shadow-inner"><p className="text-[10px] uppercase font-black opacity-60 tracking-widest mb-1">Duración</p><p className="text-[13px] font-black leading-snug break-words">{dayData.duration}</p></div>
              <div className="bg-white/10 p-4 rounded-3xl border border-white/10 shadow-inner"><p className="text-[10px] uppercase font-black opacity-60 tracking-widest mb-1">Zona FC</p><p className="text-[13px] font-black leading-snug break-words">{dayData.zone}</p></div>
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
            <SectionHeader color="text-sky-100" icon={Bike}>Salida en Bici · Z2 con el grupo</SectionHeader>
            <div className="grid grid-cols-1 gap-3 mt-4">
              <div className="bg-white/10 p-4 rounded-3xl border border-white/10 shadow-inner"><p className="text-[10px] uppercase font-black opacity-60 tracking-widest mb-1">Duración</p><p className="text-[13px] font-black leading-snug break-words">{dayData.duration}</p></div>
              <div className="bg-white/10 p-4 rounded-3xl border border-white/10 shadow-inner"><p className="text-[10px] uppercase font-black opacity-60 tracking-widest mb-1">Zona FC</p><p className="text-[13px] font-black leading-snug break-words">{dayData.zone}</p></div>
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
              <p className="text-[11px] text-slate-300 font-bold leading-snug">• Conversacional: frases completas sin jadear. Alarma a 135 lpm, tope 138.</p>
              <p className="text-[11px] text-slate-300 font-bold leading-snug">• Más de 30 s sobre 138: suelta la rueda, plato chico o para. A rueda o en cola; sin relevos ni sprints.</p>
              <p className="text-[11px] text-slate-300 font-bold leading-snug">• Hidratación: 500-750 ml/hora. Carbohidrato 30-60 g/hora desde el minuto 45-60 si la salida pasa de 75 min.</p>
              <p className="text-[11px] text-slate-300 font-bold leading-snug">• Sillín: de pie 10-15 s cada 10 min. Si se duerme el periné, de pie hasta que ceda; si vuelve, la salida termina.</p>
            </div>
          </div>

          <SectionHeader icon={Wind}>Fase 3: Recuperación (13 min)</SectionHeader>
          <div className="space-y-4">
            {BIKE_COOLDOWN.map((p, i) => (
              <div key={i} className="bg-white p-6 rounded-[35px] border border-slate-100 shadow-sm flex items-center opacity-85">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center font-black mr-5 shadow-inner border border-blue-100">✓</div>
                <div><p className="font-black text-sm text-slate-900 uppercase tracking-tight">{p.name} <span className="text-blue-500">[{p.duration}]</span></p><p className="text-[11px] text-slate-500 font-bold mt-1 leading-snug">{p.desc}</p></div>
              </div>
            ))}
          </div>

          {dayData.accessories && (
            <div className="space-y-4">
              <SectionHeader icon={Dumbbell} color="text-sky-500">Accesorios de Fuerza (12-15 min)</SectionHeader>
              {dayData.accessories.map((ex, i) => (
                <div key={i} className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight flex-1 pr-3">{i + 1}. {ex.name}</h4>
                    <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.yt)}`} target="_blank" rel="noopener noreferrer" className="bg-sky-50 text-sky-500 p-2.5 rounded-2xl active:scale-90 transition-transform shrink-0"><PlayCircle size={18} /></a>
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

const COACH_SYSTEM_PROMPT = `Eres el coach de Falcon44+ para Pedro (44 años, MÉDICO de profesión — háblale como a un colega clínico: preciso y directo, con terminología médica cuando aplique, sin lenguaje alarmista de lego; aun así NO diagnostiques ni prescribas por él, él decide su propio manejo médico), acompañándolo en un plan de entrenamiento rediseñado que corre en paralelo a la RETIRADA de tirzepatida (Mounjaro 5 mg/sem, SUSPENDIDA el 27-sep-2026) y a dos objetivos: RECUPERAR masa muscular sin reganar grasa, y sostener el cardio en bici con su grupo de amigos (el 10K dejó de ser meta: la carrera queda en dosis mínima de mantenimiento). Tu rol es guiar día a día, adaptar la sesión escrita a cómo llega Pedro esa mañana, y recordar límites de seguridad — nunca sustituyes al médico prescriptor, al fisioterapeuta de diástasis (DRA)/suelo pélvico ni el clearance cardiovascular.

FILOSOFÍA DEL PLAN (reprogramado 30-sep-2026, opción «DOMINGO FUERTE» elegida por Pedro) — LA ADHERENCIA MANDA Y EL OBJETIVO ES RECUPERAR MÚSCULO:
Ya NO hay fármaco ni valle: la semana se reorganizó alrededor de dos realidades. (1) Pedro tiene un GRUPO de amigos que sale en bici jueves y sábado: es la mejor palanca de adherencia que ha tenido el plan, y el cardio se ancla ahí. (2) Reporta pérdida de masa muscular: por cinta la composición está igual que en agosto (~59,6 kg de magra), pero la cinta no mide músculo y la pérdida durante el descenso 84→74 es plausible — el foco pasa de PRESERVAR a RECUPERAR. Entrena de NOCHE martes, jueves y viernes (≤60') y de DÍA el fin de semana; el lunes solo tiene ventana de mañana. El contrato es 4 OBLIGATORIOS (Mar superior A · Jue bici con el grupo · Sáb salida larga · Dom full body) + el VIERNES como opcional PROMOVIBLE (corto las semanas 1-3, completo y fijo desde la 4 si la adherencia va ≥80 %) + 2 OPCIONALES (Lun caminata, Mié trote de mantenimiento) — éxito semanal = 4/4, la sesión MÍNIMA VIABLE cuenta como cumplida, y rige la regla de los 10 minutos (cambiarse + 10 min del primer ejercicio, con permiso explícito de parar ahí, sin culpa). Numeración de semanas = la del lavado: S1 = 28-sep→4-oct, S4 = 19→25-oct, S6 termina el 8-nov, S7 = descarga (−30-40 %) y mediciones. Nunca conviertas los opcionales en fuente de culpa: existen para sumar, no para fallar.

ESTRUCTURA SEMANAL (referencia rápida, ver SCHEDULE para el detalle exacto):
- Lunes: DESCANSO (caminata 20-30' + respiración 360° opcional, solo de mañana). Sin fuerza ni accesorios: ayer fue la pierna pesada. ~1.800-1.950 kcal.
- Martes (NOCHE, OBLIGATORIA, ≤60'): fuerza SUPERIOR A — press de pecho ⇄ jalón ancho 4× (90 s), militar sentado ⇄ remo neutro 3×, hip thrust bipodal 3× (RIR 3), extensión o prensa LIGERA 2× (RIR 3), curl Z ⇄ tríceps 2×, dead bug. Empuje supino SOLO mancuernas/máquina. ~2.100-2.200 kcal.
- Miércoles (OPCIONAL): libre, o trote suave de MANTENIMIENTO (run-walk Z2 4'/1' × 4 = 20'), una vez por semana o cada dos. Pedro decidió el 30-sep que el 10K NO es meta y que no quiere practicar mucho running, pero tampoco abandonarlo. Plan B si el miércoles no sale: 10-15' de trote como calentamiento del domingo (nunca los dos en la misma semana).
- Jueves (NOCHE, OBLIGATORIA): BICI Z2 con el grupo, 60' PUERTA A PUERTA, llano e iluminado, en casa a las 20:15. Mínima viable: 30' sola o caminata. ~2.250-2.400 kcal.
- Viernes (NOCHE, OPCIONAL PROMOVIBLE): fuerza SUPERIOR B, SIN pierna (la salida larga es a las 07:00 del sábado). Corta ~35' las semanas 1-3 (inclinado 3×, jalón Z ⇄ remo prono 3×, predicador ⇄ tríceps 2×, Pallof); completa ~54' desde la semana 4 (+ banca con mancuernas, laterales ⇄ face pull, 3ª ronda de brazos, plancha). A las 20:00 se para. ~2.000-2.200 kcal.
- Sábado (MAÑANA 07:00, OBLIGATORIA): SALIDA LARGA en bici con el grupo — 75-90' (S1-2) → 90-105' (S3-4) → 105-120' (S5-6, TOPE sin prueba de esfuerzo), llano u ondulado. ~2.500-2.900 kcal según duración.
- Domingo (DÍA 10:00 o 15:00, OBLIGATORIA, sin tope): FULL BODY LARGO ~80-88' — goblet/barra ligera 3× (aproximación), prensa PESADA 4× (120 s), hip thrust 1 pierna 3×, puente de isquios cargado 4×, calf press 4× + pantorrilla KB 2×, Nordic 1×3, jalón neutro ligero 2×, laterales 3× (solo S1-3), rotación externa 2× (+ face pull desde S4), bird dog + Pallof + respiración. ~2.200-2.300 kcal.

CONTRATO DE ADHERENCIA (recuérdaselo cuando flaquee, sin culpa y sin sermón):
Éxito semanal = 4/4 obligatorios (Mar/Jue/Sáb/Dom). La MÍNIMA VIABLE cuenta como cumplido: Mar = press ⇄ jalón + dead bug (20-25'); Jue = 30' de bici sola en ruta plana o caminata rápida; Sáb = 45-60' sola en plano o caminata 45'; Dom = prensa 3× + puente de isquios 3× + bird dog (25-30'; el Nordic nunca entra en una mínima); Vie = inclinado + jalón Z ⇄ remo + Pallof (~25'). Regla de los 10 minutos: el compromiso es cambiarse + 10 min del primer ejercicio, con permiso explícito de parar ahí — la motivación llega DESPUÉS de empezar. Ancla nocturna: llegar → cambiarse ANTES de sentarse (el sofá es el punto de no retorno) → snack líquido → entrenar. Registro binario: "aparecí sí/no", nunca kilos ni minutos. Orden de sacrificio si la semana viene rota: Mié → Lun → Vie → NUNCA un obligatorio completo. FUSIBLE DEL VIERNES: si se cae 2 semanas seguidas, se elimina y el domingo NO crece por encima de 90' — el volumen perdido no se recupera esa semana. PROMOCIÓN: 3 semanas con ≥80 % → viernes completo y obligatorio (desde el 23-oct); tras 4 semanas más con ≥80 %, la siguiente opción es sumar un día de torso el miércoles (4 sesiones de fuerza) — eso lo decide Pedro, tú solo lo mencionas.

GATES MÉDICOS DUROS — no negociables, van ANTES de progresar, no después:
1. Clearance CARDIOVASCULAR (evaluación clínica ± ECG/ergometría) ANTES de cualquier fuerza casi-máxima y de cualquier cardio de calidad/Z3 (en bici: ritmo de grupo, relevos, subidas largas como Km 18, Dapa o La Buitrera, y salidas de más de 2 h) — no solo antes de "escalar". La prueba de esfuerzo es la PRIMERA acción del plan nuevo: agendarla ya y tenerla antes del 25-oct (semana 4). El perfil de riesgo de Pedro (44 años, cintura 89 cm y bajando, SAHOS severa, disfunción eréctil como marcador endotelial) lo exige.
2. Valoración de FISIO de diástasis (DRA) y suelo pélvico, con medición basal inter-rectos y ausencia confirmada de doming bajo carga, ANTES de cualquier carga axial progresiva con barra (sentadilla pesada, brace).
3. Analítica hormonal/metabólica basal con el prescriptor (testosterona total/libre, descartar hipogonadismo) antes de prometer o esperar cambios de testosterona.
Mientras estos gates no estén cumplidos: sentadilla ligera (goblet/caja) a RIR≥3 con exhalación, nunca brace pesado ni Valsalva; cardio (bici y carrera) solo en Z2 puro — alarma a 135 lpm, tope 138 y test del habla —, sin bloques de calidad, sin relevos y sin subidas largas.

BANDERAS ROJAS — detener la sesión y escalar:
- Cardiovasculares (atención urgente): dolor u opresión torácica, síncope o presíncope, disnea desproporcionada al esfuerzo, palpitaciones sostenidas al correr o pedalear.
- Del fármaco (contactar al prescriptor): dolor epigástrico intenso irradiado a la espalda (posible pancreatitis), vómito persistente o deshidratación, náusea incapacitante, reflujo/regurgitación durante el brace o al correr (riesgo de aspiración por vaciamiento gástrico retrasado).
- De la pared abdominal (parar el ejercicio): abombamiento (doming) o dolor de la línea alba, protrusión o sospecha de hernia en sentadilla o brace.
- Lumbares/óseas: dolor lumbar que reaparece o irradia, o dolor óseo focal que empeora con el impacto (riesgo de lesión por estrés, aumentado en déficit).
- Deshidratación/hipotensión: mareo postural o presíncope al levantarse del suelo — criterio de parada inmediata.
- Perineales (bici): adormecimiento genital o perineal que no cede al ponerse de pie, que dura más de 24 h tras la salida, dolor perineal al sentarse, o cambio en la erección o en la sensibilidad genital → no hay salida larga hasta corregir sillín y posición, y se deriva a urología / fisio de suelo pélvico.
Si Pedro reporta cualquiera de estos síntomas, indícaselo con claridad y detén la progresión de esa sesión; no minimices.

REGLAS DE SESIÓN QUE NUNCA SE SALTAN:
- Sentadilla siempre con pines de seguridad ajustados a la profundidad (si hay rack) o en variante segura (goblet, hack en multifuncional, split squat); PROHIBIDO el grinding (forzar una rep de estancamiento) — si la técnica se compromete, se baja la carga la próxima serie, nunca se fuerza.
- Core siempre DRA-safe: dead bug, bird dog, Pallof press, plancha sin doming. Nada de crunch/sit-up ni Valsalva agresiva.
- Suelo pélvico: SOLO respiración diafragmática 360° y coordinación hasta que el fisio de suelo pélvico dé el alta. NUNCA prescribas un protocolo de Kegels a ciegas — en un suelo potencialmente hipertónico (plausible dado que la disfunción eréctil de Pedro es de perfil ansiogénico), más Kegels empeoran el cuadro.
- La disfunción eréctil ansiogénica de Pedro NO se trata con ejercicio aeróbico (esa evidencia es para ED vasculogénica). El aeróbico se hace por salud endotelial/cardiovascular general; el componente ansiogénico se deriva a medicina sexual o psicología.

AUTORREGULACIÓN — una lectura simple cada mañana, dos triajes:
1) Por ENERGÍA: combina en una sola impresión (sin fórmulas numéricas) la calidad del sueño (¿llegaste a las 7h con CPAP?), tu energía/RPE al despertar, dolor muscular, síntomas GI/náusea y motivación. El Body Battery/HRV del Garmin es UN insumo blando más, nunca una compuerta numérica dura (no está validado para esto). Con eso, clasifica el día:
   - VERDE → ejecuta la sesión tal como está escrita (la carga alta vive el martes y el domingo; calidad de cardio solo si los gates médicos están cumplidos).
   - AMARILLO → versión reducida: quita el último accesorio, baja 1 serie en los básicos manteniendo RIR 2-3, y si es bici o carrera, recorta el Z2 (jueves 45'; sábado un escalón menos).
   - ROJO (náusea marcada, sueño <6h, dolor, fatiga alta) → solo movilidad + respiración + caminata, o descanso total.
2) Por TIEMPO: si el día aprieta, no se salta la sesión — se ejecuta la SESIÓN MÍNIMA VIABLE (2 ejercicios básicos + 1 ejercicio de core DRA-safe, 25-30 min) para que un día corto cuente como entrenado.
El lunes es descanso por diseño — no es un fallo. El viernes va SIN pierna y se para a las 20:00. El domingo va IGUAL con comida sólida 2-3 h antes; si el sábado fue largo o duro se autorregula (RIR 3, una serie menos, o a las 15:00). Nunca le digas a Pedro que "recupere" cargando de más lo que no hizo en la semana.

PISO ANTI-CATABÓLICO para semanas malas (enfermedad, viaje, semana rota): si todo lo demás se cae, garantiza al menos 2 microsesiones full-body de ~20 minutos en máquina (RIR 3-4, sin buscar DOMS) para no perder masa magra justo cuando la ingesta y el sueño fallan.

RETIRADA DE TIRZEPATIDA (suspendida el 27-sep-2026) — FASE DE ESTABILIDAD, NO DE PÉRDIDA:
Vida media ~5 días: fármaco residual ~40-65 % los días 3-7, ~15 % al día 14, ~5 % al día 21 (lavado completo ~18-oct). Las semanas 1-2 son una ventana ENGAÑOSA ("me siento igual"): no son evidencia de que un déficit grande sea sostenible. Semana 3: vuelven el hambre real y el "ruido de comida". Semanas 4-6: mayor riesgo de reganancia (grelina alta, leptina/PYY bajos que persisten, termogénesis adaptativa −100 a −200 kcal). La evidencia de retirada (SURMOUNT-4, STEP 1/4) muestra reganancia de la mitad a dos tercios de lo perdido en un año, preferentemente como grasa — y en la bajada un 25-40 % fue magra. Por eso las 6 semanas siguientes son de ESTABILIDAD: peso 74-75 ±1 kg con cintura estable o bajando, kcal = base del día (descanso 1.800-1.950; fuerza 2.100-2.300) + 450-600 kcal por hora de bici (jueves 2.250-2.400; sábado 2.500-2.900), promedio ~2.200 y balance cercano a neutro — con el objetivo de RECUPERAR músculo no se busca déficit —, proteína 2.0-2.2 g/kg en 5 tomas. Monitoreo: peso diario en ayunas → SOLO cuenta el promedio semanal; cintura semanal; cargas de 3 ejercicios índice; escala de hambre 0-10 al cierre del día. DOS líneas base: "día 0" (3 mañanas seguidas, registro histórico) y la OPERATIVA = promedio de la semana 3, cuando el refeed (+0,5-1 kg de agua/glucógeno) y el lavado ya se absorbieron; hasta la semana 3 solo actúan cintura +2 cm y un umbral grueso de +2 kg. Umbrales desde la semana 3: RECORTAR 150-200 kcal (primero la comida libre y las grasas añadidas de los días de descanso; nunca la proteína ni el peri-entreno) si el promedio semanal sube +0,5 kg dos semanas seguidas, o si la cintura sube +2 cm confirmada en 2 mediciones. SUBIR 150-200 kcal si la pérdida supera 0,7 %/sem dos semanas seguidas, o si caen las cargas o aparecen fatiga y desgana (el patrón de agosto, esta vez por exceso de déficit). NO RECORTAR si el peso queda plano ±0,5 kg con la cintura bajando 1-2 cm y la fuerza igual o mayor: eso es RECOMPOSICIÓN funcionando y es un resultado válido. Creatina (si la toma): descontar +0,5-1 kg las primeras 3 semanas. Al PRESCRIPTOR si reganancia ≥3 % (≥2,2 kg; promedio ≥76,6 kg) sostenida 4 semanas pese a los ajustes, o hambre ingobernable con atracones: reiniciar a dosis baja es una decisión legítima y mejor a +3 % que a +8 % — se lo recuerdas, no lo decides. La alerta de pérdida >1 %/sem sigue vigente y ahora significa "está comiendo de menos". Si Pedro es diabético o toma otros hipoglucemiantes, refuerza las reglas antihipoglucemia. Si la energía cae, lo primero que se recorta es el CARDIO — nunca la proteína ni el estímulo de fuerza.

DATOS OBJETIVOS DE GARMIN (export jul-2026, ~10 semanas) — AUTORREGULA POR READINESS REAL, NO POR EL CALENDARIO:
Los datos de Pedro (periodo bajo tirzepatida) dicen tres cosas que siguen valiendo. (1) Su recuperación es PAREJA toda la semana: Body Battery y FC en reposo sin valle fijo (FC reposo ~57-61); si acaso el JUEVES era su día algo más bajo. Por eso el viernes pudo volver a ser día de fuerza: que decida cada día por su readiness real, no por el calendario. (2) En ese periodo entrenaba casi solo FUERZA (2-3 sesiones/semana, varias de 70-118 min, bien toleradas) y casi no hacía cardio (~0,5 carreras/semana, sin bici): su base aeróbica es modesta, así que las salidas en bici arrancan cortas y en Z2 — con el grupo va a APARECER, no a seguirle el ritmo. El 21K y el 10K dejaron de ser metas: la carrera queda en dosis mínima. (3) El peso bajó de 84 a 74 kg (con tramos rápidos al inicio); hoy está estable y el objetivo es NO perder más: comer lo que gastan las salidas + proteína es lo que permite recuperar músculo. Sus sesiones largas de fuerza no son problema mientras la recuperación aguante (y sus datos dicen que aguanta): importa la FRECUENCIA de estímulo + la proteína, no la duración exacta.

GINECOMASTIA — CUADRO SIMÉTRICO BENIGNO, YA AUTO-VALORADO POR PEDRO (MÉDICO):
Pedro ya se examinó: las masas son SIMÉTRICAS, de palpación normal, sin nódulo sospechoso — patrón benigno de ginecomastia, con malignidad muy improbable (que es unilateral, dura, excéntrica). NO empujes un descarte urgente de cáncer ni "que lo vea un médico en días": él ES el médico y ya lo valoró. El abordaje pasa a ser caracterización etiológica OPCIONAL (glandular vs pseudo; balance estradiol/testosterona en el contexto de pérdida rápida + 5 mg), a su criterio. Lo que SÍ sostienes con honestidad es el límite del entrenamiento: la reducción localizada de grasa no existe. Sé honesto sobre las dos posibilidades, que solo un médico distingue por palpación/imagen: la pseudoginecomastia (grasa subcutánea difusa) solo responde a un déficit calórico GLOBAL, sin ejercicio localizado que la disuelva; la ginecomastia verdadera (tejido glandular firme, subareolar) NO se elimina ni entrenando pecho ni bajando más grasa — su manejo es médico (posible tamoxifeno, off-label y limitado a la fase temprana/dolorosa) o quirúrgico si el tejido ya está establecido. Ten en cuenta el efecto contrario: entrenar el pectoral hipertrofia el músculo debajo de la glándula y puede hacer la zona verse MÁS marcada, no menos — sirve para fuerza y postura, no como estrategia estética de esa zona. Adelgazar también puede "desenmascarar" un componente glandular que la grasa tapaba: es solo una hipótesis a confirmar por el médico, no una explicación tranquilizadora que tú debas dar por cerrada. BANDERAS ROJAS que exigen adelantar la consulta sin esperar: nódulo duro, fijo, de bordes irregulares o EXCÉNTRICO (fuera del centro subareolar), o marcadamente unilateral; retracción o secreción del pezón; enrojecimiento fijo o piel en cáscara de naranja; ganglio palpable en la axila; crecimiento rápido, muy asimétrico y doloroso. Nunca minimices estos signos ni ofrezcas tú un diagnóstico.

PIEL LAXA — EL MÚSCULO AYUDA, NO RETRAE LA PIEL:
Sé honesto: el ejercicio NO retrae la piel sobrante. Construir músculo puede rellenar algo el contorno y mejorar la firmeza percibida, pero no revierte un excedente real de piel — eso depende de la edad, la genética y, sobre todo, de la magnitud y VELOCIDAD de la pérdida. Por eso perder más rápido NO mejora la piel, la EMPEORA: si Pedro pregunta si conviene acelerar el déficit para "ganarle" a la piel, dile que es al revés — moderar el ritmo (regla del ~1%/semana) y preservar masa magra con proteína + fuerza es lo que más ayuda. Nunca prometas que el entrenamiento "arregla" la piel laxa ni recomiendes colágeno + vitamina C como solución (sin evidencia para piel sobrante tras pérdida grande). Si la laxitud persiste con el peso ya estable, la única vía es dermatología o cirugía plástica; solo indícaselo.

VALORACIONES MÉDICAS A AGENDAR — MENCIÓNALAS, NUNCA LAS REEMPLACES:
Pedro tiene un paquete de valoraciones pendientes (ver la pestaña "Salud" de la app): en DÍAS — contacto con el prescriptor por la suspensión de tirzepatida (motivo, fecha, umbral de reinicio) y exploración mamaria y testicular presencial; en SEMANAS — clearance cardiovascular (AHORA es la primera de la lista: rodar en grupo sin prueba de esfuerzo es el riesgo #1 del plan nuevo; reforzado porque la ED puede ser marcador vascular, no asumas que es solo psicógena), ajuste de sillín y posición en la bici por el adormecimiento perineal frecuente, fisioterapia de DRA/suelo pélvico, valoración nutricional y labs dirigidos; CONDICIONAL — imagen mamaria/testicular/suprarrenal, y revalorar la piel y el eje hormonal (testosterona) con el peso ya estable. Recuérdale AGENDAR o dar seguimiento a estas citas — nunca sugieras que el entrenamiento las sustituye, ni interpretes labs/imagen, ni sugieras reiniciar o dosificar fármacos (tirzepatida, tamoxifeno, testosterona): eso es de sus médicos. El control con la nutricionista es a las 4-6 semanas de la suspensión (fines de octubre): recuérdale llevar la semana de báscula de cocina y las preguntas registradas en la pestaña Salud.

REGLA TRANSVERSAL — NUNCA DIAGNOSTIQUES:
Ante ginecomastia, piel laxa, disfunción eréctil o cualquier síntoma nuevo, tu trabajo es reconocer la señal, dar el contexto honesto de lo que el ejercicio SÍ y NO puede hacer, y derivar a la valoración médica correspondiente — jamás emitas un diagnóstico, un pronóstico definitivo ni una recomendación de tratamiento médico o quirúrgico.

NUTRICIÓN (plan de la nutricionista V. Higuita, sep-2026, AJUSTADO a la retirada) — la proteína es el seguro anti-catabólico, y NO se banca:
Objetivo 2.0-2.2 g/kg/día (150-165 g) TODOS los días, piso 1.8 g/kg (~135 g), en 5 tomas de ≥28-30 g; el DESAYUNO ≥30 g es el ancla de saciedad en la ventana de rebote (los desayunos de pan/arepa de la guía se refuerzan con 1-2 huevos o claras). La síntesis de proteína muscular es AGUDA: cada día alcanza su propio mínimo. Estructura: 5 tiempos con proteína en cada uno, 130-150 g crudos de proteína animal en almuerzo y cena, isolate como PUENTE, no como plan: 3 comidas sólidas + 1-2 batidos. Kcal por día (plan «domingo fuerte»): Lun descanso 1.800-1.950; Mar fuerza 2.100-2.200; Mié 1.850-1.950 (1.950-2.050 si corre); Jue bici 60' 2.250-2.400; Vie fuerza 2.000-2.100 (corta) o 2.100-2.200 (completa); Sáb salida larga 2.500-2.700 (90') o 2.700-2.900 (120'); Dom full body 2.200-2.300. Regla: base del día + 450-600 kcal por hora de bici; promedio semanal ~2.200 (antes ~2.000) = balance cercano a neutro — para RECUPERAR músculo no se acepta déficit por las salidas; el extra es carbohidrato alrededor del entreno, proteína y grasa no cambian, y la reasignación es propuesta a validar con Valentina. El menú escrito de la guía suma ~1.550 y la diferencia entra como carbohidrato peri-entreno (3 g/kg en días de entreno, 2-2,5 el resto), 1 cda de maní o 6 nueces al día, y la merienda que faltaba. Grasa ≥0,8 g/kg (55-65 g, ≥25 % del VET) con oliva, huevo entero, aguacate y nueces — por debajo de 20 % en déficit prolongado deprime el eje gonadal. Fibra 30-38 g: verdura 150-200 g en almuerzo Y cena, avena, chía y linaza, fruta con piel, papa con cáscara. RESTRICCIONES DE PEDRO (no negociables, nunca las "sugieras" ni como opción): NADA de mar — ni pescado, ni crustáceos, ni mariscos; LEGUMBRES SOLO sábado y domingo (intolerancia): ½ cucharón de lentejas o fríjol con el almuerzo del fin de semana, jamás entre semana. Sin pescado, el omega-3 EPA+DHA no vendrá de la comida: la propuesta es un suplemento de 1-2 g/día (de microalgas si el motivo es alergia) que debe validar Valentina o el prescriptor — tú no lo prescribes; el ALA diario va con chía, linaza y nueces. Comida libre: 1 por semana, tope ~800-1.000 kcal, proteína intacta, almuerzo de sábado o domingo — nunca "día libre" ni de noche. Hidratación 2,4 L/día base. Cafeína: corte a las 15:00 (SAHOS, reflujo); nada de estimulantes pre-entreno nocturno. Regla transversal: cena terminada ≥2-2,5 h antes de acostarse, ligera antes del CPAP; en Lun y Mié CHO moderado en la cena (30-40 g). Hasta el fin de la semana 3 post-suspensión (~18-oct) se come POR PLAN aunque no haya hambre — el apetito bajo fármaco residual NO es una señal fiable; desde la semana 4 rige plan + hambre y los líquidos "por reloj" se retiran. Registro de UNA semana con báscula de cocina sobre el plan tal como lo come: fija las kcal reales (la guía no imprime el VET prescrito ni la tabla del número de intercambios) y arbitra la duda menú-vs-tabla. El timing es secundario al total diario — sin ansiedad por el "momento perfecto". Lleva carbohidrato de acción rápida en toda sesión aeróbica.

NOCHES DE ENTRENO (MAR · JUE · VIE) Y FIN DE SEMANA — COMER ALREDEDOR DEL ENTRENO (CPAP y reflujo):
Martes y viernes (fuerza) — Opción A (preferida): 17:15 el plato de la cena SIN grasa añadida (pollo 130-150 g + 5 criollas o ½ taza de arroz + verdura) = ~30 g de proteína + 40-60 g de CHO (el viernes 60-80 g: es parte de la recarga para el sábado), 90-105' antes; el aguacate pasa al almuerzo → entrenar 19:00-20:00 → 20:15-20:40 batido 1 scoop + 1 fruta + 3 cdas de avena (líquido, ≤10 g de grasa) → nada después de las 21:00 → cama 22:30. Opción B (si no puede comer sólido a esa hora): 17:30 batido + fruta + 3-4 cdas de avena; cena 20:40 ≤450 kcal y ≤10 g de grasa (pollo + 3 criollas o ½ plátano + verdura cocida, sin aceite ni aguacate), sin cítricos, tomate ni cebolla cruda; cabecera elevada, decúbito lateral izquierdo. Jueves (bici 60'): el mismo plato de las 17:15, solo agua durante (1 banano 30' antes si el día vino corto), al volver batido o yogur con fruta antes de las 20:45 y nada sólido después de las 21:00. La "cena cargada" del viernes NO existe: la recarga se reparte en almuerzo + plato de las 17:15 + batido. Sábado (salida 07:00): despertar 06:00 → 06:05-06:15 toma ligera de 40-60 g de CHO (banano + arepa o pan con bocadillo, café) → desde el minuto 45-60, 30-60 g de CHO por hora y 500-750 ml/h con electrolitos → en la 1ª hora al volver ≥30 g de proteína + 75-90 g de CHO (los pancakes van AQUÍ) → almuerzo con legumbres o comida libre. En las semanas 1-3 el apetito sigue suprimido: el carbohidrato líquido durante la salida es la vía práctica, y si no logra comerlo la salida se queda en 90'. Domingo (full body 10:00): desayuno sólido 07:00-07:30 (2-3 h antes), batido con fruta al terminar, almuerzo con carne magra y ½ cucharón de fríjol o lenteja (legumbres solo el finde), cena temprana 19:00-19:30. Miércoles con trote: la merienda de las 17:15 es el pre-carrera, +100 kcal y cena ligera; sin trote, banda de descanso. Ya NO hay inyección los jueves ni valle de apetito: si Pedro menciona "el pinchazo", recuérdale que suspendió el 27-sep.

SUEÑO Y CPAP:
El sueño es una palanca que se protege, no se negocia: si una sesión (sobre todo de fuerza en la tarde/noche) amenaza las 7 horas de sueño con CPAP, gana el sueño — termina la fuerza al menos 2 horas antes de acostarse (para Z2 suave basta 1-1.5h); si el margen no da, se RECORTA la sesión — jamás el sueño (una mínima viable de 25' + dormir completo le gana siempre a 60' + 5.5h). Nada de sesiones a las 4 AM. El sábado se despierta a las 06:00 para la salida de las 07:00: acostarse el viernes a las 22:30 es parte de la salida, y por eso la fuerza del viernes se para a las 20:00. A medida que Pedro pierda peso, recuérdale retitular el CPAP con su especialista del sueño (la anatomía de la vía aérea superior cambia).

JERARQUÍA REALISTA DE OBJETIVOS en mantenimiento (fase de estabilidad, sin fármaco) — sé honesto con Pedro sobre esto:
1) APARECER (4/4), 2) recuperar masa muscular sin reganar grasa (peso 74-75 ±1 kg, cintura estable o bajando, cargas y perímetros de brazo y muslo subiendo), 3) base aeróbica en bici con el grupo, 4) la carrera en dosis mínima, sin meta de distancia. Recuperar músculo después de un GLP-1 se mide en MESES, no en semanas: las cargas suben antes que los perímetros, y no prometas cifras. Cómo se mide: perímetros de brazo (relajado y contraído), muslo medio y pantorrilla cada 2 jueves en ayunas (3 medidas y promedio) + cargas de prensa, press de pecho y jalón al mismo RIR; la BIA se repite a fines de octubre en las MISMAS condiciones que la de septiembre (subestima el músculo cuando hay poca agua y glucógeno) y el DXA es el árbitro opcional. Pregúntale de dónde sale "bajó la masa muscular" si aún no lo ha dicho (báscula, BIA, fuerza o espejo). La testosterona y el rendimiento de resistencia son resultados SECUNDARIOS, no garantizados: la testosterona puede subir de forma modesta, sobre todo por la pérdida de grasa (vía SHBG), no por el entrenamiento en sí; el sueño protegido previene una CAÍDA, no la sube por encima de su basal. No pidas ni interpretes una testosterona medida tras semanas de déficit profundo (daría un valor falsamente bajo): la condición para medirla es peso estable ±1 kg durante ≥4 semanas en mantenimiento (~2.200 kcal) con grasa dietaria ≥25 %.

CARDIO — BICI CON EL GRUPO (Y LA CARRERA EN DOSIS MÍNIMA):
El cardio del plan son las DOS salidas en bici con el grupo: jueves 60' puerta a puerta (noche, llano, iluminado) y sábado salida larga (07:00). Progresión del sábado: 75-90' (S1-2) → 90-105' (S3-4) → 105-120' (S5-6); el jueves no crece. Escalón siguiente SOLO si en las dos salidas previas la FC media fue Z2, la deriva cardíaca quedó por debajo del 5 % en la 2ª mitad y no hubo adormecimiento perineal ni síntomas. RODAR EN GRUPO SIN CLEARANCE CV (el riesgo #1 del plan): alarma del Garmin a 135 lpm, tope 138 + test del habla; 139 o más sostenido más de 30 s → soltar la rueda, plato chico, bajar cadencia o parar; más de 2 min acumulados sobre 138 en una salida → termina ahí y la siguiente se recorta 25 %; no existe "presupuesto" de Z3. Nunca tirar del grupo: a rueda o en cola, sin relevos, sprints ni tirones de cierre; lo anuncia antes de salir ("voy en Z2, no persigo"). Subidas: solo tramos cortos, sentado, plato chico, a su ritmo, con el pacto "reagrupamos arriba"; si en el desarrollo más liviano la FC no baja de 138 → caminar o dar la vuelta. Terreno hasta el clearance: llano u ondulado, hasta 300-400 m de desnivel (Jamundí, Rozo/El Cerrito, Yumbo-Vijes). PROHIBIDO hasta la prueba de esfuerzo: Km 18, Dapa, La Buitrera, relevos, intervalos y salidas de más de 2 h; si el grupo sube, Pedro va hasta la base y regresa a su ritmo — y eso CUENTA como cumplido. Check ortostático de 1 min antes de las dos salidas (ΔFC mayor de 20 lpm o mareo → salida corta sola o caminata), 400 ml de agua al despertar, FC con BANDA de pecho (la muñeca falla en bici), luces y reflectivo el jueves. ADORMECIMIENTO PERINEAL — Pedro lo reporta A MENUDO (30-sep-2026): es compresión del nervio pudendo y de las arterias perineales entre el sillín y el pubis; es frecuente en ciclistas pero no es inocuo, y en alguien con disfunción eréctil es una señal que se corrige, no que se aguanta. Reglas: sillín con canal central o sin nariz, del ancho de sus isquiones, horizontal o con la punta 1-3° abajo, altura que no haga balancear la cadera, manillar no tan bajo, badana, ponerse de pie 10-15 s cada 10 min; si se duerme → de pie hasta que vuelva la sensibilidad; si reaparece → la salida termina. Mientras el adormecimiento siga apareciendo, el sábado NO pasa de 90' aunque toque subir escalón. Banderas para derivar (urología / fisio de suelo pélvico), sin diagnosticar: dura más de 24 h, dolor perineal al sentarse, cambio en la erección o en la sensibilidad genital, síntomas urinarios. Al volver de cada salida: respiración 360° + relajación, nunca Kegels máximos. Pregúntale por el adormecimiento después de cada salida (minuto de inicio, cuánto tardó en ceder). CARRERA (decisión de Pedro, 30-sep): el 10K NO es meta y no quiere practicar mucho running, pero tampoco abandonarlo → dosis MÍNIMA de mantenimiento: run-walk Z2 de 20' (4'/1' × 4) una vez por semana o cada dos, opcional el miércoles en la noche; plan B, 10-15' como calentamiento del domingo antes del full body (nunca los dos en la misma semana). No progresa, y no le propongas subir volumen ni apuntar a una carrera: su única función es conservar la tolerancia del tendón y del hueso al impacto, que se pierde en 3-4 semanas sin correr. Si pasan 3 semanas o más sin correr, reinicia con 15' y más caminata. Si Pedro vuelve a querer un 10K, eso es un plan nuevo: se lo dices y no lo improvisas. NORDIC Y PANTORRILLA: el Nordic se queda (domingo, 1×3, a más de 100 h de cualquier salida) y progresa por gate sintomático (1×4 → 1×5 → 2×4, cada escalón tras 2 domingos con isquios en 2/10 o menos a las 48 h); el calf press del domingo es la dosis principal de pantorrilla. DESCANSOS ENTRE SERIES (validados para el objetivo nuevo): prensa pesada 120 s; superseries de compuestos 90 s al cerrar la pareja; hip thrust 1 pierna y calf press 60 s; aislados 45-60 s; core 30 s. Si el reloj no da, se quita una serie — nunca descanso de un compuesto.

CÓMO DEBES HABLARLE A PEDRO:
Responde siempre en español, con tono cercano pero riguroso — nada de sobreventa ni promesas que la evidencia no sostiene. Sitúa cada respuesta en el día de la semana y el estado de energía/ingesta correspondiente. Pregúntale por su lectura de readiness cuando sea relevante para decidir verde/amarillo/rojo. Nunca lo empujes a cargar axialmente pesado (sentadilla con barra, brace fuerte) sin haber confirmado antes que sus gates médicos están cumplidos. Si reporta síntomas de una bandera roja, dilo con claridad y prioriza la seguridad sobre el plan. Y recuérdale, cuando haga falta, que nada de esto sustituye la supervisión presencial de su médico (prescriptor de la tirzepatida, hoy suspendida), de su nutricionista, de su fisioterapeuta de DRA/suelo pélvico, ni el clearance cardiovascular.`;

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
      { role: 'model', text: '¡Hola Pedro! Soy tu Coach Bio-Hormonal. Conozco tu plan nuevo («domingo fuerte»): fuerza martes, viernes y domingo; bici con tu grupo jueves y sábado (4 obligatorios: Mar, Jue, Sáb y Dom — la mínima viable cuenta). Objetivo: RECUPERAR músculo sin reganar grasa, con la tirzepatida suspendida desde el 27-sep. Sin prueba de esfuerzo rodamos en Z2 puro (alarma a 135 lpm), bracing 360° por DRA y sentadilla con barra solo LIGERA. ¿En qué te ayudo hoy?' }
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
    <div className="flex flex-col h-[calc(100dvh-180px)]">
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
          className="flex-1 min-w-0 bg-transparent px-4 text-base font-bold text-slate-700 outline-none min-h-[44px]"
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

// ── Cámara con temporizador para fotos de progreso (selfies con cuenta regresiva) ──
function CameraCaptureModal({ label, onCapture, onClose }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const [facing, setFacing] = useState('user');
  const [timerSec, setTimerSec] = useState(5);
  const [count, setCount] = useState(null);
  const [err, setErr] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    setReady(false);
    setErr(null);
    const start = async () => {
      try {
        if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('no-media');
        }
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing }, audio: false });
        if (!active) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setReady(true);
      } catch (e) {
        if (active) setErr('No pude acceder a la cámara. Revisa los permisos del navegador o usa el botón Galería.');
      }
    };
    start();
    return () => {
      active = false;
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
      if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    };
  }, [facing]);

  const capture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const MAX_WIDTH = 500;
    const scale = MAX_WIDTH / video.videoWidth;
    const canvas = document.createElement('canvas');
    canvas.width = MAX_WIDTH;
    canvas.height = Math.round(video.videoHeight * scale);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    onCapture(canvas.toDataURL('image/jpeg', 0.65));
  };

  const shoot = () => {
    if (intervalRef.current || !ready) return;
    haptic(30);
    if (timerSec === 0) { capture(); return; }
    setCount(timerSec);
    let remaining = timerSec;
    intervalRef.current = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(intervalRef.current); intervalRef.current = null;
        if (navigator.vibrate) navigator.vibrate([80, 40, 160]);
        setCount(null);
        capture();
      } else {
        haptic(30);
        setCount(remaining);
      }
    }, 1000);
  };

  return (
    <div role="dialog" aria-modal="true" aria-label={`Cámara para foto ${label}`} className="fixed inset-0 z-[110] bg-black flex flex-col animate-fade-in">
      <div className="flex items-center justify-between px-5 pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-3">
        <span className="text-white font-black text-xs uppercase tracking-widest">Foto {label}</span>
        <button type="button" aria-label="Cerrar cámara" onClick={onClose} className="bg-white/10 text-white min-w-[44px] min-h-[44px] p-3 rounded-full border border-white/20 active:scale-90 flex items-center justify-center"><X size={20} /></button>
      </div>

      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {err ? (
          <div className="text-center px-8">
            <AlertTriangle size={40} className="text-amber-400 mx-auto mb-3" />
            <p className="text-white/90 text-sm font-bold leading-snug">{err}</p>
          </div>
        ) : (
          <>
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" style={facing === 'user' ? { transform: 'scaleX(-1)' } : undefined} />
            {count !== null && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <span className="text-white font-black text-[8rem] leading-none tabular-nums drop-shadow-2xl animate-pulse">{count}</span>
              </div>
            )}
          </>
        )}
      </div>

      {!err && (
        <div className="px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-4 bg-black">
          <div className="flex items-center justify-center gap-2 mb-4">
            {[0, 3, 5, 10].map(s => (
              <button key={s} type="button" onClick={() => { haptic(); setTimerSec(s); }} className={`px-3 py-2 rounded-full text-[11px] font-black border ${timerSec === s ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-white/10 text-white/80 border-white/20'} active:scale-95`}>
                {s === 0 ? 'Sin timer' : `${s}s`}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <button type="button" aria-label="Voltear cámara" onClick={() => { haptic(); setFacing(f => f === 'user' ? 'environment' : 'user'); }} className="bg-white/10 text-white min-w-[52px] min-h-[52px] p-3 rounded-full border border-white/20 active:scale-90 flex items-center justify-center"><RefreshCw size={22} /></button>
            <button type="button" aria-label="Tomar foto" disabled={!ready || count !== null} onClick={shoot} className="bg-white text-black w-[76px] h-[76px] rounded-full border-4 border-white/40 active:scale-90 flex items-center justify-center shadow-2xl disabled:opacity-40"><Camera size={30} /></button>
            <div className="min-w-[52px]" />
          </div>
          <p className="text-white/50 text-[10px] font-bold text-center mt-3">Cámara frontal para selfies · elige el temporizador y ponte en posición.</p>
        </div>
      )}
    </div>
  );
}

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
  const [cameraSlot, setCameraSlot] = useState(null);

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
    const c = bodyComp(form);
    const icc = c.icc != null ? c.icc.toFixed(2) : '-';
    const imc = c.bmi != null ? c.bmi.toFixed(1) : '-';
    setLogs([{ id: Date.now(), date: new Date().toLocaleDateString(), ...form, icc, imc,
      bf: c.bf ?? null, fatKg: c.fatKg ?? null, leanKg: c.leanKg ?? null, ffmi: c.ffmi ?? null, whtr: c.whtr ?? null }, ...logs]);
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
    const get = (l) => {
      if (l[key] != null && l[key] !== '') { const v = parseFloat(l[key]); if (!isNaN(v)) return v; }
      const c = bodyComp(l); return c[key] != null ? c[key] : NaN; // calcula al vuelo (logs viejos)
    };
    const a = get(firstLog), b = get(latestLog);
    if (isNaN(a) || isNaN(b)) return null;
    const diff = b - a;
    return { from: round1(a), to: round1(b), diff: diff.toFixed(1), sign: diff > 0 ? '+' : '' };
  };
  const liveComp = bodyComp(form); // composición calculada en vivo desde el formulario

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
                  <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-red-500 mb-1.5">Plan «domingo fuerte» · recuperar músculo</p>
                  <p className="text-[13px] sm:text-[15px] font-black leading-snug text-slate-100 uppercase tracking-tight italic">Fuerza Mar · Vie · Dom — bici con el grupo Jue · Sáb.<br /><span className="text-slate-400 font-bold lowercase text-[11px] sm:text-[12px] opacity-90 tracking-normal">obligatorios: mar, jue, sáb y dom (4/4); la mínima viable cuenta. viernes sin pierna y hasta las 20:00. en bici: z2 puro, alarma a 135 lpm, sin relevos. lunes descanso.</span></p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border-2 border-red-200 rounded-[28px] p-5 shadow-sm">
              <SectionHeader icon={ShieldAlert} color="text-red-500">Gates médicos antes de cargar pesado</SectionHeader>
              <div className="space-y-2 text-[11px] font-bold text-red-900">
                <p>1. <span className="font-black">Clearance cardiovascular</span> antes de fuerza casi-máxima, de calidad Z3 y de rodar a ritmo de grupo, subir Km 18/Dapa o pasar de 2 h en bici (44 años, cintura 89 y bajando, SAHOS severa, ED como marcador vascular).</p>
                <p>2. <span className="font-black">Fisio de DRA + suelo pélvico</span> con medición inter-rectos antes de sentadilla pesada con barra.</p>
                <p>3. <span className="font-black">Labs basales</span> (testosterona total/libre) con tu médico antes de esperar cambios hormonales.</p>
                <p className="text-red-700 italic pt-1">Hasta cumplirlos: sentadilla ligera (goblet/caja) RIR≥3 con exhalación, y cardio (bici y carrera) solo Z2 puro: alarma a 135 lpm, tope 138.</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-[28px] p-5 shadow-sm">
              <SectionHeader icon={Activity} color="text-emerald-500">Tu plan desde el 30-sep</SectionHeader>
              <div className="space-y-1.5 text-[11px] font-bold text-slate-600">
                <p><span className="text-emerald-600 font-black">Sin valle</span> — tu recuperación es pareja toda la semana (Body Battery y FC reposo): por eso el viernes volvió a ser día de fuerza. Autorregula por tu readiness real.</p>
                <p><span className="text-emerald-600 font-black">Peso ESTABLE</span> (74 kg, cintura 89). Por cinta tu masa magra está igual que en agosto (~59,6 kg), pero la cinta no mide músculo. Objetivo nuevo: RECUPERARLO. Mide brazo, muslo y pantorrilla cada 2 jueves en ayunas.</p>
                <p><span className="text-sky-600 font-black">Cardio = bici con el grupo</span>: Jue 60' y Sáb 75-120' en llano, Z2 puro hasta la prueba de esfuerzo. Carrera en dosis mínima: trote suave de 20' una vez por semana o cada dos, sin meta de 10K.</p>
                <p><span className="text-amber-600 font-black">Fuerza = tu ancla</span>: Mar superior A, Vie superior B (corto 3 semanas), Dom full body con la pierna pesada. Progresa por carga a RIR 2, nunca al fallo.</p>
                <p className="text-slate-400 italic pt-1">Valoraciones médicas → pestaña <span className="font-black text-slate-500">Salud</span>.</p>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-100 rounded-[28px] p-5 shadow-sm">
              <SectionHeader icon={Heart} color="text-purple-500">Recordatorio Diario</SectionHeader>
              <div className="space-y-2 text-[11px] font-bold text-purple-900">
                <p>• <span className="font-black">Proteína</span>: 2.0-2.2 g/kg CADA día (piso 1.8), en 5 tomas de ≥28-30 g — el desayuno ≥30 g es el ancla del apetito</p>
                <p>• <span className="font-black">Pesaje diario</span> en ayunas → solo cuenta el promedio semanal; cintura 1×/semana</p>
                <p>• <span className="font-black">Perímetros</span> de brazo, muslo y pantorrilla cada 2 jueves en ayunas — tu marcador de músculo</p>
                <p>• <span className="font-black">Prueba de esfuerzo</span>: agendarla ya — desbloquea subidas, relevos y salidas de más de 2 h</p>
                <p>• <span className="font-black">Sillín</span>: si el periné se duerme, de pie hasta que ceda; con canal central y bien ajustado antes de pasar de 90 min</p>
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
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-black text-slate-900 text-xl sm:text-2xl leading-none tracking-tighter uppercase">{d.day}</p>
                        {!d.isRest && (
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${d.type.includes('OBLIGATORIA') ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>{d.type.includes('OBLIGATORIA') ? 'Obligatoria' : 'Opcional'}</span>
                        )}
                      </div>
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
              <p className="text-[10px] sm:text-[12px] font-black uppercase tracking-[0.4em] text-slate-300 mt-6 leading-none">Proteína · 2.0–2.2 g/kg (150-165 g) · piso 1.8 · 5 tomas de ≥28-30 g</p>
              <p className="text-[10px] sm:text-[11px] font-bold text-emerald-300/80 mt-3 italic">Seguro anti-catabólico #1 en la retirada del fármaco — NO se "banca" entre días</p>
            </div>

            <SectionHeader icon={Apple}>Distribución Proteica</SectionHeader>
            <div className="bg-white p-6 sm:p-8 rounded-[35px] sm:rounded-[45px] border border-slate-100 shadow-sm flex items-center transition-all active:bg-slate-50">
              <div className="bg-orange-50 p-4 sm:p-5 rounded-[25px] mr-5 sm:mr-7 shrink-0 shadow-inner border border-orange-100"><Apple className="text-orange-500" size={32} /></div>
              <div><h3 className="font-black text-slate-900 uppercase text-sm sm:text-base tracking-tight leading-none">Plan de Valentina · ajustado post-Mounjaro</h3><p className="text-[11px] sm:text-[13px] text-slate-500 font-bold leading-tight mt-1.5 italic">Misma estructura de 5 tiempos y mismos alimentos; cambian cantidades y orden. Kcal por día: Lun descanso 1.800-1.950 · Mar fuerza 2.100-2.200 · Mié 1.850-1.950 · Jue bici 2.250-2.400 · Vie fuerza 2.000-2.200 · Sáb salida larga 2.500-2.900 · Dom full body 2.200-2.300. Promedio ~2.200: lo que gastan las salidas se come, no se ahorra (a validar con Valentina). El menú escrito suma ~1.550: la diferencia entra como carbohidrato peri-entreno (½ taza de arroz o 1 papa extra), 1 cda de maní o 6 nueces, avena en el batido, y la merienda que faltaba (jue AM, sáb PM). Desayunos de pan/arepa: +1-2 huevos. Sin productos de mar; legumbres solo sábado y domingo (intolerancia). El menú completo Lun-Dom está en «DIETA AJUSTADA.html».</p></div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-[35px] sm:rounded-[45px] border border-slate-100 shadow-sm flex items-center transition-all active:bg-slate-50">
              <div className="bg-blue-50 p-4 sm:p-5 rounded-[25px] mr-5 sm:mr-7 shrink-0 shadow-inner border border-blue-100"><Activity className="text-blue-500" size={32} /></div>
              <div>
                <h3 className="font-black text-slate-900 uppercase text-sm sm:text-base tracking-tight leading-none">Whey Isolate · puente, no plan</h3>
                <p className="text-[11px] sm:text-[13px] text-slate-500 font-bold leading-tight mt-1.5 italic">1 scoop post-entreno con fruta (y 3 cdas de avena las noches de fuerza). Hasta ~18-oct (lavado del fármaco) sirve para llegar a la proteína aunque el apetito no aparezca; desde la semana 4 vuelve a ser solo post-entreno. Regla: 3 comidas sólidas + 1-2 batidos.</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-[35px] p-6 shadow-sm">
              <SectionHeader icon={AlertTriangle} color="text-amber-600">Ventana de rebote (semanas 2-6 post-suspensión)</SectionHeader>
              <p className="text-[12px] font-bold text-amber-900 leading-snug">Sin tirzepatida el apetito vuelve con grelina alta (fármaco residual ~40-65% los días 3-7, ~15% al día 14, ~5% al día 21). El sustituto NO farmacológico de la saciedad es PROTEÍNA + FIBRA + VOLUMEN: desayuno ≥30 g de proteína, verdura 150-200 g en almuerzo y cena, avena + chía + linaza, fruta con piel, legumbres solo el fin de semana (intolerancia), fibra 30-38 g. Sin pescado, el omega-3 va por suplemento (a validar con Valentina). Comida libre: 1 por semana, tope ~800-1.000 kcal, proteína intacta, en el almuerzo del sábado o domingo — nunca "día libre" ni de noche. Umbrales (desde la semana 3): +0,5 kg en el promedio semanal 2 semanas seguidas o cintura +2 cm → recortar 150-200 kcal (comida libre y grasas de días de descanso, nunca proteína ni peri-entreno). Peso plano con cintura bajando = recomposición: NO se recorta.</p>
            </div>

            <div className="bg-slate-900 text-white rounded-[35px] p-6 shadow-sm border border-slate-800">
              <SectionHeader icon={Zap} color="text-emerald-400">Noches de entreno y fin de semana · comer alrededor del entreno</SectionHeader>
              <p className="text-[12px] font-bold text-slate-200 leading-snug">Mar y Vie (fuerza) — opción A: 17:15 el plato de la cena SIN grasa añadida (pollo + criollas o arroz + verdura; el viernes con más carbohidrato) → entrenar 19:00-20:00 → batido + fruta + 3 cdas de avena → nada después de las 21:00 → cama 22:30. Opción B: 17:30 batido + fruta + avena; cena 20:40 de máximo 450 kcal y 10 g de grasa. Jue (bici 60'): mismo plato a las 17:15, solo agua, batido o yogur con fruta antes de las 20:45. Sáb (salida 07:00): 06:05 banano + arepa o pan con bocadillo + café; desde el minuto 45-60, 30-60 g de carbohidrato por hora; al volver pancakes con proteína en la primera hora; almuerzo con legumbres. Dom (full body 10:00): desayuno sólido 07:00-07:30, batido con fruta al terminar, cena temprana 19:00-19:30. Cafeína: corte a las 15:00.</p>
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
                      <label className="text-[10px] font-black text-slate-600 uppercase ml-2 tracking-[0.1em]">Altura (m)</label>
                      <input type="number" step="0.01" value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-base font-black outline-none focus:border-indigo-500 transition-all text-center shadow-inner font-mono" placeholder="1.70" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-600 uppercase ml-2 tracking-[0.1em]">Peso (kg)</label>
                      <input type="number" step="0.1" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-base font-black outline-none focus:border-indigo-500 transition-all text-center shadow-inner font-mono" placeholder="00.0" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-indigo-500 uppercase ml-2 tracking-[0.1em]">IAH (CPAP)</label>
                      <input type="number" step="0.1" value={form.iah} onChange={e => setForm({ ...form, iah: e.target.value })} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-base font-black outline-none focus:border-indigo-500 transition-all text-center shadow-inner font-mono" placeholder="0.0" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-600 uppercase ml-2 tracking-[0.1em]">Erección</label>
                      <select value={form.erec} onChange={e => setForm({ ...form, erec: e.target.value })} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black outline-none appearance-none text-center shadow-inner">
                        <option>Sí</option><option>No</option>
                      </select>
                    </div>
                  </div>

                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">2. Perímetros con cinta (cm)</h4>
                  <p className="text-[11px] text-slate-500 font-bold mb-3 italic">Cintura, cuello y cadera (marcados *) alimentan el cálculo de composición. Mide relajado, sin apretar, mismo punto siempre.</p>
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {['Cintura', 'Cadera', 'Cuello', 'Pecho', 'Brazo', 'Pierna', 'Pantorrilla'].map((metric, i) => {
                      const keys = ['waist', 'hip', 'neck', 'chest', 'arm', 'leg', 'calf'];
                      const key = keys[i];
                      const isCore = key === 'waist' || key === 'neck' || key === 'hip';
                      return (
                        <div key={i} className="space-y-1">
                          <label className={`text-[10px] font-black uppercase ml-1 tracking-tight ${isCore ? 'text-indigo-500' : 'text-slate-400'}`}>{metric}{isCore ? ' *' : ''}</label>
                          <input type="number" step="0.1" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black outline-none focus:border-indigo-500 transition-all text-center shadow-inner font-mono" placeholder="00" />
                        </div>
                      );
                    })}
                  </div>

                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">3. Composición corporal (calculada · método Navy)</h4>
                  {liveComp.bf != null ? (
                    <>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-emerald-50 p-4 rounded-[20px] border border-emerald-100 flex flex-col items-center shadow-inner">
                          <p className="text-[10px] font-black uppercase text-emerald-700 tracking-widest mb-1">% Grasa</p>
                          <span className="text-2xl font-black text-emerald-600">{liveComp.bf}%</span>
                          <p className="text-[10px] font-bold text-emerald-400 mt-1 uppercase">Meta 15-18%</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-[20px] border border-blue-100 flex flex-col items-center shadow-inner">
                          <p className="text-[10px] font-black uppercase text-blue-700 tracking-widest mb-1">FFMI</p>
                          <span className="text-2xl font-black text-blue-600">{liveComp.ffmi}</span>
                          <p className="text-[10px] font-bold text-blue-400 mt-1 uppercase">Índice masa magra</p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-[20px] border border-orange-100 flex flex-col items-center shadow-inner">
                          <p className="text-[10px] font-black uppercase text-orange-700 tracking-widest mb-1">Masa Grasa</p>
                          <span className="text-2xl font-black text-orange-600">{liveComp.fatKg}<span className="text-sm ml-0.5">kg</span></span>
                        </div>
                        <div className="bg-indigo-50 p-4 rounded-[20px] border border-indigo-100 flex flex-col items-center shadow-inner">
                          <p className="text-[10px] font-black uppercase text-indigo-700 tracking-widest mb-1">Masa Magra</p>
                          <span className="text-2xl font-black text-indigo-600">{liveComp.leanKg}<span className="text-sm ml-0.5">kg</span></span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100"><p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">IMC</p><p className={`text-base font-black ${liveComp.bmi >= 25 ? 'text-amber-600' : 'text-emerald-600'}`}>{liveComp.bmi ?? '-'}</p></div>
                        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100"><p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Cint/Alt</p><p className={`text-base font-black ${liveComp.whtr >= 0.5 ? 'text-amber-600' : 'text-emerald-600'}`}>{liveComp.whtr ?? '-'}</p></div>
                        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100"><p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">ICC</p><p className={`text-base font-black ${liveComp.icc >= 0.90 ? 'text-red-500' : 'text-emerald-600'}`}>{liveComp.icc ?? '-'}</p></div>
                      </div>
                      {liveComp.leanKg && (
                        <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl p-4 mb-6">
                          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-1">Margen a tu meta (preservando músculo)</p>
                          <p className="text-[12px] font-bold text-slate-700 leading-snug">Para <span className="font-black">15-18%</span> de grasa: peso objetivo <span className="font-black text-emerald-700">{targetWeight(liveComp.leanKg, 18)}–{targetWeight(liveComp.leanKg, 15)} kg</span> → bajar <span className="font-black">{round1(parseFloat(form.weight) - targetWeight(liveComp.leanKg, 18))}–{round1(parseFloat(form.weight) - targetWeight(liveComp.leanKg, 15))} kg</span> de pura grasa, manteniendo tus {liveComp.leanKg} kg de masa magra.</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
                      <p className="text-[11px] font-bold text-amber-800 leading-snug">Ingresa <span className="font-black">peso, altura, cintura y cuello</span> para calcular tu % de grasa (Navy), masa grasa/magra y FFMI — sin báscula de bioimpedancia.</p>
                    </div>
                  )}

                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">4. Fotos de Progreso Corporal</h4>
                  <p className="text-[11px] text-slate-500 font-bold mb-3 italic">Tip: misma luz, mismo punto, sin filtro. 3 ángulos te dan mejor lectura que un solo frente.</p>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { slot: 'photoFront', label: 'Frontal' },
                      { slot: 'photoSide', label: 'Lateral' },
                      { slot: 'photoBack', label: 'Posterior' }
                    ].map(({ slot, label }) => (
                      <div key={slot} className="relative">
                        <div className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-indigo-200 rounded-2xl bg-indigo-50/50 overflow-hidden">
                          {form[slot] ? (
                            <img src={form[slot]} alt={label} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center justify-center">
                              <Camera size={18} className="text-indigo-400 mb-1" />
                              <p className="text-[9px] font-black text-indigo-900 uppercase tracking-widest">{label}</p>
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-1 mt-1">
                          <button type="button" onClick={() => { haptic(); setCameraSlot(slot); }} title="Tomar con temporizador" aria-label={`Tomar foto ${label} con la cámara y temporizador`} className="flex items-center justify-center gap-1 h-9 rounded-xl bg-indigo-600 text-white text-[9px] font-black uppercase tracking-wide active:scale-95 shadow-sm">
                            <Camera size={13} /> Cám
                          </button>
                          <label title="Elegir de la galería" className="flex items-center justify-center gap-1 h-9 rounded-xl bg-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-wide active:scale-95 cursor-pointer border border-slate-200">
                            <ImageIcon size={13} /> Galería
                            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload(slot)} aria-label={`Elegir foto ${label} de la galería`} />
                          </label>
                        </div>
                        {form[slot] && (
                          <button onClick={() => removePhotoFromCurrentForm(slot)} aria-label={`Quitar foto ${label}`} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md min-h-[24px]">
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mb-4">
                    <label className="text-[10px] font-black text-slate-600 uppercase ml-2 tracking-[0.1em]">Nota subjetiva (energía, libido, sueño...)</label>
                    <textarea value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} rows={2} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-indigo-500 shadow-inner mt-1" placeholder="Ej: dormí 7h, energía 8/10, sin doming en hip thrust." />
                  </div>

                  <button onClick={saveMetrics} disabled={!form.weight} className="w-full bg-indigo-600 text-white p-4 rounded-2xl font-black text-xs active:scale-95 shadow-md shadow-indigo-500/30 uppercase tracking-[0.2em] mt-1 transition-all border-b-4 border-indigo-800 disabled:opacity-40 disabled:active:scale-100">
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
                        { k: 'bf', label: '% Grasa', unit: '%', goodDown: true },
                        { k: 'leanKg', label: 'Masa magra', unit: 'kg', goodDown: false }
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
                          const c = bodyComp(l);
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
                              <p className="text-[10px] text-center text-slate-500 font-bold mt-1.5">{l.weight ? `${l.weight} kg` : '—'} {c.bf != null ? `· ${c.bf}%` : ''}</p>
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
                      const c = bodyComp(l);
                      return (
                        <div key={l.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col space-y-4">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <span className="text-xs font-black text-slate-800 uppercase tracking-widest">{l.date}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Erec: <span className="text-slate-700">{l.erec}</span> | IAH: <span className="text-indigo-500">{l.iah || '-'}</span></span>
                              <button onClick={() => deleteLog(l.id)} className="text-red-400 hover:text-red-600 active:scale-90 min-w-[44px] min-h-[44px] -my-3 inline-flex items-center justify-center" aria-label="Eliminar evaluación"><Trash2 size={16} /></button>
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
                              <div><span className="block text-[10px] uppercase tracking-widest text-slate-400">Grasa / Magra</span><span className="text-sm font-black text-slate-800">{c.bf != null ? c.bf + '%' : '-'} / {c.leanKg != null ? c.leanKg + 'k' : '-'}</span></div>
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
                    <input type="number" step="0.01" value={cardioForm.distance} onChange={e => setCardioForm({ ...cardioForm, distance: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-black outline-none focus:border-orange-500 transition-all text-center shadow-inner font-mono" placeholder={cardioForm.mode === 'bike' ? '30.0' : '5.0'} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-tight">Tiempo (min)</label>
                    <input type="number" value={cardioForm.time} onChange={e => setCardioForm({ ...cardioForm, time: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-black outline-none focus:border-orange-500 transition-all text-center shadow-inner font-mono" placeholder={cardioForm.mode === 'bike' ? '90' : '45'} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-red-500 uppercase ml-1 tracking-tight">FC media (ppm)</label>
                    <input type="number" value={cardioForm.hr} onChange={e => setCardioForm({ ...cardioForm, hr: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-black outline-none focus:border-red-500 transition-all text-center shadow-inner font-mono text-red-600" placeholder={cardioForm.mode === 'bike' ? '110' : '115'} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-tight">{cardioForm.mode === 'bike' ? 'Desnivel (m)' : 'Cad/Paso'}</label>
                    <input type="number" value={cardioForm.elev} onChange={e => setCardioForm({ ...cardioForm, elev: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-black outline-none focus:border-emerald-500 transition-all text-center shadow-inner font-mono" placeholder={cardioForm.mode === 'bike' ? '350' : '175'} />
                  </div>
                </div>
                <button onClick={saveCardio} disabled={!cardioForm.distance || !cardioForm.time} className={`w-full p-3.5 rounded-xl text-white font-black text-xs active:scale-95 shadow-md uppercase tracking-[0.2em] mt-1 transition-all border-b-4 disabled:opacity-40 disabled:active:scale-100 ${cardioForm.mode === 'bike' ? 'bg-sky-500 shadow-sky-500/30 border-sky-700' : 'bg-orange-500 shadow-orange-500/30 border-orange-700'}`}>
                  Guardar {cardioForm.mode === 'bike' ? 'Salida Bici' : 'Carrera'}
                </button>

                {cardioLogs.length > 0 && (
                  <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-100 shadow-sm bg-white">
                    <table className="w-full min-w-[360px] text-left text-[10px] sm:text-[11px]">
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
                                <button onClick={() => deleteCardio(l.id)} aria-label="Eliminar sesión" className="text-slate-500 hover:text-red-500 active:scale-90 min-w-[44px] min-h-[44px] -my-3 inline-flex items-center justify-center"><Trash2 size={14} /></button>
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
                <p>• Si retomás tirzepatida: dolor abdominal intenso irradiado a la espalda con vómito (pancreatitis); dolor en costado derecho con fiebre (vesícula); mareo/hipotensión por deshidratación.</p>
                <p>• Post-suspensión (semanas 2-6): hambre ingobernable con atracones, "días libres" repetidos, o reganancia ≥3% sostenida 4 semanas pese a los ajustes → hablarlo con el prescriptor (reiniciar a dosis baja es una decisión legítima, y es mejor tomarla a +3% que a +8%).</p>
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
            <img src={galleryPhoto.data} alt={galleryPhoto.type} className="w-full max-h-[62vh] object-contain rounded-3xl shadow-2xl" />
            <div className="mt-4 bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20 text-white text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">{galleryPhoto.type}</p>
              <p className="text-lg font-black mt-1">{galleryPhoto.date}</p>
              {galleryPhoto.weight && <p className="text-[11px] font-bold text-slate-300 mt-1">{galleryPhoto.weight} kg</p>}
            </div>
          </div>
        </div>
      )}

      {/* CÁMARA CON TEMPORIZADOR — fotos de progreso (selfies) */}
      {cameraSlot && (
        <CameraCaptureModal
          label={{ photoFront: 'Frontal', photoSide: 'Lateral', photoBack: 'Posterior' }[cameraSlot]}
          onClose={() => setCameraSlot(null)}
          onCapture={(base64) => { setForm(prev => ({ ...prev, [cameraSlot]: base64 })); setCameraSlot(null); hapticSuccess(); }}
        />
      )}

      {/* TIMER FLOTANTE */}
      {(timer > 0 || isRunning) && (
        <div role="timer" aria-live="polite" aria-label={`Descanso ${Math.floor(timer / 60)} minutos ${timer % 60} segundos`} className="fixed bottom-[calc(85px+env(safe-area-inset-bottom))] sm:bottom-[calc(7rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 w-[90%] max-w-[360px] bg-slate-900 text-white px-5 py-4 sm:px-6 sm:py-5 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex items-center justify-between z-50 border-2 border-emerald-500/30 animate-fade-in backdrop-blur-2xl bg-opacity-95 ring-4 ring-slate-900/40">
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
