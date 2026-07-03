/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MenuOptionChoice {
  name: string;
  price: number;
}

export interface MenuOption {
  id: string;
  name: string;
  required: boolean;
  maxSelection: number;
  choices: MenuOptionChoice[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular: boolean;
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviewCount: number;
  cuisine: string;
  deliveryTime: number; // in minutes
  deliveryFee: number;
  minOrder: number;
  image: string;
  featured: boolean;
  address: string;
  phone: string;
  categories: string[];
}

export interface SelectedOptions {
  [optionName: string]: string[];
}

export interface CartItem {
  id: string; // unique cart item instance ID (menuItem.id + options hash)
  menuItem: MenuItem;
  quantity: number;
  selectedOptions?: SelectedOptions;
  notes?: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready_for_pickup' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
}

export interface DeliveryAddress {
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  notes?: string;
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  deliveryAddress: DeliveryAddress;
  paymentMethod: 'card' | 'cash';
  createdAt: string;
  statusHistory: OrderStatusHistory[];
  riderProgress: number; // 0 to 100 representing percentage from restaurant to destination
  eta: number; // dynamic remaining minutes
}
