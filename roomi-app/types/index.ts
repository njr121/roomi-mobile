export type Accommodation = {
  id: string;
  name: string;
  type: "hotel" | "pension" | "resort" | "motel";
  thumbnail: string;
  normalPrice: number;
  currentPrice: number;
  priceChangeRate: number;
};
