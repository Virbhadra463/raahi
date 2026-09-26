"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../../types/travel";
import {
  Send,
  Loader2,
  Sparkles,
  User,
  Bot,
  MessageSquare,
  CornerDownLeft,
} from "lucide-react";

interface ConversationViewProps {
  chatHistory: ChatMessage[];
  tripName: string;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const QUICK_MODIFICATION_SUGGESTIONS = [
  "Add 1 more day to this trip",
  "Reduce pace & keep transit short",
  "Suggest budget hostel under ₹800/night",
  "Include more local artisan workshops",
  "Change total budget to ₹8,000",
];

export const ConversationView: React.FC<ConversationViewProps> = ({
  chatHistory,
  tripName,
  onSendMessage,
  isLoading,
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;
    onSendMessage(inputMessage.trim());
    setInputMessage("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (isLoading) return;
    onSendMessage(suggestion);
  };

  return (
    <div className="w-full bg-[#FFFDF9] rounded-3xl shadow-bollywood border-2 sm:border-3 border-signboard-navy p-5 sm:p-6 space-y-4 text-signboard-navy relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-signboard-navy/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-carpet-maroon text-marigold flex items-center justify-center shadow-xs">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-black text-xs sm:text-sm text-signboard-navy">
              AI Travel Scribe · <span className="text-carpet-maroon">{tripName}</span>
            </h3>
            <p className="text-[10px] text-signboard-navy/60 font-medium">
              Context-aware constraint tuning &amp; re-routing
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
        {chatHistory.length === 0 ? (
          <div className="py-8 text-center text-xs text-signboard-navy/50 font-heading font-bold space-y-1">
            <p>No dialogue recorded yet.</p>
            <p className="text-[11px] font-normal text-signboard-navy/40">
              Type any adjustment or question below to tune your itinerary!
            </p>
          </div>
        ) : (
          chatHistory.map((msg, index) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={index}
                className={`flex items-start gap-2.5 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-xl bg-carpet-maroon text-marigold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    isUser
                      ? "bg-carpet-maroon text-parchment rounded-br-xs shadow-sm font-body font-medium"
                      : "bg-parchment text-signboard-navy rounded-bl-xs border-2 border-signboard-navy/15 whitespace-pre-wrap font-body font-medium"
                  }`}
                >
                  <p>{msg.content}</p>
                  {msg.timestamp && (
                    <div
                      className={`text-[9px] mt-1 font-mono font-bold ${
                        isUser ? "text-marigold/80 text-right" : "text-signboard-navy/50 text-left"
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-xl bg-signboard-navy text-parchment flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs font-heading font-bold text-carpet-maroon p-2">
            <Loader2 className="w-4 h-4 animate-spin text-marigold" />
            <span>AI Scribe is recalculating your itinerary...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick modification suggestion chips */}
      {chatHistory.length > 0 && (
        <div className="pt-2 border-t-2 border-signboard-navy/10">
          <div className="text-[11px] font-heading font-black text-signboard-navy/60 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-terracotta" />
            <span>Quick modifications:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_MODIFICATION_SUGGESTIONS.map((sug, i) => (
              <button
                key={i}
                type="button"
                disabled={isLoading}
                onClick={() => handleSuggestionClick(sug)}
                className="text-[11px] px-2.5 py-1 rounded-xl bg-parchment hover:bg-marigold/40 text-signboard-navy font-heading font-bold transition-all border border-marigold shadow-xs disabled:opacity-50 cursor-pointer active:scale-95"
              >
                + {sug}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Follow-up input form */}
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2 pt-1">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={isLoading}
          placeholder={`Modify ${tripName} (e.g. 'add vegetarian café', 'find cheaper stay')...`}
          className="w-full px-4 py-2.5 pr-11 rounded-2xl border-2 border-signboard-navy/20 bg-parchment/60 focus:bg-white text-signboard-navy placeholder:text-signboard-navy/40 focus:outline-none focus:border-carpet-maroon focus:ring-2 focus:ring-carpet-maroon/20 text-xs sm:text-sm font-body font-medium transition-all"
        />
        <button
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
          className="absolute right-2 top-2 p-2 rounded-xl bg-carpet-maroon hover:bg-carpet-light active:scale-95 disabled:opacity-40 text-white transition-all cursor-pointer shadow-xs"
          title="Send modification request"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-marigold" />
          ) : (
            <Send className="w-4 h-4 text-marigold" />
          )}
        </button>
      </form>
    </div>
  );
};
