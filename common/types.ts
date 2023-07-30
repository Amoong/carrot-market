import { Product } from "@prisma/client";

export interface ProductWithFav extends Product {
  _count: {
    favs: number;
  };
}
