import React from 'react';
import { AlpacemLogo } from '../Icons';
import { InstallPrompt } from '../InstallPrompt';

interface LoginViewProps {
  onLogin: (email: string, pass: string) => void;
  onRegister: (email: string, pass: string, name: string, role: 'admin' | 'driver') => void;
  onGoogleLogin: () => void;
}

import { useState } from 'react';

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onRegister, onGoogleLogin }) => {
  const [isRegister, setIsRegister] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'driver'>('driver');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
        if (!name || !email || !password) return;
        onRegister(email, password, name, role);
    } else {
        if (!email || !password) return;
        onLogin(email, password);
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-alpa-500/10 -skew-y-6 transform origin-top-left z-0 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-alpa-500/5 rounded-full blur-3xl z-0 pointer-events-none" />

      <div className="w-full max-w-md p-6 z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-800 p-8 md:p-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-40 mb-6 transition-transform hover:scale-105 duration-700">
                <AlpacemLogo className="w-full" />
            </div>
            <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100 tracking-tight text-center">
              Gestione Logistica
            </h1>
          </div>

          {/* TABS */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6">
            <button
                onClick={() => setIsRegister(false)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${!isRegister ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
            >
                Accedi
            </button>
            <button
                onClick={() => setIsRegister(true)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${isRegister ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
            >
                Registrati
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {isRegister && (
            <>
                <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 ml-1">Nome Completo</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-alpa-500 focus:outline-none dark:text-white"
                        placeholder="Mario Rossi"
                        required={isRegister}
                    />
                </div>
                <div>
                     <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 ml-1">Ruolo</label>
                     <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setRole('driver')}
                            className={`flex-1 py-2.5 px-3 rounded-xl border text-sm font-medium transition-all ${role === 'driver' ? 'border-alpa-500 bg-alpa-50 text-alpa-700 dark:bg-alpa-900/20 dark:text-alpa-400' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'}`}
                        >
                            Autista
                        </button>
                         <button
                            type="button"
                            onClick={() => setRole('admin')}
                            className={`flex-1 py-2.5 px-3 rounded-xl border text-sm font-medium transition-all ${role === 'admin' ? 'border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'}`}
                        >
                            Ufficio / Admin
                        </button>
                     </div>
                </div>
            </>
            )}

            <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 ml-1">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-alpa-500 focus:outline-none dark:text-white"
                    placeholder="nome@alpacem.com"
                    required
                />
            </div>

            <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 ml-1">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-alpa-500 focus:outline-none dark:text-white"
                    placeholder="••••••••"
                    required
                />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-alpa-600 hover:bg-alpa-700 text-white font-semibold rounded-xl shadow-lg shadow-alpa-600/30 transition-all active:scale-95"
            >
              {isRegister ? 'Crea Account' : 'Accedi'}
            </button>
          </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">oppure continua con</span>
              </div>
            </div>

            <button
              onClick={onGoogleLogin}
              className="w-full py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </div>
        <p className="text-center text-xs text-slate-400 mt-8">
          &copy; {new Date().getFullYear()} Alpacem Italia
        </p>
      </div>
      <InstallPrompt />
    </div>
  );
};
