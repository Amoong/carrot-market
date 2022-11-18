import { withIronSessionApiRoute } from "iron-session/next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  console.log(req.session);
  const { token } = req.body;
  const exists = await client.token.findUnique({
    where: { payload: token },
  });

  console.log(exists);
  if (!exists) res.status(404).end();
  req.session.user = {
    id: exists?.userId,
  };
  await req.session.save();
  return res.status(200).end();
}

export default withIronSessionApiRoute(withHandler("POST", handler), {
  cookieName: "carrotsession",
  password:
    "12351235123521354322345234dsdjf;23094jd;lsdj;l34jl;has89y945120348fd",
});
