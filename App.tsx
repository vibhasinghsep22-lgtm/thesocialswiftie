import React, { useState, useEffect } from 'react';
import { BrandProfile, TrendTopic, GeneratedCreative } from './types';
import { CLIENT_FALLBACK_TRENDS } from './fallbackTrends';
import GridOverlay from './components/GridOverlay';
import BrandLibrary from './components/BrandLibrary';
import TrendsDashboard from './components/TrendsDashboard';
import VisualEditor from './components/VisualEditor';
import { Sparkles, TrendingUp, Palette, Edit2, Share2, Star, Zap, Library, Layers, Settings, Key } from 'lucide-react';

// Preset Brand Profiles to provide immediate agency capability
const DEFAULTS_BRANDS: BrandProfile[] = [
  {
    id: 'brand-zomato',
    name: 'Zomato',
    tagline: 'Never have a bad meal. India\'s favorite food-tech app.',
    handle: '@zomato',
    industry: 'Food Delivery & Discovery Platform',
    brandVoice: 'witty',
    fontFamily: 'Outfit',
    logoUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=150&h=150&q=80',
    colorPalette: {
      primary: '#e23744',
      secondary: '#0c0c0c',
      accent: '#ffffff',
      background: '#111111',
      text: '#ffffff'
    },
    images: [
      { id: 'z1', name: 'Delicious Hot Biryani Pot', url: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=500&q=80' },
      { id: 'z2', name: 'Cheesy Pepperoni Pizza Slice', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80' }
    ],
    description: 'The leading restaurant discovery and food delivery application bringing lightning-fast delicious meals and heartwarming food-tech culture to millions of doorsteps daily.'
  },
  {
    id: 'brand-subway',
    name: 'Subway',
    tagline: 'Eat Fresh.',
    handle: '@subway_india',
    industry: 'Fast Food Restaurant',
    brandVoice: 'witty',
    fontFamily: 'Outfit',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Subway_2016_logo.svg/512px-Subway_2016_logo.svg.png',
    colorPalette: {
      primary: '#008938',
      secondary: '#ffc72c',
      accent: '#ffffff',
      background: '#001e0a',
      text: '#ffffff'
    },
    images: [
      { id: 's1', name: 'Signature Fresh Sub', url: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=500&q=80' },
      { id: 's2', name: 'Vibrant Salad Mix', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80' },
      { id: 's3', name: 'Double Choco Chip Cookie', url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=500&q=80' }
    ],
    description: 'The world\'s leading sub sandwich restaurant chain, serving delicious, fully-toasted customized footlong subs adorned with fresh vegetables.'
  },
  {
    id: 'brand-hinge',
    name: 'Hinge',
    tagline: 'Designed to be deleted.',
    handle: '@hinge',
    industry: 'Social Relationships & Dating Platform',
    brandVoice: 'minimalist',
    fontFamily: 'Playfair Display',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Hinge_logo_2019.svg/512px-Hinge_logo_2019.svg.png',
    colorPalette: {
      primary: '#1b1412',
      secondary: '#fcfbfa',
      accent: '#a63d40',
      background: '#121212',
      text: '#fcfbfa'
    },
    images: [
      { id: 'h1', name: 'Warm Couple Date', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=500&q=80' },
      { id: 'h2', name: 'Chat Interaction Grid', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80' },
      { id: 'h3', name: 'Cozy Coffee Date Atmosphere', url: 'https://images.unsplash.com/photo-1517254485354-6978622181a4?auto=format&fit=crop&w=500&q=80' }
    ],
    description: 'The matchmaking app centered on deep, meaningful connections, intentionally built with the ultimate mission to be deleted once couples find love.'
  },
  {
    id: 'brand-snapchat',
    name: 'Snapchat',
    tagline: 'Share the moment.',
    handle: '@snapchat',
    industry: 'Augmented Camera Social Messaging',
    brandVoice: 'bold',
    fontFamily: 'Space Grotesk',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c4/Snapchat_logo.svg/512px-Snapchat_logo.svg.png',
    colorPalette: {
      primary: '#fffc00',
      secondary: '#000000',
      accent: '#fffc00',
      background: '#000000',
      text: '#ffffff'
    },
    images: [
      { id: 'snap1', name: 'Augmented reality overlay', url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=500&q=80' },
      { id: 'snap2', name: 'Selfie Camera filter lenses', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80' }
    ],
    description: 'A fun, high-speed camera-based chatting app that enables visual snap messaging, AR overlays, and creative stories.'
  },
  {
    id: 'brand-tuborg',
    name: 'Tuborg',
    tagline: 'Always More.',
    handle: '@tuborg_lager',
    industry: 'Premium Lager & Brewery Brand',
    brandVoice: 'bold',
    fontFamily: 'Inter',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Tuborg_logo.svg/512px-Tuborg_logo.svg.png',
    colorPalette: {
      primary: '#005c30',
      secondary: '#ffffff',
      accent: '#e30613',
      background: '#04150c',
      text: '#ffffff'
    },
    images: [
      { id: 'tbg1', name: 'Chilled Pilsner Condensation', url: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=500&q=80' },
      { id: 'tbg2', name: 'Pulse Concert Stadium Crowd', url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=500&q=80' }
    ],
    description: 'A globally acclaimed Danish premium pilsner beer, celebrating friendship, high energy, and visual alignments with epic live music tours.'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'trends' | 'brands' | 'editor'>('trends');
  
  // Persistence using local localStorage with self-correcting fallback
  const [brands, setBrands] = useState<BrandProfile[]>(() => {
    const cached = localStorage.getItem('tm_brands');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.some((b: any) => b.id === 'brand-subway' && b.logoUrl)) {
          // Exclude brand-toaster and make sure brand-zomato is injected
          const filtered = parsed.filter((b: any) => b.id !== 'brand-toaster');
          if (!filtered.some((b: any) => b.id === 'brand-zomato')) {
            const zomatoBrand = DEFAULTS_BRANDS.find(b => b.id === 'brand-zomato');
            if (zomatoBrand) {
              return [zomatoBrand, ...filtered];
            }
          }
          return filtered;
        }
      } catch (err) {
        console.warn('Stale cache, loading defaults');
      }
    }
    return DEFAULTS_BRANDS;
  });

  const [activeBrandId, setActiveBrandId] = useState<string>(() => {
    const cached = localStorage.getItem('tm_active_brand_id');
    return cached === 'brand-toaster' || !cached ? 'brand-zomato' : cached;
  });

  const [trends, setTrends] = useState<TrendTopic[]>(CLIENT_FALLBACK_TRENDS);
  const [selectedTrendId, setSelectedTrendId] = useState<string | null>(() => {
    return CLIENT_FALLBACK_TRENDS[0]?.id || null;
  });
  const [creative, setCreative] = useState<GeneratedCreative | null>(() => {
    const cached = localStorage.getItem('tm_active_creative');
    return cached ? JSON.parse(cached) : null;
  });

  const [loadingTrends, setLoadingTrends] = useState(false);
  const [generatingCreative, setGeneratingCreative] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiKeyNotice, setApiKeyNotice] = useState<string | null>(null);

  // Custom user overridden API key to handle quota problems
  const [customApiKey, setCustomApiKey] = useState<string>(() => {
    return localStorage.getItem('ts_custom_gemini_key') || '';
  });
  const [showKeyOverride, setShowKeyOverride] = useState(false);

  // Guided AI Multi-Step Concept flow states
  const [concepts, setConcepts] = useState<any[] | null>(null);
  const [loadingConcepts, setLoadingConcepts] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState<any | null>(null);
  const [visualPrompt, setVisualPrompt] = useState('');

  // Sync state variables to localStorage
  useEffect(() => {
    localStorage.setItem('tm_brands', JSON.stringify(brands));
  }, [brands]);

  useEffect(() => {
    localStorage.setItem('tm_active_brand_id', activeBrandId);
  }, [activeBrandId]);

  useEffect(() => {
    if (creative) {
      localStorage.setItem('tm_active_creative', JSON.stringify(creative));
    } else {
      localStorage.removeItem('tm_active_creative');
    }
  }, [creative]);

  // Fetch actual grounded trends from Express API on startup
  useEffect(() => {
    fetchLiveTrends();
  }, []);

  const fetchLiveTrends = async () => {
    setLoadingTrends(true);
    setApiError(null);
    try {
      const headers: Record<string, string> = {};
      const savedKey = localStorage.getItem('ts_custom_gemini_key') || '';
      if (savedKey) {
        headers['X-Custom-Gemini-Key'] = savedKey;
      }
      const response = await fetch('/api/trends', { headers });
      const data = await response.json();
      if (data && Array.isArray(data.trends)) {
        setTrends(data.trends);
        if (data.trends.length > 0) {
          setSelectedTrendId(data.trends[0].id);
        }
        if (data.apiKeyNotice) {
          setApiKeyNotice(data.apiKeyNotice);
        }
      } else {
        throw new Error("Invalid schema inside trends indices.");
      }
    } catch (err) {
      console.error("Failed to connect trends feed network:", err);
      setApiError("Using offline cached social templates database indicators.");
      setTrends(CLIENT_FALLBACK_TRENDS);
    } finally {
      setLoadingTrends(false);
    }
  };

  // Select active active brand profile structure
  const getActiveBrand = (): BrandProfile => {
    return brands.find((b) => b.id === activeBrandId) || brands[0];
  };

  // Brainstorm and fetch 3 concepts using active brand and trend parameters
  const triggerConceptDrafting = async (trend: TrendTopic) => {
    const currentBrand = getActiveBrand();
    setLoadingConcepts(true);
    setApiError(null);
    setApiKeyNotice(null);
    setConcepts(null);
    setSelectedConcept(null);
    setCreative(null);
    setActiveTab('editor'); // automatically direct visual interface

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const savedKey = localStorage.getItem('ts_custom_gemini_key') || '';
      if (savedKey) {
        headers['X-Custom-Gemini-Key'] = savedKey;
      }
      const response = await fetch('/api/concepts', {
        method: 'POST',
        headers,
        body: JSON.stringify({ trend, brand: currentBrand }),
      });

      if (!response.ok) throw new Error("Server failed to draft concepts.");
      
      const data = await response.json();
      if (data && Array.isArray(data.concepts)) {
        setConcepts(data.concepts);
        if (data.apiKeyNotice) {
          setApiKeyNotice(data.apiKeyNotice);
        }
      } else {
        throw new Error("Concepts engine returned invalid format.");
      }
    } catch (err) {
      console.error("Concepts parsing error:", err);
      setApiError("Concepts engine failed. Reverting to local high-fidelity fallback campaign paths.");
    } finally {
      setLoadingConcepts(false);
    }
  };

  // Generate Canva Creative Post using selected concept and customized background description
  const triggerCampaignGeneration = async (trend: TrendTopic, concept: any, customBgPrompt?: string) => {
    const currentBrand = getActiveBrand();
    setGeneratingCreative(true);
    setApiError(null);
    setApiKeyNotice(null);
    setActiveTab('editor');

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const savedKey = localStorage.getItem('ts_custom_gemini_key') || '';
      if (savedKey) {
        headers['X-Custom-Gemini-Key'] = savedKey;
      }
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          trend, 
          brand: currentBrand, 
          selectedConcept: concept, 
          customPrompt: customBgPrompt 
        }),
      });

      if (!response.ok) throw new Error("Server failed to compile visual design.");
      
      const data = await response.json();
      if (data && data.creative) {
        setCreative(data.creative);
        if (data.apiKeyNotice) {
          setApiKeyNotice(data.apiKeyNotice);
        }
      } else {
        throw new Error("Gemini design engine failed to compose post elements.");
      }
    } catch (err) {
      console.error("AI composition error:", err);
      setApiError("Failed compiling post. Check your environment secret key.");
    } finally {
      setGeneratingCreative(false);
    }
  };

  const handleCreativeChange = (updated: GeneratedCreative) => {
    setCreative(updated);
  };

  const activeBrandProfile = getActiveBrand();
  const selectedTrend = trends.find((t) => t.id === selectedTrendId) || trends[0] || null;

  return (
    <div className="min-h-screen bg-[#060608] text-gray-100 flex flex-col relative selection:bg-[#ff2e93]/30 selection:text-[#ff2e93] font-sans antialiased overflow-x-hidden">
      
      {/* Aesthetic grid mesh lines & custom cosmic neon blobs mimicking TOASTER mockups */}
      <GridOverlay />

      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-[#060608]/80 backdrop-blur-md border-b border-neutral-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          
          {/* Logo brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-pink-600 via-[#ff2e93] to-purple-600 flex items-center justify-center font-black text-white text-md shadow-lg shadow-pink-950/20">
              TS
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-white text-md uppercase font-mono">
                The<span className="text-[#ff2e93]">Swiftie</span>Project
              </span>
              <span className="text-[9px] uppercase tracking-widest text-pink-500 font-bold block leading-none">
                Moment Marketing Engine
              </span>
            </div>
          </div>

          {/* Tab selectors */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-850 rounded-lg">
            <button
              onClick={() => setActiveTab('trends')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition ${
                activeTab === 'trends' 
                  ? 'bg-neutral-840 text-white font-semibold' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <TrendingUp size={13} className="text-[#ff2e93]" />
              Live Social Trends
            </button>
            <button
              onClick={() => setActiveTab('brands')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition ${
                activeTab === 'brands' 
                  ? 'bg-neutral-840 text-white font-semibold' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Library size={13} className="text-[#ff2e93]" />
              Brand Libraries
            </button>
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition ${
                activeTab === 'editor' 
                  ? 'bg-neutral-840 text-white font-semibold' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers size={13} className="text-[#ff2e93]" />
              Visual Ad Workshop
            </button>
          </nav>

          {/* Quick Active Brand select dropdown */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block">Active Client</span>
              <span className="text-xs font-semibold text-white">{activeBrandProfile.name}</span>
            </div>

            <select
              value={activeBrandId}
              onChange={(e) => setActiveBrandId(e.target.value)}
              className="px-2.5 py-1.5 bg-neutral-900 border border-neutral-850 hover:border-neutral-700 text-white text-xs font-semibold rounded-lg focus:outline-none cursor-pointer"
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.brandVoice})
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowKeyOverride(!showKeyOverride)}
              className={`p-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition flex items-center justify-center ${
                showKeyOverride || customApiKey
                  ? 'bg-pink-950/20 text-[#ff2e93] border-[#ff2e93]/40 hover:bg-pink-950/45'
                  : 'bg-neutral-900 text-gray-400 border-neutral-850 hover:text-white hover:border-neutral-700'
              }`}
              title="Custom API Settings (Quota Override)"
            >
              <Settings size={15} className={showKeyOverride ? "animate-spin" : ""} style={{ animationDuration: '3s' }} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Dynamic API Key Custom Override Section */}
        {showKeyOverride && (
          <div className="mb-6 bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-2xl relative animate-fade-in z-20">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-2 font-mono uppercase tracking-wider">
              <Key className="w-4 h-4 text-[#ff2e93]" />
              Custom API Settings (Quota Override)
            </h3>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed font-sans">
              Is the shared API key experiencing heavy usage limits? Paste your own personal <strong className="text-pink-400">Gemini API Key</strong> below to run with a clean quota. This key is saved locally in your browser and is never stored on the server.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="password"
                placeholder="Gemini API Key (starts with AQ... or AIza...)"
                value={customApiKey}
                onChange={(e) => {
                  const val = e.target.value;
                  setCustomApiKey(val);
                  localStorage.setItem('ts_custom_gemini_key', val);
                }}
                className="flex-grow px-3 py-2 bg-neutral-950 border border-neutral-800 focus:border-[#ff2e93] text-gray-200 placeholder-zinc-650 text-xs rounded-lg focus:outline-none font-mono"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    fetchLiveTrends();
                    setApiKeyNotice("Active session refreshed using your custom Gemini API key!");
                  }}
                  className="px-4 py-2 bg-[#ff2e93] hover:bg-pink-650 text-white font-mono text-xs font-bold rounded-lg cursor-pointer transition flex items-center gap-1.5 shrink-0"
                >
                  <Sparkles size={13} />
                  Refresh Feed
                </button>
                {customApiKey && (
                  <button
                    onClick={() => {
                      setCustomApiKey('');
                      localStorage.removeItem('ts_custom_gemini_key');
                      setApiKeyNotice("Reverted back to default workspace key.");
                      setTimeout(() => fetchLiveTrends(), 120);
                    }}
                    className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-gray-400 hover:text-white rounded-lg text-xs font-mono cursor-pointer transition shrink-0"
                  >
                    Clear Override
                  </button>
                )}
              </div>
            </div>
            <p className="text-[10px] text-zinc-500 mt-2 flex items-center gap-1">
              <span>🔒 Direct Client Headers Delivery securely proxies requests to Google backends.</span>
            </p>
          </div>
        )}

        {/* Banner Alert if any query fails */}
        {apiError && (
          <div className="mb-6 p-3 px-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex justify-between items-center animate-fade-in">
            <span>⚠️ {apiError}</span>
            <button onClick={() => setApiError(null)} className="font-bold opacity-70 hover:opacity-100 px-1">✕</button>
          </div>
        )}

        {apiKeyNotice && !apiError && (
          <div className="mb-6 p-3.5 px-4 bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 rounded-xl text-xs flex justify-between items-center animate-fade-in">
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse shrink-0" />
              <span>{apiKeyNotice}</span>
            </span>
            <button onClick={() => setApiKeyNotice(null)} className="font-bold opacity-70 hover:opacity-100 px-1 ml-4 text-indigo-400">✕</button>
          </div>
        )}

        {/* Global generating spinner layout mask */}
        {generatingCreative && (
          <div className="fixed inset-0 z-50 bg-[#000000]/70 flex flex-col items-center justify-center p-6 backdrop-blur-sm">
            <div className="max-w-md text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto">
                {/* Custom glowing orbit loader */}
                <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#ff2e93] animate-spin" style={{ animationDuration: '6s' }} />
                <div className="absolute inset-2 rounded-full border-4 border-solid border-purple-500 animate-spin" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-white tracking-wide uppercase">AI Ad Compositing Engine...</p>
                <p className="text-xs text-gray-400">
                  Gemini is blending #{selectedTrend?.keyword || 'trend'} parameters with {activeBrandProfile.name} color palette blueprints, fonts, handle, voice characteristics and humorous angles.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Nav tabs for responsive mobile users where upper nav hides */}
        <div className="flex md:hidden justify-center gap-1.5 p-1 bg-neutral-900 border border-neutral-820 rounded-lg max-w-sm mx-auto mb-6">
          <button
            onClick={() => setActiveTab('trends')}
            className={`flex-1 py-1.5 text-center rounded text-[10px] uppercase font-bold tracking-wider ${
              activeTab === 'trends' ? 'bg-[#ff2e93] text-white' : 'text-gray-400'
            }`}
          >
            Trends
          </button>
          <button
            onClick={() => setActiveTab('brands')}
            className={`flex-1 py-1.5 text-center rounded text-[10px] uppercase font-bold tracking-wider ${
              activeTab === 'brands' ? 'bg-[#ff2e93] text-white' : 'text-gray-400'
            }`}
          >
            Brands
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex-1 py-1.5 text-center rounded text-[10px] uppercase font-bold tracking-wider ${
              activeTab === 'editor' ? 'bg-[#ff2e93] text-white' : 'text-gray-400'
            }`}
          >
            Workshop
          </button>
        </div>

        {/* Panel Screens */}
        <div className="transition-opacity duration-300">
          {activeTab === 'trends' && (
            <TrendsDashboard
              trends={trends}
              loading={loadingTrends}
              onRefreshTrends={fetchLiveTrends}
              selectedTrendId={selectedTrendId}
              onSelectTrend={setSelectedTrendId}
              onTriggerGeneration={triggerConceptDrafting}
              activeBrandName={activeBrandProfile.name}
            />
          )}

          {activeTab === 'brands' && (
            <BrandLibrary
              brands={brands}
              onBrandsChange={setBrands}
              activeBrandId={activeBrandId}
              onSetActiveBrand={setActiveBrandId}
            />
          )}

          {activeTab === 'editor' && (
            <div className="space-y-8 animate-fade-in" id="visual-workshop-tab">
              {loadingConcepts ? (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 bg-neutral-900/40 border border-neutral-850 rounded-2xl">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#ff2e93] animate-spin" style={{ animationDuration: '4s' }} />
                    <div className="absolute inset-2 rounded-full border-4 border-solid border-purple-500 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-md font-bold text-white uppercase tracking-wider font-mono">TOASTER Concept Lab Active</h3>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                      AI is drafting 3 custom moment marketing angles for <span className="text-white font-semibold">{activeBrandProfile.name}</span> aligning with <span className="text-[#ff2e93] font-semibold">#{selectedTrend?.keyword}</span>...
                    </p>
                  </div>
                </div>
              ) : creative ? (
                /* Interactive Canvas Editor showing compiled post assets */
                <VisualEditor
                  creative={creative}
                  onCreativeChange={handleCreativeChange}
                  brand={activeBrandProfile}
                  trendKeyword={selectedTrend?.keyword || 'Trend'}
                  onRegenerateAll={(promptText) => selectedTrend && triggerCampaignGeneration(selectedTrend, selectedConcept || concepts?.[0], promptText)}
                  generating={generatingCreative}
                />
              ) : (
                /* Concept Builder Wizard Panel */
                <div className="space-y-8">
                  {concepts === null ? (
                    <div className="py-16 text-center max-w-2xl mx-auto space-y-6">
                      <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#ff2e93] mx-auto shadow-xl">
                        <Sparkles size={28} className="animate-pulse" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-black text-white uppercase tracking-tight font-mono">Launch New Campaign Concept</h3>
                        <p className="text-xs text-gray-400 leading-relaxed font-sans">
                          Select a trending social media signal from the <strong>Social Trends</strong> feed, or let Gemini instantly draft 3 tailored moment marketing routes for <strong>{activeBrandProfile.name}</strong> based on the active trend <strong>#{selectedTrend?.keyword || 'Trend'}</strong>.
                        </p>
                      </div>
                      
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => selectedTrend && triggerConceptDrafting(selectedTrend)}
                          className="px-6 py-3 bg-gradient-to-r from-pink-600 to-[#ff2e93] hover:opacity-95 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-200 shadow-md transform hover:scale-[1.01] cursor-pointer"
                        >
                          ⚡ Brainstorm 3 AI Campaign Angles
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Step Header */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-neutral-900/60 p-5 border border-neutral-850 rounded-xl">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold tracking-wider bg-pink-950/40 text-[#ff2e93] border border-pink-500/10 px-2 py-0.5 rounded">Campaign Strategy</span>
                            <span className="text-xs text-mono text-zinc-500">Moment: #{selectedTrend?.keyword || 'Trend'}</span>
                          </div>
                          <h2 className="text-xl font-extrabold text-white tracking-tight mt-1">
                            Choose Your Campaign Direction for {activeBrandProfile.name}
                          </h2>
                        </div>
                        <button
                          type="button"
                          onClick={() => setConcepts(null)}
                          className="px-3.5 py-1.5 bg-neutral-950 hover:bg-neutral-800 text-gray-400 hover:text-white border border-neutral-850 rounded-lg text-xs font-mono transition"
                        >
                          ↺ Start Fresh
                        </button>
                      </div>

                      {/* Three concept cards layout */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {concepts.map((concept, idx) => {
                          const isSelected = selectedConcept?.id === concept.id;
                          return (
                            <div
                              key={concept.id}
                              onClick={() => {
                                setSelectedConcept(concept);
                                setVisualPrompt(concept.suggestedBgPrompt);
                              }}
                              className={`flex flex-col justify-between p-5 rounded-2xl border transition-all duration-300 cursor-pointer text-left relative overflow-hidden group ${
                                isSelected 
                                  ? 'bg-neutral-900/90 border-[#ff2e93] shadow-lg shadow-[#ff2e93]/5 translate-y-[-2px]' 
                                  : 'bg-neutral-900/40 hover:bg-neutral-900/70 border-neutral-850 hover:border-neutral-700'
                              }`}
                            >
                              {/* Selection Indicator Glow */}
                              {isSelected && (
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-tr from-transparent via-[#ff2e93]/10 to-[#ff2e93]/40 flex items-center justify-center">
                                  <span className="text-[#ff2e93] font-bold text-xs rotate-45 translate-x-2 translate-y-[-2px]">ACTIVE</span>
                                </div>
                              )}

                              <div className="space-y-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-pink-500 font-bold uppercase tracking-wider">
                                    <span>CONCEPT {idx + 1}</span>
                                  </div>
                                  <h3 className="text-base font-black text-white group-hover:text-[#ff2e93] transition-colors">{concept.title}</h3>
                                </div>

                                <p className="text-xs text-gray-400 leading-relaxed font-sans">{concept.description}</p>

                                {/* Preview Badge Box */}
                                <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-850 space-y-2 text-[10.5px]">
                                  <div>
                                    <span className="text-[9px] text-[#ff2e93] font-mono block uppercase">Proposed headline</span>
                                    <p className="text-white italic break-words leading-snug">"{concept.suggestedHeadline}"</p>
                                  </div>
                                  <div>
                                    <span className="text-[9px] text-zinc-500 font-mono block uppercase">Social Tagline</span>
                                    <p className="text-gray-300 font-sans">{concept.suggestedTagline}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-5">
                                <button
                                  type="button"
                                  className={`w-full py-2 rounded-lg font-bold text-[11px] tracking-wider uppercase transition-all duration-200 ${
                                    isSelected 
                                      ? 'bg-gradient-to-r from-pink-650 to-[#ff2e93] text-white shadow-md' 
                                      : 'bg-neutral-950 hover:bg-neutral-850 text-gray-300 hover:text-white border border-neutral-800'
                                  }`}
                                >
                                  {isSelected ? '✓ Option Selected' : 'Choose Strategic Path'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Step 2 Prompt and Visual compilation */}
                      {selectedConcept && (
                        <div className="bg-neutral-900 border border-neutral-850 rounded-2xl p-6 space-y-5 animate-slide-up">
                          <div className="space-y-1">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-pink-950/70 border border-pink-500/30 text-[#ff2e93] text-[10px] flex items-center justify-center font-bold font-mono">2</span>
                              Write or Refine the Post Visual Prompt for Nano-Banana
                            </h3>
                            <p className="text-xs text-gray-400">
                              This visual prompt instructs our specialized machine visual engine (Nano-Banana) to render your background scenery. Feel free to tweak, customize, or leave it as recommended!
                            </p>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Nano-Banana Photo Prompt Description</label>
                            <textarea
                              rows={3}
                              value={visualPrompt}
                              onChange={(e) => setVisualPrompt(e.target.value)}
                              placeholder="Describe the cinematic background scene..."
                              className="w-full text-xs p-3 bg-neutral-950 border border-neutral-800 hover:border-neutral-700 focus:border-[#ff2e93] rounded-xl text-gray-200 font-mono focus:outline-none focus:ring-0 leading-relaxed"
                            />
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-2">
                            <div className="text-left text-[11px] text-gray-500 font-mono">
                              <div>• Core style: cinematic product marketing shoot</div>
                              <div>• Colors: matched to {activeBrandProfile.name} profile</div>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => selectedTrend && triggerCampaignGeneration(selectedTrend, selectedConcept, visualPrompt)}
                              disabled={generatingCreative}
                              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-pink-600 via-[#ff2e93] to-purple-600 hover:opacity-95 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-pink-900/15 cursor-pointer transform hover:scale-[1.01]"
                            >
                              🔥 Launch Nano-Banana and Spark Editable Ad Canvas
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="mt-12 py-8 bg-[#040405] border-t border-neutral-850 text-center text-[10px] text-gray-600 font-mono tracking-wider relative z-15">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} THESWIFTIEPROJECT ENGINE. CRAFTED TO COMPILE REVOLUTIONARY POP CULTURE AND AUDIENCE ENGAGEMENT MOMENTS.</p>
          <p className="mt-1 text-[#ff2e93]/50">ACCELERATED BY GEMINI ARTIFICIAL INTELLIGENCE GROUND CO-PILOTS</p>
        </div>
      </footer>
    </div>
  );
}
