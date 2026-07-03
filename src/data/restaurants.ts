/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Restaurant, MenuItem } from '../types';

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'r1',
    name: 'Burger & Co. Craft House',
    description: 'Juicy smash burgers, hand-cut fries, and thick artisanal milkshakes made with premium local ingredients.',
    rating: 4.8,
    reviewCount: 412,
    cuisine: 'Burgers • American',
    deliveryTime: 25,
    deliveryFee: 1.99,
    minOrder: 10.0,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    featured: true,
    address: '425 Pine St, San Francisco, CA 94104',
    phone: '+1 (415) 555-0143',
    categories: ['Burgers', 'Sides', 'Drinks']
  },
  {
    id: 'r2',
    name: 'Bella Italia Ristorante',
    description: 'Authentic stone-baked woodfired pizzas, fresh handmade pasta, and decadent traditional Italian desserts.',
    rating: 4.7,
    reviewCount: 328,
    cuisine: 'Pizza • Italian',
    deliveryTime: 35,
    deliveryFee: 2.99,
    minOrder: 12.0,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    featured: true,
    address: '812 Columbus Ave, San Francisco, CA 94133',
    phone: '+1 (415) 555-0189',
    categories: ['Pizzas', 'Pasta', 'Appetizers', 'Dessert']
  },
  {
    id: 'r3',
    name: 'Sakura Sushi & Zen',
    description: 'Sustainably sourced premium sashimi, innovative signature rolls, and warm classic Japanese comfort food.',
    rating: 4.9,
    reviewCount: 520,
    cuisine: 'Sushi • Asian',
    deliveryTime: 30,
    deliveryFee: 3.49,
    minOrder: 15.0,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    featured: false,
    address: '1540 Fillmore St, San Francisco, CA 94115',
    phone: '+1 (415) 555-0211',
    categories: ['Signature Rolls', 'Nigiri & Sashimi', 'Warm Starters']
  },
  {
    id: 'r4',
    name: 'The Green Leaf Kitchen',
    description: 'Vibrant organic salad bowls, high-protein grain bowls, and cold-pressed botanical juices.',
    rating: 4.6,
    reviewCount: 185,
    cuisine: 'Healthy • Salads • Vegan',
    deliveryTime: 20,
    deliveryFee: 1.49,
    minOrder: 8.0,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    featured: false,
    address: '302 Divisadero St, San Francisco, CA 94117',
    phone: '+1 (415) 555-0254',
    categories: ['Bowls', 'Salads', 'Fresh Juices']
  },
  {
    id: 'r5',
    name: 'Sweet Treats & Baker',
    description: 'Indulgent gourmet pastries, freshly frosted celebration cupcakes, and masterfully roasted coffee.',
    rating: 4.8,
    reviewCount: 142,
    cuisine: 'Desserts • Bakery',
    deliveryTime: 15,
    deliveryFee: 0.99,
    minOrder: 6.0,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    featured: false,
    address: '584 Valencia St, San Francisco, CA 94110',
    phone: '+1 (415) 555-0299',
    categories: ['Cakes & Pastries', 'Cinnamon Rolls', 'Coffee']
  }
];

