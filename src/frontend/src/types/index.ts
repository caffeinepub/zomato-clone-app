export type Role =
  | "customer"
  | "restaurant_owner"
  | "delivery_partner"
  | "sponsor"
  | "admin"
  | "super_admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone: string;
  address: string;
}

export interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  cuisineType: string;
  address: string;
  rating: number;
  deliveryTime: string;
  minOrder: number;
  isApproved: boolean;
  isActive: boolean;
  imageColor: string;
  // Extended Zomato fields
  distance?: string;
  offer?: string;
  isPureVeg?: boolean;
  imageEmoji?: string;
  locality?: string;
  heroImage?: string;
}

export interface NutritionInfo {
  carbs: number;
  calories: number;
  protein: number;
  fat: number;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  price: number;
  category: string;
  description: string;
  isAvailable: boolean;
  nutrition: NutritionInfo;
  prepTime: number;
  cookingTime: number;
  rating: number;
  imageColor: string;
  isVeg?: boolean;
  isHighlyReordered?: boolean;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  restaurantId: string;
  restaurantName: string;
  deliveryPartnerId?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  deliveryAddress: string;
  createdAt: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface AdCampaign {
  id: string;
  sponsorId: string;
  title: string;
  targetCategory: string;
  budget: number;
  impressions: number;
  clicks: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
}
