import React, { useState, useMemo, useEffect } from 'react';
import {
  BrowserRouter, Routes, Route, Link, NavLink, useNavigate, useParams, useLocation, Navigate
} from 'react-router-dom';
import {
  FileText, MapPin, ListChecks, Briefcase, ExternalLink, CheckCircle2, Circle,
  CreditCard, Smartphone, Shield, Car, Users, AlertTriangle, ChevronRight, ChevronLeft,
  Mountain, Plane, Wallet, Building2, Wifi, Phone, Filter, Sparkles,
  Tent, Waves, Landmark, Banknote, MessageCircle, Compass, Flag, X, Sun, ImageOff, Fish,
  Snowflake, Trees, GraduationCap, Bike, Wind, Calendar, Calculator, ShoppingBag,
  Package, Recycle, Laptop, Shirt, Ticket, Home, PiggyBank, Info, Clock, Star,
  Share2, Check, Sunrise, BookOpen, Newspaper
} from 'lucide-react';

function trackPageview(path) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({ event: 'pageview', page_path: path });
  }
}
function useDocumentTitle(title) {
  useEffect(() => { document.title = title ? `${title} · WHV Aotearoa` : 'WHV Aotearoa'; }, [title]);
}

/* ==================================================================== */
/* DATA — VISADO                                                        */
/* ==================================================================== */
const VISA_FASE1 = [
  { id: 'v1', text: 'Crear cuenta en RealMe / Immigration Online', required: true },
  { id: 'v2', text: 'Rellenar el formulario con tus datos y número/caducidad de pasaporte', required: true },
  { id: 'v3', text: 'Responder las preguntas de salud y antecedentes penales/carácter (preguntas dentro del formulario, no documentos a subir)', required: true },
  { id: 'v4', text: 'Pagar la tasa (~770 NZD, IVL incluido)', required: true },
];
const VISA_FASE2 = [
  { id: 'w1', text: 'Justificante de fondos: al menos 4.200 NZD (extracto bancario, de tarjeta, giro o cheques de viaje)', required: false, note: 'Solo si Immigration NZ te lo pide por email después de pagar.' },
  { id: 'w2', text: 'Billete de vuelta, o justificante de fondos para comprarlo', required: false, note: 'Igual que el anterior: condicional.' },
];
const VISA_FASE3 = [
  { id: 'e1', text: 'Pasaporte físico', required: true },
  { id: 'e2', text: 'El eVisa (impreso o en el móvil)', required: true },
  { id: 'e3', text: 'Seguro médico contratado', required: false, note: 'No es parte de la solicitud, pero te lo puede pedir el oficial de frontera.' },
  { id: 'e4', text: 'Formulario de Declaración de Viajero (NZTD) relleno online', required: true, note: 'Se puede rellenar desde 24h antes de tu vuelo.' },
];

/* ==================================================================== */
/* DATA — CIUDADES                                                      */
/* ==================================================================== */
const CITIES = [
  { id: 'auckland', name: 'Auckland', island: 'Isla Norte', icon: 'Building2', rentMin: 220, rentMax: 280,
    jobTypes: ['Hospitality', 'Oficinas', 'Construcción'], jobEase: 4, nightlife: 4,
    nightlifeTags: ['Rooftop bars', 'Ambiente internacional', 'Ciudad grande'],
    pros: ['Con diferencia el mayor volumen de ofertas de trabajo del país', 'Vuelos internacionales directos', 'Comunidad de mochileros enorme'],
    cons: ['El alquiler más caro de NZ', 'Tráfico y distancias largas', 'Mucha competencia por cada puesto'],
    mainJobs: 'Hostelería, retail, construcción, almacenes y logística, call centres.',
    bestSeason: 'Todo el año, evita el parón navideño si buscas oficina.',
    description: 'La ciudad más grande y multicultural de NZ. Mayor volumen de ofertas, a cambio del alquiler más caro del país.',
    community: ['Auckland (varios grupos, busca "Auckland Latinos" o "Auckland Jobs")', 'Grupos por barrio para piso compartido'] },
  { id: 'wellington', name: 'Wellington', island: 'Isla Norte', icon: 'Wind', rentMin: 200, rentMax: 260,
    jobTypes: ['Oficinas', 'Hospitality'], jobEase: 3, nightlife: 5,
    nightlifeTags: ['Capital cultural', 'Craft beer', 'Música en vivo'],
    pros: ['Vida cultural y hostelera de las mejores del país', 'Ciudad compacta', 'Ambiente creativo'],
    cons: ['Viento constante', 'Mercado laboral más pequeño que Auckland', 'Cuestas pronunciadas'],
    mainJobs: 'Hostelería y cafés, eventos y ferias, retail.',
    bestSeason: 'Octubre a abril.',
    description: 'La capital, compacta y con vida cultural que le queda grande a su tamaño.',
    community: ['Españoles en NZ (grupo general, activo aquí)', 'Grupos de eventos musicales de la capital'] },
  { id: 'queenstown', name: 'Queenstown', island: 'Isla Sur', icon: 'Mountain', rentMin: 250, rentMax: 320,
    jobTypes: ['Hospitality', 'Turismo'], jobEase: 4, nightlife: 5,
    nightlifeTags: ['Fiesta mochilera', 'Bares hasta tarde', 'Ambiente muy joven'],
    pros: ['Epicentro del turismo de aventura', 'Ambiente social intensísimo entre WHV', 'Naturaleza al lado de casa'],
    cons: ['El alojamiento más caro y difícil de encontrar de NZ', 'Pueblo saturado en temporada alta', 'Se come buena parte del sueldo'],
    mainJobs: 'Hostelería, hoteles, actividades de aventura, estaciones de esquí.',
    bestSeason: 'Doble temporada: jun-sep (esquí) y dic-mar (verano).',
    description: 'La capital del turismo de aventura del planeta. Curro casi todo el año gracias a su doble temporada.',
    community: ['Latinos en Queenstown (de los más activos del país)', 'Queenstown Hiking'] },
  { id: 'christchurch', name: 'Christchurch', island: 'Isla Sur', icon: 'Bike', rentMin: 170, rentMax: 220,
    jobTypes: ['Hospitality', 'Construcción', 'Oficinas'], jobEase: 4, nightlife: 3,
    nightlifeTags: ['En reconstrucción', 'Ambiente tranquilo', 'Vida universitaria'],
    pros: ['Ciudad plana, ideal en bici', 'Alquiler más barato que Auckland/Wellington', 'Mayor ciudad de la Isla Sur, mucha oferta'],
    cons: ['Vida nocturna floja', 'Todavía en reconstrucción en zonas', 'Menos "postal" que Queenstown'],
    mainJobs: 'Hostelería, construcción, retail, almacenes y logística.',
    bestSeason: 'Todo el año, dic-feb algo más flojo en construcción.',
    description: 'La ciudad más grande de la Isla Sur, totalmente plana. Alquiler razonable.',
    community: ['Latinos en Christchurch (dos grupos)', 'Grupos de recruitment agencies locales'] },
  { id: 'tauranga', name: 'Tauranga / Bay of Plenty', island: 'Isla Norte', icon: 'Sun', rentMin: 190, rentMax: 240,
    jobTypes: ['Agricultura', 'Hospitality'], jobEase: 3, nightlife: 2,
    nightlifeTags: ['Más playa que fiesta', 'Ritmo tranquilo'],
    pros: ['Corazón del kiwi de NZ', 'Playas cerca, buen clima', 'Coste de vida razonable'],
    cons: ['Muy dependiente de la temporada (mar-jun)', 'Vida nocturna limitada', 'Trabajo agrícola duro'],
    mainJobs: 'Packhouse y recolección de kiwi, hostelería costera.',
    bestSeason: 'Marzo-junio para cosecha; dic-feb para playa.',
    description: 'La capital no oficial del kiwi neozelandés. Fuera de temporada se enfría bastante.',
    community: ['Latinos en Tauranga (tres grupos)', 'Latinos en Te Puke'] },
  { id: 'nelson', name: 'Nelson / Blenheim', island: 'Isla Sur', icon: 'Trees', rentMin: 170, rentMax: 210,
    jobTypes: ['Agricultura', 'Hospitality'], jobEase: 3, nightlife: 2,
    nightlifeTags: ['Relajado', 'Comunidad de artesanos'],
    pros: ['Zona vinícola, trabajo casi todo el año', 'Clima más soleado de NZ', 'Alquiler bajo'],
    cons: ['Mercado laboral pequeño fuera de agricultura', 'Poca vida nocturna', 'Algo aislado sin vehículo'],
    mainJobs: 'Vendimia y poda en viñedos (Marlborough), hostelería, lúpulo.',
    bestSeason: 'Poda jun-ago, vendimia mar-may.',
    description: 'Zona vinícola por excelencia de NZ, con el clima más soleado del país.',
    community: ['Nelson y Tasman (grupo regional)', 'Latinos en Blenheim'] },
  { id: 'wanaka', name: 'Wanaka', island: 'Isla Sur', icon: 'Snowflake', rentMin: 230, rentMax: 290,
    jobTypes: ['Hospitality', 'Turismo'], jobEase: 4, nightlife: 4,
    nightlifeTags: ['Mini-Queenstown', 'Lago y montaña', 'Menos masificado'],
    pros: ['Mismo postal que Queenstown, más tranquilo', 'Doble temporada de demanda', 'Comunidad WHV muy unida'],
    cons: ['Caro para su tamaño', 'Menos oferta total', 'Alojamiento escaso en temporada alta'],
    mainJobs: 'Hostelería, turismo, esquí en Treble Cone y Cardrona.',
    bestSeason: 'Jun-oct (esquí) y dic-mar (verano).',
    description: 'La hermana pequeña y más tranquila de Queenstown.',
    community: ['Latinos en Wanaka (comunidad pequeña y unida)'] },
  { id: 'dunedin', name: 'Dunedin', island: 'Isla Sur', icon: 'GraduationCap', rentMin: 160, rentMax: 200,
    jobTypes: ['Hospitality', 'Retail'], jobEase: 3, nightlife: 4,
    nightlifeTags: ['Ciudad universitaria', 'Ambiente joven', 'Arquitectura victoriana'],
    pros: ['La más barata de las ciudades grandes', 'Buena vida social (Universidad de Otago)', 'Arquitectura única'],
    cons: ['Mercado laboral pequeño fuera del campus', 'Cuestas muy pronunciadas', 'Diferencia notable curso/vacaciones'],
    mainJobs: 'Hostelería y retail universitario, algo de packhouse cerca.',
    bestSeason: 'Marzo-noviembre (curso universitario).',
    description: 'Ciudad estudiantil con edificios históricos y la vida más barata entre las grandes.',
    community: ['Latinos Dunedin'] },
  { id: 'kaikoura', name: 'Kaikoura', island: 'Isla Sur', icon: 'Fish', rentMin: 180, rentMax: 230,
    jobTypes: ['Turismo', 'Hospitality'], jobEase: 2, nightlife: 2,
    nightlifeTags: ['Pueblo costero pequeño', 'Ambiente relajado'],
    pros: ['Avistamiento de ballenas todo el año', 'Focas y naturaleza al lado de casa', 'Pueblo tranquilo, poco masificado'],
    cons: ['Mercado laboral muy limitado', 'Poca vida nocturna', 'Depende del turismo estacional'],
    mainJobs: 'Turismo marino, hostelería costera, pesca.',
    bestSeason: 'Ballenas todo el año; verano (dic-mar) trae más curro.',
    description: 'Pueblo costero pequeño, famoso mundialmente por el avistamiento de ballenas todo el año.',
    community: ['Sin grupo específico — prueba en "Españoles en NZ" o Christchurch'] },
  { id: 'te-puke', name: 'Te Puke', island: 'Isla Norte', icon: 'Package', rentMin: 170, rentMax: 210,
    jobTypes: ['Agricultura'], jobEase: 3, nightlife: 1,
    nightlifeTags: ['Pueblo pequeño', 'Todo gira en torno al kiwi'],
    pros: ['Se le llama la "capital mundial del kiwi" — demanda brutal en temporada', 'Muy cerca de Tauranga y de la playa', 'Comunidad de temporeros grande y organizada'],
    cons: ['Casi nada de vida fuera de temporada', 'Pueblo muy pequeño', 'Trabajo físicamente duro'],
    mainJobs: 'Packhouses y recolección de kiwi — el epicentro absoluto de este cultivo en NZ.',
    bestSeason: 'Marzo-junio es la locura total; algo de poda en invierno.',
    description: 'Pueblo pequeño en Bay of Plenty, literalmente construido alrededor de la industria del kiwi.',
    community: ['Latinos en Te Puke (varios grupos activos en temporada)'] },
  { id: 'gisborne', name: 'Gisborne', island: 'Isla Norte', icon: 'Sunrise', rentMin: 170, rentMax: 210,
    jobTypes: ['Agricultura', 'Hospitality'], jobEase: 2, nightlife: 2,
    nightlifeTags: ['Surf', 'Relajado', 'Menos turístico'],
    pros: ['La primera ciudad del mundo en ver el amanecer cada día', 'Buenas olas para surf', 'Mucho menos masificado que otros puntos de la Isla Norte'],
    cons: ['Aislada — carreteras largas para llegar', 'Oferta de trabajo más limitada', 'Transporte público escaso'],
    mainJobs: 'Viñedos (Chardonnay) y cítricos, algo de hostelería.',
    bestSeason: 'Vendimia mar-abr; cítricos en invierno.',
    description: 'Ciudad costera del East Cape, la primera del mundo en recibir la luz del sol cada día.',
    community: ['Latinos en Gisborne (dos grupos)'] },
];
const CITY_ICONS = { Building2, Wind, Mountain, Bike, Sun, Trees, Snowflake, GraduationCap, Fish, Package, Sunrise };
const ISLANDS = ['Todas', 'Isla Norte', 'Isla Sur'];

