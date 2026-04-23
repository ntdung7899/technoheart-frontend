# TechnoHeart Frontend — Project Reference

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.1.6 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Language | TypeScript 5 (strict mode) |
| ORM | Prisma 7 + PostgreSQL (Neon cloud) |
| Auth | Custom JWT via `jose` + `bcryptjs` |
| State | Zustand 5 |
| Payment | Stripe + SePay webhook |
| Images | ImageKit |
| Icons | Lucide React |
| Rich Text | react-quill-new |
| Date | date-fns |
| Utilities | clsx, tailwind-merge, xlsx |

## Project Structure

```
src/
├── app/
│   ├── (shop)/              # Public shop pages
│   │   ├── products/[id]
│   │   ├── cart/
│   │   ├── checkout/
│   │   │   ├── pay/
│   │   │   └── success/
│   │   ├── news/[id]
│   │   ├── contact/
│   │   ├── login/
│   │   └── signup/
│   ├── (account)/account/   # Auth-required user pages
│   │   ├── profile/
│   │   ├── orders/[id]
│   │   ├── addresses/
│   │   ├── wishlist/
│   │   ├── rewards/
│   │   ├── security/
│   │   └── affiliate/
│   │       ├── commissions/
│   │       ├── team/
│   │       └── withdrawals/
│   ├── admin/               # Admin panel
│   │   ├── products/new, [id]/edit
│   │   ├── orders/[id]
│   │   ├── users/
│   │   ├── categories/
│   │   ├── news/new, [id]/edit, categories/
│   │   ├── affiliate/[id], withdrawals/
│   │   ├── analytics/
│   │   └── contact/
│   └── api/                 # API routes (see below)
├── components/
│   ├── ui/                  # AddToCartButton, ProductCard, SearchModal, WishlistButton, ContactForm, ProductBuySection
│   ├── layout/              # Header, Footer, MobileMenu, CartIcon
│   ├── cart/                # CartClient, CartIcon
│   ├── account/             # AccountHeader, AccountSidebar, AddressCard, EmptyState, StatusBadge, SummaryCard
│   ├── admin/               # AnalyticsClient, OrdersClient, OrderStatusSelector, RichTextEditor
│   └── common/              # HistatsCounter
├── lib/
│   ├── prisma.ts            # Prisma client singleton
│   ├── auth-utils.ts        # JWT helpers
│   ├── affiliate-utils.ts   # Affiliate/commission logic
│   └── utils.ts             # General utilities
└── store/
    └── cart.ts              # Zustand cart store
```

## API Routes

### Auth
| Route | Methods |
|---|---|
| `/api/auth/login` | POST |
| `/api/auth/logout` | POST |
| `/api/auth/signup` | POST |
| `/api/auth/me` | GET |

### Products & Categories
| Route | Methods |
|---|---|
| `/api/products` | GET, POST |
| `/api/products/[id]` | GET, PUT, DELETE |
| `/api/products/search` | GET |
| `/api/categories` | GET, POST |
| `/api/categories/[id]` | GET, PUT, DELETE |

### Orders
| Route | Methods |
|---|---|
| `/api/orders` | GET, POST |
| `/api/orders/[id]` | GET, PUT |
| `/api/orders/check-status` | GET |

### Account (Auth required)
| Route | Methods |
|---|---|
| `/api/account/profile` | GET, PUT |
| `/api/account/password` | PUT |
| `/api/account/addresses` | GET, POST |
| `/api/account/orders` | GET |
| `/api/account/orders/[id]` | GET |
| `/api/account/wishlist` | GET, POST, DELETE |
| `/api/account/rewards` | GET |
| `/api/account/security` | GET |
| `/api/account/security/history` | GET |

### Affiliate
| Route | Methods |
|---|---|
| `/api/affiliate/register` | POST |
| `/api/affiliate/profile` | GET |
| `/api/affiliate/team` | GET |
| `/api/affiliate/commissions` | GET |
| `/api/affiliate/calculate` | POST |
| `/api/affiliate/withdraw` | POST |
| `/api/affiliate/withdrawals` | GET |
| `/api/affiliate/admin/commissions` | GET, PUT |
| `/api/affiliate/admin/withdrawals` | GET |
| `/api/affiliate/admin/withdrawals/[id]` | PUT |
| `/api/affiliate/admin/[id]` | GET, PUT |

