import React, { useState, useMemo } from 'react';
import {
  FileText, MapPin, ListChecks, Briefcase, ExternalLink, CheckCircle2, Circle,
  CreditCard, Smartphone, Shield, Car, Users, AlertTriangle, ChevronRight, ChevronLeft,
  Mountain, Plane, Wallet, Building2, Wifi, Phone, Filter, Sparkles,
  Tent, Waves, Landmark, Banknote, MessageCircle, Compass, Flag, X, Sun, ImageOff, Fish
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* DATA                                                                */
/* ------------------------------------------------------------------ */

const CHECKLIST = {
  previos: [
    { id: 'p1', text: 'Pasaporte válido con al menos 3 meses de vigencia tras tu fecha prevista de salida de NZ', required: true },
    { id: 'p2', text: 'Fondos demostrables de al menos 4.200 NZD en tu cuenta bancaria', required: true },
    { id: 'p3', text: 'Billete de vuelta reservado, o fondos suficientes para comprarlo desde allí', required: true },
    { id: 'p4', text: 'Foto tipo carnet reciente, fondo claro', required: true },
    { id: 'p5', text: 'Escaneo nítido de la página de datos del pasaporte', required: true },
    { id: 'p6', text: 'Seguro médico de viaje con cobertura para NZ', required: false, note: 'No siempre te lo piden al solicitar el visado, pero el oficial de frontera sí puede pedírtelo al entrar — llévalo contratado igualmente.' },
    { id: 'p7', text: 'Permiso Internacional de Conducción (si vas a conducir)', required: false, note: 'No lo pide inmigración, pero sin él no puedes alquilar ni comprar y conducir una furgo legalmente.' },
  ],
  aplicacion: [
    { id: 'a1', text: 'Crear cuenta en RealMe / Immigration Online', required: true },
    { id: 'a2', text: 'Rellenar el formulario de solicitud completo', required: true },
    { id: 'a3', text: 'Pagar la tasa de visado + el IVL (International Visitor Levy)', required: true },
    { id: 'a4', text: 'Subir todos los documentos escaneados en el formato pedido', required: true },
    { id: 'a5', text: 'Revisar que nombre y datos coincidan exactamente con el pasaporte', required: true },
  ],
  aprobacion: [
    { id: 'ap1', text: 'Recibir el email de aprobación con el eVisa', required: true },
    { id: 'ap2', text: 'Descargar y guardar el eVisa (PDF + captura de pantalla, por si acaso)', required: true },
    { id: 'ap3', text: 'Comprobar la fecha límite de entrada a NZ (normalmente 12 meses desde la aprobación)', required: true },
    { id: 'ap4', text: 'Llevar una copia impresa además de la digital', required: false },
  ],
};

const CITIES = [
  {
    id: 'auckland', name: 'Auckland', island: 'Isla Norte', photoUrl: '',
    rentMin: 220, rentMax: 280,
    jobTypes: ['Hospitality', 'Oficinas', 'Construcción'],
    jobEase: 4, nightlife: 4,
    nightlifeTags: ['Rooftop bars', 'Ambiente internacional', 'Ciudad grande'],
    pros: ['Con diferencia el mayor volumen de ofertas de trabajo del país', 'Vuelos internacionales directos', 'Comunidad de mochileros enorme'],
    cons: ['El alquiler más caro de NZ', 'Tráfico y distancias largas', 'Mucha competencia por cada puesto'],
    mainJobs: 'Hostelería (cafés, restaurantes, bares), retail en centros comerciales, construcción, almacenes y logística, call centres.',
    bestSeason: 'Todo el año hay movimiento, pero evita llegar justo en el parón navideño (mediados de diciembre a mediados de enero) si buscas algo de oficina.',
    description: 'La ciudad más grande y multicultural de NZ. Es donde más ofertas hay en volumen absoluto, a cambio del alquiler más caro del país.',
  },
  {
    id: 'wellington', name: 'Wellington', island: 'Isla Norte', photoUrl: '',
    rentMin: 200, rentMax: 260,
    jobTypes: ['Oficinas', 'Hospitality'],
    jobEase: 3, nightlife: 5,
    nightlifeTags: ['Capital cultural', 'Craft beer', 'Música en vivo'],
    pros: ['Vida cultural y hostelera de las mejores del país', 'Ciudad compacta, todo cerca andando', 'Ambiente creativo'],
    cons: ['Viento constante, fama merecida', 'Mercado laboral más pequeño que Auckland', 'Cuestas pronunciadas para moverte a pie/bici'],
    mainJobs: 'Hostelería y cafés (fama de la mejor escena de café flat white del país), eventos y ferias, retail.',
    bestSeason: 'Octubre a abril, cuando el tiempo acompaña más y hay más eventos, festivales y turismo.',
    description: 'La capital, compacta y con una vida cultural que le queda grande a su tamaño. Famosa por el viento y por su escena de café.',
  },
  {
    id: 'queenstown', name: 'Queenstown', island: 'Isla Sur', photoUrl: '',
    rentMin: 250, rentMax: 320,
    jobTypes: ['Hospitality', 'Turismo'],
    jobEase: 4, nightlife: 5,
    nightlifeTags: ['Fiesta mochilera', 'Bares hasta tarde', 'Ambiente muy joven'],
    pros: ['Epicentro del turismo de aventura, sueldos con propina en algunos sitios', 'Ambiente social intensísimo entre WHV', 'Naturaleza al lado de casa'],
    cons: ['El alojamiento más caro y difícil de encontrar de NZ', 'Pueblo pequeño, todo saturado en temporada alta', 'Vivir ahí se come buena parte del sueldo'],
    mainJobs: 'Hostelería, hoteles, actividades de aventura (guías, recepción de tours), estaciones de esquí en invierno.',
    bestSeason: 'Doble temporada alta: junio-septiembre (esquí) y diciembre-marzo (verano/turismo) — hay curro casi todo el año.',
    description: 'La capital del turismo de aventura del planeta. Vive a tope todo el año gracias a su doble temporada, esquí en invierno y actividades al aire libre en verano.',
  },
  {
    id: 'christchurch', name: 'Christchurch', island: 'Isla Sur', photoUrl: '',
    rentMin: 170, rentMax: 220,
    jobTypes: ['Hospitality', 'Construcción', 'Oficinas'],
    jobEase: 4, nightlife: 3,
    nightlifeTags: ['En plena reconstrucción', 'Ambiente tranquilo', 'Vida universitaria'],
    pros: ['Ciudad totalmente plana, ideal para moverse en bici sin coche', 'Alquiler notablemente más barato que Auckland/Wellington', 'Gran volumen de ofertas al ser la ciudad más grande de la Isla Sur'],
    cons: ['Vida nocturna más floja que otras ciudades grandes', 'Todavía en reconstrucción en algunas zonas', 'Menos "postal" que Queenstown o Wanaka'],
    mainJobs: 'Hostelería, construcción (todavía reconstruyendo tras el terremoto de 2011), retail, almacenes y logística.',
    bestSeason: 'Todo el año, aunque diciembre-febrero (verano) es algo más flojo en construcción por las vacaciones de la plantilla habitual.',
    description: 'La ciudad más grande de la Isla Sur, totalmente plana y muy manejable en bici. Alquiler mucho más razonable que Auckland o Wellington.',
  },
  {
    id: 'tauranga', name: 'Tauranga / Bay of Plenty', island: 'Isla Norte', photoUrl: '',
    rentMin: 190, rentMax: 240,
    jobTypes: ['Agricultura', 'Hospitality'],
    jobEase: 3, nightlife: 2,
    nightlifeTags: ['Más playa que fiesta', 'Ritmo tranquilo'],
    pros: ['Corazón del kiwi de NZ — mucho trabajo de packhouse y recolección en temporada', 'Playas cerca, buen clima', 'Coste de vida razonable'],
    cons: ['Muy dependiente de la temporada de cosecha (marzo-junio)', 'Vida nocturna limitada', 'Trabajo agrícola es físicamente duro'],
    mainJobs: 'Packhouse y recolección de kiwi (marzo-junio es la temporada fuerte), hostelería en la costa.',
    bestSeason: 'Marzo a junio para la cosecha de kiwi; diciembre-febrero si buscas más bien playa y turismo.',
    description: 'La capital no oficial del kiwi neozelandés. Fuera de temporada de cosecha el mercado se enfría bastante.',
  },
  {
    id: 'nelson', name: 'Nelson / Blenheim', island: 'Isla Sur', photoUrl: '',
    rentMin: 170, rentMax: 210,
    jobTypes: ['Agricultura', 'Hospitality'],
    jobEase: 3, nightlife: 2,
    nightlifeTags: ['Relajado', 'Comunidad de artesanos'],
    pros: ['Zona vinícola — trabajo en viñedos casi todo el año (poda, vendimia)', 'Clima de los más soleados de NZ', 'Alquiler bajo, ritmo de vida tranquilo'],
    cons: ['Mercado laboral pequeño fuera de agricultura', 'Poca vida nocturna', 'Algo aislado si no tienes vehículo'],
    mainJobs: 'Vendimia y poda en viñedos (Marlborough es la mayor región vinícola de NZ), hostelería, cultivo de lúpulo.',
    bestSeason: 'Poda en invierno (junio-agosto), vendimia en otoño (marzo-mayo) — el sector agrícola da trabajo casi todo el año.',
    description: 'Zona vinícola por excelencia de NZ, con el clima más soleado del país. Ritmo de vida tranquilo, lejos del ajetreo.',
  },
  {
    id: 'wanaka', name: 'Wanaka', island: 'Isla Sur', photoUrl: '',
    rentMin: 230, rentMax: 290,
    jobTypes: ['Hospitality', 'Turismo'],
    jobEase: 4, nightlife: 4,
    nightlifeTags: ['Mini-Queenstown', 'Lago y montaña', 'Menos masificado'],
    pros: ['Mismo postal de montaña y lago que Queenstown, más tranquilo', 'Buena demanda de temporada (esquí en invierno, turismo en verano)', 'Comunidad de WHV muy unida por ser pueblo pequeño'],
    cons: ['Caro para su tamaño', 'Menos oferta total que las ciudades grandes', 'Alojamiento escaso en temporada alta'],
    mainJobs: 'Hostelería, turismo y actividades de aventura, temporada de esquí en Treble Cone y Cardrona.',
    bestSeason: 'Junio-octubre (esquí) y diciembre-marzo (verano) son los picos de contratación.',
    description: 'La hermana pequeña y más tranquila de Queenstown. Mismo paisaje de lago y montaña, comunidad de mochileros muy unida.',
  },
  {
    id: 'dunedin', name: 'Dunedin', island: 'Isla Sur', photoUrl: '',
    rentMin: 160, rentMax: 200,
    jobTypes: ['Hospitality', 'Retail'],
    jobEase: 3, nightlife: 4,
    nightlifeTags: ['Ciudad universitaria', 'Ambiente joven', 'Arquitectura victoriana'],
    pros: ['La más barata de las ciudades grandes de NZ', 'Buena vida social gracias a la Universidad de Otago', 'Arquitectura victoriana única en el país'],
    cons: ['Mercado laboral más pequeño fuera de la vida de campus', 'Cuestas muy pronunciadas, nada plano', 'Se nota mucho la diferencia entre época de curso y vacaciones'],
    mainJobs: 'Hostelería y retail ligados a la vida universitaria, algo de packhouse en granjas cercanas en temporada.',
    bestSeason: 'Marzo a noviembre (curso universitario), cuando la ciudad está más viva y hay más rotación de curro.',
    description: 'Ciudad estudiantil con edificios históricos y la vida más barata entre las ciudades grandes de NZ.',
  },
  {
    id: 'kaikoura', name: 'Kaikoura', island: 'Isla Sur', photoUrl: '',
    rentMin: 180, rentMax: 230,
    jobTypes: ['Turismo', 'Hospitality'],
    jobEase: 2, nightlife: 2,
    nightlifeTags: ['Pueblo costero pequeño', 'Ambiente relajado'],
    pros: ['Avistamiento de ballenas todo el año, algo único en el mundo', 'Focas y naturaleza marina al lado de casa', 'Pueblo pequeño y tranquilo, muy poco masificado'],
    cons: ['Mercado laboral muy limitado por el tamaño del pueblo', 'Poca vida nocturna', 'Depende mucho del turismo estacional'],
    mainJobs: 'Turismo marino (avistamiento de ballenas y delfines, buceo con focas), hostelería costera, pesca.',
    bestSeason: 'Las ballenas se ven todo el año (algo raro en el mundo), pero el verano (diciembre-marzo) trae más turistas y más curro de hostelería.',
    description: 'Pueblo costero pequeño, famoso mundialmente por el avistamiento de ballenas todo el año. Ideal si buscas naturaleza y tranquilidad antes que volumen de curro.',
  },
];

const IRD_TASK = {
  link: 'https://www.ird.govt.nz/managing-my-tax/ird-numbers/ird-numbers-for-individuals/new-arrival-to-new-zealand---ird-number-application',
  linkLabel: 'Solicitar el IRD number',
  steps: [
    { id: 'ird1', text: 'Ten a mano el pasaporte y los datos de tu eVisa (Working Holiday)' },
    { id: 'ird2', text: 'Entra en myIR (myir.ird.govt.nz) y regístrate como "new arrival"' },
    { id: 'ird3', text: 'Rellena el formulario online con tus datos' },
    { id: 'ird4', text: 'Espera la confirmación: ~2 días laborables por email/SMS, hasta 10 por correo postal' },
  ],
};

const BANKS = [
  {
    name: 'ANZ', tag: 'Sencillo con WHV', link: 'https://www.anz.co.nz',
    detail: 'Uno de los bancos más fáciles de abrir con Working Holiday, buena app, la mayor red de sucursales del país.',
  },
  {
    name: 'ASB', tag: 'Mejor app', link: 'https://www.asb.co.nz',
    detail: 'Muy valorado por su banca digital (FastNet). Ojo: ASB no acepta la dirección de un hostel como prueba de domicilio.',
  },
  {
    name: 'BNZ', tag: 'Abrir antes de volar', link: 'https://www.bnz.co.nz/personal-banking/international/moving-to-new-zealand',
    detail: 'Permite iniciar la solicitud online desde España, antes de aterrizar, y verificar tu identidad en sucursal al llegar.',
  },
  {
    name: 'Kiwibank', tag: 'No apto para WHV corta', link: 'https://www.kiwibank.co.nz',
    detail: 'Exige un visado de trabajo de más de 1 año y no permite abrir cuenta antes de llegar — descártalo si tu WHV es de 12 meses o menos.',
  },
  {
    name: 'Wise', tag: 'Puente mientras llegas', link: 'https://wise.com',
    detail: 'No es un banco de NZ, pero te da un número de cuenta local en NZD antes de aterrizar, útil para tu primer sueldo si el banco local tarda.',
  },
];

const BANK_STEPS = [
  { id: 'b1', text: 'Reúne pasaporte y eVisa escaneados' },
  { id: 'b2', text: 'Elige banco y rellena la solicitud online (o resérvala para hacerla in situ)' },
  { id: 'b3', text: 'Si la abriste "en remoto", visita la sucursal al llegar para verificar tu identidad en persona' },
  { id: 'b4', text: 'Una vez verificado, ya puedes retirar dinero y usar la cuenta con normalidad' },
];

const SIMS = [
  { name: 'Spark', tag: 'Mejor cobertura rural', link: 'https://www.spark.co.nz', detail: 'La red con más alcance fuera de las ciudades — la opción lógica si vas a hacer roadtrip por zonas remotas.' },
  { name: 'One NZ', tag: 'Buena cobertura urbana', link: 'https://one.nz', detail: 'Antes Vodafone NZ. Buenos planes prepago con datos generosos en ciudades y pueblos grandes.' },
  { name: '2degrees', tag: 'Normalmente el más barato', link: 'https://www.2degrees.nz', detail: 'Planes prepago muy competitivos en precio, cobertura sólida en zonas pobladas.' },
  { name: 'Skinny', tag: 'Sub-marca de Spark', link: 'https://www.skinny.co.nz', detail: 'Prepago muy simple y barato, hereda parte de la cobertura de Spark a menor coste.' },
];

const SIM_STEPS = [
  { id: 's1', text: 'Decide qué operador se ajusta a tu plan (prioriza cobertura rural si harás roadtrip)' },
  { id: 's2', text: 'Compra la SIM en el aeropuerto, en una tienda de la ciudad, o pide una eSIM online antes de volar' },
  { id: 's3', text: 'Actívala usando tu pasaporte como identificación' },
  { id: 's4', text: 'Guarda el número — lo necesitarás para el banco y para el trabajo' },
];

const INSURANCE_TASK = {
  link: 'https://www.worldnomads.com',
  linkLabel: 'Comparar seguros de viaje',
  steps: [
    { id: 'i1', text: 'Compara cobertura médica, repatriación y deportes de aventura entre proveedores (World Nomads, Cover-More, Southern Cross...)' },
    { id: 'i2', text: 'Contrátalo antes de volar, con fecha de inicio el mismo día que sales de España' },
    { id: 'i3', text: 'Guarda la póliza en PDF y lleva también una copia impresa' },
    { id: 'i4', text: 'Apunta el teléfono de asistencia 24h en el móvil, con nombre fácil de encontrar' },
  ],
};

const JOB_PORTALS = [
  { name: 'Trade Me Jobs', url: 'https://www.trademe.co.nz/jobs', detail: 'El más usado en NZ para trabajo casual y de temporada.' },
  { name: 'Seek NZ', url: 'https://www.seek.co.nz', detail: 'La web de empleo más grande, más orientada a puestos formales pero con casual también.' },
  { name: 'Backpacker Board', url: 'https://www.backpackerboard.co.nz', detail: 'Pensada específicamente para gente con Working Holiday: hostelería, temporada, granjas.' },
  { name: 'Picking Jobs', url: 'https://www.pickingjobs.com', detail: 'Especializada en trabajo agrícola y recolección de fruta por regiones.' },
];

/* ------------------------------------------------------------------ */
/* SMALL COMPONENTS                                                    */
/* ------------------------------------------------------------------ */

function Meter({ value, max = 5, color }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className="inline-block rounded-full"
          style={{ width: 9, height: 9, background: i < value ? color : 'var(--tussock)' }}
        />
      ))}
    </div>
  );
}

