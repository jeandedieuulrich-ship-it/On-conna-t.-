import React from 'react';
import { EventItem } from '../types';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  Heart,
  Share2,
  Users,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { formatDistance } from '../utils/distance';

interface EventCardProps {
  event: EventItem;
  distanceKm?: number;
}

export const EventCard: React.FC<EventCardProps> = ({ event, distanceKm }) => {
  const { setSelectedEvent, favoriteEventIds, toggleFavoriteEvent, t } = useApp();

  const isFavorite = favoriteEventIds.includes(event.id);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: event.titre,
        text: `${event.titre} - ${event.ville}, ${event.commune} sur ON CONNAÎT 🇨🇮`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien de l\'événement copié dans le presse-papier !');
    }
  };

  return (
    <div
      onClick={() => setSelectedEvent(event)}
      className="group bg-white rounded-3xl overflow-hidden border border-orange-100/80 hover:border-orange-300 shadow-sm hover:shadow-xl hover:shadow-orange-950/5 transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
    >
      {/* Event Poster / Image */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
        <img
          src={event.affiche}
          alt={event.titre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Category Pill */}
          <span className="bg-white/90 backdrop-blur-md text-orange-700 font-extrabold text-[11px] px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
            <Tag className="w-3 h-3 text-orange-500" />
            {event.categorie}
          </span>

          {/* Action buttons (Fav & Share) */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              type="button"
              onClick={handleShare}
              className="w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer"
              title="Partager l'événement"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavoriteEvent(event.id);
              }}
              className={`w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-slate-900/60 hover:bg-slate-900/90 text-white'
              }`}
              title="Ajouter aux favoris"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Bottom image overlay with Price & Distance */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div>
            <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
              <span>{event.jour}</span>
              <span>•</span>
              <span>{event.date}</span>
            </div>
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>{event.heure_debut} - {event.heure_fin}</span>
            </div>
          </div>

          <div className="text-right">
            {event.isGratuit ? (
              <span className="bg-emerald-600 text-white font-extrabold text-xs px-3 py-1 rounded-xl shadow-md">
                {t('free').toUpperCase()}
              </span>
            ) : (
              <span className="bg-orange-600 text-white font-black text-xs px-3 py-1 rounded-xl shadow-md">
                {event.prix.toLocaleString('fr-FR')} FCFA
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
            {event.titre}
          </h3>

          {/* Location */}
          <div className="mt-2.5 flex items-start gap-1.5 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-orange-500 mt-0.5 shrink-0" />
            <span className="line-clamp-1">
              <strong className="text-slate-800">{event.commune}</strong>, {event.ville} ({event.lieu})
            </span>
          </div>

          {/* Distance if available */}
          {distanceKm !== undefined && (
            <div className="mt-1 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>À {formatDistance(distanceKm)} de vous</span>
            </div>
          )}

          {/* Description snippet */}
          <p className="mt-2 text-xs text-slate-500 line-clamp-2">
            {event.description}
          </p>

          {/* Artists lineup chips */}
          {event.artistes && event.artistes.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {event.artistes.slice(0, 3).map((art, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-semibold bg-amber-50 text-amber-900 border border-amber-200/60 px-2 py-0.5 rounded-md"
                >
                  ★ {art}
                </span>
              ))}
              {event.artistes.length > 3 && (
                <span className="text-[10px] font-bold text-slate-400 self-center">
                  +{event.artistes.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer info: Organizer & Spots */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 truncate max-w-[60%]">
            <span className="font-semibold text-slate-700 truncate">
              {event.organisateur.nom}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="flex items-center gap-1 text-slate-400">
              <Eye className="w-3 h-3" />
              {event.vues}
            </span>
            <span className="text-orange-600 font-extrabold text-xs group-hover:translate-x-0.5 transition-transform">
              Détails &rarr;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
