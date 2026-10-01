import React from 'react';
import { useApp } from '../context/AppContext';
import { HomeHero } from './HomeHero';
import { EventCard } from './EventCard';
import { ProviderCard } from './ProviderCard';
import {
  Flame,
  Calendar,
  Sparkles,
  MapPin,
  Star,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Scale,
  Share2,
  Copy,
  Check,
  MessageCircle,
} from 'lucide-react';
import { PAYMENT_CONFIG } from '../data/mockData';

interface HomeViewProps {
  onSearchSubmit: (params: { what: string; where: string; when: string; type: 'events' | 'providers' | 'all' }) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSearchSubmit }) => {
  const {
    events,
    providers,
    setActiveTab,
    setIsRegisterProviderOpen,
    setIsPaymentModalOpen,
    setIsLegalModalOpen,
    setIsShareModalOpen,
    t,
  } = useApp();

  const [copiedLink, setCopiedLink] = React.useState(false);

  const shareUrl = 'https://ais-pre-vf4t5spiqbt62qvvejhqc2-194091796142.europe-west2.run.app';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch (e) {
      // Ignored
    }
  };

  const publishedEvents = events.filter((e) => e.statut === 'publie');
  const featuredEvents = publishedEvents.filter((e) => e.featured).slice(0, 3);
  const parcExpositionsEvents = publishedEvents.filter((e) =>
    e.lieu.toLowerCase().includes('parc des expositions')
  );
  const concertEvents = publishedEvents.filter((e) => e.categorie === 'Concerts');
  const salonEvents = publishedEvents.filter((e) => e.categorie === 'Salons');
  const exhibitionEvents = publishedEvents.filter((e) => e.categorie === 'Expositions');
  const weekendEvents = publishedEvents.filter((e) => ['Samedi', 'Dimanche', 'Vendredi'].includes(e.jour)).slice(0, 3);
  const popularProviders = providers.slice(0, 4);

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <HomeHero onSearchSubmit={onSearchSubmit} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section 1: 🔥 ÉVÉNEMENTS À VENIR (Featured) */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-2xs">
                <Flame className="w-5 h-5 fill-orange-500 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {t('upcomingEvents')}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Les plus grands rendez-vous culturels et concerts à ne pas manquer
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('events')}
              className="hidden sm:flex items-center gap-1.5 text-xs font-black text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
            >
              <span>Voir tout l'agenda</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        </div>

        {/* Section 1.5: 🏛️ SPÉCIAL PARC DES EXPOSITIONS D'ABIDJAN (Concerts, Évangélisation, Salons, Foires) */}
        {parcExpositionsEvents.length > 0 && (
          <div className="bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden border border-purple-500/20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/30 border border-purple-400/40 text-purple-200 text-xs font-black tracking-wide mb-2">
                  <span>🏛️ LIEU EMBLÉMATIQUE DE CÔTE D'IVOIRE</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>Parc des Expositions d'Abidjan</span>
                  <span className="text-xs bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full">
                    Port-Bouët
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-2xl">
                  Le plus grand complexe événementiel d'Afrique de l'Ouest : découvrez les méga-concerts live, la grande croisade internationale d'évangélisation, le SARA et les foires d'exposition.
                </p>
              </div>

              <button
                onClick={() => {
                  onSearchSubmit({ what: 'Parc des Expositions', where: '', when: '', type: 'events' });
                  setActiveTab('events');
                }}
                className="px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-colors flex items-center gap-2 self-start md:self-center cursor-pointer shrink-0"
              >
                <span>Voir les {parcExpositionsEvents.length} événements du Parc</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              {parcExpositionsEvents.slice(0, 3).map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          </div>
        )}

        {/* Section 1.8: 🎤 LES GRANDS CONCERTS LIVE DE CÔTE D'IVOIRE */}
        {concertEvents.length > 0 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
                  <span className="text-lg">🎤</span>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Concerts Live en Côte d'Ivoire
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Zouglou à Yopougon, Josey au Sofitel Ivoire, Alpha Blondy & Tiken Jah, Rap Ivoire, Gospel, Meiway, Kerozen & Roseline Layo
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  onSearchSubmit({ what: 'Concerts', where: '', when: '', type: 'events' });
                  setActiveTab('events');
                }}
                className="hidden sm:flex items-center gap-1.5 text-xs font-black text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
              >
                <span>Tous les concerts ({concertEvents.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {concertEvents.slice(0, 6).map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          </div>
        )}

        {/* Section 2: 📅 CE WEEK-END EN CÔTE D'IVOIRE */}
        <div className="bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-transparent p-6 sm:p-8 rounded-3xl border border-amber-200/60 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {t('thisWeekend')} • Ambiance Babi & Intérieur
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  Où sortir ce vendredi, samedi et dimanche ?
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('events')}
              className="text-xs font-bold text-amber-900 hover:underline cursor-pointer"
            >
              Plus de sorties &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {weekendEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        </div>

        {/* Section 2.5: 🎨 EXPOSITIONS D'ART, PATRIMOINE & MUSÉES DE CÔTE D'IVOIRE */}
        {exhibitionEvents.length > 0 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-2xs">
                  <span className="text-lg">🎨</span>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Expositions d'Art, Patrimoine & Musées
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Musée des Civilisations, Fondation Donwahi, Biennale Photo, Musée du Costume Bassam & Street Art
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  onSearchSubmit({ what: 'Expositions', where: '', when: '', type: 'events' });
                  setActiveTab('events');
                }}
                className="hidden sm:flex items-center gap-1.5 text-xs font-black text-indigo-700 hover:text-indigo-800 hover:underline cursor-pointer"
              >
                <span>Toutes les expositions ({exhibitionEvents.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {exhibitionEvents.slice(0, 3).map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          </div>
        )}

        {/* Section 2.8: 💼 SALONS PROFESSIONNELS & FORUMS DE CÔTE D'IVOIRE */}
        {salonEvents.length > 0 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shadow-2xs">
                  <span className="text-lg">💼</span>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Salons Professionnels & Économiques
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    ARCHIBAT Bâtiment, SITA Tourisme, SILA Livre, SIPME PME, SEIP Épargne & SIBBE Beauté
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  onSearchSubmit({ what: 'Salons', where: '', when: '', type: 'events' });
                  setActiveTab('events');
                }}
                className="hidden sm:flex items-center gap-1.5 text-xs font-black text-teal-700 hover:text-teal-800 hover:underline cursor-pointer"
              >
                <span>Tous les salons ({salonEvents.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {salonEvents.slice(0, 3).map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          </div>
        )}

        {/* Section 3: 📍 AUTOUR DE MOI TEASER */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
              <span>GÉOLOCALISATION PRÉCISE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Trouvez tout ce qui se passe près de vous !
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-emerald-100">
              Activez la géolocalisation pour repérer les événements, maquis chauds et prestataires disponibles à moins de 5 km de votre position.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('near-me')}
            className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <MapPin className="w-4 h-4" />
            <span>Ouvrir « Autour de moi »</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Section 4: 👨🏾‍💼 TROUVER UN PRESTATAIRE */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-2xs">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {t('findProvider')}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Des professionnels certifiés pour réussir tous vos événements
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('providers')}
              className="hidden sm:flex items-center gap-1.5 text-xs font-black text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
            >
              <span>Tous les prestataires</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProviders.map((prov) => (
              <ProviderCard key={prov.id} provider={prov} />
            ))}
          </div>
        </div>

        {/* Section 5: PROMOTIONAL CALLOUT (3 Mois gratuits & 2000 FCFA Mobile Money) */}
        <div className="bg-gradient-to-br from-amber-50 via-orange-50/50 to-emerald-50 rounded-3xl p-6 sm:p-10 border border-orange-200 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>OFFRE EXCLUSIVE ARTISANS & PROFESSIONNELS CI</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Vous êtes photographe, DJ, traiteur ou décorateur ?
              </h2>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Créez votre page professionnelle sur <strong>ON CONNAÎT 🇨🇮</strong> et profitez de <strong>3 mois d'essai gratuit</strong> pour trouver de nouveaux clients. Ensuite, vendez vos services en illimité pour seulement <strong>2 000 FCFA / mois</strong> réglables en direct par Mobile Money.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-800 pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1DC4D4]"></span>
                  Wave ({PAYMENT_CONFIG.accounts.wave.formatted})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFCC00]"></span>
                  MTN Money ({PAYMENT_CONFIG.accounts.mtn.formatted})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF6600]"></span>
                  Orange Money ({PAYMENT_CONFIG.accounts.orange.formatted})
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3 justify-center items-start lg:items-end">
              <button
                onClick={() => setIsRegisterProviderOpen(true)}
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-700/25 transition-all cursor-pointer text-center"
              >
                Créer mon profil (3 mois gratuits) &rarr;
              </button>
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="w-full sm:w-auto px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
              >
                Voir les tarifs et liens de paiement
              </button>
            </div>
          </div>
        </div>

        {/* Section 6: 📲 PARTAGER ON CONNAÎT AVEC VOS AMIS */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-700 shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-black">
                <Share2 className="w-3.5 h-3.5" />
                <span>LIEN DE PARTAGE OFFICIEL</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Partagez l'application avec vos proches !
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Faites profiter vos amis, collègues et familles de tous les bons plans sorties, concerts live, salons et prestataires de Côte d'Ivoire.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <div className="flex items-center bg-slate-950/80 border border-slate-700 rounded-2xl px-3 py-2 text-xs font-mono text-slate-300">
                <span className="truncate max-w-[220px] sm:max-w-[260px]">{shareUrl}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="ml-2 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1"
                >
                  {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedLink ? 'Copié !' : 'Copier'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
              >
                <Share2 className="w-4 h-4" />
                <span>Ouvrir les options de partage</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
