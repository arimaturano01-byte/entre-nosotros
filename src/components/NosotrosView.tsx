import React, { useState } from 'react';
import {
  BellOff,
  Cake,
  CalendarHeart,
  Check,
  ChevronRight,
  CloudCog,
  Coffee,
  Copy,
  Heart,
  Infinity as InfinityIcon,
  Key,
  Lock,
  PartyPopper,
  PawPrint,
  PlusCircle,
  Share2,
  Smartphone,
  Sparkles,
  X,
} from 'lucide-react';
import {
  AppSettings,
  CoupleProfile,
  MilestoneItem,
  PlanItem,
} from '../types';
import { calculateLoveDuration } from '../utils/loveTime';
import { SafeImage } from './SafeImage';

interface NosotrosViewProps {
  couple: CoupleProfile;
  milestones: MilestoneItem[];
  settings: AppSettings;
  onUpdateCouple: (patch: Partial<CoupleProfile>) => void;
  onAddMilestone: (milestone: Omit<MilestoneItem, 'id'>) => void;
  onUpdateSettings: (patch: Partial<AppSettings>) => void;
  onAddPlan: (plan: Omit<PlanItem, 'id'>) => void;
  onShowWelcome: () => void;
  onTestPinLock: () => void;
  onNotify: (msg: string) => void;
}

