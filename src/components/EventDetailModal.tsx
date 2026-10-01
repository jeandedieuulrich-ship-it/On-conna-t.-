import React, { useState } from 'react';
import { EventItem } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Tag,
  Phone,
  MessageCircle,
  Mail,
  Globe,
  Share2,
  CalendarPlus,
  AlertTriangle,
  Heart,
  Ticket,
  Users,
  Compass,
  CheckCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { generateIcsFile, getGoogleCalendarUrl } from '../utils/calendar';
import confetti from 'canvas-confetti';

interface EventDetailModalProps {
  event: EventItem | null;
  onClose: () => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose }) => {
  const {
    t,
    favoriteEventIds,
    toggleFavoriteEvent,
    setIsReportModalOpen,
    setReportTargetEvent,
  } = useApp();

  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  if (!event) return null;

  const isFavorite = favoriteEventIds.includes(event.id);
  const currentPhoto = activePhoto || event.affiche;

  // WhatsApp click link with prefilled respectful Ivorian message
  const waNumberClean = (event.organisateur.whatsapp || '').replace(/[^0-9]/g, '');
  const waMessage = encodeURIComponent(
    `Bonjour ${event.organisateur.nom}, je vous contacte depuis la plateforme ON CONNAÎT 🇨🇮 à propos de l'événement « ${event.titre} » prévu le ${event.date} à ${event.lieu}.`
  );
  const waUrl = `https://wa.me/${waNumberClean}?text=${waMessage}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.titre,
        text: `Découvrez l'événement ${event.titre} à ${event.ville}, ${event.commune} sur ON CONNAÎT 🇨🇮`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papier !');
    }
  };

  const handleDownloadCalendar = () => {
    generateIcsFile(event);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  const handleQuickBook = () => {
    if (event.lienReservation && event.lienReservation.startsWith('http')) {
      window.open(event.lienReservation, '_blank');
    } else {
      setBookingSuccess(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      setTimeout(() => setBookingSuccess(false), 4000);
    }
  };

  const handleReport = () => {
    setReportTargetEvent(event);
    setIsReportModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Sticky Header with Close button & quick actions */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Tag className="w-3 h-3 text-orange-600" />
              {event.categorie}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">
              {event.commune}, {event.ville}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavoriteEvent(event.id)}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isFavorite
                  ? 'bg-rose-50 text-rose-600'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
              title="Ajouter aux favoris"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              title="Partager"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer ml-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {/* Main Hero Media & Title */}
          <div>
            <div className="relative aspect-21/9 w-full rounded-2xl overflow-hidden bg-slate-900 shadow-md">
              <img
                src={currentPhoto}
                alt={event.titre}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3 text-white">
                <div>
                  <div className="text-xs font-bold text-amber-300 uppercase tracking-widest flex items-center gap-2 mb-1">
                    <span>{event.jour}</span>
                    <span>•</span>
                    <span>{event.date}</span>
                    <span>•</span>
                    <span>{event.heure_debut} - {event.heure_fin}</span>
                  </div>
                  <h1 className="text-xl sm:text-3xl font-black tracking-tight leading-snug drop-shadow-md">
                    {event.titre}
                  </h1>
                </div>

                <div>
                  {event.isGratuit ? (
                    <span className="bg-emerald-500 text-white font-black text-sm sm:text-base px-4 py-2 rounded-2xl shadow-lg">
                      ENTRÉE GRATUITE 🎟️
                    </span>
                  ) : (
                    <span className="bg-orange-500 text-white font-black text-sm sm:text-base px-4 py-2 rounded-2xl shadow-lg">
                      {event.prix.toLocaleString('fr-FR')} FCFA
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Photo Gallery Thumbnails */}
            {event.galerie && event.galerie.length > 0 && (
              <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setActivePhoto(event.affiche)}
                  className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    currentPhoto === event.affiche
                      ? 'border-orange-500 ring-2 ring-orange-400/30'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={event.affiche} alt="Affiche" className="w-full h-full object-cover" />
                </button>
                {event.galerie.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActivePhoto(img)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      currentPhoto === img
                        ? 'border-orange-500 ring-2 ring-orange-400/30'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Galerie ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Action Buttons Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Direct Ticket / Booking */}
            <button
              onClick={handleQuickBook}
              className="py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-600/25 transition-all cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>
                {event.isGratuit ? 'Réserver mon pass gratuit' : 'Acheter un billet'}
              </span>
            </button>

            {/* Direct WhatsApp Contact */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Organisateur</span>
            </a>

            {/* Add to Calendar */}
            <button
              onClick={handleDownloadCalendar}
              className="py-3 px-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <CalendarPlus className="w-4 h-4 text-amber-600" />
              <span>{t('addToCalendar')}</span>
            </button>
          </div>

          {bookingSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800 text-sm font-bold animate-in fade-in">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Votre réservation a été prise en compte avec succès ! L'organisateur vous enverra les détails d'accès.
              </span>
            </div>
          )}

          {/* Grid Layout: Left Details, Right Info Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column (2 spans): Description, Program, Artists */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100">
                <h3 className="text-base font-extrabold text-slate-900 mb-2">
                  Description complète
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              {/* Detailed Program */}
              {event.programme && event.programme.length > 0 && (
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
                  <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span>Programme détaillé</span>
                  </h3>
                  <div className="space-y-4">
                    {event.programme.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 relative pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                        <span className="bg-orange-100 text-orange-800 font-black text-xs px-2.5 py-1 rounded-lg shrink-0">
                          {item.heure}
                        </span>
                        <div>
                          <div className="font-extrabold text-sm text-slate-900">
                            {item.titre}
                          </div>
                          <div className="text-xs text-slate-600 mt-0.5">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Artists & Lineup */}
              {event.artistes && event.artistes.length > 0 && (
                <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200/60">
                  <h3 className="text-base font-extrabold text-amber-950 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-600" />
                    <span>Artistes & Intervenants annoncés</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {event.artistes.map((art, idx) => (
                      <span
                        key={idx}
                        className="bg-white border border-amber-300 text-amber-950 font-bold text-xs sm:text-sm px-3.5 py-1.5 rounded-xl shadow-2xs"
                      >
                        ⭐ {art}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Conditions d'accès & Places */}
              <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100">
                <h3 className="text-base font-extrabold text-slate-900 mb-2">
                  Conditions d'accès & Billetterie
                </h3>
                <p className="text-xs sm:text-sm text-slate-700">
                  {event.conditionsAcces || 'Accès sur présentation du ticket ou invitation valide.'}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                  <span>
                    Places disponibles :{' '}
                    <strong className="text-emerald-600 font-extrabold">
                      {event.placesDisponibles}
                    </strong>{' '}
                    / {event.placesTotales}
                  </span>
                  <div className="w-32 bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-orange-500 h-full rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          ((event.placesTotales - event.placesDisponibles) / event.placesTotales) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (1 span): Venue, Map info, Organizer contacts */}
            <div className="space-y-4">
              {/* Location Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-orange-600">
                  <MapPin className="w-4 h-4" />
                  <span>Lieu & Accès</span>
                </h3>

                <div>
                  <div className="font-extrabold text-slate-900 text-sm">{event.lieu}</div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    {event.commune}, {event.ville}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{event.adresse}</div>
                </div>

                <div className="pt-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
                  >
                    <Compass className="w-3.5 h-3.5 text-orange-600" />
                    <span>Ouvrir dans Google Maps (GPS)</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                  <div className="text-[10px] text-center text-slate-400 mt-1 font-mono">
                    GPS : {event.latitude.toFixed(4)}, {event.longitude.toFixed(4)}
                  </div>
                </div>
              </div>

              {/* Organizer Info Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-emerald-600">
                  <Users className="w-4 h-4" />
                  <span>Organisateur</span>
                </h3>

                <div className="font-extrabold text-slate-900 text-sm">
                  {event.organisateur.nom}
                </div>

                <div className="space-y-2 text-xs text-slate-700">
                  <a
                    href={`tel:${event.organisateur.telephone}`}
                    className="flex items-center gap-2 hover:text-orange-600 font-semibold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span>{event.organisateur.telephone}</span>
                  </a>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-emerald-600 font-semibold transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>WhatsApp : {event.organisateur.whatsapp}</span>
                  </a>

                  <a
                    href={`mailto:${event.organisateur.email}`}
                    className="flex items-center gap-2 hover:text-slate-900 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{event.organisateur.email}</span>
                  </a>

                  {event.organisateur.siteWeb && (
                    <a
                      href={event.organisateur.siteWeb}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:text-orange-600 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{event.organisateur.siteWeb}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Report Issue Button */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleReport}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{t('reportIssue')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Bar */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            ON CONNAÎT CI • Réf : #{event.id}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => window.open(getGoogleCalendarUrl(event), '_blank')}
              className="px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl cursor-pointer"
            >
              Google Agenda
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-extrabold text-white bg-slate-900 hover:bg-slate-800 rounded-xl cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
