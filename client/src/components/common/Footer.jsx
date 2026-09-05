import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Truck, 
  Clock, 
  Award, 
  Phone, 
  Mail, 
  MapPin, 
  Heart,
  Globe,
  Share2
} from 'lucide-react';
import Logo from './Logo';


export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-20 md:pb-12 border-t border-slate-800">
      {/* Platform Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-white text-sm">15-20 Min Delivery</h4>
            <p className="text-xs text-slate-400 mt-1">Instant delivery from verified local pet stores near you</p>
          </div>

          <div className="flex flex-col items-center md:items-start p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-white text-sm">100% Genuine Products</h4>
            <p className="text-xs text-slate-400 mt-1">Directly sourced & verified veterinary brands & food</p>
          </div>

          <div className="flex flex-col items-center md:items-start p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-white text-sm">Certified Groomers & Vets</h4>
            <p className="text-xs text-slate-400 mt-1">Book top-rated grooming salons & veterinary clinics</p>
          </div>

          <div className="flex flex-col items-center md:items-start p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-white text-sm">Live GPS Order Tracking</h4>
            <p className="text-xs text-slate-400 mt-1">Real-time rider tracking from store checkout to door</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white inline-block px-3 py-1.5 rounded-2xl shadow-sm mb-2">
              <Logo size="lg" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The Paw Street (PAW NEAR) is India's leading multi-vendor pet ecommerce & services platform. Connecting pet parents with nearby trusted pet stores, groomers, clinics, and boarding centers with lightning-fast delivery.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-900 transition-colors flex items-center justify-center text-slate-300 text-xs font-bold" title="Instagram">
                IG
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-900 transition-colors flex items-center justify-center text-slate-300 text-xs font-bold" title="Facebook">
                FB
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-900 transition-colors flex items-center justify-center text-slate-300 text-xs font-bold" title="Twitter / X">
                𝕏
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-900 transition-colors flex items-center justify-center text-slate-300 text-xs font-bold" title="Website">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h5 className="font-heading font-bold text-white text-sm mb-3">Shop Categories</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/category/food" className="hover:text-amber-400 transition-colors">Dog & Cat Food</Link></li>
              <li><Link to="/category/accessories" className="hover:text-amber-400 transition-colors">Collars & Leashes</Link></li>
              <li><Link to="/category/accessories" className="hover:text-amber-400 transition-colors">Chew Toys & Beds</Link></li>
              <li><Link to="/category/medicine" className="hover:text-amber-400 transition-colors">Pet Pharmacy & Flea Care</Link></li>
              <li><Link to="/category/grooming" className="hover:text-amber-400 transition-colors">Shampoos & Brushes</Link></li>
            </ul>
          </div>

          {/* Pet Services */}
          <div>
            <h5 className="font-heading font-bold text-white text-sm mb-3">Pet Services</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/services" className="hover:text-amber-400 transition-colors">Book Pet Grooming</Link></li>
              <li><Link to="/services?tab=clinic" className="hover:text-amber-400 transition-colors">Veterinary Consultations</Link></li>
              <li><Link to="/services?tab=boarding" className="hover:text-amber-400 transition-colors">Pet Boarding & Daycare</Link></li>
              <li><Link to="/stores" className="hover:text-amber-400 transition-colors">Find Nearby Pet Stores</Link></li>
              <li><Link to="/account/orders" className="hover:text-amber-400 transition-colors">Track Live Orders</Link></li>
            </ul>
          </div>

          {/* Help & Support & Vendor */}
          <div>
            <h5 className="font-heading font-bold text-white text-sm mb-3">Partner & Support</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/vendor/login" className="text-amber-400 font-bold hover:text-amber-300 transition-colors">🏪 Vendor Store Portal</Link></li>
              <li><Link to="/admin/login" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">👑 Admin Control Portal</Link></li>
              <li><Link to="/vendor/onboarding" className="hover:text-amber-400 transition-colors">Apply for Store Onboarding</Link></li>
              <li><Link to="/support" className="hover:text-amber-400 transition-colors">Help Center & Chatbot</Link></li>
              <li><Link to="/support?tab=returns" className="hover:text-amber-400 transition-colors">Returns & Refunds</Link></li>
              <li className="flex items-center gap-1.5 pt-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>+91 1800-PAW-NEAR</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>support@thepawstreet.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 text-center md:flex md:items-center md:justify-between text-xs text-slate-500">
        <p>© 2026 The Paw Street / PAW NEAR. All rights reserved. Made for Happy Pets & Pet Parents.</p>
        <p className="mt-2 md:mt-0 flex items-center justify-center gap-1">
          Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for happy pets & pet parents.
        </p>
      </div>
    </footer>
  );
}
