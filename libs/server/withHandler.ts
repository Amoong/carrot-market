import { NextApiRequest, NextApiResponse } from "next";

export default function withHandler(
  method: "POST" | "GET" | "DELETE",
  fn: (req: NextApiRequest, res: NextApiResponse) => void
) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    if (method !== req.method) {
      return res.status(405).setHeader("Allow", `[${method}]`).end();
    }

    try {
      await fn(req, res);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error });
    }
  };
}
