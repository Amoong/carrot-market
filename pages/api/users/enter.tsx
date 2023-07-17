import withHandler from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).send({ ok: true });
}

export default withHandler("POST", handler);
