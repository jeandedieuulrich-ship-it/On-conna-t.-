import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PROVIDER_CATEGORIES, CITIES_CI, COMMUNES_ABIDJAN } from '../data/mockData';
import { ProviderCategory, ProviderService } from '../types';
import {
  X,
  ShieldCheck,
  Lock,
  Sparkles,
  Briefcase,
  CheckCircle,
  Plus,
  Trash2,
  Camera,
  Upload,
  User,
  Image as ImageIcon,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ProviderRegisterModal: React.FC = () => {
  const {
    isRegisterProviderOpen,
    setIsRegisterProviderOpen,
    registerProvider,
    setActiveTab,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Identity Verification Fields (Strict adherence to user requirements: NO company number, NO creation date)
  const [nomCivil, setNomCivil] = useState('');
  const [prenoms, setPrenoms] = useState('');
  const [pieceIdentiteType, setPieceIdentiteType] = useState<'CNI' | 'Permis' | 'Passeport'>('CNI');
  
  // Mandatory Photos: ID document, Creator face photo, Profile photo
  const [pieceIdentiteUrl, setPieceIdentiteUrl] = useState(
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'
  );
  const [photoCreateurUrl, setPhotoCreateurUrl] = useState(
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
  );
  const [photoProfil, setPhotoProfil] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
  );

  // Public Professional Vitrine Fields
  const [nomCommercial, setNomCommercial] = useState('');
  const [profession, setProfession] = useState<ProviderCategory>('Photographe');
  const [domaine, setDomaine] = useState('');
  const [presentation, setPresentation] = useState('');
  const [ville, setVille] = useState('Abidjan');
  const [commune, setCommune] = useState('Cocody');
  const [zoneIntervention, setZoneIntervention] = useState('Abidjan (Toutes communes)');

  // Contact
  const [telephone, setTelephone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');

  // Initial Activity Photo for the new Catalog
  const [initialActivityTitre, setInitialActivityTitre] = useState('Prestation récente en Côte d\'Ivoire');
  const [initialActivityDesc, setInitialActivityDesc] = useState('Exemple de réalisation professionnelle pour nos clients.');
  const [initialActivityPhoto, setInitialActivityPhoto] = useState(
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
  );

  // Services offered
  const [services, setServices] = useState<ProviderService[]>([
    {
      id: 'srv-init-1',
      nom: 'Prestation Complète Clé en Main',
      description: 'Formule tout inclus avec déplacement sur tout le Grand Abidjan.',
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
      pieceIdentiteType,
      pieceIdentiteUrl,
      photoCreateurUrl,
      photoProfil,
      nomCommercial: nomCommercial || `${prenoms} ${nomCivil}`,
      profession,
      domaine: domaine || `${profession} en Côte d'Ivoire`,
      presentation,
      ville,
      commune,
      zoneIntervention: zoneIntervention.split(',').map((z) => z.trim()),
      contact: {
        telephone,
        whatsapp: whatsapp || telephone,
        email,
        instagram,
      },
      services,
      catalogPhotos: [
        {
          id: `act-${Date.now()}-1`,
          titre: initialActivityTitre || 'Activité inaugurale',
          description: initialActivityDesc || 'Réalisation d\'excellence en Côte d\'Ivoire.',
          photoUrl: initialActivityPhoto || photoProfil,
          date: new Date().toISOString().split('T')[0],
          categorie: profession,
        },
      ],
      portfolio: [
        {
          id: 'port-sample-1',
          type: 'photo',
          url: initialActivityPhoto || photoProfil,
          titre: initialActivityTitre || 'Réalisation inaugurale',
        },
      ],
    });

    setIsSuccess(true);
    confetti({
      particleCount: 100,
      spread: 75,
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
            Vérification par pièce d'identité (CNI, Permis ou Passeport) et photo de face. Sans numéro d'entreprise ni date de création.
          </p>

          {/* Stepper */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/20 text-xs font-bold overflow-x-auto">
            <span
              className={`px-3 py-1 rounded-lg shrink-0 ${
                step === 1 ? 'bg-white text-emerald-800' : 'bg-white/20 text-white'
              }`}
            >
              1. Identité & Photos 🪪
            </span>
            <span>&rarr;</span>
            <span
              className={`px-3 py-1 rounded-lg shrink-0 ${
                step === 2 ? 'bg-white text-emerald-800' : 'bg-white/20 text-white'
              }`}
            >
              2. Vitrine & Catalogue 📸
            </span>
            <span>&rarr;</span>
            <span
              className={`px-3 py-1 rounded-lg shrink-0 ${
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
                Félicitations, votre compte est créé !
              </h3>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 max-w-md mx-auto text-xs text-emerald-900 text-left space-y-2">
                <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Photos d'identité et de profil enregistrées avec succès</span>
                </p>
                <p>
                  Votre <strong>période d'essai gratuit de 3 mois</strong> a débuté. Votre catalogue d'activités est désormais en ligne pour recevoir vos premières demandes de devis.
                </p>
                <p className="text-[11px] text-slate-600 pt-1 border-t border-emerald-200/60">
                  À la fin des 3 mois, l'accès se renouvellera automatiquement à 2 000 FCFA/mois via les liens Wave, Orange Money ou MTN.
                </p>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setIsRegisterProviderOpen(false);
                    setActiveTab('provider-hub');
                  }}
                  className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm rounded-xl shadow-lg transition-colors cursor-pointer"
                >
                  Accéder à mon espace & catalogue &rarr;
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* STEP 1: Strict Identity Verification with Photos */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                    <Lock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-950">
                      <strong className="block mb-1">
                        Authentification obligatoire par photo (Sécurité ON CONNAÎT 🇨🇮) :
                      </strong>
                      Prenez ou téléversez la <strong>photo de votre pièce d'identité</strong> (CNI, Permis ou Passeport) ainsi que votre <strong>photo de face (créateur)</strong>. Aucun numéro d'entreprise n'est demandé.
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
                        placeholder="Ex: Kouassi"
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

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Type de pièce d'identité fournie *
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['CNI', 'Permis', 'Passeport'] as const).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setPieceIdentiteType(type)}
                            className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                              pieceIdentiteType === type
                                ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {type === 'CNI' && '🪪 Carte d\'Identité (CNI)'}
                            {type === 'Permis' && '🚗 Permis de conduire'}
                            {type === 'Passeport' && '🛂 Passeport'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Photo 1: ID Document Photo */}
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Camera className="w-4 h-4 text-emerald-600" />
                          <span>Photo de la pièce ({pieceIdentiteType}) *</span>
                        </label>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Obligatoire
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <img
                          src={pieceIdentiteUrl}
                          alt="Aperçu pièce d'identité"
                          className="w-16 h-12 rounded-lg object-cover border border-slate-300 shadow-xs shrink-0"
                        />
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="URL de la photo ou lien sécurisé"
                            value={pieceIdentiteUrl}
                            onChange={(e) => setPieceIdentiteUrl(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-[11px] font-semibold bg-white border border-slate-200 rounded-lg focus:outline-none"
                          />
                          <p className="text-[10px] text-slate-500 mt-1">
                            Photo recto bien lisible sans reflet.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Photo 2: Creator Face Photo (Selfie / Face photo) */}
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <User className="w-4 h-4 text-emerald-600" />
                          <span>Photo de face du créateur *</span>
                        </label>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Obligatoire
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <img
                          src={photoCreateurUrl}
                          alt="Aperçu visage créateur"
                          className="w-12 h-12 rounded-full object-cover border border-emerald-400 shadow-xs shrink-0"
                        />
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="URL ou lien de votre photo de face"
                            value={photoCreateurUrl}
                            onChange={(e) => setPhotoCreateurUrl(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-[11px] font-semibold bg-white border border-slate-200 rounded-lg focus:outline-none"
                          />
                          <p className="text-[10px] text-slate-500 mt-1">
                            Photo de face claire du gérant pour certification.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Photo 3: Profile Photo for Vitrine */}
                    <div className="sm:col-span-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-teal-600" />
                          <span>Photo de profil public / Logo de l'activité *</span>
                        </label>
                        <span className="text-[10px] text-slate-500">Visible par les clients</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <img
                          src={photoProfil}
                          alt="Aperçu profil public"
                          className="w-12 h-12 rounded-xl object-cover border border-slate-300 shadow-xs shrink-0"
                        />
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="URL de la photo de profil public"
                            value={photoProfil}
                            onChange={(e) => setPhotoProfil(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-[11px] font-semibold bg-white border border-slate-200 rounded-lg focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Numéro de téléphone direct (Appel & contact) *
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
                        if (!nomCivil || !prenoms || !telephone || !pieceIdentiteUrl || !photoCreateurUrl) {
                          alert('Veuillez renseigner votre nom, prénoms, téléphone ainsi que les photos de pièce d\'identité et de face.');
                          return;
                        }
                        setStep(2);
                      }}
                      className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Étape suivante : Vitrine & Catalogue &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Public Vitrine & Activity Catalog Initial Photo */}
              {step === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nom Commercial / Nom d'activité *
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
                        Email de contact
                      </label>
                      <input
                        type="email"
                        placeholder="contact@monactivite.ci"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 focus:border-emerald-600 rounded-xl focus:outline-none"
                      />
                    </div>

                    {/* Catalogue d'activités : Première photo de réalisation */}
                    <div className="sm:col-span-2 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-black text-xs text-emerald-900">
                          <ImageIcon className="w-4 h-4 text-emerald-700" />
                          <span>Première réalisation de votre Catalogue d'Activités *</span>
                        </div>
                        <span className="text-[10px] bg-emerald-200/80 text-emerald-950 font-bold px-2 py-0.5 rounded-full">
                          Visible sur votre vitrine
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Titre de la réalisation / prestation
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: Shooting Mariage Coutumier"
                            value={initialActivityTitre}
                            onChange={(e) => setInitialActivityTitre(e.target.value)}
                            className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Photo de l'activité (URL)
                          </label>
                          <input
                            type="text"
                            value={initialActivityPhoto}
                            onChange={(e) => setInitialActivityPhoto(e.target.value)}
                            className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Courte description de ce que vous avez accompli
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: Couverture photo complète de la dot et du mariage à Cocody."
                            value={initialActivityDesc}
                            onChange={(e) => setInitialActivityDesc(e.target.value)}
                            className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl"
                          />
                        </div>
                      </div>
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
                      Étape suivante : Tarifs & Devis &rarr;
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
                      <span>Ajouter une formule</span>
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
                            Formule #{idx + 1}
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
                              Nom du service / formule
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
                              Description du service (inclus dans la formule)
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
                      <strong>Offre Officielle de Lancement :</strong> Vous bénéficiez de <strong>3 mois d'essai gratuit</strong>. Dès la fin des 3 mois, l'accès mensuel est fixé à <strong>2 000 FCFA / mois</strong> avec activation automatique en temps réel via lien direct Wave, Orange Money ou MTN.
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
                      Valider mon compte & lancer mon essai gratuit (3 mois)
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
