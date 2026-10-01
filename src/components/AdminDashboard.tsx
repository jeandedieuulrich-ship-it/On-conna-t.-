import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Calendar,
  Briefcase,
  AlertTriangle,
  CreditCard,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Lock,
  UserCheck,
  TrendingUp,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    events,
    updateEventStatus,
    deleteEvent,
    providers,
    updateProviderVerification,
    reports,
    updateReportStatus,
    payments,
    confirmPaymentByAdmin,
    setSelectedEvent,
    setSelectedProvider,
  } = useApp();

  const [adminTab, setAdminTab] = useState<'events' | 'providers' | 'payments' | 'reports'>('events');

  const pendingEvents = events.filter((e) => e.statut === 'en_attente');
  const pendingProviders = providers.filter((p) => p.verificationStatus === 'pending');
  const pendingReports = reports.filter((r) => r.statut === 'nouveau');
  const pendingPayments = payments.filter((p) => p.statut === 'en_attente');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ESPACE ADMINISTRATION ON CONNAÎT 🇨🇮</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Modération & Contrôle de la Plateforme
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Validation des événements, contrôle des pièces d'identité (Loi n°2013-450 / ARTCI), paiements et signalements.
          </p>
        </div>

        {/* Global stats */}
        <div className="flex items-center gap-3">
          <div className="bg-white/10 px-4 py-2.5 rounded-2xl text-center border border-white/10">
            <div className="text-xl font-black text-amber-400">{events.length}</div>
            <div className="text-[10px] text-slate-300">Événements</div>
          </div>
          <div className="bg-white/10 px-4 py-2.5 rounded-2xl text-center border border-white/10">
            <div className="text-xl font-black text-emerald-400">{providers.length}</div>
            <div className="text-[10px] text-slate-300">Prestataires</div>
          </div>
          <div className="bg-white/10 px-4 py-2.5 rounded-2xl text-center border border-white/10">
            <div className="text-xl font-black text-rose-400">{reports.length}</div>
            <div className="text-[10px] text-slate-300">Signalements</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        <button
          onClick={() => setAdminTab('events')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            adminTab === 'events'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Événements à valider</span>
          {pendingEvents.length > 0 && (
            <span className="bg-amber-400 text-slate-900 text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {pendingEvents.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('providers')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            adminTab === 'providers'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Vérifications Prestataires (CNI)</span>
          {pendingProviders.length > 0 && (
            <span className="bg-amber-400 text-slate-900 text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {pendingProviders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('payments')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            adminTab === 'payments'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Paiements Mobile Money ({payments.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('reports')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            adminTab === 'reports'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Signalements ({reports.length})</span>
          {pendingReports.length > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {pendingReports.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab: Events Validation */}
      {adminTab === 'events' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">
              Modération des Événements ({events.length} au total)
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Vérifiez la véracité des dates, affiches et prix.
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {events.map((evt) => (
              <div key={evt.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <img
                    src={evt.affiche}
                    alt={evt.titre}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold bg-orange-100 text-orange-800 px-2 py-0.5 rounded-md">
                        {evt.categorie}
                      </span>
                      {evt.statut === 'publie' ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          En ligne
                        </span>
                      ) : evt.statut === 'en_attente' ? (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md animate-pulse">
                          En attente validation
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md">
                          Rejeté
                        </span>
                      )}
                    </div>

                    <h3 className="font-black text-sm text-slate-900 mt-1">{evt.titre}</h3>
                    <div className="text-xs text-slate-500 mt-0.5">
                      📍 {evt.lieu} ({evt.commune}, {evt.ville}) • 📅 {evt.jour} {evt.date} ({evt.heure_debut})
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Organisé par : <strong>{evt.organisateur.nom}</strong> ({evt.organisateur.telephone})
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => setSelectedEvent(evt)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Aperçu
                  </button>

                  {evt.statut !== 'publie' && (
                    <button
                      onClick={() => updateEventStatus(evt.id, 'publie')}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Valider</span>
                    </button>
                  )}

                  {evt.statut !== 'rejete' && (
                    <button
                      onClick={() => updateEventStatus(evt.id, 'rejete')}
                      className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Refuser
                    </button>
                  )}

                  <button
                    onClick={() => deleteEvent(evt.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    title="Supprimer définitivement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Providers Verification */}
      {adminTab === 'providers' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-base font-extrabold text-slate-900">
              Contrôle de Sécurité & Profils Vérifiés (Loi n°2013-450)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Attribution du badge « Profil vérifié 🛡️ » après vérification des pièces d'identité et registres d'entreprises.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {providers.map((p) => (
              <div key={p.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <img
                    src={p.photoProfil}
                    alt={p.nomCommercial}
                    className="w-14 h-14 rounded-2xl object-cover shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                        {p.profession}
                      </span>
                      {p.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <ShieldCheck className="w-3 h-3" />
                          Badge Vérifié Actif
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                          En attente de vérification
                        </span>
                      )}
                    </div>

                    <h3 className="font-black text-sm text-slate-900 mt-1">{p.nomCommercial}</h3>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Identité civile : <strong>{p.prenoms} {p.nomCivil || '(Fourni)'}</strong> • Né(e) le : {p.dateNaissance || 'Confidentiel'}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Pièce : {p.pieceIdentiteType || 'CNI'} {p.numeroEntreprise && `• RCCM : ${p.numeroEntreprise}`} • Tél : {p.contact.telephone}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => setSelectedProvider(p)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Voir vitrine
                  </button>

                  {!p.isVerified ? (
                    <button
                      onClick={() => updateProviderVerification(p.id, 'verified')}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Certifier Profil Vérifié</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => updateProviderVerification(p.id, 'rejected')}
                      className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Révoquer badge
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Payments Validation */}
      {adminTab === 'payments' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-base font-extrabold text-slate-900">
              Paiements des Abonnements (2 000 FCFA / mois)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Wave (0574003903), MTN Money (0574003903), Orange Money (0757346216).
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {payments.map((pay) => (
              <div key={pay.id} className="p-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                      {pay.operateur}
                    </span>
                    <span className="font-extrabold text-sm text-slate-900">
                      {pay.montantFCFA.toLocaleString('fr-FR')} FCFA
                    </span>
                    <span className="text-xs text-slate-400">• {pay.datePaiement}</span>
                  </div>
                  <div className="text-xs text-slate-700 mt-1 font-semibold">
                    Prestataire : {pay.providerName} (Tél client : {pay.telephonePaiement})
                  </div>
                  {pay.referenceTransaction && (
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Réf : {pay.referenceTransaction}
                    </div>
                  )}
                </div>

                <div>
                  {pay.statut === 'en_attente' ? (
                    <button
                      onClick={() => confirmPaymentByAdmin(pay.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl cursor-pointer"
                    >
                      Confirmer réception (+1 mois)
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Validé
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Reports */}
      {adminTab === 'reports' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-base font-extrabold text-slate-900">
              Signalements des utilisateurs ({reports.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Informations incorrectes, fausses annonces, annulations signalées par la communauté.
            </p>
          </div>

          {reports.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              Aucun signalement en attente. Tout est sous contrôle !
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {reports.map((rep) => (
                <div key={rep.id} className="p-5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                      {rep.motif}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 mt-1">
                      {rep.eventTitle}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">« {rep.details} »</p>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Signalé le {rep.dateCreation} {rep.signaleurContact && `• Contact: ${rep.signaleurContact}`}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {rep.statut === 'nouveau' && (
                      <button
                        onClick={() => updateReportStatus(rep.id, 'traite')}
                        className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 cursor-pointer"
                      >
                        Marquer traité
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
