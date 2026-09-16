import React from 'react';
import { Sparkles, Zap } from 'lucide-react';

export default function LoadingFallback() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-16 px-4 space-y-4">
      {/* Glowing Paw Avatar */}
      <div className="relative">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 via-amber-500 to-orange-500 flex items-center justify-center text-3xl shadow-xl shadow-amber-500/25 animate-bounce">
          🐾
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center text-[10px] animate-pulse">
          <Zap className="w-3 h-3 fill-amber-400" />
        </div>
      </div>

      {/* Text & Progress Pulse */}
      <div className="text-center space-y-1.5">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
          <span>PAW NEAR • Loading Fast...</span>
        </div>
        <p className="text-[11px] text-slate-400">Fetching freshest pet food & care near you</p>
      </div>

      {/* Progress Bar Shimmer */}
      <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-progress" />
      </div>
    </div>
  );
}
