'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Activity, Globe, TrendingUp, Users, ArrowUpRight, AlertCircle } from 'lucide-react';

interface TrafficData {
  globalRank: number;
  totalVisits: number;
  bounceRate: number;
  trafficSources: { name: string; percentage: number }[];
  lastUpdated?: string;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  const [data, setData] = useState<TrafficData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
        setLoading(false);
        return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/traffic', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ targetUrl: url }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  if (!url) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-white">No URL Provided</h2>
            <p className="text-slate-400 mb-6">Please enter a website URL on the home page to view analytics.</p>
            <a href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                Go Home
            </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Analytics for {url}
          </h1>
          <p className="text-slate-400 mt-2 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Global Traffic Report
          </p>
        </div>
        {data?.lastUpdated && (
           <div className="text-xs font-mono text-slate-500 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800">
             Updated: {new Date(data.lastUpdated).toLocaleString()}
           </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-slate-900/50 rounded-2xl border border-white/5"></div>
            ))}
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-6 h-6" />
            <span>{error}</span>
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Visit Volume */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 p-6 rounded-2xl hover:border-blue-500/30 transition-colors group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-hover:text-blue-300 transition-colors">
                    <Users className="w-6 h-6" />
                </div>
                <span className="flex items-center text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Live
                </span>
            </div>
            <h3 className="text-slate-400 text-sm font-medium">Total Visits</h3>
            <p className="text-3xl font-bold text-white mt-1">
                {data.totalVisits.toLocaleString()}
            </p>
            <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[70%]"></div>
            </div>
          </div>

          {/* Card 2: Engagement */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 p-6 rounded-2xl hover:border-cyan-500/30 transition-colors group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400 group-hover:text-cyan-300 transition-colors">
                    <Activity className="w-6 h-6" />
                </div>
            </div>
            <div className="space-y-4">
                <div>
                    <h3 className="text-slate-400 text-sm font-medium">Bounce Rate</h3>
                    <p className="text-3xl font-bold text-white mt-1">
                        {(data.bounceRate * 100).toFixed(1)}%
                    </p>
                </div>
                <div>
                    <h3 className="text-slate-400 text-sm font-medium">Global Rank</h3>
                    <p className="text-xl font-semibold text-white mt-1">
                        #{data.globalRank.toLocaleString()}
                    </p>
                </div>
            </div>
          </div>

          {/* Card 3: Traffic Sources */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 p-6 rounded-2xl hover:border-purple-500/30 transition-colors md:row-span-1">
             <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                    <ArrowUpRight className="w-6 h-6" />
                </div>
            </div>
            <h3 className="text-slate-400 text-sm font-medium mb-3">Top Traffic Sources</h3>
            <div className="space-y-3">
                {data.trafficSources.map((source, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">{source.name}</span>
                        <div className="flex items-center gap-3 flex-1 ml-4 justify-end">
                            <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                                    style={{ width: `${source.percentage}%` }}
                                ></div>
                            </div>
                            <span className="text-white font-medium w-8 text-right">{source.percentage}%</span>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="text-white">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
