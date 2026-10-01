import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Send, Sparkles, CheckCircle, FileText, Calendar, MapPin, DollarSign } from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuoteModal: React.FC = () => {
  const {
    isQuoteModalOpen,
    setIsQuoteModalOpen,
    quoteTargetProvider,
    submitQuoteRequest,
  } = useApp();

  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [typeEvenement, setTypeEvenement] = useState('Mariage civil & coutumier');
  const [dateEvenement, setDateEvenement] = useState('2026-11-28');
  const [lieuEvenement, setLieuEvenement] = useState('Cocody, Abidjan');
  const [budgetEstimeFCFA, setBudgetEstimeFCFA] = useState(150000);
  const [descriptionBesoin, setDescriptionBesoin] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isQuoteModalOpen || !quoteTargetProvider) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    submitQuoteRequest({
      providerId: quoteTargetProvider.id,
      providerName: quoteTargetProvider.nomCommercial,
      clientNom: nom,
      clientTelephone: telephone,
      clientWhatsapp: whatsapp || telephone,
      clientEmail: email,
      typeEvenement,
      dateEvenement,
      lieuEvenement,
      budgetEstimeFCFA,
      descriptionBesoin,
    });

    setIsSuccess(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-4 border border-emerald-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-amber-600 p-5 sm:p-6 text-white relative">
          <button
            onClick={() => {
              setIsQuoteModalOpen(false);
              setIsSuccess(false);
            }}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Devis Gratuit & Sans Engagement</span>
          </div>

          <h2 className="text-xl font-black">
            Demander un devis à {quoteTargetProvider.nomCommercial}
          </h2>
          <p className="text-xs text-emerald-100 mt-1">
            {quoteTargetProvider.profession} • Réponse rapide sous 24h par WhatsApp ou appel.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>

              <h3 className="text-xl font-black text-slate-900">
                Demande transmise avec succès !
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                <strong>{quoteTargetProvider.nomCommercial}</strong> a reçu votre demande de devis dans son espace ON CONNAÎT et prendra contact avec vous rapidement.
              </p>

              <button
                onClick={() => {
                  setIsSuccess(false);
                  setIsQuoteModalOpen(false);
                }}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Votre nom et prénom *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Koffi Serge"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Téléphone direct *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+225 07 00 00 00 00"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    WhatsApp (pour recevoir la proposition)
                  </label>
                  <input
                    type="tel"
                    placeholder="+225 07 00 00 00 00"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Type d'événement *
                  </label>
                  <select
                    value={typeEvenement}
                    onChange={(e) => setTypeEvenement(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="Mariage civil & coutumier">Mariage civil & coutumier</option>
                    <option value="Anniversaire">Anniversaire / Soirée privée</option>
                    <option value="Concert & Festival">Concert & Festival</option>
                    <option value="Gala & Conférence d'entreprise">Gala & Conférence d'entreprise</option>
                    <option value="Baptême & Communion">Baptême & Communion</option>
                    <option value="Autre événement">Autre événement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Date prévue *
                  </label>
                  <input
                    type="date"
                    required
                    value={dateEvenement}
                    onChange={(e) => setDateEvenement(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Lieu / Commune en Côte d'Ivoire *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Cocody, Grand-Bassam..."
                    value={lieuEvenement}
                    onChange={(e) => setLieuEvenement(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">
                    Budget estimé (FCFA)
                  </label>
                  <input
                    type="number"
                    value={budgetEstimeFCFA}
                    onChange={(e) => setBudgetEstimeFCFA(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">
                    Description de votre besoin / Détails particuliers *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Précisez le nombre de convives, le style souhaité, les horaires..."
                    value={descriptionBesoin}
                    onChange={(e) => setDescriptionBesoin(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Envoyer ma demande de devis &rarr;</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
