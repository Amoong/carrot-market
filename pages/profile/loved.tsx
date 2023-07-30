import type { NextPage } from "next";
import Item from "../../components/item";
import Layout from "../../components/layout";
import { Fav } from "@prisma/client";
import useSWR from "swr";
import { ProductWithFav } from "common/types";

interface FavWithProduct extends Fav {
  product: ProductWithFav;
}
interface SalesResponse {
  ok: boolean;
  favs: FavWithProduct[];
}

const Loved: NextPage = () => {
  const { data } = useSWR<SalesResponse>("/api/users/me/favs");

  return (
    <Layout title="관심목록" canGoBack>
      <div className="flex flex-col space-y-5 divide-y  pb-10">
        {data?.favs.map((fav) => (
          <Item
            id={fav.id}
            key={fav.id}
            title={fav.product.name}
            price={fav.product.price}
            comments={1}
            hearts={fav.product._count.favs}
          />
        ))}
      </div>
    </Layout>
  );
};

export default Loved;
