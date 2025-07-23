Xitter is a fullstack parody of X (formerly Twitter), designed to showcase both technical skill and creativity. The core twist is that users must take a short IQ test before participating. Their IQ score is then publicly displayed next to their name on every post, adding a humorous and competitive edge to the platform.

The frontend is built using Next.js with the App Router and styled with Tailwind CSS. Authentication is handled with NextAuth.js, allowing login via email or social providers. Users are required to log in to take the IQ test or create posts. The IQ test consists of 10 to 15 multiple-choice logic questions, either stored statically or in a database. After completion, the score is calculated on the backend and stored in the database along with the user profile.

The backend is powered by API routes in Next.js. Data is stored using Prisma ORM with a PostgreSQL. The schema includes a User model with fields for email, name, and IQ score, and a Post model with content and timestamps.

Users can view a timeline of posts, each displaying the author's username and IQ score. A profile page allows users to view their IQ score, biography, and post history, as well as update their information, suchs as name, email, or password. Additionally, create an IQ leaderboard for users to retake the test. The homepage will feature a post feed in the center, with side components displaying followed users. A login page will also be included, allowing users to log in via email or social media providers. When a user clicks on a post, they will be directed to the post's page, where a commentary section will be located below, with each comment displaying the author's username and IQ score. Ensure that the front end is designed in the cleanest way possible, using dark mode and avoiding complex designs. Make sure to create only the front end with dummy or placeholder structure when needed. Use Lucide react as much as you want for the icons, and feel free to go beyond the requested things, featuring more things that would fit in a X parody.

This project demonstrates fullstack proficiency: frontend UI/UX, backend logic, authentication, data persistence, and deployment. Hosted on Vercel, and optionally using Supabase or PlanetScale for database services, Xitter is a unique and technically sound portfolio piece that stands out through originality and engagement.
Second Step: Backend Architecture and Integration
With the frontend foundation of Xitter in place, the next step is to implement a robust backend that enables authentication, IQ test evaluation, user and post management, and dynamic data handling across the app.

The backend is built using Next.js API routes under the `/app/api` directory, in combination with Server Actions for seamless form handling and data mutations. This architecture ensures tight integration between client and server, reduced client-side boilerplate, and full compatibility with the Next.js App Router paradigm.

Authentication is implemented using NextAuth.js, supporting both email login and OAuth providers such as GitHub and Google. Only authenticated users can submit IQ tests, create posts, or comment. The session is accessed via `getServerSession` to authorize backend actions and route handlers.

The database layer uses Prisma ORM connected to a PostgreSQL database hosted on Supabase, ensuring type-safe and scalable data operations. Prisma is initialized in a dedicated `lib/prisma.ts` file, and all models are version-controlled using Prisma migrations.

The core schema includes:

User

`id`, `email`, `name`, `username`, `image`, `bio`
`iqScore`, `iqTestDate`
Timestamps: `createdAt`, `updatedAt`

Post

`id`, `title`, `content`, `createdAt`
`authorId` (relation to `User`)
`views` and `likes` (for future leaderboard features)

Comment

`id`, `content`, `createdAt`, `authorId`, `postId`

IQTestSubmission

`id`, `userId`, `score`, `submittedAt`, `duration`

IQ test questions are stored statically in a JSON file. A dedicated API route serves the question set (`GET /api/iq/questions`). Upon submission, the user's answers are sent to a `POST /api/iq/submit` endpoint, where the backend calculates the IQ score, stores it in the `User` model, and creates an entry in the `IQTestSubmission` table for audit purposes. Users can retake the test once every 30 days, enforced by a server-side check using the `iqTestDate` field.

All CRUD operations for posts and user data are managed through API routes and server actions. Server actions are used for creating posts, submitting forms, and updating user information. API routes are used for data fetching, with static caching or ISR where applicable.

For the timeline, posts are fetched server-side and paginated using cursor-based pagination. This enables efficient infinite scrolling on the frontend. Posts are sorted by default to show the most recent, with server-side filtering available for “highest IQ” and “lowest IQ” modes, using indexed queries for performance.

Each post displays:

Title (max 69 characters)
Truncated content preview (max 420 characters)
Published date and calculated read time
Author's username and IQ score, both styled for visibility

