'use client';

import { useState } from 'react';
import { Share2, Link2, Check, MessageCircle, Mail, Send, Globe, AtSign } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  description?: string;
  compact?: boolean;
}

export function ShareButtons({ title, description, compact = false }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  function getUrl() {
    return typeof window !== 'undefined' ? window.location.href : '';
  }

  function shareToFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`, '_blank', 'width=600,height=400');
  }

  function shareToTwitter() {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(getUrl())}`, '_blank', 'width=600,height=400');
  }

  function shareToWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + getUrl())}`, '_blank');
  }

  function shareToTelegram() {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(getUrl())}&text=${encodeURIComponent(title)}`, '_blank');
  }

  function shareToEmail() {
    window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent((description || title) + '\n\n' + getUrl())}`, '_blank');
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = getUrl();
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description || title, url: getUrl() });
      } catch {}
    } else {
      setOpen(!open);
    }
  }

  const buttons = [
    { icon: Globe, label: 'Facebook', onClick: shareToFacebook, color: 'hover:bg-[#1877F2] hover:text-white' },
    { icon: AtSign, label: 'X/Twitter', onClick: shareToTwitter, color: 'hover:bg-black hover:text-white' },
    { icon: MessageCircle, label: 'WhatsApp', onClick: shareToWhatsApp, color: 'hover:bg-[#25D366] hover:text-white' },
    { icon: Send, label: 'Telegram', onClick: shareToTelegram, color: 'hover:bg-[#0088cc] hover:text-white' },
    { icon: Mail, label: 'Email', onClick: shareToEmail, color: 'hover:bg-gray-700 hover:text-white' },
    { icon: copied ? Check : Link2, label: copied ? 'Copied!' : 'Copy Link', onClick: copyLink, color: copied ? 'bg-green-100 text-green-700' : 'hover:bg-gray-200' },
  ];

  if (compact) {
    return (
      <div className="relative">
        <button onClick={nativeShare}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Share</span>
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-2 z-50 flex gap-1">
            {buttons.map((btn) => (
              <button key={btn.label} onClick={btn.onClick} title={btn.label}
                className={`p-2 rounded-lg text-gray-600 transition-colors ${btn.color}`}>
                <btn.icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {buttons.map((btn) => (
        <button key={btn.label} onClick={btn.onClick}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 border border-gray-200 transition-colors ${btn.color}`}>
          <btn.icon className="w-4 h-4" />
          <span>{btn.label}</span>
        </button>
      ))}
    </div>
  );
}
