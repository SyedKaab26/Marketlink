'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { DbStatus } from '@/lib/types';
import { Database, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export default function DbStatusBadge() {
  const [status, setStatus] = useState<DbStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/db-status');
      const data = await res.json();
      setStatus(data);
    } catch {
      setStatus({
        connected: false,
        mode: 'mock_fallback',
        message: 'DB Disconnected (Running Local Engine)'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchStatus(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchStatus]);

  return (
    <div className="fixed bottom-4 right-4 z-30 flex items-center gap-2 bg-[#1D3E2E] text-white px-3.5 py-2 rounded-full shadow-lg border border-[#3D6E53] text-xs font-medium backdrop-blur-md transition-all hover:scale-105">
      <Database className="w-4 h-4 text-emerald-400 animate-pulse" />
      <span className="hidden sm:inline">Backend DB:</span>
      {loading ? (
        <span className="flex items-center gap-1 text-amber-300">
          <RefreshCw className="w-3 h-3 animate-spin" /> Checking MySQL...
        </span>
      ) : status?.connected ? (
        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" /> MySQL Connected ({status.database})
        </span>
      ) : (
        <span className="flex items-center gap-1.5 text-amber-300 font-semibold" title={status?.message}>
          <AlertTriangle className="w-3.5 h-3.5" /> MySQL Standby (Ready)
        </span>
      )}
      <button 
        onClick={fetchStatus} 
        className="ml-1 text-slate-300 hover:text-white transition-colors"
        title="Re-check MySQL Database Connection"
      >
        <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
}
