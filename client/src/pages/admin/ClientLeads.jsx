import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Users,
  Search,
  MessageSquare,
  Copy,
  ExternalLink,
  Trash2,
  Download,
  RefreshCw,
  Send,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  X,
  FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useSettings } from '../../context/SettingsContext';

export default function ClientLeads() {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEmailOnly, setFilterEmailOnly] = useState(false);

  // Email Composer Modal State
  const [composerOpen, setComposerOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // 1. Fetch leads from server
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/chat/leads');
      setLeads(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load client leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // 2. Filter leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.visitorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.visitorEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterEmailOnly ? Boolean(lead.visitorEmail?.trim()) : true;

    return matchesSearch && matchesFilter;
  });

  // 3. Stats calculations
  const totalLeads = leads.length;
  const verifiedEmails = leads.filter((l) => l.visitorEmail && l.visitorEmail.includes('@')).length;
  const totalMessages = leads.reduce((acc, curr) => acc + (curr.messageCount || 1), 0);

  // 4. Delete lead
  const handleDeleteLead = async (convId, e) => {
    e?.stopPropagation();
    if (!window.confirm('Delete this client record and chat history?')) return;

    try {
      await api.delete(`/chat/conversations/${convId}`);
      toast.success('Client record removed');
      setLeads((prev) => prev.filter((l) => l._id !== convId));
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete client record');
    }
  };

  // 5. Open Email Composer
  const handleOpenComposer = (client, e) => {
    e?.stopPropagation();
    setSelectedClient(client);
    const siteTitle = settings?.siteName || 'Our Website';
    setEmailSubject(`Regarding your inquiry on ${siteTitle}`);
    setEmailBody(
      `Hello ${client.visitorName || 'there'},\n\nThank you for reaching out through our website showcase! I received your inquiry and would be delighted to assist you with your project requirements.\n\nPlease let me know a convenient time for us to discuss the details, or share any specific links or questions.\n\nBest regards,\n${settings?.siteName || 'Shazzed Shuvo'}`
    );
    setComposerOpen(true);
  };

  // Preset Template loader
  const loadTemplate = (type) => {
    const siteTitle = settings?.siteName || 'Our Website';
    const clientName = selectedClient?.visitorName || 'there';

    if (type === 'quote') {
      setEmailSubject(`Project Quotation & Discovery - ${siteTitle}`);
      setEmailBody(
        `Hi ${clientName},\n\nThank you for requesting a project quote! To provide you with an accurate estimate and timeline, could you please share:\n1. Your desired project launch deadline\n2. Key features or design references you admire\n3. Any existing design files (Figma, Wix Studio, Squarespace, etc.)\n\nLooking forward to collaborating with you!\n\nBest,\n${settings?.siteName || 'Shazzed Shuvo'}`
      );
    } else if (type === 'consultation') {
      setEmailSubject(`Let's Schedule a Quick Call - ${siteTitle}`);
      setEmailBody(
        `Hi ${clientName},\n\nI reviewed your recent message and would love to schedule a quick 15-minute consultation to walk through your ideas and explore the best design solutions for you.\n\nAre you available tomorrow or later this week? Feel free to suggest a time that suits your timezone.\n\nWarm regards,\n${settings?.siteName || 'Shazzed Shuvo'}`
      );
    } else if (type === 'followup') {
      setEmailSubject(`Following up on your message - ${siteTitle}`);
      setEmailBody(
        `Hi ${clientName},\n\nJust checking in to make sure you got answers to all your questions! If there's anything else you need or if you'd like to get started on your project, please feel free to reply right here.\n\nCheers,\n${settings?.siteName || 'Shazzed Shuvo'}`
      );
    }
  };

  // 6. Email sending actions
  const sendViaMailto = () => {
    if (!selectedClient?.visitorEmail) return;
    const url = `mailto:${selectedClient.visitorEmail}?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = url;
    toast.success('Opening default mail client...');
  };

  const sendViaGmail = () => {
    if (!selectedClient?.visitorEmail) return;
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      selectedClient.visitorEmail
    )}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    toast.success('Opened in Gmail web');
  };

  const copyDraft = () => {
    navigator.clipboard.writeText(
      `To: ${selectedClient?.visitorEmail}\nSubject: ${emailSubject}\n\n${emailBody}`
    );
    toast.success('Email draft copied to clipboard!');
  };

  // 7. Export CSV
  const handleExportCSV = () => {
    if (leads.length === 0) {
      toast.error('No leads to export');
      return;
    }

    const headers = ['Client Name', 'Email Address', 'Total Messages', 'First Contact Date', 'Last Active', 'Latest Inquiry'];
    const rows = leads.map((l) => [
      `"${(l.visitorName || 'Visitor').replace(/"/g, '""')}"`,
      `"${(l.visitorEmail || '').replace(/"/g, '""')}"`,
      l.messageCount || 1,
      `"${new Date(l.createdAt).toLocaleDateString()}"`,
      `"${new Date(l.lastMessageAt || l.updatedAt).toLocaleString()}"`,
      `"${(l.lastMessage || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `client_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported leads to CSV');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ─── Top Header Card ────────────────────────────────────── */}
      <div className="card p-6 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-zinc-950 border border-indigo-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 mb-2">
            <Mail className="w-3.5 h-3.5 text-indigo-400" />
            <span>Client Leads &amp; Contacts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Client Directory &amp; Email Leads
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            View all website visitors who submitted their Name &amp; Email, and email them directly with one click.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchLeads}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ─── Metric Stat Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 border-l-4 border-l-indigo-500 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Registered Clients</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalLeads}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="card p-5 border-l-4 border-l-emerald-500 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Verified Client Emails</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{verifiedEmails}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
        </div>

        <div className="card p-5 border-l-4 border-l-purple-500 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Inquiry Messages Exchanged</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalMessages}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ─── Search & Filters Bar ───────────────────────────────── */}
      <div className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by client name, email, or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input !pl-9 !py-2 !text-xs w-full"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filterEmailOnly}
              onChange={(e) => setFilterEmailOnly(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <span>With Email only</span>
          </label>
          <span className="text-xs text-slate-400 font-medium">
            Showing <strong>{filteredLeads.length}</strong> of {totalLeads}
          </span>
        </div>
      </div>

      {/* ─── Client Leads Table ─────────────────────────────────── */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/50 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Client Name</th>
                <th className="py-3.5 px-4">Email Address</th>
                <th className="py-3.5 px-4">Latest Inquiry Snippet</th>
                <th className="py-3.5 px-4">Messages</th>
                <th className="py-3.5 px-4">Last Activity</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-zinc-800/80">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    Loading client leads...
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    {searchTerm ? 'No matching clients found.' : 'No client leads recorded yet.'}
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const hasEmail = Boolean(lead.visitorEmail?.trim());

                  return (
                    <tr
                      key={lead._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition-colors group"
                    >
                      {/* Client Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                            {lead.visitorName?.charAt(0) || 'C'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">
                              {lead.visitorName || 'Guest Client'}
                            </p>
                            <span className="text-[10px] text-slate-400">
                              ID: {lead.sessionId?.slice(-8) || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email Address */}
                      <td className="py-3.5 px-4">
                        {hasEmail ? (
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                              {lead.visitorEmail}
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(lead.visitorEmail);
                                toast.success(`Copied: ${lead.visitorEmail}`);
                              }}
                              className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                              title="Copy Email"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No email provided</span>
                        )}
                      </td>

                      {/* Last Message */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="truncate text-slate-700 dark:text-slate-300 font-medium">
                          {lead.lastMessage || 'Registered on site'}
                        </p>
                      </td>

                      {/* Message Count */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/25">
                          <MessageSquare className="w-3 h-3" />
                          <span>{lead.messageCount || 1}</span>
                        </span>
                      </td>

                      {/* Last Activity */}
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-[11px]">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>
                            {new Date(lead.lastMessageAt || lead.updatedAt).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {hasEmail && (
                            <button
                              onClick={(e) => handleOpenComposer(lead, e)}
                              className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] flex items-center gap-1 shadow-sm shadow-indigo-600/20 transition-colors cursor-pointer"
                              title="Compose & Send Email"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Email</span>
                            </button>
                          )}

                          <button
                            onClick={() => navigate('/admin/chat')}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-zinc-700 transition-colors cursor-pointer"
                            title="Open Chat Session"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={(e) => handleDeleteLead(lead._id, e)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Interactive Email Composer Modal ───────────────────── */}
      {composerOpen && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl card p-6 shadow-2xl border border-indigo-500/30 bg-white dark:bg-[#0c0f17] relative animate-scale-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Send Email to Client
                  </h3>
                  <p className="text-xs text-slate-500">
                    To: <strong>{selectedClient.visitorName}</strong> ({selectedClient.visitorEmail})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setComposerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Templates Selector */}
            <div className="mb-4">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Load Quick Email Template:</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => loadTemplate('quote')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-zinc-700 cursor-pointer"
                >
                  💼 Project Quote
                </button>
                <button
                  type="button"
                  onClick={() => loadTemplate('consultation')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-zinc-700 cursor-pointer"
                >
                  📅 15-Min Meeting
                </button>
                <button
                  type="button"
                  onClick={() => loadTemplate('followup')}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200 dark:border-zinc-700 cursor-pointer"
                >
                  👋 Follow-up
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="input !py-2 !text-xs w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Message Body
                </label>
                <textarea
                  rows={7}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="input !py-2 !text-xs w-full resize-none font-mono leading-relaxed"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-5 pt-3 border-t border-slate-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={copyDraft}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Draft</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={sendViaGmail}
                  className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-red-600/20 cursor-pointer"
                  title="Open in Gmail Web"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Send via Gmail</span>
                </button>

                <button
                  type="button"
                  onClick={sendViaMailto}
                  className="btn-primary !py-2 !text-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Default Mail App</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
