import { EventItem } from '../types';

export function generateIcsFile(event: EventItem): void {
  // Format date and time for ICS: YYYYMMDDTHHmmssZ
  const cleanDate = event.date.replace(/-/g, '');
  const startHourParts = (event.heure_debut || '12:00').split(':');
  const endHourParts = (event.heure_fin || '22:00').split(':');

  const startHour = (startHourParts[0] || '12').padStart(2, '0');
  const startMin = (startHourParts[1] || '00').padStart(2, '0');
  const endHour = (endHourParts[0] || '22').padStart(2, '0');
  const endMin = (endHourParts[1] || '00').padStart(2, '0');

  const dtStart = `${cleanDate}T${startHour}${startMin}00`;
  const dtEnd = `${cleanDate}T${endHour}${endMin}00`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ON CONNAIT CI//Events Agenda//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:onconnait-${event.id}-${Date.now()}@onconnait.ci`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${event.titre.replace(/,/g, '\\,')}`,
    `DESCRIPTION:${(event.description || '').replace(/\n/g, '\\n').replace(/,/g, '\\,')}`,
    `LOCATION:${(event.lieu + ', ' + event.commune + ', ' + event.ville + ' - Côte d\'Ivoire').replace(/,/g, '\\,')}`,
    `URL:${event.lienReservation || window.location.href}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `${event.titre.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function getGoogleCalendarUrl(event: EventItem): string {
  const cleanDate = event.date.replace(/-/g, '');
  const startHourParts = (event.heure_debut || '12:00').split(':');
  const endHourParts = (event.heure_fin || '22:00').split(':');

  const startHour = (startHourParts[0] || '12').padStart(2, '0');
  const startMin = (startHourParts[1] || '00').padStart(2, '0');
  const endHour = (endHourParts[0] || '22').padStart(2, '0');
  const endMin = (endHourParts[1] || '00').padStart(2, '0');

  const datesParam = `${cleanDate}T${startHour}${startMin}00/${cleanDate}T${endHour}${endMin}00`;
  const location = `${event.lieu}, ${event.commune}, ${event.ville}, Côte d'Ivoire`;

  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.set('action', 'TEMPLATE');
  url.searchParams.set('text', event.titre);
  url.searchParams.set('dates', datesParam);
  url.searchParams.set('details', `${event.description}\n\nOrganisé par: ${event.organisateur.nom} (${event.organisateur.telephone})\nRéservation: ${event.lienReservation || 'ON CONNAÎT 🇨🇮'}`);
  url.searchParams.set('location', location);

  return url.toString();
}
