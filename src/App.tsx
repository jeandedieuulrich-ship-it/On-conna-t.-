import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HomeView } from './components/HomeView';
import { EventsView } from './components/EventsView';
import { ProvidersView } from './components/ProvidersView';
import { NearMeView } from './components/NearMeView';
import { InteractiveMapCI } from './components/InteractiveMapCI';
import { OrganizerDashboard } from './components/OrganizerDashboard';
import { ProviderDashboard } from './components/ProviderDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { EventDetailModal } from './components/EventDetailModal';
import { ProviderDetailModal } from './components/ProviderDetailModal';
import { AddEventModal } from './components/AddEventModal';
import { ProviderRegisterModal } from './components/ProviderRegisterModal';
import { PaymentModal } from './components/PaymentModal';
import { QuoteModal } from './components/QuoteModal';
import { ReportModal } from './components/ReportModal';
import { LegalDataPrivacyModal } from './components/LegalDataPrivacyModal';
import { ShareAppModal } from './components/ShareAppModal';
import { Footer } from './components/Footer';

const MainLayout: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedEvent,
    setSelectedEvent,
    selectedProvider,
    setSelectedProvider,
  } = useApp();

  // Search parameters passed from HomeHero
  const [searchParams, setSearchParams] = useState<{
    what: string;
    where: string;
    when: string;
    type: 'events' | 'providers' | 'all';
  }>({
    what: '',
    where: '',
    when: '',
    type: 'all',
  });

  const handleHeroSearchSubmit = (params: {
    what: string;
    where: string;
    when: string;
    type: 'events' | 'providers' | 'all';
  }) => {
    setSearchParams(params);
    if (params.type === 'providers') {
      setActiveTab('providers');
    } else {
      setActiveTab('events');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-slate-900 selection:bg-orange-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Area based on activeTab */}
      <main className="flex-1">
        {activeTab === 'home' && <HomeView onSearchSubmit={handleHeroSearchSubmit} />}

        {activeTab === 'events' && (
          <EventsView
            initialSearchQuery={searchParams.what}
            initialWhere={searchParams.where}
            initialWhen={searchParams.when}
          />
        )}

        {activeTab === 'providers' && (
          <ProvidersView
            initialSearchQuery={searchParams.what}
            initialWhere={searchParams.where}
            initialProfession={searchParams.what}
          />
        )}

        {activeTab === 'near-me' && <NearMeView />}

        {activeTab === 'map' && <InteractiveMapCI />}

        {activeTab === 'organizer' && <OrganizerDashboard />}

        {activeTab === 'provider-hub' && <ProviderDashboard />}

        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Modals */}
      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      <ProviderDetailModal
        provider={selectedProvider}
        onClose={() => setSelectedProvider(null)}
      />

      <AddEventModal />
      <ProviderRegisterModal />
      <PaymentModal />
      <QuoteModal />
      <ReportModal />
      <LegalDataPrivacyModal />
      <ShareAppModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
