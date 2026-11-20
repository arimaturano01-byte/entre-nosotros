import React, { useEffect, useState, useRef } from 'react';
import {
  Bell,
  Camera,
  Compass,
  Heart,
  Home,
  Lock,
  Mail,
  Users,
} from 'lucide-react';
import {
  INITIAL_COUPLE,
  INITIAL_LETTERS,
  INITIAL_MEMORIES,
  INITIAL_MILESTONES,
  INITIAL_PLANS,
  INITIAL_QUESTIONS,
  INITIAL_SETTINGS,
  INITIAL_THOUGHTS,
} from './data/initialData';
import {
  AppSettings,
  CoupleProfile,
  DailyQuestion,
  DailyThought,
  LetterItem,
  MemoryItem,
  MilestoneItem,
  PlanItem,
  TabId,
} from './types';
import { WelcomeScreen } from './components/WelcomeScreen';
import { InicioView } from './components/InicioView';
import { RecuerdosView } from './components/RecuerdosView';
import { CartitasView } from './components/CartitasView';
import { PlanesView } from './components/PlanesView';
import { NosotrosView } from './components/NosotrosView';
import { SafeImage } from './components/SafeImage';
import { doc, onSnapshot, setDoc, runTransaction } from 'firebase/firestore';
import { db, auth } from './firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';

const STORAGE_KEY = 'entre-nosotros-state-v1';

interface PersistedState {
  couple: CoupleProfile;
  memories: MemoryItem[];
  letters: LetterItem[];
  plans: PlanItem[];
  milestones: MilestoneItem[];
  thoughts: DailyThought[];
  questions: DailyQuestion[];
  settings: AppSettings;
}

const DEFAULT_STATE: PersistedState = {
  couple: INITIAL_COUPLE,
  memories: INITIAL_MEMORIES,
  letters: INITIAL_LETTERS,
  plans: INITIAL_PLANS,
  milestones: INITIAL_MILESTONES,
  thoughts: INITIAL_THOUGHTS,
  questions: INITIAL_QUESTIONS,
  settings: INITIAL_SETTINGS,
};

function loadInitialState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      couple: parsed.couple || DEFAULT_STATE.couple,
      memories: parsed.memories || DEFAULT_STATE.memories,
      letters: parsed.letters || DEFAULT_STATE.letters,
      plans: parsed.plans || DEFAULT_STATE.plans,
      milestones: parsed.milestones || DEFAULT_STATE.milestones,
      thoughts: parsed.thoughts || DEFAULT_STATE.thoughts,
      questions: parsed.questions || DEFAULT_STATE.questions,
      settings: parsed.settings || DEFAULT_STATE.settings,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

const TAB_ITEMS: { id: TabId; label: string }[] = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'recuerdos', label: 'Recuerdos' },
  { id: 'cartitas', label: 'Cartitas' },
  { id: 'planes', label: 'Planes' },
  { id: 'nosotros', label: 'Nosotros' },
];

export default function App() {
  const [state, setState] = useState<PersistedState>(loadInitialState);
  const [cloudReady, setCloudReady] = useState(false);
  const lastCloudStateRef = useRef<string | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('inicio');
  const [showWelcome, setShowWelcome] = useState(true);
  const [pinPreviewOpen, setPinPreviewOpen] = useState(false);
  const [pinDigits, setPinDigits] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCreateMemoryOpen, setIsCreateMemoryOpen] = useState(false);
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setFirebaseUser(user);
  });

  return () => unsubscribe();
}, []);

useEffect(() => {
  if (!firebaseUser || !state.couple.coupleCode) {
    setCloudReady(false);
    return;
  }

  const sharedRef = doc(
    db,
    'couples',
    state.couple.coupleCode,
    'shared',
    'state'
  );

  const unsubscribe = onSnapshot(
    sharedRef,
    async (snapshot) => {
      if (snapshot.exists()) {
        const cloudState = snapshot.data() as PersistedState;
        lastCloudStateRef.current = JSON.stringify(cloudState);
        setState(cloudState);
        setCloudReady(true);
      } else {
        try {
          await runTransaction(db, async (transaction) => {
            const current = await transaction.get(sharedRef);

            if (!current.exists()) {
              transaction.set(sharedRef, state);
            }
          });
        } catch (error) {
          setCloudReady(false);
          console.error('Error al inicializar datos:', error);
        }
      }
    },
    (error) => {
      setCloudReady(false);
      console.error('Error al leer Firestore:', error);
    }
  );

  return () => unsubscribe();
}, [firebaseUser, state.couple.coupleCode]);

