import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ShieldCheck,
  Scale,
  Phone,
  MessageCircle,
  MapPin,
  Heart,
} from 'lucide-react';
import { PAYMENT_CONFIG, CITIES_CI } from '../data/mockData';

export const Footer: React.FC = () => {
  const {
    t,
    setActiveTab,
    setIsAddEventOpen,
    setIsRegisterProviderOpen,
    setIsLegalModalOpen,
    setIsPaymentModalOpen,
    setSelectedCityFilter,
  } = useApp();

  return (
    <footer className="bg-slate-950 text-white pt-14 pb-24 lg:pb-12 border-t-4 border-orange-500 relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-orange-500 text-white font-black text-xl flex items-center justify-center shadow-md">
                ON
              </div>
              <span className="font-black text-2xl tracking-tight text-white">
                ON CONNAÎT <span className="text-orange-500">🇨🇮</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              La plateforme de référence pour découvrir tout ce qui se passe en Côte d'Ivoire. Concerts, festivals, expositions, formations et l'annuaire des prestataires professionnels d'Abidjan et de l'intérieur du pays.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-300 font-bold">
              <span>🇨🇮 Fait avec</span>
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>pour la culture ivoirienne</span>
            </div>
          </div>

          {/* Col 3: Navigation rapide */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-orange-400">
              Navigation
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => setActiveTab('events')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Tous les événements
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('providers')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Trouver un prestataire
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('near-me')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Autour de moi (GPS)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('map')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Carte interactive CI
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsAddEventOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer text-orange-400 font-bold"
                >
                  + Ajouter un événement
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Villes couvertes */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400">
              Villes & Régions
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-400">
              {CITIES_CI.slice(0, 6).map((city) => (
                <li key={city.nom}>
                  <button
                    onClick={() => {
                      setSelectedCityFilter(city.nom);
                      setActiveTab('events');
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    📍 {city.nom}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Prestataires & Paiement Mobile Money */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-400">
              Espace Prestataire
            </h3>
            <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-[11px] space-y-2 text-slate-300">
              <div className="font-bold text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>3 mois d'essai 100% gratuit</span>
              </div>
              <p className="text-slate-400">
                Puis <strong>2 000 FCFA / mois</strong> pour vendre vos prestations.
              </p>
              <div className="text-[10px] space-y-1 pt-1 font-mono text-slate-300 border-t border-slate-800">
                <div>🌊 Wave : 05 74 00 39 03</div>
                <div>⚡ MTN : 05 74 00 39 03</div>
                <div>🍊 Orange : 07 57 34 62 16</div>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="w-full mt-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg cursor-pointer"
              >
                Liens de paiement direct
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar with Legal compliance */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} ON CONNAÎT 🇨🇮. Tous droits réservés.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsLegalModalOpen(true)}
              className="flex items-center gap-1 hover:text-slate-300 transition-colors underline cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Loi n°2013-450 / ARTCI (Données personnelles)</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
