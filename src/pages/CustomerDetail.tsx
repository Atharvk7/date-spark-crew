import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/authContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { ArrowLeft, Edit, Heart, Send, User, MapPin, Calendar, Phone, Mail, GraduationCap, Building, Users, Star, MessageSquare } from 'lucide-react';
import profiles from '../data/profiles.json';
import { Customer } from '../lib/aiUtils';
import { getTopMatches, calculateCompatibilityScore, getMatchStatusTag } from '../lib/matchingLogic';
import { generateIntroEmail } from '../lib/aiUtils';

export default function CustomerDetail() {
  const { customerId } = useParams<{ customerId: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [matches, setMatches] = useState<Customer[]>([]);
  const [notes, setNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [introEmail, setIntroEmail] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customerId) {
      const foundCustomer = profiles.find(p => p.id === customerId);
      if (foundCustomer) {
        setCustomer(foundCustomer);
        // Get top matches for this customer
        const topMatches = getTopMatches(foundCustomer, profiles, 10);
        setMatches(topMatches);
      }
    }
  }, [customerId]);

  useEffect(() => {
    // Load notes from localStorage (in a real app, this would come from Firestore)
    const savedNotes = localStorage.getItem(`notes_${customerId}_${currentUser?.uid}`);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [customerId, currentUser]);

  const saveNotes = () => {
    if (customerId && currentUser?.uid) {
      localStorage.setItem(`notes_${customerId}_${currentUser.uid}`, notes);
      setIsEditingNotes(false);
    }
  };

  const handleSendMatch = async (match: Customer) => {
    if (!customer) return;
    
    setSelectedMatch(match);
    setLoading(true);
    
    try {
      const email = await generateIntroEmail(customer, match);
      setIntroEmail(email);
      setShowEmailModal(true);
    } catch (error) {
      console.error('Error generating email:', error);
      setIntroEmail('Failed to generate email. Please try again.');
      setShowEmailModal(true);
    } finally {
      setLoading(false);
    }
  };

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

  const compatibilityScore = selectedMatch ? calculateCompatibilityScore(customer, selectedMatch) : 0;
  const statusTag = selectedMatch ? getMatchStatusTag(compatibilityScore) : null;

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

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Location</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Country</label>
                    <p className="text-gray-900">{customer.country}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">City</label>
                    <p className="text-gray-900">{customer.city}</p>
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

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Additional Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Caste</label>
                    <p className="text-gray-900">{customer.caste}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Siblings</label>
                    <p className="text-gray-900">{customer.siblings}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notes Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Notes</span>
                  </span>
                  {!isEditingNotes && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingNotes(true)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditingNotes ? (
                  <div className="space-y-3">
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add your notes about this customer..."
                      rows={6}
                    />
                    <div className="flex space-x-2">
                      <Button onClick={saveNotes} size="sm">Save</Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditingNotes(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {notes ? (
                      <p className="text-gray-700 whitespace-pre-wrap">{notes}</p>
                    ) : (
                      <p className="text-gray-500 italic">No notes yet. Click edit to add notes.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Matches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5" />
                  <span>Top Matches</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {matches.slice(0, 5).map((match) => {
                    const score = calculateCompatibilityScore(customer, match);
                    const status = getMatchStatusTag(score);
                    return (
                      <div key={match.id} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">
                            {match.firstName} {match.lastName}
                          </h4>
                          <Badge className={status.color}>{status.text}</Badge>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <p>{getAge(match.dateOfBirth)} years • {match.city}</p>
                          <p>{match.designation} at {match.currentCompany}</p>
                          <p className="font-medium text-blue-600">{score}% match</p>
                        </div>
                        <Button
                          size="sm"
                          className="w-full bg-pink-600 hover:bg-pink-700"
                          onClick={() => handleSendMatch(match)}
                          disabled={loading}
                        >
                          <Send className="w-3 h-3 mr-1" />
                          Send Match
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Email Modal */}
      <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Introduction Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedMatch && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Match Details:</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>To:</strong> {selectedMatch.firstName} {selectedMatch.lastName}</p>
                  <p><strong>Age:</strong> {getAge(selectedMatch.dateOfBirth)} years</p>
                  <p><strong>City:</strong> {selectedMatch.city}</p>
                  <p><strong>Profession:</strong> {selectedMatch.designation} at {selectedMatch.currentCompany}</p>
                  <p><strong>Compatibility Score:</strong> {compatibilityScore}%</p>
                  {statusTag && (
                    <Badge className={statusTag.color}>{statusTag.text}</Badge>
                  )}
                </div>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Generated Email:</label>
              <div className="bg-white border rounded-lg p-4 max-h-64 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">{introEmail}</pre>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowEmailModal(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(introEmail);
                  setShowEmailModal(false);
                }}
              >
                Copy to Clipboard
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
