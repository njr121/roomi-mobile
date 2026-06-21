import env from "./env";
import { Accommodation, AccommodationDetail, Booking, BookingWithDetails, User, Wishlist } from "@/types";
import { useAuthStore } from "@/store/authStore";

function authHeaders(): HeadersInit {
  const token = useAuthStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getAccommodations(): Promise<Accommodation[]> {
  const response = await fetch(`${env.API_URL}/api/accommodations`, {
    headers: authHeaders(),
  });
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error.message);
  }

  return json.data.data;
}

export async function getAccommodationDetail(id: string): Promise<AccommodationDetail> {
  const response = await fetch(`${env.API_URL}/api/accommodations/${id}`, {
    headers: authHeaders(),
  });
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error.message);
  }

  return json.data;
}

export async function createBooking(params: {
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}): Promise<Booking> {
  const response = await fetch(`${env.API_URL}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(params),
  });
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error.message);
  }

  return json.data;
}

export async function getBookings(): Promise<BookingWithDetails[]> {
  const response = await fetch(`${env.API_URL}/api/bookings`, {
    headers: authHeaders(),
  });
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error.message);
  }

  return json.data;
}

export async function cancelBooking(id: string): Promise<Booking> {
  const response = await fetch(`${env.API_URL}/api/bookings/${id}/cancel`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error.message);
  }

  return json.data;
}

export async function getWishlists(): Promise<Wishlist[]> {
  const response = await fetch(`${env.API_URL}/api/wishlists`, {
    headers: authHeaders(),
  });
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error.message);
  }

  return json.data;
}

export async function addWishlist(accommodationId: string): Promise<Wishlist> {
  const response = await fetch(`${env.API_URL}/api/wishlists`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ accommodationId }),
  });
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error.message);
  }

  return json.data;
}

export async function removeWishlist(accommodationId: string): Promise<void> {
  const response = await fetch(`${env.API_URL}/api/wishlists/${accommodationId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error.message);
  }
}

export async function loginWithGoogle(idToken: string): Promise<{ token: string; user: User }> {
  const response = await fetch(`${env.API_URL}/api/auth/mobile/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error.message);
  }

  return json.data;
}
