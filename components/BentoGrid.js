'use client';

import { motion } from 'framer-motion';
import { TrendingDown, Zap, BarChart3, Smartphone, ExternalLink } from 'lucide-react';

const achievements = [
  {
    title: '96% Latency Reduction',
    subtitle: 'Systems Architecture',
    description: 'Optimized high-resource grid calculations from 40m to 90s using core engine refactoring.',
    icon: <Zap className="w-5 h-5 text-yellow-400" />,
    className: 'md:col-span-2 md:row-span-1',
    gradient: 'from-yellow-500/10 to-transparent'
  },
  {
    title: 'Quant Engine',
    subtitle: 'FinTech',
    description: 'Automated options trading platform with Python/Flask.',
    icon: <TrendingDown className="w-5 h-5 text-green-400" />,
    className: 'md:col-span-1 md:row-span-1',
    gradient: 'from-green-500/10 to-transparent'
  },
  {
    title: 'BI Expert',
    subtitle: 'Data Analytics',
    description: 'Enterprise Apache Superset customization & insights.',
    icon: <BarChart3 className="w-5 h-5 text-blue-400" />,
    className: 'md:col-span-1 md:row-span-1',
    gradient: 'from-blue-500/10 to-transparent'
  },
  {
    title: 'Enterprise Mobile',
    subtitle: 'App Development',
    description: 'Developing scalable business-critical apps with Expo and React Native.',
    icon: <Smartphone className="w-5 h-5 text-purple-400" />,
    className: 'md:col-span-2 md:row-span-1',
    gradient: 'from-purple-500/10 to-transparent'
  },
];

export default function BentoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">
      {achievements.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          viewport={{ once: true }}
          className={`glass p-8 rounded-[2.5rem] flex flex-col justify-between group relative overflow-hidden h-full min-h-[16rem] ${item.className}`}
        >
          {/* Background Gradient Detail */}
          <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-colors shadow-inner">
                {item.icon}
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 group-hover:text-gray-300 transition-colors">
                {item.subtitle}
              </div>
            </div>
            
            <h3 className="text-2xl font-bold mb-3 tracking-tight group-hover:text-blue-400 transition-colors">
              {item.title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-[90%]">
              {item.description}
            </p>
          </div>

          <div className="relative z-10 mt-8 flex justify-end">
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all opacity-0 group-hover:opacity-100">
              <ExternalLink className="w-3 h-3 text-blue-400" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
