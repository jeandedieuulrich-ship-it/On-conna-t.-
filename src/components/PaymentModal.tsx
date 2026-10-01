import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PAYMENT_CONFIG } from '../data/mockData';
import {
  X,
  CreditCard,
  CheckCircle,
  Copy,
  ExternalLink,
  PhoneCall,
  Sparkles,
  ShieldCheck,
  Smartphone,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PaymentModal: React.FC = () => {
  const {
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    paymentTargetProvider,
    submitPayment,
    renewProviderSubscription,
    t,
  } = useApp();

  const [selectedMethod, setSelectedMethod] = useState<'wave' | 'mtn' | 'orange'>('wave');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [durationMonths, setDurationMonths] = useState<number>(1);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isPaymentModalOpen) return null;

  const totalAmount = PAYMENT_CONFIG.pricePerMonthFCFA * durationMonths;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      alert('Veuillez renseigner votre numéro de téléphone.');
      return;
    }

    const operatorName =
      selectedMethod === 'wave'
        ? 'Wave'
        : selectedMethod === 'mtn'
        ? 'MTN Money'
        : 'Orange Money';

    submitPayment({
      providerId: paymentTargetProvider?.id || 'prov-current',
      providerName: paymentTargetProvider?.nomCommercial || 'Prestataire ON CONNAÎT',
      operateur: operatorName,
      montantFCFA: totalAmount,
      referenceTransaction: transactionRef || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      telephonePaiement: phoneNumber,
    });

    // Auto-renew if it's the current provider
    if (paymentTargetProvider?.id) {
      renewProviderSubscription(paymentTargetProvider.id, durationMonths);
    }

    setIsSuccess(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
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
            <span>Offre Prestataire Officielle</span>
          </div>

          <h2 className="text-2xl font-black">
            Abonnement Prestataire ON CONNAÎT 🇨🇮
          </h2>
          <p className="text-xs sm:text-sm text-orange-100 mt-1">
            3 mois d'essai 100% gratuit, puis seulement <strong>2 000 FCFA / mois</strong> pour vendre vos services et recevoir des demandes de devis illimitées.
          </p>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Paiement enregistré avec succès !
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Votre abonnement a été activé pour <strong>{durationMonths} mois</strong>. Votre profil professionnel est maintenant actif et prêt à recevoir des clients.
              </p>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setIsPaymentModalOpen(false);
                }}
                className="px-6 py-3 bg-emerald-600 text-white font-extrabold text-sm rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                Accéder à mon espace
              </button>
            </div>
          ) : (
            <>
              {/* Provider Info Target */}
              {paymentTargetProvider && (
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Prestataire :</span>{' '}
                    <strong className="text-slate-800 font-bold">{paymentTargetProvider.nomCommercial}</strong>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-md text-[11px]">
                    {paymentTargetProvider.subscriptionStatus === 'trial' ? 'En période d\'essai' : 'Renouvellement'}
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
                      Recommandé
                    </span>
                    <div className="text-xs">1 An (12 mois)</div>
                    <div className="text-sm font-black mt-0.5">24 000 F</div>
                  </button>
                </div>
              </div>

              {/* Payment Methods Tabs with user provided credentials */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Choisissez votre moyen de paiement Mobile Money
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
                    <span className="text-xs font-bold">Wave</span>
                    <span className="text-[10px] text-slate-500">05 74 00 39 03</span>
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
                    <span className="text-xs font-bold">MTN Money</span>
                    <span className="text-[10px] text-slate-500">05 74 00 39 03</span>
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
                    <span className="text-xs font-bold">Orange Money</span>
                    <span className="text-[10px] text-slate-500">07 57 34 62 16</span>
                  </button>
                </div>
              </div>

              {/* Dedicated Method Payment Details & Direct Links */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
                {selectedMethod === 'wave' && (
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Compte Wave de paiement :</span>
                      <span className="text-xs bg-[#1DC4D4]/20 text-[#0E8A96] font-extrabold px-2 py-0.5 rounded-full">
                        Zéro frais
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                      <div className="font-mono font-black text-base text-slate-900">
                        {PAYMENT_CONFIG.accounts.wave.formatted}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(PAYMENT_CONFIG.accounts.wave.number, 'wave')}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedKey === 'wave' ? 'Copié !' : 'Copier'}</span>
                      </button>
                    </div>

                    {/* Direct Wave Link */}
                    <div className="mt-3">
                      <a
                        href={PAYMENT_CONFIG.accounts.wave.directLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 bg-[#1DC4D4] hover:bg-[#18AAB8] text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Lien direct vers Wave (Payer {totalAmount.toLocaleString('fr-FR')} FCFA)</span>
                      </a>
                    </div>
                  </div>
                )}

                {selectedMethod === 'mtn' && (
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Compte MTN MoMo :</span>
                      <span className="text-xs bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full">
                        Code USSD *133#
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                      <div className="font-mono font-black text-base text-slate-900">
                        {PAYMENT_CONFIG.accounts.mtn.formatted}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(PAYMENT_CONFIG.accounts.mtn.number, 'mtn')}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedKey === 'mtn' ? 'Copié !' : 'Copier'}</span>
                      </button>
                    </div>

                    {/* Direct USSD Dial Link */}
                    <div className="mt-3">
                      <a
                        href={PAYMENT_CONFIG.accounts.mtn.directLink}
                        className="w-full py-2.5 px-4 bg-[#FFCC00] hover:bg-[#E6B800] text-slate-900 text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                      >
                        <PhoneCall className="w-4 h-4" />
                        <span>Lancer l'appel USSD MTN (*133*1*0574003903*{totalAmount}#)</span>
                      </a>
                    </div>
                  </div>
                )}

                {selectedMethod === 'orange' && (
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Compte Orange Money :</span>
                      <span className="text-xs bg-orange-100 text-orange-900 font-extrabold px-2 py-0.5 rounded-full">
                        Code USSD #144#
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                      <div className="font-mono font-black text-base text-slate-900">
                        {PAYMENT_CONFIG.accounts.orange.formatted}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(PAYMENT_CONFIG.accounts.orange.number, 'orange')}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedKey === 'orange' ? 'Copié !' : 'Copier'}</span>
                      </button>
                    </div>

                    {/* Direct USSD Dial Link */}
                    <div className="mt-3">
                      <a
                        href={PAYMENT_CONFIG.accounts.orange.directLink}
                        className="w-full py-2.5 px-4 bg-[#FF6600] hover:bg-[#E65C00] text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                      >
                        <PhoneCall className="w-4 h-4" />
                        <span>Lancer l'appel USSD Orange (#144*1*0757346216*{totalAmount}#)</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Form to submit payment confirmation */}
              <form onSubmit={handleConfirmPayment} className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Votre numéro de téléphone
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: 07 00 00 00 00"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs font-semibold bg-white border border-slate-200 focus:border-orange-500 rounded-xl focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Référence ou code transaction (facultatif)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: TX-984321"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs font-semibold bg-white border border-slate-200 focus:border-orange-500 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-700/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Valider mon paiement ({totalAmount.toLocaleString('fr-FR')} FCFA)</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
