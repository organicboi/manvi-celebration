'use client';

import React, { useState, useEffect, useRef } from 'react';
import WantedPoster from './components/WantedPoster';

export default function Home() {
  const [chestOpen, setChestOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Simulate a loading "To Be Continued" screen
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-end justify-end p-10 z-50">
        <div className="text-right">
          <h2 className="text-white text-4xl font-bold font-serif italic mb-2 tracking-widest text-[#d9aa52]">TO BE CONTINUED</h2>
          <div className="border-t-4 border-[#d9aa52] w-64 ml-auto"></div>
          <p className="text-gray-500 text-sm mt-2">Loading the Grand Line...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center overflow-x-hidden relative">
      
      {/* Audio Element (Hidden) */}
      <audio ref={audioRef} loop>
        <source src="/binks-sake.mp3" type="audio/mpeg" />
      </audio>

      {/* Den Den Mushi Audio Control (Floating) */}
      <div 
        onClick={toggleAudio}
        className="fixed bottom-6 right-6 z-50 cursor-pointer animate-float hover:scale-110 transition-transform"
        title={isPlaying ? "Mute Bink's Sake" : "Play Bink's Sake"}
      >
        <div className="relative">
          <div className={`w-16 h-16 bg-pink-300 rounded-full border-4 border-[#2d2a26] flex items-center justify-center shadow-xl ${isPlaying ? 'animate-pulse' : ''}`}>
             <span className="text-2xl">🐌</span>
          </div>
          <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold border-2 border-white">
            {isPlaying ? 'ON' : 'OFF'}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="w-full min-h-screen flex flex-col items-center justify-center py-20 relative bg-[#89CFF0] overflow-hidden">
        
        {/* Seagulls (News Coo) */}
        <div className="absolute top-20 left-10 text-4xl opacity-50 animate-bounce">🕊️</div>
        <div className="absolute top-10 right-20 text-3xl opacity-40 animate-pulse">🕊️</div>

        {/* Clouds / Sky Background Effect (Simplified) */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-300 via-blue-200 to-white opacity-50 z-0"></div>

        <div className="z-10 text-center mb-10 px-4">
          <div className="inline-block bg-black text-white px-4 py-1 mb-4 transform -rotate-2 font-bold tracking-widest border-2 border-white shadow-lg">
             THE 5TH EMPEROR
          </div>
          <h1 className="text-5xl md:text-8xl font-bold text-[#d92121] drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] mb-4 font-one-piece stroke-black">
            PIRATE QUEEN
          </h1>
          <p className="text-xl md:text-2xl text-blue-900 font-serif italic max-w-2xl mx-auto">
            "I'm gonna be the King of the Pirates! But first... it's time to party!"
          </p>
        </div>

        <div className="z-10 px-4 scale-90 md:scale-100 transition-transform">
          <WantedPoster />
        </div>

        <div className="absolute bottom-10 animate-bounce cursor-pointer z-10" onClick={() => {
          document.getElementById('adventure')?.scrollIntoView({ behavior: 'smooth' });
        }}>
           <div className="flex flex-col items-center gap-2">
             <span className="font-bold text-[#8B4513] text-sm bg-white/80 px-2 py-1 rounded">SET SAIL</span>
             <svg className="w-10 h-10 text-red-600 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
             </svg>
           </div>
        </div>
      </section>

      {/* The Map / Adventure Section */}
      <section id="adventure" className="w-full py-20 px-4 bg-[#fdf6e3] relative devil-fruit-pattern">
        
        {/* Log Pose Navigation Indicator (Visual Only) */}
        <div className="absolute left-4 top-10 hidden md:flex flex-col items-center gap-1 opacity-60">
           <div className="w-12 h-12 rounded-full border-4 border-[#fbbf24] bg-white/50 flex items-center justify-center">
              <div className="w-1 h-6 bg-red-600 rounded-full transform rotate-45 origin-bottom"></div>
           </div>
           <span className="text-xs font-bold text-[#8B4513]">LOG FLIGHT</span>
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl text-center mb-16 text-[#8B4513] font-one-piece drop-shadow-sm">
            LOG POSE MEMORIES
          </h2>

          <div className="relative border-l-4 border-dashed border-[#8B4513] ml-6 md:ml-auto md:mr-auto pl-8 md:pl-0">
             {/* Timeline Item 1 */}
             <div className="mb-20 flex flex-col md:flex-row items-center w-full group">
                <div className="w-10 h-10 bg-red-600 rounded-full absolute left-[-1.4rem] border-4 border-[#fdf6e3] md:left-1/2 md:-ml-5 z-10 flex items-center justify-center text-white font-bold text-xs shadow-lg">1</div>
                <div className="md:w-1/2 md:pr-12 md:text-right order-1 transition-all duration-300 group-hover:-translate-x-2">
                  <h3 className="text-2xl font-bold text-[#8B4513] mb-2 font-serif">The Treasure of Beauty</h3>
                  <p className="text-gray-700 italic">"Rumor has it even the Pirate Empress Boa Hancock is jealous! A beauty that outshines the sun itself."</p>
                </div>
                <div className="md:w-1/2 md:pl-12 order-2 mt-4 md:mt-0 transition-all duration-300 group-hover:translate-x-2">
                   <div className="bg-white p-3 shadow-xl transform rotate-[-2deg] w-64 h-48 mx-auto md:mx-0 flex items-center justify-center bg-gray-100 border border-gray-300 overflow-hidden">
                       <img 
                          src="/beautiful.jpg" 
                          alt="Manvi's Beauty" 
                          className="w-full h-full object-cover"
                        />
                   </div>
                </div>
             </div>

             {/* Timeline Item 2 */}
             <div className="mb-20 flex flex-col md:flex-row items-center w-full group">
                <div className="w-10 h-10 bg-blue-600 rounded-full absolute left-[-1.4rem] border-4 border-[#fdf6e3] md:left-1/2 md:-ml-5 z-10 flex items-center justify-center text-white font-bold text-xs shadow-lg">2</div>
                <div className="md:w-1/2 md:pr-12 md:text-right order-1 md:order-2 md:text-left transition-all duration-300 group-hover:translate-x-2">
                  <h3 className="text-2xl font-bold text-[#8B4513] mb-2 font-serif">The Grand Line</h3>
                  <p className="text-gray-700 italic">"Surviving the calm belts and storrms together."</p>
                </div>
                 <div className="md:w-1/2 md:pl-12 order-2 md:order-1 md:text-right mt-4 md:mt-0 transition-all duration-300 group-hover:-translate-x-2"> 
                   <div className="bg-white p-3 shadow-xl transform rotate-[3deg] w-64 h-48 mx-auto md:ml-auto flex items-center justify-center bg-gray-100 border border-gray-300">
                      {/* <span className="text-gray-400 font-serif">Best Memory</span> */}
                       <img 
                src="/best-memory.jpg" 
                alt="Manvi - The Pirate Queen" 
                className="w-full h-full object-cover object-top"
              />
                   </div>
                </div>
             </div>
             
             {/* Timeline Item 3 */}
             <div className="mb-20 flex flex-col md:flex-row items-center w-full group">
                <div className="w-10 h-10 bg-yellow-500 rounded-full absolute left-[-1.4rem] border-4 border-[#fdf6e3] md:left-1/2 md:-ml-5 z-10 flex items-center justify-center text-white font-bold text-xs shadow-lg">3</div>
                <div className="md:w-1/2 md:pr-12 md:text-right order-1 transition-all duration-300 group-hover:-translate-x-2">
                  <h3 className="text-2xl font-bold text-[#8B4513] mb-2 font-serif">New World</h3>
                  <p className="text-gray-700 italic">"To the future Pirate Queen! The adventure continues!"</p>
                </div>
                <div className="md:w-1/2 md:pl-12 order-2 mt-4 md:mt-0 transition-all duration-300 group-hover:translate-x-2">
                   <div className="bg-white p-3 shadow-xl transform rotate-[-1deg] w-64 h-48 mx-auto md:mx-0 flex items-center justify-center bg-gray-100 border border-gray-300">
                      {/* <span className="text-gray-400 font-serif">Recent Chaos</span> */}
                       <img 
                src="/pirate.png" 
                alt="Manvi - The Pirate Queen" 
                className="w-full h-full object-cover object-top"
              />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Nakama Section */}
      <section className="w-full py-20 bg-[#2d2a26] text-[#fdf6e3]">
        <div className="max-w-6xl mx-auto px-4 text-center">
           <div className="mb-12">
             <span className="text-xl text-[#fbbf24] tracking-[0.3em] uppercase">Straw Hat Grand Fleet</span>
             <h2 className="text-4xl md:text-6xl text-white font-one-piece mt-2">
                MESSAGES FROM NAKAMA
             </h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Message 1 */}
              <div className="bg-[#fdf6e3] text-[#2d2a26] p-2 pt-8 pb-4 relative shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white font-bold px-3 py-1 text-sm rounded shadow border-2 border-white">CAPTAIN</div>
                 <div className="border-2 border-[#8B4513] h-full p-4 flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-300 rounded-full mb-4 border-2 border-[#2d2a26] overflow-hidden">
                      {/* Placeholder for sender image */}
                      <div className="w-full h-full flex items-center justify-center text-2xl"> <img 
                src="/frankypfp.png" 
                alt="Manvi - The Pirate Queen" 
                className="w-full h-full object-cover object-top"
              /></div> 
                    </div>
                    <h3 className="font-one-piece text-xl font-bold mb-2">Franky</h3>
                    <p className="italic mb-4 text-sm">"SUPEEERRRR Birthday Manvi! Prepare for a blast!"</p>
                    <div className="mt-auto w-full border-t border-[#8B4513] pt-2 flex justify-between text-xs font-bold opacity-60">
                      <span>BOUNTY:</span>
                      <span>1,000 BERRIES</span>
                    </div>
                 </div>
              </div>

               {/* Message 2 */}
              <div className="bg-[#fdf6e3] text-[#2d2a26] p-2 pt-8 pb-4 relative shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-700 text-white font-bold px-3 py-1 text-sm rounded shadow border-2 border-white">V. CAPTAIN</div>
                 <div className="border-2 border-[#8B4513] h-full p-4 flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-300 rounded-full mb-4 border-2 border-[#2d2a26] overflow-hidden">
                       <div className="w-full h-full flex items-center justify-center text-2xl"> <img 
                src="/zoropfp.jpeg" 
                alt="Manvi - The Pirate Queen" 
                className="w-full h-full object-cover object-top"
              /></div>
                    </div>
                    <h3 className="font-one-piece text-xl font-bold mb-2">Zoro (Bestie)</h3>
                    
                    <p className="italic mb-4 text-sm">"I got lost, but I found my way here to say HBD!"</p>
                    <div className="mt-auto w-full border-t border-[#8B4513] pt-2 flex justify-between text-xs font-bold opacity-60">
                      <span>BOUNTY:</span>
                      <span>1,111,000,000-</span>
                    </div>
                 </div>
              </div>

               {/* Message 3 */}
              <div className="bg-[#fdf6e3] text-[#2d2a26] p-2 pt-8 pb-4 relative shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-600 text-white font-bold px-3 py-1 text-sm rounded shadow border-2 border-white">COOK</div>
                 <div className="border-2 border-[#8B4513] h-full p-4 flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-300 rounded-full mb-4 border-2 border-[#2d2a26] overflow-hidden">
                       <div className="w-full h-full flex items-center justify-center text-2xl"> <img 
                src="/sanjipfp.jpg" 
                alt="Manvi - The Pirate Queen" 
                className="w-full h-full object-cover object-top"
              /></div>
                    </div>
                    <h3 className="font-one-piece text-xl font-bold mb-2">Sanji (Brother)</h3>
                    <p className="italic mb-4 text-sm">"Manvi-chwan! You are the sweetest ingredient of our lives! &lt;3"</p>
                    <div className="mt-auto w-full border-t border-[#8B4513] pt-2 flex justify-between text-xs font-bold opacity-60">
                      <span>BOUNTY:</span>
                      <span>1,032,000,000-</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

        {/* The One Piece (Treasure Reveal) */}
      <section className="w-full min-h-[90vh] py-20 bg-[#0ea5e9] flex flex-col items-center justify-center relative overflow-hidden">
         {/* Ocean Waves (Simple CSS shapes) */}
         <div className="absolute inset-0 opacity-30">
             <div className="absolute bottom-0 left-0 w-full h-40 bg-white opacity-20 transform skew-y-2"></div>
             <div className="absolute bottom-10 left-0 w-full h-40 bg-white opacity-10 transform -skew-y-3"></div>
         </div>

         <div className="z-10 text-center w-full max-w-4xl px-4">
            {!chestOpen ? (
                <div className="cursor-pointer group flex flex-col items-center" onClick={() => setChestOpen(true)}>
                    <div className="relative w-72 h-60 md:w-96 md:h-72 transition-transform duration-500 group-hover:scale-105">
                        {/* Chest Base */}
                        <div className="absolute bottom-0 w-full h-2/3 bg-[#8B4513] border-4 border-[#3e1f10] rounded-b-xl shadow-2xl flex items-center justify-center">
                           <div className="w-full h-4 bg-black opacity-20 absolute top-2"></div>
                           <div className="w-16 h-20 bg-[#fbbf24] border-2 border-[#8B4513] rounded flex items-center justify-center shadow-lg">
                              <div className="w-3 h-5 bg-black rounded-full"></div>
                           </div>
                        </div>
                        {/* Chest Lid (Closed) */}
                        <div className="absolute top-0 w-full h-1/3 bg-[#a0522d] border-4 border-[#3e1f10] rounded-t-full origin-bottom transition-transform duration-500 z-20 group-hover:-translate-y-2">
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-2 bg-[#5c2e0e]"></div>
                        </div>
                    </div>
                     
                     <h2 className="text-4xl text-white font-bold mt-12 shadow-black drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] font-one-piece tracking-wider animate-bounce">
                         CLAIM THE ONE PIECE
                     </h2>
                </div>
            ) : (
                <div className="animate-fade-in-up w-full">
                    <div className="bg-[#fdf6e3]/95 backdrop-blur-sm p-8 md:p-12 rounded-lg shadow-2xl border-8 border-[#fbbf24] relative max-w-3xl mx-auto">
                         {/* Decoration corner marks */}
                         <div className="absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-red-600"></div>
                         <div className="absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-red-600"></div>
                         <div className="absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-red-600"></div>
                         <div className="absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-red-600"></div>

                         <div className="flex justify-center ">
                            {/* Devil Fruit SVG (Simplified Ope Ope Style) */}
                             <img 
                src="/hat.png" 
                alt="Manvi - The Pirate Queen" 
                className="w-full h-full object-cover object-top"
              />
                         </div>

                         <h2 className="text-4xl md:text-6xl text-[#d92121] font-bold text-center mb-6 font-one-piece">
                             HAPPY BIRTHDAY MANVI!
                         </h2>
                         <p className="text-lg md:text-2xl text-center text-[#2d2a26] leading-relaxed mb-8 font-serif italic">
                             "This hat... means a lot to me. I want you to take care of it for me."
                             <br/><br/>
                             Just kidding! But you truly are our treasure. May your year be filled with adventures, feasts, and minimal danger!
                         </p>
                         
                         <div className="flex justify-center gap-4">
                            <button 
                               onClick={() => setChestOpen(false)}
                               className="px-8 py-3 bg-[#d92121] text-white rounded font-bold hover:bg-red-700 transition-colors uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none"
                             >
                                Close Chest
                             </button>
                         </div>
                    </div>
                </div>
            )}
         </div>
      </section>

      <footer className="w-full py-8 bg-[#1a1a1a] text-gray-400 text-center text-sm border-t-4 border-[#d92121]">
        <p className="font-one-piece tracking-widest mb-2">THE PIRATE ALLIANCE</p>
        <p>Made with ❤️ for Manvi</p>
      </footer>
    </main>
  );
}
