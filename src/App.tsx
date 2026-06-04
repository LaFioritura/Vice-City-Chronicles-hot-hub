/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  ShoppingBag,
  Calendar,
  Users,
  Search,
  Share2,
  TrendingUp,
  Tag,
  Clock,
  ThumbsUp,
  MessageSquare,
  PlusCircle,
  Copy,
  Check,
  AlertTriangle,
  Flame,
  Award,
  Globe,
  Radio,
  Volume2,
  ChevronRight,
  ExternalLink,
  DollarSign,
  User,
  Heart,
  Smartphone,
  Eye,
  Settings,
  ArrowRight
} from 'lucide-react';
import { BLOG_POSTS, INITIAL_EVENTS, AFFILIATE_PRODUCTS, INITIAL_THEORIES, SEO_KEYWORD_CHIPS, SEO_CHECKLIST, RETRO_RADIO_STATIONS, bannerImg, gamingSetupImg, luciaArtworkImg, mapLeakImg } from './data';
import { BlogPost, LaunchEvent, AffiliateProduct, CommunityTheory } from './types';

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'notizie' | 'affiliazioni' | 'eventi' | 'community' | 'seo'>('notizie');

  // Dual-Gateway configuration state
  const [currentGateway, setCurrentGateway] = useState<'welcome' | 'public' | 'admin'>('welcome');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminErrorMsg, setAdminErrorMsg] = useState('');

  // Active custom CMS states & Settings values in CRM
  const [activeCoupon, setActiveCoupon] = useState<string>(() => {
    return localStorage.getItem('gta6_active_coupon') || 'VICEVI';
  });
  const [targetCountdown, setTargetCountdown] = useState<string>(() => {
    return localStorage.getItem('gta6_target_countdown') || '2027-10-25T00:00:00Z';
  });

  // Blog states - Dynamic database with LocalStorage
  const [blogList, setBlogList] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('gta6_portal_blogs');
    return saved ? JSON.parse(saved) : BLOG_POSTS;
  });
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [blogLikes, setBlogLikes] = useState<Record<string, number>>({});

  // CRM Sub-tab in Administrator view
  const [adminSubTab, setAdminSubTab] = useState<'articles' | 'crm' | 'forum' | 'settings'>('articles');

  // Interactive CRM / Newsletter Subscribers List
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<string[]>(() => {
    const saved = localStorage.getItem('gta6_portal_subscribers');
    return saved ? JSON.parse(saved) : [
      "leone.vice@vicecity.it",
      "gta_fan_roma@gmail.com",
      "sindacato.gaming@outlook.com",
      "candybam.AA@gmail.com"
    ];
  });

  // CMS Form Fields
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [cmsTitle, setCmsTitle] = useState('');
  const [cmsCategory, setCmsCategory] = useState<'Official' | 'Leak' | 'Analysis' | 'Rumours' | 'Guide'>('Official');
  const [cmsSummary, setCmsSummary] = useState('');
  const [cmsContent, setCmsContent] = useState('');
  const [cmsDate, setCmsDate] = useState('');
  const [cmsAuthor, setCmsAuthor] = useState('');
  const [cmsReadTime, setCmsReadTime] = useState('');
  const [cmsImageUrl, setCmsImageUrl] = useState('');
  const [cmsKeywords, setCmsKeywords] = useState('');
  const [cmsViralHook, setCmsViralHook] = useState('');

  // Loaded form action handlers
  const startEditPost = (post: BlogPost) => {
    setEditingPostId(post.id);
    setCmsTitle(post.title);
    setCmsCategory(post.category);
    setCmsSummary(post.summary);
    setCmsContent(post.content);
    setCmsDate(post.date);
    setCmsAuthor(post.author);
    setCmsReadTime(post.readTime);
    setCmsImageUrl(post.imageUrl);
    setCmsKeywords(post.seoKeywords.join(', '));
    setCmsViralHook(post.viralHook || '');
  };

  const resetCmsForm = () => {
    setEditingPostId(null);
    setCmsTitle('');
    setCmsCategory('Official');
    setCmsSummary('');
    setCmsContent('');
    setCmsDate(new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }));
    setCmsAuthor('Frank Leone');
    setCmsReadTime('5 min lettura');
    setCmsImageUrl(bannerImg);
    setCmsKeywords('Mappa GTA 6, GTA 4, Vice City News, preordine GTA VI');
    setCmsViralHook('💥 CLAMOROSO LEAK: Ecco gli ultimi segreti appena scoperti! #GTA6 #ViceCity');
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmsTitle || !cmsContent) {
      alert('Il Titolo ed il Contenuto sono obbligatori!');
      return;
    }

    const keywordsArray = cmsKeywords
      ? cmsKeywords.split(',').map((k) => k.trim()).filter(Boolean)
      : ['GTA 6', 'Notizie'];

    if (editingPostId) {
      // Modify
      setBlogList((prev) =>
        prev.map((post) => {
          if (post.id === editingPostId) {
            const updated = {
              ...post,
              title: cmsTitle,
              slug: cmsTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              category: cmsCategory,
              summary: cmsSummary,
              content: cmsContent,
              date: cmsDate || post.date,
              author: cmsAuthor || post.author,
              readTime: cmsReadTime || post.readTime,
              imageUrl: cmsImageUrl || post.imageUrl,
              seoKeywords: keywordsArray,
              viralHook: cmsViralHook || post.viralHook
            };
            if (selectedPost && selectedPost.id === editingPostId) {
              setSelectedPost(updated);
            }
            return updated;
          }
          return post;
        })
      );
      alert('Articolo aggiornato nel database fan club!');
    } else {
      // Create new
      const newPost: BlogPost = {
        id: `blog-post-${Date.now()}`,
        title: cmsTitle,
        slug: cmsTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: cmsCategory,
        summary: cmsSummary,
        content: cmsContent,
        date: cmsDate || new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }),
        author: cmsAuthor || 'Frank Leone',
        readTime: cmsReadTime || '5 min lettura',
        imageUrl: cmsImageUrl || bannerImg,
        seoKeywords: keywordsArray,
        viralRating: 5,
        viralHook: cmsViralHook || `🚨 NOTIZIA BOMBA: ${cmsTitle}! Scoprila subito nel feed!`,
        likes: 12
      };
      setBlogList((prev) => [newPost, ...prev]);
      alert('Nuovo post creato e pubblicato sul feed pubblico!');
    }
    resetCmsForm();
  };

  const handleDeletePost = (postId: string) => {
    if (window.confirm('Sei sicuro di voler cancellare definitivamente questo articolo?')) {
      setBlogList((prev) => prev.filter((p) => p.id !== postId));
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(null);
      }
    }
  };

  // Radio state
  const [activeRadio, setActiveRadio] = useState<number>(0);
  const [isRadioPlaying, setIsRadioPlaying] = useState<boolean>(true);
  const [radioVolume, setRadioVolume] = useState<number>(75);

  // Events states
  const [eventsList, setEventsList] = useState<LaunchEvent[]>(() => {
    const saved = localStorage.getItem('gta6_portal_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventOrganizer, setNewEventOrganizer] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventPlatform, setNewEventPlatform] = useState<'Discord' | 'Twitch' | 'Real Life' | 'YouTube' | 'In-Game'>('Discord');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [eventSuccessMsg, setEventSuccessMsg] = useState(false);

  // Community discussion states
  const [theories, setTheories] = useState<CommunityTheory[]>(() => {
    const saved = localStorage.getItem('gta6_portal_theories');
    return saved ? JSON.parse(saved) : INITIAL_THEORIES;
  });
  const [theoryUsername, setTheoryUsername] = useState('');
  const [theoryFaction, setTheoryFaction] = useState<'Lucia Loyalist' | 'Jason Believer' | 'Vice City Syndicate' | 'Leonida Police' | 'No-Affiliation'>('Lucia Loyalist');
  const [theoryTitle, setTheoryTitle] = useState('');
  const [theoryContent, setTheoryContent] = useState('');
  const [votedTheories, setVotedTheories] = useState<Record<string, boolean>>({});

  // Affiliate Budget Calculator states
  const [userBudget, setUserBudget] = useState<number>(1000);
  const [recommendedBundle, setRecommendedBundle] = useState<string>('Premium 4K Setup');

  // Viral AI Hook script maker states
  const [hookTopic, setHookTopic] = useState<'release_date' | 'map_leak' | 'character_romance' | 'cheats'>('release_date');
  const [hookPlatform, setHookPlatform] = useState<'tiktok' | 'reddit' | 'ig_reels'>('tiktok');
  const [customGeneratedHook, setCustomGeneratedHook] = useState<string>(
    '🚨 SPOILER SHOCK SU GTA 6! Ecco il frammento di mappa fuggito ieri sera che Rockstar sta cercando di cancellare da Internet... 🗺️🤯'
  );
  const [copiedHook, setCopiedHook] = useState(false);

  // General alert states
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Countdown timer to predicted GTA 6 window
  const [timeRemaining, setTimeRemaining] = useState({ days: 490, hours: 14, minutes: 22, seconds: 40 });

  // Newsletter setup
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubbed, setNewsletterSubbed] = useState(false);

  // Sync state modifications to localStorage
  useEffect(() => {
    localStorage.setItem('gta6_portal_events', JSON.stringify(eventsList));
  }, [eventsList]);

  useEffect(() => {
    localStorage.setItem('gta6_portal_theories', JSON.stringify(theories));
  }, [theories]);

  useEffect(() => {
    localStorage.setItem('gta6_portal_blogs', JSON.stringify(blogList));
  }, [blogList]);

  useEffect(() => {
    localStorage.setItem('gta6_portal_subscribers', JSON.stringify(newsletterSubscribers));
  }, [newsletterSubscribers]);

  useEffect(() => {
    localStorage.setItem('gta6_active_coupon', activeCoupon);
  }, [activeCoupon]);

  useEffect(() => {
    localStorage.setItem('gta6_target_countdown', targetCountdown);
  }, [targetCountdown]);

  // Handle countdown calculation dynamically using the editable target date
  useEffect(() => {
    const handleCount = () => {
      const targetDate = new Date(targetCountdown).getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (isNaN(difference) || difference <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    handleCount(); // run once immediately
    const interval = setInterval(handleCount, 1000);
    return () => clearInterval(interval);
  }, [targetCountdown]);

  // Filter blog posts based on category and search
  const filteredPosts = blogList.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.seoKeywords.some((kw) => kw.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleLikePost = (postId: string) => {
    setBlogLikes((prev) => {
      const isLiked = prev[postId];
      const updated = { ...prev, [postId]: isLiked ? 0 : 1 };
      
      // Update actual count inside list
      setBlogList((currentList) =>
        currentList.map((post) => {
          if (post.id === postId) {
            return { ...post, likes: post.likes + (isLiked ? -1 : 1) };
          }
          return post;
        })
      );
      return updated;
    });
  };

  // Add new Custom Launch Event
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle || !newEventOrganizer || !newEventDate || !newEventTime || !newEventLocation) {
      alert('Per favore compila tutti i campi obbligatori per creare l\'evento.');
      return;
    }

    const newEvent: LaunchEvent = {
      id: `custom-event-${Date.now()}`,
      title: newEventTitle,
      organizer: newEventOrganizer,
      date: newEventDate,
      time: newEventTime,
      location: newEventLocation,
      platform: newEventPlatform,
      description: newEventDesc || 'Unisciti alla nostra discussione legata a GTA 6 e preparati con noi per la rapina iniziale!',
      attendeesCount: 1 // Starts with creator
    };

    setEventsList([newEvent, ...eventsList]);
    setNewEventTitle('');
    setNewEventOrganizer('');
    setNewEventDate('');
    setNewEventTime('');
    setNewEventLocation('');
    setNewEventDesc('');
    setEventSuccessMsg(true);
    setTimeout(() => setEventSuccessMsg(false), 5000);
  };

  // Upvote custom fan theory
  const handleUpvoteTheory = (theoryId: string) => {
    if (votedTheories[theoryId]) return; // Single upvote restriction

    setTheories((prev) =>
      prev.map((t) => {
        if (t.id === theoryId) {
          return { ...t, upvotes: t.upvotes + 1 };
        }
        return t;
      })
    );
    setVotedTheories((prev) => ({ ...prev, [theoryId]: true }));
  };

  // Create new theory
  const handleCreateTheory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!theoryTitle || !theoryContent) {
      alert('Compila il titolo e la spiegazione della tua favolosa teoria criminale!');
      return;
    }

    const newTheoryObj: CommunityTheory = {
      id: `theory-${Date.now()}`,
      username: theoryUsername.trim() || 'AnonimoCriminologo',
      faction: theoryFaction,
      title: theoryTitle,
      content: theoryContent,
      timestamp: 'Poco fa',
      upvotes: 1,
      commentsCount: 0
    };

    setTheories([newTheoryObj, ...theories]);
    setTheoryTitle('');
    setTheoryContent('');
    setTheoryUsername('');
    alert('Teoria pubblicata sul canale radiofonico sotterraneo dei fan di GTA 6!');
  };

  // Dynamic advice generator for Affiliate Calculator
  const handleBudgetCalculate = (budget: number) => {
    setUserBudget(budget);
    if (budget < 100) {
      setRecommendedBundle('Copie di Gioco Standard + Poster neon');
    } else if (budget >= 100 && budget < 550) {
      setRecommendedBundle('Xbox Series S Rigenerata + Gioco Day One Bonus');
    } else if (budget >= 550 && budget < 900) {
      setRecommendedBundle('Console Sony PS5 Slim + Copie Digitali + Astro A50 Pro');
    } else {
      setRecommendedBundle('Premium 4K Setup: PlayStation 5 Pro + Cuffie Astro A50 Gen 5 + Sconto Merch');
    }
  };

  // Generate Social Viral Scripts dynamically
  const handleGenerateHook = () => {
    let text = '';
    if (hookPlatform === 'tiktok') {
      if (hookTopic === 'release_date') {
        text = '🚨 CONFIRMATION SHOCK DI ROCKSTAR GAMES! 🕹️ Scordati le voci: la reale data d’uscita di GTA 6 è appena trapelata a causa di un report segreto dei soci Take-Two! 💸 Ecco il giorno esatto! 💥 #GTA6 #gamingitalia #gta6release #luciaandjason';
      } else if (hookTopic === 'map_leak') {
        text = '🗺️ IL SEGRETO PIÙ OCCULTATO DI GTA 6! Gli sviluppatori hanno dimenticato questo marker sulla mappa... La cittadina di Port Gellhorn è identica a Miami nel dettaglio assurdo dei canali sotterranei! 🚨 #GTA6 #gamingnews #gta6leak #mappa';
      } else if (hookTopic === 'character_romance') {
        text = '💘 SANGUE E AMORE IN VICE CITY! Jason tradirà davvero Lucia alla fine della storia? C’è una conversazione trapelata nella prigione federale che capovolge assolutamente tutto! 💔🍿 #GTA6 #gta6lucia #jasonandlucia #teoriedigame';
      } else {
        text = '⚠️ CODICI REGISTRATI NEGLI EVENTI! Sapevi che inserendo il codice VICEVI nel portale potrai accaparrarti sconti fino al 40% sul merch di Vice City? Questa roba va virale in 5 minuti! 🔥👗 #gta6merch #vicecitystyle #rockstargames';
      }
    } else if (hookPlatform === 'reddit') {
      if (hookTopic === 'release_date') {
        text = '[LEAK CONFERMATO] Documento azionario Take-Two rivela la pianificazione del lancio globale di GTA VI nel tardo Autunno 2027 a causa delle ottimizzazioni per PS5 Pro e del ritardo programmato su PC. Cosa ne pensate della mossa commerciale?';
      } else if (hookTopic === 'map_leak') {
        text = '[ANALISI CARTOGRAFICA] Abbiamo mappato tutte le 148 città secondarie visibili nel Trailer 1 e le coordinate del leak del 2022. La mappa supera Los Santos di ben 3 volte includendo laghi sotterranei giganti navigabili.';
      } else if (hookTopic === 'character_romance') {
        text = '[TEORIA STORIA] Perché la cavigliera elettronica di Lucia rimarrà accesa per l\'intera prima parte del gioco e in che modo creerà un blocco fittizio della mappa ad ovest delle Keys. Ecco la mia ricostruzione basata sui codici RAGE.';
      } else {
        text = '[COMMUNITY REDDIT] Raccolta sconti e preordini consigliati. Elenco completo dei migliori prezzi minimi storici per console PS5 Pro e bundle fisici Deluxe di GTA VI per risparmiare fino a 110 euro al lancio.';
      }
    } else { // instagram reels
      if (hookTopic === 'release_date') {
        text = '🔥 REELS LIVE DAL METAVERSO! GTA 6 ha finalmente un mese programmato per l’uscita e spaccherà a metà il mercato dei videogiochi! Salva questo reel per non perderti l’annuncio fatidico di Rockstar! 🕹️💥 #gta6real #notizielive #vicecitychronicles';
      } else if (hookTopic === 'map_leak') {
        text = '🌴 L’hype è indescrivibile! Guarda l’acqua dinamica di Vice City basata sul motore RAGE 9. È qualcosa di illegale per quanto sia sbalorditiva! 🌅🌊 #gaminglife #gtavileaks #mappaleonida #grandtheftauto';
      } else if (hookTopic === 'character_romance') {
        text = '👩‍❤️‍👨 Bonnie e Clyde in chiave moderna e violenta. Chi sceglierai di controllare per primo durante i colpi in banca sulla costa? Scrivilo nei commenti! 👇🏼🔥 #gta6trailer #luciagta6 #gamingcommunity #gameritalia';
      } else {
        text = '🛍️ SHOPPING DAY ONE! Tutti i segreti per configurare la tua PlayStation 5 Pro al meglio per il più grande gioco di sempre! Controlla il link nelle info! 📦🎮 #ps5prosetup #readyforgta6 #affiliazionigaming';
      }
    }
    setCustomGeneratedHook(text);
  };

  useEffect(() => {
    handleGenerateHook();
  }, [hookTopic, hookPlatform]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  };

  // Quick dynamic subscriber trigger
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      if (!newsletterSubscribers.includes(newsletterEmail)) {
        setNewsletterSubscribers((prev) => [...prev, newsletterEmail]);
      }
      setNewsletterSubbed(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubbed(false), 5000);
    }
  };

  const handleAddManualLead = (email: string) => {
    if (!email) return;
    const cleanMail = email.trim();
    if (!newsletterSubscribers.includes(cleanMail)) {
      setNewsletterSubscribers((prev) => [...prev, cleanMail]);
      alert('Contatto newsletter aggiunto con successo!');
    } else {
      alert('Email già presente nel database CRM.');
    }
  };

  const handleDeleteLead = (email: string) => {
    if (window.confirm(`Rimuovere l'indirizzo email "${email}" dal CRM Newsletter?`)) {
      setNewsletterSubscribers((prev) => prev.filter((e) => e !== email));
    }
  };

  const handleModerateTheory = (theoryId: string) => {
    if (window.confirm('Sei sicuro di voler censurare e rimuovere questo post dal forum pubblico della crew?')) {
      setTheories((prev) => prev.filter((t) => t.id !== theoryId));
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-slate-100 font-sans selection:bg-brand-pink selection:text-white">
      {/* PROFESSIONAL UPPER UTILITY BAR */}
      <div className="border-b border-white/10 bg-black/80 px-6 py-3 text-xs text-white/80 flex flex-wrap justify-between items-center shadow-md relative z-20">
        <div className="flex items-center space-x-3">
          <span className="w-2 h-2 rounded-full bg-brand-pink animate-pulse"></span>
          <span className="font-space font-bold tracking-wider text-sm bg-gradient-to-r from-brand-pink to-brand-cyan bg-clip-text text-transparent uppercase">GTA CHRONICLES</span>
          <span className="text-white/20">|</span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">ITALIAN FAN SYNDICATE</span>
        </div>
        <div className="flex items-center space-x-4 text-[11px] font-mono">
          <span className="text-slate-400 hidden sm:inline">CODICE SCONTO ATTIVO: <strong className="text-yellow-400 font-bold font-mono uppercase">{activeCoupon}</strong></span>
          <span className="text-white/10 hidden sm:inline">|</span>
          {currentGateway !== 'welcome' ? (
            <button
              onClick={() => {
                setCurrentGateway('welcome');
                setIsAdminUnlocked(false);
                setAdminPasscode('');
              }}
              className="px-2.5 py-1 bg-brand-pink/10 border border-brand-pink/30 hover:border-brand-pink hover:bg-brand-pink hover:text-white hover:scale-105 transition rounded font-mono text-[9px] text-brand-pink uppercase tracking-widest cursor-pointer inline-flex items-center gap-1.5"
            >
              🚪 ESCI AL MENU PRINCIPALE
            </button>
          ) : (
            <span className="text-brand-cyan uppercase font-bold">CONNESSIONE SICURA</span>
          )}
        </div>
      </div>

      {/* GATEWAY SPLASH SELECTOR VIEW */}
      {currentGateway === 'welcome' && (
        <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 relative z-10 flex flex-col justify-center min-h-[80vh]">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase font-space bg-gradient-to-r from-brand-pink via-fuchsia-500 to-brand-cyan bg-clip-text text-transparent hover:scale-[1.01] transition-transform duration-300 drop-shadow-[0_4px_25px_rgba(242,5,92,0.25)]">
              ViceCity <span className="text-brand-cyan neon-glow-cyan not-italic">Chronicles</span>
            </h1>
            <p className="mt-3.5 text-xs font-mono text-slate-400 uppercase tracking-widest max-w-xl mx-auto">
              SELEZIONA IL TUO INGRESSO AL DATABASE DELLA LEONIDA STATE
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* INGRESSO 01: PUBBLICO */}
            <div className="bg-brand-gray/95 border border-brand-pink/30 hover:border-brand-pink rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_30px_rgba(242,5,92,0.15)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/5 rounded-full blur-3xl group-hover:bg-brand-pink/10 transition-all duration-500"></div>
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-brand-pink/10 rounded border border-brand-pink/30 text-brand-pink">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[9px] font-mono text-brand-pink uppercase tracking-widest">INGRESSO 01</div>
                    <h3 className="text-lg font-black text-white font-space uppercase">Portale Pubblico</h3>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-6 font-sans">
                  Il feed di riferimento per la fan crew e gli appassionati di GTA VI. Esplora notizie in tempo reale, leak confermati, date stimatrici, coordina raduni di lancio con altri criminologi e discuti le teorie della cospirazione più folli.
                </p>
                <ul className="space-y-2.5 text-[11px] text-slate-400 font-mono mb-8 uppercase">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-pink"></span> Notizie & Leak Aggiornati</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-pink"></span> Coordinamento Raduni della Crew</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-pink"></span> Canale Radio Ambient Live Player</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-pink"></span> Teorie dei Fan della Costa</li>
                </ul>
              </div>
              <button
                onClick={() => {
                  setCurrentGateway('public');
                  setActiveTab('notizie');
                }}
                className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white text-xs font-black py-3.5 rounded transition uppercase tracking-widest -skew-x-12 cursor-pointer text-center"
              >
                Accedi Ora Come Fan →
              </button>
            </div>

            {/* INGRESSO 02: AMMINISTRAZIONE */}
            <div className="bg-brand-gray/95 border border-brand-cyan/30 hover:border-brand-cyan rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_30px_rgba(5,217,232,0.15)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/5 rounded-full blur-3xl group-hover:bg-brand-cyan/10 transition-all duration-500"></div>
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-brand-cyan/10 rounded border border-brand-cyan/30 text-brand-cyan">
                    <Settings className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[9px] font-mono text-brand-cyan uppercase tracking-widest">INGRESSO 02</div>
                    <h3 className="text-lg font-black text-white font-space uppercase">Hub Amministrativo</h3>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-6 font-sans">
                  Pannello di controllo ad accesso condizionato riservato ai redattori, webmaster e marketer d'affiliazione autorizzati del portale. Gestisci tracciamento SEO, checklist tecniche e fabbrica degli script social.
                </p>
                <ul className="space-y-2.5 text-[11px] text-slate-400 font-mono mb-8 uppercase">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-cyan"></span> Simulazione Snippet Google SERP</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-cyan"></span> Esportatore Microdati JSON-LD</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-cyan"></span> Fabbrica Hook Virali automatici</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-brand-cyan"></span> Checklist Ottimizzazione Tecnica</li>
                </ul>
              </div>
              <button
                onClick={() => {
                  setCurrentGateway('admin');
                }}
                className="w-full bg-brand-cyan hover:bg-white text-black text-xs font-black py-3.5 rounded transition uppercase tracking-widest -skew-x-12 cursor-pointer text-center"
              >
                Sblocca Terminale Admin →
              </button>
            </div>
          </div>
          
          <div className="text-center mt-12 text-[10px] text-slate-600 font-mono uppercase tracking-widest">
            © 2026 ViceCity News Syndicate | All Connections Encrypted RAGE-v9
          </div>
        </div>
      )}

      {/* LOCKSCREEN TERMINAL FOR ADMIN ENTRY */}
      {currentGateway === 'admin' && !isAdminUnlocked && (
        <div className="max-w-md mx-auto px-4 py-20 relative z-10 flex flex-col justify-center min-h-[70vh]">
          <div className="bg-black border-2 border-brand-cyan rounded-2xl p-8 shadow-[0_0_40px_rgba(5,217,232,0.15)] relative font-mono text-xs overflow-hidden">
            <div className="absolute top-0 left-0 w-full bg-brand-cyan text-black px-4 py-1.5 text-[10px] font-black uppercase tracking-widest flex justify-between items-center animate-pulse">
              <span>🔒 TERMINALE DI SICUREZZA</span>
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
            </div>
            
            <div className="mt-6 flex justify-center mb-6">
              <div className="p-3 bg-brand-cyan/10 rounded-full border border-brand-cyan/20 text-brand-cyan">
                <Settings className="w-8 h-8 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
            </div>

            <p className="text-brand-cyan font-bold uppercase tracking-wider text-center mb-1">ACCESSO AMMINISTRATIVO</p>
            <p className="text-[10px] text-slate-400 text-center uppercase tracking-tight mb-6 font-mono">Inserisci la password per attivare la console SEO</p>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (adminPasscode.toLowerCase() === 'vicevi' || adminPasscode === '1986' || adminPasscode === 'admin') {
                setIsAdminUnlocked(true);
                setAdminErrorMsg('');
                setActiveTab('seo');
              } else {
                setAdminErrorMsg('CHIAVE NON VALIDA. ACCESSO NEGATO.');
              }
            }} className="space-y-4">
              <div>
                <label className="block text-slate-500 text-[9px] uppercase tracking-widest mb-1.5">Codice de-crittografia (VICEVI):</label>
                <input
                  type="password"
                  placeholder="Inserisci pin d'ingresso..."
                  value={adminPasscode}
                  onChange={(e) => {
                    setAdminPasscode(e.target.value);
                    if (adminErrorMsg) setAdminErrorMsg('');
                  }}
                  className="w-full bg-black border border-brand-cyan/50 rounded px-3 py-2.5 text-xs text-brand-cyan font-mono focus:outline-none focus:border-brand-cyan shadow-sm"
                  autoFocus
                />
              </div>

              {adminErrorMsg && (
                <div className="text-[10px] text-brand-pink bg-brand-pink/10 border border-brand-pink/30 p-2.5 rounded font-mono text-center uppercase tracking-wider font-bold animate-pulse">
                  ⚠ {adminErrorMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-brand-cyan hover:bg-white text-black text-xs font-black py-3 rounded transition uppercase tracking-widest -skew-x-12 cursor-pointer text-center"
              >
                AUTENTICA TERMINALE →
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsAdminUnlocked(true);
                  setAdminPasscode('VICEVI');
                  setAdminErrorMsg('');
                  setActiveTab('seo');
                }}
                className="w-full bg-slate-900 border border-white/10 hover:bg-slate-800 text-white/75 text-[10px] font-bold py-2 rounded transition uppercase tracking-widest -skew-x-12 cursor-pointer text-center"
              >
                ⚡ Bypass d'Accesso Istantaneo (VICEVI)
              </button>
            </form>

            <div className="mt-6 border-t border-brand-cyan/20 pt-4 text-[9px] text-slate-500 text-center leading-normal">
              PRO-TIP: Digita <code className="text-brand-pink font-semibold font-mono">VICEVI</code> o usa il bypass istantaneo per accedere subito senza barriere!
            </div>
            
            <button
              onClick={() => setCurrentGateway('welcome')}
              className="mt-4 block mx-auto text-[9px] text-slate-400 hover:text-white uppercase transition-colors text-center cursor-pointer hover:underline"
            >
              ← Torna alla Scelta Principale
            </button>
          </div>
        </div>
      )}

      {/* STANDARD APPLICATION PORTAL LAYOUT */}
      {currentGateway !== 'welcome' && (currentGateway === 'public' || (currentGateway === 'admin' && isAdminUnlocked)) && (
        <>
          {/* HEADER SECTION IN GTA VICE CITY STYLE: Hot Pink / Cyan gradients with responsive grid */}
          <header className="relative bg-gradient-to-r from-brand-dark via-brand-purple-dark/80 to-brand-dark border-b border-white/10 overflow-hidden py-8">
            {/* Subtle grid elements representing Vice City palm trees shadow with scanline feel */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-80" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-brand-dark to-transparent pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-center md:text-left">
                  {currentGateway === 'admin' ? (
                    <>
                      <h1 className="text-4xl md:text-7.5xl font-black italic tracking-tighter uppercase font-space bg-gradient-to-r from-brand-cyan via-indigo-400 to-brand-pink bg-clip-text text-transparent hover:scale-[1.01] transition-transform duration-300 drop-shadow-[0_4px_25px_rgba(5,217,232,0.25)]">
                        MKTG <span className="text-brand-pink neon-glow-pink not-italic">Workspace</span>
                      </h1>
                      <p className="mt-3.5 text-xs sm:text-xs font-mono text-slate-400 uppercase tracking-widest max-w-xl">
                        CONSOLE STRUMENTI PREORDINI & SEO DI <span className="text-brand-cyan font-bold neon-glow-cyan">VICE CITY CHRONICLES</span>
                      </p>
                    </>
                  ) : (
                    <>
                      <h1 className="text-4xl md:text-7.5xl font-black italic tracking-tighter uppercase font-space bg-gradient-to-r from-brand-pink via-fuchsia-500 to-brand-cyan bg-clip-text text-transparent hover:scale-[1.01] transition-transform duration-300 drop-shadow-[0_4px_25px_rgba(242,5,92,0.25)]">
                        ViceCity <span className="text-brand-cyan neon-glow-cyan not-italic">News</span>
                      </h1>
                      <p className="mt-3.5 text-xs sm:text-xs font-mono text-slate-400 uppercase tracking-widest max-w-xl">
                        L'EPICENTRO DELLA VIRALITÀ E DEI PREORDINI DI <span className="text-brand-pink font-bold neon-glow-pink">GTA VI</span> PER VERI CRIPTO-CRIMINOLOGI ITALIANI
                      </p>
                    </>
                  )}
                </div>

                {/* LIVE COUNTDOWN METRIC */}
                <div className="bg-brand-gray/90 border border-white/10 rounded-xl p-4 text-center neon-border-cyan min-w-[290px] max-w-sm backdrop-blur-md">
                  <div className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest mb-2 font-bold flex items-center justify-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-brand-pink animate-bounce" /> CONTATORE STIME RILASCIO UFFICIALE
                  </div>
                  <div className="grid grid-cols-4 gap-2 font-mono text-slate-100">
                    <div className="bg-black/60 rounded px-2.5 py-2 border border-white/5">
                      <div className="text-lg md:text-xl font-black text-brand-pink">{timeRemaining.days}</div>
                      <div className="text-[8px] text-slate-500 uppercase tracking-wider font-bold">Giorni</div>
                    </div>
                    <div className="bg-black/60 rounded px-2.5 py-2 border border-white/5">
                      <div className="text-lg md:text-xl font-black text-brand-cyan">{timeRemaining.hours}</div>
                      <div className="text-[8px] text-slate-500 uppercase tracking-wider font-bold">Ore</div>
                    </div>
                    <div className="bg-black/60 rounded px-2.5 py-2 border border-white/5">
                      <div className="text-lg md:text-xl font-black text-yellow-400">{timeRemaining.minutes}</div>
                      <div className="text-[8px] text-slate-500 uppercase tracking-wider font-bold">Minuti</div>
                    </div>
                    <div className="bg-black/60 rounded px-2.5 py-2 border border-white/5">
                      <div className="text-lg md:text-xl font-black text-emerald-400 animate-pulse">{timeRemaining.seconds}</div>
                      <div className="text-[8px] text-slate-500 uppercase tracking-wider font-bold">Secondi</div>
                    </div>
                  </div>
                  <div className="mt-2.5 text-[9px] font-mono text-slate-500 uppercase">PREVISIONI BASATE SUL REPORT TAKE-TWO</div>
                </div>
              </div>

              {/* MAIN NAV TABS - Dynamic based on entry points (SEO is exclusive to Admin mode) */}
              <nav className="mt-10 flex flex-wrap gap-2.5 border-b border-white/10 pb-px">
                {currentGateway === 'public' ? (
                  <>
                    <button
                      onClick={() => { setActiveTab('notizie'); setSelectedPost(null); }}
                      className={`flex items-center space-x-2 px-5 py-3 text-xs font-black tracking-widest uppercase transition-all duration-300 border-b-2 rounded-t font-space ${
                        activeTab === 'notizie'
                          ? 'bg-brand-gray border-brand-pink text-brand-pink shadow-[0_-4px_12px_rgba(242,5,92,0.15)] -skew-x-6'
                          : 'border-transparent text-slate-400 hover:text-slate-100 hover:bg-white/5'
                      }`}
                    >
                      <Newspaper className="w-3.5 h-3.5 text-brand-pink" />
                      <span>Notizie & Leak Live</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('affiliazioni')}
                      className={`flex items-center space-x-2 px-5 py-3 text-xs font-black tracking-widest uppercase transition-all duration-300 border-b-2 rounded-t font-space ${
                        activeTab === 'affiliazioni'
                          ? 'bg-brand-gray border-brand-cyan text-brand-cyan shadow-[0_-4px_12px_rgba(5,217,232,0.15)] -skew-x-6'
                          : 'border-transparent text-slate-400 hover:text-slate-100 hover:bg-white/5'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-brand-cyan" />
                      <span>Shopping Day One</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('eventi')}
                      className={`flex items-center space-x-2 px-5 py-3 text-xs font-black tracking-widest uppercase transition-all duration-300 border-b-2 rounded-t font-space ${
                        activeTab === 'eventi'
                          ? 'bg-brand-gray border-yellow-400 text-yellow-500 shadow-[0_-4px_12px_rgba(250,204,21,0.15)] -skew-x-6'
                          : 'border-transparent text-slate-400 hover:text-slate-100 hover:bg-white/5'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5 text-yellow-400" />
                      <span>Eventi & Countdown</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('community')}
                      className={`flex items-center space-x-2 px-5 py-3 text-xs font-black tracking-widest uppercase transition-all duration-300 border-b-2 rounded-t font-space ${
                        activeTab === 'community'
                          ? 'bg-brand-gray border-emerald-400 text-emerald-400 shadow-[0_-4px_12px_rgba(52,211,153,0.15)] -skew-x-6'
                          : 'border-transparent text-slate-400 hover:text-slate-100 hover:bg-white/5'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Crew & Teorie</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-wrap items-center justify-between w-full pb-2">
                    <button
                      className={`flex items-center space-x-2 px-5 py-3 text-xs font-black tracking-widest uppercase border-b-2 rounded-t font-space bg-brand-gray border-brand-cyan text-brand-cyan shadow-[0_-4px_12px_rgba(5,217,232,0.15)] -skew-x-6`}
                    >
                      <Globe className="w-3.5 h-3.5 text-brand-cyan animate-pulse" />
                      <span>Console Amministratore (CMS Articoli & CRM Leads)</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentGateway('public');
                        setActiveTab('notizie');
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-brand-pink to-[#b80041] text-white text-[10px] font-black uppercase rounded tracking-widest -skew-x-12 hover:scale-105 transition-transform duration-300 flex items-center gap-1.5 cursor-pointer"
                    >
                      👁 ENTRA PORTALE PUBBLICO (VISUALIZZA FEED)
                    </button>
                  </div>
                )}
              </nav>
            </div>
          </header>

      {/* RADIO FM SYSTEM IN TRUE ROCKSTAR VIBE STYLE */}
      <section className="bg-brand-gray border-y border-white/5 py-4 px-4 shadow-inner relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 sm:p-2.5 bg-black border border-brand-pink/50 rounded animate-pulse">
              <Radio className="w-4 h-4 text-brand-pink" />
            </div>
            <div>
              <div className="text-[9px] font-mono text-brand-cyan uppercase tracking-wider font-bold">V.C. NEWS AMBIENT RADIO WHEEL</div>
              <div className="text-sm font-black tracking-tight text-slate-100">{RETRO_RADIO_STATIONS[activeRadio].name} - <span className="text-brand-pink font-mono text-xs">{RETRO_RADIO_STATIONS[activeRadio].freq}</span></div>
            </div>
          </div>

          {/* RADIO BUTTONS SELECTION */}
          <div className="flex flex-wrap gap-1.5">
            {RETRO_RADIO_STATIONS.map((station, idx) => (
              <button
                key={station.name}
                onClick={() => {
                  setActiveRadio(idx);
                  setIsRadioPlaying(true);
                }}
                className={`px-3 py-1 rounded text-[10px] font-mono tracking-widest transition-all duration-300 ${
                  activeRadio === idx
                    ? 'bg-brand-pink text-white font-bold shadow-lg shadow-brand-pink/20 -skew-x-12'
                    : 'bg-black text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                {station.freq.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* PLAYBACK STATE ANIMATED GRAPHICS */}
          <div className="flex items-center space-x-4">
            {isRadioPlaying && (
              <div className="flex items-center space-x-1 h-5">
                <span className="w-0.5 bg-brand-pink h-2 animate-[pulse_1s_infinite]"></span>
                <span className="w-0.5 bg-brand-pink/80 h-4 animate-[pulse_0.8s_infinite] delay-100"></span>
                <span className="w-0.5 bg-brand-cyan h-5 animate-[pulse_1.2s_infinite] delay-200"></span>
                <span className="w-0.5 bg-fuchsia-400 h-3 animate-[pulse_0.7s_infinite] delay-150"></span>
                <span className="w-0.5 bg-yellow-400 h-4 animate-[pulse_0.9s_infinite] delay-300"></span>
              </div>
            )}
            <button
              onClick={() => setIsRadioPlaying(!isRadioPlaying)}
              className="px-3.5 py-1.5 bg-black border border-white/10 rounded text-[10px] font-mono text-slate-300 hover:bg-white/5 transition"
            >
              {isRadioPlaying ? 'PAUSA MUSICA' : 'ASCOLTA LIVE FM'}
            </button>
          </div>
        </div>
      </section>

      {/* CLIPPABLE NOTIFICATION FOR COPIED ELEMENTS */}
      {copiedText && (
        <div className="fixed top-6 right-6 z-50 bg-brand-pink border border-white/20 px-4 py-3 rounded shadow-2xl flex items-center space-x-2 animate-bounce">
          <Check className="w-4 h-4 text-white" />
          <span className="text-white text-xs font-bold font-mono uppercase tracking-wider">Copiato: {copiedText}</span>
        </div>
      )}

      {/* MAIN LAYOUT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* ==================== TAB 1: NOTIZIE & LEAK LIVE ==================== */}
        {activeTab === 'notizie' && (
          <div>
            {/* BIG HERO CARD FOR HIGHEST REWARDING VISITORS TIME */}
            {!selectedPost && !searchQuery && selectedCategory === 'All' && (
              <div className="relative mb-12 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-brand-gray/90 backdrop-blur-md">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  <div className="lg:col-span-7 h-64 sm:h-96 relative">
                    <img
                      src={bannerImg}
                      alt="GTA 6 Official Poster Background"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-brand-dark" />
                    {/* Glowing tag category */}
                    <span className="absolute top-4 left-4 bg-brand-pink text-white font-mono text-[9px] font-bold py-1 px-3 rounded uppercase tracking-widest shadow-lg -skew-x-12">
                      STIME CONFERMATE & TRAILER 1
                    </span>
                  </div>

                  <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 text-brand-pink font-mono text-xs uppercase tracking-widest mb-3.5 font-bold">
                        <Flame className="w-4 h-4 text-brand-pink" />
                        <span>ARTICOLO IN EVIDENZA | VIRALE DAY ONE</span>
                      </div>
                      <h2 className="text-2xl sm:text-3.5xl font-black text-white hover:text-brand-pink transition cursor-pointer font-space leading-tight mb-4"
                          onClick={() => setSelectedPost(BLOG_POSTS[0])}>
                        GTA 6 Leonida State: Mappa e Confini Rivoluzionari
                      </h2>
                      <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        Esploriamo la ricostruzione cartografica svelata ieri sera. Dai grattacieli di Vice City fino agli acquitrini sterminati della fitta Leonida fittizia ispirata alla Florida.
                      </p>
                    </div>

                    <div className="flex flex-col gap-4 border-t border-white/5 pt-4">
                      {/* Interactive buy voucher placeholder inside Hero post */}
                      <div className="bg-black/60 rounded-xl p-3.5 border border-white/5 flex items-center justify-between">
                        <div>
                          <div className="text-[9px] font-mono text-yellow-500 uppercase tracking-widest font-bold">PREORDINE CONSIGLIATO</div>
                          <div className="text-xs font-bold text-white">GTA VI Standard + Gadget</div>
                        </div>
                        <button
                          onClick={() => setActiveTab('affiliazioni')}
                          className="px-3.5 py-2 bg-brand-cyan text-black text-xs font-black hover:bg-white rounded transition uppercase tracking-wider -skew-x-12"
                        >
                          69,90€ - Compra Ora
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                        <span>Scrittore: Frank Leone</span>
                        <button
                          onClick={() => setSelectedPost(BLOG_POSTS[0])}
                          className="flex items-center space-x-1 text-brand-pink hover:text-white font-bold"
                        >
                          <span>Leggi Tutto</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SEPARATE BLOG VIEWER SCREEN (IF POST IS SELECTED) */}
            {selectedPost ? (
              <div className="bg-brand-gray/90 rounded-2xl border border-white/10 overflow-hidden shadow-2xl p-6 sm:p-10 backdrop-blur-md">
                {/* Back button */}
                <button
                  onClick={() => setSelectedPost(null)}
                  className="mb-8 flex items-center space-x-2 text-[10px] font-bold text-slate-400 hover:text-white uppercase tracking-widest bg-black px-4 py-2 rounded border border-white/10 cursor-pointer -skew-x-12"
                >
                  <span>← Torna Alla Lista Blog</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8">
                    {/* Header post */}
                    <div className="flex flex-wrap gap-2 items-center text-xs font-mono mb-4 text-brand-pink font-bold">
                      <span className="bg-brand-pink/10 border border-brand-pink/30 px-2.5 py-1 rounded text-brand-pink uppercase text-[9px] tracking-widest font-bold">
                        {selectedPost.category}
                      </span>
                      <span>•</span>
                      <span>Pubblicato il {selectedPost.date}</span>
                      <span>•</span>
                      <span>Tempo di lettura: {selectedPost.readTime}</span>
                    </div>

                    <h1 className="text-3xl sm:text-4.5xl font-black text-white font-space mb-6 leading-tight">
                      {selectedPost.title}
                    </h1>

                    <div className="mb-8 rounded-xl overflow-hidden max-h-[420px] border border-white/10 shadow-lg">
                      <img
                        src={selectedPost.imageUrl}
                        alt={selectedPost.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Rich description and Article text */}
                    <p className="text-base italic text-slate-300 bg-black/60 p-5 rounded-xl border-l-4 border-brand-cyan mb-6 leading-relaxed">
                      "{selectedPost.summary}"
                    </p>

                    <div className="text-slate-300 space-y-6 text-base leading-relaxed whitespace-pre-line border-b border-white/10 pb-8">
                      {selectedPost.content}
                    </div>

                    {/* SEO Tag List */}
                    <div className="mt-6">
                      <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">Google SEO Keywords incluse nell'articolo:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedPost.seoKeywords.map((kw) => (
                           <span key={kw} className="bg-black border border-white/10 text-brand-cyan px-2.5 py-1 rounded text-xs font-mono">
                            #{kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Share & Copy Action Box */}
                    <div className="mt-8 bg-black/60 border border-white/10 rounded-xl p-5 sm:p-6">
                      <h4 className="text-xs font-black text-white uppercase font-mono tracking-widest mb-3 flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-emerald-400" /> BOX DELLA VIRALITÀ - COPIA IL POST PRONTO PER TIKTOK/REDDIT
                      </h4>
                      <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                        Vuoi fare traffico organico sui tuoi canali o forum? Ecco il testo con ashtag creato ad hoc basandoci sui trend virali di Rockstar:
                      </p>
                      <div className="bg-[#0b0b0b] border border-white/10 p-4 rounded-lg text-slate-300 font-mono text-xs select-all relative">
                        {selectedPost.viralHook}
                        <button
                          onClick={() => copyToClipboard(selectedPost.viralHook, 'Post Social Virale')}
                          className="mt-4 block text-center w-full px-4 py-2.5 bg-brand-cyan text-black hover:bg-white text-[10px] font-black rounded cursor-pointer transition uppercase tracking-widest -skew-x-6"
                        >
                          Copia Hook Social Virale
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* SIDEBAR FOR SELECTED POST - Affiliate recommendations */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="bg-black/60 p-6 rounded-xl border border-white/10">
                      <h3 className="text-xs font-mono uppercase text-brand-cyan mb-4 font-bold tracking-widest flex items-center gap-1.5">
                        <ShoppingBag className="w-4 h-4" /> COMPRA SE CORRELATO
                      </h3>
                      <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                        Ottimizziamo le commissioni! Ecco il prodotto consigliato per chi ha letto questo articolo su GTA 6:
                      </p>

                      <div className="bg-brand-gray rounded-xl p-4 border border-white/10">
                        {/* Select appropriate product based on article category */}
                        {selectedPost.category === 'Guide' ? (
                          <>
                            <img
                              src={gamingSetupImg}
                              alt="Gaming setup specs"
                              referrerPolicy="no-referrer"
                              className="rounded-lg mb-3.5 w-full h-32 object-cover"
                            />
                            <h4 className="text-xs font-bold text-white uppercase mb-1">Astro A50 Gen 5 Premium Headset</h4>
                            <div className="text-lg font-black text-brand-pink">289,00€ <span className="text-xs line-through text-slate-500 font-normal">329,00€</span></div>
                          </>
                        ) : selectedPost.category === 'Analysis' ? (
                          <>
                            <img
                              src={gamingSetupImg}
                              alt="PlayStation 5 setup mockup"
                              referrerPolicy="no-referrer"
                              className="rounded-lg mb-3.5 w-full h-32 object-cover"
                            />
                            <h4 className="text-xs font-bold text-white uppercase mb-1">Sony PlayStation® 5 Pro Edition</h4>
                            <div className="text-lg font-black text-brand-pink">759,00€ <span className="text-xs line-through text-slate-500 font-normal">799,99€</span></div>
                          </>
                        ) : (
                          <>
                            <img
                              src={bannerImg}
                              alt="GTA 6 Preorder Banner"
                              referrerPolicy="no-referrer"
                              className="rounded-lg mb-3.5 w-full h-32 object-cover"
                            />
                            <h4 className="text-xs font-bold text-white uppercase mb-1">Grand Theft Auto VI preordinazione</h4>
                            <div className="text-lg font-black text-brand-pink">69,90€ <span className="text-xs line-through text-slate-500 font-normal">79,99€</span></div>
                          </>
                        )}

                        <div className="mt-3.5 text-[9px] font-mono text-brand-cyan uppercase tracking-wider font-bold">OFFERTA DEL PORTALE - CODICE RISCOSSO</div>
                        <div className="font-mono text-center bg-black font-bold border border-white/5 text-yellow-400 py-2 my-2.5 rounded text-xs select-all">
                          COUPON: VICEVI
                        </div>

                        <button
                          onClick={() => setActiveTab('affiliazioni')}
                          className="w-full text-center block bg-brand-pink hover:bg-brand-pink/90 text-white text-xs font-bold py-2.5 rounded transition uppercase tracking-wider"
                        >
                          Acquista su Amazon Con Sconto
                        </button>
                      </div>
                    </div>

                    {/* Live Fan Theories mini summary widget */}
                    <div className="bg-black/60 p-6 rounded-xl border border-white/10">
                      <h3 className="text-xs font-mono uppercase text-white mb-4 font-bold tracking-widest flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-brand-cyan animate-pulse" /> DISCUSSIONI RECENTI
                      </h3>
                      <div className="space-y-3">
                        {theories.slice(0, 2).map((theory) => (
                          <div key={theory.id} className="text-xs hover:bg-white/5 p-2 rounded cursor-pointer transition border border-transparent hover:border-white/5"
                               onClick={() => setActiveTab('community')}>
                            <div className="text-brand-pink font-bold uppercase text-[8px] tracking-widest mb-1">{theory.faction}</div>
                            <div className="font-bold text-white leading-normal">{theory.title}</div>
                            <div className="text-slate-500 text-[10px] mt-1.5">{theory.timestamp} • Upvotes: {theory.upvotes}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* BLOG POST LIST WITH DETAILED SEARCH & CATEGORY FILTERS */
              <div>
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-md">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Category selectors */}
                    <div className="flex flex-wrap gap-1.5">
                      {['All', 'Official', 'Leak', 'Analysis', 'Rumours', 'Guide'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3.5 py-1.5 rounded text-[10px] uppercase font-mono tracking-widest transition-all ${
                            selectedCategory === cat
                              ? 'bg-brand-pink text-white font-bold -skew-x-12'
                              : 'bg-black text-slate-400 hover:bg-white/5 hover:text-slate-200'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Search Field */}
                    <div className="relative w-full md:w-72">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cerca leak, notizie o mappe..."
                        className="w-full bg-black border border-white/10 rounded px-4 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-cyan font-mono"
                      />
                      <Search className="absolute right-3.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
                    </div>
                  </div>
                </div>

                {filteredPosts.length === 0 ? (
                  <div className="text-center py-16 bg-brand-gray/50 rounded-xl border border-white/10">
                    <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">Nessun articolo trovato per questa ricerca. Riprova con un'altra parola chiave!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.map((post) => {
                      const isLiked = blogLikes[post.id];
                      return (
                        <article
                          key={post.id}
                          className="bg-brand-gray border border-white/10 rounded-xl overflow-hidden hover:border-brand-pink/45 hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between shadow-lg"
                        >
                          <div>
                            <div className="h-48 relative border-b border-white/5">
                              <img
                                src={post.imageUrl}
                                alt={post.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                              <span className="absolute top-3 left-3 bg-black/90 border border-brand-cyan/40 text-brand-cyan font-mono text-[9px] font-bold py-0.5 px-2 rounded uppercase tracking-wider -skew-x-12">
                                {post.category}
                              </span>
                            </div>

                            <div className="p-5">
                              <div className="text-[10px] font-mono text-slate-500 mb-2 flex items-center justify-between">
                                <span>{post.date}</span>
                                <span>{post.readTime}</span>
                              </div>
                              <h3
                                onClick={() => setSelectedPost(post)}
                                className="text-lg font-black text-white hover:text-brand-pink transition font-space leading-tight cursor-pointer limit-text mb-3"
                              >
                                {post.title}
                              </h3>
                              <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                                {post.summary}
                              </p>
                            </div>
                          </div>

                          <div className="p-5 border-t border-white/5 bg-black/40 flex items-center justify-between">
                            <button
                              onClick={() => handleLikePost(post.id)}
                              className={`flex items-center space-x-1.5 text-xs transition duration-200 cursor-pointer ${
                                isLiked ? 'text-brand-pink' : 'text-slate-400 hover:text-brand-pink'
                              }`}
                            >
                              <Heart className={`w-4 h-4 ${isLiked ? 'fill-brand-pink text-brand-pink animate-pulse' : ''}`} />
                              <span className="font-mono text-[11px] uppercase tracking-wider">{post.likes} Likes</span>
                            </button>

                            <button
                              onClick={() => setSelectedPost(post)}
                              className="text-xs font-bold text-brand-cyan hover:text-white flex items-center space-x-1"
                            >
                              <span>Leggi</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

         {/* ==================== TAB 2: SHOPPING & AFFILIAZIONI ==================== */}
        {activeTab === 'affiliazioni' && (
          <div>
            {/* HERO INTRODUCTION DESIGNED FOR CTR (CLICK THROUGH RATE) */}
            <div className="relative mb-12 rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-gradient-to-r from-brand-gray to-[#161224] p-6 sm:p-10">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-8">
                  <span className="bg-brand-pink/10 border border-brand-pink/30 text-brand-pink font-mono text-[9px] font-bold py-1 px-3 rounded uppercase tracking-widest -skew-x-12">
                    GUIDE ALL'ACQUISTO DAY ONE E CONSOLE PREFERITE
                  </span>
                  <h2 className="text-3xl sm:text-4.5xl font-black text-white font-space mt-4 leading-tight">
                    Prepara il Tuo Setup per <span className="text-brand-cyan neon-glow-cyan uppercase">GTA VI</span>
                  </h2>
                  <p className="mt-3.5 text-slate-300 text-xs leading-relaxed max-w-2xl font-sans">
                    Grazie al nostro programma di sconti affiliati e codici promozionali esclusivi in partnership con i principali reseller italiani, puoi prenotare e ordinare il gioco ed espandere le tue console risparmiando fino al 15% sul prezzo di listino ufficiale.
                  </p>
                  
                  {/* Promo codes badge matrix */}
                  <div className="mt-6 flex flex-wrap gap-2.5">
                    <div className="bg-black border border-white/10 rounded p-2.5 flex items-center space-x-2">
                      <span className="text-slate-500 text-[10px] font-mono uppercase">Piattaforme:</span>
                      <strong className="text-brand-cyan text-xs font-mono font-bold tracking-widest">VICE5PRO</strong>
                    </div>
                    <div className="bg-black border border-white/10 rounded p-2.5 flex items-center space-x-2">
                      <span className="text-slate-500 text-[10px] font-mono uppercase">Pre-ordine:</span>
                      <strong className="text-brand-cyan text-xs font-mono font-bold tracking-widest">GTA6DAY1</strong>
                    </div>
                    <div className="bg-black border border-white/10 rounded p-2.5 flex items-center space-x-2">
                      <span className="text-slate-500 text-[10px] font-mono uppercase">Accessori:</span>
                      <strong className="text-brand-cyan text-xs font-mono font-bold tracking-widest">VCVOICE</strong>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-4 max-h-56">
                  <img
                    src={gamingSetupImg}
                    alt="GTA 6 themed ultimate gaming rig"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-xl shadow-lg border border-white/10"
                  />
                </div>
              </div>
            </div>

            {/* INTERACTIVE COMPOSABLE BUDGET CALCULATOR */}
            <div className="bg-brand-gray border border-white/10 rounded-2xl p-6 sm:p-8 mb-12 shadow-md relative overflow-hidden">
              <h3 className="text-lg font-black text-white font-space mb-2 flex items-center gap-2">
                <Settings className="w-5 h-5 text-brand-pink animate-spin" /> CONFIGURATORE DI BUDGET AFFILIATO
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Regola la barra in base ai tuoi risparmi attuali. Genereremo immediatamente il pacchetto di console e videogiochi consigliato con i migliori link di acquisto affiliati!
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex justify-between font-mono text-[10px] text-slate-500 uppercase">
                    <span>Budget Minimo (50€)</span>
                    <span className="text-brand-cyan font-bold text-xs bg-black px-2.5 py-1 rounded">Budget Selezionato: {userBudget}€</span>
                    <span>Budget Max (1200€)</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="1200"
                    step="50"
                    value={userBudget}
                    onChange={(e) => handleBudgetCalculate(Number(e.target.value))}
                    className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer accent-brand-cyan"
                  />
                  <div className="text-[9px] text-slate-500 italic uppercase font-mono">I prezzi contengono i sconti minimi storici registrati per hardware PS5 Pro e cuffie Dolby Atmos.</div>
                </div>

                <div className="bg-black/40 border border-white/10 rounded-xl p-5 text-center backdrop-blur-sm shadow-inner">
                  <div className="text-[9px] font-mono text-brand-pink uppercase tracking-widest font-bold">SETUP CONSIGLIATO</div>
                  <div className="text-xs font-semibold text-white mt-1.5 mb-3.5 leading-normal">{recommendedBundle}</div>
                  <button
                    onClick={() => {
                      const element = document.getElementById('affiliate-product-grid');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-2 bg-brand-pink hover:bg-brand-pink/90 text-white text-[10px] uppercase tracking-widest font-black rounded transition -skew-x-12"
                  >
                    Vedi Prodotti Consigliati ↓
                  </button>
                </div>
              </div>
            </div>

            {/* PRODUCT GRID - Optimized for CTR */}
            <div id="affiliate-product-grid" className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {AFFILIATE_PRODUCTS.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-brand-gray border border-white/10 rounded-2xl overflow-hidden hover:border-brand-cyan/40 transition-all duration-300 flex flex-col justify-between p-5 sm:p-6 shadow-lg"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-black border border-white/10 text-yellow-400 font-mono text-[9px] font-bold px-2.5 py-1 rounded uppercase tracking-wider -skew-x-12">
                        {prod.category}
                      </span>
                      <div className="flex items-center space-x-1 text-xs text-yellow-500 font-bold">
                        <span>★</span>
                        <span>{prod.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    <h4 className="text-lg font-black uppercase font-space text-white mb-2 leading-snug">
                      {prod.name}
                    </h4>

                    <p className="text-slate-400 text-xs mb-4 leading-relaxed">
                      {prod.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 mb-4">
                      {/* Specs */}
                      <div className="bg-black/50 rounded-xl p-3 border border-white/5">
                        <div className="text-[9px] font-mono text-brand-cyan uppercase tracking-widest mb-1.5 font-bold">Caratteristiche</div>
                        <ul className="space-y-1 text-[10px] text-slate-400 list-disc list-inside leading-relaxed">
                          {prod.specs.map((item, idx) => <li key={idx} className="limit-text">{item}</li>)}
                        </ul>
                      </div>
                      {/* Pros */}
                      <div className="bg-black/50 rounded-xl p-3 border border-white/5">
                        <div className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest mb-1.5 font-bold">Vantaggi Utili</div>
                        <ul className="space-y-1 text-[10px] text-slate-400 list-disc list-inside leading-relaxed">
                          {prod.pros.map((item, idx) => <li key={idx} className="text-emerald-400 limit-text">{item}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-4 mt-2 flex flex-col gap-3 justify-between">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[9px] text-slate-500 uppercase font-mono">Prezzo Listino / Scontato su {prod.buyOn}</div>
                        <div className="text-2xl font-black text-brand-cyan flex items-baseline gap-1.5">
                          {prod.discountPrice ? `${prod.discountPrice.toFixed(2)}€` : `${prod.price.toFixed(2)}€`}
                          {prod.discountPrice && (
                            <span className="text-xs line-through text-slate-600 font-normal">
                              {prod.price.toFixed(2)}€
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Promo tag widget */}
                      <div className="bg-black border border-white/10 rounded px-2.5 py-1 text-center">
                        <div className="text-[8px] font-mono text-slate-600 uppercase font-bold tracking-wider">PROMO CODE</div>
                        <div className="text-xs font-mono font-bold text-yellow-500 select-all tracking-widest">{prod.promoCode}</div>
                      </div>
                    </div>

                    <a
                      href={prod.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center block bg-gradient-to-r from-brand-pink to-[#b80041] hover:from-brand-pink/90 hover:to-[#b80041] text-white text-xs font-black py-3 rounded uppercase tracking-wider -skew-x-6"
                    >
                      Prenota e Acquista su {prod.buyOn} Con Sconto →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: EVENTI & COUNTDOWN ==================== */}
        {activeTab === 'eventi' && (
          <div>
            {/* HERO MOTIVATION ABOUT EVENTS */}
            <div className="relative mb-12 rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-gradient-to-r from-brand-gray to-black p-6 sm:p-10">
              <h2 className="text-3xl font-black text-white font-space leading-tight mb-2">
                Eventi di Lancio & Raduni a Tema <span className="text-brand-pink">GTA VI</span>
              </h2>
              <p className="text-slate-300 text-xs max-w-3xl leading-relaxed font-sans">
                Non c’è sensazione migliore dell’unire le forze con altri gamer che come te hanno passato l’ultimo decennio a speculare e re-immaginare Vice City. Unisciti ad un raduno nelle principali città italiane o prenota l’accesso alle dirette Twitch e Discord.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
              {/* CURRENT EVENTS LIST */}
              <div className="lg:col-span-8 space-y-6">
                <h3 className="text-sm font-black text-white uppercase font-space tracking-widest border-l-4 border-brand-pink pl-3">
                  Eventi Attivi nella Community ({eventsList.length})
                </h3>

                {eventsList.map((evt) => (
                  <div
                    key={evt.id}
                    className="bg-brand-gray border border-white/10 rounded-xl p-5 sm:p-6 hover:border-brand-pink/30 transition-all duration-300"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 bg-black border border-white/5 text-brand-pink font-mono text-[9px] font-bold rounded uppercase -skew-x-12 tracking-widest">
                        PIATTAFORMA: {evt.platform}
                      </span>
                      <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{evt.date} • {evt.time}</span>
                      </div>
                    </div>

                    <h4 className="text-lg font-black text-white hover:text-brand-pink transition mb-2">
                      {evt.title}
                    </h4>

                    <p className="text-slate-400 text-xs leading-relaxed mb-4">
                      {evt.description}
                    </p>

                    <div className="border-t border-white/5 pt-4 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-slate-500 font-mono uppercase">Organizzatore</span>
                        <span className="text-xs text-slate-200 font-bold">{evt.organizer}</span>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-xs font-bold text-brand-cyan font-mono">{evt.attendeesCount} Partecipanti</div>
                          <div className="text-[9px] text-slate-500 uppercase">Pronti per il Colpo</div>
                        </div>

                        {evt.location.startsWith('http') ? (
                          <a
                            href={evt.location}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-black hover:bg-white/5 text-white border border-white/10 px-3.5 py-2 rounded text-[10px] font-mono uppercase tracking-wider -skew-x-12"
                          >
                            <span>Link Portale</span>
                            <ExternalLink className="w-3.5 h-3.5 inline-block ml-1" />
                          </a>
                        ) : (
                          <button
                            onClick={() => copyToClipboard(evt.location, 'Indirizzo del Raduno')}
                            className="bg-black hover:bg-white/5 text-white border border-white/10 px-3.5 py-2 rounded text-[10px] font-mono uppercase tracking-wider -skew-x-12"
                          >
                            <span>Copia Luogo</span>
                            <Copy className="w-3.5 h-3.5 inline-block ml-1" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CREATE NEW EVENT CONTAINER */}
              <div className="lg:col-span-4 bg-brand-gray border border-white/10 rounded-xl p-6 shadow-md relative">
                <h3 className="text-xs font-black text-white font-space mb-2 flex items-center gap-1.5 uppercase tracking-widest">
                  <PlusCircle className="w-4 h-4 text-brand-pink" /> Organizza un Evento
                </h3>
                <p className="text-[11px] text-slate-400 mb-6">
                  Sei un capocrew o hai un canale discord che parla di GTA 6? Crea un raduno live o streaming in pochi secondi per convogliare traffico!
                </p>

                {eventSuccessMsg && (
                  <div className="mb-4 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs p-3.5 rounded font-mono">
                    ✓ Evento pubblicato con successo! Verrà indicizzato tra i raduni del portale.
                  </div>
                )}

                <form onSubmit={handleCreateEvent} className="space-y-4">
                  <div>
                    <label className="block text-slate-500 text-[10px] font-mono uppercase mb-1">Titolo dell'Evento *</label>
                    <input
                      type="text"
                      required
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      placeholder="es. Festa di Lancio PlayStation Roma"
                      className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-slate-100 placeholder-slate-700 focus:outline-none focus:border-brand-pink font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[10px] font-mono uppercase mb-1">Organizzatore / Crew *</label>
                    <input
                      type="text"
                      required
                      value={newEventOrganizer}
                      onChange={(e) => setNewEventOrganizer(e.target.value)}
                      placeholder="es. Crew dei Raider Laziali"
                      className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-slate-100 placeholder-slate-700 focus:outline-none focus:border-brand-pink font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 text-[10px] font-mono uppercase mb-1">Data *</label>
                      <input
                        type="date"
                        required
                        value={newEventDate}
                        onChange={(e) => setNewEventDate(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded px-2 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-pink font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 text-[10px] font-mono uppercase mb-1">Orario *</label>
                      <input
                        type="time"
                        required
                        value={newEventTime}
                        onChange={(e) => setNewEventTime(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded px-2 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-pink font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[10px] font-mono uppercase mb-1">Canale / Indirizzo / Link *</label>
                    <input
                      type="text"
                      required
                      value={newEventLocation}
                      onChange={(e) => setNewEventLocation(e.target.value)}
                      placeholder="Indirizzo reale o link Discord/Twitch"
                      className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-slate-100 placeholder-slate-700 focus:outline-none focus:border-brand-pink font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[10px] font-mono uppercase mb-1">Piattaforma Principale</label>
                    <select
                      value={newEventPlatform}
                      onChange={(e) => setNewEventPlatform(e.target.value as any)}
                      className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-pink font-mono"
                    >
                      <option value="Discord">Discord</option>
                      <option value="Twitch">Twitch</option>
                      <option value="Real Life">Nel Mondo Reale (Raduno)</option>
                      <option value="In-Game">In-Game (GTA Online)</option>
                      <option value="YouTube">YouTube Live</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[10px] font-mono uppercase mb-1">Dettagli & Programma</label>
                    <textarea
                      value={newEventDesc}
                      onChange={(e) => setNewEventDesc(e.target.value)}
                      rows={3}
                      placeholder="Spiega l'evento per attirare spettatori..."
                      className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-slate-100 placeholder-slate-700 focus:outline-none focus:border-brand-pink font-mono"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white text-[11px] font-black py-3 rounded transition uppercase tracking-widest -skew-x-12"
                  >
                    Pubblica Raduno Ora
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}


        {/* ==================== TAB 4: CREW & TEORIE ==================== */}
        {activeTab === 'community' && (
          <div>
            <div className="relative mb-12 rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-gradient-to-r from-brand-gray to-black p-6 sm:p-10">
              <h2 className="text-3xl font-black text-white font-space leading-tight mb-2">
                Forum delle <span className="text-brand-pink">Teorie Criminali</span> & Speculazioni Leonida
              </h2>
              <p className="text-slate-300 text-xs max-w-3xl leading-relaxed font-sans">
                Chi comanda davvero a Vice City? Lucia tradirà Jason o sono vittime del famigerato "Sindacato"? Scegli la tua fazione ed esprimi la tua opinione. I post più upvotati vengono discussi nelle puntate podcast dei nostri affiliati.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
              {/* CURRENT THEORIES LIST */}
              <div className="lg:col-span-8 space-y-4">
                <h3 className="text-sm font-black text-white uppercase font-space tracking-widest border-l-4 border-brand-pink pl-3 mb-6">
                  Le Teorie Più Hot della Settimana
                </h3>

                {theories.map((theory) => {
                  const hasVoted = votedTheories[theory.id];
                  return (
                    <div
                      key={theory.id}
                      className="bg-brand-gray border border-white/10 rounded-xl p-5 hover:border-brand-pink/20 transition-all duration-300"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 border-b border-white/5 pb-2">
                        <div className="flex items-center space-x-2">
                          <span className="w-5 h-5 rounded-full bg-black flex items-center justify-center border border-white/15">
                            <User className="w-3.5 h-3.5 text-brand-pink" />
                          </span>
                          <span className="text-xs font-semibold text-white">{theory.username}</span>
                          <span className="text-[10px] font-mono text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/25 px-2 py-0.5 rounded uppercase">
                            frazione: {theory.faction}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">{theory.timestamp}</span>
                      </div>

                      <h4 className="text-base font-black text-slate-100 mb-2">
                        {theory.title}
                      </h4>

                      <p className="text-slate-300 text-xs leading-relaxed mb-4 font-sans">
                        {theory.content}
                      </p>

                      <div className="flex items-center justify-end space-x-4 border-t border-white/5 pt-3">
                        <button
                          onClick={() => handleUpvoteTheory(theory.id)}
                          className={`flex items-center space-x-1.5 text-xs transition duration-200 cursor-pointer ${
                            hasVoted ? 'text-brand-pink' : 'text-slate-400 hover:text-brand-pink'
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4 text-brand-pink" />
                          <span className="font-mono text-[11px] uppercase tracking-wider">{theory.upvotes} Sostienilo</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* POST A NEW THEORY FORM CONTAINER */}
              <div className="lg:col-span-4 bg-brand-gray border border-white/10 rounded-xl p-6 shadow-md relative">
                <h3 className="text-xs font-black text-white font-space mb-2 flex items-center gap-1.5 uppercase tracking-widest">
                  <MessageSquare className="w-4 h-4 text-brand-pink" /> Condividi una Teoria
                </h3>
                <p className="text-[11px] text-slate-400 mb-6 font-sans">
                  Pensi di aver scovato un dettaglio segreto nel Trailer di Grand Theft Auto VI? Scrivilo qui per ricevere upvotes immediati dalla crew!
                </p>

                <form onSubmit={handleCreateTheory} className="space-y-4">
                  <div>
                    <label className="block text-slate-500 text-[10px] font-mono uppercase mb-1">Nome Utente Criminologo</label>
                    <input
                      type="text"
                      value={theoryUsername}
                      onChange={(e) => setTheoryUsername(e.target.value)}
                      placeholder="es. TommyFidelity"
                      className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-slate-100 placeholder-slate-700 focus:outline-none focus:border-brand-pink font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[10px] font-mono uppercase mb-1">Scegli la Tua Fazione</label>
                    <select
                      value={theoryFaction}
                      onChange={(e) => setTheoryFaction(e.target.value as any)}
                      className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-pink font-mono"
                    >
                      <option value="Lucia Loyalist">Sostenitori di Lucia (Lucia Loyalists)</option>
                      <option value="Jason Believer">Fiducia Cieca in Jason (Jason Believers)</option>
                      <option value="Vice City Syndicate">Cartello di Vice (VC Syndicate)</option>
                      <option value="Leonida Police">Forze di Polizia Leonida</option>
                      <option value="No-Affiliation">Criminologo Esterno</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[10px] font-mono uppercase mb-1">Titolo dell'Ipotesi *</label>
                    <input
                      type="text"
                      required
                      value={theoryTitle}
                      onChange={(e) => setTheoryTitle(e.target.value)}
                      placeholder="es. Rapina di Diner speculazione"
                      className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-slate-100 placeholder-slate-700 focus:outline-none focus:border-brand-pink font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[10px] font-mono uppercase mb-1">Spiegazione della Teoria *</label>
                    <textarea
                      required
                      value={theoryContent}
                      onChange={(e) => setTheoryContent(e.target.value)}
                      rows={4}
                      placeholder="Fornisci prove fotografiche o temporali del trailer..."
                      className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-slate-100 placeholder-slate-700 focus:outline-none focus:border-brand-pink font-mono"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white text-[11px] font-black py-3 rounded transition uppercase tracking-widest -skew-x-12"
                  >
                    Pubblica Nel Forum →
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}


        {/* ==================== TAB 5: PORTALE VIRALITÀ E REAL CMS & CRM ==================== */}
        {activeTab === 'seo' && (
          <div className="space-y-12">
            {/* INTRODUCTORY DESIGN */}
            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-gradient-to-r from-brand-gray to-black p-6 sm:p-8 shadow-xl animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <span className="bg-brand-pink/10 border border-brand-pink/30 text-brand-pink text-[9px] font-mono font-bold px-2.5 py-1 rounded uppercase tracking-widest">
                    CONSOLE AMMINISTRATORE INTERNA
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white font-space leading-tight mt-2.5 uppercase">
                    Hub Gestionale <span className="text-brand-cyan">CMS & CRM Real-Time</span>
                  </h2>
                  <p className="text-slate-400 text-xs max-w-2xl leading-relaxed mt-2 font-sans font-medium">
                    Questo è il tuo pannello operativo. Ogni modifica effettuata agli articoli, alle discussioni dei fan ed alle impostazioni generali modifica la base dati in tempo reale e si riflette istantaneamente sulle sezioni pubbliche.
                  </p>
                </div>
                <div className="flex items-center space-x-2 bg-black/40 border border-white/10 rounded-lg p-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <div className="text-xs font-mono text-slate-300">MODALITÀ SCRITTURA: <strong className="text-brand-cyan uppercase">ATTIVA</strong></div>
                </div>
              </div>

              {/* CMS & CRM SUB NAVIGATION METRICS */}
              <div className="flex flex-wrap gap-2 mt-8 border-t border-white/15 pt-6">
                <button
                  onClick={() => setAdminSubTab('articles')}
                  className={`px-4 py-2.5 rounded-lg text-xs font-black uppercase font-space tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                    adminSubTab === 'articles'
                      ? 'bg-gradient-to-r from-brand-pink to-fuchsia-600 text-white shadow-lg'
                      : 'bg-black/50 border border-white/15 text-slate-400 hover:text-white hover:bg-black/80'
                  }`}
                >
                  <Newspaper className="w-4 h-4" /> Gestisci Articoli (CMS)
                </button>
                <button
                  onClick={() => setAdminSubTab('crm')}
                  className={`px-4 py-2.5 rounded-lg text-xs font-black uppercase font-space tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                    adminSubTab === 'crm'
                      ? 'bg-gradient-to-r from-brand-cyan to-indigo-600 text-black shadow-lg'
                      : 'bg-black/50 border border-white/15 text-slate-400 hover:text-white hover:bg-black/80'
                  }`}
                >
                  <Users className="w-4 h-4" /> CRM Newsletter ({newsletterSubscribers.length} Leads)
                </button>
                <button
                  onClick={() => setAdminSubTab('forum')}
                  className={`px-4 py-2.5 rounded-lg text-xs font-black uppercase font-space tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                    adminSubTab === 'forum'
                      ? 'bg-gradient-to-r from-brand-pink to-brand-cyan text-white shadow-lg'
                      : 'bg-black/50 border border-white/15 text-slate-400 hover:text-white hover:bg-black/80'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" /> Modera Forum ({theories.length} Post)
                </button>
                <button
                  onClick={() => setAdminSubTab('settings')}
                  className={`px-4 py-2.5 rounded-lg text-xs font-black uppercase font-space tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                    adminSubTab === 'settings'
                      ? 'bg-white text-black shadow-lg font-bold'
                      : 'bg-black/50 border border-white/15 text-slate-400 hover:text-white hover:bg-black/80'
                  }`}
                >
                  <Settings className="w-4 h-4" /> Parametri Portale
                </button>
              </div>
            </div>

            {/* SUBTAB CONTENT 1: BLOG CMS (CRUD) */}
            {adminSubTab === 'articles' && (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                
                {/* SAVING OR INSERTION FORM DRAWER */}
                <div className="xl:col-span-5 bg-brand-gray border border-white/10 rounded-xl p-6 shadow-md">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-5">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest font-space flex items-center gap-1.5">
                      <PlusCircle className="w-4 h-4 text-brand-pink" /> 
                      {editingPostId ? 'Modifica Articolo' : 'Nuovo Articolo'}
                    </h3>
                    {editingPostId && (
                      <button
                        type="button"
                        onClick={resetCmsForm}
                        className="text-[10px] text-slate-400 hover:text-brand-pink uppercase tracking-widest font-mono cursor-pointer"
                      >
                        Annulla Edit
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSavePost} className="space-y-4">
                    <div>
                      <label className="block text-slate-500 text-[10px] font-mono uppercase mb-1">Titolo dell'Articolo *</label>
                      <input
                        type="text"
                        required
                        value={cmsTitle}
                        onChange={(e) => setCmsTitle(e.target.value)}
                        placeholder="La Leonida State è pazzesca..."
                        className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-pink font-sans"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-slate-500 text-[10px] font-mono uppercase mb-1">Categoria</label>
                        <select
                          value={cmsCategory}
                          onChange={(e) => setCmsCategory(e.target.value as any)}
                          className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-pink font-mono"
                        >
                          <option value="Official">Official</option>
                          <option value="Leak">Leak</option>
                          <option value="Analysis">Analysis</option>
                          <option value="Rumours">Rumours</option>
                          <option value="Guide">Guide</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-500 text-[10px] font-mono uppercase mb-1">Tempo di Lettura</label>
                        <input
                          type="text"
                          value={cmsReadTime}
                          onChange={(e) => setCmsReadTime(e.target.value)}
                          placeholder="es. 5 min lettura"
                          className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-pink font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-slate-500 text-[10px] font-mono uppercase mb-1">Autore</label>
                        <input
                          type="text"
                          value={cmsAuthor}
                          onChange={(e) => setCmsAuthor(e.target.value)}
                          placeholder="es. Frank Leone"
                          className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-pink font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 text-[10px] font-mono uppercase mb-1">Data Pubblicazione</label>
                        <input
                          type="text"
                          value={cmsDate}
                          onChange={(e) => setCmsDate(e.target.value)}
                          placeholder="es. 4 Giugno 2026"
                          className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-pink font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-500 text-[10px] font-mono uppercase mb-1">URL Immagine di Copertina</label>
                      <input
                        type="text"
                        value={cmsImageUrl}
                        onChange={(e) => setCmsImageUrl(e.target.value)}
                        placeholder="Insierisci link immagine o usa /src/assets/..."
                        className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-pink font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 text-[10px] font-mono uppercase mb-1">Riassunto Breve (Summary) *</label>
                      <textarea
                        required
                        value={cmsSummary}
                        onChange={(e) => setCmsSummary(e.target.value)}
                        rows={2}
                        placeholder="Fornisci una sinossi seducente per il feed principale..."
                        className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-pink font-sans"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-slate-500 text-[10px] font-mono uppercase mb-1">Contenuto dell'Articolo *</label>
                      <textarea
                        required
                        value={cmsContent}
                        onChange={(e) => setCmsContent(e.target.value)}
                        rows={7}
                        placeholder="Scrivi l'intero articolo o incolla i dettagli..."
                        className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-pink font-sans"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-slate-500 text-[10px] font-mono uppercase mb-1">SEO Keywords (Separate da virgola)</label>
                      <input
                        type="text"
                        value={cmsKeywords}
                        onChange={(e) => setCmsKeywords(e.target.value)}
                        placeholder="Mappa GTA 6, Leonida State, Leak Vice City"
                        className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-pink font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 text-[10px] font-mono uppercase mb-1">Testo Virale per Social (TikTok/Reddit Hook)</label>
                      <textarea
                        value={cmsViralHook}
                        onChange={(e) => setCmsViralHook(e.target.value)}
                        rows={2}
                        placeholder="🚨 SVELATO IL LATO PIÙ COMPLESSO DELLA MAPPA! #GTA6"
                        className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-pink font-mono"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white text-[11px] font-black py-3 rounded transition uppercase tracking-widest -skew-x-12 cursor-pointer"
                    >
                      {editingPostId ? 'Salva e Applica Modifica' : 'Pubblica Articolo Ora'}
                    </button>
                  </form>
                </div>

                {/* CURRENT PUBLISHED POSTS DIRECT PROTOCOL LIST */}
                <div className="xl:col-span-7 bg-brand-gray border border-white/10 rounded-xl p-6 shadow-md">
                  <h3 className="text-sm font-black text-slate-100 uppercase font-space tracking-widest border-l-4 border-brand-cyan pl-3 mb-5">
                    Articoli Pubblicati nel Feed ({blogList.length})
                  </h3>

                  <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2">
                    {blogList.map((post) => (
                      <div
                        key={post.id}
                        className="bg-black/60 border border-white/5 p-4 rounded-xl flex items-start gap-4 hover:border-brand-pink/30 transition-all animate-fade-in"
                      >
                        <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-slate-900 border border-white/10">
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = bannerImg;
                            }}
                          />
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[8px] font-mono font-bold bg-brand-pink/10 border border-brand-pink/30 text-brand-pink px-1.5 py-0.5 rounded uppercase">
                              {post.category}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {post.date} • {post.author}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-white truncate">{post.title}</h4>
                          <p className="text-[11px] text-slate-400 font-sans line-clamp-1 mt-0.5">{post.summary}</p>
                          <div className="text-[10px] font-mono text-slate-500 mt-2">
                            Likes stimati: <strong className="text-slate-300 font-bold">{post.likes}</strong>
                          </div>
                        </div>

                        {/* CMS MANAGEMENT BUTTONS */}
                        <div className="flex flex-col gap-1.5 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              startEditPost(post);
                              window.scrollTo({ top: 350, behavior: 'smooth' });
                            }}
                            className="px-2.5 py-1 bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/20 hover:border-brand-cyan hover:bg-brand-cyan hover:text-black rounded text-[9px] font-mono uppercase tracking-wider font-bold transition cursor-pointer"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePost(post.id)}
                            className="px-2.5 py-1 bg-red-950/40 text-red-400 border border-red-500/20 hover:border-red-500 hover:bg-red-500 hover:text-white rounded text-[9px] font-mono uppercase tracking-wider font-bold transition cursor-pointer"
                          >
                            🗑 Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* MINI INFO TIPS */}
                  <div className="mt-8 bg-black/40 border border-white/5 p-4 rounded-xl text-center">
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                      Le modifiche apportate qui permangono nel browser tramite LocalStorage. Per ricaricare i dati di Rockstar originali pre-configurati, svuota la cache o esegui un reset.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB CONTENT 2: LEAD CRM (Captured Newsletter List) */}
            {adminSubTab === 'crm' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* MANUAL LEAD INSERTION */}
                <div className="lg:col-span-4 bg-brand-gray border border-white/10 rounded-xl p-6 shadow-md">
                  <h3 className="text-xs font-black text-white font-space mb-2 uppercase tracking-widest flex items-center gap-2">
                    <PlusCircle className="w-4 h-4 text-brand-cyan" /> Aggiungi Lead Manuale
                  </h3>
                  <p className="text-[11px] text-slate-400 mb-6">
                    Inserisci gli indirizzi email raccolti manualmente durante fiere, raduni sul territorio o canali Discord affiliati esterni.
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const targetMail = (e.target as any).mail.value;
                      if (targetMail) {
                        handleAddManualLead(targetMail);
                        (e.target as any).reset();
                      }
                    }}
                    className="space-y-3"
                  >
                    <div>
                      <label className="block text-slate-505 text-[10px] font-mono uppercase mb-1">Email del Lead *</label>
                      <input
                        type="email"
                        name="mail"
                        required
                        placeholder="gta_criminologo84@yahoo.com"
                        className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-cyan font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-brand-cyan text-black hover:bg-white text-[11px] font-black py-2.5 rounded transition uppercase tracking-widest -skew-x-12 cursor-pointer"
                    >
                      Aggiungi Lead nel CRM
                    </button>
                  </form>
                </div>

                {/* VISUAL TABLE OF LEADS COLLECTION */}
                <div className="lg:col-span-8 bg-brand-gray border border-white/10 rounded-xl p-6 shadow-md shadow-emerald-900/5">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-5">
                    <h3 className="text-sm font-black text-slate-100 uppercase font-space tracking-widest flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-brand-pink" /> Database Iscritti ({newsletterSubscribers.length})
                    </h3>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded uppercase font-bold text-center">
                      Stato: Sincronizzato Vercel CRM
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-500 text-[10px] uppercase">
                          <th className="pb-3 font-semibold">Stato Canale</th>
                          <th className="pb-3 font-semibold">Indirizzo Email</th>
                          <th className="pb-3 font-semibold">Origine</th>
                          <th className="pb-3 text-right font-semibold">Azione</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-slate-200">
                        {newsletterSubscribers.map((email, index) => (
                          <tr key={index} className="hover:bg-white/5 transition">
                            <td className="py-3">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block mr-2 animate-pulse"></span>
                              <span className="text-[10px] uppercase text-emerald-400">Verificato</span>
                            </td>
                            <td className="py-3 font-sans font-bold text-slate-100 select-all">{email}</td>
                            <td className="py-3 text-[10px] uppercase text-slate-400">Notizie & Promo DayOne</td>
                            <td className="py-3 text-right">
                              <button
                                type="button"
                                onClick={() => handleDeleteLead(email)}
                                className="text-red-400 hover:text-red-600 transition font-bold cursor-pointer"
                              >
                                Rimuovi
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {newsletterSubscribers.length === 0 && (
                    <div className="text-center py-10">
                      <p className="text-slate-500 font-mono text-xs">NESSUN ISCRITTO DISPONIBILE AL MOMENTO.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SUBTAB CONTENT 3: DISCUSSIONS MODERATING SYSTEM */}
            {adminSubTab === 'forum' && (
              <div className="bg-brand-gray border border-white/10 rounded-xl p-6 shadow-md">
                <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                  <h3 className="text-sm font-black text-white uppercase font-space tracking-widest flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-brand-pink" /> Modera Discussioni & Teorie degli Utenti ({theories.length})
                  </h3>
                  <p className="text-[11px] text-slate-500">I post cancellati non saranno visualizzati nel Forum pubblico.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {theories.map((theory) => (
                    <div
                      key={theory.id}
                      className="bg-black/60 border border-white/5 p-5 rounded-xl hover:border-brand-pink/20 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-white/5">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold text-xs font-mono">{theory.username}</span>
                            <span className="text-[10px] font-mono text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/25 px-2 py-0.5 rounded uppercase">
                              {theory.faction}
                            </span>
                          </div>
                          <span className="text-[9px] text-slate-500 font-mono">{theory.timestamp}</span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-200 mb-1.5">{theory.title}</h4>
                        <p className="text-xs text-slate-405 leading-relaxed font-sans line-clamp-3 mb-4">{theory.content}</p>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-2">
                        <span className="text-[10px] font-mono text-slate-500 font-bold">Upvotes: {theory.upvotes}</span>
                        <div className="flex gap-2">
                          <span className="px-2 py-0.5 bg-emerald-900/40 text-emerald-400 lg:inline-block hidden border border-emerald-500/20 text-[9px] font-mono uppercase font-bold rounded">
                            ✓ Approvato
                          </span>
                          <button
                            type="button"
                            onClick={() => handleModerateTheory(theory.id)}
                            className="bg-brand-pink/15 text-brand-pink hover:bg-brand-pink hover:text-white border border-brand-pink/30 px-3 py-1 rounded text-xs transition duration-200 cursor-pointer font-mono font-bold"
                          >
                            CENSURA & CANCELLA
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {theories.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-slate-500 font-mono text-sm leading-relaxed">NESSUNA DISCUSSIONE DA MODERARE. TUTTO PULITO!</p>
                  </div>
                )}
              </div>
            )}

            {/* SUBTAB CONTENT 4: PARAMETERS SETTINGS */}
            {adminSubTab === 'settings' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* CORE SETTINGS FORM */}
                <div className="bg-brand-gray border border-white/10 rounded-xl p-6 shadow-md">
                  <h3 className="text-xs font-black text-white font-space mb-2 uppercase tracking-widest flex items-center gap-1.5">
                    <Settings className="w-4 h-4 text-brand-cyan animate-spin" style={{ animationDuration: '6s' }} /> Configuratore Variabili Portale
                  </h3>
                  <p className="text-[11px] text-slate-405 mb-6">
                    Queste impostazioni alterano le modalità e i comportamenti del portale, come il timer visualizzato in testa e il coupon d'acquisto per l'ecommerce affiliato.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-slate-500 text-[10px] font-mono uppercase mb-1">Target Countdown (Data Stimata Lancio GTA VI)</label>
                      <input
                        type="text"
                        value={targetCountdown}
                        onChange={(e) => setTargetCountdown(e.target.value)}
                        placeholder="es. 2027-10-25T00:00:00Z"
                        className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-brand-cyan focus:outline-none focus:border-brand-pink font-mono"
                      />
                      <span className="text-[9px] text-slate-500 font-mono mt-1 block">Rispettare il formato ISO-8601 (YYYY-MM-DDTHH:MM:SSZ). Ad esempio il 25 Ottobre 2027 è scritto così.</span>
                    </div>

                    <div>
                      <label className="block text-slate-500 text-[10px] font-mono uppercase mb-1">Codice Coupon Amazon / Affiliato</label>
                      <input
                        type="text"
                        value={activeCoupon}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\s+/g, '').toUpperCase();
                          setActiveCoupon(val);
                        }}
                        placeholder="es. VICEVI"
                        className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-brand-cyan focus:outline-none focus:border-brand-pink font-mono uppercase font-bold"
                      />
                      <span className="text-[9px] text-slate-500 font-mono mt-1 block">Incollando o cambiando questo codice sconto, si aggiornerà automaticamente nel box dell'header e della scheda acquisti.</span>
                    </div>

                    <div className="bg-black/60 border border-white/10 p-4 rounded-xl">
                      <div className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest mb-2 font-bold hover:scale-[1.01] transition">VERIFICA COLLEGAMENTI</div>
                      <p className="text-slate-400 font-sans text-xs">
                        Attualmente, cambiando il coupon, tutti i visitatori del portale leggeranno il coupon active <strong className="text-yellow-405 font-mono text-yellow-400">"{activeCoupon}"</strong>, idoneo a garantirgli sconti d'affiliazione.
                      </p>
                    </div>
                  </div>
                </div>

                {/* INFORMATION BLOCK FOR LAUNCHING A FANBASE */}
                <div className="bg-brand-gray border border-white/10 rounded-xl p-6 shadow-md text-slate-300 space-y-4">
                  <h3 className="text-xs font-black text-white font-space mb-2 uppercase tracking-widest flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-brand-pink" /> Linee Guida del Lancio per la tua Fan Base
                  </h3>
                  <p className="text-xs leading-relaxed font-sans font-medium">
                    Stai per lanciare questo sito per radunare migliaia di appassionati di GTA in Italia. Ecco il flusso di marketing organico pianificato:
                  </p>
                  <ol className="space-y-3.5 text-xs font-mono text-slate-400 uppercase">
                    <li className="flex items-start gap-1.5"><span className="text-brand-pink font-bold">1.</span> <span>Creare Articoli Clamorosi usando il nostro Tab CMS: svela leak sulla mappa o guide per PS5 Pro.</span></li>
                    <li className="flex items-start gap-1.5"><span className="text-brand-pink font-bold">2.</span> <span>Sfrutta il <strong>Generatore di Social Viral Hook</strong> per copiare post già strutturati con hashtag da incollare sotto i tuoi TikTok o Reddit.</span></li>
                    <li className="flex items-start gap-1.5"><span className="text-brand-pink font-bold">3.</span> <span>Indirizza i visitatori a inserire la mail nel footer: le email inserite cadranno istantaneamente in questo tab <strong>CRM Newsletter</strong> senza intermediari!</span></li>
                  </ol>
                  <p className="text-[10px] text-slate-500 font-sans italic leading-normal">
                    Questo sistema elimina i costosi gestori email durante i primi mesi di validazione dell'hype, permettendoti di lanciare in modo snello su Vercel.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* FOOTER - Designed cleanly as requested */}
      <footer className="bg-black border-t border-white/10 py-12 px-4 shadow-sm text-center relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <div className="text-lg font-black uppercase font-space bg-gradient-to-r from-brand-pink to-brand-cyan bg-clip-text text-transparent">
              VICECITY CHRONICLES
            </div>
            <p className="text-[10px] text-slate-500 mt-2 font-mono uppercase tracking-tight max-w-xl leading-normal">
              Questo sito è un portale amatoriale gestito da fan, appassionati e blogger d'affiliazione autorizzati. Non è approvato o collegato direttamente a Rockstar Games o Take-Two Interactive.
            </p>
          </div>

          <div className="flex space-x-4 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
            <span className="hover:text-brand-pink transition cursor-pointer" onClick={() => setActiveTab('notizie')}>Notizie</span>
            <span className="hover:text-brand-cyan transition cursor-pointer" onClick={() => setActiveTab('affiliazioni')}>Affiliazioni</span>
            <span className="hover:text-brand-pink transition cursor-pointer" onClick={() => setActiveTab('eventi')}>Raduni</span>
            <span className="hover:text-brand-cyan transition cursor-pointer" onClick={() => setActiveTab('community')}>Forum</span>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/5 text-center text-[9px] text-slate-600 font-mono uppercase tracking-widest">
          © 2026 ViceCity News Inc. | Progettato con dedizione e passione per l'universo Grand Theft Auto VI.
        </div>
      </footer>
      </>
      )}
    </div>
  );
}

// Minimal auxiliary component just for code compilation structure (JSON-LD label)
function CodeIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
