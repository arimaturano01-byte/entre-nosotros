import React, { useState } from 'react';
import {
  ArrowRight,
  Heart,
  HelpCircle,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Sprout,
  X,
} from 'lucide-react';
import { CoupleProfile } from '../types';
import { IMAGES } from '../data/initialData';
import { SafeImage } from './SafeImage';

interface WelcomeScreenProps {
  couple: CoupleProfile;
  onEnterApp: (updatedCouple?: Partial<CoupleProfile>) => void;
  onNotify: (msg: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  couple,
  onEnterApp,
  onNotify,
}) => {
  const [showExplainer, setShowExplainer] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const [name1, setName1] = useState(couple.partner1);
  const [name2, setName2] = useState(couple.partner2);
  const [startDate, setStartDate] = useState(couple.startDate);
  const [joinCode, setJoinCode] = useState(couple.coupleCode);
  const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

  const handleCreateSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    await createUserWithEmailAndPassword(auth, email.trim(), password);

    onEnterApp({
      partner1: name1.trim(),
      partner2: name2.trim(),
      startDate: startDate,
    });

    onNotify('¡Tu cuenta se creó correctamente!');
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      onNotify('Este correo ya tiene una cuenta.');
    } else if (error.code === 'auth/invalid-email') {
      onNotify('El correo electrónico no es válido.');
    } else if (error.code === 'auth/weak-password') {
      onNotify('La contraseña debe tener al menos 6 caracteres.');
    } else {
      onNotify('No se pudo crear la cuenta. Inténtalo nuevamente.');
    }
  }
};

const handleJoinSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!joinCode.trim()) {
    onNotify('Introduce tu código de pareja');
    return;
  }

  onEnterApp({ coupleCode: joinCode.trim().toUpperCase() });
  onNotify(`Conectado al espacio ${joinCode.trim().toUpperCase()}`);
};

  

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col items-center justify-center px-5 py-8 relative overflow-hidden">
      {/* Ambient soft blush & sage glows */}
      <div className="absolute -top-16 -left-20 w-72 h-72 rounded-full bg-primary-container/30 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-16 w-72 h-72 rounded-full bg-secondary-container/40 blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
        {/* Left column: Brand + Copy + CTAs */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="relative mb-4">
            <div className="w-16 h-16 rounded-full p-1 bg-surface-container-low shadow-sm flex items-center justify-center border border-outline-variant/30">
              <SafeImage
                src={IMAGES.logo}
                alt="Entre Nosotros"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-secondary-fixed flex items-center justify-center shadow-xs">
              <Sprout className="w-3.5 h-3.5 text-secondary" />
            </div>
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl font-semibold text-on-surface tracking-tight text-balance">
            Entre Nosotros
          </h1>
          <p className="font-editorial italic text-lg text-on-surface-variant mt-2">
            “Un lugar para todo lo que somos.”
          </p>

          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high/80 text-on-primary-container text-xs font-medium">
            <Lock className="w-3.5 h-3.5 text-primary" />
            <span>Nuestro pequeño rincón privado a salvo del mundo</span>
          </div>

          {/* Mobile Polaroid inline preview */}
          <div className="md:hidden w-full flex justify-center my-6">
            <PolaroidShowcase />
          </div>

          <div className="flex flex-col w-full max-w-sm gap-3 mt-4 md:mt-8">
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="group w-full py-4 px-6 rounded-full bg-primary-container text-on-primary-container font-semibold text-sm shadow-[0_6px_20px_rgba(122,84,94,0.2)] flex items-center justify-center gap-2 transition-transform active:scale-[0.98] hover:shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Crear nuestro espacio</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={() => setShowJoinModal(true)}
              className="w-full py-3.5 px-6 rounded-full bg-surface-container-lowest text-on-surface-variant font-semibold text-sm shadow-xs border border-outline-variant/40 flex items-center justify-center gap-2 transition-colors active:scale-[0.98] hover:bg-surface-container-low cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-secondary" />
              <span>Ya tenemos un espacio</span>
            </button>

            <div className="flex justify-center md:justify-start mt-1">
              <button
                type="button"
                onClick={() => setShowExplainer(true)}
                className="inline-flex items-center gap-1.5 py-2 text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-outline" />
                <span className="underline decoration-outline-variant underline-offset-4">
                  ¿Cómo funciona el código de pareja?
                </span>
              </button>
            </div>
          </div>

          <footer className="mt-6 flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-secondary" />
              <span>Espacio cifrado y privado para dos personas</span>
            </div>
            <p className="text-[11px] text-outline mt-2">
              Sin algoritmos, sin extraños, sin distracciones.
            </p>
          </footer>
        </div>

        {/* Desktop Polaroid Showcase */}
        <div className="hidden md:flex justify-center items-center py-6">
          <PolaroidShowcase />
        </div>
      </div>

      {/* Sheet: ¿Cómo funciona el código de pareja? */}
      {showExplainer && (
        <div
          className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setShowExplainer(false)}
        >
          <div
            className="w-full max-w-md bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-outline-variant rounded-full mx-auto sm:hidden" />
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-editorial text-xl text-on-surface font-medium">
                  Conectar en Pareja
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Tres sencillos pasos para estar juntos
                </p>
              </div>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => setShowExplainer(false)}
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {[
                {
                  num: '1',
                  title: 'Crea tu rincón',
                  desc: 'Uno de los dos inicia la creación y recibe un código secreto de pareja.',
                },
                {
                  num: '2',
                  title: 'Envía la llave',
                  desc: 'Comparte el código por mensaje privado como si fuera una cartita sellada.',
                },
                {
                  num: '3',
                  title: 'El santuario es vuestro',
                  desc: 'Al introducir el código, sus dos cuentas quedan enlazadas en un álbum común.',
                },
              ].map((step) => (
                <div
                  key={step.num}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-surface-container-low"
                >
                  <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary-container text-xs font-semibold flex items-center justify-center shrink-0">
                    {step.num}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-on-surface">
                      {step.title}
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowExplainer(false)}
              className="w-full py-3 rounded-full bg-primary-container text-on-primary-container font-semibold text-sm shadow-xs cursor-pointer"
            >
              Entendido, ¡empecemos!
            </button>
          </div>
        </div>
      )}

      {/* Modal: Crear nuestro espacio */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="w-full max-w-md bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-primary">
                  Nuevo Capítulo
                </span>
                <h2 className="font-editorial text-xl text-on-surface">
                  Crear nuestro espacio
                </h2>
              </div>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => setShowCreateModal(false)}
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Tu nombre
                  </label>
                  <input
                    type="text"
                    required
                    value={name1}
                    onChange={(e) => setName1(e.target.value)}
                    className="w-full bg-surface-container-low rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Su nombre
                  </label>
                  <input
                    type="text"
                    required
                    value={name2}
                    onChange={(e) => setName2(e.target.value)}
                    className="w-full bg-surface-container-low rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                  />
                </div>
              </div>
              <div>
  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
    Tu correo electrónico
  </label>
  <input
    type="email"
    required
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full bg-surface-container-low rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
    placeholder="tucorreo@ejemplo.com"
  />
</div>

<div>
  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
    Crea una contraseña
  </label>
  <input
    type="password"
    required
    minLength={6}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full bg-surface-container-low rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
    placeholder="Mínimo 6 caracteres"
  />
</div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Fecha de inicio de su historia
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-surface-container-low rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-primary text-on-primary font-semibold text-sm shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
              >
                Entrar a nuestro diario
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Ya tenemos un espacio */}
      {showJoinModal && (
        <div
          className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setShowJoinModal(false)}
        >
          <div
            className="w-full max-w-md bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-secondary">
                  Vincular Pareja
                </span>
                <h2 className="font-editorial text-xl text-on-surface">
                  Ya tenemos un espacio
                </h2>
              </div>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => setShowJoinModal(false)}
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleJoinSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Código secreto de pareja
                </label>
                <input
                  type="text"
                  required
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="Ej. AMOR-8492"
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-lg font-editorial tracking-widest text-primary focus:outline-none focus:ring-2 focus:ring-primary-container"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-primary text-on-primary font-semibold text-sm shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
              >
                Abrir nuestro espacio
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const PolaroidShowcase: React.FC = () => (
  <div className="relative w-full max-w-[320px] flex justify-center items-center">
    {/* Decorative background sage tape */}
    <div className="absolute -left-4 top-8 -rotate-12 w-16 h-6 bg-secondary-container/80 rounded-sm pointer-events-none" />

    <div className="relative w-full bg-surface-container-lowest pt-3 px-3 pb-7 rounded-2xl shadow-[0_12px_32px_rgba(73,58,59,0.1)] -rotate-1 hover:rotate-0 transition-transform duration-300">
      {/* Top rose washi tape */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-primary-container/80 backdrop-blur-xs rounded-xs shadow-xs z-20 -rotate-1" />

      {/* Top right floral badge */}
      <div className="absolute -top-2.5 -right-2.5 z-30 w-8 h-8 rounded-full bg-secondary-fixed shadow-sm flex items-center justify-center rotate-12">
        <Sprout className="w-4 h-4 text-secondary" />
      </div>

      <div className="relative w-full aspect-[4/4.2] overflow-hidden rounded-xl bg-surface-container">
        <SafeImage
          src={IMAGES.welcomePolaroid}
          alt="Atardecer juntos en nuestro rincón favorito"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/25 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm shadow-xs flex items-center gap-1">
          <Heart className="w-3.5 h-3.5 text-primary fill-primary" />
          <span className="text-[11px] font-medium text-on-surface">
            Atardecer 17 de Oct
          </span>
        </div>
      </div>

      <div className="mt-3.5 text-center">
        <p className="font-editorial italic text-xl text-on-surface">
          Donde el tiempo se detiene
        </p>
        <p className="text-[11px] text-outline mt-1">
          Capítulo 1 · Solo tú y yo
        </p>
      </div>

      <div className="absolute -bottom-2 -left-2 w-8 h-8 rounded-lg bg-surface-container-high shadow-xs flex items-center justify-center -rotate-6 z-20">
        <Mail className="w-4 h-4 text-primary" />
      </div>
    </div>
  </div>
);
