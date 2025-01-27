"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TextField from "@/components/inputs/TextField";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const schema = yup.object({
  oldpassword: yup.string().required("Old password is required").default(""),
  newpassword: yup.string().required("New password is required").default(""),
  newpasswordconfirm: yup
    .string()
    .required("New password confirm is required")
    .oneOf([yup.ref("newpassword")], "Passwords must match")
    .default(""),
});

export type PasswordChangeFormType = yup.InferType<typeof schema>;

type Props = {
  isLoading?: boolean;
  onSubmit: (formData: PasswordChangeFormType) => Promise<boolean>;
};

const PasswordChangeForm: React.FC<Props> = ({ isLoading, onSubmit }) => {
  const form = useForm<PasswordChangeFormType>({
    defaultValues: {
      oldpassword: "",
      newpassword: "",
      newpasswordconfirm: "",
    },
    resolver: yupResolver(schema),
  });

  const {
    formState: { isDirty, isValid },
  } = form;

  const handleSubmit = async (data: PasswordChangeFormType) => {
    const updated = await onSubmit(data);

    if (updated) {
      form.reset();
    }
  };

  return (
    <Card>
      <CardHeader className="text-xl">
        <CardTitle className="text-xl">Change Password</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            autoComplete="new-password"
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <TextField
              label="Old Password"
              name="oldpassword"
              type="password"
              placeholder="Your old password"
            />
            <TextField
              label="New Password"
              name="newpassword"
              type="password"
              placeholder="Your old password"
            />
            <TextField
              label="New Password Confirm"
              name="newpasswordconfirm"
              type="password"
              placeholder="Your old password"
            />
            <Button
              type="submit"
              loading={isLoading}
              disabled={!isDirty || !isValid}
            >
              Update
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PasswordChangeForm;
