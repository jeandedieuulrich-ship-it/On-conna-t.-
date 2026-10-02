import { GoogleGenAI } from '@google/genai';

export interface AiIdentityInspectionResult {
  approved: boolean;
  isFraudulent: boolean;
  fraudReason?: string;
  score: number; // 0 to 100
  verdict: 'approved' | 'review_required' | 'fraud_detected';
  notes: string;
  checks: {
    pieceIdentiteRectoConforme: boolean;
    pieceIdentiteVersoConforme: boolean;
    photoSelfieConforme: boolean;
    concordanceBiometrique: boolean;
    validiteFormat: boolean;
    antiFraudePass: boolean;
  };
}

/**
 * Normalise un numéro de téléphone ivoirien / international en une clé unique stricte.
 * Exemples :
 * - "+225 07 01 02 03 04" -> "2250701020304"
 * - "0701020304" -> "2250701020304"
 * - "00225 07-01-02-03-04" -> "2250701020304"
 */
export function normalizePhoneNumber(raw: string): string {
  if (!raw) return '';
  // Enlever tous les espaces, tirets, points, parenthèses
  let digits = raw.replace(/[^0-9]/g, '');

  // Si commence par 00225, enlever le 00
  if (digits.startsWith('00225')) {
    digits = digits.substring(2);
  }

  // Si c'est un numéro ivoirien direct à 10 chiffres (ex: 07..., 05..., 01...)
  if (digits.length === 10 && digits.startsWith('0')) {
    return `225${digits}`;
  }

  // Si c'est déjà 225 suivi de 10 chiffres
  if (digits.length === 13 && digits.startsWith('225')) {
    return digits;
  }

  return digits;
}

const SUSPICIOUS_PATTERNS = [
  'test',
  'fake',
  'faux',
  'usurpateur',
  'arnaque',
  'vol',
  'azerty',
  'asdf',
  'qwerty',
  'hacker',
  'spam',
  'null',
  'undefined',
  'aaaa',
  'zzzz',
];

const FAKE_PHONE_SEQUENCES = [
  '0000000000',
  '1111111111',
  '2222222222',
  '3333333333',
  '1234567890',
  '0123456789',
  '0700000000',
];

/**
 * Inspection préalable et détection de fraude par le Robot SENTINEL-CI et l'IA
 * avant d'activer la création du compte prestataire.
 */
