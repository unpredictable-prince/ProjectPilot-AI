import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();
  if (!toast) return null;

  const bgColors = {
    success: '#064E3B',
    error: '#7F1D1D',
    info: '#1E293B',
  };

  const borderColors = {
    success: '#059669',
    error: '#DC2626',
    info: '#4F46E5',
  };

  const Icons = {
    success: <CheckCircle2 size={18} style={{ color: '#34D399' }} />,
    error: <AlertCircle size={18} style={{ color: '#F87171' }} />,
    info: <Info size={18} style={{ color: '#818CF8' }} />,
  };

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 2000,
        backgroundColor: bgColors[toast.type],
        border: `1px solid ${borderColors[toast.type]}`,
        color: '#FFFFFF',
        padding: '0.85rem 1.25rem',
        borderRadius: '10px',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        maxWidth: '420px',
        animation: 'slideUp 0.2s ease-out',
      }}
    >
      {Icons[toast.type]}
      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{toast.text}</span>
    </div>
  );
};
