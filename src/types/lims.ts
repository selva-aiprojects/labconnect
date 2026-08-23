/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LimsRole = 'Receptionist' | 'Phlebotomist' | 'Administrator';

export interface LimsUser {
  username: string;
  role: LimsRole;
  fullName: string;
  avatarUrl: string;
  department: string;
  location: string;
}

export type SupportedLanguage = 'en' | 'hi' | 'fr' | 'ar';

export interface TranslationDictionary {
  signInTitle: string;
  signInSub: string;
  usernameLabel: string;
  passwordLabel: string;
  rememberUsername: string;
  forgotPassword: string;
  loginButton: string;
  loggingIn: string;
  clearButton: string;
  supportHelp: string;
  supportBoxTitle: string;
  supportPhone: string;
  languageLabel: string;
  bannerTitle: string;
  bannerSubtitle: string;
  validationRequired: string;
  validationMinLength: string;
  credentialsError: string;
  loginSuccess: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    signInTitle: "Sign In",
    signInSub: "Welcome back. Please enter your credentials to continue.",
    usernameLabel: "Username",
    passwordLabel: "Password",
    rememberUsername: "Remember Username",
    forgotPassword: "Forgot Password?",
    loginButton: "Login to Portal",
    loggingIn: "Authenticating Security...",
    clearButton: "Clear",
    supportHelp: "Need help signing in? Contact technical support.",
    supportBoxTitle: "Enterprise Call & WhatsApp Support",
    supportPhone: "+971 55 645 7973 (UAE)",
    languageLabel: "Preferred Language",
    bannerTitle: "Smarter diagnostics, simplified access.",
    bannerSubtitle: "Sign in to continue monitoring lab performance, manage quality assurance, and keep healthcare teams updated with real-time analytics.",
    validationRequired: "This field is required",
    validationMinLength: "Must be at least 4 characters",
    credentialsError: "Invalid username or password. Try a demo profile!",
    loginSuccess: "Secure authentication granted. Initializing LIMS dashboard..."
  },
  hi: {
    signInTitle: "साइन इन करें",
    signInSub: "आपका स्वागत है। आगे बढ़ने के लिए कृपया अपनी साख दर्ज करें।",
    usernameLabel: "उपयोगकर्ता नाम",
    passwordLabel: "पासवर्ड",
    rememberUsername: "उपयोगकर्ता नाम याद रखें",
    forgotPassword: "पासवर्ड भूल गए?",
    loginButton: "पोर्टल पर लॉग इन करें",
    loggingIn: "सुरक्षा प्रमाणित की जा रही है...",
    clearButton: "साफ करें",
    supportHelp: "लॉग इन करने में मदद चाहिए? तकनीकी सहायता से संपर्क करें।",
    supportBoxTitle: "एंटरप्राइज़ कॉल और व्हाट्सएप सपोर्ट",
    supportPhone: "+971 55 645 7973 (यूएई)",
    languageLabel: "पसंदीदा भाषा",
    bannerTitle: "बेहतर डायग्नोस्टिक्स, आसान पहुँच।",
    bannerSubtitle: "लैब प्रदर्शन की निगरानी जारी रखने, गुणवत्ता आश्वासन प्रबंधित करने और रीयल-टाइम एनालिटिक्स के साथ स्वास्थ्य सेवा टीमों को अपडेट रखने के लिए साइन इन करें।",
    validationRequired: "यह क्षेत्र आवश्यक है",
    validationMinLength: "कम से कम 4 वर्ण होने चाहिए",
    credentialsError: "अमान्य उपयोगकर्ता नाम या पासवर्ड। डेमो प्रोफ़ाइल आज़माएं!",
    loginSuccess: "सुरक्षित प्रमाणीकरण प्रदान किया गया। डैशबोर्ड शुरू हो रहा है..."
  },
  fr: {
    signInTitle: "Se connecter",
    signInSub: "Bon retour. Veuillez entrer vos identifiants pour continuer.",
    usernameLabel: "Nom d'utilisateur",
    passwordLabel: "Mot de passe",
    rememberUsername: "Retenir l'identifiant",
    forgotPassword: "Mot de passe oublié?",
    loginButton: "Connexion au portail",
    loggingIn: "Authentification de sécurité...",
    clearButton: "Effacer",
    supportHelp: "Besoin d'aide pour vous connecter? Contactez le support.",
    supportBoxTitle: "Support d'entreprise Téléphone & WhatsApp",
    supportPhone: "+971 55 645 7973 (ÉAU)",
    languageLabel: "Langue préférée",
    bannerTitle: "Diagnostics plus intelligents, accès simplifié.",
    bannerSubtitle: "Connectez-vous pour continuer à surveiller les performances du laboratoire, gérer l'assurance qualité et tenir les équipes de soins informées grâce aux analyses en temps réel.",
    validationRequired: "Ce champ est obligatoire",
    validationMinLength: "Doit contenir au moins 4 caractères",
    credentialsError: "Identifiant ou mot de passe invalide. Essayez un profil démo !",
    loginSuccess: "Authentification sécurisée accordée. Initialisation du tableau de bord..."
  },
  ar: {
    signInTitle: "تسجيل الدخول",
    signInSub: "مرحباً بعودتك. يرجى إدخال بيانات الاعتماد الخاصة بك للمتابعة.",
    usernameLabel: "اسم المستخدم",
    passwordLabel: "كلمة المرور",
    rememberUsername: "تذكر اسم المستخدم",
    forgotPassword: "هل نسيت كلمة المرور؟",
    loginButton: "تسجيل الدخول إلى البوابة",
    loggingIn: "جاري التحقق من الأمان...",
    clearButton: "مسح",
    supportHelp: "هل تحتاج إلى مساعدة؟ اتصل بالدعم الفني.",
    supportBoxTitle: "دعم الاتصال والواتساب للمؤسسة",
    supportPhone: "+971 55 645 7973 (الإمارات)",
    languageLabel: "اللغة المفضلة",
    bannerTitle: "تشخيصات أكثر ذكاءً، ووصول مبسط.",
    bannerSubtitle: "سجل الدخول لمتابعة مراقبة أداء المختبر، وإدارة ضمان الجودة، وإبقاء فرق الرعاية الصحية على اطلاع بالتحليلات في الوقت الفعلي.",
    validationRequired: "هذا الحقل مطلوب",
    validationMinLength: "يجب أن يكون 4 أحرف على الأقل",
    credentialsError: "اسم المستخدم أو كلمة المرور غير صالحة. جرب ملفًا شخصيًا تجريبيًا!",
    loginSuccess: "تم منح المصادقة الآمنة. جاري تحميل لوحة التحكم..."
  }
};
