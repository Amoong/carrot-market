import type { NextPage } from "next";
import Layout from "@components/layout";
import Message from "@components/message";
import useSWR from "swr";
import { useRouter } from "next/router";
import { Message as PrismaMessage, Stream } from "@prisma/client";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import useUser from "@libs/client/useUser";
import { useEffect } from "react";

interface StreamWithMessage extends Stream {
  messages: Pick<PrismaMessage, "id" | "message" | "userId">[];
}
interface StreamResponse {
  ok: boolean;
  stream?: StreamWithMessage;
}

interface MessageForm {
  message: string;
}

interface MessageResponse {
  ok: boolean;
  message: PrismaMessage;
}

const StreamDetail: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { register, handleSubmit, reset } = useForm<MessageForm>();

  const { data, mutate } = useSWR<StreamResponse>(
    router.query.id ? `/api/streams/${router.query.id}` : null,
    { refreshInterval: 1000 }
  );

  const [sendMessage, { loading, data: messageResponse }] =
    useMutation<MessageResponse>(`/api/streams/${router.query.id}/message`);

  const onValid = (form: MessageForm) => {
    if (loading) {
      return;
    }

    sendMessage(form);
    reset();
  };

  useEffect(() => {
    if (messageResponse && messageResponse.ok) {
      mutate();
    }
  }, [messageResponse, mutate]);

  return (
    <Layout canGoBack>
      <div className="space-y-4 py-10  px-4">
        {data?.stream?.cloudflareId ? (
          <iframe
            className="aspect-video w-full rounded-md shadow-sm"
            src={`https://customer-pqz61m3zr8qeuu63.cloudflarestream.com/${data?.stream?.cloudflareId}/iframe`}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen={true}
          ></iframe>
        ) : null}

        <div className="mt-5">
          <h1 className="text-3xl font-bold text-gray-900">
            {data?.stream?.name}
          </h1>
          <span className="mt-3 block text-2xl text-gray-900">
            ${data?.stream?.price}
          </span>
          <p className=" my-6 text-gray-700">{data?.stream?.description}</p>
          <div>
            <div>url: {data?.stream?.cloudflareUrl}</div>
            <div>key: {data?.stream?.cloudflareKey}</div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
          <div className="h-[50vh] space-y-4 overflow-y-scroll py-10  px-4 pb-16">
            {data?.stream?.messages.map((message) => (
              <Message
                key={message.id}
                message={message.message}
                reversed={user?.id === message.userId}
              />
            ))}
          </div>
          <form
            onSubmit={handleSubmit(onValid)}
            className="fixed inset-x-0 bottom-0  bg-white py-2"
          >
            <div className="relative mx-auto flex w-full max-w-md items-center">
              <input
                {...register("message", { required: true })}
                type="text"
                className="w-full rounded-full border-gray-300 pr-12 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              />
              <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                <button className="flex items-center rounded-full bg-orange-500 px-3 text-sm text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                  &rarr;
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default StreamDetail;
