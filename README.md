# Tech Haven - E-commerce Frontend

A modern React 19 single-page application (SPA) for Tech Haven payment services with full checkout flow, Redux state management, and responsive design.

## 🚀 Features

- **Product Display**: Browse and view product details
- **Shopping Cart**: Add/remove items, update quantities with persistence
- **Checkout Flow**: Multi-step process (Delivery → Payment → Summary → Confirmation)
- **Payment Processing**: Credit card validation with:
  - Luhn algorithm verification
  - Card type detection (VISA, MasterCard, AMEX)
  - CVV validation
  - Expiration date validation
- **Responsive Design**: Optimized for mobile (iPhone SE+), tablets, and desktop
- **State Management**: Redux Toolkit with persistent storage
- **Modern Stack**: React 19, TypeScript, Vite, Bootstrap 5, Sass

## 📋 Prerequisites

- Node.js 18+
- npm 9+

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
# TechHaven Backend API
VITE_TECH_HAVEN_API_URL=http://localhost:3001/api

# Wompi Payment Gateway
VITE_WOMPI_API_URL=https://api-sandbox.co.uat.wompi.dev/v1
VITE_WOMPI_PUBLIC_KEY=your_wompi_public_key_here

# Application Environment
VITE_APP_ENV=development
```

**⚠️ Security Notice:**
- Never commit `.env` or `.env.local` files
- Never hardcode API keys or credentials
- Use `.env.example` to document required variables
- See [SECURITY.md](./SECURITY.md) for security guidelines

## 📚 Development

```bash
# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint -- --fix
```

## 📁 Project Structure

```
src/
├── application/
│   ├── store/                    # Redux store & slices
│   │   ├── slices/              # Redux slice definitions
│   │   ├── hooks.ts             # Redux hooks (useAppDispatch, useAppSelector)
│   │   └── store.ts             # Store configuration
│   └── useCases/                # Application logic orchestration
├── domain/
│   ├── entities/                # Business entities
│   ├── ports/                   # Interfaces (ports)
│   └── services/                # Domain services
├── infrastructure/
│   ├── adapters/                # Port implementations
│   ├── api/                     # API clients
│   └── hooks/                   # Infrastructure hooks
├── presentation/
│   ├── components/              # Reusable components
│   ├── pages/                   # Page components
│   ├── hooks/                   # UI hooks
│   └── styles/                  # Global styles
├── shared/
│   ├── types/                   # Common TypeScript types
│   └── utils/                   # Utility functions
├── App.tsx                      # Root component
├── App.scss                     # Global styles
├── main.tsx                     # Application entry point
└── index.scss                   # Base styles
```

## 🔄 Application Flow

### Checkout Process

1. **Product Page** (`/product`)
   - ✅ Display product details loaded from backend API
   - ✅ Show available stock from backend
   - ✅ Display product description and price (converted from cents)
   - ✅ "Add to Cart" button (disabled if out of stock)
   - ✅ Real-time product updates from API
   - Fallback: Mock products if API unavailable

2. **Cart Page** (`/cart`)
   - Review cart items
   - Adjust quantities
   - Proceed to checkout

3. **Delivery Page** (`/checkout/delivery`)
   - Enter delivery information
   - Validate address details
   - Open payment modal

4. **Payment Modal**
   - Card number input with live validation
   - Cardholder name
   - Expiration date
   - CVV validation

5. **Summary Page** (`/checkout/summary`)
   - Review order details
   - Display cost breakdown
   - Confirm payment

6. **Final Status Page** (`/checkout/final`)
   - Show transaction confirmation
   - Display order details
   - Option to continue shopping

## 💾 State Management

### Redux Slices

#### `checkoutSlice`

- **cartItems**: Cart contents
- **paymentData**: Payment information (masked)
- **deliveryData**: Delivery address
- **baseFee**: Fixed service fee (5000 cents = $50)
- **deliveryFee**: Delivery cost (10000 cents = $100)
- **loading**: Processing state
- **error**: Error messages
- **step**: Current checkout step
- **lastTransactionId**: Completed transaction ID

### Persisted Data

- ✅ **Checkout state** (delivery, payment, transaction data) persisted to localStorage
- ✅ **Cart items** persisted to localStorage
- ✅ **Wishlist** persisted to localStorage
- ✅ **State automatically recovered on page refresh** (using redux-persist)
- ✅ **Resilient checkout experience**: Users can resume checkout after page navigation/refresh

## 🎨 Components

### PaymentModal

Real-time credit card validation with:

- Card number formatting
- Card type detection with visual badges
- Month/Year expiration selectors
- CVV masking
- Form-level validation

**Props:**

- `isOpen: boolean` - Modal visibility
- `onClose: () => void` - Close callback
- `onSubmit: (data: PaymentFormData) => void` - Submit handler
- `loading?: boolean` - Processing state

## ✅ Card Validation

### Supported Card Types

- **VISA**: Starts with 4, 13 or 16 digits
- **MASTERCARD**: Starts with 51-55, 16 digits
- **AMEX**: Starts with 34 or 37, 15 digits

### Validation Features

- Luhn algorithm verification
- CVV validation (3 or 4 digits)
- Expiration date validation
- Format validation

**Test Cards:**

```
VISA:       4111 1111 1111 1111
MASTERCARD: 5555 5555 5555 4444
AMEX:       3782 822463 10005
```

## 📦 Dependencies

### Production

- `react@^19.2.0` - UI library
- `react-dom@^19.2.0` - React DOM
- `react-router-dom@^7.13.0` - Client routing
- `@reduxjs/toolkit@^2.11.2` - State management
- `react-redux@^9.2.0` - React-Redux bindings
- `bootstrap@^5.3.8` - CSS framework
- `sass@^1.97.3` - CSS preprocessor

### Development

- `typescript@^5.9.3` - TypeScript
- `vite@npm:rolldown-vite@7.2.5` - Build tool
- `eslint@^9.39.1` - Code linting
- `@typescript-eslint/eslint-plugin` - TypeScript linting

## 🔒 Security Considerations

- ✅ CVV codes are **never stored** (discarded after validation)
- ✅ Card numbers are **masked** in display (show only last 4 digits)
- ✅ HTTPS-ready for production
- ✅ Environment variables for sensitive data
- ✅ Input validation on client and server

## 📱 Responsive Design

### Breakpoints

- **Mobile**: 320px - 575px (iPhone SE: 375px)
- **Tablet**: 576px - 991px
- **Desktop**: 992px+

### Tested Devices

- iPhone SE (375x812)
- iPhone 12/13/14 (390x844)
- iPad (768x1024)
- Desktop (1920x1080)

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

**Coverage Target**: 80% minimum ✅ **ACHIEVED**

### Test Results

- **Test Suites**: 7 passed, 7 total
- **Tests**: 45 passed, 45 total
- **Coverage Metrics**:
  - **Statements**: 98.75% ✅
  - **Branches**: 90% ✅
  - **Functions**: 97.22% ✅
  - **Lines**: 98.65% ✅

### Test Coverage Breakdown

- **Application Layer**: 100% (Use Cases, Store Slices)
  - AddToCartUseCase
  - GetCartUseCase
  - RemoveFromCartUseCase
  - UpdateCartItemQuantityUseCase
  - cartSlice Redux reducer
  
- **Shared Utils**: 98.66% (Card Validation)
  - Luhn algorithm validation
  - Card type detection
  - CVV validation
  - Expiration date validation
  - Card number formatting
  
- **Presentation Layer**: 95.65% (Components, Pages)
  - ProductPage component with API integration
  - Cart state management
  - User interactions and loading states

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

Output: `dist/` directory

### Key Features

- ✅ **Hexagonal Architecture**: Domain, Application, Infrastructure, Presentation layers
- ✅ **Responsive Design**: Mobile-first, iPhone SE (375px) minimum
- ✅ **State Persistence**: Redux-persist for localStorage
- ✅ **Dynamic Product Loading**: API integration with fallback
- ✅ **Comprehensive Testing**: 98.75% code coverage
- ✅ **Secure Payment Handling**: CVV never stored, card masking
- ✅ **Full Checkout Flow**: 5-step process from product to confirmation

### Deploy to Cloud

#### AWS S3 + CloudFront

```bash
# Build the app
npm run build

