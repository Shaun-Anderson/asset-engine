import { Client, Invoice } from "@prisma/client";
import { IconTrash } from "@tabler/icons";
import Link from "next/link";
import { IconButton } from "../IconButton";
import { Accent } from "../../utils/color";
import { trpc } from "../../utils/trpc";
import { Menu } from "../Menu";
import { Menu as BaseMenu } from "@headlessui/react";
import { DeleteModal } from "./DeleteModal";
import { useModal } from "../../hooks/Modal";
import { formatCurrency, formatNumber } from "../../utils/date";
import { Flex, Text, Card, Badge } from "../design-system";

interface InvoiceRowProps {
  invoice: Invoice & {
    client: Client;
  };
}

export const InvoiceRow = (props: InvoiceRowProps) => {
  const { invoice } = props;
  const ctx = trpc.useContext();

  const getStatusBadge = () => {
    // if(invoice.due_date < new Date()) {
    //   return
    // }
    switch (invoice.status) {
      case "Draft":
        return <Badge>{invoice.status}</Badge>;
      case "Pending":
        return <Badge variant={"indigo"}>{invoice.status}</Badge>;
      case "Paid":
        return <Badge variant={"green"}>{invoice.status}</Badge>;
    }
  };

  const [showDeleteModal, hideDeleteModal] = useModal(DeleteModal, {
    title: "Delete Invoice",
    invoiceId: invoice.id,
    data: invoice,
  });

  return (
    <Link href={`/invoices/${invoice.id}`} key={invoice.id}>
      <Card
        as="a"
        css={{ p: "$3" }}
        variant={"interactive"}
        className=" group dark:hover:bg-zinc-800/50 p-4 w-full flex gap-4 items-center cursor-pointer "
      >
        <Flex align={"center"} gap={2}>
          <Flex css={{ minWidth: 200 }}>
            <Text className="flex flex-col grow max-w-[200px] whitespace-nowrap text-ellipsis">
              {invoice.client.name}
              <Text variant={"gray"} size={2} css={{ marginTop: "$1" }}>
                {invoice.client.company}
              </Text>
            </Text>
          </Flex>
          <div>{getStatusBadge()}</div>
          <Text css={{ marginLeft: "auto" }}>
            {formatCurrency(invoice.totalCost)}
          </Text>
          <div className="">
            <Menu>
              <div className="px-1 py-1 ">
                <BaseMenu.Item>
                  {({ active }) => (
                    <button
                      // onClick={() => excelExport()}
                      className={`${
                        active
                          ? "bg-indigo-600 dark:text-white"
                          : "text-gray-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      Mark As Paid
                    </button>
                  )}
                </BaseMenu.Item>
                <BaseMenu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-rose-200 text-rose-500" : "text-rose-500"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      onClick={async (e) => {
                        e.stopPropagation();
                        showDeleteModal!({ data: invoice });
                      }}
                    >
                      Delete
                    </button>
                  )}
                </BaseMenu.Item>
              </div>
            </Menu>
            {/* <IconButton
            accent={Accent.danger}
            aria-label="Edit instruction"
            icon={
              <IconTrash
                size={18} // set custom `width` and `height`
                stroke={1} // set `stroke-width`
                strokeLinejoin="miter" // override other SVG props
              />
            }
            onClick={async (e) => {
              e.stopPropagation();
              showDeleteModal!({ data: invoice });
            }}
          /> */}
          </div>
        </Flex>
      </Card>
    </Link>
  );
};
