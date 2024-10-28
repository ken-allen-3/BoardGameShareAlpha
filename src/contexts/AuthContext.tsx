import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database, ensureDatabaseStructure, validateDatabaseAccess } from '../config/firebase';

interface AuthContextType {
  currentUser: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const setupAuth = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (err) {
        console.error('Error setting up auth:', err);
        setError('Failed to set up authentication. Please try again.');
      }
    };
    
    setupAuth();
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user?.email) {
        try {
          // Check database access
          const hasAccess = await validateDatabaseAccess(user.email);
          if (!hasAccess) {
            setError('Database access denied. Please contact support.');
            return;
          }

          // Set up user structure
          await ensureDatabaseStructure(user.email);
          
          // Update admin status
          setIsAdmin(user.email === 'kenny@springwavestudios.com');
          setError(null);
        } catch (err) {
          console.error('Error setting up user:', err);
          setError('Failed to access user data. Please try again.');
        }
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function signIn(email: string, password: string) {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
      
const userRef = ref(database, `users/${email.replace(/\./g, ',')}`);
      await set(userRef, {
        email,
        isAdmin: email === 'kenny@springwavestudios.com',
        lastLogin: new Date().toISOString()
      });
    } catch (err: any) {
      console.error('Sign in error:', err);
      throw new Error(err.message);
    }
  }

  async function signOut() {
    try {
      await firebaseSignOut(auth);
      setError(null);
    } catch (err) {
      console.error('Sign out error:', err);
      throw new Error('Failed to sign out');
    }
  }

  const value = {
    currentUser,
    signIn,
    signOut,
    loading,
    error,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {error ? (
        <div className="max-w-md mx-auto mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      ) : !loading ? (
        children
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
}