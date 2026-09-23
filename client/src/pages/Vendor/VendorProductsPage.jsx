import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  X, 
  AlertCircle, 
  Sparkles,
  Eye,
  EyeOff,
  Home,
  Building,
  Clock,
  Scissors,
  Calendar,
  Upload,
  ImagePlus,
  Loader2
} from 'lucide-react';
import { useVendor } from '../../context/VendorContext';
import { api } from '../../services/api';

// ─── Cloudinary Image Upload Component ──────────────────────────────────────
function ImageUploadField({ value, onChange, folder = 'pawnear/products', label = 'Product Image' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files are allowed (JPG, PNG, WEBP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be smaller than 5MB');
      return;
    }
    setUploadError('');
    setUploading(true);
    try {
      const result = await api.uploadImage(file, folder);
      if (result?.success && result?.url) {
        onChange(result.url);
      } else {
        setUploadError(result?.message || 'Upload failed. Please try again.');
      }
    } catch (err) {
      setUploadError('Upload failed. Check your connection.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <label className="block font-bold text-slate-700 mb-1.5 text-xs">
        {label} *
      </label>

      {/* If image is already uploaded, show preview + change option */}
      {value && !uploading ? (
        <div className="relative group rounded-2xl overflow-hidden border-2 border-amber-400 bg-slate-50">
          <img
            src={value}
            alt="Product"
            className="w-full h-36 object-contain p-2"
          />
          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-slate-900 font-bold text-xs rounded-xl flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              Change Image
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 bg-rose-600 text-white rounded-xl"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Uploaded
          </div>
        </div>
      ) : (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
            dragOver
              ? 'border-amber-500 bg-amber-50 scale-[1.01]'
              : uploading
              ? 'border-blue-300 bg-blue-50 cursor-not-allowed'
              : 'border-slate-300 bg-slate-50 hover:border-amber-400 hover:bg-amber-50/50'
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-xs font-bold text-blue-600">Uploading to Cloudinary...</p>
              <p className="text-[10px] text-slate-400">Please wait</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center">
                <ImagePlus className="w-6 h-6 text-amber-600" />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-slate-700">Click or drag & drop to upload</p>
                <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WEBP · Max 5MB · Saved to Cloudinary</p>
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {uploadError && (
        <p className="mt-1.5 text-[11px] text-rose-600 font-medium flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {uploadError}
        </p>
      )}
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function VendorProductsPage() {
  const { 
    products, 
    services, 
    addProduct, 
    updateProduct, 
    toggleProductActive, 
    toggleProductStock, 
    deleteProduct,
    addService,
    updateService,
    toggleServiceActive,
    deleteService
  } = useVendor();
  
  const [searchParams, setSearchParams] = useSearchParams();

  // Top Section Mode: 'products' | 'pet-sale' | 'services'
  const [activeCatalogMode, setActiveCatalogMode] = useState(() => {
    const tab = searchParams.get('tab');
    return tab === 'services' || tab === 'pet-sale' ? tab : 'products';
  });

  // Product Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Service Filters
  const [serviceSearchQuery, setServiceSearchQuery] = useState('');
  const [serviceModeFilter, setServiceModeFilter] = useState('all'); // 'all' | 'home_service' | 'clinic_visit' | 'Grooming' | 'Veterinary'
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      if (activeCatalogMode === 'services') {
        setShowAddServiceModal(true);
      } else {
        setShowAddProductModal(true);
      }
    }
  }, [searchParams, activeCatalogMode]);

  // Form State for Add / Edit Product
  const [productFormData, setProductFormData] = useState({
    name: '',
    shortName: '',
    category: 'food',
    petType: 'Dog',
    brand: '',
    price: '',
    mrp: '',
    stockCount: 20,
    image: '/images/prod_pedigree.jpg',
    description: '',
    breed: '',
    ageYears: ''
  });

  // Form State for Add / Edit Service
  const [serviceFormData, setServiceFormData] = useState({
    name: '',
    shortName: '',
    category: 'Grooming',
    deliveryMode: 'home_service',
    price: '',
    mrp: '',
    durationMinutes: '',
    petType: 'Dogs & Cats',
    visitingFee: '',
    image: '',
    description: '',
    featuresText: 'Professional Gentle Care\nSanitized Equipment\nDoorstep Service'
  });

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      shortName: '',
      category: 'food',
      petType: 'Dog',
      brand: '',
      price: '',
      mrp: '',
      stockCount: 25,
      image: '',
      description: '',
      breed: '',
      ageYears: ''
    });
    setShowAddProductModal(true);
  };

  const handleOpenAddPet = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      shortName: '',
      category: 'pet-sale',
      petType: 'Dog',
      brand: '',
      price: '',
      mrp: '',
      stockCount: 1,
      image: '',
      description: '',
      breed: '',
      ageYears: ''
    });
    setCategoryFilter('pet-sale');
    setActiveCatalogMode('pet-sale');
    setShowAddProductModal(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductFormData({
      name: prod.name,
      shortName: prod.shortName || prod.name,
      category: prod.category || 'food',
      petType: prod.petType || 'Dog',
      brand: prod.brand || '',
      price: prod.price,
      mrp: prod.mrp || prod.price,
      stockCount: prod.stockCount || 10,
      image: prod.image,
      description: prod.description || '',
      breed: prod.breed || '',
      ageYears: prod.ageYears ?? ''
    });
    setShowAddProductModal(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const payload = productFormData.category === 'pet-sale'
      ? {
          ...productFormData,
          name: `${productFormData.petType} - ${productFormData.breed}`,
          mrp: productFormData.price,
          stockCount: editingProduct ? productFormData.stockCount : 1
        }
      : productFormData;
    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
    } else {
      addProduct(payload);
    }
    setShowAddProductModal(false);
    setEditingProduct(null);
  };

  const handleOpenAddService = () => {
    setEditingService(null);
    setServiceFormData({
      name: '',
      shortName: '',
      category: 'Grooming',
      deliveryMode: 'home_service',
      price: '',
      mrp: '',
      durationMinutes: '',
      petType: 'Dogs & Cats',
      visitingFee: '',
      image: '',
      description: 'Comprehensive pet care service delivered by certified professionals.',
      featuresText: 'Certified Professional Care\nSanitized Clinical Kit\nHealth Card Update'
    });
    setShowAddServiceModal(true);
  };

  const handleOpenEditService = (srv) => {
    setEditingService(srv);
    setServiceFormData({
      name: srv.name,
      shortName: srv.shortName || srv.name,
      category: srv.category || 'Grooming',
      deliveryMode: srv.deliveryMode || 'home_service',
      price: srv.price,
      mrp: srv.mrp || srv.price,
      durationMinutes: srv.durationMinutes || 45,
      petType: srv.petType || 'Dogs & Cats',
      visitingFee: srv.visitingFee ?? (srv.deliveryMode === 'home_service' || srv.deliveryMode === 'both' ? 99 : 0),
      image: srv.image || '',
      description: srv.description || '',
      featuresText: (srv.features || []).join('\n')
    });
    setShowAddServiceModal(true);
  };

  const handleSaveService = (e) => {
    e.preventDefault();
    const features = serviceFormData.featuresText
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    const payload = {
      ...serviceFormData,
      features
    };

    if (editingService) {
      updateService(editingService.id, payload);
    } else {
      addService(payload);
    }
    setShowAddServiceModal(false);
    setEditingService(null);
  };

  const handleQuickStockCount = (id, newCount) => {
    const val = Math.max(0, parseInt(newCount) || 0);
    updateProduct(id, { stockCount: val, inStock: val > 0 });
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (p.breed && p.breed.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesStock = stockFilter === 'all' 
      ? true 
      : stockFilter === 'in_stock' 
      ? (p.inStock && p.stockCount > 0) 
      : (!p.inStock || p.stockCount === 0);
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Filtered Services
  const filteredServices = (services || []).filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(serviceSearchQuery.toLowerCase()) || 
                          (s.description && s.description.toLowerCase().includes(serviceSearchQuery.toLowerCase()));
    let matchesMode = true;
    if (serviceModeFilter === 'home_service') matchesMode = s.deliveryMode === 'home_service';
    else if (serviceModeFilter === 'clinic_visit') matchesMode = s.deliveryMode === 'clinic_visit';
    else if (serviceModeFilter === 'Grooming') matchesMode = s.category === 'Grooming';
    else if (serviceModeFilter === 'Veterinary') matchesMode = s.category === 'Veterinary';
    return matchesSearch && matchesMode;
  });

  const isPetSaleForm = productFormData.category === 'pet-sale';

  return (
    <div className="space-y-6">
      
      {/* Top Main Mode Switcher: Products vs Services */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
              Catalog & Service Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your retail product inventory, at-home doorstep services, and in-clinic appointments.
          </p>
        </div>

        {/* Dual Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0 self-start sm:self-center">
          <button
            onClick={() => { setActiveCatalogMode('products'); setCategoryFilter('all'); }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeCatalogMode === 'products'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-amber-500" />
            <span>📦 Retail Products ({products.length})</span>
          </button>
          <button
            onClick={() => { setActiveCatalogMode('pet-sale'); setCategoryFilter('pet-sale'); }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeCatalogMode === 'pet-sale'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="text-lime-600">🐾</span>
            <span>Pets for Sale ({products.filter(p => p.category === 'pet-sale').length})</span>
          </button>
          <button
            onClick={() => setActiveCatalogMode('services')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeCatalogMode === 'services'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>🏡 Services & Clinic Visits ({services?.length || 0})</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: RETAIL PRODUCTS CATALOG
      ========================================================================= */}
      {(activeCatalogMode === 'products' || activeCatalogMode === 'pet-sale') && (
        <div className="space-y-4">
          
          {/* Action & Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by title, pet type, or brand..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-amber-400"
              >
                <option value="all">All Categories</option>
                <option value="food">Pet Food</option>
                <option value="accessories">Accessories & Collars</option>
                <option value="grooming">Grooming & Shampoos</option>
                <option value="medicines">Pharmacy & Healthcare</option>
                <option value="toys">Toys & Beds</option>
                <option value="pet-sale">Pets for Sale</option>
              </select>

              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-amber-400"
              >
                <option value="all">All Stock Status</option>
                <option value="in_stock">In Stock Only</option>
                <option value="out_of_stock">Out of Stock Only</option>
              </select>

              <button
                onClick={activeCatalogMode === 'pet-sale' ? handleOpenAddPet : handleOpenAddProduct}
                className="px-4 py-2 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>{activeCatalogMode === 'pet-sale' ? 'Add Pet for Sale' : 'Add Product'}</span>
              </button>
            </div>
          </div>

          {/* Product Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Product Details</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price / MRP</th>
                    <th className="py-3.5 px-4">Stock Qty</th>
                    <th className="py-3.5 px-4">Stock Status</th>
                    <th className="py-3.5 px-4">Catalog Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <Package className="w-10 h-10 mx-auto mb-2.5 text-slate-300 stroke-[1.5]" />
                        <p className="font-bold text-slate-700 text-sm">No products listed in your store catalog yet</p>
                        <p className="text-xs text-slate-400 mt-1 mb-4">Add your inventory items to start receiving instant delivery orders from pet parents.</p>
                        <button
                          onClick={activeCatalogMode === 'pet-sale' ? handleOpenAddPet : handleOpenAddProduct}
                          className="px-4 py-2 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all inline-flex items-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                          <span>{activeCatalogMode === 'pet-sale' ? 'Add Your First Pet' : 'Add Your First Product'}</span>
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3 min-w-[200px]">
                            <img 
                              src={product.image} 
                            alt={product.name} 
                            className="w-11 h-11 rounded-xl object-contain bg-slate-50 p-1 border border-slate-100 shrink-0" 
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate max-w-xs">{product.name}</p>
                            <p className="text-[11px] text-slate-400 truncate">{product.brand} • {product.petType || 'Pet'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="capitalize bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                          {product.category}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div>
                          <p className="font-black text-slate-900">₹{product.price}</p>
                          {product.mrp && product.mrp > product.price && (
                            <p className="text-[10px] text-slate-400 line-through">₹{product.mrp}</p>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            value={product.stockCount}
                            onChange={(e) => handleQuickStockCount(product.id, e.target.value)}
                            className="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-center font-bold text-slate-800 text-xs focus:outline-none focus:border-amber-400"
                          />
                          <span className="text-[10px] text-slate-400">units</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleProductStock(product.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black transition-all flex items-center gap-1 ${
                            product.inStock && product.stockCount > 0
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${product.inStock && product.stockCount > 0 ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                          <span>{product.inStock && product.stockCount > 0 ? 'In Stock' : 'Out of Stock'}</span>
                        </button>
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleProductActive(product.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all flex items-center gap-1.5 ${
                            product.isActive
                              ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {product.isActive ? (
                            <>
                              <Eye className="w-3 h-3 text-blue-600" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 text-slate-400" />
                              <span>Inactive</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditProduct(product)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: SERVICES & CLINIC VISITS CATALOG (HOME VS CLINIC)
      ========================================================================= */}
      {activeCatalogMode === 'services' && (
        <div className="space-y-4">
          
          {/* Service Filters & Add Button */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={serviceSearchQuery}
                onChange={(e) => setServiceSearchQuery(e.target.value)}
                placeholder="Search services (e.g. Grooming, Vet Consultation, Ultrasound)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-slate-50 p-0.5 rounded-xl border border-slate-200 text-xs">
                {[
                  { id: 'all', label: 'All Services' },
                  { id: 'home_service', label: '🏡 At-Home Only' },
                  { id: 'clinic_visit', label: '🏥 In-Clinic Only' },
                  { id: 'Grooming', label: '✂️ Grooming' },
                  { id: 'Veterinary', label: '🩺 Veterinary' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setServiceModeFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      serviceModeFilter === tab.id
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleOpenAddService}
                className="px-4 py-2 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add New Service</span>
              </button>
            </div>
          </div>

          {/* Service Cards Grid */}
          {filteredServices.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center">
              <Scissors className="w-10 h-10 mx-auto mb-2.5 text-slate-300 stroke-[1.5]" />
              <p className="font-bold text-slate-700 text-sm">No services configured yet</p>
              <p className="text-xs text-slate-400 mt-1 mb-4">Enable At-Home Grooming, Doctor Consultations, or Clinic Walk-ins for pet owners.</p>
              <button
                onClick={handleOpenAddService}
                className="px-4 py-2 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add Your First Service</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredServices.map(srv => {
                const isHome = srv.deliveryMode === 'home_service';
                const isBoth = srv.deliveryMode === 'both';
                return (
                  <div 
                    key={srv.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between gap-4 hover:border-amber-300 transition-all group"
                >
                  <div className="space-y-3">
                    
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {isBoth ? (
                          <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                            <Home className="w-3 h-3 text-emerald-700" />
                            <span>Home + In-Clinic Options</span>
                          </span>
                        ) : isHome ? (
                          <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-amber-200">
                            <Home className="w-3 h-3 text-amber-700" />
                            <span>At-Home Doorstep Service</span>
                          </span>
                        ) : (
                          <span className="bg-blue-100 text-blue-900 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-blue-200">
                            <Building className="w-3 h-3 text-blue-700" />
                            <span>In-Clinic Facility Visit</span>
                          </span>
                        )}

                        <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {srv.category}
                        </span>
                      </div>

                      {/* Active Status Toggle */}
                      <button
                        onClick={() => toggleServiceActive(srv.id)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all flex items-center gap-1 ${
                          srv.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${srv.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        <span>{srv.isActive ? 'Accepting Bookings' : 'Paused'}</span>
                      </button>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="font-heading font-black text-base text-slate-900 group-hover:text-amber-600 transition-colors">
                        {srv.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {srv.description}
                      </p>
                    </div>

                    {/* Features Checklist */}
                    {srv.features && srv.features.length > 0 && (
                      <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Included In Service:</p>
                        <ul className="text-xs text-slate-700 space-y-1">
                          {srv.features.map((feat, idx) => (
                            <li key={idx} className="flex items-center gap-1.5 text-[11px]">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Meta info: Pet Type & Visiting Fee */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                      <span>{srv.petType || 'Dogs & Cats'}</span>
                      {isHome && srv.visitingFee > 0 && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                            Visiting Fee: ₹{srv.visitingFee}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Bottom Price & Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-heading font-black text-lg text-slate-900">₹{srv.price}</span>
                        {srv.mrp && srv.mrp > srv.price && (
                          <span className="text-xs text-slate-400 line-through">₹{srv.mrp}</span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">Per session / pet</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/vendor/orders`}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                        title="View Orders / Bookings for this service"
                      >
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>Bookings</span>
                      </Link>

                      <button
                        onClick={() => handleOpenEditService(srv)}
                        className="p-2 hover:bg-slate-100 text-slate-700 rounded-xl transition-colors border border-slate-200"
                        title="Edit Service"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deleteService(srv.id)}
                        className="p-2 hover:bg-rose-50 text-rose-600 rounded-xl transition-colors border border-rose-100"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          MODAL 1: ADD / EDIT PRODUCT
      ========================================================================= */}
      {showAddProductModal && createPortal(
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] sm:max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom duration-300">
            
            {/* Mobile Grab Bar */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-2 sm:hidden shrink-0" />

            {/* Header */}
            <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                  <Package className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading font-black text-sm sm:text-base text-slate-900 truncate">
                    {editingProduct
                      ? (productFormData.category === 'pet-sale' ? 'Edit Pet for Sale' : 'Edit Retail Product')
                      : (productFormData.category === 'pet-sale' ? 'Add Pet for Sale' : 'Add New Product to Store')}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                    {productFormData.category === 'pet-sale'
                      ? 'List a pet with verified details, pricing, stock, and a clear photo.'
                      : 'Post new pet supplies with live pricing and stock availability.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveProduct} className="flex flex-col min-h-0 flex-1">
              <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain flex-1 space-y-4 text-xs">
                {!isPetSaleForm && <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Product Full Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={productFormData.name || ''}
                    onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                    placeholder="e.g. Royal Canin Medium Adult Dog Food 4kg"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>}

                {!isPetSaleForm && <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={productFormData.brand || ''}
                      onChange={(e) => setProductFormData({ ...productFormData, brand: e.target.value })}
                      placeholder="e.g. Royal Canin / Pedigree"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={productFormData.category}
                      onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs focus:outline-none focus:border-amber-400"
                    >
                      <option value="food">Pet Food & Nutrition</option>
                      <option value="accessories">Collars, Leashes & Beds</option>
                      <option value="grooming">Shampoo, Wipes & Grooming</option>
                      <option value="medicines">Pharmacy & Healthcare</option>
                      <option value="toys">Chew Toys & Scratchers</option>
                      <option value="pet-sale">Pets for Sale</option>
                    </select>
                  </div>
                </div>}

                <div className={isPetSaleForm ? 'grid grid-cols-1 gap-3' : 'grid grid-cols-3 gap-3'}>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {isPetSaleForm ? 'Amount (₹) *' : 'Selling Price (₹) *'}
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={productFormData.price}
                      onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                      placeholder="849"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-400 font-bold"
                    />
                  </div>

                  {!isPetSaleForm && <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      MRP / Strike Price
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={productFormData.mrp || ''}
                      onChange={(e) => setProductFormData({ ...productFormData, mrp: e.target.value })}
                      placeholder="999"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Initial Stock *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={productFormData.stockCount || ''}
                      onChange={(e) => setProductFormData({ ...productFormData, stockCount: e.target.value })}
                      placeholder="25"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  </>}
                </div>

                <div className={isPetSaleForm ? 'grid grid-cols-1 gap-3' : 'grid grid-cols-2 gap-3'}>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Pet Type *
                    </label>
                    <select
                      value={productFormData.petType}
                      onChange={(e) => setProductFormData({ ...productFormData, petType: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs focus:outline-none focus:border-amber-400"
                    >
                      <option value="Dog">Dog</option>
                      <option value="Cat">Cat</option>
                      <option value="Puppy">Puppy / Kitten</option>
                      <option value="All">All Pets</option>
                    </select>
                  </div>

                  {!isPetSaleForm && <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Package Size / Weight
                    </label>
                    <input
                      type="text"
                      value={productFormData.size || ''}
                      onChange={(e) => setProductFormData({ ...productFormData, size: e.target.value })}
                      placeholder="e.g. 3 kg or Medium"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>}
                </div>

                {productFormData.category === 'pet-sale' && (
                  <div className="grid grid-cols-2 gap-3 rounded-2xl bg-lime-50 border border-lime-200 p-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Breed *</label>
                      <input
                        type="text"
                        required
                        value={productFormData.breed || ''}
                        onChange={(e) => setProductFormData({ ...productFormData, breed: e.target.value })}
                        placeholder="e.g. Golden Retriever"
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-lime-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Age (years) *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.1"
                        value={productFormData.ageYears ?? ''}
                        onChange={(e) => setProductFormData({ ...productFormData, ageYears: e.target.value })}
                        placeholder="e.g. 1.5"
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-lime-500"
                      />
                    </div>
                  </div>
                )}

                <ImageUploadField
                  label="Product Image"
                  folder="pawnear/products"
                  value={productFormData.image}
                  onChange={(url) => setProductFormData(prev => ({ ...prev, image: url }))}
                />
              </div>

              {/* Sticky Footer */}
              <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 transition-colors text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-initial px-6 py-2.5 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black rounded-xl shadow-xs transition-all active:scale-95 text-xs text-center"
                >
                  {editingProduct ? 'Save Product Changes' : 'Post Product to Store'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* =========================================================================
          MODAL 2: ADD / EDIT SERVICE (HOME SERVICE VS CLINIC VISIT)
      ========================================================================= */}
      {showAddServiceModal && createPortal(
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] sm:max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom duration-300">
            
            {/* Mobile Grab Bar */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-2 sm:hidden shrink-0" />

            {/* Header */}
            <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading font-black text-sm sm:text-base text-slate-900 truncate">
                    {editingService ? 'Edit Care Service' : 'Add New Service (Home / Clinic)'}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                    Configure at-home doorstep grooming/vet visits or in-clinic appointment slots.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddServiceModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveService} className="flex flex-col min-h-0 flex-1">
              <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain flex-1 space-y-4 text-xs">
                {/* Delivery Channel Radio */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Service Delivery Channel *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label 
                      className={`p-3 rounded-2xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                        serviceFormData.deliveryMode === 'home_service'
                          ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-300'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryMode"
                        checked={serviceFormData.deliveryMode === 'home_service'}
                        onChange={() => setServiceFormData({ ...serviceFormData, deliveryMode: 'home_service', visitingFee: serviceFormData.visitingFee || 99 })}
                        className="text-amber-500 focus:ring-amber-400"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block text-xs">🏡 At-Home Doorstep</span>
                        <span className="text-[10px] text-slate-500">Staff travels to home</span>
                      </div>
                    </label>

                    <label 
                      className={`p-3 rounded-2xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                        serviceFormData.deliveryMode === 'clinic_visit'
                          ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-300'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryMode"
                        checked={serviceFormData.deliveryMode === 'clinic_visit'}
                        onChange={() => setServiceFormData({ ...serviceFormData, deliveryMode: 'clinic_visit', visitingFee: 0 })}
                        className="text-amber-500 focus:ring-amber-400"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block text-xs">🏥 In-Clinic Visit</span>
                        <span className="text-[10px] text-slate-500">Customer visits center</span>
                      </div>
                    </label>

                    <label
                      className={`p-3 rounded-2xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                        serviceFormData.deliveryMode === 'both'
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-300'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryMode"
                        checked={serviceFormData.deliveryMode === 'both'}
                        onChange={() => setServiceFormData({ ...serviceFormData, deliveryMode: 'both', visitingFee: serviceFormData.visitingFee || 99 })}
                        className="text-emerald-500 focus:ring-emerald-400"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block text-xs">🏡 + 🏥 Both Options</span>
                        <span className="text-[10px] text-slate-500">Customer chooses</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Service Package Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={serviceFormData.name || ''}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, name: e.target.value })}
                    placeholder="e.g. Full Bath, Haircut & Nail Styling or Complete Health Checkup"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Service Category *
                    </label>
                    <select
                      value={serviceFormData.category}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, category: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs focus:outline-none focus:border-amber-400"
                    >
                      <option value="Grooming">✂️ Pet Grooming & Spa</option>
                      <option value="Veterinary">🩺 Veterinary & Medical Checkup</option>
                      <option value="Boarding">🏨 Pet Boarding & Daycare</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Supported Pet Type *
                  </label>
                  <select
                    required
                    value={serviceFormData.petType}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, petType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="Dogs & Cats">Dogs & Cats</option>
                    <option value="Dog">Dogs only</option>
                    <option value="Cat">Cats only</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Base Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={serviceFormData.price || ''}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, price: e.target.value })}
                      placeholder="999"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-400 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Strike MRP (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={serviceFormData.mrp || ''}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, mrp: e.target.value })}
                      placeholder="1299"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {serviceFormData.deliveryMode !== 'clinic_visit' ? (
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Visiting Fee (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={serviceFormData.visitingFee || ''}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, visitingFee: e.target.value })}
                        placeholder="99"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-400 font-bold text-amber-800"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Facility
                      </label>
                      <input
                        type="text"
                        disabled
                        value="In-Clinic Suite"
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-xs text-slate-500"
                      />
                    </div>
                  )}
                </div>

                <ImageUploadField
                  label="Service Image"
                  folder="pawnear/services"
                  value={serviceFormData.image}
                  onChange={(url) => setServiceFormData(prev => ({ ...prev, image: url }))}
                />

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Features & Inclusions (One per line)
                  </label>
                  <textarea
                    rows="3"
                    value={serviceFormData.featuresText}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, featuresText: e.target.value })}
                    placeholder="Warm Hydrobath with Herbal Shampoo&#10;Blow Dry & Coat Brush&#10;Nail Trim & Ear Cleansing"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 transition-colors text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-initial px-6 py-2.5 bg-[#FFB703] hover:bg-[#E5A015] text-slate-950 font-black rounded-xl shadow-xs transition-all active:scale-95 text-xs text-center"
                >
                  {editingService ? 'Save Service Changes' : 'Publish Service to Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
