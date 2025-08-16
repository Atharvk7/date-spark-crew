import { Customer } from './aiUtils';

/**
 * Calculate compatibility score between two customers (0-100)
 * Implements gender-specific matching principles
 */
export function calculateCompatibilityScore(customer: Customer, match: Customer): number {
  let score = 0;
  const maxScore = 100;

  // Basic compatibility checks
  if (customer.gender === match.gender) {
    return 0; // Same gender - no match
  }

  const customerAge = getAge(customer.dateOfBirth);
  const matchAge = getAge(match.dateOfBirth);

  if (customer.gender === 'Male') {
    // For male customers: Match with women who are younger, earn less, shorter, and have matching views on children
    
    // Age preference - younger women (higher score for younger matches)
    if (matchAge < customerAge) {
      const ageDiff = customerAge - matchAge;
      if (ageDiff <= 5) score += 25; // Ideal age gap
      else if (ageDiff <= 10) score += 20;
      else if (ageDiff <= 15) score += 15;
      else score += 10;
    } else if (matchAge === customerAge) {
      score += 15; // Same age is acceptable
    } else {
      score += 5; // Older women get lower score
    }

    // Income preference - women who earn less
    if (customer.income > match.income) {
      const incomeRatio = match.income / customer.income;
      if (incomeRatio <= 0.5) score += 20; // Significantly less
      else if (incomeRatio <= 0.75) score += 15; // Moderately less
      else score += 10; // Slightly less
    } else {
      score += 5; // Equal or higher income gets lower score
    }

    // Height preference - shorter women
    if (customer.height > match.height) {
      const heightDiff = customer.height - match.height;
      if (heightDiff >= 10) score += 15; // Good height difference
      else if (heightDiff >= 5) score += 12;
      else score += 8;
    } else {
      score += 3; // Same or taller height gets lower score
    }

    // Children views - must match exactly for males
    if (customer.wantKids === match.wantKids) {
      score += 20; // Critical match for males
    } else if (customer.wantKids === 'Maybe' || match.wantKids === 'Maybe') {
      score += 10;
    } else {
      score += 2; // Major mismatch
    }

  } else {
    // For female customers: Use thoughtful logic - compatibility on profession, values, relocation preferences
    
    // Professional compatibility - similar or complementary fields
    if (isProfessionallyCompatible(customer.designation, match.designation)) {
      score += 20;
    } else {
      score += 10;
    }

    // Values compatibility (religion, family planning)
    if (customer.religion === match.religion) {
      score += 18; // Strong values alignment
    } else {
      score += 8;
    }

    // Family planning alignment
    if (customer.wantKids === match.wantKids) {
      score += 18;
    } else if (customer.wantKids === 'Maybe' || match.wantKids === 'Maybe') {
      score += 12;
    } else {
      score += 5;
    }

    // Relocation compatibility - very important for females
    if (customer.openToRelocate === match.openToRelocate) {
      score += 15;
    } else if (customer.openToRelocate === 'Yes' || match.openToRelocate === 'Yes') {
      score += 12; // One is flexible
    } else {
      score += 5;
    }

    // Age compatibility (more flexible for females)
    const ageDiff = Math.abs(customerAge - matchAge);
    if (ageDiff <= 5) score += 12;
    else if (ageDiff <= 10) score += 10;
    else if (ageDiff <= 15) score += 8;
    else score += 5;

    // Education level compatibility
    if (customer.degree === match.degree) {
      score += 8;
    } else {
      score += 5;
    }
  }

  // Common factors for both genders
  
  // Location compatibility
  if (customer.city === match.city) {
    score += 10;
  } else if (customer.country === match.country) {
    score += 7;
  } else {
    score += 3;
  }

  // Pets compatibility
  if (customer.openToPets === match.openToPets) {
    score += 5;
  } else if (customer.openToPets === 'Maybe' || match.openToPets === 'Maybe') {
    score += 3;
  } else {
    score += 1;
  }

  // Marital status compatibility
  if (customer.maritalStatus === match.maritalStatus) {
    score += 5;
  } else {
    score += 2;
  }

  // Cap the score at maxScore
  return Math.min(score, maxScore);
}

