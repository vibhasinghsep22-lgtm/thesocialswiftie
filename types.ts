export type SocialPlatform = 'twitter' | 'instagram' | 'facebook' | 'linkedin' | 'tiktok';

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface BrandImage {
  id: string;
  name: string;
  url: string;
  dataUrl?: string; // base64 if uploaded locally
}

export interface BrandProfile {
  id: string;
  name: string;
  tagline?: string;
  handle: string;
  industry: string;
  brandVoice: string; // 'witty' | 'professional' | 'minimalist' | 'bold' | 'educational'
  logoUrl?: string; // fallback
  logoDataUrl?: string; // base64 uploaded logo
  fontFamily: string; // 'Inter' | 'Space Grotesk' | 'JetBrains Mono' | 'Playfair Display'
  colorPalette: ColorPalette;
  images: BrandImage[];
  description?: string;
}

export interface TrendTopic {
  id: string;
  keyword: string;
  platform: SocialPlatform;
  category: string; // 'Pop Culture' | 'Sports' | 'Meme' | 'News' | 'Entertainment' | 'Tech'
  engagementScore: number; // 0-100 score
  relativeTime: string;
  description: string;
  whyTrending: string;
  viralPostExample: string;
  hashtags: string[];
  region?: 'Indian' | 'Global';
  city?: string;
  volume?: string; // e.g., "1.2M posts"
  audioTrack?: string; // e.g., "Viral Reel Audio: 'Brown Rang' (Speed Up)"
  linkedinContext?: string; // e.g., "B2B Creator Debate Level: High"
}

export interface EditableElement {
  id: string;
  type: 'image' | 'text' | 'shape';
  content?: string;
  x: number; // percentage (0-100) or absolute pixels relative to canvas center/corners
  y: number;
  fontSize?: number;
  color?: string;
  scale?: number;
  width?: number;
  height?: number;
  align?: 'left' | 'center' | 'right';
  fontWeight?: string;
}

export interface GeneratedCreative {
  id: string;
  trendId: string;
  brandId: string;
  headline: string;
  caption: string;
  hashtags: string[];
  style: {
    backgroundType: 'color' | 'gradient' | 'image';
    backgroundColor: string;
    backgroundGradient: string; // CSS gradient string
    backgroundImageUrl?: string;
    textColor: string;
    accentColor: string;
    fontFamily: string;
    overlayOpacity: number;
  };
  elements: EditableElement[];
}
