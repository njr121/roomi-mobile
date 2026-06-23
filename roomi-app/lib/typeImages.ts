const TYPE_IMAGES = {
  hotel: [
    require("@/assets/images/hotel-1.jpg"),
    require("@/assets/images/hotel-2.jpg"),
    require("@/assets/images/hotel-3.jpg"),
    require("@/assets/images/hotel-4.jpg"),
  ],
  motel: [
    require("@/assets/images/motel-1.jpg"),
    require("@/assets/images/motel-2.jpg"),
    require("@/assets/images/motel-3.jpg"),
    require("@/assets/images/motel-4.jpg"),
  ],
  pension: [
    require("@/assets/images/pension-2.jpg"),
    require("@/assets/images/pension-3.jpg"),
    require("@/assets/images/pension-4.jpg"),
  ],
  resort: [
    require("@/assets/images/resort-1.jpg"),
    require("@/assets/images/resort-2.jpg"),
    require("@/assets/images/resort-3.jpg"),
    require("@/assets/images/resort-4.jpg"),
  ],
};

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getTypeImage(type: string, id?: string) {
  const images = TYPE_IMAGES[type as keyof typeof TYPE_IMAGES];
  if (!images || images.length === 0) return undefined;
  if (!id) return images[0];
  return images[hashString(id) % images.length];
}
