# FoodRush - Restaurant Dashboard + Referral System + Push Notifications

## Current State
The app has 6 role-based panels. The restaurant dashboard has 3 tabs: Dashboard (stats + recent orders), Menu (add/edit/delete items), Orders (list with status actions). Notifications panel exists (bell icon, unread badge, mark all read). In-app chat, dark mode, loyalty points, live map tracking, favorites, dietary filters, promo codes, order scheduling, reviews, and loyalty system are all live.

## Requested Changes (Diff)

### Add
- **Referral/Invite System** (Customer ProfilePage): unique referral code per user, copy-to-clipboard, share link, referral count tracker, bonus loyalty points when referral is used, a "Refer & Earn" section in profile showing code + progress + rewards
- **In-App Push Notifications** (toast-style popup): when order status changes (confirmed, preparing, ready, out_for_delivery, delivered) a toast pops up at top of screen with sound emoji; new referral notifications when someone uses your code
- **Notification bell enhancements**: add referral and order-status notification types to SAMPLE_NOTIFICATIONS
- **Restaurant Dashboard - Analytics tab**: daily revenue bar chart (last 7 days), top 5 selling items, order status breakdown pie chart, hourly order distribution, total customers count, average order value
- **Restaurant Dashboard - Reviews tab**: list customer reviews for this restaurant with star ratings, date, customer name, and reply button (owner can post a reply)
- **Restaurant Dashboard - Settings tab**: edit restaurant profile (name, cuisine, address, opening hours Mon-Sun toggle + time range, min order, delivery time estimate, accept orders toggle - online/offline status)
- **Restaurant Dashboard - Promotions tab**: create/manage offers (% discount, flat discount, free delivery), set validity dates, toggle active/inactive
- **Restaurant Dashboard - Orders tab enhancements**: show customer name + phone, estimated prep time input, accept/reject new orders (pending → confirmed or rejected), print order summary button
- **Restaurant Dashboard - Menu tab enhancements**: toggle item availability inline, mark items as "Best Seller" badge, set item as veg/nonveg toggle, bulk category filter

### Modify
- RestaurantDashboard.tsx: expand from 3 tabs to 7 tabs (Dashboard, Orders, Menu, Analytics, Reviews, Settings, Promotions)
- AppContext: add referral code per user, referralCount, redeemReferral function, addNotification function for push toasts
- ProfilePage: add "Refer & Earn" card with referral code, share button, referral count, and earned rewards
- App.tsx: add global toast notification overlay that listens to recent notifications and shows popups

### Remove
- Nothing removed

## Implementation Plan
1. Update types.ts to add referralCode to User, add ReferralNotification type
2. Update AppContext: add referralCode generation, referralCount state, redeemReferral(), addNotification() that pushes to notifications array and triggers toast
3. Update sampleData: add referral-related notifications
4. Update ProfilePage: add "Refer & Earn" section with referral code display, copy button, share link, referral count, reward info
5. Add ToastNotification component: fixed top overlay showing latest notification with auto-dismiss after 3s
6. Update App.tsx: render ToastNotification, watch notifications for new unread items
7. Rewrite RestaurantDashboard.tsx: 7-tab layout - Dashboard, Orders (enhanced with accept/reject + customer info), Menu (with availability toggle + best seller + veg toggle), Analytics (charts using recharts/CSS), Reviews (list + reply), Settings (profile edit form), Promotions (offer CRUD)
8. Validate and build
