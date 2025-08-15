import { Customer } from './aiUtils';

/**
 * Calculate compatibility score between two customers (0-100)
 */
export function calculateCompatibilityScore(customer: Customer, match: Customer): number {
  let score = 0;
  const maxScore = 100;

  // Basic compatibility checks
  if (customer.gender === match.gender) {
    return 0; // Same gender - no match
  }

  // Age compatibility (prefer similar age ranges)
  const customerAge = getAge(customer.dateOfBirth);
  const matchAge = getAge(match.dateOfBirth);
  const ageDiff = Math.abs(customerAge - matchAge);
  
  if (ageDiff <= 5) score += 20;
  else if (ageDiff <= 10) score += 15;
  else if (ageDiff <= 15) score += 10;
  else score += 5;

  // Location compatibility
  if (customer.city === match.city) score += 15;
  else if (customer.country === match.country) score += 10;
  else score += 5;

  // Religion compatibility
  if (customer.religion === match.religion) score += 15;
  else score += 5;

  // Kids preference compatibility
  if (customer.wantKids === match.wantKids) score += 15;
  else if (customer.wantKids === 'Maybe' || match.wantKids === 'Maybe') score += 10;
  else score += 5;

  // Relocation compatibility
  if (customer.openToRelocate === match.openToRelocate) score += 10;
  else if (customer.openToRelocate === 'Maybe' || match.openToRelocate === 'Maybe') score += 7;
  else score += 3;

  // Pets compatibility
  if (customer.openToPets === match.openToPets) score += 10;
  else if (customer.openToPets === 'Maybe' || match.openToPets === 'Maybe') score += 7;
  else score += 3;

  // Income compatibility (for traditional preferences)
  if (customer.gender === 'Male') {
    // For male customers, prefer women with lower income
    if (customer.income > match.income) score += 10;
    else score += 5;
  } else {
    // For female customers, prefer men with higher income
    if (match.income > customer.income) score += 10;
    else score += 5;
  }

  // Height compatibility (for traditional preferences)
  if (customer.gender === 'Male') {
    // For male customers, prefer women who are shorter
    if (customer.height > match.height) score += 10;
    else score += 5;
  } else {
    // For female customers, prefer men who are taller
    if (match.height > customer.height) score += 10;
    else score += 5;
  }

  // Education compatibility
  if (customer.undergraduateCollege === match.undergraduateCollege) score += 5;
  else score += 3;

  // Marital status compatibility
  if (customer.maritalStatus === match.maritalStatus) score += 5;
  else score += 3;

  // Cap the score at maxScore
  return Math.min(score, maxScore);
}

/**
 * Get top matches for a customer based on gender-specific preferences
 */
export function getTopMatches(customer: Customer, allCustomers: Customer[], limit: number = 10): Customer[] {
  // Filter out same gender and the customer themselves
  const potentialMatches = allCustomers.filter(match => 
    match.id !== customer.id && 
    match.gender !== customer.gender
  );

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
 * Get advanced compatibility insights
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

  // Age compatibility
  const customerAge = getAge(customer.dateOfBirth);
  const matchAge = getAge(match.dateOfBirth);
  const ageDiff = Math.abs(customerAge - matchAge);
  
  if (ageDiff <= 5) {
    insights.strengths.push('Excellent age compatibility');
  } else if (ageDiff <= 10) {
    insights.strengths.push('Good age compatibility');
  } else {
    insights.considerations.push('Significant age difference');
    insights.recommendations.push('Discuss life stage compatibility');
  }

  // Location compatibility
  if (customer.city === match.city) {
    insights.strengths.push('Same city - easy to meet');
  } else if (customer.country === match.country) {
    insights.strengths.push('Same country - cultural alignment');
  } else {
    insights.considerations.push('Different countries');
    insights.recommendations.push('Discuss relocation preferences');
  }

  // Religion compatibility
  if (customer.religion === match.religion) {
    insights.strengths.push('Same religion - strong cultural bond');
  } else {
    insights.considerations.push('Different religions');
    insights.recommendations.push('Discuss religious values and practices');
  }

  // Kids preference
  if (customer.wantKids === match.wantKids) {
    insights.strengths.push('Aligned on family planning');
  } else if (customer.wantKids === 'Maybe' || match.wantKids === 'Maybe') {
    insights.considerations.push('Uncertain about kids preference');
    insights.recommendations.push('Have open discussion about family goals');
  } else {
    insights.considerations.push('Different views on having children');
    insights.recommendations.push('Ensure this is a deal-breaker discussion');
  }

  // Education and career
  if (customer.undergraduateCollege === match.undergraduateCollege) {
    insights.strengths.push('Same educational background');
  }
  
  if (customer.designation === match.designation) {
    insights.strengths.push('Similar professional roles');
  }

  return insights;
}
