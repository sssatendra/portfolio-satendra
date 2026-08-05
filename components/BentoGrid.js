'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Zap, Activity, Smartphone, ArrowUpRight, ShieldCheck, Code2 } from 'lucide-react';

const achievements = [
  {
    title: '96% Latency Reduction',
    subtitle: 'Financial Engineering',
    badge: '⚡ 40m → 90s Engine',
    description: 'Refactored core BI calculation engines to reduce processing time from 40 minutes to under 90 seconds.',
    tech: ['Python', 'Flask', 'PostgreSQL'],
    icon: <Zap className="w-5 h-5 text-amber-400" />,
    className: 'md:col-span-2 md:row-span-1',
    borderColor: 'border-amber-500/30',
    gradient: 'from-amber-500/15 via-yellow-500/5 to-transparent'
  },
  {
    title: 'Algo Trading Engine',
    subtitle: 'FinTech Architecture',
    badge: 'Kite API Live',
    description: 'Owned end-to-end design of a production-grade options trading platform with Zerodha Kite API.',
    tech: ['Celery', 'Redis', 'WebSockets'],
    icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
    className: 'md:col-span-1 md:row-span-1',
    borderColor: 'border-emerald-500/30',
    gradient: 'from-emerald-500/15 via-teal-500/5 to-transparent'
  },
  {
    title: 'Real-time Analytics',
    subtitle: 'Systems Design',
    badge: 'Apache Superset',
    description: 'Architected scalable backend analytics using Python/Flask and Superset pivot reporting modules.',
    tech: ['React.js', 'BI Pipelines'],
    icon: <Activity className="w-5 h-5 text-blue-400" />,
    className: 'md:col-span-1 md:row-span-1',
    borderColor: 'border-blue-500/30',
    gradient: 'from-blue-500/15 via-indigo-500/5 to-transparent'
  },
  {
    title: 'ERP Mobile Suite',
    subtitle: 'Mobile Logistics',
    badge: 'Epicor ERP Sync',
    description: 'Spearheaded React Native apps for warehouse logistics with barcode-driven Epicor ERP synchronization.',
    tech: ['React Native', 'Expo', 'REST APIs'],
    icon: <Smartphone className="w-5 h-5 text-purple-400" />,
    className: 'md:col-span-2 md:row-span-1',
    borderColor: 'border-purple-500/30',
    gradient: 'from-purple-500/15 via-pink-500/5 to-transparent'
  },
];

export default function BentoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-min">
      {achievements.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5, scale: 1.01 }}
          transition={{ duration: 0.3, delay: i * 0.08 }}
          viewport={{ once: true }}
          className={`glass-card p-6 sm:p-7 rounded-3xl border ${item.borderColor} flex flex-col justify-between group relative overflow-hidden h-full min-h-[17rem] shadow-xl ${item.className}`}
        >
          {/* Ambient Glow */}
          <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-5">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-white/10 transition-colors shadow-inner">
                {item.icon}
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-white/5 text-blue-300 border border-white/10">
                    {item.badge}
                  </span>
                )}
                <span className="text-[10px] uppercase font-mono font-bold text-gray-400 group-hover:text-gray-200 transition-colors">
                  {item.subtitle}
                </span>
              </div>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2.5 tracking-tight group-hover:text-blue-300 transition-colors">
              {item.title}
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-light mb-4">
              {item.description}
            </p>
          </div>

          <div className="relative z-10 pt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {item.tech.map((t, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-white/5 text-gray-400 text-[10px] font-mono rounded border border-white/5">
                  {t}
                </span>
              ))}
            </div>
            <div className="p-1.5 rounded-xl border border-white/10 bg-white/5 text-gray-400 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-all">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
