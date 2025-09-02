import React, { useState, useEffect } from "react";
import { DiaryEntry, User } from "@/entities/all";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Save, BookOpen, PlusCircle } from "lucide-react";
import { format } from "date-fns";

export default function Diary() {
    const [entries, setEntries] = useState([]);
    const [currentEntry, setCurrentEntry] = useState("");
    const [user, setUser] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [view, setView] = useState('list'); // 'list' or 'new'

    useEffect(() => {
        const loadData = async () => {
            const currentUser = await User.me();
            setUser(currentUser);
            if (currentUser) {
                const userEntries = await DiaryEntry.filter({ user_id: currentUser.id }, '-entry_date');
                setEntries(userEntries);
            }
        };
        loadData();
    }, []);

    const handleSave = async () => {
        if (currentEntry.trim() === '' || !user) return;
        setIsSaving(true);
        const newEntry = {
            user_id: user.id,
            content: currentEntry,
            entry_date: format(new Date(), 'yyyy-MM-dd'),
        };
        try {
            const createdEntry = await DiaryEntry.create(newEntry);
            setEntries([createdEntry, ...entries]);
            setCurrentEntry("");
            setView('list');
        } catch (error) {
            console.error("Failed to save diary entry:", error);
        } finally {
            setIsSaving(false);
        }
    };
    
    const modules = {
        toolbar: [
          [{ 'header': '1'}, {'header': '2'}],
          ['bold', 'italic', 'underline', 'strike'],
          [{'list': 'ordered'}, {'list': 'bullet'}],
          ['link'],
          ['clean']
        ],
      };

    return (
        <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">My Private Diary</h1>
                    {view === 'list' && (
                        <Button onClick={() => setView('new')}>
                            <PlusCircle className="w-4 h-4 mr-2" />
                            New Entry
                        </Button>
                    )}
                </div>

                {view === 'new' ? (
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-lg font-semibold mb-2">Today's Thoughts - {format(new Date(), 'PPP')}</h2>
                            <div className="bg-white rounded-lg">
                                <ReactQuill 
                                    theme="snow" 
                                    value={currentEntry} 
                                    onChange={setCurrentEntry}
                                    modules={modules}
                                    className="h-64 mb-16"
                                />
                            </div>
                             <div className="flex justify-end gap-3 mt-4">
                                <Button variant="outline" onClick={() => setView('list')}>Cancel</Button>
                                <Button onClick={handleSave} disabled={isSaving}>
                                    <Save className="w-4 h-4 mr-2" />
                                    {isSaving ? "Saving..." : "Save Entry"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {entries.length > 0 ? entries.map(entry => (
                            <Card key={entry.id}>
                                <CardContent className="p-6">
                                    <p className="text-sm font-semibold text-teal-600 mb-2">{format(new Date(entry.entry_date), 'PPP')}</p>
                                    <div 
                                        className="prose prose-slate max-w-none"
                                        dangerouslySetInnerHTML={{ __html: entry.content }} 
                                    />
                                </CardContent>
                            </Card>
                        )) : (
                            <div className="text-center py-16">
                                <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-slate-700">Your diary is empty</h3>
                                <p className="text-slate-500">Click 'New Entry' to write down your thoughts.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
