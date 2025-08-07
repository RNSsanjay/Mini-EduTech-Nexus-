/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    env: {
        GRAPHQL_ENDPOINT: process.env.GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
    },
};

module.exports = nextConfig;
