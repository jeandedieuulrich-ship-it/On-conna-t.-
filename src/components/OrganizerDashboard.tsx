import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  PlusCircle,
  BarChart3,
  Users,
  Ticket,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Trash2,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export const OrganizerDashboard: React.FC = () => {
  const { events, deleteEvent, setIsAddEventOpen, setSelectedEvent, userRole, setUserRole } = useApp();

  const [activeTab, setActiveTab] = useState<'my-events' | 'stats' | 'participants'>('my-events');

  // Total stats
  const totalEvents = events.length;
  const publishedEvents = events.filter((e) => e.statut === 'publie');
  const pendingEvents = events.filter((e) => e.statut === 'en_attente');
  const totalViews = events.reduce((acc, curr) => acc + (curr.vues || 0), 0);
  const totalCapacity = events.reduce((acc, curr) => acc + (curr.placesTotales || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-2">
            <span>TABLEAU DE BORD ORGANISATEUR</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Gestion de vos Événements en Côte d'Ivoire
          </h1>
          <p className="text-xs sm:text-sm text-orange-100 mt-1">
            Publiez vos affiches, gérez votre billetterie et suivez les validations de l'équipe ON CONNAÎT.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddEventOpen(true)}
            className="px-5 py-3 bg-white text-orange-700 font-extrabold text-sm rounded-2xl shadow-lg hover:bg-orange-50 transition-colors flex items-center gap-2 cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Ajouter un événement</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Événements publiés</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{publishedEvents.length}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Visibles sur l'application</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">En cours de validation</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{pendingEvents.length}</div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1">Équipe ON CONNAÎT (2-4h)</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Vues Cumulées</span>
            <Eye className="w-4 h-4 text-orange-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{totalViews.toLocaleString('fr-FR')}</div>
          <div className="text-[11px] text-slate-500 font-semibold mt-1">Intérêt des visiteurs</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Places totales</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{totalCapacity.toLocaleString('fr-FR')}</div>
          <div className="text-[11px] text-purple-700 font-semibold mt-1">Capacité des salles</div>
        </div>
      </div>

      {/* Events Table / List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            <span>Mes Annonces d'Événements</span>
          </h2>
          <span className="text-xs font-bold text-slate-400">
            {events.length} enregistrés
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Affiche & Événement</th>
                <th className="py-3 px-4">Lieu & Ville</th>
                <th className="py-3 px-4">Date & Heure</th>
                <th className="py-3 px-4">Prix</th>
                <th className="py-3 px-4">Statut de validation</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={evt.affiche}
                        alt={evt.titre}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div>
                        <div className="font-extrabold text-slate-900 line-clamp-1">
                          {evt.titre}
                        </div>
                        <div className="text-[11px] text-orange-600 font-bold">
                          {evt.categorie}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div>{evt.commune}, {evt.ville}</div>
                    <div className="text-[11px] text-slate-400">{evt.lieu}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div>{evt.jour} {evt.date}</div>
                    <div className="text-[11px] text-slate-400">{evt.heure_debut} - {evt.heure_fin}</div>
                  </td>

                  <td className="py-3 px-4">
                    {evt.isGratuit ? (
                      <span className="text-emerald-700 font-bold">Gratuit</span>
                    ) : (
                      <span className="font-bold">{evt.prix.toLocaleString('fr-FR')} FCFA</span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    {evt.statut === 'publie' ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle className="w-3 h-3" />
                        Publié en ligne
                      </span>
                    ) : evt.statut === 'en_attente' ? (
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                        <Clock className="w-3 h-3" />
                        En attente modération
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[11px] font-bold px-2 py-0.5 rounded-full">
                        <XCircle className="w-3 h-3" />
                        Rejeté
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedEvent(evt)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Aperçu
                      </button>
                      <button
                        onClick={() => deleteEvent(evt.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
