import { model, generationConfig, safetySettings } from './gemini';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female';
  dateOfBirth: string;
  country: string;
  city: string;
  height: number;
  email: string;
  phoneNumber: string;
  undergraduateCollege: string;
  degree: string;
  income: number;
  currentCompany: string;
  designation: string;
  maritalStatus: string;
  languagesKnown: string[];
  siblings: number;
  caste: string;
  religion: string;
  wantKids: 'Yes' | 'No' | 'Maybe';
  openToRelocate: 'Yes' | 'No' | 'Maybe';
  openToPets: 'Yes' | 'No' | 'Maybe';
  matchmakerId: string;
  personalityTraits?: string[];
  hobbies?: string[];
  familyValues?: string;
  careerGoals?: string;
  lifestylePreferences?: string;
}

export interface MeetingNote {
  id: string;
  customerId: string;
  matchmakerId: string;
  date: string;
  meetingType: 'Call' | 'Video Call' | 'In-Person Meeting' | 'Coffee Meeting';
  duration: number; // in minutes
  notes: string;
  followUpRequired: boolean;
  followUpDate?: string;
  nextSteps?: string;
  mood: 'Positive' | 'Neutral' | 'Concerned' | 'Excited';
  topicsDiscussed: string[];
  customerFeedback?: string;
  matchmakerObservations: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Generate a brief explanation for why two customers are a good match using Gemini
 */
export async function generateMatchExplanation(
  customer: Customer,
  match: Customer
): Promise<string> {
  const hasGeminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!hasGeminiKey) {
    return `Great compatibility! ${customer.firstName} and ${match.firstName} share similar values, educational backgrounds, and lifestyle preferences. Their complementary qualities make them an excellent potential match.`;
  }

  try {
    const prompt = `Analyze the compatibility between these two individuals for marriage. Consider their values, lifestyle, education, career, and personal preferences.

Customer: ${customer.firstName} ${customer.lastName} (${customer.gender}, ${customer.city}, ${customer.designation} at ${customer.currentCompany}, ${customer.religion}, wants kids: ${customer.wantKids}, open to relocate: ${customer.openToRelocate})

Match: ${match.firstName} ${match.lastName} (${match.gender}, ${match.city}, ${match.designation} at ${match.currentCompany}, ${match.religion}, wants kids: ${match.wantKids}, open to relocate: ${match.openToRelocate})

Provide a 2-3 sentence explanation focusing on:
1. Shared values and compatibility
2. Complementary qualities
3. Potential challenges and how they might work together

Keep it friendly, professional, and insightful.`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { ...generationConfig, maxOutputTokens: 200 },
      safetySettings,
    });

    return result.response.text() || 'Great compatibility based on shared values and lifestyle preferences.';
  } catch (error) {
    console.error('Error generating match explanation:', error);
    return 'Great compatibility based on shared values and lifestyle preferences.';
  }
}

/**
 * Generate a short, friendly introduction email for a potential match using Gemini
 */
export async function generateIntroEmail(
  sender: Customer,
  receiver: Customer
): Promise<string> {
  const hasGeminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!hasGeminiKey) {
    return `Dear ${receiver.firstName},

I believe you and ${sender.firstName} would be an excellent match! You both share similar values, professional backgrounds, and life goals. 

${sender.firstName} is a ${sender.designation} at ${sender.currentCompany} and shares your interest in ${sender.wantKids === receiver.wantKids ? 'family planning' : 'personal growth'}. 

I'd love to introduce you - would you be interested in connecting?

Best regards,
TDC Matchmakers`;
  }

  try {
    const prompt = `Write a personalized introduction email (under 150 words) that a matchmaker would send to introduce two potential matches. The tone should be warm, professional, and encouraging.

Sender: ${sender.firstName} ${sender.lastName} (${sender.gender}, ${sender.city}, ${sender.designation} at ${sender.currentCompany}, ${sender.religion}, wants kids: ${sender.wantKids})

Receiver: ${receiver.firstName} ${receiver.lastName} (${receiver.gender}, ${receiver.city}, ${receiver.designation} at ${receiver.currentCompany}, ${receiver.religion}, wants kids: ${receiver.wantKids})

Make it personal by highlighting:
1. Specific compatibility factors
2. Shared values or interests
3. Why they would complement each other
4. A gentle invitation to connect

Keep it warm, professional, and under 150 words.`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { ...generationConfig, maxOutputTokens: 250 },
      safetySettings,
    });

    return result.response.text() || `Dear ${receiver.firstName},\n\nI believe you and ${sender.firstName} would be an excellent match! You both share similar values and professional backgrounds. I'd love to introduce you - would you be interested in connecting?\n\nBest regards,\nTDC Matchmakers`;
  } catch (error) {
    console.error('Error generating intro email:', error);
    return `Dear ${receiver.firstName},\n\nI believe you and ${sender.firstName} would be an excellent match! You both share similar values and professional backgrounds. I'd love to introduce you - would you be interested in connecting?\n\nBest regards,\nTDC Matchmakers`;
  }
}

