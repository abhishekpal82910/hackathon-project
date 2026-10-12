import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { showUlpinCopiedToast } from './ToastNotice';

interface CopyUlpinButtonProps {
  ulpin: string;
  label?: string;
  variant?: 'button' | 'badge' | 'icon' | 'compact';
  size?: 'xs' | 'sm' | 'md';
  highContrast?: boolean;
  className?: string;
  showText?: boolean;
  truncateLength?: number;
  onCopied?: (ulpin: string) => void;
}

export const CopyUlpinButton: React.FC<CopyUlpinButtonProps> = ({
  ulpin,
  label = 'ULPIN',
  variant = 'compact',
  size = 'sm',
  highContrast = false,
  className = '',
  showText = true,
  truncateLength,
  onCopied
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!ulpin) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(ulpin);
      } else {
        // Fallback for restricted iframe or older browser
        const textArea = document.createElement('textarea');
        textArea.value = ulpin;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch {
      // Ignore if fallback also fails
    }

    setCopied(true);
    showUlpinCopiedToast(ulpin, label);
    if (onCopied) onCopied(ulpin);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const displayText = truncateLength && ulpin.length > truncateLength
    ? `${ulpin.slice(0, truncateLength)}...`
    : ulpin;

  // Icon sizing
  const iconSize = size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleCopy}
        title={copied ? 'Copied to clipboard!' : `Copy ${label}: ${ulpin}`}
        aria-label={`Copy ${label} ${ulpin}`}
        className={`inline-flex items-center justify-center p-1 rounded transition-all duration-150 cursor-pointer active:scale-90 ${
          highContrast
            ? 'text-yellow-400 hover:text-yellow-200 hover:bg-neutral-800'
            : copied
            ? 'text-emerald-600 bg-emerald-50'
            : 'text-slate-400 hover:text-[#0B3D6B] hover:bg-slate-100'
        } ${className}`}
      >
        {copied ? (
          <Check className={`${iconSize} text-emerald-600 animate-in zoom-in duration-150`} />
        ) : (
          <Copy className={`${iconSize} transition-transform hover:scale-110`} />
        )}
      </button>
    );
  }

  if (variant === 'badge') {
    return (
      <button
        type="button"
        onClick={handleCopy}
        title={copied ? 'Copied to clipboard!' : `Copy ${label}: ${ulpin}`}
        aria-label={`Copy ${label} ${ulpin}`}
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono font-bold transition-all duration-150 cursor-pointer border active:scale-95 text-[10px] ${
          highContrast
            ? copied
              ? 'bg-yellow-400 text-black border-yellow-400 ring-2 ring-white'
              : 'bg-neutral-900 text-yellow-300 border-yellow-400 hover:bg-neutral-800'
            : copied
            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
            : 'bg-slate-100 text-[#0B3D6B] border-slate-300 hover:bg-blue-50 hover:border-[#0B3D6B]/50 hover:text-[#0B3D6B]'
        } ${className}`}
      >
        {copied ? (
          <Check className="w-3 h-3 text-emerald-600" />
        ) : (
          <Copy className="w-3 h-3 text-slate-400 group-hover:text-[#0B3D6B]" />
        )}
        {showText && <span>{copied ? 'Copied!' : displayText}</span>}
      </button>
    );
  }

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleCopy}
        title={copied ? 'Copied to clipboard!' : `Copy ${label}: ${ulpin}`}
        aria-label={`Copy ${label} ${ulpin}`}
        className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded font-mono font-bold text-xs shadow-xs transition-all duration-150 cursor-pointer border active:scale-95 ${
          highContrast
            ? copied
              ? 'bg-yellow-400 text-black border-yellow-400'
              : 'bg-black text-yellow-300 border-yellow-400 hover:bg-neutral-900'
            : copied
            ? 'bg-emerald-700 text-white border-emerald-800 hover:bg-emerald-800'
            : 'bg-[#0B3D6B] text-white border-[#0B3D6B] hover:bg-[#082B4D] hover:shadow-sm'
        } ${className}`}
      >
        {copied ? (
          <Check className={`${iconSize} text-emerald-200`} />
        ) : (
          <Copy className={`${iconSize} text-blue-200`} />
        )}
        {showText && <span>{copied ? 'Copied!' : displayText}</span>}
      </button>
    );
  }

  // Default: 'compact'
  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? 'Copied to clipboard!' : `Copy ${label}: ${ulpin}`}
      aria-label={`Copy ${label} ${ulpin}`}
      className={`group inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-mono font-medium transition-all duration-150 cursor-pointer border active:scale-95 text-[10px] sm:text-[11px] ${
        highContrast
          ? copied
            ? 'bg-yellow-400 text-black border-yellow-400'
            : 'bg-neutral-900 text-yellow-300 border-yellow-500/50 hover:border-yellow-400 hover:bg-neutral-800'
          : copied
          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
          : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-blue-50 hover:border-[#0B3D6B]/40 hover:text-[#0B3D6B]'
      } ${className}`}
    >
      {copied ? (
        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
      ) : (
        <Copy className="w-3 h-3 text-slate-400 group-hover:text-[#0B3D6B] shrink-0" />
      )}
      {showText && (
        <span className="select-all">{copied ? 'Copied!' : displayText}</span>
      )}
    </button>
  );
};
