import { Profile } from '../types';

/**
 * Utility functions for profile management and display
 */

/**
 * Get marital status badge color based on status
 * @param status - Marital status string
 * @returns CSS classes for badge styling
 */
export function getMaritalStatusColor(status: string): string {
  switch (status) {
    case 'Never Married':
      return 'bg-green-100 text-green-800';
    case 'Divorced':
      return 'bg-yellow-100 text-yellow-800';
    case 'Widowed':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
}

/**
 * Generate initials from first and last name
 * @param firstName - First name
 * @param lastName - Last name
 * @returns Two-character initials string
 */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/**
 * Format full name from profile
 * @param profile - Profile object
 * @returns Formatted full name string
 */
export function getFullName(profile: Profile): string {
  return `${profile.firstName} ${profile.lastName}`;
}

/**
 * Get profile statistics from array of profiles
 * @param profiles - Array of profiles
 * @returns Object containing various statistics
 */
export function getProfileStatistics(profiles: Profile[]) {
  return {
    total: profiles.length,
    male: profiles.filter(p => p.gender === 'Male').length,
    female: profiles.filter(p => p.gender === 'Female').length,
    neverMarried: profiles.filter(p => p.maritalStatus === 'Never Married').length,
    cities: Array.from(new Set(profiles.map(p => p.city))).length,
    averageAge: Math.round(
      profiles.reduce((sum, p) => {
        const birthDate = new Date(p.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return sum + age;
      }, 0) / profiles.length
    )
  };
}

/**
 * Validate profile data completeness
 * @param profile - Profile object to validate
 * @returns Object with validation results
 */
export function validateProfile(profile: Profile): {
  isValid: boolean;
  missingFields: string[];
  completionPercentage: number;
} {
  const requiredFields = [
    'firstName', 'lastName', 'dateOfBirth', 'gender', 'city', 
    'country', 'religion', 'maritalStatus', 'designation'
  ];
  
  const missingFields = requiredFields.filter(field => 
    !profile[field as keyof Profile] || 
    String(profile[field as keyof Profile]).trim() === ''
  );
  
  const completionPercentage = Math.round(
    ((requiredFields.length - missingFields.length) / requiredFields.length) * 100
  );
  
  return {
    isValid: missingFields.length === 0,
    missingFields,
    completionPercentage
  };
}
