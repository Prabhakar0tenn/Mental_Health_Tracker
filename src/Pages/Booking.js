import React, { useState } from "react";
import { Booking } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react";

const counsellors = [
    { id: '1', name: 'Dr. Anjali Sharma', specialty: 'Anxiety & Stress' },
    { id: '2', name: 'Mr. Rohan Gupta', specialty: 'Career & Academic Pressure' },
    { id: '3', name: 'Ms. Priya Singh', specialty: 'Relationships & Social Issues' },
];

export default function BookingPage() {
    const [selectedCounsellor, setSelectedCounsellor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [notes, setNotes] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async () => {
        // Validation would be here
        // ...
        setIsSubmitted(true);
    };

    return (
        <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Book a Confidential Session</h1>
                    <p className="text-slate-600 mt-1">Connect with a professional campus counsellor.</p>
                </div>

                <Alert variant="destructive" className="mb-6 bg-red-50 border-red-200 text-red-800">
                    <AlertCircle className="h-4 w-4 !text-red-800" />
                    <AlertTitle>In Crisis?</AlertTitle>
                    <AlertDescription>
                        If you are in immediate distress or crisis, please call the national helpline at <span className="font-semibold">988</span> or contact local emergency services. This booking system is not for emergencies.
                    </AlertDescription>
                </Alert>

                {isSubmitted ? (
                    <Card className="text-center p-8">
                        <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold">Request Sent!</h2>
                        <p className="text-slate-600 mt-2">Your request for a session has been sent. The counsellor's office will contact you via your student email to confirm the time and details.</p>
                        <Button onClick={() => setIsSubmitted(false)} className="mt-6">Book Another Session</Button>
                    </Card>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-1 space-y-4">
                            <h3 className="font-semibold text-lg">1. Select a Counsellor</h3>
                            {counsellors.map(c => (
                                <Card 
                                    key={c.id} 
                                    className={`cursor-pointer transition-all ${selectedCounsellor?.id === c.id ? 'border-teal-500 ring-2 ring-teal-500' : 'hover:bg-slate-100'}`}
                                    onClick={() => setSelectedCounsellor(c)}
                                >
                                    <CardContent className="p-4">
                                        <p className="font-semibold">{c.name}</p>
                                        <p className="text-sm text-slate-500">{c.specialty}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <h3 className="font-semibold text-lg mb-2">2. Select a Preferred Date</h3>
                                <Card>
                                    <CardContent className="p-2 flex justify-center">
                                        <Calendar
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={setSelectedDate}
                                            disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">3. Add Notes (Optional)</h3>
                                <Textarea 
                                    placeholder="Briefly mention what you'd like to talk about. This is confidential and will only be seen by the counsellor."
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-2">4. Confirm & Submit</h3>
                                <div className="flex items-center space-x-2 mb-4">
                                    <Checkbox id="anonymous" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                                    <Label htmlFor="anonymous">Request this session anonymously</Label>
                                </div>
                                <Button 
                                    onClick={handleSubmit} 
                                    disabled={!selectedCounsellor || !selectedDate}
                                    className="w-full"
                                >
                                    Request Session
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
