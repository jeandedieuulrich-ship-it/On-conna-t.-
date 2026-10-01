import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Smartphone,
  ExternalLink,
  MessageCircle,
  Send,
  Mail,
  QrCode,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ShareAppModal: React.FC = () => {
  const { isShareModalOpen, setIsShareModalOpen } = useApp();
  const [copied, setCopied] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  if (!isShareModalOpen) return null;

  const shareUrl = 'https://ais-pre-vf4t5spiqbt62qvvejhqc2-194091796142.europe-west2.run.app';
  const shareTitle = 'ON CONNAÎT 🇨🇮 - Tout ce qui se passe en Côte d\'Ivoire';
  const shareMessage = `🇨🇮 Découvre ON CONNAÎT, l'application pour tous les événements, concerts, festivals, salons, expositions et prestataires vérifiés en Côte d'Ivoire !\n👉 ${shareUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareMessage,
          url: shareUrl,
        });
      } catch (err) {
        // Ignored
      }
    } else {
      handleCopyLink();
    }
  };

  // Pre-formatted sharing links
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareMessage)}`;

  // Public QR code URL using standard reliable chart API
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(shareUrl)}&margin=10`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-600 p-6 text-white relative">
          <button
            onClick={() => setIsShareModalOpen(false)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/25 text-[11px] font-black uppercase tracking-wider mb-1">
                <span>Partager l'application</span>
                <span>🇨🇮</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                ON CONNAÎT Côte d'Ivoire
              </h2>
            </div>
          </div>
          <p className="text-xs text-orange-100 mt-2 font-medium">
            Faites découvrir les concerts, festivals, salons, expositions et prestataires de Babi et de tout le pays à vos amis !
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Link Copy Box */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
              Lien direct de l'application
            </label>
            <div className="flex items-center gap-2 p-1.5 bg-slate-50 border-2 border-slate-200 rounded-2xl focus-within:border-orange-500 transition-colors">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full px-3 py-2 text-xs sm:text-sm font-mono text-slate-700 bg-transparent focus:outline-none select-all"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-xs ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-orange-500 hover:bg-orange-600 text-white active:scale-95'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copier</span>
                  </>
                )}
              </button>
            </div>
            {copied && (
              <p className="text-xs text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Le lien a été copié dans votre presse-papiers ! Collez-le où vous voulez.</span>
              </p>
            )}
          </div>

          {/* Social Share Grid */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-3">
              Partager en 1 clic sur vos réseaux
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 transition-all hover:scale-105 group text-center cursor-pointer shadow-2xs"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center mb-1.5 shadow-xs group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <span className="text-xs font-black">WhatsApp</span>
                <span className="text-[10px] text-emerald-600">Recommandé</span>
              </a>

              {/* Facebook */}
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 transition-all hover:scale-105 group text-center cursor-pointer shadow-2xs"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-1.5 shadow-xs group-hover:scale-110 transition-transform">
                  <span className="text-lg font-black leading-none">f</span>
                </div>
                <span className="text-xs font-black">Facebook</span>
                <span className="text-[10px] text-blue-600">Statut & Story</span>
              </a>

              {/* X / Twitter */}
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 transition-all hover:scale-105 group text-center cursor-pointer shadow-2xs"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-1.5 shadow-xs group-hover:scale-110 transition-transform">
                  <span className="text-sm font-black">𝕏</span>
                </div>
                <span className="text-xs font-black">X / Twitter</span>
                <span className="text-[10px] text-slate-500">Post #Abidjan</span>
              </a>

              {/* Telegram */}
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 transition-all hover:scale-105 group text-center cursor-pointer shadow-2xs"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center mb-1.5 shadow-xs group-hover:scale-110 transition-transform">
                  <Send className="w-5 h-5 fill-current" />
                </div>
                <span className="text-xs font-black">Telegram</span>
                <span className="text-[10px] text-sky-600">Canaux & Groupes</span>
              </a>
            </div>
          </div>

          {/* QR Code Toggle */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-800">Scanner le QR Code</div>
                  <div className="text-[11px] text-slate-500">Ouvrez l'appareil photo d'un smartphone à côté</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowQrCode(!showQrCode)}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 underline cursor-pointer"
              >
                {showQrCode ? 'Masquer' : 'Afficher le QR Code'}
              </button>
            </div>

            {showQrCode && (
              <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col items-center text-center">
                <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200">
                  <img
                    src={qrCodeImageUrl}
                    alt="QR Code ON CONNAÎT CI"
                    className="w-44 h-44 object-contain"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-2 font-medium">
                  Pointez votre appareil photo pour ouvrir directement ON CONNAÎT 🇨🇮
                </p>
              </div>
            )}
          </div>

          {/* Native Mobile Share Button */}
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
          >
            <Smartphone className="w-4 h-4" />
            <span>Ouvrir les options de partage mobile</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <span>🇨🇮 Fièrement conçu pour animer la culture en Côte d'Ivoire</span>
        </div>
      </div>
    </div>
  );
};
