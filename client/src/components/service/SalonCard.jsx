import React from 'react';
import { Star, MapPin, Sparkles, ChevronRight, Home, Building, Calendar, ArrowRight } from 'lucide-react';

export default function SalonCard({ salon, onBook }) {
  const minPrice = Math.min(...(salon.services || []).map(s => s.price));
  const service = salon.services?.[0];

  return (
    <div
      onClick={() => onBook(salon)}
      className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/90 hover:border-[#E5A015] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
    >
      <div className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
        {/* Salon / Clinic Photo Thumbnail */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl relative overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
          <img
            src={salon.image}
            alt={salon.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-heading font-black text-slate-900 text-sm sm:text-base group-hover:text-amber-600 transition-colors truncate">
              {service?.name || salon.name}
            </h3>
            {salon.type === 'clinic' && (
              <span className="bg-blue-50 text-blue-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-blue-200/60">
                🩺 Vet Clinic
              </span>
            )}
            {salon.type === 'grooming' && (
              <span className="bg-amber-50 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-200/60">
                ✂️ Grooming & Spa
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 line-clamp-1">
            {salon.name}{salon.tagline ? ` • ${salon.tagline}` : ''}
          </p>

          {/* Rating and Distance */}
          <div className="flex items-center gap-3 text-xs text-slate-600 pt-0.5">
            <div className="flex items-center gap-1 font-extrabold text-slate-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{salon.rating}</span>
              <span className="text-slate-400 font-normal text-[11px]">({salon.reviewsCount})</span>
            </div>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] text-slate-500 flex items-center gap-0.5">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{salon.distance}</span>
            </span>
          </div>

          {/* Channel badges: At-Home Doorstep vs In-Clinic */}
          <div className="flex items-center gap-1.5 pt-1 flex-wrap">
            {salon.homeServiceEnabled && (
              <span className="bg-amber-100/80 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-200">
                <Home className="w-2.5 h-2.5 text-amber-700" />
                <span>🏡 Doorstep Home Visit (+₹{salon.homeVisitingFee ?? 0})</span>
              </span>
            )}
            {salon.clinicVisitEnabled && (
              <span className="bg-blue-50 text-blue-900 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 border border-blue-200">
                <Building className="w-2.5 h-2.5 text-blue-700" />
                <span>🏥 In-Clinic Appointment</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pricing & CTA Button */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 gap-2 shrink-0">
        <div className="text-left sm:text-right">
          <span className="text-[10px] text-slate-400 font-medium block">Starting from</span>
          <span className="font-heading font-black text-slate-900 text-base sm:text-lg">₹{minPrice}</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onBook(salon);
          }}
          className="px-4 py-2 bg-[#E5A015] hover:bg-[#D49010] text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-1 active:scale-95"
        >
          <Calendar className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Book Now</span>
        </button>
      </div>
    </div>
  );
}