/**
 * Check if two professions are compatible
 */
function isProfessionallyCompatible(profession1: string, profession2: string): boolean {
  const techFields = ['Software Engineer', 'Data Scientist', 'Product Manager', 'Developer', 'Analyst'];
  const businessFields = ['Marketing Manager', 'Sales Manager', 'Business Analyst', 'Consultant'];
  const creativeFields = ['Designer', 'Writer', 'Artist', 'Photographer'];
  const medicalFields = ['Doctor', 'Nurse', 'Pharmacist', 'Therapist'];
  const educationFields = ['Teacher', 'Professor', 'Researcher', 'Trainer'];
  
  const getFieldCategory = (profession: string) => {
    if (techFields.some(field => profession.includes(field))) return 'tech';
    if (businessFields.some(field => profession.includes(field))) return 'business';
    if (creativeFields.some(field => profession.includes(field))) return 'creative';
    if (medicalFields.some(field => profession.includes(field))) return 'medical';
    if (educationFields.some(field => profession.includes(field))) return 'education';
    return 'other';
  };
  
  const category1 = getFieldCategory(profession1);
  const category2 = getFieldCategory(profession2);
  
  // Same field or complementary fields are compatible
  return category1 === category2 || 
         (category1 === 'tech' && category2 === 'business') ||
         (category1 === 'business' && category2 === 'tech') ||
         (category1 === 'creative' && category2 === 'business');
}

/**
 * Get top matches for a customer based on gender-specific preferences
 */
export function getTopMatches(customer: Customer, allCustomers: Customer[], limit: number = 10): Customer[] {
  // Filter out same gender and the customer themselves
  let potentialMatches = allCustomers.filter(match => 
    match.id !== customer.id && 
    match.gender !== customer.gender
  );

  // Apply gender-specific pre-filtering
  if (customer.gender === 'Male') {
    // For males: pre-filter to focus on core preferences
    const customerAge = getAge(customer.dateOfBirth);
    potentialMatches = potentialMatches.filter(match => {
      const matchAge = getAge(match.dateOfBirth);
      // Prefer younger or same age women, with some flexibility
      return matchAge <= customerAge + 3 && 
             match.income <= customer.income * 1.2 && // Some income flexibility
             match.height <= customer.height + 5; // Some height flexibility
    });
  } else {
    // For females: focus on values and compatibility factors
    potentialMatches = potentialMatches.filter(match => {
      // Basic filters for female customers
      return match.religion === customer.religion || 
             customer.religion === 'Other' || 
             match.religion === 'Other' || 
             customer.openToRelocate === 'Yes' || 
             match.openToRelocate === 'Yes';
    });
  }

  // Calculate scores for all potential matches
  const matchesWithScores = potentialMatches.map(match => ({
    customer: match,
    score: calculateCompatibilityScore(customer, match)
  }));

  // Sort by score (highest first) and return top matches
  return matchesWithScores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.customer);
}

/**
 * Calculate age from date of birth
 */
