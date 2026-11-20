import React, { useState } from 'react';
import {
  BedDouble,
  Bookmark,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Coffee,
  Compass,
  Film,
  Heart,
  Home,
  Images,
  MapPin,
  Plus,
  Sparkles,
  Trash2,
  Utensils,
  X,
} from 'lucide-react';
import { IMAGES } from '../data/initialData';
import { PlanCategory, PlanItem, TabId } from '../types';
import { SafeImage } from './SafeImage';

interface PlanesViewProps {
  plans: PlanItem[];
  onToggleComplete: (id: string) => void;
  onAddPlan: (plan: Omit<PlanItem, 'id'>) => void;
  onDeletePlan: (id: string) => void;
  onSwitchTab: (tab: TabId) => void;
  onNotify: (msg: string) => void;
}

const PLAN_FILTER_OPTIONS: {
  id: 'all' | PlanCategory;
  label: string;
  icon: React.ReactNode;
}[] = [
  { id: 'all', label: 'Todos', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: 'citas', label: 'Citas', icon: <Coffee className="w-3.5 h-3.5 text-primary" /> },
  {
    id: 'lugares',
    label: 'Lugares por conocer',
    icon: <Compass className="w-3.5 h-3.5 text-secondary" />,
  },
  {
    id: 'comidas',
    label: 'Cocina & recetas',
    icon: <Utensils className="w-3.5 h-3.5 text-primary" />,
  },
  {
    id: 'peliculas',
    label: 'Películas',
    icon: <Film className="w-3.5 h-3.5 text-tertiary" />,
  },
  {
    id: 'escapadas',
    label: 'Escapadas',
    icon: <Home className="w-3.5 h-3.5 text-secondary" />,
  },
  {
    id: 'suenos',
    label: 'Sueños',
    icon: <Heart className="w-3.5 h-3.5 text-primary" />,
  },
];

const PLAN_PRESET_PHOTOS = [
  { label: 'Picnic', url: IMAGES.planPicnic },
  { label: 'Cocina', url: IMAGES.planPasta },
  { label: 'Cabaña', url: IMAGES.planCabin },
  { label: 'Mirador', url: IMAGES.sunsetView },
];