/* ==================================================================== */
/* DATA — PRIMEROS 7 DÍAS                                               */
/* ============/* ==================================================================== */
const INSURANCE_OPTIONS = [
  { id: 'chapka', name: 'Chapka (CAP Working Holiday)', tag: 'La más completa', priceNote: 'La más cara de las cuatro, pero con más cobertura real',
    franquicia: 'No tiene — no pagas nada en cada consulta', cobertura: 'Cubre tu año en NZ + mini viajes de hasta 3 meses',
    deportesAventura: 'Incluidos sin coste adicional', asistencia: 'App 24/7, llamadas y teleconsulta en español', pagoAPlazos: 'Sí, sin intereses',
    extra: 'Paga el viaje ida y vuelta si hay que volver por enfermedad/fallecimiento de un familiar directo. Contratación flexible desde 3 meses.',
    link: 'https://www.chapkadirect.es' },
  { id: 'heymondo', name: 'Heymondo', tag: 'Buen equilibrio precio/cobertura', priceNote: 'Más barata que Chapka',
    franquicia: '100€ — si no usas el seguro sale más barato', cobertura: 'Larga estancia: 3 meses, renovable hasta 12',
    deportesAventura: 'Incluye la mayoría (surf, kayak...)', asistencia: 'Asistencia 24/7 + chat médico en español', pagoAPlazos: 'No especificado',
    extra: 'Repatriación y regreso anticipado por enfermedad o fallecimiento de familiar incluidos.', link: 'https://www.heymondo.com' },
  { id: 'iati', name: 'IATI', tag: 'Opción a comparar', priceNote: 'Precio competitivo, variable según plan',
    franquicia: 'Depende del plan', cobertura: 'Planes específicos para Working Holiday',
    deportesAventura: 'Según el plan — revisar antes', asistencia: 'Asistencia en español', pagoAPlazos: 'No especificado',
    extra: 'Una de las aseguradoras españolas más usadas por mochileros en general.', link: 'https://www.iatiseguros.com' },
  { id: 'safetywing', name: 'SafetyWing', tag: 'Gestión 100% en inglés', priceNote: 'De las más baratas',
    franquicia: 'Según el plan Nomad Insurance', cobertura: 'Pensado para nómadas de larga duración, global',
    deportesAventura: 'Cobertura limitada — revisar letra pequeña', asistencia: 'Solo en inglés', pagoAPlazos: 'Pago mensual, cancelable',
    extra: 'Ideal si te manejas bien en inglés y priorizas precio.', link: 'https://safetywing.com' },
];
const ESIM_TASK = { link: 'https://www.holafly.com', linkLabel: 'Ver eSIM de Holafly', steps: [
  { id: 'es1', text: 'Instala la eSIM antes de salir de España (se activa al llegar)' },
  { id: 'es2', text: 'Así tienes datos desde que aterrizas, sin depender del wifi del aeropuerto' },
  { id: 'es3', text: 'Úsala solo los primeros días — luego cambia a SIM/eSIM local, mucho más barata a largo plazo' },
]};
const SIMS = [
  { name: 'Spark', tag: 'Mejor cobertura rural · con eSIM', link: 'https://www.spark.co.nz', detail: 'La red con más alcance fuera de ciudades. Oficina en el aeropuerto de Auckland. Ofrece tanto SIM física como eSIM.' },
  { name: 'One NZ', tag: 'Buena cobertura urbana · con eSIM', link: 'https://one.nz', detail: 'Antes Vodafone NZ. Buenos planes prepago, también en eSIM.' },
  { name: '2degrees', tag: 'Normalmente el más barato · con eSIM', link: 'https://www.2degrees.nz', detail: 'Planes prepago muy competitivos, también en eSIM.' },
  { name: 'Skinny', tag: 'Sub-marca de Spark · con eSIM', link: 'https://www.skinny.co.nz', detail: 'Prepago muy simple y barato, corre sobre la red de Spark. También en eSIM.' },
];
const SIM_STEPS = [
  { id: 's1', text: 'Decide operador según tu plan (rural si harás roadtrip)' },
  { id: 's2', text: 'Compra la SIM al llegar o resérvala online' },
  { id: 's3', text: 'Actívala con tu pasaporte' },
  { id: 's4', text: 'Guarda el número — lo necesitarás para banco y trabajo' },
];
const IRD_TASK = { link: 'https://www.ird.govt.nz/managing-my-tax/ird-numbers/ird-numbers-for-individuals/new-arrival-to-new-zealand---ird-number-application', linkLabel: 'Solicitar el IRD number', steps: [
  { id: 'ird1', text: 'Ten a mano pasaporte y datos de tu eVisa' },
  { id: 'ird2', text: 'Entra en myIR (myir.ird.govt.nz), regístrate como "new arrival"' },
  { id: 'ird3', text: 'Rellena el formulario — no hace falta domicilio ni cuenta bancaria todavía' },
  { id: 'ird4', text: 'Confirmación: ~2 días laborables por email/SMS, hasta 10 por correo' },
]};
const INTL_CARDS = [
  { name: 'Wise', tag: 'Recompensa por registro', link: 'https://wise.com', detail: 'Con enlace de referido: transferencia de 500€ gratis o tarjeta física gratuita.' },
  { name: 'Revolut', tag: 'Cambio de divisa sin comisión', link: 'https://www.revolut.com', detail: 'Entre semana el cambio de divisa no tiene comisión.' },
];
const NZ_BANKS = [
  { name: 'BNZ', tag: 'Abrir con hostel como domicilio', link: 'https://www.bnz.co.nz/personal-banking/international/moving-to-new-zealand', detail: 'Se abre en 2 días usando la dirección de un hostel.' },
  { name: 'Kiwibank', tag: 'El más sencillo, dicen', link: 'https://www.kiwibank.co.nz', detail: 'Trámite online sencillo, exige visado de más de 1 año.' },
  { name: 'ANZ', tag: 'Mayor red de sucursales', link: 'https://www.anz.co.nz', detail: 'Fácil de abrir con Working Holiday.' },
  { name: 'ASB', tag: 'Mejor app', link: 'https://www.asb.co.nz', detail: 'No acepta hostel como prueba de domicilio.' },
  { name: 'Westpac', tag: 'Otra alternativa habitual', link: 'https://www.westpac.co.nz', detail: 'Requisitos varían por sucursal.' },
];
const BANK_STEPS = [
  { id: 'b1', text: 'Reúne pasaporte y eVisa escaneados' },
  { id: 'b2', text: 'Elige banco y rellena la solicitud (online o in situ)' },
  { id: 'b3', text: 'Si la abriste en remoto, verifica tu identidad en sucursal al llegar' },
  { id: 'b4', text: 'Una vez verificado, ya puedes usar la cuenta' },
];
const FREE_HOUSING = [
  { name: 'Kiwihousesitter', detail: 'Cuidando animales/casas a cambio de alojamiento gratis. De pago para todo el año, pero se amortiza rápido.' },
  { name: 'TrustedHousesitter', detail: 'Plataforma internacional de housesitting, también en NZ.' },
  { name: 'Pawshake', detail: 'Cuidado de mascotas puntual.' },
  { name: 'Workaway', detail: 'Voluntariado a cambio de alojamiento y comida.' },
];
const HOSTELS_AUCKLAND = [
  { name: 'Metro Adventure Backpacker', rating: '6.9', note: 'Correcto, dos cocinas (una muy grande). Buena opción sencilla.', warning: false },
  { name: 'Hobson Lodge', rating: '7.9', note: 'Bien valorado, buena zona.', warning: false },
  { name: 'Frienz Backpackers', rating: '7.8', note: 'Buena zona, buenas críticas.', warning: false },
  { name: 'Haka Lodge', rating: '—', note: 'Otra opción habitual entre mochileros.', warning: false },
  { name: 'TMACS Auckland', rating: 'Nuevo', note: 'Hostel reciente, todavía acumulando reseñas.', warning: false },
  { name: 'Surf \'N\' Snow Backpackers', rating: '6.4', note: 'Zona centro.', warning: false },
  { name: 'The Attic / Newton Lodge / Verandahs / YMCA', rating: '—', note: 'Otras opciones habituales.', warning: false },
  { name: 'Choise Backpackers', rating: '—', note: 'Buena ubicación pero malas críticas — revisa bien.', warning: true },
  { name: 'Silver Fern Backpackers', rating: '—', note: 'Malas críticas reportadas — mejor evitarlo.', warning: true },
];
const HOUSING_COMPARATORS = [
  { name: 'Hostelworld', detail: 'Compara precios de hostels, a veces cambia frente a la web oficial.' },
  { name: 'Cozycozy', detail: 'Comparador general de alojamiento.' },
  { name: 'Trade Me Flatmates', detail: 'Portal principal para piso compartido.' },
  { name: 'Airbnb', detail: 'Para estancias cortas o mientras encuentras algo estable.' },
];

