# Paw Street Mobile Applications (Android & Web)

This directory contains the two independent mobile applications for **Paw Street**:

---

## 📱 1. Customer / User App (`apps/user-app`)
* **Package Name:** `com.pawstreet.user`
* **Target Audience:** Pet owners and pet parents.
* **Features:**
  * Fast pet food, supplies & toy shopping with 15-minute quick delivery.
  * Category navigation (Dogs, Cats, Birds, Fishes, Small Pets).
  * Pet profile manager (My Furry Family).
  * Cart & Checkout with coupons (PAWFIRST, SUPERPET) & COD / UPI payment.
  * Live delivery tracking with delivery verification OTP and rider contact.
  * PawBot AI pet care assistant.
  * Pet wellness bookings (Grooming, Vet clinic, Dog walking).

### How to Run:
```bash
cd apps/user-app
npm install
npm run android    # Run on Android emulator / connected USB device
# or
npm run web        # Run in browser preview with mobile frame
```

---

## 🏪 2. Partner App: Vendor & Delivery Fleet (`apps/partner-app`)
* **Package Name:** `com.pawstreet.partner`
* **Target Audience:** Store owners/Vendors & Delivery fleet captains.
* **Features:**
  * **Role Switcher:** Instant toggle between **Store Vendor** and **Delivery Partner** modes.
  * **Vendor Operations:**
    * Store Open/Closed availability switch.
    * Real-time order fulfillment pipeline (Preparing, Ready for Pickup, Handover).
    * Catalog inventory manager with live in-stock / out-of-stock toggles.
    * Add new pet products modal.
    * Daily/weekly revenue dashboard and instant bank payout requests.
  * **Delivery Fleet Operations:**
    * One-tap Online / Offline duty availability toggle.
    * Live nearby order pool feed with distance and fee breakdown.
    * Accept order & 2-step mission execution:
      1. Navigate to store & confirm package pickup.
      2. Navigate to pet parent, verify customer delivery OTP & collect COD.
    * Daily earnings, completed trips history, and wallet payout withdrawal.

### How to Run:
```bash
cd apps/partner-app
npm install
npm run android    # Run on Android emulator / connected USB device
# or
npm run web        # Run in browser preview with mobile frame
```

