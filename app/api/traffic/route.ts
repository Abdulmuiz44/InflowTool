import { NextRequest, NextResponse } from 'next/server';
import { cleanUrl } from '@/app/utils/url';

interface TrafficData {
  globalRank: number;
  totalVisits: number;
  bounceRate: number;
  trafficSources: { name: string; percentage: number }[];
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
    const apiHost = process.env.TRAFFIC_API_HOST;

    // Simulate API call if keys are missing (for dev/demo purposes)
    if (!apiKey || !apiHost || apiKey === 'your_api_key_here') {
        // Return mock data for demonstration if no keys are set
        // In production, you would throw an error or handle this differently
        console.warn('Missing API keys, returning mock data');
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate latency
        return NextResponse.json({
            globalRank: Math.floor(Math.random() * 10000) + 1,
            totalVisits: Math.floor(Math.random() * 1000000) + 50000,
            bounceRate: parseFloat((Math.random() * 0.8).toFixed(2)),
            trafficSources: [
                { name: 'Direct', percentage: 40 },
                { name: 'Search', percentage: 35 },
                { name: 'Social', percentage: 15 },
                { name: 'Referrals', percentage: 10 }
            ],
            lastUpdated: new Date().toISOString()
        });
    }

    // Real API implementation (Example: using a generic fetch structure similar to RapidAPI/SimilarWeb)
    // This is a placeholder URL structure. Adjust according to the actual provider documentation.
    const response = await fetch(`https://${apiHost}/data?domain=${domain}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': apiHost,
      },
    });

    if (!response.ok) {
        if (response.status === 429) {
            return NextResponse.json({ error: 'API Limit Reached' }, { status: 429 });
        }
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: response.status });
    }

    const data = await response.json();

    // Map the external API response to our interface
    // Note: This mapping depends on the specific provider's response structure.
    
    const mappedData: TrafficData = {
        globalRank: data.global_rank || 0,
        totalVisits: data.total_visits || 0,
        bounceRate: data.bounce_rate || 0,
        trafficSources: data.sources || [],
        lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(mappedData);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