export const NosotrosView: React.FC<NosotrosViewProps> = ({
  couple,
  milestones,
  settings,
  onUpdateCouple,
  onAddMilestone,
  onUpdateSettings,
  onAddPlan,
  onShowWelcome,
  onTestPinLock,
  onNotify,
}) => {
  const [copied, setCopied] = useState(false);
  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
  const [editCoupleModalOpen, setEditCoupleModalOpen] = useState(false);
  const [giftModalOpen, setGiftModalOpen] = useState(false);

  // Milestone form
  const [msTitle, setMsTitle] = useState('');
  const [msDateLabel, setMsDateLabel] = useState('');
  const [msTag, setMsTag] = useState('Especial');
  const [msIcon, setMsIcon] = useState<MilestoneItem['icon']>('heart');
  const [msDescription, setMsDescription] = useState('');

  // Couple edit form
  const [p1, setP1] = useState(couple.partner1);
  const [p2, setP2] = useState(couple.partner2);
  const [startDate, setStartDate] = useState(couple.startDate);
  const [heroLocation, setHeroLocation] = useState(couple.heroLocation);

  // Birthday gift idea form
  const [giftTitle, setGiftTitle] = useState('Cena sorpresa y álbum impreso');
  const [giftNotes, setGiftNotes] = useState('Envolver con papel kraft y flores secas.');

  const duration = calculateLoveDuration(couple.startDate);

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(couple.coupleCode);
    }
    setCopied(true);
    onNotify(`Código ${couple.coupleCode} copiado`);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Únete a nuestro espacio Entre Nosotros con el código: ${couple.coupleCode}`
      );
    }
    onNotify(`¡Enlace privado copiado para ${couple.partner2}!`);
  };

  const renderMilestoneIcon = (icon: MilestoneItem['icon']) => {
    switch (icon) {
      case 'coffee':
        return <Coffee className="w-3 h-3" />;
      case 'pets':
        return <PawPrint className="w-3 h-3" />;
      case 'key':
        return <Key className="w-3 h-3" />;
      case 'sparkles':
        return <Sparkles className="w-3 h-3" />;
      default:
        return <Heart className="w-3 h-3 fill-current" />;
    }
  };

  const handleSaveMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msTitle.trim() || !msDescription.trim()) return;
    onAddMilestone({
      title: msTitle.trim(),
      dateLabel: msDateLabel.trim() || 'Hoy',
      tag: msTag.trim() || 'Hito',
      icon: msIcon,
      description: msDescription.trim(),
      accentColor: msIcon === 'pets' ? 'secondary' : 'primary',
    });
    setMsTitle('');
    setMsDateLabel('');
    setMsDescription('');
    setMilestoneModalOpen(false);
    onNotify('Nuevo hito añadido a nuestra línea del tiempo');
  };

  const handleSaveCouple = (e: React.FormEvent) => {
    e.preventDefault();
    if (!p1.trim() || !p2.trim()) return;
    onUpdateCouple({
      partner1: p1.trim(),
      partner2: p2.trim(),
      startDate,
      heroLocation: heroLocation.trim() || 'Nuestro lugar',
    });
    setEditCoupleModalOpen(false);
    onNotify('Datos de nuestro espacio actualizados');
  };

  const handleSaveGiftPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftTitle.trim()) return;
    onAddPlan({
      title: `Cumpleaños de ${couple.partner1}: ${giftTitle.trim()}`,
      category: 'suenos',
      categoryLabel: 'Sueños',
      dateLabel: '28 de Diciembre',
      notes: giftNotes.trim(),
      isPriority: true,
      completed: false,
    });
    setGiftModalOpen(false);
    onNotify('Idea de regalo guardada en Planes');
  };

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Editorial Header */}
      <section className="flex flex-col items-center text-center pt-1">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-surface-container rounded-full mb-2.5 shadow-xs">
          <Heart className="w-3.5 h-3.5 text-primary fill-primary" />
          <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
            Capítulo Compartido
          </span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-primary tracking-tight">
          Nosotros
        </h1>
        <p className="font-editorial text-base text-on-surface-variant mt-1 italic">
          Nuestra historia escrita de a dos
        </p>
      </section>

      {/* Top Two-Column Grid on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Intertwined Couple Profile Card */}
        <section className="lg:col-span-7 relative bg-surface-container-low rounded-3xl p-6 shadow-xs flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-28 h-4 bg-primary-container/75 rounded-xs -rotate-1 shadow-xs pointer-events-none" />

          <div className="relative flex items-center justify-center h-28 w-44 mt-1">
            <div className="absolute left-2 w-20 h-20 rounded-full overflow-hidden shadow-md ring-2 ring-surface z-10 bg-primary-container">
              <SafeImage
                src={couple.avatar1Url}
                alt={couple.partner1}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute z-30 w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-md ring-2 ring-primary-fixed text-on-primary">
              <InfinityIcon className="w-4 h-4" />
            </div>
            <div className="absolute right-2 w-20 h-20 rounded-full overflow-hidden shadow-md ring-2 ring-surface z-20 bg-secondary-container">
              <SafeImage
                src={couple.avatar2Url}
                alt={couple.partner2}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col items-center mt-2 text-center w-full">
            <h2 className="font-editorial text-2xl font-semibold text-on-surface">
              {couple.partner1}{' '}
              <span className="text-primary italic font-medium">&amp;</span>{' '}
              {couple.partner2}
            </h2>
            <div className="mt-1.5 inline-flex items-center gap-1.5 px-3.5 py-1 bg-surface-container-high rounded-full shadow-xs">
              <CalendarHeart className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs text-on-surface-variant font-medium">
                Desde el {duration.formattedStartDate}
              </span>
            </div>

            <div className="mt-4 flex flex-col items-center bg-surface-container-lowest rounded-2xl px-6 py-4 shadow-xs w-full border border-primary-container/40">
              <span className="text-primary font-editorial text-4xl sm:text-5xl leading-none font-semibold tracking-tight tabular-nums">
                {duration.totalDays.toLocaleString('es-ES')}
              </span>
              <span className="text-[11px] text-on-surface-variant uppercase tracking-widest font-semibold mt-2">
                Días construyendo nuestro hogar
              </span>
            </div>
          </div>
        </section>

        {/* Couple Code & Sync Card */}
        <section className="lg:col-span-5 bg-surface-container-low rounded-3xl p-6 shadow-xs flex flex-col justify-between gap-4 border border-primary-container/50">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
              <span className="text-xs font-semibold text-on-secondary-container">
                Espacio compartido activo
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] text-secondary bg-secondary-container px-2.5 py-1 rounded-full font-medium">
              <Smartphone className="w-3.5 h-3.5" />
              Ambos conectados
            </span>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs flex items-center justify-between border border-outline-variant/30">
            <div>
              <span className="text-xs text-on-surface-variant flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-primary" />
                Código secreto de pareja
              </span>
              <span className="font-editorial text-2xl text-primary tracking-widest mt-0.5 block font-semibold">
                {couple.coupleCode}
              </span>
            </div>
            <button
              type="button"
              aria-label="Copiar código"
              onClick={handleCopyCode}
              className="w-11 h-11 rounded-full bg-surface-container-high hover:bg-surface-container text-primary active:scale-95 transition-all flex items-center justify-center shadow-xs cursor-pointer"
            >
              {copied ? <Check className="w-5 h-5 text-secondary" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={handleShareLink}
              className="w-full py-3.5 px-5 rounded-full bg-primary text-on-primary text-sm font-semibold flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all hover:bg-surface-tint cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Compartir enlace íntimo</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setP1(couple.partner1);
                setP2(couple.partner2);
                setStartDate(couple.startDate);
                setHeroLocation(couple.heroLocation);
                setEditCoupleModalOpen(true);
              }}
              className="w-full py-2.5 px-4 rounded-full bg-surface-container-lowest border border-outline-variant/40 text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            >
              Editar nombres y fecha de aniversario
            </button>
          </div>
        </section>
      </div>

      {/* Scrapbook Timeline: Línea del Tiempo */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-editorial text-2xl font-medium text-on-surface">
              Línea del Tiempo
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setMilestoneModalOpen(true)}
            className="text-xs sm:text-sm font-semibold text-primary flex items-center gap-1 hover:underline py-1.5 px-3 rounded-full bg-surface-container-low cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nuevo hito</span>
          </button>
        </div>

        <div className="relative pl-6 flex flex-col gap-4">
          <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-primary-container/60 rounded-full" />
          {milestones.map((ms) => (
            <div
              key={ms.id}
              className="relative flex flex-col bg-surface-container-low rounded-2xl p-4 shadow-xs border border-outline-variant/20"
            >
              <div
                className={`absolute -left-6 top-4 w-5 h-5 rounded-full flex items-center justify-center shadow-xs ring-2 ring-surface ${
                  ms.accentColor === 'secondary'
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-primary text-on-primary'
                }`}
              >
                {renderMilestoneIcon(ms.icon)}
              </div>

              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xs text-primary font-semibold">{ms.dateLabel}</span>
                <span className="text-xs text-on-surface-variant flex items-center gap-1 font-medium">
                  {renderMilestoneIcon(ms.icon)}
                  <span>{ms.tag}</span>
                </span>
              </div>

              <h3 className="font-editorial text-lg font-semibold text-on-surface">
                {ms.title}
              </h3>
              <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                {ms.description}
              </p>

              {ms.imageUrl && (
                <div className="mt-3 pt-2 pb-3.5 px-2.5 bg-surface-container-lowest rounded-xl shadow-sm rotate-1 max-w-[220px] self-start border border-outline-variant/30">
                  <div className="w-full h-28 rounded-md overflow-hidden bg-surface-container">
                    <SafeImage
                      src={ms.imageUrl}
                      alt={ms.imageCaption || ms.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {ms.imageCaption && (
                    <span className="block text-center font-editorial text-xs text-on-surface-variant mt-1.5 italic font-medium">
                      {ms.imageCaption}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom 2-Column Split: Próximos Momentos & Privacidad & Ajustes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximos Momentos */}
        <section className="flex flex-col gap-3">
          <h2 className="font-editorial text-xl font-medium text-on-surface">
            Próximos Momentos
          </h2>

          <div className="space-y-3">
            <div className="bg-surface-container-high rounded-2xl p-4 shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-xs shrink-0">
                  <PartyPopper className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-editorial text-base font-semibold text-on-surface truncate">
                    {duration.nextMilestoneTitle}
                  </h4>
                  <span className="text-xs text-on-surface-variant">
                    {duration.milestoneDateLabel}
                  </span>
                </div>
              </div>
              <span className="text-xs text-primary bg-primary-fixed px-3 py-1 rounded-full font-semibold shrink-0 tabular-nums">
                En {duration.daysToMilestone} días
              </span>
            </div>

            <div className="bg-surface-container rounded-2xl p-4 shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shadow-xs shrink-0">
                  <Cake className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-editorial text-base font-semibold text-on-surface truncate">
                    Cumpleaños de {couple.partner1}
                  </h4>
                  <span className="text-xs text-on-surface-variant">28 de Diciembre</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setGiftModalOpen(true)}
                className="text-xs text-secondary bg-surface-container-lowest hover:bg-secondary hover:text-on-secondary px-3.5 py-1.5 rounded-full font-semibold shadow-xs transition-colors shrink-0 cursor-pointer"
              >
                Planear regalo
              </button>
            </div>
          </div>
        </section>

        {/* Privacidad & Ajustes */}
        <section className="flex flex-col gap-3">
          <h2 className="font-editorial text-xl font-medium text-on-surface">
            Privacidad &amp; Ajustes
          </h2>

          <div className="bg-surface-container-low rounded-3xl p-2.5 flex flex-col gap-1.5 shadow-xs border border-outline-variant/25">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-surface hover:bg-surface-container/60 transition-colors gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-on-surface">
                    Bloqueo con Face ID / PIN
                  </p>
                  <p className="text-xs text-on-surface-variant truncate">
                    Tu diario protegido de miradas curiosas
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {settings.faceIdLock && (
                  <button
                    type="button"
                    onClick={onTestPinLock}
                    className="text-[11px] font-semibold text-tertiary hover:underline cursor-pointer"
                  >
                    Probar
                  </button>
                )}
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.faceIdLock}
                  aria-label="Alternar bloqueo PIN"
                  onClick={() => {
                    const next = !settings.faceIdLock;
                    onUpdateSettings({ faceIdLock: next });
                    onNotify(next ? 'Bloqueo íntimo activado' : 'Bloqueo íntimo desactivado');
                  }}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                    settings.faceIdLock ? 'bg-primary' : 'bg-surface-container-highest'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                      settings.faceIdLock ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-surface gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                  <CloudCog className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-on-surface">
                    Copia cifrada de recuerdos
                  </p>
                  <p className="text-xs text-on-surface-variant truncate">
                    Guardado privado en tu dispositivo
                  </p>
                </div>
              </div>
              <span className="text-xs text-secondary bg-secondary-container px-2.5 py-1 rounded-full font-medium shrink-0">
                Al día
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setP1(couple.partner1);
                setP2(couple.partner2);
                setStartDate(couple.startDate);
                setHeroLocation(couple.heroLocation);
                setEditCoupleModalOpen(true);
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-surface hover:bg-surface-container/60 text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                  <CalendarHeart className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-on-surface">
                    Fecha de aniversario
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {duration.formattedStartDate}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-on-surface-variant shrink-0" />
            </button>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-surface gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                  <BellOff className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-on-surface">
                    Notificaciones suaves
                  </p>
                  <p className="text-xs text-on-surface-variant truncate">
                    Solo cartas sorpresa y la pregunta del día
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.softNotifications}
                aria-label="Alternar notificaciones suaves"
                onClick={() => {
                  const next = !settings.softNotifications;
                  onUpdateSettings({ softNotifications: next });
                  onNotify(
                    next
                      ? 'Notificaciones suaves activadas'
                      : 'Notificaciones silenciadas'
                  );
                }}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                  settings.softNotifications ? 'bg-primary' : 'bg-surface-container-highest'
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                    settings.softNotifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onShowWelcome}
            className="text-xs font-semibold text-primary hover:underline self-center pt-1 cursor-pointer"
          >
            Ver pantalla de bienvenida y código de pareja
          </button>
        </section>
      </div>

      {/* Footer quote */}
      <footer className="flex flex-col items-center justify-center text-center pt-2 pb-2">
        <div className="w-10 h-0.5 bg-primary-container mb-2 rounded-full" />
        <p className="font-editorial text-sm text-primary italic">
          &ldquo;Amar es mirar juntos en la misma dirección.&rdquo;
        </p>
        <span className="text-[11px] text-on-surface-variant mt-1">
          Entre Nosotros · Espacio íntimo para dos
        </span>
      </footer>

      {/* ADD MILESTONE MODAL */}
      {milestoneModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-inverse-surface/45 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setMilestoneModalOpen(false)}
        >
          <div
            className="bg-surface-bright w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <h3 className="font-editorial text-2xl text-on-surface">Nuevo hito</h3>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => setMilestoneModalOpen(false)}
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveMilestone} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Título del hito *
                </label>
                <input
                  type="text"
                  required
                  value={msTitle}
                  onChange={(e) => setMsTitle(e.target.value)}
                  placeholder="Ej. Nuestro primer concierto juntos"
                  className="w-full bg-surface-container-lowest rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    Fecha
                  </label>
                  <input
                    type="text"
                    value={msDateLabel}
                    onChange={(e) => setMsDateLabel(e.target.value)}
                    placeholder="Ej. 14 Oct 2024"
                    className="w-full bg-surface-container-lowest rounded-xl px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    Etiqueta
                  </label>
                  <input
                    type="text"
                    value={msTag}
                    onChange={(e) => setMsTag(e.target.value)}
                    placeholder="Ej. Viaje"
                    className="w-full bg-surface-container-lowest rounded-xl px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Icono
                </label>
                <div className="flex gap-2">
                  {(
                    [
                      { id: 'heart', label: 'Amor' },
                      { id: 'coffee', label: 'Café' },
                      { id: 'pets', label: 'Mascota' },
                      { id: 'key', label: 'Hogar' },
                      { id: 'sparkles', label: 'Magia' },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMsIcon(item.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer ${
                        msIcon === item.id
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Recuerdo breve *
                </label>
                <textarea
                  rows={3}
                  required
                  value={msDescription}
                  onChange={(e) => setMsDescription(e.target.value)}
                  placeholder="¿Cómo lo vivieron?"
                  className="w-full bg-surface-container-lowest rounded-xl p-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-primary text-on-primary text-sm font-semibold cursor-pointer"
              >
                Guardar hito
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT COUPLE MODAL */}
      {editCoupleModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-inverse-surface/45 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setEditCoupleModalOpen(false)}
        >
          <div
            className="bg-surface-bright w-full max-w-md rounded-3xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <h3 className="font-editorial text-2xl text-on-surface">
                Nuestro Espacio
              </h3>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => setEditCoupleModalOpen(false)}
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveCouple} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    Tu nombre
                  </label>
                  <input
                    type="text"
                    required
                    value={p1}
                    onChange={(e) => setP1(e.target.value)}
                    className="w-full bg-surface-container-lowest rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    Su nombre
                  </label>
                  <input
                    type="text"
                    required
                    value={p2}
                    onChange={(e) => setP2(e.target.value)}
                    className="w-full bg-surface-container-lowest rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Fecha de aniversario
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-surface-container-lowest rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Lugar de portada
                </label>
                <input
                  type="text"
                  value={heroLocation}
                  onChange={(e) => setHeroLocation(e.target.value)}
                  className="w-full bg-surface-container-lowest rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-primary text-on-primary text-sm font-semibold cursor-pointer"
              >
                Guardar cambios
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PLAN BIRTHDAY GIFT MODAL */}
      {giftModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-inverse-surface/45 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setGiftModalOpen(false)}
        >
          <div
            className="bg-surface-bright w-full max-w-md rounded-3xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <h3 className="font-editorial text-2xl text-on-surface">
                Planear regalo para {couple.partner1}
              </h3>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => setGiftModalOpen(false)}
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveGiftPlan} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Idea de sorpresa
                </label>
                <input
                  type="text"
                  required
                  value={giftTitle}
                  onChange={(e) => setGiftTitle(e.target.value)}
                  className="w-full bg-surface-container-lowest rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Notas secretas
                </label>
                <textarea
                  rows={2}
                  value={giftNotes}
                  onChange={(e) => setGiftNotes(e.target.value)}
                  className="w-full bg-surface-container-lowest rounded-xl p-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-secondary text-on-secondary text-sm font-semibold cursor-pointer"
              >
                Guardar en Planes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