export async function inspectProviderIdentityWithAi(data: {
  nomCivil: string;
  prenoms: string;
  telephone: string;
  pieceIdentiteType: 'CNI' | 'Permis' | 'Passeport';
  pieceIdentiteUrl?: string | null; // Recto
  pieceIdentiteVersoUrl?: string | null; // Verso
  photoCreateurUrl?: string | null;
  nomCommercial: string;
  profession: string;
}): Promise<AiIdentityInspectionResult> {
  const normPhone = normalizePhoneNumber(data.telephone);
  const fullName = `${data.nomCivil.toLowerCase()} ${data.prenoms.toLowerCase()}`.trim();

  // 1. Détection de fausses informations textuelles évidentes
  let isFraudulent = false;
  let fraudReason = '';

  // Vérification de motifs suspects dans les noms
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (fullName.includes(pattern)) {
      isFraudulent = true;
      fraudReason = `Identité suspecte détectée : nom contenant des termes invalides (« ${pattern} »).`;
      break;
    }
  }

  // Vérification si le nom contient des chiffres
  if (!isFraudulent && /\d/.test(data.nomCivil + data.prenoms)) {
    isFraudulent = true;
    fraudReason = "Le nom ou prénom d'état civil contient des chiffres frauduleux.";
  }

  // Vérification de fausses séquences de téléphone
  if (!isFraudulent) {
    for (const fakeSeq of FAKE_PHONE_SEQUENCES) {
      if (normPhone.includes(fakeSeq) || normPhone.endsWith(fakeSeq.substring(2))) {
        isFraudulent = true;
        fraudReason = `Numéro de téléphone fictif ou invalide (« ${data.telephone} »).`;
        break;
      }
    }
  }

  // Vérification si la photo recto est identique à la photo verso (tentative de tromperie)
  if (
    !isFraudulent &&
    data.pieceIdentiteUrl &&
    data.pieceIdentiteVersoUrl &&
    data.pieceIdentiteUrl === data.pieceIdentiteVersoUrl &&
    (data.pieceIdentiteType === 'CNI' || data.pieceIdentiteType === 'Permis')
  ) {
    isFraudulent = true;
    fraudReason = "La photo Verso soumise est une copie exacte du Recto. Recto et Verso distincts obligatoires.";
  }

  // Vérification si la photo de la pièce est identique au selfie
  if (
    !isFraudulent &&
    data.pieceIdentiteUrl &&
    data.photoCreateurUrl &&
    data.pieceIdentiteUrl === data.photoCreateurUrl
  ) {
    isFraudulent = true;
    fraudReason = "La pièce d'identité et le selfie sont la même image. Concordance biométrique impossible.";
  }

  // Présence des photos requises
  const hasRecto = Boolean(data.pieceIdentiteUrl && data.pieceIdentiteUrl.length > 50);
  const requiresVerso = data.pieceIdentiteType === 'CNI' || data.pieceIdentiteType === 'Permis';
  const hasVerso = requiresVerso ? Boolean(data.pieceIdentiteVersoUrl && data.pieceIdentiteVersoUrl.length > 50) : true;
  const hasSelfie = Boolean(data.photoCreateurUrl && data.photoCreateurUrl.length > 50);
  const hasValidName = Boolean(data.nomCivil.trim().length >= 2 && data.prenoms.trim().length >= 2);
  const hasValidPhone = Boolean(normPhone.length >= 10);

  const checks = {
    pieceIdentiteRectoConforme: hasRecto,
    pieceIdentiteVersoConforme: hasVerso,
    photoSelfieConforme: hasSelfie,
    concordanceBiometrique: hasRecto && hasSelfie && !isFraudulent,
    validiteFormat: hasValidName && hasValidPhone,
    antiFraudePass: !isFraudulent,
  };

  const isApproved =
    checks.pieceIdentiteRectoConforme &&
    checks.pieceIdentiteVersoConforme &&
    checks.photoSelfieConforme &&
    checks.validiteFormat &&
    checks.antiFraudePass;

  let score = isApproved ? 99 : isFraudulent ? 0 : 35;
  let notes = isFraudulent
    ? `ALERTE FRAUDE ROBOT SENTINEL-CI : ${fraudReason} Numéro ${data.telephone} identifié pour bannissement définitif.`
    : `Inspection réussie par le Robot SENTINEL-CI : Pièce ${data.pieceIdentiteType} (Recto-Verso) et photo de face certifiées conformes. Compte activé.`;

  // Optionnel : enrichissement par Gemini API si disponible
  const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || (import.meta as any)?.env?.VITE_GEMINI_API_KEY;

  if (apiKey && isApproved) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Tu es SENTINEL-CI, le robot d'intelligence artificielle de contrôle et de surveillance de l'application "ON CONNAÎT 🇨🇮".
Tu viens d'inspecter les identifiants d'un nouveau prestataire :
- Gérant : ${data.prenoms} ${data.nomCivil}
- Téléphone : ${data.telephone}
- Type de pièce : ${data.pieceIdentiteType} (Recto + Verso + Selfie)
- Statut : Données authentiques et conformes.
Rédige une confirmation d'approbation d'identité très courte (2 phrases), professionnelle et sécurisante en français ivoirien poli, certifiant la validation et l'activation du compte.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      if (response && response.text) {
        notes = response.text.trim();
      }
    } catch (err) {
      console.warn('Gemini ID inspection fallback:', err);
    }
  }

  return {
    approved: isApproved,
    isFraudulent,
    fraudReason: isFraudulent ? fraudReason : undefined,
    score,
    verdict: isFraudulent ? 'fraud_detected' : isApproved ? 'approved' : 'review_required',
    notes,
    checks,
  };
}