### News
| Route | Methods |
|---|---|
| `/api/news` | GET, POST |
| `/api/news/[id]` | GET, PUT, DELETE |
| `/api/news-categories` | GET, POST |
| `/api/news-categories/[id]` | GET, PUT, DELETE |

### Other
| Route | Methods |
|---|---|
| `/api/contact` | GET, POST |
| `/api/contact/[id]` | GET, PUT |
| `/api/contact-info` | GET, PUT |
| `/api/analytics` | GET |
| `/api/analytics/export` | GET |
| `/api/webhooks/sepay` | POST |

## Database Models (Prisma)

### Core
- **User** — id, email, password, name, role (USER/ADMIN), avatar, phone, points
- **Product** — id, name, description, price, stock, images[], categoryId, warranty, shippingInfo, returnPolicy, origin
- **Category** — id, name, image
- **Order** — id, userId, total, status, paymentStatus, paymentMethod, transactionId, addressId, referralCode, shippingFee
- **OrderItem** — orderId, productId, quantity, price
- **Address** — street, city, state, zip, country, ward, name, phone, label, isDefault, coordinates
- **Review** — rating, comment, userId, productId
- **WishlistItem** — userId, productId (unique pair)
- **Voucher** — code, discount, minSpend, expiresAt, pointsCost
- **UserVoucher** — userId, voucherId, usedAt
- **LoginHistory** — userId, ip, userAgent

### Affiliate / MLM
- **AffiliateProfile** — userId, referralCode, rank (BA/VIP/VVIP/L1–L5), personalPV, teamPV, totalEarnings, paidEarnings
- **Referral** — referrerId, refereeId, level (unique pair)
- **Commission** — affiliateId, orderId, amount, rate, level, type (REFERRAL/ACHIEVEMENT), status (PENDING/APPROVED/PAID/CANCELLED)
- **WithdrawalRequest** — affiliateId, amount, bankName, accountNumber, accountName, status (PENDING/APPROVED/PAID/REJECTED)

### Content
- **News** — title, excerpt, content, category, image, featured, published, readTime, authorId, newsCategoryId
- **NewsCategory** — name, slug, description, color
- **ContactMessage** — name, email, subject, body, read
- **ContactInfo** — email, phone, address, social links, mapEmbed

### Enums
- `Role`: USER, ADMIN
- `OrderStatus`: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
- `PaymentStatus`: UNPAID, PAID, REFUNDED
- `AffiliateRank`: BA, VIP, VVIP, L1, L2, L3, L4, L5
- `CommissionType`: REFERRAL, ACHIEVEMENT
- `CommissionStatus`: PENDING, APPROVED, PAID, CANCELLED
- `WithdrawalStatus`: PENDING, APPROVED, PAID, REJECTED

## Configuration Files

### next.config.ts
- Images: unoptimized, remote patterns → `ik.imagekit.io`, `images.unsplash.com`, `technoheartg9.com`
- Rewrites: `/admin/dashboard` → `/admin`

### tsconfig.json
- Target: ES2017, strict mode, incremental
- Path alias: `@/*` → `./src/*`
- Module resolution: bundler

### eslint.config.mjs
- Extends `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`

### postcss.config.mjs
- Plugin: `@tailwindcss/postcss`

### prisma.config.ts
- Schema: `prisma/schema.prisma`
- Migrations: `prisma/migrations/`
- Seed: `npx tsx prisma/seed.ts`
- Database: `DATABASE_URL` env var (Neon PostgreSQL)

## Scripts

```bash
npm run dev       # Next.js dev server
npm run build     # prisma generate && next build
npm run start     # Production server
npm run lint      # ESLint
```

## Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `STRIPE_*` | Stripe payment keys |
| `IMAGEKIT_*` | ImageKit image CDN credentials |
| `JWT_SECRET` | JWT signing secret |
