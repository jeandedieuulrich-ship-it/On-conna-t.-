import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  EventItem,
  ProviderItem,
  QuoteRequest,
  EventReport,
  SubscriptionPayment,
  Language,
  UserRole,
} from '../types';
import { INITIAL_EVENTS, INITIAL_PROVIDERS } from '../data/mockData';
import { TRANSLATIONS } from '../utils/translations';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS['fr']) => string;

  userRole: UserRole;
  setUserRole: (role: UserRole) => void;

  activeTab: 'home' | 'events' | 'providers' | 'near-me' | 'map' | 'organizer' | 'provider-hub' | 'admin';
  setActiveTab: (tab: 'home' | 'events' | 'providers' | 'near-me' | 'map' | 'organizer' | 'provider-hub' | 'admin') => void;

  events: EventItem[];
  providers: ProviderItem[];
  quotes: QuoteRequest[];
  reports: EventReport[];
  payments: SubscriptionPayment[];

  // Favorites
  favoriteEventIds: string[];
  favoriteProviderIds: string[];
  toggleFavoriteEvent: (id: string) => void;
  toggleFavoriteProvider: (id: string) => void;

  // Selected for modals
  selectedEvent: EventItem | null;
  setSelectedEvent: (evt: EventItem | null) => void;
  selectedProvider: ProviderItem | null;
  setSelectedProvider: (prov: ProviderItem | null) => void;

  // Modal open states
  isAddEventOpen: boolean;
  setIsAddEventOpen: (open: boolean) => void;
  isRegisterProviderOpen: boolean;
  setIsRegisterProviderOpen: (open: boolean) => void;
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  paymentTargetProvider: ProviderItem | null;
  setPaymentTargetProvider: (prov: ProviderItem | null) => void;
  isQuoteModalOpen: boolean;
  setIsQuoteModalOpen: (open: boolean) => void;
  quoteTargetProvider: ProviderItem | null;
  setQuoteTargetProvider: (prov: ProviderItem | null) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  reportTargetEvent: EventItem | null;
  setReportTargetEvent: (evt: EventItem | null) => void;
  isLegalModalOpen: boolean;
  setIsLegalModalOpen: (open: boolean) => void;
  isShareModalOpen: boolean;
  setIsShareModalOpen: (open: boolean) => void;

  // Location
  userCoords: { lat: number; lng: number } | null;
  locationPermission: 'prompt' | 'granted' | 'denied';
  requestUserLocation: () => void;

  // Actions
  addEvent: (eventData: Omit<EventItem, 'id' | 'dateCreation' | 'vues' | 'statut'>) => void;
  updateEventStatus: (id: string, status: 'publie' | 'rejete') => void;
  deleteEvent: (id: string) => void;

  registerProvider: (data: Partial<ProviderItem>) => void;
  updateProviderVerification: (id: string, status: 'verified' | 'rejected') => void;
  renewProviderSubscription: (providerId: string, durationMonths: number) => void;

  submitQuoteRequest: (quote: Omit<QuoteRequest, 'id' | 'dateCreation' | 'statut'>) => void;
  updateQuoteStatus: (id: string, status: 'accepte' | 'refuse') => void;

  submitReport: (report: Omit<EventReport, 'id' | 'dateCreation' | 'statut'>) => void;
  updateReportStatus: (id: string, status: 'traite' | 'ignore') => void;

  submitPayment: (payment: Omit<SubscriptionPayment, 'id' | 'datePaiement' | 'statut'>) => void;
  confirmPaymentByAdmin: (id: string) => void;

  // Quick filters from hero or map
  selectedCityFilter: string;
  setSelectedCityFilter: (city: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('onconnait_lang') as Language) || 'fr';
  });

  const [userRole, setUserRole] = useState<UserRole>('visitor');
  const [activeTab, setActiveTab] = useState<'home' | 'events' | 'providers' | 'near-me' | 'map' | 'organizer' | 'provider-hub' | 'admin'>('home');

  // Events
  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('onconnait_events');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as EventItem[];
        // Merge missing initial events so new venues like Parc des Expositions are always loaded
        const existingIds = new Set(parsed.map((e) => e.id));
        const missingInitial = INITIAL_EVENTS.filter((e) => !existingIds.has(e.id));
        return [...missingInitial, ...parsed];
      } catch (err) {
        return INITIAL_EVENTS;
      }
    }
    return INITIAL_EVENTS;
  });

  // Providers
  const [providers, setProviders] = useState<ProviderItem[]>(() => {
    const saved = localStorage.getItem('onconnait_providers');
    return saved ? JSON.parse(saved) : INITIAL_PROVIDERS;
  });

  // Quotes
  const [quotes, setQuotes] = useState<QuoteRequest[]>(() => {
    const saved = localStorage.getItem('onconnait_quotes');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'quote-1',
            providerId: 'prov-1',
            providerName: 'Akwaba Visuals Studio',
            clientNom: 'Koffi Serge',
            clientTelephone: '+225 07 12 34 56 78',
            clientWhatsapp: '+225 07 12 34 56 78',
            clientEmail: 'koffi.serge@gmail.com',
            typeEvenement: 'Mariage coutumier & civil',
            dateEvenement: '2026-11-21',
            lieuEvenement: 'Cocody Danga, Abidjan',
            budgetEstimeFCFA: 350000,
            descriptionBesoin: 'Bonjour, nous souhaitons une couverture photo complète pour notre mariage avec livre photo prestige et mini clip.',
            dateCreation: '2026-09-28',
            statut: 'en_attente',
          },
        ];
  });

  // Reports
  const [reports, setReports] = useState<EventReport[]>(() => {
    const saved = localStorage.getItem('onconnait_reports');
    return saved ? JSON.parse(saved) : [];
  });

  // Payments
  const [payments, setPayments] = useState<SubscriptionPayment[]>(() => {
    const saved = localStorage.getItem('onconnait_payments');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'pay-1',
            providerId: 'prov-3',
            providerName: 'Délice Ivoire Traiteur & Réceptions',
            operateur: 'Orange Money',
            montantFCFA: 2000,
            referenceTransaction: 'OM-CI-984321',
            telephonePaiement: '0757346216',
            datePaiement: '2026-09-01',
            statut: 'valide',
          },
        ];
  });

  // Favorites
  const [favoriteEventIds, setFavoriteEventIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('onconnait_fav_events');
    return saved ? JSON.parse(saved) : ['evt-1'];
  });
  const [favoriteProviderIds, setFavoriteProviderIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('onconnait_fav_providers');
    return saved ? JSON.parse(saved) : ['prov-1'];
  });

  // Modal targets
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<ProviderItem | null>(null);

  // Modals visibility
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isRegisterProviderOpen, setIsRegisterProviderOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentTargetProvider, setPaymentTargetProvider] = useState<ProviderItem | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteTargetProvider, setQuoteTargetProvider] = useState<ProviderItem | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTargetEvent, setReportTargetEvent] = useState<EventItem | null>(null);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Search & Filter globals
  const [selectedCityFilter, setSelectedCityFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Geolocation (Default to Abidjan center if not granted)
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>({
    lat: 5.3400,
    lng: -4.0100, // Abidjan Plateau / Cocody area
  });
  const [locationPermission, setLocationPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');

  useEffect(() => {
    localStorage.setItem('onconnait_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('onconnait_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('onconnait_providers', JSON.stringify(providers));
  }, [providers]);

  useEffect(() => {
    localStorage.setItem('onconnait_quotes', JSON.stringify(quotes));
  }, [quotes]);

  useEffect(() => {
    localStorage.setItem('onconnait_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('onconnait_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('onconnait_fav_events', JSON.stringify(favoriteEventIds));
  }, [favoriteEventIds]);

  useEffect(() => {
    localStorage.setItem('onconnait_fav_providers', JSON.stringify(favoriteProviderIds));
  }, [favoriteProviderIds]);

  const t = (key: keyof typeof TRANSLATIONS['fr']): string => {
    return TRANSLATIONS[language][key] || TRANSLATIONS['fr'][key] || key;
  };

  const toggleFavoriteEvent = (id: string) => {
    setFavoriteEventIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleFavoriteProvider = (id: string) => {
    setFavoriteProviderIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const requestUserLocation = () => {
    if (!navigator.geolocation) {
      alert('La géolocalisation n\'est pas supportée par votre navigateur.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationPermission('granted');
      },
      () => {
        setLocationPermission('denied');
        // Default to Abidjan center for demo
        setUserCoords({
          lat: 5.3599,
          lng: -4.0083,
        });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const addEvent = (eventData: Omit<EventItem, 'id' | 'dateCreation' | 'vues' | 'statut'>) => {
    const newEvent: EventItem = {
      ...eventData,
      id: `evt-${Date.now()}`,
      dateCreation: new Date().toISOString().split('T')[0],
      vues: 1,
      statut: 'en_attente', // Needs validation by ON CONNAÎT team
    };
    setEvents((prev) => [newEvent, ...prev]);
  };

  const updateEventStatus = (id: string, status: 'publie' | 'rejete') => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, statut: status } : e))
    );
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const registerProvider = (data: Partial<ProviderItem>) => {
    const now = new Date();
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 90); // 3 months = 90 days trial

    const newProvider: ProviderItem = {
      id: `prov-${Date.now()}`,
      user_id: `user_prov_${Date.now()}`,
      nomCommercial: data.nomCommercial || 'Nouveau Prestataire CI',
      profession: data.profession || 'Photographe',
      domaine: data.domaine || 'Événementiel en Côte d\'Ivoire',
      presentation: data.presentation || '',
      ville: data.ville || 'Abidjan',
      commune: data.commune || 'Cocody',
      zoneIntervention: data.zoneIntervention || ['Abidjan'],
      photoProfil: data.photoProfil || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      services: data.services || [],
      portfolio: data.portfolio || [],
      contact: data.contact || {
        telephone: '+225 00 00 00 00 00',
        whatsapp: '+225 00 00 00 00 00',
        email: 'pro@onconnait.ci',
      },
      isVerified: false,
      rating: 5.0,
      reviewsCount: 1,
      nomCivil: data.nomCivil,
      prenoms: data.prenoms,
      dateNaissance: data.dateNaissance,
      pieceIdentiteType: data.pieceIdentiteType || 'CNI',
      numeroEntreprise: data.numeroEntreprise,
      verificationStatus: 'pending',
      // 3 months free trial
      trialStartDate: now.toISOString().split('T')[0],
      trialEndDate: trialEnd.toISOString().split('T')[0],
      isTrialActive: true,
      subscriptionStatus: 'trial',
      subscriptionValidUntil: trialEnd.toISOString().split('T')[0],
      dateCreation: now.toISOString().split('T')[0],
    };

    setProviders((prev) => [newProvider, ...prev]);
  };

  const updateProviderVerification = (id: string, status: 'verified' | 'rejected') => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              verificationStatus: status,
              isVerified: status === 'verified',
            }
          : p
      )
    );
  };

  const renewProviderSubscription = (providerId: string, durationMonths: number = 1) => {
    setProviders((prev) =>
      prev.map((p) => {
        if (p.id === providerId) {
          const currentValid = new Date(p.subscriptionValidUntil || new Date());
          const baseDate = currentValid > new Date() ? currentValid : new Date();
          baseDate.setMonth(baseDate.getMonth() + durationMonths);

          return {
            ...p,
            subscriptionStatus: 'active',
            subscriptionValidUntil: baseDate.toISOString().split('T')[0],
            isTrialActive: false,
          };
        }
        return p;
      })
    );
  };

  const submitQuoteRequest = (quote: Omit<QuoteRequest, 'id' | 'dateCreation' | 'statut'>) => {
    const newQuote: QuoteRequest = {
      ...quote,
      id: `quote-${Date.now()}`,
      dateCreation: new Date().toISOString().split('T')[0],
      statut: 'en_attente',
    };
    setQuotes((prev) => [newQuote, ...prev]);
  };

  const updateQuoteStatus = (id: string, status: 'accepte' | 'refuse') => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, statut: status } : q))
    );
  };

  const submitReport = (report: Omit<EventReport, 'id' | 'dateCreation' | 'statut'>) => {
    const newReport: EventReport = {
      ...report,
      id: `rep-${Date.now()}`,
      dateCreation: new Date().toISOString().split('T')[0],
      statut: 'nouveau',
    };
    setReports((prev) => [newReport, ...prev]);
  };

  const updateReportStatus = (id: string, status: 'traite' | 'ignore') => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, statut: status } : r))
    );
  };

  const submitPayment = (payment: Omit<SubscriptionPayment, 'id' | 'datePaiement' | 'statut'>) => {
    const newPayment: SubscriptionPayment = {
      ...payment,
      id: `pay-${Date.now()}`,
      datePaiement: new Date().toISOString().split('T')[0],
      statut: 'en_attente',
    };
    setPayments((prev) => [newPayment, ...prev]);
  };

  const confirmPaymentByAdmin = (id: string) => {
    setPayments((prev) =>
      prev.map((pay) => {
        if (pay.id === id) {
          // Also renew provider subscription
          renewProviderSubscription(pay.providerId, 1);
          return { ...pay, statut: 'valide' };
        }
        return pay;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        userRole,
        setUserRole,
        activeTab,
        setActiveTab,
        events,
        providers,
        quotes,
        reports,
        payments,
        favoriteEventIds,
        favoriteProviderIds,
        toggleFavoriteEvent,
        toggleFavoriteProvider,
        selectedEvent,
        setSelectedEvent,
        selectedProvider,
        setSelectedProvider,
        isAddEventOpen,
        setIsAddEventOpen,
        isRegisterProviderOpen,
        setIsRegisterProviderOpen,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        paymentTargetProvider,
        setPaymentTargetProvider,
        isQuoteModalOpen,
        setIsQuoteModalOpen,
        quoteTargetProvider,
        setQuoteTargetProvider,
        isReportModalOpen,
        setIsReportModalOpen,
        reportTargetEvent,
        setReportTargetEvent,
        isLegalModalOpen,
        setIsLegalModalOpen,
        isShareModalOpen,
        setIsShareModalOpen,
        userCoords,
        locationPermission,
        requestUserLocation,
        addEvent,
        updateEventStatus,
        deleteEvent,
        registerProvider,
        updateProviderVerification,
        renewProviderSubscription,
        submitQuoteRequest,
        updateQuoteStatus,
        submitReport,
        updateReportStatus,
        submitPayment,
        confirmPaymentByAdmin,
        selectedCityFilter,
        setSelectedCityFilter,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
