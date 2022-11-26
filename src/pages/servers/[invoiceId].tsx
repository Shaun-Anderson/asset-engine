import { Popover, Tab, Transition } from "@headlessui/react";
import { Worklog } from "@prisma/client";
import {
  IconArrowLeft,
  IconClock,
  IconDots,
  IconPaperclip,
  IconPlus,
  IconReceipt,
  IconTrash,
} from "@tabler/icons";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { IconButton } from "../../components/design-system";
import { Badge } from "../../components/design-system/Badge";
import { ExpenseAddForm } from "../../components/expense/ExpenseAddForm";
import { PreviewModal } from "../../components/invoice/PreviewModal";
import { WorklogAddModal } from "../../components/invoice/WorklogAddModal";
import { Spinner } from "../../components/Spinner";
import { useModal } from "../../hooks/Modal";
import { Accent } from "../../utils/color";
import {
  formatCurrency,
  formatNumber,
  renderTimerValue,
} from "../../utils/date";
import { trpc } from "../../utils/trpc";

const ClientDetails: NextPage = () => {
  const router = useRouter();
  const { invoiceId } = router.query;
  const { data: invoiceData, refetch } = trpc.useQuery([
    "invoice.getById",
    { id: invoiceId as string },
  ]);

  const paidMutation = trpc.useMutation(["invoice.update_paid"], {
    onSuccess: () => {
      refetch();
    },
  });

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const [sendLoading, setSendLoading] = useState(false);
  const sendMutation = trpc.useMutation(["invoice.update_send"], {
    onMutate: () => setSendLoading(true),
    onError: () => setSendLoading(false),
    onSuccess: () => {
      refetch();
      setSendLoading(false);
    },
  });

  const [showPreviewModal] = useModal(PreviewModal, {
    title: "Preview",
  });

  if (!invoiceData) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const formatter = new Intl.RelativeTimeFormat(undefined);

  const DIVISIONS = [
    { amount: 60, name: "seconds" },
    { amount: 60, name: "minutes" },
    { amount: 24, name: "hours" },
    { amount: 7, name: "days" },
    { amount: 4.34524, name: "weeks" },
    { amount: 12, name: "months" },
    { amount: Number.POSITIVE_INFINITY, name: "years" },
  ];

  function formatTimeAgo(date: Date) {
    let duration = (date - new Date()) / 1000;

    for (let i = 0; i <= DIVISIONS.length; i++) {
      const division = DIVISIONS[i];
      if (Math.abs(duration) < division?.amount) {
        return formatter.format(Math.round(duration), division?.name);
      }
      duration /= division?.amount;
    }
  }

  console.log(formatTimeAgo(invoiceData.due_date));

  const getStatusBadge = () => {
    switch (invoiceData.status) {
      case "Draft":
        return <Badge text={invoiceData.status} accent={Accent.default} />;
      case "Pending":
        return <Badge text={invoiceData.status} accent={Accent.primary} />;
      case "Paid":
        return <Badge text={invoiceData.status} accent={Accent.success} />;
    }
  };

  return (
    <>
      <Head>
        <title>invoice</title>
        <meta name="description" content="Clients" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full flex flex-col pb-10">
        <h1 className="text-3xl leading-normal flex items-center font-bold text-gray-700 dark:text-white ">
          <span>Invoice</span>
          <span className="ml-auto flex gap-4 items-center">
            {invoiceData.status === "Draft" && (
              <button
                type="button"
                className="py-3 px-5 bg-white text-black rounded-xl text-sm"
                onClick={() => sendMutation.mutate({ id: invoiceId as string })}
              >
                {!sendLoading ? "Send" : "Sending"}
              </button>
            )}
            {invoiceData.status === "Pending" && (
              <button
                type="button"
                className="py-2 px-4 bg-black text-white rounded-xl text-sm"
                onClick={() =>
                  paidMutation.mutate({
                    id: invoiceId as string,
                    paid_date: new Date(),
                  })
                }
              >
                Set as paid
              </button>
            )}
            <Popover className="relative">
              {({ open, close }) => (
                <>
                  <Popover.Button
                    className={`
                ${open ? "" : "text-opacity-90"}
                h-fit rounded-lg p-2 text-gray-400 hover:text-gray-500 bg-neutral-200 dark:bg-neutral-800 border dark:border-zinc-700 hover:bg-neutral-300`}
                  >
                    <IconDots stroke={1} size={20} />
                  </Popover.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute right-0 z-10 mt-3 w-screen max-w-sm  transform px-4 sm:px-0 ">
                      <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="relative grid gap-4 bg-white p-4">
                          <div className="text-sm text-gray-500">Filters</div>
                          <hr></hr>
                          <button
                            type="button"
                            className="py-2 px-4 text-left text-black  text-sm"
                            onClick={() =>
                              showPreviewModal({ invoiceId: invoiceData.id })
                            }
                          >
                            Preview PDF
                          </button>
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          </span>
        </h1>
        <h2 className="text-gray-400 flex items-center gap-4">
          {getStatusBadge()} &middot;{" "}
          <span className="text-sm ">
            Due {invoiceData.due_date.toDateString()}
          </span>
        </h2>
        {/* Details */}
        <div className="grid grid-cols-12 gap-4 mt-8">
          <div className="card col-span-8 rounded-lg flex flex-col">
            <div className="text-xs uppercase font-semibold text-gray-400 mb-2">
              Client
            </div>
            <div className="text-md font-semibold">
              {invoiceData.client.name}
            </div>
            <div className="text-sm text-gray-400">
              {invoiceData.client.email}
            </div>
            <div className="text-sm text-gray-400 mt-auto">
              Created {invoiceData.created_at.toDateString()}
            </div>
          </div>
          <div className="col-span-4 flex flex-col gap-4">
            <div
              className={`card col-span-8 rounded-lg ${
                invoiceData.due_date < new Date() && "bg-rose-500 text-white"
              }`}
            >
              <div className="text-xs uppercase font-semibold text-gray-400 mb-2">
                Due
              </div>
              <div className="text-md font-semibold">
                {invoiceData.due_date.toDateString()}
              </div>
              <div className="text-sm text-gray-400">
                {formatTimeAgo(invoiceData.due_date)} &middot;{" "}
                {invoiceData.due_date < new Date() && <span> OVERDUE</span>}
              </div>
            </div>
            <div className="card col-span-8 rounded-lg">
              <div className="text-xs uppercase font-semibold text-gray-400 mb-2">
                Payment
              </div>

              <div className="text-sm text-gray-400">Not Selected</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl w-64 my-5">
              <Tab
                key={"invoices"}
                className={({ selected }) =>
                  classNames(
                    "w-full rounded-lg py-2.5 text-sm font-medium leading-5 ",
                    "ring-white ring-opacity-60 ring-offset-1 ring-offset-blue-400 focus:outline-none focus:ring-1",
                    selected
                      ? "bg-white border dark:bg-zinc-900 dark:text-white"
                      : "text-gray-500  hover:dark:text-white dark:text-gray-500"
                  )
                }
              >
                Invoices
              </Tab>
              <Tab
                key={"contracts"}
                className={({ selected }) =>
                  classNames(
                    "w-full rounded-lg py-2.5 text-sm font-medium leading-5 ",
                    "ring-white ring-opacity-60 ring-offset-1 ring-offset-blue-400 focus:outline-none focus:ring-1",
                    selected
                      ? "bg-white border dark:bg-zinc-900 dark:text-white"
                      : "text-gray-500  hover:dark:text-white dark:text-gray-500"
                  )
                }
              >
                Activity
              </Tab>
            </Tab.List>
            <Tab.Panels className="w-full">
              <Tab.Panel
                key={"General"}
                // className={classNames(
                //   "w-full text-white rounded-xl  p-3",
                //   "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                // )}
              >
                {/* Expanse list */}
                <section className="grid grid-cols-12 gap-2 dark:text-white">
                  <ExpenseList
                    invoiceId={invoiceId as string}
                    clientId={invoiceData.client_id}
                  />
                </section>
              </Tab.Panel>
              <Tab.Panel
                key={"Features"}
                className={classNames(
                  "rounded-xl text-white p-3",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                )}
              >
                Activity
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </main>
    </>
  );
};

const ExpenseList = ({
  invoiceId,
  clientId,
}: {
  invoiceId: string;
  clientId: string;
}) => {
  const { data: expenses, refetch } = trpc.useQuery([
    "expense.getByInvoice",
    { invoice_id: invoiceId },
  ]);

  const { data: worklogData } = trpc.useQuery([
    "worklog.getByInvoice",
    { invoice_id: invoiceId },
  ]);

  const [showAddWorklogModal] = useModal(WorklogAddModal, {
    title: "Add Worklogs",
  });

  const calcTotal = expenses?.reduce(
    (total, current) => (total += current.quantity * current.cost),
    0
  );
  const test = new Intl.NumberFormat(navigator.language, {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
  }).format(calcTotal ?? 0);
  return (
    <div className="col-span-12 dark:text-white">
      <div className="">
        <div className="col-span-12 grid grid-cols-12 text-[0.7rem] text-gray-400 dark:text-zinc-500 ">
          <span className="col-span-6 px-2 py-1">ITEM</span>
          <span className="col-span-2 px-2 py-1 text-right">QTY</span>
          <span className="col-span-3 px-2 py-1 text-right">COST</span>
        </div>
        {expenses?.length === 0 && worklogData?.length === 0 && (
          <div className="col-span-12 text-zinc-700 text-center text-xs my-4">
            No expenses
          </div>
        )}
        {expenses?.map((expense, index) => (
          <div
            key={index}
            className="col-span-12 hover:dark:bg-zinc-800 grid grid-cols-12 gap-1 py-1  items-center text-sm"
          >
            <div className="col-span-6 px-2 py-1 font-semibold flex items-center">
              <IconReceipt stroke={1} size={18} className="mr-2" />
              {expense.description}
            </div>
            <div className="col-span-2 px-2 py-1 text-right">
              {expense.quantity}
            </div>
            <div className="col-span-3 px-2 py-1 text-right">
              ${expense.cost}
            </div>
            <span className="col-span-1 flex items-center px-2 py-1">
              <IconButton
                aria-label="Edit instruction"
                onClick={async (e) => {
                  e.stopPropagation();
                  // remove(index);
                }}
              >
                <IconTrash
                  size={18} // set custom `width` and `height`
                  stroke={1} // set `stroke-width`
                  strokeLinejoin="miter" // override other SVG props
                />
              </IconButton>
            </span>
          </div>
        ))}
        {worklogData?.map((worklog) => (
          <WorklogRow key={worklog.id} worklog={worklog} />
        ))}
        <ExpenseAddForm invoiceId={invoiceId} />

        <div className="my-4 flex gap-2">
          <button
            type="button"
            className="py-2 px-4  text-neutral-500 rounded-lg text-sm flex items-center hover:font-medium"
            onClick={() =>
              showAddWorklogModal({
                data: { client_id: clientId, invoice_id: invoiceId as string },
              })
            }
          >
            <IconPlus stroke={1} size={18} className="mr-1" />
            Attach Worklog
          </button>
          <div className="col-span-6 text-right ml-auto">
            <div className="text-gray-400 text-xs">TOTAL</div>
            <span className="text-sm text-zinc-600"></span> {test}
          </div>
        </div>
      </div>
    </div>
  );
};

const WorklogRow = ({ worklog }: { worklog: Worklog }) => (
  <div className="col-span-12 grid grid-cols-12 gap-1 py-1 border-b border-gray-200 dark:border-zinc-700 items-center text-sm">
    <div className="col-span-5 px-2 py-1 font-semibold flex items-center">
      <IconClock stroke={1} size={18} className="mr-2" />
      {worklog.description}
    </div>
    <div className="col-span-3 px-2 py-1 text-right">
      {renderTimerValue(worklog.value / 3600)} @ {formatCurrency(worklog.rate)}{" "}
      / h
    </div>
    <div className="col-span-3 px-2 py-1 text-right">
      {formatNumber((worklog?.rate ?? 0) * (worklog.value / 3600))}
    </div>
    <span className="col-span-1 flex items-center px-2 py-1">
      <IconButton
        aria-label="Edit instruction"
        onClick={async (e) => {
          e.stopPropagation();
          // remove(index);
        }}
      >
        <IconTrash
          size={18} // set custom `width` and `height`
          stroke={1} // set `stroke-width`
          strokeLinejoin="miter" // override other SVG props
        />
      </IconButton>
    </span>
  </div>
);

export default ClientDetails;
