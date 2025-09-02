import React, { useState, useEffect } from "react";
import { Resource } from "@/entities/all";
import { Card, CardContent } from "@/components/ui/card";
import { Music, Video, BookOpen, PlayCircle, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ResourceCard = ({ resource }) => {
    const icons = {
        audio: <Music className="w-5 h-5 text-orange-500" />,
        video: <Video className="w-5 h-5 text-blue-500" />,
        article: <BookOpen className="w-5 h-5 text-emerald-500" />
    };

    return (
        <a href={resource.url} target="_blank" rel="noopener noreferrer">
            <Card className="h-full group overflow-hidden">
                <div className="relative">
                    <img src={resource.thumbnail_url || 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&q=80'} alt={resource.title} className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <PlayCircle className="w-12 h-12 text-white/80" />
                    </div>
                </div>
                <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        {icons[resource.type]}
                        <h3 className="font-semibold text-slate-800 truncate">{resource.title}</h3>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="capitalize">{resource.category}</span>
                        {resource.duration_minutes && (
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3"/>{resource.duration_minutes} min</span>
                        )}
                    </div>
                </CardContent>
            </Card>
        </a>
    );
}

export default function Resources() {
    const [resources, setResources] = useState([]);
    
    useEffect(() => {
        Resource.list().then(setResources);
    }, []);

    const categories = ['all', 'sleep', 'anxiety', 'focus', 'breathing'];

    return (
        <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Relaxation Library</h1>
                    <p className="text-slate-600 mt-1">Calming audio, videos, and exercises to help you unwind.</p>
                </div>
                
                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-5 md:w-2/3 lg:w-1/2 mb-6">
                        {categories.map(cat => (
                            <TabsTrigger key={cat} value={cat} className="capitalize">{cat}</TabsTrigger>
                        ))}
                    </TabsList>
                    
                    {categories.map(category => (
                        <TabsContent key={category} value={category}>
                             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {resources.filter(r => category === 'all' || r.category === category).map(res => (
                                    <ResourceCard key={res.id} resource={res} />
                                ))}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </div>
    );
}
