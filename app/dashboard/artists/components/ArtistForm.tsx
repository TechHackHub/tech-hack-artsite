import React from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import TextField from "@/components/inputs/TextField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TextareaField from "@/components/inputs/TextareaField";
import AvatarUploadField from "@/components/inputs/AvatarUploadField";
import { Artist, UpdateArtist } from "@/app/dashboard/artists/types";
import AppCard from "@/components/AppCard";

const schema = yup.object().shape({
  avatar: yup.string().default(""),
  name: yup.string().required("Name is required"),
  born: yup.string().required("Born is required"),
  educations: yup.array().of(yup.string()).default([]),
  description: yup.string().default(""),
  email: yup.string().email().required("Email is required"),
  phone: yup.string(),
  facebookUrl: yup.string().nullable().default(""),
  IGUrl: yup.string().nullable().default(""),
});

type ArtistFormType = yup.InferType<typeof schema>;

type Props = {
  isLoading?: boolean;
  artist?: Artist | null;
  onSubmit: (
    artist: Omit<UpdateArtist, "oldPassword" | "newPassword">
  ) => Promise<void>;
};

const ArtistForm: React.FC<Props> = ({ isLoading, artist, onSubmit }) => {
  const form = useForm<ArtistFormType>({
    defaultValues: {
      avatar: artist?.avatar ?? "",
      name: artist?.name ?? "",
      born: artist?.born ?? "",
      educations: artist?.educations ?? ["", "", ""],
      description: artist?.description ?? "",
      email: artist?.email ?? "",
      phone: artist?.phone ?? "",
      facebookUrl: artist?.facebookUrl ?? "",
      IGUrl: artist?.IGUrl ?? "",
    },
    resolver: yupResolver(schema),
  });

  const {
    formState: { isDirty, isValid },
  } = form;

  const handleSubmit = async (data: ArtistFormType) => {
    const updatedArtist = {
      ...data,
      educations: (data?.educations?.filter(Boolean) as string[]) ?? [],
    } as Artist;

    await onSubmit(updatedArtist);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Artist Settings</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <AvatarUploadField name="avatar" />

            <div className="flex-1 ">
              <AppCard title="About">
                <TextField
                  label="Name"
                  name="name"
                  placeholder="Ex: StarkLin"
                />
                <TextField
                  label="Born"
                  name="born"
                  placeholder="Ex: 1996-07-10"
                />
                <TextField
                  label="Education1"
                  name="educations.0"
                  placeholder="Ex: MIT Software Engineer Master"
                />
                <TextField
                  label="Education2"
                  name="educations.1"
                  placeholder="Ex: MIT Finance Master"
                />
                <TextField
                  label="Education3"
                  name="educations.2"
                  placeholder="Ex: MIT Finance Master"
                />
                <TextareaField
                  label="Description"
                  name="description"
                  placeholder="Ex: Hello, my name is..."
                  rows={5}
                />
              </AppCard>

              <AppCard title="Contact">
                <TextField
                  label="Email"
                  name="email"
                  placeholder="Ex: abc123@gmail.com"
                />
                <TextField
                  label="Phone"
                  name="phone"
                  placeholder="Ex: 0912345678"
                />
              </AppCard>

              <AppCard title="Socials">
                <TextField
                  label="Facebook"
                  name="facebookUrl"
                  placeholder="Ex: https://www.facebook.com"
                />
                <TextField
                  label="Instagram"
                  name="IGUrl"
                  placeholder="Ex: https://www.IG.com"
                />
              </AppCard>
            </div>

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

export default ArtistForm;
