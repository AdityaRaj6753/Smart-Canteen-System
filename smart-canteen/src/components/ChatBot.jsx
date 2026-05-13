import React, { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Bot, Globe, ChevronDown } from 'lucide-react'

// 🇮🇳 Language List Data
const languages = [
  { code: 'English', label: 'English', flag: '🇬🇧' },
  { code: 'Hindi', label: 'Hindi (हिंदी)', flag: '🇮🇳' },
  { code: 'Marathi', label: 'Marathi (मराठी)', flag: '🚩' },
  { code: 'Bengali', label: 'Bengali (বাংলা)', flag: '🐟' },
  { code: 'Telugu', label: 'Telugu (తెలుగు)', flag: '🌶️' },
  { code: 'Tamil', label: 'Tamil (தமிழ்)', flag: '🛕' },
  { code: 'Gujarati', label: 'Gujarati (ગુજરાતી)', flag: '🪁' },
  { code: 'Urdu', label: 'Urdu (اردو)', flag: '🌙' },
  { code: 'Punjabi', label: 'Punjabi (ਪੰਜਾਬੀ)', flag: '🌾' },
  { code: 'Kannada', label: 'Kannada (ಕನ್ನಡ)', flag: '🐘' },
  { code: 'Malayalam', label: 'Malayalam (മലയാളം)', flag: '🌴' },
];

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false); // Dropdown toggle
  const [language, setLanguage] = useState(languages[0]); // Default English Object
  const [messages, setMessages] = useState([
    { text: "Hello! 👋 I am Canteen AI. How can I help you?", sender: 'bot' }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(scrollToBottom, [messages]);

  // 🧠 AI BRAIN Logic
  const getBotResponse = (input) => {
    const lowerInput = input.toLowerCase();
    const langCode = language.code;

    // Logic for English (Default)
    if (langCode === 'English') {
      if (lowerInput.includes('hello')) return "Hello! Hungry? 🍔";
      if (lowerInput.includes('menu')) return "Check the Menu page! 🍕";
      if (lowerInput.includes('order')) return "Track in 'My Orders'. 🚀";
      return "I didn't understand. Ask about Menu or Order.";
    }
    // Hindi
    else if (langCode === 'Hindi') {
      if (lowerInput.includes('hello') || lowerInput.includes('namaste')) return "Namaste! Bhookh lagi hai? 🍛";
      return "Samajh nahi aaya. Menu ya Order ke baare mein puche.";
    }
    // Marathi
    else if (langCode === 'Marathi') {
      if (lowerInput.includes('hello') || lowerInput.includes('namaskar')) return "Namaskar! Jevan order karayche ahe? 🍛";
      return "Samajla nahi. Menu kiva Order baddal vichara.";
    }
    // Generic Response for others
    return `Namaste! (${language.label}) I am still learning this language. Try English/Hindi for now! 🇮🇳`;
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    setInput("");

    setTimeout(() => {
      const botReply = getBotResponse(input);
      setMessages(prev => [...prev, { text: botReply, sender: 'bot' }]);
    }, 800);
  };

  const handleLanguageSelect = (langObj) => {
    setLanguage(langObj);
    setIsLangMenuOpen(false); // Menu band karo
    setMessages(prev => [...prev, { text: `Language changed to ${langObj.label} ${langObj.flag}`, sender: 'bot' }]);
  }

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 2000 }}>
      
      {/* Chat Window */}
      {isOpen && (
        <div style={styles.chatWindow}>
          
          {/* Header */}
          <div style={styles.header}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={24} />
              <div>
                <span style={{ fontWeight: 'bold', display:'block', fontSize:'14px' }}>Canteen AI</span>
                <span style={{ fontSize: '10px', opacity: 0.9 }}>Online 🟢</span>
              </div>
            </div>

            {/* 👇 NEW PREMIUM LANGUAGE SELECTOR 👇 */}
            <div style={{ position: 'relative' }}>
              
              {/* The Button */}
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} 
                style={styles.langButton}
              >
                <span style={{ fontSize: '14px' }}>{language.flag}</span>
                <span style={{ fontSize: '12px', fontWeight: '600' }}>{language.code.slice(0,3)}</span> {/* Sirf pehle 3 letters (Eng/Hin) */}
                <ChevronDown size={12} />
              </button>

              {/* The Custom Dropdown List */}
              {isLangMenuOpen && (
                <div style={styles.langDropdown}>
                  {languages.map((lang) => (
                    <div 
                      key={lang.code} 
                      onClick={() => handleLanguageSelect(lang)}
                      style={{
                        ...styles.langItem,
                        background: language.code === lang.code ? '#fff0f0' : 'white',
                        color: language.code === lang.code ? '#ff6b6b' : '#333'
                      }}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* 👆 END SELECTOR 👆 */}

            <button onClick={() => setIsOpen(false)} style={styles.closeBtn}><X size={20} /></button>
          </div>

          {/* Messages */}
          <div style={styles.body}>
            {messages.map((msg, index) => (
              <div key={index} style={{ 
                ...styles.msgBubble, 
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                background: msg.sender === 'user' ? '#ff6b6b' : '#f1f2f6',
                color: msg.sender === 'user' ? 'white' : '#2d3436',
                borderBottomRightRadius: msg.sender === 'user' ? '0' : '15px',
                borderBottomLeftRadius: msg.sender === 'bot' ? '0' : '15px',
              }}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={styles.footer}>
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask something..." 
              style={styles.input}
            />
            <button onClick={handleSend} style={styles.sendBtn}><Send size={18} /></button>
          </div>

        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} style={styles.floatBtn}>
          <MessageSquare size={28} />
          <div style={styles.notificationDot}></div>
        </button>
      )}

    </div>
  )
}

// ✨ Premium Styles
const styles = {
  floatBtn: {
    background: '#ff6b6b', color: 'white', border: 'none',
    width: '60px', height: '60px', borderRadius: '50%', 
    boxShadow: '0 8px 20px rgba(255, 107, 107, 0.4)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', 
    position: 'relative', cursor:'pointer', zIndex: 9999
  },
  notificationDot: {
    position:'absolute', top:'2px', right:'2px', width:'12px', height:'12px', 
    background:'#2ecc71', borderRadius:'50%', border:'2px solid white'
  },
  chatWindow: {
    width: '320px', height: '480px', background: 'white', 
    borderRadius: '20px', display: 'flex', flexDirection: 'column', overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)', border: '1px solid #f1f2f6',
    zIndex: 10000
  },
  header: {
    padding: '15px', background: '#ff6b6b', color: 'white',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    position: 'relative' // Dropdown positioning ke liye zaroori
  },
  
  // ✨ NEW BUTTON STYLE
  langButton: {
    background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
    color: 'white', padding: '6px 12px', borderRadius: '20px',
    display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
    backdropFilter: 'blur(5px)', transition: '0.2s'
  },

  // ✨ NEW DROPDOWN MENU STYLE
  langDropdown: {
    position: 'absolute', top: '40px', right: '0', 
    background: 'white', width: '160px', maxHeight: '200px',
    borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    overflowY: 'auto', padding: '5px', zIndex: 10001,
    animation: 'fadeIn 0.2s ease-in-out'
  },
  langItem: {
    padding: '10px', display: 'flex', gap: '10px', alignItems: 'center',
    fontSize: '13px', cursor: 'pointer', borderRadius: '8px',
    transition: 'background 0.2s'
  },

  closeBtn: { background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' },
  body: { flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', background:'#f8f9fa' },
  msgBubble: {
    padding: '12px 16px', borderRadius: '15px', maxWidth: '80%', fontSize: '14px', lineHeight: '1.4', boxShadow:'0 2px 5px rgba(0,0,0,0.05)'
  },
  footer: { padding: '10px', borderTop: '1px solid #eee', display: 'flex', gap: '10px', background:'white' },
  input: {
    flex: 1, background: '#f1f2f6', border: 'none', borderRadius: '25px', padding: '10px 15px', color: '#333', outline: 'none'
  },
  sendBtn: {
    background: '#ff6b6b', color: 'white', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor:'pointer'
  }
}

export default ChatBot