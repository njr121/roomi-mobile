export type Accommodation = {
  id: string;
  name: string;
  type: "hotel" | "pension" | "resort" | "motel";
  location: string;
  description: string;
  rating: number;
  images: string[];
  normalPrice: number;
  currentPrice: number;
  priceChangeRate: number;
};

export type Room = {
  id: string;
  name: string;
  type: string;
  price: number;
  maxGuests: number;
};

export type AccommodationDetail = Accommodation & {
  rooms: Room[];
};
