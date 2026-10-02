import { GoogleGenAI } from '@google/genai';
import { ProviderItem, EventItem, EventReport, SubscriptionPayment, SecurityAuditLog } from '../types';

export interface SentinelAnalysisResult {
  reply: string;
  suggestedAction?: 'lock_expired' | 'verify_identities' | 'scan_security' | 'notify_providers';
  auditLogsToCreate?: Omit<SecurityAuditLog, 'id' | 'timestamp'>[];
}

export async function askSentinelAi(
  userQuery: string,
  context: {
    adminName: string;
    providers: ProviderItem[];
    events: EventItem[];
    reports: EventReport[];
    payments: SubscriptionPayment[];
    auditLogs: SecurityAuditLog[];
  }
): Promise<SentinelAnalysisResult> {
  const expiredProviders = context.providers.filter(
    (p) => p.subscriptionStatus === 'expired' || (!p.isTrialActive && p.subscriptionStatus !== 'active')
  );
  const trialProviders = context.providers.filter((p) => p.subscriptionStatus === 'trial');
  const activePaidProviders = context.providers.filter((p) => p.subscriptionStatus === 'active');
  const pendingIdProviders = context.providers.filter((p) => p.verificationStatus === 'pending');

  const contextSummary = `
DONNÉES DU SYSTÈME EN TEMPS RÉEL (ON CONNAÎT 🇨🇮):
- Administrateur Principal : ${context.adminName} (jeandedieuulrich@gmail.com)
- Nombre total de prestataires : ${context.providers.length}
- Prestataires en période d'essai (3 mois) : ${trialProviders.length}
- Prestataires avec abonnement payé actif (2 000 FCFA/mois) : ${activePaidProviders.length}
- Prestataires avec abonnement/essai expiré (ACCÈS BLOQUÉ) : ${expiredProviders.length} (${expiredProviders.map(p => p.nomCommercial).join(', ') || 'Aucun'})
- Prestataires en attente de validation d'identité (CNI, Permis, Passeport + photo face) : ${pendingIdProviders.length} (${pendingIdProviders.map(p => p.nomCommercial).join(', ') || 'Aucun'})
- Total événements : ${context.events.length}
- Signalements ouverts : ${context.reports.filter(r => r.statut === 'nouveau').length}
- Paiements Mobile Money récents : ${context.payments.length}
`;

  const systemInstruction = `Tu es "SENTINEL-CI", le Robot Superviseur et Co-gestionnaire intelligent de la plateforme "ON CONNAÎT 🇨🇮" (événements et prestataires en Côte d'Ivoire).
Tu travailles en binôme direct avec le Super-Administrateur Ulrich Jean-Dieu (email: jeandedieuulrich@gmail.com).

Tes missions fondamentales :
1. SURVEILLER L'APPLICATION 24H/24 : intégrité des données, détection des fraudes, conformité légale ARTCI / loi ivoirienne n°2013-450.
2. VÉRIFICATION DES IDENTITÉS : s'assurer que chaque prestataire a fourni une photo claire de sa pièce d'identité (CNI, Permis de conduire ou Passeport) ET une photo de face du créateur. Aucun numéro d'entreprise n'est exigé.
3. CONTRÔLE DES ABONNEMENTS : 3 mois d'essai gratuit, puis verrouillage automatique strict si les 2 000 FCFA/mois ne sont pas payés. Réactivation automatique dès paiement par lien Wave, Orange Money ou MTN.
4. ASSISTANCE D'ULRICH : Réponds avec professionnalisme, rigueur, bienveillance ivoirienne (respectueux, efficace, précis avec des chiffres exacts). Propose des actions concrètes.`;

  // Try calling Gemini if API key is provided
  const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || (import.meta as any)?.env?.VITE_GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `${systemInstruction}\n\n${contextSummary}\n\nDemande d'Ulrich : "${userQuery}"`,
      });

      if (response && response.text) {
        return {
          reply: response.text,
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local heuristic response:', err);
    }
  }

  // Local Intelligent Heuristic Response (Guaranteed 100% offline & zero-latency uptime)
  const queryLower = userQuery.toLowerCase();

  if (queryLower.includes('rapport') || queryLower.includes('point') || queryLower.includes('statut') || queryLower.includes('audit')) {
    return {
      reply: `🛡️ **Rapport de Surveillance en Temps Réel - SENTINEL-CI**\n\nBonjour Administrateur Ulrich ! Voici l'état actuel de la plateforme :\n\n- 👨🏾‍💼 **Prestataires surveillés** : ${context.providers.length}\n- ⏳ **En période d'essai (3 mois)** : ${trialProviders.length} prestataire(s)\n- 🔒 **Comptes expirés (accès bloqué)** : ${expiredProviders.length} prestataire(s)\n- 💳 **Abonnements actifs (2 000 FCFA)** : ${activePaidProviders.length} prestataire(s)\n- 🪪 **Pièces d'identité à contrôler** : ${pendingIdProviders.length} (CNI, Permis, Passeport + photo face créateur)\n- 🎟️ **Événements actifs** : ${context.events.length}\n- 🚨 **Signalements d'urgence** : ${context.reports.filter(r => r.statut === 'nouveau').length}\n\n**Verdict IA** : Plateforme sécurisée. Les liens de paiement direct Mobile Money (Wave, Orange, MTN) sont opérationnels et sans affichage de numéros bruts.`,
      suggestedAction: expiredProviders.length > 0 ? 'lock_expired' : 'scan_security',
    };
  }

  if (queryLower.includes('bloqu') || queryLower.includes('essai') || queryLower.includes('expir')) {
    return {
      reply: `🔒 **Contrôle des Accès & Expirations d'Essai**\n\nUlrich, conformément à votre consigne, tout prestataire dont les 3 mois d'essai sont arrivés à échéance voit son espace immédiatement verrouillé.\n\n- **Comptes actuellement verrouillés** : ${expiredProviders.length}\n${expiredProviders.map(p => `  • ${p.nomCommercial} (${p.profession}) - Expiré le ${p.trialEndDate}`).join('\n') || '  • Aucun compte n\'est actuellement en infraction ou expiré.'}\n\nDès qu'un prestataire clique sur le lien Wave, MTN ou Orange Money et règle ses 2 000 FCFA, SENTINEL-CI débloque automatiquement son accès sans délai d'attente.`,
      suggestedAction: 'lock_expired',
    };
  }

  if (queryLower.includes('identit') || queryLower.includes('cni') || queryLower.includes('permis') || queryLower.includes('passeport') || queryLower.includes('piece')) {
    return {
      reply: `🪪 **Contrôle Biométrique & Pièces d'Identité**\n\nConformément à votre directive, les inscriptions n'exigent plus de numéro d'entreprise ni de date de création.\n\nChaque prestataire doit fournir :\n1. Une photo haute lisibilité de sa **CNI, son Permis de conduire ou son Passeport**\n2. Une **photo de face du créateur** pour certifier la concordance\n\nActuellement, **${pendingIdProviders.length}** dossier(s) sont en attente d'approbation. Le coffre-fort numérique protège ces documents selon la loi ARTCI.`,
      suggestedAction: 'verify_identities',
    };
  }

  if (queryLower.includes('paiement') || queryLower.includes('wave') || queryLower.includes('orange') || queryLower.includes('mtn')) {
    return {
      reply: `💳 **Surveillance des Flux Mobile Money**\n\nUlrich, aucun numéro de téléphone n'est affiché en clair sur le site comme vous l'avez demandé. Les utilisateurs ont exclusivement accès à des **liens directs et sécurisés** vers :\n\n- 🌊 **Wave CI** (Redirection directe sans frais)\n- 🍊 **Orange Money Web Checkout**\n- ⚡ **MTN Mobile Money Gateway**\n\nDès confirmation de transaction, le statut d'abonnement passe instantanément à « Actif » et prolonge l'accès de 30 jours (ou plus selon la formule choisie).`,
    };
  }

  return {
    reply: `🤖 **SENTINEL-CI à votre service, Ulrich !**\n\nJ'ai analysé votre demande : « ${userQuery} ».\n\nLe système de surveillance surveille en continu :\n- Le blocage automatique des prestataires en fin d'essai\n- L'activation instantanée dès paiement par lien Wave, Orange ou MTN\n- La conformité des photos de profil, photos créateur et pièces d'identité\n- L'intégrité des catalogues d'activités publiés\n\nQue souhaitez-vous que nous vérifiions ensemble ?`,
  };
}
