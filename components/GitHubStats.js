'use client';

import { useState, useEffect } from 'react';
import { 
  Star, 
  GitFork, 
  Users, 
  BookOpen, 
  Trophy, 
  Activity, 
  Lock, 
  Globe, 
  Search, 
  ExternalLink, 
  X, 
  Loader2, 
  Terminal, 
  GitBranch, 
  Zap, 
  Flame, 
  ShieldCheck, 
  Code2, 
  Sparkles 
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function RepoCard({ repo, index, onViewInfo }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, delay: (index % 6) * 0.08 }}
      viewport={{ once: true }}
      className="relative flex flex-col group h-full cursor-pointer"
      onClick={onViewInfo}
    >
      {/* Dev Terminal Card Container */}
      <div className="relative flex flex-col h-full bg-[#090a0f] rounded-2xl border border-white/10 group-hover:border-blue-500/50 transition-all duration-300 overflow-hidden shadow-2xl">
        
        {/* Terminal Card Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400 group-hover:text-blue-300 transition-colors truncate max-w-[70%]">
            <Terminal className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate">sssatendra / <strong className="text-white">{repo.name}</strong></span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {repo.stars > 0 && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded-md text-amber-400 text-[10px] font-mono font-bold">
                <Star className="w-3 h-3 fill-amber-400" /> {repo.stars}
              </span>
            )}
            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${
              repo.isPrivate 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
            }`}>
              {repo.isPrivate ? 'PRIVATE' : 'PUBLIC'}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex flex-col h-full justify-between">
          <div>
            {/* Git Branch Tag */}
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <GitBranch className="w-3 h-3" /> git:main
              </span>
              {repo.language && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-gray-300 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: repo.langColor || '#3B82F6' }} />
                  {repo.language}
                </span>
              )}
            </div>

            <p className="text-gray-300 text-xs sm:text-sm font-normal leading-relaxed line-clamp-3 mb-4">
              {repo.description || "Production project codebase engineered for high-performance enterprise SaaS & distributed system workflows."}
            </p>

            {/* Topic tags */}
            {repo.topics && repo.topics.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {repo.topics.slice(0, 3).map(topic => (
                  <span key={topic} className="px-2 py-0.5 bg-white/5 text-gray-400 text-[10px] font-mono rounded border border-white/5">
                    #{topic}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Card Footer Actions */}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
            <span className="text-gray-500 text-[10px]">
              {(() => {
                const date = new Date(repo.updatedAt);
                const now = new Date();
                const diffInSeconds = Math.floor((now - date) / 1000);
                if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
                if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              })()}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewInfo();
                }}
                className="px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white rounded-lg border border-blue-500/40 text-[11px] font-mono font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Code2 className="w-3.5 h-3.5" /> Readme.md
              </button>
              {!repo.isPrivate && (
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg border border-white/10 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

export default function GitHubStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [readmeData, setReadmeData] = useState(null);
  const [loadingReadme, setLoadingReadme] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/github');
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const fetchReadme = async (repoName) => {
    setLoadingReadme(true);
    setSelectedRepo(repoName);
    
    const repoInfo = stats?.repos?.list?.find(r => r.name === repoName);
    const isPrivate = repoInfo?.isPrivate || false;

    try {
      const res = await fetch(`/api/github/readme?repo=${repoName}`);
      const data = await res.json();
      setReadmeData({ ...data, isPrivate });
    } catch (err) {
      setReadmeData({ readme: 'Failed to load README.', isPrivate });
    } finally {
      setLoadingReadme(false);
    }
  };

  if (loading) return (
    <div className="w-full py-20 flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      <p className="text-gray-400 font-mono text-xs tracking-wider animate-pulse">$ syncing git metrics & repository logs...</p>
    </div>
  );

  if (error) return (
    <div className="w-full py-10 text-center">
      <p className="text-red-400 bg-red-400/10 inline-block px-6 py-2 rounded-full border border-red-400/20 text-xs font-mono">
        Error loading GitHub data: {error}
      </p>
    </div>
  );

  const filteredRepos = (stats?.repos?.list || []).filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filter === 'all' || 
                         (filter === 'public' && !repo.isPrivate) || 
                         (filter === 'private' && repo.isPrivate);
    return matchesSearch && matchesFilter;
  });

  const statItems = [
    { label: 'Total Contributions', value: stats.contributions, icon: <Activity className="w-5 h-5" />, color: 'text-emerald-400' },
    { label: 'Total Repositories', value: stats.repos.total, subValue: `${stats.repos.public} Public · ${stats.repos.private} Private`, icon: <BookOpen className="w-5 h-5" />, color: 'text-blue-400' },
    { label: 'Total Stars', value: stats.repos.stars, icon: <Star className="w-5 h-5" />, color: 'text-amber-400' },
    { label: 'Followers', value: stats.followers, icon: <Users className="w-5 h-5" />, color: 'text-purple-400' },
  ];

  // Native Custom Merit Trophies Data
  const nativeTrophies = [
    {
      id: 'code-titan',
      title: 'Code Titan',
      rank: 'RANK S • GOLD',
      val: `${stats.contributions.toLocaleString()}+ Commits`,
      description: 'Extensive contribution footprint across production repositories.',
      icon: <Trophy className="w-6 h-6 text-amber-400" />,
      gradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
      borderColor: 'border-amber-500/30'
    },
    {
      id: 'system-architect',
      title: 'System Architect',
      rank: 'RANK S • PLATINUM',
      val: '96% BI Latency Cut',
      description: 'Engineered query optimizations reducing BI calculation loops from 40m to 90s.',
      icon: <Zap className="w-6 h-6 text-cyan-400" />,
      gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
      borderColor: 'border-cyan-500/30'
    },
    {
      id: 'repo-master',
      title: 'Repo Architect',
      rank: 'RANK A • MASTER',
      val: `${stats.repos.total} Repositories`,
      description: 'Architecture spanning Full-Stack SaaS, microservices, and algo trading engines.',
      icon: <BookOpen className="w-6 h-6 text-blue-400" />,
      gradient: 'from-blue-500/20 via-indigo-500/10 to-transparent',
      borderColor: 'border-blue-500/30'
    },
    {
      id: 'private-vault',
      title: 'Enterprise Vault',
      rank: 'RANK S • EMERALD',
      val: `${stats.repos.private} Private Repos`,
      description: 'Mission-critical enterprise software, multi-tenant POS, HRMS, and healthcare platforms.',
      icon: <Lock className="w-6 h-6 text-emerald-400" />,
      gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
      borderColor: 'border-emerald-500/30'
    },
    {
      id: 'fintech-master',
      title: 'FinTech Algo Engine',
      rank: 'RANK A • DIAMOND',
      val: 'Kite API Live',
      description: 'Production-grade options trading engine with real-time WebSocket feeds and risk automation.',
      icon: <Flame className="w-6 h-6 text-purple-400" />,
      gradient: 'from-purple-500/20 via-pink-500/10 to-transparent',
      borderColor: 'border-purple-500/30'
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              <FaGithub className="w-4 h-4" /> Open Source & Enterprise Impact
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">Engineering Footprint</h2>
            <p className="text-gray-400 max-w-xl text-base sm:text-lg font-light leading-relaxed">
              Real-time engineering metrics, contribution activity, and repository architecture.
            </p>
          </div>
          
          <div className="flex items-center gap-5 p-5 glass rounded-3xl border border-white/10 shadow-2xl">
            <img src={stats.user.avatar} alt="GitHub Profile" className="w-16 h-16 rounded-2xl object-cover border border-white/20 shadow-lg" />
            <div>
              <h4 className="text-xl font-bold text-white tracking-tight">{stats.user.name || stats.user.login}</h4>
              <p className="text-blue-400 text-xs font-mono">@{stats.user.login}</p>
              <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-gray-400">
                <span>{stats.followers} Followers</span>
                <span>•</span>
                <span>{stats.repos.total} Total Repos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {statItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              className="glass p-6 sm:p-8 rounded-3xl border border-white/10 hover:border-blue-500/30 transition-all group shadow-xl relative overflow-hidden"
            >
              <div className={`p-3.5 bg-white/5 rounded-2xl ${item.color} mb-4 inline-block group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-1 tracking-tight">{item.value.toLocaleString()}</h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{item.label}</p>
              {item.subValue && (
                <p className="text-[11px] text-blue-400/80 mt-2 font-mono">{item.subValue}</p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Custom Native Merit Trophies (Built In-House) */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/30 text-amber-400">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">Merit Trophies</h3>
                <p className="text-xs text-gray-400 font-mono">Real-time engineering badges & verified benchmarks</p>
              </div>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 hidden sm:inline-block">
              ● Native Live Badges
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {nativeTrophies.map((trophy, i) => (
              <motion.div
                key={trophy.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                viewport={{ once: true }}
                className={`glass p-5 rounded-2xl border ${trophy.borderColor} relative overflow-hidden flex flex-col justify-between shadow-xl group`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${trophy.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:bg-white/10 transition-colors">
                      {trophy.icon}
                    </div>
                    <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/5">
                      {trophy.rank}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">{trophy.title}</h4>
                  <div className="text-xs font-mono text-emerald-400 font-bold mb-2">{trophy.val}</div>
                  <p className="text-gray-400 text-xs font-light leading-relaxed">
                    {trophy.description}
                  </p>
                </div>

                <div className="relative z-10 mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                  <span>Verified</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Developer-Centric Repository Explorer */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/10">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3 font-mono">
                <Terminal className="w-6 h-6 text-blue-400" /> $ git repo-explorer
              </h3>
              <p className="text-xs text-gray-400 font-mono mt-1">Explore production repositories, internal modules, and open-source packages.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Search Bar */}
              <div className="relative flex-grow w-full sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="$ search repos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#090a0f] border border-white/10 rounded-xl text-xs font-mono text-white focus:border-blue-500/50 transition-all outline-none"
                />
              </div>
              
              {/* Dev Filter Tabs */}
              <div className="flex p-1 bg-[#090a0f] rounded-xl border border-white/10 justify-between sm:justify-start">
                {['all', 'public', 'private'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all flex-1 sm:flex-none text-center cursor-pointer ${
                      filter === f ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <LayoutGroup>
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {filteredRepos.length > 0 ? (
                filteredRepos.map((repo, i) => (
                  <RepoCard key={repo.name} repo={repo} index={i} onViewInfo={() => fetchReadme(repo.name)} />
                ))
              ) : (
                <div className="col-span-full py-16 text-center glass rounded-3xl border border-dashed border-white/10 font-mono">
                  <Search className="w-10 h-10 text-gray-600 mx-auto mb-3 opacity-30" />
                  <p className="text-gray-400 text-xs">$ no repositories found matching query &quot;{searchTerm}&quot;</p>
                </div>
              )}
            </motion.div>
          </LayoutGroup>
        </div>

      </div>

      {/* README Modal */}
      <AnimatePresence>
        {selectedRepo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRepo(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-[#090a0f] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-full sm:h-auto max-h-[90vh] sm:max-h-[80vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <Terminal className="w-5 h-5 text-blue-400" />
                  <div>
                    <h3 className="text-xl font-bold text-white font-mono tracking-tight">{selectedRepo}</h3>
                    <p className="text-blue-400 text-xs font-mono">Repository Documentation (README.md)</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedRepo(null)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Modal Body */}
              <div className="p-6 sm:p-10 overflow-y-auto custom-scrollbar flex-grow bg-[#050508]">
                {loadingReadme ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    <p className="text-gray-400 font-mono text-xs tracking-wider">$ reading repository payload...</p>
                  </div>
                ) : (
                  <div className="prose prose-invert max-w-none 
                    prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
                    prose-p:text-gray-300 prose-p:leading-relaxed text-sm sm:text-base
                    prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                    prose-code:text-blue-300 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                    prose-pre:bg-[#090a0f] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl prose-pre:p-4 sm:prose-pre:p-6
                    prose-img:rounded-2xl prose-img:shadow-2xl
                    prose-ul:text-gray-300 prose-ol:text-gray-300
                    prose-blockquote:border-l-4 prose-blockquote:border-blue-500/50 prose-blockquote:bg-blue-500/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl
                    prose-hr:border-white/10">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        img: ({ node, ...props }) => {
                          let src = props.src;
                          if (src && !src.startsWith('http') && readmeData?.owner) {
                            const cleanPath = src.replace(/^\.\//, '').replace(/^\//, '');
                            if (readmeData.isPrivate) {
                              src = `/api/github/image?owner=${readmeData.owner}&repo=${readmeData.repo}&branch=${readmeData.branch}&path=${cleanPath}`;
                            } else {
                              src = `https://raw.githubusercontent.com/${readmeData.owner}/${readmeData.repo}/${readmeData.branch}/${cleanPath}`;
                            }
                          }
                          return (
                            <img 
                              {...props} 
                              src={src} 
                              className="rounded-2xl border border-white/10 shadow-2xl my-6 sm:my-8 mx-auto block max-w-full h-auto"
                              loading="lazy"
                            />
                          );
                        }
                      }}
                    >
                      {readmeData?.readme || ''}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
              
              {/* Modal Footer */}
              <div className="p-4 sm:p-6 border-t border-white/10 bg-[#090a0f] flex justify-end">
                <button 
                  onClick={() => setSelectedRepo(null)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-mono text-xs font-bold transition-all shadow-lg cursor-pointer"
                >
                  Close Terminal Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