export const PlanesView: React.FC<PlanesViewProps> = ({
  plans,
  onToggleComplete,
  onAddPlan,
  onDeletePlan,
  onSwitchTab,
  onNotify,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | PlanCategory>('all');
  const [completedOpen, setCompletedOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  // Create form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PlanCategory>('citas');
  const [dateLabel, setDateLabel] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState<string>(IMAGES.planPicnic);
  const [includePhoto, setIncludePhoto] = useState(true);
  const [isPriority, setIsPriority] = useState(false);

  const pendingPlans = plans.filter((p) => !p.completed);
  const completedPlans = plans.filter((p) => p.completed);

  const filteredPending = pendingPlans.filter(
    (p) => selectedFilter === 'all' || p.category === selectedFilter
  );

  const getCategoryLabel = (cat: PlanCategory) => {
    switch (cat) {
      case 'citas':
        return 'Citas';
      case 'lugares':
        return 'Lugares por conocer';
      case 'comidas':
        return 'Comidas';
      case 'peliculas':
        return 'Películas';
      case 'escapadas':
        return 'Escapadas';
      case 'suenos':
        return 'Sueños';
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    onAddPlan({
      title: cleanTitle,
      category,
      categoryLabel: getCategoryLabel(category),
      dateLabel: dateLabel.trim() || 'Cuando tengamos un día libre',
      notes: notes.trim() || 'Un deseo más para compartir juntos.',
      imageUrl: includePhoto ? imageUrl : undefined,
      isPriority,
      isMovieMarathon: category === 'peliculas' && !includePhoto,
      completed: false,
    });

    setTitle('');
    setDateLabel('');
    setNotes('');
    setIsPriority(false);
    setCreateOpen(false);
    onNotify('Nuevo plan guardado en nuestra bitácora');
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Washi tape top + Editorial Header */}
      <div className="flex flex-col items-center text-center pt-1 relative">
        <div className="h-4 w-28 rounded-xs bg-primary-container/65 -rotate-1 shadow-xs mb-3 pointer-events-none" />
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/75 text-on-secondary-container mb-2">
          <Heart className="w-3.5 h-3.5 text-secondary fill-secondary" />
          <span className="text-[11px] font-semibold tracking-wider uppercase">
            Nuestra Bitácora de Deseos
          </span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-primary tracking-tight">
          Planes — Algún Día Juntos
        </h1>
        <p className="text-sm text-on-surface-variant max-w-xs mt-1 italic">
          Todo lo que queremos vivir, a nuestro propio ritmo.
        </p>

        {/* Primary CTA */}
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="mt-5 w-full sm:w-auto sm:min-w-[300px] group flex items-center justify-center gap-2.5 bg-[#e8b8c4] hover:bg-[#e2a8b6] text-[#493a3b] py-3.5 px-6 rounded-full shadow-[0_4px_18px_rgba(122,84,94,0.16)] active:scale-95 transition-all border border-[#fae3e4] cursor-pointer"
        >
          <span className="w-7 h-7 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary shadow-xs group-hover:rotate-90 transition-transform duration-300">
            <Plus className="w-4 h-4" />
          </span>
          <span className="text-sm font-semibold tracking-wide">Agregar un nuevo plan</span>
          <Sparkles className="w-4 h-4 text-primary/80" />
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
        {PLAN_FILTER_OPTIONS.map((opt) => {
          const count =
            opt.id === 'all'
              ? pendingPlans.length
              : pendingPlans.filter((p) => p.category === opt.id).length;
          const active = selectedFilter === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedFilter(opt.id)}
              className={`whitespace-nowrap shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                active
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {opt.icon}
              <span>
                {opt.label}
                {opt.id === 'all' || count > 0 ? ` (${count})` : ''}
              </span>
            </button>
          );
        })}
      </div>

      {/* Pending Plans Grid */}
      {filteredPending.length === 0 ? (
        <div className="py-10 text-center bg-surface-container-low rounded-3xl border border-dashed border-outline-variant/60">
          <p className="font-editorial text-lg text-on-surface">
            No hay planes pendientes en esta categoría
          </p>
          <p className="text-xs text-on-surface-variant mt-1">
            Agrega una nueva idea para compartir juntos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          {filteredPending.map((plan, idx) => {
            if (plan.isMovieMarathon && !plan.imageUrl) {
              return (
                <article
                  key={plan.id}
                  className="relative bg-[#fff8f7] rounded-3xl p-5 shadow-[0_4px_18px_rgba(73,58,59,0.06)] border border-tertiary-container/60 transition-all hover:shadow-[0_8px_24px_rgba(73,58,59,0.1)]"
                >
                  {/* Vintage Cinema Stamp */}
                  <div className="absolute top-4 right-4 w-12 h-14 rounded-xs bg-tertiary-container/35 p-1 flex flex-col items-center justify-center shadow-xs rotate-3 pointer-events-none border border-tertiary-container/60">
                    <Film className="w-4 h-4 text-tertiary" />
                    <span className="text-[8px] text-tertiary font-bold tracking-tight mt-0.5">
                      MARATÓN
                    </span>
                  </div>

                  <div className="flex items-start gap-3 justify-between pr-12">
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="inline-flex items-center gap-1.5 text-tertiary text-xs font-semibold mb-1.5">
                        <Film className="w-3.5 h-3.5" />
                        <span>Películas &amp; Series</span>
                      </div>
                      <h2 className="font-editorial text-xl text-on-surface leading-snug">
                        {plan.title}
                      </h2>
                      <p className="text-sm text-on-surface-variant mt-2 italic flex items-center gap-1.5">
                        <BedDouble className="w-4 h-4 text-primary shrink-0" />
                        <span>{plan.notes}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        onDeletePlan(plan.id);
                        onNotify('Plan eliminado de la bitácora');
                      }}
                      className="text-xs text-outline hover:text-error flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Quitar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onToggleComplete(plan.id);
                        onNotify('¡Plan cumplido juntos!');
                      }}
                      className="px-4 py-2 rounded-full bg-surface-container hover:bg-secondary-container text-on-surface hover:text-on-secondary-container text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Marcar cumplido</span>
                    </button>
                  </div>
                </article>
              );
            }

            const tapeBg =
              idx % 2 === 0
                ? 'bg-secondary-container/90 -rotate-2 left-8'
                : 'bg-primary-container/85 rotate-2 right-8';

            return (
              <article
                key={plan.id}
                className="group relative bg-surface-container-lowest rounded-3xl p-4 shadow-[0_4px_20px_-2px_rgba(73,58,59,0.07)] border border-outline-variant/30 transition-all hover:shadow-[0_8px_28px_-2px_rgba(73,58,59,0.12)]"
              >
                <div
                  className={`absolute -top-2 w-16 h-3.5 rounded-xs backdrop-blur-xs pointer-events-none shadow-xs border-t border-white/50 z-10 ${tapeBg}`}
                />

                {plan.imageUrl && (
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-surface-container">
                    <SafeImage
                      src={plan.imageUrl}
                      alt={plan.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/55 via-transparent to-transparent" />

                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-surface-bright/95 backdrop-blur-md text-[11px] font-semibold text-primary flex items-center gap-1 shadow-xs">
                      <MapPin className="w-3 h-3" />
                      {plan.categoryLabel}
                    </span>

                    {plan.isNext && (
                      <span className="absolute bottom-3 left-3 bg-primary-fixed/95 text-on-primary-fixed px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 shadow-xs">
                        <Bookmark className="w-3 h-3 fill-primary text-primary" />
                        Próximo
                      </span>
                    )}

                    {plan.isPriority && (
                      <span className="absolute top-3 left-3 bg-surface-container-high/95 text-primary px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 shadow-xs">
                        <Heart className="w-3 h-3 fill-primary" />
                        Prioridad alta
                      </span>
                    )}
                  </div>
                )}

                <div className="pt-3.5 px-1 flex items-start gap-3 justify-between">
                  <div className="flex flex-col flex-1 min-w-0">
                    <h2 className="font-editorial text-xl text-on-surface leading-snug">
                      {plan.title}
                    </h2>
                    <div className="flex items-center gap-1.5 mt-2 text-primary text-xs font-semibold">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>{plan.dateLabel}</span>
                    </div>
                    {plan.notes && (
                      <p className="text-xs text-on-surface-variant italic mt-1.5">
                        {plan.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <button
                      type="button"
                      aria-label="Completar plan"
                      onClick={() => {
                        onToggleComplete(plan.id);
                        onNotify(`"${plan.title}" pasó a Ya lo hicimos`);
                      }}
                      className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-outline transition-all active:scale-90 hover:bg-secondary-container hover:text-on-secondary-container border border-outline-variant/30 cursor-pointer"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Eliminar plan"
                      onClick={() => {
                        onDeletePlan(plan.id);
                        onNotify('Plan eliminado');
                      }}
                      className="w-8 h-8 rounded-full hover:bg-error-container flex items-center justify-center text-outline/60 hover:text-error transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Expandable Section: Ya lo hicimos */}
      <section className="flex flex-col rounded-3xl bg-surface-container-low overflow-hidden shadow-[0_3px_16px_rgba(73,58,59,0.05)] border border-outline-variant/40">
        <button
          type="button"
          onClick={() => setCompletedOpen((prev) => !prev)}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-surface-container/60 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container shadow-xs border border-secondary/20">
              <CheckCircle2 className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <span className="font-editorial text-xl text-on-surface font-medium block">
                Ya lo hicimos
              </span>
              <span className="text-xs text-secondary font-semibold">
                {completedPlans.length} planes cumplidos juntos
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-primary bg-surface-container px-3.5 py-2 rounded-full border border-outline-variant/30">
            <span className="text-xs font-semibold">
              {completedOpen ? 'Ocultar' : 'Explorar'}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                completedOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {completedOpen && (
          <div className="px-4 sm:px-5 pb-5 pt-1 flex flex-col gap-4 border-t border-outline-variant/30">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
              {completedPlans.map((done) => (
                <div
                  key={done.id}
                  className="bg-surface-container-lowest rounded-2xl p-2.5 shadow-xs border border-outline-variant/30 flex flex-col justify-between gap-2"
                >
                  <div>
                    <div className="w-full h-24 rounded-xl overflow-hidden bg-surface-container">
                      {done.imageUrl ? (
                        <SafeImage
                          src={done.imageUrl}
                          alt={done.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary-container/40 text-secondary">
                          <CheckCircle2 className="w-7 h-7" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-on-surface mt-2 line-clamp-2">
                      {done.title}
                    </p>
                    <span className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-1">
                      <CheckCircle2 className="w-3 h-3 text-secondary shrink-0" />
                      Logrado el {done.completedDateLabel || 'hace poco'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onToggleComplete(done.id);
                      onNotify('Plan movido de nuevo a pendientes');
                    }}
                    className="text-[11px] font-semibold text-primary hover:underline text-left cursor-pointer"
                  >
                    Repetir plan
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onSwitchTab('recuerdos')}
              className="w-full py-3 px-4 rounded-full bg-secondary-container text-on-secondary-container text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 hover:bg-secondary hover:text-on-secondary transition-all cursor-pointer"
            >
              <Images className="w-4 h-4" />
              <span>Ir al álbum de recuerdos compartidos</span>
            </button>
          </div>
        )}
      </section>

      <div className="py-2 text-center">
        <p className="text-[11px] text-on-surface-variant/80 tracking-wider uppercase font-semibold">
          Paso a paso, un recuerdo a la vez
        </p>
      </div>

      {/* CREATE PLAN MODAL */}
      {createOpen && (
        <div
          className="fixed inset-0 z-50 bg-inverse-surface/45 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setCreateOpen(false)}
        >
          <div
            className="bg-surface-bright w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <div>
                <span className="text-[11px] text-primary uppercase font-bold tracking-wider">
                  Nuevo deseo
                </span>
                <h3 className="font-editorial text-2xl text-on-surface">
                  Agregar plan juntos
                </h3>
              </div>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => setCreateOpen(false)}
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  ¿Qué queremos hacer? *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Ver el amanecer desde la playa"
                  className="w-full bg-surface-container-lowest rounded-xl px-3.5 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    Categoría
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PlanCategory)}
                    className="w-full bg-surface-container-lowest rounded-xl px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                  >
                    <option value="citas">Citas</option>
                    <option value="lugares">Lugares por conocer</option>
                    <option value="comidas">Cocina &amp; recetas</option>
                    <option value="peliculas">Películas</option>
                    <option value="escapadas">Escapadas</option>
                    <option value="suenos">Sueños</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    ¿Cuándo?
                  </label>
                  <input
                    type="text"
                    value={dateLabel}
                    onChange={(e) => setDateLabel(e.target.value)}
                    placeholder="Ej. Próximo domingo"
                    className="w-full bg-surface-container-lowest rounded-xl px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Detalles o notas
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Manta, snacks favoritos o música..."
                  className="w-full bg-surface-container-lowest rounded-xl p-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container resize-none"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-on-surface">
                    Foto de inspiración
                  </span>
                  <button
                    type="button"
                    onClick={() => setIncludePhoto((prev) => !prev)}
                    className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    {includePhoto ? 'Usar tarjeta sin foto' : 'Añadir foto'}
                  </button>
                </div>

                {includePhoto && (
                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {PLAN_PRESET_PHOTOS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setImageUrl(preset.url)}
                        className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 cursor-pointer ${
                          imageUrl === preset.url
                            ? 'border-primary ring-2 ring-primary-container'
                            : 'border-transparent'
                        }`}
                      >
                        <SafeImage
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <label className="flex items-center gap-2 text-xs font-medium text-on-surface cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPriority}
                  onChange={(e) => setIsPriority(e.target.checked)}
                  className="rounded accent-primary w-4 h-4"
                />
                <span>Marcar como prioridad alta</span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="px-4 py-2.5 rounded-full text-xs font-semibold text-on-surface-variant hover:bg-surface-container cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold shadow-sm active:scale-95 transition-transform cursor-pointer"
                >
                  Guardar plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
