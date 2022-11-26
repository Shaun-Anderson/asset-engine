import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  IconCheck,
  IconFile,
  IconMail,
  IconSearch,
  IconTrash,
} from "@tabler/icons";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { ReactElement, useState } from "react";
import { Accent } from "../../utils/color";
import { trpc } from "../../utils/trpc";
import toast from "react-hot-toast";
import { Toast } from "../../components/Toast";
import {
  Card,
  Text,
  Badge,
  Heading,
  IconButton,
  Box,
  Grid,
} from "../../components/design-system";
import { TextField } from "../../components/form/TextField";
import { Button } from "../../components/Button";
import Layout from "../../components/layout";

const Client: NextPage = () => {
  const [search, setSearch] = useState("");
  const [parent] = useAutoAnimate<HTMLDivElement>(/* optional config */);

  const {
    data: clientData,
    refetch,
    isLoading,
  } = trpc.useQuery(["client.get"]);
  const deleteMutation = trpc.useMutation(["client.delete"], {
    onSuccess: () => {
      refetch();
      toast.custom((t) => (
        <Toast
          icon={<IconCheck size={18} className="mr-2" />}
          visible={t.visible}
          text="Successfully Deleted"
          accent={Accent.success}
        />
      ));
    },
  });

  // const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
  //   arr.reduce((groups, item) => {
  //     (groups[key(item)] ||= []).push(item);
  //     return groups;
  //   }, {} as Record<K, T[]>);

  // const filtered = clients?.data?.filter((x) => x.name.includes(search)) ?? [];
  // const groupByCompany = groupBy(filtered ?? [], (i) => i.company ?? "");
  // console.log(clients.isLoading);

  return (
    <>
      <Head>
        <title>Clients</title>
        <meta name="description" content="Clients" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full flex flex-col gap-4">
        <Heading as="h1" size="3">
          Clients
        </Heading>

        {/* <button
          onClick={() => {
            toast.custom(
              (t) => (
                <div
                  className={`${
                    t.visible ? "animate-enter" : "animate-leave"
                  } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                >
                  <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        <img
                          className="h-10 w-10 rounded-full"
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=6GHAjsWpt9&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                          alt=""
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Emilia Gates
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Sure! 8:30pm works great!
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex border-l border-gray-200">
                    <button
                      onClick={() => toast.dismiss(t.id)}
                      className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ),
              { duration: Infinity }
            );
          }}
        >
          Infinity test
        </button>
        <button
          onClick={() => {
            toast.custom((t) => (
              <Toast
                icon={<IconCheck size={18} className="mr-2" />}
                visible={t.visible}
                text="Successfully Deleted"
                accent={Accent.success}
              />
            ));
          }}
        >
          test
        </button> */}
        <div className="flex items-center gap-4">
          {/* <TextField
            className="w-full"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            leading={<IconSearch />}
   
          /> */}
          <Link href={"/clients/add"}>
            <Button>Add new Client</Button>
          </Link>
        </div>
        <Grid ref={parent} columns={2} align="stretch" gap={2}>
          {isLoading && <p className="text-xs w-full">Loading...</p>}
          {clientData?.map((data) => (
            <Link href={`/clients/${data.id}`} key={data.id}>
              <Card as="a" href="#" css={{ p: "$3" }} variant="interactive">
                <div>
                  <div className="flex gap-5">
                    <div className="p-4 w-10 h-10 rounded-full bg-orange-400"></div>
                    <div className="flex flex-col">
                      <Heading size={"1"}>{data.name}</Heading>
                      <Text size="2" css={{ color: "$slate11" }}>
                        {data.company}
                      </Text>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-2">
                    {" "}
                    <Badge variant={"green"}>Active</Badge>
                    <Badge variant={"gray"}>
                      <>
                        <IconFile size={12} className="mr-1" />{" "}
                        {data.invoices.length}
                      </>
                    </Badge>
                  </div>
                </div>
                <Box
                  css={{
                    marginLeft: "auto",
                    position: "absolute",
                    right: "$4",
                    top: "$4",
                  }}
                >
                  <IconButton
                    color="red"
                    aria-label="Delete client"
                    onClick={async (e) => {
                      e.stopPropagation();
                      deleteMutation.mutate({
                        id: data.id,
                      });
                    }}
                  >
                    <IconTrash
                      size={18} // set custom `width` and `height`
                      stroke={1} // set `stroke-width`
                      strokeLinejoin="miter" // override other SVG props
                    />
                  </IconButton>
                </Box>
              </Card>
            </Link>
          ))}
        </Grid>
      </main>
    </>
  );
};

Client.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Client;
