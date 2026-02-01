'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, History, ArrowRight } from 'lucide-react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const saveSearch = (newUrl: string) => {
    const updated = [newUrl, ...recentSearches.filter(s => s !== newUrl)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches', JSON.stringify(updated));
  };

  const handleSubmit = (e: React.FormEvent | string) => {
    if (typeof e !== 'string') e.preventDefault();
    const targetUrl = typeof e === 'string' ? e : url;
    
    if (targetUrl) {
      const cleanUrl = targetUrl.replace(/^https?:\/\//, '').replace(/\/+$/, '');
      saveSearch(cleanUrl);
      router.push(`/dashboard?url=${encodeURIComponent(cleanUrl)}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 text-center px-4">
      <div className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center px-3 py-1 rounded-full border border-border bg-muted/50 text-muted-foreground text-sm font-medium mb-4">
          <Sparkles className="w-3 h-3 mr-2" />
          Web Analytics Simplified
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
          Analyze any website&apos;s traffic
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Instant access to real-time visits, global rank, and audience insights. 
          Clean, fast, and reliable.
        </p>
      </div>

      <div className="w-full max-w-md space-y-4">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative flex items-center bg-background rounded-xl border border-border shadow-sm focus-within:ring-2 focus-within:ring-ring transition-all">
            <Search className="w-5 h-5 text-muted-foreground ml-3 absolute left-0 pointer-events-none" />
            <input
              type="text"
              placeholder="example.com"
              className="w-full bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground pl-10 pr-28 py-3 rounded-xl"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 bg-primary hover:bg-primary/90 text-primary-foreground px-4 rounded-lg font-medium transition-colors text-sm"
            >
              Analyze
            </button>
          </div>
        </form>

        {recentSearches.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="flex items-center text-xs text-muted-foreground mr-1">
                <History className="w-3 h-3 mr-1" />
                Recent:
            </div>
            {recentSearches.map((s) => (
              <button
                key={s}
                onClick={() => handleSubmit(s)}
                className="group flex items-center px-3 py-1 bg-muted/50 hover:bg-muted border border-border rounded-full text-xs text-muted-foreground hover:text-foreground transition-all"
              >
                {s}
                <ArrowRight className="w-0 h-3 ml-0 group-hover:w-3 group-hover:ml-1 opacity-0 group-hover:opacity-100 transition-all" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-muted-foreground text-sm">
        <div>
            <div className="font-semibold text-foreground text-lg mb-1">1B+</div>
            Domains Tracked
        </div>
        <div>
            <div className="font-semibold text-foreground text-lg mb-1">99.9%</div>
            Data Accuracy
        </div>
        <div>
            <div className="font-semibold text-foreground text-lg mb-1">Real-time</div>
            Global Updates
        </div>
      </div>
    </div>
  );
}