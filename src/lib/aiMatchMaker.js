import { GoogleGenerativeAI } from '@google/generative-ai';
import profilesData from '../data/profiles.json';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

/**
 * AI-powered matchmaker using Google Gemini API
 * @param {Object} currentUser - The current user profile
 * @returns {Promise<Array>} - Array of matches with id, name, and reason
 */
export async function aiMatchMaker(currentUser) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Filter out the current user from potential matches
    const potentialMatches = profilesData.filter(profile => profile.id !== currentUser.id);

    const prompt = `
You are an expert matchmaker. Based on the following rules, find the best matches for the current user:

MATCHMAKING RULES:
For male customers:
- Match with women who are younger, earn less, shorter, and have matching views on children.

For female customers:
- Match with men based on compatibility of profession, shared values, and relocation preference.

CURRENT USER:
${JSON.stringify(currentUser, null, 2)}

POTENTIAL MATCHES:
${JSON.stringify(potentialMatches, null, 2)}

INSTRUCTIONS:
1. Apply the matchmaking rules based on the current user's gender
2. Consider compatibility factors like shared interests, values, and preferences
3. Return ONLY a valid JSON array of the top 5-8 matches
4. Each match object must have: {"id": "string", "name": "string", "reason": "string"}
5. Sort matches from best to worst
6. The reason should be a brief explanation of why they're a good match
7. Do not include any text outside the JSON array

Return only the JSON array:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse the JSON response
    try {
      // Clean the response text to extract only the JSON array
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.error('No JSON array found in Gemini response');
        return [];
      }

      const matches = JSON.parse(jsonMatch[0]);
      
      // Validate the structure
      if (!Array.isArray(matches)) {
        console.error('Response is not an array');
        return [];
      }

      // Validate each match object
      const validMatches = matches.filter(match => 
        match && 
        typeof match.id === 'string' && 
        typeof match.name === 'string' && 
        typeof match.reason === 'string'
      );

      return validMatches;
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', parseError);
      console.error('Raw response:', text);
      return [];
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return [];
  }
}