/* ==================================================================== */
/* DATA — TRABAJO Y DINERO                                              */
/* ==================================================================== */
const JOB_SEARCH_METHODS = [
  { title: 'Grupos de Facebook', detail: 'Busca "(ciudad) + JOBS" — donde más rápido se mueve la oferta real.' },
  { title: 'Portales de empleo', detail: 'Generales y especializados por sector.' },
  { title: 'Agencias reclutadoras', detail: 'Gratis. Búscalas como "recruitment + ciudad" — ve en persona.' },
  { title: 'CV en mano', detail: 'Aunque no haya anuncio activo — muy efectivo en hostelería y campo.' },
];
const JOB_PORTALS_WHV = [
  { name: 'Backpacker Board', url: 'https://www.backpackerboard.co.nz', detail: 'Específica para gente con Working Holiday.' },
  { name: 'Picking Jobs', url: 'https://www.pickingjobs.com', detail: 'Granjas, épocas de cosecha y dirección.' },
  { name: 'Barcats', url: 'https://www.barcats.co.nz', detail: 'Bares y hostelería.' },
  { name: 'Seasonal Jobs', url: 'https://www.seasonaljobs.govt.nz', detail: 'Trabajo de temporada por región.' },
  { name: 'NZ Farm Source', url: 'https://www.nzfarmsource.co.nz', detail: 'Granjas y tambos.' },
  { name: 'Wine Jobs', url: 'https://www.winejobs.co.nz', detail: 'Vendimia, poda, cellar hand.' },
];
const JOB_PORTALS_GENERAL = [
  { name: 'Trade Me Jobs', url: 'https://www.trademe.co.nz/jobs', detail: 'El más usado, para cualquier tipo de trabajo.' },
  { name: 'Seek NZ', url: 'https://www.seek.co.nz', detail: 'El más grande, más formal — lo usa cualquier visado.' },
  { name: 'Indeed NZ', url: 'https://nz.indeed.com', detail: 'Generalista, buen volumen.' },
  { name: 'Jora', url: 'https://nz.jora.com', detail: 'Agregador de varios portales a la vez.' },
];
const RECRUITMENT_AGENCIES = [
  { name: 'Onestaff', detail: 'La más recomendada por la comunidad WHV.' },
  { name: 'AWF', detail: 'Agencia generalista con oficinas en varias ciudades.' },
  { name: 'Canstaff', detail: 'Especializada en industrial y construcción.' },
  { name: 'Tradestaff', detail: 'Enfocada en oficios y trabajo técnico.' },
  { name: 'Remarkable People', detail: 'Con base en Queenstown/Wanaka.' },
  { name: 'Tech5', detail: 'Más orientada a perfiles técnicos.' },
];
const JOB_TYPES_CALENDAR = [
  { crop: 'Kiwi (KIWIS)', timeline: [{ period: 'Jun–Sep', activity: 'Poda de invierno' }, { period: 'Oct–Ene', activity: 'Poda de verano y thinning (23–24 NZD/h)' }, { period: 'Mar–Jun', activity: 'Picking y packing' }] },
  { crop: 'Granjas lecheras (TAMBOS)', timeline: [{ period: 'Jul–Ago', activity: 'Calving — 24–25 NZD/h, 12h, sobre todo Isla Sur' }] },
  { crop: 'Orchard / fruta', timeline: [{ period: 'Todo el año, según región', activity: 'Packhouses: Eastpack, Trevelyans, Mpac, DMS' }] },
  { crop: 'Viñedos (Nelson/Marlborough)', timeline: [{ period: 'Jun–Ago', activity: 'Poda' }, { period: 'Mar–May', activity: 'Vendimia' }] },
];
const OTHER_JOB_TYPES = ['Campervan/car groomer', 'Cleaner / housekeeping', 'Dishwasher / kitchen hand', 'Extra en rodajes', 'Factory worker', 'Labourer de construcción', 'Waiter/waitress'];

/* ==================================================================== */
/* DATA — FURGO, TRANSPORTE Y VIDA                                      */
/* ==================================================================== */
const LEGAL_TO_DRIVE_CHECKLIST = [
  { id: 'ld1', text: 'WOF (ITV) en vigor', required: true },
  { id: 'ld2', text: 'REGO pagado y al día', required: true },
  { id: 'ld3', text: 'RUC pagado', required: false, note: 'Solo si tu vehículo es diésel.' },
  { id: 'ld4', text: 'Seguro contratado', required: false, note: 'No obligatorio, muy recomendable.' },
  { id: 'ld5', text: 'Certificado Self-Contained (Green Sticker)', required: false, note: 'Solo si quieres freedom camping.' },
];
const VAN_CHECKLIST_ITEMS = ['Self-Contained (imprescindible para dormir gratis en más sitios)', 'Cocina DENTRO del vehículo', 'Batería de servicio o placas solares', 'Nevera', 'Cama convertible en mesa/salón'];
const WHERE_TO_BUY_VAN = [
  { name: 'Grupos de Facebook de compra-venta', detail: 'Mucho movimiento, hay que moverse rápido.' },
  { name: 'Backpackerboard', detail: 'Anuncios específicos de furgos de mochilero.' },
  { name: 'Trade Me', detail: 'El "eBay" de NZ, también para vehículos.' },
  { name: '"Car fair" de los domingos', detail: 'Ferias presenciales — ves y pruebas varias el mismo día.' },
  { name: 'Travel Cars', detail: 'Otra opción habitual entre viajeros.' },
];
const VAN_RENTAL_COMPANIES = [
  { name: 'Jucy', link: 'https://www.jucy.co.nz', detail: 'De las más conocidas entre mochileros, furgos ya equipadas para dormir.' },
  { name: 'Travellers Autobarn', link: 'https://www.travellers-autobarn.co.nz', detail: 'Buena relación precio/equipamiento, varias categorías de furgo.' },
  { name: 'Go Rentals', link: 'https://www.gorentals.co.nz', detail: 'Otra opción habitual, coches y furgos.' },
];
const CAR_INSURERS = ['AA Insurance (la más común)', 'AMI', 'Cove Insurance', 'Tower Insurance'];
const FERRY_OPTIONS = [
  { name: 'Interislander', detail: 'Código AACARD10 (clientes de seguro AA).' },
  { name: 'Bluebridge', detail: 'Código TRAVELTIPS.' },
];
const SUPERMARKETS = ['Pack N Save (el más barato con diferencia)', 'New World', 'Countdown', 'The Warehouse', 'Chemist Warehouse (cosmética más barata)'];
const SECOND_HAND_SHOPS = ['Hospice', 'Op Shop', 'Red Cross', 'Salvation Army', 'Save Mart'];
const TECH_SHOPS = ['PB Tech (la más barata)', 'JB Hi-Fi', 'Noel Leeming', 'Harvey Norman', 'Dick Smith', 'The Warehouse'];
const SPORT_SHOPS = ['Kmart (barato, estilo Primark)', 'Torpedo7', 'Rebel Sport', 'Kathmandu', 'Mountain Warehouse', 'Cotton On'];
const ACTIVITY_DISCOUNTS = [
  { name: 'Bookme', detail: 'Muy usada para descuentos en actividades, restaurantes y entradas.' },
  { name: 'GetYourGuide', detail: 'Tours y actividades, descuentos frecuentes por código.' },
];
const SHIPPING_OPTIONS = [
  { name: 'PackSend / DHL / NZ Post', detail: 'Courier puerta a puerta con tracking. Desde ~85 NZD caja pequeña.' },
  { name: 'Eurosender / Eelway / SendMyBag', detail: 'Recogen en tu alojamiento, seguro básico incluido.' },
  { name: 'Zappy (comparador)', detail: 'Compara varias empresas de envío a la vez.' },
];
const SAVING_TIPS = [
  'Evita los "dairies" (tiendas de conveniencia) y gasolineras para hacer la compra — el mismo producto puede costar el doble que en el súper',
  'Compra marca blanca del propio súper (Pams, Countdown/Woolworths brand) — calidad similar, bastante más barata',
  'Lleva tu propia bolsa: en NZ las bolsas de plástico se cobran aparte en casi todas partes',
  'Cocina en casa y comparte cocina con tus compañeros de piso/furgo — comer fuera en NZ es caro incluso comparado con España',
  'El "Boxing Day" (26 de diciembre) es la gran fecha de rebajas del año — ropa y tecnología caen mucho de precio',
  'Compra la compra semanal en vez de a diario — reduce compras impulsivas y viajes de más',
];

/* ==================================================================== */
/* DATA — BLOG                                                          */
/* ==================================================================== */
const BLOG_POSTS = [
  {
    slug: 'furgoneta-vs-piso-nz',
    title: 'Furgoneta vs. piso en Nueva Zelanda: lo que de verdad cuesta cada opción',
    date: '2026-09-01',
    readTime: '5 min',
    excerpt: 'Comprar furgoneta y revenderla al final no es un capricho de mochilero — es matemática pura. Aquí el desglose real.',
    content: [
      'Una de las preguntas que más se repite es si compensa comprar una furgoneta de segunda mano y venderla al acabar el viaje, o si es mejor ahorrarse el lío y alquilar. La respuesta corta: depende casi por completo de cuánto tiempo vayas a estar.',
      'Cuando compras y revendes, el coste real no es el precio de compra — es la diferencia entre lo que pagas y lo que recuperas al vender, más seguro e ITV. Esa diferencia (la depreciación) es prácticamente fija, no proporcional al tiempo que uses el vehículo. Por eso cuanto más largo sea el viaje, más se diluye ese coste fijo entre más días de alojamiento gratis.',
      'Alquilar, en cambio, cobra un precio por día que ya incluye el beneficio de la empresa, el mantenimiento de toda su flota y los días que el vehículo pasa parado entre clientes. Ese margen se mantiene constante lo uses una semana o tres meses.',
      'La regla práctica que sigue la mayoría de mochileros: para menos de 3-4 semanas, alquilar suele compensar por la comodidad. Para 2-3 meses o más, comprar y revender gana por goleada económicamente.',
      'Un matiz importante: la fricción de comprar rápido y vender con prisa (por el vuelo ya reservado) hace que en viajes cortos pierdas más en términos relativos. Así que si tu viaje es de un mes justo, haz las cuentas con tu duración real antes de dar nada por hecho.',
    ],
  },
  {
    slug: 'errores-solicitud-working-holiday-visa',
    title: 'Los 3 errores más comunes al solicitar la Working Holiday Visa',
    date: '2026-09-01',
    readTime: '4 min',
    excerpt: 'La mayoría de dudas sobre el visado vienen de mezclar tres momentos distintos del proceso. Aquí se aclaran.',
    content: [
      'Error 1: pensar que hay que subir documentos al rellenar la solicitud. Para la inmensa mayoría de aplicantes españoles, el formulario online no pide subir ni pasaporte escaneado, ni justificante de fondos, ni nada parecido — solo datos y un pago. Si Immigration NZ necesita algo más, te lo pide después por email, de forma condicional.',
      'Error 2: no vigilar la fecha límite de entrada. La visa se aprueba con una ventana de 12 meses para entrar al país desde la aprobación — puedes tener la edad límite (30 años) en el momento de aplicar y entrar ya con 31, incluso cumplir años dentro de NZ, siempre que hayas entrado dentro de ese plazo.',
      'Error 3: no saber que existe la extensión de 3 meses. Si trabajas al menos 90 días (12 nóminas) en horticultura o viticultura durante tu WHV, puedes pedir 3 meses adicionales — pero solo si lo solicitas mientras tu visa original sigue vigente. Si estás haciendo temporada de fruta o viñedo, vale la pena llevar la cuenta de los días desde el principio.',
    ],
  },
  {
    slug: 'calendario-trabajo-temporada-nz',
    title: 'Calendario de trabajo de temporada en Nueva Zelanda: cuándo y dónde',
    date: '2026-09-01',
    readTime: '4 min',
    excerpt: 'Kiwis, tambos y viñedos no se mueven todos a la vez — aquí el mapa mes a mes para no llegar tarde a ninguna temporada.',
    content: [
      'El kiwi marca el calendario en Bay of Plenty y Te Puke: poda de invierno de junio a septiembre, poda de verano y "thinning" de octubre a enero (23-24 NZD/hora), y la gran temporada de picking y packing de marzo a junio.',
      'Las granjas lecheras (tambos) tienen su pico muy marcado: la temporada de "calving" es en julio-agosto, sobre todo en la Isla Sur, con jornadas de 12 horas pero un sueldo que compensa (24-25 NZD/hora).',
      'Los viñedos de Nelson y Marlborough dan trabajo casi todo el año si te mueves entre tareas: poda en invierno (junio-agosto) y vendimia en otoño (marzo-mayo).',
      'Un consejo que se repite mucho: aunque una web diga que la temporada "ya empezó" o "está a punto de acabar", casi siempre sigue habiendo sitio — son trabajos duros donde la gente se va cada semana, así que presentarse en persona cerca del final de temporada puede funcionar mejor de lo que parece sobre el papel.',
    ],
  },
];

