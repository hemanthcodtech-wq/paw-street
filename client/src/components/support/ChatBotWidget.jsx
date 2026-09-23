import React, { useState, useEffect, useRef } from 'react';
import { Bot, ChevronRight, Send, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';

export default function ChatBotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { orders } = useOrders();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'bot',
      text: 'Woof! 🐾 Welcome to PAW NEAR Support! I am your 24/7 Pet Assistant. How can I help you today?',
      time: 'Just now',
      quickActions: [
        '🚚 Where is my order?',
        '🔄 Return or refund request',
        '🐾 Pet diet recommendations',
        '💬 Connect with Live Agent'
      ]
    }
  ]);

  const [inputVal, setInputVal] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (userText) => {
    const text = userText || inputVal;
    if (!text.trim()) return;

    // Add user message
    const userMsg = {
      id: `m-${Date.now()}`,
      sender: 'user',
      text: text,
      time: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');

    // Simulate smart bot responses based on intent
    setTimeout(() => {
      let replyText = '';
      let quickActions = null;

      const lower = text.toLowerCase();

      if (lower.includes('where is my order') || lower.includes('track') || lower.includes('delivery')) {
        const latest = Array.isArray(orders) ? orders[0] : null;
        if (!latest) {
          replyText = 'You do not have any orders yet. Once you place an order, I can help you track it here.';
          quickActions = ['Shop Pet Food', 'Browse Pets for Sale', 'Return to main menu'];
        } else {
          const itemName = latest.items?.[0]?.name || 'your pet items';
          replyText = `Your latest order #${latest.id} (${itemName}) is currently ${latest.statusLabel || latest.status || 'being processed'}. I can help you open its tracking details.`;
          quickActions = ['View live map tracking', 'Call delivery rider', 'Return to main menu'];
        }
      } else if (lower.includes('return') || lower.includes('refund')) {
        replyText = 'We have a 7-day hassle-free pet satisfaction guarantee! Would you like to request a return for a damaged item, wrong size, or pet preference?';
        quickActions = ['Submit return for recent order', 'Talk to refund specialist'];
      } else if (lower.includes('diet') || lower.includes('food') || lower.includes('recommend')) {
        replyText = 'For adult dogs, Pedigree Adult Meat & Rice (₹799) and Drools Chicken & Egg are customer top picks! For puppies, we recommend Royal Canin Maxi Puppy.';
        quickActions = ['Shop Dog Food', 'Book Vet Nutrition Consultation'];
      } else if (lower.includes('agent') || lower.includes('human') || lower.includes('call')) {
        const ticketId = `TKT-${Math.floor(10000 + Math.random() * 90000)}`;
        replyText = `I have generated priority ticket #${ticketId}. Support specialist Priya is joining the chat in ~45 seconds. You can also call us toll-free at 1800-PAW-NEAR.`;
        quickActions = ['Need anything else?'];
      } else {
        replyText = `Thank you for your message! Our AI pet concierge is here to help with orders, grooming bookings, returns, and nutrition advice.`;
        quickActions = ['🚚 Where is my order?', '🔄 Return or refund request', '💬 Connect with Live Agent'];
      }

      setMessages(prev => [
        ...prev,
        {
          id: `m-bot-${Date.now()}`,
          sender: 'bot',
          text: replyText,
          time: 'Just now',
          quickActions: quickActions
        }
      ]);
    }, 600);
  };

  const handleQuickAction = (action) => {
    const lower = action.toLowerCase();
    if (lower.includes('shop dog food') || lower.includes('shop pet food')) {
      navigate('/category/food');
      setIsOpen(false);
      return;
    }
    if (lower.includes('pets for sale') || lower.includes('browse pets')) {
      navigate('/category/pet-sale');
      setIsOpen(false);
      return;
    }
    if (lower.includes('live map tracking')) {
      const latest = Array.isArray(orders) ? orders[0] : null;
      if (latest?.id || latest?._id) {
        navigate(`/track-order/${latest.id || latest._id}`);
        setIsOpen(false);
      } else {
        handleSend(action);
      }
      return;
    }
    handleSend(action);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative group bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white p-3.5 sm:p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center border-2 border-white"
          title="24/7 In-App Support Chatbot"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6 animate-pulse-subtle" />}
          
          {/* Notification Ping Badge */}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
            </span>
          )}
        </button>
      </div>

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-36 md:bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-96 max-w-sm bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden flex flex-col h-[520px] animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-heading font-extrabold text-sm text-white">
                  <span>PawBot Concierge</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
                <div className="text-[11px] text-amber-100 font-medium">Instant Answers & Live Tracking</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div key={msg.id} className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl leading-relaxed shadow-2xs ${
                      isBot
                        ? 'bg-white text-slate-800 rounded-tl-xs border border-slate-200'
                        : 'bg-amber-500 text-white rounded-tr-xs font-medium'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>

                  {/* Quick Action Chips */}
                  {isBot && msg.quickActions && (
                    <div className="flex flex-col gap-1.5 mt-2 w-full max-w-[90%]">
                      {msg.quickActions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuickAction(action)}
                          className="text-left text-[11px] font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-200/80 transition-all flex items-center justify-between group"
                        >
                          <span>{action}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-amber-500 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about orders, returns, pet care..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white text-xs px-3.5 py-2.5 rounded-xl outline-none transition-all text-slate-800"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="p-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white rounded-xl transition-all active:scale-95 shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
