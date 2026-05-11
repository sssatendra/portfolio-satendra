'use client';

import { useState, useEffect } from 'react';
import { Star, GitFork, Users, BookOpen, Trophy, Activity, Lock, Globe, Search, ExternalLink, Filter, X, Loader2, ChevronRight, BarChart3 } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function RepoCard({ repo, index, onViewInfo }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: (index % 6) * 0.1 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex flex-col group h-full"
    >
      {/* Background Glow */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[2.5rem] opacity-0 transition-opacity duration-500 ${isHovered ? 'opacity-20 blur-xl' : ''}`} />
      
      <div className={`relative flex flex-col h-full glass rounded-[2.5rem] border border-white/5 transition-all duration-300 overflow-hidden ${isHovered ? 'border-blue-500/30 -translate-y-2' : ''}`}>
        <div className="p-8 flex flex-col h-full">
          <div className="flex justify-between items-start mb-6">
            <div className={`p-3.5 rounded-2xl bg-white/5 ${repo.isPrivate ? 'text-orange-400' : 'text-blue-400'}`}>
              {repo.isPrivate ? <Lock className="w-6 h-6" /> : <Globe className="w-6 h-6" />}
            </div>
            <div className="flex items-center gap-3">
              {repo.stars > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 rounded-full border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-tighter">
                  <Star className="w-3 h-3 fill-yellow-500" /> {repo.stars}
                </div>
              )}
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${repo.isPrivate ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                {repo.isPrivate ? 'Private' : 'Public'}
              </span>
            </div>
          </div>

          <h4 className="text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-blue-400 transition-colors">
            {repo.name}
          </h4>

          <p className="text-gray-400 text-sm font-light leading-relaxed mb-6 line-clamp-3">
            {repo.description || "Sophisticated project architecture and specialized logic developed for enterprise-grade application workflows."}
          </p>

          {/* Quick Stats - Always Visible */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-wrap gap-2">
              {repo.topics?.slice(0, 3).map(topic => (
                <span key={topic} className="px-2 py-0.5 bg-white/5 border border-white/10 text-gray-400 text-[9px] font-bold rounded-lg uppercase">
                  #{topic}
                </span>
              ))}
            </div>
            
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
              <Activity className="w-3.5 h-3.5 text-blue-500" />
              <span>
                Activity: {(() => {
                  const date = new Date(repo.updatedAt);
                  const now = new Date();
                  const diffInSeconds = Math.floor((now - date) / 1000);
                  if (diffInSeconds < 60) return 'Just now';
                  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
                  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
                  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                })()}
              </span>
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
            <div className="flex items-center gap-4">
              {repo.language && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: repo.langColor || '#888' }}></div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight">{repo.language}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewInfo();
                }}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg"
              >
                Docs
              </button>
              {!repo.isPrivate && (
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white/5 rounded-2xl border border-white/10 text-gray-500 hover:text-white transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
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
    
    // Find privacy status from existing stats
    const repoInfo = stats?.repos.list.find(r => r.name === repoName);
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
      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="text-gray-400 font-medium animate-pulse">Syncing GitHub achievements...</p>
    </div>
  );

  if (error) return (
    <div className="w-full py-10 text-center">
      <p className="text-red-400 bg-red-400/10 inline-block px-6 py-2 rounded-full border border-red-400/20">
        Error loading GitHub data: {error}
      </p>
    </div>
  );

  const filteredRepos = stats.repos.list.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filter === 'all' || 
                         (filter === 'public' && !repo.isPrivate) || 
                         (filter === 'private' && repo.isPrivate);
    return matchesSearch && matchesFilter;
  });

  const statItems = [
    { label: 'Total Contributions', value: stats.contributions, icon: <Activity className="w-5 h-5" />, color: 'text-green-400' },
    { label: 'Repositories', value: stats.repos.total, subValue: `${stats.repos.public} Public · ${stats.repos.private} Private`, icon: <BookOpen className="w-5 h-5" />, color: 'text-blue-400' },
    { label: 'Total Stars', value: stats.repos.stars, icon: <Star className="w-5 h-5" />, color: 'text-yellow-400' },
    { label: 'Followers', value: stats.followers, icon: <Users className="w-5 h-5" />, color: 'text-purple-400' },
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              <FaGithub className="w-4 h-4" /> Open Source Impact
            </div>
            <h2 className="text-5xl font-bold tracking-tight mb-4 text-gradient">GitHub Achievements</h2>
            <p className="text-gray-400 max-w-xl text-lg font-light leading-relaxed">
              Tracking my technical growth and contribution footprint across public and private ecosystems.
            </p>
          </div>
          
          <div className="flex items-center gap-6 p-6 glass rounded-3xl border border-white/5 shadow-2xl">
            <img src={stats.user.avatar} alt="GitHub Profile" className="w-20 h-20 rounded-2xl border-2 border-white/10 shadow-lg" />
            <div>
              <h4 className="text-2xl font-bold text-white tracking-tight">{stats.user.name || stats.user.login}</h4>
              <p className="text-blue-400 font-medium">@{stats.user.login}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {stats.followers} Followers</span>
                <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {stats.repos.total} Repos</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {statItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass p-8 rounded-[2rem] border border-white/5 hover:border-blue-500/30 transition-all group shadow-xl relative overflow-hidden"
            >
              <div className={`p-4 bg-white/5 rounded-2xl ${item.color} mb-6 inline-block group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <h3 className="text-4xl font-bold text-white mb-2 tracking-tighter">{item.value.toLocaleString()}</h3>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">{item.label}</p>
              {item.subValue && (
                <p className="text-xs text-blue-400/60 mt-3 font-medium uppercase tracking-tight">{item.subValue}</p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Trophies Section */}
        <div className="glass p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden mb-16">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
            <Trophy className="w-64 h-64 text-blue-500" />
          </div>
          
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-400">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Merit Trophies</h3>
          </div>

          <div className="relative w-full overflow-hidden">
            <div className="flex flex-wrap justify-center gap-6">
              <img 
                src={`https://github-profile-trophy.vercel.app/?username=${stats.user.login}&theme=radical&no-frame=true&margin-w=4&row=1&column=7`}
                alt="GitHub Trophies"
                className="max-w-full h-auto filter drop-shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>

        {/* Repository Explorer */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <h3 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-400" /> Repository Explorer
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm focus:border-blue-500/50 transition-all outline-none"
                />
              </div>
              
              <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
                {['all', 'public', 'private'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

        <LayoutGroup>
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {filteredRepos.length > 0 ? (
              filteredRepos.map((repo, i) => (
                <RepoCard key={repo.name} repo={repo} index={i} onViewInfo={() => fetchReadme(repo.name)} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center glass rounded-[2rem] border border-dashed border-white/10">
                <Search className="w-12 h-12 text-gray-600 mx-auto mb-4 opacity-20" />
                <p className="text-gray-500 font-medium tracking-wide">No repositories found matching your search.</p>
              </div>
            )}
          </motion.div>
        </LayoutGroup>
        </div>
        </div>

        {/* README Modal */}
        <AnimatePresence>
          {selectedRepo && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedRepo(null)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
              >
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">{selectedRepo}</h3>
                    <p className="text-blue-400 text-sm font-medium">Project Documentation</p>
                  </div>
                  <button 
                    onClick={() => setSelectedRepo(null)}
                    className="p-3 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="p-10 overflow-y-auto custom-scrollbar flex-grow bg-[#050505]">
                  {loadingReadme ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                      <p className="text-gray-500 font-medium tracking-widest uppercase text-xs">Analyzing repository content...</p>
                    </div>
                  ) : (
                    <div className="prose prose-invert max-w-none 
                      prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
                      prose-p:text-gray-300 prose-p:leading-relaxed
                      prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                      prose-code:text-blue-300 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                      prose-pre:bg-white/[0.03] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl prose-pre:p-6
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
                              // Transform relative path
                              const cleanPath = src.replace(/^\.\//, '').replace(/^\//, '');
                              
                              if (readmeData.isPrivate) {
                                // For private repos, use our secure proxy API
                                src = `/api/github/image?owner=${readmeData.owner}&repo=${readmeData.repo}&branch=${readmeData.branch}&path=${cleanPath}`;
                              } else {
                                // For public repos, use direct GitHub raw URL
                                src = `https://raw.githubusercontent.com/${readmeData.owner}/${readmeData.repo}/${readmeData.branch}/${cleanPath}`;
                              }
                            }
                            return (
                              <img 
                                {...props} 
                                src={src} 
                                className="rounded-2xl border border-white/10 shadow-2xl my-10 mx-auto block max-w-full h-auto"
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
                
                <div className="p-6 border-t border-white/5 bg-white/[0.02] flex justify-end">
                   <button 
                    onClick={() => setSelectedRepo(null)}
                    className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-xl"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
    </section>
  );
}
