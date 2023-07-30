import type { NextPage } from "next";
import Item from "../../components/item";
import Layout from "../../components/layout";
import { Purchase } from "@prisma/client";
import { ProductWithFav } from "common/types";
import useSWR from "swr";

interface PurchaseWithProduct extends Purchase {
  product: ProductWithFav;
}
interface SalesResponse {
  ok: boolean;
  purchases: PurchaseWithProduct[];
}

const Bought: NextPage = () => {
  const { data } = useSWR<SalesResponse>("/api/users/me/purchases");

  return (
    <Layout title="구매내역" canGoBack>
      <div className="flex flex-col space-y-5 divide-y  pb-10">
        {data?.purchases.map((purchase) => (
          <Item
            id={purchase.id}
            key={purchase.id}
            title={purchase.product.name}
            price={purchase.product.price}
            comments={1}
            hearts={purchase.product._count.favs}
          />
        ))}
      </div>
    </Layout>
  );
};

export default Bought;
