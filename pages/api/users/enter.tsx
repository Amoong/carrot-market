import { NextApiRequest, NextApiResponse } from "next";
import withHandler from "../../../libs/server/withHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).send({ ok: true });
}

export default withHandler("POST", handler);
