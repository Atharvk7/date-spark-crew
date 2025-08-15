import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/authContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, User, MapPin, Calendar, Phone, Mail, GraduationCap, Building, Heart, MessageSquare, Camera } from 'lucide-react';
import profilesData from '../data/profiles.json';
import { useToast } from '../hooks/use-toast';
import { Profile } from '../types';
import { getProfileImageUrl } from '../lib/utils';

export default function ProfileDetail() {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [matches, setMatches] = useState<Profile[]>([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (id) {
      const foundProfile = profilesData.find(p => p.id === id);
      if (foundProfile) {
        setProfile(foundProfile as Profile);
        // Get potential matches (excluding the current profile)
        const potentialMatches = profilesData
          .filter(p => p.id !== id && p.gender !== foundProfile.gender)
          .slice(0, 5) as Profile[];
        setMatches(potentialMatches);
      }
    }
  }, [id]);

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

  const handleSendMatch = (matchProfile: Profile) => {
    // Mock email functionality
    toast({
      title: "Match Sent Successfully!",
      description: `Match suggestion sent to ${profile?.firstName} ${profile?.lastName}`,
      duration: 5000,
    });

    // Show detailed match info in console (for demo purposes)
    console.log('Match Email Details:', {
      to: profile?.email,
      subject: `New Match Suggestion from TDC Matchmakers`,
      matchDetails: {
        name: `${matchProfile.firstName} ${matchProfile.lastName}`,
        age: getAge(matchProfile.dateOfBirth),
        city: matchProfile.city,
        profession: matchProfile.designation,
        company: matchProfile.currentCompany,
        education: matchProfile.degree,
      }
    });
  };

  const handleSaveNotes = () => {
    // Mock save functionality
    toast({
      title: "Notes Saved",
      description: "Meeting notes have been saved successfully.",
    });
    console.log('Saved notes for profile:', profile?.id, 'Notes:', notes);
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">The profile you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {profile.firstName} {profile.lastName}
            </h1>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header with Image */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32"></div>
              <CardContent className="relative pt-0 pb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 -mt-16">
                  <div className="relative">
                    <img
                      src={getProfileImageUrl(profile)}
                      alt={`${profile.firstName} ${profile.lastName}`}
                      className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-white"
                    />
                    <div className="absolute bottom-2 right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {profile.firstName} {profile.lastName}
                    </h2>
                    <p className="text-lg text-gray-600 mb-2">
                      {profile.designation} at {profile.currentCompany}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {getAge(profile.dateOfBirth)} years
                      </Badge>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {profile.city}
                      </Badge>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        {profile.maritalStatus}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Basic Information */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Gender</label>
                    <p className="text-gray-900 font-medium">{profile.gender}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                    <p className="text-gray-900 flex items-center font-medium">
                      <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                      {new Date(profile.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Height</label>
                    <p className="text-gray-900 font-medium">{profile.height} cm</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Religion</label>
                    <p className="text-gray-900 font-medium">{profile.religion}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Caste</label>
                    <p className="text-gray-900 font-medium">{profile.caste}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span>Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900 flex items-center font-medium">
                      <Mail className="w-4 h-4 mr-2 text-blue-500" />
                      {profile.email}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Phone Number</label>
                    <p className="text-gray-900 flex items-center font-medium">
                      <Phone className="w-4 h-4 mr-2 text-green-500" />
                      {profile.phoneNumber}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Education & Career */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <span>Education & Career</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">College</label>
                    <p className="text-gray-900 font-medium">{profile.undergraduateCollege || 'Not specified'}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Degree</label>
                    <p className="text-gray-900 font-medium">{profile.degree}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Current Company</label>
                    <p className="text-gray-900 flex items-center font-medium">
                      <Building className="w-4 h-4 mr-2 text-purple-500" />
                      {profile.currentCompany}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Designation</label>
                    <p className="text-gray-900 font-medium">{profile.designation}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500">Annual Income</label>
                    <p className="text-gray-900 font-semibold text-green-600">₹{profile.income.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5" />
                  <span>Personal Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Want Kids</label>
                    <Badge variant="outline">{profile.wantKids}</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Open to Relocate</label>
                    <Badge variant="outline">{profile.openToRelocate}</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Open to Pets</label>
                    <Badge variant="outline">{profile.openToPets}</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Languages Known</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {profile.languagesKnown.map((language, index) => (
                      <Badge key={index} variant="secondary">{language}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Hobbies</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {profile.hobbies.map((hobby, index) => (
                      <Badge key={index} variant="outline">{hobby}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Match Suggestions */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-red-50 border-b">
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span>Suggested Matches</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {matches.map((match) => (
                    <div key={match.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300">
                      <div className="flex items-start space-x-4">
                        <img
                          src={getProfileImageUrl(match)}
                          alt={`${match.firstName} ${match.lastName}`}
                          className="w-16 h-16 rounded-full border-2 border-gray-200"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-lg">
                            {match.firstName} {match.lastName}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {getAge(match.dateOfBirth)} years • {match.city} • {match.designation}
                          </p>
                          <p className="text-sm text-gray-500 mb-3">
                            {match.degree} • {match.currentCompany}
                          </p>
                          <div className="flex gap-2 mb-3">
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              {match.maritalStatus}
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              {match.religion}
                            </Badge>
                          </div>
                          <Button
                            onClick={() => handleSendMatch(match)}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm"
                            size="sm"
                          >
                            <Heart className="w-4 h-4 mr-2" />
                            Send Match
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Meeting Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Meeting Notes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Record notes from meetings with this profile..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Button onClick={handleSaveNotes} className="bg-green-600 hover:bg-green-700">
                    Save Notes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Age</span>
                  <span className="font-medium">{getAge(profile.dateOfBirth)} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Height</span>
                  <span className="font-medium">{profile.height} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Income</span>
                  <span className="font-medium">₹{(profile.income / 100000).toFixed(1)}L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Languages</span>
                  <span className="font-medium">{profile.languagesKnown.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
                <Button variant="outline" className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" className="w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