function getAge(dateOfBirth: string): number {
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
 * Get match status tag based on score
 */
export function getMatchStatusTag(score: number): { text: string; color: string } {
  if (score >= 80) return { text: 'Excellent Match', color: 'bg-green-100 text-green-800' };
  if (score >= 60) return { text: 'Good Match', color: 'bg-blue-100 text-blue-800' };
  if (score >= 40) return { text: 'Fair Match', color: 'bg-yellow-100 text-yellow-800' };
  return { text: 'Basic Match', color: 'bg-gray-100 text-gray-800' };
}

/**
 * Get advanced compatibility insights based on gender-specific matching principles
 */
export function getCompatibilityInsights(customer: Customer, match: Customer): {
  strengths: string[];
  considerations: string[];
  recommendations: string[];
} {
  const insights = {
    strengths: [] as string[],
    considerations: [] as string[],
    recommendations: [] as string[]
  };

  const customerAge = getAge(customer.dateOfBirth);
  const matchAge = getAge(match.dateOfBirth);

  if (customer.gender === 'Male') {
    // Male-specific insights
    
    // Age compatibility
    if (matchAge < customerAge) {
      const ageDiff = customerAge - matchAge;
      if (ageDiff <= 5) {
        insights.strengths.push('Ideal age gap - she is younger');
      } else if (ageDiff <= 10) {
        insights.strengths.push('Good age compatibility');
      } else {
        insights.considerations.push('Significant age difference');
        insights.recommendations.push('Ensure maturity levels align');
      }
    } else if (matchAge === customerAge) {
      insights.strengths.push('Same age - similar life stage');
    } else {
      insights.considerations.push('She is older');
      insights.recommendations.push('Discuss comfort with age dynamics');
    }

    // Income compatibility
    if (customer.income > match.income) {
      insights.strengths.push('Traditional income dynamic - you earn more');
    } else {
      insights.considerations.push('She earns equal or more');
      insights.recommendations.push('Discuss financial roles and expectations');
    }

    // Height compatibility
    if (customer.height > match.height) {
      insights.strengths.push('Good height compatibility - you are taller');
    } else {
      insights.considerations.push('Similar or she is taller');
      insights.recommendations.push('Ensure comfort with height dynamics');
    }

    // Children views
    if (customer.wantKids === match.wantKids) {
      insights.strengths.push('Perfect alignment on having children');
    } else {
      insights.considerations.push('Different views on children');
      insights.recommendations.push('Critical discussion needed about family planning');
    }

  } else {
    // Female-specific insights
    
    // Professional compatibility
    if (isProfessionallyCompatible(customer.designation, match.designation)) {
      insights.strengths.push('Professionally compatible careers');
    } else {
      insights.considerations.push('Different professional backgrounds');
      insights.recommendations.push('Explore how careers can complement each other');
    }

    // Values alignment
    if (customer.religion === match.religion) {
      insights.strengths.push('Strong values alignment - same religion');
    } else {
      insights.considerations.push('Different religious backgrounds');
      insights.recommendations.push('Discuss religious practices and values');
    }

    // Relocation compatibility
    if (customer.openToRelocate === match.openToRelocate) {
      insights.strengths.push('Aligned on relocation preferences');
    } else if (customer.openToRelocate === 'Yes' || match.openToRelocate === 'Yes') {
      insights.strengths.push('Flexibility in relocation');
    } else {
      insights.considerations.push('Both prefer not to relocate');
      insights.recommendations.push('Discuss long-term location plans');
    }

    // Family planning
    if (customer.wantKids === match.wantKids) {
      insights.strengths.push('Aligned on family planning');
    } else {
      insights.considerations.push('Different views on having children');
      insights.recommendations.push('Important discussion about family goals');
    }

    // Age compatibility (more flexible approach)
    const ageDiff = Math.abs(customerAge - matchAge);
    if (ageDiff <= 5) {
      insights.strengths.push('Similar age - compatible life stage');
    } else if (ageDiff <= 10) {
      insights.strengths.push('Reasonable age difference');
    } else {
      insights.considerations.push('Notable age difference');
      insights.recommendations.push('Discuss life goals and timelines');
    }
  }

  // Common insights for both genders
  
  // Location compatibility
  if (customer.city === match.city) {
    insights.strengths.push('Same city - easy to meet regularly');
  } else if (customer.country === match.country) {
    insights.strengths.push('Same country - cultural familiarity');
  } else {
    insights.considerations.push('Different countries');
    insights.recommendations.push('Plan for long-distance relationship challenges');
  }

  // Education compatibility
  if (customer.degree === match.degree) {
    insights.strengths.push('Similar educational background');
  }

  return insights;
}