/**
 * Generate AI-powered match suggestions with detailed reasoning using Gemini
 */
export async function generateGeminiMatchSuggestions(
  customer: Customer,
  potentialMatches: Customer[]
): Promise<Array<{ match: Customer; score: number; reasoning: string; compatibilityFactors: string[] }>> {
  const hasGeminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!hasGeminiKey) {
    console.warn('Gemini API key not found. Using fallback logic.');
    return potentialMatches.slice(0, 8).map((match, index) => ({
      match,
      score: 85 - (index * 3),
      reasoning: `Good compatibility based on shared values and complementary qualities.`,
      compatibilityFactors: ['Similar education level', 'Compatible age range', 'Shared lifestyle preferences']
    }));
  }

  try {
    const prompt = `As an expert matchmaker, analyze the compatibility between this customer and potential matches. Consider cultural values, lifestyle compatibility, career alignment, family goals, and personality traits.

Customer Profile:
Name: ${customer.firstName} ${customer.lastName}
Gender: ${customer.gender}
Age: ${new Date().getFullYear() - new Date(customer.dateOfBirth).getFullYear()}
Location: ${customer.city}
Career: ${customer.designation} at ${customer.currentCompany}
Education: ${customer.degree}
Religion: ${customer.religion}
Family Goals: ${customer.wantKids}
Relocation: ${customer.openToRelocate}
Income: ${customer.income}
Languages: ${customer.languagesKnown?.join(', ') || 'Not specified'}
Hobbies: ${customer.hobbies?.join(', ') || 'Not specified'}

Potential Matches:
${potentialMatches.slice(0, 8).map((match, index) => 
  `${index + 1}. ${match.firstName} ${match.lastName} (${match.gender}, Age: ${new Date().getFullYear() - new Date(match.dateOfBirth).getFullYear()}, ${match.city}, ${match.designation} at ${match.currentCompany}, ${match.religion}, Kids: ${match.wantKids}, Income: ${match.income})`
).join('\n')}

For each match, provide:
1. Compatibility score (70-100, be realistic)
2. 2-3 sentence reasoning focusing on strongest compatibility factors
3. Top 3 specific compatibility factors

Return ONLY valid JSON in this exact format:
{
  "matches": [
    {
      "matchIndex": 1,
      "score": 87,
      "reasoning": "Excellent compatibility in core values and life goals. Both share similar educational backgrounds and career ambitions, with complementary personalities that would create a balanced partnership.",
      "compatibilityFactors": ["Shared religious values", "Compatible career levels", "Similar family goals"]
    }
  ]
}`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
      safetySettings,
    });

    const response = result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const parsedResult = JSON.parse(jsonMatch[0]);
      return parsedResult.matches?.map((item: any) => ({
        match: potentialMatches[item.matchIndex - 1],
        score: Math.min(100, Math.max(70, item.score)),
        reasoning: item.reasoning || 'Good compatibility based on shared values.',
        compatibilityFactors: item.compatibilityFactors || ['Compatible background', 'Shared interests', 'Similar values']
      })).filter((item: any) => item.match) || [];
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      return potentialMatches.slice(0, 8).map((match, index) => ({
        match,
        score: 85 - (index * 3),
        reasoning: `AI analysis suggests good compatibility based on shared values and lifestyle preferences.`,
        compatibilityFactors: ['Similar background', 'Compatible preferences', 'Good age match']
      }));
    }
  } catch (error) {
    console.error('Error generating Gemini match suggestions:', error);
    return potentialMatches.slice(0, 8).map((match, index) => ({
      match,
      score: 85 - (index * 3),
      reasoning: `Good compatibility based on shared values and complementary qualities.`,
      compatibilityFactors: ['Similar background', 'Compatible preferences', 'Good age match']
    }));
  }
}

/**
 * Generate AI-powered match suggestions with detailed reasoning (alias for Gemini function)
 */
export async function generateMatchSuggestions(
  customer: Customer,
  potentialMatches: Customer[]
): Promise<Array<{ match: Customer; score: number; reasoning: string; compatibilityFactors: string[] }>> {
  return generateGeminiMatchSuggestions(customer, potentialMatches);
}
