import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/client/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
    query: { id },
  } = req;

  const stream = await client.stream.findUnique({
    where: {
      id: Number(id?.toString()),
    },
    include: {
      messages: true,
    },
  });

  const isOwner = user?.id === stream?.userId;
  if (stream && !isOwner) {
    stream.cloudflareKey = "";
    stream.cloudflareUrl = "";
  }

  res.json({
    ok: true,
    stream,
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
