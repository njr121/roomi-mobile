import env from "./env";
import { Accommodation, AccommodationDetail } from "@/types";

export async function getAccommodations(): Promise<Accommodation[]> {
  const response = await fetch(`${env.API_URL}/api/accommodations`);
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error.message);
  }

  return json.data.data;
}

export async function getAccommodationDetail(id: string): Promise<AccommodationDetail> {
  const response = await fetch(`${env.API_URL}/api/accommodations/${id}`);
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error.message);
  }

  return json.data;
}
