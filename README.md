# Scissors - URL Shortener

## Introduction

**Scissors** is a powerful URL shortener that not only shortens long URLs but also provides detailed analytics of URL performance, including click rates, referrer information, and geographic data. With Scissors, users can create custom-branded URLs, generate QR codes, and manage their link history efficiently.

## Features

- **URL Shortening**: Quickly shorten long URLs for easy sharing.
- **Custom URLs**: Create branded short links using custom domain names.
- **Analytics**: Track the performance of your shortened URLs, including click rates, referrer data, and more.
- **QR Code Generation**: Generate QR codes for your shortened URLs.
- **Link Management**: View and manage your link history, including editing and deleting links.
- **Caching**: Redis caching for enhanced performance.
- **Rate Limiting**: Protect the service from abuse with rate limiting.

## Tech Stack

- **Backend**: Node.js with Express
- **Frontend**: React with TypeScript
- **Database**: MongoDB
- **Cache**: Redis
- **Others**: TypeScript, Jest for testing, Chakra UI (for styling)

## Getting Started

Follow these steps to set up the Scissors URL shortener on your local machine.

### Prerequisites

- **Node.js** (v14.x or higher)
- **npm** (v6.x or higher) or **Yarn**
- **MongoDB** (as database)
- **Redis** (for caching)
- **TypeScript**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/justlogicalahmad/scissors.git
   cd scissors
   ```
2. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   ```
3. **Install frontend dependencies:**
   ```bash
   cd client
   npm install
   ```
4. **Set up environment variables:**

   _Set up environment variables for SERVER:_

   ```bash
   PORT="port-no"
   HOSTNAME="local-hostname"
   BACKLOG=
   NODE_ENV="environment - development || production"
   JWT_SECRET = "your-jwt-secret"
   DATABASE_URI = "your-mongodb-uri"
   LANDING_DEMO_BASE_URL = "demo-landing-page-base-url"
   LANDING_LIVE_BASE_URL = "live-landing-page-base-url"
   APP_DEMO_BASE_URL = "http://${HOSTNAME}:${PORT}"
   APP_LIVE_BASE_URL = "live-client-app-url"
   SERVER_DEMO_BASE_URL = "live-server-base-url"
   DEMO_REDIS_URL = "your-demo-redis-url"
   LIVE_REDIS_URL = "your-live-redis-url"
   SERVER_LIVE_BASE_URL = "https://"
   USER = "email-to-send-otp@gmail.com"
   GOOGLE_APP_PASSWORD = "email-google-app-password"
   ```

   _Set up environment variables for CLIENT:_

   ```bash
   VITE_NODE_ENV = "environment - development || production"
   VITE_DEV_SERVER_URL = "local-server-base-url"
   VITE_PROD_SERVER_URL = "deployed-server-base-url"
   ```

5. **Start MongoDB and Redis:**

   _Ensure that both MongoDB and Redis are running. You can start MongoDB and Redis using their respective services or through Docker if preferred._

6. **Run the backend server:**

   ```bash
   cd server
   npm run dev
   ```

7. **Run the frontend landing page:**

   ```bash
   cd client
   npm run dev
   ```

   _The frontend landing page will be available at http://localhost:5173 by default._

8. **Run the frontend app:**

   ```bash
   cd client/app
   npm run dev
   ```

   _The frontend app will be available at http://localhost:5174 by default._

9. **Running Tests:**

   _To ensure everything is working as expected, you can run the tests using._

   `Server Tests:`

   ```bash
   cd backend
   npm run test
   ```

   _The frontend app will be available at http://localhost:5174 by default._

## Usage

- **Shorten a URL:**
  Visit the frontend application and use the provided form to shorten a URL. You can choose to generate a QR code and use a custom domain.

- **View Analytics:**
  Track URL performance and analytics from the frontend dashboard.

- **Manage Links:**
  Access your link history, edit or delete links as needed.

## Contributing

Contributions to the Scissors project are welcome! Please fork the repository and submit a pull request with your proposed changes. Ensure that your code adheres to the project's coding standards and includes appropriate tests.
