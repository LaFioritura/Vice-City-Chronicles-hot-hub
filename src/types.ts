/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: 'Official' | 'Leak' | 'Analysis' | 'Rumours' | 'Guide';
  date: string;
  author: string;
  readTime: string;
  imageUrl: string;
  seoKeywords: string[];
  viralRating: number; // 1-5 rating representing potential virality on social media
  viralHook: string; // Tailored hook for TikTok / Reddit
  likes: number;
}

export interface LaunchEvent {
  id: string;
  title: string;
  organizer: string;
  date: string;
  time: string;
  location: string;
  platform: 'Discord' | 'Twitch' | 'Real Life' | 'YouTube' | 'In-Game';
  description: string;
  attendeesCount: number;
  bannerUrl?: string;
}

export interface AffiliateProduct {
  id: string;
  name: string;
  description: string;
  category: 'Consoles' | 'Games' | 'Accessories' | 'Merch';
  price: number;
  discountPrice?: number;
  affiliateUrl: string;
  promoCode: string;
  rating: number;
  specs: string[];
  pros: string[];
  buyOn: string; // e.g. Amazon, GameStop, Instant Gaming
  imageUrl: string;
}

export interface CommunityTheory {
  id: string;
  username: string;
  faction: 'Lucia Loyalist' | 'Jason Believer' | 'Vice City Syndicate' | 'Leonida Police' | 'No-Affiliation';
  title: string;
  content: string;
  timestamp: string;
  upvotes: number;
  commentsCount: number;
}
