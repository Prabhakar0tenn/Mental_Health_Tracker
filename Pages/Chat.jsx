
import React, { useState, useEffect, useRef } from "react";
import { ChatMessage, User } from "@/entities/all";
import { InvokeLLM } from "@/integrations/Core";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, CornerDownLeft } from "lucide-react";

const Message = ({ msg }) => (
    <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-md p-3 rounded-2xl ${
            msg.sender === 'user' 
                ? 'bg-blue-500 text-white rounded-br-none' 
                : 'bg-slate-200 text-slate-800 rounded-bl-none'
        }`}>
            {msg.text}
        </div>
    </div>
);

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [user, setUser] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const initChat = async () => {
            const currentUser = await User.me();
            setUser(currentUser);
            const newSessionId = `session_${Date.now()}`;
            setSessionId(newSessionId);

            const botName = currentUser.chatbot_name || 'your AI friend';
            const initialBotMessage = {
                user_id: currentUser.id,
                session_id: newSessionId,
                sender: 'bot',
                text: `Hey ${currentUser.alias || 'there'}! I'm ${botName}. How has your day been? Feel free to share anything on your mind.`,
            };
            setMessages([initialBotMessage]);
            await ChatMessage.create(initialBotMessage);
        };
        initChat();
    }, []);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || !user || !sessionId) return;

        const userMessage = {
            user_id: user.id,
            session_id: sessionId,
            sender: 'user',
            text: input.trim(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        await ChatMessage.create(userMessage);

        const prompt = `You are a friendly, supportive, and empathetic AI friend named '${user.chatbot_name || 'CampusMind AI'}' talking to a student. Your goal is to listen, provide comfort, and offer gentle, positive suggestions based on cognitive-behavioral therapy (CBT) principles if appropriate. NEVER give medical advice. If the user expresses thoughts of self-harm, suicide, or severe distress, you MUST respond with: "It sounds like you are going through a lot right now, and it’s really brave of you to share. For immediate support, please reach out to a professional. You can call the crisis hotline at [Your Country's Helpline Number] or use the 'Booking' feature in this app to connect with a campus counsellor. Please know that you are not alone."

        The user's alias is: ${user.alias || 'friend'}.
        Their hobbies are: ${user.hobbies?.join(', ') || 'not specified'}.
        
        Previous conversation context:
        ${messages.slice(-5).map(m => `${m.sender}: ${m.text}`).join('\n')}
        
        User's latest message: "${input.trim()}"
        
        Your response (be concise, warm, and conversational):`;

        try {
            const botReplyText = await InvokeLLM({ prompt });
            
            const botMessage = {
                user_id: user.id,
                session_id: sessionId,
                sender: 'bot',
                text: botReplyText,
            };

            setMessages(prev => [...prev, botMessage]);
            await ChatMessage.create(botMessage);
        } catch (error) {
            console.error("Error getting bot response:", error);
            const errorMessage = {
                user_id: user.id,
                session_id: sessionId,
                sender: 'bot',
                text: "I'm having a little trouble connecting right now. Please try again in a moment.",
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-100">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, index) => (
                    <Message key={index} msg={msg} />
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="p-3 rounded-2xl bg-slate-200 text-slate-800 rounded-bl-none">
                            <div className="flex items-center space-x-1">
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-300"></span>
                            </div>
                        </div>
                    </div>
                )}
                 <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-white border-t border-slate-200">
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        className="pr-20 h-12"
                    />
                    <Button 
                        onClick={handleSend}
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        size="icon"
                    >
                        <Send className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
