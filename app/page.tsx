'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles } from 'lucide-react';

export default function Home() {
  const [url, setUrl] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      const cleanUrl = url.replace(/^https?:\/\//, '').replace(/\/+$/, '');
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

      <form onSubmit={handleSubmit} className="w-full max-w-md">
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

      <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-muted-foreground text-sm">
        <div>
            <div className="font-semibold text-foreground text-lg mb-1">10M+</div>
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