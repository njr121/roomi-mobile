export type User = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
};

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

export type Booking = {
  id: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: string;
  createdAt: string;
};

export type BookingWithDetails = Booking & {
  room: Room & {
    accommodation: Accommodation;
  };
};

export type Wishlist = {
  id: string;
  accommodationId: string;
  createdAt: string;
  accommodation: Accommodation;
};

export type AccommodationFilters = {
  page?: number;
  type?: Accommodation["type"];
  sort?: "priceChangeRate" | "currentPrice" | "rating";
  region?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
};

export type PaginatedAccommodations = {
  data: Accommodation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
