import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/authContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 hover:bg-pink-50 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Button>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {customer.firstName} {customer.lastName}
            </h1>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-pink-100 p-8 mb-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
          {/* Decorative gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative flex items-center space-x-8">
            {/* Profile Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 p-1 shadow-lg">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-4xl font-bold text-gray-700">
                  {customer.firstName[0]}{customer.lastName[0]}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            
            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {customer.firstName} {customer.lastName}
                </h2>
                <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 px-3 py-1">
                  <Star className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              </div>
              
              <div className="flex items-center text-gray-600 mb-3 space-x-6">
                <div className="flex items-center">
                  <Cake className="w-5 h-5 mr-2 text-pink-500" />
                  <span className="font-medium">{getAge(customer.dateOfBirth)} years old</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-purple-500" />
                  <span className="font-medium">{customer.city}, {customer.country}</span>
                </div>
                <div className="flex items-center">
                  <Building className="w-5 h-5 mr-2 text-indigo-500" />
                  <span className="font-medium">{customer.designation}</span>
                </div>
              </div>
              
              <p className="text-gray-700 text-lg leading-relaxed max-w-2xl">
                A passionate professional with a warm personality, seeking meaningful connections and shared adventures in life.
              </p>
              
              {/* Quick Stats */}
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Award className="w-4 h-4 mr-1 text-yellow-500" />
                  <span>Verified Profile</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-1 text-green-500" />
                  <span>{matches.length} Compatible Matches</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Globe className="w-4 h-4 mr-1 text-blue-500" />
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
            <Card className="bg-white/90 backdrop-blur-md border-pink-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg">
                    <Smile className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-800">About {customer.firstName}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div>
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                    <div className="w-1 h-6 bg-gradient-to-b from-pink-500 to-purple-600 rounded-full mr-3"></div>
                    Personality Traits
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {customer.personalityTraits?.map((trait, index) => (
                      <Badge key={index} className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 border-pink-200 hover:from-pink-200 hover:to-purple-200 transition-colors duration-200 px-3 py-1">{trait}</Badge>
                    )) || <p className="text-sm text-gray-500 italic">No personality traits listed.</p>}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                    <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-teal-600 rounded-full mr-3"></div>
                    Hobbies & Interests
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {customer.hobbies?.map((hobby, index) => (
                      <Badge key={index} className="bg-gradient-to-r from-green-100 to-teal-100 text-green-700 border-green-200 hover:from-green-200 hover:to-teal-200 transition-colors duration-200 px-3 py-1">{hobby}</Badge>
                    )) || <p className="text-sm text-gray-500 italic">No hobbies listed.</p>}
                  </div>
                </div>
              </CardContent>
            </Card>


            {/* Career & Education Card */}
            <Card className="bg-white/90 backdrop-blur-md border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-800">Career & Education</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center mb-2">
                    <Building className="w-6 h-6 mr-3 text-purple-600" />
                    <div>
                      <p className="font-bold text-lg text-gray-800">{customer.designation}</p>
                      <p className="text-purple-600 font-medium">{customer.currentCompany}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-100">
                  <div className="flex items-center mb-2">
                    <GraduationCap className="w-6 h-6 mr-3 text-indigo-600" />
                    <div>
                      <p className="font-bold text-lg text-gray-800">{customer.degree}</p>
                      <p className="text-indigo-600 font-medium">{customer.undergraduateCollege}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Annual Income</p>
                      <p className="text-2xl font-bold text-green-700">₹{customer.income.toLocaleString()}</p>
                    </div>
                    <div className="text-green-600">
                      <Award className="w-8 h-8" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lifestyle & Preferences Card */}
            <Card className="bg-white/90 backdrop-blur-md border-teal-100 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-800">Lifestyle & Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border border-pink-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Want Kids</p>
                        <p className="text-lg font-bold text-pink-700">{customer.wantKids}</p>
                      </div>
                      <Heart className="w-6 h-6 text-pink-500" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Open to Relocate</p>
                        <p className="text-lg font-bold text-blue-700">{customer.openToRelocate}</p>
                      </div>
                      <Globe className="w-6 h-6 text-blue-500" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Open to Pets</p>
                        <p className="text-lg font-bold text-green-700">{customer.openToPets}</p>
                      </div>
                      <Smile className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Height</p>
                        <p className="text-lg font-bold text-purple-700">{customer.height} cm</p>
                      </div>
                      <User className="w-6 h-6 text-purple-500" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Marital Status</p>
                        <p className="text-lg font-bold text-orange-700">{customer.maritalStatus}</p>
                      </div>
                      <Heart className="w-6 h-6 text-orange-500" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border border-teal-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Religion</p>
                        <p className="text-lg font-bold text-teal-700">{customer.religion}</p>
                      </div>
                      <Star className="w-6 h-6 text-teal-500" />
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                  <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                    <Languages className="w-6 h-6 mr-2 text-indigo-600"/> 
                    Languages Known
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {customer.languagesKnown.map((language, index) => (
                      <Badge key={index} className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-indigo-200 hover:from-indigo-200 hover:to-purple-200 transition-colors duration-200 px-3 py-1">{language}</Badge>
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
            <Card className="bg-white/90 backdrop-blur-md border-indigo-100 shadow-lg hover:shadow-xl transition-all duration-300 sticky top-8">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-lg">
                    <CardTitle className="flex items-center space-x-2">
                      <div className="p-2 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xl font-bold text-gray-800">Contact & Actions</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                    <div className="space-y-4">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                            <div className="flex items-center text-sm mb-2">
                                <Mail className="w-5 h-5 mr-3 text-blue-600" />
                                <span className="font-medium text-gray-600">Email</span>
                            </div>
                            <a href={`mailto:${customer.email}`} className="text-blue-700 hover:text-blue-800 font-medium break-all transition-colors duration-200">{customer.email}</a>
                        </div>
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                            <div className="flex items-center text-sm mb-2">
                                <Phone className="w-5 h-5 mr-3 text-green-600" />
                                <span className="font-medium text-gray-600">Phone</span>
                            </div>
                            <span className="text-green-700 font-medium">{customer.phoneNumber}</span>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 pt-6 space-y-3">
                        <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Schedule Meeting
                        </Button>
                        <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email
                        </Button>
                        <Button className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
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
