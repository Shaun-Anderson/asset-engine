import { IconArrowBearLeft, IconArrowLeft } from "@tabler/icons";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { ClientAddForm } from "../../components/client/ClientAddForm";
import { Box, Flex, Heading } from "../../components/design-system";
import Layout from "../../components/layout";

const AddClient: NextPage = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Clients - Add</title>
        <meta name="description" content="Clients" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex justify={"center"}>
        <Flex direction={"column"} gap={4} css={{ maxWidth: "30em" }}>
          <Heading as="h1" size="3">
            Add new client
          </Heading>
          <div className="flex justify-center">
            <ClientAddForm />
          </div>
        </Flex>
      </Flex>
    </>
  );
};

AddClient.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default AddClient;
