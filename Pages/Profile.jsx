
import React, { useState, useEffect } from "react";
import { User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { User as UserIcon, Save } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setFormData({
        alias: userData.alias || `User${Math.floor(Math.random() * 10000)}`,
        chatbot_name: userData.chatbot_name || 'CampusMind AI',
        institution_id: userData.institution_id || '',
        hobbies: userData.hobbies?.join(', ') || '',
        consent_flags: userData.consent_flags || { analytics: false, chat_logging: false },
      });
      
      if (!userData.alias) {
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const dataToSave = {
          ...formData,
          hobbies: formData.hobbies.split(',').map(h => h.trim()).filter(Boolean),
      };
      await User.updateMyUserData(dataToSave);
      setUser(prev => ({ ...prev, ...dataToSave }));
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
      return <div>Loading profile...</div>
  }

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">{user?.full_name || 'Your Profile'}</h1>
              <p className="text-slate-600">{user?.email}</p>
            </div>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              Edit Profile
            </Button>
          )}
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60">
            <CardHeader>
              <CardTitle>Profile & Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="alias">Anonymous Alias</Label>
                    <Input id="alias" value={formData.alias} onChange={e => setFormData({...formData, alias: e.target.value})} />
                    <p className="text-xs text-slate-500">This name will be shown in forums and chats.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chatbot_name">AI Friend's Name</Label>
                    <Input id="chatbot_name" value={formData.chatbot_name} onChange={e => setFormData({...formData, chatbot_name: e.target.value})} />
                    <p className="text-xs text-slate-500">Give your virtual friend a personal name.</p>
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="hobbies">Hobbies & Interests</Label>
                    <Input id="hobbies" placeholder="e.g., Reading, Music, Sports" value={formData.hobbies} onChange={e => setFormData({...formData, hobbies: e.target.value})} />
                    <p className="text-xs text-slate-500">Separate with commas. This helps the AI suggest activities.</p>
                  </div>
                  <div className="space-y-4 pt-4 border-t">
                      <h3 className="font-semibold">Privacy Settings</h3>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="analytics-consent">Allow anonymized analytics</Label>
                        <Switch id="analytics-consent" checked={formData.consent_flags?.analytics} onCheckedChange={checked => setFormData({...formData, consent_flags: {...formData.consent_flags, analytics: checked}})} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="chat-consent">Allow AI to learn from chats</Label>
                        <Switch id="chat-consent" checked={formData.consent_flags?.chat_logging} onCheckedChange={checked => setFormData({...formData, consent_flags: {...formData.consent_flags, chat_logging: checked}})} />
                      </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleSave} disabled={isSaving}>
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                    <div>
                        <Label className="text-sm text-slate-500">Anonymous Alias</Label>
                        <p className="font-medium">{user?.alias || 'Not set'}</p>
                    </div>
                    <div>
                        <Label className="text-sm text-slate-500">AI Friend's Name</Label>
                        <p className="font-medium">{user?.chatbot_name || 'CampusMind AI'}</p>
                    </div>
                     <div>
                        <Label className="text-sm text-slate-500">Hobbies</Label>
                        <p className="font-medium">{user?.hobbies?.join(', ') || 'Not set'}</p>
                    </div>
                </div>
              )}
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
