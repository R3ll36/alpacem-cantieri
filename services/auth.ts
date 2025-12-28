import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User, UserRole } from '../types';

export const authService = {
  // Sign Up with Email/Password & Create Profile
  register: async (email: string, pass: string, name: string, role: UserRole): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const fbUser = userCredential.user;

    const newUser: User = {
      uid: fbUser.uid,
      email: fbUser.email || email,
      displayName: name,
      role: role,
      photoURL: fbUser.photoURL || null
    };

    // Create User Document in Firestore
    await setDoc(doc(db, 'users', fbUser.uid), newUser);
    return newUser;
  },

  // Sign In with Email/Password
  login: async (email: string, pass: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    const fbUser = userCredential.user;

    // Fetch Role from Firestore
    const userDoc = await getDoc(doc(db, 'users', fbUser.uid));

    if (userDoc.exists()) {
      return userDoc.data() as User;
    } else {
      // Fallback if doc missing (shouldn't happen for registered users, but possible for legacy/manual)
      return {
        uid: fbUser.uid,
        email: fbUser.email || email,
        displayName: fbUser.displayName || 'Utente',
        role: 'driver', // Default fallback
        photoURL: fbUser.photoURL || null
      };
    }
  },

  // Google Sign In
  loginWithGoogle: async (): Promise<User> => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const fbUser = userCredential.user;

    // Check if user profile exists
    const userRef = doc(db, 'users', fbUser.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data() as User;
    } else {
      // Create new profile for Google user (Default role: driver)
      const newUser: User = {
        uid: fbUser.uid,
        email: fbUser.email || '',
        displayName: fbUser.displayName || 'Utente Google',
        role: 'driver', // Default for Google Sign-In
        photoURL: fbUser.photoURL || null
      };
      await setDoc(userRef, newUser);
      return newUser;
    }
  },

  // Logout
  logout: async () => {
    await signOut(auth);
  },

  // Auth State Observer
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
        if (userDoc.exists()) {
          callback(userDoc.data() as User);
        } else {
          // Provide basic info if doc fetch fails/doesn't exist yet
          callback({
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || 'Utente',
            role: 'driver'
          });
        }
      } else {
        callback(null);
      }
    });
  }
};
