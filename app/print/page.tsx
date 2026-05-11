'use client';

import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import WantedPosterPrint from '../components/WantedPosterPrint';

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

export default function PrintPage() {
  const [name, setName] = useState('MANVI');
  const [bounty, setBounty] = useState('5,000,000,000');
  const [imageUrl, setImageUrl] = useState('/wanted-poster.png');
  const [imageName, setImageName] = useState('Default image');
  const [isGenerating, setIsGenerating] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Image position (0–100)
  const [imageOffsetX, setImageOffsetX] = useState(50);
  const [imageOffsetY, setImageOffsetY] = useState(50);

  // Photo drag tracking (refs avoid stale closures in pointermove)
  const isDraggingPhoto  = useRef(false);
  const [isDraggingState, setIsDraggingState] = useState(false); // drives cursor
  const dragData = useRef({ startX: 0, startY: 0, startOX: 50, startOY: 50 });

  const posterRef         = useRef<HTMLDivElement>(null);
  const photoContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef      = useRef<HTMLInputElement>(null);

  /* ── Image upload ── */
  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target?.result as string);
      setImageName(file.name);
      setImageOffsetX(50);
      setImageOffsetY(50);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  /* ── Bounty formatting ── */
  const handleBountyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    if (!raw) { setBounty(''); return; }
    setBounty(Number(raw).toLocaleString('en-US'));
  };

  /* ── Photo drag-to-reposition ── */
  const handlePhotoPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    isDraggingPhoto.current = true;
    setIsDraggingState(true);
    dragData.current = { startX: e.clientX, startY: e.clientY, startOX: imageOffsetX, startOY: imageOffsetY };
  }, [imageOffsetX, imageOffsetY]);

  const handlePhotoPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingPhoto.current || !posterRef.current || !photoContainerRef.current) return;
    const posterRect = posterRef.current.getBoundingClientRect();
    const scale      = posterRect.width / 595;
    const photoRect  = photoContainerRef.current.getBoundingClientRect();
    const photoNatW  = photoRect.width  / scale;
    const photoNatH  = photoRect.height / scale;
    const dx = (e.clientX - dragData.current.startX) / scale;
    const dy = (e.clientY - dragData.current.startY) / scale;
    setImageOffsetX(clamp(dragData.current.startOX - (dx / photoNatW) * 100, 0, 100));
    setImageOffsetY(clamp(dragData.current.startOY - (dy / photoNatH) * 100, 0, 100));
  }, []);

  const handlePhotoPointerUp = useCallback(() => {
    isDraggingPhoto.current = false;
    setIsDraggingState(false);
  }, []);

  /* ── PDF generation ── */
  const downloadPDF = async () => {
    if (!posterRef.current || isGenerating) return;
    setIsGenerating(true);
    try {
      await document.fonts.ready;

      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF }   = await import('jspdf');

      const originalNode = posterRef.current;
      const clone = originalNode.cloneNode(true) as HTMLElement;
      
      const offScreenContainer = document.createElement('div');
      offScreenContainer.style.position = 'absolute';
      offScreenContainer.style.top = '-9999px';
      offScreenContainer.style.left = '-9999px';
      offScreenContainer.style.width = '595px';
      offScreenContainer.style.height = '842px';
      offScreenContainer.appendChild(clone);
      
      document.body.appendChild(offScreenContainer);

      const canvas = await html2canvas(clone, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#e6dac3',
        logging: false,
        imageTimeout: 15000,
      });
      
      document.body.removeChild(offScreenContainer);

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData, 'JPEG', 0, 0, 595.28, 841.89);
      pdf.save(`${(name || 'wanted').replace(/\s+/g, '-').toLowerCase()}-wanted-poster.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Could not generate PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  /* ── Browser print ── */
  const handlePrint = () => window.print();

  return (
    <>
      {/* ══════════ Print-only: just show the poster ══════════ */}
      <style>{`
        @page {
          size: A4 portrait;
          margin: 0;
        }
        @media print {
          body, html {
            margin: 0 !important;
            padding: 0 !important;
            background: none !important;
          }
          body * { visibility: hidden !important; }
          #print-poster-wrapper,
          #print-poster-wrapper * { visibility: visible !important; }
          #print-poster-wrapper {
            position: absolute !important;
            top: 0; left: 0;
            margin: 0 !important;
            padding: 0 !important;
            z-index: 99999;
          }
          /* Strip the 3D rotation and shadow for print so it prints flat */
          #print-poster-wrapper > div {
            transform: none !important;
            filter: none !important;
            box-shadow: none !important;
          }
          #print-poster-wrapper .bg-red-700 {
            display: none !important; /* Hide the push-pin when printing */
          }
          /* Ensure the poster component keeps its exact pixel dimensions and scales nicely */
          .poster-scale-wrapper {
            transform: scale(1) !important;
            margin: 0 !important;
          }
          #wanted-poster-print {
            width: 595px !important;
            height: 842px !important;
            margin: 0 auto !important;
          }
        }

        /* Themed range sliders */
        .op-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          background: #c9b68e;
          border: 1.5px solid #8b6045;
          outline: none;
          cursor: pointer;
        }
        .op-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px; height: 18px;
          background: #2d2a26;
          border: 2px solid #fbbf24;
          border-radius: 50%;
          cursor: grab;
        }
        .op-slider::-webkit-slider-thumb:active { cursor: grabbing; }
        .op-slider::-moz-range-thumb {
          width: 18px; height: 18px;
          background: #2d2a26;
          border: 2px solid #fbbf24;
          border-radius: 50%; cursor: grab;
        }

        /* Responsive poster scaling */
        .poster-scale-wrapper { transform: scale(1); transform-origin: top center; }
        @media (max-width: 1023px) {
          .poster-scale-wrapper {
            transform: scale(0.62);
            transform-origin: top center;
            margin-bottom: calc((842px * 0.62) - 842px);
          }
          #print-poster-wrapper { width: calc(595px * 0.62) !important; }
        }
        @media (max-width: 639px) {
          .poster-scale-wrapper {
            transform: scale(0.52);
            transform-origin: top center;
            margin-bottom: calc((842px * 0.52) - 842px);
          }
          #print-poster-wrapper { width: calc(595px * 0.52) !important; }
        }
        @media (max-width: 400px) {
          .poster-scale-wrapper {
            transform: scale(0.44);
            transform-origin: top center;
            margin-bottom: calc((842px * 0.44) - 842px);
          }
          #print-poster-wrapper { width: calc(595px * 0.44) !important; }
        }
      `}</style>

      <div className="min-h-screen bg-[#89CFF0] relative overflow-x-hidden">

        {/* ── Background sky gradient ── */}
        <div className="absolute inset-0 bg-linear-to-b from-blue-300 via-blue-200 to-[#fdf6e3] opacity-60 pointer-events-none" />

        {/* ══════════ HEADER ══════════ */}
        <header className="relative z-10 w-full py-4 px-4 md:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 group"
            >
              <div className="w-9 h-9 bg-[#2d2a26] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-[#fbbf24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </div>
              <span className="font-bold text-[#2d2a26] text-sm hidden sm:block" style={{ fontFamily: 'var(--font-cinzel)' }}>
                Back to Sea
              </span>
            </Link>

            <div className="text-center">
              <div className="inline-block bg-[#2d2a26] text-[#fbbf24] px-3 py-1 text-xs font-bold tracking-[0.3em] uppercase mb-1">
                MARINE HQ
              </div>
              <h1
                className="text-2xl md:text-3xl font-black text-[#2d2a26] leading-none"
                style={{ fontFamily: 'var(--font-cinzel)' }}
              >
                WANTED POSTER
              </h1>
              <p className="text-xs text-[#5c3a1e] font-semibold tracking-widest">POSTER GENERATOR</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="hidden sm:flex items-center gap-1.5 bg-white/80 hover:bg-white text-[#2d2a26] font-bold px-3 py-2 rounded-lg border-2 border-[#2d2a26] transition-all text-sm shadow-md hover:shadow-lg"
                style={{ fontFamily: 'var(--font-cinzel)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
            </div>
          </div>
        </header>

        {/* ══════════ MAIN CONTENT ══════════ */}
        <main className="relative z-10 w-full max-w-7xl mx-auto px-4 pb-12 pt-2">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start justify-center">

            {/* ══ LEFT: CONTROLS PANEL ══ */}
            <div className="w-full lg:w-90 shrink-0 order-2 lg:order-1">
              <div className="bg-[#fdf6e3] border-4 border-[#2d2a26] shadow-[6px_6px_0_rgba(45,42,38,0.4)] relative">

                {/* Panel header */}
                <div className="bg-[#2d2a26] px-5 py-3 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span
                    className="ml-2 text-[#fbbf24] text-sm font-bold tracking-widest uppercase"
                    style={{ fontFamily: 'var(--font-cinzel)' }}
                  >
                    Customize Poster
                  </span>
                </div>

                <div className="p-5 space-y-5">

                  {/* ── Name ── */}
                  <div>
                    <label className="block text-xs font-bold tracking-[0.2em] text-[#5c3a1e] uppercase mb-2" style={{ fontFamily: 'var(--font-cinzel)' }}>
                      Pirate Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value.toUpperCase())}
                      maxLength={30}
                      placeholder="ENTER NAME"
                      className="w-full bg-[#c9b68e]/40 border-2 border-[#8b6045] text-[#1a0e04] font-bold text-lg px-3 py-2.5 outline-none focus:border-[#2d2a26] transition-colors placeholder:text-[#8b6045]/60 placeholder:text-base"
                      style={{ fontFamily: 'var(--font-cinzel)' }}
                    />
                    <div className="text-right text-xs text-[#8b6045] mt-1">{name.length}/30</div>
                  </div>

                  {/* ── Bounty ── */}
                  <div>
                    <label className="block text-xs font-bold tracking-[0.2em] text-[#5c3a1e] uppercase mb-2" style={{ fontFamily: 'var(--font-cinzel)' }}>
                      Bounty (Berries ฿)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl font-black text-[#2d2a26]">฿</span>
                      <input
                        type="text"
                        value={bounty}
                        onChange={handleBountyChange}
                        placeholder="0"
                        className="w-full bg-[#c9b68e]/40 border-2 border-[#8b6045] text-[#1a0e04] font-bold text-lg px-3 py-2.5 pl-9 outline-none focus:border-[#2d2a26] transition-colors"
                        style={{ fontFamily: '"Times New Roman", serif' }}
                      />
                    </div>
                    {/* Quick presets */}
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {['100,000,000', '320,000,000', '1,500,000,000', '3,000,000,000'].map(b => (
                        <button
                          key={b}
                          onClick={() => setBounty(b)}
                          className="text-xs bg-[#2d2a26]/10 hover:bg-[#2d2a26] hover:text-[#fbbf24] text-[#5c3a1e] px-2 py-1 border border-[#8b6045] transition-all font-bold"
                          style={{ fontFamily: '"Times New Roman", serif' }}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ── Image upload ── */}
                  <div>
                    <label className="block text-xs font-bold tracking-[0.2em] text-[#5c3a1e] uppercase mb-2" style={{ fontFamily: 'var(--font-cinzel)' }}>
                      Poster Photo
                    </label>
                    <div
                      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative cursor-pointer border-2 border-dashed transition-all p-4 text-center
                        ${dragOver
                          ? 'border-[#2d2a26] bg-[#c9b68e]/60'
                          : 'border-[#8b6045] hover:border-[#2d2a26] hover:bg-[#c9b68e]/30 bg-[#c9b68e]/20'
                        }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <div className="flex items-center gap-3">
                        {/* Thumbnail with current position */}
                        <div className="w-16 h-16 border-2 border-[#8b6045] overflow-hidden shrink-0 bg-[#2d2a26]">
                          {imageUrl && (
                            <img
                              src={imageUrl}
                              alt="Preview"
                              style={{ objectPosition: `${imageOffsetX}% ${imageOffsetY}%` }}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold text-[#2d2a26]" style={{ fontFamily: 'var(--font-cinzel)' }}>
                            {dragOver ? 'Drop it here!' : 'Click or drag image'}
                          </p>
                          <p className="text-xs text-[#8b6045] mt-0.5 truncate max-w-40">{imageName}</p>
                          <p className="text-xs text-[#8b6045]/70 mt-0.5">JPG, PNG, WEBP</p>
                        </div>
                      </div>
                    </div>
                    {imageUrl !== '/wanted-poster.png' && (
                      <button
                        onClick={() => { setImageUrl('/wanted-poster.png'); setImageName('Default image'); setImageOffsetX(50); setImageOffsetY(50); }}
                        className="text-xs text-[#8b6045] hover:text-[#2d2a26] mt-1 underline transition-colors"
                      >
                        Use default image
                      </button>
                    )}
                  </div>

                  {/* ── Photo position controls ── */}
                  <div className="border-t-2 border-dashed border-[#8b6045]/50 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-bold tracking-[0.2em] text-[#5c3a1e] uppercase" style={{ fontFamily: 'var(--font-cinzel)' }}>
                        Photo Position
                      </label>
                      <button
                        onClick={() => { setImageOffsetX(50); setImageOffsetY(50); }}
                        className="text-xs text-[#8b6045] hover:text-[#2d2a26] underline transition-colors"
                      >
                        Reset
                      </button>
                    </div>

                    {/* Horizontal */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-[#8b6045] mb-1.5">
                        <span>← Left</span>
                        <span className="font-bold text-[#2d2a26]">{Math.round(imageOffsetX)}%</span>
                        <span>Right →</span>
                      </div>
                      <input
                        type="range" min={0} max={100} step={1}
                        value={imageOffsetX}
                        onChange={e => setImageOffsetX(Number(e.target.value))}
                        className="op-slider"
                      />
                    </div>

                    {/* Vertical */}
                    <div>
                      <div className="flex justify-between text-xs text-[#8b6045] mb-1.5">
                        <span>↑ Top</span>
                        <span className="font-bold text-[#2d2a26]">{Math.round(imageOffsetY)}%</span>
                        <span>Bottom ↓</span>
                      </div>
                      <input
                        type="range" min={0} max={100} step={1}
                        value={imageOffsetY}
                        onChange={e => setImageOffsetY(Number(e.target.value))}
                        className="op-slider"
                      />
                    </div>

                    <p className="text-xs text-[#8b6045]/70 mt-2 text-center italic">
                      Or drag directly on the photo in the preview
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 pt-2">
                    <button
                      onClick={downloadPDF}
                      disabled={isGenerating}
                      className={`w-full flex items-center justify-center gap-2 py-3.5 font-black text-base tracking-widest uppercase transition-all shadow-[4px_4px_0_rgba(45,42,38,0.4)] hover:shadow-[2px_2px_0_rgba(45,42,38,0.4)] border-2 border-[#2d2a26]
                        ${isGenerating
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-[#d92121] hover:bg-[#b81b1b] text-white hover:translate-x-0.5 hover:translate-y-0.5'
                        }`}
                      style={{ fontFamily: 'var(--font-cinzel)' }}
                    >
                      {isGenerating ? (
                        <>
                          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Generating...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download PDF
                        </>
                      )}
                    </button>

                    <button
                      onClick={handlePrint}
                      className="w-full flex items-center justify-center gap-2 py-3 font-bold text-sm tracking-widest uppercase bg-[#fdf6e3] hover:bg-[#c9b68e] text-[#2d2a26] transition-all border-2 border-[#2d2a26] shadow-[4px_4px_0_rgba(45,42,38,0.4)] hover:shadow-[2px_2px_0_rgba(45,42,38,0.4)] hover:translate-x-0.5 hover:translate-y-0.5"
                      style={{ fontFamily: 'var(--font-cinzel)' }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      Print Poster
                    </button>
                  </div>

                  {/* Tip */}
                  <p className="text-xs text-[#8b6045]/80 text-center italic border-t border-[#8b6045]/30 pt-3">
                    Tip: Use &quot;Print → Save as PDF&quot; for the highest quality output
                  </p>
                </div>
              </div>
            </div>

            {/* ══ RIGHT: POSTER PREVIEW ══ */}
            <div className="w-full lg:flex-1 flex flex-col items-center order-1 lg:order-2">

              {/* Preview label */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-12 bg-[#2d2a26]/40" />
                <span className="text-xs font-bold tracking-[0.3em] text-[#2d2a26] uppercase" style={{ fontFamily: 'var(--font-cinzel)' }}>
                  Live Preview
                </span>
                <div className="h-px w-12 bg-[#2d2a26]/40" />
              </div>

              {/* Poster with shadow/tack effect */}
              <div className="relative" id="print-poster-wrapper" style={{ display: 'inline-block' }}>
                {/* Push-pin */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-red-700 border-2 border-[#1a0e04] shadow-lg z-30" />

                {/* Scaled wrapper */}
                <div
                  className="shadow-2xl"
                  style={{
                    transform: 'rotate(-0.5deg)',
                    transformOrigin: 'top center',
                    filter: `drop-shadow(0 20px 40px rgba(0,0,0,${isDraggingState ? '0.7' : '0.5'}))`,
                    transition: 'filter 0.15s',
                  }}
                >
                  {/* Responsive scale wrapper */}
                  <div
                    className="poster-scale-wrapper"
                    style={{ width: '595px', transformOrigin: 'top center', position: 'relative' }}
                  >
                    <WantedPosterPrint
                      ref={posterRef}
                      name={name}
                      bounty={bounty}
                      imageUrl={imageUrl}
                      imageOffsetX={imageOffsetX}
                      imageOffsetY={imageOffsetY}
                      photoContainerRef={photoContainerRef}
                      onPhotoPointerDown={handlePhotoPointerDown}
                      isInteractive
                    />
                    {/* Pointer-move/up overlay so dragging stays smooth even outside photo */}
                    <div
                      onPointerMove={handlePhotoPointerMove}
                      onPointerUp={handlePhotoPointerUp}
                      onPointerLeave={handlePhotoPointerUp}
                      style={{
                        position: 'absolute', inset: 0, zIndex: 20,
                        cursor: isDraggingState ? 'grabbing' : 'default',
                        pointerEvents: isDraggingState ? 'all' : 'none',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* A4 badge */}
              <div className="mt-4 flex items-center gap-2 text-xs text-[#2d2a26]/60">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                A4 · 210 × 297 mm · Print Ready
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
