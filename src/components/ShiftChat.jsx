import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext.jsx';
import { streamShift } from '../hooks/useShift.js';

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 mt-1">
        <span className="text-white font-bold text-xs">S</span>
      </div>
      <div className="shift-bubble px-4 py-3 max-w-[80%]">
        <div className="flex items-center gap-1.5">
          <div className="typing-dot" style={{ animationDelay: '0ms' }} />
          <div className="typing-dot" style={{ animationDelay: '200ms' }} />
          <div className="typing-dot" style={{ animationDelay: '400ms' }} />
        </div>
      </div>
    </div>
  );
}

function ShiftMessage({ content, isStreaming }) {
  return (
    <div className="flex items-start gap-3 animate-slide-in">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 mt-1">
        <span className="text-white font-bold text-xs">S</span>
      </div>
      <div className="flex flex-col max-w-[85%]">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-mair-highlight text-xs font-semibold">Shift</span>
          <div className="shift-dot" style={{ width: '6px', height: '6px' }} />
        </div>
        <div className="shift-bubble px-4 py-3">
          <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
            {content}
            {isStreaming && (
              <span className="inline-block w-0.5 h-4 bg-mair-indigo ml-0.5 animate-pulse align-middle" />
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function UserMessage({ content }) {
  return (
    <div className="flex justify-end animate-slide-in">
      <div className="user-bubble px-4 py-3 max-w-[85%]">
        <p className="text-white text-sm leading-relaxed">{content}</p>
      </div>
    </div>
  );
}

export default function ShiftChat() {
  const { userProfile } = useUser();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const hasInitialized = useRef(false);

  // Seed initial message from ShiftIntro
  useEffect(() => {
    if (!hasInitialized.current && userProfile.shiftIntroMessage) {
      setMessages([
        { role: 'assistant', content: userProfile.shiftIntroMessage }
      ]);
      hasInitialized.current = true;
    }
  }, [userProfile.shiftIntroMessage]);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage, isLoading]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || isStreaming) return;

    const userMessage = { role: 'user', content: trimmed };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setStreamingMessage('');

    // Build conversation history for the API (all messages so far)
    const apiMessages = newMessages.map(m => ({
      role: m.role,
      content: m.content,
    }));

    try {
      setIsLoading(false);
      setIsStreaming(true);

      await streamShift(
        apiMessages,
        userProfile,
        (chunk, fullText) => {
          setStreamingMessage(fullText);
        },
        (fullText) => {
          setIsStreaming(false);
          setStreamingMessage('');
          setMessages(prev => [...prev, { role: 'assistant', content: fullText }]);
        },
        400
      );
    } catch (err) {
      console.error('Shift stream error:', err);
      setIsLoading(false);
      setIsStreaming(false);
      setStreamingMessage('');
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please check your API key in the .env file and try again.",
        },
      ]);
    }

    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isBusy = isLoading || isStreaming;

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/8 flex-shrink-0">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center glow-indigo">
          <span className="text-white font-bold text-sm">S</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold text-sm">Shift</span>
            <div className="shift-dot" />
          </div>
          <span className="text-mair-secondary text-xs">
            {isBusy ? 'Thinking...' : 'Your Veer.me reinvention companion · Ready'}
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-5 space-y-4 min-h-0">
        {messages.length === 0 && !isLoading && (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <p className="text-mair-secondary text-sm">
              Send a message to start your coaching session
            </p>
          </div>
        )}

        {messages.map((msg, i) =>
          msg.role === 'assistant' ? (
            <ShiftMessage key={i} content={msg.content} isStreaming={false} />
          ) : (
            <UserMessage key={i} content={msg.content} />
          )
        )}

        {/* Streaming message */}
        {isStreaming && streamingMessage && (
          <ShiftMessage content={streamingMessage} isStreaming={true} />
        )}

        {/* Typing indicator (before streaming starts) */}
        {isLoading && <TypingIndicator />}
        {isStreaming && !streamingMessage && <TypingIndicator />}

        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div className="px-4 py-3.5 border-t border-white/8 flex-shrink-0">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Shift..."
              rows={1}
              disabled={isBusy}
              style={{ resize: 'none', maxHeight: '120px', overflowY: 'auto' }}
              className="mair-input w-full px-4 py-3 text-sm pr-12"
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isBusy}
            className={`
              w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200
              ${!input.trim() || isBusy
                ? 'bg-white/8 text-mair-secondary/40 cursor-not-allowed'
                : 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105'
              }
            `}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-mair-secondary/30 text-xs mt-2 text-center">
          Press Enter to send · Shift remembers everything you shared
        </p>
      </div>
    </div>
  );
}
