/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://*.clerk.accounts.dev https://*.mapbox.com blob:",
              "worker-src 'self' blob:",
              "style-src 'self' 'unsafe-inline'",
              "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://*.clerk.accounts.dev",
              "connect-src 'self' https://api.stripe.com https://api.mapbox.com https://*.clerk.accounts.dev https://*.mapbox.com",
              "img-src 'self' data: blob: https://*.stripe.com https://*.clerk.accounts.dev https://*.mapbox.com https://img.clerk.com https://images.clerk.dev",
              "font-src 'self' data:",
              "media-src 'self'"
            ].join('; ')
          }
        ]
      }
    ]
  },
  images: {
    domains: ['api.mapbox.com', 'maps.googleapis.com', 'img.clerk.com', 'images.clerk.dev'],
  },
}

module.exports = nextConfig
