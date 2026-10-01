import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EVENT_CATEGORIES, CITIES_CI, COMMUNES_ABIDJAN } from '../data/mockData';
import { EventCategory, EventProgramItem } from '../types';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Tag,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Ticket,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AddEventModal: React.FC = () => {
  const { isAddEventOpen, setIsAddEventOpen, addEvent, t, setActiveTab } = useApp();

  const [titre, setTitre] = useState('');
  const [affiche, setAffiche] = useState('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80');
  const [categorie, setCategorie] = useState<EventCategory>('Concerts');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('2026-10-25');
  const [jour, setJour] = useState('Dimanche');
  const [heureDebut, setHeureDebut] = useState('18:00');
  const [heureFin, setHeureFin] = useState('23:00');
  const [lieu, setLieu] = useState('');
  const [commune, setCommune] = useState('Cocody');
  const [ville, setVille] = useState('Abidjan');
  const [adresse, setAdresse] = useState('');
  const [isGratuit, setIsGratuit] = useState(false);
  const [prix, setPrix] = useState(5000);
  const [lienReservation, setLienReservation] = useState('');
  const [nomOrganisateur, setNomOrganisateur] = useState('');
  const [telephone, setTelephone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [siteWeb, setSiteWeb] = useState('');
  const [artistesText, setArtistesText] = useState('');
  const [conditionsAcces, setConditionsAcces] = useState('Accès sur présentation du ticket. Sécurité assurée.');
  const [placesDisponibles, setPlacesDisponibles] = useState(500);

  const [programme, setProgramme] = useState<EventProgramItem[]>([
    { heure: '18:00', titre: 'Accueil & Première partie', description: 'Ambiance musicale et installation.' },
    { heure: '20:00', titre: 'Grand Show en direct', description: 'Prestation principale des artistes.' },
  ]);

  const [isSuccess, setIsSuccess] = useState(false);

  if (!isAddEventOpen) return null;

  const handleAddProgramItem = () => {
    setProgramme((prev) => [
      ...prev,
      { heure: '21:00', titre: 'Nouvelle partie', description: 'Description du moment' },
    ]);
  };

  const handleRemoveProgramItem = (index: number) => {
    setProgramme((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProgramChange = (index: number, field: keyof EventProgramItem, value: string) => {
    setProgramme((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Find city coords
    const cityObj = CITIES_CI.find((c) => c.nom.toLowerCase() === ville.toLowerCase());
    const lat = cityObj ? cityObj.lat : 5.3599;
    const lng = cityObj ? cityObj.lng : -4.0083;

    addEvent({
      titre,
      affiche,
      categorie,
      description,
      date,
      jour,
      heure_debut: heureDebut,
      heure_fin: heureFin,
      lieu: lieu || `Espace Événementiel, ${commune}`,
      commune,
      ville,
      adresse: adresse || `${commune}, ${ville}`,
      latitude: lat,
      longitude: lng,
      prix: isGratuit ? 0 : prix,
      isGratuit,
      lienReservation,
      organisateur: {
        nom: nomOrganisateur || 'Comité d\'Organisation',
        telephone,
        whatsapp: whatsapp || telephone,
        email,
        siteWeb,
      },
      programme,
      artistes: artistesText
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean),
      conditionsAcces,
      placesDisponibles,
      placesTotales: placesDisponibles,
      galerie: [affiche],
    });

    setIsSuccess(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-4 border border-orange-100 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-700 p-5 sm:p-6 text-white relative shrink-0">
          <button
            onClick={() => setIsAddEventOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-xl sm:text-2xl font-black">
            Publier un événement sur ON CONNAÎT 🇨🇮
          </h2>
          <p className="text-xs sm:text-sm text-orange-100 mt-1 max-w-xl">
            Remplissez la fiche complète. Votre annonce sera vérifiée par notre équipe de modération avant sa mise en ligne publique.
          </p>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-12 h-12" />
              </div>

              <h3 className="text-2xl font-black text-slate-900">
                Événement soumis avec succès !
              </h3>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 max-w-md mx-auto text-xs text-amber-950 text-left space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-amber-800">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Modération ON CONNAÎT en cours</span>
                </div>
                <p>
                  Pour garantir la qualité et l'authenticité des sorties en Côte d'Ivoire, notre équipe valide chaque événement sous 2 à 4 heures.
                </p>
                <p className="font-semibold text-slate-700">
                  Vous pouvez suivre l'état de validation dans l'« Espace Organisateur » ou valider immédiatement en basculant sur le compte Admin.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setIsAddEventOpen(false);
                    setActiveTab('organizer');
                  }}
                  className="px-6 py-3 bg-orange-600 text-white font-black text-sm rounded-xl hover:bg-orange-700 transition-colors cursor-pointer"
                >
                  Voir dans mon Espace Organisateur &rarr;
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event basic info */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-orange-800 uppercase tracking-widest flex items-center gap-1.5">
                  <Tag className="w-4 h-4" />
                  <span>1. Informations Générales</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nom de l'événement *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: FEMUA 17, Concert Live Didi B, Salon Innovation..."
                    value={titre}
                    onChange={(e) => setTitre(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 focus:border-orange-500 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Catégorie *
                    </label>
                    <select
                      value={categorie}
                      onChange={(e: any) => setCategorie(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 focus:border-orange-500 rounded-xl focus:outline-none"
                    >
                      {EVENT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      URL de l'affiche / Photo principale
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={affiche}
                      onChange={(e) => setAffiche(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 focus:border-orange-500 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Description complète *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Présentez l'événement, les temps forts, l'ambiance attendue..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 focus:border-orange-500 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Date, Time & Location */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <h3 className="text-xs font-black text-orange-800 uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>2. Date, Horaires & Lieu</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 focus:border-orange-500 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Jour
                    </label>
                    <select
                      value={jour}
                      onChange={(e) => setJour(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 focus:border-orange-500 rounded-xl"
                    >
                      <option value="Lundi">Lundi</option>
                      <option value="Mardi">Mardi</option>
                      <option value="Mercredi">Mercredi</option>
                      <option value="Jeudi">Jeudi</option>
                      <option value="Vendredi">Vendredi</option>
                      <option value="Samedi">Samedi</option>
                      <option value="Dimanche">Dimanche</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Début *
                    </label>
                    <input
                      type="time"
                      required
                      value={heureDebut}
                      onChange={(e) => setHeureDebut(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 focus:border-orange-500 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Fin
                    </label>
                    <input
                      type="time"
                      value={heureFin}
                      onChange={(e) => setHeureFin(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 focus:border-orange-500 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Ville *
                    </label>
                    <select
                      value={ville}
                      onChange={(e) => setVille(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 focus:border-orange-500 rounded-xl"
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
                      required
                      placeholder="Ex: Cocody Angré"
                      value={commune}
                      onChange={(e) => setCommune(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 focus:border-orange-500 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nom du lieu de l'événement *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Palais de la Culture, Salle Anoumabo"
                      value={lieu}
                      onChange={(e) => setLieu(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 focus:border-orange-500 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Billetterie & Prix */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <h3 className="text-xs font-black text-orange-800 uppercase tracking-widest flex items-center gap-1.5">
                  <Ticket className="w-4 h-4" />
                  <span>3. Billetterie & Tarifs</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isGratuit"
                      checked={isGratuit}
                      onChange={(e) => setIsGratuit(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded-md focus:ring-emerald-500"
                    />
                    <label htmlFor="isGratuit" className="text-xs font-bold text-slate-800 cursor-pointer">
                      Entrée 100% Gratuite
                    </label>
                  </div>

                  {!isGratuit && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Prix du billet (FCFA)
                      </label>
                      <input
                        type="number"
                        value={prix}
                        onChange={(e) => setPrix(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Places disponibles
                    </label>
                    <input
                      type="number"
                      value={placesDisponibles}
                      onChange={(e) => setPlacesDisponibles(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lien de billetterie ou réservation en ligne (facultatif)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={lienReservation}
                    onChange={(e) => setLienReservation(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Artistes & Contacts */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <h3 className="text-xs font-black text-orange-800 uppercase tracking-widest">
                  4. Artistes & Contacts Organisateur
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Artistes / Intervenants (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Didi B, Roseline Layo, Magic System"
                    value={artistesText}
                    onChange={(e) => setArtistesText(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nom de l'organisateur *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Coast to Coast Productions"
                      value={nomOrganisateur}
                      onChange={(e) => setNomOrganisateur(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+225 07 00 00 00 00"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      WhatsApp direct
                    </label>
                    <input
                      type="tel"
                      placeholder="+225 07 00 00 00 00"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
                >
                  Envoyer l'événement pour validation &rarr;
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
