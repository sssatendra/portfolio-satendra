'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Sparkles, Check, ChevronLeft, Layout } from 'lucide-react';

const THEMES = [
  {
    id: 'lattice',
    name: 'Distributed Mesh',
    desc: 'Glowing node lattice representing server topology.',
    color: 'bg-blue-500'
  },
  {
    id: 'waves',
    name: 'Digital Waves',
    desc: 'Simplex-noise particle waves simulating data flow oceans.',
    color: 'bg-teal-500'
  },
  {
    id: 'universe',
    name: 'Nebula Galaxy',
    desc: 'Rotating stellar gas dust visualizing continuous compute.',
    color: 'bg-purple-500'
  },
  {
    id: 'galaxy',
    name: 'Cosmic Starfield',
    desc: 'Your original rotating deep space universe galaxy.',
    color: 'bg-blue-400'
  },
  {
    id: 'geometry',
    name: 'Spatial Geometry',
    desc: 'Floating glassmorphic wireframe objects drifting in 3D.',
    color: 'bg-indigo-500'
  },
  {
    id: 'vortex',
    name: 'Quantum Vortex',
    desc: 'Swirling gravitational particle cyclonic orbits.',
    color: 'bg-sky-400'
  },
  {
    id: 'matrix',
    name: 'Cybernetic Rain',
    desc: 'Cascading emerald data cascade streams falling in space.',
    color: 'bg-emerald-500'
  },
  {
    id: 'aurora',
    name: 'Aurora Ribbons',
    desc: 'Wavy parallel glowing neon aurora pipeline trails.',
    color: 'bg-pink-500'
  },
  {
    id: 'cybergrid',
    name: 'Retro Synthwave',
    desc: 'Classic neon perspective grid flowing toward the screen.',
    color: 'bg-rose-500'
  }
];

export default function BackgroundSwitcher({ theme, setTheme }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[320px] max-w-[calc(100vw-2rem)] glass border border-white/10 rounded-[2.5rem] p-6 shadow-2xl flex flex-col gap-4 overflow-hidden mb-2"
          >
            {/* Header Title */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em]">3D Ambient Theme</h4>
              </div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                {THEMES.findIndex(t => t.id === theme) + 1} of {THEMES.length}
              </span>
            </div>

            {/* List of themes */}
            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
              {THEMES.map((t) => {
                const isActive = t.id === theme;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setIsOpen(false); // Auto-close popup on selection
                    }}
                    className={`flex items-start text-left p-3.5 rounded-2xl border transition-all cursor-pointer group ${
                      isActive
                        ? 'bg-blue-600/10 border-blue-500/30'
                        : 'bg-white/2 border-transparent hover:bg-white/5 hover:border-white/5'
                    }`}
                  >
                    {/* Theme visual color indicator badge */}
                    <div className="mt-1 mr-3 shrink-0 flex items-center justify-center">
                      <div className={`w-3.5 h-3.5 rounded-full ${t.color} flex items-center justify-center shadow-lg relative`}>
                        {isActive && (
                          <motion.div
                            layoutId="activeDot"
                            className="absolute inset-0 border-2 border-white rounded-full flex items-center justify-center"
                          >
                            <Check className="w-1.5 h-1.5 text-white" strokeWidth={4} />
                          </motion.div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h5 className={`text-xs font-bold transition-colors ${isActive ? 'text-blue-400' : 'text-gray-300 group-hover:text-white'}`}>
                        {t.name}
                      </h5>
                      <p className="text-[10px] text-gray-500 leading-normal mt-0.5 font-light">
                        {t.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="text-[9px] text-center text-gray-600 uppercase tracking-widest border-t border-white/5 pt-3">
              Persistence Active • localStorage
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Trigger Circle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer relative border border-white/10 group shadow-blue-600/30"
        aria-label="Customize background mode"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft className="w-5 h-5 translate-x-[1px]" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Layout className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Soft pulsing external orbit halo */}
        <div className="absolute inset-0 border border-blue-500 rounded-full animate-ping opacity-15 scale-110 pointer-events-none group-hover:scale-125 transition-all"></div>
      </motion.button>
    </div>
  );
}
