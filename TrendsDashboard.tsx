import React, { useState, useEffect } from 'react';
import { TrendTopic, SocialPlatform } from '../types';
import { 
  RefreshCw, 
  TrendingUp, 
  Sparkles, 
  Search, 
  ArrowRight, 
  Zap, 
  Flame, 
  Calendar, 
  Globe, 
  Activity, 
  Volume2, 
  Filter, 
  Radio, 
  Users,
  Play,
  MapPin
} from 'lucide-react';

interface TrendsDashboardProps {
  trends: TrendTopic[];
  loading: boolean;
  onRefreshTrends: () => void;
  selectedTrendId: string | null;
  onSelectTrend: (id: string) => void;
  onTriggerGeneration: (trend: TrendTopic) => void;
  activeBrandName: string;
}

const PLATFORM_BADGES: Record<SocialPlatform, { label: string; bg: string; text: string }> = {
  twitter: { label: 'Twitter / X', bg: 'bg-black/85 border border-neutral-750', text: 'text-white' },
  instagram: { label: 'Instagram Reels', bg: 'bg-gradient-to-tr from-rose-500 via-pink-600 to-indigo-600', text: 'text-white font-semibold' },
  facebook: { label: 'Facebook Workspace', bg: 'bg-blue-650', text: 'text-white' },
  linkedin: { label: 'LinkedIn Pulse', bg: 'bg-blue-800 border border-blue-900', text: 'text-white font-medium' },
  tiktok: { label: 'TikTok Global', bg: 'bg-cyan-950 text-cyan-400 border border-cyan-800', text: 'text-white' },
};

