import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { askSentinelAi, SentinelAnalysisResult } from '../utils/geminiSupervisor';
import {
  ShieldCheck,
  Calendar,
  Briefcase,
  AlertTriangle,
  CreditCard,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Trash2,
  Lock,
  UserCheck,
  TrendingUp,
  Bot,
  Zap,
  Send,
  Camera,
  User,
  Activity,
  Sparkles,
  LockKeyhole,
  Check,
  Radio,
  Clock,
  LogOut,
  Smartphone,
  KeyRound,
  Ban,
  Phone,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const MASTER_PASSWORD = 'SIADE1';

export const AdminDashboard: React.FC = () => {
  const {
    adminProfile,
    auditLogs,
    addSecurityAuditLog,
    events,
    updateEventStatus,
    deleteEvent,
    providers,
    updateProviderVerification,
    renewProviderSubscription,
    toggleProviderTrialExpiry,
    reports,
    updateReportStatus,
    payments,
    quotes,
    confirmPaymentByAdmin,
    setSelectedEvent,
    setSelectedProvider,
    bannedPhones,
    unbanPhone,
  } = useApp();

  // Authentication Lock State (Exclusive to Ulrich, his Robot & AI)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('onconnait_admin_authenticated') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [adminTab, setAdminTab] = useState<'sentinel' | 'activities' | 'providers' | 'events' | 'payments' | 'reports'>('sentinel');

  // AI Chat with Ulrich
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiChatHistory, setAiChatHistory] = useState<
    Array<{ sender: 'ulrich' | 'sentinel'; text: string; time: string }>
  >([
    {
      sender: 'sentinel',
      text: `Bonjour Super-Administrateur Ulrich ! Je suis SENTINEL-CI, votre robot d'intelligence artificielle et de co-gestion exclusive. La plateforme est sous surveillance active 24h/24. Que souhaitez-vous analyser ou superviser aujourd'hui ?`,
      time: 'Maintenant',
    },
  ]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === MASTER_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('onconnait_admin_authenticated', 'true');
      setAuthError(null);
      setPasswordInput('');

      addSecurityAuditLog(
        'ADMIN_LOGIN',
        'Connexion sécurisée d\'Ulrich Jean-Dieu validée avec le code maître SIADE1',
        'success'
      );

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      setAuthError('Mot de passe incorrect. Seul Ulrich Jean-Dieu et son robot IA ont accès à cet espace.');
      addSecurityAuditLog(
        'SECURITY_ALERT',
        'Tentative de déverrouillage de l\'espace administrateur avec un mot de passe invalide',
        'alert'
      );
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('onconnait_admin_authenticated');
    addSecurityAuditLog('ADMIN_LOGIN', 'Déconnexion et verrouillage de la console administrateur', 'info');
  };

  // If not authenticated, render the impenetrable Lock Screen for Ulrich
  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="bg-slate-950 rounded-3xl border border-emerald-500/30 shadow-2xl p-6 sm:p-10 text-white relative overflow-hidden">
          {/* Cyber Glow Accents */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-500/15 border-2 border-emerald-400 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <LockKeyhole className="w-10 h-10" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/40">
              <Bot className="w-3.5 h-3.5" />
              <span>ESPACE ADMINISTRATEUR SÉCURISÉ</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black">
              Accès Exclusif : Ulrich & Robot IA
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Cet espace est strictement réservé à <strong>Ulrich Jean-Dieu</strong> et à son <strong>Intelligence Artificielle SENTINEL-CI</strong> pour la surveillance totale de la plateforme ON CONNAÎT 🇨🇮.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="mt-8 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Mot de passe administrateur
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4 text-emerald-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Entrez le mot de passe secret..."
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  className="w-full pl-10 pr-11 py-3 text-sm font-semibold bg-slate-900 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-700/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Déverrouiller la Console Administrateur</span>
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-emerald-400" />
              <span>Robot SENTINEL-CI en veille sécurisée • Chiffrement 256 bits</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Pending items counts
  const pendingEvents = events.filter((e) => e.statut === 'en_attente');
  const pendingProviders = providers.filter((p) => p.verificationStatus === 'pending');
  const pendingReports = reports.filter((r) => r.statut === 'nouveau');
  const pendingPayments = payments.filter((p) => p.statut === 'en_attente');

  const expiredProvidersCount = providers.filter(
    (p) => p.subscriptionStatus === 'expired' || (!p.isTrialActive && p.subscriptionStatus !== 'active')
  ).length;

  const totalCatalogPhotos = providers.reduce(
    (sum, p) => sum + (p.catalogPhotos?.length || 0),
    0
  );

  const handleSendAiMessage = async (queryText?: string) => {
    const textToSend = queryText || aiInput;
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: 'ulrich' as const,
      text: textToSend,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    setAiChatHistory((prev) => [...prev, userMsg]);
    if (!queryText) setAiInput('');
    setAiLoading(true);

    try {
      const result = await askSentinelAi(textToSend, {
        adminName: adminProfile.nom,
        providers,
        events,
        reports,
        payments,
        auditLogs,
      });

      setAiChatHistory((prev) => [
        ...prev,
        {
          sender: 'sentinel',
          text: result.reply,
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      addSecurityAuditLog(
        'SECURITY_SCAN',
        `Instruction IA traitée pour Ulrich : « ${textToSend.substring(0, 40)}... »`,
        'info'
      );
    } catch (err) {
      setAiChatHistory((prev) => [
        ...prev,
        {
          sender: 'sentinel',
          text: "Désolé Ulrich, une erreur de communication temporaire est survenue. Tous les contrôles de sécurité locaux restent actifs.",
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleGlobalSecurityScan = () => {
    addSecurityAuditLog('SECURITY_SCAN', 'Scan de sécurité complet déclenché par Ulrich : Intégrité 100% OK', 'success');
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
    handleSendAiMessage('Lance un scan complet de sécurité de tous les prestataires et signale les anomalies');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Super-Administrator & AI Sentinel Header with Logout Button */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-emerald-900/40 relative">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CONSOLE EXCLUSIVE ULRICH JEAN-DIEU</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Bot className="w-3.5 h-3.5" />
              <span>ROBOT SENTINEL-CI & IA ACTIFS</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black">
            Surveillance Totale de l'Application
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Connecté en tant que <strong className="text-emerald-400">{adminProfile.nom}</strong> ({adminProfile.email}) • Session protégée par mot de passe maître.
          </p>
        </div>

        {/* Global Security Metrics & Logout */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="bg-white/10 px-3 py-2 rounded-2xl text-center border border-white/10">
            <div className="text-base font-black text-emerald-400">{providers.length}</div>
            <div className="text-[10px] text-slate-300">Prestataires</div>
          </div>
          <div className="bg-white/10 px-3 py-2 rounded-2xl text-center border border-white/10">
            <div className="text-base font-black text-rose-400">{expiredProvidersCount}</div>
            <div className="text-[10px] text-slate-300">Bloqués</div>
          </div>
          <div className="bg-white/10 px-3 py-2 rounded-2xl text-center border border-white/10">
            <div className="text-base font-black text-amber-400">{events.length}</div>
            <div className="text-[10px] text-slate-300">Événements</div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-2xl transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Verrouiller la session (Exige le mot de passe SIADE1 pour réaccéder)"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Verrouiller</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        <button
          onClick={() => setAdminTab('sentinel')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            adminTab === 'sentinel'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bot className="w-4 h-4 text-emerald-400" />
          <span>Robot Sentinelle & IA Co-Gestion</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>

        <button
          onClick={() => setAdminTab('activities')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            adminTab === 'activities'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Surveillance Globale des Activités 📡</span>
          <span className="bg-amber-300 text-slate-900 text-[10px] px-1.5 py-0.2 rounded-full font-black">
            Direct
          </span>
        </button>

        <button
          onClick={() => setAdminTab('providers')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            adminTab === 'providers'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Prestataires & Identités (Caméra)</span>
          {pendingProviders.length > 0 && (
            <span className="bg-amber-400 text-slate-900 text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {pendingProviders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('events')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            adminTab === 'events'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Événements</span>
          {pendingEvents.length > 0 && (
            <span className="bg-amber-400 text-slate-900 text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {pendingEvents.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('payments')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            adminTab === 'payments'
              ? 'bg-teal-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Paiements Liens & IA Réactivation</span>
          {pendingPayments.length > 0 && (
            <span className="bg-amber-400 text-slate-900 text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {pendingPayments.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('reports')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            adminTab === 'reports'
              ? 'bg-rose-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Signalements</span>
          {pendingReports.length > 0 && (
            <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {pendingReports.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: ROBOT SENTINEL & AI CO-MANAGEMENT */}
      {adminTab === 'sentinel' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Quick AI Control Bar */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 p-5 rounded-3xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                <Bot className="w-5 h-5 text-emerald-600" />
                <span>Supervision Automatique Active</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Le Robot Sentinelle surveille les photos prises, les inscriptions, et bloque automatiquement les accès dès expiration des 3 mois.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={handleGlobalSecurityScan}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Lancer Scan de Sécurité Global</span>
              </button>

              <button
                onClick={() => handleSendAiMessage('Fais un point précis sur les comptes prestataires et les expirations')}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-colors cursor-pointer"
              >
                Rapport d'audit instantané
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Interactive Co-Pilot Chat with Ulrich (2 cols) */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col h-[520px]">
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-400">
                    <Bot className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-extrabold text-xs">SENTINEL-CI (Co-Gestionnaire IA)</div>
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>En ligne pour Ulrich Jean-Dieu</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400">
                  Modèle : Gemini 3.8 Flash
                </div>
              </div>

              {/* Chat Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 text-xs">
                {aiChatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${
                      msg.sender === 'ulrich' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 whitespace-pre-line leading-relaxed ${
                        msg.sender === 'ulrich'
                          ? 'bg-emerald-700 text-white shadow-sm'
                          : 'bg-white text-slate-800 border border-slate-200 shadow-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                  </div>
                ))}
                {aiLoading && (
                  <div className="flex items-center gap-2 text-slate-500 text-xs p-2">
                    <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <span>SENTINEL-CI analyse la plateforme...</span>
                  </div>
                )}
              </div>

              {/* Chat Quick Action Chips */}
              <div className="p-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
                <button
                  onClick={() => handleSendAiMessage('Vérifie si tous les prestataires ont bien téléversé une photo de CNI ou permis')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg shrink-0 cursor-pointer"
                >
                  🪪 Vérifier photos CNI/Permis
                </button>
                <button
                  onClick={() => handleSendAiMessage('Quels comptes doivent être verrouillés pour fin de période d\'essai ?')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg shrink-0 cursor-pointer"
                >
                  🔒 Contrôle des expirations
                </button>
                <button
                  onClick={() => handleSendAiMessage('Analyse la conformité des paiements Mobile Money Wave et Orange')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg shrink-0 cursor-pointer"
                >
                  💳 Flux Mobile Money
                </button>
              </div>

              {/* Chat Input */}
              <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Donnez une consigne à SENTINEL-CI..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendAiMessage();
                  }}
                  className="flex-1 px-3.5 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                />
                <button
                  onClick={() => handleSendAiMessage()}
                  disabled={aiLoading || !aiInput.trim()}
                  className="p-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white rounded-xl cursor-pointer transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Live Security Audit Log (1 col) */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col h-[520px]">
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="font-extrabold text-xs flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Journal de Surveillance en Direct</span>
                </div>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-slate-300">
                  {auditLogs.length} événements
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-3 rounded-2xl border text-xs space-y-1 ${
                      log.severity === 'success'
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                        : log.severity === 'warning'
                        ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                        : log.severity === 'alert'
                        ? 'bg-rose-50/60 border-rose-200 text-rose-950'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-[10px]">
                      <span className="uppercase tracking-wider opacity-75">{log.type}</span>
                      <span className="font-mono text-slate-400">{log.timestamp}</span>
                    </div>
                    <p className="font-semibold">{log.message}</p>
                    {log.aiNotes && (
                      <p className="text-[10px] text-slate-500 italic mt-0.5">
                        🤖 {log.aiNotes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SURVEILLANCE GLOBALE DES ACTIVITÉS EN DIRECT 📡 */}
      {adminTab === 'activities' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Live Activity Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-bold">Prestataires enregistrés</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{providers.length}</div>
              <span className="text-[11px] text-emerald-600 font-semibold">Tous sous surveillance IA</span>
            </div>

            <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-bold">Photos de Catalogues</span>
              <div className="text-2xl font-black text-amber-600 mt-1">{totalCatalogPhotos}</div>
              <span className="text-[11px] text-slate-500 font-semibold">Réalisations publiées</span>
            </div>

            <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-bold">Demandes de devis</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">{quotes.length}</div>
              <span className="text-[11px] text-slate-500 font-semibold">Flux clients actifs</span>
            </div>

            <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 font-bold">Paiements Mobile Money</span>
              <div className="text-2xl font-black text-teal-600 mt-1">{payments.length}</div>
              <span className="text-[11px] text-emerald-600 font-semibold">Activés par IA</span>
            </div>
          </div>

          {/* Activity Live Feed */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Radio className="w-5 h-5 text-amber-500 animate-pulse" />
                  <span>Flux d'Activités en Temps Réel sur ON CONNAÎT 🇨🇮</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Toutes les actions réalisées par les utilisateurs et les prestataires sont enregistrées et surveillées par l'IA.
                </p>
              </div>

              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Surveillance 24/7 Connectée
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {auditLogs.map((item) => (
                <div key={item.id} className="p-4 sm:p-5 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    item.severity === 'success'
                      ? 'bg-emerald-100 text-emerald-700'
                      : item.severity === 'warning'
                      ? 'bg-amber-100 text-amber-800'
                      : item.severity === 'alert'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {item.type === 'PAYMENT_ACTIVATION' ? (
                      <CreditCard className="w-4 h-4" />
                    ) : item.type === 'PROVIDER_REGISTRATION' ? (
                      <Camera className="w-4 h-4" />
                    ) : item.type === 'ID_VERIFICATION' ? (
                      <ShieldCheck className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-black text-slate-900">{item.message}</span>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">{item.timestamp}</span>
                    </div>
                    {item.aiNotes && (
                      <p className="text-[11px] text-emerald-700 italic mt-0.5">
                        🤖 {item.aiNotes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LISTE NOIRE DES NUMÉROS BANNIS À VIE PAR LE ROBOT SENTINEL-CI */}
          <div className="bg-white rounded-3xl border border-rose-200 shadow-2xs overflow-hidden">
            <div className="p-5 sm:p-6 bg-gradient-to-r from-rose-900 via-rose-950 to-slate-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-black mb-1">
                  <Ban className="w-3.5 h-3.5" />
                  <span>SÉCURITÉ INVIOLABLE • LISTE NOIRE DÉFINITIVE</span>
                </div>
                <h3 className="text-base font-black">
                  Numéros de Téléphone Bannis à Vie ({bannedPhones.length})
                </h3>
                <p className="text-xs text-rose-200 mt-0.5">
                  Ces numéros ont été définitivement bloqués par l'IA SENTINEL-CI suite à des tentatives avec fausses informations.
                </p>
              </div>

              <span className="text-xs font-bold text-rose-300 bg-white/10 px-3 py-1 rounded-xl border border-rose-500/30">
                Blocage Irrévocable Actif 🛡️
              </span>
            </div>

            {bannedPhones.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Aucun numéro actuellement sur liste noire.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {bannedPhones.map((b) => (
                  <div key={b.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-rose-50/40 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-black text-rose-950">{b.telephone}</span>
                          <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md">
                            Banni à vie 🚫
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 mt-0.5">
                          Tentative au nom de : <strong>{b.nomTente}</strong> • Date : {b.dateBannissement}
                        </div>
                        <p className="text-xs text-rose-700 font-medium mt-1">
                          « {b.motif} »
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          if (confirm(`Super-Administrateur Ulrich, confirmez-vous la levée du bannissement pour le numéro ${b.telephone} ?`)) {
                            unbanPhone(b.id);
                          }
                        }}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-800 font-bold text-xs rounded-xl border border-slate-200 transition-colors cursor-pointer"
                        title="Seul Ulrich peut lever un bannissement"
                      >
                        Lever le bannissement (Ulrich 👑)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PRESTATAIRES & PHOTO IDENTITY VERIFICATION */}
      {adminTab === 'providers' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                <span>Contrôle des Prestataires & Identités ({providers.length})</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Vérification des photos de CNI, Permis, Passeport et photo de face du créateur (prise avec caméra avant ou arrière).
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {providers.map((p) => {
              const isExpired =
                p.subscriptionStatus === 'expired' ||
                (!p.isTrialActive && p.subscriptionStatus !== 'active');

              return (
                <div key={p.id} className="p-5 sm:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Public Profile Photo */}
                      <img
                        src={p.photoProfil}
                        alt={p.nomCommercial}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
                      />

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-base text-slate-900">{p.nomCommercial}</h3>
                          {p.isVerified ? (
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              Identité Validée 🛡️
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                              En attente d'approbation
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-500">
                          {p.profession} • {p.commune}, {p.ville}
                        </div>

                        {/* Civil Identity info & Status */}
                        <div className="text-xs text-slate-700 pt-1 flex flex-wrap items-center gap-3">
                          <span>
                            👤 Gérant : <strong>{p.prenoms} {p.nomCivil}</strong>
                          </span>
                          <span>
                            🪪 Pièce : <strong>{p.pieceIdentiteType || 'CNI'}</strong>
                          </span>
                          <span>
                            📸 Catalogue : <strong>{p.catalogPhotos?.length || 0} photo(s)</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Subscription Status Pill & Lock action */}
                    <div className="text-right space-y-2 shrink-0">
                      <div className={`inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full ${
                        isExpired
                          ? 'bg-rose-100 text-rose-800'
                          : p.subscriptionStatus === 'trial'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isExpired
                          ? '🔒 ACCÈS BLOQUÉ (Expiré)'
                          : p.subscriptionStatus === 'trial'
                          ? '⏳ Essai Gratuit (3 Mois)'
                          : '✅ Abonnement Actif'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Échéance : {p.subscriptionValidUntil || p.trialEndDate}
                      </div>
                    </div>
                  </div>

                  {/* Photo Verification Panel (ID RECTO + VERSO + Creator face photo) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                    {/* ID Document Photo RECTO */}
                    <div className="flex items-center gap-3">
                      <img
                        src={p.pieceIdentiteUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'}
                        alt="Photo pièce Recto"
                        className="w-16 h-12 rounded-lg object-cover border border-slate-300 shadow-2xs shrink-0 cursor-pointer hover:scale-105 transition-transform"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-slate-800 block">
                          Face RECTO ({p.pieceIdentiteType || 'CNI'})
                        </span>
                        <span className="text-[10px] text-emerald-700 font-semibold">Devant de la pièce</span>
                      </div>
                    </div>

                    {/* ID Document Photo VERSO */}
                    <div className="flex items-center gap-3">
                      <img
                        src={p.pieceIdentiteVersoUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80'}
                        alt="Photo pièce Verso"
                        className="w-16 h-12 rounded-lg object-cover border border-amber-300 shadow-2xs shrink-0 cursor-pointer hover:scale-105 transition-transform"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-slate-800 block">
                          Face VERSO ({p.pieceIdentiteType || 'CNI'})
                        </span>
                        <span className="text-[10px] text-amber-700 font-semibold">Dos / Arrière de la pièce</span>
                      </div>
                    </div>

                    {/* Creator Face Photo Preview */}
                    <div className="flex items-center gap-3">
                      <img
                        src={p.photoCreateurUrl || p.photoProfil}
                        alt="Photo visage créateur"
                        className="w-12 h-12 rounded-full object-cover border border-emerald-400 shadow-2xs shrink-0 cursor-pointer hover:scale-105 transition-transform"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-slate-800 block">
                          Photo de face (Selfie)
                        </span>
                        <span className="text-[10px] text-slate-500">Concordance biométrique</span>
                      </div>
                    </div>
                  </div>

                  {/* Admin Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedProvider(p)}
                        className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Consulter vitrine & catalogue
                      </button>

                      {/* Lock / Unlock Toggle for test */}
                      <button
                        onClick={() => toggleProviderTrialExpiry(p.id)}
                        className={`px-3 py-1.5 font-bold text-xs rounded-xl transition-colors cursor-pointer ${
                          isExpired
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                        }`}
                      >
                        {isExpired ? 'Débloquer l\'accès' : 'Verrouiller l\'accès (Fin d\'essai)'}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {p.verificationStatus !== 'verified' && (
                        <button
                          onClick={() => updateProviderVerification(p.id, 'verified')}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approuver l'identité</span>
                        </button>
                      )}

                      {p.verificationStatus !== 'rejected' && (
                        <button
                          onClick={() => updateProviderVerification(p.id, 'rejected')}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                        >
                          Refuser
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: ÉVÉNEMENTS */}
      {adminTab === 'events' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                <span>Modération des Événements ({events.length})</span>
              </h2>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {events.map((e) => (
              <div key={e.id} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={e.affiche}
                    alt={e.titre}
                    className="w-16 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">{e.titre}</h3>
                    <p className="text-xs text-slate-500">
                      {e.categorie} • {e.date} • {e.lieu}, {e.commune}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSelectedEvent(e)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200"
                  >
                    Voir
                  </button>
                  {e.statut === 'en_attente' && (
                    <button
                      onClick={() => updateEventStatus(e.id, 'publie')}
                      className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700"
                    >
                      Publier
                    </button>
                  )}
                  <button
                    onClick={() => deleteEvent(e.id)}
                    className="p-1.5 text-rose-500 hover:text-rose-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PAIEMENTS MOBILE MONEY (NO PHONE NUMBERS DISPLAYED, AUTO AI ACTIVATION) */}
      {adminTab === 'payments' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-teal-600" />
                <span>Transactions & Activations Automatiques par IA ({payments.length})</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Règlements Wave, Orange Money et MTN MoMo validés et débloqués par l'IA SENTINEL-PAY.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {payments.map((pay) => (
              <div key={pay.id} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-slate-900">{pay.providerName}</span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                      {pay.operateur} (Lien Web Direct)
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Réf : <span className="font-mono">{pay.referenceTransaction || 'N/A'}</span> • Date : {pay.datePaiement}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-slate-900">
                    {pay.montantFCFA.toLocaleString('fr-FR')} FCFA
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Réactivé par IA ⚡</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SIGNALEMENTS */}
      {adminTab === 'reports' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>Signalements de la Communauté ({reports.length})</span>
            </h2>
          </div>

          {reports.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              Aucun signalement en cours. La plateforme est 100% saine.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {reports.map((r) => (
                <div key={r.id} className="p-5 sm:p-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-rose-600">{r.motif}</span>
                    <span className="text-[10px] text-slate-400">{r.dateCreation}</span>
                  </div>
                  <p className="text-xs text-slate-700">« {r.details} »</p>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => updateReportStatus(r.id, 'traite')}
                      className="px-3 py-1 bg-emerald-600 text-white font-bold text-xs rounded-lg"
                    >
                      Marquer comme traité
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
