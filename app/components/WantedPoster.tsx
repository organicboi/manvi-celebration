import React from 'react';

const WantedPoster = () => {
  return (
    <div className="relative w-full max-w-md mx-auto transform hover:rotate-1 hover:scale-105 transition-all duration-500 cursor-pointer group">
      {/* Paper Background */}
      <div className="bg-[#f0e6d2] p-6 shadow-[10px_10px_0px_0px_rgba(45,42,38,0.3)] border-4 border-[#e5e5e5] relative overflow-hidden backdrop-brightness-95">
        
        {/* Paper texture overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply"
             style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
             }}
        ></div>

        {/* Content */}
        <div className="flex flex-col items-center gap-1 relative z-10">
          <h2 className="font-serif text-5xl md:text-7xl tracking-widest text-[#2d2a26] opacity-90 font-bold" style={{ fontFamily: 'var(--font-cinzel)' }}>
            WANTED
          </h2>
          
          <div className="flex gap-4 w-full justify-center -mt-2 mb-2">
            <span className="font-serif text-sm md:text-xl tracking-wider text-[#2d2a26] font-bold">DEAD OR ALIVE</span>
          </div>

          {/* Image Container */}
          <div className="w-full aspect-[4/3] bg-[#2d2a26] border-4 border-[#8B4513] relative mb-4 overflow-hidden shadow-inner">
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-900 group-hover:scale-110 transition-transform duration-700">
              <img 
                src="/wanted-poster.png" 
                alt="Manvi - The Pirate Queen" 
                className="w-full h-full object-cover object-top"
              />
            </div>
            {/* Overlay for aesthetic */}
            <div className="absolute inset-0 bg-sepia opacity-20 mix-blend-overlay"></div>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl text-[#2d2a26] font-bold uppercase tracking-wide mb-0 leading-none" style={{ fontFamily: 'var(--font-cinzel)' }}>
            MANVI
          </h1>
          
          <div className="w-[95%] border-t-4 border-[#2d2a26] my-2"></div>
          
          <div className="flex items-end gap-2 w-full pl-4">
            <span className="font-bold text-xl mb-1 text-[#2d2a26]">฿</span>
            <span className="font-serif text-3xl md:text-5xl font-bold tracking-widest text-[#2d2a26]" style={{ fontFamily: '"Times New Roman", serif' }}>
              5,000,000,000-
            </span>
          </div>
          
          <div className="absolute bottom-6 right-4 text-sm font-serif font-bold opacity-80 rotate-[-5deg] border-2 border-[#2d2a26] px-2 py-0.5 rounded">
            MARINE
          </div>
        </div>
      </div>
      
      {/* Pin/Tape effect */}
      <div className="absolute -top-3 inset-x-0 flex justify-center z-20">
         <div className="w-4 h-4 rounded-full bg-red-800 border-2 border-black shadow-lg"></div>
      </div>
    </div>
  );
};

export default WantedPoster;
