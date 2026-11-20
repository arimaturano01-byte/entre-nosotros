import React, { useState } from 'react';
import {
  Archive,
  ArchiveRestore,
  Bookmark,
  Calendar,
  Clock,
  Feather,
  Flower2,
  Heart,
  Info,
  KeyRound,
  Lock,
  MailOpen,
  PenLine,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { CoupleProfile, LetterItem, LetterStatus } from '../types';
import { formatShortDateEs } from '../utils/loveTime';

interface CartitasViewProps {
  couple: CoupleProfile;
  letters: LetterItem[];
  onAddLetter: (letter: Omit<LetterItem, 'id'>) => void;
  onUpdateLetter: (id: string, patch: Partial<LetterItem>) => void;
  onDeleteLetter: (id: string) => void;
  onNotify: (msg: string) => void;
}

type CollectionFilter = 'todas' | 'favoritas' | 'archivadas';
type LetterSubTab = 'por-abrir' | 'leidas' | 'capsulas' | 'borradores';

export const CartitasView: React.FC<CartitasViewProps> = ({
  couple,
  letters,
  onAddLetter,
  onUpdateLetter,
  onDeleteLetter,
  onNotify,
}) => {
  const [collectionFilter, setCollectionFilter] = useState<CollectionFilter>('todas');
  const [activeSubTab, setActiveSubTab] = useState<LetterSubTab>('por-abrir');
  const [selectedLetter, setSelectedLetter] = useState<LetterItem | null>(null);
  const [infoCapsule, setInfoCapsule] = useState<LetterItem | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);

  // Compose form state
  const [recipient, setRecipient] = useState(couple.partner1);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [deliveryType, setDeliveryType] = useState<'immediate' | 'emergency' | 'capsule'>('immediate');
  const [unlockDate, setUnlockDate] = useState('2025-02-14');

  // Primary collection buckets
  const activeLetters = letters.filter((l) => !l.isArchived);
  const favoriteLetters = letters.filter((l) => Boolean(l.isFavorite));
  const archivedLetters = letters.filter((l) => Boolean(l.isArchived));

  // Sub-tabs within "Todas" (active non-archived correspondence)
  const unreadLetters = activeLetters.filter((l) => l.status === 'unread');
  const readLetters = activeLetters.filter((l) => l.status === 'read');
  const capsuleLetters = activeLetters.filter((l) => l.status === 'capsule');
  const draftLetters = activeLetters.filter((l) => l.status === 'draft');
  const chestLetters = activeLetters.filter(
    (l) => l.status !== 'capsule' && l.status !== 'draft'
  );

  const featuredOpenLetter =
    unreadLetters.find((l) => !l.isEmergency) || unreadLetters[0] || readLetters[0] || null;
  const emergencyLetter =
    activeLetters.find((l) => l.isEmergency && l.status === 'unread') ||
    activeLetters.find((l) => l.isEmergency);

  const openComposeNew = (presetType: 'immediate' | 'emergency' | 'capsule' = 'immediate') => {
    setEditingDraftId(null);
    setRecipient(couple.partner1);
    setTitle('');
    setBody('');
    setDeliveryType(presetType);
    setUnlockDate('2025-02-14');
    setComposeOpen(true);
  };

  const openComposeFromDraft = (draft: LetterItem) => {
    setEditingDraftId(draft.id);
    setRecipient(draft.recipient || couple.partner1);
    setTitle(draft.title);
    setBody(draft.body);
    setDeliveryType('immediate');
    setComposeOpen(true);
  };

  const handleOpenReader = (letter: LetterItem) => {
    if (letter.status === 'capsule') {
      setInfoCapsule(letter);
      return;
    }
    if (letter.status === 'draft') {
      openComposeFromDraft(letter);
      return;
    }
    if (letter.status === 'unread') {
      const updated = { ...letter, status: 'read' as const, dateLabel: 'Abierta hoy' };
      onUpdateLetter(letter.id, { status: 'read', dateLabel: 'Abierta hoy' });
      setSelectedLetter(updated);
      if (letter.isEmergency) {
        onNotify(`Rompiste con dulzura el sello salvia de ${letter.sender}`);
      }
    } else {
      setSelectedLetter(letter);
    }
  };

  const handleToggleFavorite = (letter: LetterItem) => {
    const next = !letter.isFavorite;
    onUpdateLetter(letter.id, { isFavorite: next });
    if (selectedLetter?.id === letter.id) {
      setSelectedLetter({ ...selectedLetter, isFavorite: next });
    }
    onNotify(next ? 'Añadida a Favoritas' : 'Quitada de Favoritas');
  };

  const handleToggleArchive = (letter: LetterItem) => {
    const nextArchived = !letter.isArchived;
    onUpdateLetter(letter.id, { isArchived: nextArchived });
    if (selectedLetter?.id === letter.id) {
      setSelectedLetter({ ...selectedLetter, isArchived: nextArchived });
    }
    onNotify(
      nextArchived
        ? 'Cartita movida a Archivadas'
        : 'Cartita restaurada en Todas'
    );
  };

  const handleSubmitLetter = (asDraft: boolean) => {
    const cleanTitle = title.trim();
    const cleanBody = body.trim();
    if (!cleanTitle || !cleanBody) {
      onNotify('Escribe un título y un mensaje antes de guardar');
      return;
    }

    const sender = recipient === couple.partner1 ? couple.partner2 : couple.partner1;

    let status: LetterStatus = 'unread';
    let dateLabel = 'Recién sellada';
    let daysRemaining: number | undefined;
    let progressPercent: number | undefined;

    if (asDraft) {
      status = 'draft';
      dateLabel = 'Borrador guardado';
    } else if (deliveryType === 'capsule') {
      status = 'capsule';
      dateLabel = formatShortDateEs(unlockDate);
      const target = new Date(unlockDate + 'T00:00:00');
      const now = new Date();
      const diff = Math.max(
        1,
        Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      );
      daysRemaining = diff;
      progressPercent = Math.max(15, Math.min(92, 100 - Math.round((diff / 365) * 100)));
    } else if (deliveryType === 'emergency') {
      dateLabel = 'Disponible cuando lo necesites';
    }

    const payload: Omit<LetterItem, 'id'> = {
      title: cleanTitle,
      sender,
      recipient,
      body: cleanBody,
      dateLabel,
      status,
      isFavorite: false,
      isArchived: false,
      isEmergency: !asDraft && deliveryType === 'emergency',
      unlockDate: !asDraft && deliveryType === 'capsule' ? unlockDate : undefined,
      daysRemaining,
      progressPercent,
      stampCode: `CORREO 0${letters.length + 1}`,
    };

    if (editingDraftId) {
      onUpdateLetter(editingDraftId, payload);
    } else {
      onAddLetter(payload);
    }

    setComposeOpen(false);
    setEditingDraftId(null);
    setCollectionFilter('todas');

    if (asDraft) {
      setActiveSubTab('borradores');
      onNotify('Borrador guardado en tu escritorio');
    } else if (deliveryType === 'capsule') {
      setActiveSubTab('capsulas');
      onNotify(`Cápsula sellada hasta el ${formatShortDateEs(unlockDate)}`);
    } else {
      setActiveSubTab('por-abrir');
      onNotify(`Cartita sellada con cera para ${recipient}`);
    }
  };

  const renderLetterCard = (letter: LetterItem, context: 'todas' | 'favoritas' | 'archivadas') => {
    return (
      <div
        key={letter.id}
        onClick={() => handleOpenReader(letter)}
        className="group relative bg-[#FFFDF9] rounded-2xl p-5 border border-outline-variant/40 shadow-[0_4px_16px_rgba(73,58,59,0.05)] hover:shadow-[0_8px_24px_rgba(73,58,59,0.09)] transition-all cursor-pointer flex flex-col justify-between gap-3.5"
      >
        {/* Decorative top washi accent on favorites */}
        {letter.isFavorite && (
          <div className="absolute -top-1.5 left-8 w-16 h-3 rounded-xs bg-primary-container/70 -rotate-1 pointer-events-none" />
        )}

        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-primary uppercase tracking-wider truncate">
              De {letter.sender} para {letter.recipient}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              {context === 'favoritas' && letter.isArchived && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">
                  Archivada
                </span>
              )}
              <span className="text-[11px] text-on-surface-variant">{letter.dateLabel}</span>
            </div>
          </div>

          <h3 className="font-editorial text-lg font-semibold text-on-surface mt-1.5 leading-snug">
            {letter.title}
          </h3>

          <p className="text-sm text-on-surface-variant italic line-clamp-3 mt-1.5 leading-relaxed">
            “{letter.body}”
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-outline-variant/25">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleFavorite(letter);
            }}
            aria-label={letter.isFavorite ? 'Quitar de favoritas' : 'Marcar como favorita'}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              letter.isFavorite
                ? 'bg-primary-fixed/80 text-primary border border-primary/20 hover:bg-primary-container/60'
                : 'bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${letter.isFavorite ? 'fill-primary text-primary' : ''}`} />
            <span>{letter.isFavorite ? 'Favorita' : 'Favorita'}</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleArchive(letter);
              }}
              aria-label={letter.isArchived ? 'Desarchivar carta' : 'Archivar carta'}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                letter.isArchived
                  ? 'bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              {letter.isArchived ? (
                <>
                  <ArchiveRestore className="w-3.5 h-3.5" />
                  <span>Desarchivar</span>
                </>
              ) : (
                <>
                  <Archive className="w-3.5 h-3.5" />
                  <span>Archivar</span>
                </>
              )}
            </button>

            <button
              type="button"
              aria-label="Eliminar carta"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteLetter(letter.id);
                onNotify('Cartita eliminada del cofre');
              }}
              className="w-8 h-8 rounded-full hover:bg-error-container flex items-center justify-center text-outline hover:text-error transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col gap-3 pt-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-surface-container-high text-primary">
              <Flower2 className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Cofre de correspondencia
            </span>
          </div>
          <span className="text-xs font-medium text-secondary px-3 py-1 rounded-full bg-secondary-container/70 shrink-0">
            {letters.length} cartas en total
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-editorial text-3xl sm:text-4xl font-semibold text-on-surface tracking-tight">
              Cartitas para ti
            </h1>
            <p className="text-sm text-on-surface-variant italic mt-0.5">
              Palabras que se quedan para siempre.
            </p>
          </div>

          <button
            type="button"
            onClick={() => openComposeNew('immediate')}
            className="w-full sm:w-auto py-3.5 px-6 rounded-full bg-gradient-to-r from-[#E8B8C4] to-[#f4d5dd] text-[#3b272c] shadow-[0_6px_20px_rgba(122,84,94,0.22)] border border-primary/20 flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all cursor-pointer shrink-0"
          >
            <PenLine className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">Escribir una cartita</span>
            <Send className="w-4 h-4 text-primary/80" />
          </button>
        </div>
      </div>

      {/* Primary Collection Filters: Todas · Favoritas · Archivadas */}
      <div className="flex flex-col gap-2.5">
        <div
          role="tablist"
          aria-label="Filtros de cartitas"
          className="grid grid-cols-3 gap-1.5 p-1.5 bg-surface-container-low rounded-full border border-outline-variant/25"
        >
          <button
            type="button"
            role="tab"
            aria-selected={collectionFilter === 'todas'}
            onClick={() => setCollectionFilter('todas')}
            className={`whitespace-nowrap py-2.5 px-3 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              collectionFilter === 'todas'
                ? 'bg-surface-container-lowest shadow-xs text-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <MailOpen className="w-3.5 h-3.5 shrink-0" />
            <span>Todas</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold leading-none ${
                collectionFilter === 'todas'
                  ? 'bg-primary-container/70 text-on-primary-container'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              {activeLetters.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={collectionFilter === 'favoritas'}
            onClick={() => setCollectionFilter('favoritas')}
            className={`whitespace-nowrap py-2.5 px-3 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              collectionFilter === 'favoritas'
                ? 'bg-surface-container-lowest shadow-xs text-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 shrink-0 ${
                collectionFilter === 'favoritas' ? 'fill-primary text-primary' : ''
              }`}
            />
            <span>Favoritas</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold leading-none ${
                collectionFilter === 'favoritas'
                  ? 'bg-primary-container/70 text-on-primary-container'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              {favoriteLetters.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={collectionFilter === 'archivadas'}
            onClick={() => setCollectionFilter('archivadas')}
            className={`whitespace-nowrap py-2.5 px-3 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              collectionFilter === 'archivadas'
                ? 'bg-surface-container-lowest shadow-xs text-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Archive className="w-3.5 h-3.5 shrink-0" />
            <span>Archivadas</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold leading-none ${
                collectionFilter === 'archivadas'
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              {archivedLetters.length}
            </span>
          </button>
        </div>

        {/* Sub-filters inside "Todas" preserving Por abrir / Leídas / Cápsulas / Borradores */}
        {collectionFilter === 'todas' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveSubTab('por-abrir')}
              className={`shrink-0 whitespace-nowrap py-1.5 px-3.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                activeSubTab === 'por-abrir'
                  ? 'bg-primary text-on-primary border-primary shadow-xs'
                  : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:text-on-surface'
              }`}
            >
              <span>Por abrir</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none ${
                  activeSubTab === 'por-abrir'
                    ? 'bg-white/20 text-on-primary'
                    : 'bg-primary-container/60 text-on-primary-container'
                }`}
              >
                {unreadLetters.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('leidas')}
              className={`shrink-0 whitespace-nowrap py-1.5 px-3.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer border ${
                activeSubTab === 'leidas'
                  ? 'bg-primary text-on-primary border-primary shadow-xs'
                  : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:text-on-surface'
              }`}
            >
              <span>Leídas</span>
              <span className="opacity-75">({readLetters.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('capsulas')}
              className={`shrink-0 whitespace-nowrap py-1.5 px-3.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer border ${
                activeSubTab === 'capsulas'
                  ? 'bg-primary text-on-primary border-primary shadow-xs'
                  : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:text-on-surface'
              }`}
            >
              <span>Cápsulas</span>
              <span className="opacity-75">({capsuleLetters.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('borradores')}
              className={`shrink-0 whitespace-nowrap py-1.5 px-3.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer border ${
                activeSubTab === 'borradores'
                  ? 'bg-primary text-on-primary border-primary shadow-xs'
                  : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:text-on-surface'
              }`}
            >
              <span>Borradores</span>
              <span className="opacity-75">({draftLetters.length})</span>
            </button>
          </div>
        )}
      </div>

      {/* VIEW 1: TODAS */}
      {collectionFilter === 'todas' && (
        <>
          {activeSubTab === 'por-abrir' && (
            <div className="space-y-6">
              {/* Cápsulas del tiempo & Sobres lacrados */}
              {(capsuleLetters.length > 0 || emergencyLetter) && (
                <section className="flex flex-col gap-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <h2 className="font-editorial text-xl font-medium text-on-surface">
                        Cápsulas del tiempo &amp; Sobres lacrados
                      </h2>
                    </div>
                    <span className="text-[11px] font-medium text-on-surface-variant hidden sm:inline-flex items-center gap-1 bg-surface-container-low px-2.5 py-1 rounded-full border border-outline-variant/40">
                      <Lock className="w-3 h-3 text-primary" />
                      Con candado de amor
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {capsuleLetters.map((cap, idx) => (
                      <div
                        key={cap.id}
                        className="relative bg-[#FFFDF9] rounded-2xl p-4 sm:p-5 shadow-[0_6px_20px_rgba(73,58,59,0.06)] border border-primary-container/50 flex flex-col gap-3"
                      >
                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-28 h-4 rounded-xs bg-primary-container/70 shadow-xs -rotate-1 pointer-events-none" />
                        <div className="flex items-start gap-3 pt-1">
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#E8B8C4] to-[#caa0ab] flex items-center justify-center shadow-sm text-white border-2 border-surface-bright ring-2 ring-primary/20 shrink-0">
                            <Heart className="w-5 h-5 fill-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] uppercase tracking-wider text-primary font-bold px-2 py-0.5 bg-primary-container/40 rounded">
                                Sobre lacrado
                              </span>
                              <span className="text-xs text-on-surface-variant/70 font-mono">
                                #0{idx + 1}
                              </span>
                            </div>
                            <h3 className="font-editorial text-lg font-medium text-on-surface leading-snug mt-1">
                              {cap.title}
                            </h3>
                          </div>
                        </div>

                        <div className="bg-surface-container-low/80 rounded-xl p-3 flex flex-col gap-2 border border-primary/10">
                          <div className="flex items-center justify-between text-xs text-on-surface-variant">
                            <span className="font-medium">
                              Programada por {cap.sender} con amor
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-semibold text-[11px]">
                              {cap.dateLabel}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-surface-container-high h-2 rounded-full overflow-hidden p-0.5">
                              <div
                                className="bg-gradient-to-r from-primary to-primary-container h-full rounded-full transition-all"
                                style={{ width: `${cap.progressPercent ?? 68}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-primary shrink-0 tabular-nums">
                              Faltan {cap.daysRemaining ?? 112} días
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-on-surface-variant pt-1">
                          <div className="flex items-center gap-1.5 text-xs italic">
                            <Lock className="w-3.5 h-3.5 text-secondary shrink-0" />
                            <span>
                              Faltan {cap.daysRemaining ?? 112} días · Se abrirá el {cap.dateLabel}
                            </span>
                          </div>
                          <button
                            type="button"
                            aria-label="Información de cápsula"
                            onClick={() => setInfoCapsule(cap)}
                            className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors cursor-pointer shrink-0"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Abrazo de emergencia */}
                    {emergencyLetter && (
                      <div className="relative bg-[#FFFDF9] rounded-2xl p-4 sm:p-5 shadow-[0_6px_20px_rgba(73,58,59,0.06)] border border-secondary-container flex flex-col justify-between gap-3">
                        <div className="absolute -top-1.5 left-1/3 -translate-x-1/2 w-24 h-4 rounded-xs bg-secondary-container shadow-xs rotate-1 pointer-events-none" />
                        <div className="flex items-start gap-3 pt-1">
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#dbe6d7] to-[#bfcabb] flex items-center justify-center shadow-sm text-secondary border-2 border-surface-bright ring-2 ring-secondary/20 shrink-0">
                            <Flower2 className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] uppercase tracking-wider text-secondary font-bold px-2 py-0.5 bg-secondary-container/60 rounded">
                                Abrazo de emergencia
                              </span>
                              <span className="text-xs text-on-surface-variant/70 font-mono">
                                #02
                              </span>
                            </div>
                            <h3 className="font-editorial text-lg font-medium text-on-surface leading-snug mt-1">
                              {emergencyLetter.title}
                            </h3>
                          </div>
                        </div>

                        <div className="bg-[#f4faee] rounded-xl p-3.5 flex items-center justify-between gap-3 border border-secondary/20">
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-on-surface">
                              {emergencyLetter.status === 'unread'
                                ? 'Disponible para abrir ahora'
                                : 'Ya leída · Disponible cuando la necesites'}
                            </p>
                            <p className="text-xs text-on-surface-variant mt-0.5">
                              {emergencyLetter.sender} la escribió para arroparte con amor
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleOpenReader(emergencyLetter)}
                            className="px-4 py-2 rounded-full bg-secondary-container hover:bg-secondary hover:text-on-secondary text-on-secondary-fixed text-xs font-semibold active:scale-95 transition-all flex items-center gap-1.5 shadow-xs border border-secondary/20 shrink-0 cursor-pointer"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                            <span>Abrir ahora</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Lectura íntima: Papel Verjurado */}
              {featuredOpenLetter && (
                <section className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MailOpen className="w-4 h-4 text-primary" />
                      <h2 className="font-editorial text-xl font-medium text-on-surface">
                        Lectura íntima
                      </h2>
                    </div>
                    <span className="text-xs text-primary font-semibold flex items-center gap-1.5 bg-surface-container-low px-3 py-1 rounded-full border border-primary/20">
                      {featuredOpenLetter.status === 'unread'
                        ? 'Sobre recién llegado'
                        : 'Sobre abierto'}
                    </span>
                  </div>

                  <div className="relative bg-[#FFFCF8] rounded-3xl p-5 sm:p-7 shadow-[0_8px_24px_-4px_rgba(73,58,59,0.09)] border-2 border-dashed border-[#E8B8C4]/70 flex flex-col gap-4 -rotate-[0.4deg] hover:rotate-0 transition-transform duration-300">
                    {/* Vintage Stamps */}
                    <div className="absolute top-4 right-4 flex items-center gap-2 pointer-events-none">
                      <div className="w-11 h-11 rounded-full border border-outline/40 hidden sm:flex flex-col items-center justify-center text-[7px] text-outline font-bold tracking-tighter opacity-75 -rotate-12">
                        <span>POSTAL</span>
                        <span className="border-t border-b border-outline/30 w-8 text-center py-0.5">
                          COFRE
                        </span>
                        <span>AMOR</span>
                      </div>
                      <div className="w-12 h-14 bg-[#fff5f6] rounded-xs p-1 shadow-xs flex flex-col items-center justify-between rotate-3 border border-outline-variant/60">
                        <Heart className="w-4 h-4 text-primary fill-primary" />
                        <span className="text-[8px] text-outline uppercase tracking-tighter font-bold">
                          {featuredOpenLetter.stampCode || 'CORREO 04'}
                        </span>
                        <div className="w-full h-0.5 bg-outline-variant" />
                      </div>
                    </div>

                    <div className="flex flex-col pr-16 sm:pr-28">
                      <span className="text-[11px] text-on-surface-variant uppercase tracking-widest font-semibold flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {featuredOpenLetter.dateLabel}
                      </span>
                      <h3 className="font-editorial text-2xl sm:text-3xl text-primary italic leading-tight pt-1">
                        {featuredOpenLetter.title},
                      </h3>
                    </div>

                    <p className="font-editorial text-lg sm:text-xl text-on-surface italic leading-relaxed select-text whitespace-pre-line">
                      “{featuredOpenLetter.body}”
                    </p>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-[#E8B8C4]/50 to-transparent" />

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E8B8C4] to-[#caa0ab] flex items-center justify-center text-xs font-bold text-white shadow-xs">
                          {featuredOpenLetter.sender.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-on-surface font-medium italic">
                          Con todo mi amor, {featuredOpenLetter.sender}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleArchive(featuredOpenLetter)}
                          className="flex items-center gap-1.5 text-on-surface-variant text-xs font-semibold hover:text-primary transition-colors bg-surface-container-low px-3.5 py-1.5 rounded-full border border-outline-variant/40 cursor-pointer"
                        >
                          <Archive className="w-3.5 h-3.5" />
                          <span>Archivar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleFavorite(featuredOpenLetter)}
                          className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-colors cursor-pointer ${
                            featuredOpenLetter.isFavorite
                              ? 'bg-primary text-on-primary border-primary'
                              : 'bg-surface-container-low text-primary border-primary/20 hover:bg-primary-fixed/40'
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>
                            {featuredOpenLetter.isFavorite ? 'En favoritas' : 'Favorita'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Cartitas en el cofre */}
              <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-editorial text-xl font-medium text-on-surface">
                    Cartitas en el cofre
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveSubTab('leidas')}
                    className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Ver todas las leídas →
                  </button>
                </div>

                {chestLetters.length === 0 ? (
                  <div className="py-10 text-center bg-surface-container-low rounded-3xl border border-dashed border-outline-variant/60">
                    <p className="font-editorial text-lg text-on-surface">
                      Todas tus cartitas están archivadas o en espera
                    </p>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Revisa la pestaña Archivadas o escribe una nueva cartita.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {chestLetters.map((letter) => renderLetterCard(letter, 'todas'))}
                  </div>
                )}
              </section>
            </div>
          )}

          {activeSubTab === 'leidas' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {readLetters.length === 0 ? (
                <div className="col-span-full py-12 text-center bg-surface-container-low rounded-3xl border border-dashed border-outline-variant/60">
                  <p className="font-editorial text-lg text-on-surface">
                    No hay cartitas leídas activas
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Cuando abras una cartita o la desarchives aparecerá aquí.
                  </p>
                </div>
              ) : (
                readLetters.map((letter) => renderLetterCard(letter, 'todas'))
              )}
            </div>
          )}

          {activeSubTab === 'capsulas' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {capsuleLetters.length === 0 ? (
                  <div className="col-span-full py-10 text-center bg-surface-container-low rounded-3xl border border-dashed border-outline-variant/60">
                    <p className="font-editorial text-lg text-on-surface">
                      No hay cápsulas activas
                    </p>
                  </div>
                ) : (
                  capsuleLetters.map((cap, idx) => (
                    <div
                      key={cap.id}
                      className="relative bg-[#FFFDF9] rounded-2xl p-5 shadow-sm border border-primary-container/60 flex flex-col gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-full bg-primary-container flex items-center justify-center text-primary shrink-0">
                          <Lock className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                            Cápsula #{idx + 1} · Abre el {cap.dateLabel}
                          </span>
                          <h3 className="font-editorial text-lg font-semibold text-on-surface mt-0.5">
                            {cap.title}
                          </h3>
                          <p className="text-xs text-on-surface-variant mt-1">
                            Escrita por {cap.sender} para {cap.recipient}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-outline-variant/30">
                        <span className="text-xs font-semibold text-primary">
                          Faltan {cap.daysRemaining ?? 112} días
                        </span>
                        <button
                          type="button"
                          onClick={() => setInfoCapsule(cap)}
                          className="text-xs font-semibold text-secondary hover:underline cursor-pointer"
                        >
                          Ver sello y fecha
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button
                type="button"
                onClick={() => openComposeNew('capsule')}
                className="w-full py-3.5 px-5 rounded-2xl border-2 border-dashed border-primary-container text-primary font-semibold text-sm hover:bg-primary-fixed/20 transition-colors cursor-pointer"
              >
                + Sellar una nueva cápsula del tiempo
              </button>
            </div>
          )}

          {activeSubTab === 'borradores' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {draftLetters.length === 0 ? (
                <div className="col-span-full py-12 text-center bg-surface-container-low rounded-3xl border border-dashed border-outline-variant/60">
                  <p className="font-editorial text-lg text-on-surface">
                    No tienes borradores pendientes
                  </p>
                  <button
                    type="button"
                    onClick={() => openComposeNew('immediate')}
                    className="mt-3 px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-semibold cursor-pointer"
                  >
                    Empezar a escribir
                  </button>
                </div>
              ) : (
                draftLetters.map((draft) => (
                  <div
                    key={draft.id}
                    className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/40 shadow-xs flex flex-col justify-between gap-3"
                  >
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-tertiary">
                        Borrador para {draft.recipient}
                      </span>
                      <h3 className="font-editorial text-lg font-semibold text-on-surface mt-1">
                        {draft.title}
                      </h3>
                      <p className="text-sm text-on-surface-variant italic line-clamp-3 mt-1">
                        {draft.body}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-outline-variant/25">
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteLetter(draft.id);
                          onNotify('Borrador descartado');
                        }}
                        className="text-xs text-error font-medium hover:underline cursor-pointer"
                      >
                        Descartar
                      </button>
                      <button
                        type="button"
                        onClick={() => openComposeFromDraft(draft)}
                        className="px-4 py-1.5 rounded-full bg-primary text-on-primary text-xs font-semibold cursor-pointer"
                      >
                        Continuar escribiendo
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* VIEW 2: FAVORITAS */}
      {collectionFilter === 'favoritas' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-editorial text-2xl font-medium text-on-surface">
                Nuestras Favoritas
              </h2>
              <p className="text-xs text-on-surface-variant italic">
                Las cartas que guardas más cerca del corazón.
              </p>
            </div>
          </div>

          {favoriteLetters.length === 0 ? (
            <div className="py-14 px-6 text-center bg-surface-container-low rounded-3xl border border-dashed border-primary-container">
              <div className="w-12 h-12 rounded-full bg-primary-fixed/60 text-primary flex items-center justify-center mx-auto mb-3">
                <Heart className="w-5 h-5" />
              </div>
              <p className="font-editorial text-xl text-on-surface">
                Aún no tienes cartitas favoritas
              </p>
              <p className="text-xs text-on-surface-variant mt-1 max-w-xs mx-auto">
                Toca el corazón en cualquier carta para guardarla aquí y volver a leerla cuando quieras.
              </p>
              <button
                type="button"
                onClick={() => setCollectionFilter('todas')}
                className="mt-4 px-5 py-2 rounded-full bg-primary text-on-primary text-xs font-semibold cursor-pointer"
              >
                Explorar todas las cartitas
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favoriteLetters.map((letter) => renderLetterCard(letter, 'favoritas'))}
            </div>
          )}
        </section>
      )}

      {/* VIEW 3: ARCHIVADAS */}
      {collectionFilter === 'archivadas' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-editorial text-2xl font-medium text-on-surface">
                Cofre de Archivadas
              </h2>
              <p className="text-xs text-on-surface-variant italic">
                Recuerdos guardados con calma; puedes desarchivarlos en cualquier momento.
              </p>
            </div>
          </div>

          {archivedLetters.length === 0 ? (
            <div className="py-14 px-6 text-center bg-surface-container-low rounded-3xl border border-dashed border-outline-variant/60">
              <div className="w-12 h-12 rounded-full bg-secondary-container/70 text-secondary flex items-center justify-center mx-auto mb-3">
                <Archive className="w-5 h-5" />
              </div>
              <p className="font-editorial text-xl text-on-surface">
                No hay cartitas archivadas
              </p>
              <p className="text-xs text-on-surface-variant mt-1 max-w-xs mx-auto">
                Cuando archives una carta se guardará aquí fuera de la vista principal.
              </p>
              <button
                type="button"
                onClick={() => setCollectionFilter('todas')}
                className="mt-4 px-5 py-2 rounded-full bg-secondary text-on-secondary text-xs font-semibold cursor-pointer"
              >
                Volver a Todas
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {archivedLetters.map((letter) => renderLetterCard(letter, 'archivadas'))}
            </div>
          )}
        </section>
      )}

      {/* COMPOSE LETTER MODAL */}
      {composeOpen && (
        <div
          className="fixed inset-0 z-50 bg-inverse-surface/45 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setComposeOpen(false)}
        >
          <div
            className="bg-[#FFFDF9] w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[92vh] overflow-y-auto border border-[#EBE3D5]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFC8]/70">
              <div>
                <span className="text-[10px] text-primary uppercase font-bold tracking-widest">
                  Papel y Tinta
                </span>
                <h3 className="font-editorial text-2xl text-on-surface italic">
                  Escribir una cartita
                </h3>
              </div>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={() => setComposeOpen(false)}
                className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-outline hover:text-on-surface cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-xs text-on-surface font-semibold mb-1.5">
                  Para quién
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[couple.partner1, couple.partner2].map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setRecipient(name)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        recipient === name
                          ? 'border-primary bg-primary-container/30 text-on-surface'
                          : 'border-outline-variant/40 text-on-surface-variant'
                      }`}
                    >
                      Para {name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-on-surface font-semibold mb-1.5">
                  Título o destino de la carta *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Para cuando vuelvas de viaje..."
                  className="w-full bg-[#FAF5EC] rounded-xl px-3.5 py-2.5 text-sm text-on-surface placeholder:text-outline/70 focus:bg-white focus:ring-2 focus:ring-primary-container focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-on-surface font-semibold mb-1.5">
                  Mensaje desde el alma *
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Escribe aquí lo que a veces cuesta decir en voz alta..."
                  rows={5}
                  className="w-full bg-[#FAF5EC] rounded-xl p-4 font-editorial italic text-base text-on-surface placeholder:text-outline/70 focus:bg-white focus:ring-2 focus:ring-primary-container focus:outline-none leading-relaxed resize-none"
                />
              </div>

              <div className="bg-surface-container-low/70 p-3.5 rounded-2xl space-y-2.5">
                <label className="block text-xs text-on-surface font-semibold">
                  ¿Cuándo se podrá abrir?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('immediate')}
                    className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      deliveryType === 'immediate'
                        ? 'bg-primary text-on-primary border-primary'
                        : 'bg-surface-container-lowest border-outline-variant/40 text-on-surface-variant'
                    }`}
                  >
                    Inmediata
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType('emergency')}
                    className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      deliveryType === 'emergency'
                        ? 'bg-secondary text-on-secondary border-secondary'
                        : 'bg-surface-container-lowest border-outline-variant/40 text-on-surface-variant'
                    }`}
                  >
                    Emergencia
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType('capsule')}
                    className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      deliveryType === 'capsule'
                        ? 'bg-tertiary text-on-tertiary border-tertiary'
                        : 'bg-surface-container-lowest border-outline-variant/40 text-on-surface-variant'
                    }`}
                  >
                    Con fecha
                  </button>
                </div>

                {deliveryType === 'capsule' && (
                  <div className="pt-1">
                    <label className="block text-[11px] text-on-surface-variant mb-1">
                      Fecha de apertura programada
                    </label>
                    <input
                      type="date"
                      value={unlockDate}
                      onChange={(e) => setUnlockDate(e.target.value)}
                      className="w-full bg-surface-container-lowest rounded-xl px-3 py-2 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleSubmitLetter(false)}
                  className="w-full py-3.5 rounded-full bg-primary-container text-on-primary-container font-semibold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span>Sellar con cera y guardar</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmitLetter(true)}
                  className="w-full py-2 text-center text-on-surface-variant text-xs font-semibold hover:underline cursor-pointer"
                >
                  Guardar como borrador
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULL LETTER READER MODAL */}
      {selectedLetter && (
        <div
          className="fixed inset-0 z-50 bg-inverse-surface/45 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedLetter(null)}
        >
          <div
            className="bg-[#FFFCF8] w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-dashed border-[#E8B8C4] relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Cerrar lectura"
              onClick={() => setSelectedLetter(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pr-10">
              <span className="text-[11px] uppercase tracking-widest text-primary font-semibold flex items-center gap-1.5">
                <Feather className="w-3.5 h-3.5" />
                Para {selectedLetter.recipient} · {selectedLetter.dateLabel}
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl italic text-on-surface mt-2">
                {selectedLetter.title}
              </h3>
            </div>

            <div className="my-5 font-editorial italic text-lg text-on-surface leading-relaxed whitespace-pre-line">
              “{selectedLetter.body}”
            </div>

            <div className="pt-4 border-t border-[#E8B8C4]/50 flex flex-col gap-3">
              <span className="text-sm font-medium italic text-on-surface">
                Con todo mi amor, {selectedLetter.sender}
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleFavorite(selectedLetter)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                    selectedLetter.isFavorite
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container text-primary'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${selectedLetter.isFavorite ? 'fill-white' : ''}`} />
                  <span>
                    {selectedLetter.isFavorite ? 'Quitar de favoritas' : 'Favorita'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleArchive(selectedLetter)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                    selectedLetter.isArchived
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {selectedLetter.isArchived ? (
                    <>
                      <ArchiveRestore className="w-3.5 h-3.5" />
                      <span>Desarchivar</span>
                    </>
                  ) : (
                    <>
                      <Archive className="w-3.5 h-3.5" />
                      <span>Archivar</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onNotify(`Abrazo de respuesta enviado a ${selectedLetter.sender}`);
                    setSelectedLetter(null);
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Responder con cariño</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CAPSULE INFO DIALOG */}
      {infoCapsule && (
        <div
          className="fixed inset-0 z-50 bg-inverse-surface/45 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setInfoCapsule(null)}
        >
          <div
            className="bg-surface-container-lowest w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 mx-auto rounded-full bg-primary-fixed flex items-center justify-center text-primary">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-xl font-semibold text-on-surface">
              Cápsula sellada con lacre
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Esta cartita de{' '}
              <span className="font-semibold text-on-surface">{infoCapsule.sender}</span>{' '}
              descansa protegida hasta el{' '}
              <span className="font-semibold text-primary">{infoCapsule.dateLabel}</span>.
            </p>
            <p className="text-xs text-secondary font-medium">
              Faltan {infoCapsule.daysRemaining ?? 112} días para romper el sello juntos.
            </p>
            <button
              type="button"
              onClick={() => setInfoCapsule(null)}
              className="w-full py-3 rounded-full bg-primary text-on-primary text-sm font-semibold mt-2 cursor-pointer"
            >
              Esperar con ilusión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
