import React, { createContext, useContext, useState, useEffect } from 'react';

// Available languages
export type Language = 'en' | 'es' | 'fr' | 'de' | 'ja';

// Language names for display
export const languageNames: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ja: '日本語'
};

// Sample translations for demonstration
export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Sidebar Menu
    dashboard: 'Dashboard',
    passwordVault: 'Password Vault',
    authentication: 'Authentication',
    securityStatus: 'Security Status',
    blockchainVerify: 'Blockchain Verify',
    securityVerification: 'Security Verification',
    notifications: 'Notifications',
    settings: 'Settings',
    signOut: 'Sign Out',
    protected: 'Protected',
    lastScan: 'Last scan',
    
    // Dashboard
    welcomeBack: 'Welcome back',
    securityDashboard: 'Your security dashboard',
    lastUpdated: 'last updated',
    runSecurityScan: 'Run Security Scan',
    securityScore: 'Security Score',
    vulnerableAccounts: 'Vulnerable Accounts',
    reusedPasswords: 'Reused Passwords',
    totalPasswords: 'Total Passwords',
    weakPasswords: 'Weak Passwords',
    passwordUpdated: 'Password Updated',
    openVault: 'Open Vault',
    accountType: 'Account Type',
    email: 'Email',
    phone: 'Phone',
    notAdded: 'Not added',
    accountSettings: 'Account Settings',
    recentSecurityEvents: 'Recent Security Events',
    viewAll: 'View All',
    noRecentEvents: 'No recent events',
    manage: 'Manage',
    enabled: 'Enabled',
    disabled: 'Disabled',
    
    // Search
    search: 'Search...',
    profileSettings: 'Profile Settings',
    
    // Page titles
    settingsTitle: 'Settings',
    settingsSubtitle: 'Manage your account and application preferences',
    
    // Account Settings
    changePfp: 'Change Profile Photo',
    name: 'Name',
    saveChanges: 'Save Changes',
    
    // Security Settings
    securitySettings: 'Security Settings',
    changePassword: 'Change Password',
    lastChanged: 'Last changed',
    update: 'Update',
    twoFactor: 'Two-Factor Authentication',
    twoFactorDesc: 'Add an extra layer of security',
    biometric: 'Biometric Authentication',
    biometricDesc: 'Use fingerprint or face recognition',
    autoLock: 'Auto-Lock Vault',
    autoLockDesc: 'Lock after period of inactivity',
    loginAlerts: 'Login Alerts',
    loginAlertsDesc: 'Get notified about login attempts',
    
    // Data Management
    dataManagement: 'Data Management',
    exportData: 'Export Data',
    exportDesc: 'Download all your passwords and data',
    export: 'Export',
    syncFrequency: 'Sync Frequency',
    syncDesc: 'How often to sync with the cloud',
    clearData: 'Clear All Data',
    clearDataDesc: 'Remove all personal data from app',
    
    // Application Settings
    applicationSettings: 'Application Settings',
    themeMode: 'Theme Mode',
    language: 'Language',
    
    // Connected Devices
    connectedDevices: 'Connected Devices',
    currentDevice: 'Current device',
    lastActive: 'Last active',
    remove: 'Remove',
    active: 'Active',
    
    // Account Management
    accountManagement: 'Account Management',
    premiumPlan: 'Premium Plan',
    planRenews: 'Your plan renews on Aug 12, 2025',
    manageSubscription: 'Manage Subscription',
    deleteAccount: 'Delete Account',
    
    // Delete Dialog
    deleteConfirm: 'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.',
    cancel: 'Cancel',
    
    // Time units
    minute: 'minute',
    minutes: 'minutes',
    hour: 'hour',
    never: 'Never',
    
    // Sync options
    automatic: 'Automatic',
    manual: 'Manual',
    every: 'Every'
  },
  es: {
    // Sidebar Menu
    dashboard: 'Panel Principal',
    passwordVault: 'Bóveda de Contraseñas',
    authentication: 'Autenticación',
    securityStatus: 'Estado de Seguridad',
    blockchainVerify: 'Verificación Blockchain',
    securityVerification: 'Verificación de Seguridad',
    notifications: 'Notificaciones',
    settings: 'Configuración',
    signOut: 'Cerrar Sesión',
    protected: 'Protegido',
    lastScan: 'Último escaneo',
    
    // Dashboard
    welcomeBack: 'Bienvenido de nuevo',
    securityDashboard: 'Tu panel de seguridad',
    lastUpdated: 'última actualización',
    runSecurityScan: 'Ejecutar Escaneo',
    securityScore: 'Puntuación de Seguridad',
    vulnerableAccounts: 'Cuentas Vulnerables',
    reusedPasswords: 'Contraseñas Reutilizadas',
    totalPasswords: 'Total de Contraseñas',
    weakPasswords: 'Contraseñas Débiles',
    passwordUpdated: 'Contraseña Actualizada',
    openVault: 'Abrir Bóveda',
    accountType: 'Tipo de Cuenta',
    email: 'Correo Electrónico',
    phone: 'Teléfono',
    notAdded: 'No añadido',
    accountSettings: 'Configuración de Cuenta',
    recentSecurityEvents: 'Eventos Recientes',
    viewAll: 'Ver Todo',
    noRecentEvents: 'No hay eventos recientes',
    manage: 'Administrar',
    enabled: 'Activado',
    disabled: 'Desactivado',
    
    // Search
    search: 'Buscar...',
    profileSettings: 'Ajustes de Perfil',
    
    // Page titles
    settingsTitle: 'Configuración',
    settingsSubtitle: 'Administra tu cuenta y preferencias de aplicación',
    
    // Account Settings
    changePfp: 'Cambiar Foto de Perfil',
    name: 'Nombre',
    saveChanges: 'Guardar Cambios',
    
    // Security Settings
    securitySettings: 'Configuración de Seguridad',
    changePassword: 'Cambiar Contraseña',
    lastChanged: 'Último cambio',
    update: 'Actualizar',
    twoFactor: 'Autenticación de Dos Factores',
    twoFactorDesc: 'Añade una capa extra de seguridad',
    biometric: 'Autenticación Biométrica',
    biometricDesc: 'Usa huella digital o reconocimiento facial',
    autoLock: 'Bloqueo Automático',
    autoLockDesc: 'Bloquear después de un período de inactividad',
    loginAlerts: 'Alertas de Inicio de Sesión',
    loginAlertsDesc: 'Recibe notificaciones sobre intentos de inicio de sesión',
    
    // Data Management
    dataManagement: 'Gestión de Datos',
    exportData: 'Exportar Datos',
    exportDesc: 'Descarga todas tus contraseñas y datos',
    export: 'Exportar',
    syncFrequency: 'Frecuencia de Sincronización',
    syncDesc: 'Con qué frecuencia sincronizar con la nube',
    clearData: 'Borrar Todos los Datos',
    clearDataDesc: 'Eliminar todos los datos personales de la aplicación',
    
    // Application Settings
    applicationSettings: 'Configuración de Aplicación',
    themeMode: 'Modo de Tema',
    language: 'Idioma',
    
    // Connected Devices
    connectedDevices: 'Dispositivos Conectados',
    currentDevice: 'Dispositivo actual',
    lastActive: 'Última actividad',
    remove: 'Eliminar',
    active: 'Activo',
    
    // Account Management
    accountManagement: 'Gestión de Cuenta',
    premiumPlan: 'Plan Premium',
    planRenews: 'Tu plan se renueva el 12 de agosto de 2025',
    manageSubscription: 'Administrar Suscripción',
    deleteAccount: 'Eliminar Cuenta',
    
    // Delete Dialog
    deleteConfirm: '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer y todos tus datos se eliminarán permanentemente.',
    cancel: 'Cancelar',
    
    // Time units
    minute: 'minuto',
    minutes: 'minutos',
    hour: 'hora',
    never: 'Nunca',
    
    // Sync options
    automatic: 'Automático',
    manual: 'Manual',
    every: 'Cada'
  },
  fr: {
    // Sidebar Menu
    dashboard: 'Tableau de Bord',
    passwordVault: 'Coffre-fort de Mots de Passe',
    authentication: 'Authentification',
    securityStatus: 'État de Sécurité',
    blockchainVerify: 'Vérification Blockchain',
    securityVerification: 'Vérification de Sécurité',
    notifications: 'Notifications',
    settings: 'Paramètres',
    signOut: 'Déconnexion',
    protected: 'Protégé',
    lastScan: 'Dernier scan',
    
    // Dashboard
    welcomeBack: 'Bienvenue',
    securityDashboard: 'Votre tableau de bord de sécurité',
    lastUpdated: 'dernière mise à jour',
    runSecurityScan: 'Lancer Analyse',
    securityScore: 'Score de Sécurité',
    vulnerableAccounts: 'Comptes Vulnérables',
    reusedPasswords: 'Mots de Passe Réutilisés',
    totalPasswords: 'Total des Mots de Passe',
    weakPasswords: 'Mots de Passe Faibles',
    passwordUpdated: 'Mot de Passe Mis à Jour',
    openVault: 'Ouvrir le Coffre',
    accountType: 'Type de Compte',
    email: 'E-mail',
    phone: 'Téléphone',
    notAdded: 'Non ajouté',
    accountSettings: 'Paramètres du Compte',
    recentSecurityEvents: 'Événements Récents',
    viewAll: 'Voir Tout',
    noRecentEvents: 'Aucun événement récent',
    manage: 'Gérer',
    enabled: 'Activé',
    disabled: 'Désactivé',
    
    // Search
    search: 'Rechercher...',
    profileSettings: 'Paramètres du Profil',
    
    // Page titles
    settingsTitle: 'Paramètres',
    settingsSubtitle: 'Gérez votre compte et vos préférences d\'application',
    
    // Account Settings
    changePfp: 'Changer la Photo de Profil',
    name: 'Nom',
    saveChanges: 'Enregistrer les Modifications',
    
    // Security Settings
    securitySettings: 'Paramètres de Sécurité',
    changePassword: 'Changer le Mot de Passe',
    lastChanged: 'Dernier changement',
    update: 'Mettre à jour',
    twoFactor: 'Authentification à Deux Facteurs',
    twoFactorDesc: 'Ajoutez une couche de sécurité supplémentaire',
    biometric: 'Authentification Biométrique',
    biometricDesc: 'Utilisez l\'empreinte digitale ou la reconnaissance faciale',
    autoLock: 'Verrouillage Automatique',
    autoLockDesc: 'Verrouiller après une période d\'inactivité',
    loginAlerts: 'Alertes de Connexion',
    loginAlertsDesc: 'Recevez des notifications sur les tentatives de connexion',
    
    // Data Management
    dataManagement: 'Gestion des Données',
    exportData: 'Exporter les Données',
    exportDesc: 'Téléchargez tous vos mots de passe et données',
    export: 'Exporter',
    syncFrequency: 'Fréquence de Synchronisation',
    syncDesc: 'À quelle fréquence synchroniser avec le cloud',
    clearData: 'Effacer Toutes les Données',
    clearDataDesc: 'Supprimer toutes les données personnelles de l\'application',
    
    // Application Settings
    applicationSettings: 'Paramètres de l\'Application',
    themeMode: 'Mode Thème',
    language: 'Langue',
    
    // Connected Devices
    connectedDevices: 'Appareils Connectés',
    currentDevice: 'Appareil actuel',
    lastActive: 'Dernière activité',
    remove: 'Supprimer',
    active: 'Actif',
    
    // Account Management
    accountManagement: 'Gestion du Compte',
    premiumPlan: 'Plan Premium',
    planRenews: 'Votre plan se renouvelle le 12 août 2025',
    manageSubscription: 'Gérer l\'Abonnement',
    deleteAccount: 'Supprimer le Compte',
    
    // Delete Dialog
    deleteConfirm: 'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action ne peut pas être annulée et toutes vos données seront définitivement supprimées.',
    cancel: 'Annuler',
    
    // Time units
    minute: 'minute',
    minutes: 'minutes',
    hour: 'heure',
    never: 'Jamais',
    
    // Sync options
    automatic: 'Automatique',
    manual: 'Manuel',
    every: 'Chaque'
  },
  de: {
    // Sidebar Menu
    dashboard: 'Dashboard',
    passwordVault: 'Passwort-Tresor',
    authentication: 'Authentifizierung',
    securityStatus: 'Sicherheitsstatus',
    blockchainVerify: 'Blockchain-Verifizierung',
    securityVerification: 'Sicherheitsüberprüfung',
    notifications: 'Benachrichtigungen',
    settings: 'Einstellungen',
    signOut: 'Abmelden',
    protected: 'Geschützt',
    lastScan: 'Letzter Scan',
    
    // Dashboard
    welcomeBack: 'Willkommen zurück',
    securityDashboard: 'Ihr Sicherheits-Dashboard',
    lastUpdated: 'zuletzt aktualisiert',
    runSecurityScan: 'Sicherheitsscan starten',
    securityScore: 'Sicherheitsbewertung',
    vulnerableAccounts: 'Gefährdete Konten',
    reusedPasswords: 'Wiederverwendete Passwörter',
    totalPasswords: 'Gesamtanzahl Passwörter',
    weakPasswords: 'Schwache Passwörter',
    passwordUpdated: 'Passwort aktualisiert',
    openVault: 'Tresor öffnen',
    accountType: 'Kontotyp',
    email: 'E-Mail',
    phone: 'Telefon',
    notAdded: 'Nicht hinzugefügt',
    accountSettings: 'Kontoeinstellungen',
    recentSecurityEvents: 'Aktuelle Sicherheitsereignisse',
    viewAll: 'Alle anzeigen',
    noRecentEvents: 'Keine aktuellen Ereignisse',
    manage: 'Verwalten',
    enabled: 'Aktiviert',
    disabled: 'Deaktiviert',
    
    // Search
    search: 'Suchen...',
    profileSettings: 'Profileinstellungen',
    
    // Page titles
    settingsTitle: 'Einstellungen',
    settingsSubtitle: 'Verwalten Sie Ihr Konto und Anwendungseinstellungen',
    
    // Account Settings
    changePfp: 'Profilbild ändern',
    name: 'Name',
    saveChanges: 'Änderungen speichern',
    
    // Security Settings
    securitySettings: 'Sicherheitseinstellungen',
    changePassword: 'Passwort ändern',
    lastChanged: 'Zuletzt geändert',
    update: 'Aktualisieren',
    twoFactor: 'Zwei-Faktor-Authentifizierung',
    twoFactorDesc: 'Fügen Sie eine zusätzliche Sicherheitsebene hinzu',
    biometric: 'Biometrische Authentifizierung',
    biometricDesc: 'Fingerabdruck oder Gesichtserkennung verwenden',
    autoLock: 'Automatische Sperre',
    autoLockDesc: 'Sperren nach einer Inaktivitätsperiode',
    loginAlerts: 'Login-Benachrichtigungen',
    loginAlertsDesc: 'Benachrichtigungen über Anmeldeversuche erhalten',
    
    // Data Management
    dataManagement: 'Datenverwaltung',
    exportData: 'Daten exportieren',
    exportDesc: 'Laden Sie alle Ihre Passwörter und Daten herunter',
    export: 'Exportieren',
    syncFrequency: 'Synchronisierungsfrequenz',
    syncDesc: 'Wie oft mit der Cloud synchronisieren',
    clearData: 'Alle Daten löschen',
    clearDataDesc: 'Entfernen Sie alle persönlichen Daten aus der App',
    
    // Application Settings
    applicationSettings: 'Anwendungseinstellungen',
    themeMode: 'Themenmodus',
    language: 'Sprache',
    
    // Connected Devices
    connectedDevices: 'Verbundene Geräte',
    currentDevice: 'Aktuelles Gerät',
    lastActive: 'Zuletzt aktiv',
    remove: 'Entfernen',
    active: 'Aktiv',
    
    // Account Management
    accountManagement: 'Kontoverwaltung',
    premiumPlan: 'Premium-Plan',
    planRenews: 'Ihr Plan verlängert sich am 12. August 2025',
    manageSubscription: 'Abonnement verwalten',
    deleteAccount: 'Konto löschen',
    
    // Delete Dialog
    deleteConfirm: 'Sind Sie sicher, dass Sie Ihr Konto löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden, und alle Ihre Daten werden dauerhaft entfernt.',
    cancel: 'Abbrechen',
    
    // Time units
    minute: 'Minute',
    minutes: 'Minuten',
    hour: 'Stunde',
    never: 'Nie',
    
    // Sync options
    automatic: 'Automatisch',
    manual: 'Manuell',
    every: 'Alle'
  },
  ja: {
    // Sidebar Menu
    dashboard: 'ダッシュボード',
    passwordVault: 'パスワード保管庫',
    authentication: '認証',
    securityStatus: 'セキュリティ状態',
    blockchainVerify: 'ブロックチェーン検証',
    securityVerification: 'セキュリティ検証',
    notifications: '通知',
    settings: '設定',
    signOut: 'サインアウト',
    protected: '保護済み',
    lastScan: '最終スキャン',
    
    // Dashboard
    welcomeBack: 'お帰りなさい',
    securityDashboard: 'セキュリティダッシュボード',
    lastUpdated: '最終更新',
    runSecurityScan: 'セキュリティスキャン実行',
    securityScore: 'セキュリティスコア',
    vulnerableAccounts: '脆弱なアカウント',
    reusedPasswords: '再利用されたパスワード',
    totalPasswords: 'パスワード総数',
    weakPasswords: '脆弱なパスワード',
    passwordUpdated: 'パスワード更新日',
    openVault: '保管庫を開く',
    accountType: 'アカウントタイプ',
    email: 'メール',
    phone: '電話番号',
    notAdded: '未追加',
    accountSettings: 'アカウント設定',
    recentSecurityEvents: '最近のセキュリティイベント',
    viewAll: 'すべて表示',
    noRecentEvents: '最近のイベントはありません',
    manage: '管理',
    enabled: '有効',
    disabled: '無効',
    
    // Search
    search: '検索...',
    profileSettings: 'プロフィール設定',
    
    // Page titles
    settingsTitle: '設定',
    settingsSubtitle: 'アカウントとアプリの設定を管理',
    
    // Account Settings
    changePfp: 'プロフィール写真を変更',
    name: '名前',
    saveChanges: '変更を保存',
    
    // Security Settings
    securitySettings: 'セキュリティ設定',
    changePassword: 'パスワード変更',
    lastChanged: '最終変更',
    update: '更新',
    twoFactor: '二要素認証',
    twoFactorDesc: '追加のセキュリティレイヤーを追加',
    biometric: '生体認証',
    biometricDesc: '指紋や顔認証を使用',
    autoLock: '自動ロック',
    autoLockDesc: '一定時間の非アクティブ後にロック',
    loginAlerts: 'ログインアラート',
    loginAlertsDesc: 'ログイン試行の通知を受け取る',
    
    // Data Management
    dataManagement: 'データ管理',
    exportData: 'データのエクスポート',
    exportDesc: 'すべてのパスワードとデータをダウンロード',
    export: 'エクスポート',
    syncFrequency: '同期頻度',
    syncDesc: 'クラウドとの同期頻度',
    clearData: 'すべてのデータを消去',
    clearDataDesc: 'アプリからすべての個人データを削除',
    
    // Application Settings
    applicationSettings: 'アプリケーション設定',
    themeMode: 'テーマモード',
    language: '言語',
    
    // Connected Devices
    connectedDevices: '接続済みデバイス',
    currentDevice: '現在のデバイス',
    lastActive: '最終アクティブ',
    remove: '削除',
    active: 'アクティブ',
    
    // Account Management
    accountManagement: 'アカウント管理',
    premiumPlan: 'プレミアムプラン',
    planRenews: '2025年8月12日に更新されます',
    manageSubscription: 'サブスクリプション管理',
    deleteAccount: 'アカウント削除',
    
    // Delete Dialog
    deleteConfirm: 'アカウントを削除してもよろしいですか？この操作は元に戻せず、すべてのデータが完全に削除されます。',
    cancel: 'キャンセル',
    
    // Time units
    minute: '分',
    minutes: '分',
    hour: '時間',
    never: '無効',
    
    // Sync options
    automatic: '自動',
    manual: '手動',
    every: '毎'
  }
};

const LanguageContext = createContext<{
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  t: (key: string) => string;
}>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Get from localStorage or use browser language or default to English
    const saved = localStorage.getItem('language') as Language;
    if (saved && Object.keys(languageNames).includes(saved)) {
      return saved;
    }
    
    // Try to use browser language
    const browserLang = navigator.language.split('-')[0] as Language;
    if (Object.keys(languageNames).includes(browserLang)) {
      return browserLang;
    }
    
    return 'en';
  });

  // Save to localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    if (translations.en[key]) {
      return translations.en[key];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext); 