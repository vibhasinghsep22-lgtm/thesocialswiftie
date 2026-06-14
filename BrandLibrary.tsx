import React, { useState } from 'react';
import { BrandProfile, ColorPalette } from '../types';
import { Plus, Trash2, Edit2, Upload, Palette, Check, Sparkles, AlertCircle } from 'lucide-react';

interface BrandLibraryProps {
  brands: BrandProfile[];
  onBrandsChange: (brands: BrandProfile[]) => void;
  activeBrandId: string;
  onSetActiveBrand: (id: string) => void;
}

// Preset color combos for easy clicking
const PRESET_PALETTES = [
  { name: 'Toaster Neon', primary: '#ff2e93', secondary: '#111111', accent: '#ffffff', background: '#080808', text: '#ffffff' },
  { name: 'Amul Classic', primary: '#1e3a8a', secondary: '#f8fafc', accent: '#e11d48', background: '#ffffff', text: '#0f172a' },
  { name: 'Swiggy Orange', primary: '#fc8019', secondary: '#1d1d2d', accent: '#ffffff', background: '#0e0e15', text: '#ffffff' },
  { name: 'Zomato Red', primary: '#e23744', secondary: '#0c0c0c', accent: '#ffffff', background: '#111111', text: '#ffffff' },
  { name: 'Minimal Editorial', primary: '#1c1917', secondary: '#e7e5e4', accent: '#78716c', background: '#f5f5f4', text: '#1c1917' },
  { name: 'Future Cyber', primary: '#06b6d4', secondary: '#0f172a', accent: '#f43f5e', background: '#020617', text: '#f8fafc' },
];

