import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Client, Invoice, Worklog } from "@prisma/client";
import { IconArrowUp } from "@tabler/icons";
import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../../utils/trpc";
import WorklogForm from "../../components/worklog/WorklogForm";
import { WorklogRow } from "../../components/worklog/WorklogRow";
import Layout from "../../components/layout";
import { ReactElement } from "react";

const Worklogs: NextPage = () => {
  const [parent] = useAutoAnimate<HTMLUListElement>(/* optional config */);

  const { data: invoicesData } = trpc.useQuery(["worklog.get"]);

  const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
    arr.reduce((groups, item) => {
      (groups[key(item)] ||= []).push(item);
      return groups;
    }, {} as Record<K, T[]>);

  const filtered =
    invoicesData?.sort(
      (a, b) => b.recorded_at.valueOf() - a.recorded_at.valueOf()
    ) ?? [];
  const groupByDate = groupBy(filtered ?? [], (i) =>
    i.recorded_at.toDateString()
  );

  const calcDayTotalTime = (arr: Worklog[]) => {
    const total = arr.reduce((accumulator, object) => {
      return accumulator + object.value;
    }, 0);
    const dateTime = new Date(total * 1000).toISOString();
    return dateTime;
  };

  return (
    <>
      <Head>
        <title>Worklogs</title>
        <meta name="description" content="Clients" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full flex flex-col gap-4">
        <h1 className="text-3xl leading-normal font-bold text-gray-700 dark:text-white">
          Worklogs
        </h1>
        {/* <AddFormDynamic /> */}
        <WorklogForm />
        <ul ref={parent}>
          {invoicesData?.length == 0 && (
            <p className="text-zinc-600 text-sm flex">
              No data, try adding a new worklog above <IconArrowUp />
            </p>
          )}
          {Object.entries(groupByDate).map(([key, value]) => (
            <div key={key} className="w-full">
              <span className="text-xs flex dark: text-zinc-600 mt-4">
                <span>{key}</span>
                <div className="ml-auto flex items-center">
                  <span className=" mr-2 text-xs">
                    {calcDayTotalTime(value).substring(11, 13)}:
                    {calcDayTotalTime(value).substring(14, 16)}:
                    {calcDayTotalTime(value).substring(17, 19)}
                  </span>
                </div>
              </span>
              <div className="pt-1 flex flex-col justify-center items-center w-full gap-2">
                {value.map(
                  (
                    data: Worklog & {
                      client: Client | null;
                      invoice: Invoice | null;
                    }
                  ) => (
                    <WorklogRow key={data.id} data={data} />
                  )
                )}
              </div>
            </div>
          ))}
        </ul>
      </main>
    </>
  );
};

Worklogs.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Worklogs;
