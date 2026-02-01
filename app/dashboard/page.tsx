'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Activity, Globe, TrendingUp, Users, ArrowUpRight, AlertCircle, Clock, FileText, Map } from 'lucide-react';

interface TrafficData {
  globalRank: number;
  totalVisits: number;
  bounceRate: number;
  pagesPerVisit: number;
  avgVisitDuration: number;
  trafficSources: { name: string; percentage: number }[];
  topCountries: { name: string; percentage: number }[];
  lastUpdated?: string;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}m ${s}s`;
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
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-48 bg-slate-900/50 rounded-2xl border border-white/5"></div>
            ))}
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-6 h-6" />
            <span>{error}</span>
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Card 1: Visit Volume */}
          <div className="md:col-span-1 bg-slate-900/50 backdrop-blur-sm border border-white/5 p-6 rounded-2xl hover:border-blue-500/30 transition-colors group">
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
             <div className="mt-4 text-sm text-slate-500">
                Monthly Estimate
            </div>
          </div>

          {/* Card 2: Global Rank */}
          <div className="md:col-span-1 bg-slate-900/50 backdrop-blur-sm border border-white/5 p-6 rounded-2xl hover:border-amber-500/30 transition-colors group">
             <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 group-hover:text-amber-300 transition-colors">
                    <Globe className="w-6 h-6" />
                </div>
            </div>
            <h3 className="text-slate-400 text-sm font-medium">Global Rank</h3>
            <p className="text-3xl font-bold text-white mt-1">
                #{data.globalRank.toLocaleString()}
            </p>
             <div className="mt-4 text-sm text-slate-500">
                Worldwide Position
            </div>
          </div>

          {/* Card 3: Engagement Stats (Wider) */}
          <div className="md:col-span-1 lg:col-span-2 bg-slate-900/50 backdrop-blur-sm border border-white/5 p-6 rounded-2xl hover:border-cyan-500/30 transition-colors group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400 group-hover:text-cyan-300 transition-colors">
                    <Activity className="w-6 h-6" />
                </div>
                <div className="text-slate-400 text-sm font-medium">Engagement</div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <div className="flex items-center text-slate-500 mb-1 text-xs">
                         <Activity className="w-3 h-3 mr-1" /> Bounce Rate
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-white">
                        {(data.bounceRate * 100).toFixed(1)}%
                    </p>
                </div>
                <div>
                     <div className="flex items-center text-slate-500 mb-1 text-xs">
                         <FileText className="w-3 h-3 mr-1" /> Pages / Visit
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-white">
                        {data.pagesPerVisit.toFixed(1)}
                    </p>
                </div>
                <div>
                     <div className="flex items-center text-slate-500 mb-1 text-xs">
                         <Clock className="w-3 h-3 mr-1" /> Avg Duration
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-white">
                        {formatDuration(data.avgVisitDuration)}
                    </p>
                </div>
            </div>
          </div>

          {/* Card 4: Traffic Sources */}
          <div className="md:col-span-2 bg-slate-900/50 backdrop-blur-sm border border-white/5 p-6 rounded-2xl hover:border-purple-500/30 transition-colors">
             <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                    <ArrowUpRight className="w-6 h-6" />
                </div>
            </div>
            <h3 className="text-slate-400 text-sm font-medium mb-4">Top Traffic Sources</h3>
            <div className="space-y-4">
                {data.trafficSources.map((source, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-slate-300 w-24 truncate">{source.name}</span>
                        <div className="flex items-center gap-3 flex-1 ml-4">
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                                    style={{ width: `${source.percentage}%` }}
                                ></div>
                            </div>
                            <span className="text-white font-medium w-12 text-right">{source.percentage.toFixed(1)}%</span>
                        </div>
                    </div>
                ))}
            </div>
          </div>

          {/* Card 5: Top Countries */}
          <div className="md:col-span-2 bg-slate-900/50 backdrop-blur-sm border border-white/5 p-6 rounded-2xl hover:border-pink-500/30 transition-colors">
             <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400">
                    <Map className="w-6 h-6" />
                </div>
            </div>
            <h3 className="text-slate-400 text-sm font-medium mb-4">Top Countries</h3>
            <div className="space-y-4">
                {data.topCountries && data.topCountries.length > 0 ? (
                    data.topCountries.map((country, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-slate-300 w-32 truncate">{country.name}</span>
                            <div className="flex items-center gap-3 flex-1 ml-4">
                                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-pink-500 to-rose-400"
                                        style={{ width: `${country.percentage}%` }}
                                    ></div>
                                </div>
                                <span className="text-white font-medium w-12 text-right">{country.percentage.toFixed(1)}%</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-slate-500 text-center py-4">No country data available</div>
                )}
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