export default function BrandLibrary({
  brands,
  onBrandsChange,
  activeBrandId,
  onSetActiveBrand,
}: BrandLibraryProps) {
  const [editingBrand, setEditingBrand] = useState<BrandProfile | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [handle, setHandle] = useState('');
  const [industry, setIndustry] = useState('');
  const [brandVoice, setBrandVoice] = useState('witty');
  const [fontFamily, setFontFamily] = useState('Space Grotesk');
  const [colors, setColors] = useState<ColorPalette>({
    primary: '#ff2e93',
    secondary: '#111111',
    accent: '#ffffff',
    background: '#080808',
    text: '#ffffff',
  });
  const [logoBase64, setLogoBase64] = useState<string | undefined>(undefined);
  const [logoInputName, setLogoInputName] = useState('');

  // Start editing a brand
  const startEdit = (brand: BrandProfile) => {
    setEditingBrand(brand);
    setIsCreating(false);
    setName(brand.name);
    setTagline(brand.tagline || '');
    setHandle(brand.handle);
    setIndustry(brand.industry);
    setBrandVoice(brand.brandVoice);
    setFontFamily(brand.fontFamily);
    setColors(brand.colorPalette);
    setLogoBase64(brand.logoDataUrl);
    setLogoInputName('');
  };

  // Start creating new brand
  const startCreate = () => {
    setIsCreating(true);
    setEditingBrand(null);
    setName('');
    setTagline('');
    setHandle('@mybrand');
    setIndustry('Custom Client');
    setBrandVoice('witty');
    setFontFamily('Space Grotesk');
    setColors({
      primary: '#3b82f6',
      secondary: '#1e293b',
      accent: '#60a5fa',
      background: '#0f172a',
      text: '#f8fafc',
    });
    setLogoBase64(undefined);
    setLogoInputName('');
  };

  // Handle Logo Upload
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoInputName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Apply colors preset
  const applyPresetColors = (preset: typeof PRESET_PALETTES[0]) => {
    setColors({
      primary: preset.primary,
      secondary: preset.secondary,
      accent: preset.accent,
      background: preset.background,
      text: preset.text,
    });
  };

  // Save brand changes
  const saveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isCreating) {
      const newBrand: BrandProfile = {
        id: `brand-${Date.now()}`,
        name,
        tagline,
        handle,
        industry,
        brandVoice,
        fontFamily,
        colorPalette: colors,
        logoDataUrl: logoBase64,
        images: [],
      };
      const updated = [...brands, newBrand];
      onBrandsChange(updated);
      onSetActiveBrand(newBrand.id);
      setIsCreating(false);
    } else if (editingBrand) {
      const updated = brands.map((b) => {
        if (b.id === editingBrand.id) {
          return {
            ...b,
            name,
            tagline,
            handle,
            industry,
            brandVoice,
            fontFamily,
            colorPalette: colors,
            logoDataUrl: logoBase64,
          };
        }
        return b;
      });
      onBrandsChange(updated);
      setEditingBrand(null);
    }
  };

  const deleteBrand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent setting active
    if (brands.length <= 1) {
      alert("At least one active brand profile must remain configured.");
      return;
    }
    const filtered = brands.filter((b) => b.id !== id);
    onBrandsChange(filtered);
    if (activeBrandId === id) {
      onSetActiveBrand(filtered[0].id);
    }
    if (editingBrand?.id === id) {
      setEditingBrand(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="brand-library-container">
      {/* Brands Cards Container */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white mb-1">
              Brand Library ({brands.length})
            </h2>
            <p className="text-sm text-gray-400">
              Select or configure assets for your clients. We'll generate creatives styled to match.
            </p>
          </div>
          <button
            onClick={startCreate}
            id="btn-add-brand"
            className="flex items-center gap-2 px-4 py-2 bg-[#ff2e93] hover:bg-[#ff1493] text-white rounded-lg font-medium text-xs transition duration-200 shadow-md shadow-pink-900/20"
          >
            <Plus size={16} /> Add New Brand
          </button>
        </div>

        {/* Brand Grid list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {brands.map((brand) => {
            const isActive = brand.id === activeBrandId;
            const bgPalette = brand.colorPalette;
            return (
              <div
                key={brand.id}
                onClick={() => onSetActiveBrand(brand.id)}
                id={`brand-card-${brand.id}`}
                className={`relative group cursor-pointer overflow-hidden rounded-xl bg-neutral-900 border transition-all duration-300 ${
                  isActive 
                    ? 'border-[#ff2e93] ring-1 ring-[#ff2e93] shadow-lg shadow-pink-950/20 translate-y-[-2px]' 
                    : 'border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/80'
                }`}
              >
                {/* Visual Palette Ribbon inside Card */}
                <div className="absolute top-0 inset-x-0 h-1.5 flex">
                  <div className="flex-1" style={{ backgroundColor: bgPalette.primary }} />
                  <div className="flex-1" style={{ backgroundColor: bgPalette.secondary }} />
                  <div className="flex-1" style={{ backgroundColor: bgPalette.accent }} />
                  <div className="flex-1" style={{ backgroundColor: bgPalette.background }} />
                </div>

                <div className="p-5 pt-7">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {brand.logoDataUrl ? (
                        <img
                          src={brand.logoDataUrl}
                          alt={`${brand.name} logo`}
                          className="w-10 h-10 rounded-lg object-contain bg-neutral-920 border border-neutral-800 p-1"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-neutral-800 border border-neutral-700 font-bold text-white text-md">
                          {brand.name[0]}
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-white flex items-center gap-2">
                          {brand.name}
                          {isActive && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-pink-500/15 text-pink-400 font-semibold uppercase tracking-wider">
                              Active
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-gray-500">{brand.handle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(brand);
                        }}
                        title="Edit Brand"
                        className="p-1 text-gray-400 hover:text-white hover:bg-neutral-800 rounded transition"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={(e) => deleteBrand(brand.id, e)}
                        title="Delete Brand"
                        className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-950/20 rounded transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Brand Meta Grid */}
                  <div className="grid grid-cols-2 gap-y-3 mt-5 pt-4 border-t border-neutral-800/60 text-xs">
                    <div>
                      <span className="text-gray-500 block mb-0.5">Industry</span>
                      <span className="text-gray-350">{brand.industry}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-0.5">Voice Style</span>
                      <span className="text-gray-350 capitalize flex items-center gap-1.5">
                        <Sparkles size={11} className="text-[#ff2e93]" />
                        {brand.brandVoice}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-0.5">Display Font</span>
                      <span className="text-gray-350 font-mono text-[11px]">{brand.fontFamily}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block mb-1">Color Palette</span>
                      <div className="flex gap-1">
                        <span className="w-3.5 h-3.5 rounded border border-neutral-700" style={{ backgroundColor: bgPalette.primary }} title="Primary" />
                        <span className="w-3.5 h-3.5 rounded border border-neutral-700" style={{ backgroundColor: bgPalette.secondary }} title="Secondary" />
                        <span className="w-3.5 h-3.5 rounded border border-neutral-700" style={{ backgroundColor: bgPalette.accent }} title="Accent" />
                        <span className="w-3.5 h-3.5 rounded border border-neutral-700" style={{ backgroundColor: bgPalette.background }} title="Background" />
                      </div>
                    </div>
                  </div>

                  {brand.tagline && (
                    <div className="mt-4 p-2 bg-neutral-920 border border-neutral-850 rounded text-xs text-gray-400 italic">
                      "{brand.tagline}"
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Client Asset Intelligence & Image Library Showcase */}
        {(() => {
          const activeBrand = brands.find((b) => b.id === activeBrandId) || brands[0];
          if (!activeBrand) return null;
          return (
            <div className="mt-8 p-6 bg-neutral-900 border border-neutral-850 rounded-xl space-y-6 animate-fade-in" id="client-intelligence-portfolio">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
                <div>
                  <h3 className="text-md font-bold text-white flex items-center gap-2">
                    <Sparkles size={16} className="text-[#ff2e93] animate-pulse" />
                    {activeBrand.name} Brand Intelligence & Assets Directory
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Product graphics, mockups, and historical templates used by the AI engine to compose contextually aligned designs.
                  </p>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-950 rounded-lg text-[10px] font-mono border border-neutral-850">
                  <span className="text-pink-400 font-bold">{activeBrand.images?.length || 0}</span>
                  <span className="text-gray-500">Learned Assets</span>
                </div>
              </div>

              {/* Product Reference Images Shelf */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                {activeBrand.images && activeBrand.images.length > 0 ? (
                  activeBrand.images.map((image) => (
                    <div 
                      key={image.id} 
                      className="relative group rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950 aspect-square flex flex-col justify-end"
                      id={`asset-card-${image.id}`}
                    >
                      <img
                        src={image.dataUrl || image.url}
                        alt={image.name}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent p-2.5 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              const updatedImages = (activeBrand.images || []).filter(img => img.id !== image.id);
                              const updatedBrands = brands.map(b => b.id === activeBrand.id ? { ...b, images: updatedImages } : b);
                              onBrandsChange(updatedBrands);
                            }}
                            className="px-1.5 py-0.5 rounded bg-red-600/90 text-white font-semibold text-[9px] hover:bg-red-700 transition"
                          >
                            Delete
                          </button>
                        </div>
                        <span className="text-[10px] font-semibold text-white truncate drop-shadow-md">
                          {image.name}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center text-xs text-gray-500 border border-dashed border-neutral-800 rounded-lg">
                    No learning assets provided yet. Connect some reference material or product shots below to expand visual understanding!
                  </div>
                )}
              </div>

              {/* Feed Brand with New Intel Assets */}
              <div className="p-4 bg-neutral-950 rounded-lg border border-neutral-850 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-300 block">Teach Brand New Image Asset / Product View</span>
                  <span className="text-[9px] uppercase font-mono text-gray-500">Supports direct online HTTPS image links</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  <div className="md:col-span-4">
                    <label className="block text-[10px] text-gray-500 mb-1.5">Asset Label/Title</label>
                    <input
                      type="text"
                      id="new-intel-name"
                      placeholder="e.g. Subway sandwich melt look"
                      className="w-full text-xs p-2 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-[#ff2e93]"
                    />
                  </div>
                  <div className="md:col-span-5">
                    <label className="block text-[10px] text-gray-500 mb-1.5">Image Link URL</label>
                    <input
                      type="text"
                      id="new-intel-url"
                      placeholder="e.g. https://images.unsplash.com/photo-..."
                      className="w-full text-xs p-2 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-[#ff2e93]"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <button
                      type="button"
                      onClick={() => {
                        const nameEl = document.getElementById('new-intel-name') as HTMLInputElement;
                        const urlEl = document.getElementById('new-intel-url') as HTMLInputElement;
                        if (!nameEl?.value.trim() || !urlEl?.value.trim()) {
                          alert("Specify both label and a valid image URL link to add.");
                          return;
                        }
                        const newAsset = {
                          id: 'img-' + Date.now(),
                          name: nameEl.value,
                          url: urlEl.value
                        };
                        const updatedImages = [...(activeBrand.images || []), newAsset];
                        const updatedBrands = brands.map(b => b.id === activeBrand.id ? { ...b, images: updatedImages } : b);
                        onBrandsChange(updatedBrands);
                        nameEl.value = '';
                        urlEl.value = '';
                      }}
                      className="w-full py-2.5 bg-neutral-850 hover:bg-[#ff2e93] text-white border border-neutral-750 hover:border-transparent rounded-lg font-bold text-xs uppercase tracking-wider transition duration-300"
                    >
                      Connect Asset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Editor sidebar column */}
      <div className="lg:col-span-1">
        {(editingBrand || isCreating) ? (
          <form 
            onSubmit={saveBrand}
            id="brand-editing-form" 
            className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 space-y-5 shadow-lg relative overflow-hidden"
          >
            {/* Visual Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Palette size={16} className="text-[#ff2e93]" />
                {isCreating ? 'Create Brand Profile' : `Configure ${editingBrand?.name}`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingBrand(null);
                  setIsCreating(false);
                }}
                className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-neutral-800 transition"
              >
                Cancel
              </button>
            </div>

            {/* Input fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Brand Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Swiggy"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-neutral-920 border border-neutral-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#ff2e93]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Brand Punny Slogan / Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. India's favorite food delivery"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-neutral-920 border border-neutral-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#ff2e93]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Social Handle</label>
                  <input
                    type="text"
                    required
                    placeholder="@swiggy_in"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-neutral-920 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-[#ff2e93]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Industry</label>
                  <input
                    type="text"
                    required
                    placeholder="E-Commerce / Food"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-neutral-920 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-[#ff2e93]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Marketing Accent Voice</label>
                  <select
                    value={brandVoice}
                    onChange={(e) => setBrandVoice(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-neutral-920 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-[#ff2e93]"
                  >
                    <option value="witty">Witty (Amul Style)</option>
                    <option value="minimalist">Minimalist (Tech-forward)</option>
                    <option value="bold">Bold & Direct</option>
                    <option value="professional">Professional</option>
                    <option value="educational">Educational</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Typography Font</label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full text-xs px-2 py-2 bg-neutral-920 border border-neutral-800 rounded-lg text-white font-mono focus:outline-none focus:border-[#ff2e93]"
                  >
                    <option value="Space Grotesk">Space Grotesk (Tech)</option>
                    <option value="Inter">Inter (Swiss Corporate)</option>
                    <option value="JetBrains Mono">JetBrains Mono</option>
                    <option value="Playfair Display">Playfair Display (Serif)</option>
                    <option value="Outfit">Outfit (Clean Sans)</option>
                  </select>
                </div>
              </div>

              {/* Logo Upload section */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Upload Brand Logo Logo</label>
                <div className="relative flex items-center justify-center border-2 border-dashed border-neutral-800 hover:border-neutral-700 bg-neutral-920 rounded-lg p-4 transition text-center group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-1">
                    <div className="flex justify-center text-gray-500 group-hover:text-white transition">
                      {logoBase64 ? (
                        <img src={logoBase64} alt="Preview" className="h-10 w-10 object-contain p-0.5 border bg-white rounded" />
                      ) : (
                        <Upload size={18} />
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400">
                      {logoInputName ? `Selected: ${logoInputName}` : 'Click or Drag in logo png/jpg'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Presets and Custom Color Picker */}
              <div className="pt-2 border-t border-neutral-800">
                <span className="block text-xs font-medium text-gray-400 mb-2">Color Blueprint Presets</span>
                <div className="grid grid-cols-3 gap-1.5 mb-3">
                  {PRESET_PALETTES.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => applyPresetColors(preset)}
                      className="text-[10px] py-1 px-1.5 bg-neutral-950 hover:bg-neutral-920 border border-neutral-850 rounded text-left truncate flex items-center gap-1 text-gray-300"
                    >
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: preset.primary }} />
                      {preset.name.split(' ')[0]}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 pt-2 bg-neutral-950 p-3 rounded-lg border border-neutral-850">
                  <span className="block text-[11px] font-medium text-gray-500 mb-1">Detailed Color Mixers</span>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={colors.primary}
                        onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                        className="w-5 h-5 rounded cursor-pointer border-0 p-0 overflow-hidden bg-transparent"
                      />
                      <span className="text-gray-400 truncate">Primary ({colors.primary})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={colors.secondary}
                        onChange={(e) => setColors({ ...colors, secondary: e.target.value })}
                        className="w-5 h-5 rounded cursor-pointer border-0 p-0 overflow-hidden bg-transparent"
                      />
                      <span className="text-gray-400 truncate">Secondary ({colors.secondary})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={colors.accent}
                        onChange={(e) => setColors({ ...colors, accent: e.target.value })}
                        className="w-5 h-5 rounded cursor-pointer border-0 p-0 overflow-hidden bg-transparent"
                      />
                      <span className="text-gray-400 truncate">Accent ({colors.accent})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={colors.background}
                        onChange={(e) => setColors({ ...colors, background: e.target.value })}
                        className="w-5 h-5 rounded cursor-pointer border-0 p-0 overflow-hidden bg-transparent"
                      />
                      <span className="text-gray-400 truncate">Canvas Bg ({colors.background})</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-1.5 pt-1">
                      <input
                        type="color"
                        value={colors.text}
                        onChange={(e) => setColors({ ...colors, text: e.target.value })}
                        className="w-5 h-5 rounded cursor-pointer border-0 p-0 overflow-hidden bg-transparent"
                      />
                      <span className="text-gray-400">Headings text ({colors.text})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-[#ff2e93] text-white rounded-lg font-semibold text-xs tracking-wide uppercase transition hover:opacity-90"
            >
              <Check size={14} /> {isCreating ? 'Finalize Brand creation' : 'Save Brand settings'}
            </button>
          </form>
        ) : (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mx-auto text-pink-400">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Design Engine Synced</h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Choose a brand card from the gallery, or configure the styling blueprints manually. When you start an campaign, Gemini adapts headlines, accents, colors, and layout directly to match!
              </p>
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/25 rounded-md text-left">
              <AlertCircle size={12} className="shrink-0" />
              <span>Perfect for swift client proof sessions</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
