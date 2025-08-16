import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Sparkles, Loader2, Heart, User } from 'lucide-react';
import { aiMatchMaker } from '../lib/aiMatchMaker';
import { Customer } from '../lib/aiUtils';

interface AIMatch {
  id: string;
  name: string;
  reason: string;
}

interface AIMatchmakerProps {
  customer: Customer;
}

export default function AIMatchmaker({ customer }: AIMatchmakerProps) {
  const [matches, setMatches] = useState<AIMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleFindMatches = async () => {
    setIsLoading(true);
    setHasSearched(false);
    
    try {
      const aiMatches = await aiMatchMaker(customer);
      setMatches(aiMatches);
      setHasSearched(true);
    } catch (error) {
      console.error('Error finding AI matches:', error);
      setMatches([]);
      setHasSearched(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span>AI Matchmaker</span>
          </CardTitle>
          <Button
            onClick={handleFindMatches}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Finding Matches...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Find Matches with AI
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-500" />
              <p className="text-gray-600">AI is analyzing compatibility...</p>
              <p className="text-sm text-gray-500 mt-1">This may take a few moments</p>
            </div>
          </div>
        )}

        {!isLoading && !hasSearched && (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-300" />
            <p className="text-gray-600 mb-2">Discover AI-powered matches</p>
            <p className="text-sm text-gray-500">
              Our AI will analyze {customer.firstName}'s profile and find the most compatible matches
            </p>
          </div>
        )}

        {!isLoading && hasSearched && matches.length === 0 && (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600 mb-2">No matches found</p>
            <p className="text-sm text-gray-500">
              The AI couldn't find suitable matches at this time. Try again later.
            </p>
          </div>
        )}

        {!isLoading && matches.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-700">AI Recommended Matches</h4>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                {matches.length} matches found
              </Badge>
            </div>
            
            <div className="space-y-3">
              {matches.map((match, index) => (
                <div
                  key={match.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full">
                        <span className="text-sm font-semibold text-purple-600">
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-800 flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span>{match.name}</span>
                        </h5>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                          {match.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <p className="text-xs text-purple-700">
                <Sparkles className="w-3 h-3 inline mr-1" />
                These matches are generated by AI based on compatibility analysis and matchmaking rules.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
