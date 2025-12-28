import { ConstructionSite, User } from '../types';
import { db, auth } from './firebase';
import { collection, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

const USER_KEY = 'alpacem_user';
const THEME_KEY = 'alpacem_theme';

// Helper to ensure auth
const ensureAuth = async () => {
  if (!auth.currentUser) {
    try {
      await signInAnonymously(auth);
    } catch (e) {
      console.error("Auth error", e);
    }
  }
};

export const storageService = {
  // Sync methods for local preferences
  getUser: (): User | null => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  saveUser: (user: User | null) => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  },

  getTheme: (): 'light' | 'dark' => {
    return (localStorage.getItem(THEME_KEY) as 'light' | 'dark') || 'light';
  },

  saveTheme: (theme: 'light' | 'dark') => {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  // Async methods for Firestore
  getSites: async (): Promise<ConstructionSite[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, 'cantieri'));
      return querySnapshot.docs.map(doc => doc.data() as ConstructionSite);
    } catch (error) {
      console.error("Error fetching sites:", error);
      return [];
    }
  },

  saveSite: async (site: ConstructionSite): Promise<void> => {
    try {
      await ensureAuth();
      await setDoc(doc(db, 'cantieri', site.id), site);
    } catch (error) {
      console.error("Error saving site:", error);
      throw error;
    }
  },

  deleteSite: async (siteId: string): Promise<void> => {
    try {
      await ensureAuth();
      await deleteDoc(doc(db, 'cantieri', siteId));
    } catch (error) {
      console.error("Error deleting site:", error);
      throw error;
    }
  }
};
