/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, Clock, ShoppingBag } from 'lucide-react';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
  key?: string;
}

export default function RestaurantCard({ restaurant, onClick }: RestaurantCardProps) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-md hover:border-orange-100 transition-all duration-300 flex flex-col h-full"
    >
      {/* Cover Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          referrerPolicy="no-referrer"
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        {restaurant.featured && (
          <div className="absolute top-4 left-4 bg-orange-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            Featured
          </div>
        )}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg shadow-xs text-xs font-bold text-slate-800 flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{restaurant.rating}</span>
          <span className="text-slate-400 font-normal">({restaurant.reviewCount})</span>
        </div>
      </div>

      {/* Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
            {restaurant.cuisine.split('•')[0].trim()}
          </span>
          <h3 className="text-lg font-bold text-slate-800 mt-2 group-hover:text-orange-600 transition-colors line-clamp-1">
            {restaurant.name}
          </h3>
          <p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {restaurant.description}
          </p>
        </div>

        {/* Info row */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{restaurant.deliveryTime} mins</span>
          </div>

          <div className="flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-slate-400" />
            <span>
              {restaurant.deliveryFee === 0 ? 'Free' : `$${restaurant.deliveryFee.toFixed(2)}`} delivery
            </span>
          </div>

          <div className="text-slate-400 font-normal">
            Min. ${restaurant.minOrder.toFixed(0)}
          </div>
        </div>
      </div>
    </div>
  );
}
