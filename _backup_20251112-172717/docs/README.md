# TheBenjiBag Cannabis Delivery Platform

A full-featured cannabis delivery web application built with React, Node.js, Express, and MongoDB. Includes age gate compliance, role-based access (Admin, Driver, Customer), live driver tracking, real-time ETA updates, and integrated payment processing.

## Features

### Customer Features
- ✅ Age gate (21+ compliance) on first visit
- ✅ Browse product catalog
- ✅ Shopping cart with order validation ($100-$500)
- ✅ Checkout with Helcim payment integration
- ✅ Order tracking with real-time ETA
- ✅ Saved addresses
- ✅ Referral program with unique codes
- ✅ Promo code support
- ✅ Order history and reorder capability

### Driver Features
- ✅ Mobile-optimized map view with MapTiler
- ✅ GPS location tracking (5-10s broadcast)
- ✅ Status management (Idle, En Route, Delivering)
- ✅ Real-time delivery updates via Socket.IO
- ✅ Delivery acceptance/completion

### Admin Features
- ✅ Comprehensive dashboard with real-time stats
- ✅ Order management (CRUD operations)
- ✅ User management
- ✅ Driver location viewer with live tracking
- ✅ Reporting dashboard (deliveries/day, revenue, repeat %)
- ✅ Order reassignment
- ✅ Inline order editing

### Technical Features
- ✅ JWT-based authentication
- ✅ Role-based access control (Admin, Driver, Customer)
- ✅ Real-time event-driven ETA engine
- ✅ WebSocket support via Socket.IO
- ✅ CORS security configuration
- ✅ IP velocity limiting
- ✅ Email notifications via Brevo SMTP
- ✅ MapTiler integration (3 role-specific keys)
- ✅ MongoDB database with Mongoose schemas
- ✅ Comprehensive error handling

## Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS 4
- **Backend**: Node.js + Express 4 + tRPC 11
- **Database**: MongoDB Atlas (free tier)
- **Real-time**: Socket.IO (WebSockets)
- **Mapping**: MapTiler SDK
- **Payments**: Helcim (test mode)
- **Email**: Brevo SMTP
- **Hosting**: Render.com
- **CI/CD**: GitHub Actions

## Project Structure

```
thebenjibag/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── _core/            # Core hooks and utilities
│   │   ├── lib/              # tRPC client setup
│   │   └── App.tsx           # Main app routing
│   └── index.html
├── server/                    # Express backend
│   ├── routers.ts            # tRPC procedure definitions
│   ├── db.ts                 # Database query helpers
│   └── _core/                # Core server utilities
├── drizzle/                  # Database schema and migrations
│   └── schema.ts             # Mongoose-style schema
├── render.yaml               # Render.com deployment config
├── .github/workflows/        # GitHub Actions CI/CD
├── tools/                    # Deployment scripts
├── DEPLOYMENT.md             # Deployment guide
└── README.md                 # This file
```

## Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm
- MongoDB Atlas account
- MapTiler API keys (3 keys)
- Brevo SMTP credentials
- Helcim API key (test mode)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/thebenjibag.git
   cd thebenjibag
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd client && npm install && cd ..
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Set up database**
   ```bash
   pnpm db:push
   ```

5. **Start development servers**
   ```bash
   # Terminal 1: Backend
   npm run dev
   
   # Terminal 2: Frontend
   cd client && npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

## Environment Variables

Required environment variables (see `.env.example`):

```
# Database
MONGODB_URI=mongodb+srv://...

# Authentication
JWT_SECRET=your_jwt_secret

# MapTiler Keys (3 separate keys for different roles)
MAPTILER_ADMIN=your_admin_key
MAPTILER_DRIVER=your_driver_key
MAPTILER_CUSTOMER=your_customer_key

# Email (Brevo)
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=your_brevo_user
BREVO_SMTP_KEY=your_brevo_key
BREVO_SMTP_FROM=admin@thebenjibag.com

# Payments (Helcim)
HELCIM_API_KEY=your_helcim_test_key
HELCIM_TEST_MODE=true

# CORS
CORS_ORIGIN=https://thebenjibag.com,https://admin.thebenjibag.com

