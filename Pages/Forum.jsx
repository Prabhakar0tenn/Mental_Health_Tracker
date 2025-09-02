import React, { useState, useEffect } from "react";
import { ForumPost, User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, MessageSquare, PlusCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Forum() {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', body: '' });

    useEffect(() => {
        const loadData = async () => {
            const [userData, postData] = await Promise.all([User.me(), ForumPost.list('-created_date')]);
            setUser(userData);
            setPosts(postData);
        };
        loadData();
    }, []);

    const handleCreatePost = async () => {
        if (!user?.alias || !newPost.title || !newPost.body) return;

        const postToCreate = {
            user_alias: user.alias,
            title: newPost.title,
            body: newPost.body,
        };

        const createdPost = await ForumPost.create(postToCreate);
        setPosts([createdPost, ...posts]);
        setNewPost({ title: '', body: '' });
        setShowForm(false);
    };

    return (
        <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Anonymous Peer Forum</h1>
                    <Button onClick={() => setShowForm(!showForm)}>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        {showForm ? 'Cancel' : 'Create Post'}
                    </Button>
                </div>

                {showForm && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Create a New Anonymous Post</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input 
                                placeholder="Post Title" 
                                value={newPost.title}
                                onChange={e => setNewPost({...newPost, title: e.target.value})}
                            />
                            <Textarea 
                                placeholder="Share what's on your mind... Remember to be respectful." 
                                value={newPost.body}
                                onChange={e => setNewPost({...newPost, body: e.target.value})}
                                rows={5}
                            />
                            <div className="text-xs text-slate-500">
                                You will be posting as <span className="font-semibold">{user?.alias || '...'}</span>.
                            </div>
                            <Button onClick={handleCreatePost}>Post Anonymously</Button>
                        </CardContent>
                    </Card>
                )}

                <div className="space-y-6">
                    {posts.map(post => (
                        <Card key={post.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle>{post.title}</CardTitle>
                                <p className="text-sm text-slate-500">
                                    Posted by <span className="font-semibold">{post.user_alias}</span> • {formatDistanceToNow(new Date(post.created_date), { addSuffix: true })}
                                </p>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-700 whitespace-pre-wrap">{post.body}</p>
                                <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                                    <Button variant="ghost" size="sm" className="flex items-center gap-1 text-slate-600">
                                        <ThumbsUp className="w-4 h-4" /> {post.upvotes || 0}
                                    </Button>
                                    <Button variant="ghost" size="sm" className="flex items-center gap-1 text-slate-600">
                                        <MessageSquare className="w-4 h-4" /> 0 Comments
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
