import React, { useState } from 'react';
import { Heart } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackLabel?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackLabel,
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#ffe9e9] via-[#fff0f0] to-[#dbe6d7]/60 text-primary p-4 text-center ${className}`}
        role="img"
        aria-label={alt || fallbackLabel || 'Recuerdo'}
      >
        <Heart className="w-6 h-6 text-primary/60 mb-1.5" />
        {fallbackLabel && (
          <span className="text-xs font-medium text-on-surface-variant line-clamp-2">
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || ''}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      {...rest}
    />
  );
};
