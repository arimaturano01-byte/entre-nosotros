import React, { useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  Camera,
  Compass,
  Heart,
  HelpCircle,
  Hourglass,
  Lock,
  Mail,
  PartyPopper,
  Quote,
  RefreshCw,
  Send,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Star,
} from 'lucide-react';
import {
  CoupleProfile,
  DailyQuestion,
  DailyThought,
  LetterItem,
  MemoryItem,
  PlanItem,
  TabId,
} from '../types';
import { calculateLoveDuration, getTodayHeaderEs } from '../utils/loveTime';
import { SafeImage } from './SafeImage';

interface InicioViewProps {
  couple: CoupleProfile;
  memories: MemoryItem[];
  letters: LetterItem[];
  plans: PlanItem[];
  thoughts: DailyThought[];
  questions: DailyQuestion[];
  onSwitchTab: (tab: TabId) => void;
  onOpenNewMemory: () => void;
  onSelectMemory: (memory: MemoryItem) => void;
  onToggleThoughtFavorite: (id: string) => void;
  onSubmitQuestionAnswer: (questionId: string, answerText: string) => void;
  onNotify: (msg: string) => void;
}

export const InicioView: React.FC<InicioViewProps> = ({
  couple,
  memories,
  letters,
  plans,
  thoughts,
  questions,
  onSwitchTab,
  onOpenNewMemory,
  onSelectMemory,
  onToggleThoughtFavorite,
  onSubmitQuestionAnswer,
  onNotify,
}) => {
  const [isDaysMode, setIsDaysMode] = useState(false);
  const [thoughtIndex, setThoughtIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answerDraft, setAnswerDraft] = useState('');

  const duration = calculateLoveDuration(couple.startDate);
  const todayLabel = getTodayHeaderEs();

  const currentThought = thoughts[thoughtIndex % thoughts.length];
  const currentQuestion = questions[questionIndex % questions.length];

  const unreadLettersCount = letters.filter((l) => l.status === 'unread').length;
  const pendingPlans = plans.filter((p) => !p.completed);
  const nextPlan = pendingPlans.find((p) => p.isNext) || pendingPlans[0];
  const recentMemories = memories.slice(0, 2);

  const handleCopyQuote = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`«${currentThought.quote}»`);
    }
    onNotify('Frase copiada al portapapeles');
  };

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = answerDraft.trim();
    if (!trimmed) return;
    onSubmitQuestionAnswer(currentQuestion.id, trimmed);
    setAnswerDraft('');
    onNotify(`Respuesta enviada a ${couple.partner1}`);
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Editorial Date Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex flex-col">
          <span className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">
            {todayLabel}
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-on-surface tracking-tight mt-0.5">
            Nuestra historia
          </h1>
        </div>
        <div className="px-3.5 py-1.5 bg-surface-container-high rounded-full flex items-center gap-1.5 shadow-xs shrink-0">
          <Heart className="w-3.5 h-3.5 text-primary fill-primary" />
          <span className="text-xs font-semibold text-primary tabular-nums">
            Día {duration.totalDays.toLocaleString('es-ES')}
          </span>
        </div>
      </div>

      {/* Main Responsive Editorial Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols on lg): Hero Polaroid + Quick Save CTA */}
        <div className="lg:col-span-5 flex flex-col space-y-5">
          <div className="relative bg-surface-container-lowest rounded-3xl p-4 shadow-[0_8px_24px_-4px_rgba(73,58,59,0.07)]">
            {/* Washi tape top */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-primary-container/75 backdrop-blur-xs rounded-xs shadow-xs -rotate-1 pointer-events-none flex items-center justify-center z-10">
              <span className="text-[9px] uppercase tracking-widest text-on-primary-container font-semibold">
                Entre Nosotros
              </span>
            </div>

            <div className="bg-surface-container-lowest p-2 pb-5 rounded-2xl shadow-xs -rotate-[0.8deg] hover:rotate-0 transition-transform duration-300">
              <div className="relative overflow-hidden rounded-xl aspect-[4/3] w-full bg-surface-container">
                <SafeImage
                  src={couple.heroPhotoUrl}
                  alt={`${couple.partner1} y ${couple.partner2} en ${couple.heroLocation}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-surface-container-lowest/85 backdrop-blur-md rounded-full flex items-center gap-1 shadow-xs">
                  <Heart className="w-3 h-3 text-primary fill-primary" />
                  <span className="text-[11px] text-on-surface font-medium">
                    {couple.heroLocation}
                  </span>
                </div>
              </div>
              <div className="text-center mt-3">
                <h2 className="font-editorial text-2xl italic tracking-wide text-on-surface">
                  {couple.partner1} &amp; {couple.partner2}
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Juntos desde el {duration.formattedStartDate}
                </p>
              </div>
            </div>

            {/* Interactive Duration Counter */}
            <div className="mt-3 bg-surface-container-low rounded-2xl p-4 flex flex-col items-center">
              <div className="flex items-center justify-between w-full">
                <span className="text-[11px] text-secondary font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Hourglass className="w-3.5 h-3.5" />
                  Nuestro viaje
                </span>
                <button
                  type="button"
                  onClick={() => setIsDaysMode((prev) => !prev)}
                  className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors py-1 px-2.5 rounded-full bg-surface-container-highest/70 text-[11px] font-medium cursor-pointer"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>{isDaysMode ? 'Ver en años' : 'Ver en días'}</span>
                </button>
              </div>

              <div className="mt-2 text-center py-1">
                <div className="font-editorial text-2xl sm:text-3xl text-primary font-semibold tracking-tight tabular-nums">
                  {isDaysMode
                    ? `${duration.totalDays.toLocaleString('es-ES')} días`
                    : duration.formattedYears}
                </div>
                <p className="text-xs text-on-surface-variant mt-1">
                  {duration.totalDays.toLocaleString('es-ES')} días de risas, caminatas y complicidad
                </p>
              </div>
            </div>
          </div>

          {/* Primary Quick Action: Guardar un recuerdo */}
          <button
            type="button"
            onClick={onOpenNewMemory}
            className="w-full group bg-primary-container text-on-primary-container rounded-full py-3.5 px-5 flex items-center justify-between shadow-[0_4px_16px_rgba(232,184,196,0.35)] active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-surface-container-lowest/85 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <Camera className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-sm font-semibold block leading-tight">
                  Guardar un recuerdo
                </span>
                <span className="text-xs text-on-primary-container/80 leading-none">
                  Inmortaliza el hoy juntos
                </span>
              </div>
            </div>
            <Sparkles className="w-5 h-5 text-primary transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Right Column (7 cols on lg): Quote, Shortcuts, Daily Question */}
        <div className="lg:col-span-7 flex flex-col space-y-5">
          {/* Thought of the Day */}
          <div className="relative bg-surface-container-low rounded-3xl p-5 shadow-[0_2px_12px_rgba(73,58,59,0.04)] overflow-hidden">
            <div className="absolute -right-5 -bottom-5 w-24 h-24 rounded-full bg-secondary-container/45 pointer-events-none" />
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-secondary">
                <Quote className="w-4 h-4" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">
                  Pensamiento de hoy
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Cambiar pensamiento"
                  onClick={() => setThoughtIndex((i) => i + 1)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-outline hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Marcar frase favorita"
                  onClick={() => onToggleThoughtFavorite(currentThought.id)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-outline hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      currentThought.isFavorite
                        ? 'text-primary fill-primary'
                        : ''
                    }`}
                  />
                </button>
                <button
                  type="button"
                  aria-label="Copiar frase"
                  onClick={handleCopyQuote}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-outline hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <blockquote className="font-editorial text-xl italic text-on-surface mt-2.5 leading-relaxed relative z-10">
              «{currentThought.quote}»
            </blockquote>
            <p className="text-xs text-on-surface-variant mt-2 text-right font-medium relative z-10">
              — {currentThought.signature}
            </p>
          </div>

          {/* 3 Quick Shortcut Modules */}
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => onSwitchTab('recuerdos')}
              className="flex flex-col items-center justify-center bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3.5 shadow-xs hover:shadow-sm transition-all group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-full bg-secondary-container/60 flex items-center justify-center text-secondary mb-2 group-hover:scale-105 transition-transform">
                <Camera className="w-5 h-5" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-on-surface">
                Recuerdos
              </span>
              <span className="text-[11px] text-secondary mt-0.5 font-medium">
                {memories.length} fotos
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSwitchTab('cartitas')}
              className="flex flex-col items-center justify-center bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3.5 shadow-xs hover:shadow-sm transition-all group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-full bg-primary-container/50 flex items-center justify-center text-primary mb-2 group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-on-surface">
                Cartitas
              </span>
              <span className="text-[11px] text-primary mt-0.5 font-medium">
                {unreadLettersCount} sin abrir
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSwitchTab('planes')}
              className="flex flex-col items-center justify-center bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-3.5 shadow-xs hover:shadow-sm transition-all group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-full bg-tertiary-container/50 flex items-center justify-center text-tertiary mb-2 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-on-surface">
                Planes
              </span>
              <span className="text-[11px] text-tertiary mt-0.5 font-medium">
                {pendingPlans.length} planes
              </span>
            </button>
          </div>

          {/* Interactive Card: La Pregunta de Hoy */}
          <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-[0_2px_12px_rgba(73,58,59,0.05)]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <span className="text-xs uppercase tracking-wider text-primary font-semibold">
                  La pregunta de hoy
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full text-[11px] font-medium">
                  {currentQuestion.partner2Answer
                    ? `Ambos respondieron`
                    : `${couple.partner1} respondió · Falta ${couple.partner2}`}
                </span>
                <button
                  type="button"
                  aria-label="Siguiente pregunta"
                  onClick={() => setQuestionIndex((i) => i + 1)}
                  className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline hover:text-primary transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-base sm:text-lg text-on-surface mt-3 mb-4 leading-snug font-semibold">
              {currentQuestion.prompt}
            </p>

            {/* Partner 1 Answer */}
            <div className="bg-surface-container-low rounded-2xl p-3.5 mb-3 flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {couple.partner1.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-on-surface">
                    {couple.partner1}
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    {currentQuestion.partner1Answer.timeAgo}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-1 italic leading-relaxed">
                  &ldquo;{currentQuestion.partner1Answer.text}&rdquo;
                </p>
              </div>
            </div>

            {/* Partner 2 Answer or Input */}
            {currentQuestion.partner2Answer ? (
              <div className="bg-secondary-container/50 rounded-2xl p-3.5 flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {couple.partner2.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-on-surface">
                      {couple.partner2}
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      {currentQuestion.partner2Answer.timeAgo}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-on-surface-variant mt-1 italic leading-relaxed">
                    &ldquo;{currentQuestion.partner2Answer.text}&rdquo;
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAnswerSubmit} className="flex flex-col gap-2.5">
                <textarea
                  value={answerDraft}
                  onChange={(e) => setAnswerDraft(e.target.value)}
                  placeholder="Escribe tu respuesta con el corazón..."
                  rows={2}
                  className="w-full bg-surface-container-low rounded-2xl p-3 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container transition-all resize-none"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-secondary" />
                    Visible al instante para {couple.partner1}
                  </span>
                  <button
                    type="submit"
                    className="bg-primary text-on-primary text-xs font-semibold px-4 py-2.5 rounded-full shadow-xs active:scale-95 transition-transform flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Enviar respuesta</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Recent Scrapbook Memories */}
      <div className="flex flex-col space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <h2 className="font-editorial text-xl text-on-surface font-medium">
            Nuestros últimos recuerdos
          </h2>
          <button
            type="button"
            onClick={() => onSwitchTab('recuerdos')}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer py-1"
          >
            <span>Ver álbum completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {recentMemories.map((mem, idx) => (
            <button
              key={mem.id}
              type="button"
              onClick={() => onSelectMemory(mem)}
              className={`text-left bg-surface-container-lowest p-2.5 pb-4 rounded-2xl shadow-[0_2px_10px_rgba(73,58,59,0.06)] transition-transform hover:rotate-0 cursor-pointer ${
                idx % 2 === 0 ? '-rotate-1' : 'rotate-1 mt-1.5 md:mt-0'
              }`}
            >
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-surface-container">
                <SafeImage
                  src={mem.imageUrl}
                  alt={mem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-surface-container-lowest/85 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-medium text-on-surface">
                  {mem.displayDate}
                </div>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-on-surface mt-2.5 truncate">
                {mem.title}
              </p>
              <p className="text-[11px] text-on-surface-variant truncate">
                {mem.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Row: Next Plan + Upcoming Milestone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
        {nextPlan && (
          <button
            type="button"
            onClick={() => onSwitchTab('planes')}
            className="text-left bg-tertiary-fixed rounded-3xl p-4 shadow-[0_2px_12px_rgba(73,58,59,0.04)] hover:shadow-sm transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-tertiary fill-tertiary" />
                <span className="text-[11px] uppercase tracking-wider text-on-tertiary-fixed font-semibold">
                  Algún día juntos · Próximo plan
                </span>
              </div>
              <span className="px-2.5 py-0.5 bg-surface-container-lowest rounded-full text-[11px] text-on-surface font-medium">
                {nextPlan.dateLabel.split('·')[0].trim()}
              </span>
            </div>
            <div className="mt-3 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-container-lowest/85 flex items-center justify-center text-tertiary shrink-0">
                <Bookmark className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-on-surface leading-snug">
                  {nextPlan.title}
                </h3>
                <p className="text-xs text-on-tertiary-container mt-1 truncate">
                  Categoría: {nextPlan.categoryLabel} · {nextPlan.notes}
                </p>
              </div>
            </div>
          </button>
        )}

        <div className="bg-surface-container-low rounded-3xl p-4 shadow-[0_2px_12px_rgba(73,58,59,0.04)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0 shadow-xs">
              <PartyPopper className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                Hito cercano
              </span>
              <span className="text-base font-semibold text-on-surface truncate">
                {duration.nextMilestoneTitle}
              </span>
              <span className="text-xs text-on-surface-variant truncate">
                {duration.nextMilestoneSubtitle}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <div className="bg-primary text-on-primary px-3 py-1.5 rounded-xl text-xs font-bold tracking-tight shadow-xs tabular-nums">
              Faltan {duration.daysToMilestone} días
            </div>
            <span className="text-[10px] text-on-surface-variant mt-1 font-medium">
              {duration.milestoneDateLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
