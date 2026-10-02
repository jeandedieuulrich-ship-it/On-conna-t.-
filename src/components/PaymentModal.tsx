import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PAYMENT_CONFIG } from '../data/mockData';
import {
  X,
  CreditCard,
  CheckCircle,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PaymentModal: React.FC = () => {
  const {
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    paymentTargetProvider,
    autoActivateProviderWithPayment,
  } = useApp();

  const [selectedMethod, setSelectedMethod] = useState<'wave' | 'mtn' | 'orange'>('wave');
  const [durationMonths, setDurationMonths] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isPaymentModalOpen) return null;

  const totalAmount = PAYMENT_CONFIG.pricePerMonthFCFA * durationMonths;

  const currentMethodConfig = PAYMENT_CONFIG.accounts[selectedMethod];

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const operatorName =
      selectedMethod === 'wave'
        ? 'Wave'
        : selectedMethod === 'mtn'
        ? 'MTN Money'
        : 'Orange Money';

    setTimeout(() => {
      if (paymentTargetProvider?.id) {
        autoActivateProviderWithPayment(paymentTargetProvider.id, operatorName, durationMonths);
      }

      setIsProcessing(false);
      setIsSuccess(true);

      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 },
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden my-4 border border-orange-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-emerald-600 p-5 sm:p-6 text-white relative">
          <button
            onClick={() => setIsPaymentModalOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Paiement 100% par Liens Sécurisés</span>
          </div>

          <h2 className="text-2xl font-black">
            Abonnement Prestataire ON CONNAÎT 🇨🇮
          </h2>
          <p className="text-xs sm:text-sm text-orange-100 mt-1">
            Après les 3 mois d'essai gratuit, l'accès mensuel est de <strong>2 000 FCFA / mois</strong>. Le compte est <strong>activé automatiquement</strong> dès le paiement.
          </p>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span>COMPTE ACTIVÉ AUTOMATIQUEMENT</span>
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Paiement validé avec succès !
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Votre abonnement a été activé pour <strong>{durationMonths} mois</strong>. L'accès à votre tableau de bord, la visibilité de votre vitrine et la réception des demandes de devis sont désormais débloqués en temps réel.
              </p>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setIsPaymentModalOpen(false);
                }}
                className="px-6 py-3 bg-emerald-600 text-white font-extrabold text-sm rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer shadow-lg"
              >
                Accéder immédiatement à mon compte
              </button>
            </div>
          ) : (
            <form onSubmit={handleExecutePayment} className="space-y-5">
              {/* Provider Info Target */}
              {paymentTargetProvider && (
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Prestataire :</span>{' '}
                    <strong className="text-slate-800 font-bold">{paymentTargetProvider.nomCommercial}</strong>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-black ${
                    paymentTargetProvider.subscriptionStatus === 'expired'
                      ? 'bg-rose-100 text-rose-800'
                      : paymentTargetProvider.subscriptionStatus === 'trial'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {paymentTargetProvider.subscriptionStatus === 'expired' ? 'Compte Verrouillé (Fin d\'essai)' : 'Renouvellement'}
                  </span>
                </div>
              )}

              {/* Duration selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Durée de l'abonnement
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDurationMonths(1)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      durationMonths === 1
                        ? 'border-orange-500 bg-orange-50/80 text-orange-900 font-extrabold ring-2 ring-orange-400/20'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 font-medium'
                    }`}
                  >
                    <div className="text-xs">1 Mois</div>
                    <div className="text-sm font-black mt-0.5">2 000 F</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDurationMonths(3)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer relative ${
                      durationMonths === 3
                        ? 'border-orange-500 bg-orange-50/80 text-orange-900 font-extrabold ring-2 ring-orange-400/20'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 font-medium'
                    }`}
                  >
                    <div className="text-xs">3 Mois</div>
                    <div className="text-sm font-black mt-0.5">6 000 F</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDurationMonths(12)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer relative ${
                      durationMonths === 12
                        ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 font-extrabold ring-2 ring-emerald-400/20'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 font-medium'
                    }`}
                  >
                    <span className="absolute -top-2 right-2 bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                      Économique
                    </span>
                    <div className="text-xs">1 An (12 mois)</div>
                    <div className="text-sm font-black mt-0.5">24 000 F</div>
                  </button>
                </div>
              </div>

              {/* Payment Methods (LINKS ONLY, NO PHONE NUMBERS) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Choisissez votre lien de paiement direct
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {/* Wave */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('wave')}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      selectedMethod === 'wave'
                        ? 'border-[#1DC4D4] bg-[#1DC4D4]/10 text-slate-900 font-extrabold ring-2 ring-[#1DC4D4]/30'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#1DC4D4] flex items-center justify-center text-white font-black text-xs shadow-xs">
                      🌊
                    </div>
                    <span className="text-xs font-bold">Lien Wave</span>
                    <span className="text-[10px] text-[#0E8A96] font-semibold">Instantané</span>
                  </button>

                  {/* MTN Money */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('mtn')}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      selectedMethod === 'mtn'
                        ? 'border-[#FFCC00] bg-[#FFCC00]/15 text-slate-900 font-extrabold ring-2 ring-[#FFCC00]/40'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#FFCC00] flex items-center justify-center text-slate-900 font-black text-xs shadow-xs">
                      ⚡
                    </div>
                    <span className="text-xs font-bold">Lien MTN MoMo</span>
                    <span className="text-[10px] text-amber-800 font-semibold">Web Gateway</span>
                  </button>

                  {/* Orange Money */}
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('orange')}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      selectedMethod === 'orange'
                        ? 'border-[#FF6600] bg-[#FF6600]/10 text-slate-900 font-extrabold ring-2 ring-[#FF6600]/30'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#FF6600] flex items-center justify-center text-white font-black text-xs shadow-xs">
                      🍊
                    </div>
                    <span className="text-xs font-bold">Lien Orange Money</span>
                    <span className="text-[10px] text-orange-700 font-semibold">Portail Web</span>
                  </button>
                </div>
              </div>

              {/* Direct Link Panel */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Lien officiel direct : {currentMethodConfig.name}</span>
                  </span>
                  <span className="text-xs font-black text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                    {totalAmount.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  {currentMethodConfig.description}
                </p>

                {/* External payment link button */}
                <a
                  href={currentMethodConfig.directLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:border-slate-400 rounded-xl flex items-center justify-between text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>{currentMethodConfig.badge}</span>
                    <span>Ouvrir la page de paiement sécurisée</span>
                  </span>
                  <ExternalLink className="w-4 h-4 text-slate-500" />
                </a>
              </div>

              {/* Submit / Instant Auto-Activation Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-700/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Validation automatique en cours...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>Confirmer le paiement & Activer automatiquement ({totalAmount.toLocaleString('fr-FR')} FCFA)</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-center text-slate-500 mt-2">
                  🛡️ Le compte s'active automatiquement dès validation, sans attente de vérification manuelle.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
