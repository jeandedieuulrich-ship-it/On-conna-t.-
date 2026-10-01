import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  Calendar,
  Briefcase,
  MapPin,
  Map,
  ShieldCheck,
  User,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, t, events, providers, reports, userRole } = useApp();

  const totalAdminAlerts =
    events.filter((e) => e.statut === 'en_attente').length +
    providers.filter((p) => p.verificationStatus === 'pending').length +
    reports.filter((r) => r.statut === 'nouveau').length;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg cursor-pointer ${
            activeTab === 'home' ? 'text-orange-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Accueil</span>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg cursor-pointer ${
            activeTab === 'events' ? 'text-orange-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{t('tabEvents')}</span>
        </button>

        <button
          onClick={() => setActiveTab('near-me')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg relative cursor-pointer ${
            activeTab === 'near-me' ? 'text-emerald-600 font-bold' : 'text-slate-500'
          }`}
        >
          <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <MapPin className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{t('tabNearMe')}</span>
        </button>

        <button
          onClick={() => setActiveTab('providers')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg cursor-pointer ${
            activeTab === 'providers' ? 'text-orange-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Briefcase className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{t('tabProviders')}</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg cursor-pointer ${
            activeTab === 'map' ? 'text-orange-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Map className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{t('tabMap')}</span>
        </button>

        <button
          onClick={() => {
            if (userRole === 'admin') setActiveTab('admin');
            else if (userRole === 'provider') setActiveTab('provider-hub');
            else setActiveTab('organizer');
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-lg relative cursor-pointer ${
            ['admin', 'organizer', 'provider-hub'].includes(activeTab)
              ? 'text-slate-900 font-bold'
              : 'text-slate-500'
          }`}
        >
          {userRole === 'admin' ? (
            <>
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              {totalAdminAlerts > 0 && (
                <span className="absolute top-0 right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalAdminAlerts}
                </span>
              )}
              <span className="text-[10px] mt-0.5">Admin</span>
            </>
          ) : (
            <>
              <User className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Mon Espace</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
