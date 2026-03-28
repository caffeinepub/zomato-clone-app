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
  referralCode?: string;
  referralCount?: number;
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

export type DietaryType = "veg" | "nonveg" | "vegan";

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
  dietaryType?: DietaryType;
  isBestSeller?: boolean;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "rejected";

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
  scheduledTime?: string;
  customerName?: string;
  customerPhone?: string;
  prepTime?: number;
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

export interface ReviewReply {
  reviewId: string;
  reply: string;
  repliedAt: string;
}

export interface Review {
  id: string;
  orderId: string;
  restaurantId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  reply?: ReviewReply;
}

export interface AppNotification {
  id: string;
  message: string;
  time: string;
  read: boolean;
  icon?: string;
}

export interface RestaurantOffer {
  id: string;
  restaurantId: string;
  title: string;
  type: "percent" | "flat" | "free_delivery";
  value: number;
  minOrder: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
}
