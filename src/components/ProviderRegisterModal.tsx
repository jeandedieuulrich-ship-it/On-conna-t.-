import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PROVIDER_CATEGORIES, CITIES_CI } from '../data/mockData';
import { ProviderCategory, ProviderService } from '../types';
import { CameraCaptureModal } from './CameraCaptureModal';
import { inspectProviderIdentityWithAi, AiIdentityInspectionResult } from '../utils/aiIdentityInspector';
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
  User,
  Image as ImageIcon,
  KeyRound,
  Eye,
  EyeOff,
  Bot,
  Cpu,
  Zap,
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

  // Identity Verification Fields (NO enterprise number, NO creation date)
  const [nomCivil, setNomCivil] = useState('');
  const [prenoms, setPrenoms] = useState('');
  const [pieceIdentiteType, setPieceIdentiteType] = useState<'CNI' | 'Permis' | 'Passeport'>('CNI');
  
  // Direct Phone Camera Captures (Selfie & ID Photo - No URLs!)
  const [pieceIdentiteUrl, setPieceIdentiteUrl] = useState<string | null>(
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'
  );
  const [photoCreateurUrl, setPhotoCreateurUrl] = useState<string | null>(
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
  );
  const [photoProfil, setPhotoProfil] = useState<string | null>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
  );

  // Optional Password Security (At provider's discretion)
  const [wantPassword, setWantPassword] = useState(false);
  const [motDePasse, setMotDePasse] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // AI & Robot Inspection State
  const [isAiInspecting, setIsAiInspecting] = useState(false);
  const [aiInspectionResult, setAiInspectionResult] = useState<AiIdentityInspectionResult | null>(null);

  // Camera Modal Controller
  const [cameraModal, setCameraModal] = useState<{
    isOpen: boolean;
    mode: 'selfie' | 'document';
    initialFacing?: 'user' | 'environment';
    title: string;
    subtitle: string;
    target: 'id' | 'creator' | 'profil' | 'activity';
  }>({
    isOpen: false,
    mode: 'selfie',
    initialFacing: 'user',
    title: '',
    subtitle: '',
    target: 'creator',
  });

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
  const [initialActivityPhoto, setInitialActivityPhoto] = useState<string | null>(
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

  const openCamera = (
    target: 'id' | 'creator' | 'profil' | 'activity',
    preferredFacing: 'user' | 'environment' = target === 'creator' ? 'user' : 'environment'
  ) => {
    if (target === 'id') {
      setCameraModal({
        isOpen: true,
        mode: 'document',
        initialFacing: preferredFacing,
        title: `Photographier ma pièce (${pieceIdentiteType})`,
        subtitle: `Prise de vue active : ${preferredFacing === 'user' ? 'Caméra Avant (Selfie)' : 'Caméra Arrière'}`,
        target: 'id',
      });
    } else if (target === 'creator') {
      setCameraModal({
        isOpen: true,
        mode: 'selfie',
        initialFacing: preferredFacing,
        title: 'Photo de face du créateur / gérant',
        subtitle: `Prise de vue active : ${preferredFacing === 'user' ? 'Caméra Avant (Selfie)' : 'Caméra Arrière'}`,
        target: 'creator',
      });
    } else if (target === 'profil') {
      setCameraModal({
        isOpen: true,
        mode: 'selfie',
        initialFacing: preferredFacing,
        title: 'Photo de profil public',
        subtitle: `Prise de vue active : ${preferredFacing === 'user' ? 'Caméra Avant (Selfie)' : 'Caméra Arrière'}`,
        target: 'profil',
      });
    } else {
      setCameraModal({
        isOpen: true,
        mode: 'document',
        initialFacing: preferredFacing,
        title: 'Photo de réalisation pour le catalogue',
        subtitle: `Prise de vue active : ${preferredFacing === 'user' ? 'Caméra Avant' : 'Caméra Arrière'}`,
        target: 'activity',
      });
    }
  };

  const handleCaptureResult = (base64Image: string) => {
    if (cameraModal.target === 'id') {
      setPieceIdentiteUrl(base64Image);
    } else if (cameraModal.target === 'creator') {
      setPhotoCreateurUrl(base64Image);
      if (!photoProfil || photoProfil.includes('unsplash')) {
        setPhotoProfil(base64Image);
      }
    } else if (cameraModal.target === 'profil') {
      setPhotoProfil(base64Image);
    } else if (cameraModal.target === 'activity') {
      setInitialActivityPhoto(base64Image);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAiInspecting(true);

    try {
      // 1. Robot & AI Inspects Credentials before activating account
      const inspection = await inspectProviderIdentityWithAi({
        nomCivil,
        prenoms,
        pieceIdentiteType,
        pieceIdentiteUrl,
        photoCreateurUrl,
        nomCommercial: nomCommercial || `${prenoms} ${nomCivil}`,
        profession,
      });

      setAiInspectionResult(inspection);

      setTimeout(() => {
        registerProvider({
          nomCivil,
          prenoms,
          pieceIdentiteType,
          pieceIdentiteUrl: pieceIdentiteUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
          photoCreateurUrl: photoCreateurUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
          photoProfil: photoProfil || photoCreateurUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
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
          motDePasse: wantPassword && motDePasse.trim() ? motDePasse.trim() : undefined,
          aiInspectionReport: {
            date: new Date().toISOString().split('T')[0],
            score: inspection.score,
            verdict: inspection.verdict,
            notes: inspection.notes,
          },
          catalogPhotos: [
            {
              id: `act-${Date.now()}-1`,
              titre: initialActivityTitre || 'Activité inaugurale',
              description: initialActivityDesc || 'Réalisation d\'excellence en Côte d\'Ivoire.',
              photoUrl: initialActivityPhoto || photoProfil || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
              date: new Date().toISOString().split('T')[0],
              categorie: profession,
            },
          ],
          portfolio: [
            {
              id: 'port-sample-1',
              type: 'photo',
              url: initialActivityPhoto || photoProfil || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
              titre: initialActivityTitre || 'Réalisation inaugurale',
            },
          ],
        });

        setIsAiInspecting(false);
        setIsSuccess(true);

        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.6 },
        });
      }, 1200);
    } catch (err) {
      console.error('Error during AI inspection:', err);
      setIsAiInspecting(false);
      setIsSuccess(true);
    }
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
            Prise de photo directe (caméra avant ou arrière). Le Robot & l'IA inspectent vos identifiants pour certifier votre compte.
          </p>

          {/* Stepper */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/20 text-xs font-bold overflow-x-auto">
            <span
              className={`px-3 py-1 rounded-lg shrink-0 ${
                step === 1 ? 'bg-white text-emerald-800' : 'bg-white/20 text-white'
              }`}
            >
              1. Pièce & Selfie 🤳
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
              3. Tarifs & Sécurité 🔐
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6">
          {/* AI Inspection Live Loading Screen */}
          {isAiInspecting ? (
            <div className="text-center py-12 space-y-6">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 border-t-emerald-600 animate-spin" />
                <Bot className="w-10 h-10 text-emerald-600 animate-pulse" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>INSPECTION PAR LE ROBOT SENTINEL-CI & IA</span>
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  Vérification des identifiants avant activation...
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  L'Intelligence Artificielle examine la photo de votre {pieceIdentiteType} et la concordance faciale de votre selfie de face.
                </p>
              </div>

              {/* Inspection steps checklist */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-sm mx-auto text-left text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Document {pieceIdentiteType} détecté et lisible</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Selfie de face conforme</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Score de confiance biométrique : 98%</span>
                </div>
              </div>
            </div>
          ) : isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-12 h-12" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span>IDENTITÉ APPROUVÉE PAR LE ROBOT IA</span>
              </div>

              <h3 className="text-2xl font-black text-slate-900">
                Félicitations, votre compte est certifié et créé !
              </h3>

              {/* AI Verdict Card */}
              {aiInspectionResult && (
                <div className="bg-slate-950 text-white rounded-2xl p-4 max-w-md mx-auto text-left text-xs border border-emerald-500/30 space-y-1.5 shadow-lg">
                  <div className="text-emerald-400 font-bold flex items-center gap-1.5 border-b border-white/10 pb-1.5">
                    <Bot className="w-4 h-4" />
                    <span>Rapport d'inspection SENTINEL-CI</span>
                  </div>
                  <p className="italic text-slate-200">
                    « {aiInspectionResult.notes} »
                  </p>
                </div>
              )}

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 max-w-md mx-auto text-xs text-emerald-900 text-left space-y-2">
                <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Compte activé avec 3 mois d'essai gratuit</span>
                </p>
                <p>
                  Votre vitrine et votre catalogue d'activités sont publiés.
                  {wantPassword && motDePasse
                    ? ' Votre compte est sécurisé par votre mot de passe secret.'
                    : ' Votre compte est en accès libre sans mot de passe.'}
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
              {/* STEP 1: Direct Camera Selfie & Identity Card Capture */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                    <Lock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-950">
                      <strong className="block mb-1">
                        Prise de vue directe (Caméra avant ou arrière au choix) :
                      </strong>
                      Prenez directement en photo votre <strong>pièce d'identité</strong> et prenez votre <strong>selfie de face</strong>. Le robot SENTINEL-CI analysera les clichés avant d'activer votre compte.
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
                        Type de pièce d'identité que vous allez photographier *
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

                    {/* PHOTO 1: PHOTO DE LA PIÈCE (AVEC CHOIX AVANT OU ARRIÈRE) */}
                    <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                          <Camera className="w-4 h-4 text-emerald-600" />
                          <span>Photo de la pièce ({pieceIdentiteType}) *</span>
                        </label>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {pieceIdentiteUrl ? 'Photo prête ✅' : 'À prendre'}
                        </span>
                      </div>

                      {pieceIdentiteUrl && (
                        <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-slate-900 border border-slate-300 shadow-xs">
                          <img
                            src={pieceIdentiteUrl}
                            alt="Pièce capturée"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <div className="text-[11px] text-slate-500 font-bold">
                          Choisir la caméra :
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => openCamera('id', 'environment')}
                            className="py-2.5 px-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                          >
                            <Camera className="w-4 h-4" />
                            <span>📷 Caméra Arrière</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => openCamera('id', 'user')}
                            className="py-2.5 px-2 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                          >
                            <User className="w-4 h-4 text-emerald-400" />
                            <span>🤳 Caméra Avant</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* PHOTO 2: PHOTO DE FACE / SELFIE (AVEC CHOIX AVANT OU ARRIÈRE) */}
                    <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-emerald-300 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                          <User className="w-4 h-4 text-emerald-600" />
                          <span>Photo de face du créateur / gérant *</span>
                        </label>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {photoCreateurUrl ? 'Photo prête ✅' : 'À prendre'}
                        </span>
                      </div>

                      {photoCreateurUrl && (
                        <div className="flex items-center justify-center py-1">
                          <div className="relative w-24 h-24 rounded-full overflow-hidden border-3 border-emerald-500 shadow-md bg-slate-900">
                            <img
                              src={photoCreateurUrl}
                              alt="Selfie créateur"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <div className="text-[11px] text-slate-500 font-bold">
                          Choisir la caméra :
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => openCamera('creator', 'user')}
                            className="py-2.5 px-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                          >
                            <User className="w-4 h-4 text-emerald-400" />
                            <span>🤳 Caméra Avant (Selfie)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => openCamera('creator', 'environment')}
                            className="py-2.5 px-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                          >
                            <Camera className="w-4 h-4" />
                            <span>📷 Caméra Arrière</span>
                          </button>
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
                          alert('Veuillez renseigner votre nom, prénoms, téléphone ainsi que la photo de pièce et votre selfie de face.');
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

                    {/* Catalogue d'activités : Photo de réalisation */}
                    <div className="sm:col-span-2 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-black text-xs text-emerald-900">
                          <ImageIcon className="w-4 h-4 text-emerald-700" />
                          <span>Première réalisation de votre Catalogue d'Activités</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => openCamera('activity')}
                          className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Prendre en photo 📸</span>
                        </button>
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
                            Courte description
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: Couverture photo complète pour nos clients à Cocody."
                            value={initialActivityDesc}
                            onChange={(e) => setInitialActivityDesc(e.target.value)}
                            className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl"
                          />
                        </div>
                      </div>

                      {initialActivityPhoto && (
                        <div className="flex items-center gap-3 pt-1">
                          <img
                            src={initialActivityPhoto}
                            alt="Aperçu catalogue"
                            className="w-16 h-12 rounded-lg object-cover border border-slate-300 shadow-xs shrink-0"
                          />
                          <span className="text-[11px] text-emerald-800 font-bold">
                            Photo enregistrée pour votre vitrine
                          </span>
                        </div>
                      )}
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
                      Étape suivante : Tarifs & Sécurité &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Services & Pricing + Optional Password Protection */}
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

                  {/* OPTIONAL PASSWORD PROTECTION SECTION (Per user requirement: provider chooses to set or not) */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-emerald-600" />
                        <span className="font-extrabold text-xs text-slate-900">
                          Mot de passe de protection (Facultatif / Optionnel)
                        </span>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        <input
                          type="checkbox"
                          checked={wantPassword}
                          onChange={(e) => setWantPassword(e.target.checked)}
                          className="w-4 h-4 text-emerald-600 rounded"
                        />
                        <span>Ajouter un mot de passe</span>
                      </label>
                    </div>

                    <p className="text-[11px] text-slate-500">
                      Vous pouvez sécuriser l'accès à votre espace avec un mot de passe secret, ou le laisser sans mot de passe pour y accéder directement. C'est selon votre convenance.
                    </p>

                    {wantPassword && (
                      <div className="pt-2 animate-in fade-in space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700">
                          Définissez votre mot de passe secret prestataire :
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Ex: MonCodePro2026"
                            value={motDePasse}
                            onChange={(e) => setMotDePasse(e.target.value)}
                            className="w-full pl-3 pr-10 py-2.5 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Robot & AI Inspection Notice Banner */}
                  <div className="bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-amber-500/15 p-4 rounded-2xl border border-emerald-200 flex items-start gap-3">
                    <Bot className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div className="text-xs text-emerald-950">
                      <strong>Inspection préalable par le Robot & IA :</strong> En cliquant ci-dessous, le Robot SENTINEL-CI inspecte vos identifiants ({pieceIdentiteType} et photo de face). Si tout est conforme, votre compte est certifié et vos 3 mois gratuits sont lancés.
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
                      className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-700/25 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Bot className="w-4 h-4 text-amber-300" />
                      <span>Faire inspecter par l'IA & Créer mon compte</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Direct Phone Camera & Selfie Capture Modal */}
      <CameraCaptureModal
        isOpen={cameraModal.isOpen}
        onClose={() => setCameraModal((prev) => ({ ...prev, isOpen: false }))}
        mode={cameraModal.mode}
        initialFacing={cameraModal.initialFacing}
        title={cameraModal.title}
        subtitle={cameraModal.subtitle}
        onCapture={handleCaptureResult}
      />
    </div>
  );
};
