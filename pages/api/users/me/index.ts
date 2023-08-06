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
      body: { email, phone, name, avatarId },
      session: { user },
    } = req;

    const currentUser = await client.user.findUnique({
      where: {
        id: user?.id,
      },
    });

    if (email && currentUser?.email !== email) {
      const isExist = Boolean(
        await client.user.findUnique({
          where: {
            email,
          },
        })
      );

      if (isExist) {
        return res.json({
          ok: false,
          error: "Email already taken",
        });
      }

      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          email,
        },
      });
    }

    if (phone && currentUser?.phone !== phone) {
      const isExist = Boolean(
        await client.user.findUnique({
          where: {
            phone,
          },
        })
      );

      if (isExist) {
        return res.json({
          ok: false,
          error: "Phone already in use",
        });
      }

      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          phone,
        },
      });
    }

    if (avatarId) {
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          avatar: avatarId,
        },
      });
    }

    if (name && currentUser?.name !== name) {
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          name,
        },
      });
    }

    res.json({
      ok: true,
    });
  } else if (req.method === "GET") {
    const profile = await client.user.findUnique({
      where: { id: req.session.user?.id },
    });
    res.json({
      ok: true,
      profile,
    });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
