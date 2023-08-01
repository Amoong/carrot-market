import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { Stream } from "@prisma/client";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface CreateResponse {
  ok: boolean;
  stream: Stream;
}

interface StreamCreateForm {
  name: string;
  price: string;
  description: string;
}

const Create: NextPage = () => {
  const [createStream, { data, loading }] =
    useMutation<CreateResponse>("/api/streams");
  const { register, handleSubmit } = useForm<StreamCreateForm>();
  const router = useRouter();

  const onValid = (form: StreamCreateForm) => {
    if (loading) {
      return;
    }

    createStream(form);
  };

  useEffect(() => {
    if (data?.ok) {
      router.push(`streams/${data.stream.id}`);
    }
  }, [data, router]);

  return (
    <Layout canGoBack title="Go Live">
      <form className=" space-y-4 py-10 px-4" onSubmit={handleSubmit(onValid)}>
        <Input
          register={register("name")}
          required
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register("price")}
          required
          label="Price"
          placeholder="0.00"
          name="price"
          type="text"
          kind="price"
        />
        <TextArea
          register={register("description")}
          name="description"
          label="Description"
        />
        <Button text={loading ? "Loading..." : "Go live"} />
      </form>
    </Layout>
  );
};

export default Create;
