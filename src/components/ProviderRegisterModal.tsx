import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PROVIDER_CATEGORIES, CITIES_CI, COMMUNES_ABIDJAN } from '../data/mockData';
import { ProviderCategory, ProviderService, PortfolioItem } from '../types';
import {
  X,
  ShieldCheck,
  Lock,
  Sparkles,
  Briefcase,
  CheckCircle,
  Plus,
  Trash2,
  Image,
  Upload,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ProviderRegisterModal: React.FC = () => {
  const {
    isRegisterProviderOpen,
    setIsRegisterProviderOpen,
    registerProvider,
    setIsLegalModalOpen,
    setActiveTab,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Private verification fields (Loi n°2013-450)
  const [nomCivil, setNomCivil] = useState('');
  const [prenoms, setPrenoms] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [pieceIdentiteType, setPieceIdentiteType] = useState<'CNI' | 'Passeport' | 'Attestation'>('CNI');
  const [numeroEntreprise, setNumeroEntreprise] = useState('');

  // Public professional vitrine fields
  const [nomCommercial, setNomCommercial] = useState('');
  const [profession, setProfession] = useState<ProviderCategory>('Photographe');
  const [domaine, setDomaine] = useState('');
  const [presentation, setPresentation] = useState('');
  const [ville, setVille] = useState('Abidjan');
  const [commune, setCommune] = useState('Cocody');
  const [zoneIntervention, setZoneIntervention] = useState('Abidjan (Toutes communes)');
  const [photoProfil, setPhotoProfil] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80');

  // Contact
  const [telephone, setTelephone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');

  // Services offered
  const [services, setServices] = useState<ProviderService[]>([
    {
      id: 'srv-init-1',
      nom: 'Prestation Principale',
      description: 'Formule clé en main avec déplacement inclus.',
      prixAPartirDe: 50000,
      unite: 'par prestation',
      disponibilite: 'Sur réservation préalable',
    },
  ]);

  const [isSuccess, setIsSuccess] = useState(false);

  if (!isRegisterProviderOpen) return null;

  const handleAddService = () => {
    setServices((prev) => [
      ...prev,
      {
        id: `srv-${Date.now()}`,
        nom: 'Nouveau service',
        description: 'Détails du service proposé',
        prixAPartirDe: 30000,
        unite: 'par événement',
        disponibilite: 'Disponible',
      },
    ]);
  };

  const handleRemoveService = (id: string) => {
    if (services.length <= 1) return;
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const handleServiceChange = (id: string, field: keyof ProviderService, value: any) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    registerProvider({
      nomCivil,
      prenoms,
      dateNaissance,
      pieceIdentiteType,
      numeroEntreprise,
      nomCommercial: nomCommercial || `${prenoms} ${nomCivil}`,
      profession,
      domaine: domaine || `${profession} en Côte d'Ivoire`,
      presentation,
      ville,
      commune,
      zoneIntervention: zoneIntervention.split(',').map((z) => z.trim()),
      photoProfil,
      contact: {
        telephone,
        whatsapp: whatsapp || telephone,
        email,
        instagram,
      },
      services,
      portfolio: [
        {
          id: 'port-sample-1',
          type: 'photo',
          url: photoProfil,
          titre: 'Réalisation récente',
        },
      ],
    });

    setIsSuccess(true);
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-4 border border-emerald-100 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-amber-600 p-5 sm:p-6 text-white relative shrink-0">
          <button
            onClick={() => setIsRegisterProviderOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>🎉 3 MOIS D'ESSAI 100% GRATUIT</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black">
            Rejoindre les Prestataires ON CONNAÎT 🇨🇮
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
            Proposez vos services aux organisateurs d'événements à Abidjan et partout en Côte d'Ivoire. Inscription sécurisée et vérifiée conforme à la loi ivoirienne n°2013-450.
          </p>

          {/* Stepper */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/20 text-xs font-bold">
            <span
              className={`px-3 py-1 rounded-lg ${
                step === 1 ? 'bg-white text-emerald-800' : 'bg-white/20 text-white'
              }`}
            >
              1. Identité & Sécurité 🛡️
            </span>
            <span>&rarr;</span>
            <span
              className={`px-3 py-1 rounded-lg ${
                step === 2 ? 'bg-white text-emerald-800' : 'bg-white/20 text-white'
              }`}
            >
              2. Vitrine Publique 💼
            </span>
            <span>&rarr;</span>
            <span
              className={`px-3 py-1 rounded-lg ${
                step === 3 ? 'bg-white text-emerald-800' : 'bg-white/20 text-white'
              }`}
            >
              3. Services & Tarifs 🏷️
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-12 h-12" />
              </div>

              <h3 className="text-2xl font-black text-slate-900">
                Félicitations, vous êtes inscrit !
              </h3>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 max-w-md mx-auto text-xs text-emerald-900 text-left space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                  <Sparkles className="w-4 h-4" />
                  <span>Vos 3 mois d'essai gratuit ont commencé !</span>
                </div>
                <p>
                  Votre profil est en cours de contrôle par l'équipe ON CONNAÎT. Dès validation de votre pièce d'identité, votre badge « Profil vérifié 🛡️ » sera actif.
                </p>
                <p className="font-semibold text-slate-700">
                  Après 90 jours : tarif solidaire de 2 000 FCFA / mois payable facilement via Wave (0574003903), MTN ou Orange Money.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setIsRegisterProviderOpen(false);
                    setActiveTab('provider-hub');
                  }}
                  className="px-6 py-3 bg-emerald-700 text-white font-black text-sm rounded-xl hover:bg-emerald-800 transition-colors cursor-pointer"
                >
                  Accéder à mon tableau de bord prestataire &rarr;
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* STEP 1: Private Verification (Loi n°2013-450) */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                    <Lock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-950">
                      <strong className="block mb-1">
                        Espace confidentiel de vérification (Loi n°2013-450 / ARTCI) :
                      </strong>
                      Ces informations personnelles servent exclusivement à l'authentification de votre compte pour garantir la sécurité des clients. <strong>Elles ne seront JAMAIS affichées publiquement</strong> sur votre vitrine.
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nom de famille (Civil) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Kouamé"
                        value={nomCivil}
                        onChange={(e) => setNomCivil(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 focus:border-emerald-600 rounded-xl focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Prénoms *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Jean-Marc Yao"
                        value={prenoms}
                        onChange={(e) => setPrenoms(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 focus:border-emerald-600 rounded-xl focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Date de naissance *
                      </label>
                      <input
                        type="date"
                        required
                        value={dateNaissance}
                        onChange={(e) => setDateNaissance(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 focus:border-emerald-600 rounded-xl focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Type de pièce d'identité *
                      </label>
                      <select
                        value={pieceIdentiteType}
                        onChange={(e: any) => setPieceIdentiteType(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 focus:border-emerald-600 rounded-xl focus:outline-none"
                      >
                        <option value="CNI">Carte Nationale d'Identité (CNI CI)</option>
                        <option value="Passeport">Passeport biométrique</option>
                        <option value="Attestation">Attestation d'identité ONECI</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Numéro d'identification d'entreprise / RCCM (si applicable)
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: CI-ABJ-2023-B-12345"
                        value={numeroEntreprise}
                        onChange={(e) => setNumeroEntreprise(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 focus:border-emerald-600 rounded-xl focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Téléphone direct (sert aussi à l'authentification) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+225 07 00 00 00 00"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 focus:border-emerald-600 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (!nomCivil || !prenoms || !telephone) {
                          alert('Veuillez remplir au moins le nom, prénoms et téléphone.');
                          return;
                        }
                        setStep(2);
                      }}
                      className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Étape suivante : Profil public &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Public Vitrine */}
              {step === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nom Commercial / Nom de scène *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Akwaba Visuals Studio"
                        value={nomCommercial}
                        onChange={(e) => setNomCommercial(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 focus:border-emerald-600 rounded-xl focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Métier / Profession *
                      </label>
                      <select
                        value={profession}
                        onChange={(e: any) => setProfession(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 focus:border-emerald-600 rounded-xl focus:outline-none"
                      >
                        {PROVIDER_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Domaine d'expertise / Spécialité
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Photographie de mariages traditionnels & galas VIP"
                        value={domaine}
                        onChange={(e) => setDomaine(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 focus:border-emerald-600 rounded-xl focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Ville principale *
                      </label>
                      <select
                        value={ville}
                        onChange={(e) => setVille(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 focus:border-emerald-600 rounded-xl focus:outline-none"
                      >
                        {CITIES_CI.map((c) => (
                          <option key={c.nom} value={c.nom}>
                            {c.nom}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Commune / Quartier *
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Cocody Angré 8ème tranche"
                        value={commune}
                        onChange={(e) => setCommune(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 focus:border-emerald-600 rounded-xl focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Zones d'intervention (séparées par une virgule)
                      </label>
                      <input
                        type="text"
                        placeholder="Abidjan (Toutes communes), Grand-Bassam, Yamoussoukro"
                        value={zoneIntervention}
                        onChange={(e) => setZoneIntervention(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 focus:border-emerald-600 rounded-xl focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Présentation de votre activité & expérience *
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Présentez votre parcours, vos références en Côte d'Ivoire, votre matériel et vos points forts..."
                        value={presentation}
                        onChange={(e) => setPresentation(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 focus:border-emerald-600 rounded-xl focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Numéro WhatsApp direct *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+225 07 00 00 00 00"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 focus:border-emerald-600 rounded-xl focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email professionnel
                      </label>
                      <input
                        type="email"
                        placeholder="contact@monentreprise.ci"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 focus:border-emerald-600 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      &larr; Retour
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!nomCommercial || !presentation) {
                          alert('Veuillez renseigner le nom commercial et votre présentation.');
                          return;
                        }
                        setStep(3);
                      }}
                      className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Étape suivante : Services & Tarifs &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Services & Pricing */}
              {step === 3 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">
                        Vos formules & tarifs (FCFA)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Indiquez au moins une formule avec tarif « à partir de ».
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddService}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-1 hover:bg-emerald-100 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter un service</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {services.map((srv, idx) => (
                      <div
                        key={srv.id}
                        className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-500">
                            Service #{idx + 1}
                          </span>
                          {services.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveService(srv.id)}
                              className="text-red-500 hover:text-red-700 text-xs p-1 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              Nom du service
                            </label>
                            <input
                              type="text"
                              value={srv.nom}
                              onChange={(e) => handleServiceChange(srv.id, 'nom', e.target.value)}
                              className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              Tarif « À partir de » (FCFA)
                            </label>
                            <input
                              type="number"
                              value={srv.prixAPartirDe}
                              onChange={(e) =>
                                handleServiceChange(srv.id, 'prixAPartirDe', parseInt(e.target.value) || 0)
                              }
                              className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              Description du service (ce qui est inclus)
                            </label>
                            <textarea
                              rows={2}
                              value={srv.description}
                              onChange={(e) =>
                                handleServiceChange(srv.id, 'description', e.target.value)
                              }
                              className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Free Trial Reminder Banner */}
                  <div className="bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-amber-500/15 p-4 rounded-2xl border border-emerald-200 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div className="text-xs text-emerald-950">
                      <strong>Rappel Offre de Lancement :</strong> Vous bénéficiez immédiatement de <strong>3 mois d'essai gratuit</strong> sans aucun engagement. Après cette période, l'abonnement est de seulement <strong>2 000 FCFA / mois</strong> pour continuer à recevoir des demandes de devis illimitées.
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-2 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      &larr; Retour
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-700/25 transition-all cursor-pointer"
                    >
                      Valider mon inscription (Gratuit pendant 3 mois)
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