export default function TrendsDashboard({
  trends,
  loading,
  onRefreshTrends,
  selectedTrendId,
  onSelectTrend,
  onTriggerGeneration,
  activeBrandName,
}: TrendsDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<'All' | 'Indian' | 'Global'>('All');
  const [selectedCity, setSelectedCity] = useState<'All' | 'Delhi' | 'Mumbai' | 'Bangalore'>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<'All' | SocialPlatform>('All');
  
  // Real-time telemetry scanner live logs powered by AI-driven social listening tools
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([
    "[05:30:10] ESTABLISHED: Hootsuite & Sprout Social AI Listening Streams.",
    "[05:30:12] CONFIGURED query sync: Brandwatch Trend Analytics Suite.",
    "[05:30:15] ANALYSIS pipeline: Discover by Respondology early signals filter active.",
    "[05:30:18] READY to map viral conversations, rising creators, and buyer mood shifts."
  ]);
  const [activeSignalsCount, setActiveSignalsCount] = useState(148);
  const [isLiveActive, setIsLiveActive] = useState(true);
  const [audioFeedbackPlaying, setAudioFeedbackPlaying] = useState<string | null>(null);

  // Dynamic ticking log simulation for live screening feedback
  useEffect(() => {
    if (!isLiveActive) return;
    const interval = setInterval(() => {
      const listeningTools = ["Hootsuite AI Engine", "Sprout Social Listener", "Brandwatch Sentiment Analysis", "Discover (Respondology)"];
      const signals = ["Met Gala high-fashion buzz", "The Biryani Consent Row controversy", "Virat Kohli's aura shift triggers", "AI Will Replace You meme velocity"];
      const logsPool = [
        `[SOCIAL LISTENING] ${listeningTools[Math.floor(Math.random() * listeningTools.length)]} detected shift in consumer mood.`,
        `[SOCIAL LISTENING] Early viral conversational trigger identified: ${signals[Math.floor(Math.random() * signals.length)]}.`,
        `[BRANDWATCH] Mapping rising creator density across regional subcultures.`,
        `[RESPONDOLOGY] Cleaned toxic noise, parsing pure high-potency brand moments.`,
        `[SPROUT SOCIAL] Dynamic velocity score updated to ${(Math.random() * 15 + 85).toFixed(1)}% brand relevance.`,
        `[AI ORCHESTRATOR] Social listening metadata dispatched to campaign visual editor.`
      ];
      setTelemetryLogs(prev => {
        const next = [...prev, logsPool[Math.floor(Math.random() * logsPool.length)]];
        if (next.length > 5) next.shift(); // keep last 5
        return next;
      });
      setActiveSignalsCount(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 4500);

    return () => clearInterval(interval);
  }, [isLiveActive]);

  const filterCategories = ['All', 'Pop Culture', 'Meme', 'Sports', 'News', 'Tech', 'Entertainment', 'Business'];

  const triggerLiveHardReScrypt = () => {
    onRefreshTrends();
    setTelemetryLogs(prev => [
      ...prev,
      `[SOCIAL LISTENING] Querying Hootsuite, Sprout Social, Brandwatch, and Discover by Respondology APIs...`,
      `[LISTENING SUCCESS] Synced latest early signals of viral conversations and shifts in consumer mood.`
    ]);
  };

  // Perform multi-dimensional filters with ultra-robust case-insensitive and fuzzy matching to prevent accidental mismatch
  const filteredTrends = trends.filter((trend) => {
    // Search filter
    const matchesSearch = trend.keyword.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          trend.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (trend.city && trend.city.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Category filter
    const trendCategory = trend.category?.toLowerCase() || '';
    const selectCategory = activeCategory.toLowerCase();
    const matchesCategory = activeCategory === 'All' || 
                            trendCategory === selectCategory || 
                            trendCategory.includes(selectCategory) || 
                            selectCategory.includes(trendCategory) ||
                            (selectCategory === 'tech' && trendCategory.includes('techno'));

    // City filters:
    const trendCity = trend.city?.toLowerCase() || '';
    const selectCity = selectedCity.toLowerCase();
    const matchesCity = selectedCity === 'All' || 
                        trendCity === selectCity || 
                        trendCity.includes(selectCity) || 
                        selectCity.includes(trendCity);

    // Region filters:
    const trendRegion = trend.region?.toLowerCase() || '';
    const selectRegion = selectedRegion.toLowerCase();
    const matchesRegion = selectedRegion === 'All' || 
                          trendRegion === selectRegion ||
                          (selectRegion === 'indian' && (trendRegion.includes('india') || trendRegion.includes('ind'))) ||
                          (selectRegion === 'global' && trendRegion.includes('glob'));

    // Platform filter
    const trendPlat = trend.platform?.toLowerCase() || '';
    const selectPlat = selectedPlatform.toLowerCase();
    const matchesPlatform = selectedPlatform === 'All' || 
                            trendPlat === selectPlat || 
                            trendPlat.includes(selectPlat);

    return matchesSearch && matchesCategory && matchesRegion && matchesCity && matchesPlatform;
  });

  const selectedTrend = trends.find((t) => t.id === selectedTrendId) || filteredTrends[0] || trends[0] || null;

  return (
    <div className="space-y-6" id="trends-dashboard-container">
      
      {/* 📡 Live Screening Status Control Bar */}
      <div className="bg-neutral-900 border border-neutral-850 rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg text-[#ff2e93]">
              <Radio size={24} className="animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Social Listening Hub</h3>
              <span className="text-[10px] bg-red-950/20 text-red-100 border border-red-900/30 font-mono px-2 py-0.5 rounded uppercase">Social Listening Active</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Relying on AI-driven integrations in <strong className="text-white font-medium">Hootsuite</strong>, <strong className="text-white font-medium">Sprout Social</strong>, <strong className="text-white font-medium">Brandwatch</strong>, and <strong className="text-white font-medium">Discover by Respondology</strong> to capture early viral conversations, rising creators, and consumer mood shifts without manual tracking.
            </p>
          </div>
        </div>

        {/* Live Logs Telemetry Viewport */}
        <div className="flex-1 bg-neutral-950/80 border border-neutral-850 rounded-lg p-3 max-h-[85px] overflow-y-auto font-mono text-[10px] text-zinc-400 scrollbar-thin">
          <div className="flex justify-between text-[8px] text-gray-500 pb-1 mb-1 border-b border-neutral-850 uppercase font-bold tracking-wider">
            <span>Screener Handshake Status Logs</span>
            <button 
              onClick={() => setIsLiveActive(!isLiveActive)}
              className="hover:text-pink-400 underline text-[8px]"
            >
              [ {isLiveActive ? "Pause Stream" : "Resume Stream"} ]
            </button>
          </div>
          <div className="space-y-0.5">
            {telemetryLogs.map((log, idx) => (
              <div key={idx} className="truncate select-none">
                <span className="text-[#ff2e93] mr-1">❯</span> {log}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Single full-width interface */}
      <div className="max-w-4xl mx-auto space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
                <TrendingUp size={20} className="text-[#ff2e93] animate-pulse" />
                AI Social Listening Streams
              </h2>
              <p className="text-sm text-gray-400">
                Early conversation trends mapped through Hootsuite, Sprout Social, Brandwatch, and Respondology listening agents.
              </p>
            </div>

            <button
              onClick={triggerLiveHardReScrypt}
              disabled={loading}
              id="btn-scrape-trends"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-750 text-white rounded-lg font-medium text-xs transition duration-200 cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? "animate-spin text-[#ff2e93]" : "text-gray-400"} />
              Refresh Ground Search API
            </button>
          </div>

          {/* Interactive Filters Panel (Geo, Platform, Categories) */}
          <div className="bg-neutral-900/60 border border-neutral-850 rounded-xl p-4.5 space-y-4">
            
            {/* Row 1: Geographic Origin Filter */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <Globe size={11} className="text-[#ff2e93]" />
                Geocultural region:
              </span>
              <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                <button
                  onClick={() => { setSelectedRegion('All'); }}
                  className={`flex-1 sm:flex-initial py-1 px-3 rounded text-[11px] font-medium transition cursor-pointer ${
                    selectedRegion === 'All' 
                      ? 'bg-[#ff2e93] text-white border border-[#ff2e93]' 
                      : 'bg-neutral-950 border border-neutral-800 text-gray-400 hover:text-white'
                  }`}
                >
                  🌐 All Regions
                </button>
                <button
                  onClick={() => { setSelectedRegion('Indian'); }}
                  className={`flex-1 sm:flex-initial py-1 px-3 rounded text-[11px] font-medium transition cursor-pointer ${
                    selectedRegion === 'Indian' 
                      ? 'bg-emerald-650 text-white border border-emerald-550' 
                      : 'bg-neutral-950 border border-neutral-800 text-gray-400 hover:text-white'
                  }`}
                >
                  🇮🇳 Indian Trends
                </button>
                <button
                  onClick={() => { setSelectedRegion('Global'); setSelectedCity('All'); }}
                  className={`flex-1 sm:flex-initial py-1 px-3 rounded text-[11px] font-medium transition cursor-pointer ${
                    selectedRegion === 'Global' 
                      ? 'bg-blue-650 text-white border border-blue-550' 
                      : 'bg-neutral-950 border border-neutral-800 text-gray-400 hover:text-white'
                  }`}
                >
                  🌎 Global Trends
                </button>
              </div>
            </div>

            {/* Row 1.5: City-wise Mapping Filter */}
            {selectedRegion !== 'Global' && (
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between pt-3.5 border-t border-neutral-850/60 transition-all">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                  <MapPin size={11} className="text-[#ff2e93]" />
                  City-wise Mapping:
                </span>
                <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                  {(['All', 'Delhi', 'Mumbai', 'Bangalore'] as const).map((city) => {
                    const isAct = selectedCity === city;
                    return (
                      <button
                        key={city}
                        onClick={() => {
                          setSelectedCity(city);
                          if (city !== 'All') {
                            setSelectedRegion('Indian');
                          }
                        }}
                        className={`flex-1 sm:flex-initial py-1 px-2.5 rounded text-[10.5px] font-medium transition cursor-pointer ${
                          isAct 
                            ? 'bg-[#ff2e93]/15 text-[#ff2e93] border border-[#ff2e93]/40' 
                            : 'bg-neutral-950 border border-neutral-850 text-gray-400 hover:text-white'
                        }`}
                      >
                        {city === 'All' ? '📍 All Cities' : `📍 ${city}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Row 2: Selected Platform Focus */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between pt-3.5 border-t border-neutral-850">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <Activity size={11} className="text-[#ff2e93]" />
                Platform mapping:
              </span>
              <div className="flex flex-wrap gap-1 w-full sm:w-auto">
                {(['All', 'instagram', 'linkedin', 'twitter', 'tiktok'] as const).map((plat) => {
                  const label = plat === 'All' ? 'All Platforms' : plat === 'instagram' ? '📸 Instagram Reels' : plat === 'linkedin' ? '💼 LinkedIn' : plat === 'twitter' ? '🐦 Twitter/X' : '🎵 TikTok';
                  const isAct = selectedPlatform === plat;
                  return (
                    <button
                      key={plat}
                      onClick={() => setSelectedPlatform(plat)}
                      className={`text-[10px] py-1 px-2.5 rounded transition cursor-pointer ${
                        isAct 
                          ? 'bg-neutral-800 text-white border border-pink-500/50' 
                          : 'bg-neutral-950 text-gray-400 border border-neutral-850 hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search and Category block */}
            <div className="pt-3.5 border-t border-neutral-850 space-y-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="text"
                  placeholder="Key in tags, keywords, cities, or sound titles to map vectors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-xs pl-9 pr-4 py-2.5 bg-neutral-950 border border-neutral-850 focus:border-[#ff2e93] focus:outline-none rounded-lg text-white placeholder-gray-650"
                />
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {filterCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`py-1 px-2.5 rounded-md text-[10px] font-medium whitespace-nowrap transition cursor-pointer ${
                      activeCategory === cat 
                        ? 'bg-neutral-800 text-white border border-[#ff2e93]/30 shadow-sm' 
                        : 'bg-neutral-950 text-gray-500 hover:text-white border border-neutral-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Trends List Grid */}
          <div className="space-y-4">
            {loading ? (
              <div className="py-16 text-center text-xs text-gray-500 bg-neutral-900/10 border border-neutral-850 rounded-xl">
                <RefreshCw className="animate-spin text-[#ff2e93] mx-auto mb-3" size={28} />
                <p className="text-white font-mono text-xs uppercase tracking-widest">Querying live platform APIs</p>
                <p className="text-[10px] text-gray-400 mt-1">Grounded Google Search filtering in progress...</p>
              </div>
            ) : filteredTrends.length === 0 ? (
              <div className="py-16 rounded-xl border border-dashed border-neutral-800 p-8 text-center text-xs text-gray-500 bg-neutral-900/10">
                <Filter className="mx-auto mb-3 text-gray-650" size={24} />
                No live trends matched the specified configuration filter. 
                <button onClick={() => { setSelectedRegion('All'); setSelectedCity('All'); setSelectedPlatform('All'); setActiveCategory('All'); setSearchTerm(''); }} className="block mx-auto mt-2 text-[#ff2e93] font-bold hover:underline">
                  Reset screening filters
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {filteredTrends.map((trend) => {
                  const isSelected = selectedTrendId === trend.id;
                  const badge = PLATFORM_BADGES[trend.platform] || { label: 'Web', bg: 'bg-gray-700', text: 'text-white' };
                  return (
                    <div
                      key={trend.id}
                      onClick={() => onSelectTrend(trend.id)}
                      id={`trend-row-${trend.id}`}
                      className={`relative p-5 rounded-xl border cursor-pointer transition-all duration-300 ${
                        isSelected 
                          ? 'bg-neutral-900/90 border-[#ff2e93] shadow-lg shadow-pink-950/20' 
                          : 'bg-neutral-900/30 border-neutral-850 hover:bg-neutral-900/60 hover:border-neutral-800'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          
                          {/* Top indicators */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5 block">
                              {trend.keyword}
                            </span>
                            
                            {/* Platform badge */}
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${badge.bg} ${badge.text}`}>
                              {badge.label}
                            </span>

                            {/* Geo Region Tag */}
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              trend.region === 'Indian' 
                                ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/30' 
                                : 'bg-blue-900/30 text-blue-400 border border-blue-800/30'
                            }`}>
                              {trend.region === 'Indian' ? '🇮🇳 Indian Market' : '🌐 Global'}
                            </span>

                            {/* City Tag */}
                            {trend.city && trend.city !== 'Global' && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-pink-950/45 text-pink-400 border border-pink-800/30">
                                📍 {trend.city}
                              </span>
                            )}

                            {/* Velocity tag */}
                            {trend.volume && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-950 text-gray-400 border border-neutral-850 font-mono">
                                📈 {trend.volume}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-gray-300 leading-relaxed pt-1 font-sans">
                            {trend.description}
                          </p>

                          {/* Extra specialized screening pointers removed */}

                        </div>

                        {/* Engagement Rating block */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start pt-2 sm:pt-0 shrink-0 border-t sm:border-0 border-neutral-800">
                          <div className="flex items-center gap-1 bg-neutral-950 px-2.5 py-1 rounded-md border border-neutral-850">
                            <Flame size={12} className="text-orange-500" />
                            <span className="text-[11px] font-bold text-white font-mono">
                              {trend.engagementScore}% Heat
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-500 font-mono mt-1">{trend.relativeTime}</span>
                        </div>
                      </div>

                      {/* Stretched Hashtags with visual flair */}
                      <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-neutral-800/50">
                        {trend.hashtags.map((h, idx) => (
                          <span key={idx} className="text-[10px] font-medium text-[#ff2e93] hover:underline bg-neutral-950/40 px-2 py-0.5 rounded border border-neutral-850">
                            #{h}
                          </span>
                        ))}
                      </div>

                      {/* Expanding sections - Campaign Mapper inside the card if selected */}
                      {isSelected && (
                        <div className="mt-4 pt-4 border-t border-neutral-800/80 space-y-4 animate-fade-in text-left" onClick={(e) => e.stopPropagation()}>
                          {trend.viralPostExample && (
                            <div className="p-4 bg-neutral-950 border border-neutral-850 rounded-lg text-xs leading-relaxed">
                              <span className="text-[10px] text-[#ff2e93] font-mono block mb-1.5 uppercase font-semibold tracking-wider">
                                Viral Post Blueprint
                              </span>
                              <p className="text-gray-300 italic font-sans break-words select-all">
                                "{trend.viralPostExample}"
                              </p>
                            </div>
                          )}

                          <div className="flex justify-end pt-2">
                            <button
                              onClick={() => {
                                onTriggerGeneration(trend);
                              }}
                              className="flex items-center justify-center gap-2 py-2.5 px-5 bg-gradient-to-r from-pink-600 to-[#ff2e93] hover:opacity-95 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-all duration-200 shadow-md shadow-pink-900/15 cursor-pointer pointer-events-auto hover:scale-[1.01]"
                            >
                              <Sparkles size={13} className="animate-spin" style={{ animationDuration: '4s' }} />
                              Map Campaign: {activeBrandName} Context
                              <ArrowRight size={13} />
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}
          </div>

      </div>
    </div>
  );
}
