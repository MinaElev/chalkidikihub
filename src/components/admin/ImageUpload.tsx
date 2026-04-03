'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Upload, X, Loader2, Image as ImageIcon, Sparkles, CheckCircle } from 'lucide-react';
import { compressImage, formatFileSize } from '@/lib/image-utils';

interface ImageUploadProps {
  currentUrl: string;
  onUpload: (url: string) => void;
  folder: string;
  aiPromptContext?: string; // e.g. "Sani beach in Kassandra with turquoise waters"
}

export function ImageUpload({ currentUrl, onUpload, folder, aiPromptContext }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [preview, setPreview] = useState<string>(currentUrl);
  const [error, setError] = useState('');
  const [compressionInfo, setCompressionInfo] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiInput, setShowAiInput] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setCompressionInfo('');
    setUploading(true);

    try {
      // Compress image before upload
      const originalSize = file.size;
      const { blob, width, height } = await compressImage(file, {
        maxWidth: 1200,
        maxHeight: 800,
        quality: 0.72,
        format: 'webp',
      });

      const savedPercent = Math.round((1 - blob.size / originalSize) * 100);
      setCompressionInfo(`${formatFileSize(originalSize)} → ${formatFileSize(blob.size)} (${width}x${height}) | -${savedPercent}%`);

      const supabase = createClient();
      const filePath = `${folder}/${Date.now()}.webp`;

      const { error: uploadError } = await supabase.storage
        .from('content-images')
        .upload(filePath, blob, { contentType: 'image/webp', upsert: true });

      if (uploadError) {
        setError(uploadError.message);
        setUploading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('content-images')
        .getPublicUrl(filePath);

      setPreview(publicUrl);
      onUpload(publicUrl);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  async function handleAiGenerate() {
    const prompt = aiPrompt || aiPromptContext || folder;
    if (!prompt) {
      setError('Περιγράψτε τι εικόνα θέλετε');
      return;
    }

    setError('');
    setGenerating(true);

    try {
      const res = await fetch('/api/ai-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, folder }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setPreview(data.url);
      onUpload(data.url);
      setShowAiInput(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setGenerating(false);
    }
  }

  function handleRemove() {
    setPreview('');
    onUpload('');
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Φωτογραφία</label>

      {preview ? (
        <div className="relative w-full max-w-md aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 group">
          <img src={preview} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity">
              <label className="px-3 py-2 bg-white rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-100">
                Αλλαγή
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              </label>
              <button type="button" onClick={handleRemove} className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex gap-3 max-w-md">
          {/* Upload option */}
          <label className="flex-1 flex flex-col items-center justify-center aspect-[16/9] rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">
            {uploading ? (
              <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
            ) : (
              <>
                <ImageIcon className="w-8 h-8 text-gray-300 mb-1" />
                <span className="text-xs text-gray-500">Upload</span>
                <span className="text-[10px] text-gray-400">JPG, PNG, WebP</span>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>

          {/* AI Generate option */}
          <button
            type="button"
            onClick={() => setShowAiInput(!showAiInput)}
            className="flex-1 flex flex-col items-center justify-center aspect-[16/9] rounded-xl border-2 border-dashed border-purple-300 hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <Sparkles className="w-8 h-8 text-purple-300 mb-1" />
            <span className="text-xs text-purple-600">AI Generate</span>
            <span className="text-[10px] text-purple-400">DALL-E 3</span>
          </button>
        </div>
      )}

      {/* AI Prompt Input */}
      {showAiInput && !preview && (
        <div className="mt-3 max-w-md bg-purple-50 border border-purple-200 rounded-xl p-3">
          <label className="block text-xs font-medium text-purple-700 mb-1">
            Περιγράψτε την εικόνα (στα αγγλικά ή ελληνικά):
          </label>
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder={aiPromptContext || `π.χ. Beautiful ${folder} scene in Halkidiki`}
            className="w-full px-3 py-2 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 mb-2"
          />
          <button
            type="button"
            onClick={handleAiGenerate}
            disabled={generating}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {generating ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Δημιουργία εικόνας (~15 sec)...</>
            ) : (
              <><Sparkles className="w-4 h-4" />Δημιουργία με AI (~$0.04)</>
            )}
          </button>
        </div>
      )}

      {compressionInfo && (
        <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />{compressionInfo}
        </p>
      )}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
