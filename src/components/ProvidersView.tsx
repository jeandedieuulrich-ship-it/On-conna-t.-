import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PROVIDER_CATEGORIES, CITIES_CI, COMMUNES_ABIDJAN } from '../data/mockData';
import { ProviderCard } from './ProviderCard';
import {
  Briefcase,
  Search,
  MapPin,
  ShieldCheck,
  Sparkles,
  PlusCircle,
  Tag,
  Star,
} from 'lucide-react';

interface ProvidersViewProps {
  initialSearchQuery?: string;
  initialProfession?: string;
  initialWhere?: string;
}

export const ProvidersView: React.FC<ProvidersViewProps> = ({
  initialSearchQuery = '',
  initialProfession = '',
  initialWhere = '',
}) => {
  const { providers, t, setIsRegisterProviderOpen } = useApp();

  const [search, setSearch] = useState(initialSearchQuery);
  const [selectedProfession, setSelectedProfession] = useState<string>(initialProfession);
  const [selectedCity, setSelectedCity] = useState<string>(initialWhere);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const filteredProviders = providers.filter((p) => {
    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = p.nomCommercial.toLowerCase().includes(q);
      const matchDomaine = p.domaine.toLowerCase().includes(q);
      const matchPres = p.presentation.toLowerCase().includes(q);
      const matchServices = p.services?.some((s) => s.nom.toLowerCase().includes(q));
      if (!matchName && !matchDomaine && !matchPres && !matchServices) return false;
    }

    // Profession
    if (selectedProfession && p.profession !== selectedProfession) {
      return false;
    }

    // City / Commune
    if (selectedCity) {
      const matchCity = p.ville.toLowerCase().includes(selectedCity.toLowerCase());
      const matchCommune = p.commune.toLowerCase().includes(selectedCity.toLowerCase());
      const matchZones = p.zoneIntervention.some((z) =>
        z.toLowerCase().includes(selectedCity.toLowerCase())
      );
      if (!matchCity && !matchCommune && !matchZones) return false;
    }

    // Verified only
    if (verifiedOnly && !p.isVerified) {
      return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-2">
            <span>🇨🇮 ANNUAIRE OFFICIEL DES PRESTATAIRES</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">
            Trouver un Prestataire Qualifié en Côte d'Ivoire
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Photographes, DJ, traiteurs, décorateurs, vidéastes et techniciens pour vos cérémonies et projets.
          </p>
        </div>

        <button
          onClick={() => setIsRegisterProviderOpen(true)}
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 cursor-pointer transition-all self-start sm:self-center"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{t('becomeProvider')} (3 mois offerts)</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Keyword */}
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher par nom, service (ex: DJ mariage, traiteur alloco...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl text-xs font-semibold focus:outline-none"
            />
          </div>

          {/* City / Commune */}
          <div className="lg:col-span-4 relative">
            <MapPin className="w-4 h-4 text-orange-500 absolute left-3.5 top-3.5 pointer-events-none" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full pl-10 pr-6 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="">Toutes les zones d'intervention 🇨🇮</option>
              <optgroup label="Grand Abidjan">
                <option value="Abidjan">Abidjan (Toutes communes)</option>
                {COMMUNES_ABIDJAN.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Intérieur du Pays">
                {CITIES_CI.filter((c) => c.nom !== 'Abidjan').map((c) => (
                  <option key={c.nom} value={c.nom}>
                    {c.nom}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Verified toggle */}
          <div className="lg:col-span-3 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-md"
              />
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Profils vérifiés seulement</span>
              </span>
            </label>
          </div>
        </div>

        {/* Profession Pills Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <button
            onClick={() => setSelectedProfession('')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors cursor-pointer ${
              selectedProfession === ''
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tous les métiers ({providers.length})
          </button>
          {PROVIDER_CATEGORIES.map((cat) => {
            const count = providers.filter((p) => p.profession === cat).length;
            if (count === 0 && selectedProfession !== cat) return null;
            return (
              <button
                key={cat}
                onClick={() => setSelectedProfession(selectedProfession === cat ? '' : cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                  selectedProfession === cat
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {filteredProviders.length} prestataire(s) trouvé(s)
          </span>
        </div>

        {filteredProviders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 text-slate-500 space-y-3">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-bold text-base text-slate-800">
              Aucun prestataire ne correspond à vos filtres.
            </p>
            <p className="text-xs text-slate-400">
              Essayez d'élargir la zone géographique ou de retirer le filtre de métier.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedProfession('');
                setSelectedCity('');
                setVerifiedOnly(false);
              }}
              className="px-4 py-2 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
