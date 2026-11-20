import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Edit3,
  Heart,
  ImagePlus,
  MessageCircle,
  MoreHorizontal,
  Search,
  Send,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { CoupleProfile, MemoryCategory, MemoryItem } from '../types';
import { IMAGES } from '../data/initialData';
import { formatShortDateEs } from '../utils/loveTime';
import { SafeImage } from './SafeImage';

interface RecuerdosViewProps {
  couple: CoupleProfile;
  memories: MemoryItem[];
  onToggleFavorite: (id: string) => void;
  onAddMemory: (memory: Omit<MemoryItem, 'id' | 'notes'>) => void;
  onUpdateMemory: (id: string, patch: Partial<MemoryItem>) => void;
  onDeleteMemory: (id: string) => void;
  onAddNoteToMemory: (memoryId: string, author: string, text: string) => void;
  selectedMemory: MemoryItem | null;
  onSelectMemory: (memory: MemoryItem | null) => void;
  isCreateModalOpen: boolean;
  onOpenCreateModal: () => void;
  onCloseCreateModal: () => void;
  onNotify: (msg: string) => void;
}

const CATEGORIES: Array<{ id: 'all' | MemoryCategory; label: string }> = [
  { id: 'all', label: 'Todos' },
  { id: 'Viajes', label: 'Citas y viajes' },
  { id: 'Citas', label: 'Citas' },
  { id: 'Cocina', label: 'Cocina y hogar' },
  { id: 'Momentos cotidianos', label: 'Momentos cotidianos' },
  { id: 'Días especiales', label: 'Días especiales' },
];

const PRESET_PHOTOS = [
  IMAGES.coastTrain,
  IMAGES.cafeConfession,
  IMAGES.rainUmbrella,
  IMAGES.chocolateCake,
  IMAGES.coffeeSunday,
  IMAGES.sunsetView,
];

