import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/authContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import AIMatchmaker from '../components/AIMatchmaker';
import { ArrowLeft, User, MapPin, Calendar, Phone, Mail, GraduationCap, Building, Heart, MessageSquare, Sparkles, Smile, Briefcase, Home, Languages, Cake, Star, Award, Users, Globe } from 'lucide-react';
import profilesData from '../data/profiles.json';
import { Customer } from '../lib/aiUtils';
import { getTopMatches, calculateCompatibilityScore, getMatchStatusTag } from '../lib/matchingLogic';
import NotesSection from '../components/NotesSection';
import MatchSuggestions from '../components/MatchSuggestions';
// import AIMatchmaker from '../components/AIMatchmaker';

export default function CustomerDetail() {
  const { customerId } = useParams<{ customerId: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
    const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<Customer[]>([]);

  useEffect(() => {
    setLoading(true);
    if (!customerId) {
      setLoading(false);
      return;
    }

    const allProfiles = profilesData as Customer[];
    const currentCustomer = allProfiles.find(p => p.id === customerId);

    if (currentCustomer) {
      setCustomer(currentCustomer);

      const otherProfiles = allProfiles.filter(p => p.id !== customerId);
      const topMatches = getTopMatches(currentCustomer, otherProfiles, 10);
      setMatches(topMatches);
    } else {
      console.log("No such customer!");
      setCustomer(null);
    }

    setLoading(false);
  }, [customerId]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading customer details...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Not Found</h2>
          <p className="text-gray-600 mb-4">The customer you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Button>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              {customer.firstName} {customer.lastName}
            </h1>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="relative flex items-center space-x-8">
            {/* Profile Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-200 p-1 shadow-md">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-4xl font-bold text-gray-600">
                  {customer.firstName[0]}{customer.lastName[0]}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-md">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            
            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-4xl font-bold text-gray-800">
                  {customer.firstName} {customer.lastName}
                </h2>
                <Badge variant="secondary" className="border-gray-300">
                  <Star className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              </div>
              
              <div className="flex items-center text-gray-500 mb-3 space-x-6">
                <div className="flex items-center">
                  <Cake className="w-5 h-5 mr-2 text-gray-400" />
                  <span className="font-medium">{getAge(customer.dateOfBirth)} years old</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                  <span className="font-medium">{customer.city}, {customer.country}</span>
                </div>
                <div className="flex items-center">
                  <Building className="w-5 h-5 mr-2 text-gray-400" />
                  <span className="font-medium">{customer.designation}</span>
                </div>
              </div>
              
              <p className="text-gray-700 text-lg leading-relaxed max-w-2xl">
                A passionate professional with a warm personality, seeking meaningful connections and shared adventures in life.
              </p>
              
              {/* Quick Stats */}
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Award className="w-4 h-4 mr-1 text-gray-400" />
                  <span>Verified Profile</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-1 text-gray-400" />
                  <span>{matches.length} Compatible Matches</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Globe className="w-4 h-4 mr-1 text-gray-400" />
                  <span>{customer.languagesKnown.length} Languages</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Me Card */}
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader className="bg-gray-50 rounded-t-lg">
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-200 rounded-lg">
                    <Smile className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-xl font-bold text-gray-800">About {customer.firstName}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div>
                  <h4 className="font-bold text-gray-700 mb-3 flex items-center">
                    <div className="w-1 h-6 bg-gray-300 rounded-full mr-3"></div>
                    Personality Traits
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {customer.personalityTraits?.map((trait, index) => (
                      <Badge key={index} variant="secondary" className="border-gray-300">{trait}</Badge>
                    )) || <p className="text-sm text-gray-500 italic">No personality traits listed.</p>}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-700 mb-3 flex items-center">
                    <div className="w-1 h-6 bg-gray-300 rounded-full mr-3"></div>
                    Hobbies & Interests
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {customer.hobbies?.map((hobby, index) => (
                      <Badge key={index} variant="secondary" className="border-gray-300">{hobby}</Badge>
                    )) || <p className="text-sm text-gray-500 italic">No hobbies listed.</p>}
                  </div>
                </div>
              </CardContent>
            </Card>


            {/* Career & Education Card */}
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader className="bg-gray-50 rounded-t-lg">
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-200 rounded-lg">
                    <Briefcase className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-xl font-bold text-gray-800">Career & Education</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="bg-gray-100 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center mb-2">
                    <Building className="w-6 h-6 mr-3 text-gray-500" />
                    <div>
                      <p className="font-bold text-lg text-gray-800">{customer.designation}</p>
                      <p className="text-gray-600 font-medium">{customer.currentCompany}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center mb-2">
                    <GraduationCap className="w-6 h-6 mr-3 text-gray-500" />
                    <div>
                      <p className="font-bold text-lg text-gray-800">{customer.degree}</p>
                      <p className="text-gray-600 font-medium">{customer.undergraduateCollege}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lifestyle & Preferences Card */}
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader className="bg-gray-50 rounded-t-lg">
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-200 rounded-lg">
                    <Heart className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-xl font-bold text-gray-800">Lifestyle & Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Want Kids</p>
                        <p className="text-lg font-bold text-gray-700">{customer.wantKids}</p>
                      </div>
                      <Heart className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Open to Relocate</p>
                        <p className="text-lg font-bold text-gray-700">{customer.openToRelocate}</p>
                      </div>
                      <Globe className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Open to Pets</p>
                        <p className="text-lg font-bold text-gray-700">{customer.openToPets}</p>
                      </div>
                      <Smile className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Height</p>
                        <p className="text-lg font-bold text-gray-700">{customer.height} cm</p>
                      </div>
                      <User className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Marital Status</p>
                        <p className="text-lg font-bold text-gray-700">{customer.maritalStatus}</p>
                      </div>
                      <Heart className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Religion</p>
                        <p className="text-lg font-bold text-gray-700">{customer.religion}</p>
                      </div>
                      <Star className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-xl p-4 border border-gray-200">
                  <h4 className="font-bold text-gray-700 mb-3 flex items-center">
                    <Languages className="w-6 h-6 mr-2 text-gray-500"/> 
                    Languages Known
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {customer.languagesKnown.map((language, index) => (
                      <Badge key={index} variant="secondary" className="border-gray-300">{language}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Match Suggestions with Send Match functionality */}
            <MatchSuggestions customer={customer} matches={matches} />

            {/* AI Matchmaker Section - Temporarily disabled */}
            {/* <AIMatchmaker customer={customer} /> */}

            {/* Meeting Notes Section */}
            <NotesSection customerId={customer.id} matchmakerId={currentUser?.uid || 'matchmaker1'} />
          </div>

          {/* Sidebar with Contact Info & Actions */}
          <div className="space-y-6">
            <Card className="bg-white border-gray-200 shadow-lg sticky top-8">
                <CardHeader className="bg-gray-50 rounded-t-lg">
                    <CardTitle className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-200 rounded-lg">
                        <MessageSquare className="w-5 h-5 text-gray-600" />
                      </div>
                      <span className="text-xl font-bold text-gray-800">Contact & Actions</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                    <div className="space-y-4">
                        <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center text-sm mb-2">
                                <Mail className="w-5 h-5 mr-3 text-gray-500" />
                                <span className="font-medium text-gray-500">Email</span>
                            </div>
                            <a href={`mailto:${customer.email}`} className="text-indigo-600 hover:text-indigo-700 font-medium break-all transition-colors duration-200">{customer.email}</a>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center text-sm mb-2">
                                <Phone className="w-5 h-5 mr-3 text-gray-500" />
                                <span className="font-medium text-gray-500">Phone</span>
                            </div>
                            <span className="text-gray-700 font-medium">{customer.phoneNumber}</span>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 pt-6 space-y-3">
                        <Button className="w-full">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Schedule Meeting
                        </Button>
                        <Button variant="secondary" className="w-full">
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email
                        </Button>
                        <Button variant="outline" className="w-full">
                            <Phone className="w-4 h-4 mr-2" />
                            Call Customer
                        </Button>
                    </div>
                </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
