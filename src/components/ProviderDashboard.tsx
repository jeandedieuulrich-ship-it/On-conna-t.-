import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  ShieldCheck,
  CreditCard,
  Sparkles,
  Phone,
  MessageCircle,
  FileText,
  Clock,
  CheckCircle,
  Plus,
  ExternalLink,
  Lock,
  ArrowRight,
} from 'lucide-react';

export const ProviderDashboard: React.FC = () => {
  const {
    providers,
    quotes,
    updateQuoteStatus,
    setIsPaymentModalOpen,
    setPaymentTargetProvider,
    setSelectedProvider,
    t,
  } = useApp();

  // Selected or demo current provider (e.g. prov-1)
  const currentProvider = providers[0];

  const providerQuotes = quotes.filter(
    (q) => q.providerId === currentProvider.id || q.providerName === currentProvider.nomCommercial
  );

  const handleOpenPayment = () => {
    setPaymentTargetProvider(currentProvider);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner with Subscription and 3 months trial pill */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-2">
            <span>ESPACE PROFESSIONNEL PRESTATAIRE</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black">
            {currentProvider.nomCommercial}
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            {currentProvider.profession} • {currentProvider.commune}, {currentProvider.ville}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Subscription Status Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 text-left">
            <div className="text-[11px] font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Statut d'adhésion</span>
            </div>
            <div className="font-black text-sm text-white mt-0.5">
              {currentProvider.subscriptionStatus === 'trial'
                ? 'Essai Gratuit Actif (3 Mois)'
                : 'Abonnement Pro Actif'}
            </div>
            <div className="text-[11px] text-emerald-100 mt-0.5">
              Valable jusqu'au {currentProvider.subscriptionValidUntil}
            </div>
          </div>

          <button
            onClick={handleOpenPayment}
            className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-2xl shadow-lg transition-colors flex items-center gap-2 cursor-pointer shrink-0"
          >
            <CreditCard className="w-4 h-4" />
            <span>Payer / Renouveler (2 000 F)</span>
          </button>
        </div>
      </div>

      {/* Subscription Info Box highlighting Wave / MTN / Orange requirements */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-black text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full mb-1">
              <span>TARIF & PAIEMENT MOBILE MONEY</span>
            </div>
            <h2 className="text-lg font-black text-amber-950">
              3 mois d'essai gratuit, puis 2 000 FCFA / mois
            </h2>
            <p className="text-xs text-amber-900 max-w-2xl mt-0.5">
              Tous les prestataires bénéficient de 90 jours gratuits pour présenter leurs services et constituer leur carnet de commandes. Pour continuer à vendre et recevoir des demandes de devis, le règlement s'effectue par Wave, MTN Money ou Orange Money.
            </p>
          </div>

          <button
            onClick={handleOpenPayment}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center gap-2 cursor-pointer shadow-md shrink-0"
          >
            <span>Voir les liens de paiement</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Payment summary shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-white p-3 rounded-2xl border border-amber-200/60 flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-slate-700">Wave CI</div>
              <div className="text-sm font-black text-slate-900 font-mono">05 74 00 39 03</div>
            </div>
            <button
              onClick={handleOpenPayment}
              className="text-xs font-bold text-[#0E8A96] hover:underline cursor-pointer"
            >
              Lien direct &rarr;
            </button>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-amber-200/60 flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-slate-700">MTN MoMo CI</div>
              <div className="text-sm font-black text-slate-900 font-mono">05 74 00 39 03</div>
            </div>
            <button
              onClick={handleOpenPayment}
              className="text-xs font-bold text-amber-800 hover:underline cursor-pointer"
            >
              USSD *133# &rarr;
            </button>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-amber-200/60 flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-slate-700">Orange Money CI</div>
              <div className="text-sm font-black text-slate-900 font-mono">07 57 34 62 16</div>
            </div>
            <button
              onClick={handleOpenPayment}
              className="text-xs font-bold text-orange-700 hover:underline cursor-pointer"
            >
              USSD #144# &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Quote Requests Section (Demandes de devis des clients) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>Demandes de Devis Reçues ({providerQuotes.length})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Prospects ayant sollicité vos services pour leurs cérémonies et projets.
            </p>
          </div>
        </div>

        {providerQuotes.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            Aucune demande de devis en attente pour le moment.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {providerQuotes.map((quote) => (
              <div key={quote.id} className="p-5 sm:p-6 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {quote.typeEvenement}
                    </span>
                    <h3 className="font-black text-base text-slate-900 mt-1">
                      {quote.clientNom}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400">Budget annoncé :</span>{' '}
                    <strong className="text-sm font-black text-emerald-800">
                      {quote.budgetEstimeFCFA.toLocaleString('fr-FR')} FCFA
                    </strong>
                  </div>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  « {quote.descriptionBesoin} »
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                  <div className="flex items-center gap-4 text-slate-500">
                    <span>📅 Prévu le : <strong>{quote.dateEvenement}</strong></span>
                    <span>📍 Lieu : <strong>{quote.lieuEvenement}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/${quote.clientWhatsapp.replace(/[^0-9]/g, '')}?text=Bonjour ${quote.clientNom}, je fais suite à votre demande de devis sur ON CONNAÎT 🇨🇮.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Répondre par WhatsApp</span>
                    </a>

                    <a
                      href={`tel:${quote.clientTelephone}`}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 text-orange-500" />
                      <span>Appeler</span>
                    </a>

                    {quote.statut === 'en_attente' && (
                      <button
                        onClick={() => updateQuoteStatus(quote.id, 'accepte')}
                        className="px-3 py-1.5 bg-emerald-100 text-emerald-800 font-bold rounded-xl hover:bg-emerald-200 transition-colors cursor-pointer"
                      >
                        Accepter
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Services and Portfolio Management Shortcut */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-600" />
            <span>Mes Formules & Services Actifs ({currentProvider.services.length})</span>
          </h2>

          <button
            onClick={() => setSelectedProvider(currentProvider)}
            className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
          >
            Aperçu de ma vitrine publique &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {currentProvider.services.map((srv) => (
            <div key={srv.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="font-extrabold text-xs text-slate-900">{srv.nom}</div>
              <div className="text-emerald-700 font-black text-sm mt-1">
                {srv.prixAPartirDe.toLocaleString('fr-FR')} FCFA
              </div>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{srv.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
