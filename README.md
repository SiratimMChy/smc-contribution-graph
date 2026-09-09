<div align="center">

# SMC Contribution Graph

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![GitHub stars](https://img.shields.io/github/stars/SiratimMChy/smc-contribution-graph?style=flat-square)](https://github.com/SiratimMChy/smc-contribution-graph/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)

An API service that generates an SVG chart of your GitHub commit activity over the last 31 days. You can use it to display a dynamic contribution graph on your GitHub profile README.

</div>

---

## Overview

**SMC Contribution Graph** fetches your GitHub contribution data and generates a line and area chart. It provides a visual summary of your recent commit history, which you can easily embed anywhere that supports images.

## Features

- **GraphQL Integration**: Fetches contribution data using the GitHub GraphQL API.
- **31-Day Activity**: Shows your daily commit count for the past month.
- **SVG Generation**: Creates an SVG chart with smooth curves and a dark theme.
- **Caching**: Uses HTTP caching to minimize API calls and improve loading times.

## Tech Stack

- **[Express.js](https://expressjs.com/)**: Web server framework.
- **[Axios](https://axios-http.com/)**: HTTP client.
- **[GitHub GraphQL API](https://docs.github.com/en/graphql)**: Data source.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- GitHub Personal Access Token (requires `read:user` scope)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SiratimMChy/smc-contribution-graph.git
   cd smc-contribution-graph
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   GITHUB_TOKEN=your_github_personal_access_token
   USERNAME=your_github_username
   PORT=3000
   ```

### Obtaining a GitHub Token
1. Go to [Personal access tokens](https://github.com/settings/tokens) in your GitHub Developer settings.
2. Click **Generate new token**.
3. Select the `read:user` scope.
4. Add the generated token to your `.env` file.

## Usage

### Running Locally

Start the server:
```bash
node index.js
```
The server runs on port `3000` by default.

### API Endpoints

#### `GET /commits`
Generates and returns the SVG chart of your 31-day commit activity.

**Example Request:**
```bash
curl http://localhost:3000/commits
```

**Embedding in Markdown:**
```markdown
![My Contribution Graph](http://localhost:3000/commits)
```

#### `GET /`
Basic health check endpoint.

## Deployment

This project is set up to deploy on **Vercel**. 

1. Install the Vercel CLI: 
   ```bash
   npm i -g vercel
   ```
2. Deploy:
   ```bash
   vercel --prod
   ```
Make sure to add `GITHUB_TOKEN` and `USERNAME` to your environment variables in the Vercel dashboard.

---

## License & Contributions

This project is open-source. Anyone is free to view, explore, and contribute to this repository. 

**Usage of Cards:** You are free to generate and use these contribution graph cards on your own profile, websites, or applications. However, **you must provide proper credit** to the original creator. Using the generated cards or this codebase without attribution is not allowed.

Distributed under the **MIT License**. See the license details for more information.

*Copyright © 2026 SMC Contribution Graph. All rights reserved.*

<br/>

<div align="center">

**Made by Siratim Mustakim Chowdhury**

[![GitHub](https://img.shields.io/badge/GitHub-SiratimMChy-181717?style=flat&logo=github)](https://github.com/SiratimMChy)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Siratim%20Mustakim-0077B5?style=flat&logo=linkedin)](https://www.linkedin.com/in/siratim-mustakim-chowdhury/)
[![Email](https://img.shields.io/badge/Email-chowdhurysiratimmustakim@gmail.com-D14836?style=flat&logo=gmail&logoColor=white)](mailto:chowdhurysiratimmustakim@gmail.com)
</div>