export const RecuerdosView: React.FC<RecuerdosViewProps> = ({
  couple,
  memories,
  onToggleFavorite,
  onAddMemory,
  onUpdateMemory,
  onDeleteMemory,
  onAddNoteToMemory,
  selectedMemory,
  onSelectMemory,
  isCreateModalOpen,
  onOpenCreateModal,
  onCloseCreateModal,
  onNotify,
}) => {
  const [favoriteFilter, setFavoriteFilter] = useState<'todos' | 'favoritos'>('todos');
  const [activeFilter, setActiveFilter] = useState<'all' | MemoryCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingMemory, setEditingMemory] = useState<MemoryItem | null>(null);

  // Form states for Create / Edit
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formCategory, setFormCategory] = useState<MemoryCategory>('Momentos cotidianos');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState(PRESET_PHOTOS[0]);
  const [formCustomUrl, setFormCustomUrl] = useState('');

  // Detail note input
  const [noteAuthor, setNoteAuthor] = useState(couple.partner2);
  const [noteText, setNoteText] = useState('');

  const favoriteCount = useMemo(
    () => memories.filter((m) => m.isFavorite).length,
    [memories]
  );

  const filteredMemories = useMemo(() => {
    return memories.filter((m) => {
      const matchesFav = favoriteFilter === 'todos' || m.isFavorite;
      const matchesCat =
        activeFilter === 'all' ||
        (activeFilter === 'Viajes'
          ? m.category === 'Viajes' || m.category === 'Citas'
          : m.category === activeFilter);
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q);
      return matchesFav && matchesCat && matchesSearch;
    });
  }, [memories, favoriteFilter, activeFilter, searchQuery]);

  const handleHeartToggle = (mem: MemoryItem) => {
    const willBeFavorite = !mem.isFavorite;
    onToggleFavorite(mem.id);
    onNotify(
      willBeFavorite
        ? 'Recuerdo guardado en Favoritos'
        : 'Recuerdo quitado de Favoritos'
    );
  };

  const openForCreate = () => {
    setEditingMemory(null);
    setFormTitle('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormCategory('Momentos cotidianos');
    setFormDescription('');
    setFormImageUrl(PRESET_PHOTOS[0]);
    setFormCustomUrl('');
    onOpenCreateModal();
  };

  const openForEdit = (mem: MemoryItem) => {
    setOpenMenuId(null);
    setEditingMemory(mem);
    setFormTitle(mem.title);
    setFormDate(mem.date);
    setFormCategory(mem.category);
    setFormDescription(mem.description);
    setFormImageUrl(mem.imageUrl);
    setFormCustomUrl('');
    onOpenCreateModal();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormImageUrl(reader.result);
        setFormCustomUrl('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) return;
    const finalUrl = formCustomUrl.trim() || formImageUrl;

    if (editingMemory) {
      onUpdateMemory(editingMemory.id, {
        title: formTitle.trim(),
        date: formDate,
        displayDate: formatShortDateEs(formDate),
        category: formCategory,
        description: formDescription.trim(),
        imageUrl: finalUrl,
      });
      onNotify('Recuerdo actualizado en vuestro álbum');
    } else {
      onAddMemory({
        title: formTitle.trim(),
        date: formDate,
        displayDate: formatShortDateEs(formDate),
        category: formCategory,
        description: formDescription.trim(),
        imageUrl: finalUrl,
        washiColor: memories.length % 2 === 0 ? 'sage' : 'rose',
        isFavorite: false,
      });
      onNotify('Recuerdo pegado en el álbum');
    }
    onCloseCreateModal();
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemory || !noteText.trim()) return;
    onAddNoteToMemory(selectedMemory.id, noteAuthor, noteText.trim());
    setNoteText('');
    onNotify('Nota íntima añadida al recuerdo');
  };

  const activeDetailMemory = selectedMemory
    ? memories.find((m) => m.id === selectedMemory.id) || selectedMemory
    : null;

  return (
    <div className="flex flex-col w-full space-y-5 relative">
      {/* Top Editorial Banner */}
      <section className="flex flex-col gap-1.5 pt-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs uppercase tracking-wider text-primary font-semibold">
            Diario Íntimo
          </span>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="tabular-nums">{memories.length} instantes guardados</span>
            </div>
            <button
              type="button"
              aria-label="Buscar recuerdos"
              onClick={() => setShowSearch((s) => !s)}
              className="w-9 h-9 rounded-full bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-center text-on-surface-variant hover:text-primary cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3 mt-1">
          <div>
            <div className="flex items-baseline gap-2.5">
              <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-on-surface tracking-tight">
                Nuestro Álbum
              </h1>
              <span className="text-[11px] font-medium tracking-widest text-primary/80 uppercase border border-primary-container px-2 py-0.5 rounded-full bg-primary-fixed/30">
                Vol. 1
              </span>
            </div>
            <p className="text-sm text-on-surface-variant italic mt-1">
              Los instantes que nos trajeron hasta aquí y seguimos construyendo juntos.
            </p>
          </div>

          <button
            type="button"
            onClick={openForCreate}
            className="px-4 py-2.5 rounded-full bg-primary text-on-primary text-xs sm:text-sm font-semibold shadow-sm flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer whitespace-nowrap"
          >
            <ImagePlus className="w-4 h-4" />
            <span>Crear recuerdo</span>
          </button>
        </div>

        {showSearch && (
          <div className="mt-2 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título o anécdota..."
              className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-full pl-4 pr-10 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Limpiar búsqueda"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </section>

      {/* Primary View Filter: Todos / Favoritos */}
      <section className="flex flex-col gap-3">
        <div
          role="tablist"
          aria-label="Filtrar recuerdos por colección"
          className="grid grid-cols-2 gap-1.5 p-1.5 bg-surface-container-low rounded-full border border-outline-variant/25 max-w-sm"
        >
          <button
            type="button"
            role="tab"
            aria-selected={favoriteFilter === 'todos'}
            onClick={() => setFavoriteFilter('todos')}
            className={`whitespace-nowrap py-2 px-4 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              favoriteFilter === 'todos'
                ? 'bg-surface-container-lowest shadow-xs text-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span>Todos</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold leading-none tabular-nums ${
                favoriteFilter === 'todos'
                  ? 'bg-primary-container/70 text-on-primary-container'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              {memories.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={favoriteFilter === 'favoritos'}
            onClick={() => setFavoriteFilter('favoritos')}
            className={`whitespace-nowrap py-2 px-4 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              favoriteFilter === 'favoritos'
                ? 'bg-surface-container-lowest shadow-xs text-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 shrink-0 ${
                favoriteFilter === 'favoritos' ? 'fill-primary text-primary' : ''
              }`}
            />
            <span>Favoritos</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold leading-none tabular-nums ${
                favoriteFilter === 'favoritos'
                  ? 'bg-primary-container/70 text-on-primary-container'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              {favoriteCount}
            </span>
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="w-full overflow-x-auto pb-1 no-scrollbar">
          <div className="flex items-center gap-2 whitespace-nowrap min-w-max">
            {CATEGORIES.map((cat) => {
              const isActive = activeFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveFilter(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30 hover:bg-surface-container'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Empty State */}
      {filteredMemories.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 text-center bg-surface-container-low/70 rounded-3xl border border-dashed border-outline-variant/60">
          {favoriteFilter === 'favoritos' ? (
            <>
              <div className="w-12 h-12 rounded-full bg-primary-fixed/60 text-primary flex items-center justify-center mb-3">
                <Heart className="w-5 h-5" />
              </div>
              <p className="font-editorial text-lg font-medium text-on-surface">
                Aún no tienes recuerdos favoritos
              </p>
              <p className="text-xs text-on-surface-variant mt-1 max-w-xs">
                Toca el corazón en cualquier fotografía Polaroid para guardarla en esta colección especial.
              </p>
              <button
                type="button"
                onClick={() => {
                  setFavoriteFilter('todos');
                  setActiveFilter('all');
                }}
                className="mt-4 px-5 py-2 rounded-full bg-primary text-on-primary text-xs font-semibold cursor-pointer"
              >
                Ver todos los recuerdos
              </button>
            </>
          ) : (
            <>
              <BookOpen className="w-8 h-8 text-primary/70 mb-2" />
              <p className="text-base font-semibold text-on-surface">
                No hay recuerdos en esta categoría
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                Añade una nueva fotografía Polaroid para guardar este instante.
              </p>
            </>
          )}
        </div>
      ) : (
        /* Scrapbook Polaroid Mosaic */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {filteredMemories.map((mem, idx) => {
            const isFeatured =
              idx === 0 &&
              favoriteFilter === 'todos' &&
              activeFilter === 'all' &&
              !searchQuery;
            const rotation =
              idx % 3 === 0
                ? '-rotate-1'
                : idx % 3 === 1
                ? 'rotate-1'
                : '-rotate-[0.5deg]';

            return (
              <article
                key={mem.id}
                onClick={() => onSelectMemory(mem)}
                className={`relative rounded-3xl bg-surface-container-lowest p-3 pb-5 shadow-[0_8px_24px_-4px_rgba(73,58,59,0.08)] transition-transform duration-300 hover:rotate-0 cursor-pointer ${rotation} ${
                  isFeatured ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                {/* Washi Tape Accent */}
                <div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-5 rounded-xs backdrop-blur-xs shadow-xs z-20 flex items-center justify-center pointer-events-none ${
                    mem.washiColor === 'sage'
                      ? 'bg-secondary-container/90 rotate-1'
                      : 'bg-primary-container/80 -rotate-1'
                  }`}
                >
                  {mem.washiLabel && (
                    <span className="text-[9px] uppercase tracking-widest font-semibold text-on-surface-variant/80">
                      {mem.washiLabel}
                    </span>
                  )}
                </div>

                <div
                  className={`relative w-full overflow-hidden rounded-2xl bg-surface-container ${
                    isFeatured ? 'aspect-[4/3] md:aspect-[16/10]' : 'aspect-[4/3]'
                  }`}
                >
                  <SafeImage
                    src={mem.imageUrl}
                    alt={mem.title}
                    className="w-full h-full object-cover"
                  />

                  <div
                    className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      aria-label={
                        mem.isFavorite ? 'Quitar de Favoritos' : 'Agregar a Favoritos'
                      }
                      onClick={() => handleHeartToggle(mem)}
                      className="w-9 h-9 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center shadow-xs active:scale-90 transition-transform cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          mem.isFavorite
                            ? 'text-primary fill-primary'
                            : 'text-on-surface-variant'
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      aria-label="Opciones"
                      onClick={() =>
                        setOpenMenuId((cur) => (cur === mem.id ? null : mem.id))
                      }
                      className="w-9 h-9 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center text-on-surface-variant shadow-xs active:scale-90 transition-transform cursor-pointer"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  {openMenuId === mem.id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-13 right-2.5 bg-surface-container-lowest rounded-2xl shadow-xl p-1.5 flex flex-col gap-1 z-30 min-w-[130px] border border-outline-variant/30"
                    >
                      <button
                        type="button"
                        onClick={() => openForEdit(mem)}
                        className="flex items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-on-surface rounded-xl hover:bg-surface-container cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(null);
                          onDeleteMemory(mem.id);
                          onNotify('Recuerdo eliminado del álbum');
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-error rounded-xl hover:bg-error-container cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-3.5 px-1 flex flex-col gap-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <h2 className="font-editorial text-lg text-on-surface font-medium leading-snug">
                      {mem.title}
                    </h2>
                    <span className="font-editorial italic text-xs text-primary shrink-0">
                      {mem.displayDate}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-on-surface-variant italic line-clamp-2 leading-relaxed">
                    “{mem.description}”
                  </p>
                  <div className="flex items-center justify-between pt-2 mt-1 border-t border-dashed border-outline-variant/30 text-[11px] text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5 text-primary" />
                      {mem.notes.length} {mem.notes.length === 1 ? 'nota' : 'notas'}
                    </span>
                    <span className="text-primary/80 font-medium">{mem.category}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Scrapbook Closing Card */}
      <div className="flex flex-col items-center justify-center py-6 px-4 text-center rounded-3xl bg-surface-container-low">
        <div className="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center text-primary mb-2 shadow-xs">
          <BookOpen className="w-5 h-5" />
        </div>
        <p className="font-editorial text-lg text-on-surface font-medium">
          {memories.length} recuerdos compartidos
        </p>
        <p className="text-xs text-on-surface-variant italic mt-0.5 max-w-sm">
          “Nuestra primera tarde de lluvia y cada paso que dimos juntos en el camino.”
        </p>
      </div>

      {/* Modal: Detail View with Intimate Notes */}
      {activeDetailMemory && (
        <div
          className="fixed inset-0 z-50 bg-inverse-surface/45 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => onSelectMemory(null)}
        >
          <div
            className="bg-surface-container-lowest w-full max-w-md rounded-3xl p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Cerrar"
              onClick={() => onSelectMemory(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface hover:bg-surface-container cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-2 pb-4 bg-surface-container-lowest rounded-2xl shadow-xs border border-outline-variant/30">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-surface-container">
                <SafeImage
                  src={activeDetailMemory.imageUrl}
                  alt={activeDetailMemory.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 left-2.5 bg-surface-container-lowest/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-primary">
                  {activeDetailMemory.category}
                </span>
              </div>

              <div className="pt-3.5 px-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-editorial text-xl text-on-surface leading-tight font-medium">
                      {activeDetailMemory.title}
                    </h3>
                    <p className="text-xs text-primary italic mt-0.5">
                      {activeDetailMemory.displayDate}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={
                      activeDetailMemory.isFavorite
                        ? 'Quitar de Favoritos'
                        : 'Agregar a Favoritos'
                    }
                    onClick={() => handleHeartToggle(activeDetailMemory)}
                    className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-container cursor-pointer"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        activeDetailMemory.isFavorite
                          ? 'text-primary fill-primary'
                          : 'text-outline'
                      }`}
                    />
                  </button>
                </div>

                <p className="text-sm text-on-surface-variant italic mt-3 leading-relaxed">
                  “{activeDetailMemory.description}”
                </p>
              </div>
            </div>

            {/* Notes thread */}
            <div className="mt-4 space-y-2.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Notas íntimas ({activeDetailMemory.notes.length})
              </h4>
              {activeDetailMemory.notes.map((n) => (
                <div
                  key={n.id}
                  className="bg-surface-container-low rounded-2xl p-3 text-xs"
                >
                  <div className="flex items-center justify-between font-semibold text-on-surface">
                    <span>{n.author}</span>
                    <span className="text-[10px] font-normal text-on-surface-variant">
                      {n.createdAt}
                    </span>
                  </div>
                  <p className="text-on-surface-variant mt-1">{n.text}</p>
                </div>
              ))}

              <form onSubmit={handleAddNote} className="pt-1 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-on-surface-variant">Escribe como:</span>
                  {[couple.partner1, couple.partner2].map((who) => (
                    <button
                      key={who}
                      type="button"
                      onClick={() => setNoteAuthor(who)}
                      className={`px-2.5 py-1 rounded-full font-medium cursor-pointer ${
                        noteAuthor === who
                          ? 'bg-primary-container text-on-primary-container'
                          : 'bg-surface-container-low text-on-surface-variant'
                      }`}
                    >
                      {who}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Añadir una nota a este recuerdo..."
                    className="flex-1 bg-surface-container-low rounded-full px-3.5 py-2 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                  />
                  <button
                    type="submit"
                    aria-label="Enviar nota"
                    className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create / Edit Memory */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-inverse-surface/45 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={onCloseCreateModal}
        >
          <div
            className="w-full max-w-lg bg-surface-bright rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] text-primary uppercase font-bold tracking-wider">
                  {editingMemory ? 'Editar hoja' : 'Nueva hoja'}
                </span>
                <h2 className="font-editorial text-2xl text-on-surface">
                  {editingMemory ? 'Editar recuerdo' : 'Guardar un instante'}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={onCloseCreateModal}
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMemory} className="space-y-4">
              {/* File upload or preview */}
              <label className="w-full h-36 rounded-2xl bg-surface-container border-dashed border-2 border-outline-variant flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-surface-container-high transition-colors overflow-hidden relative">
                <SafeImage
                  src={formCustomUrl.trim() || formImageUrl}
                  alt="Vista previa"
                  className="absolute inset-0 w-full h-full object-cover opacity-35"
                />
                <div className="relative z-10 flex flex-col items-center bg-surface-container-lowest/85 px-4 py-2 rounded-2xl shadow-xs">
                  <ImagePlus className="w-6 h-6 text-primary mb-1" />
                  <span className="text-xs font-semibold text-on-surface">
                    Toca para subir fotografía
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {/* Preset photo strip */}
              <div>
                <span className="block text-xs font-medium text-on-surface-variant mb-1.5">
                  O elige una del carrete
                </span>
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {PRESET_PHOTOS.map((url) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => {
                        setFormImageUrl(url);
                        setFormCustomUrl('');
                      }}
                      className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 cursor-pointer ${
                        formImageUrl === url && !formCustomUrl
                          ? 'border-primary'
                          : 'border-transparent'
                      }`}
                    >
                      <SafeImage
                        src={url}
                        alt="Carrete"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Título del instante
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ej. Nuestra primera tarde de lluvia"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest text-sm text-on-surface shadow-xs focus:outline-none focus:ring-2 focus:ring-primary-container"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest text-sm text-on-surface shadow-xs focus:outline-none focus:ring-2 focus:ring-primary-container"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Categoría
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) =>
                      setFormCategory(e.target.value as MemoryCategory)
                    }
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest text-sm text-on-surface shadow-xs focus:outline-none focus:ring-2 focus:ring-primary-container"
                  >
                    <option value="Momentos cotidianos">Momentos cotidianos</option>
                    <option value="Citas">Citas</option>
                    <option value="Viajes">Viajes</option>
                    <option value="Cocina">Cocina</option>
                    <option value="Días especiales">Días especiales</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Nota o anécdota manuscrita
                </label>
                <textarea
                  rows={3}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="¿Qué sentimos en ese momento? ¿Qué palabras dijimos?"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest text-sm text-on-surface shadow-xs focus:outline-none focus:ring-2 focus:ring-primary-container resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={onCloseCreateModal}
                  className="px-4 py-2.5 rounded-full text-xs font-semibold text-on-surface-variant hover:bg-surface-container cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold shadow-sm active:scale-95 transition-transform cursor-pointer"
                >
                  {editingMemory ? 'Guardar cambios' : 'Pegar en el álbum'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
