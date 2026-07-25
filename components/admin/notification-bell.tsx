'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, MessageSquare, Users, Check, X, ArrowRight, Sparkles, Clock } from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'MESSAGE' | 'LEAD';
  title: string;
  subtitle: string;
  time: string;
  href: string;
  read: boolean;
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetchNotifications();

    // Poll every 10 seconds for new notifications
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const [msgRes, leadRes] = await Promise.all([
        fetch('/api/crm/messages'),
        fetch('/api/crm/leads'),
      ]);

      const items: NotificationItem[] = [];

      const msgData = await msgRes.json();
      if (msgData.success && Array.isArray(msgData.messages)) {
        msgData.messages.forEach((msg: any) => {
          if (msg.status === 'UNREAD') {
            items.push({
              id: `msg_${msg.id}`,
              type: 'MESSAGE',
              title: `New Inquiry from ${msg.name}`,
              subtitle: msg.message,
              time: msg.sentAt || msg.updatedAt,
              href: '/admin/messages',
              read: false,
            });
          }
        });
      }

      const leadData = await leadRes.json();
      if (leadData.success && Array.isArray(leadData.leads)) {
        leadData.leads.forEach((lead: any) => {
          if (lead.status === 'NEW') {
            items.push({
              id: `lead_${lead.id}`,
              type: 'LEAD',
              title: `New CRM Lead: ${lead.contactName}`,
              subtitle: lead.serviceInterest || lead.enquiryDetails || 'New lead submission',
              time: lead.submittedAt,
              href: '/admin/leads',
              read: false,
            });
          }
        });
      }

      // Sort newest first
      items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      setNotifications(items);
    } catch (e) {
      console.error('Error fetching notifications:', e);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleItemClick = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  return (
    <div className="relative font-sans" ref={popoverRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors focus:outline-none"
        aria-label="Notifications"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white shadow-xs border-2 border-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Header */}
          <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-black text-xs text-[#0b1a30]">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                  {unreadCount} New
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-extrabold text-blue-600 hover:underline flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 scrollbar-thin">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                <Bell className="w-6 h-6 mx-auto text-slate-300 stroke-[1.5]" />
                <p className="font-semibold text-slate-500">All caught up!</p>
                <p className="text-[11px]">No unread chat inquiries or new CRM leads.</p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.href)}
                  className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3 ${
                    !item.read ? 'bg-blue-50/40' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      item.type === 'MESSAGE'
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {item.type === 'MESSAGE' ? (
                      <MessageSquare className="w-4 h-4" />
                    ) : (
                      <Users className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-[#0b1a30] truncate">{item.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-0.5 shrink-0 ml-2">
                        <Clock className="w-2.5 h-2.5" />
                        {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate">{item.subtitle}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
            <Link
              href="/admin/messages"
              onClick={() => setIsOpen(false)}
              className="text-xs font-extrabold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
            >
              <span>View All Inbox Messages</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
