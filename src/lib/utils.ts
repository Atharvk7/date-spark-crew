import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Profile } from "../types";
import { maleProfileImages, femaleProfileImages } from '../data/stockImages';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a consistent index from a string
const getIndexFromString = (str: string, arrayLength: number) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash) % arrayLength;
};

// Generate dummy profile image URL based on profile data
export const getProfileImageUrl = (profile: Profile) => {
  const images = profile.gender === 'Male' ? maleProfileImages : femaleProfileImages;
  const index = getIndexFromString(profile.id, images.length);
  return images[index];
};
