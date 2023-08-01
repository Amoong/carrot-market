import type { NextPage } from "next";
import Button from "@components/button";
import Input from "@components/input";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

interface EditProfileForm {
  email?: string;
  phone?: string;
  formErrors?: string;
}

const EditProfile: NextPage = () => {
  const { user } = useUser();

  const {
    register,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EditProfileForm>({ mode: "onChange" });

  useEffect(() => {
    if (user?.email) {
      setValue("email", user.email);
    } else if (user?.phone) {
      setValue("phone", user.phone);
    }
  }, [setValue, user]);

  const onValid = ({ email, phone }: EditProfileForm) => {
    if (!email && !phone) {
      setError("formErrors", {
        message: "Email or Phone number is required. You need to choose one.",
      });
    }

    console.log(email, phone);
  };

  return (
    <Layout canGoBack title="Edit Profile">
      <form className="space-y-4 py-10 px-4" onSubmit={handleSubmit(onValid)}>
        <div className="flex items-center space-x-3">
          <div className="h-14 w-14 rounded-full bg-slate-500" />
          <label
            htmlFor="picture"
            className="cursor-pointer rounded-md border border-gray-300 py-2 px-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Change
            <input
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
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
        {errors.formErrors && (
          <span className="my-2 block text-center font-medium text-red-500">
            {errors.formErrors.message}
          </span>
        )}
        <Button text="Update profile" />
      </form>
    </Layout>
  );
};

export default EditProfile;