When a user clicks on a post, they are taken to a dedicated post page. Comments on this page are fetched server-side and displayed using infinite scroll. Each comment includes the author’s username and IQ score.

The user profile page is also fully server-rendered and protected via middleware. It displays the user’s IQ score, bio, and post history, along with forms to update name, email, password, and profile picture using server actions with real-time validation feedback.

A global IQ leaderboard is implemented with a paginated API route (`/api/leaderboard`) that returns the top 100 users by IQ score, ordered descending. This route is cached and revalidated on a short interval to ensure up-to-date results while maintaining performance.

All backend functionality is protected via authentication middleware, Prisma-level access control, and server-verified logic. Data writes are only allowed for authenticated sessions, and invalid access attempts are redirected or rejected server-side.

This step establishes the backend foundation for Xitter, enabling secure, scalable, and modern fullstack operations. With Supabase for hosting, Prisma for modeling, Next.js Server Actions for mutation, and API routes for query, the app is built on top of battle-tested, job-ready tools — reinforcing its purpose as a serious and well-rounded portfolio project.

---
**Current Status and Remaining Tasks:**

**Backend:**
*   **Prisma Schema:** `IQTestSubmission` and `Like` models added, and `User` and `Post` models corrected. `User` model updated with `password` field.
*   **IQ Test Submission:** 30-day cooldown implemented in `/api/iq/submit`.
*   **User Profile API:** `/api/user` for updating user profiles implemented. `/api/user/[id]` for fetching public user profiles implemented.
*   **Post API:** `/api/posts` (fetch/create) and `/api/posts/[id]` (fetch/update/delete) implemented. `comments` relation now included in `GET` requests.
*   **Comment API:** `/api/posts/[id]/comments` (fetch/create) and `/api/comments/[commentId]` (update/delete) implemented.
*   **Like API:** `/api/posts/[id]/like` (like/unlike) and `/api/posts/[id]/like/status` (check like status) implemented.
*   **IQ Leaderboard API:** `/api/leaderboard` implemented.
*   **User Registration API:** `/api/register` implemented with password hashing.

**Frontend Integration (Remaining Issues):**
*   **Profile Update:** `app/profile/page.tsx` updated to call `/api/user` for profile updates and refresh session. Bio display issue resolved.
*   **Post Creation/Fetching:** `app/page.tsx` updated to fetch posts from `/api/posts` and create new posts via `/api/posts`. `PostCard` updated to link to public profiles and display correct author info. Like functionality integrated.
*   **IQ Test Submission:** `app/iq-test/page.tsx` calls `/api/iq/submit`. The issue of results not saving might be related to `session.user.id` in the backend or the `iqTestDate` check. Further debugging may be required.
*   **Post Detail Page:** `app/postdetail/page.tsx` updated to fetch post and comments from backend, and integrate like functionality. `readTime` calculation implemented.
*   **Following Page:** `app/following/page.tsx` updated to fetch posts from backend.
*   **Leaderboard Page:** `app/leaderboard/page.tsx` updated to fetch data from the `/api/leaderboard` endpoint.
*   **Trending Page:** `app/trending/page.tsx` updated to fetch posts from backend.
*   **Sidebar:** `components/layout/sidebar.tsx` updated to fetch suggested users and user stats from backend.
*   **Dummy Data:** All dummy data removed from frontend components and replaced with backend API calls.
*   **Login/Registration:** `app/login/page.tsx` updated to use the new registration API and NextAuth.js credentials provider.
*   **Server Actions:** Not yet implemented. The `proposition.md` mentions using Server Actions for form handling and data mutations. This is a significant remaining task.
*   **Error Handling/UI Feedback:** Implement more robust error handling and user feedback in the frontend for all API interactions.
*   **Views:** Implement functionality for views on posts.
*   **Follow/Unfollow:** Implement follow/unfollow functionality.
*   **Password Change:** Implement password change functionality on the profile page.
*   **Profile Picture Update:** Implement profile picture update functionality on the profile page.
*   **Usernames:** Ensure usernames are properly handled and displayed throughout the application.
*   **Middleware Protection:** Verify all protected routes are correctly guarded by authentication middleware.
*   **Static Caching/ISR:** Implement static caching or ISR for API routes where applicable.
*   **Deployment:** Prepare for deployment on Vercel.
