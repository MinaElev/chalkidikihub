'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
}

export function OptimizedImage({ src, alt, width, height, fill, className, priority = false }: OptimizedImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Skip optimization for empty/placeholder URLs
  if (!src || src.startsWith('/images/')) {
    // Local placeholder images - use regular img
    return (
      <img src={src || ''} alt={alt} className={className} loading="lazy" />
    );
  }

  const isExternal = src.startsWith('http');

  if (fill) {
    return (
      <div className={`relative overflow-hidden ${className || ''}`}>
        {!loaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <Image
          src={error ? '/images/placeholder.svg' : src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          loading={priority ? 'eager' : 'lazy'}
          priority={priority}
          quality={80}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          {...(isExternal ? { unoptimized: true } : {})}
        />
      </div>
    );
  }

  return (
    <Image
      src={error ? '/images/placeholder.svg' : src}
      alt={alt}
      width={width || 800}
      height={height || 450}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      priority={priority}
      quality={80}
      onLoad={() => setLoaded(true)}
      onError={() => setError(true)}
      {...(isExternal ? { unoptimized: true } : {})}
    />
  );
}
