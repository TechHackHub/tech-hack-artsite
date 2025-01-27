"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TextField from "@/components/inputs/TextField";
import { useForm } from "react-hook-form";
// import {yupResolver} from "@hookform/resolvers/yup";
import { Form } from "@/components/ui/form";
// import * as yup from "yup";
import { Button } from "@/components/ui/button";

const PasswordChangeForm: React.FC = () => {
  const form = useForm({
    defaultValues: {},
    // resolver: yupResolver(schema),
  });

  const handleSubmit = async (formData: any) => {
    console.log("formData", formData);
  };

  return (
    <Card>
      <CardHeader className="text-xl">
        <CardTitle className="text-xl">Change Password</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <TextField
              label="Old Password"
              name="oldpassword"
              placeholder="Your old password"
            />
            <TextField
              label="New Password"
              name="newpassword"
              placeholder="Your old password"
            />
            <TextField
              label="New Password Confirm"
              name="newpasswordconfirm"
              placeholder="Your old password"
            />
            <Button type="submit">Update</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PasswordChangeForm;
