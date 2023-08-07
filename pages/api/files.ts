import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUD_FLARE_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUD_FLARE_IMAGE_TOKEN}`,
      },
    }
  );
  const resJson = await response.json();

  res.json({
    ok: true,
    uploadURL: resJson.result.uploadURL,
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
