import { Client } from "@prisma/client";
import { IconArrowBearLeft, IconArrowLeft, IconDots } from "@tabler/icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "../../components/Button";
import {
  Box,
  Card,
  Heading,
  ListItem,
  Skeleton,
  Text,
  Flex,
  Avatar,
  IconButton,
  DropdownMenuContent,
  DropdownMenuItem,
  RightSlot,
} from "../../components/design-system";
import { InvoiceList } from "../../components/invoice/InvoiceList";
import { Accent } from "../../utils/color";
import { trpc } from "../../utils/trpc";
import Layout from "../../components/layout";
import { ReactElement } from "react";

const ClientDetails: NextPage = () => {
  const router = useRouter();
  const { clientId } = router.query;
  const { data: clientData } = trpc.useQuery([
    "client.getById",
    { id: clientId as string },
  ]);
  const deleteMutation = trpc.useMutation(["client.delete"], {
    // onSuccess: () => {
    //   clients.refetch();
    // },
  });

  if (!clientData) {
    return (
      <main className="w-full flex flex-col gap-4">
        <Skeleton variant="heading" css={{ width: "20%" }} />
        <Skeleton variant="title" css={{ width: "50%" }} />
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>Clients - {clientData.name}</title>
        <meta name="description" content="Clients" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex justify={"center"}>
        <Flex direction={"column"} gap={4} css={{ maxWidth: "30em" }}>
          <Flex align={"center"} gap={3}>
            <Avatar size={"4"}></Avatar>
            <Box>
              <Heading size="3">{clientData.name}</Heading>
              <Text size="1">{clientData.company}</Text>
            </Box>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <IconButton css={{ marginLeft: "auto" }}>
                  <IconDots size={14} />
                </IconButton>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenuContent sideOffset={5}>
                  <DropdownMenuItem color="red">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </Flex>

          <div className="grid grid-cols-12">
            <Card
              className="grid-span-6"
              as="ul"
              role="list"
              css={{
                p: "$3",
                gridColumn: "span 12 / span 12",
              }}
            >
              {/* <li className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
            <span className="text-sm font-semibold">Status</span>
            <div>
              {" "}
              <Badge
                text={clientData ? "Live" : "Draft"}
                accent={clientData.live ? Accent.success : Accent.default}
              />
            </div>
          </li> */}
              <ListItem>
                <span className="text-sm font-semibold">Email</span>
                {clientData.email}
              </ListItem>
              <ListItem>
                <span className="text-sm font-semibold">Number</span>
                {clientData.number}
              </ListItem>
            </Card>
          </div>

          <section>
            <h3>Contracts</h3>
          </section>
          <section>
            <h3 className="text-md dark:text-white">Invoices</h3>
            <InvoiceList
              queryKey={["invoice.getByClientId", { clientId: clientId }]}
            />
          </section>
        </Flex>
      </Flex>
    </>
  );
};

ClientDetails.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ClientDetails;
