import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getIQColor = (iq: number | undefined): string => {
  if (iq == undefined) return "text-iq-low";
  if (iq >= 180) return "text-iq-genius";
  if (iq >= 140) return "text-iq-high";
  if (iq >= 100) return "text-iq-average";
  return "text-iq-low";
};

export const getIQCategory = (iq: number | undefined): string => {
  if (iq == undefined) return "LOW";
  if (iq >= 180) return "GENIUS";
  if (iq >= 140) return "HIGH";
  if (iq >= 100) return "AVERAGE";
  return "LOW";
};

export const formatDate = (date: string): string => {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "now";
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;

  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return readTime === 0 ? 1 : readTime;
};
