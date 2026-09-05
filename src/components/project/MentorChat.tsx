import React, { useState, useEffect, useRef } from 'react';
import type { MentorMessage, ProjectIdea } from '../../types/project';
import { Sparkles, Send, ShieldAlert } from 'lucide-react';

interface MentorChatProps {
  project: ProjectIdea;
  messages: MentorMessage[];
  onSendMessage: (userMessageText: string) => Promise<void>;
  isSending: boolean;
}

export const MentorChat: React.FC<MentorChatProps> = ({
  project,
  messages,
  onSendMessage,
  isSending,
}) => {
  const [input, setInput] = useState<string>('');
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const quickActionPrompts = [
    'Break Phase 1 features into 3-hour sub-tasks',
    'Evaluate PostgreSQL vs MongoDB for this stack',
    'How do I reduce scope for a 4-week deadline?',
    'What accessibility & security requirements should I test?',
  ];

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '620px', padding: '1.25rem' }}>
      <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ backgroundColor: '#EEF2FF', color: '#4F46E5', padding: '0.4rem', borderRadius: '8px' }}>
            <Sparkles size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>AI Academic Mentor Advisor</h3>
            <p style={{ fontSize: '0.75rem', color: '#64748B' }}>Context-aware guidance for "{project.title}"</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {quickActionPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSendMessage(prompt)}
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #CBD5E1',
              color: '#475569',
              fontSize: '0.75rem',
              padding: '0.25rem 0.6rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      <div
        ref={chatContainerRef}
        role="log"
        aria-live="polite"
        aria-label="AI Mentor Conversation History"
        style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem', marginBottom: '1rem' }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              backgroundColor: msg.sender === 'user' ? '#4F46E5' : '#F8FAFC',
              color: msg.sender === 'user' ? '#FFFFFF' : '#0F172A',
              border: msg.sender === 'user' ? 'none' : '1px solid #E2E8F0',
              padding: '1rem 1.15rem',
              borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
              fontSize: '0.9rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ fontSize: '0.7rem', opacity: 0.8, marginBottom: '0.3rem', fontWeight: 600 }}>
              {msg.sender === 'user' ? 'You' : 'ProjectPilot AI Mentor'} • {msg.timestamp}
            </div>

            {msg.structuredResponse ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ fontWeight: 600 }}>{msg.structuredResponse.directAnswer}</div>

                <div style={{ backgroundColor: '#EEF2FF', padding: '0.6rem 0.75rem', borderRadius: '6px', color: '#3730A3', fontSize: '0.85rem' }}>
                  <strong>Recommended Next Action:</strong> {msg.structuredResponse.recommendedNextAction}
                </div>

                {msg.structuredResponse.riskFlag && (
                  <div style={{ backgroundColor: '#FFFBEB', padding: '0.5rem 0.75rem', borderRadius: '6px', color: '#92400E', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ShieldAlert size={14} style={{ color: '#D97706', flexShrink: 0 }} />
                    <span><strong>Risk Flag:</strong> {msg.structuredResponse.riskFlag}</span>
                  </div>
                )}

                <div style={{ fontSize: '0.8rem', color: '#64748B', fontStyle: 'italic' }}>
                  <strong>Why:</strong> {msg.structuredResponse.rationale}
                </div>
              </div>
            ) : (
              <div>{msg.text}</div>
            )}

            {msg.suggestedActions && (
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: msg.sender === 'user' ? '1px solid rgba(255,255,255,0.2)' : '1px solid #E2E8F0' }}>
                {msg.suggestedActions.map((act) => (
                  <button
                    key={act}
                    onClick={() => onSendMessage(act)}
                    style={{
                      backgroundColor: msg.sender === 'user' ? 'rgba(255,255,255,0.2)' : '#FFFFFF',
                      border: `1px solid ${msg.sender === 'user' ? '#FFFFFF' : '#CBD5E1'}`,
                      color: msg.sender === 'user' ? '#FFFFFF' : '#4F46E5',
                      fontSize: '0.75rem',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    {act}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleFormSubmit} style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid #E2E8F0', paddingTop: '0.75rem' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Ask mentor a technical, architecture, or blocker question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" disabled={isSending || !input.trim()} className="btn btn-primary" style={{ flexShrink: 0 }}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