function Stamp({ checked }) {
  if (!checked) {
    return <Circle size={22} style={{ color: 'var(--tussock)' }} strokeWidth={2} />;
  }
  return (
    <span
      className="stamp-pop inline-flex items-center justify-center rounded-full"
      style={{ width: 26, height: 26, border: '2px solid var(--pounamu)', color: 'var(--pounamu)', transform: 'rotate(-9deg)' }}
    >
      <CheckCircle2 size={16} strokeWidth={2.5} />
    </span>
  );
}

function SectionHeading({ eyebrow, title, icon: Icon }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex items-center justify-center rounded-lg" style={{ width: 40, height: 40, background: 'var(--pounamu)', color: 'var(--paper)' }}>
        <Icon size={20} />
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--glacier)', fontFamily: 'var(--font-mono)' }}>
          {eyebrow}
        </div>
        <h2 className="text-2xl leading-tight" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--ink)' }}>
          {title}
        </h2>
      </div>
    </div>
  );
}

function MiniCheckItem({ item, checked, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="w-full text-left flex items-center gap-2 py-1.5"
    >
      {checked
        ? <CheckCircle2 size={16} style={{ color: 'var(--pounamu)' }} className="shrink-0" />
        : <Circle size={16} style={{ color: 'var(--tussock)' }} className="shrink-0" />}
      <span className="text-xs" style={{ color: 'var(--ink)', textDecoration: checked ? 'line-through' : 'none', opacity: checked ? 0.55 : 1 }}>
        {item.text}
      </span>
    </button>
  );
}

