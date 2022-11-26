import { IconArrowBearLeft } from "@tabler/icons";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { ReactElement } from "react";
import { Heading } from "../../components/design-system";
import { InvoiceAddForm } from "../../components/invoice/InvoiceAddForm";
import Layout from "../../components/layout";

const AddClient: NextPage = () => {
  return (
    <>
      <Head>
        <title>Invoices - Add</title>
        <meta name="description" content="Add new invoice" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full flex flex-col gap-4 mt-5">
        <Heading size="3">Add Invoice</Heading>
        <InvoiceAddForm />
      </main>
    </>
  );
};

AddClient.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default AddClient;
