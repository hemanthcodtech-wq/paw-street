import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  User, 
  Heart, 
  Package, 
  MapPin, 
  CreditCard, 
  Plus, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  Sparkles, 
  LogOut, 
  Check, 
  RotateCcw,
  Calendar,
  Zap,
  ArrowRight,
  Camera,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useLocationContext } from '../../context/LocationContext';
import { useOrders } from '../../context/OrderContext';
import { PRODUCTS } from '../../data/products';
import ProductCard from '../../components/product/ProductCard';

export default function AccountPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabFromUrl = searchParams.get('tab');
  
  const [activeTab, setActiveTab] = useState(
    activeTabFromUrl || (window.location.pathname.includes('wishlist') ? 'wishlist' : window.location.pathname.includes('orders') ? 'orders' : 'pets')
  );

  const { user, pets, addPet, deletePet, uploadAvatar, logout } = useAuth();
  const { wishlist, addToCart } = useCart();
  const { savedAddresses } = useLocationContext();
  const { orders } = useOrders();

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

  // Add Pet Form State
  const [showAddPet, setShowAddPet] = useState(false);
  const [newPet, setNewPet] = useState({
    name: '',
    type: 'Dog',
    breed: '',
    gender: 'Male',
    ageYears: 1,
    weightKg: 12,
    vaccinated: true,
    vaccineExpiry: '30 Dec 2026',
    allergies: 'None'
  });

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    setUploadMsg('Uploading to Cloudinary...');
    try {
      const res = await uploadAvatar(file);
      if (res && res.success) {
        setUploadMsg('Photo updated!');
        setTimeout(() => setUploadMsg(''), 3000);
      } else {
        setUploadMsg(res?.message || 'Upload failed');
        setTimeout(() => setUploadMsg(''), 3000);
      }
    } catch (err) {
      setUploadMsg('Error uploading photo');
      setTimeout(() => setUploadMsg(''), 3000);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleAddPetSubmit = (e) => {
    e.preventDefault();
    if (newPet.name && newPet.breed) {
      addPet(newPet);
      setShowAddPet(false);
      setNewPet({
        name: '',
        type: 'Dog',
        breed: '',
        gender: 'Male',
        ageYears: 1,
        weightKg: 12,
        vaccinated: true,
        vaccineExpiry: '30 Dec 2026',
        allergies: 'None'
      });
    }
  };

  const wishlistedProducts = PRODUCTS.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 md:pb-12">
      
      {/* Top User Profile Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="relative shrink-0 group">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user?.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-xs"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-orange-400 text-white font-black text-2xl sm:text-3xl flex items-center justify-center border-2 border-amber-300 shadow-xs">
                {(user?.name || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            
            {/* Cloudinary Upload Trigger Button */}
            <label
              className="absolute -bottom-1 -right-1 bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-600 p-1.5 rounded-full border border-slate-200 shadow-md cursor-pointer transition-transform hover:scale-110 active:scale-95"
              title="Upload photo to Cloudinary"
            >
              {isUploadingAvatar ? (
                <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin" />
              ) : (
                <Camera className="w-3.5 h-3.5" />
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isUploadingAvatar}
                onChange={handleAvatarUpload}
              />
            </label>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="font-heading font-black text-lg sm:text-xl md:text-2xl text-slate-900 truncate">{user?.name}</h1>
              <span className="p-0.5 rounded-full bg-emerald-100 text-emerald-600" title="Verified Pet Parent">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
              {uploadMsg && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  {uploadMsg}
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 truncate">{user?.phone ? `${user.phone} • ` : ''}{user?.email}</p>
            <div className="flex items-center gap-2 pt-1.5 text-[11px] flex-wrap">
              <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 whitespace-nowrap">
                🐾 {pets.length} Registered Pets
              </span>
              <span className="font-semibold text-slate-600 whitespace-nowrap">
                Paw Club Member
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-3.5 py-2 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </button>
      </div>

      {/* Mobile Horizontal Tabs Pill Bar */}
      <div className="md:hidden flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'pets', label: '🐾 My Pets', count: pets.length },
          { id: 'orders', label: '📦 Orders', count: orders.length },
          { id: 'wishlist', label: '🤍 Wishlist', count: wishlist.length },
          { id: 'addresses', label: '📍 Addresses', count: savedAddresses.length }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all select-none flex items-center gap-1.5 ${
                isActive
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-amber-300'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Navigation Sidebar (Desktop only) */}
        <aside className="hidden md:block md:col-span-4 bg-white rounded-3xl p-3 border border-slate-200 shadow-xs space-y-1">
          {[
            { id: 'pets', label: 'My Pet Profiles', icon: Sparkles, count: pets.length },
            { id: 'orders', label: 'Orders & History', icon: Package, count: orders.length },
            { id: 'wishlist', label: 'Saved Wishlist', icon: Heart, count: wishlist.length },
            { id: 'addresses', label: 'Saved Addresses', icon: MapPin, count: savedAddresses.length }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Main Tab Panel Content */}
        <main className="w-full md:col-span-8 space-y-4">
          
          {/* TAB 1: MY PETS */}
          {activeTab === 'pets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading font-black text-slate-900 text-xl">My Furry Family</h2>
                  <p className="text-xs text-slate-500">Track health, diet, weight, and vaccinations</p>
                </div>
                <button
                  onClick={() => setShowAddPet(!showAddPet)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Pet</span>
                </button>
              </div>

              {/* Add Pet Form */}
              {showAddPet && (
                <form onSubmit={handleAddPetSubmit} className="bg-white rounded-3xl p-5 border border-amber-200 shadow-sm space-y-4">
                  <h3 className="font-heading font-bold text-sm text-slate-900">Add Pet Profile</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Pet Name (e.g. Bruno)"
                      value={newPet.name}
                      onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-amber-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Breed (e.g. Golden Retriever)"
                      value={newPet.breed}
                      onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-amber-500"
                      required
                    />
                    <div className="flex gap-2">
                      {['Dog', 'Cat'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setNewPet({ ...newPet, type: t })}
                          className={`flex-1 py-2 text-xs font-bold rounded-xl border ${
                            newPet.type === t ? 'bg-amber-500 text-white border-amber-500' : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {t === 'Dog' ? '🐶 Dog' : '🐱 Cat'}
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      placeholder="Age in Years"
                      value={newPet.ageYears}
                      onChange={(e) => setNewPet({ ...newPet, ageYears: Number(e.target.value) })}
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddPet(false)}
                      className="px-4 py-2 text-xs font-bold text-slate-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl"
                    >
                      Save Pet Profile
                    </button>
                  </div>
                </form>
              )}

              {/* Pets List */}
              {pets.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto text-3xl">
                    🐾
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-slate-800 text-base">No Pets Added Yet</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                      Register your dogs and cats to get tailored food suggestions, size advice, and vaccine tracking!
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddPet(true)}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-2 transition-transform active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Your First Pet</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pets.map((pet) => (
                    <div
                      key={pet.id}
                      className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all space-y-3 relative group"
                    >
                      <button
                        onClick={() => deletePet(pet.id)}
                        className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove pet profile"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-3.5">
                        <img
                          src={pet.image}
                          alt={pet.name}
                          className="w-16 h-16 rounded-2xl object-cover border border-amber-200"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-heading font-bold text-slate-900 text-base">{pet.name}</h3>
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-800">
                              {pet.type}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">{pet.breed} • {pet.gender}</p>
                          <p className="text-[11px] text-slate-400">{pet.ageYears} yrs • {pet.weightKg} kg</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 rounded-xl bg-slate-50">
                          <span className="text-slate-400 block">Vaccination</span>
                          <span className="font-bold text-emerald-600">Active (valid 2026)</span>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-50">
                          <span className="text-slate-400 block">Allergies</span>
                          <span className="font-bold text-slate-700">{pet.allergies || 'None'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ORDER HISTORY */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h2 className="font-heading font-black text-slate-900 text-xl">Past Orders & Live Tracking</h2>

              {orders.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
                    <Package className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-slate-800 text-base">No Orders Yet</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                      You haven't placed any orders yet. Explore our fresh food, grooming supplies, and instant 20-min delivery!
                    </p>
                  </div>
                  <Link
                    to="/products"
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-2 transition-transform active:scale-95"
                  >
                    <span>Start Shopping</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-heading font-bold text-slate-900 text-sm">#{order.id}</span>
                            <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                              order.status === 'out_for_delivery'
                                ? 'bg-amber-100 text-amber-800 animate-pulse'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {order.statusLabel || order.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{order.date} • {order.store?.name || 'Local Store'}</p>
                        </div>

                        <div className="text-right">
                          <span className="font-black text-slate-900 text-sm sm:text-base">₹{order.totalAmount}</span>
                          <span className="text-[10px] text-slate-400 block">{order.paymentMode}</span>
                        </div>
                      </div>

                      {/* Order items */}
                      <div className="space-y-2">
                        {order.items?.map((it, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs text-slate-700">
                            <div className="flex items-center gap-2.5">
                              <img src={it.image} alt="" className="w-10 h-10 rounded-xl object-contain bg-slate-50 p-1" />
                              <div>
                                <span className="font-bold text-slate-800">{it.name}</span>
                                <span className="text-[11px] text-slate-400 block">Qty: {it.quantity}</span>
                              </div>
                            </div>
                            <span className="font-bold">₹{it.price * it.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {/* Order Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                        <Link
                          to={`/track-order/${order.id}`}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          <span>Track Live Map</span>
                        </Link>

                        <button
                          onClick={() => {
                            order.items?.forEach(it => addToCart(it, it.size, it.quantity));
                          }}
                          className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl border border-amber-200 flex items-center gap-1.5 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                          <span>Reorder All</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              <h2 className="font-heading font-black text-slate-900 text-xl">
                Saved Wishlist ({wishlistedProducts.length} items)
              </h2>

              {wishlistedProducts.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
                    <Heart className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-slate-800 text-base">Your Wishlist is Empty</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                      Tap the heart icon on any product to save it here for fast ordering later!
                    </p>
                  </div>
                  <Link
                    to="/products"
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-2"
                  >
                    <span>Browse Products</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {wishlistedProducts.map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <h2 className="font-heading font-black text-slate-900 text-xl">Saved Delivery Addresses</h2>
              {savedAddresses.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mx-auto">
                    <MapPin className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-slate-800 text-base">No Saved Addresses</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                      Save your home, apartment, or office address for smooth 1-click express deliveries.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="bg-white rounded-3xl p-5 border border-slate-200 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg">
                          {addr.type} ({addr.tag})
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800">{addr.addressLine1}</p>
                      <p className="text-xs text-slate-500">{addr.shortDisplay}</p>
                      <p className="text-[11px] text-slate-400 pt-1">Phone: {addr.phone || user?.phone || 'N/A'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
