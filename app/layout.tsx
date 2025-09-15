import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import AnalyticsPanel from "@/components/admin/analytics-panel"
import AnalyticsTracker from "@/components/analytics-tracker"
import SessionTracker from "@/components/session-tracker"
import InitialLoader from "@/components/initial-loader"

export const metadata = {
  title: "Chandru Portfolio | AI & ML Developer | Full Stack Developer",
  description:
    "Chandru is a skilled Full Stack Developer specializing in React, Next.js, and modern web technologies. View projects, skills, and experience.",
  keywords: "Chandru,AI, DSA, ML, Artificial Intelligence, Machine Learning,Data Science, Data Analysis, Deep Learning, portfolio, web developer, full stack developer, React developer, Next.js developer",
  authors: [{ name: "Chandru" }],
  creator: "Chandru",
  publisher: "Chandru",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://chandru22.vercel.app/"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Chandru Portfolio | AI & ML Developer | Full Stack Developer",
    description:
      "Chandru is a skilled Full Stack Developer specializing in React, Next.js, and modern web technologies.",
    url: "https://chandru22.vercel.app/",
    siteName: "Chandru Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Chandru Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chandru Portfolio | AI & ML Developer | Full Stack Developer",
    description:
      "Chandru is a skilled Full Stack Developer specializing in React, Next.js, and modern web technologies.",
    creator: "@chandru",
    images: ["/twitter-logo.png"],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="71Luxm_e083x1OsWkAj2WPwZhfFs4-AUKQevWGflij0" />
        <link rel="icon" sizes="128x128" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="32x32" href="/logo.png" />
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            try{
              if (typeof window === 'undefined') return;
              if (window.__origFetchWrapped) return;

              // Preserve a bound original fetch (if available)
              var _origFetch = window.fetch && window.fetch.bind(window);
              window.__origFetchWrapped = true;

              // Only wrap if an original fetch exists
              if (_origFetch) {
                window.fetch = function(){
                  var args = arguments;
                  try{
                    return _origFetch.apply(this, args);
                  }catch(err){
                    try{
                      var s = (err && (err.stack || err.message || '')) + '';
                      if(s.indexOf('fullstory') !== -1 || s.indexOf('fs.js') !== -1 || s.indexOf('edge.fullstory.com') !== -1){
                        console.warn('Suppressed FullStory fetch error', err);
                        return Promise.resolve(new Response(null, { status: 204 }));
                      }
                    }catch(e){}
                    throw err;
                  }
                };
              }

              // Suppress noisy FullStory errors and unhandled rejections
              window.addEventListener('error', function(e){
                try{
                  var src = (e && e.filename) || '';
                  if(src && src.indexOf('fullstory.com') !== -1){
                    e.preventDefault && e.preventDefault();
                    return true;
                  }
                }catch(err){}
              }, true);

              window.addEventListener('unhandledrejection', function(ev){
                try{
                  var reason = ev && ev.reason;
                  var s = '';
                  if(reason){ s = (reason.stack || reason.message || String(reason)); }
                  if(s && s.indexOf('fullstory.com') !== -1){ ev.preventDefault && ev.preventDefault(); return true; }
                }catch(err){}
              }, true);

              // Remove existing injected FullStory script tags if present
              try{
                var scripts = document.querySelectorAll('script[src*="fullstory"], script[src*="edge.fullstory.com"], script[src*="/fs.js"]');
                scripts.forEach(function(s){ s.parentNode && s.parentNode.removeChild(s); });
              }catch(err){}
            }catch(err){}
          })();
        ` }} />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <InitialLoader />
          {children}
          <AnalyticsPanel />
          <AnalyticsTracker />
          <SessionTracker />
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'
