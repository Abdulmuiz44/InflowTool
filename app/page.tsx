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
      // Basic clean up if user pastes full url, though backend handles it too
      const cleanUrl = url.replace(/^https?:\/\//, '').replace(/\/+$/, '');
      router.push(`/dashboard?url=${encodeURIComponent(cleanUrl)}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 text-center">
      <div className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium mb-4">
          <Sparkles className="w-3 h-3 mr-2" />
          Next-Gen Traffic Intelligence
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
          Analyze any website's <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            traffic flow
          </span>
        </h1>
        <p className="text-lg text-slate-400 max-w-xl mx-auto">
          Get instant access to real-time traffic data, global rankings, and engagement metrics. 
          Just enter a domain to start.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-md relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl opacity-30 group-hover:opacity-50 blur transition duration-200"></div>
        <div className="relative flex items-center bg-slate-900 rounded-xl p-2 border border-white/10">
          <Search className="w-5 h-5 text-slate-500 ml-3" />
          <input
            type="text"
            placeholder="example.com"
            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 px-4 py-2 outline-none"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Analyze
          </button>
        </div>
      </form>

      <div className="pt-12 grid grid-cols-3 gap-8 text-slate-500 text-sm">
        <div>
            <div className="font-semibold text-white text-lg mb-1">10M+</div>
            Domains Tracked
        </div>
        <div>
            <div className="font-semibold text-white text-lg mb-1">99.9%</div>
            Data Accuracy
        </div>
        <div>
            <div className="font-semibold text-white text-lg mb-1">Real-time</div>
            Global Updates
        </div>
      </div>
    </div>
  );
}