export type ApiResponse<T> = { success: true; data: T } | { success: false; error: ApiError };
export type ApiError = { code: string; message: string };
export type AccommodationType = "hotel" | "motel" | "pension" | "resort";
export type BookingStatus = "confirmed" | "cancelled";
export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
