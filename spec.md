# Zomato Clone App

## Current State
App exists with 6 role-based panels (Customer, Restaurant Owner, Delivery Partner, Sponsor, Admin, Super Admin). The login page shows role cards. Customer home shows generic green UI. Existing pages: CustomerHome, CartPage, OrdersPage, ProductDetail, ProfilePage, RestaurantDashboard, DeliveryDashboard, SponsorDashboard, AdminDashboard, SuperAdminDashboard.

## Requested Changes (Diff)

### Add
- Zomato-exact splash/login screen: black background, 'INDIA'S #1 FOOD DELIVERY APP', zomato logo in red brushstroke, food bag illustration, India flag + +91 phone field, Continue button (red/coral), Google + Email icons, terms text, remember login checkbox
- Enable notifications screen: white bg, bell illustration with % and chef hat, 'Enable Notifications' red button, 'Not now' outline button
- Location permission screen: dark overlay, 'Allow Zomato to access location' dialog with Precise/Approximate options
- Home screen exactly like Zomato: teal/dark green header with location ('Home' with address), GOLD badge, wallet icon, user avatar, search bar with mic icon, VEG MODE toggle, scrolling promo banner (cricket/deals), food category pills with food images (All, Pizza, Burger, Cake...), filter chips (Near & Fast, Under ₹150...), EXPLORE MORE section (Offers, Top 10, Food on train, Collections), IN THE SPOTLIGHT restaurant cards, Delivery/Dining bottom toggle, Blinkit button
- Restaurant listing page: search bar, category filter pills, restaurant cards with food photo carousel, rating badge (green), delivery time, distance, offer badge (Flat ₹75 OFF), Pure Veg badge, cart bar at bottom ('Royal Cafe & Res... View Menu | View Cart 1 item')
- Restaurant detail page: back arrow, search, 3-dot menu, Pure Veg badge (green leaf), restaurant name, rating (yellow badge), distance, locality, delivery time with 'Schedule for later' dropdown, 'No packaging charges', offer banner (Flat ₹75 OFF above ₹149), filter chips (Filters, Highly reordered, Spicy), menu sections collapsible, menu items with veg/non-veg dot, name, 'Highly reordered' progress bar, price, bookmark+share icons, ADD button (light green with +), quantity stepper (-1+), 'You will love pairing it with' horizontal scroll, 'Unlock Flat ₹75 OFF' banner at bottom, '1 item added | View cart' green bar
- Cart page: address warning banner (yellow), 'You saved ₹38', Gold membership upsell, cart items with qty stepper, 'Add more items', note/cutlery options, 'Complete your meal with' suggestions, coupon section, delivery fleet selector (Standard/Veg-only), delivery address with instructions, contact, total bill breakdown, 'PAY USING Paytm UPI' footer, 'Place Order' green button
- Modals: Schedule delivery time (date tabs, time slots, Confirm green button), Select address (Add Address, saved addresses with Home icon), Filters & Sorting (Sort by price, Top picks, Dietary preference), Coupon popup (% badge, 'Save ₹50 GETOFF50ON99', APPLY green button)
- Search page: search bar active with mic, category scrollable pills (Pizza underlined in green), free delivery banner, Recommended For You grid (2x3 restaurant cards with offer overlays), ALL RESTAURANTS section

### Modify
- Login page: completely replace with Zomato-exact phone login UI (keep role selection as demo mode toggle or secondary screen)
- CustomerHome: completely replace with Zomato home UI
- CartPage: completely replace with Zomato cart UI
- ProductDetail: replace with restaurant menu page
- Data: update sample data to match Zomato-style restaurants (Royal Cafe, Burping Bee, Tasty Bites, SVS Food, Foodio, etc.) with realistic Indian food menu items and prices in ₹

### Remove
- Generic green role-card login screen (replace with Zomato-style phone login)

## Implementation Plan
1. Update sampleData.ts with Zomato-style restaurants and menu items (Indian food, ₹ prices)
2. Rebuild LoginPage.tsx to match Zomato splash+login (phone input, role select hidden behind 'demo' link)
3. Add NotificationsPrompt screen and onboarding flow
4. Rebuild CustomerHome.tsx with full Zomato home layout
5. Add RestaurantList page (search results with filter chips, restaurant cards)
6. Rebuild RestaurantDetail (was ProductDetail) with full Zomato menu page
7. Rebuild CartPage with full Zomato cart + modals
8. Add SearchPage with Zomato search UI
9. Wire up all navigation (splash -> login -> home -> restaurant -> cart)
10. Keep other role dashboards (Restaurant Owner, Delivery, etc.) accessible via Profile > Switch Role
