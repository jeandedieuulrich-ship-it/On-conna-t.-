import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PAYMENT_CONFIG } from '../data/mockData';
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
  Camera,
  Image as ImageIcon,
  Trash2,
  AlertTriangle,
  Zap,
  User,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ProviderDashboard: React.FC = () => {
  const {
    providers,
    quotes,
    updateQuoteStatus,
    setIsPaymentModalOpen,
    setPaymentTargetProvider,
    setSelectedProvider,
    currentProviderId,
    setCurrentProviderId,
    addActivityPhotoToProvider,
    deleteActivityPhotoFromProvider,
    toggleProviderTrialExpiry,
    autoActivateProviderWithPayment,
  } = useApp();

  // Selected current provider
  const currentProvider =
    providers.find((p) => p.id === currentProviderId) || providers[0];

  // Quotes for this provider
  const providerQuotes = quotes.filter(
    (q) => q.providerId === currentProvider.id || q.providerName === currentProvider.nomCommercial
  );

  // New Activity Photo Modal State
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [newActivityTitre, setNewActivityTitre] = useState('');
  const [newActivityDesc, setNewActivityDesc] = useState('');
  const [newActivityCategorie, setNewActivityCategorie] = useState('Mariage');
  const [newActivityPhotoUrl, setNewActivityPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
  );

  const handleOpenPayment = () => {
    setPaymentTargetProvider(currentProvider);
    setIsPaymentModalOpen(true);
  };

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityTitre || !newActivityPhotoUrl) {
      alert('Veuillez renseigner le titre et l\'image de l\'activité.');
      return;
    }

    addActivityPhotoToProvider(currentProvider.id, {
      titre: newActivityTitre,
      description: newActivityDesc,
      photoUrl: newActivityPhotoUrl,
      categorie: newActivityCategorie,
    });

    setIsAddActivityOpen(false);
    setNewActivityTitre('');
    setNewActivityDesc('');

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const isExpired =
    currentProvider.subscriptionStatus === 'expired' ||
    (!currentProvider.isTrialActive && currentProvider.subscriptionStatus !== 'active');

  // If expired, show the strict Lock Screen as requested
  if (isExpired) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-3xl border-2 border-rose-200 shadow-2xl p-6 sm:p-10 text-center space-y-6">
          <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-black">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>ACCÈS TEMPORAIREMENT SUSPENDU</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Votre période d'essai de 3 mois est expirée
          </h1>

          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Bonjour <strong>{currentProvider.nomCommercial}</strong>. Conformément aux conditions d'utilisation, votre période de gratuité de 90 jours a pris fin. Pour débloquer l'accès immédiat à votre tableau de bord, consulter vos demandes de devis et maintenir vos activités visibles par les organisateurs, veuillez renouveler votre abonnement mensuel.
          </p>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 max-w-md mx-auto text-xs text-amber-950 text-left space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>Activation Automatique Instantanée</span>
            </div>
            <p>
              Tarif unique : <strong>2 000 FCFA / mois</strong>. Dès que vous effectuez le règlement via les liens officiels Wave, Orange Money ou MTN, votre compte se débloque en temps réel sans attente.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleOpenPayment}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-amber-300" />
              <span>Débloquer mon compte maintenant (2 000 FCFA)</span>
            </button>

            <button
              onClick={() => autoActivateProviderWithPayment(currentProvider.id, 'Wave', 1)}
              className="w-full sm:w-auto px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-2xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>Simuler activation automatique immédiate</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2">
            <span className="text-xs text-slate-400">Prestataire actif en test :</span>
            <select
              value={currentProviderId}
              onChange={(e) => setCurrentProviderId(e.target.value)}
              className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1"
            >
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nomCommercial} ({p.subscriptionStatus})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner with Provider Info and Trial Status */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <img
            src={currentProvider.photoProfil}
            alt={currentProvider.nomCommercial}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/40 shadow-md shrink-0"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-1.5">
              <span>ESPACE PRESTATAIRE ON CONNAÎT 🇨🇮</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black">
              {currentProvider.nomCommercial}
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">
              {currentProvider.profession} • {currentProvider.commune}, {currentProvider.ville}
            </p>

            {/* Creator & ID Verification Badge */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-white/15 px-2.5 py-0.5 rounded-lg border border-white/20">
                <User className="w-3 h-3 text-amber-300" />
                <span>Gérant : {currentProvider.prenoms || 'Responsable'} {currentProvider.nomCivil || ''}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-500/40 px-2.5 py-0.5 rounded-lg border border-emerald-300/30">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>Pièce ({currentProvider.pieceIdentiteType || 'CNI'}) & Photo validées</span>
              </span>
            </div>
          </div>
        </div>

        {/* Subscription Card & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
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

          <div className="flex flex-col gap-2">
            <button
              onClick={handleOpenPayment}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-colors flex items-center gap-2 cursor-pointer shrink-0"
            >
              <CreditCard className="w-4 h-4" />
              <span>Renouveler (2 000 F / mois)</span>
            </button>

            {/* Test toggle button */}
            <button
              onClick={() => toggleProviderTrialExpiry(currentProvider.id)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px] rounded-xl transition-colors cursor-pointer text-center"
              title="Permet de simuler le verrouillage de fin d'essai"
            >
              Simuler l'expiration de l'essai 🔒
            </button>
          </div>
        </div>
      </div>

      {/* Switcher if multiple accounts */}
      <div className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-600">Compte prestataire actif :</span>
          <select
            value={currentProviderId}
            onChange={(e) => setCurrentProviderId(e.target.value)}
            className="font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-2.5 py-1"
          >
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nomCommercial} — {p.profession} ({p.subscriptionStatus})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setSelectedProvider(currentProvider)}
          className="text-emerald-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
        >
          <span>Voir ma vitrine telle que vue par les clients</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* SECTION CATALOGUE D'ACTIVITÉS & RÉALISATIONS (Crucial User Requirement) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-1">
              <Camera className="w-3.5 h-3.5 text-emerald-600" />
              <span>PORTFOLIO & RÉALISATIONS SUR LE TERRAIN</span>
            </div>
            <h2 className="text-lg font-black text-slate-900">
              Mon Catalogue d'Activités ({currentProvider.catalogPhotos?.length || 0} photos)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Publiez les photos de vos activités récentes pour attirer de nouveaux clients en Côte d'Ivoire.
            </p>
          </div>

          <button
            onClick={() => setIsAddActivityOpen(true)}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une photo au catalogue</span>
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="p-5 sm:p-6">
          {(!currentProvider.catalogPhotos || currentProvider.catalogPhotos.length === 0) ? (
            <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl space-y-3">
              <ImageIcon className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-500">
                Vous n'avez pas encore publié de photo d'activité dans votre catalogue.
              </p>
              <button
                onClick={() => setIsAddActivityOpen(true)}
                className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Ajouter ma première photo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {currentProvider.catalogPhotos.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-2xs hover:shadow-md transition-all flex flex-col"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-900">
                    <img
                      src={item.photoUrl}
                      alt={item.titre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-slate-950/75 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {item.categorie || 'Activité'}
                    </span>
                    <button
                      onClick={() => deleteActivityPhotoFromProvider(currentProvider.id, item.id)}
                      className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-700 cursor-pointer"
                      title="Supprimer cette photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900 line-clamp-1">
                        {item.titre}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium mt-2 pt-2 border-t border-slate-100">
                      📅 {item.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quote Requests Section */}
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
            <span>Mes Formules Actives ({currentProvider.services.length})</span>
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

      {/* Modal: Add New Activity Photo */}
      {isAddActivityOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-600" />
                <span>Publier une photo d'activité au catalogue</span>
              </h3>
              <button
                onClick={() => setIsAddActivityOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Titre de la prestation / activité *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Shooting Mariage Coutumier à Cocody"
                  value={newActivityTitre}
                  onChange={(e) => setNewActivityTitre(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catégorie d'activité
                </label>
                <select
                  value={newActivityCategorie}
                  onChange={(e) => setNewActivityCategorie(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                >
                  <option value="Mariage">Mariage & Cérémonie</option>
                  <option value="Gala & B2B">Gala & Conférence d'entreprise</option>
                  <option value="Soirée & Concert">Soirée & Concert</option>
                  <option value="Mode & Studio">Mode & Studio</option>
                  <option value="Anniversaire">Anniversaire & Réception</option>
                  <option value="Autre">Autre prestation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Photo de l'activité (URL de l'image) *
                </label>
                <input
                  type="text"
                  required
                  value={newActivityPhotoUrl}
                  onChange={(e) => setNewActivityPhotoUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                />
                <div className="mt-2 aspect-16/9 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={newActivityPhotoUrl}
                    alt="Aperçu"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description détaillée
                </label>
                <textarea
                  rows={2}
                  placeholder="Décrivez ce que vous avez réalisé, le lieu, l'ambiance..."
                  value={newActivityDesc}
                  onChange={(e) => setNewActivityDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddActivityOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Publier dans mon catalogue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
