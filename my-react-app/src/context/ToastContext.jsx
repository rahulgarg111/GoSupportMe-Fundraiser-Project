import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};

let nextId = 0;

/** Small non-blocking notifications (replaces window.alert). */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const show = useCallback((message, type = 'info', duration = 5000) => {
    const id = ++nextId;
    setToasts((t) => [...t.slice(-3), { id, message, type }]);
    if (duration) setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  const value = useMemo(() => ({
    success: (m, d) => show(m, 'success', d),
    error: (m, d) => show(m, 'error', d),
    info: (m, d) => show(m, 'info', d),
    celebrate: (m, d) => show(m, 'celebrate', d ?? 7000),
  }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span>{t.message}</span>
            <button onClick={() => dismiss(t.id)} aria-label="Dismiss">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
