export const feedItems = [
  {
    id: 1,
    type: 'Article',
    readTime: '5 min read',
    title: 'Architecting Micro-frontends in 2024: A Pragmatic Guide',
    description: 'TL;DR: Move beyond the hype of Module Federation. We explore how leading engineering teams handle distributed frontend systems without compromising on developer experience or runtime performance.',
    tags: ['webdev', 'architecture', 'react'],
    author: 'Alex Rivero',
    authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800&h=400',
    date: new Date().toISOString(), // Today
    sourceUrl: 'https://example.com/article1',
    fullContent: {
      title: 'Architecting Micro-frontends in 2024: A Pragmatic Guide',
      author: 'Alex Rivero',
      date: 'Oct 24, 2023',
      readTime: '5 min read',
      authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100',
      tldr: [
        'Move beyond the hype of Module Federation.',
        'Focus on developer experience and runtime performance.',
        'Explore how leading teams handle distributed systems.'
      ],
      tags: ['webdev', 'architecture', 'react'],
      paragraphs: [
        'In the rapidly evolving landscape of frontend development, micro-frontends have emerged as a powerful pattern for scaling large-scale applications. However, the initial hype surrounding technologies like Module Federation has sometimes clouded the pragmatic realities of implementation.',
        'This guide explores how modern engineering organizations are navigating these challenges, focusing on core principles like independent deployment, team autonomy, and shared design systems.'
      ],
      quote: 'Practical strategies for balancing speed against complexity ensure teams remain productive without sacrificing application stability.'
    }
  },
  {
    id: 2,
    type: 'Tool',
    readTime: 'Open Source',
    title: 'Turbo-SQL: The ultra-fast SQLite wrapper for Go',
    description: 'A modern approach to SQLite management in Go applications. Benchmarks show a 40% improvement over traditional drivers with full compile-time type safety.',
    tags: ['golang', 'database'],
    author: 'Sarah Chen',
    authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    sourceUrl: 'https://github.com/example/turbo-sql',
  },
  {
    id: 3,
    type: 'Video',
    readTime: '12:45 min',
    title: 'The Rise of Autonomous AI Agents: What\'s Next?',
    description: 'Deep dive into BabyAGI and AutoGPT architectures. How agents are starting to reason and execute complex task loops independently in enterprise environments.',
    tags: ['ai-engineering', 'future-tech'],
    author: 'Marcus Thorne',
    authorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800&h=400',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    sourceUrl: 'https://youtube.com/watch?v=example',
  },
  {
    id: 4,
    type: 'Reel',
    readTime: '0:45 min',
    title: 'VS Code productivity hacks you didn\'t know',
    description: 'Quick tips to speed up your coding workflow with built-in shortcuts and hidden features.',
    tags: ['vscode', 'productivity'],
    author: 'Jenna Lopez',
    authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100',
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago (Last Week)
    sourceUrl: 'https://example.com/reels/1',
  },
  {
    id: 5,
    type: 'Post',
    readTime: '2 min read',
    title: 'Why I switched from React to HTMX for my latest project',
    description: 'Sometimes simplicity wins. My journey of stripping away the JS complexity and returning to server-side fundamentals.',
    tags: ['htmx', 'webdev', 'minimalism'],
    author: 'David Park',
    authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago (Last Week)
    sourceUrl: 'https://example.com/post/1',
  },
  {
    id: 6,
    type: 'Article',
    readTime: '8 min read',
    title: 'Mastering CSS Grid: Beyond the Basics',
    description: 'A deep dive into complex layouts using CSS Grid. Learn how to create truly responsive and flexible designs without media queries.',
    tags: ['css', 'frontend', 'design'],
    author: 'Emma Wilson',
    authorImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100',
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago (Last Month)
    sourceUrl: 'https://example.com/css-grid',
  },
  {
    id: 7,
    type: 'Tool',
    readTime: 'Utility',
    title: 'Zustand vs Redux in 2024',
    description: 'Comparing the state of state management in React. Which one should you choose for your next project?',
    tags: ['react', 'state-management'],
    author: 'Alex Rivero',
    authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100',
    date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago (Last Month)
    sourceUrl: 'https://example.com/zustand-redux',
  },
  {
    id: 8,
    type: 'Article',
    readTime: '6 min read',
    title: 'The Future of WebAssembly',
    description: 'Exploring the potential of Wasm beyond the browser. How it\'s changing cloud computing and edge functions.',
    tags: ['wasm', 'webdev', 'cloud'],
    author: 'Sarah Chen',
    authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100',
    date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days ago (Last Month)
    sourceUrl: 'https://example.com/wasm-future',
  },
  {
    id: 9,
    type: 'Video',
    readTime: '15:20 min',
    title: 'Building a Real-time Chat with Elixir/Phoenix',
    description: 'Step-by-step guide to leveraging WebSockets and Phoenix Channels for high-concurrency applications.',
    tags: ['elixir', 'phoenix', 'real-time'],
    author: 'Marcus Thorne',
    authorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100',
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago (Last Month)
    sourceUrl: 'https://example.com/elixir-chat',
  },
  {
    id: 10,
    type: 'Tool',
    readTime: 'Open Source',
    title: 'Biome: The unified tool for JS/TS',
    description: 'A fast formatter and linter that aims to replace Prettier and ESLint. Is it ready for prime time?',
    tags: ['javascript', 'tooling'],
    author: 'Jenna Lopez',
    authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    sourceUrl: 'https://example.com/biome-tool',
  },
  {
    id: 11,
    type: 'Article',
    readTime: '10 min read',
    title: 'Deep Learning for Web Developers',
    description: 'An introduction to neural networks using TensorFlow.js. Bringing AI to the browser.',
    tags: ['ai', 'tensorflow', 'javascript'],
    author: 'David Park',
    authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    sourceUrl: 'https://example.com/deep-learning-web',
  },
  {
    id: 12,
    type: 'Video',
    readTime: '5:45 min',
    title: 'Why your website is slow: Core Web Vitals explained',
    description: 'Understanding LCP, FID, and CLS. Practical tips to improve your site performance score.',
    tags: ['performance', 'web-vitals'],
    author: 'Emma Wilson',
    authorImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    sourceUrl: 'https://example.com/core-web-vitals',
  }
];

export const trendingTopics = [
  { id: 1, tag: '#rust-lang', stats: '1.2k readers today', color: 'text-primary', bg: 'bg-primary/5', border: 'border-primary/10' },
  { id: 2, tag: '#typescript', stats: '856 discussions', color: 'text-brand-teal', bg: 'bg-white', border: 'border-gray-200' },
  { id: 3, tag: '#serverless', stats: '43 active tools', color: 'text-deep-charcoal', bg: 'bg-white', border: 'border-gray-200' }
];
