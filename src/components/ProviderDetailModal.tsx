import React, { useState } from 'react';
import { ProviderItem } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  ShieldCheck,
  Star,
  MapPin,
  Briefcase,
  Phone,
  MessageCircle,
  Mail,
  Instagram,
  Globe,
  Share2,
  Heart,
  FileText,
  Clock,
  Sparkles,
  Lock,
  ExternalLink,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProviderDetailModalProps {
  provider: ProviderItem | null;
  onClose: () => void;
}

export const ProviderDetailModal: React.FC<ProviderDetailModalProps> = ({ provider, onClose }) => {
  const {
    t,
    favoriteProviderIds,
    toggleFavoriteProvider,
    setQuoteTargetProvider,
    setIsQuoteModalOpen,
    setIsLegalModalOpen,
  } = useApp();

  const [activePortfolioTab, setActivePortfolioTab] = useState<'all' | 'photo' | 'video'>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (!provider) return null;

  const isFavorite = favoriteProviderIds.includes(provider.id);

  // WhatsApp click link with prefilled respectful Ivorian message
  const waNumberClean = (provider.contact.whatsapp || '').replace(/[^0-9]/g, '');
  const waMessage = encodeURIComponent(
    `Bonjour ${provider.nomCommercial}, je vous contacte depuis ON CONNAÎT 🇨🇮. J'ai vu votre profil de ${provider.profession} et vos services pour un événement en Côte d'Ivoire. Pouvons-nous échanger ?`
  );
  const waUrl = `https://wa.me/${waNumberClean}?text=${waMessage}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${provider.nomCommercial} - ${provider.profession} en Côte d'Ivoire`,
        text: `Découvrez ${provider.nomCommercial} (${provider.profession}) à ${provider.commune}, ${provider.ville} sur ON CONNAÎT 🇨🇮`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papier !');
    }
  };

  const handleOpenQuote = () => {
    setQuoteTargetProvider(provider);
    setIsQuoteModalOpen(true);
  };

  const filteredPortfolio = provider.portfolio.filter((p) => {
    if (activePortfolioTab === 'all') return true;
    return p.type === activePortfolioTab;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-emerald-600" />
              {provider.profession}
            </span>
            {provider.isVerified && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Vérifié ON CONNAÎT
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavoriteProvider(provider.id)}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isFavorite
                  ? 'bg-rose-50 text-rose-600'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}
              title="Enregistrer le prestataire"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              title="Partager le profil"
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

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {/* Hero Profile Card */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-amber-50/40 rounded-3xl p-5 sm:p-6 border border-emerald-100 flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-slate-100">
                <img
                  src={provider.photoProfil}
                  alt={provider.nomCommercial}
                  className="w-full h-full object-cover"
                />
              </div>
              {provider.isVerified && (
                <div
                  className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white shadow-sm"
                  title="Identité vérifiée conforme"
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                    {provider.nomCommercial}
                  </h1>
                  <p className="text-sm font-semibold text-emerald-800 mt-0.5">
                    {provider.domaine}
                  </p>
                </div>

                <div className="flex items-center justify-center sm:justify-end gap-1.5 bg-white border border-amber-200 px-3 py-1.5 rounded-xl shadow-2xs self-center sm:self-auto">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span className="font-extrabold text-sm text-slate-900">{provider.rating.toFixed(1)}</span>
                  <span className="text-xs text-slate-400">({provider.reviewsCount} avis)</span>
                </div>
              </div>

              {/* Location & Intervention Zones */}
              <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-1 font-semibold text-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {provider.commune}, {provider.ville}
                  </span>
                </div>
                <span>•</span>
                <div className="text-slate-500">
                  Zone : {provider.zoneIntervention.join(', ')}
                </div>
              </div>

              {/* Action Buttons: WhatsApp, Call, Quote */}
              <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <button
                  onClick={handleOpenQuote}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-700/20 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Demander un devis gratuit</span>
                </button>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-extrabold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp direct</span>
                </a>

                <a
                  href={`tel:${provider.contact.telephone}`}
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-orange-500" />
                  <span>Appeler</span>
                </a>
              </div>
            </div>
          </div>

          {/* Presentation & Bio */}
          <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-2 text-emerald-800">
              Présentation du professionnel
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {provider.presentation}
            </p>
          </div>

          {/* Services List with Pricing & Details */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <span>Services proposés & Tarifs</span>
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                {provider.services.length} formule(s) disponible(s)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {provider.services.map((srv) => (
                <div
                  key={srv.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-emerald-300 shadow-2xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-extrabold text-sm text-slate-900">
                        {srv.nom}
                      </h3>
                      <span className="text-right shrink-0">
                        <span className="text-xs text-slate-500 font-normal">dès</span>{' '}
                        <strong className="text-sm font-black text-emerald-700">
                          {srv.prixAPartirDe.toLocaleString('fr-FR')} FCFA
                        </strong>
                        {srv.unite && (
                          <div className="text-[10px] text-slate-400">/{srv.unite}</div>
                        )}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {srv.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-500" />
                      {srv.disponibilite}
                    </span>
                    <button
                      type="button"
                      onClick={handleOpenQuote}
                      className="font-bold text-emerald-700 hover:underline cursor-pointer"
                    >
                      Réserver &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio & Photos / Videos */}
          {provider.portfolio && provider.portfolio.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Portfolio & Réalisations</span>
                </h2>

                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold text-slate-600">
                  <button
                    onClick={() => setActivePortfolioTab('all')}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      activePortfolioTab === 'all' ? 'bg-white text-slate-900 shadow-2xs' : ''
                    }`}
                  >
                    Tout
                  </button>
                  <button
                    onClick={() => setActivePortfolioTab('photo')}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      activePortfolioTab === 'photo' ? 'bg-white text-slate-900 shadow-2xs' : ''
                    }`}
                  >
                    Photos
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {filteredPortfolio.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedPhoto(item.url)}
                    className="group relative aspect-4/3 rounded-xl overflow-hidden bg-slate-100 cursor-pointer shadow-2xs"
                  >
                    <img
                      src={item.url}
                      alt={item.titre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                      <span className="text-[10px] font-bold text-white truncate">
                        {item.titre}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legal Data Protection Box (Loi n°2013-450 / ARTCI) */}
          <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80 flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950">
              <span className="font-extrabold">Protection des données personnelles (Côte d'Ivoire) :</span>{' '}
              Seules les informations professionnelles publiques sont affichées ici. Les pièces d'identité et justificatifs de vérification sont stockés de manière confidentielle et sécurisée conformément à la <strong>Loi n°2013-450 du 19 juin 2013</strong> relative à la protection des données à caractère personnel et régulée par l'<strong>ARTCI</strong>.
              <button
                onClick={() => setIsLegalModalOpen(true)}
                className="ml-1.5 underline font-bold hover:text-amber-800 cursor-pointer"
              >
                En savoir plus
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            Prestataire vérifié ON CONNAÎT CI
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleOpenQuote}
              className="px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-xl cursor-pointer"
            >
              Demander devis
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
