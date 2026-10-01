import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { calculateDistanceKm } from '../utils/distance';
import { EventCard } from './EventCard';
import { ProviderCard } from './ProviderCard';
import {
  MapPin,
  Compass,
  Sliders,
  Sparkles,
  Calendar,
  Briefcase,
  AlertCircle,
  Navigation,
} from 'lucide-react';

export const NearMeView: React.FC = () => {
  const {
    events,
    providers,
    userCoords,
    locationPermission,
    requestUserLocation,
    t,
  } = useApp();

  const [maxRadiusKm, setMaxRadiusKm] = useState<number>(10);
  const [filterType, setFilterType] = useState<'all' | 'events' | 'providers'>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'weekend'>('all');

  const baseLat = userCoords?.lat || 5.3599; // Default Abidjan center
  const baseLng = userCoords?.lng || -4.0083;

  // Filter events within radius
  const publishedEvents = events.filter((e) => e.statut === 'publie');

  const eventsWithDistance = publishedEvents
    .map((evt) => {
      const dist = calculateDistanceKm(baseLat, baseLng, evt.latitude, evt.longitude);
      return { evt, dist };
    })
    .filter(({ dist }) => dist <= maxRadiusKm)
    .sort((a, b) => a.dist - b.dist);

  // Filter providers with approximate location matching commune/ville
  const providersWithLocation = providers.map((p) => {
    // Estimations based on commune
    let lat = 5.3599;
    let lng = -4.0083;
    if (p.commune.toLowerCase().includes('cocody')) {
      lat = 5.3456;
      lng = -3.9854;
    } else if (p.commune.toLowerCase().includes('marcory')) {
      lat = 5.3021;
      lng = -3.9854;
    } else if (p.commune.toLowerCase().includes('yopougon')) {
      lat = 5.3345;
      lng = -4.0789;
    } else if (p.commune.toLowerCase().includes('plateau')) {
      lat = 5.3241;
      lng = -4.0195;
    } else if (p.ville.toLowerCase().includes('bassam')) {
      lat = 5.2104;
      lng = -3.7388;
    }
    const dist = calculateDistanceKm(baseLat, baseLng, lat, lng);
    return { provider: p, dist };
  }).filter(({ dist }) => dist <= maxRadiusKm).sort((a, b) => a.dist - b.dist);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner with location status */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-300"></span>
            </span>
            <span>AUTOUR DE MOI • GÉOLOCALISATION IVOIRIENNE</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            {t('nearMeTitle')}
          </h1>

          <p className="mt-2 text-sm sm:text-base text-emerald-100">
            {t('nearMeSubtitle')}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={requestUserLocation}
              className="px-4 py-2.5 bg-white text-emerald-900 font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:bg-emerald-50 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-emerald-600" />
              <span>
                {locationPermission === 'granted'
                  ? 'Position GPS active (Mettre à jour)'
                  : 'Autoriser ma position'}
              </span>
            </button>

            <span className="text-xs text-emerald-200">
              {locationPermission === 'granted'
                ? `📍 Coordonnées : ${baseLat.toFixed(3)}, ${baseLng.toFixed(3)}`
                : '📍 Position par défaut : Abidjan (Plateau / Cocody)'}
            </span>
          </div>
        </div>
      </div>

      {/* Control Filters Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Radius selector slider */}
          <div className="flex-1 max-w-md">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <span className="flex items-center gap-1.5 text-emerald-800">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>Rayon de proximité :</span>
              </span>
              <span className="bg-emerald-100 text-emerald-900 font-black px-2.5 py-0.5 rounded-full text-xs">
                &lt; {maxRadiusKm} km
              </span>
            </div>

            <input
              type="range"
              min="2"
              max="50"
              step="2"
              value={maxRadiusKm}
              onChange={(e) => setMaxRadiusKm(parseInt(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
              <span>2 km (Quartier)</span>
              <span>10 km (Commune)</span>
              <span>25 km (Grand Abidjan)</span>
              <span>50 km</span>
            </div>
          </div>

          {/* Type switcher [Tous] [Événements] [Prestataires] */}
          <div className="flex items-center gap-2">
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tout ({eventsWithDistance.length + providersWithLocation.length})
              </button>
              <button
                onClick={() => setFilterType('events')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  filterType === 'events'
                    ? 'bg-white text-orange-600 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Événements ({eventsWithDistance.length})</span>
              </button>
              <button
                onClick={() => setFilterType('providers')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  filterType === 'providers'
                    ? 'bg-white text-emerald-700 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Prestataires ({providersWithLocation.length})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-8">
        {/* Events near me */}
        {(filterType === 'all' || filterType === 'events') && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                <span>Événements à moins de {maxRadiusKm} km</span>
                <span className="text-xs font-bold text-slate-400">
                  ({eventsWithDistance.length})
                </span>
              </h2>
            </div>

            {eventsWithDistance.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-slate-300 text-slate-500">
                <p className="text-sm font-semibold">
                  Aucun événement trouvé à moins de {maxRadiusKm} km.
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Essayez d'augmenter le curseur de distance pour élargir la recherche.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventsWithDistance.map(({ evt, dist }) => (
                  <EventCard key={evt.id} event={evt} distanceKm={dist} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Providers near me */}
        {(filterType === 'all' || filterType === 'providers') && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                <span>Prestataires disponibles à moins de {maxRadiusKm} km</span>
                <span className="text-xs font-bold text-slate-400">
                  ({providersWithLocation.length})
                </span>
              </h2>
            </div>

            {providersWithLocation.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-slate-300 text-slate-500">
                <p className="text-sm font-semibold">
                  Aucun prestataire répertorié dans ce rayon précis.
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Élargissez votre rayon ou consultez l'annuaire complet des prestataires.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {providersWithLocation.map(({ provider }) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
