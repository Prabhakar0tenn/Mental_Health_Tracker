import React from 'react';
import { User } from '@/entities/all';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { MessageSquare, Book, Users, Music, Calendar } from 'lucide-react';

const FeatureCard = ({ title, description, icon, url, color }) => (
    <Link to={url}>
        <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium">{title}</CardTitle>
                {React.cloneElement(icon, { className: `w-5 h-5 ${color}` })}
            </CardHeader>
            <CardContent>
                <p className="text-sm text-slate-600">{description}</p>
            </CardContent>
        </Card>
    </Link>
);

export default function Dashboard() {
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        User.me().then(setUser);
    }, []);

    const getTimeOfDay = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "morning";
        if (hour < 18) return "afternoon";
        return "evening";
    }

    return (
        <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">
                        Good {getTimeOfDay()}, {user?.alias || 'friend'}.
                    </h1>
                    <p className="text-slate-600 mt-1">
                        Welcome to your personal space. How are you feeling today?
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FeatureCard 
                        title="AI Virtual Friend"
                        description="Chat with your AI friend anytime you need someone to talk to."
                        icon={<MessageSquare />}
                        url={createPageUrl("Chat")}
                        color="text-blue-500"
                    />
                     <FeatureCard 
                        title="Private Diary"
                        description="Write down your thoughts and feelings in a secure, private journal."
                        icon={<Book />}
                        url={createPageUrl("Diary")}
                        color="text-emerald-500"
                    />
                     <FeatureCard 
                        title="Peer Support Forum"
                        description="Connect with other students anonymously and share experiences."
                        icon={<Users />}
                        url={createPageUrl("Forum")}
                        color="text-purple-500"
                    />
                     <FeatureCard 
                        title="Relaxation Library"
                        description="Access calming sounds and guided exercises for sleep and anxiety."
                        icon={<Music />}
                        url={createPageUrl("Resources")}
                        color="text-orange-500"
                    />
                </div>
                
                <Card className="mt-8 bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Need Professional Support?
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">
                            You can confidentially book a session with a campus counsellor. Your privacy is our priority.
                        </p>
                        <Link to={createPageUrl("Booking")}>
                            <Button variant="secondary" className="bg-white/90 text-teal-600 hover:bg-white">
                                Book a Session
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