useEffect(() => {
  if (!firebaseUser || !cloudReady || !state.couple.coupleCode) return;

  const serializedState = JSON.stringify(state);

  if (serializedState === lastCloudStateRef.current) return;

  lastCloudStateRef.current = serializedState;

  const sharedRef = doc(
    db,
    'couples',
    state.couple.coupleCode,
    'shared',
    'state'
  );

  setDoc(sharedRef, state).catch((error) => {
    lastCloudStateRef.current = null;
    console.error('Error al guardar datos en Firestore:', error);
  });
}, [firebaseUser, cloudReady, state]);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage quota errors
    }
  }, [state]);

  const notify = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2600);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const unreadLettersCount = state.letters.filter(
    (l) => l.status === 'unread' && !l.isArchived
  ).length;
  const selectedMemory =
    state.memories.find((m) => m.id === selectedMemoryId) || null;

  // Handlers
  const handleEnterFromWelcome = (updatedCouple?: Partial<CoupleProfile>) => {
    if (updatedCouple) {
      setState((prev) => ({
        ...prev,
        couple: {
          ...prev.couple,
          ...updatedCouple,
        },
      }));
    }
    setShowWelcome(false);
    setActiveTab('inicio');
  };

  const handleToggleThoughtFavorite = (id: string) => {
    setState((prev) => ({
      ...prev,
      thoughts: prev.thoughts.map((t) =>
        t.id === id ? { ...t, isFavorite: !t.isFavorite } : t
      ),
    }));
  };

  const handleSubmitQuestionAnswer = (questionId: string, answerText: string) => {
    setState((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              partner2Answer: {
                author: prev.couple.partner2,
                timeAgo: 'Justo ahora',
                text: answerText,
              },
            }
          : q
      ),
    }));
  };

  const handleToggleMemoryFavorite = (id: string) => {
    setState((prev) => ({
      ...prev,
      memories: prev.memories.map((m) =>
        m.id === id ? { ...m, isFavorite: !m.isFavorite } : m
      ),
    }));
  };

  const handleAddMemory = (memory: Omit<MemoryItem, 'id' | 'notes'>) => {
    const newItem: MemoryItem = {
      ...memory,
      id: `m-${Date.now()}`,
      notes: [],
    };
    setState((prev) => ({
      ...prev,
      memories: [newItem, ...prev.memories],
    }));
  };

  const handleUpdateMemory = (id: string, patch: Partial<MemoryItem>) => {
    setState((prev) => ({
      ...prev,
      memories: prev.memories.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    }));
  };

  const handleDeleteMemory = (id: string) => {
    setState((prev) => ({
      ...prev,
      memories: prev.memories.filter((m) => m.id !== id),
    }));
    if (selectedMemoryId === id) {
      setSelectedMemoryId(null);
    }
  };

  const handleAddMemoryNote = (memoryId: string, author: string, text: string) => {
    setState((prev) => ({
      ...prev,
      memories: prev.memories.map((m) =>
        m.id === memoryId
          ? {
              ...m,
              notes: [
                ...m.notes,
                {
                  id: `note-${Date.now()}`,
                  author,
                  text,
                  createdAt: 'Justo ahora',
                },
              ],
            }
          : m
      ),
    }));
  };

  const handleAddLetter = (letter: Omit<LetterItem, 'id'>) => {
    const newLetter: LetterItem = {
      ...letter,
      id: `l-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      letters: [newLetter, ...prev.letters],
    }));
  };

  const handleUpdateLetter = (id: string, patch: Partial<LetterItem>) => {
    setState((prev) => ({
      ...prev,
      letters: prev.letters.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    }));
  };

  const handleDeleteLetter = (id: string) => {
    setState((prev) => ({
      ...prev,
      letters: prev.letters.filter((l) => l.id !== id),
    }));
  };

  const handleTogglePlanComplete = (id: string) => {
    setState((prev) => ({
      ...prev,
      plans: prev.plans.map((p) =>
        p.id === id
          ? {
              ...p,
              completed: !p.completed,
              completedDateLabel: !p.completed ? 'Hoy' : undefined,
            }
          : p
      ),
    }));
  };

  const handleAddPlan = (plan: Omit<PlanItem, 'id'>) => {
    const newPlan: PlanItem = {
      ...plan,
      id: `p-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      plans: [newPlan, ...prev.plans],
    }));
  };

  const handleDeletePlan = (id: string) => {
    setState((prev) => ({
      ...prev,
      plans: prev.plans.filter((p) => p.id !== id),
    }));
  };

  const handleUpdateCouple = (patch: Partial<CoupleProfile>) => {
    setState((prev) => ({
      ...prev,
      couple: { ...prev.couple, ...patch },
    }));
  };

  const handleAddMilestone = (milestone: Omit<MilestoneItem, 'id'>) => {
    const newMs: MilestoneItem = {
      ...milestone,
      id: `ms-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      milestones: [...prev.milestones, newMs],
    }));
  };

  const handleUpdateSettings = (patch: Partial<AppSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...patch },
    }));
  };

  const renderTabIcon = (id: TabId, isActive: boolean) => {
    const cls = `w-5 h-5 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`;
    switch (id) {
      case 'inicio':
        return <Home className={cls} />;
      case 'recuerdos':
        return <Camera className={cls} />;
      case 'cartitas':
        return <Mail className={cls} />;
      case 'planes':
        return <Compass className={cls} />;
      case 'nosotros':
        return <Users className={cls} />;
    }
  };

  if (showWelcome) {
    return (
      <WelcomeScreen
        couple={state.couple}
        onEnterApp={handleEnterFromWelcome}
        onNotify={notify}
      />
    );
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col relative">
      {/* Top App Bar (Mobile compact + Desktop 3-zone navigation) */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/25 pt-safe">
        <div className="max-w-6xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Left: Couple Avatars & Brand */}
          <button
            type="button"
            onClick={() => setActiveTab('inicio')}
            className="flex items-center gap-2.5 text-left cursor-pointer shrink-0"
          >
            <div className="relative flex -space-x-2">
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-surface bg-primary-container shadow-xs">
                <SafeImage
                  src={state.couple.avatar1Url}
                  alt={state.couple.partner1}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-surface bg-secondary-container shadow-xs">
                <SafeImage
                  src={state.couple.avatar2Url}
                  alt={state.couple.partner2}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-editorial text-base sm:text-lg font-semibold text-on-surface tracking-tight leading-tight">
                Entre Nosotros
              </span>
              <span className="text-[11px] text-secondary font-medium flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary" />
                {state.couple.partner1} &amp; {state.couple.partner2}
              </span>
            </div>
          </button>

          {/* Center: Desktop / Tablet Horizontal Navigation */}
          <nav
            aria-label="Navegación principal"
            className="hidden md:flex items-center gap-1 bg-surface-container-low p-1 rounded-full border border-outline-variant/25"
          >
            {TAB_ITEMS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.id === 'cartitas' && unreadLettersCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-primary-container text-on-primary-container text-[10px] font-bold leading-none">
                      {unreadLettersCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Soft Notifications & Heart Pulse */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              aria-label="Notificaciones sincronizadas"
              onClick={() =>
                notify(`Notificaciones sincronizadas con ${state.couple.partner1}`)
              }
              className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label="Enviar latido con amor"
              onClick={() =>
                notify(`¡Un latido enviado con amor a ${state.couple.partner1}!`)
              }
              className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-primary transition-colors cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-primary" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-28 md:pb-12">
        {activeTab === 'inicio' && (
          <InicioView
            couple={state.couple}
            memories={state.memories}
            letters={state.letters}
            plans={state.plans}
            thoughts={state.thoughts}
            questions={state.questions}
            onSwitchTab={(tab) => setActiveTab(tab)}
            onOpenNewMemory={() => {
              setActiveTab('recuerdos');
              setIsCreateMemoryOpen(true);
            }}
            onSelectMemory={(memory) => {
              setSelectedMemoryId(memory.id);
              setActiveTab('recuerdos');
            }}
            onToggleThoughtFavorite={handleToggleThoughtFavorite}
            onSubmitQuestionAnswer={handleSubmitQuestionAnswer}
            onNotify={notify}
          />
        )}

        {activeTab === 'recuerdos' && (
          <RecuerdosView
            couple={state.couple}
            memories={state.memories}
            onToggleFavorite={handleToggleMemoryFavorite}
            onAddMemory={handleAddMemory}
            onUpdateMemory={handleUpdateMemory}
            onDeleteMemory={handleDeleteMemory}
            onAddNoteToMemory={handleAddMemoryNote}
            selectedMemory={selectedMemory}
            onSelectMemory={(mem) => setSelectedMemoryId(mem ? mem.id : null)}
            isCreateModalOpen={isCreateMemoryOpen}
            onOpenCreateModal={() => setIsCreateMemoryOpen(true)}
            onCloseCreateModal={() => setIsCreateMemoryOpen(false)}
            onNotify={notify}
          />
        )}

        {activeTab === 'cartitas' && (
          <CartitasView
            couple={state.couple}
            letters={state.letters}
            onAddLetter={handleAddLetter}
            onUpdateLetter={handleUpdateLetter}
            onDeleteLetter={handleDeleteLetter}
            onNotify={notify}
          />
        )}

        {activeTab === 'planes' && (
          <PlanesView
            plans={state.plans}
            onToggleComplete={handleTogglePlanComplete}
            onAddPlan={handleAddPlan}
            onDeletePlan={handleDeletePlan}
            onSwitchTab={(tab) => setActiveTab(tab)}
            onNotify={notify}
          />
        )}

        {activeTab === 'nosotros' && (
          <NosotrosView
            couple={state.couple}
            milestones={state.milestones}
            settings={state.settings}
            onUpdateCouple={handleUpdateCouple}
            onAddMilestone={handleAddMilestone}
            onUpdateSettings={handleUpdateSettings}
            onAddPlan={handleAddPlan}
            onShowWelcome={() => setShowWelcome(true)}
            onTestPinLock={() => {
              setPinDigits('');
              setPinPreviewOpen(true);
            }}
            onNotify={notify}
          />
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation */}
      <nav
        aria-label="Barra inferior"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 pb-safe bg-surface-bright/92 backdrop-blur-xl border-t border-outline-variant/25 shadow-[0_-4px_20px_rgba(73,58,59,0.05)]"
      >
        <div className="flex justify-around items-center h-18 px-1">
          {TAB_ITEMS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col items-center justify-center gap-1 min-w-[60px] h-14 transition-colors cursor-pointer ${
                  isActive ? 'text-primary font-semibold' : 'text-on-surface-variant'
                }`}
              >
                <span
                  className={`w-10 h-7 rounded-full flex items-center justify-center transition-colors ${
                    isActive ? 'bg-surface-container' : ''
                  }`}
                >
                  {renderTabIcon(tab.id, isActive)}
                </span>
                {tab.id === 'cartitas' && unreadLettersCount > 0 && (
                  <span className="absolute top-1.5 right-3 w-4 h-4 rounded-full bg-primary text-on-primary text-[9px] font-bold flex items-center justify-center">
                    {unreadLettersCount}
                  </span>
                )}
                <span className="text-[11px] leading-none whitespace-nowrap">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Optional PIN Lock Screen Preview (triggered from Nosotros -> Probar) */}
      {pinPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-surface/98 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-primary-fixed flex items-center justify-center text-primary mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-editorial text-2xl font-semibold text-on-surface">
            Espacio protegido
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Ingresa cualquier código de 4 dígitos para desbloquear (demo)
          </p>

          <div className="flex items-center gap-3 my-6">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full border-2 transition-colors ${
                  pinDigits.length > idx
                    ? 'bg-primary border-primary'
                    : 'border-outline-variant bg-transparent'
                }`}
              />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-[240px]">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '←'].map(
              (key, i) => {
                if (!key) return <div key={i} />;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      if (key === '←') {
                        setPinDigits((d) => d.slice(0, -1));
                        return;
                      }
                      const next = pinDigits + key;
                      setPinDigits(next);
                      if (next.length >= 4) {
                        setTimeout(() => {
                          setPinPreviewOpen(false);
                          setPinDigits('');
                          notify('Diario desbloqueado con amor');
                        }, 200);
                      }
                    }}
                    className="w-16 h-14 rounded-2xl bg-surface-container-low hover:bg-surface-container text-lg font-semibold text-on-surface cursor-pointer active:scale-95 transition-transform"
                  >
                    {key}
                  </button>
                );
              }
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setPinPreviewOpen(false);
              setPinDigits('');
            }}
            className="mt-6 text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            Volver a la aplicación
          </button>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-full shadow-lg text-xs font-medium flex items-center gap-2 pointer-events-none whitespace-nowrap">
          <Heart className="w-3.5 h-3.5 text-primary-container fill-primary-container shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
