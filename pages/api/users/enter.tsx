import client from "@libs/client/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { phone, email } = req.body;

  if (!phone && !email) {
    return res.status(400).json({ ok: false });
  }

  const user = phone ? { phone } : { email };
  const payload = Math.floor(100000 + Math.random() * 900000).toString();

  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            name: "Anonymous",
            ...user,
          },
        },
      },
    },
  });

  res.json({ ok: true });
}

export default withHandler("POST", handler);
