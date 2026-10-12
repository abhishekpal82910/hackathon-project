import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X, Copy } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;
  toast: {
    success: (message: string, title?: string) => string;
    info: (message: string, title?: string) => string;
    warning: (message: string, title?: string) => string;
    error: (message: string, title?: string) => string;
    copy: (ulpin: string, label?: string) => string;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Standalone global trigger so any component can invoke without prop-drilling
export const showToast = (toast: Omit<ToastItem, 'id'>) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cadastre_show_toast', { detail: toast }));
  }
};

export const showUlpinCopiedToast = (ulpin: string, label?: string) => {
  showToast({
    type: 'success',
    title: label ? `${label} Copied` : 'ULPIN Copied to Clipboard',
    message: ulpin,
    duration: 3500
  });
};

interface ToastProviderProps {
  children: React.ReactNode;
  highContrast?: boolean;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children, highContrast = false }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((toastData: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newToast: ToastItem = {
      ...toastData,
      id,
      duration: toastData.duration ?? 3500
    };

    setToasts((prev) => [...prev.slice(-4), newToast]); // keep max 5 active

    return id;
  }, []);

  const toastMethods = {
    success: (message: string, title?: string) => addToast({ type: 'success', message, title }),
    info: (message: string, title?: string) => addToast({ type: 'info', message, title }),
    warning: (message: string, title?: string) => addToast({ type: 'warning', message, title }),
    error: (message: string, title?: string) => addToast({ type: 'error', message, title }),
    copy: (ulpin: string, label?: string) =>
      addToast({
        type: 'success',
        title: label ? `${label} Copied` : 'ULPIN Copied to Clipboard',
        message: ulpin,
        duration: 3500
      })
  };

  // Listen for global custom events
  useEffect(() => {
    const handleCustomToast = (event: Event) => {
      const customEvent = event as CustomEvent<Omit<ToastItem, 'id'>>;
      if (customEvent.detail) {
        addToast(customEvent.detail);
      }
    };

    window.addEventListener('cadastre_show_toast', handleCustomToast);
    return () => window.removeEventListener('cadastre_show_toast', handleCustomToast);
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, toast: toastMethods }}>
      {children}
      {/* Toast Notice Container - Bottom Right above floating actions */}
      <aside
        id="toast-container"
        aria-live="polite"
        aria-label="Notifications"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-2"
      >
        {toasts.map((t) => (
          <ToastCard
            key={t.id}
            toast={t}
            onDismiss={() => removeToast(t.id)}
            highContrast={highContrast}
          />
        ))}
      </aside>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastCardProps {
  toast: ToastItem;
  onDismiss: () => void;
  highContrast: boolean;
}

const ToastCard: React.FC<ToastCardProps> = ({ toast, onDismiss, highContrast }) => {
  const { id, type, title, message, duration = 3500 } = toast;
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (duration <= 0) return;
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onDismiss();
      }
    }, 40);

    return () => clearInterval(interval);
  }, [duration, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
    info: <Info className="w-4 h-4 text-blue-500 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />,
    error: <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
  };

  const borderBgStyles = {
    success: highContrast
      ? 'bg-black border-yellow-400 text-yellow-300'
      : 'bg-white border-emerald-300 text-slate-900 shadow-md shadow-emerald-950/5',
    info: highContrast
      ? 'bg-black border-blue-400 text-blue-300'
      : 'bg-white border-blue-300 text-slate-900 shadow-md shadow-blue-950/5',
    warning: highContrast
      ? 'bg-black border-amber-400 text-amber-300'
      : 'bg-white border-amber-300 text-slate-900 shadow-md shadow-amber-950/5',
    error: highContrast
      ? 'bg-black border-rose-400 text-rose-300'
      : 'bg-white border-rose-300 text-slate-900 shadow-md shadow-rose-950/5'
  };

  const progressBarStyles = {
    success: highContrast ? 'bg-yellow-400' : 'bg-emerald-500',
    info: highContrast ? 'bg-blue-400' : 'bg-blue-500',
    warning: highContrast ? 'bg-amber-400' : 'bg-amber-500',
    error: highContrast ? 'bg-rose-400' : 'bg-rose-500'
  };

  return (
    <div
      id={id}
      role="status"
      className={`pointer-events-auto relative overflow-hidden rounded-md border p-3 text-xs transition-all duration-200 transform translate-y-0 opacity-100 ${borderBgStyles[type]}`}
    >
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5">{icons[type]}</div>
        <div className="flex-1 min-w-0">
          {title && (
            <div className="font-bold text-[11px] uppercase tracking-wider text-slate-800 dark:text-inherit mb-0.5">
              {title}
            </div>
          )}
          <div className="text-[11px] font-mono break-all leading-snug text-slate-700 dark:text-inherit">
            {message}
          </div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-0.5 rounded transition-colors hover:bg-slate-100 dark:hover:bg-neutral-800 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress countdown bar */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100 dark:bg-neutral-800">
          <div
            className={`h-full transition-all duration-75 ${progressBarStyles[type]}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};
