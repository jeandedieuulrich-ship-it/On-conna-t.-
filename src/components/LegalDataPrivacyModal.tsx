import React from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, Scale, Lock, CheckCircle, FileText } from 'lucide-react';

export const LegalDataPrivacyModal: React.FC = () => {
  const { isLegalModalOpen, setIsLegalModalOpen } = useApp();

  if (!isLegalModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-4 border border-orange-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-5 sm:p-6 text-white relative shrink-0">
          <button
            onClick={() => setIsLegalModalOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black mb-2">
            <Scale className="w-3.5 h-3.5" />
            <span>RÉPUBLIQUE DE CÔTE D'IVOIRE • ARTCI</span>
          </div>

          <h2 className="text-xl font-black">
            Protection des Données Personnelles
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Conformité stricte avec la Loi n°2013-450 du 19 juin 2013.
          </p>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 text-xs text-slate-700 space-y-4 leading-relaxed">
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-amber-950">
            <h3 className="font-extrabold text-sm mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Engagement ON CONNAÎT CI</span>
            </h3>
            <p>
              La plateforme <strong>ON CONNAÎT 🇨🇮</strong> applique les normes les plus strictes de confidentialité et de sécurité pour protéger les citoyens, organisateurs et prestataires en Côte d'Ivoire.
            </p>
          </div>

          <div>
            <h4 className="font-extrabold text-sm text-slate-900 mb-1">
              1. Séparation stricte des données publiques et privées
            </h4>
            <p>
              Pour les prestataires professionnels, <strong>seules les informations nécessaires à leur activité commerciale</strong> (Nom commercial, domaine, commune, services, portfolio et contact WhatsApp/téléphone professionnel) sont rendues publiques.
            </p>
            <p className="mt-1">
              Les documents officiels transmis pour vérification (Carte Nationale d'Identité, Passeport, Registre de Commerce RCCM, date de naissance civile) sont stockés dans un coffre numérique sécurisé inaccessible aux visiteurs et uniquement consultable par l'équipe d'audit.
            </p>
          </div>

          <div>
            <h4 className="font-extrabold text-sm text-slate-900 mb-1">
              2. Droits de l'utilisateur reconnus par l'ARTCI
            </h4>
            <p>
              Conformément aux prérogatives de l'Autorité de Régulation des Télécommunications/TIC de Côte d'Ivoire (<strong>ARTCI</strong>), tout utilisateur bénéficie des droits suivants :
            </p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li><strong>Droit d'accès :</strong> Obtenir communication de l'ensemble des données enregistrées.</li>
              <li><strong>Droit de rectification :</strong> Corriger toute information inexacte ou obsolète depuis son tableau de bord.</li>
              <li><strong>Droit de suppression :</strong> Demander le retrait intégral de son profil ou de ses données sur simple demande.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-sm text-slate-900 mb-1">
              3. Géolocalisation & Consentement
            </h4>
            <p>
              La fonctionnalité « AUTOUR DE MOI » n'utilise les coordonnées GPS qu'avec le consentement explicite de l'internaute dans son navigateur. Aucune géolocalisation n'est stockée à des fins de pistage publicitaire.
            </p>
          </div>

          <div className="pt-2 text-center text-slate-400 text-[11px]">
            Pour toute demande d'exercice de vos droits : <strong>protection-donnees@onconnait.ci</strong>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={() => setIsLegalModalOpen(false)}
            className="px-6 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            J'ai compris
          </button>
        </div>
      </div>
    </div>
  );
};
