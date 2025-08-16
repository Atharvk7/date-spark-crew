import { Profile } from '../types';

/**
 * Utility functions for filtering profiles in the dashboard
 */

/**
 * Calculate age from date of birth string
 * @param dateOfBirth - Date string in YYYY-MM-DD format
 * @returns Age in years
 */
export function calculateAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Filter profiles by age range
 * @param profiles - Array of profiles to filter
 * @param ageRange - Age range string ('18-25', '26-30', etc.)
 * @returns Filtered profiles array
 */
export function filterByAge(profiles: Profile[], ageRange: string): Profile[] {
  if (ageRange === 'all') return profiles;
  
  return profiles.filter(profile => {
    const age = calculateAge(profile.dateOfBirth);
    switch (ageRange) {
      case '18-25': return age >= 18 && age <= 25;
      case '26-30': return age >= 26 && age <= 30;
      case '31-35': return age >= 31 && age <= 35;
      case '36-40': return age >= 36 && age <= 40;
      case '40+': return age > 40;
      default: return true;
    }
  });
}

/**
 * Filter profiles by city
 * @param profiles - Array of profiles to filter
 * @param city - City name to filter by
 * @returns Filtered profiles array
 */
export function filterByCity(profiles: Profile[], city: string): Profile[] {
  if (city === 'all') return profiles;
  return profiles.filter(profile => profile.city === city);
}

/**
 * Filter profiles by gender
 * @param profiles - Array of profiles to filter
 * @param gender - Gender to filter by ('Male', 'Female')
 * @returns Filtered profiles array
 */
export function filterByGender(profiles: Profile[], gender: string): Profile[] {
  if (gender === 'all') return profiles;
  return profiles.filter(profile => profile.gender === gender);
}

/**
 * Filter profiles by marital status
 * @param profiles - Array of profiles to filter
 * @param status - Marital status to filter by
 * @returns Filtered profiles array
 */
export function filterByMaritalStatus(profiles: Profile[], status: string): Profile[] {
  if (status === 'all') return profiles;
  return profiles.filter(profile => profile.maritalStatus === status);
}

/**
 * Search profiles by name or city
 * @param profiles - Array of profiles to search
 * @param searchTerm - Search term to match against
 * @returns Filtered profiles array
 */
export function searchProfiles(profiles: Profile[], searchTerm: string): Profile[] {
  if (!searchTerm.trim()) return profiles;
  
  const term = searchTerm.toLowerCase();
  return profiles.filter(profile =>
    profile.firstName.toLowerCase().includes(term) ||
    profile.lastName.toLowerCase().includes(term) ||
    profile.city.toLowerCase().includes(term)
  );
}

/**
 * Get unique cities from profiles array
 * @param profiles - Array of profiles
 * @returns Sorted array of unique city names
 */
export function getUniqueCities(profiles: Profile[]): string[] {
  return Array.from(new Set(profiles.map(p => p.city))).sort();
}

/**
 * Apply all filters to profiles array
 * @param profiles - Original profiles array
 * @param filters - Object containing all filter values
 * @returns Filtered profiles array
 */
export function applyAllFilters(
  profiles: Profile[],
  filters: {
    activeFilter: 'all' | 'male' | 'female' | 'never-married';
    ageFilter: string;
    cityFilter: string;
    searchTerm: string;
  }
): Profile[] {
  let filtered = profiles;

  // Apply gender/marital status filter
  if (filters.activeFilter === 'male') {
    filtered = filterByGender(filtered, 'Male');
  } else if (filters.activeFilter === 'female') {
    filtered = filterByGender(filtered, 'Female');
  } else if (filters.activeFilter === 'never-married') {
    filtered = filterByMaritalStatus(filtered, 'Never Married');
  }

  // Apply age filter
  filtered = filterByAge(filtered, filters.ageFilter);

  // Apply city filter
  filtered = filterByCity(filtered, filters.cityFilter);

  // Apply search filter
  filtered = searchProfiles(filtered, filters.searchTerm);

  return filtered;
}
