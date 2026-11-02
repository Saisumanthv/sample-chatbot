import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Home, MessageSquare } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Bot className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">404</h1>
        <h2 className="text-xl font-semibold text-slate-800 mt-2">Page Not Found</h2>
        <p className="text-slate-600 text-sm mt-2 leading-relaxed">
          The page or conversation you are looking for does not exist or has been removed.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition shadow-sm hover:shadow"
          >
            <MessageSquare className="w-4 h-4" />
            Return to Chat
          </Link>
        </div>
      </div>
    </div>
  );
}

