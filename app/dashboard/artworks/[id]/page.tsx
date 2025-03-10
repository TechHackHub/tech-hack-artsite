"use client";

import TransitionPage from "@/components/TransitionPage";
import React from "react";
import { useArtwork } from "../hooks";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ArtworkPage: React.FC = () => {
  const { id } = useParams();
  const { data: artwork } = useArtwork(id as string);

  if (!id) {
    return notFound();
  }

  return (
    <TransitionPage>
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {artwork?.title ?? "Artwork"}
            </CardTitle>
          </CardHeader>

          <CardContent>{artwork?.title}</CardContent>
        </Card>
      </div>
    </TransitionPage>
  );
};

export default ArtworkPage;
