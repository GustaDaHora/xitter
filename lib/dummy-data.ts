import { User, Post, Comment } from "@/types";

export const dummyUsers: User[] = [
  {
    id: "1",
    username: "einstein_reborn",
    email: "albert@iqx.com",
    displayName: "Albert E.",
    iq: 195,
    bio: "Theoretical physicist exploring the quantum realm of social media. E=mc²",
    joinedAt: new Date("2024-01-15"),
    followersCount: 15420,
    followingCount: 42,
  },
  {
    id: "2",
    username: "neural_nexus",
    email: "ada@iqx.com",
    displayName: "Ada L.",
    iq: 178,
    bio: "AI researcher by day, philosopher by night. Building the future, one algorithm at a time.",
    joinedAt: new Date("2024-02-20"),
    followersCount: 8930,
    followingCount: 156,
  },
  {
    id: "3",
    username: "quantum_thinker",
    email: "marie@iqx.com",
    displayName: "Marie C.",
    iq: 156,
    bio: "Chemistry enthusiast discovering patterns in chaos. Two-time Nobel laureate energy.",
    joinedAt: new Date("2024-03-10"),
    followersCount: 12750,
    followingCount: 89,
  },
  {
    id: "4",
    username: "code_philosopher",
    email: "alan@iqx.com",
    displayName: "Alan T.",
    iq: 134,
    bio: "Computing the meaning of existence. Breaking codes and building minds.",
    joinedAt: new Date("2024-01-28"),
    followersCount: 6420,
    followingCount: 201,
  },
  {
    id: "5",
    username: "cosmic_observer",
    email: "carl@iqx.com",
    displayName: "Carl S.",
    iq: 142,
    bio: "We are made of star stuff, contemplating the stars. Science communicator extraordinaire.",
    joinedAt: new Date("2024-02-14"),
    followersCount: 24680,
    followingCount: 67,
  },
];

export const dummyPosts: Post[] = [
  {
    id: "1",
    title: "The quantum nature of social consciousness",
    content:
      "Just realized that social media operates on quantum principles. Each post exists in a superposition of viral and ignored until observed by the algorithm. The uncertainty principle applies: the more precisely you try to predict engagement, the less you can determine the quality of content. Maybe we need a Copenhagen interpretation of Twitter...",
    author: dummyUsers[0],
    publishedAt: new Date("2024-07-20T14:30:00"),
    readTime: 3,
    likesCount: 420,
    commentsCount: 69,
  },
  {
    id: "2",
    title: "Why AI will never replace human stupidity",
    content:
      "Hot take: The greatest competitive advantage humans have over AI isn't our intelligence—it's our capacity for magnificent, creative stupidity. AI can optimize, but can it create a TikTok dance? Can it argue about pineapple on pizza with religious fervor? Can it spend 3 hours debugging code only to find a missing semicolon? I think not.",
    author: dummyUsers[1],
    publishedAt: new Date("2024-07-20T11:15:00"),
    readTime: 2,
    likesCount: 1337,
    commentsCount: 234,
  },
  {
    id: "3",
    title: "Cooking chemistry: Why your pasta water needs salt",
    content:
      "PSA: Adding salt to pasta water isn't just for flavor—it's pure chemistry! Salt raises the boiling point (though negligibly), but more importantly, it helps denature proteins and improve texture through ionic interactions with starch molecules. The real magic happens when salt ions disrupt hydrogen bonds...",
    author: dummyUsers[2],
    publishedAt: new Date("2024-07-19T18:45:00"),
    readTime: 4,
    likesCount: 892,
    commentsCount: 156,
  },
  {
    id: "4",
    title: "The halting problem of social media algorithms",
    content:
      "Social media feeds are essentially unsolvable halting problems. You can't determine if you'll ever reach the 'end' of content or if you'll scroll infinitely. The algorithm keeps feeding you content based on engagement patterns, creating an undecidable loop. Maybe infinite scroll was the real Turing test all along.",
    author: dummyUsers[3],
    publishedAt: new Date("2024-07-19T16:20:00"),
    readTime: 3,
    likesCount: 567,
    commentsCount: 89,
  },
  {
    id: "5",
    title: "We are all made of recycled stardust arguing online",
    content:
      "Mind-blowing thought: Every carbon atom in your angry tweet was forged in the nuclear furnace of a dying star billions of years ago. Those same atoms have been part of dinosaurs, trees, ancient humans, and now they're here, expressing opinions about pineapple pizza. We are literally the universe arguing with itself about trivial matters. How cosmic is that?",
    author: dummyUsers[4],
    publishedAt: new Date("2024-07-19T12:10:00"),
    readTime: 2,
    likesCount: 2420,
    commentsCount: 378,
  },
];

export const dummyComments: Comment[] = [
  {
    id: "1",
    content:
      "This is brilliant! Never thought about social media in quantum terms. Does this mean when my post gets ignored, it was never actually funny in the first place?",
    author: dummyUsers[1],
    publishedAt: new Date("2024-07-20T14:45:00"),
    likesCount: 42,
  },
  {
    id: "2",
    content:
      "I disagree with the premise. The observer effect requires consciousness, and I question whether algorithms are truly conscious observers...",
    author: dummyUsers[3],
    publishedAt: new Date("2024-07-20T15:10:00"),
    likesCount: 23,
  },
  {
    id: "3",
    content:
      "Schrödinger's tweet: simultaneously cringe and based until someone reads it 😂",
    author: dummyUsers[2],
    publishedAt: new Date("2024-07-20T15:30:00"),
    likesCount: 89,
  },
];

export const currentUser: User = dummyUsers[0];

export const getIQColor = (iq: number): string => {
  if (iq >= 180) return "text-iq-genius";
  if (iq >= 140) return "text-iq-high";
  if (iq >= 100) return "text-iq-average";
  return "text-iq-low";
};

export const getIQCategory = (iq: number): string => {
  if (iq >= 180) return "GENIUS";
  if (iq >= 140) return "HIGH";
  if (iq >= 100) return "AVERAGE";
  return "LOW";
};

export const truncateContent = (content: string, maxLength: number): string => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + "...";
};

export const formatDate = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "now";
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
