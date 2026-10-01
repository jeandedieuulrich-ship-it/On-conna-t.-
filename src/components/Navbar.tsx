import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Briefcase,
  MapPin,
  Map,
  ShieldCheck,
  PlusCircle,
  Sparkles,
  Globe,
  UserCheck,
  Heart,
  Scale,
  Share2,
  Check,
} from 'lucide-react';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    t,
    activeTab,
    setActiveTab,
    userRole,
    setUserRole,
    setIsAddEventOpen,
    setIsRegisterProviderOpen,
    setIsLegalModalOpen,
    setIsShareModalOpen,
    events,
    providers,
    reports,
  } = useApp();

  const handleShareApp = () => {
    setIsShareModalOpen(true);
  };

  const pendingEventsCount = events.filter((e) => e.statut === 'en_attente').length;
  const pendingProvidersCount = providers.filter((p) => p.verificationStatus === 'pending').length;
  const pendingReportsCount = reports.filter((r) => r.statut === 'nouveau').length;
  const totalAdminAlerts = pendingEventsCount + pendingProvidersCount + pendingReportsCount;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-xs">
      {/* Top cultural notice banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-emerald-600 text-white text-xs font-semibold py-1.5 px-4 text-center flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-2">
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-[11px] font-bold">🇨🇮 AKWABA !</span>
          <span>Le portail officiel des sorties, galas & prestataires de Côte d'Ivoire</span>
        </div>
        <div className="mx-auto sm:mx-0 flex items-center gap-3">
          <span className="bg-emerald-950/40 px-2.5 py-0.5 rounded-full text-[11px] text-amber-200 font-bold flex items-center gap-1.5 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            {t('freeTrialBanner')}
          </span>
          <button
            onClick={() => setIsLegalModalOpen(true)}
            className="hidden md:flex items-center gap-1 text-[11px] underline opacity-90 hover:opacity-100 cursor-pointer"
          >
            <Scale className="w-3 h-3" />
            Loi n°2013-450 / ARTCI
          </button>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[11px] text-orange-100 font-medium">Abidjan • Yamoussoukro • Bouaké • Bassam</span>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Slogan */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-emerald-600 p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center overflow-hidden">
                <span className="text-2xl font-black tracking-tighter text-orange-600">
                  ON
                </span>
              </div>
              <span className="absolute -bottom-1 -right-1 text-xs">🇨🇮</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-700 bg-clip-text text-transparent">
                  ON CONNAÎT
                </span>
                <span className="text-xs bg-orange-100 text-orange-800 font-bold px-1.5 py-0.5 rounded-sm">
                  CI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Tout ce qui se passe en Côte d'Ivoire
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-orange-50 text-orange-700'
                  : 'text-slate-700 hover:text-orange-600 hover:bg-slate-50'
              }`}
            >
              Accueil
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'events'
                  ? 'bg-orange-50 text-orange-700 font-bold'
                  : 'text-slate-700 hover:text-orange-600 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-4 h-4 text-orange-500" />
              {t('tabEvents')}
            </button>

            <button
              onClick={() => setActiveTab('providers')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'providers'
                  ? 'bg-orange-50 text-orange-700 font-bold'
                  : 'text-slate-700 hover:text-orange-600 hover:bg-slate-50'
              }`}
            >
              <Briefcase className="w-4 h-4 text-emerald-600" />
              {t('tabProviders')}
            </button>

            <button
              onClick={() => setActiveTab('near-me')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 relative ${
                activeTab === 'near-me'
                  ? 'bg-emerald-50 text-emerald-700 font-bold'
                  : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <MapPin className="w-4 h-4 text-emerald-600" />
              {t('tabNearMe')}
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'map'
                  ? 'bg-orange-50 text-orange-700 font-bold'
                  : 'text-slate-700 hover:text-orange-600 hover:bg-slate-50'
              }`}
            >
              <Map className="w-4 h-4 text-amber-500" />
              {t('tabMap')}
            </button>

            <button
              onClick={() => setActiveTab('organizer')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'organizer'
                  ? 'bg-orange-50 text-orange-700 font-bold'
                  : 'text-slate-700 hover:text-orange-600 hover:bg-slate-50'
              }`}
            >
              {t('tabOrganizer')}
            </button>

            <button
              onClick={() => setActiveTab('provider-hub')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center gap-1 relative ${
                activeTab === 'provider-hub'
                  ? 'bg-emerald-50 text-emerald-700 font-bold'
                  : 'text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              {t('tabPro')}
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded-full">
                3 mois off.
              </span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 relative ${
                activeTab === 'admin'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Admin</span>
              {totalAdminAlerts > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {totalAdminAlerts}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Share App Button */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-2xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 hover:border-emerald-400 active:scale-95"
              title="Partager l'application ON CONNAÎT"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Partager</span>
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setLanguage('fr')}
                className={`px-2 py-1 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                  language === 'fr'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Passer en Français"
              >
                <span>🇫🇷</span>
                <span>FR</span>
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                  language === 'en'
                    ? 'bg-white text-orange-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Switch to English"
              >
                <span>🇬🇧</span>
                <span>EN</span>
              </button>
            </div>

            {/* Role Switcher Pill for easy testing of multi-roles */}
            <div className="hidden xl:flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg">
              <UserCheck className="w-3.5 h-3.5 text-amber-700" />
              <span className="text-xs text-amber-900 font-medium">Vue :</span>
              <select
                value={userRole}
                onChange={(e) => {
                  const role = e.target.value as UserRole;
                  setUserRole(role);
                  if (role === 'organizer') setActiveTab('organizer');
                  else if (role === 'provider') setActiveTab('provider-hub');
                  else if (role === 'admin') setActiveTab('admin');
                }}
                className="text-xs font-bold text-amber-900 bg-transparent border-0 cursor-pointer focus:outline-none"
              >
                <option value="visitor">Visiteur</option>
                <option value="organizer">Organisateur</option>
                <option value="provider">Prestataire</option>
                <option value="admin">Admin ON CONNAÎT</option>
              </select>
            </div>

            {/* Quick Post Event CTA */}
            <button
              onClick={() => setIsAddEventOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer hover:shadow-orange-500/20 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('addEvent')}</span>
            </button>

            {/* Become Provider CTA */}
            <button
              onClick={() => setIsRegisterProviderOpen(true)}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-3 sm:px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer hover:shadow-emerald-600/20 active:scale-95"
            >
              <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t('becomeProvider')}</span>
              <span className="sm:hidden">Devenir Pro</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
