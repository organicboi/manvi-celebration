'use client';

import React from 'react';

export interface WantedPosterPrintProps {
  name: string;
  bounty: string;
  imageUrl: string;
  imageOffsetX?: number;
  imageOffsetY?: number;
  photoContainerRef?: React.Ref<HTMLDivElement>;
  onPhotoPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
  isInteractive?: boolean;
}

// The curly bracket ornament for "DEAD OR ALIVE"
const BracketOrnament = ({ flip = false, color = '#2c221b' }: { flip?: boolean; color?: string }) => {
  // We use explicit SVG paths for the flipped right version to prevent html2canvas 
  // CSS transform bug which causes the right brace to mirror or un-align entirely.
  const paths = flip ? (
    <>
      <path d="M6 4 C16 4 18 10 18 18 C18 26 14 30 14 30" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M6 56 C16 56 18 50 18 42 C18 34 14 30 14 30" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="17" cy="30" r="3.5" fill={color} />
      <circle cx="6" cy="4" r="2" fill={color} />
      <circle cx="6" cy="56" r="2" fill={color} />
    </>
  ) : (
    <>
      <path d="M18 4 C8 4 6 10 6 18 C6 26 10 30 10 30" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M18 56 C8 56 6 50 6 42 C6 34 10 30 10 30" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="7" cy="30" r="3.5" fill={color} />
      <circle cx="18" cy="4" r="2" fill={color} />
      <circle cx="18" cy="56" r="2" fill={color} />
    </>
  );

  return (
    <svg width="24" height="60" viewBox="0 0 24 60" fill="none" style={{ flexShrink: 0, display: 'block' }}>
      {paths}
    </svg>
  );
};

const WantedPosterPrint = React.forwardRef<HTMLDivElement, WantedPosterPrintProps>(
  ({ name, bounty, imageUrl, imageOffsetX = 50, imageOffsetY = 50,
     photoContainerRef, onPhotoPointerDown, isInteractive = false }, ref) => {

    const INK = '#2c221b'; // Slightly softer dark brown/black like printer ink

    return (
      <div
        ref={ref}
        id="wanted-poster-print"
        style={{
          width: '595px',
          height: '842px',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#e6dac3', // Solid pale tan color like the reference
          fontFamily: 'var(--font-cinzel), "Times New Roman", serif',
          flexShrink: 0,
        }}
      >
        {/* Subtle paper gradient/noise can be added if needed, but the reference is very flat. We'll keep a very faint texture for realism */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2, opacity: 0.15,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }} />

        {/* Outer subtle shadow/vignette to simulate slightly aged parchment edges */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3,
          boxShadow: 'inset 0 0 60px rgba(100, 70, 40, 0.1)',
        }} />

        {/* Content Container - Switched to relative spacing with strict dimensions to stop flexbox collapse */}
        <div style={{
          position: 'absolute',
          inset: '0',
          display: 'block',
          padding: '0',
          zIndex: 5,
        }}>

          {/* WANTED */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '0',
            width: '100%',
            fontSize: '105px', 
            fontWeight: '900',
            letterSpacing: '0.04em',
            color: INK,
            lineHeight: 1.0, 
            textAlign: 'center',
            fontFamily: '"Times New Roman", serif', 
          }}>
            WANTED
          </div>

          {/* Photo */}
          <div
            ref={photoContainerRef}
            onPointerDown={onPhotoPointerDown}
            style={{
              position: 'absolute',
              top: '160px',
              left: '42px',
              width: '511px',
              height: '385px',
              border: `2px solid ${INK}`,
              overflow: 'hidden',
              backgroundColor: '#fff',
              cursor: isInteractive ? 'grab' : 'default',
              userSelect: 'none',
              touchAction: 'none',
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                draggable={false}
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover',
                  objectPosition: `${imageOffsetX}% ${imageOffsetY}%`,
                  display: 'block',
                  userSelect: 'none',
                  pointerEvents: 'none',
                  filter: 'contrast(1.05) brightness(0.98)',
                }}
                crossOrigin="anonymous"
              />
            ) : (
              <div style={{
                width: '100%', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#888', fontSize: '14px',
              }}>Upload Photo</div>
            )}
          </div>

          {/* DEAD OR ALIVE */}
          <div style={{
            position: 'absolute',
            top: '560px',
            left: '42px',
            width: '511px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 5px',
          }}>
            <BracketOrnament color={INK} />
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              letterSpacing: '0.45em',
              color: INK,
              fontFamily: '"Times New Roman", serif',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              marginRight: '-0.45em', 
            }}>
              DEAD OR ALIVE
            </div>
            <BracketOrnament flip color={INK} />
          </div>

          {/* Name */}
          <div style={{
            position: 'absolute',
            top: '615px',
            left: '0',
            width: '100%',
            fontSize: `${Math.min(88, 800 / Math.max(1, (name || 'YOUR NAME').length))}px`,
            fontWeight: '900',
            letterSpacing: '0.04em',
            color: INK,
            textAlign: 'center',
            lineHeight: 1.2,
            textTransform: 'uppercase',
            fontFamily: '"Times New Roman", serif',
            whiteSpace: 'nowrap',
            padding: '0 20px',
          }}>
            {name || 'YOUR NAME'}
          </div>

          {/* Bounty */}
          <div style={{
            position: 'absolute',
            top: '710px',
            left: '0',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Beli Symbol fixed for html2canvas */}
            <div style={{
              fontSize: '60px',
              fontWeight: '900',
              color: INK,
              fontFamily: '"Times New Roman", serif',
              marginRight: '8px',
              lineHeight: 0.9,
            }}>
              ฿
            </div>
            
            <div style={{
              fontSize: '70px',
              fontWeight: '900',
              color: INK,
              fontFamily: '"Times New Roman", serif',
              letterSpacing: '0.06em',
              lineHeight: 0.9,
            }}>
              {bounty || '0'}<span style={{ letterSpacing: '0' }}>-</span>
            </div>
          </div>

          {/* MARINE */}
          <div style={{
            position: 'absolute',
            top: '778px',
            left: '0',
            width: '100%',
            fontSize: '34px',
            fontWeight: '900',
            letterSpacing: '0.22em',
            color: INK,
            textAlign: 'center',
            fontFamily: '"Times New Roman", serif',
          }}>
            MARINE
          </div>

        </div>
      </div>
    );
  }
);

WantedPosterPrint.displayName = 'WantedPosterPrint';
export default WantedPosterPrint;