function TaskBlock({ icon: Icon, title, task, checked, toggle, prefix }) {
  return (
    <div className="rounded-xl p-4 mb-4" style={{ border: '1px solid var(--tussock)' }}>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={15} style={{ color: 'var(--pounamu)' }} />
        <span className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{title}</span>
      </div>
      <div className="mb-3">
        {task.steps.map((s) => (
          <MiniCheckItem
            key={s.id}
            item={s}
            checked={!!checked[`${prefix}-${s.id}`]}
            onToggle={() => toggle(`${prefix}-${s.id}`)}
          />
        ))}
      </div>
      <a
        href={task.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition hover:opacity-90"
        style={{ background: 'var(--track)', color: 'var(--paper)' }}
      >
        {task.linkLabel} <ExternalLink size={12} />
      </a>
    </div>
  );
}

function ProviderCard({ p, checked, toggle, prefix }) {
  return (
    <div className="rounded-xl p-3" style={{ border: '1px solid var(--tussock)' }}>
      <div className="flex items-center gap-2 mb-1">
        <button onClick={() => toggle(`${prefix}-${p.name}`)} className="shrink-0">
          {checked[`${prefix}-${p.name}`]
            ? <CheckCircle2 size={16} style={{ color: 'var(--pounamu)' }} />
            : <Circle size={16} style={{ color: 'var(--tussock)' }} />}
        </button>
        <span className="font-bold text-sm" style={{ color: 'var(--ink)' }}>{p.name}</span>
        <span className="text-xs px-2 py-0.5 rounded-full ml-auto" style={{ background: 'var(--tussock)', color: 'var(--pounamu-dark)' }}>
          {p.tag}
        </span>
      </div>
      <p className="text-xs mb-2" style={{ color: 'var(--glacier)' }}>{p.detail}</p>
      <a
        href={p.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs font-semibold"
        style={{ color: 'var(--pounamu)' }}
      >
        Ir a la web <ExternalLink size={11} />
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MODULE 1 — VISA & APLICACIÓN                                       */
/* ------------------------------------------------------------------ */

function VisaModule({ checked, toggle }) {
  const allItems = [...CHECKLIST.previos, ...CHECKLIST.aplicacion, ...CHECKLIST.aprobacion];
  const total = allItems.length;
  const done = allItems.filter((it) => checked[it.id]).length;
  const percent = Math.round((done / total) * 100);
  const requiredItems = allItems.filter((it) => it.required);
  const requiredDone = requiredItems.filter((it) => checked[it.id]).length;

  const Section = ({ title, items }) => (
    <div className="mb-6">
      <h3 className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--pounamu-dark)', fontFamily: 'var(--font-mono)' }}>
        {title}
      </h3>
      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => toggle(item.id)}
            className="w-full text-left flex items-start gap-3 p-3 rounded-xl transition"
            style={{ background: checked[item.id] ? 'rgba(47,107,79,0.07)' : 'var(--paper)', border: '1px solid var(--tussock)' }}
          >
            <div className="mt-0.5 shrink-0">
              <Stamp checked={!!checked[item.id]} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm" style={{ color: 'var(--ink)', textDecoration: checked[item.id] ? 'line-through' : 'none', opacity: checked[item.id] ? 0.6 : 1 }}>
                  {item.text}
                </span>
                <span
                  className="text-xs font-bold uppercase px-2 py-0.5 rounded-full shrink-0"
                  style={{ fontFamily: 'var(--font-mono)', background: item.required ? 'var(--track)' : 'var(--glacier)', color: 'var(--paper)' }}
                >
                  {item.required ? 'Obligatorio' : 'Opcional'}
                </span>
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
          <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--font-mono)', opacity: 0.85 }}>
            Etapa 01 · Visado
          </div>
          <h1 className="text-3xl md:text-4xl mb-3" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>
            Working Holiday Visa — Nueva Zelanda
          </h1>
          <p className="text-sm md:text-base max-w-xl mb-5" style={{ opacity: 0.92 }}>
            Todo el trámite empieza y termina en la web oficial de Immigration New Zealand.
            No hay atajos ni intermediarios necesarios — solicítalo tú mismo, directamente.
          </p>
          <a
            href="https://www.immigration.govt.nz/work/working-holiday-visas/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm transition hover:opacity-90"
            style={{ background: 'var(--track)', color: 'var(--paper)' }}
          >
            <Plane size={16} />
            Ir a la web oficial de Immigration NZ
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      <div className="rounded-2xl p-5 mb-8 flex flex-col md:flex-row md:items-center gap-4" style={{ border: '1px solid var(--tussock)' }}>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-bold" style={{ color: 'var(--ink)' }}>Progreso del checklist</span>
            <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-mono)', color: 'var(--pounamu)' }}>{percent}%</span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'var(--tussock)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${percent}%`, background: 'linear-gradient(90deg, var(--pounamu), var(--glacier))' }} />
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--glacier)' }}>
            {requiredDone} de {requiredItems.length} pasos obligatorios completados
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0" style={{ color: 'var(--pounamu)' }}>
          <Mountain size={28} />
          <span className="text-xs font-bold uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
            {percent === 100 ? 'Cumbre alcanzada' : 'Rumbo a NZ'}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Section title="Requisitos previos" items={CHECKLIST.previos} />
        <Section title="Día de la aplicación" items={CHECKLIST.aplicacion} />
        <Section title="Aprobación" items={CHECKLIST.aprobacion} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MODULE 2 — COMPARADOR DE CIUDADES + DETALLE                        */
/* ------------------------------------------------------------------ */

function CityImage({ city }) {
  const [failed, setFailed] = useState(false);
  if (city.photoUrl && !failed) {
    return (
      <img
        src={city.photoUrl}
        alt={city.name}
        onError={() => setFailed(true)}
        className="w-full h-40 object-cover rounded-xl"
      />
    );
  }
  return (
    <div
      className="w-full h-40 rounded-xl flex flex-col items-center justify-center gap-1"
      style={{ background: 'linear-gradient(135deg, var(--pounamu), var(--glacier))', color: 'var(--paper)' }}
    >
      <Mountain size={28} />
      <span className="text-xs font-bold uppercase" style={{ fontFamily: 'var(--font-mono)' }}>{city.name}</span>
    </div>
  );
}

function CityDetail({ city, onBack }) {
  return (
    <div>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1 text-sm font-semibold mb-5 transition hover:opacity-80"
        style={{ color: 'var(--pounamu)' }}
      >
        <ChevronLeft size={16} /> Volver al comparador
      </button>

      <CityImage city={city} />

      <div className="flex items-start justify-between mt-4 mb-2">
        <div>
          <h1 className="text-3xl" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--ink)' }}>{city.name}</h1>
          <span className="text-xs font-semibold uppercase" style={{ fontFamily: 'var(--font-mono)', color: 'var(--glacier)' }}>{city.island}</span>
        </div>
        <div className="text-right">
          <div className="text-2xl" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--pounamu)' }}>
            {city.rentMin}–{city.rentMax}
          </div>
          <div className="text-xs" style={{ color: 'var(--glacier)' }}>NZD/semana</div>
        </div>
      </div>

      <p className="text-sm mb-6" style={{ color: 'var(--ink)' }}>{city.description}</p>

      {!city.photoUrl && (
        <div className="text-xs rounded-lg p-3 mb-6 flex items-start gap-2" style={{ background: 'rgba(62,124,166,0.08)', color: 'var(--glacier)' }}>
          <ImageOff size={14} className="shrink-0 mt-0.5" />
          <span>
            Sin foto real todavía: no puedo incrustar de forma fiable resultados en vivo de Google Imágenes en el código.
            Pega cualquier URL de imagen en el campo <code>photoUrl</code> de "{city.name}" en los datos y se mostrará aquí automáticamente.
          </span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="rounded-xl p-4" style={{ border: '1px solid var(--tussock)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Briefcase size={15} style={{ color: 'var(--pounamu)' }} />
            <span className="text-xs font-bold uppercase" style={{ fontFamily: 'var(--font-mono)', color: 'var(--pounamu-dark)' }}>Trabajos principales</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--ink)' }}>{city.mainJobs}</p>
        </div>
        <div className="rounded-xl p-4" style={{ border: '1px solid var(--tussock)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Sun size={15} style={{ color: 'var(--track)' }} />
            <span className="text-xs font-bold uppercase" style={{ fontFamily: 'var(--font-mono)', color: 'var(--pounamu-dark)' }}>Mejor época para ir</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--ink)' }}>{city.bestSeason}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 mb-6">
        <div>
          <div className="text-xs mb-1" style={{ color: 'var(--ink)' }}>Facilidad para encontrar curro</div>
          <Meter value={city.jobEase} color="var(--pounamu)" />
        </div>
        <div>
          <div className="text-xs mb-1" style={{ color: 'var(--ink)' }}>Vida nocturna / social</div>
          <Meter value={city.nightlife} color="var(--track)" />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-6">
        {city.nightlifeTags.map((t) => (
          <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ border: '1px solid var(--tussock)', color: 'var(--glacier)' }}>{t}</span>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="font-bold text-sm mb-2" style={{ color: 'var(--pounamu)' }}>Pros</div>
          <ul className="space-y-1.5 text-sm">
            {city.pros.map((p, i) => <li key={i} style={{ color: 'var(--ink)' }}>+ {p}</li>)}
          </ul>
        </div>
        <div>
          <div className="font-bold text-sm mb-2" style={{ color: 'var(--track)' }}>Contras</div>
          <ul className="space-y-1.5 text-sm">
            {city.cons.map((p, i) => <li key={i} style={{ color: 'var(--ink)' }}>– {p}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

function CityModule() {
  const [jobFilter, setJobFilter] = useState('all');
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [selectedCity, setSelectedCity] = useState(null);

  const jobTypes = useMemo(() => {
    const set = new Set();
    CITIES.forEach((c) => c.jobTypes.forEach((j) => set.add(j)));
    return ['all', ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    return CITIES.filter((c) => {
      const jobOk = jobFilter === 'all' || c.jobTypes.includes(jobFilter);
      const avg = (c.rentMin + c.rentMax) / 2;
      let budgetOk = true;
      if (budgetFilter === 'low') budgetOk = avg < 200;
      if (budgetFilter === 'mid') budgetOk = avg >= 200 && avg <= 250;
      if (budgetFilter === 'high') budgetOk = avg > 250;
      return jobOk && budgetOk;
    });
  }, [jobFilter, budgetFilter]);

  if (selectedCity) {
    return <CityDetail city={selectedCity} onBack={() => setSelectedCity(null)} />;
  }

  return (
    <div>
      <SectionHeading eyebrow="Etapa 02 · Dónde ir" title="Comparador de ciudades y regiones" icon={MapPin} />
      <p className="text-sm mb-6 max-w-2xl" style={{ color: 'var(--glacier)' }}>
        Cifras de alquiler orientativas para habitación en piso compartido u hostel de larga estancia —
        fluctúan con la temporada, contrástalas cerca de tu fecha de llegada. Toca una ciudad para ver el detalle.
      </p>

      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div className="flex items-center gap-2">
          <Filter size={15} style={{ color: 'var(--pounamu)' }} />
          <span className="text-xs font-bold uppercase" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}>Trabajo</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {jobTypes.map((jt) => (
            <button
              key={jt}
              onClick={() => setJobFilter(jt)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition"
              style={{ background: jobFilter === jt ? 'var(--pounamu)' : 'var(--paper)', color: jobFilter === jt ? 'var(--paper)' : 'var(--ink)', border: '1px solid var(--pounamu)' }}
            >
              {jt === 'all' ? 'Todos' : jt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8 items-center">
        <div className="flex items-center gap-2">
          <Wallet size={15} style={{ color: 'var(--pounamu)' }} />
          <span className="text-xs font-bold uppercase" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}>Presupuesto / semana</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[['all', 'Cualquiera'], ['low', '< 200 NZD'], ['mid', '200–250 NZD'], ['high', '> 250 NZD']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setBudgetFilter(key)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition"
              style={{ background: budgetFilter === key ? 'var(--glacier)' : 'var(--paper)', color: budgetFilter === key ? 'var(--paper)' : 'var(--ink)', border: '1px solid var(--glacier)' }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-sm p-6 rounded-xl text-center" style={{ border: '1px dashed var(--tussock)', color: 'var(--glacier)' }}>
          Ninguna ciudad cumple ambos filtros a la vez — prueba a relajar el presupuesto.
        </div>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCity(c)}
            className="text-left rounded-2xl p-5 flex flex-col transition hover:opacity-90"
            style={{ border: '1px solid var(--tussock)' }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--ink)' }}>{c.name}</h3>
                <span className="text-xs font-semibold uppercase" style={{ fontFamily: 'var(--font-mono)', color: 'var(--glacier)' }}>{c.island}</span>
              </div>
              <ChevronRight size={18} style={{ color: 'var(--track)' }} />
            </div>

            <div className="text-2xl mb-1" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--pounamu)' }}>
              {c.rentMin}–{c.rentMax} <span className="text-sm font-normal">NZD/sem</span>
            </div>

            <div className="flex flex-wrap gap-1.5 my-3">
              {c.jobTypes.map((jt) => (
                <span key={jt} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--tussock)', color: 'var(--pounamu-dark)' }}>{jt}</span>
              ))}
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: 'var(--ink)' }}>Facilidad para encontrar curro</span>
                <Meter value={c.jobEase} color="var(--pounamu)" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: 'var(--ink)' }}>Vida nocturna / social</span>
                <Meter value={c.nightlife} color="var(--track)" />
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-auto">
              {c.nightlifeTags.slice(0, 2).map((t) => (
                <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ border: '1px solid var(--tussock)', color: 'var(--glacier)' }}>{t}</span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MODULE 3 — FIRST 7 DAYS KIT                                        */
/* ------------------------------------------------------------------ */

function FirstDaysModule({ checked, toggle }) {
  return (
    <div>
      <SectionHeading eyebrow="Etapa 03 · Primeros 7 días" title='El "First 7 Days Kit"' icon={ListChecks} />

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <TaskBlock icon={Landmark} title="Número IRD (Inland Revenue)" task={IRD_TASK} checked={checked} toggle={toggle} prefix="ird" />

          <h3 className="text-sm font-bold uppercase tracking-wide mb-3 flex items-center gap-2" style={{ color: 'var(--pounamu-dark)', fontFamily: 'var(--font-mono)' }}>
            <CreditCard size={15} /> Cuenta bancaria
          </h3>
          <div className="rounded-xl p-4 mb-3" style={{ border: '1px solid var(--tussock)' }}>
            <div className="mb-1">
              {BANK_STEPS.map((s) => (
                <MiniCheckItem key={s.id} item={s} checked={!!checked[`bank-${s.id}`]} onToggle={() => toggle(`bank-${s.id}`)} />
              ))}
            </div>
          </div>
          <div className="space-y-2 mb-6">
            {BANKS.map((b) => <ProviderCard key={b.name} p={b} checked={checked} toggle={toggle} prefix="bankprov" />)}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide mb-3 flex items-center gap-2" style={{ color: 'var(--pounamu-dark)', fontFamily: 'var(--font-mono)' }}>
            <Smartphone size={15} /> SIM y telefonía
          </h3>
          <div className="rounded-xl p-4 mb-3" style={{ border: '1px solid var(--tussock)' }}>
            <div className="mb-1">
              {SIM_STEPS.map((s) => (
                <MiniCheckItem key={s.id} item={s} checked={!!checked[`sim-${s.id}`]} onToggle={() => toggle(`sim-${s.id}`)} />
              ))}
            </div>
          </div>
          <div className="space-y-2 mb-6">
            {SIMS.map((s) => <ProviderCard key={s.name} p={s} checked={checked} toggle={toggle} prefix="simprov" />)}
          </div>

          <TaskBlock icon={Shield} title="Seguro médico internacional" task={INSURANCE_TASK} checked={checked} toggle={toggle} prefix="ins" />

          <h3 className="text-sm font-bold uppercase tracking-wide mb-3 flex items-center gap-2" style={{ color: 'var(--pounamu-dark)', fontFamily: 'var(--font-mono)' }}>
            <Sparkles size={15} /> Lo que se suele olvidar
          </h3>
          <ul className="text-xs space-y-1.5" style={{ color: 'var(--ink)' }}>
            <li className="flex gap-2"><Car size={13} className="shrink-0 mt-0.5" style={{ color: 'var(--track)' }} /> Permiso Internacional de Conducción, tramitado en España antes de volar (DGT)</li>
            <li className="flex gap-2"><Phone size={13} className="shrink-0 mt-0.5" style={{ color: 'var(--track)' }} /> Número de emergencias: <strong>111</strong> (policía, bomberos, ambulancia)</li>
            <li className="flex gap-2"><MapPin size={13} className="shrink-0 mt-0.5" style={{ color: 'var(--track)' }} /> Descargar mapas offline y, si harás roadtrip, apps de campings tipo Campermate o Rankers</li>
            <li className="flex gap-2"><Users size={13} className="shrink-0 mt-0.5" style={{ color: 'var(--track)' }} /> Unirte a grupos de Facebook de tu ciudad/región antes de aterrizar — ahí se mueve casi todo</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MODULE 4 — TRABAJO, TRANSPORTE & ALOJAMIENTO                       */
/* ------------------------------------------------------------------ */

function WorkModule() {
  return (
    <div>
      <SectionHeading eyebrow="Etapa 04 · Trabajo y vida" title="Trabajo, transporte y alojamiento" icon={Briefcase} />

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide mb-3 flex items-center gap-2" style={{ color: 'var(--pounamu-dark)', fontFamily: 'var(--font-mono)' }}>
            <Briefcase size={15} /> Búsqueda de empleo
          </h3>
          <div className="space-y-2 mb-4">
            {JOB_PORTALS.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 rounded-xl p-3 transition hover:opacity-80"
                style={{ border: '1px solid var(--tussock)' }}
              >
                <div>
                  <div className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{p.name}</div>
                  <div className="text-xs" style={{ color: 'var(--glacier)' }}>{p.detail}</div>
                </div>
                <ExternalLink size={15} style={{ color: 'var(--pounamu)' }} className="shrink-0" />
              </a>
            ))}
          </div>
          <div className="rounded-xl p-4 mb-6" style={{ background: 'rgba(62,124,166,0.08)' }}>
            <div className="text-xs font-bold uppercase mb-2" style={{ fontFamily: 'var(--font-mono)', color: 'var(--glacier)' }}>CV al estilo neozelandés</div>
            <ul className="text-xs space-y-1" style={{ color: 'var(--ink)' }}>
              <li>• Sin foto ni fecha de nacimiento</li>
              <li>• Orientado a logros con verbos de acción, no a listas de tareas</li>
              <li>• Máximo 2 páginas</li>
              <li>• Nada de "objetivo profesional" — no se estila</li>
              <li>• Referencias al final, o "disponibles a petición"</li>
            </ul>
          </div>

          <h3 className="text-sm font-bold uppercase tracking-wide mb-3 flex items-center gap-2" style={{ color: 'var(--pounamu-dark)', fontFamily: 'var(--font-mono)' }}>
            <Tent size={15} /> Alojamiento inicial
          </h3>
          <ul className="text-xs space-y-1.5" style={{ color: 'var(--ink)' }}>
            <li>• <strong>Hostels</strong> (redes YHA / BBH) para la primera semana o dos, antes de buscar algo fijo</li>
            <li>• <strong>Trade Me Flatmates</strong>, el portal principal para piso compartido</li>
            <li>• Grupos de Facebook regionales de "Flatmates wanted"</li>
            <li className="flex gap-2"><AlertTriangle size={13} className="shrink-0 mt-0.5" style={{ color: 'var(--track)' }} /> Nunca pagues depósito sin ver el piso (en persona o videollamada) ni transfieras a cuentas fuera de NZ; desconfía de precios muy por debajo de mercado</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide mb-3 flex items-center gap-2" style={{ color: 'var(--pounamu-dark)', fontFamily: 'var(--font-mono)' }}>
            <Car size={15} /> Comprar / alquilar coche o campervan
          </h3>
          <div className="space-y-3">
            <div className="rounded-xl p-4" style={{ border: '1px solid var(--tussock)' }}>
              <div className="text-sm font-bold mb-1" style={{ color: 'var(--ink)' }}>WOF (Warrant of Fitness)</div>
              <p className="text-xs" style={{ color: 'var(--glacier)' }}>La ITV neozelandesa — revisión de seguridad del vehículo, obligatoria cada 6 o 12 meses según la antigüedad del coche.</p>
            </div>
            <div className="rounded-xl p-4" style={{ border: '1px solid var(--tussock)' }}>
              <div className="text-sm font-bold mb-1" style={{ color: 'var(--ink)' }}>REGO (Vehicle Licensing)</div>
              <p className="text-xs" style={{ color: 'var(--glacier)' }}>El impuesto de circulación — se paga por bloques de 3, 6 o 12 meses. Sin REGO en vigor, no puedes circular legalmente.</p>
            </div>
            <div className="rounded-xl p-4" style={{ border: '1px solid var(--tussock)' }}>
              <div className="text-sm font-bold mb-1" style={{ color: 'var(--ink)' }}>Self-Contained Certification</div>
              <p className="text-xs" style={{ color: 'var(--glacier)' }}>Certificado que acredita que tu furgo tiene agua, fregadero y WC propios — imprescindible si quieres pernoctar en zonas de "freedom camping" gratuitas.</p>
            </div>
            <div className="rounded-xl p-4" style={{ border: '1px solid var(--tussock)' }}>
              <div className="text-sm font-bold mb-1" style={{ color: 'var(--ink)' }}>Seguro</div>
              <p className="text-xs" style={{ color: 'var(--glacier)' }}>No es obligatorio por ley, pero circular sin al menos un seguro a terceros es jugársela — hay aseguradoras específicas para furgos de backpacker.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* APP SHELL                                                           */
/* ------------------------------------------------------------------ */

const MODULES = [
  { id: 'visa', label: 'Visado', stage: '01', icon: FileText },
  { id: 'cities', label: 'Dónde ir', stage: '02', icon: Compass },
  { id: 'firstdays', label: 'Primeros 7 días', stage: '03', icon: ListChecks },
  { id: 'work', label: 'Trabajo y vida', stage: '04', icon: Briefcase },
];

export default function WHVDashboard() {
  const [active, setActive] = useState('visa');
  const [checked, setChecked] = useState({});

  const toggle = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh', fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Work+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');

        :root {
          --paper: #F6F3EA;
          --ink: #1C2B22;
          --pounamu: #2F6B4F;
          --pounamu-dark: #1F4A36;
          --glacier: #3E7CA6;
          --track: #E17F35;
          --tussock: #DCCEA8;
          --font-display: 'Barlow Condensed', sans-serif;
          --font-body: 'Work Sans', sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
        }

        @keyframes stampPop {
          0% { transform: rotate(-9deg) scale(0); opacity: 0; }
          60% { transform: rotate(-9deg) scale(1.25); opacity: 1; }
          100% { transform: rotate(-9deg) scale(1); opacity: 1; }
        }
        .stamp-pop { animation: stampPop 0.35s ease-out; }

        .contour-bg {
          position: absolute; inset: 0; opacity: 0.12; pointer-events: none;
          background-image:
            repeating-radial-gradient(circle at 15% 30%, transparent 0, transparent 14px, var(--paper) 15px, var(--paper) 16px),
            repeating-radial-gradient(circle at 85% 75%, transparent 0, transparent 18px, var(--paper) 19px, var(--paper) 20px);
        }
      `}</style>

      <header style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center gap-3">
          <Mountain size={26} style={{ color: 'var(--track)' }} />
          <div>
            <div className="text-lg md:text-xl leading-none" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '0.02em' }}>
              WHV AOTEAROA
            </div>
            <div className="text-xs" style={{ color: 'var(--tussock)', fontFamily: 'var(--font-mono)' }}>
              Kete digital para tu Working Holiday en Nueva Zelanda
            </div>
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-20" style={{ background: 'var(--paper)', borderBottom: '1px solid var(--tussock)' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex overflow-x-auto">
          {MODULES.map((m) => {
            const Icon = m.icon;
            const isActive = active === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActive(m.id)}
                className="flex items-center gap-2 px-4 md:px-5 py-4 shrink-0 transition"
                style={{ borderBottom: isActive ? '3px solid var(--track)' : '3px solid transparent', color: isActive ? 'var(--pounamu-dark)' : 'var(--glacier)' }}
              >
                <span
                  className="text-xs font-bold px-1.5 rounded"
                  style={{ fontFamily: 'var(--font-mono)', background: isActive ? 'var(--track)' : 'var(--tussock)', color: isActive ? 'var(--paper)' : 'var(--pounamu-dark)' }}
                >
                  {m.stage}
                </span>
                <Icon size={16} />
                <span className="text-sm font-semibold whitespace-nowrap">{m.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-10">
        {active === 'visa' && <VisaModule checked={checked} toggle={toggle} />}
        {active === 'cities' && <CityModule />}
        {active === 'firstdays' && <FirstDaysModule checked={checked} toggle={toggle} />}
        {active === 'work' && <WorkModule />}
      </main>

      <footer className="max-w-6xl mx-auto px-4 md:px-8 py-6 text-xs" style={{ color: 'var(--glacier)' }}>
        Cifras orientativas para planificar — verifica siempre precios y requisitos actuales antes de tomar decisiones.
      </footer>
    </div>
  );
}
