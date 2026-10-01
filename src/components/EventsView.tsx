import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EVENT_CATEGORIES, CITIES_CI, COMMUNES_ABIDJAN } from '../data/mockData';
import { EventItem, EventCategory } from '../types';
import { EventCard } from './EventCard';
import {
  Calendar,
  Filter,
  Search,
  MapPin,
  Clock,
  Sparkles,
  Ticket,
  PlusCircle,
  Tag,
} from 'lucide-react';

interface EventsViewProps {
  initialSearchQuery?: string;
  initialCategory?: string;
  initialWhere?: string;
  initialWhen?: string;
}

export const EventsView: React.FC<EventsViewProps> = ({
  initialSearchQuery = '',
  initialCategory = '',
  initialWhere = '',
  initialWhen = '',
}) => {
  const { events, t, setIsAddEventOpen } = useApp();

  const [search, setSearch] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedCity, setSelectedCity] = useState<string>(initialWhere);
  const [timeFilter, setTimeFilter] = useState<string>(initialWhen);
  const [freeOnly, setFreeOnly] = useState(false);

  // Filter events
  const publishedEvents = events.filter((e) => e.statut === 'publie');

  const filteredEvents = publishedEvents.filter((e) => {
    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = e.titre.toLowerCase().includes(q);
      const matchDesc = e.description.toLowerCase().includes(q);
      const matchLieu = e.lieu.toLowerCase().includes(q);
      const matchArtist = e.artistes?.some((a) => a.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchLieu && !matchArtist) return false;
    }

    // Category
    if (selectedCategory && e.categorie !== selectedCategory) {
      return false;
    }

    // City / Commune
    if (selectedCity) {
      const matchCity = e.ville.toLowerCase().includes(selectedCity.toLowerCase());
      const matchCommune = e.commune.toLowerCase().includes(selectedCity.toLowerCase());
      if (!matchCity && !matchCommune) return false;
    }

    // Free only
    if (freeOnly && !e.isGratuit) {
      return false;
    }

    // Time filter
    if (timeFilter === 'weekend') {
      if (!['Samedi', 'Dimanche', 'Vendredi'].includes(e.jour)) return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-bold mb-2">
            <span>🇨🇮 SORTIR EN CÔTE D'IVOIRE</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">
            Agenda des Événements & Spectacles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Découvrez tous les concerts, festivals, formations, expositions et galas du pays.
          </p>
        </div>

        <button
          onClick={() => setIsAddEventOpen(true)}
          className="px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-orange-600/20 flex items-center gap-2 cursor-pointer transition-all self-start sm:self-center"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('addEvent')}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-4">
        {/* Search input + selects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Keyword */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-orange-500 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher par titre, artiste, mot-clé..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl text-xs font-semibold focus:outline-none"
            />
          </div>

          {/* City / Commune */}
          <div className="lg:col-span-3 relative">
            <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3.5 pointer-events-none" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full pl-10 pr-6 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="">Toutes les villes 🇨🇮</option>
              <optgroup label="Grand Abidjan">
                <option value="Abidjan">Abidjan (Toutes)</option>
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

          {/* Time */}
          <div className="lg:col-span-3 relative">
            <Clock className="w-4 h-4 text-amber-500 absolute left-3.5 top-3.5 pointer-events-none" />
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="w-full pl-10 pr-6 py-2.5 bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="">Toutes les périodes</option>
              <option value="today">Aujourd'hui</option>
              <option value="weekend">Ce week-end</option>
              <option value="this_month">Ce mois-ci</option>
            </select>
          </div>

          {/* Free toggle */}
          <div className="lg:col-span-2 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={freeOnly}
                onChange={(e) => setFreeOnly(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-md"
              />
              <span>100% Gratuit 🎟️</span>
            </label>
          </div>
        </div>

        {/* Category & Featured Venue Pills Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <button
            onClick={() => {
              setSelectedCategory('');
              setSearch('');
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors cursor-pointer ${
              selectedCategory === '' && search !== 'Parc des Expositions'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Toutes ({publishedEvents.length})
          </button>

          {/* Quick filter: Parc des Expositions */}
          <button
            onClick={() => {
              if (search === 'Parc des Expositions') {
                setSearch('');
              } else {
                setSearch('Parc des Expositions');
                setSelectedCategory('');
              }
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
              search === 'Parc des Expositions'
                ? 'bg-purple-700 text-white shadow-md ring-2 ring-purple-400/40'
                : 'bg-purple-100 text-purple-900 border border-purple-200 hover:bg-purple-200'
            }`}
          >
            <span>🏛️ Parc des Expositions</span>
            <span className="text-[10px] bg-white/30 text-current px-1.5 py-0.2 rounded-full font-black">
              {publishedEvents.filter((e) => e.lieu.toLowerCase().includes('parc des expositions')).length}
            </span>
          </button>

          {/* Quick filter: Concerts Live */}
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory(selectedCategory === 'Concerts' ? '' : 'Concerts');
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'Concerts'
                ? 'bg-orange-600 text-white shadow-md ring-2 ring-orange-400/40'
                : 'bg-orange-100 text-orange-900 border border-orange-200 hover:bg-orange-200'
            }`}
          >
            <span>🎤 Concerts Live</span>
            <span className="text-[10px] bg-white/30 text-current px-1.5 py-0.2 rounded-full font-black">
              {publishedEvents.filter((e) => e.categorie === 'Concerts').length}
            </span>
          </button>

          {/* Quick filter: Salons Professionnels */}
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory(selectedCategory === 'Salons' ? '' : 'Salons');
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'Salons'
                ? 'bg-teal-700 text-white shadow-md ring-2 ring-teal-400/40'
                : 'bg-teal-100 text-teal-900 border border-teal-200 hover:bg-teal-200'
            }`}
          >
            <span>💼 Salons Pro</span>
            <span className="text-[10px] bg-white/30 text-current px-1.5 py-0.2 rounded-full font-black">
              {publishedEvents.filter((e) => e.categorie === 'Salons').length}
            </span>
          </button>

          {EVENT_CATEGORIES.map((cat) => {
            const count = publishedEvents.filter((e) => e.categorie === cat).length;
            if (count === 0 && selectedCategory !== cat) return null;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-orange-600 text-white shadow-xs'
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
            {filteredEvents.length} événement(s) trouvé(s)
          </span>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 text-slate-500 space-y-3">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-bold text-base text-slate-800">
              Aucun événement ne correspond à vos filtres.
            </p>
            <p className="text-xs text-slate-400">
              Essayez de réinitialiser la recherche ou de changer de ville.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('');
                setSelectedCity('');
                setTimeFilter('');
                setFreeOnly(false);
              }}
              className="px-4 py-2 bg-orange-100 text-orange-800 text-xs font-bold rounded-xl cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
