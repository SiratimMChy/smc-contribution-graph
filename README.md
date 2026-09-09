# Contribution Graph

A professional API service that visualizes your GitHub commit activity over the last 31 days. This tool generates a beautiful, responsive SVG chart with a modern glowing neon theme, perfect for your GitHub profile README.

## Overview

Contribution Graph analyzes your GitHub contribution data and creates a stunning line and area chart. With smooth Bezier curves, dynamic gradients, and animated data points, this visualization helps you showcase your recent coding activity in style.

## Features

- **GitHub GraphQL Integration**: Fetches real contribution data directly from GitHub
- **31-Day Activity Tracking**: Highlights your daily commit frequency over the past month
- **Premium Visualization**: Generates a responsive SVG chart with glowing effects, gradient fills, and smooth curves
- **Neon Theme**: Features a sleek dark background (`#0A0F1C` to `#12182B`) with vibrant neon green and blue accents
- **Customizable**: Built to be easily embedded in Markdown files or websites
- **Caching Support**: Implements HTTP caching for optimal performance

## Prerequisites

- Node.js (v14 or higher)
- GitHub Personal Access Token with read access to contributions
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smc-contribution-graph
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your GitHub credentials:
```env
GITHUB_TOKEN=your_github_personal_access_token
USERNAME=your_github_username
PORT=3000
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GITHUB_TOKEN` | GitHub Personal Access Token for API authentication | Yes |
| `USERNAME` | Your GitHub username | Yes |
| `PORT` | Server port (defaults to 3000) | No |

### Obtaining a GitHub Token

1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token"
3. Select `read:user` scope for reading public contribution data
4. Copy the token and add it to your `.env` file

## Usage

### Starting the Server

```bash
node index.js
```

The server will start on the configured PORT (default: 3000).

### API Endpoints

#### GET `/commits`
Returns an SVG visualization of your 31-day commit activity.

**Response:**
- Content-Type: `image/svg+xml`
- Cache-Control: `public, max-age=3600` (1 hour cache)

**Example:**
```bash
curl http://localhost:3000/commits
```

#### GET `/`
Health check endpoint.

**Response:**
```
Commit Graph API Running 🚀
```

## How It Works

### Data Collection
1. Queries GitHub GraphQL API for your contribution calendar
2. Retrieves daily contribution counts and extracts the last 31 days

### Visualization
- Generates an SVG card with a dynamic Bezier curve line chart
- Features a translucent gradient area fill below the curve
- Includes animated pop-in dots for each day's contribution count
- Fully responsive design that scales perfectly across devices

## Technical Stack

- **Express.js**: Web server framework
- **Axios**: HTTP client for API requests
- **dotenv**: Environment variable management
- **GitHub GraphQL API**: Data source for contribution metrics

## Project Structure

```text
smc-contribution-graph/
├── index.js              # Main application file
├── package.json          # Project dependencies
├── vercel.json           # Vercel deployment configuration
├── .env                  # Environment configuration (not committed)
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## Performance Considerations

- **Caching**: SVG responses are cached for 1 hour to reduce API calls
- **GraphQL Efficiency**: Single GraphQL query fetches targeted contribution data

## Troubleshooting

### "Error: GraphQL Error" or "User not found"
- Verify your GitHub token is valid and has not expired
- Ensure the `USERNAME` environment variable matches your GitHub username exactly

### "Error generating graph" (on Vercel)
- Make sure you have added `GITHUB_TOKEN` and `USERNAME` to the Environment Variables in your Vercel Project Settings and re-deployed.

## Deployment

This application is configured for deployment on Vercel. 

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run the deployment command:
```bash
vercel --prod
```

## License

ISC

## Author

Created for personal GitHub analytics and beautiful profile readmes.

---

**Note**: This tool is designed for personal use. Ensure you comply with GitHub's Terms of Service when using their API.
