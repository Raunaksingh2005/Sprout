import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import { app } from './firebase-client';

// Initialize Firebase App Check with reCAPTCHA Enterprise
export const initializeAppCheckWithRecaptcha = () => {
  // Note: In production, you should use a reCAPTCHA Enterprise site key
  // For development, you can use a test key
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || 'test-key';
  
  if (typeof window !== 'undefined') {
    const appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true
    });
    return appCheck;
  }
  return null;
};

// For development/testing, you can use a debug token
export const getDebugToken = async () => {
  if (process.env.NODE_ENV === 'development') {
    const { initializeAppCheck, ReCaptchaV3Provider } = await import('firebase/app-check');
    const appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider('6Lf...'), // Your reCAPTCHA v3 site key
      isTokenAutoRefreshEnabled: true
    });
    return appCheck;
  }
  return null;
};