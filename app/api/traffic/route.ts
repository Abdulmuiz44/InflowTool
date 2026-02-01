import { NextRequest, NextResponse } from 'next/server';
import { cleanUrl } from '@/app/utils/url';

interface TrafficData {
  globalRank: number;
  totalVisits: number;
  bounceRate: number;
  trafficSources: { name: string; percentage: number }[];
  pagesPerVisit: number;
  avgVisitDuration: number;
  topCountries: { name: string; percentage: number }[];
  lastUpdated?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetUrl } = body;

    if (!targetUrl) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const domain = cleanUrl(targetUrl);
    const apiKey = process.env.TRAFFIC_API_KEY;
    const apiHost = process.env.TRAFFIC_API_HOST || 'similarweb-api1.p.rapidapi.com';

    // 1. Check for missing keys and return mock data immediately (Dev/Demo mode)
    if (!apiKey || apiKey === 'your_api_key_here') {
        console.warn('Missing API keys, returning mock data');
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate latency
        return NextResponse.json({
            globalRank: Math.floor(Math.random() * 10000) + 1,
            totalVisits: Math.floor(Math.random() * 1000000) + 50000,
            bounceRate: parseFloat((Math.random() * 0.8).toFixed(2)),
            pagesPerVisit: parseFloat((Math.random() * 5 + 1).toFixed(2)),
            avgVisitDuration: Math.floor(Math.random() * 500) + 30,
            trafficSources: [
                { name: 'Direct', percentage: 40 },
                { name: 'Search', percentage: 35 },
                { name: 'Social', percentage: 15 },
                { name: 'Referrals', percentage: 10 }
            ],
            topCountries: [
                { name: 'United States', percentage: 35 },
                { name: 'India', percentage: 15 },
                { name: 'Germany', percentage: 8 },
                { name: 'United Kingdom', percentage: 6 },
                { name: 'Others', percentage: 36 }
            ],
            lastUpdated: new Date().toISOString()
        });
    }

    // 2. Real API implementation
    // Service: Similarweb Traffic API (on RapidAPI)
    // URL: https://rapidapi.com/backend-api-backend-api-default/api/similarweb-api1
    const response = await fetch(`https://${apiHost}/v1/visitsInfo`, {
      method: 'POST',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': apiHost,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: domain }),
    });

    if (!response.ok) {
        if (response.status === 429) {
            return NextResponse.json({ error: 'API Limit Reached' }, { status: 429 });
        }
        // If real API fails (e.g. invalid key), we could optionally fall back to mock, 
        // but for "Real" mode, we should probably return the error to let the user know.
        const errText = await response.text();
        console.error('API Error Response:', errText);
        return NextResponse.json({ error: `Provider Error: ${response.status}` }, { status: response.status });
    }

    const data = await response.json();

    // Map the external API response to our interface.
    // Note: Adjust keys below based on the actual response from 'similarweb-api1'.
    // We attempt to handle common variations or provide defaults.
    
    interface ApiTrafficSource {
        source?: string;
        Name?: string;
        percent?: number;
        Value?: number;
    }

    interface ApiCountry {
        CountryCode?: string;
        Country?: string; // ID like 840 (US)
        Value?: number;
    }
    
    // Country ID to Name mapping (simplified)
    const countryNames: Record<string, string> = {
        '840': 'United States',
        '356': 'India',
        '826': 'United Kingdom',
        '276': 'Germany',
        '124': 'Canada',
        '076': 'Brazil',
        '250': 'France',
        '392': 'Japan',
        '643': 'Russia',
        '724': 'Spain',
    };

    const getCountryName = (code: string | number) => {
        const c = String(code);
        return countryNames[c] || `Country ${c}`;
    };

    const mappedData: TrafficData = {
        globalRank: data.globalRank?.rank || data.GlobalRank?.Rank || 0,
        totalVisits: parseInt(data.totalVisits || data.TotalVisits || data.visits || '0', 10),
        bounceRate: parseFloat(data.bounceRate || data.BounceRate || '0'),
        pagesPerVisit: parseFloat(data.pagesPerVisit || data.PagePerVisit || data.PagesPerVisit || '0'),
        avgVisitDuration: parseFloat(data.avgVisitDuration || data.TimeOnSite || data.AvgVisitDuration || '0'),
        trafficSources: (data.trafficSources || data.TrafficSources || []).map((s: ApiTrafficSource) => ({
            name: s.source || s.Name || 'Unknown',
            percentage: s.percent || s.Value || 0
        })),
        topCountries: (data.topCountries || data.TopCountryShares || []).slice(0, 5).map((c: ApiCountry) => ({
             name: c.Country ? getCountryName(c.Country) : (c.CountryCode || 'Unknown'),
             percentage: c.Value ? (c.Value * 100) : 0 
        })),
        lastUpdated: new Date().toISOString()
    };

    // Fallback if sources are empty (some free tiers might not return detailed sources)
    if (mappedData.trafficSources.length === 0) {
        mappedData.trafficSources = [
            { name: 'Direct', percentage: 0 },
            { name: 'Search', percentage: 0 },
            { name: 'Social', percentage: 0 },
            { name: 'Referrals', percentage: 0 }
        ];
    }
    
    if (mappedData.topCountries.length === 0) {
        // Fallback or empty is fine, frontend handles it.
    }

    return NextResponse.json(mappedData);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
