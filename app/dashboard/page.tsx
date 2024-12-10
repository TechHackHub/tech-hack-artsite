"use client";
import React from "react";
import { useQuery, gql } from "@apollo/client";

const GET_ARTIST = gql`
  query ArtistQuery {
    artist {
      name
      avatar
      born
      avatar
      educations
    }
  }
`;

const Page = () => {
  const { loading, error, data } = useQuery(GET_ARTIST);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  console.log(data);

  return <div>Dashboard {JSON.stringify(data.artist)}</div>;
};

export default Page;
