# Xitter

This is a fullstack parody of X (formerly Twitter), designed to showcase both technical skill and creativity built with Next.js, Prisma, and Tailwind CSS.

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/xitter.git
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up the database:**
   - Create a PostgreSQL database.
   - Copy the `.env.example` file to `.env` and fill in the database URL and other environment variables.

4. **Run the database migrations:**

   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server:**

   ```bash
   npm run dev
   ```

## Code Formatting

This project uses Prettier for code formatting. To format your code, run:

```bash
npm run format
```
