import { Client, Invoice } from "@prisma/client";
import { IconTrash } from "@tabler/icons";
import Link from "next/link";
import { IconButton } from "../IconButton";
import { Accent } from "../../utils/color";
import { TQuery, trpc } from "../../utils/trpc";
import { InvoiceRow } from "./InvoiceRow";
import { useAutoAnimate } from "@formkit/auto-animate/react";

type InvoiceComplete = Invoice & { client: Client };
type Query = [query: TQuery, value?: any];

export const InvoiceList = ({ queryKey }: { queryKey: Query }) => {
  const [parent] = useAutoAnimate(/* optional config */);
  const {
    data: invoicesData,
    isLoading,
  }: {
    data: InvoiceComplete[] | undefined;
    isLoading: boolean;
  } = trpc.useQuery(queryKey);

  const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
    arr.reduce((groups, item) => {
      (groups[key(item)] ||= []).push(item);
      return groups;
    }, {} as Record<K, T[]>);

  const groupByCompany = groupBy(invoicesData ?? [], (i) =>
    i.created_at.toDateString()
  );

  return (
    <ul
      ref={parent}
      className="flex flex-col justify-center items-center w-full gap-4"
    >
      {isLoading && <p className="text-xs w-full text-white">Loading...</p>}
      {invoicesData?.length == 0 && <p className="text-white">No data found</p>}
      {Object.entries(groupByCompany).map(([key, value]) => (
        <div key={key} className="w-full">
          <span className="text-xs dark: text-zinc-600">{key}</span>
          <div className="pt-1 flex flex-col justify-center items-center w-full gap-2">
            {value.map((data: InvoiceComplete) => (
              <InvoiceRow key={data.id} invoice={data} />
            ))}
          </div>
        </div>
      ))}
    </ul>
  );
};
