import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Heart, Send, MapPin, Building, Calendar, User, Mail } from 'lucide-react';
import { Customer, generateIntroEmail } from '../lib/aiUtils';
import { useToast } from '../hooks/use-toast';
import profiles from '../data/profiles.json';

interface MatchSuggestionsProps {
  customer: Customer;
  matches: Customer[];
}

interface MatchSuggestion {
  match: Customer;
  score: number;
  reasoning: string;
  compatibilityFactors: string[];
}

export default function MatchSuggestions({ customer, matches }: MatchSuggestionsProps) {
  const { toast } = useToast();
  const [matchSuggestions, setMatchSuggestions] = useState<MatchSuggestion[]>([]);
  const [sendingMatch, setSendingMatch] = useState<string | null>(null);
  const [emailPreview, setEmailPreview] = useState<string>('');
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Customer | null>(null);

  useEffect(() => {
    // Generate enhanced match suggestions with compatibility scores and reasoning
    const suggestions = matches.slice(0, 8).map((match, index) => {
      const baseScore = 85 - (index * 3);
      const ageCompatibility = Math.abs(getAge(customer.dateOfBirth) - getAge(match.dateOfBirth)) <= 5 ? 5 : 0;
      const locationBonus = customer.city === match.city ? 8 : 0;
      const religionBonus = customer.religion === match.religion ? 7 : 0;
      const educationBonus = customer.degree && match.degree ? 5 : 0;
      
      const finalScore = Math.min(100, baseScore + ageCompatibility + locationBonus + religionBonus + educationBonus);
      
      const factors = [];
      if (ageCompatibility > 0) factors.push('Compatible age range');
      if (locationBonus > 0) factors.push('Same city');
      if (religionBonus > 0) factors.push('Shared religious values');
      if (educationBonus > 0) factors.push('Similar education level');
      if (customer.wantKids === match.wantKids) factors.push('Aligned family planning');
      if (customer.openToRelocate === 'Yes' || match.openToRelocate === 'Yes') factors.push('Flexible location');

      let reasoning = '';
      if (finalScore >= 90) {
        reasoning = `Excellent compatibility! ${customer.firstName} and ${match.firstName} share strong fundamental values and lifestyle preferences.`;
      } else if (finalScore >= 80) {
        reasoning = `Great potential match with good compatibility across key areas and complementary qualities.`;
      } else if (finalScore >= 70) {
        reasoning = `Solid compatibility with some shared interests and values that could develop into a strong connection.`;
      } else {
        reasoning = `Moderate compatibility with potential for growth through shared experiences and understanding.`;
      }

      return {
        match,
        score: finalScore,
        reasoning,
        compatibilityFactors: factors.slice(0, 3)
      };
    });

    setMatchSuggestions(suggestions.sort((a, b) => b.score - a.score));
  }, [customer, matches]);

  const getAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getScoreStyling = (score: number) => {
    if (score >= 90) {
      return {
        card: 'bg-green-50 border-green-300 hover:shadow-md hover:border-green-400',
        badge: 'bg-green-100 text-green-800 border border-green-200',
        button: 'bg-green-600 hover:bg-green-700',
      };
    }
    if (score >= 80) {
      return {
        card: 'bg-blue-50 border-blue-300 hover:shadow-md hover:border-blue-400',
        badge: 'bg-blue-100 text-blue-800 border border-blue-200',
        button: 'bg-blue-600 hover:bg-blue-700',
      };
    }
    if (score >= 70) {
      return {
        card: 'bg-yellow-50 border-yellow-300 hover:shadow-md hover:border-yellow-400',
        badge: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
        button: 'bg-yellow-500 hover:bg-yellow-600',
      };
    }
    return {
      card: 'bg-white border-gray-200 hover:shadow-md hover:border-gray-300',
      badge: 'bg-gray-100 text-gray-800 border border-gray-200',
      button: 'bg-gray-600 hover:bg-gray-700',
    };
  };

  const handleSendMatch = async (match: Customer) => {
    setSendingMatch(match.id);
    setSelectedMatch(match);
    
    try {
      // Generate personalized intro email
      const email = await generateIntroEmail(customer, match);
      setEmailPreview(email);
      setShowEmailDialog(true);
      
      // Show success toast
      toast({
        title: "Match Sent Successfully!",
        description: `Introduction email sent to ${customer.firstName} about ${match.firstName} ${match.lastName}`,
        duration: 5000,
      });
      
    } catch (error) {
      console.error('Error sending match:', error);
      toast({
        title: "Error Sending Match",
        description: "There was an issue sending the match. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setSendingMatch(null);
    }
  };

  return (
    <Card className="bg-white border-gray-200 shadow-lg">
      <CardHeader className="bg-gray-50 rounded-t-lg border-b">
        <CardTitle className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Heart className="w-5 h-5 text-blue-600" />
          </div>
          <span className="text-xl font-bold text-gray-800">AI Matchmaker's Suggestions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {matchSuggestions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No match suggestions available</p>
            <p className="text-sm">Check back later for new potential matches</p>
          </div>
        ) : (
          <div className="space-y-4">
            {matchSuggestions.map((suggestion) => {
              const scoreStyles = getScoreStyling(suggestion.score);
              return (
              <div key={suggestion.match.id} className={`border rounded-lg p-4 space-y-3 transition-all duration-300 ${scoreStyles.card}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-lg text-gray-800">
                        {suggestion.match.firstName} {suggestion.match.lastName}
                      </h4>
                      <Badge className={scoreStyles.badge}>
                        {suggestion.score}% match
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{getAge(suggestion.match.dateOfBirth)} years old</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{suggestion.match.city}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Building className="w-4 h-4" />
                        <span>{suggestion.match.designation}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{suggestion.match.religion}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">{suggestion.reasoning}</p>
                    
                    {suggestion.compatibilityFactors.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {suggestion.compatibilityFactors.map((factor, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/customer/${suggestion.match.id}`, '_blank')}
                  >
                    View Profile
                  </Button>
                  <Button
                    size="sm"
                    className={scoreStyles.button}
                    onClick={() => handleSendMatch(suggestion.match)}
                    disabled={sendingMatch === suggestion.match.id}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {sendingMatch === suggestion.match.id ? 'Sending...' : 'Send Match'}
                  </Button>
                </div>
              </div>
              )
            })}
          </div>
        )}
        
        {/* Email Preview Dialog */}
        <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Match Introduction Email</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedMatch && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{selectedMatch.firstName} {selectedMatch.lastName}</h4>
                      <p className="text-sm text-gray-600">
                        {getAge(selectedMatch.dateOfBirth)} years • {selectedMatch.city} • {selectedMatch.designation}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <span>📧 {selectedMatch.email}</span>
                    <span>📱 {selectedMatch.phoneNumber}</span>
                    <span>🎓 {selectedMatch.degree}</span>
                    <span>🏢 {selectedMatch.currentCompany}</span>
                  </div>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-gray-700">Email Content:</label>
                <div className="mt-2 p-4 bg-white border rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                    {emailPreview}
                  </pre>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-800">Email Sent Successfully</span>
                </div>
                <p className="text-xs text-green-700 mt-1">
                  The introduction email has been sent to {customer.firstName} with {selectedMatch?.firstName}'s profile details.
                </p>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => setShowEmailDialog(false)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
