import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/authContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { LogOut, Search, Users, Heart, Eye, TrendingUp, Calendar, Bell, Settings } from 'lucide-react';
import { Profile } from '../types';
import profilesData from '../data/profiles.json';
import { applyAllFilters, getUniqueCities, calculateAge } from '../utils/filterUtils';
import { getMaritalStatusColor, getInitials, getFullName, getProfileStatistics } from '../utils/profileUtils';

/**
 * Dashboard component for managing client profiles
 * Features: Profile filtering, search, statistics, and navigation
 */
export default function Dashboard() {
  // Authentication and navigation hooks
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  // State management for profiles and filters
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'male' | 'female' | 'never-married'>('all');
  const [ageFilter, setAgeFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Load profiles from local JSON data on component mount
   */
  useEffect(() => {
    setAllProfiles(profilesData as Profile[]);
    setFilteredProfiles(profilesData as Profile[]);
  }, []);

  /**
   * Apply all filters whenever filter criteria change
   * Uses modular filter utility functions for better maintainability
   */
  useEffect(() => {
    const filtered = applyAllFilters(allProfiles, {
      activeFilter,
      ageFilter,
      cityFilter,
      searchTerm
    });
    setFilteredProfiles(filtered);
  }, [searchTerm, allProfiles, activeFilter, ageFilter, cityFilter]);

  /**
   * Handle user logout with error handling
   */
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  /**
   * Navigate to detailed profile view
   * @param profileId - ID of the profile to view
   */
  const handleProfileClick = (profileId: string) => {
    navigate(`/customer/${profileId}`);
  };

  // Get profile statistics for display
  const stats = getProfileStatistics(allProfiles);
  const uniqueCities = getUniqueCities(allProfiles);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-xl">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">DateSpark</h1>
              <Badge className="bg-purple-100 text-purple-700 ml-2">Matchmaker Portal</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-pink-600">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-pink-600">
                <Settings className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-3 px-3 py-2 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">{currentUser?.email?.charAt(0).toUpperCase() || 'M'}</span>
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-gray-900">Welcome back!</div>
                  <div className="text-xs text-gray-500">{currentUser?.email || 'Matchmaker'}</div>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-pink-200 text-pink-600 hover:bg-pink-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <h2 className="text-3xl font-bold text-gray-900">Client Dashboard</h2>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-green-600">+12% this month</span>
                </div>
              </div>
              <p className="text-gray-600 text-lg">
                Manage your client profiles and track matchmaking progress
              </p>
            </div>
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center space-y-3 lg:space-y-0 lg:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search profiles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                />
              </div>
              
              {/* Filters - Age and Location only */}
              <div className="flex flex-wrap gap-3">
                {/* Age Filter */}
                <Select value={ageFilter} onValueChange={setAgeFilter}>
                  <SelectTrigger className="w-36 border-pink-200 focus:border-pink-400">
                    <SelectValue placeholder="Age Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ages</SelectItem>
                    <SelectItem value="18-25">18-25 years</SelectItem>
                    <SelectItem value="26-30">26-30 years</SelectItem>
                    <SelectItem value="31-35">31-35 years</SelectItem>
                    <SelectItem value="36-40">36-40 years</SelectItem>
                    <SelectItem value="40+">40+ years</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Location Filter */}
                <Select value={cityFilter} onValueChange={setCityFilter}>
                  <SelectTrigger className="w-36 border-pink-200 focus:border-pink-400">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {uniqueCities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card
              onClick={() => setActiveFilter('all')}
              className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${activeFilter === 'all' ? 'ring-2 ring-pink-500 shadow-xl bg-gradient-to-br from-pink-50 to-purple-50' : 'hover:shadow-lg hover:-translate-y-1 bg-white'}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Profiles</CardTitle>
                <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg">
                  <Users className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">{stats.total}</div>
                <p className="text-xs text-gray-500 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                  Managed by you
                </p>
              </CardContent>
            </Card>
            <Card
              onClick={() => setActiveFilter('male')}
              className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${activeFilter === 'male' ? 'ring-2 ring-blue-500 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50' : 'hover:shadow-lg hover:-translate-y-1 bg-white'}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Male Profiles</CardTitle>
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                  <Users className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {stats.male}
                </div>
                <p className="text-xs text-gray-500 flex items-center mt-1">
                  <Heart className="w-3 h-3 mr-1 text-blue-500" />
                  Seeking matches
                </p>
              </CardContent>
            </Card>
            <Card
              onClick={() => setActiveFilter('female')}
              className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${activeFilter === 'female' ? 'ring-2 ring-pink-500 shadow-xl bg-gradient-to-br from-pink-50 to-rose-50' : 'hover:shadow-lg hover:-translate-y-1 bg-white'}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Female Profiles</CardTitle>
                <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg">
                  <Users className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-pink-600">
                  {stats.female}
                </div>
                <p className="text-xs text-gray-500 flex items-center mt-1">
                  <Heart className="w-3 h-3 mr-1 text-pink-500" />
                  Seeking matches
                </p>
              </CardContent>
            </Card>
            <Card
              onClick={() => setActiveFilter('never-married')}
              className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${activeFilter === 'never-married' ? 'ring-2 ring-green-500 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50' : 'hover:shadow-lg hover:-translate-y-1 bg-white'}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Never Married</CardTitle>
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                  <Heart className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {stats.neverMarried}
                </div>
                <p className="text-xs text-gray-500 flex items-center mt-1">
                  <Calendar className="w-3 h-3 mr-1 text-green-500" />
                  Ready to mingle
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Profiles Table */}
        <Card className="overflow-hidden shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-pink-50 to-purple-50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">Client Profiles</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {filteredProfiles.length} of {allProfiles.length} profiles
                  {activeFilter !== 'all' && ` (filtered by ${activeFilter.replace('-', ' ')})`}
                </p>
              </div>
              <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                {filteredProfiles.length} Results
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200">
                    <TableHead className="py-4 font-semibold text-gray-700">Profile</TableHead>
                    <TableHead className="font-semibold text-gray-700">Age</TableHead>
                    <TableHead className="font-semibold text-gray-700">Location</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700">Profession</TableHead>
                    <TableHead className="text-right pr-6 font-semibold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                  filteredProfiles.map((profile, index) => (
                    <TableRow
                      key={profile.id}
                      className="cursor-pointer hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200 border-b border-gray-100"
                      onClick={() => handleProfileClick(profile.id)}
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {getInitials(profile.firstName, profile.lastName)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {getFullName(profile)}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {profile.id}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">{calculateAge(profile.dateOfBirth)}</div>
                        <div className="text-sm text-gray-500">years old</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">{profile.city}</div>
                        <div className="text-sm text-gray-500">{profile.country}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`${getMaritalStatusColor(profile.maritalStatus)} font-medium`}>
                          {profile.maritalStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">{profile.designation}</div>
                        <div className="text-sm text-gray-500">{profile.currentCompany}</div>
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProfileClick(profile.id);
                          }}
                          className="text-pink-600 hover:text-pink-700 hover:bg-pink-50 transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile
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
