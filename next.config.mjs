const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export', // ✅ use this
  reactStrictMode: true,
  images: {
    unoptimized: true, // optional
  },
  assetPrefix: isProd ? '/Portfolio/' : '',
  basePath: isProd ? '/Portfolio' : '',
};

export default nextConfig;