# Render Deployment
RENDER_API_KEY=your_render_api_key
RENDER_SERVICE_ID=your_render_service_id
```

## Database Schema

The application includes the following MongoDB collections:

- **users** - User accounts with roles (admin, driver, customer)
- **products** - Cannabis product catalog
- **orders** - Customer orders with status tracking
- **drivers** - Driver profiles with location tracking
- **referrals** - Referral codes and tracking
- **promos** - Promotional codes
- **addresses** - Saved customer addresses
- **transactions** - Payment transactions
- **deliveryHistory** - Delivery tracking history

## API Endpoints

All API endpoints use tRPC and are available at `/api/trpc`:

### Authentication
- `auth.me` - Get current user
- `auth.logout` - Logout user

### Products
- `products.list` - Get all products
- `products.get` - Get product by ID

### Orders
- `orders.create` - Create new order
- `orders.list` - Get user's orders
- `orders.get` - Get order by ID
- `orders.updateStatus` - Update order status (admin only)
- `orders.assignDriver` - Assign driver to order (admin only)
- `orders.updateETA` - Update order ETA

### Drivers
- `drivers.list` - Get all drivers (admin only)
- `drivers.updateLocation` - Update driver location
- `drivers.updateStatus` - Update driver status

### Referrals
- `referrals.generate` - Generate referral code
- `referrals.applyCode` - Apply referral code
- `referrals.get` - Get referral details

### Promotions
- `promos.validateCode` - Validate promo code

### Admin Reporting
- `reporting.getTodayStats` - Get today's statistics
- `reporting.getRepeatCustomers` - Get repeat customer ratio

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Render

1. Push your code to GitHub
2. Connect repository to Render
3. Add environment variables in Render dashboard
4. Deploy!

```bash
# Or use the deployment script
export RENDER_API_KEY=your_key
export RENDER_SERVICE_ID=your_id
./tools/deploy.sh  # Unix/Linux/macOS
# or
.\tools\deploy.ps1  # Windows PowerShell
```

## Product Catalog (Mock Data)

1. Top Shelf Indica (0.5 oz) - $50
2. Premium Sativa (0.5 oz) - $50
3. Sativa Concentrate (7g) - $60
4. Indica Concentrate (7g) - $60
5. Sativa Live Resin Vape Pen (1g) - $45
6. Indica Live Resin Vape Pen (1g) - $45

## Order Limits

- **Minimum order**: $100
- **Maximum order**: $500
- **Delivery window**: Configurable per order

## Security Features

- Age gate enforcement (localStorage-based)
- JWT authentication with secure cookies
- Role-based access control (RBAC)
- CORS configuration for allowed domains
- IP velocity limiting
- Input validation and sanitization
- Secure MapTiler key distribution (server-side)
- No secrets exposed in frontend code

## Real-time Features

The application uses Socket.IO for real-time updates:

- Driver location broadcasts (5-10s interval)
- ETA updates to admin and customer rooms
- Order status change notifications
- Live delivery tracking

ETA is recomputed when:
- Driver starts trip
- Driver location changes >250m
- Order status changes

## Testing

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- --testPathPattern=orders

# Run with coverage
npm test -- --coverage
```

## Troubleshooting

### Age Gate Not Showing
- Clear browser localStorage: `localStorage.clear()`
- Check browser console for errors
- Verify age-ok flag is being set

### Map Not Loading
- Verify MapTiler API keys are valid
- Check CORS configuration
- Ensure keys have appropriate permissions

### Database Connection Issues
- Verify MONGODB_URI is correct
- Check MongoDB Atlas whitelist includes your IP
- Ensure database user has correct permissions

### Payment Processing
- Verify Helcim API key is in test mode
- Check Helcim test credentials are valid
- Review payment webhook logs

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues or questions:
1. Check existing GitHub Issues
2. Review [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
3. Check application logs
4. Contact support

## Roadmap

- [ ] SMS notifications via Brevo
- [ ] Advanced admin grid with editable cells
- [ ] Directions API routing with fallback
- [ ] Inventory management system
- [ ] Customer reviews and ratings
- [ ] Loyalty program enhancements
- [ ] Multi-language support
- [ ] Mobile app (React Native)

## Compliance

This application is designed for legal cannabis delivery in jurisdictions where it is permitted. Users must:
- Be 21 years or older (verified via age gate)
- Comply with local cannabis regulations
- Provide valid delivery address

## Disclaimer

TheBenjiBag is provided as-is for demonstration purposes. Users are responsible for ensuring compliance with all applicable federal, state, and local laws regarding cannabis delivery.
