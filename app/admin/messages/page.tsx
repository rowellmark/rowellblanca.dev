'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Trash2, Mail } from 'lucide-react';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  sentAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/crm/messages');
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
    } catch (e) {
      console.error('Error fetching messages:', e);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/crm/messages?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchMessages();
    } catch (e) {
      alert('Failed to delete message');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-black text-[#0b1a30]">Contact Form Messages ({messages.length})</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">Inbox log of contact form inquiries and Mailtrap SMTP alerts.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
                <th className="p-4">Sender</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Message</th>
                <th className="p-4">Sent Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {messages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No messages received yet.
                  </td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-slate-50">
                    <td className="p-4">
                      <span className="font-extrabold text-[#0b1a30] block text-sm">{msg.name}</span>
                      <span className="text-slate-500 font-mono text-[11px] block">{msg.email}</span>
                    </td>
                    <td className="p-4 text-slate-700 font-bold">
                      {msg.subject || 'Website Inquiry'}
                    </td>
                    <td className="p-4 text-slate-600 max-w-md truncate">
                      {msg.message}
                    </td>
                    <td className="p-4 text-slate-400 font-mono">
                      {new Date(msg.sentAt).toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(msg.id)} className="p-1.5 text-slate-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
