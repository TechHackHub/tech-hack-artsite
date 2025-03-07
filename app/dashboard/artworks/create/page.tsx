"use client";

import React from "react";
import { useCreateArtwork } from "../hooks";
import TransitionPage from "@/components/TransitionPage";
import ArtworkForm from "../components/ArtworkForm";
import { ArtworkFormType } from "@/app/api/artworks/validations";
import { useRouter } from "next/navigation";

const ArtworkCreatePage: React.FC = () => {
  const router = useRouter();
  const { isLoading, mutateAsync: createArtworkAsync } = useCreateArtwork();

  const handleSubmit = async (formData: ArtworkFormType) => {
    const data = await createArtworkAsync({ data: formData });

    if (data) {
      router.push("/dashboard/artworks");
    }
  };

  return (
    <TransitionPage>
      <div className="container mx-auto max-w-[800px]">
        <ArtworkForm isLoading={isLoading} onSubmit={handleSubmit} />
      </div>
    </TransitionPage>
  );
};

export default ArtworkCreatePage;
