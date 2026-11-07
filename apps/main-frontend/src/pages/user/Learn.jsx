import React from 'react';
import { Link } from 'react-router-dom';
import ArticleSelection from './ArticleSelection.jsx';
export default function Learn(){return <div><div className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-3xl text-slate-900">Safety resources</h1><p className="mt-2 text-slate-600">Read articles or explore individual wildlife species.</p></div><Link to="/animalDetail" className="btn-secondary">Explore wildlife directory</Link></div><ArticleSelection/></div>}
