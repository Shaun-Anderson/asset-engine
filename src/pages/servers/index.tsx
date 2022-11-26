import { IconSearch } from "@tabler/icons";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { z } from "zod";
import { Button } from "../../components/Button";
import { Heading } from "../../components/design-system";
import Form from "../../components/Form";
import { Input } from "../../components/Input";
import { InvoiceList } from "../../components/invoice/InvoiceList";
import { TextField } from "../../components/form/TextField";
import Layout from "../../components/layout";
import { ReactElement } from "react";
import { Table } from "../../components/Table";

const Invoices: NextPage = () => {
  return (
    <>
      <Head>
        <title>Servers</title>
        <meta name="description" content="Clients" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full flex flex-col gap-4">
        <Heading size="3">Servers</Heading>
        <div className="flex items-center gap-4">
          <Input
            className="w-full"
            placeholder="Search"
            leadingIcon={<IconSearch className="text-zinc-600" size={18} />}
          />

          <Link href={"/invoices/add"}>
            <Button as="a" size={2}>
              Link
            </Button>
          </Link>
        </div>

        <Table<Server>
          data={servers ?? []}
          searchable
          selectable
          // pagination
          loading={servers == undefined}
          columns={columns}
          onRowClick={(row: Server) => {
            router.push(`/servers/${row.id}`);
          }}
        />
      </main>
    </>
  );
};

Invoices.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Invoices;
