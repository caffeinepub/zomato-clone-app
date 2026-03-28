import type React from "react";
import { createContext, useContext, useState } from "react";
import {
  SAMPLE_CAMPAIGNS,
  SAMPLE_MENU_ITEMS,
  SAMPLE_NOTIFICATIONS,
  SAMPLE_ORDERS,
  SAMPLE_RESTAURANTS,
  SAMPLE_REVIEWS,
  SAMPLE_USERS,
} from "../data/sampleData";
import type {
  AdCampaign,
  AppNotification,
  CartItem,
  MenuItem as MI,
  Order,
  Restaurant,
  RestaurantOffer,
  Review,
  User,
} from "../types";

const SAMPLE_OFFERS: RestaurantOffer[] = [
  {
    id: "of1",
    restaurantId: "r1",
    title: "Flat ₹75 OFF above ₹149",
    type: "flat",
    value: 75,
    minOrder: 149,
    isActive: true,
    startDate: "2026-03-01",
    endDate: "2026-04-30",
  },
  {
    id: "of2",
    restaurantId: "r1",
    title: "20% OFF on weekends",
    type: "percent",
    value: 20,
    minOrder: 199,
    isActive: false,
    startDate: "2026-03-15",
    endDate: "2026-04-15",
  },
];

interface AppContextType {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  cart: CartItem[];
  addToCart: (item: MI, qty?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQty: (itemId: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  orders: Order[];
  placeOrder: (
    restaurantId: string,
    restaurantName: string,
    address: string,
    scheduledTime?: string,
  ) => Order | null;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  restaurants: Restaurant[];
  menuItems: MI[];
  updateMenuItem: (id: string, patch: Partial<MI>) => void;
  approveRestaurant: (id: string) => void;
  suspendRestaurant: (id: string) => void;
  campaigns: AdCampaign[];
  addCampaign: (c: Omit<AdCampaign, "id" | "impressions" | "clicks">) => void;
  selectedMenuItem: MI | null;
  setSelectedMenuItem: (item: MI | null) => void;
  // Favorites
  favorites: string[];
  favoriteDishes: string[];
  toggleFavorite: (restaurantId: string) => void;
  toggleFavoriteDish: (dishId: string) => void;
  // Notifications
  notifications: AppNotification[];
  markAllNotificationsRead: () => void;
  addNotification: (msg: string, icon: string) => void;
  // Dark mode
  darkMode: boolean;
  toggleDarkMode: () => void;
  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, "id" | "date">) => void;
  replyToReview: (reviewId: string, reply: string) => void;
  // Loyalty points
  loyaltyPoints: number;
  addLoyaltyPoints: (amount: number) => void;
  redeemLoyaltyPoints: () => void;
  // Referral
  redeemReferral: (code: string) => boolean;
  // Restaurant offers
  restaurantOffers: RestaurantOffer[];
  addOffer: (o: Omit<RestaurantOffer, "id">) => void;
  toggleOffer: (id: string) => void;
  // Restaurant online status
  restaurantOnline: boolean;
  toggleRestaurantOnline: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);
  const [restaurants, setRestaurants] =
    useState<Restaurant[]>(SAMPLE_RESTAURANTS);
  const [menuItems, setMenuItems] = useState<MI[]>(SAMPLE_MENU_ITEMS);
  const [campaigns, setCampaigns] = useState<AdCampaign[]>(SAMPLE_CAMPAIGNS);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MI | null>(null);
  const [favorites, setFavorites] = useState<string[]>(["r4", "r5"]);
  const [favoriteDishes, setFavoriteDishes] = useState<string[]>([
    "m10",
    "m19",
  ]);
  const [notifications, setNotifications] =
    useState<AppNotification[]>(SAMPLE_NOTIFICATIONS);
  const [darkMode, setDarkMode] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(SAMPLE_REVIEWS);
  const [loyaltyPoints, setLoyaltyPoints] = useState(100);
  const [restaurantOffers, setRestaurantOffers] =
    useState<RestaurantOffer[]>(SAMPLE_OFFERS);
  const [restaurantOnline, setRestaurantOnline] = useState(true);

  const login = (user: User) => setCurrentUser(user);
  const logout = () => {
    setCurrentUser(null);
    setCart([]);
  };

