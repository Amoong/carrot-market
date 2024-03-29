import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useMutation from "@libs/client/useMutation";

interface EditProfileResponse {
  ok: boolean;
  error?: string;
}
interface EditProfileForm {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: FileList;
}

const EditProfile: NextPage = () => {
  const { user } = useUser();
  const [error, setError] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");

  const [editProfile, { loading, data }] =
    useMutation<EditProfileResponse>("/api/users/me");

  const { register, setValue, handleSubmit, watch } = useForm<EditProfileForm>({
    mode: "onChange",
  });

  const avatar = watch("avatar");

  useEffect(() => {
    if (avatar && avatar.length > 0) {
      setAvatarPreview(URL.createObjectURL(avatar[0]));
    }
  }, [avatar]);

  useEffect(() => {
    if (user?.avatar) {
      setAvatarPreview(
        `https://imagedelivery.net/HNmhwe6S0FPTqoDgwXQ0qQ/${user.avatar}/avatar`
      );
    }
  }, [user?.avatar]);

  useEffect(() => {
    if (user?.email) {
      setValue("email", user.email);
    }
    if (user?.phone) {
      setValue("phone", user.phone);
    }
    if (user?.name) {
      setValue("name", user.name);
    }
  }, [setValue, user]);

  useEffect(() => {
    if (!data) {
      return;
    }

    if (data.error) {
      setError(data.error);
    } else {
      setError("");
    }
  }, [data]);

  const onValid = async ({ email, phone, name, avatar }: EditProfileForm) => {
    if (loading) {
      return;
    }

    if (!email && !phone) {
      setError("Email or Phone number is required. You need to choose one.");
      return;
    }

    if (avatar && avatar.length > 0) {
      const res = await fetch("/api/files");
      const json = await res.json();

      const form = new FormData();
      form.append("file", avatar[0], user?.id.toString());

      const {
        result: { id: avatarId },
      } = await (
        await fetch(json.uploadURL, {
          method: "POST",
          body: form,
        })
      ).json();

      editProfile({ email, phone, name, avatarId });
    } else {
      editProfile({ email, phone, name });
    }
  };

  return (
    <Layout canGoBack title="Edit Profile">
      <form className="space-y-4 py-10 px-4" onSubmit={handleSubmit(onValid)}>
        <div className="flex items-center space-x-3">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              className="h-14 w-14 rounded-full bg-slate-500"
            />
          ) : (
            <div className="h-14 w-14 rounded-full bg-slate-500" />
          )}

          <label
            htmlFor="picture"
            className="cursor-pointer rounded-md border border-gray-300 py-2 px-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Change
            <input
              {...register("avatar")}
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <Input
          register={register("name")}
          required
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register("email")}
          required
          label="Email address"
          name="email"
          type="email"
        />
        <Input
          register={register("phone")}
          required
          label="Phone number"
          name="phone"
          type="number"
          kind="phone"
        />
        {error && (
          <span className="my-2 block text-center font-medium text-red-500">
            {error}
          </span>
        )}
        <Button text={loading ? "Loading..." : "Update profile"} />
      </form>
    </Layout>
  );
};

export default EditProfile;
