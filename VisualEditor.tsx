import React, { useState, useRef, useEffect } from 'react';
import { GeneratedCreative, EditableElement, ColorPalette, BrandProfile } from '../types';
import { 
  Download, Sparkles, RefreshCcw, Type as TypeIcon, Image as ImageIcon, 
  Eye, EyeOff, Layout, Sliders, Type, Move, ZoomIn, ZoomOut, Check, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, HelpCircle,
  LayoutTemplate, ImagePlus
} from 'lucide-react';

interface VisualEditorProps {
  creative: GeneratedCreative | null;
  onCreativeChange: (creative: GeneratedCreative) => void;
  brand: BrandProfile;
  trendKeyword: string;
  onRegenerateAll: (customPrompt?: string) => void;
  generating: boolean;
}

export default function VisualEditor({
  creative,
  onCreativeChange,
  brand,
  trendKeyword,
  onRegenerateAll,
  generating,
}: VisualEditorProps) {
  const [selectedElementId, setSelectedElementId] = useState<EditableElement['id'] | null>('headline');
  const [exporting, setExporting] = useState(false);
  const [editingBackgroundUrl, setEditingBackgroundUrl] = useState('');
  const canvasRef = useRef<HTMLDivElement>(null);

  // Separate Logo Overlay configuration (can be turned on/off, positioned, scaled and color styled)
  const [logoEnabled, setLogoEnabled] = useState(false);
  const [logoPosition, setLogoPosition] = useState<'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'>('bottom-center');
  const [logoScale, setLogoScale] = useState(0.85);
  const [logoMonochrome, setLogoMonochrome] = useState<'none' | 'white' | 'dark'>('none');
  const [logoOpacity, setLogoOpacity] = useState(1.0);

  // Layout Template preset option
  const [layoutPreset, setLayoutPreset] = useState<'default' | 'minimal' | 'spotlight' | 'split'>('default');

  // Helper to obtain absolute positioning on the preview canvas
  const getLogoOverlayCSSPosition = (pos: typeof logoPosition) => {
    const margin = '6%';
    switch (pos) {
      case 'top-left':
        return { top: margin, left: margin };
      case 'top-center':
        return { top: margin, left: '50%' };
      case 'top-right':
        return { top: margin, right: margin };
      case 'bottom-left':
        return { bottom: margin, left: margin };
      case 'bottom-center':
        return { bottom: margin, left: '50%' };
      case 'bottom-right':
        return { bottom: margin, right: margin };
    }
  };

  const applyLayoutPreset = (preset: 'default' | 'minimal' | 'spotlight' | 'split') => {
    if (!creative) return;
    setLayoutPreset(preset);
    
    let updatedElements = [...creative.elements];
    
    // Always filter out any id === "logo" from elements if it exists to clean up, since logo is now an overlay!
    updatedElements = updatedElements.filter(el => el.id !== 'logo');
    
    if (preset === 'minimal') {
      // Large headline in center, no tagline, handle watermark at bottom Center
      updatedElements = [
        {
          id: 'headline',
          type: 'text',
          content: creative.headline || "Pure & Simple.",
          x: 50,
          y: 48,
          fontSize: 34,
          fontWeight: 'bold',
          color: brand.colorPalette.text,
          align: 'center'
        },
        {
          id: 'watermark',
          type: 'text',
          content: brand.handle || `@${brand.name.toLowerCase()}`,
          x: 50,
          y: 92,
          fontSize: 14,
          fontWeight: 'normal',
          color: brand.colorPalette.text,
          align: 'center'
        }
      ];
    } else if (preset === 'spotlight') {
      // Headline shifted to bottom 75% so we can see the glorious concept image in the center, tagline at top, watermark at bottom
      updatedElements = [
        {
          id: 'headline',
          type: 'text',
          content: creative.headline,
          x: 50,
          y: 75,
          fontSize: 26,
          fontWeight: 'bold',
          color: '#ffffff',
          align: 'center'
        },
        {
          id: 'tagline',
          type: 'text',
          content: brand.tagline || "Always in spotlight.",
          x: 50,
          y: 22,
          fontSize: 14,
          fontWeight: 'bold',
          color: brand.colorPalette.accent,
          align: 'center'
        },
        {
          id: 'watermark',
          type: 'text',
          content: brand.handle || `@${brand.name.toLowerCase()}`,
          x: 50,
          y: 92,
          fontSize: 12,
          fontWeight: 'normal',
          color: 'rgba(255, 255, 255, 0.6)',
          align: 'center'
        }
      ];
    } else if (preset === 'split') {
      // Left aligned style coordinates mapping
      updatedElements = [
        {
          id: 'headline',
          type: 'text',
          content: creative.headline,
          x: 50,
          y: 45,
          fontSize: 28,
          fontWeight: 'bold',
          color: brand.colorPalette.text,
          align: 'center'
        },
        {
          id: 'tagline',
          type: 'text',
          content: brand.tagline || "Always fresh.",
          x: 50,
          y: 65,
          fontSize: 15,
          fontWeight: 'bold',
          color: brand.colorPalette.accent,
          align: 'center'
        },
        {
          id: 'watermark',
          type: 'text',
          content: brand.handle || `@${brand.name.toLowerCase()}`,
          x: 50,
          y: 88,
          fontSize: 13,
          fontWeight: 'normal',
          color: brand.colorPalette.text,
          align: 'center'
        }
      ];
    } else {
      // Default standard layout
      updatedElements = [
        {
          id: 'headline',
          type: 'text',
          content: creative.headline,
          x: 50,
          y: 45,
          fontSize: 28,
          fontWeight: 'bold',
          color: brand.colorPalette.text,
          align: 'center'
        },
        {
          id: 'tagline',
          type: 'text',
          content: brand.tagline || "Always fresh.",
          x: 50,
          y: 70,
          fontSize: 15,
          fontWeight: 'bold',
          color: brand.colorPalette.accent,
          align: 'center'
        },
        {
          id: 'watermark',
          type: 'text',
          content: brand.handle || `@${brand.name.toLowerCase()}`,
          x: 50,
          y: 92,
          fontSize: 14,
          fontWeight: 'normal',
          color: brand.colorPalette.text,
          align: 'center'
        }
      ];
    }

    onCreativeChange({
      ...creative,
      elements: updatedElements
    });
  };

  // Guided AI Concept & Background Asset Builder states
  const [visualPrompt, setVisualPrompt] = useState('A rich aesthetic high-contrast background');
  const [copyGuidance, setCopyGuidance] = useState('');
  const [generatingBgImage, setGeneratingBgImage] = useState(false);

  // Sync the visual prompt whenever brand or trend changes to provide a customized Nano-Banana starting point
  useEffect(() => {
    if (!brand || !trendKeyword) return;
    
    let customizedPrompt = '';
    
    if (brand.id === 'brand-subway') {
      customizedPrompt = `highly detailed commercial advertising photography of a fresh toasted Subway sub sandwich with crisp green lettuce and melting cheese, vibrant background themed with ${trendKeyword} festival lasers, professional studio lighting, 8k Resolution`;
    } else if (brand.id === 'brand-hinge') {
      customizedPrompt = `cozy aesthetic romantic scene of young diverse couple laughing on a date, warm coffee shop with string lights representing deleting dating apps after finding ${trendKeyword}, minimalist lifestyle brand aesthetic, 35mm film photograph shot`;
    } else if (brand.id === 'brand-snapchat') {
      customizedPrompt = `vibrant dynamic graphic backdrop with camera lens streak filters and sparkling glow overlays, styled in Snapchat brand yellow blending beautifully with ${trendKeyword} elements, sleek tech visual, 8k resolution`;
    } else if (brand.id === 'brand-tuborg') {
      customizedPrompt = `chilled green bottle of Tuborg premium beer with realistic water droplets on glass, in a vibrant live music festival stage with high-contrast laser lights and ${trendKeyword} energy, professional product photography`;
    } else {
      customizedPrompt = `highly detailed premium creative advertising photography for ${brand.name} ${brand.industry || ''} ad campaign, beautifully themed with ${trendKeyword} pop culture vibes, professional studio lighting, matching brand colors`;
    }
    
    setVisualPrompt(customizedPrompt);
  }, [brand, trendKeyword]);

  // Sync default colors when brand switches
  const applyBrandColors = () => {
    if (!creative) return;
    const bColors = brand.colorPalette;
    onCreativeChange({
      ...creative,
      style: {
        ...creative.style,
        backgroundColor: bColors.background,
        backgroundGradient: `linear-gradient(135deg, ${bColors.background} 0%, ${bColors.secondary} 100%)`,
        textColor: bColors.text,
        accentColor: bColors.accent,
        fontFamily: brand.fontFamily,
      }
    });
  };

  // Compile prompt-based visual assets as background layers
  const handleGenerateBgImage = async () => {
    if (!visualPrompt.trim() || !creative) return;
    setGeneratingBgImage(true);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const savedKey = localStorage.getItem('ts_custom_gemini_key') || '';
      if (savedKey) {
        headers['X-Custom-Gemini-Key'] = savedKey;
      }
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          prompt: visualPrompt,
          brandName: brand.name,
          trendKeyword: trendKeyword
        })
      });
      if (!response.ok) throw new Error("Image compiler crashed.");
      const data = await response.json();
      if (data && data.imageUrl) {
        onCreativeChange({
          ...creative,
          style: {
            ...creative.style,
            backgroundType: 'image',
            backgroundImageUrl: data.imageUrl,
            overlayOpacity: 0.55 // subtle tint overlay so typography pops
          }
        });
      }
    } catch (err) {
      console.error("AI image generation error:", err);
    } finally {
      setGeneratingBgImage(false);
    }
  };

  // Curate dynamic agency pitch suggestion cards on-the-fly
  const getQuickGuidanceSuggestions = () => {
    const list: Record<string, string[]> = {
      'brand-subway': [
        "A toasted Subway sandwich with sunglasses rocking out on stage at Lollapalooza festival",
        "EATING FRESH, LISTENING LOUDLY - fresh Subway footlong near concert sound-speakers",
        "Crunchy salad sandwich wearing goggles stage diving into a music festival crowd"
      ],
      'brand-hinge': [
        "A cozy young couple on a date with a beautiful warm coffee shop background designed to be deleted",
        "Heart interaction matches overlay designed to find romantic connection sparks",
        "Polaroid photocard of a match couple smiling under cozy twilight lights"
      ],
      'brand-snapchat': [
        "Yellow Snapchat visual frame with neon graphic camera streak lines",
        "Group of cheerful friends laughing while using cute selfie camera lens filters"
      ],
      'brand-tuborg': [
        "A chilled Tuborg premium green beer bottle with water condensation on a vibrant music dance stage",
        "Music celebration - cheering beer glasses under high contrast stage neon lasers",
        "Modern neon nightclub crowd cheering with a Tuborg lager glass overlay"
      ]
    };
    return list[brand.id] || [
      "A gorgeous minimal design overlay matching brand logo colors",
      "Dynamic high energy advertising background with neon accent glows"
    ];
  };

  const handleElementUpdate = (id: EditableElement['id'], updates: Partial<EditableElement>) => {
    if (!creative) return;
    const updatedElements = creative.elements.map((el) => {
      if (el.id === id) {
        return { ...el, ...updates } as EditableElement;
      }
      return el;
    });
    onCreativeChange({
      ...creative,
      elements: updatedElements,
    });
  };

  const getSelectedElement = (): EditableElement | undefined => {
    if (!creative) return undefined;
    return creative.elements.find((el) => el.id === selectedElementId);
  };

  // Convert visual element positions or backgrounds into high-res 1080x1080 image bytes via HTML Canvas
  const handleExportToImage = async () => {
    if (!creative || !canvasRef.current) return;
    setExporting(true);

    try {
      // Create a high-res virtual canvas (1080x1080px) for standard high fidelity instagram post
      const canvasSize = 1080;
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = canvasSize;
      exportCanvas.height = canvasSize;
      const ctx = exportCanvas.getContext('2d');
      if (!ctx) throw new Error('Could not instantiate 2D Canvas context.');

      // 1. Draw Background
      if (creative.style.backgroundType === 'gradient') {
        const gradient = ctx.createLinearGradient(0, 0, canvasSize, canvasSize);
        gradient.addColorStop(0, creative.style.backgroundColor || '#080808');
        gradient.addColorStop(1, brand.colorPalette.secondary || '#111111');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvasSize, canvasSize);
      } else if (creative.style.backgroundType === 'image' && creative.style.backgroundImageUrl) {
        // Draw image background
        const bgImg = new Image();
        bgImg.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
          bgImg.onload = () => {
            ctx.drawImage(bgImg, 0, 0, canvasSize, canvasSize);
            // Draw a semi-transparent dark overlay so exported post text is perfectly legible and matches the designer viewport
            const opacity = creative.style.overlayOpacity ?? 0.4;
            ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
            ctx.fillRect(0, 0, canvasSize, canvasSize);
            resolve();
          };
          bgImg.onerror = (e) => {
            console.warn('Canvas bg image load failed, using fallback color:', e);
            // fallback to color on error
            ctx.fillStyle = creative.style.backgroundColor || '#080808';
            ctx.fillRect(0, 0, canvasSize, canvasSize);
            resolve();
          };
          // Use our secure same-origin proxy to completely bypass browser CORS locks and avoid tainted canvas
          const originalUrl = creative.style.backgroundImageUrl || '';
          bgImg.src = originalUrl ? `/api/proxy-image?url=${encodeURIComponent(originalUrl)}` : '';
        });
      } else {
        ctx.fillStyle = creative.style.backgroundColor || '#080808';
        ctx.fillRect(0, 0, canvasSize, canvasSize);
      }

      // Draw aesthetic geometric background grids matching client preview
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 80;
      for (let x = 0; x < canvasSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasSize);
        ctx.stroke();
      }
      for (let y = 0; y < canvasSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasSize, y);
        ctx.stroke();
      }

      // 2. Draw Elements sequentially
      for (const el of creative.elements) {
        if (el.id === 'logo') continue; // Skip inline hardcoded logo!
        // Compute coordinates from percentage values (0-100)
        const elementX = (el.x / 100) * canvasSize;
        const elementY = (el.y / 100) * canvasSize;

        if (el.type === 'text' && el.content) {
          // Setup Font attributes
          const weight = el.fontWeight || 'normal';
          const size = (el.fontSize || 16) * 2.2; // premium scaling
          const font = `${weight} ${size}px ${creative.style.fontFamily || 'sans-serif'}`;
          ctx.font = font;
          ctx.fillStyle = el.color || creative.style.textColor || '#ffffff';
          ctx.textAlign = el.align as CanvasTextAlign || 'center';
          ctx.textBaseline = 'middle';

          // Prevent layout spoiling: wrap text to fit within standard text column (~320px in a 500px canvas = ~64% => 690px maximum width on 1080px export canvas)
          const maxCanvasWidth = 690;
          const paragraphs = el.content.split('\n');
          const lines: string[] = [];

          paragraphs.forEach((para) => {
            if (!para.trim()) {
              lines.push('');
              return;
            }
            const words = para.split(/\s+/);
            let currentLine = '';

            for (let i = 0; i < words.length; i++) {
              const word = words[i];
              const testLine = currentLine ? currentLine + ' ' + word : word;
              const metrics = ctx.measureText(testLine);
              if (metrics.width > maxCanvasWidth && i > 0) {
                lines.push(currentLine);
                currentLine = word;
              } else {
                currentLine = testLine;
              }
            }
            if (currentLine) {
              lines.push(currentLine);
            }
          });

          // Compute exact line heights and dynamically center the vertical alignment
          const lineHeight = size * 1.25;
          const startY = elementY - ((lines.length - 1) * lineHeight) / 2;

          lines.forEach((line, index) => {
            ctx.fillText(line, elementX, startY + index * lineHeight);
          });
        } 
        else if (el.type === 'image' && el.content) {
          // If content holds data URL or marker
          if (el.content.startsWith('data:image') || el.content.startsWith('http')) {
            const logoImg = new Image();
            logoImg.crossOrigin = 'anonymous';
            const size = (el.width || 80) * 2.2; // scale logo
            await new Promise<void>((resolve) => {
              logoImg.onload = () => {
                ctx.drawImage(
                  logoImg, 
                  elementX - size / 2, 
                  elementY - size / 2, 
                  size, 
                  size
                );
                resolve();
              };
              logoImg.onerror = () => {
                // Fallback text monogram if image is corrupt
                ctx.fillStyle = creative.style.textColor || '#ffffff';
                ctx.font = `bold 40px sans-serif`;
                ctx.textAlign = 'center';
                ctx.fillText(brand.name[0], elementX, elementY);
                resolve();
              };
              logoImg.src = el.content || '';
            });
          } else {
            // Draw neat circular monogram logo fallback
            const size = 120;
            ctx.fillStyle = creative.style.accentColor || '#ff2e93';
            ctx.beginPath();
            ctx.arc(elementX, elementY, size / 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 36px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(brand.name[0], elementX, elementY);
          }
        }
      }

      // 2.5 Draw Separate Logo Overlay if enabled
      if (logoEnabled) {
        await new Promise<void>((resolve) => {
          if (!brand.logoDataUrl && !brand.logoUrl) {
            // Draw neat circular monogram logo fallback
            const size = 120 * logoScale;
            let logoX = canvasSize / 2;
            let logoY = canvasSize / 2;
            const margin = canvasSize * 0.08;
            
            if (logoPosition === 'top-left') {
              logoX = margin + size / 2;
              logoY = margin + size / 2;
            } else if (logoPosition === 'top-center') {
              logoX = canvasSize / 2;
              logoY = margin + size / 2;
            } else if (logoPosition === 'top-right') {
              logoX = canvasSize - margin - size / 2;
              logoY = margin + size / 2;
            } else if (logoPosition === 'bottom-left') {
              logoX = margin + size / 2;
              logoY = canvasSize - margin - size / 2;
            } else if (logoPosition === 'bottom-center') {
              logoX = canvasSize / 2;
              logoY = canvasSize - margin - size / 2;
            } else if (logoPosition === 'bottom-right') {
              logoX = canvasSize - margin - size / 2;
              logoY = canvasSize - margin - size / 2;
            }
            
            ctx.save();
            ctx.globalAlpha = logoOpacity;
            ctx.fillStyle = logoMonochrome === 'white' ? '#ffffff' : (logoMonochrome === 'dark' ? '#000000' : (creative.style.accentColor || '#ff2e93'));
            ctx.beginPath();
            ctx.arc(logoX, logoY, size / 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = logoMonochrome === 'white' ? '#000000' : '#ffffff';
            ctx.font = `bold ${Math.round(40 * logoScale)}px ${creative.style.fontFamily || 'sans-serif'}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(brand.name[0], logoX, logoY);
            ctx.restore();
            resolve();
          } else {
            const logoImg = new Image();
            logoImg.crossOrigin = 'anonymous';
            logoImg.onload = () => {
              const size = 100 * logoScale * 2.2; // premium scaling factor
              let logoX = canvasSize / 2;
              let logoY = canvasSize / 2;
              const margin = canvasSize * 0.08;
              
              if (logoPosition === 'top-left') {
                logoX = margin + size / 2;
                logoY = margin + size / 2;
              } else if (logoPosition === 'top-center') {
                logoX = canvasSize / 2;
                logoY = margin + size / 2;
              } else if (logoPosition === 'top-right') {
                logoX = canvasSize - margin - size / 2;
                logoY = margin + size / 2;
              } else if (logoPosition === 'bottom-left') {
                logoX = margin + size / 2;
                logoY = canvasSize - margin - size / 2;
              } else if (logoPosition === 'bottom-center') {
                logoX = canvasSize / 2;
                logoY = canvasSize - margin - size / 2;
              } else if (logoPosition === 'bottom-right') {
                logoX = canvasSize - margin - size / 2;
                logoY = canvasSize - margin - size / 2;
              }
              
              ctx.save();
              ctx.globalAlpha = logoOpacity;
              
              if (logoMonochrome === 'white') {
                ctx.filter = 'brightness(0) invert(1)';
              } else if (logoMonochrome === 'dark') {
                ctx.filter = 'brightness(0)';
              }
              
              ctx.drawImage(logoImg, logoX - size / 2, logoY - size / 2, size, size);
              ctx.restore();
              resolve();
            };
            logoImg.onerror = () => {
              // Draw fallback monogram text
              const size = 120 * logoScale;
              let logoX = canvasSize / 2;
              let logoY = canvasSize / 2;
              const margin = canvasSize * 0.08;
              if (logoPosition === 'top-left') { logoX = margin + size/2; logoY = margin + size/2; }
              else if (logoPosition === 'top-center') { logoX = canvasSize / 2; logoY = margin + size/2; }
              else if (logoPosition === 'top-right') { logoX = canvasSize - margin - size/2; logoY = margin + size/2; }
              else if (logoPosition === 'bottom-left') { logoX = margin + size/2; logoY = canvasSize - margin - size/2; }
              else if (logoPosition === 'bottom-center') { logoX = canvasSize / 2; logoY = canvasSize - margin - size/2; }
              else if (logoPosition === 'bottom-right') { logoX = canvasSize - margin - size/2; logoY = canvasSize - margin - size/2; }
              
              ctx.save();
              ctx.globalAlpha = logoOpacity;
              ctx.fillStyle = logoMonochrome === 'white' ? '#ffffff' : (logoMonochrome === 'dark' ? '#000000' : (creative.style.accentColor || '#ff2e93'));
              ctx.font = `bold ${Math.round(44 * logoScale)}px "Space Grotesk"`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(brand.name.toUpperCase(), logoX, logoY);
              ctx.restore();
              resolve();
            };
            logoImg.src = brand.logoDataUrl || brand.logoUrl || '';
          }
        });
      }

      // 3. Export URL trigger download
      const dataUrl = exportCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `MomentMarketing_${brand.name}_${trendKeyword.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();

    } catch (err) {
      console.error('Error rendering HTML5 canvas export:', err);
      alert('Encountered an output rendering error. Downloading fallback data frame.');
    } finally {
      setExporting(false);
    }
  };

  const handleCustomBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && creative) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onCreativeChange({
          ...creative,
          style: {
            ...creative.style,
            backgroundType: 'image',
            backgroundImageUrl: reader.result as string,
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const selectedEl = getSelectedElement();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8" id="creative-workbench-editor">
      {/* Visual Canvas Workshop column */}
      <div className="xl:col-span-7 flex flex-col items-center justify-center space-y-4">
        {/* Editor Info Head */}
        <div className="w-full flex justify-between items-center bg-neutral-900 border border-neutral-850 p-3 rounded-lg text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff2e93] animate-pulse" />
            <span className="text-gray-300 font-mono">Workspace: {brand.name} × #{trendKeyword}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 font-mono text-[10px]">
            <span className="bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800">1:1 Square Ad</span>
          </div>
        </div>

        {creative ? (
          <div 
            ref={canvasRef}
            id="instagram-creative-canvas"
            style={{
              fontFamily: creative.style.fontFamily,
              backgroundColor: creative.style.backgroundColor,
              backgroundImage: creative.style.backgroundType === 'gradient' 
                ? creative.style.backgroundGradient 
                : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            className="relative w-full max-w-[500px] aspect-square rounded-xl overflow-hidden shadow-2xl border border-neutral-800 flex flex-col justify-between p-6 select-none"
          >
            {/* Direct Background Image rendering via standard HTML img with Referrer Policy and fade transition */}
            {creative.style.backgroundType === 'image' && creative.style.backgroundImageUrl && (
              <img
                src={creative.style.backgroundImageUrl.startsWith('data:') ? creative.style.backgroundImageUrl : `/api/proxy-image?url=${encodeURIComponent(creative.style.backgroundImageUrl)}`}
                alt="Ad Campaign Backdrop"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0 animate-fade-in"
              />
            )}

            {/* Grid Mesh lines aligned precisely like a Canva designer layer */}
            <div 
              className="absolute inset-0 opacity-[0.03] pointer-events-none z-10"
              style={{
                backgroundImage: `
                  linear-gradient(to right, white 1px, transparent 1px),
                  linear-gradient(to bottom, white 1px, transparent 1px)
                `,
                backgroundSize: '10% 10%',
              }}
            />

            {/* Soft dark tint overlay to make typography pop and ensure contrast ratio guidelines */}
            {creative.style.backgroundType === 'image' && creative.style.backgroundImageUrl && (
              <div 
                className="absolute inset-0 pointer-events-none bg-black mix-blend-multiply z-10"
                style={{ opacity: creative.style.overlayOpacity ?? 0.4 }}
              />
            )}

            {/* Render Editable Elements inside Canvas */}
            {creative.elements.map((el) => {
              if (el.id === 'logo') return null; // Keep old inline logo from rendering as regular layout element
              const isActive = selectedElementId === el.id;
              
              // Map percentage coordinates (x, y) dynamically
              const elementStyle: React.CSSProperties = {
                position: 'absolute',
                left: `${el.x}%`,
                top: `${el.y}%`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                transition: 'all 0.15s ease-out',
                zIndex: isActive ? 40 : 20,
              };

              return (
                <div
                  key={el.id}
                  style={elementStyle}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedElementId(el.id);
                  }}
                  className={`group relative p-2 px-3 rounded transition-all ${
                    isActive 
                      ? 'ring-2 ring-[#ff2e93] bg-[#ff2e93]/10 scale-[1.02]' 
                      : 'hover:ring-1 hover:ring-neutral-500/50 hover:bg-white/5'
                  }`}
                  id={`editable-canvas-${el.id}`}
                >
                  {/* Canva elements boundary lines and resizing dots */}
                  {isActive && (
                    <>
                      <div className="absolute top-0 left-0 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-[#ff2e93] rounded-full" />
                      <div className="absolute top-0 right-0 w-2 h-2 translate-x-1/2 -translate-y-1/2 bg-[#ff2e93] rounded-full" />
                      <div className="absolute bottom-0 left-0 w-2 h-2 -translate-x-1/2 translate-y-1/2 bg-[#ff2e93] rounded-full" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 translate-x-1/2 translate-y-1/2 bg-[#ff2e93] rounded-full" />
                      <span className="absolute bottom-[-22px] left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[8px] bg-[#ff2e93] text-white font-mono font-semibold uppercase tracking-widest pointer-events-none whitespace-nowrap shadow-md">
                        {el.id}
                      </span>
                    </>
                  )}

                  {/* Render Logo element */}
                  {el.type === 'image' && (
                    <div className="flex items-center justify-center">
                      {el.content && (el.content.startsWith('data:image') || el.content.startsWith('http')) ? (
                        <img 
                          src={el.content} 
                          alt="Logo preset"
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                          style={{
                            width: `${(el.width || 80) * (el.scale || 1)}px`,
                            height: `${(el.height || 80) * (el.scale || 1)}px`,
                          }}
                          className="object-contain"
                        />
                      ) : (
                        <div 
                          style={{
                            width: `${(el.width || 80) * (el.scale || 1)}px`,
                            height: `${(el.width || 80) * (el.scale || 1)}px`,
                            backgroundColor: creative.style.accentColor || '#ff2e93',
                          }}
                          className="rounded-full flex items-center justify-center text-white font-bold text-lg select-none shadow-md"
                        >
                          {brand.name[0]}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Render Text Elements */}
                  {el.type === 'text' && el.content && (
                    <div 
                      style={{
                        fontSize: `${el.fontSize || 16}px`,
                        color: el.color || creative.style.textColor,
                        textAlign: el.align || 'center',
                        fontWeight: el.fontWeight || 'normal',
                        lineHeight: 1.2,
                        whiteSpace: 'pre-wrap',
                      }}
                      className="font-sans leading-snug tracking-tight text-white select-none max-w-[320px]"
                    >
                      {el.content}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Separate Brand Logo Overlay Preview */}
            {logoEnabled && (
              <div 
                style={{
                  position: 'absolute',
                  ...getLogoOverlayCSSPosition(logoPosition),
                  transform: logoPosition.includes('center') ? 'translateX(-50%)' : 'none',
                  zIndex: 25,
                  opacity: logoOpacity,
                  pointerEvents: 'none',
                  transition: 'all 0.15s ease-out',
                }}
                className="flex items-center justify-center p-2 animate-fade-in"
                id="brand-logo-custom-overlay"
              >
                {brand.logoDataUrl || brand.logoUrl ? (
                  <img 
                    src={brand.logoDataUrl || brand.logoUrl} 
                    alt="Separated overlay brand logo"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    style={{
                      width: `${60 * logoScale}px`,
                      height: `${60 * logoScale}px`,
                      filter: logoMonochrome === 'white' ? 'brightness(0) invert(1)' : (logoMonochrome === 'dark' ? 'brightness(0)' : 'none'),
                    }}
                    className="object-contain"
                  />
                ) : (
                  <div 
                    style={{
                      width: `${60 * logoScale}px`,
                      height: `${60 * logoScale}px`,
                      backgroundColor: creative.style.accentColor || '#ff2e93',
                    }}
                    className={`rounded-full flex items-center justify-center text-white font-bold select-none shadow-md ${
                      logoMonochrome === 'white' ? 'bg-white text-black' : (logoMonochrome === 'dark' ? 'bg-black text-white' : '')
                    }`}
                  >
                    {brand.name[0]}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full max-w-[500px] aspect-square rounded-xl bg-neutral-900/60 border border-neutral-850 flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-neutral-800/80 flex items-center justify-center text-pink-400">
              <Layout size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Generate Creative Canvas</p>
              <p className="text-xs text-gray-500 max-w-[280px] mx-auto mt-1 leading-relaxed">
                Choose an active trend item and click 'Generate Ad Campaign' to assemble dynamic, contextual Canva-style creative cards here!
              </p>
            </div>
          </div>
        )}

        {/* Canva element movement directions tooltip */}
        {creative && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-850 rounded-full text-[10px] text-gray-400 font-mono">
            <HelpCircle size={12} className="text-[#ff2e93]" />
            <span>Pro tip: Click directly on elements inside the canvas to edit them.</span>
          </div>
        )}

        {/* 🍌 Nano-Banana Visual AI Generator Column Card */}
        {creative && (
          <div className="w-full max-w-[500px] bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4 animate-fade-in shadow-xl relative overflow-hidden" id="nano-banana-generator">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/5 blur-3xl rounded-full" />
            <div className="absolute top-0 left-0 w-24 h-24 bg-pink-500/5 blur-3xl rounded-full" />
            
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl animate-bounce">🍌</span>
                <div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">
                    Nano Banana AI Image Engine
                  </span>
                  <span className="text-[9px] text-gray-400 block font-mono">
                    Real-time visual backdrop generator • Pollinations v3
                  </span>
                </div>
              </div>
              {creative.style.backgroundType !== 'image' && (
                <button
                  onClick={() => onCreativeChange({
                    ...creative,
                    style: { ...creative.style, backgroundType: 'image' }
                  })}
                  className="px-2.5 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20 rounded text-[9px] uppercase font-mono transition"
                >
                  Activate Photo Mode
                </button>
              )}
            </div>

            {/* Prompt input box where they can keep giving changes */}
            <div className="space-y-3 font-sans">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] uppercase font-bold text-gray-500">Edit Photo Prompt / Style Tweaks</label>
                  {generatingBgImage && <span className="text-[10px] text-yellow-400 font-mono animate-pulse">Running GPU shaders...</span>}
                </div>
                <textarea
                  rows={2}
                  value={visualPrompt}
                  onChange={(e) => setVisualPrompt(e.target.value)}
                  placeholder="Describe your background scene changes..."
                  className="w-full text-xs p-3 bg-neutral-950 border border-neutral-800 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 rounded-lg text-white font-mono placeholder-gray-650 focus:outline-none transition leading-relaxed resize-none"
                />
              </div>

              {/* Style preset suggestions chips shelf */}
              <div className="space-y-1.5">
                <span className="block text-[9px] uppercase font-bold text-gray-600">🍌 Fast Tweak Modifiers (Click to inject)</span>
                <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto">
                  {[
                    { label: "📸 Commercial photography", prompt: "highly detailed commercial advertising photography, studio lighting" },
                    { label: "🌌 Glowing cyber neon", prompt: "vibrant glowing pink and yellow cyber neon billboard background" },
                    { label: "🍿 Cinematic backdrop", prompt: "gorgeous blurred shallow depth of field cinematic 3d advertising shot" },
                    { label: "🍩 Delicious food shot", prompt: "mouthwatering delicious commercial food photography shot" },
                    { label: "🎨 Minimalist vector", prompt: "sleek simple minimalist flat vector illustration, pastel backgrounds" },
                    { label: "⚡ Pop culture glow", prompt: "dynamic graphic design burst of liquid splash elements, high energy vibes" },
                  ].map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => {
                        // Append chip or clear and set
                        if (visualPrompt.trim() === '' || visualPrompt === 'A rich aesthetic high-contrast background') {
                          setVisualPrompt(chip.prompt);
                        } else {
                          // append cleanly with a comma if not already appended
                          if (!visualPrompt.includes(chip.prompt)) {
                            setVisualPrompt(prev => prev.trim() + ", " + chip.prompt);
                          }
                        }
                      }}
                      className="text-[10px] py-1 px-2.5 bg-neutral-950 hover:bg-[#ff2e93]/15 text-gray-400 hover:text-white rounded-full border border-neutral-850 hover:border-[#ff2e93]/40 transition pointer-events-auto"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action trigger */}
              <button
                type="button"
                onClick={handleGenerateBgImage}
                disabled={generatingBgImage || !visualPrompt.trim()}
                className="w-full py-2.5 bg-gradient-to-r from-yellow-500 via-[#ff2e93] to-pink-600 text-white rounded-lg font-extrabold text-xs uppercase tracking-widest transition duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-pink-900/10 disabled:opacity-50 disabled:scale-100 cursor-pointer flex items-center justify-center gap-2"
              >
                {generatingBgImage ? (
                  <>
                    <RefreshCcw size={12} className="animate-spin" />
                    Nano-Banana compiling...
                  </>
                ) : (
                  <>
                    <Sparkles size={12} className="text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
                    🍌 Compile Visual Changes
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Canva Controls Workbench column */}
      <div className="xl:col-span-5 space-y-5">
        {creative ? (
          <>
            {/* ✨ Guided AI Concept & "Nano-Banana" Image Generator Card */}
            <div className="bg-neutral-900 border border-neutral-850 rounded-xl p-5 space-y-4 shadow-lg animate-fade-in" id="ai-concept-blender">
              <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
                <Sparkles size={16} className="text-[#ff2e93] animate-pulse" />
                <div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">AI Campaign Concept Blender</span>
                  <span className="text-[10px] text-gray-400">Blends trend signals with your brand's intelligence.</span>
                </div>
              </div>

              {/* Prompt Concept input */}
              <div className="space-y-3">
                <div className="space-y-1.5 block">
                  <label className="block text-[10px] uppercase font-bold text-gray-500">1. Draft Ad Concept / copy guidance</label>
                  <textarea
                    rows={2}
                    value={copyGuidance}
                    onChange={(e) => setCopyGuidance(e.target.value)}
                    placeholder="e.g. Subway sandwich melt wearing goggles and eating fresh at Lollapalooza..."
                    className="w-full text-xs p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono placeholder-gray-650 focus:outline-none focus:border-[#ff2e93]"
                  />
                </div>

                {/* Suggestions shelf */}
                <div className="space-y-1.5">
                  <span className="block text-[9px] uppercase font-bold text-gray-650">Curated Brand Ideas (Click to load)</span>
                  <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                    {getQuickGuidanceSuggestions().map((suggestion, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setCopyGuidance(suggestion);
                          setVisualPrompt(suggestion);
                        }}
                        className="text-[10px] bg-neutral-950 hover:bg-neutral-850 p-2 text-left text-gray-400 hover:text-white rounded border border-neutral-850 transition duration-150 leading-relaxed truncate"
                        title={suggestion}
                      >
                        💡 {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Run copy/layout regeneration */}
                <button
                  type="button"
                  onClick={() => onRegenerateAll(copyGuidance)}
                  disabled={generating}
                  className="w-full py-2 bg-gradient-to-r from-pink-600 to-[#ff2e93] hover:opacity-90 disabled:opacity-50 text-white rounded-lg font-bold text-xs uppercase tracking-wider transition shadow-md"
                >
                  {generating ? 'Re-composing layers...' : 'Regenerate copy elements'}
                </button>
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-850 rounded-xl p-5 space-y-5 shadow-lg">
            {/* Action headers */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sliders size={14} className="text-[#ff2e93]" />
                Design Controller
              </span>
              <button
                onClick={handleExportToImage}
                disabled={exporting}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-850 hover:bg-neutral-800 border border-neutral-750 text-white rounded-lg font-semibold text-[10px] uppercase tracking-wider transition cursor-pointer"
              >
                <Download size={12} />
                {exporting ? 'Rendering...' : 'Export Post (PNG)'}
              </button>
            </div>

            {/* Aesthetic Layout Templates Preset Shelf */}
            <div className="p-3 bg-neutral-950 border border-neutral-850 rounded-lg space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <LayoutTemplate size={12} className="text-yellow-400" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gray-300">Aesthetic Layout Preset</span>
                </div>
                <span className="text-[8px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full font-mono font-bold uppercase select-none">Clean Format</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'default', label: 'Classic Align', desc: 'Standard balanced template mapping' },
                  { id: 'minimal', label: 'Minimalist Quote', desc: 'Sleek oversized headline focus, hidden tagline' },
                  { id: 'spotlight', label: 'Spotlight Hero', desc: 'Lower text bounds, highlights backdrop' },
                  { id: 'split', label: 'Aesthetic Modern', desc: 'Pristine split proportional design' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    title={item.desc}
                    onClick={() => applyLayoutPreset(item.id as any)}
                    className={`py-2 px-1 text-center rounded border transition duration-150 cursor-pointer flex flex-col justify-between h-[52px] ${
                      layoutPreset === item.id 
                        ? 'bg-[#ff2e93]/15 border-[#ff2e93] text-white' 
                        : 'bg-neutral-900 border-neutral-850 text-gray-400 hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    <span className="text-[9px] font-bold block uppercase leading-none tracking-tight text-center w-full select-none">{item.label.split(' ')[0]}</span>
                    <span className="text-[7px] text-gray-500 block truncate scale-90 w-full text-center select-none">{item.id === layoutPreset ? '★ Active' : 'Apply'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Element Selector Tab */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500">Select Creative Layer</label>
                <button
                  type="button"
                  onClick={() => {
                    if (!creative) return;
                    const newId = `text-${creative.elements.length + 1}`;
                    const customEl: EditableElement = {
                      id: newId,
                      type: 'text',
                      content: 'Custom dynamic text element',
                      x: 50,
                      y: 60,
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: creative.style.textColor || '#ffffff',
                      align: 'center'
                    };
                    onCreativeChange({
                      ...creative,
                      elements: [...creative.elements, customEl]
                    });
                    setSelectedElementId(newId);
                  }}
                  className="px-2 py-0.5 bg-[#ff2e93]/10 hover:bg-[#ff2e93]/20 border border-[#ff2e93]/20 text-[#ff2e93] text-[9px] font-bold uppercase rounded tracking-wider flex items-center gap-1 transition cursor-pointer"
                >
                  ➕ Add Text
                </button>
              </div>
              <div className="flex flex-wrap gap-1 max-h-[120px] overflow-y-auto p-1 bg-neutral-950 rounded border border-neutral-850">
                {creative.elements.map((el) => (
                  <button
                    key={el.id}
                    type="button"
                    onClick={() => setSelectedElementId(el.id)}
                    className={`py-1 px-2 rounded text-[10px] font-mono capitalize border transition cursor-pointer ${
                      selectedElementId === el.id 
                        ? 'bg-neutral-800 border-[#ff2e93]/50 text-white font-semibold shadow-inner' 
                        : 'bg-neutral-900 border-neutral-800 text-gray-400 hover:text-white hover:border-neutral-750'
                    }`}
                  >
                    {el.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-Element Attribute Adjustments */}
            {selectedEl ? (
              <div className="space-y-4 p-4 bg-neutral-950 border border-neutral-850 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white capitalize flex items-center gap-1">
                    <Type size={12} className="text-[#ff2e93]" />
                    Managing {selectedEl.id}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono uppercase">
                    Format: {selectedEl.type}
                  </span>
                </div>

                {/* Direct copy text editor */}
                {selectedEl.type === 'text' && (
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-1.5">Copy / Headline Text</label>
                    <textarea
                      rows={3}
                      value={selectedEl.content || ''}
                      onChange={(e) => handleElementUpdate(selectedEl.id, { content: e.target.value })}
                      className="w-full text-xs p-2 px-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-mono focus:outline-none focus:border-[#ff2e93]"
                    />
                  </div>
                )}

                {/* Sliders and direct position controllers */}
                <div className="space-y-3 pt-2">
                  <span className="block text-[10px] uppercase tracking-wider font-semibold text-gray-500">Fine Coordinates & Sizes</span>
                  
                  {/* Position coordinates helper */}
                  <div className="grid grid-cols-2 gap-3 text-[10px] font-mono">
                    <div className="space-y-1">
                      <div className="flex justify-between text-gray-400">
                        <span>Horiz (X):</span>
                        <span>{selectedEl.x}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={selectedEl.x}
                        onChange={(e) => handleElementUpdate(selectedEl.id, { x: parseInt(e.target.value) })}
                        className="w-full accent-[#ff2e93]"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-gray-400">
                        <span>Vert (Y):</span>
                        <span>{selectedEl.y}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={selectedEl.y}
                        onChange={(e) => handleElementUpdate(selectedEl.id, { y: parseInt(e.target.value) })}
                        className="w-full accent-[#ff2e93]"
                      />
                    </div>
                  </div>

                  {/* Size adjustments inside editor */}
                  <div className="grid grid-cols-2 gap-3 text-[10px] font-mono pt-1">
                    {selectedEl.type === 'text' ? (
                      <div className="col-span-2 space-y-1">
                        <div className="flex justify-between text-gray-400">
                          <span>Font Size:</span>
                          <span>{selectedEl.fontSize || 16}px</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="50"
                          value={selectedEl.fontSize || 16}
                          onChange={(e) => handleElementUpdate(selectedEl.id, { fontSize: parseInt(e.target.value) })}
                          className="w-full accent-[#ff2e93]"
                        />
                      </div>
                    ) : (
                      <div className="col-span-2 space-y-1">
                        <div className="flex justify-between text-gray-400">
                          <span>Logo Scale:</span>
                          <span>{selectedEl.scale || 1}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="2.5"
                          step="0.1"
                          value={selectedEl.scale || 1}
                          onChange={(e) => handleElementUpdate(selectedEl.id, { scale: parseFloat(e.target.value) })}
                          className="w-full accent-[#ff2e93]"
                        />
                      </div>
                    )}
                  </div>

                  {/* High Accuracy Visual Micro placement D-Pad */}
                  <div className="pt-2 border-t border-neutral-850">
                    <span className="block text-[10px] uppercase tracking-wider font-semibold text-gray-500 mb-2">Micro Placement Controls</span>
                    <div className="flex items-center justify-between gap-4">
                      {/* Movement Pad */}
                      <div className="grid grid-cols-3 gap-1 bg-neutral-900 p-2 rounded-lg border border-neutral-800 shrink-0 mx-auto sm:mx-0">
                        <div />
                        <button
                          type="button"
                          onClick={() => handleElementUpdate(selectedEl.id, { y: Math.max(0, selectedEl.y - 1) })}
                          className="p-1 px-1.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded border border-neutral-750"
                        >
                          <ChevronUp size={12} />
                        </button>
                        <div />
                        <button
                          type="button"
                          onClick={() => handleElementUpdate(selectedEl.id, { x: Math.max(0, selectedEl.x - 1) })}
                          className="p-1 px-1.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded border border-neutral-750"
                        >
                          <ChevronLeft size={12} />
                        </button>
                        <div className="bg-neutral-950 p-1 font-mono text-[9px] flex items-center justify-center text-gray-500 rounded border border-neutral-850">Pad</div>
                        <button
                          type="button"
                          onClick={() => handleElementUpdate(selectedEl.id, { x: Math.min(100, selectedEl.x + 1) })}
                          className="p-1 px-1.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded border border-neutral-750"
                        >
                          <ChevronRight size={12} />
                        </button>
                        <div />
                        <button
                          type="button"
                          onClick={() => handleElementUpdate(selectedEl.id, { y: Math.min(100, selectedEl.y + 1) })}
                          className="p-1 px-1.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded border border-neutral-750"
                        >
                          <ChevronDown size={12} />
                        </button>
                        <div />
                      </div>

                      {/* Align Text Button or Color overrides */}
                      {selectedEl.type === 'text' && (
                        <div className="space-y-2 flex-grow">
                          <div>
                            <span className="block text-[9px] uppercase tracking-wider font-semibold text-gray-600 mb-1">Color Override</span>
                            <div className="flex items-center gap-1">
                              <input
                                type="color"
                                value={selectedEl.color || creative.style.textColor}
                                onChange={(e) => handleElementUpdate(selectedEl.id, { color: e.target.value })}
                                className="w-5 h-5 cursor-pointer bg-transparent border-0"
                              />
                              <span className="text-[10px] font-mono text-gray-400">{selectedEl.color || 'Standard bg'}</span>
                            </div>
                          </div>
                          <div>
                            <span className="block text-[9px] uppercase tracking-wider font-semibold text-gray-600 mb-1">Align Option</span>
                            <div className="flex gap-1">
                              {['left', 'center', 'right'].map((al) => (
                                <button
                                  key={al}
                                  type="button"
                                  onClick={() => handleElementUpdate(selectedEl.id, { align: al as any })}
                                  className={`px-1.5 py-0.5 rounded text-[9px] border uppercase ${
                                    selectedEl.align === al 
                                      ? 'bg-neutral-800 text-white border-neutral-700' 
                                      : 'bg-neutral-950 text-gray-500 border-neutral-850'
                                  }`}
                                >
                                  {al}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-850">
                    <button
                      type="button"
                      onClick={() => {
                        if (!creative || !selectedElementId) return;
                        const updatedElements = creative.elements.filter(el => el.id !== selectedElementId);
                        onCreativeChange({
                          ...creative,
                          elements: updatedElements
                        });
                        setSelectedElementId(updatedElements[0]?.id || null);
                      }}
                      className="w-full py-2 bg-red-950/40 hover:bg-red-950/80 hover:text-white border border-red-900/30 text-red-300 text-[10px] font-mono tracking-wider uppercase rounded transition cursor-pointer"
                    >
                      🗑️ Delete Element "{selectedElementId}"
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-neutral-950 border border-neutral-850 text-center rounded-lg text-xs text-gray-500">
                Tap any available layer button to manipulate its visual typography, size scale or position.
              </div>
            )}

            {/* Separate Brand Logo Overlay Component Panel */}
            <div className="p-3.5 bg-neutral-950 border border-neutral-850 rounded-lg space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
                <div className="flex items-center gap-1.5">
                  <ImagePlus size={12} className="text-[#ff2e93] animate-pulse" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-gray-300">Separate Brand Logo Layer</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-gray-500 font-mono font-medium">Overlay Status</span>
                  <input
                    type="checkbox"
                    checked={logoEnabled}
                    onChange={(e) => setLogoEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-[#ff2e93] bg-neutral-900 border-neutral-800 focus:ring-pink-600 focus:ring-offset-neutral-950 accent-[#ff2e93] cursor-pointer"
                  />
                </div>
              </div>

              {logoEnabled ? (
                <div className="space-y-3 animate-fade-in text-[10px] font-sans">
                  {/* Logo position selection */}
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider font-semibold text-gray-500 mb-1">Logo Placement / Corner Anchors</label>
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { pos: 'top-left', label: 'Top Left' },
                        { pos: 'top-center', label: 'Top Center' },
                        { pos: 'top-right', label: 'Top Right' },
                        { pos: 'bottom-left', label: 'Bottom Left' },
                        { pos: 'bottom-center', label: 'Bottom Center' },
                        { pos: 'bottom-right', label: 'Bottom Right' }
                      ].map((p) => (
                        <button
                          key={p.pos}
                          type="button"
                          onClick={() => setLogoPosition(p.pos as any)}
                          className={`py-1 rounded text-[8px] font-mono capitalize border cursor-pointer transition duration-150 ${
                            logoPosition === p.pos 
                              ? 'bg-[#ff2e93]/10 border-[#ff2e93] text-white font-bold text-[#ff2e93]' 
                              : 'bg-neutral-900 border-neutral-850 text-gray-400 hover:text-white'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Logo configurations scale, opacity and filter styling */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-gray-400 text-[8px]">
                        <span>Logo Scale multiplier:</span>
                        <span>{Math.round(logoScale * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.3"
                        max="2"
                        step="0.05"
                        value={logoScale}
                        onChange={(e) => setLogoScale(parseFloat(e.target.value))}
                        className="w-full accent-[#ff2e93]"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-gray-400 text-[8px]">
                        <span>Opacity factor:</span>
                        <span>{Math.round(logoOpacity * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.05"
                        value={logoOpacity}
                        onChange={(e) => setLogoOpacity(parseFloat(e.target.value))}
                        className="w-full accent-[#ff2e93]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-wider font-semibold text-gray-500 mb-1">Color / Monochromatic Styling</label>
                    <div className="flex gap-1.5">
                      {[
                        { val: 'none', label: '🎨 Original Brand Colors' },
                        { val: 'white', label: '⚪ Crisp Absolute White' },
                        { val: 'dark', label: '⚫ Midnight Dark Silhouette' }
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => setLogoMonochrome(item.val as any)}
                          className={`flex-1 py-1 px-1 rounded text-[8px] border transition cursor-pointer ${
                            logoMonochrome === item.val
                              ? 'bg-[#ff2e93]/10 border-[#ff2e93] text-[#ff2e93] font-bold'
                              : 'bg-neutral-900 border-neutral-850 text-gray-400 hover:text-white'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-[9px] text-gray-500 leading-relaxed font-mono bg-neutral-900/40 p-2 rounded text-center">
                  Logo overlay is temporary kept off for a cleaner design text. Tick "Overlay Status" to pop overlay logo onto the canvas.
                </p>
              )}
            </div>

            {/* Background Canvas Settings */}
            <div className="pt-2 border-t border-neutral-850 space-y-3">
              <span className="block text-[10px] uppercase font-bold text-gray-500">Background Material Settings</span>
              
              <div className="flex gap-2">
                {['gradient', 'color', 'image'].map((type) => (
                  <button
                    key={type}
                    onClick={() => onCreativeChange({
                      ...creative,
                      style: { ...creative.style, backgroundType: type as any }
                    })}
                    className={`flex-1 py-1 px-2 border rounded font-mono text-[9px] uppercase transition ${
                      creative.style.backgroundType === type 
                        ? 'bg-neutral-800 border-[#ff2e93]/50 text-white' 
                        : 'bg-neutral-950 border-neutral-850 text-gray-500'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {creative.style.backgroundType === 'color' && (
                <div className="flex items-center gap-2 bg-neutral-950 p-2.5 rounded-lg border border-neutral-850 text-xs">
                  <input
                    type="color"
                    value={creative.style.backgroundColor}
                    onChange={(e) => onCreativeChange({
                      ...creative,
                      style: { ...creative.style, backgroundColor: e.target.value }
                    })}
                    className="w-5 h-5 rounded cursor-pointer"
                  />
                  <span className="text-gray-400 font-mono text-[10px]">Select background flat color ({creative.style.backgroundColor})</span>
                </div>
              )}

              {creative.style.backgroundType === 'image' && (
                <div className="space-y-1.5 bg-yellow-500/5 p-3.5 rounded-lg border border-yellow-500/10 text-xs">
                  <div className="flex items-center gap-1.5 text-yellow-400 font-bold text-[10px] uppercase">
                    <Sparkles size={11} className="animate-pulse" /> Photo generated by nano banana
                  </div>
                  <p className="text-[10px] text-gray-400 leading-relaxed font-sans">
                    The background photo is rendered by the custom Nano-Banana engine. To refine visual details or change the backdrop look entirely, type your guidelines into the prompt box directly under the visual canvas!
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={applyBrandColors}
                  className="text-[10px] uppercase font-bold text-pink-400 hover:text-pink-300 transition flex items-center gap-1"
                >
                  <RefreshCcw size={10} /> Reset to Brand Colors
                </button>
              </div>
            </div>
            
            {/* Ad text summary */}
            <div className="p-4 bg-lime-950/10 border border-lime-500/10 rounded-lg space-y-2">
              <span className="block text-[10px] uppercase font-bold tracking-wider text-lime-400">Campaign Captions Blueprint</span>
              <div className="space-y-2 text-xs">
                <p className="text-gray-350 italic">
                  "{creative.caption}"
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-neutral-850">
                  {creative.hashtags.map((ht) => (
                    <span key={ht} className="text-[10px] text-lime-500 font-mono font-medium">#{ht}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
        ) : (
          <div className="p-12 text-center text-xs text-gray-500 bg-neutral-905 border border-neutral-850 rounded-xl space-y-4">
            <Sliders size={24} className="mx-auto text-neutral-700" />
            <p>Ready to customize elements layout. Select a live moment from the dashboard panel and generate details to open these visual presets!</p>
          </div>
        )}
      </div>
    </div>
  );
}
