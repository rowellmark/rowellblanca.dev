const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        outputFileTracingRoot: path.resolve(__dirname),
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
            },
        ],
    },
};

module.exports = nextConfig;
