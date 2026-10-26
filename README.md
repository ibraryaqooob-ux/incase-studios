# 🎨 INCASE STUDIOS — Precision Print & Spec Atelier

A minimalist, high-converting e-commerce storefront and live room visualizer engineered specifically for **INCASE STUDIOS**.

---

## 📐 Brand & Product Specifications

### 1. Strict Size Standards (A4 & A3 Only)
* **A4**: `210 × 297 mm`
* **A3**: `297 × 420 mm`
* *(All other dimensions, cm labels, A2, and A1 options removed)*

### 2. Paper & Print Spec
* **Paper Stock**: **Premium 200gsm Glossy Photo Paper**
* **Printing Style**: **Full-Bleed Edge-to-Edge** (zero white border margins)

### 3. Black Frame Formats (Strictly Black Only)
* **Unframed (Print Only)**: Dispatched flat in rigid protective hardback envelopes.
* **Black Plastic Frame**: Sleek matte black profile with shatterproof styrene front.
* **Black Aluminium Frame**: Slim anodized black aluminium profile with reinforced corner brackets.
* *(All wooden, oak, walnut, white, and gold frames removed)*

### 4. Exact GBP (£) Pricing Matrix (23% OFF Storewide)
Every price across the site, cards, modal, and bag is strictly in GBP (£):

| Format | A4 (`210 × 297 mm`) | A3 (`297 × 420 mm`) |
| :--- | :--- | :--- |
| **Unframed (Hardback Envelope)** | **£7.00** | **£10.99** |
| **Black Plastic Frame** | **£19.20** | **£22.45** |
| **Black Aluminium Frame** | **£22.70** | **£25.95** |

* **Announcement Bar**: `"23% OFF EVERYTHING + FREE UK DELIVERY ON ORDERS OVER £20"`
* **Delivery**: Free UK delivery on orders £20 and over (otherwise £2.99).

---

## 💳 Stripe Payments Setup

The application features a built-in Stripe Checkout Session backend in [`server.py`](file:///Users/ibraryaqoob/Documents/antigravity/lively-carson/server.py).

### How to Activate Live / Test Card Payments:
1. Create a free account at [stripe.com](https://stripe.com).
2. Grab your Secret Key from your Stripe Dashboard (`sk_test_...` or `sk_live_...`).
3. Set the environment variable and run the server:
   ```bash
   export STRIPE_SECRET_KEY="sk_test_..."
   python3 server.py
   ```
4. When customers click **"Pay with Stripe / Card / Apple Pay"**, they will be automatically redirected to Stripe's official secure payment page in GBP (£), and payments will deposit directly into your bank!
5. If running without a key, the checkout seamlessly provides a simulated test order flow (`INC-XXXXXX`) so you can test end-to-end without disruption.

---

## 🚀 Running the Store

```bash
python3 server.py
```
Open your browser at **http://localhost:3000**.
