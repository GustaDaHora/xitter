# Xitter 🐦

> **"The premier platform for high-IQ discourse."**

Xitter is a full-stack parody of X (formerly Twitter) built to showcase modern web development skills with a satirical twist. Beyond standard social features, it introduces a "meritocratic" system where your engagement power is tied to your **IQ Score**.

![Xitter Preview](https://placehold.co/1200x600/101010/FFFFFF/png?text=Xitter+Preview+Placeholder)

## ✨ Features

### 🔐 Authentication & Profiles
- **Secure Login**: Powered by NextAuth.js.
- **User Profiles**: Custom bios, avatars, and detailed stats.
- **IQ Testing**: Users must take a built-in IQ test to determine their "social standing" on the platform.

### 📝 Content Creation
- **Strict Limits**: Titles are capped at **69** characters and content at **420** characters for maximum efficiency.
- **Rich Interaction**: Create posts, comment on threads, and engage with the community.

### 🤝 Social Engagement
- **Follow System**: Build your network by following other "intellectuals."
- **Reactions**: Like posts to boost their visibility.
- **Activity Feed**: A personalized feed of content from people you follow.
- **Global Reach**: Discover what's popular in the **Trending** section.

### 🏆 Gamification
- **Leaderboards**: Compete for the top spot based on IQ score and engagement metrics.
- **Notifications**: Real-time alerts for likes, comments, and new followers.

## 🛠️ Tech Stack

Built with the cutting-edge **T3 Stack** philosophy:

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router & Server Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Prisma ORM](https://www.prisma.io/))
- **Caching**: [Redis](https://redis.io/) (for high-performance data patterns)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis (optional, but recommended for full features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gu_dahora/xitter.git
   cd xitter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy the example environment file and configure your variables:
   ```bash
   cp .env.example .env
   ```
   *Make sure to fill in `DATABASE_URL`, `NEXTAUTH_SECRET`, and `DIRECT_URL`.*

4. **Database Setup**
   Run migrations to set up your schema:
   ```bash
   npx prisma migrate dev
   ```

5. **Run the application**
   Start the development server:
   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000` to start Xitting.

## 🏗️ Architecture

This project utilizes the **Next.js App Router** for a modern, server-first approach.

- **`/app`**: Contains all routes, pages, and layouts.
- **`/components`**: Reusable UI components (buttons, cards, modals).
- **`/prisma`**: Database schema and migration history.
- **`/lib`**: Utility functions, shared logic, and configuration.
- **Server Actions**: Mutations (posting, liking, following) are handled via Next.js Server Actions for type safety and reduced client-side JavaScript.

## 🤝 Contributing

Contributions are welcome! If you have a funny idea or a bug fix, feel free to open a PR.

## 👤 Author

Developed by **[Gu DaHora](https://github.com/gu_dahora)**.

---
*Disclaimer: This is a parody project for educational and portfolio purposes.*
