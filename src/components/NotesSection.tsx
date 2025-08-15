import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { MessageSquare, Plus, Edit, Calendar, Clock, User, Trash2 } from 'lucide-react';
import { MeetingNote } from '../lib/aiUtils';
import { getNotesForCustomer, addMeetingNote, updateMeetingNote, deleteMeetingNote } from '../data/meetingNotes';

interface NotesSectionProps {
  customerId: string;
  matchmakerId: string;
}

export default function NotesSection({ customerId, matchmakerId }: NotesSectionProps) {
  const [notes, setNotes] = useState<MeetingNote[]>(getNotesForCustomer(customerId));
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<MeetingNote | null>(null);
  const [formData, setFormData] = useState({
    meetingType: 'Call' as MeetingNote['meetingType'],
    duration: 30,
    notes: '',
    followUpRequired: false,
    followUpDate: '',
    nextSteps: '',
    mood: 'Positive' as MeetingNote['mood'],
    topicsDiscussed: '',
    customerFeedback: '',
    matchmakerObservations: ''
  });

  const resetForm = () => {
    setFormData({
      meetingType: 'Call',
      duration: 30,
      notes: '',
      followUpRequired: false,
      followUpDate: '',
      nextSteps: '',
      mood: 'Positive',
      topicsDiscussed: '',
      customerFeedback: '',
      matchmakerObservations: ''
    });
  };

  const handleAddNote = () => {
    const newNote = addMeetingNote({
      customerId,
      matchmakerId,
      date: new Date().toISOString().split('T')[0],
      meetingType: formData.meetingType,
      duration: formData.duration,
      notes: formData.notes,
      followUpRequired: formData.followUpRequired,
      followUpDate: formData.followUpDate || undefined,
      nextSteps: formData.nextSteps || undefined,
      mood: formData.mood,
      topicsDiscussed: formData.topicsDiscussed.split(',').map(t => t.trim()).filter(t => t),
      customerFeedback: formData.customerFeedback || undefined,
      matchmakerObservations: formData.matchmakerObservations
    });
    
    setNotes([...notes, newNote]);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditNote = (note: MeetingNote) => {
    setEditingNote(note);
    setFormData({
      meetingType: note.meetingType,
      duration: note.duration,
      notes: note.notes,
      followUpRequired: note.followUpRequired,
      followUpDate: note.followUpDate || '',
      nextSteps: note.nextSteps || '',
      mood: note.mood,
      topicsDiscussed: note.topicsDiscussed.join(', '),
      customerFeedback: note.customerFeedback || '',
      matchmakerObservations: note.matchmakerObservations
    });
  };

  const handleUpdateNote = () => {
    if (!editingNote) return;
    
    const updatedNote = updateMeetingNote(editingNote.id, {
      meetingType: formData.meetingType,
      duration: formData.duration,
      notes: formData.notes,
      followUpRequired: formData.followUpRequired,
      followUpDate: formData.followUpDate || undefined,
      nextSteps: formData.nextSteps || undefined,
      mood: formData.mood,
      topicsDiscussed: formData.topicsDiscussed.split(',').map(t => t.trim()).filter(t => t),
      customerFeedback: formData.customerFeedback || undefined,
      matchmakerObservations: formData.matchmakerObservations
    });
    
    if (updatedNote) {
      setNotes(notes.map(n => n.id === editingNote.id ? updatedNote : n));
    }
    
    setEditingNote(null);
    resetForm();
  };

  const handleDeleteNote = (noteId: string) => {
    if (deleteMeetingNote(noteId)) {
      setNotes(notes.filter(n => n.id !== noteId));
    }
  };

  const getMoodColor = (mood: MeetingNote['mood']) => {
    switch (mood) {
      case 'Positive': return 'bg-green-100 text-green-800';
      case 'Excited': return 'bg-blue-100 text-blue-800';
      case 'Neutral': return 'bg-gray-100 text-gray-800';
      case 'Concerned': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Meeting Notes</span>
          </CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Note
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Meeting Note</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Meeting Type</label>
                    <Select value={formData.meetingType} onValueChange={(value: MeetingNote['meetingType']) => setFormData({...formData, meetingType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Call">Call</SelectItem>
                        <SelectItem value="Video Call">Video Call</SelectItem>
                        <SelectItem value="In-Person Meeting">In-Person Meeting</SelectItem>
                        <SelectItem value="Coffee Meeting">Coffee Meeting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Duration (minutes)</label>
                    <Input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Meeting Notes</label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={4}
                    placeholder="Enter detailed notes about the meeting..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Mood</label>
                    <Select value={formData.mood} onValueChange={(value: MeetingNote['mood']) => setFormData({...formData, mood: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Positive">Positive</SelectItem>
                        <SelectItem value="Excited">Excited</SelectItem>
                        <SelectItem value="Neutral">Neutral</SelectItem>
                        <SelectItem value="Concerned">Concerned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Topics Discussed (comma-separated)</label>
                    <Input
                      value={formData.topicsDiscussed}
                      onChange={(e) => setFormData({...formData, topicsDiscussed: e.target.value})}
                      placeholder="Career, Family, Preferences..."
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Matchmaker Observations</label>
                  <Textarea
                    value={formData.matchmakerObservations}
                    onChange={(e) => setFormData({...formData, matchmakerObservations: e.target.value})}
                    rows={2}
                    placeholder="Your professional observations..."
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="followUp"
                    checked={formData.followUpRequired}
                    onChange={(e) => setFormData({...formData, followUpRequired: e.target.checked})}
                  />
                  <label htmlFor="followUp" className="text-sm font-medium">Follow-up Required</label>
                </div>
                
                {formData.followUpRequired && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Follow-up Date</label>
                      <Input
                        type="date"
                        value={formData.followUpDate}
                        onChange={(e) => setFormData({...formData, followUpDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Next Steps</label>
                      <Input
                        value={formData.nextSteps}
                        onChange={(e) => setFormData({...formData, nextSteps: e.target.value})}
                        placeholder="What needs to be done next..."
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddNote} className="bg-blue-600 hover:bg-blue-700">
                    Add Note
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {notes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No meeting notes yet</p>
            <p className="text-sm">Add your first meeting note to track interactions</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((note) => (
              <div key={note.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(note.date)}</span>
                    </Badge>
                    <Badge variant="secondary">{note.meetingType}</Badge>
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{note.duration}min</span>
                    </Badge>
                    <Badge className={getMoodColor(note.mood)}>{note.mood}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditNote(note)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">{note.notes}</p>
                  
                  {note.topicsDiscussed.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-gray-500">Topics: </span>
                      <span className="text-xs text-gray-600">{note.topicsDiscussed.join(', ')}</span>
                    </div>
                  )}
                  
                  {note.matchmakerObservations && (
                    <div>
                      <span className="text-xs font-medium text-gray-500">Observations: </span>
                      <span className="text-xs text-gray-600">{note.matchmakerObservations}</span>
                    </div>
                  )}
                  
                  {note.followUpRequired && (
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                        Follow-up Required
                      </Badge>
                      {note.followUpDate && (
                        <span className="text-xs text-gray-500">by {formatDate(note.followUpDate)}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Edit Dialog */}
        <Dialog open={!!editingNote} onOpenChange={() => setEditingNote(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Meeting Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Meeting Type</label>
                  <Select value={formData.meetingType} onValueChange={(value: MeetingNote['meetingType']) => setFormData({...formData, meetingType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Call">Call</SelectItem>
                      <SelectItem value="Video Call">Video Call</SelectItem>
                      <SelectItem value="In-Person Meeting">In-Person Meeting</SelectItem>
                      <SelectItem value="Coffee Meeting">Coffee Meeting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Duration (minutes)</label>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Meeting Notes</label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Mood</label>
                  <Select value={formData.mood} onValueChange={(value: MeetingNote['mood']) => setFormData({...formData, mood: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Positive">Positive</SelectItem>
                      <SelectItem value="Excited">Excited</SelectItem>
                      <SelectItem value="Neutral">Neutral</SelectItem>
                      <SelectItem value="Concerned">Concerned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Topics Discussed (comma-separated)</label>
                  <Input
                    value={formData.topicsDiscussed}
                    onChange={(e) => setFormData({...formData, topicsDiscussed: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Matchmaker Observations</label>
                <Textarea
                  value={formData.matchmakerObservations}
                  onChange={(e) => setFormData({...formData, matchmakerObservations: e.target.value})}
                  rows={2}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="editFollowUp"
                  checked={formData.followUpRequired}
                  onChange={(e) => setFormData({...formData, followUpRequired: e.target.checked})}
                />
                <label htmlFor="editFollowUp" className="text-sm font-medium">Follow-up Required</label>
              </div>
              
              {formData.followUpRequired && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Follow-up Date</label>
                    <Input
                      type="date"
                      value={formData.followUpDate}
                      onChange={(e) => setFormData({...formData, followUpDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Next Steps</label>
                    <Input
                      value={formData.nextSteps}
                      onChange={(e) => setFormData({...formData, nextSteps: e.target.value})}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingNote(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateNote} className="bg-blue-600 hover:bg-blue-700">
                  Update Note
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
