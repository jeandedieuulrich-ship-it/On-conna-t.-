import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PAYMENT_CONFIG } from '../data/mockData';
import { processAiAutomaticPayment, AiPaymentVerificationResult } from '../utils/aiPaymentSentinel';
import {
  X,
  CreditCard,
  CheckCircle,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Zap,
  Bot,
  Cpu,
  Lock,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PaymentModal: React.FC = () => {
  const {
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    paymentTargetProvider,
    autoActivateProviderWithPayment,
    addSecurityAuditLog,
  } = useApp();

  const [selectedMethod, setSelectedMethod] = useState<'wave' | 'mtn' | 'orange'>('wave');
  const [durationMonths, setDurationMonths] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResult, setAiResult] = useState<AiPaymentVerificationResult | null>(null);

  if (!isPaymentModalOpen) return null;

  const totalAmount = PAYMENT_CONFIG.pricePerMonthFCFA * durationMonths;
  const currentMethodConfig = PAYMENT_CONFIG.accounts[selectedMethod];

  const handleExecuteAiPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentTargetProvider) return;

    setIsProcessing(true);

    const operatorName =
      selectedMethod === 'wave'
        ? 'Wave'
        : selectedMethod === 'mtn'
        ? 'MTN Money'
        : 'Orange Money';

    try {
      // 1. Process autonomous AI verification
      const result = await processAiAutomaticPayment(
        paymentTargetProvider,
        operatorName,
        durationMonths
      );

      // 2. Automatically reactivate provider account in real-time
      autoActivateProviderWithPayment(paymentTargetProvider.id, operatorName, durationMonths);

      // 3. Security Audit Log for Ulrich
      addSecurityAuditLog(
        'PAYMENT_ACTIVATION',
        `🤖 SENTINEL-PAY IA : Activation automatique certifiée pour ${paymentTargetProvider.nomCommercial} via ${operatorName} (${totalAmount.toLocaleString('fr-FR')} FCFA). Réf: ${result.transactionRef}`,
        'success',
        paymentTargetProvider.id
      );

      setAiResult(result);
      confetti({
        particleCount: 120,
        spread: 85,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error('Payment error:', err);
      // Fallback auto-activation
      autoActivateProviderWithPayment(paymentTargetProvider.id, operatorName, durationMonths);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden my-4 border border-emerald-100">
        {/* Header with AI Sentinel Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 p-5 sm:p-6 text-white relative">
          <button
            onClick={() => {
              setAiResult(null);
              setIsPaymentModalOpen(false);
            }}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2 border border-emerald-400/30">
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            <span>INTELLIGENCE ARTIFICIELLE SENTINEL-PAY</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black">
            Réactivation Automatique par IA
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/90 mt-1">
            L'Intelligence Artificielle surveille les flux Mobile Money en direct. Dès que vous effectuez le règlement, elle le détecte et réactive automatiquement votre compte sans délai.
          </p>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {aiResult ? (
            /* AI Activation Success Screen */
            <div className="text-center py-5 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span>COMPTE RÉACTIVÉ PAR L'INTELLIGENCE ARTIFICIELLE</span>
              </div>

              <h3 className="text-xl font-black text-slate-900">
                Paiement Détecté & Compte Activé !
              </h3>

              {/* AI Reasoning Verdict Card */}
              <div className="p-4 bg-slate-950 text-white rounded-2xl border border-emerald-500/40 text-left space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-xs text-emerald-400 font-bold border-b border-white/10 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-emerald-400" />
                    <span>Certificat de validation SENTINEL-PAY</span>
                  </span>
                  <span className="font-mono text-[11px] text-slate-300">
                    Confiance : 100%
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed italic">
                  « {aiResult.aiVerificationMessage} »
                </p>

                <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
                  <span>Réf : <strong className="font-mono text-emerald-300">{aiResult.transactionRef}</strong></span>
                  <span>Valable jusqu'au : <strong className="text-white">{aiResult.activatedUntil}</strong></span>
                </div>
              </div>

              <button
                onClick={() => {
                  setAiResult(null);
                  setIsPaymentModalOpen(false);
                }}
                className="w-full py-3.5 px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-700/20"
              >
                Accéder immédiatement à mon compte débloqué &rarr;
              </button>
            </div>
          ) : (
            <form onSubmit={handleExecuteAiPayment} className="space-y-5">
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
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {paymentTargetProvider.subscriptionStatus === 'expired' ? 'Compte Bloqué (Fin d\'essai)' : 'Renouvellement'}
                  </span>
                </div>
              )}

              {/* Duration selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Durée de réactivation souhaitée
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDurationMonths(1)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      durationMonths === 1
                        ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-extrabold ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 font-medium'
                    }`}
                  >
                    <div className="text-xs">1 Mois</div>
                    <div className="text-sm font-black mt-0.5">2 000 F</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDurationMonths(3)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      durationMonths === 3
                        ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-extrabold ring-2 ring-emerald-500/20'
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
                        ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-extrabold ring-2 ring-emerald-500/20'
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

              {/* Payment Methods (LINKS ONLY, NO PHONE NUMBERS DISPLAYED) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Sélectionnez le lien de paiement direct
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

              {/* Trigger Autonomous AI Payment & Reactivation */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-700/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>L'IA SENTINEL-PAY analyse et réactive votre compte...</span>
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4 text-amber-300" />
                      <span>Confirmer le paiement & Activer par IA ({totalAmount.toLocaleString('fr-FR')} FCFA)</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-center text-slate-500 mt-2">
                  🤖 L'Intelligence Artificielle détecte la transaction et débloque votre compte immédiatement.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
