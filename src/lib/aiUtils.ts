import OpenAI from 'openai';

// Check if OpenAI API key is available
const hasOpenAIKey = import.meta.env.VITE_OPENAI_API_KEY;

let openai: OpenAI | null = null;

if (hasOpenAIKey) {
  openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });
} else {
  console.warn('OpenAI API key not found. Using mock AI responses.');
}

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
 * Generate a brief explanation for why two customers are a good match
 */
export async function generateMatchExplanation(
  customer: Customer,
  match: Customer
): Promise<string> {
  if (!openai) {
    // Mock response when OpenAI is not available
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

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || 'Great compatibility based on shared values and lifestyle preferences.';
  } catch (error) {
    console.error('Error generating match explanation:', error);
    return 'Great compatibility based on shared values and lifestyle preferences.';
  }
}

/**
 * Generate a short, friendly introduction email for a potential match
 */
export async function generateIntroEmail(
  sender: Customer,
  receiver: Customer
): Promise<string> {
  if (!openai) {
    // Mock response when OpenAI is not available
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

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 250,
      temperature: 0.8,
    });

    return response.choices[0]?.message?.content || `Dear ${receiver.firstName},\n\nI believe you and ${sender.firstName} would be an excellent match! You both share similar values and professional backgrounds. I'd love to introduce you - would you be interested in connecting?\n\nBest regards,\nTDC Matchmakers`;
  } catch (error) {
    console.error('Error generating intro email:', error);
    return `Dear ${receiver.firstName},\n\nI believe you and ${sender.firstName} would be an excellent match! You both share similar values and professional backgrounds. I'd love to introduce you - would you be interested in connecting?\n\nBest regards,\nTDC Matchmakers`;
  }
}

/**
 * Generate AI-powered match suggestions with detailed reasoning
 */
export async function generateMatchSuggestions(
  customer: Customer,
  potentialMatches: Customer[]
): Promise<Array<{ match: Customer; score: number; reasoning: string; compatibilityFactors: string[] }>> {
  if (!openai) {
    // Mock response when OpenAI is not available
    return potentialMatches.slice(0, 10).map((match, index) => ({
      match,
      score: 85 - (index * 5),
      reasoning: `Good compatibility based on shared values and complementary qualities.`,
      compatibilityFactors: ['Similar education level', 'Compatible age range', 'Shared lifestyle preferences']
    }));
  }

  try {
    const prompt = `Analyze the compatibility between this customer and potential matches. For each match, provide:
1. A compatibility score (0-100)
2. Brief reasoning for the score
3. Top 3 compatibility factors

Customer: ${customer.firstName} ${customer.lastName} (${customer.gender}, ${customer.city}, ${customer.designation} at ${customer.currentCompany}, ${customer.religion}, wants kids: ${customer.wantKids})

Potential Matches:
${potentialMatches.slice(0, 10).map((match, index) => 
  `${index + 1}. ${match.firstName} ${match.lastName} (${match.gender}, ${match.city}, ${match.designation} at ${match.currentCompany}, ${match.religion}, wants kids: ${match.wantKids})`
).join('\n')}

Provide analysis in JSON format:
{
  "matches": [
    {
      "matchIndex": 1,
      "score": 85,
      "reasoning": "Strong compatibility due to...",
      "compatibilityFactors": ["Factor 1", "Factor 2", "Factor 3"]
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800,
      temperature: 0.7,
    });

    try {
      const result = JSON.parse(response.choices[0]?.message?.content || '{}');
      return result.matches?.map((item: any) => ({
        match: potentialMatches[item.matchIndex - 1],
        score: item.score,
        reasoning: item.reasoning,
        compatibilityFactors: item.compatibilityFactors
      })) || [];
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      return potentialMatches.slice(0, 10).map((match, index) => ({
        match,
        score: 85 - (index * 5),
        reasoning: `Good compatibility based on shared values.`,
        compatibilityFactors: ['Similar background', 'Compatible preferences', 'Good age match']
      }));
    }
  } catch (error) {
    console.error('Error generating match suggestions:', error);
    return potentialMatches.slice(0, 10).map((match, index) => ({
      match,
      score: 85 - (index * 5),
      reasoning: `Good compatibility based on shared values.`,
      compatibilityFactors: ['Similar background', 'Compatible preferences', 'Good age match']
    }));
  }
}
