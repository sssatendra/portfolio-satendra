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
  X
} from 'lucide-react';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import GitHubStats from '../components/GitHubStats';


const Background3D = dynamic(() => import('../components/Background3D'), { ssr: false });

export default function Home() {
  const { main, resume, portfolio } = resumeData;
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      <Background3D />

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
      <section className="relative pt-44 sm:pt-60 pb-20 sm:pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative mb-8"
          >
            <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 -z-10 rounded-full"></div>
            <img
              src={main.image}
              alt={main.name}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 border-white/10 p-2 glass shadow-2xl object-cover"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 tracking-tighter text-gradient px-4"
          >
            {main.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-2xl mb-12 font-light leading-relaxed px-4"
          >
            Senior <span className="text-white font-medium">Full-Stack</span> Software Engineer specializing in <span className="text-white font-medium">high-performance systems</span> and <span className="text-white font-medium">distributed architectures</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto px-4 sm:px-0"
          >
            <a
              href="#projects"
              className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/40 transform hover:-translate-y-1 text-center"
            >
              View My Work
            </a>
            <a
              href={main.resumeUrl}
              download
              className="w-full sm:w-auto px-10 py-4 glass border border-white/10 text-white rounded-full font-bold hover:bg-white/5 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 text-center"
            >
              Download CV <ArrowRight className="w-4 h-4 rotate-90" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-12 items-start">
            <div className="lg:col-span-2 sticky top-32">
              <div className="inline-block px-4 py-1.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                About Me
              </div>
              <h2 className="text-5xl font-bold mb-8 tracking-tight">{main.occupation}</h2>
              <p className="text-lg text-gray-400 leading-relaxed mb-12 font-light">
                {main.bio}
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 glass rounded-2xl text-blue-400">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Location</h4>
                    <p className="text-gray-400 text-sm">{main.address.city}, {main.address.state}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 glass rounded-2xl text-blue-400">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Experience</h4>
                    <p className="text-gray-400 text-sm">Senior Software Engineer (4.5+ Years)</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-3 w-full">
              <BentoGrid />
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center tracking-tight">Technical Expertise</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SkillCard title="Frontend" icon={<Globe className="w-5 h-5" />} skills={["React", "Next.js", "TypeScript", "Tailwind"]} />
            <SkillCard title="Backend" icon={<Cpu className="w-5 h-5" />} skills={["Python", "Flask", "Distributed Systems", "Celery"]} />
            <SkillCard title="Infrastructure" icon={<Layers className="w-5 h-5" />} skills={["Docker", "Redis", "Message Queues"]} />
            <SkillCard title="Data" icon={<Database className="w-5 h-5" />} skills={["PostgreSQL", "MongoDB", "Apache Superset", "BI Optimization"]} />
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {resume.skills.map((skill, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 glass px-5 py-3 rounded-2xl border border-white/5"
              >
                <img src={skill.image} alt={skill.name} className="w-6 h-6 object-contain" />
                <span className="text-sm font-medium">{skill.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Work Experience */}
      <section id="experience" className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest mb-12">
            Professional Journey
          </div>
          <h2 className="text-5xl font-bold mb-16 tracking-tight">Work Experience</h2>

          <div className="relative border-l-2 border-white/5 ml-4 md:ml-6 space-y-16">
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
      <section id="projects" className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div>
              <h2 className="text-3xl sm:text-5xl font-bold mb-4 tracking-tight">Featured Work</h2>
              <p className="text-gray-450 max-w-xl text-base sm:text-lg font-light">
                High-impact projects ranging from financial engineering to enterprise BI infrastructure.
              </p>
            </div>
            <motion.div whileHover={{ x: 10 }} className="flex items-center gap-2 text-blue-400 cursor-pointer group font-bold text-xs sm:text-sm tracking-widest uppercase">
              View all <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            {portfolio.projects.map((project, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden glass hover:border-blue-500/50 transition-all cursor-pointer border border-white/5 shadow-2xl flex flex-col"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="object-cover w-full h-full transform scale-105 group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-100"
                  />
                  <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                    <span className="px-3 py-1 sm:px-4 sm:py-1.5 bg-black/50 backdrop-blur-md rounded-full text-[10px] sm:text-xs font-semibold text-blue-400 border border-white/10 uppercase tracking-widest">
                      {project.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 sm:p-10 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-4 sm:mb-6">
                    <h3 className="text-xl sm:text-3xl font-bold group-hover:text-blue-400 transition-colors tracking-tight">{project.title}</h3>
                    <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 shrink-0 mt-1" />
                  </div>
                  <p className="text-gray-400 text-sm sm:text-lg leading-relaxed mb-6 sm:mb-8 font-light italic">
                    {project.description}
                  </p>
                  
                  {project.features && (
                    <ul className="space-y-3 sm:space-y-4 mt-auto">
                      {project.features.map((feature, idx) => (
                        <li key={idx} className="flex gap-2.5 sm:gap-3 text-xs sm:text-sm text-gray-300">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                          <span className="font-light">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block p-5 bg-blue-600 rounded-[2rem] text-white shadow-xl shadow-blue-600/30 mb-8 transform hover:rotate-12 transition-transform">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight px-4">Let's build together.</h2>
          <p className="text-xl text-gray-450 mb-16 max-w-2xl mx-auto font-light leading-relaxed px-4">
            Currently open to high-impact software roles and architectural consulting. If you have a challenge, I have a solution.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <a
              href={`mailto:${main.email}`}
              className="flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/40 transform hover:-translate-y-1 active:translate-y-0"
            >
              Send an Email <Send className="w-4 h-4" />
            </a>
            <div className="flex gap-4">
              {main.social.map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  className="p-5 glass rounded-full hover:bg-white/10 transition-all border border-white/5 hover:border-white/20 active:scale-95"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.name === 'linkedin' && <FaLinkedin className="w-7 h-7" />}
                  {social.name === 'github' && <FaGithub className="w-7 h-7" />}
                  {social.name === 'twitter' && <FaTwitter className="w-7 h-7" />}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-12 sm:mt-20 p-6 sm:p-10 glass rounded-[2rem] sm:rounded-[3rem] max-w-2xl mx-auto border border-white/5 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 text-left">
              <div>
                <p className="text-gray-500 text-xs mb-2 uppercase font-bold tracking-[0.2em]">Primary Contact</p>
                <p className="font-bold text-base sm:text-lg tracking-tight">{main.phone}</p>
                <p className="text-blue-400 text-sm font-medium mt-1">{main.email}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-2 uppercase font-bold tracking-[0.2em]">Based In</p>
                <p className="font-bold text-base sm:text-lg tracking-tight">Bengaluru, India</p>
                <p className="text-gray-400 text-sm mt-1">Available for Relocation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10 bg-[#030303]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col gap-2 items-center md:items-start">
            <div className="text-white font-bold text-xl tracking-tighter">
              Satendra<span className="text-blue-500">.</span>
            </div>
            <div className="text-gray-600 text-xs font-bold uppercase tracking-widest text-center md:text-left">
              Senior Full-Stack Engineer
            </div>
          </div>

          <div className="text-gray-500 text-xs font-medium uppercase tracking-[0.2em] text-center">
            © 2026 {main.name}. Engineered for performance.
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 sm:gap-10 text-xs font-bold uppercase tracking-widest text-gray-500">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#skills" className="hover:text-white transition-colors">Skills</a>
            <a href="#experience" className="hover:text-white transition-colors">Experience</a>
            <a href="#impact" className="hover:text-white transition-colors">Impact</a>
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            <a href={main.resumeUrl} download className="text-blue-500 hover:text-blue-400 transition-colors">Resume</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function ExperienceStepperItem({ job, index }) {
  const [isExpanded, setIsExpanded] = useState(index === 0);

  return (
    <div className="relative pl-8 sm:pl-12 md:pl-24">
      {/* Stepper Node */}
      <div className="absolute left-[-11px] top-0 w-6 h-6 rounded-full bg-[#050505] border-2 border-blue-500 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
      </div>

      <motion.div
        layout
        className="glass rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 md:p-12 border border-white/5 hover:border-blue-500/30 transition-all shadow-2xl relative group"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl md:text-4xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">{job.title}</h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h4 className="text-base sm:text-lg md:text-xl text-blue-400/90 font-bold">{job.company}</h4>
              <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
              <span className="text-gray-500 text-xs sm:text-sm font-bold uppercase tracking-widest">{job.years}</span>
            </div>
          </div>
          <div className="p-3 sm:p-4 bg-white/5 rounded-2xl border border-white/10 hidden md:block">
            <Briefcase className="w-6 h-6 text-gray-400" />
          </div>
        </div>

        <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mb-8 sm:mb-10 font-light italic">
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
                <div className="space-y-8 sm:space-y-10 mb-6">
                  {job.projects.map((project, pi) => (
                    <div key={pi} className="relative group/project">
                      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div className="relative flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-blue-500/20 border border-blue-500/50 z-10"></div>
                          <div className="absolute w-2 h-2 rounded-full bg-blue-500 z-20 shadow-[0_0_10px_rgba(59,130,246,0.8)] group-hover/project:scale-125 transition-transform"></div>
                        </div>
                        <h5 className="text-base sm:text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-3 sm:gap-4 flex-1">
                          {project.name}
                          <span className="h-px flex-1 bg-gradient-to-r from-blue-500/30 to-transparent"></span>
                        </h5>
                      </div>
                      
                      <div className="pl-6 sm:pl-9 space-y-4 sm:space-y-5 border-l border-white/5 ml-2">
                        {project.highlights.map((point, i) => (
                          <motion.div
                            key={i}
                            initial={{ x: -10, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex gap-3 sm:gap-4 text-gray-450 group/item"
                          >
                            <div className="mt-2 w-1.5 h-1.5 rounded-full bg-white/20 shrink-0 group-hover/item:bg-blue-400 group-hover/item:scale-150 transition-all duration-300"></div>
                            <p className="text-xs sm:text-sm md:text-lg leading-relaxed font-light group-hover/item:text-gray-200 transition-colors duration-300">{point}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-6 sm:space-y-8 mb-8 sm:mb-10 border-l border-white/10 pl-6 sm:pl-8 ml-2">
                  {job.highlights.map((point, i) => (
                    <motion.li
                      key={i}
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-3 sm:gap-5 text-gray-300 group/item"
                    >
                      <div className="mt-2 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500 shrink-0 group-hover/item:scale-150 transition-transform shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
                      <span className="text-xs sm:text-base md:text-lg leading-relaxed font-light">{point}</span>
                    </motion.li>
                  ))}
                </ul>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3 sm:gap-4 text-blue-400 font-bold hover:text-blue-300 transition-all text-[10px] sm:text-xs uppercase tracking-[0.3em] group/btn"
        >
          <div className="p-2 sm:p-3 bg-blue-500/10 rounded-full group-hover/btn:bg-blue-500/20 group-hover/btn:rotate-90 transition-all border border-blue-500/20 shadow-lg">
            {isExpanded ? (
              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
            ) : (
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
          </div>
          {isExpanded ? "Hide Details" : "View Achievements"}
        </button>
      </motion.div>
    </div>
  );
}

function SkillCard({ title, icon, skills }) {
  return (
    <div className="glass p-6 sm:p-8 lg:p-10 rounded-[2rem] sm:rounded-[2.5rem] hover:border-blue-500/40 transition-all group border border-white/5 shadow-xl">
      <div className="flex items-center gap-4 sm:gap-5 mb-6 sm:mb-10">
        <div className="p-4 sm:p-5 bg-blue-500/10 rounded-2xl text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all shadow-inner">
          {icon}
        </div>
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight">{title}</h3>
      </div>
      <div className="flex flex-wrap gap-2.5 sm:gap-3">
        {skills.map((skill, i) => (
          <span key={i} className="text-[10px] sm:text-xs font-bold px-4 sm:px-5 py-2 bg-white/5 rounded-full text-gray-400 border border-white/5 group-hover:border-white/20 group-hover:text-white transition-all uppercase tracking-widest">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
