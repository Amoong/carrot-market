import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/client/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "POST") {
    const {
      body: { name, price, description },
      session: { user },
    } = req;

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUD_FLARE_ACCOUNT_ID}/stream/live_inputs`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CLOUD_FLARE_STREAM_TOKEN}`,
        },
        body: JSON.stringify({
          meta: { name },
          recording: { mode: "automatic" },
        }),
      }
    );

    const {
      result: {
        uid,
        rtmps: { url, streamKey },
      },
    } = await response.json();

    const stream = await client.stream.create({
      data: {
        name,
        price,
        description,
        cloudflareId: uid,
        cloudflareUrl: url,
        cloudflareKey: streamKey,
        user: {
          connect: {
            id: Number(user?.id),
          },
        },
      },
    });

    res.json({
      ok: true,
      stream,
    });
  } else if (req.method === "GET") {
    const streams = await client.stream.findMany({
      take: 10,
    });

    res.json({
      ok: true,
      streams,
    });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