/* ==================================================================== */
/* COMPONENTES REUTILIZABLES                                            */
/* ==================================================================== */
function Meter({ value, max = 5, color }) {
  return <div className="flex gap-1">{Array.from({ length: max }).map((_, i) => <span key={i} className="inline-block rounded-full" style={{ width: 9, height: 9, background: i < value ? color : 'var(--tussock)' }} />)}</div>;
}
function Stamp({ checked }) {
  if (!checked) return <Circle size={22} style={{ color: 'var(--tussock)' }} strokeWidth={2} />;
  return <span className="stamp-pop inline-flex items-center justify-center rounded-full" style={{ width: 26, height: 26, border: '2px solid var(--pounamu)', color: 'var(--pounamu)', transform: 'rotate(-9deg)' }}><CheckCircle2 size={16} strokeWidth={2.5} /></span>;
}
function SectionHeading({ eyebrow, title, icon: Icon }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex items-center justify-center rounded-lg" style={{ width: 40, height: 40, background: 'var(--pounamu)', color: 'var(--paper)' }}><Icon size={20} /></div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--glacier)', fontFamily: 'var(--font-mono)' }}>{eyebrow}</div>
        <h2 className="text-2xl leading-tight" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--ink)' }}>{title}</h2>
      </div>
    </div>
  );
}
function SubHeading({ icon: Icon, children }) {
  return <h3 className="text-sm font-bold uppercase tracking-wide mb-3 flex items-center gap-2" style={{ color: 'var(--pounamu-dark)', fontFamily: 'var(--font-mono)' }}><Icon size={15} /> {children}</h3>;
}
function MiniCheckItem({ item, checked, onToggle }) {
  return (
    <button onClick={onToggle} className="w-full text-left flex items-center gap-2 py-1.5">
      {checked ? <CheckCircle2 size={16} style={{ color: 'var(--pounamu)' }} className="shrink-0" /> : <Circle size={16} style={{ color: 'var(--tussock)' }} className="shrink-0" />}
      <span className="text-xs" style={{ color: 'var(--ink)', textDecoration: checked ? 'line-through' : 'none', opacity: checked ? 0.55 : 1 }}>{item.text}</span>
    </button>
  );
}
function TaskBlock({ icon, title, task, checked, toggle, prefix }) {
  return (
    <div className="rounded-xl p-4 mb-4" style={{ border: '1px solid var(--tussock)' }}>
      {title && <SubHeading icon={icon}>{title}</SubHeading>}
      <div className="mb-3">{task.steps.map((s) => <MiniCheckItem key={s.id} item={s} checked={!!checked[`${prefix}-${s.id}`]} onToggle={() => toggle(`${prefix}-${s.id}`)} />)}</div>
      <a href={task.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition hover:opacity-90" style={{ background: 'var(--track)', color: 'var(--paper)' }}>{task.linkLabel} <ExternalLink size={12} /></a>
    </div>
  );
}
function ProviderCard({ p }) {
  return (
    <div className="rounded-xl p-3" style={{ border: '1px solid var(--tussock)' }}>
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <span className="font-bold text-sm" style={{ color: 'var(--ink)' }}>{p.name}</span>
        <span className="text-xs px-2 py-0.5 rounded-full ml-auto" style={{ background: 'var(--tussock)', color: 'var(--pounamu-dark)' }}>{p.tag}</span>
      </div>
      <p className="text-xs mb-2" style={{ color: 'var(--glacier)' }}>{p.detail}</p>
      <a href={p.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--pounamu)' }}>Ir a la web <ExternalLink size={11} /></a>
    </div>
  );
}
function InfoList({ items }) {
  return <ul className="text-xs space-y-1.5" style={{ color: 'var(--ink)' }}>{items.map((it, i) => <li key={i} className="flex gap-2"><span style={{ color: 'var(--track)' }}>•</span><span><strong>{it.name}</strong>{it.detail ? ` — ${it.detail}` : ''}</span></li>)}</ul>;
}
function SimpleChipList({ items }) {
  return <div className="flex flex-wrap gap-1.5">{items.map((it, i) => <span key={i} className="text-xs px-2.5 py-1 rounded-full" style={{ border: '1px solid var(--tussock)', color: 'var(--ink)' }}>{it}</span>)}</div>;
}
function InfoBanner({ icon: Icon, children }) {
  return <div className="text-xs rounded-lg p-3 mb-4 flex items-start gap-2" style={{ background: 'rgba(62,124,166,0.08)', color: 'var(--glacier)' }}><Icon size={14} className="shrink-0 mt-0.5" /><span>{children}</span></div>;
}
function ShareButton({ title, text }) {
  const [copied, setCopied] = useState(false);
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title, text, url }); } catch (e) { /* cancelado */ }
    } else {
      try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (e) { /* noop */ }
    }
  };
  return (
    <button onClick={handleShare} className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition hover:opacity-90" style={{ background: 'var(--glacier)', color: 'var(--paper)' }}>
      {copied ? <Check size={13} /> : <Share2 size={13} />} {copied ? 'Enlace copiado' : 'Compartir'}
    </button>
  );
}
function Hub({ items, renderDetail, columns = 'sm:grid-cols-2', basePath }) {
  const { subId } = useParams();
  const navigate = useNavigate();
  const selected = items.find((i) => i.id === subId);
  if (selected) {
    return (
      <div>
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
          <button onClick={() => navigate(basePath)} className="inline-flex items-center gap-1 text-sm font-semibold transition hover:opacity-80" style={{ color: 'var(--pounamu)' }}><ChevronLeft size={16} /> Volver</button>
          <ShareButton title={selected.title} text={selected.teaser} />
        </div>
        {renderDetail(selected)}
      </div>
    );
  }
  return (
    <div className={`grid ${columns} gap-4`}>
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <button key={it.id} onClick={() => navigate(`${basePath}/${it.id}`)} className="text-left rounded-2xl p-5 transition hover:opacity-90" style={{ border: '1px solid var(--tussock)' }}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center justify-center rounded-lg" style={{ width: 36, height: 36, background: 'var(--tussock)', color: 'var(--pounamu-dark)' }}><Icon size={18} /></div>
              <ChevronRight size={18} style={{ color: 'var(--track)' }} />
            </div>
            <div className="font-bold text-base mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>{it.title}</div>
            <div className="text-xs" style={{ color: 'var(--glacier)' }}>{it.teaser}</div>
          </button>
        );
      })}
    </div>
  );
}

/* ==================================================================== */
/* VISADO                                                               */
/* ==================================================================== */
function VisaModule({ checked, toggle }) {
  useDocumentTitle('Visado Working Holiday Nueva Zelanda');
  const allItems = [...VISA_FASE1, ...VISA_FASE2, ...VISA_FASE3];
  const total = allItems.length;
  const done = allItems.filter((it) => checked[it.id]).length;
  const percent = Math.round((done / total) * 100);
  const requiredItems = allItems.filter((it) => it.required);
  const requiredDone = requiredItems.filter((it) => checked[it.id]).length;

  const Section = ({ title, items, note }) => (
    <div className="mb-6">
      <h3 className="text-sm font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--pounamu-dark)', fontFamily: 'var(--font-mono)' }}>{title}</h3>
      {note && <p className="text-xs mb-2" style={{ color: 'var(--glacier)' }}>{note}</p>}
      <div className="space-y-2">
        {items.map((item) => (
          <button key={item.id} onClick={() => toggle(item.id)} className="w-full text-left flex items-start gap-3 p-3 rounded-xl transition" style={{ background: checked[item.id] ? 'rgba(47,107,79,0.07)' : 'var(--paper)', border: '1px solid var(--tussock)' }}>
            <div className="mt-0.5 shrink-0"><Stamp checked={!!checked[item.id]} /></div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm" style={{ color: 'var(--ink)', textDecoration: checked[item.id] ? 'line-through' : 'none', opacity: checked[item.id] ? 0.6 : 1 }}>{item.text}</span>
                <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-full shrink-0" style={{ fontFamily: 'var(--font-mono)', background: item.required ? 'var(--track)' : 'var(--glacier)', color: 'var(--paper)' }}>{item.required ? 'Obligatorio' : 'Condicional'}</span>
              </div>
              {item.note && <p className="text-xs mt-1" style={{ color: 'var(--glacier)' }}>{item.note}</p>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div className="rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden" style={{ background: 'var(--pounamu)', color: 'var(--paper)' }}>
        <div className="contour-bg" />
        <div className="relative">
          <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--font-mono)', opacity: 0.85 }}>Etapa 01 · Visado</div>
          <h1 className="text-3xl md:text-4xl mb-3" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Working Holiday Visa — Nueva Zelanda</h1>
          <p className="text-sm md:text-base max-w-xl mb-5" style={{ opacity: 0.92 }}>Actualizado a septiembre de 2026. Todo el trámite empieza y termina en la web oficial de Immigration New Zealand.</p>
          <a href="https://www.immigration.govt.nz/work/working-holiday-visas/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm transition hover:opacity-90" style={{ background: 'var(--track)', color: 'var(--paper)' }}>
            <Plane size={16} /> Ir a la web oficial de Immigration NZ <ExternalLink size={14} />
          </a>
        </div>
      </div>
      <InfoBanner icon={Info}>Ojo: <strong>al rellenar la solicitud no se sube ningún documento</strong> para la mayoría de casos. Solo si Immigration NZ te lo pide por email después de pagar, tendrás que enviar justificantes.</InfoBanner>
      <div className="rounded-2xl p-5 mb-8 flex flex-col md:flex-row md:items-center gap-4" style={{ border: '1px solid var(--tussock)' }}>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1"><span className="text-sm font-bold" style={{ color: 'var(--ink)' }}>Progreso del checklist</span><span className="text-sm font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--pounamu)' }}>{percent}%</span></div>
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'var(--tussock)' }}><div className="h-full rounded-full transition-all" style={{ width: `${percent}%`, background: 'linear-gradient(90deg, var(--pounamu), var(--glacier))' }} /></div>
          <div className="text-xs mt-1" style={{ color: 'var(--glacier)' }}>{requiredDone} de {requiredItems.length} pasos obligatorios · se guarda solo en este dispositivo</div>
        </div>
        <div className="flex items-center gap-2 shrink-0" style={{ color: 'var(--pounamu)' }}><Mountain size={28} /><span className="text-xs font-bold uppercase" style={{ fontFamily: 'var(--font-mono)' }}>{percent === 100 ? 'Cumbre alcanzada' : 'Rumbo a NZ'}</span></div>
      </div>
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <Section title="Fase 1 · Rellenar la solicitud" note="Lo único obligatorio al aplicar." items={VISA_FASE1} />
        <Section title="Fase 2 · Si te lo piden después" note="Por email, tras pagar — no siempre ocurre." items={VISA_FASE2} />
        <Section title="Fase 3 · Al entrar al país" note="Nada que ver con la solicitud online." items={VISA_FASE3} />
      </div>
      <div className="rounded-2xl p-5" style={{ border: '1px solid var(--tussock)', background: 'rgba(225,127,53,0.06)' }}>
        <SubHeading icon={Sparkles}>Extensión de la visa (+3 meses)</SubHeading>
        <p className="text-sm mb-2" style={{ color: 'var(--ink)' }}>Si completas al menos <strong>90 días (12 nóminas) de trabajo estacional en horticultura o viticultura</strong>, puedes pedir 3 meses adicionales.</p>
        <ul className="text-xs space-y-1" style={{ color: 'var(--glacier)' }}>
          <li>• Cuenta: plantación, cosecha o embalaje de cultivos, o cultivo/cosecha de viñedos</li>
          <li>• NO cuenta: ganadería ni procesamiento de alimentos</li>
          <li>• Solicítalo mientras tu visa original siga vigente</li>
          <li>• Necesitas justificar el trabajo: cartas, nóminas o registros fiscales</li>
        </ul>
      </div>
    </div>
  );
}