export const MENU_ITEMS: Record<string, MenuItem[]> = {
  r1: [
    {
      id: 'm1_1',
      name: 'Double Smash Cheeseburger',
      description: 'Two grass-fed smashed beef patties, double melted cheddar, secret house sauce, pickles, and crispy butter-toasted brioche.',
      price: 13.99,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80',
      category: 'Burgers',
      popular: true
    },
    {
      id: 'm1_2',
      name: 'Smoky Bacon Avocado Burger',
      description: 'Smashed patty, hardwood smoked bacon, fresh avocado, pepper jack, grilled onions, and smokey BBQ mayo.',
      price: 14.99,
      image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=300&q=80',
      category: 'Burgers',
      popular: true
    },
    {
      id: 'm1_3',
      name: 'Crispy Southern Hot Chicken',
      description: 'Buttermilk fried chicken breast in hot oil rub, crunchy vinegar slaw, pickles, and dynamic herb aioli.',
      price: 12.49,
      image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=300&q=80',
      category: 'Burgers',
      popular: false
    },
    {
      id: 'm1_4',
      name: 'Sweet Potato Waffle Fries',
      description: 'Perfectly crisped sweet potato fries tossed in light sea salt and warm cinnamon sugar, served with maple dip.',
      price: 5.49,
      image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=300&q=80',
      category: 'Sides',
      popular: true,
      vegetarian: true,
      vegan: true
    },
    {
      id: 'm1_5',
      name: 'Craft Beer-Battered Onion Rings',
      description: 'Thick-cut sweet onions double-dipped in IPA batter, fried golden-brown, with buttermilk ranch sauce.',
      price: 4.99,
      image: 'https://images.unsplash.com/photo-1639024471283-2bc7b3c6a267?auto=format&fit=crop&w=300&q=80',
      category: 'Sides',
      popular: false,
      vegetarian: true
    },
    {
      id: 'm1_6',
      name: 'Decadent Chocolate Shake',
      description: 'Thick, creamy milkshake made with organic vanilla bean ice cream, Belgian dark cocoa, topped with whipped cream.',
      price: 6.49,
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=300&q=80',
      category: 'Drinks',
      popular: false,
      vegetarian: true
    }
  ],
  r2: [
    {
      id: 'm2_1',
      name: 'Margherita DOC Pizza',
      description: 'Classic tomato base, fresh buffalo mozzarella, fragrant wild basil leaves, and a drizzle of premium extra virgin olive oil.',
      price: 14.99,
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=300&q=80',
      category: 'Pizzas',
      popular: true,
      vegetarian: true
    },
    {
      id: 'm2_2',
      name: 'Spicy Diavola Pizza',
      description: 'Stone-baked pizza topped with spicy Calabrian salami, smoked provolone, fresh chili oil, and tomato sauce.',
      price: 16.99,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80',
      category: 'Pizzas',
      popular: true
    },
    {
      id: 'm2_3',
      name: 'Handmade Truffle Gnocchi',
      description: 'Soft potato gnocchi tossed in a rich, buttery white truffle cream sauce with wild porcini mushrooms.',
      price: 18.49,
      image: 'https://images.unsplash.com/photo-1621996346565-e3bb627aa290?auto=format&fit=crop&w=300&q=80',
      category: 'Pasta',
      popular: true,
      vegetarian: true
    },
    {
      id: 'm2_4',
      name: 'Garlic Butter Focaccia',
      description: 'Freshly baked rosemary focaccia loaded with dynamic garlic confit butter, parmigiano, and parsley.',
      price: 6.99,
      image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=300&q=80',
      category: 'Appetizers',
      popular: false,
      vegetarian: true
    },
    {
      id: 'm2_5',
      name: 'Chef Traditional Tiramisu',
      description: 'Espresso-soaked ladyfingers layered with smooth, velvety mascarpone cream and dusted with raw cocoa powder.',
      price: 7.99,
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=300&q=80',
      category: 'Dessert',
      popular: true,
      vegetarian: true
    }
  ],
  r3: [
    {
      id: 'm3_1',
      name: 'Signature Rainbow Roll',
      description: 'Snow crab and avocado filling inside, topped with a colorful array of fresh salmon, ahi tuna, yellowtail, and thin avocado.',
      price: 17.99,
      image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=300&q=80',
      category: 'Signature Rolls',
      popular: true
    },
    {
      id: 'm3_2',
      name: 'Spicy Volcano Tuna Roll',
      description: 'Spicy minced tuna and cucumber, topped with seared spicy crab salad, crispy tempura flakes, and spicy unagi glaze.',
      price: 16.49,
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=300&q=80',
      category: 'Signature Rolls',
      popular: true
    },
    {
      id: 'm3_3',
      name: 'Salmon & Maguro Nigiri Set',
      description: 'Three premium slices of Atlantic salmon nigiri and three bluefin tuna nigiri, brushed with sweet house shoyu.',
      price: 19.99,
      image: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?auto=format&fit=crop&w=300&q=80',
      category: 'Nigiri & Sashimi',
      popular: false
    },
    {
      id: 'm3_4',
      name: 'Crispy Pork Gyoza',
      description: 'Pan-fried Japanese pork dumplings served with a citrusy garlic dipping sauce (5 pieces).',
      price: 7.49,
      image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=300&q=80',
      category: 'Warm Starters',
      popular: true
    },
    {
      id: 'm3_5',
      name: 'Shoyu Ramen Bowl',
      description: 'Hand-pulled wheat noodles, tender slow-cooked pork belly chashu, soft soy egg, bamboo shoots, in rich soy-chicken broth.',
      price: 15.99,
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=300&q=80',
      category: 'Warm Starters',
      popular: true
    }
  ],
  r4: [
    {
      id: 'm4_1',
      name: 'Vibrant Harvest Grain Bowl',
      description: 'Warm quinoa base, roasted sweet potato cubes, crisp kale, shredded apples, goat cheese, glazed pecans, with apple cider vinaigrette.',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80',
      category: 'Bowls',
      popular: true,
      vegetarian: true,
      glutenFree: true
    },
    {
      id: 'm4_2',
      name: 'Dynamic Avocado Sesame Salad',
      description: 'Butter lettuce, whole sliced avocado, English cucumber, edamame, toasted sesame seeds, with custom ginger soy dressing.',
      price: 11.49,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80',
      category: 'Salads',
      popular: true,
      vegetarian: true,
      vegan: true,
      glutenFree: true
    },
    {
      id: 'm4_3',
      name: 'Artisanal Sourdough Avocado Toast',
      description: 'Toasted local sourdough, thick avocado mash, organic cherry tomato confit, red pepper flakes, microgreens, and lemon zest.',
      price: 9.99,
      image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=300&q=80',
      category: 'Bowls',
      popular: false,
      vegetarian: true,
      vegan: true
    },
    {
      id: 'm4_4',
      name: 'Ginger Turmeric Wellness Elixir',
      description: 'Cold-pressed fresh organic ginger, turmeric root, red apple, lemon juice, and a pinch of black pepper.',
      price: 5.99,
      image: 'https://images.unsplash.com/photo-1610970881699-44a5587caaec?auto=format&fit=crop&w=300&q=80',
      category: 'Fresh Juices',
      popular: false,
      vegetarian: true,
      vegan: true,
      glutenFree: true
    }
  ],
  r5: [
    {
      id: 'm5_1',
      name: 'Chocolate Fudge Ganache Cake',
      description: 'Moist triple-chocolate cake layered with rich dark chocolate fudge frosting and finished with organic cacao nibs.',
      price: 6.49,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80',
      category: 'Cakes & Pastries',
      popular: true,
      vegetarian: true
    },
    {
      id: 'm5_2',
      name: 'Warm Jumbo Cinnamon Roll',
      description: 'Freshly baked soft-yeast pastry swirled with rich brown sugar cinnamon butter, topped with thick cream cheese icing.',
      price: 5.49,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80',
      category: 'Cinnamon Rolls',
      popular: true,
      vegetarian: true
    },
    {
      id: 'm5_3',
      name: 'Classic Red Velvet Cupcake',
      description: 'Velvety cocoa-infused red velvet cake base topped with a smooth dome of premium vanilla bean frosting.',
      price: 3.99,
      image: 'https://images.unsplash.com/photo-1614707267537-b85acf00c4b8?auto=format&fit=crop&w=300&q=80',
      category: 'Cakes & Pastries',
      popular: false,
      vegetarian: true
    },
    {
      id: 'm5_4',
      name: 'Iced Caramel Cloud Macchiato',
      description: 'Double espresso shots poured over iced milk and sweet vanilla syrup, finished with a dense milk foam layer and buttery caramel drizzle.',
      price: 4.99,
      image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=300&q=80',
      category: 'Coffee',
      popular: true,
      vegetarian: true
    }
  ]
};
