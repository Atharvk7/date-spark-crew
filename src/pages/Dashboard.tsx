import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/authContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { LogOut, Search, Users, UserPlus, Heart, Eye } from 'lucide-react';
import { Profile } from '../types';
import profilesData from '../data/profiles.json';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'male' | 'female' | 'never-married'>('all');

  // Load profiles immediately when component mounts
  useEffect(() => {
    const matchmakerId = 'matchmaker1'; // Use fixed matchmaker ID for now
    const matchmakerProfiles = profilesData.filter(
      profile => profile.matchmakerId === matchmakerId
    );
    
    setAllProfiles(matchmakerProfiles);
    setFilteredProfiles(matchmakerProfiles);
  }, []); // Empty dependency array - run once on mount

  useEffect(() => {
    let profiles = allProfiles;

    // Apply filter
    if (activeFilter === 'male') {
      profiles = profiles.filter(p => p.gender === 'Male');
    } else if (activeFilter === 'female') {
      profiles = profiles.filter(p => p.gender === 'Female');
    } else if (activeFilter === 'never-married') {
      profiles = profiles.filter(p => p.maritalStatus === 'Never Married');
    }

    // Apply search term
    if (searchTerm.trim()) {
      profiles = profiles.filter(profile =>
        profile.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProfiles(profiles);
  }, [searchTerm, allProfiles, activeFilter]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleProfileClick = (profileId: string) => {
    navigate(`/profile/${profileId}`);
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

  const getStatusColor = (maritalStatus: string) => {
    switch (maritalStatus) {
      case 'Never Married':
        return 'bg-green-100 text-green-800';
      case 'Divorced':
        return 'bg-yellow-100 text-yellow-800';
      case 'Widowed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Heart className="w-8 h-8 text-pink-500" />
              <h1 className="text-2xl font-bold text-slate-800">DateSpark</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {currentUser?.email || 'Matchmaker'}
              </span>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-800">Client Dashboard</h2>
              <p className="text-slate-500 mt-1">
                An overview of your active client profiles.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search profiles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Profile
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card
              onClick={() => setActiveFilter('all')}
              className={`cursor-pointer transition-all duration-300 ${activeFilter === 'all' ? 'ring-2 ring-slate-800 shadow-lg' : 'hover:shadow-md hover:-translate-y-1'}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Total Profiles</CardTitle>
                <Users className="h-5 w-5 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">{allProfiles.length}</div>
                <p className="text-xs text-slate-500">Managed by you</p>
              </CardContent>
            </Card>
            <Card
              onClick={() => setActiveFilter('male')}
              className={`cursor-pointer transition-all duration-300 ${activeFilter === 'male' ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md hover:-translate-y-1'}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Male Profiles</CardTitle>
                <Users className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">
                  {allProfiles.filter(p => p.gender === 'Male').length}
                </div>
                <p className="text-xs text-slate-500">Seeking matches</p>
              </CardContent>
            </Card>
            <Card
              onClick={() => setActiveFilter('female')}
              className={`cursor-pointer transition-all duration-300 ${activeFilter === 'female' ? 'ring-2 ring-pink-500 shadow-lg' : 'hover:shadow-md hover:-translate-y-1'}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Female Profiles</CardTitle>
                <Users className="h-5 w-5 text-pink-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">
                  {allProfiles.filter(p => p.gender === 'Female').length}
                </div>
                <p className="text-xs text-slate-500">Seeking matches</p>
              </CardContent>
            </Card>
            <Card
              onClick={() => setActiveFilter('never-married')}
              className={`cursor-pointer transition-all duration-300 ${activeFilter === 'never-married' ? 'ring-2 ring-red-500 shadow-lg' : 'hover:shadow-md hover:-translate-y-1'}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Never Married</CardTitle>
                <Heart className="h-5 w-5 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">
                  {allProfiles.filter(p => p.maritalStatus === 'Never Married').length}
                </div>
                <p className="text-xs text-slate-500">Ready to mingle</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Profiles Table */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="text-lg">All Clients</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-100/80 hover:bg-slate-100">
                    <TableHead className="py-3">Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Marital Status</TableHead>
                    <TableHead>Profession</TableHead>
                    <TableHead className="text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfiles.map((profile) => (
                    <TableRow
                      key={profile.id}
                      className="cursor-pointer hover:bg-slate-50"
                      onClick={() => handleProfileClick(profile.id)}
                    >
                      <TableCell className="font-medium">
                        {profile.firstName} {profile.lastName}
                      </TableCell>
                      <TableCell>{getAge(profile.dateOfBirth)}</TableCell>
                      <TableCell>{profile.city}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`${getStatusColor(profile.maritalStatus)} font-normal`}>
                          {profile.maritalStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{profile.designation}</TableCell>
                      <TableCell className="text-right pr-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProfileClick(profile.id);
                          }}
                          className="text-slate-600 hover:text-slate-900"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