/* ==================================================================== */
/* CIUDADES                                                             */
/* ==================================================================== */
function CityBanner({ city }) {
  const Icon = CITY_ICONS[city.icon] || Mountain;
  return (
    <div className="w-full h-40 rounded-xl flex flex-col items-center justify-center gap-1 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--pounamu), var(--glacier))', color: 'var(--paper)' }}>
      <div className="contour-bg" /><Icon size={30} className="relative" /><span className="text-xs font-bold uppercase relative" style={{ fontFamily: 'var(--font-mono)' }}>{city.name}</span>
    </div>
  );
}
function CityDetail({ city, onBack }) {
  useDocumentTitle(city.name);
  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
        <button onClick={onBack} className="inline-flex items-center gap-1 text-sm font-semibold transition hover:opacity-80" style={{ color: 'var(--pounamu)' }}><ChevronLeft size={16} /> Volver al comparador</button>
        <ShareButton title={city.name} text={`${city.name} — guía Working Holiday NZ`} />
      </div>
      <CityBanner city={city} />
      <div className="flex items-start justify-between mt-4 mb-2">
        <div><h1 className="text-3xl" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--ink)' }}>{city.name}</h1><span className="text-xs font-semibold uppercase" style={{ fontFamily: 'var(--font-mono)', color: 'var(--glacier)' }}>{city.island}</span></div>
        <div className="text-right"><div className="text-2xl" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--pounamu)' }}>{city.rentMin}–{city.rentMax}</div><div className="text-xs" style={{ color: 'var(--glacier)' }}>NZD/semana</div></div>
      </div>
      <p className="text-sm mb-6" style={{ color: 'var(--ink)' }}>{city.description}</p>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="rounded-xl p-4" style={{ border: '1px solid var(--tussock)' }}><div className="flex items-center gap-2 mb-2"><Briefcase size={15} style={{ color: 'var(--pounamu)' }} /><span className="text-xs font-bold uppercase" style={{ fontFamily: 'var(--font-mono)', color: 'var(--pounamu-dark)' }}>Trabajos principales</span></div><p className="text-sm" style={{ color: 'var(--ink)' }}>{city.mainJobs}</p></div>
        <div className="rounded-xl p-4" style={{ border: '1px solid var(--tussock)' }}><div className="flex items-center gap-2 mb-2"><Sun size={15} style={{ color: 'var(--track)' }} /><span className="text-xs font-bold uppercase" style={{ fontFamily: 'var(--font-mono)', color: 'var(--pounamu-dark)' }}>Mejor época para ir</span></div><p className="text-sm" style={{ color: 'var(--ink)' }}>{city.bestSeason}</p></div>
      </div>
      <div className="flex flex-wrap gap-6 mb-6">
        <div><div className="text-xs mb-1" style={{ color: 'var(--ink)' }}>Facilidad para encontrar curro</div><Meter value={city.jobEase} color="var(--pounamu)" /></div>
        <div><div className="text-xs mb-1" style={{ color: 'var(--ink)' }}>Vida nocturna / social</div><Meter value={city.nightlife} color="var(--track)" /></div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-6">{city.nightlifeTags.map((t) => <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ border: '1px solid var(--tussock)', color: 'var(--glacier)' }}>{t}</span>)}</div>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div><div className="font-bold text-sm mb-2" style={{ color: 'var(--pounamu)' }}>Pros</div><ul className="space-y-1.5 text-sm">{city.pros.map((p, i) => <li key={i} style={{ color: 'var(--ink)' }}>+ {p}</li>)}</ul></div>
        <div><div className="font-bold text-sm mb-2" style={{ color: 'var(--track)' }}>Contras</div><ul className="space-y-1.5 text-sm">{city.cons.map((p, i) => <li key={i} style={{ color: 'var(--ink)' }}>– {p}</li>)}</ul></div>
      </div>
      <div className="rounded-xl p-4" style={{ border: '1px solid var(--tussock)' }}>
        <div className="flex items-center gap-2 mb-2"><Users size={15} style={{ color: 'var(--pounamu)' }} /><span className="text-xs font-bold uppercase" style={{ fontFamily: 'var(--font-mono)', color: 'var(--pounamu-dark)' }}>Comunidad para unirte</span></div>
        <ul className="text-xs space-y-1" style={{ color: 'var(--ink)' }}>{city.community.map((c, i) => <li key={i}>• {c}</li>)}</ul>
      </div>
    </div>
  );
}
function CityModule() {
  useDocumentTitle('Dónde ir — comparador de ciudades');
  const { citySlug } = useParams();
  const navigate = useNavigate();
  const [jobFilter, setJobFilter] = useState('all');
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [islandFilter, setIslandFilter] = useState('Todas');
  const jobTypes = useMemo(() => { const set = new Set(); CITIES.forEach((c) => c.jobTypes.forEach((j) => set.add(j))); return ['all', ...Array.from(set)]; }, []);
  const filtered = useMemo(() => CITIES.filter((c) => {
    const jobOk = jobFilter === 'all' || c.jobTypes.includes(jobFilter);
    const islandOk = islandFilter === 'Todas' || c.island === islandFilter;
    const avg = (c.rentMin + c.rentMax) / 2;
    let budgetOk = true;
    if (budgetFilter === 'low') budgetOk = avg < 200;
    if (budgetFilter === 'mid') budgetOk = avg >= 200 && avg <= 250;
    if (budgetFilter === 'high') budgetOk = avg > 250;
    return jobOk && budgetOk && islandOk;
  }), [jobFilter, budgetFilter, islandFilter]);

  const selectedCity = CITIES.find((c) => c.id === citySlug);
  if (selectedCity) return <CityDetail city={selectedCity} onBack={() => navigate('/donde-ir')} />;

  return (
    <div>
      <SectionHeading eyebrow="Etapa 02 · Dónde ir" title="Comparador de ciudades y regiones" icon={MapPin} />
      <p className="text-sm mb-6 max-w-2xl" style={{ color: 'var(--glacier)' }}>Toca una ciudad para ver el detalle y su comunidad.</p>
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div className="flex items-center gap-2"><Compass size={15} style={{ color: 'var(--pounamu)' }} /><span className="text-xs font-bold uppercase" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}>Isla</span></div>
        <div className="flex flex-wrap gap-2">{ISLANDS.map((isl) => <button key={isl} onClick={() => setIslandFilter(isl)} className="px-3 py-1.5 rounded-full text-xs font-semibold transition" style={{ background: islandFilter === isl ? 'var(--track)' : 'var(--paper)', color: islandFilter === isl ? 'var(--paper)' : 'var(--ink)', border: '1px solid var(--track)' }}>{isl}</button>)}</div>
      </div>
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div className="flex items-center gap-2"><Filter size={15} style={{ color: 'var(--pounamu)' }} /><span className="text-xs font-bold uppercase" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}>Trabajo</span></div>
        <div className="flex flex-wrap gap-2">{jobTypes.map((jt) => <button key={jt} onClick={() => setJobFilter(jt)} className="px-3 py-1.5 rounded-full text-xs font-semibold transition" style={{ background: jobFilter === jt ? 'var(--pounamu)' : 'var(--paper)', color: jobFilter === jt ? 'var(--paper)' : 'var(--ink)', border: '1px solid var(--pounamu)' }}>{jt === 'all' ? 'Todos' : jt}</button>)}</div>
      </div>
      <div className="flex flex-wrap gap-4 mb-8 items-center">
        <div className="flex items-center gap-2"><Wallet size={15} style={{ color: 'var(--pounamu)' }} /><span className="text-xs font-bold uppercase" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}>Presupuesto / semana</span></div>
        <div className="flex flex-wrap gap-2">{[['all', 'Cualquiera'], ['low', '< 200 NZD'], ['mid', '200–250 NZD'], ['high', '> 250 NZD']].map(([key, label]) => <button key={key} onClick={() => setBudgetFilter(key)} className="px-3 py-1.5 rounded-full text-xs font-semibold transition" style={{ background: budgetFilter === key ? 'var(--glacier)' : 'var(--paper)', color: budgetFilter === key ? 'var(--paper)' : 'var(--ink)', border: '1px solid var(--glacier)' }}>{label}</button>)}</div>
      </div>
      {filtered.length === 0 && <div className="text-sm p-6 rounded-xl text-center" style={{ border: '1px dashed var(--tussock)', color: 'var(--glacier)' }}>Ninguna ciudad cumple los filtros — prueba a relajar alguno.</div>}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((c) => {
          const Icon = CITY_ICONS[c.icon] || Mountain;
          return (
            <button key={c.id} onClick={() => navigate(`/donde-ir/${c.id}`)} className="text-left rounded-2xl p-5 flex flex-col transition hover:opacity-90" style={{ border: '1px solid var(--tussock)' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2"><div className="flex items-center justify-center rounded-lg" style={{ width: 32, height: 32, background: 'var(--tussock)', color: 'var(--pounamu-dark)' }}><Icon size={16} /></div><div><h3 className="text-lg leading-tight" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--ink)' }}>{c.name}</h3><span className="text-xs font-semibold uppercase" style={{ fontFamily: 'var(--font-mono)', color: 'var(--glacier)' }}>{c.island}</span></div></div>
                <ChevronRight size={18} style={{ color: 'var(--track)' }} />
              </div>
              <div className="text-2xl mb-1" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--pounamu)' }}>{c.rentMin}–{c.rentMax} <span className="text-sm font-normal">NZD/sem</span></div>
              <div className="flex flex-wrap gap-1.5 my-3">{c.jobTypes.map((jt) => <span key={jt} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--tussock)', color: 'var(--pounamu-dark)' }}>{jt}</span>)}</div>
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between"><span className="text-xs" style={{ color: 'var(--ink)' }}>Facilidad para encontrar curro</span><Meter value={c.jobEase} color="var(--pounamu)" /></div>
                <div className="flex items-center justify-between"><span className="text-xs" style={{ color: 'var(--ink)' }}>Vida nocturna / social</span><Meter value={c.nightlife} color="var(--track)" /></div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-auto">{c.nightlifeTags.slice(0, 2).map((t) => <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ border: '1px solid var(--tussock)', color: 'var(--glacier)' }}>{t}</span>)}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ==================================================================== */
/* PRIMEROS 7 DÍAS                                                      */
/* ==================================================================== */
function InsuranceDetail({ opt }) {
  return (
    <div>
      <h2 className="text-2xl mb-1" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--ink)' }}>{opt.name}</h2>
      <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-full" style={{ fontFamily: 'var(--font-mono)', background: 'var(--track)', color: 'var(--paper)' }}>{opt.tag}</span>
      <div className="grid sm:grid-cols-2 gap-4 mt-6 mb-6">
        {[['Precio', opt.priceNote], ['Franquicia', opt.franquicia], ['Cobertura', opt.cobertura], ['Deportes de aventura', opt.deportesAventura], ['Asistencia', opt.asistencia], ['Pago a plazos', opt.pagoAPlazos]].map(([label, val]) => (
          <div key={label} className="rounded-xl p-3" style={{ border: '1px solid var(--tussock)' }}><div className="text-xs font-bold uppercase mb-1" style={{ fontFamily: 'var(--font-mono)', color: 'var(--glacier)' }}>{label}</div><div className="text-sm" style={{ color: 'var(--ink)' }}>{val}</div></div>
        ))}
      </div>
      <div className="rounded-xl p-4 mb-6" style={{ background: 'rgba(47,107,79,0.06)' }}><div className="text-xs font-bold uppercase mb-1" style={{ fontFamily: 'var(--font-mono)', color: 'var(--pounamu-dark)' }}>Extra a tener en cuenta</div><p className="text-sm" style={{ color: 'var(--ink)' }}>{opt.extra}</p></div>
      <a href={opt.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm transition hover:opacity-90" style={{ background: 'var(--track)', color: 'var(--paper)' }}>Ver planes de {opt.name} <ExternalLink size={14} /></a>
    </div>
  );
}
function InsuranceHub() {
  const [selected, setSelected] = useState(null);
  if (selected) return <div><button onClick={() => setSelected(null)} className="inline-flex items-center gap-1 text-sm font-semibold mb-5 transition hover:opacity-80" style={{ color: 'var(--pounamu)' }}><ChevronLeft size={16} /> Volver a comparar seguros</button><InsuranceDetail opt={selected} /></div>;
  return (
    <div>
      <p className="text-xs mb-3" style={{ color: 'var(--glacier)' }}>Toca cada opción para ver el detalle completo.</p>
      <div className="grid sm:grid-cols-2 gap-3">
        {INSURANCE_OPTIONS.map((opt) => (
          <button key={opt.id} onClick={() => setSelected(opt)} className="text-left rounded-xl p-4 transition hover:opacity-90" style={{ border: '1px solid var(--tussock)' }}>
            <div className="flex items-start justify-between mb-1"><span className="font-bold text-sm" style={{ color: 'var(--ink)' }}>{opt.name}</span><ChevronRight size={16} style={{ color: 'var(--track)' }} /></div>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--tussock)', color: 'var(--pounamu-dark)' }}>{opt.tag}</span>
            <p className="text-xs mt-2" style={{ color: 'var(--glacier)' }}>{opt.priceNote}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
function BankDetail({ checked, toggle }) {
  return (
    <div>
      <SubHeading icon={CreditCard}>Tarjetas internacionales (día 1, sin banco aún)</SubHeading>
      <div className="space-y-2 mb-6">{INTL_CARDS.map((c) => <ProviderCard key={c.name} p={c} />)}</div>
      <SubHeading icon={Building2}>Cuenta bancaria neozelandesa</SubHeading>
      <div className="rounded-xl p-4 mb-3" style={{ border: '1px solid var(--tussock)' }}>{BANK_STEPS.map((s) => <MiniCheckItem key={s.id} item={s} checked={!!checked[`bank-${s.id}`]} onToggle={() => toggle(`bank-${s.id}`)} />)}</div>
      <div className="space-y-2">{NZ_BANKS.map((b) => <ProviderCard key={b.name} p={b} />)}</div>
    </div>
  );
}
function HousingDetail() {
  return (
    <div>
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div className="rounded-xl p-4" style={{ border: '1px solid var(--tussock)' }}><div className="text-xs font-bold uppercase mb-2" style={{ fontFamily: 'var(--font-mono)', color: 'var(--pounamu-dark)' }}>Gratis</div><InfoList items={FREE_HOUSING} /></div>
        <div className="rounded-xl p-4" style={{ border: '1px solid var(--tussock)' }}>
          <div className="text-xs font-bold uppercase mb-2" style={{ fontFamily: 'var(--font-mono)', color: 'var(--pounamu-dark)' }}>Hostels en Auckland</div>
          <ul className="text-xs space-y-2" style={{ color: 'var(--ink)' }}>
            {HOSTELS_AUCKLAND.map((h) => (
              <li key={h.name} className="flex gap-2">
                {h.warning ? <AlertTriangle size={13} className="shrink-0 mt-0.5" style={{ color: 'var(--track)' }} /> : <Star size={13} className="shrink-0 mt-0.5" style={{ color: 'var(--pounamu)' }} />}
                <span><strong>{h.name}</strong>{h.rating !== '—' ? ` (${h.rating})` : ''} — {h.note}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl p-4" style={{ border: '1px solid var(--tussock)' }}><div className="text-xs font-bold uppercase mb-2" style={{ fontFamily: 'var(--font-mono)', color: 'var(--pounamu-dark)' }}>Comparadores y piso</div><InfoList items={HOUSING_COMPARATORS} /></div>
      </div>
      <InfoBanner icon={AlertTriangle}>Nunca pagues depósito sin ver el alojamiento (en persona o videollamada) ni transfieras a cuentas fuera de NZ.</InfoBanner>
    </div>
  );
}
function FirstDaysModule({ checked, toggle }) {
  useDocumentTitle('Primeros 7 días en Nueva Zelanda');
  const items = [
    { id: 'seguro-medico', title: 'Seguro médico', icon: Shield, teaser: 'Compara IATI, Chapka, Heymondo y SafetyWing' },
    { id: 'esim', title: 'eSIM', icon: Smartphone, teaser: 'Datos desde el minuto uno' },
    { id: 'sim', title: 'SIM local', icon: Wifi, teaser: 'Spark, One NZ, 2degrees, Skinny' },
    { id: 'ird', title: 'Número IRD', icon: Landmark, teaser: 'Imprescindible antes de poder cobrar' },
    { id: 'banco', title: 'Cuentas de banco', icon: CreditCard, teaser: 'Tarjetas internacionales + banco neozelandés' },
    { id: 'alojamiento', title: 'Alojamiento inicial', icon: Home, teaser: 'Gratis, hostels recomendados y comparadores' },
  ];
  const renderDetail = (item) => {
    if (item.id === 'seguro-medico') return <InsuranceHub />;
    if (item.id === 'esim') return <TaskBlock icon={Smartphone} title={null} task={ESIM_TASK} checked={checked} toggle={toggle} prefix="esim" />;
    if (item.id === 'sim') return (
      <div>
        <InfoBanner icon={Info}>Los operadores locales también tienen eSIM, no solo SIM física — la diferencia con Holafly no es "eSIM sí o no", sino cuándo la activas: Holafly la compras y activas desde España antes de volar; la eSIM de un operador de NZ normalmente la das de alta ya en el país (necesitas pasaporte para registrarla). Por eso Holafly cubre las primeras horas, y luego cambias a un operador local — más barato para el resto del viaje.</InfoBanner>
        <div className="rounded-xl p-4 mb-3" style={{ border: '1px solid var(--tussock)' }}>{SIM_STEPS.map((s) => <MiniCheckItem key={s.id} item={s} checked={!!checked[`sim-${s.id}`]} onToggle={() => toggle(`sim-${s.id}`)} />)}</div>
        <div className="space-y-2">{SIMS.map((s) => <ProviderCard key={s.name} p={s} />)}</div>
      </div>
    );
    if (item.id === 'ird') return <TaskBlock icon={Landmark} title={null} task={IRD_TASK} checked={checked} toggle={toggle} prefix="ird" />;
    if (item.id === 'banco') return <BankDetail checked={checked} toggle={toggle} />;
    if (item.id === 'alojamiento') return <HousingDetail />;
    return null;
  };
  return (
    <div>
      <SectionHeading eyebrow="Etapa 03 · Primeros 7 días" title="Primeros 7 días" icon={ListChecks} />
      <p className="text-sm mb-6 max-w-2xl" style={{ color: 'var(--glacier)' }}>Toca cada tarjeta para ver solo lo que necesitas de ese trámite.</p>
      <Hub items={items} renderDetail={renderDetail} columns="sm:grid-cols-2 lg:grid-cols-3" basePath="/primeros-7-dias" />
      <div className="mt-10">
        <SubHeading icon={FileText}>Lo que se suele olvidar</SubHeading>
        <ul className="text-xs space-y-1.5" style={{ color: 'var(--ink)' }}>
          <li className="flex gap-2"><Car size={13} className="shrink-0 mt-0.5" style={{ color: 'var(--track)' }} /> Permiso Internacional de Conducción (DGT, antes de volar)</li>
          <li className="flex gap-2"><Phone size={13} className="shrink-0 mt-0.5" style={{ color: 'var(--track)' }} /> Número de emergencias: <strong>111</strong></li>
          <li className="flex gap-2"><FileText size={13} className="shrink-0 mt-0.5" style={{ color: 'var(--track)' }} /> Declaración de Viajero (NZTD), hasta 24h antes del vuelo</li>
          <li className="flex gap-2"><Phone size={13} className="shrink-0 mt-0.5" style={{ color: 'var(--track)' }} /> Tarifa prepago con tu compañía española antes de irte</li>
          <li className="flex gap-2"><Users size={13} className="shrink-0 mt-0.5" style={{ color: 'var(--track)' }} /> Comparte tu documentación escaneada con un familiar</li>
        </ul>
      </div>
    </div>
  );
}

/* ==================================================================== */
/* TRABAJO Y DINERO                                                     */
/* ==================================================================== */
function HolidayPayCalculator() {
  const [rateA, setRateA] = useState(25.5);
  const [rateB, setRateB] = useState(27);
  const equivA = rateA * 1.08;
  const aWins = equivA > rateB;
  return (
    <div className="rounded-xl p-4" style={{ border: '1px solid var(--tussock)', background: 'rgba(225,127,53,0.06)' }}>
      <div className="flex items-center gap-2 mb-2"><Calculator size={15} style={{ color: 'var(--track)' }} /><span className="text-xs font-bold uppercase" style={{ fontFamily: 'var(--font-mono)', color: 'var(--pounamu-dark)' }}>Calculadora: no te fíes solo del número grande</span></div>
      <p className="text-xs mb-3" style={{ color: 'var(--ink)' }}>
        El riesgo real ocurre cuando te confías solo del número grande. Compara estos dos anuncios de ejemplo: <strong>Trabajo A: 25,50$/h + 8% aparte</strong> vs. <strong>Trabajo B: 27,00$/h (8% ya incluido)</strong>. Si te guías solo por el que parece más alto (27$), pierdes dinero — el Trabajo A, con su 8% sumado, te paga en realidad <strong>27,54$/h</strong>.
      </p>
      <div className="grid sm:grid-cols-2 gap-3 text-xs mb-3">
        <div>
          <label className="block text-xs font-bold uppercase mb-1" style={{ color: 'var(--glacier)' }}>Trabajo A — tarifa base + 8% aparte</label>
          <input type="number" step="0.1" value={rateA} onChange={(e) => setRateA(parseFloat(e.target.value) || 0)} className="w-full rounded-lg px-3 py-2 text-sm" style={{ border: '1px solid var(--tussock)', color: 'var(--ink)' }} />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase mb-1" style={{ color: 'var(--glacier)' }}>Trabajo B — tarifa con 8% ya incluido</label>
          <input type="number" step="0.1" value={rateB} onChange={(e) => setRateB(parseFloat(e.target.value) || 0)} className="w-full rounded-lg px-3 py-2 text-sm" style={{ border: '1px solid var(--tussock)', color: 'var(--ink)' }} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg p-3" style={{ background: 'var(--paper)', border: aWins ? '2px solid var(--pounamu)' : '1px solid var(--tussock)' }}>
          <div className="font-bold mb-1" style={{ color: 'var(--ink)' }}>Trabajo A equivalente real</div>
          <div className="text-lg font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--pounamu)' }}>{equivA.toFixed(2)}$/h</div>
          {aWins && <div className="text-xs font-bold mt-1" style={{ color: 'var(--pounamu)' }}>✓ Este paga más de verdad</div>}
        </div>
        <div className="rounded-lg p-3" style={{ background: 'var(--paper)', border: !aWins ? '2px solid var(--pounamu)' : '1px solid var(--tussock)' }}>
          <div className="font-bold mb-1" style={{ color: 'var(--ink)' }}>Trabajo B tal cual</div>
          <div className="text-lg font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--track)' }}>{rateB.toFixed(2)}$/h</div>
          {!aWins && <div className="text-xs font-bold mt-1" style={{ color: 'var(--pounamu)' }}>✓ Este paga más de verdad</div>}
        </div>
      </div>
      <p className="text-xs mt-3" style={{ color: 'var(--glacier)' }}>Prueba con tus propias ofertas: mete la tarifa de cada anuncio y compara el equivalente real por hora antes de decidir.</p>
    </div>
  );
}
function PortalsDetail() {
  return (
    <div>
      <SubHeading icon={Briefcase}>Cómo buscar trabajo</SubHeading>
      <div className="grid sm:grid-cols-2 gap-3 mb-6">{JOB_SEARCH_METHODS.map((m) => <div key={m.title} className="rounded-xl p-3" style={{ border: '1px solid var(--tussock)' }}><div className="text-sm font-bold mb-1" style={{ color: 'var(--ink)' }}>{m.title}</div><div className="text-xs" style={{ color: 'var(--glacier)' }}>{m.detail}</div></div>)}</div>
      <InfoBanner icon={Info}>Para pasaporte español no hay límite de tiempo por empleador — condiciones que cambian, revísalas en el portal oficial.</InfoBanner>
      <SubHeading icon={ExternalLink}>Portales específicos para Working Holiday</SubHeading>
      <div className="space-y-2 mb-6">{JOB_PORTALS_WHV.map((p) => <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 rounded-xl p-3 transition hover:opacity-80" style={{ border: '1px solid var(--tussock)' }}><div><div className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{p.name}</div><div className="text-xs" style={{ color: 'var(--glacier)' }}>{p.detail}</div></div><ExternalLink size={15} style={{ color: 'var(--pounamu)' }} className="shrink-0" /></a>)}</div>
      <SubHeading icon={ExternalLink}>Portales generales (cualquier visado)</SubHeading>
      <p className="text-xs mb-2" style={{ color: 'var(--glacier)' }}>Si vienes con otro visado (residencia, estudios) sueles moverte más por aquí.</p>
      <div className="space-y-2 mb-6">{JOB_PORTALS_GENERAL.map((p) => <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 rounded-xl p-3 transition hover:opacity-80" style={{ border: '1px solid var(--tussock)' }}><div><div className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{p.name}</div><div className="text-xs" style={{ color: 'var(--glacier)' }}>{p.detail}</div></div><ExternalLink size={15} style={{ color: 'var(--pounamu)' }} className="shrink-0" /></a>)}</div>
      <SubHeading icon={Users}>Agencias reclutadoras (gratis)</SubHeading>
      <div className="space-y-2">{RECRUITMENT_AGENCIES.map((a) => <div key={a.name} className="rounded-xl p-3" style={{ border: '1px solid var(--tussock)' }}><div className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{a.name}</div><div className="text-xs" style={{ color: 'var(--glacier)' }}>{a.detail}</div></div>)}</div>
    </div>
  );
}
function CalendarDetail() {
  return (
    <div>
      <div className="space-y-3 mb-4">
        {JOB_TYPES_CALENDAR.map((c) => (
          <div key={c.crop} className="rounded-xl p-4" style={{ border: '1px solid var(--tussock)' }}>
            <div className="text-sm font-bold mb-2" style={{ color: 'var(--ink)' }}>{c.crop}</div>
            <div className="flex flex-wrap gap-2">{c.timeline.map((t, i) => <div key={i} className="flex items-center gap-2 text-xs rounded-full px-3 py-1" style={{ background: 'var(--tussock)', color: 'var(--pounamu-dark)' }}><Calendar size={11} /> <strong>{t.period}</strong> · {t.activity}</div>)}</div>
          </div>
        ))}
      </div>
      <div className="text-xs font-bold uppercase mb-2" style={{ fontFamily: 'var(--font-mono)', color: 'var(--glacier)' }}>Otros tipos de trabajo habituales</div>
      <SimpleChipList items={OTHER_JOB_TYPES} />
    </div>
  );
}
function PayDetail() {
  return (
    <div>
      <div className="rounded-xl p-4 mb-4" style={{ border: '1px solid var(--tussock)' }}><div className="text-sm font-bold mb-1" style={{ color: 'var(--ink)' }}>Tax Code: "M"</div><p className="text-xs" style={{ color: 'var(--glacier)' }}>Es el que corresponde a un empleado temporal con un solo empleador — el que vas a usar casi siempre.</p></div>
      <HolidayPayCalculator />
    </div>
  );
}
function TaxReturnDetail() {
  return (
    <div>
      <div className="rounded-xl p-4 mb-3" style={{ border: '1px solid var(--tussock)' }}><p className="text-sm" style={{ color: 'var(--ink)' }}>El año fiscal en NZ va del <strong>1 de abril al 31 de marzo</strong>. Se hace online en myIR, devolución entre junio y julio.</p></div>
      <div className="rounded-xl p-4" style={{ border: '1px solid var(--tussock)' }}><div className="text-sm font-bold mb-1" style={{ color: 'var(--ink)' }}>Declaración anticipada al irte</div><p className="text-xs" style={{ color: 'var(--glacier)' }}>Envía un mensaje desde tu perfil de myIR, adjunta tu última nómina y el billete de salida, actualiza tu dirección. Suele tardar alrededor de un mes.</p></div>
    </div>
  );
}
function WorkModule() {
  useDocumentTitle('Trabajo y dinero en Nueva Zelanda');
  const items = [
    { id: 'portales-y-agencias', title: 'Portales y agencias', icon: Briefcase, teaser: 'Cómo buscar, según tu visado' },
    { id: 'calendario', title: 'Calendario de temporadas', icon: Calendar, teaser: 'Kiwis, tambos, viñedos, mes a mes' },
    { id: 'sueldo-y-nominas', title: 'Tax Code y holiday pay', icon: Calculator, teaser: 'Calculadora: no te fíes del número grande' },
    { id: 'declaracion-renta', title: 'Declaración de la renta', icon: PiggyBank, teaser: 'Año fiscal y devolución anticipada' },
  ];
  const renderDetail = (item) => {
    if (item.id === 'portales-y-agencias') return <PortalsDetail />;
    if (item.id === 'calendario') return <CalendarDetail />;
    if (item.id === 'sueldo-y-nominas') return <PayDetail />;
    if (item.id === 'declaracion-renta') return <TaxReturnDetail />;
    return null;
  };
  return (
    <div>
      <SectionHeading eyebrow="Etapa 04 · Trabajo y dinero" title="Trabajo y dinero" icon={Briefcase} />
      <p className="text-sm mb-6 max-w-2xl" style={{ color: 'var(--glacier)' }}>Toca cada tarjeta para entrar solo en lo que te interesa.</p>
      <Hub items={items} renderDetail={renderDetail} columns="sm:grid-cols-2" basePath="/trabajo-y-dinero" />
    </div>
  );
}

/* ==================================================================== */
/* FURGO, TRANSPORTE Y VIDA                                             */
/* ==================================================================== */
function DocsDetail({ checked, toggle }) {
  return (
    <div>
      <SubHeading icon={ListChecks}>Checklist: ¿puede circular tu furgo?</SubHeading>
      <div className="rounded-xl p-4 mb-6" style={{ border: '1px solid var(--tussock)' }}>
        {LEGAL_TO_DRIVE_CHECKLIST.map((item) => (
          <button key={item.id} onClick={() => toggle(item.id)} className="w-full text-left flex items-start gap-3 py-2">
            <div className="mt-0.5 shrink-0"><Stamp checked={!!checked[item.id]} /></div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap"><span className="text-sm" style={{ color: 'var(--ink)' }}>{item.text}</span><span className="text-xs font-bold uppercase px-2 py-0.5 rounded-full shrink-0" style={{ fontFamily: 'var(--font-mono)', background: item.required ? 'var(--track)' : 'var(--glacier)', color: 'var(--paper)' }}>{item.required ? 'Obligatorio' : 'Según caso'}</span></div>
              {item.note && <p className="text-xs mt-1" style={{ color: 'var(--glacier)' }}>{item.note}</p>}
            </div>
          </button>
        ))}
      </div>
      <SubHeading icon={Car}>Revisiones e impuestos, uno a uno</SubHeading>
      <div className="space-y-3 mb-6">{[['WOF (Warrant of Fitness)', 'ITV neozelandesa — cada 6 o 12 meses.'], ['REGO (Vehicle Licensing)', 'Impuesto de circulación, por bloques de 1, 3, 6 o 12 meses.'], ['RUC (Road User Charges)', 'Solo diésel — por adelantado según km previstos.'], ['COF (Certificate of Fitness)', 'Como el WOF pero para vehículos comerciales/grandes.']].map(([t, d]) => <div key={t} className="rounded-xl p-4" style={{ border: '1px solid var(--tussock)' }}><div className="text-sm font-bold mb-1" style={{ color: 'var(--ink)' }}>{t}</div><p className="text-xs" style={{ color: 'var(--glacier)' }}>{d}</p></div>)}</div>
      <SubHeading icon={Tent}>Self-Contained Certification</SubHeading>
      <div className="space-y-3 mb-6">
        <div className="rounded-xl p-4" style={{ border: '1px solid var(--tussock)' }}><div className="flex items-center gap-2 mb-1"><span style={{ width: 10, height: 10, borderRadius: 999, background: '#3E7CA6', display: 'inline-block' }} /><span className="text-sm font-bold" style={{ color: 'var(--ink)' }}>Blue Sticker (antiguo)</span></div><p className="text-xs" style={{ color: 'var(--glacier)' }}>Extendido hasta junio de 2026.</p></div>
        <div className="rounded-xl p-4" style={{ border: '1px solid var(--tussock)' }}><div className="flex items-center gap-2 mb-1"><span style={{ width: 10, height: 10, borderRadius: 999, background: 'var(--pounamu)', display: 'inline-block' }} /><span className="text-sm font-bold" style={{ color: 'var(--ink)' }}>Green Sticker (estándar desde 2024)</span></div><p className="text-xs" style={{ color: 'var(--glacier)' }}>Solo con baño fijo. Obligatorio en muchas zonas de freedom camping.</p></div>
      </div>
      <SubHeading icon={Shield}>Aseguradoras de coche</SubHeading>
      <SimpleChipList items={CAR_INSURERS} />
    </div>
  );
}
function BuyVanDetail() {
  return (
    <div>
      <SubHeading icon={ShoppingBag}>Comprar de segunda mano</SubHeading>
      <div className="space-y-2 mb-4">{WHERE_TO_BUY_VAN.map((w) => <div key={w.name} className="rounded-xl p-3" style={{ border: '1px solid var(--tussock)' }}><div className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{w.name}</div><div className="text-xs" style={{ color: 'var(--glacier)' }}>{w.detail}</div></div>)}</div>
      <InfoBanner icon={AlertTriangle}>Cuidado con <strong>backpackercar.co.nz</strong> — reportado repetidamente como estafa.</InfoBanner>
      <SubHeading icon={Car}>O alquilarla, si tu viaje es corto</SubHeading>
      <p className="text-xs mb-2" style={{ color: 'var(--glacier)' }}>Para menos de 3-4 semanas suele compensar más que comprar y revender — ver el módulo de "Furgo vs. piso" en el blog para la comparación completa.</p>
      <div className="space-y-2 mb-6">{VAN_RENTAL_COMPANIES.map((r) => <ProviderCard key={r.name} p={{ name: r.name, tag: 'Alquiler', detail: r.detail, link: r.link }} />)}</div>
      <SubHeading icon={ListChecks}>Checklist: qué debe tener (para vivir bien)</SubHeading>
      <ul className="text-xs space-y-1.5" style={{ color: 'var(--ink)' }}>{VAN_CHECKLIST_ITEMS.map((it, i) => <li key={i} className="flex gap-2"><CheckCircle2 size={13} className="shrink-0 mt-0.5" style={{ color: 'var(--pounamu)' }} />{it}</li>)}</ul>
    </div>
  );
}
function MoveAroundDetail() {
  return (
    <div>
      <SubHeading icon={Waves}>Ferry entre islas</SubHeading>
      <div className="space-y-2 mb-6">{FERRY_OPTIONS.map((f) => <div key={f.name} className="rounded-xl p-3" style={{ border: '1px solid var(--tussock)' }}><div className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{f.name}</div><div className="text-xs" style={{ color: 'var(--glacier)' }}>{f.detail}</div></div>)}</div>
      <InfoBanner icon={Sparkles}><strong>Reposicionamiento de coches:</strong> algunas empresas ofrecen mover vehículos casi gratis entre ciudades o islas — a veces solo pagas gasolina.</InfoBanner>
    </div>
  );
}
function ShoppingDetail() {
  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl p-4" style={{ border: '1px solid var(--tussock)' }}><div className="flex items-center gap-2 mb-2"><ShoppingBag size={14} style={{ color: 'var(--pounamu)' }} /><span className="text-xs font-bold uppercase" style={{ fontFamily: 'var(--font-mono)', color: 'var(--pounamu-dark)' }}>Supermercados</span></div><SimpleChipList items={SUPERMARKETS} /></div>
        <div className="rounded-xl p-4" style={{ border: '1px solid var(--tussock)' }}><div className="flex items-center gap-2 mb-2"><Recycle size={14} style={{ color: 'var(--pounamu)' }} /><span className="text-xs font-bold uppercase" style={{ fontFamily: 'var(--font-mono)', color: 'var(--pounamu-dark)' }}>Segunda mano</span></div><SimpleChipList items={SECOND_HAND_SHOPS} /></div>
        <div className="rounded-xl p-4" style={{ border: '1px solid var(--tussock)' }}><div className="flex items-center gap-2 mb-2"><Laptop size={14} style={{ color: 'var(--pounamu)' }} /><span className="text-xs font-bold uppercase" style={{ fontFamily: 'var(--font-mono)', color: 'var(--pounamu-dark)' }}>Tecnología</span></div><SimpleChipList items={TECH_SHOPS} /></div>
        <div className="rounded-xl p-4" style={{ border: '1px solid var(--tussock)' }}><div className="flex items-center gap-2 mb-2"><Shirt size={14} style={{ color: 'var(--pounamu)' }} /><span className="text-xs font-bold uppercase" style={{ fontFamily: 'var(--font-mono)', color: 'var(--pounamu-dark)' }}>Ropa y deporte</span></div><SimpleChipList items={SPORT_SHOPS} /></div>
      </div>
      <SubHeading icon={PiggyBank}>Consejos generales para ahorrar de verdad</SubHeading>
      <ul className="text-xs space-y-1.5" style={{ color: 'var(--ink)' }}>{SAVING_TIPS.map((t, i) => <li key={i} className="flex gap-2"><CheckCircle2 size={13} className="shrink-0 mt-0.5" style={{ color: 'var(--pounamu)' }} />{t}</li>)}</ul>
    </div>
  );
}
function ActivitiesShippingDetail() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div><SubHeading icon={Ticket}>Descuentos en actividades</SubHeading><div className="space-y-2">{ACTIVITY_DISCOUNTS.map((a) => <div key={a.name} className="rounded-xl p-3" style={{ border: '1px solid var(--tussock)' }}><div className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{a.name}</div><div className="text-xs" style={{ color: 'var(--glacier)' }}>{a.detail}</div></div>)}</div></div>
      <div><SubHeading icon={Package}>Enviar maletas a España</SubHeading><div className="space-y-2">{SHIPPING_OPTIONS.map((s) => <div key={s.name} className="rounded-xl p-3" style={{ border: '1px solid var(--tussock)' }}><div className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{s.name}</div><div className="text-xs" style={{ color: 'var(--glacier)' }}>{s.detail}</div></div>)}</div></div>
    </div>
  );
}
function VehicleModule({ checked, toggle }) {
  useDocumentTitle('Furgo, transporte y vida en NZ');
  const items = [
    { id: 'documentacion', title: 'Documentación y revisiones', icon: FileText, teaser: 'WOF, REGO, RUC, COF, Self-Contained y seguro' },
    { id: 'comprar-furgo', title: 'Comprar o alquilar furgo', icon: ShoppingBag, teaser: 'Dónde buscar, alquiler y qué debe tener' },
    { id: 'moverte', title: 'Moverte por NZ', icon: Waves, teaser: 'Ferry y reposicionamiento de coches' },
    { id: 'ahorra', title: 'Ahorra en el día a día', icon: PiggyBank, teaser: 'Supermercados, segunda mano y consejos reales' },
    { id: 'actividades-envios', title: 'Actividades y envíos', icon: Ticket, teaser: 'Descuentos y cómo mandar maletas a casa' },
  ];
  const renderDetail = (item) => {
    if (item.id === 'documentacion') return <DocsDetail checked={checked} toggle={toggle} />;
    if (item.id === 'comprar-furgo') return <BuyVanDetail />;
    if (item.id === 'moverte') return <MoveAroundDetail />;
    if (item.id === 'ahorra') return <ShoppingDetail />;
    if (item.id === 'actividades-envios') return <ActivitiesShippingDetail />;
    return null;
  };
  return (
    <div>
      <SectionHeading eyebrow="Etapa 05 · Furgo y vida" title="Furgo, transporte y vida en NZ" icon={Car} />
      <p className="text-sm mb-6 max-w-2xl" style={{ color: 'var(--glacier)' }}>Toca cada tarjeta para entrar solo en lo que te interesa.</p>
      <Hub items={items} renderDetail={renderDetail} columns="sm:grid-cols-2 lg:grid-cols-3" basePath="/furgo-y-vida" />
    </div>
  );
}

/* ==================================================================== */
/* BLOG                                                                 */
/* ==================================================================== */
function BlogList() {
  useDocumentTitle('Blog');
  return (
    <div>
      <SectionHeading eyebrow="Recursos" title="Blog" icon={Newspaper} />
      <div className="grid sm:grid-cols-2 gap-5">
        {BLOG_POSTS.map((post) => (
          <Link key={post.slug} to={`/blog/${post.slug}`} className="block rounded-2xl p-5 transition hover:opacity-90" style={{ border: '1px solid var(--tussock)' }}>
            <div className="flex items-center gap-2 text-xs mb-2" style={{ color: 'var(--glacier)', fontFamily: 'var(--font-mono)' }}><Clock size={12} /> {post.readTime} de lectura</div>
            <h3 className="text-lg mb-2" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--ink)' }}>{post.title}</h3>
            <p className="text-sm mb-3" style={{ color: 'var(--ink)' }}>{post.excerpt}</p>
            <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: 'var(--pounamu)' }}>Leer artículo <ChevronRight size={13} /></span>
          </Link>
        ))}
      </div>
    </div>
  );
}
function BlogPost() {
  const { slug } = useParams();
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  useDocumentTitle(post ? post.title : 'Blog');
  if (!post) return <Navigate to="/blog" replace />;
  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm font-semibold transition hover:opacity-80" style={{ color: 'var(--pounamu)' }}><ChevronLeft size={16} /> Volver al blog</Link>
        <ShareButton title={post.title} text={post.excerpt} />
      </div>
      <div className="text-xs mb-2 flex items-center gap-2" style={{ color: 'var(--glacier)', fontFamily: 'var(--font-mono)' }}><Clock size={12} /> {post.readTime} de lectura</div>
      <h1 className="text-3xl mb-6" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--ink)' }}>{post.title}</h1>
      <div className="space-y-4 max-w-2xl">
        {post.content.map((p, i) => <p key={i} className="text-sm leading-relaxed" style={{ color: 'var(--ink)' }}>{p}</p>)}
      </div>
    </div>
  );
}

/* ==================================================================== */
/* APP SHELL                                                            */
/* ==================================================================== */
const MODULES = [
  { path: '/visado', label: 'Visado', stage: '01', icon: FileText },
  { path: '/donde-ir', label: 'Dónde ir', stage: '02', icon: Compass },
  { path: '/primeros-7-dias', label: 'Primeros 7 días', stage: '03', icon: ListChecks },
  { path: '/trabajo-y-dinero', label: 'Trabajo y dinero', stage: '04', icon: Briefcase },
  { path: '/furgo-y-vida', label: 'Furgo y vida', stage: '05', icon: Car },
  { path: '/blog', label: 'Blog', stage: '06', icon: BookOpen },
];

function RouteTracker() {
  const location = useLocation();
  useEffect(() => { trackPageview(location.pathname); }, [location.pathname]);
  return null;
}

function AppShell() {
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem('whv-checklist') || '{}'); } catch (e) { return {}; }
  });
  useEffect(() => {
    try { localStorage.setItem('whv-checklist', JSON.stringify(checked)); } catch (e) { /* noop */ }
  }, [checked]);
  const toggle = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh', fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Work+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');
        :root { --paper: #F6F3EA; --ink: #1C2B22; --pounamu: #2F6B4F; --pounamu-dark: #1F4A36; --glacier: #3E7CA6; --track: #E17F35; --tussock: #DCCEA8;
          --font-display: 'Barlow Condensed', sans-serif; --font-body: 'Work Sans', sans-serif; --font-mono: 'JetBrains Mono', monospace; }
        @keyframes stampPop { 0% { transform: rotate(-9deg) scale(0); opacity: 0; } 60% { transform: rotate(-9deg) scale(1.25); opacity: 1; } 100% { transform: rotate(-9deg) scale(1); opacity: 1; } }
        .stamp-pop { animation: stampPop 0.35s ease-out; }
        .contour-bg { position: absolute; inset: 0; opacity: 0.12; pointer-events: none; background-image: repeating-radial-gradient(circle at 15% 30%, transparent 0, transparent 14px, var(--paper) 15px, var(--paper) 16px), repeating-radial-gradient(circle at 85% 75%, transparent 0, transparent 18px, var(--paper) 19px, var(--paper) 20px); }
      `}</style>
      <RouteTracker />
      <header style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center gap-3">
          <Mountain size={26} style={{ color: 'var(--track)' }} />
          <div><div className="text-lg md:text-xl leading-none" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '0.02em' }}>WHV AOTEAROA</div><div className="text-xs" style={{ color: 'var(--tussock)', fontFamily: 'var(--font-mono)' }}>Kete digital para tu Working Holiday en Nueva Zelanda</div></div>
        </div>
      </header>
      <nav className="sticky top-0 z-20" style={{ background: 'var(--paper)', borderBottom: '1px solid var(--tussock)' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex overflow-x-auto">
          {MODULES.map((m) => {
            const Icon = m.icon;
            return (
              <NavLink key={m.path} to={m.path} className="flex items-center gap-2 px-4 md:px-5 py-4 shrink-0 transition" style={({ isActive }) => ({ borderBottom: isActive ? '3px solid var(--track)' : '3px solid transparent', color: isActive ? 'var(--pounamu-dark)' : 'var(--glacier)' })}>
                {({ isActive }) => (
                  <>
                    <span className="text-xs font-bold px-1.5 rounded" style={{ fontFamily: 'var(--font-mono)', background: isActive ? 'var(--track)' : 'var(--tussock)', color: isActive ? 'var(--paper)' : 'var(--pounamu-dark)' }}>{m.stage}</span>
                    <Icon size={16} /><span className="text-sm font-semibold whitespace-nowrap">{m.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-10">
        <Routes>
          <Route path="/" element={<Navigate to="/visado" replace />} />
          <Route path="/visado" element={<VisaModule checked={checked} toggle={toggle} />} />
          <Route path="/donde-ir" element={<CityModule />} />
          <Route path="/donde-ir/:citySlug" element={<CityModule />} />
          <Route path="/primeros-7-dias" element={<FirstDaysModule checked={checked} toggle={toggle} />} />
          <Route path="/primeros-7-dias/:subId" element={<FirstDaysModule checked={checked} toggle={toggle} />} />
          <Route path="/trabajo-y-dinero" element={<WorkModule />} />
          <Route path="/trabajo-y-dinero/:subId" element={<WorkModule />} />
          <Route path="/furgo-y-vida" element={<VehicleModule checked={checked} toggle={toggle} />} />
          <Route path="/furgo-y-vida/:subId" element={<VehicleModule checked={checked} toggle={toggle} />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="*" element={<Navigate to="/visado" replace />} />
        </Routes>
      </main>
      <footer className="max-w-6xl mx-auto px-4 md:px-8 py-6 text-xs" style={{ color: 'var(--glacier)' }}>Cifras orientativas para planificar — verifica siempre precios y requisitos actuales antes de tomar decisiones.</footer>
    </div>
  );
}

export default function WHVDashboard() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

