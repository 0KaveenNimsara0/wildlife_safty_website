import React, { useState } from 'react';
import { Mail, MessageSquare, Send, ShieldCheck, MapPin, Phone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { BASE_URL } from '../../config/constants';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch(`${BASE_URL}/contact/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        setStatus({ type: 'success', message: data.message });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({ type: 'error', message: data.message || 'Transmission failure.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Communication link interrupted.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-32 animate-fade-in">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        
        {/* Header Hero */}
        <div className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-16 lg:p-24 text-white mb-16 shadow-2xl">
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full -mr-200 -mt-200 blur-3xl animate-pulse" />
           <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-md mb-8">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Tactical Support Active</span>
              </div>
              <h1 className="text-6xl lg:text-7xl font-black tracking-tighter mb-8 leading-none">
                 Contact <span className="text-emerald-500 italic">Wildlife</span> Support.
              </h1>
              <p className="text-xl text-slate-400 leading-relaxed font-medium">
                 Encountered an issue or have a directive for our team? Send us a secure message through our encrypted terminal.
              </p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           
           {/* Contact Sidebar */}
           <div className="lg:col-span-1 space-y-8">
              <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                 <h3 className="text-sm font-black uppercase tracking-[0.25em] text-slate-400 mb-8 ml-1">Direct Channels</h3>
                 
                 <div className="space-y-8 relative z-10">
                    <div className="flex items-start gap-6">
                       <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                          <Mail size={24} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Electronic Mail</p>
                          <p className="text-base font-black text-slate-900">ops@wildlifesafety.org</p>
                       </div>
                    </div>
                    
                    <div className="flex items-start gap-6">
                       <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                          <Phone size={24} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Support Line</p>
                          <p className="text-base font-black text-slate-900">+1 (800) WILD-SAFE</p>
                       </div>
                    </div>

                    <div className="flex items-start gap-6">
                       <div className="w-14 h-14 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                          <MapPin size={24} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Command Center</p>
                          <p className="text-base font-black text-slate-900">Colombo, Sri Lanka</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-emerald-600 rounded-[2.5rem] p-10 text-white shadow-xl shadow-emerald-900/20 relative overflow-hidden">
                 <div className="relative z-10">
                    <ShieldCheck size={48} className="mb-6 opacity-30" />
                    <h4 className="text-2xl font-black mb-4">Our Protocol</h4>
                    <p className="text-sm leading-relaxed opacity-80 font-medium">
                       Every inquiry is logged in our secure audit system. Our standard response time is under 48 hours for non-emergency administrative matters.
                    </p>
                 </div>
                 <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mb-16" />
              </div>
           </div>

           {/* Contact Form */}
           <div className="lg:col-span-2">
              <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl shadow-slate-200/50">
                 <div className="mb-12">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Secure Message Terminal</h2>
                    <p className="text-slate-500 font-medium italic">Complete the fields below to transmit your message.</p>
                 </div>

                 <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Your Full Name</label>
                          <input 
                            required
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[24px] font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
                            placeholder="John Doe"
                          />
                       </div>
                       <div className="space-y-3">
                          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email Address</label>
                          <input 
                            required
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[24px] font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
                            placeholder="john@example.com"
                          />
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Inquiry Subject</label>
                       <input 
                         required
                         name="subject"
                         value={formData.subject}
                         onChange={handleChange}
                         className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[24px] font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
                         placeholder="What's this regarding?"
                       />
                    </div>

                    <div className="space-y-3">
                       <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Detailed Message</label>
                       <textarea 
                         required
                         rows="6"
                         name="message"
                         value={formData.message}
                         onChange={handleChange}
                         className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent rounded-[2rem] font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner resize-none"
                         placeholder="Describe your inquiry in detail..."
                       />
                    </div>

                    {status.message && (
                       <div className={`p-6 rounded-[24px] flex items-center gap-4 animate-shake ${status.type === 'error' ? 'bg-rose-50 border border-rose-100 text-rose-700' : 'bg-emerald-50 border border-emerald-100 text-emerald-700'}`}>
                          {status.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                          <span className="text-xs font-black uppercase tracking-widest">{status.message}</span>
                       </div>
                    )}

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-emerald-600 shadow-2xl shadow-slate-900/10 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                    >
                       {loading ? (
                         <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                       ) : (
                         <>
                           <Send size={18} />
                           <span>Transmit Message</span>
                         </>
                       )}
                    </button>
                 </form>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
