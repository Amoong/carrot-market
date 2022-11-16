import client from "@libs/server/client";
import twilio from "twilio";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { phone, email } = req.body;
  const user = phone ? { phone: Number(phone) } : email ? { email } : null;
  if (!user) return res.status(400).json({ ok: false });
  const payload = `${Math.floor(100000 + Math.random() * 900000)}`;

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
    const message = await twilioClient.messages.create({
      messagingServiceSid: process.env.TWILIO_MSID,
      to: process.env.MY_PHONE ?? "",
      body: `Your login token is ${payload}`,
    });
  } else if (email) {
    const data = {
      service_id: process.env.EMAIL_JS_SERVICE_ID,
      template_id: process.env.EMAIL_JS_TEMPLATE_ID,
      user_id: process.env.EMAIL_JS_PUBLIC_KEY,
      accessToken: process.env.EMAIL_JS_PRIVATE_KEY,
      template_params: {
        from_name: "Carrot Market",
        to_name: "Lovely User",
        message: `Your verification code is <strong>${payload}</strong>`,
        to_mail: "moo1323@naver.com",
        reply_to: "amoong1323@gmail.com",
      },
    };

    fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(function (result) {
        console.log("Your mail is sent!", result);
      })
      .catch(function (error) {
        console.log("Oops... " + JSON.stringify(error));
      });
  }

  return res.json({
    ok: true,
  });
}

export default withHandler("POST", handler);
