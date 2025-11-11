# Full AI Execution Guide for Building and Deploying TheBenjiBag Cannabis Delivery Platform

---

## PROJECT SCOPE
An AI agent must build, configure, and deploy a cannabis delivery web platform for TheBenjiBag using free-tier services, mock data, and specified rules. The completed site must be deployable to Render.com and live immediately, complete with:
- Age gate (21+ compliance)
- Role-based accounts (Admin, Driver, Customer)
- Full-featured admin dashboard
- Live driver tracking with MapTiler
- Realtime event-driven ETA logic
- Product cart + checkout flow with Helcim test mode
- Security constraints (CORS, brute force blocks)
- Promotions, referrals, reporting, and reorder capability

---

## STACK
- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas (free tier)
- **Realtime Transport**: Socket.IO (WebSockets)
- **Mapping**: MapTiler SDK (free-tier keys)
- **Hosting**: Render.com (static + Node service)
- **Email**: Brevo SMTP (free tier)
- **Payments**: Helcim (test mode)

---

## PRODUCT CATALOG (Mock Content)
Each item is mocked for testing. Include in frontend cart logic and display logic:

1. Top Shelf Indica (0.5 oz)
2. Premium Sativa (0.5 oz)
3. Sativa Concentrate (7g)
4. Indica Concentrate (7g)
5. Sativa Live Resin Vape Pen (1g)
6. Indica Live Resin Vape Pen (1g)

Cart limits:
- Minimum order: $100
- Maximum order: $500
- No driver change handling for cash

---

## USER ROLES AND ACCESS

### Admin
- Full dashboard access (CRUD on orders, users)
- Driver location viewer w/ live tracking
- Inline order editing
- Reassign orders
- Reporting dashboard: deliveries/day, $/hour, repeat %

### Driver
- Mobile map view
- Accept/complete deliveries
- Live GPS location broadcast every 5-10s
- Send status updates (Started, Enroute, Delivered)

### Customer
- Age gate (on first visit, 21+ required)
- Browse products
- Add to cart
- Place order with Helcim checkout
- Order ETA via tokenized /track/:id link
- Saved addresses
- Reorder in 1-click

---

## AGE GATE
- React modal upon first load
- User confirms they are 21+
- Store result in localStorage under `age-ok=1`

---

## MAPPING
Use 3 distinct MapTiler API keys:

1. **Admin Key**: Full access (routing, tiles, geocoding)
2. **Driver Key**: Navigation + location
3. **Customer Key**: Tiles only

Secure keys server-side:
```js
GET /api/map-key => { key: MAPTILER_[role] }
```
Frontend requests per role.

---

## EVENT-DRIVEN ETA ENGINE

Recompute ETA on:
- Driver starts trip
- Driver location changes >250m
- Order status changes

On ETA update:
- Push to Admin room
- Push to Customer room (if active)

---

## DATABASE SCHEMAS (Mongoose)

**User**
- role (admin, driver, customer)
- name, email, phone
- referralCode
- referredBy

**Order**
- orderId
- customerId
- product list
- windowStart, windowEnd
- status (pending, assigned, delivered)
- assignedDriverId
- nextUpLinkToken

**Driver**
- userId
- status (idle, enroute, delivering)
- currentOrderId
- loc { lng, lat }

**Referral**
- code
- referredUsers
- creditAmount

---

## PROMOTIONS & REFERRALS
- Every customer has unique referral code
- Referral applies $X off to both referrer and referee
- Track promo usage in MongoDB
- Simple query param logic for tracking (e.g. `?ref=CODE`)

---

## REPORTING
Admin dashboard includes:
- Total deliveries today
- Peak delivery hours
- Top drivers
- Repeat customer ratio
- Avg ETA vs actual

---

## SECURITY
- CORS: Only allow thebenjibag.com subdomains
- JWT auth (replace dummy `requireAuth` middleware with real JWT check)
- IP velocity limits (basic middleware layer)
- Role-scoped API endpoints
- Do not expose secrets in frontend

---

## PAYMENT
- Use Helcim test credentials
- Implement checkout via hosted payment link
- Return status to backend webhook

---

## DEPLOYMENT
1. Use provided `render.yaml`
2. Add all secrets in Render dashboard:
   - MongoDB URI
   - MapTiler keys (admin, driver, customer)
   - Helcim test keys
   - Brevo SMTP keys
3. Connect to GitHub repo
4. Trigger deploy from Render

---

## FILE STRUCTURE
```
/frontend
  /src
    App.jsx
    main.jsx
    components/
  index.html
  styles.css
/backend
  server.js
  models/
  routes/
  .env.example
render.yaml
tools/
  deploy.ps1
  deploy.sh
```

---

## CI/CD
- GitHub Actions `.github/workflows/build.yml`
- Output ZIP of full repo
- Push to `ai-auto-updates` branch

---

## DONE WHEN...
✅ Age gate enforced
✅ Live driver tracking on admin map
✅ Order placement works
✅ Helcim checkout flows in test mode
✅ ETA pushes fire on status/movement
✅ Role access correct
✅ Order limits respected
✅ Referrals track and credit
✅ Reporting live on dashboard
✅ Web is live via Render.com
✅ No secrets are exposed
✅ Free services only used (except Helcim, test mode ok)

---

## FOLLOW-UP EXTENSIONS
Ready after MVP:
- Production-grade JWT + RBAC
- SMS notification via Brevo
- Admin grid editable cells
- Directions API routing w/ fallback
- Inventory manager

---

## END OF GUIDE

