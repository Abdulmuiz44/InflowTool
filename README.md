# InflowTool

**InflowTool** is a premium web analytics dashboard that provides instant insights into any website's traffic, global ranking, and audience engagement through a sleek, data-driven interface.

## Features

- **Real-Time Analytics:** Fetch live traffic data for any domain.
- **Global Rankings:** View worldwide traffic standing and visit volume.
- **Engagement Metrics:** Track bounce rates and session quality.
- **Bento-Style Dashboard:** A modern, high-end UI designed for clarity and visual appeal.
- **Responsive Design:** Fully optimized for all device sizes with a "Deep Slate" aesthetic.
- **Traffic Source Breakdown:** Visualize how visitors are finding the target website.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm or npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Abdulmuiz44/InflowTool.git
   cd InflowTool
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```env
   TRAFFIC_API_KEY=your_rapidapi_key
   # Default host is 'similarweb-api1.p.rapidapi.com'
   # Get key from: https://rapidapi.com/backend-api-backend-api-default/api/similarweb-api1
   TRAFFIC_API_HOST=similarweb-api1.p.rapidapi.com
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Language:** TypeScript