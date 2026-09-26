'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  ShoppingBag,
  Check,
  RefreshCw,
  ChevronDown,
  Info,
  Truck,
  Sprout,
  HelpCircle,
  ThumbsUp,
  ExternalLink,
  MapPin
} from 'lucide-react';
import { addToCart } from '@/lib/cart';
import type { Product } from '@/lib/types';

interface RecommendedProduct {
  id: string | number;
  name: string;
  slug?: string;
  price: number;
  unit: string;
  image: string;
  farmerName?: string;
  city?: string;
  organic?: boolean;
  category?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  products?: RecommendedProduct[];
  suggestedActions?: string[];
  timestamp: string;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasUnreadNotice, setHasUnreadNotice] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>({});

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-marco',
      sender: 'assistant',
      text: 'Assalam-o-Alaikum! 👋 Main **Marco** hoon, MarketLink ka AI Shopping & Support Assistant.\n\nMain aap ki fresh Pakistani produce (50+ items), delivery hubs (Karachi, Lahore, Islamabad, etc.), order tracking, aur farmer onboarding mein 100% help kar sakta hoon. Aaj aap kya dhoond rahe hain?',
      suggestedActions: [
        '🥦 Fresh Vegetables',
        '🍎 Fruits & Seasonals',
        '🚚 Delivery Cities & Rates',
        '🌐 Website Features & Pages',
        '👨‍🌾 Join as a Farmer',
        '💬 Urdu Assistant'
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnreadNotice(false);
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const newUserMessage: Message = {
      id: userMsgId,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newUserMessage]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.map((m) => ({ role: m.sender, content: m.text }))
        })
      });

      if (!res.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await res.json();

      const assistantMsg: Message = {
        id: `marco-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Marco is here to help! How else can I assist you?',
        products: data.recommendedProducts || [],
        suggestedActions: data.suggestedActions || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Marco chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'Marco ran into a temporary network glitch. Please ask your question again!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (p: RecommendedProduct) => {
    const product: Product = {
      id: typeof p.id === 'number' ? p.id : Math.floor(Math.random() * 10000) + 500,
      name: p.name,
      slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      price: p.price,
      unit: p.unit,
      category_id: 1,
      producer_id: 1,
      image_url: p.image,
      dietary_tags: p.organic ? 'Organic, Fresh' : 'Fresh',
      description: p.farmerName ? `Grown by ${p.farmerName} in ${p.city || 'Pakistan'}` : 'Fresh farm produce',
      featured: true,
      in_stock: true
    };

    addToCart(product, 1);
    setAddedItems((prev) => ({ ...prev, [String(p.id)]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [String(p.id)]: false }));
    }, 3000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-marco-reset-${Date.now()}`,
        sender: 'assistant',
        text: 'Chat reset! Main **Marco** hoon. Aap MarketLink ke bare mein koi bhi swaal poochein.',
        suggestedActions: [
          '🥦 Fresh Vegetables',
          '🍎 Fruits & Seasonals',
          '🚚 Delivery Cities & Rates',
          '👨‍🌾 Join as a Farmer'
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999] font-sans antialiased">
      {/* 1. Floating Welcome Bubble Badge (Only when closed) */}
      {!isOpen && hasUnreadNotice && (
        <div
          onClick={() => setIsOpen(true)}
          className="absolute bottom-16 right-0 mb-2 w-72 cursor-pointer rounded-2xl bg-white p-3.5 shadow-2xl border border-[#E0D8C8] text-xs text-[#1D3E2E] animate-bounce transition-all hover:scale-105"
        >
          <div className="flex items-center gap-2 font-bold text-[#E06D3B] mb-1">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Marco AI Assistant</span>
            <span className="ml-auto text-[10px] bg-[#E06D3B]/10 text-[#E06D3B] px-1.5 py-0.5 rounded-full uppercase font-extrabold">Online</span>
          </div>
          <p className="text-[#55695E] leading-tight">
            Assalam-o-Alaikum! Main Marco hoon. Product prices, delivery, order status ya website features ke liye poochain!
          </p>
        </div>
      )}

      {/* 2. Floating Action Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Marco AI Assistant"
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#1D3E2E] via-[#1A382A] to-[#152F22] text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 ring-4 ring-white/70 active:scale-95"
        >
          <Bot className="h-7 w-7 text-[#E06D3B] group-hover:rotate-12 transition-transform duration-300" />
          {hasUnreadNotice && (
            <span className="absolute top-0 right-0 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E06D3B] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-[#E06D3B] border-2 border-white"></span>
            </span>
          )}
        </button>
      )}

      {/* 3. Open Marco Chat Modal Window */}
      {isOpen && (
        <div
          className={`flex flex-col rounded-3xl bg-white border border-[#E0D8C8] shadow-2xl transition-all duration-300 overflow-hidden ${
            isMinimized
              ? 'h-16 w-80 sm:w-96'
              : 'h-[600px] max-h-[85vh] w-[92vw] sm:w-[420px]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-[#1D3E2E] via-[#1A382A] to-[#152F22] px-4 py-3.5 text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E06D3B]/20 border border-[#E06D3B]/40 text-[#E06D3B]">
                <Bot className="h-6 w-6" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#1D3E2E]" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  Marco AI
                  <span className="text-[10px] bg-[#E06D3B] text-white px-1.5 py-0.2 rounded font-mono font-semibold uppercase">Official</span>
                </h3>
                <span className="text-[11px] text-[#C4D6CB] font-medium flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Online · Full Store Knowledge
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                title="Reset Chat"
                className="p-1.5 text-[#C4D6CB] hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand Chat' : 'Minimize Chat'}
                className="p-1.5 text-[#C4D6CB] hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isMinimized ? 'rotate-180' : ''}`} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                className="p-1.5 text-[#C4D6CB] hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Main Content (Only when expanded) */}
          {!isMinimized && (
            <>
              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F9F6F0]/60">
                {messages.map((msg) => {
                  const isAssistant = msg.sender === 'assistant';

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'} space-y-2`}
                    >
                      <div className={`flex gap-2 max-w-[88%] ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}>
                        {/* Avatar */}
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            isAssistant
                              ? 'bg-[#1D3E2E] text-[#E06D3B]'
                              : 'bg-[#E06D3B] text-white'
                          }`}
                        >
                          {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </div>

                        {/* Message Bubble */}
                        <div
                          className={`rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                            isAssistant
                              ? 'bg-white text-[#1D3E2E] border border-[#E0D8C8] rounded-tl-none'
                              : 'bg-[#1D3E2E] text-white rounded-tr-none'
                          }`}
                        >
                          <div className="whitespace-pre-wrap font-sans">
                            {msg.text.split('\n').map((line, idx) => {
                              // Replace markdown bold **text** and code `/route`
                              let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                              formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-[#F4EFE6] text-[#E06D3B] px-1 py-0.5 rounded font-mono text-[11px]">$1</code>');

                              return (
                                <p
                                  key={idx}
                                  className={idx > 0 ? 'mt-1' : ''}
                                  dangerouslySetInnerHTML={{ __html: formatted }}
                                />
                              );
                            })}
                          </div>

                          <span
                            className={`block text-[9px] mt-1.5 text-right font-mono ${
                              isAssistant ? 'text-[#8B7355]' : 'text-[#C4D6CB]'
                            }`}
                          >
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>

                      {/* Products Carousel / Mini-Cards */}
                      {isAssistant && msg.products && msg.products.length > 0 && (
                        <div className="w-full pl-9 pr-2 space-y-2 mt-1">
                          <p className="text-[11px] font-bold text-[#1D3E2E] flex items-center gap-1">
                            <ShoppingBag className="w-3.5 h-3.5 text-[#E06D3B]" />
                            Marco's Recommended Produce:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {msg.products.map((p) => {
                              const isAdded = addedItems[String(p.id)];

                              return (
                                <div
                                  key={p.id}
                                  className="bg-white rounded-xl border border-[#E0D8C8] p-2.5 shadow-sm hover:border-[#E06D3B] transition-all flex flex-col justify-between"
                                >
                                  <div className="flex gap-2.5 items-center mb-2">
                                    <img
                                      src={p.image}
                                      alt={p.name}
                                      loading="lazy"
                                      decoding="async"
                                      className="w-12 h-12 rounded-lg object-cover border border-[#E0D8C8] shrink-0"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-1">
                                        {p.organic && (
                                          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1 rounded">
                                            Organic
                                          </span>
                                        )}
                                        <span className="text-[10px] text-[#55695E] truncate">
                                          {p.city || 'Pakistan'}
                                        </span>
                                      </div>
                                      <h4 className="font-bold text-xs text-[#1D3E2E] truncate">
                                        {p.name}
                                      </h4>
                                      <p className="text-xs font-semibold text-[#E06D3B]">
                                        Rs. {p.price} <span className="text-[10px] text-[#55695E]">/ {p.unit}</span>
                                      </p>
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => handleAddToCart(p)}
                                    className={`w-full py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                      isAdded
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-[#1D3E2E] hover:bg-[#28543E] text-white active:scale-95'
                                    }`}
                                  >
                                    {isAdded ? (
                                      <>
                                        <Check className="w-3.5 h-3.5" /> Added to Cart
                                      </>
                                    ) : (
                                      <>
                                        <ShoppingBag className="w-3.5 h-3.5 text-[#E06D3B]" /> Add to Cart
                                      </>
                                    )}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Suggested Chips */}
                      {isAssistant && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pl-9 pr-2 mt-1.5">
                          {msg.suggestedActions.map((action, actionIdx) => (
                            <button
                              key={actionIdx}
                              onClick={() => handleSendMessage(action)}
                              className="text-[11px] font-semibold bg-white hover:bg-[#E06D3B] hover:text-white text-[#1D3E2E] border border-[#E0D8C8] px-2.5 py-1 rounded-full shadow-2xs transition-all duration-200 active:scale-95"
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Loading State */}
                {isLoading && (
                  <div className="flex items-center gap-2 pl-9 text-xs text-[#55695E]">
                    <div className="flex space-x-1 items-center bg-white border border-[#E0D8C8] rounded-full px-3 py-1.5 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E06D3B] animate-bounce"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E06D3B] animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E06D3B] animate-bounce [animation-delay:0.4s]"></span>
                      <span className="ml-2 font-mono text-[10px] text-[#8B7355]">Marco AI is thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-white border-t border-[#E0D8C8] shrink-0"
              >
                <div className="flex items-center gap-2 bg-[#F9F6F0] rounded-2xl border border-[#E0D8C8] px-3 py-1.5 focus-within:border-[#1D3E2E] focus-within:ring-2 focus-within:ring-[#1D3E2E]/10 transition-all">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask Marco about products, delivery, routes..."
                    className="flex-1 bg-transparent text-xs text-[#1D3E2E] placeholder-[#8B7355] focus:outline-none py-1.5"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    aria-label="Send message to Marco"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#1D3E2E] text-white disabled:opacity-40 hover:bg-[#E06D3B] transition-all duration-200"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#8B7355] mt-1.5 px-1 font-mono">
                  <span>🤖 Marco AI · MarketLink Assistant</span>
                  <span>Karachi · Lahore · Islamabad</span>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
