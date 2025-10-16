// components/ChatBot.jsx
import React, { useState } from 'react';
import axios from 'axios';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // ⚠️ WARNING: Do not expose real API keys in frontend for production use
  const API_KEY = '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'; // 🔐 (Visible to users!)

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setLoading(true);
    setInput('');

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: newMessages,
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const reply = response.data.choices[0].message;
      setMessages([...newMessages, reply]);
    } catch (error) {
      console.error('API Error:', error);

      const isRateLimit = error.response?.status === 429;

      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: isRateLimit
            ? '⚠️ You are sending too many requests. Please wait a moment.'
            : '⚠️ Failed to get response. Try again later.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot" style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <div className="messages" style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '10px' }}>
        {messages.map((msg, i) => (
          <div key={i} className={msg.role} style={{ textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <strong>{msg.role === 'user' ? 'You' : 'Bot'}:</strong> {msg.content}
          </div>
        ))}
        {loading && <div className="assistant">Bot is typing...</div>}
      </div>
      <div className="input-box" style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          style={{ flex: 1, padding: '10px' }}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
