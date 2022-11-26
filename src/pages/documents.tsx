import { useEffect, useRef } from "react";
import { Tab } from "@headlessui/react";

function TaskList() {
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="">
      <div className="flex mt-5 mb-5">
        <div>
          <h1 className="text-2xl font-bold mt-5 dark:text-white">Settings</h1>
          <h2 className=" text-xs text-gray-500 mt-2">
            Effect how you program is set up.
          </h2>
        </div>
      </div>
      <div className="flex gap-2">
        <Tab.Group>
          <Tab.List className="flex flex-col space-y-1 rounded-xl w-64">
            <Tab
              key={"invoices"}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5 ",
                  "ring-white ring-opacity-60 ring-offset-1 ring-offset-blue-400 focus:outline-none focus:ring-1",
                  selected
                    ? "bg-white dark:bg-zinc-900 dark:text-white"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white dark:text-gray-500"
                )
              }
            >
              Invoices
            </Tab>
            <Tab
              key={"contracts"}
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700",
                  "ring-white ring-opacity-60 ring-offset-1 ring-offset-blue-400 focus:outline-none focus:ring-1",
                  selected
                    ? "bg-white dark:bg-zinc-900 dark:text-white"
                    : "text-blue-100  hover:text-white dark:text-gray-500"
                )
              }
            >
              Contracts
            </Tab>
          </Tab.List>
          <Tab.Panels className="w-full">
            <Tab.Panel
              key={"General"}
              className={classNames(
                "w-full text-white rounded-xl  p-3",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
              )}
            >
              General
            </Tab.Panel>
            <Tab.Panel
              key={"Features"}
              className={classNames(
                "rounded-xl text-white p-3",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
              )}
            >
              Features
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}

export default TaskList;
