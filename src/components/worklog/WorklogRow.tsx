import { Client, Invoice, Worklog } from "@prisma/client";
import { IconFile, IconPencil, IconTrash } from "@tabler/icons";
import { Accent } from "../../utils/color";
import { formatCurrency, formatNumber } from "../../utils/date";
import { trpc } from "../../utils/trpc";
import { Card, IconButton, Flex } from "../design-system";
import { Badge } from "../design-system/Badge";
import { Link } from "../Link";
import Popover from "../Popover";
import WorklogPopoverEditForm from "./WorklogPopoverEditForm";

const InvoiceIcon = ({ data }: { data: Invoice | null }) => {
  if (!data)
    return (
      <Badge>
        <IconFile size={18} stroke={1} />
        No Invoice
      </Badge>
    );

  switch (data.status) {
    case "Draft":
      return (
        <Link
          href={`/invoices/${data.id}`}
          accent={Accent.default}
          size="sm"
          rounded="full"
          leading={<IconFile size={18} stroke={1} />}
        >
          Draft
        </Link>
      );
    case "Pending":
      return (
        <Link href={`/invoices/${data.id}`}>
          <div className="px-3 py-1 bg-indigo-900/20 rounded-full flex cursor-pointer hover:bg-indigo-900/30">
            <IconFile size={18} stroke={1} className="text-indigo-800 mr-2" />
            <span className="text-xs text-indigo-700">Pending</span>
          </div>
        </Link>
      );
    case "Paid":
      return <IconFile size={18} stroke={1} className="text-emerald-500" />;
    case "Overdue":
      return <IconFile size={18} stroke={1} className="text-rose-500" />;
  }
  return <></>;
};

export const WorklogRow = ({
  data,
}: {
  data: Worklog & {
    client: Client | null;
    invoice: Invoice | null;
  };
}) => {
  const ctx = trpc.useContext();
  const deleteMutation = trpc.useMutation(["invoice.delete"], {
    onSuccess: () => {
      ctx.refetchQueries(["invoice.get"]);
    },
  });
  const dateTime = new Date(data.value * 1000).toISOString();
  return (
    <Card
      key={data.id}
      className="group items-center w-full flex gap-4 "
      css={{ p: "$2" }}
    >
      <Flex>
        <Flex direction={"column"} className="min-w-[200px]">
          {data.description}
          <span className="text-sm mt-1  flex gap-2 items-center">
            <span className="bg-gray-80 dark:bg-zinc-500 h-4 w-4 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"></span>
            {data.client?.name} ({data.client?.company})
          </span>
        </Flex>
        <span className="flex gap-1 items-center">
          <InvoiceIcon data={data.invoice} />
        </span>
        <div className=" flex items-center">
          <span className=" mr-2 text-sm">
            {dateTime.substring(11, 13)}:{dateTime.substring(14, 16)}:
            {dateTime.substring(17, 19)}
          </span>

          <span className="text-xs ml-2 text-zinc-600">@ {data.rate}/h</span>
        </div>

        <span className="flex gap-1 items-center text-sm">
          {formatCurrency((data.rate ?? 0) * (data.value / 3600))}
        </span>
        {(data.invoice?.status === "Draft" || !data.invoice) && (
          <div className="flex">
            <Popover
              buttonNode={
                <IconButton aria-label="Edit instruction">
                  <IconPencil
                    size={18} // set custom `width` and `height`
                    stroke={1} // set `stroke-width`
                    strokeLinejoin="miter" // override other SVG props
                  />
                </IconButton>
              }
            >
              <div className="min-w-[200px] border-2 rounded-lg border-gray-800 bg-gray-900">
                <WorklogPopoverEditForm worklog={data} />
              </div>
            </Popover>

            <IconButton
              aria-label="Edit instruction"
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
          </div>
        )}
      </Flex>
    </Card>
  );
};
