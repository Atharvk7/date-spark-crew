import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/authContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, User, MapPin, Calendar, Phone, Mail, GraduationCap, Building, Heart, MessageSquare } from 'lucide-react';
import profiles from '../data/profiles.json';
import { Customer } from '../lib/aiUtils';
import { getTopMatches, calculateCompatibilityScore, getMatchStatusTag } from '../lib/matchingLogic';
import NotesSection from '../components/NotesSection';
import MatchSuggestions from '../components/MatchSuggestions';

export default function CustomerDetail() {
  const { customerId } = useParams<{ customerId: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [matches, setMatches] = useState<Customer[]>([]);

  useEffect(() => {
    if (customerId) {
      const foundCustomer = profiles.find(p => p.id === customerId);
      if (foundCustomer) {
        // Type assertion to handle the interface mismatch
        setCustomer(foundCustomer as Customer);
        const topMatches = getTopMatches(foundCustomer as Customer, profiles as Customer[], 10);
        setMatches(topMatches);
      }
    }
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
              {customer.firstName} {customer.lastName}
            </h1>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-gray-900">{customer.firstName} {customer.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Gender</label>
                    <p className="text-gray-900">{customer.gender}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                    <p className="text-gray-900 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(customer.dateOfBirth).toLocaleDateString()} ({getAge(customer.dateOfBirth)} years)
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Height</label>
                    <p className="text-gray-900">{customer.height} cm</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Marital Status</label>
                    <Badge variant="secondary">{customer.maritalStatus}</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Religion</label>
                    <p className="text-gray-900">{customer.religion}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {customer.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone Number</label>
                    <p className="text-gray-900 flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {customer.phoneNumber}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Education & Career */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5" />
                  <span>Education & Career</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">College</label>
                    <p className="text-gray-900">{customer.undergraduateCollege}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Degree</label>
                    <p className="text-gray-900">{customer.degree}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Current Company</label>
                    <p className="text-gray-900 flex items-center">
                      <Building className="w-4 h-4 mr-2" />
                      {customer.currentCompany}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Designation</label>
                    <p className="text-gray-900">{customer.designation}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Annual Income</label>
                    <p className="text-gray-900">₹{customer.income.toLocaleString()}</p>
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
                    <Badge variant="outline">{customer.wantKids}</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Open to Relocate</label>
                    <Badge variant="outline">{customer.openToRelocate}</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Open to Pets</label>
                    <Badge variant="outline">{customer.openToPets}</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Languages Known</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {customer.languagesKnown.map((language, index) => (
                      <Badge key={index} variant="secondary">{language}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Match Suggestions with Send Match functionality */}
            <MatchSuggestions customer={customer} matches={matches} />

            {/* Meeting Notes Section */}
            <NotesSection customerId={customer.id} matchmakerId={currentUser?.uid || 'matchmaker1'} />
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
                  <span className="font-medium">{getAge(customer.dateOfBirth)} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Height</span>
                  <span className="font-medium">{customer.height} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Income</span>
                  <span className="font-medium">₹{(customer.income / 100000).toFixed(1)}L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Languages</span>
                  <span className="font-medium">{customer.languagesKnown.length}</span>
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
                  Call Customer
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
