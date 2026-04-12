import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let adminApp: App;

function getAdminApp(): App {
  if (adminApp) return adminApp;

  if (getApps().length > 0) {
    adminApp = getApps()[0];
    return adminApp;
  }

  // Use service account from env, or fall back to application default credentials
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccount) {
    try {
      const parsed = JSON.parse(serviceAccount);
      adminApp = initializeApp({
        credential: cert(parsed),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    } catch {
      adminApp = initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    }
  } else {
    // Dev fallback — uses project ID only (works for token verification via REST)
    adminApp = initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }

  return adminApp;
}

export async function verifyIdToken(token: string): Promise<string | null> {
  try {
    const app = getAdminApp();
    const decoded = await getAuth(app).verifyIdToken(token);
    return decoded.uid;
  } catch (err) {
    console.warn('[Auth] Token verification failed:', (err as Error).message);
    return null;
  }
}
