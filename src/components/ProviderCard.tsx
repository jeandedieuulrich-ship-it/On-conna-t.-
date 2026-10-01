import React from 'react';
import { ProviderItem } from '../types';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Star,
  MapPin,
  Briefcase,
  Heart,
  Share2,
  Phone,
  MessageCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

interface ProviderCardProps {
  provider: ProviderItem;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider }) => {
  const {
    setSelectedProvider,
    favoriteProviderIds,
    toggleFavoriteProvider,
    setQuoteTargetProvider,
    setIsQuoteModalOpen,
    t,
  } = useApp();

  const isFavorite = favoriteProviderIds.includes(provider.id);

  // Lowest starting price among services
  const minPrice =
    provider.services && provider.services.length > 0
      ? Math.min(...provider.services.map((s) => s.prixAPartirDe))
      : 0;

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `${provider.nomCommercial} - ${provider.profession} en Côte d'Ivoire`,
        text: `${provider.nomCommercial}, ${provider.profession} à ${provider.commune}, ${provider.ville} sur ON CONNAÎT 🇨🇮`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien du profil copié !');
    }
  };

  const handleRequestQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuoteTargetProvider(provider);
    setIsQuoteModalOpen(true);
  };

  return (
    <div
      onClick={() => setSelectedProvider(provider)}
      className="group bg-white rounded-3xl overflow-hidden border border-emerald-100 hover:border-emerald-300 shadow-xs hover:shadow-xl hover:shadow-emerald-950/5 transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
    >
      {/* Top Banner / Avatar */}
      <div className="relative h-28 bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500">
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />

        {/* Favorite & Share buttons */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            type="button"
            onClick={handleShare}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer"
            title="Partager"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavoriteProvider(provider.id);
            }}
            className={`w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer ${
              isFavorite
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-white/20 hover:bg-white/40 text-white'
            }`}
            title="Enregistrer"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Profession Tag */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-white/90 backdrop-blur-md text-emerald-800 text-[11px] font-extrabold px-3 py-1 rounded-full shadow-2xs flex items-center gap-1.5">
            <Briefcase className="w-3 h-3 text-emerald-600" />
            {provider.profession}
          </span>
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="px-5 pt-0 pb-5 flex-1 flex flex-col justify-between -mt-12 relative z-10">
        <div>
          {/* Avatar and Verification */}
          <div className="flex items-end justify-between mb-3">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-slate-100">
                <img
                  src={provider.photoProfil}
                  alt={provider.nomCommercial}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              {provider.isVerified && (
                <div
                  className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-xs"
                  title="Profil vérifié par ON CONNAÎT (Loi n°2013-450)"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-900 px-2 py-1 rounded-xl text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{provider.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({provider.reviewsCount})</span>
            </div>
          </div>

          {/* Name & Title */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
              {provider.nomCommercial}
            </h3>
            {provider.isVerified && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Vérifié
              </span>
            )}
          </div>

          {/* Domain */}
          <p className="text-xs font-medium text-slate-500 mt-0.5 line-clamp-1">
            {provider.domaine}
          </p>

          {/* Location */}
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">
              <strong>{provider.commune}</strong>, {provider.ville}
            </span>
          </div>

          {/* Presentation excerpt */}
          <p className="mt-2.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {provider.presentation}
          </p>

          {/* Key Services Preview */}
          {provider.services && provider.services.length > 0 && (
            <div className="mt-3 space-y-1">
              {provider.services.slice(0, 2).map((srv) => (
                <div
                  key={srv.id}
                  className="text-[11px] bg-slate-50 p-1.5 rounded-lg flex items-center justify-between text-slate-700"
                >
                  <span className="truncate max-w-[65%] font-medium">• {srv.nom}</span>
                  <span className="font-bold text-emerald-700 shrink-0">
                    dès {srv.prixAPartirDe.toLocaleString('fr-FR')} F
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Bottom Section */}
        <div className="mt-5 pt-3 border-t border-slate-100 space-y-2">
          {/* Price starting from */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Tarif estimé :</span>
            <span className="font-black text-sm text-emerald-800">
              dès {minPrice.toLocaleString('fr-FR')} FCFA
            </span>
          </div>

          {/* Direct CTA */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleRequestQuote}
              className="w-full py-2 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl transition-colors cursor-pointer text-center"
            >
              Demander devis
            </button>
            <button
              type="button"
              onClick={() => setSelectedProvider(provider)}
              className="w-full py-2 px-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer text-center"
            >
              Voir vitrine
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
