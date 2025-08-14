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
        const prompt = `Explain in 1-2 sentences why these two people would be a good match for marriage. Focus on compatibility factors like values, lifestyle preferences, and complementary qualities.

Customer: ${customer.firstName} ${customer.lastName} (${customer.gender}, ${customer.city}, ${customer.designation} at ${customer.currentCompany}, ${customer.religion}, wants kids: ${customer.wantKids})

Match: ${match.firstName} ${match.lastName} (${match.gender}, ${match.city}, ${match.designation} at ${match.currentCompany}, ${match.religion}, wants kids: ${match.wantKids})

Keep the explanation friendly, professional, and under 100 words.`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 150,
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
        const prompt = `Write a short, friendly introduction email (under 100 words) that a matchmaker would send to introduce two potential matches. The tone should be warm, professional, and encouraging.

Sender: ${sender.firstName} ${sender.lastName} (${sender.gender}, ${sender.city}, ${sender.designation} at ${sender.currentCompany})

Receiver: ${receiver.firstName} ${receiver.lastName} (${receiver.gender}, ${receiver.city}, ${receiver.designation} at ${receiver.currentCompany})

Make it personal, mention why they might be compatible, and encourage them to connect. Keep it under 100 words.`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 200,
            temperature: 0.8,
        });

        return response.choices[0]?.message?.content || `Dear ${receiver.firstName},\n\nI believe you and ${sender.firstName} would be an excellent match! You both share similar values and professional backgrounds. I'd love to introduce you - would you be interested in connecting?\n\nBest regards,\nTDC Matchmakers`;
    } catch (error) {
        console.error('Error generating intro email:', error);
        return `Dear ${receiver.firstName},\n\nI believe you and ${sender.firstName} would be an excellent match! You both share similar values and professional backgrounds. I'd love to introduce you - would you be interested in connecting?\n\nBest regards,\nTDC Matchmakers`;
    }
} 