import { withIronSessionApiRoute } from "iron-session/next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/client/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { token } = req.body;

  const exists = await client.token.findUnique({
    where: {
      payload: token,
    },
  });

  if (!exists) {
    res.status(404).end();
  }

  console.log(exists);

  req.session.user = {
    id: exists?.userId,
  };

  await req.session.save();

  res.status(200).end();
}

export default withIronSessionApiRoute(withHandler("POST", handler), {
  cookieName: "carrotsession",
  password: "01234523452368943709837403325784323494",
});
