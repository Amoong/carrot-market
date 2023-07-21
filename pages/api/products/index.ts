import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/client/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: { name, price, description },
    session: { user },
  } = req;

  if (req.method === "GET") {
    const products = await client.product.findMany({});
    res.json({
      ok: true,
      products,
    });
  }

  if (req.method === "POST") {
    const product = await client.product.create({
      data: {
        name,
        price: parseInt(price),
        description,
        image: "XX",
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

    res.json({
      ok: true,
      product,
    });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);