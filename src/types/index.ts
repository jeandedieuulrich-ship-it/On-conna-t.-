export type Language = 'fr' | 'en';

export type UserRole = 'visitor' | 'organizer' | 'provider' | 'admin';

export type EventCategory =
  | 'Concerts'
  | 'Festivals'
  | 'Expositions'
  | 'Conférences'
  | 'Formations'
  | 'Salons'
  | 'Foires'
  | 'Spectacles'
  | 'Théâtre'
  | 'Danse'
  | 'Sport'
  | 'Mode'
  | 'Gastronomie'
  | 'Culture'
  | 'Business'
  | 'Networking'
  | 'Événements religieux'
  | 'Événements familiaux'
  | 'Activités enfants'
  | 'Loisirs'
  | 'Autres';

export type ProviderCategory =
  | 'Photographe'
  | 'Vidéaste'
  | 'Graphiste'
  | 'DJ'
  | 'Animateur / MC'
  | 'Traiteur'
  | 'Décorateur'
  | 'Maquilleur'
  | 'Coiffeur'
  | 'Wedding planner'
  | 'Sécurité'
  | 'Location de voitures'
  | 'Location de matériel'
  | 'Sonorisation'
  | 'Éclairage'
  | 'Imprimerie'
  | 'Artiste'
  | 'Groupe musical'
  | 'Danseur'
  | 'Technicien'
  | 'Informaticien'
  | 'Prestataire événementiel';

export interface EventProgramItem {
  heure: string;
  titre: string;
  description: string;
}

export interface OrganizerContact {
  nom: string;
  telephone: string;
  whatsapp: string;
  email: string;
  siteWeb?: string;
  reseauxSociaux?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    tiktok?: string;
  };
}

export interface EventItem {
  id: string;
  titre: string;
  affiche: string;
  categorie: EventCategory;
  description: string;
  date: string; // YYYY-MM-DD
  jour: string; // Samedi, Dimanche...
  heure_debut: string;
  heure_fin: string;
  lieu: string;
  commune: string;
  ville: string;
  adresse: string;
  latitude: number;
  longitude: number;
  prix: number; // 0 for free
  isGratuit: boolean;
  lienReservation?: string;
  organisateur: OrganizerContact;
  organisateur_id?: string;
  programme: EventProgramItem[];
  artistes: string[];
  conditionsAcces: string;
  placesDisponibles: number;
  placesTotales: number;
  galerie: string[];
  statut: 'publie' | 'en_attente' | 'rejete';
  dateCreation: string;
  vues: number;
  featured?: boolean;
}

export interface ProviderService {
  id: string;
  nom: string;
  description: string;
  prixAPartirDe: number; // in FCFA
  unite?: string; // par jour, par heure, par prestation
  disponibilite: string;
}

export interface PortfolioItem {
  id: string;
  type: 'photo' | 'video';
  url: string;
  titre: string;
}

export interface ActivityCatalogItem {
  id: string;
  titre: string;
  description: string;
  photoUrl: string;
  date: string;
  categorie?: string;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  type: 'PROVIDER_REGISTRATION' | 'ID_VERIFICATION' | 'TRIAL_EXPIRY' | 'PAYMENT_ACTIVATION' | 'SECURITY_SCAN' | 'SUSPICIOUS_REPORT' | 'ADMIN_LOGIN' | 'AI_ID_INSPECTION';
  severity: 'info' | 'warning' | 'alert' | 'success';
  message: string;
  targetId?: string;
  aiNotes?: string;
}

export interface AdminProfile {
  nom: string;
  email: string;
  role: 'super_admin';
  derniereConnexion: string;
  aiSentinelActive: boolean;
}

export interface ProviderItem {
  id: string;
  user_id?: string;
  // Public Display
  nomCommercial: string;
  profession: ProviderCategory;
  domaine: string;
  presentation: string;
  ville: string;
  commune: string;
  zoneIntervention: string[];
  photoProfil: string;
  photoCreateurUrl?: string; // Photo de face du créateur
  services: ProviderService[];
  portfolio: PortfolioItem[];
  catalogPhotos: ActivityCatalogItem[]; // Catalogue d'activités & réalisations
  contact: {
    telephone: string;
    whatsapp: string;
    email: string;
    instagram?: string;
    facebook?: string;
    siteWeb?: string;
  };
  isVerified: boolean;
  rating: number;
  reviewsCount: number;

  // Private / Secure Verification (Loi n°2013-450)
  nomCivil?: string;
  prenoms?: string;
  dateNaissance?: string;
  pieceIdentiteType?: 'CNI' | 'Permis' | 'Passeport' | 'Attestation';
  pieceIdentiteUrl?: string; // Photo de la pièce d'identité (CNI, Permis, Passeport)
  verificationStatus: 'verified' | 'pending' | 'rejected';
  verificationDocUrl?: string;
  aiVerificationNotes?: string;
  motDePasse?: string; // Mot de passe optionnel configuré par le prestataire pour sécuriser son compte
  aiInspectionReport?: {
    date: string;
    score: number;
    verdict: 'approved' | 'review_required';
    notes: string;
  };

  // Subscription Details (3 months trial, then 2000 FCFA/month)
  trialStartDate: string;
  trialEndDate: string;
  isTrialActive: boolean;
  subscriptionStatus: 'trial' | 'active' | 'expired';
  subscriptionValidUntil: string;
  dateCreation: string;
}

export interface QuoteRequest {
  id: string;
  providerId: string;
  providerName: string;
  clientNom: string;
  clientTelephone: string;
  clientWhatsapp: string;
  clientEmail: string;
  typeEvenement: string;
  dateEvenement: string;
  lieuEvenement: string;
  budgetEstimeFCFA: number;
  descriptionBesoin: string;
  dateCreation: string;
  statut: 'en_attente' | 'accepte' | 'refuse';
}

export interface EventReport {
  id: string;
  eventId: string;
  eventTitle: string;
  motif: string;
  details: string;
  signaleurContact?: string;
  dateCreation: string;
  statut: 'nouveau' | 'traite' | 'ignore';
}

export interface SubscriptionPayment {
  id: string;
  providerId: string;
  providerName: string;
  operateur: 'Wave' | 'MTN Money' | 'Orange Money';
  montantFCFA: number;
  referenceTransaction?: string;
  telephonePaiement: string;
  datePaiement: string;
  statut: 'valide' | 'en_attente' | 'rejete';
}
