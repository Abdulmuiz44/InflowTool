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
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.details || errorData.error || `Error ${response.status}: Failed to fetch data`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  if (!url) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-card p-8 rounded-xl border border-border shadow-sm max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-foreground">No URL Provided</h2>
            <p className="text-muted-foreground mb-6">Please enter a website URL on the home page.</p>
            <a href="/" className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-6 rounded-lg transition-colors">
                Go Home
            </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {url}
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Global Traffic Report
          </p>
        </div>
        {data?.lastUpdated && (
           <div className="text-xs font-mono text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-border">
             Updated: {new Date(data.lastUpdated).toLocaleDateString()}
           </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-48 bg-muted rounded-xl"></div>
            ))}
        </div>
      ) : error ? (
        <div className="flex flex-col gap-4 bg-destructive/10 border border-destructive/20 text-destructive p-6 rounded-xl">
            <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <span className="font-medium">{error}</span>
            </div>
            {error.toLowerCase().includes('subscribe') && (
                <a 
                    href="https://rapidapi.com/backend-api-backend-api-default/api/similarweb-api1/pricing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="self-start px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                    Subscribe for Free on RapidAPI &rarr;
                </a>
            )}
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Card 1: Visit Volume */}
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Users className="w-5 h-5" />
                </div>
            </div>
            <h3 className="text-muted-foreground text-sm font-medium">Total Visits</h3>
            <p className="text-3xl font-bold text-foreground mt-1">
                {data.totalVisits.toLocaleString()}
            </p>
            <div className="mt-4 text-xs text-muted-foreground">
                Monthly Estimate
            </div>
          </div>

          {/* Card 2: Global Rank */}
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
             <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Globe className="w-5 h-5" />
                </div>
            </div>
            <h3 className="text-muted-foreground text-sm font-medium">Global Rank</h3>
            <p className="text-3xl font-bold text-foreground mt-1">
                #{data.globalRank.toLocaleString()}
            </p>
             <div className="mt-4 text-xs text-muted-foreground">
                Worldwide Position
            </div>
          </div>

          {/* Card 3: Engagement Stats */}
          <div className="md:col-span-1 lg:col-span-2 bg-card border border-border p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Activity className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-foreground">Engagement</span>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <div className="flex items-center text-muted-foreground mb-1 text-xs">
                         <TrendingUp className="w-3 h-3 mr-1" /> Bounce Rate
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-foreground">
                        {(data.bounceRate * 100).toFixed(1)}%
                    </p>
                </div>
                <div>
                     <div className="flex items-center text-muted-foreground mb-1 text-xs">
                         <FileText className="w-3 h-3 mr-1" /> Pages/Visit
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-foreground">
                        {data.pagesPerVisit.toFixed(1)}
                    </p>
                </div>
                <div>
                     <div className="flex items-center text-muted-foreground mb-1 text-xs">
                         <Clock className="w-3 h-3 mr-1" /> Avg Duration
                    </div>
                    <p className="text-xl md:text-2xl font-bold text-foreground">
                        {formatDuration(data.avgVisitDuration)}
                    </p>
                </div>
            </div>
          </div>

          {/* Card 4: Traffic Sources */}
          <div className="md:col-span-2 bg-card border border-border p-6 rounded-xl shadow-sm">
             <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <ArrowUpRight className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-foreground">Traffic Sources</span>
                </div>
            </div>
            <div className="space-y-4 pt-2">
                {data.trafficSources.map((source, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground w-24 truncate">{source.name}</span>
                        <div className="flex items-center gap-3 flex-1 ml-4">
                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-primary"
                                    style={{ width: `${source.percentage}%` }}
                                ></div>
                            </div>
                            <span className="text-foreground font-medium w-12 text-right">{source.percentage.toFixed(1)}%</span>
                        </div>
                    </div>
                ))}
            </div>
          </div>

          {/* Card 5: Top Countries */}
          <div className="md:col-span-2 bg-card border border-border p-6 rounded-xl shadow-sm">
             <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Map className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-foreground">Top Countries</span>
                </div>
            </div>
            <div className="space-y-4 pt-2">
                {data.topCountries && data.topCountries.length > 0 ? (
                    data.topCountries.map((country, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground w-32 truncate">{country.name}</span>
                            <div className="flex items-center gap-3 flex-1 ml-4">
                                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-primary"
                                        style={{ width: `${country.percentage}%` }}
                                    ></div>
                                </div>
                                <span className="text-foreground font-medium w-12 text-right">{country.percentage.toFixed(1)}%</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-muted-foreground text-center py-4">No country data available</div>
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
    <Suspense fallback={<div className="text-foreground">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
