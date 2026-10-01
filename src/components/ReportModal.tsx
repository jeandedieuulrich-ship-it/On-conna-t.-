import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, AlertTriangle, CheckCircle, Send } from 'lucide-react';

export const ReportModal: React.FC = () => {
  const { isReportModalOpen, setIsReportModalOpen, reportTargetEvent, submitReport } = useApp();

  const [motif, setMotif] = useState('Date ou horaire incorrect');
  const [details, setDetails] = useState('');
  const [contact, setContact] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isReportModalOpen || !reportTargetEvent) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    submitReport({
      eventId: reportTargetEvent.id,
      eventTitle: reportTargetEvent.titre,
      motif,
      details,
      signaleurContact: contact,
    });

    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden my-4 border border-rose-100">
        <div className="bg-rose-600 p-5 text-white relative">
          <button
            onClick={() => {
              setIsReportModalOpen(false);
              setIsSuccess(false);
            }}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 font-bold text-xs bg-white/20 w-fit px-2.5 py-0.5 rounded-full mb-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Signalement communautaire</span>
          </div>
          <h2 className="text-lg font-black">Signaler une anomalie</h2>
          <p className="text-xs text-rose-100 mt-0.5 line-clamp-1">
            {reportTargetEvent.titre}
          </p>
        </div>

        <div className="p-5">
          {isSuccess ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-base font-black text-slate-900">
                Merci pour votre contribution !
              </h3>
              <p className="text-xs text-slate-600">
                L'équipe de vérification ON CONNAÎT va contrôler cette information dans les plus brefs délais.
              </p>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setIsReportModalOpen(false);
                }}
                className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Fermer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">Motif du signalement *</label>
                <select
                  value={motif}
                  onChange={(e) => setMotif(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                >
                  <option value="Date ou horaire incorrect">Date ou horaire incorrect</option>
                  <option value="Lieu erroné ou introuvable">Lieu erroné ou introuvable</option>
                  <option value="Prix ou billetterie faux">Prix ou billetterie faux</option>
                  <option value="Événement annulé ou reporté">Événement annulé ou reporté</option>
                  <option value="Suspicion de fausse annonce / arnaque">Suspicion de fausse annonce / arnaque</option>
                  <option value="Autre">Autre anomalie</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Précisions supplémentaires *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Expliquez brièvement l'erreur constatée..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Votre numéro ou email (facultatif)</label>
                <input
                  type="text"
                  placeholder="Pour vous tenir informé"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Envoyer le signalement à l'équipe</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
