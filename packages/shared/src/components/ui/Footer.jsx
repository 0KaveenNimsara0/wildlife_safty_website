import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowUpRight, ScanLine, BookOpen, Users, MapPin, MessageSquare, ArrowUp } from 'lucide-react';

const exploreLinks = [
  ['Identify a snake', '/identify'], ['Animal details', '/animalDetail'],
  ['Learning centre', '/learning'], ['Wildlife map', '/map'],
];
const communityLinks = [
  ['Community feed', '/communityFeed'], ['Chat with our team', '/chat'],
  ['Contact us', '/contact'], ['Create an account', '/register'],
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid gap-5 sm:grid-cols-3 pb-8 mb-8 border-b border-slate-200">
          {[
            { Icon: ScanLine, title: 'Identify wildlife', description: 'Explore species with image identification.', path: '/identify' },
            { Icon: BookOpen, title: 'Learn and stay aware', description: 'Discover wildlife and safety resources.', path: '/learning' },
            { Icon: Users, title: 'Connect with the community', description: 'Share sightings and learn together.', path: '/communityFeed' },
          ].map(({ Icon, title, description, path }) => (
            <Link key={path} to={path} className="group flex items-start gap-3 rounded-xl bg-slate-50 p-4 transition-colors hover:bg-emerald-50">
              <span className="rounded-lg bg-white p-2 text-emerald-700 border border-slate-200"><Icon size={20} /></span>
              <span><span className="block text-sm font-semibold text-slate-900 group-hover:text-emerald-700">{title}</span><span className="block mt-1 text-xs leading-relaxed text-slate-500">{description}</span></span>
            </Link>
          ))}
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.9fr_1.1fr]">
          <div className="space-y-4 max-w-sm">
            <Link to="/" className="inline-flex items-center gap-2 text-lg font-semibold text-emerald-800"><Shield size={24} />WildLife Safety</Link>
            <p className="text-sm leading-relaxed">Helping people and wildlife coexist safely. Identify species, explore educational resources and connect with a community that cares about Sri Lanka's biodiversity.</p>
            <span className="inline-flex items-center gap-2 text-xs text-slate-500"><MapPin size={15} />Made for Sri Lanka</span>
          </div>
          {[["Explore", exploreLinks], ["Community & support", communityLinks]].map(([title, links]) => (
            <nav key={title} aria-label={title}>
              <h3 className="text-sm font-semibold text-slate-900 mb-4">{title}</h3>
              <ul className="space-y-3 text-sm">
                {links.map(([name, path]) => <li key={path}><Link to={path} className="transition-colors hover:text-emerald-700">{name}</Link></li>)}
              </ul>
            </nav>
          ))}
          <div className="space-y-4">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-900"><Shield size={17} />Safety comes first</h3>
              <p className="mt-2 text-xs leading-relaxed text-amber-900/80">For snake bites, seek immediate medical help. Identification is for awareness only.</p>
              <Link to="/emergency" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-amber-900 hover:underline">Emergency guidance <ArrowUpRight size={14} /></Link>
            </div>
            <Link to="/medical-officer/login" className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:underline">Medical officer portal <ArrowUpRight size={15} /></Link>
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-emerald-50 border border-emerald-100 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3"><MessageSquare size={20} className="text-emerald-700 shrink-0" /><p className="text-sm text-emerald-950"><span className="font-semibold">Have a question or suggestion?</span> We'd like to hear from you.</p></div>
          <Link to="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 whitespace-nowrap hover:underline">Get in touch <ArrowUpRight size={16} /></Link>
        </div>
        <div className="mt-6 pt-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} WildLife Safety. All rights reserved.</span>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })} className="inline-flex items-center gap-2 py-2 hover:text-emerald-700">Back to top <ArrowUp size={14} /></button>
        </div>
      </div>
    </footer>
  );
}