  const addToCart = (item: MI, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem.id === item.id);
      if (existing)
        return prev.map((c) =>
          c.menuItem.id === item.id ? { ...c, quantity: c.quantity + qty } : c,
        );
      return [...prev, { menuItem: item, quantity: qty }];
    });
  };

  const removeFromCart = (itemId: string) =>
    setCart((prev) => prev.filter((c) => c.menuItem.id !== itemId));

  const updateCartQty = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((c) => (c.menuItem.id === itemId ? { ...c, quantity: qty } : c)),
    );
  };

  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce(
    (sum, c) => sum + c.menuItem.price * c.quantity,
    0,
  );

  const addNotification = (msg: string, icon: string) => {
    const newNotif: AppNotification = {
      id: `n${Date.now()}`,
      message: msg,
      time: new Date().toISOString(),
      read: false,
      icon,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const placeOrder = (
    restaurantId: string,
    restaurantName: string,
    address: string,
    scheduledTime?: string,
  ): Order | null => {
    if (!currentUser || cart.length === 0) return null;
    const newOrder: Order = {
      id: `o${Date.now()}`,
      customerId: currentUser.id,
      restaurantId,
      restaurantName,
      items: cart.map((c) => ({
        menuItemId: c.menuItem.id,
        name: c.menuItem.name,
        price: c.menuItem.price,
        quantity: c.quantity,
      })),
      totalAmount: cartTotal + 40,
      status: "pending",
      deliveryAddress: address,
      createdAt: new Date().toISOString(),
      scheduledTime,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
    };
    setOrders((prev) => [newOrder, ...prev]);
    addLoyaltyPoints(Math.floor((cartTotal + 40) / 100) * 10);
    addNotification(
      `🛍️ Order placed at ${restaurantName}! Waiting for confirmation.`,
      "🛍️",
    );
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
    );
    const statusMessages: Partial<Record<Order["status"], string>> = {
      confirmed: "✅ Your order has been confirmed!",
      preparing: "👨‍🍳 Restaurant is preparing your order",
      ready: "🎉 Your order is ready for pickup",
      out_for_delivery: "🏍️ Your order is out for delivery!",
      delivered: "✅ Order delivered! Enjoy your meal!",
    };
    const msg = statusMessages[status];
    if (msg) addNotification(msg, msg.split(" ")[0]);
  };

  const approveRestaurant = (id: string) =>
    setRestaurants((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isApproved: true } : r)),
    );
  const suspendRestaurant = (id: string) =>
    setRestaurants((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: false } : r)),
    );

  const addCampaign = (
    c: Omit<AdCampaign, "id" | "impressions" | "clicks">,
  ) => {
    setCampaigns((prev) => [
      ...prev,
      { ...c, id: `c${Date.now()}`, impressions: 0, clicks: 0 },
    ]);
  };

  const updateMenuItem = (id: string, patch: Partial<MI>) => {
    setMenuItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    );
  };

  const toggleFavorite = (restaurantId: string) => {
    setFavorites((prev) =>
      prev.includes(restaurantId)
        ? prev.filter((id) => id !== restaurantId)
        : [...prev, restaurantId],
    );
  };

  const toggleFavoriteDish = (dishId: string) => {
    setFavoriteDishes((prev) =>
      prev.includes(dishId)
        ? prev.filter((id) => id !== dishId)
        : [...prev, dishId],
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const addReview = (review: Omit<Review, "id" | "date">) => {
    setReviews((prev) => [
      ...prev,
      { ...review, id: `rv${Date.now()}`, date: new Date().toISOString() },
    ]);
  };

  const replyToReview = (reviewId: string, reply: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              reply: { reviewId, reply, repliedAt: new Date().toISOString() },
            }
          : r,
      ),
    );
  };

  const addLoyaltyPoints = (pts: number) => {
    setLoyaltyPoints((prev) => prev + pts);
  };

  const redeemLoyaltyPoints = () => {
    setLoyaltyPoints((prev) => Math.max(0, prev - 100));
  };

  const redeemReferral = (code: string): boolean => {
    const match = SAMPLE_USERS.find(
      (u) => u.referralCode?.toUpperCase() === code.toUpperCase(),
    );
    if (match && match.id !== currentUser?.id) {
      addLoyaltyPoints(50);
      addNotification(
        "🎉 Referral code applied! +50 loyalty points earned!",
        "🎉",
      );
      return true;
    }
    return false;
  };

  const addOffer = (o: Omit<RestaurantOffer, "id">) => {
    setRestaurantOffers((prev) => [...prev, { ...o, id: `of${Date.now()}` }]);
  };

  const toggleOffer = (id: string) => {
    setRestaurantOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, isActive: !o.isActive } : o)),
    );
  };

  const toggleRestaurantOnline = () => setRestaurantOnline((prev) => !prev);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartTotal,
        orders,
        placeOrder,
        updateOrderStatus,
        restaurants,
        menuItems,
        updateMenuItem,
        approveRestaurant,
        suspendRestaurant,
        campaigns,
        addCampaign,
        selectedMenuItem,
        setSelectedMenuItem,
        favorites,
        favoriteDishes,
        toggleFavorite,
        toggleFavoriteDish,
        notifications,
        markAllNotificationsRead,
        addNotification,
        darkMode,
        toggleDarkMode,
        reviews,
        addReview,
        replyToReview,
        loyaltyPoints,
        addLoyaltyPoints,
        redeemLoyaltyPoints,
        redeemReferral,
        restaurantOffers,
        addOffer,
        toggleOffer,
        restaurantOnline,
        toggleRestaurantOnline,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
