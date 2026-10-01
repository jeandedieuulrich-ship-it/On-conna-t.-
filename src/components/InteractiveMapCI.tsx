import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CITIES_CI } from '../data/mockData';
import { EventCard } from './EventCard';
import { ProviderCard } from './ProviderCard';
import {
  MapPin,
  Calendar,
  Briefcase,
  Compass,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const InteractiveMapCI: React.FC = () => {
  const { events, providers, selectedCityFilter, setSelectedCityFilter, setActiveTab } = useApp();

  const [activeCity, setActiveCity] = useState<string>(selectedCityFilter || 'Abidjan');
  const [activeTabType, setActiveTabType] = useState<'events' | 'providers'>('events');

  // Filter events and providers for the active city
  const cityEvents = events.filter(
    (e) =>
      e.statut === 'publie' &&
      e.ville.toLowerCase().includes(activeCity.toLowerCase())
  );

  const cityProviders = providers.filter(
    (p) =>
      p.ville.toLowerCase().includes(activeCity.toLowerCase()) ||
      p.zoneIntervention.some((z) => z.toLowerCase().includes(activeCity.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-bold mb-2">
          <span>🇨🇮 TOUTES LES RÉGIONS DE CÔTE D'IVOIRE</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900">
          Carte Interactive de Côte d'Ivoire
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Explorez les événements et trouvez les prestataires qualifiés dans chaque ville et région ivoirienne.
        </p>
      </div>

      {/* Main Grid: Interactive stylized map card + city quick selection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Stylized Interactive SVG Map of Côte d'Ivoire (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-orange-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-orange-600" />
              <span>Cliquez sur une ville sur la carte</span>
            </h2>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
              {activeCity} sélectionné
            </span>
          </div>

          {/* SVG Map of Côte d'Ivoire Outline & Markers */}
          <div className="relative w-full aspect-4/3 bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-emerald-50/40 rounded-2xl border border-slate-100 p-4 flex items-center justify-center overflow-hidden">
            {/* Côte d'Ivoire SVG Silhouette approximation */}
            <svg
              viewBox="0 0 500 450"
              className="w-full h-full max-h-[380px] drop-shadow-sm select-none"
            >
              {/* Simplified contour of Côte d'Ivoire */}
              <path
                d="M 160 30 
                   Q 260 20, 340 50 
                   Q 390 100, 390 180 
                   Q 430 250, 420 320 
                   Q 380 390, 300 390 
                   Q 200 410, 110 370 
                   Q 80 300, 60 240 
                   Q 50 170, 90 100 
                   Z"
                fill="#FEF3C7"
                stroke="#F59E0B"
                strokeWidth="3"
                strokeDasharray="4 2"
                className="transition-colors hover:fill-amber-100"
              />

              {/* Ocean Area */}
              <text x="210" y="430" fill="#0284C7" fontSize="12" fontWeight="bold" opacity="0.6">
                Océan Atlantique / Golfe de Guinée 🌊
              </text>

              {/* City Markers plotted according to coordinates on CI Map */}
              {/* Korhogo (North) */}
              <g
                onClick={() => setActiveCity('Korhogo')}
                className="cursor-pointer group"
                transform="translate(230, 90)"
              >
                <circle
                  r={activeCity === 'Korhogo' ? '12' : '8'}
                  className={activeCity === 'Korhogo' ? 'fill-orange-600 animate-pulse' : 'fill-slate-700 group-hover:fill-orange-500'}
                />
                <circle r="4" fill="#ffffff" />
                <text x="14" y="5" fontSize="12" fontWeight="bold" className="fill-slate-800 group-hover:fill-orange-600">
                  Korhogo (Poro)
                </text>
              </g>

              {/* Bouaké (Center) */}
              <g
                onClick={() => setActiveCity('Bouaké')}
                className="cursor-pointer group"
                transform="translate(250, 195)"
              >
                <circle
                  r={activeCity === 'Bouaké' ? '12' : '8'}
                  className={activeCity === 'Bouaké' ? 'fill-orange-600 animate-pulse' : 'fill-slate-700 group-hover:fill-orange-500'}
                />
                <circle r="4" fill="#ffffff" />
                <text x="14" y="5" fontSize="12" fontWeight="bold" className="fill-slate-800 group-hover:fill-orange-600">
                  Bouaké (Gbêkê)
                </text>
              </g>

              {/* Man (West / 18 Montagnes) */}
              <g
                onClick={() => setActiveCity('Man')}
                className="cursor-pointer group"
                transform="translate(110, 220)"
              >
                <circle
                  r={activeCity === 'Man' ? '12' : '7'}
                  className={activeCity === 'Man' ? 'fill-orange-600 animate-pulse' : 'fill-slate-700 group-hover:fill-orange-500'}
                />
                <circle r="3.5" fill="#ffffff" />
                <text x="-65" y="5" fontSize="11" fontWeight="bold" className="fill-slate-800 group-hover:fill-orange-600">
                  Man (Tonkpi)
                </text>
              </g>

              {/* Daloa (Center-West) */}
              <g
                onClick={() => setActiveCity('Daloa')}
                className="cursor-pointer group"
                transform="translate(180, 255)"
              >
                <circle
                  r={activeCity === 'Daloa' ? '12' : '7'}
                  className={activeCity === 'Daloa' ? 'fill-orange-600 animate-pulse' : 'fill-slate-700 group-hover:fill-orange-500'}
                />
                <circle r="3.5" fill="#ffffff" />
                <text x="12" y="5" fontSize="11" fontWeight="bold" className="fill-slate-800 group-hover:fill-orange-600">
                  Daloa
                </text>
              </g>

              {/* Yamoussoukro (Capitale politique) */}
              <g
                onClick={() => setActiveCity('Yamoussoukro')}
                className="cursor-pointer group"
                transform="translate(235, 250)"
              >
                <circle
                  r={activeCity === 'Yamoussoukro' ? '14' : '9'}
                  className={activeCity === 'Yamoussoukro' ? 'fill-orange-600 animate-pulse' : 'fill-emerald-700 group-hover:fill-orange-500'}
                />
                <circle r="4.5" fill="#ffffff" />
                <text x="15" y="5" fontSize="12" fontWeight="black" className="fill-emerald-950 group-hover:fill-orange-600">
                  ★ Yamoussoukro
                </text>
              </g>

              {/* San-Pédro (South-West) */}
              <g
                onClick={() => setActiveCity('San-Pédro')}
                className="cursor-pointer group"
                transform="translate(170, 365)"
              >
                <circle
                  r={activeCity === 'San-Pédro' ? '12' : '8'}
                  className={activeCity === 'San-Pédro' ? 'fill-orange-600 animate-pulse' : 'fill-slate-700 group-hover:fill-orange-500'}
                />
                <circle r="4" fill="#ffffff" />
                <text x="-70" y="16" fontSize="11" fontWeight="bold" className="fill-slate-800 group-hover:fill-orange-600">
                  San-Pédro (Port)
                </text>
              </g>

              {/* Abidjan (Metropole économique) */}
              <g
                onClick={() => setActiveCity('Abidjan')}
                className="cursor-pointer group"
                transform="translate(305, 330)"
              >
                <circle
                  r={activeCity === 'Abidjan' ? '16' : '12'}
                  className={activeCity === 'Abidjan' ? 'fill-orange-600 animate-pulse' : 'fill-orange-500 group-hover:fill-orange-600'}
                />
                <circle r="6" fill="#ffffff" />
                <text x="18" y="5" fontSize="14" fontWeight="black" className="fill-orange-900 group-hover:fill-orange-600">
                  ★ ABIDJAN
                </text>
              </g>

              {/* Grand-Bassam */}
              <g
                onClick={() => setActiveCity('Grand-Bassam')}
                className="cursor-pointer group"
                transform="translate(335, 345)"
              >
                <circle
                  r={activeCity === 'Grand-Bassam' ? '11' : '7'}
                  className={activeCity === 'Grand-Bassam' ? 'fill-orange-600 animate-pulse' : 'fill-slate-700 group-hover:fill-orange-500'}
                />
                <circle r="3.5" fill="#ffffff" />
                <text x="12" y="14" fontSize="10" fontWeight="bold" className="fill-slate-800 group-hover:fill-orange-600">
                  Grand-Bassam
                </text>
              </g>

              {/* Assinie */}
              <g
                onClick={() => setActiveCity('Assinie')}
                className="cursor-pointer group"
                transform="translate(365, 360)"
              >
                <circle
                  r={activeCity === 'Assinie' ? '11' : '6'}
                  className={activeCity === 'Assinie' ? 'fill-orange-600 animate-pulse' : 'fill-slate-700 group-hover:fill-orange-500'}
                />
                <circle r="3" fill="#ffffff" />
                <text x="10" y="5" fontSize="10" fontWeight="bold" className="fill-slate-800 group-hover:fill-orange-600">
                  Assinie
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* Right: Cities Quick List Chips (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-orange-100 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-orange-600" />
              <span>Villes & Pôles culturels</span>
            </span>
            <span className="text-xs text-slate-400">9 pôles actifs</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            {CITIES_CI.map((city) => {
              const countEvts = events.filter(
                (e) => e.statut === 'publie' && e.ville.toLowerCase().includes(city.nom.toLowerCase())
              ).length;
              const countProvs = providers.filter(
                (p) =>
                  p.ville.toLowerCase().includes(city.nom.toLowerCase()) ||
                  p.zoneIntervention.some((z) => z.toLowerCase().includes(city.nom.toLowerCase()))
              ).length;

              const isSelected = activeCity.toLowerCase() === city.nom.toLowerCase();

              return (
                <button
                  key={city.nom}
                  onClick={() => setActiveCity(city.nom)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50/80 shadow-xs'
                      : 'border-slate-100 hover:border-orange-200 bg-slate-50/60 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                        isSelected
                          ? 'bg-orange-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-700'
                      }`}
                    >
                      📍
                    </div>
                    <div>
                      <div className="font-extrabold text-xs sm:text-sm text-slate-900">
                        {city.nom}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Région {city.region}
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-[11px] font-bold">
                    <span className="text-orange-700">{countEvts} événement(s)</span>
                    <div className="text-emerald-700 text-[10px]">
                      {countProvs} prestataire(s)
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* City Detail Section: Events & Providers for active city */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Que faire & qui contacter à <span className="text-orange-600">{activeCity}</span> ?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Consultez les fiches détaillées des événements et prestataires dans cette zone.
            </p>
          </div>

          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold shrink-0">
            <button
              onClick={() => setActiveTabType('events')}
              className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTabType === 'events'
                  ? 'bg-white text-orange-600 shadow-2xs font-extrabold'
                  : 'text-slate-600'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Événements ({cityEvents.length})</span>
            </button>
            <button
              onClick={() => setActiveTabType('providers')}
              className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTabType === 'providers'
                  ? 'bg-white text-emerald-700 shadow-2xs font-extrabold'
                  : 'text-slate-600'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Prestataires ({cityProviders.length})</span>
            </button>
          </div>
        </div>

        {activeTabType === 'events' ? (
          cityEvents.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="font-semibold text-sm">
                Aucun événement prévu pour l'instant à {activeCity}.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Soyez le premier à publier un concert ou festival dans cette ville !
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cityEvents.map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))}
            </div>
          )
        ) : cityProviders.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p className="font-semibold text-sm">
              Aucun prestataire inscrit à {activeCity} pour le moment.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Devenez le prestataire référent dans cette région avec 3 mois gratuits !
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cityProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
