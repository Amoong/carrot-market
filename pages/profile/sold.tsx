import type { NextPage } from "next";
import Item from "../../components/item";
import Layout from "../../components/layout";
import useSWR from "swr";
import { Sale } from "@prisma/client";
import { ProductWithFav } from "common/types";

interface SaleWithProduct extends Sale {
  product: ProductWithFav;
}
interface SalesResponse {
  ok: boolean;
  sales: SaleWithProduct[];
}

const Sold: NextPage = () => {
  const { data } = useSWR<SalesResponse>("/api/users/me/sales");

  return (
    <Layout title="판매내역" canGoBack>
      <div className="flex flex-col space-y-5 divide-y  pb-10">
        {data?.sales.map((sale) => (
          <Item
            id={sale.id}
            key={sale.id}
            title={sale.product.name}
            price={sale.product.price}
            comments={1}
            hearts={sale.product._count.favs}
          />
        ))}
      </div>
    </Layout>
  );
};

export default Sold;
