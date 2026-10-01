import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  MapPin,
  Calendar as CalendarIcon,
  Sparkles,
  Flame,
  PlusCircle,
  Briefcase,
  Music,
  Camera,
  Utensils,
  PartyPopper,
  Tv,
  ArrowRight,
  Filter,
  Palette,
} from 'lucide-react';
import { EVENT_CATEGORIES, CITIES_CI, COMMUNES_ABIDJAN, PROVIDER_CATEGORIES } from '../data/mockData';
import { IVORIAN_EXPRESSIONS } from '../utils/translations';

interface HomeHeroProps {
  onSearchSubmit: (params: { what: string; where: string; when: string; type: 'events' | 'providers' | 'all' }) => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ onSearchSubmit }) => {
  const {
    t,
    setActiveTab,
    setIsAddEventOpen,
    setIsRegisterProviderOpen,
    selectedCityFilter,
    setSelectedCityFilter,
  } = useApp();

  const [activeSegment, setActiveSegment] = useState<'events' | 'providers'>('events');
  const [whatQuery, setWhatQuery] = useState('');
  const [whereQuery, setWhereQuery] = useState(selectedCityFilter || '');
  const [whenQuery, setWhenQuery] = useState('');

  const [randomQuote] = useState(() => {
    return IVORIAN_EXPRESSIONS[Math.floor(Math.random() * IVORIAN_EXPRESSIONS.length)];
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit({
      what: whatQuery,
      where: whereQuery,
      when: whenQuery,
      type: activeSegment,
    });
  };

  const handleQuickFilter = (category: string, isProvider: boolean = false) => {
    if (isProvider) {
      setActiveSegment('providers');
      onSearchSubmit({ what: category, where: '', when: '', type: 'providers' });
      setActiveTab('providers');
    } else {
      setActiveSegment('events');
      onSearchSubmit({ what: category, where: '', when: '', type: 'events' });
      setActiveTab('events');
    }
  };

  const handleQuickNaturalQuery = (what: string, where: string, when: string) => {
    setWhatQuery(what);
    setWhereQuery(where);
    setWhenQuery(when);
    setActiveSegment('events');
    onSearchSubmit({ what, where, when, type: 'events' });
    setActiveTab('events');
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-orange-50/70 via-amber-50/40 to-[#FAF7F2] pb-12 pt-8 sm:pt-12">
      {/* Decorative African / Ivorian pattern SVG accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Cultural Motto Banner */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-orange-500/10 via-amber-500/15 to-emerald-500/10 border border-orange-200/60 text-orange-900 text-xs sm:text-sm font-bold mb-4 shadow-2xs">
            <span className="text-base">🇨🇮</span>
            <span className="text-orange-700 font-extrabold uppercase tracking-wide">
              {randomQuote.phrase}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600 font-medium hidden sm:inline">
              {randomQuote.meaning}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            ON CONNAÎT <span className="text-orange-600">🇨🇮</span>
          </h1>

          <p className="mt-3 text-lg sm:text-xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-700 bg-clip-text text-transparent">
            {t('appTagline')}
          </p>

          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl">
            {t('appSubtagline')}
          </p>
        </div>

        {/* Search Box Card with ivoirien style */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-orange-950/5 border border-orange-100 p-4 sm:p-6 transition-all">
          {/* Segment Selector: [ ÉVÉNEMENTS ] [ PRESTATAIRES ] */}
          <div className="flex items-center justify-center mb-6">
            <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => setActiveSegment('events')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-extrabold transition-all cursor-pointer ${
                  activeSegment === 'events'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <PartyPopper className="w-4 h-4" />
                <span>{t('tabEvents').toUpperCase()}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSegment('providers')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-extrabold transition-all cursor-pointer ${
                  activeSegment === 'providers'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>{t('tabProviders').toUpperCase()}</span>
                <span className="text-[10px] bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded-full font-black">
                  PRO
                </span>
              </button>
            </div>
          </div>

          {/* Search Inputs Form */}
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Input: QUOI ? */}
            <div className="md:col-span-4 relative">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">
                Quoi ?
              </label>
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-orange-500 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={whatQuery}
                  onChange={(e) => setWhatQuery(e.target.value)}
                  placeholder={
                    activeSegment === 'events'
                      ? 'Concert, Festival, Didi B...'
                      : 'Photographe, DJ, Traiteur...'
                  }
                  className="w-full pl-10 pr-3 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-orange-500 rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Input: OÙ ? */}
            <div className="md:col-span-4 relative">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">
                Où ?
              </label>
              <div className="relative flex items-center">
                <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 pointer-events-none" />
                <select
                  value={whereQuery}
                  onChange={(e) => setWhereQuery(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">Toute la Côte d'Ivoire 🇨🇮</option>
                  <optgroup label="Grand Abidjan">
                    <option value="Abidjan">Abidjan (Toutes communes)</option>
                    {COMMUNES_ABIDJAN.map((c) => (
                      <option key={c} value={c}>
                        Abidjan - {c}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Villes de l'Intérieur">
                    {CITIES_CI.filter((city) => city.nom !== 'Abidjan').map((city) => (
                      <option key={city.nom} value={city.nom}>
                        {city.nom} ({city.region})
                      </option>
                    ))}
                  </optgroup>
                </select>
                <div className="absolute right-3.5 pointer-events-none text-slate-400 text-xs">▼</div>
              </div>
            </div>

            {/* Input: QUAND ? */}
            <div className="md:col-span-4 relative">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">
                Quand ?
              </label>
              <div className="relative flex items-center">
                <CalendarIcon className="w-4 h-4 text-amber-500 absolute left-3.5 pointer-events-none" />
                <select
                  value={whenQuery}
                  onChange={(e) => setWhenQuery(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-amber-500 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">Toutes les dates</option>
                  <option value="today">Aujourd'hui</option>
                  <option value="tomorrow">Demain</option>
                  <option value="weekend">Ce week-end</option>
                  <option value="this_week">Cette semaine</option>
                  <option value="this_month">Ce mois-ci</option>
                </select>
                <div className="absolute right-3.5 pointer-events-none text-slate-400 text-xs">▼</div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-12 mt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Natural Query Samples */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 w-full sm:w-auto">
                <span className="font-semibold text-slate-600">Exemples rapides :</span>
                <button
                  type="button"
                  onClick={() => handleQuickNaturalQuery('Parc des Expositions', '', '')}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300/80 px-2.5 py-0.5 rounded-md font-bold cursor-pointer transition-colors shadow-2xs flex items-center gap-1"
                >
                  <span>🏛️ Parc des Expositions</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickNaturalQuery('Évangélisation', 'Port-Bouët', '')}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-900 px-2 py-0.5 rounded-md font-medium cursor-pointer transition-colors"
                >
                  « Évangélisation au Parc »
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickNaturalQuery('Concert', 'Abidjan', 'weekend')}
                  className="bg-orange-50 hover:bg-orange-100 text-orange-800 px-2 py-0.5 rounded-md font-medium cursor-pointer transition-colors"
                >
                  « Concerts à Abidjan ce week-end »
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFilter('Photographe', true)}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-medium cursor-pointer transition-colors"
                >
                  « Photographe à Cocody »
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFilter('Festival', false)}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-medium cursor-pointer transition-colors"
                >
                  « Festivals »
                </button>
              </div>

              <button
                type="submit"
                className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-extrabold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95 ${
                  activeSegment === 'events'
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-orange-600/30'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-emerald-600/30'
                }`}
              >
                <Search className="w-4 h-4" />
                <span>{t('btnSearch')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Quick Category Icons Strip */}
        <div className="mt-8 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>Accès direct aux rubriques</span>
            </h3>
            <span className="text-xs text-orange-600 font-bold hover:underline cursor-pointer" onClick={() => setActiveTab('events')}>
              Tout voir &rarr;
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            <button
              onClick={() => handleQuickFilter('Concerts')}
              className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 hover:bg-white border border-slate-200/80 hover:border-orange-300 shadow-2xs hover:shadow-md transition-all text-left cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-xs text-slate-900">Concerts</div>
                <div className="text-[10px] text-slate-500 font-medium">Live & Shows</div>
              </div>
            </button>

            <button
              onClick={() => handleQuickFilter('Expositions')}
              className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 hover:bg-white border border-slate-200/80 hover:border-indigo-300 shadow-2xs hover:shadow-md transition-all text-left cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-xs text-slate-900">Expositions</div>
                <div className="text-[10px] text-slate-500 font-medium">Art & Musées</div>
              </div>
            </button>

            <button
              onClick={() => handleQuickFilter('Festivals')}
              className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 hover:bg-white border border-slate-200/80 hover:border-orange-300 shadow-2xs hover:shadow-md transition-all text-left cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <PartyPopper className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-xs text-slate-900">Festivals</div>
                <div className="text-[10px] text-slate-500 font-medium">FEMUA & Plein air</div>
              </div>
            </button>

            <button
              onClick={() => handleQuickFilter('Photographe', true)}
              className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 hover:bg-white border border-slate-200/80 hover:border-emerald-300 shadow-2xs hover:shadow-md transition-all text-left cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-xs text-slate-900">Photographes</div>
                <div className="text-[10px] text-slate-500 font-medium">Mariages & Galas</div>
              </div>
            </button>

            <button
              onClick={() => handleQuickFilter('DJ', true)}
              className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 hover:bg-white border border-slate-200/80 hover:border-emerald-300 shadow-2xs hover:shadow-md transition-all text-left cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Tv className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-xs text-slate-900">DJ & Sono</div>
                <div className="text-[10px] text-slate-500 font-medium">Ambiance Babi</div>
              </div>
            </button>

            <button
              onClick={() => handleQuickFilter('Traiteur', true)}
              className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 hover:bg-white border border-slate-200/80 hover:border-emerald-300 shadow-2xs hover:shadow-md transition-all text-left cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-xs text-slate-900">Traiteurs</div>
                <div className="text-[10px] text-slate-500 font-medium">Mets d'Ivoire</div>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('near-me')}
              className="flex items-center gap-2.5 p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-sm hover:shadow-md transition-all text-left cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
                <MapPin className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <div className="font-black text-xs">Près de moi</div>
                <div className="text-[10px] text-emerald-100 font-medium">&lt; 5 km autour</div>
              </div>
            </button>
          </div>
        </div>

        {/* Dual Primary Call-to-Actions from user brief: [➕ AJOUTER UN ÉVÉNEMENT] [💼 DEVENIR PRESTATAIRE] */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={() => setIsAddEventOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-sm transition-all cursor-pointer hover:shadow-md"
          >
            <PlusCircle className="w-5 h-5 text-orange-500" />
            <span>➕ {t('addEvent').toUpperCase()}</span>
          </button>

          <button
            onClick={() => setIsRegisterProviderOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-md shadow-emerald-700/20 transition-all cursor-pointer hover:shadow-lg"
          >
            <Briefcase className="w-5 h-5 text-amber-300" />
            <span>💼 {t('becomeProvider').toUpperCase()}</span>
            <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full ml-1">
              3 MOIS OFFERTS
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
