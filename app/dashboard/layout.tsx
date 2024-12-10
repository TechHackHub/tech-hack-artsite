"use client";
import SideNav from "@/app/ui/dashboard/sidenav";
import createApolloClient from "../libs/apollo-client";
import { ApolloProvider } from "@apollo/client";

const client = createApolloClient();

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64">
          <SideNav />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
          {children}
        </div>
      </div>
    </ApolloProvider>
  );
}
