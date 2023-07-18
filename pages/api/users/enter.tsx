import mail from "@sendgrid/mail";
import client from "@libs/client/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { Twilio } from "twilio";

mail.setApiKey(process.env.SEND_GRID_API_KEY!);

const twilioClient = new Twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_TOKEN
);

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

  if (phone) {
    // await twilioClient.messages.create({
    //   messagingServiceSid: process.env.TWILIO_SSID,
    //   to: process.env.MY_PHONE!,
    //   body: `Your login token is ${payload}.`,
    // });
  } else if (email) {
    // const email = await mail.send({
    //   from: "moo1323@naver.com",
    //   to: "moo1323@naver.com",
    //   subject: "Your Carrot Market Verification Email",
    //   text: `Your token is ${payload}`,
    //   html: `<strong>Your token is ${payload}</strong>`,
    // });
  }

  res.json({ ok: true });
}

export default withHandler({ method: "POST", handler, isPrivate: false });
