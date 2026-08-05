'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import BentoGrid from '../components/BentoGrid';
import resumeData from '../pages/resumeData.json';
import {
  Linkedin,
  Twitter,
  ExternalLink,
  Mail,
  ArrowRight,
  Code2,
  Briefcase,
  GraduationCap,
  User,
  Send,
  Cpu,
  Layers,
  Database,
  Globe,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  Calendar,
  Menu,
  X,
  Check,
  Copy,
  Sparkles,
  Zap,
  Lock,
  Terminal,
  ShieldCheck
} from 'lucide-react';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import GitHubStats from '../components/GitHubStats';


import BackgroundSwitcher from '../components/BackgroundSwitcher';

const BackgroundManager3D = dynamic(() => import('../components/BackgroundManager3D'), { ssr: false });

export default function Home() {
  const { main, resume, portfolio } = resumeData;
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setThemeState] = useState('lattice');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeTab, setActiveTab] = useState('architecture');
  const [skillCategory, setSkillCategory] = useState('all');
  const [projectCategory, setProjectCategory] = useState('all');

  const handleCopyEmail = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(main.email);
    }
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  // Load theme from localStorage on client-side mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme-3d');
    if (savedTheme) {
      setThemeState(savedTheme);
    }
  }, []);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('portfolio-theme-3d', newTheme);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <main className="min-h-screen">
      <BackgroundManager3D theme={theme} />

      {/* Refined Navigation Header */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 px-6 ${scrolled ? 'py-4 glass border-b border-white/10 shadow-2xl' : 'py-8'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 cursor-pointer group z-50"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setIsMobileMenuOpen(false);
            }}
          >
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white group-hover:rotate-6 transition-transform shadow-lg shadow-blue-600/30">
              {main.initial}
            </div>
            <span className="text-xl font-bold tracking-tighter text-white hidden sm:block">
              Satendra<span className="text-blue-500">.</span>
            </span>
          </motion.div>

          <div className="flex items-center gap-10">
            <div className="hidden lg:flex items-center gap-8 text-[13px] font-bold uppercase tracking-[0.1em] text-gray-400">
              <a href="#about" className="hover:text-white transition-colors relative group">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
              </a>
              <a href="#skills" className="hover:text-white transition-colors relative group">
                Skills
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
              </a>
              <a href="#projects" className="hover:text-white transition-colors relative group">
                Projects
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
              </a>
              <a href="#experience" className="hover:text-white transition-colors relative group">
                Experience
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
              </a>
              <a href="#impact" className="hover:text-white transition-colors relative group">
                Impact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
              </a>
            </div>

            <div className="flex items-center gap-4">
              <a
                href={main.resumeUrl}
                download
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 border border-white/10 hover:border-blue-500/50 rounded-full text-xs font-bold uppercase tracking-widest transition-all glass hover:text-blue-400"
              >
                Resume
              </a>
              <a
                href="#contact"
                className="hidden sm:inline-block px-6 py-2.5 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl"
              >
                Contact
              </a>

              {/* Hamburger Button for mobile */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 glass border border-white/10 rounded-xl text-white hover:text-blue-400 transition-colors cursor-pointer z-50"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Full-screen Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#0a0a0a]/98 backdrop-blur-2xl z-40 flex flex-col justify-between p-8 lg:hidden"
          >
            {/* Spacer for Top Header area */}
            <div className="h-24"></div>

            <div className="flex flex-col gap-6 text-center text-2xl font-bold uppercase tracking-[0.2em] text-gray-400">
              <motion.a
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                href="#about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-white transition-colors py-2"
              >
                About
              </motion.a>
              <motion.a
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                href="#skills"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-white transition-colors py-2"
              >
                Skills
              </motion.a>
              <motion.a
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                href="#projects"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-white transition-colors py-2"
              >
                Projects
              </motion.a>
              <motion.a
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                href="#experience"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-white transition-colors py-2"
              >
                Experience
              </motion.a>
              <motion.a
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                href="#impact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:text-white transition-colors py-2"
              >
                Impact
              </motion.a>
            </div>

            <div className="flex flex-col gap-4 mt-8 max-w-sm mx-auto w-full">
              <motion.a
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 }}
                href={main.resumeUrl}
                download
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-4 border border-white/10 hover:border-blue-500/50 rounded-full text-xs font-bold uppercase tracking-widest transition-all glass text-blue-400"
              >
                Download Resume
              </motion.a>
              <motion.a
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-4 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-xl"
              >
                Get In Touch
              </motion.a>
            </div>

            <div className="text-center text-[10px] text-gray-650 uppercase tracking-widest py-4">
              © 2026 {main.name}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-36 sm:pt-48 pb-20 sm:pb-32 px-4 sm:px-6 overflow-hidden">
        {/* Ambient Background Spotlights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Left Column: Headline & Value Prop */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
              }}
              className="lg:col-span-7 flex flex-col items-start text-left"
            >
              {/* Availability Badge */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass border border-blue-500/20 bg-blue-500/10 mb-8"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                  Available for New Opportunities
                </span>
                <span className="text-gray-500 text-xs">•</span>
                <span className="text-xs text-gray-400 font-medium">{main.address.city}, {main.address.country}</span>
              </motion.div>

              {/* Hero Headline */}
              <motion.h1
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-6"
              >
                Architecting <br className="hidden sm:inline" />
                <span className="text-gradient-primary">High-Performance</span> <br className="hidden sm:inline" />
                <span className="text-gradient-blue font-extrabold">Distributed Systems</span>
              </motion.h1>

              {/* Subtitle / Bio */}
              <motion.p
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="text-base sm:text-lg text-gray-300 max-w-2xl mb-10 font-normal leading-relaxed"
              >
                Hi, I&apos;m <span className="text-white font-semibold underline decoration-blue-500/50 underline-offset-4">{main.name}</span>. Senior Full-Stack Engineer with <span className="text-blue-400 font-semibold">5+ years</span> of experience building multi-tenant enterprise platforms, optimizing BI engines (slashing latency by <span className="text-emerald-400 font-semibold">96%</span>), and scaling cloud architectures.
              </motion.p>

              {/* Action Group */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-12"
              >
                <motion.a
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  href="#projects"
                  className="flex-1 sm:flex-none px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-sm tracking-wide transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 group"
                >
                  Explore Projects
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  href={main.resumeUrl}
                  download
                  className="flex-1 sm:flex-none px-8 py-4 glass border border-white/15 text-white hover:bg-white/10 rounded-full font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2"
                >
                  Download CV
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </motion.a>

                {/* Quick Copy Email Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopyEmail}
                  className="px-5 py-4 glass border border-white/10 hover:border-blue-500/40 text-gray-300 hover:text-white rounded-full text-xs font-semibold tracking-wider transition-all flex items-center gap-2 relative group cursor-pointer"
                  title="Copy email to clipboard"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Email Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                      <span>{main.email}</span>
                    </>
                  )}
                </motion.button>
              </motion.div>

              {/* Quick Metrics Bar */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 w-full max-w-xl"
              >
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">5+</div>
                  <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Years Exp.</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">96%</div>
                  <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Latency Cut</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 tracking-tight">3+</div>
                  <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">SaaS Systems</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column: Interactive IDE Showcase Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              {/* Floating Tech Badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -left-6 z-20 hidden sm:flex items-center gap-2 glass px-4 py-2 rounded-2xl border border-blue-500/30 shadow-2xl bg-black/60 backdrop-blur-xl"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-xs font-bold text-white tracking-wider">React / Next.js 16</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-6 -right-4 z-20 hidden sm:flex items-center gap-2 glass px-4 py-2 rounded-2xl border border-emerald-500/30 shadow-2xl bg-black/60 backdrop-blur-xl"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white tracking-wider">Python / Flask / Distributed</span>
              </motion.div>

              {/* Main Card Container */}
              <div className="glass-card rounded-3xl p-6 relative overflow-hidden border border-white/15 shadow-2xl">
                {/* Header Bar */}
                <div className="flex items-center justify-between pb-5 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="relative group/avatar">
                      <div className="p-[2px] bg-gradient-to-tr from-blue-500 via-cyan-400 to-indigo-500 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.4)] group-hover/avatar:shadow-[0_0_25px_rgba(59,130,246,0.7)] transition-all duration-300">
                        <img
                          src={main.image.startsWith('/') ? main.image : `/${main.image}`}
                          alt={main.name}
                          className="w-16 h-16 sm:w-18 sm:h-18 rounded-[14px] object-cover bg-black group-hover/avatar:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#090a0f] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" title="System Status: Active" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-base sm:text-lg leading-tight flex items-center gap-1.5 font-mono">
                        {main.name} <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                      </h3>
                      <p className="text-xs text-blue-400 font-mono font-medium mt-0.5">Senior Full-Stack Engineer</p>
                    </div>
                  </div>

                  {/* Window Controls */}
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                </div>

                {/* IDE Tabs */}
                <div className="flex items-center gap-2 pt-4 pb-3 overflow-x-auto custom-scrollbar">
                  {[
                    { id: 'architecture', label: 'Architecture.ts', icon: <Cpu className="w-3.5 h-3.5" /> },
                    { id: 'metrics', label: 'Metrics.json', icon: <Zap className="w-3.5 h-3.5" /> },
                    { id: 'stack', label: 'Stack.config', icon: <Layers className="w-3.5 h-3.5" /> }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === tab.id
                          ? 'text-white bg-blue-600/30 border border-blue-500/40 shadow-sm'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
                        }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Code Window Content */}
                <div className="mt-2 bg-[#090a0f] rounded-2xl p-4 border border-white/5 font-mono text-xs text-gray-300 leading-relaxed overflow-x-auto min-h-[220px] flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    {activeTab === 'architecture' && (
                      <motion.div
                        key="architecture"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-1.5"
                      >
                        <div className="text-gray-500">// Core System Focus</div>
                        <div><span className="text-purple-400">interface</span> <span className="text-yellow-300">EngineerProfile</span> &#123;</div>
                        <div className="pl-4"><span className="text-blue-400">role</span>: <span className="text-emerald-300">&quot;Senior Full-Stack Architect&quot;</span>;</div>
                        <div className="pl-4"><span className="text-blue-400">specializations</span>: [</div>
                        <div className="pl-8 text-emerald-300">&quot;High-Performance BI Engines&quot;,</div>
                        <div className="pl-8 text-emerald-300">&quot;Multi-Tenant SaaS Systems&quot;,</div>
                        <div className="pl-8 text-emerald-300">&quot;Distributed Caching & Async Pipelines&quot;</div>
                        <div className="pl-4">];</div>
                        <div className="pl-4"><span className="text-blue-400">location</span>: <span className="text-emerald-300">&quot;Bengaluru, India&quot;</span>;</div>
                        <div>&#125;</div>
                      </motion.div>
                    )}

                    {activeTab === 'metrics' && (
                      <motion.div
                        key="metrics"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-1.5 text-gray-300"
                      >
                        <div className="text-gray-500">// Engineering Achievements</div>
                        <div>&#123;</div>
                        <div className="pl-4"><span className="text-blue-400">&quot;biReportLatencyReduction&quot;</span>: <span className="text-emerald-400">&quot;96% (12s → 450ms)&quot;</span>,</div>
                        <div className="pl-4"><span className="text-blue-400">&quot;multiTenantPlatformsBuilt&quot;</span>: <span className="text-amber-300">3</span>,</div>
                        <div className="pl-4"><span className="text-blue-400">&quot;yearsOfExperience&quot;</span>: <span className="text-amber-300">5</span>,</div>
                        <div className="pl-4"><span className="text-blue-400">&quot;domainExcellence&quot;</span>: [<span className="text-emerald-300">&quot;Fintech&quot;</span>, <span className="text-emerald-300">&quot;HealthTech&quot;</span>, <span className="text-emerald-300">&quot;HR Tech&quot;</span>]</div>
                        <div>&#125;</div>
                      </motion.div>
                    )}

                    {activeTab === 'stack' && (
                      <motion.div
                        key="stack"
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -15 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-2"
                      >
                        <div className="text-gray-500">// Primary Tech Stack</div>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {["React.js", "Next.js", "Python", "Flask", "PostgreSQL", "Redis", "Docker", "Superset", "TypeScript", "Tailwind"].map((tech, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-300 rounded-lg text-[11px] font-sans font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Card Footer Tag */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1.5 text-gray-300 font-sans">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" /> High Impact Systems
                  </span>
                  <span className="font-mono text-emerald-400 font-semibold">● Production Ready</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-28 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-12 items-start">

            {/* Left Bio Card */}
            <div className="lg:col-span-2 lg:sticky lg:top-32">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-mono font-bold uppercase tracking-widest mb-6">
                <Terminal className="w-3.5 h-3.5 text-blue-400" /> $ whoami --engineer
              </div>

              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
                Senior Full-Stack <span className="text-gradient-primary">Software Engineer</span>
              </h2>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8 font-light">
                {main.bio}
              </p>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 glass-card rounded-2xl border border-white/10 flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-gray-400 uppercase font-bold">Location</div>
                    <div className="text-xs font-bold text-white font-mono">{main.address.city}, {main.address.state}</div>
                  </div>
                </div>

                <div className="p-4 glass-card rounded-2xl border border-white/10 flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-gray-400 uppercase font-bold">Experience</div>
                    <div className="text-xs font-bold text-white font-mono">Senior Engineer (5+ Yrs)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Bento Grid */}
            <div className="lg:col-span-3 w-full">
              <BentoGrid />
            </div>

          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-28 px-4 sm:px-6 relative overflow-hidden bg-white/[0.015] border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-mono font-bold uppercase tracking-widest mb-6">
              <Terminal className="w-3.5 h-3.5 text-blue-400 animate-pulse" /> $ cat stack.config.json
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
              Technical <span className="text-gradient-primary">Expertise</span>
            </h2>
            <p className="text-gray-300 text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
              Production technology stack spanning Full-Stack Architecture, Distributed Systems, Cloud Infrastructure, and Data Engineering.
            </p>
          </div>

          {/* Core Architectural Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <SkillCard
              title="Frontend Systems"
              subtitle="User Interfaces & Web Apps"
              icon={<Globe className="w-5 h-5 text-blue-400" />}
              skills={["React", "Next.js", "TypeScript", "Redux", "Tailwind CSS"]}
              accentColor="blue"
            />
            <SkillCard
              title="Backend Engine"
              subtitle="Distributed Microservices"
              icon={<Cpu className="w-5 h-5 text-amber-400" />}
              skills={["Python", "Flask", "Apache Kafka", "Celery", "Redis", "WebSockets"]}
              accentColor="amber"
            />
            <SkillCard
              title="Cloud & Infrastructure"
              subtitle="DevOps & Security"
              icon={<Layers className="w-5 h-5 text-cyan-400" />}
              skills={["AWS EC2/S3", "Docker", "Kubernetes (Learning)", "Nginx", "SSL/TLS"]}
              accentColor="cyan"
            />
            <SkillCard
              title="Data & Analytics"
              subtitle="Database & BI Pipelines"
              icon={<Database className="w-5 h-5 text-purple-400" />}
              skills={["PostgreSQL", "MongoDB", "Apache Superset", "BI Recalculations"]}
              accentColor="purple"
            />
          </div>

          {/* Interactive Stack Grid Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10">
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Verified Engineering Skill Matrix
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { id: 'all', label: 'All Stack' },
                { id: 'frontend', label: 'Frontend' },
                { id: 'backend', label: 'Backend & Streaming' },
                { id: 'cloud', label: 'Cloud & K8s' },
                { id: 'data', label: 'Data & BI' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSkillCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${skillCategory === tab.id
                      ? 'bg-blue-600 text-white border border-blue-500/50 shadow-md'
                      : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tech Badge Grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {resume.skills
                .filter((skill) => {
                  if (skillCategory === 'all') return true;
                  const name = skill.name.toLowerCase();
                  if (skillCategory === 'frontend') return name.includes('react') || name.includes('redux') || name.includes('mobile');
                  if (skillCategory === 'backend') return name.includes('python') || name.includes('kafka') || name.includes('trading') || name.includes('celery') || name.includes('nest') || name.includes('websocket');
                  if (skillCategory === 'cloud') return name.includes('aws') || name.includes('docker') || name.includes('kubernetes') || name.includes('devops') || name.includes('security');
                  if (skillCategory === 'data') return name.includes('database') || name.includes('bi');
                  return true;
                })
                .map((skill, i) => (
                  <motion.div
                    key={skill.name}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -3, scale: 1.02 }}
                    transition={{ duration: 0.2, delay: i * 0.04 }}
                    className="glass-card p-4 rounded-2xl border border-white/10 hover:border-blue-500/40 transition-all flex items-center justify-between gap-3 shadow-lg group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="p-2 bg-white/5 rounded-xl border border-white/10 group-hover:bg-white/10 transition-colors shrink-0">
                        <img src={skill.image} alt={skill.name} className="w-5 h-5 object-contain" />
                      </div>
                      <span className="text-xs font-mono font-bold text-gray-200 group-hover:text-blue-300 transition-colors truncate">
                        {skill.name}
                      </span>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {skill.level}
                      </span>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </motion.div>

        </div>
      </section>

      {/* Work Experience */}
      <section id="experience" className="py-32 px-4 sm:px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              <Terminal className="w-3.5 h-3.5 text-blue-400" /> Career Engineering Log
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">Work Experience</h2>
            <p className="text-gray-300 text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
              Production engineering leadership across high-frequency FinTech, enterprise BI analytics, and cloud infrastructure.
            </p>
          </div>

          <div className="relative border-l-2 border-blue-500/30 ml-4 md:ml-8 space-y-12">
            {resume.work.map((job, i) => (
              <ExperienceStepperItem key={i} job={job} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* GitHub Section */}
      <section id="impact">
        <GitHubStats />
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-32 px-4 sm:px-6 bg-white/[0.015] border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                <Code2 className="w-3.5 h-3.5 text-blue-400" /> Enterprise Systems Architecture
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">Enterprise Projects</h2>
              <p className="text-gray-300 max-w-xl text-base sm:text-lg font-light leading-relaxed">
                Mission-critical production systems built for scale, performance, multi-tenancy, and low latency.
              </p>
            </div>

            <motion.a
              whileHover={{ scale: 1.03, x: 4 }}
              href="https://github.com/sssatendra"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-300 hover:text-white font-mono text-xs font-bold uppercase tracking-wider glass px-5 py-3 rounded-xl border border-blue-500/30 hover:bg-blue-600/20 transition-all cursor-pointer shadow-lg"
            >
              <FaGithub className="w-4 h-4" /> View All on GitHub <ArrowRight className="w-4 h-4" />
            </motion.a>
          </div>

          {/* Project Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-12">
            {[
              { id: 'all', label: 'All Systems' },
              { id: 'fintech', label: 'FinTech & Trading' },
              { id: 'enterprise', label: 'Enterprise & BI' },
              { id: 'saas', label: 'SaaS & HRMS' },
              { id: 'mobile', label: 'Mobile & ERP' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setProjectCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${projectCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-500/50'
                    : 'glass border border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence>
              {portfolio.projects
                .filter((project) => {
                  if (projectCategory === 'all') return true;
                  const cat = project.category.toLowerCase();
                  if (projectCategory === 'fintech') return cat.includes('fintech') || cat.includes('trading') || cat.includes('pos');
                  if (projectCategory === 'enterprise') return cat.includes('enterprise') || cat.includes('data');
                  if (projectCategory === 'saas') return cat.includes('saas') || cat.includes('hr tech');
                  if (projectCategory === 'mobile') return cat.includes('mobile') || cat.includes('logistics');
                  return true;
                })
                .map((project, i) => {
                  const isExternal = project.url && project.url !== '#';
                  return (
                    <motion.div
                      key={project.title}
                      layout
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.35, delay: i * 0.08 }}
                      className="group relative rounded-3xl overflow-hidden glass-card border border-white/10 hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between shadow-2xl"
                    >
                      {/* Top Header Overlay Bar */}
                      <div className="p-6 sm:p-8 flex-grow flex flex-col">
                        <div className="flex justify-between items-start mb-6 gap-4">
                          <div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-300 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider mb-3">
                              <Sparkles className="w-3 h-3 text-blue-400" /> {project.category}
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-blue-300 transition-colors tracking-tight">
                              {project.title}
                            </h3>
                          </div>

                          {isExternal ? (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-3 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded-xl border border-blue-500/40 transition-colors shrink-0"
                              title="View Project Code"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          ) : (
                            <span className="p-3 bg-white/5 rounded-xl border border-white/10 text-gray-500 shrink-0">
                              <Lock className="w-4 h-4" />
                            </span>
                          )}
                        </div>

                        <p className="text-gray-300 text-sm leading-relaxed mb-6 font-normal">
                          {project.description}
                        </p>

                        {/* Engineering Highlights */}
                        {project.features && (
                          <div className="space-y-3 mt-auto pt-6 border-t border-white/10">
                            <div className="text-[11px] font-mono text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-2">
                              <Zap className="w-3.5 h-3.5 text-amber-400" /> Engineering Achievements
                            </div>
                            <ul className="space-y-2.5">
                              {project.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-gray-300 leading-normal">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-2 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                                  <span className="font-light">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Card Footer Bar */}
                      <div className="px-6 sm:px-8 py-4 bg-white/[0.02] border-t border-white/10 flex items-center justify-between text-xs font-mono text-gray-400">
                        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                          ● Production Architecture
                        </span>
                        {isExternal ? (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 flex items-center gap-1 group-hover:underline"
                          >
                            Explore Source <ArrowRight className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-gray-400">Enterprise IP</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-mono font-bold uppercase tracking-widest mb-6">
            <Terminal className="w-3.5 h-3.5 text-blue-400" /> $ connect --direct
          </div>

          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6">Let&apos;s Build Together.</h2>
          <p className="text-base sm:text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Open to high-impact Senior Full-Stack Engineering roles, FinTech systems architecture, and distributed platform consulting.
          </p>

          {/* Dev Command Console Card */}
          <div className="glass-card rounded-3xl border border-white/10 p-8 sm:p-12 text-left shadow-2xl relative overflow-hidden mb-12">
            <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-gray-400">~/contact/initiate.sh</span>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                ● Accepting Next Project
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-4">
                <div className="text-xs font-mono text-gray-400 uppercase tracking-wider font-semibold">Direct Email</div>
                <div className="flex items-center gap-3">
                  <span className="text-lg sm:text-xl font-mono font-bold text-white tracking-tight">{main.email}</span>
                  <button
                    onClick={handleCopyEmail}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-blue-400 transition-all cursor-pointer"
                    title="Copy Email"
                  >
                    {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                {copiedEmail && (
                  <p className="text-xs font-mono text-emerald-400">✓ Email address copied to clipboard!</p>
                )}
              </div>

              <div className="space-y-4">
                <div className="text-xs font-mono text-gray-400 uppercase tracking-wider font-semibold">Base Location</div>
                <div className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {main.address.city}, {main.address.country}
                </div>
                <p className="text-xs font-mono text-emerald-400">● Open for Remote & Global Relocation</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10">
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href={`mailto:${main.email}`}
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Send className="w-4 h-4" /> Initialize Connection
              </motion.a>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
                {main.social.map((social, i) => (
                  <motion.a
                    key={i}
                    whileHover={{ y: -3, scale: 1.08 }}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 glass rounded-2xl border border-white/10 hover:border-blue-500/40 text-gray-400 hover:text-white transition-all shadow-lg"
                    title={social.name}
                  >
                    {social.name === 'linkedin' && <FaLinkedin className="w-5 h-5" />}
                    {social.name === 'github' && <FaGithub className="w-5 h-5" />}
                    {social.name === 'twitter' && <FaTwitter className="w-5 h-5" />}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dev-Centric Footer */}
      <footer className="py-12 px-6 border-t border-white/10 bg-[#050508] relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">

          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="text-white font-bold text-2xl font-mono tracking-tighter">
              Satendra<span className="text-blue-500">.</span>dev
            </div>
            <div className="text-gray-400 text-xs font-mono tracking-wide">
              Senior Full-Stack & Systems Software Engineer
            </div>
          </div>

          <div className="text-xs font-mono text-gray-400 flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Status: All Systems Operational</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs font-mono uppercase tracking-wider text-gray-400">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#skills" className="hover:text-white transition-colors">Skills</a>
            <a href="#experience" className="hover:text-white transition-colors">Experience</a>
            <a href="#impact" className="hover:text-white transition-colors">Impact</a>
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            <a href={main.resumeUrl} download className="text-blue-400 hover:text-blue-300 transition-colors">Resume.pdf</a>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 text-center text-xs font-mono text-gray-500">
          © 2026 {main.name}. Engineered for maximum performance & scale.
        </div>
      </footer>
      <BackgroundSwitcher theme={theme} setTheme={setTheme} />
    </main>
  );
}

function ExperienceStepperItem({ job, index }) {
  const [isExpanded, setIsExpanded] = useState(index === 0);

  return (
    <div className="relative pl-6 sm:pl-10 md:pl-16">
      {/* Stepper Git Commit Node */}
      <div className="absolute left-[-11px] top-4 w-5 h-5 rounded-full bg-[#050508] border-2 border-blue-500 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(59,130,246,0.6)]">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></div>
      </div>

      <motion.div
        layout
        className="glass-card rounded-3xl p-6 sm:p-8 md:p-10 border border-white/10 hover:border-blue-500/40 transition-all duration-300 shadow-2xl relative group overflow-hidden"
      >
        {/* Terminal Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                {job.title}
              </span>
              <span className="text-xs font-mono text-gray-400">{job.years}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight group-hover:text-blue-300 transition-colors">
              {job.company}
            </h3>
          </div>

          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-gray-400 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-colors">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 font-light">
          {job.description}
        </p>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              {job.projects ? (
                <div className="space-y-6 mb-6">
                  {job.projects.map((project, pi) => (
                    <div key={pi} className="p-5 bg-white/[0.02] rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-2.5 mb-4">
                        <Code2 className="w-4 h-4 text-blue-400 shrink-0" />
                        <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">{project.name}</h4>
                      </div>

                      <ul className="space-y-2.5 pl-2">
                        {project.highlights.map((point, i) => (
                          <motion.li
                            key={i}
                            initial={{ x: -10, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-start gap-3 text-xs sm:text-sm text-gray-300 leading-relaxed"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-2 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                            <span className="font-light">{point}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/5 mb-6">
                  <ul className="space-y-3">
                    {job.highlights.map((point, i) => (
                      <motion.li
                        key={i}
                        initial={{ x: -15, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-3 text-xs sm:text-sm text-gray-300 leading-relaxed"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-2 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                        <span className="font-light">{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2.5 text-blue-400 font-mono text-xs font-bold hover:text-blue-300 transition-colors uppercase tracking-wider cursor-pointer"
        >
          <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
            {isExpanded ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </div>
          {isExpanded ? "Collapse Breakdown" : "Expand System Accomplishments"}
        </button>
      </motion.div>
    </div>
  );
}

function SkillCard({ title, subtitle, icon, skills, accentColor = 'blue' }) {
  const colorMap = {
    blue: {
      border: 'hover:border-blue-500/50',
      gradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
      dot: 'bg-blue-400',
      text: 'group-hover:text-blue-300',
      pillHover: 'hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-300'
    },
    amber: {
      border: 'hover:border-amber-500/50',
      gradient: 'from-amber-500/10 via-yellow-500/5 to-transparent',
      dot: 'bg-amber-400',
      text: 'group-hover:text-amber-300',
      pillHover: 'hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-300'
    },
    cyan: {
      border: 'hover:border-cyan-500/50',
      gradient: 'from-cyan-500/10 via-teal-500/5 to-transparent',
      dot: 'bg-cyan-400',
      text: 'group-hover:text-cyan-300',
      pillHover: 'hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-300'
    },
    purple: {
      border: 'hover:border-purple-500/50',
      gradient: 'from-purple-500/10 via-pink-500/5 to-transparent',
      dot: 'bg-purple-400',
      text: 'group-hover:text-purple-300',
      pillHover: 'hover:bg-purple-500/10 hover:border-purple-500/30 hover:text-purple-300'
    }
  };

  const theme = colorMap[accentColor] || colorMap.blue;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className={`glass-card p-6 sm:p-7 rounded-3xl border border-white/10 ${theme.border} transition-all duration-300 shadow-2xl relative overflow-hidden group flex flex-col justify-between`}
    >
      {/* Background Ambient Glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

      <div className="relative z-10">
        <div className="flex items-center gap-3.5 mb-5">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:scale-105 group-hover:bg-white/10 transition-all shadow-inner">
            {icon}
          </div>
          <div>
            <h3 className={`text-xl font-bold text-white tracking-tight ${theme.text} transition-colors`}>{title}</h3>
            {subtitle && <p className="text-[11px] font-mono text-gray-400">{subtitle}</p>}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {skills.map((skill, i) => (
            <span
              key={i}
              className={`text-xs font-mono font-bold px-3 py-1.5 bg-white/5 rounded-xl text-gray-200 border border-white/10 ${theme.pillHover} transition-all flex items-center gap-1.5 shadow-sm`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