# Deploy to S3
aws s3 sync dist/ s3://your-bucket-name/

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

#### Vercel (Recommended)

```bash
npm install -g vercel
vercel --prod
```

#### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir dist
```

## 📊 Performance Metrics

- **Lighthouse Score**: 90+ (Target)
- **Bundle Size**: ~250KB (gzipped)
- **First Contentful Paint**: <2s
- **Time to Interactive**: <3.5s

## 📖 API Integration

### Backend Connection

The frontend connects to the TechHaven backend API:

```typescript
// Base URL configured via environment variables
VITE_TECH_HAVEN_API_URL=http://localhost:3000/api
```

### Product API

```typescript
GET /products              // Get all products
GET /products/{id}         // Get product by ID
```

**Response Format:**
```json
{
  "id": "1",
  "name": "Product Name",
  "price": 9999,           // in cents
  "stock": 50,
  "description": "Description",
  "imageUrl": "https://..."
}
```

### Transaction API

```typescript
POST /transactions              // Create transaction
GET /transactions/{id}          // Get transaction status
POST /transactions/{id}/process // Process payment
```

## 🔗 Wompi Integration

Payment processing through Wompi API:

- Sandbox environment for testing
- Secure token exchange
- Real-time payment status updates
- Never use production credentials in frontend

## ⚠️ Known Limitations

- Test cards only (no real transactions)
- API endpoints are placeholders (comments in code)
- Session-based state (clears on logout)

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear cache and node_modules
rm -rf node_modules dist .vite
npm install
npm run build
```

### Hot Module Replacement Issues

```bash
# Stop dev server and restart
npm run dev
```

### ESLint Errors

```bash
# Fix automatically
npm run lint -- --fix
```

## 📝 Code Style

- **TypeScript Strict Mode**: Enabled
- **ESLint**: React, React Hooks, TypeScript plugins
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Formatting**: 2-space indentation

## 📞 Support

For issues or questions:

1. Check the [TODO.md](TODO.md) for feature status
2. Review environment configuration
3. Check console for errors
4. Verify API connectivity

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- Bootstrap 5 for UI components
- Porto eCommerce Demo 22 for design inspiration
- React 19 concurrent features
- Redux Toolkit for state management

---

**Last Updated**: January 29, 2026
**Version**: 1.0.0
