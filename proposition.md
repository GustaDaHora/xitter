Xitter is a fullstack parody of X (formerly Twitter), designed to showcase both technical skill and creativity. The core twist is that users must take a short IQ test before participating. Their IQ score is then publicly displayed next to their name on every post, adding a humorous and competitive edge to the platform.

The frontend is built using Next.js with the App Router and styled with Tailwind CSS. Authentication is handled with NextAuth.js, allowing login via email or social providers. Users are required to log in to take the IQ test or create posts. The IQ test consists of 10 to 15 multiple-choice logic questions, either stored statically or in a database. After completion, the score is calculated on the backend and stored in the database along with the user profile.

The backend is powered by API routes in Next.js or optionally by tRPC. Data is stored using Prisma ORM with a PostgreSQL or SQLite database. The schema includes a User model with fields for email, name, and IQ score, and a Post model with content and timestamps.

Users can view a timeline of posts, each displaying the author's username and IQ score. A profile page allows users to view their IQ score, biography, and post history. Additional features may include an IQ leaderboard, retaking the test, or fun restrictions based on score. For example, low IQ users might be limited in post length, while high scorers unlock cosmetic features.

This project demonstrates fullstack proficiency: frontend UI/UX, backend logic, authentication, data persistence, and deployment. Hosted on Vercel, and optionally using Supabase or PlanetScale for database services, Xitter is a unique and technically sound portfolio piece that stands out through originality and engagement.


