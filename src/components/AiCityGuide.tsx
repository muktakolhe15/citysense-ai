import React, { useState, useRef, useEffect } from 'react';
import { City, ChatMessage, PlacePOI } from '../types.ts';
import { askCityGuide } from '../services/api.ts';
import { Sparkles, Send, Bot, User, Trash2, Copy, Check, AlertCircle, Compass, HelpCircle } from 'lucide-react';

interface AiCityGuideProps {
  city: City;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export const AiCityGuide: React.FC<AiCityGuideProps> = ({
  city,
  initialPrompt,
  onClearInitialPrompt
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Hello! I am your AI City Guide for **${city.name}, ${city.country}**.\n\nAsk me anything about local transit passes, cultural etiquette, safe pedestrian areas, authentic food spots, or a personalized walking itinerary!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle city change: send a fresh welcome note
  useEffect(() => {
    setMessages([
      {
        id: `welcome-${city.id}`,
        role: 'model',
        text: `Welcome to **${city.name}, ${city.country}**! 🌆\n\nI can help you navigate local trains, discover hidden neighborhood spots, understand tipping etiquette, or plan your schedule. What would you like to explore?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setError(null);
  }, [city.id]);

  // Handle external initialPrompt if triggered from a POI card
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSend(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    setInput('');
    setError(null);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const historyPayload = messages.map(m => ({ role: m.role, text: m.text }));
      const response = await askCityGuide(city.name, city.country, query, historyPayload);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error('AI Guide Error:', err);
      setError(err.message || 'Failed to connect to the Gemini AI guide service.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const samplePrompts = [
    `Best 1-day walking itinerary for ${city.name}`,
    `How do subway/bus passes work in ${city.name}?`,
    `Essential cultural etiquette and tipping customs`,
    `Top 3 authentic local dishes to try and where`,
    `Emergency medical phrases and clinic navigation`
  ];

  // Simple Markdown renderer for bullet points, bolding, and headings
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Bold syntax handling: **text**
      const formattedLine = line.split(/(\*\*.*?\*\*)/g).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-sm font-bold text-indigo-300 mt-2 mb-1">{line.slice(4)}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="text-base font-bold text-white mt-3 mb-1.5">{line.slice(3)}</h3>;
      }
      if (line.startsWith('* ') || line.startsWith('- ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-slate-300 text-xs sm:text-sm my-0.5 leading-relaxed">
            {formattedLine}
          </li>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <li key={idx} className="ml-4 list-decimal text-slate-300 text-xs sm:text-sm my-0.5 leading-relaxed">
            {formattedLine}
          </li>
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-slate-300 text-xs sm:text-sm leading-relaxed my-0.5">
          {formattedLine}
        </p>
      );
    });
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col h-[650px] overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                CitySense AI Assistant
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-semibold font-mono">
                gemini-3.8-flash
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Expert local context for {city.name}, {city.country} • Key secured on server
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: `welcome-reset`,
                role: 'model',
                text: `Chat cleared. Ask me anything about ${city.name}!`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]);
            setError(null);
          }}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition cursor-pointer"
          title="Clear conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-slate-700 text-slate-200'
                    : 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 shadow-md text-xs sm:text-sm relative group ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-950/80 text-slate-200 border border-slate-800 rounded-tl-none'
                }`}
              >
                <div className="space-y-1">
                  {renderFormattedText(msg.text)}
                </div>

                {/* Footer timestamp & copy button */}
                <div
                  className={`flex items-center justify-between gap-3 mt-2 pt-1 text-[10px] ${
                    isUser ? 'text-indigo-200' : 'text-slate-500'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => copyToClipboard(msg.id, msg.text)}
                      className="opacity-0 group-hover:opacity-100 transition text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl rounded-tl-none p-4 shadow-md flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
              <span className="text-xs text-slate-400 font-medium">
                Gemini is researching local context for {city.name}...
              </span>
            </div>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="font-semibold block mb-0.5">Assistant Request Failed</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <HelpCircle className="w-3 h-3" /> Ask:
        </span>
        {samplePrompts.map((promptText, idx) => (
          <button
            key={idx}
            disabled={loading}
            onClick={() => handleSend(promptText)}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium whitespace-nowrap transition border border-slate-700/60 cursor-pointer disabled:opacity-50"
          >
            {promptText}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder={`Ask Gemini about ${city.name} transit, food, safety, culture...`}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white disabled:text-slate-500 text-sm font-semibold flex items-center gap-2 transition cursor-pointer shadow-md shadow-indigo-600/30 disabled:shadow-none"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 px-1">
          <span>Server-side @google/genai SDK • No client keys exposed</span>
          <span>Official municipal sources prioritized</span>
        </div>
      </div>
    </div>
  );
};
