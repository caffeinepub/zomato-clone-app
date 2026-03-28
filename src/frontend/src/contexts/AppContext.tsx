import type React from "react";
import { createContext, useContext, useState } from "react";
import {
  SAMPLE_CAMPAIGNS,
  SAMPLE_MENU_ITEMS,
  SAMPLE_ORDERS,
  SAMPLE_RESTAURANTS,
} from "../data/sampleData";
import type {
  AdCampaign,
  CartItem,
  MenuItem as MI,
  Order,
  Restaurant,
  User,
} from "../types";

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
  ) => Order | null;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  restaurants: Restaurant[];
  menuItems: MI[];
  approveRestaurant: (id: string) => void;
  suspendRestaurant: (id: string) => void;
  campaigns: AdCampaign[];
  addCampaign: (c: Omit<AdCampaign, "id" | "impressions" | "clicks">) => void;
  selectedMenuItem: MI | null;
  setSelectedMenuItem: (item: MI | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);
  const [restaurants, setRestaurants] =
    useState<Restaurant[]>(SAMPLE_RESTAURANTS);
  const [menuItems] = useState<MI[]>(SAMPLE_MENU_ITEMS);
  const [campaigns, setCampaigns] = useState<AdCampaign[]>(SAMPLE_CAMPAIGNS);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MI | null>(null);

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

  const placeOrder = (
    restaurantId: string,
    restaurantName: string,
    address: string,
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
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
    );
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
        approveRestaurant,
        suspendRestaurant,
        campaigns,
        addCampaign,
        selectedMenuItem,
        setSelectedMenuItem,
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
