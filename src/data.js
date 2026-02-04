// Mock Data for Fyware Tech Feed
// Real news from early 2025

export const feedItems = [
  {
    id: 1,
    title: "Tailwind CSS v4.0: A New High-Performance Engine",
    summary: "Tailwind CSS v4.0 is here with a ground-up rewrite in Rust. It features a new CSS-first configuration, simplified installation, and massive performance improvements for large-scale projects.",
    content: `Tailwind CSS v4.0 represents a significant milestone in the evolution of the framework. The entire engine has been rewritten in Rust, providing up to 10x faster build times.

Key features include:
- **CSS-first configuration**: No more tailwind.config.js for basic setups. Everything can be defined directly in your CSS files using @theme.
- **Unified toolchain**: Built-in support for imports, nesting, and vendor prefixing.
- **Zero-runtime**: Still generates minimal CSS, but with a smarter discovery mechanism that doesn't require complex regex paths.
- **Container queries**: First-class support for the @container plugin now built directly into the core.`,
    category: "Tools",
    type: "Article",
    readTime: "6 min read",
    date: "2026-02-05",
    author: "Adam Wathan",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1200&auto=format&fit=crop",
    tags: ["#tailwindcss", "#css", "#webdev"],
    externalLink: "https://tailwindcss.com/blog/tailwindcss-v4"
  },
  {
    id: 2,
    title: "OpenAI Announces o3-mini: High-Speed Reasoning for Coders",
    summary: "The new o3-mini model balances intense reasoning capabilities with the speed of smaller models, specifically optimized for complex coding tasks and scientific problems.",
    content: "OpenAI's latest release, o3-mini, brings the power of the 'o' series reasoning models to a more efficient and cost-effective tier. It excels at multi-step code generation and debugging while maintaining low latency.",
    category: "Articles",
    type: "Article",
    readTime: "4 min read",
    date: "2026-02-04",
    author: "Sarah Chen",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop",
    tags: ["#ai", "#openai", "#coding"],
    externalLink: "https://openai.com/blog/o3-mini"
  },
  {
    id: 3,
    title: "DeepSeek-R1: Challenging the AI Status Quo",
    summary: "The open-weights DeepSeek-R1 model has sent shockwaves through the industry, matching top-tier proprietary models in reasoning benchmarks at a fraction of the cost.",
    content: "DeepSeek-R1 has demonstrated that high-quality reasoning models can be developed with efficient compute resources. Its open-weights release has sparked a new wave of local LLM innovation.",
    category: "Articles",
    type: "Article",
    readTime: "8 min read",
    date: "2026-02-03",
    author: "Alex Rivero",
    authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4628c7145?q=80&w=1200&auto=format&fit=crop",
    tags: ["#deepseek", "#ai", "#opensource"],
    externalLink: "https://github.com/deepseek-ai/DeepSeek-R1"
  },
  {
    id: 4,
    title: "React 19 Stable: Actions, useOptimistic, and More",
    summary: "React 19 is now stable, bringing native support for Actions, document metadata management, and improved error handling for concurrent rendering.",
    content: "React 19 simplifies data fetching and form submissions with Actions. The new useActionState hook provides a standardized way to manage pending states and errors.",
    category: "Articles",
    type: "Article",
    readTime: "5 min read",
    date: "2026-01-30",
    author: "Dan Abramov",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200&auto=format&fit=crop",
    tags: ["#react", "#frontend", "#javascript"],
    externalLink: "https://react.dev/blog/2024/12/05/react-19"
  },
  {
    id: 5,
    title: "Bun 1.2: The Ultimate JavaScript Toolkit Expands",
    summary: "Bun 1.2 introduces a built-in S3 client, OIDC support, and major improvements to the test runner and package manager speed.",
    content: "The latest Bun release continues to push the boundaries of JS runtime performance. With its new S3 client, developers can interact with object storage without extra dependencies.",
    category: "Tools",
    type: "Tool",
    readTime: "Open Source",
    date: "2026-01-28",
    author: "Jarred Sumner",
    authorImage: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=100&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    tags: ["#bun", "#runtime", "#javascript"],
    externalLink: "https://bun.sh/blog/bun-v1.2"
  },
  {
    id: 6,
    title: "Vite 6: The Environment API and Beyond",
    summary: "Vite 6 introduces the Environment API, allowing frameworks to have finer control over module resolution and bundling in different environments.",
    content: "Vite 6 is a major step forward for the build tool, enabling better support for SSR, edge workers, and browser-specific builds within a single dev session.",
    category: "Tools",
    type: "Tool",
    readTime: "Open Source",
    date: "2026-01-25",
    author: "Evan You",
    authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
    tags: ["#vite", "#buildtools", "#webdev"],
    externalLink: "https://vitejs.dev/blog/announcing-vite-6"
  },
  {
    id: 7,
    title: "State of JS 2024: Trends and Takeaways",
    summary: "The results are in for the State of JS 2024 survey. We analyze the rise of Shadcn/ui, the dominance of TypeScript, and the emerging interest in Signals.",
    content: "State of JS 2024 shows a clear trend towards 'vibe-driven' development, where DX and component-first architectures (like shadcn/ui) are winning over traditional frameworks.",
    category: "Articles",
    type: "Article",
    readTime: "10 min read",
    date: "2026-01-20",
    author: "Sacha Greif",
    authorImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    tags: ["#javascript", "#survey", "#webdev"],
    externalLink: "https://2024.stateofjs.com/"
  },
  {
    id: 8,
    title: "Building Real-time AI Apps with o3-mini and WebSockets",
    summary: "Learn how to leverage the reasoning power of o3-mini in real-time streaming applications using modern WebSocket architectures.",
    content: "A technical guide on integrating OpenAI's o3-mini model into interactive applications, focusing on low-latency streaming of complex reasoning chains.",
    category: "Videos",
    type: "Video",
    readTime: "15:30 min",
    date: "2026-02-06",
    author: "Marcus Thorne",
    authorImage: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=100&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
    tags: ["#ai", "#websockets", "#tutorial"],
    externalLink: "https://youtube.com/watch?v=example"
  },
  {
    id: 9,
    title: "TypeScript 5.8: Erased Syntax and Improved Performance",
    summary: "TypeScript 5.8 is in beta, introducing new flags for erasable syntax and further narrowing the gap between TS and JS execution.",
    content: "TypeScript 5.8 focuses on better support for native JS features and reducing the 'impedance mismatch' between types and runtime code.",
    category: "Tools",
    type: "Article",
    readTime: "7 min read",
    date: "2026-02-01",
    author: "Anders Hejlsberg",
    authorImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1200&auto=format&fit=crop",
    tags: ["#typescript", "#javascript", "#programming"],
    externalLink: "https://devblogs.microsoft.com/typescript/announcing-typescript-5-8/"
  },
  {
    id: 10,
    title: "The Rise of Local LLMs for Coding",
    summary: "How developers are using DeepSeek-R1 and Llama 3 locally to ensure privacy and offline availability without losing intelligence.",
    content: "A look at the tools and workflows for running high-performance coding assistants on personal hardware, featuring Ollama and LM Studio.",
    category: "Articles",
    type: "Article",
    readTime: "9 min read",
    date: "2026-02-07",
    author: "Sarah Chen",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
    imageUrl: "https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=1200&auto=format&fit=crop",
    tags: ["#ai", "#localllm", "#privacy"],
    externalLink: "https://example.com/local-llms"
  }
];

export const trendingTopics = [
  { id: 1, name: "#tailwindcss", count: "1.2k readers today", color: "text-primary" },
  { id: 2, name: "#deepseek", count: "856 discussions", color: "text-brand-teal" },
  { id: 3, name: "#openai", count: "43 active tools", color: "text-deep-charcoal" },
  { id: 4, name: "#react", count: "512 stories", color: "text-primary" },
  { id: 5, name: "#typescript", count: "212 updates", color: "text-brand-teal" }
];
