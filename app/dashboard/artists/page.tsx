"use client";

import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { getArtist } from "./actions";

const ArtistPage = () => {
  const { data, status } = useSession();

  useEffect(() => {
    const init = async () => {
      const artist = await getArtist();
      console.log("artist...", artist);
    };

    init();
  }, []);

  console.log("data...", data, status);

  return <div className="text-red-300">page</div>;
};

export default ArtistPage;
