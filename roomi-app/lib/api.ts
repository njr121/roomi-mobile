import env from "./env";
import { Accommodation } from "@/types";

export async function getAccommodations(): Promise<Accommodation[]> {
  const response = await fetch(`${env.API_URL}/api/accommodations`);
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error.message);
  }

  return json.data.data;
}
