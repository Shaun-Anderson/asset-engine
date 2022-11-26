import { Menu as BaseMenu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { DotsVerticalIcon, DownloadIcon } from "@heroicons/react/outline";
import { usePopper } from "~/hooks/use-popper";

export const ExportMenu = ({ excelExport }: { excelExport: any }) => {
  let [trigger, container] = usePopper({
    placement: "bottom",
    strategy: "fixed",
    modifiers: [
      {
        name: "flip",
        options: {
          fallbackPlacements: ["top"],
          padding: 100,
          // rootBoundary: "document",
        },
      },
    ],
  });

  return (
    <BaseMenu as="div" className="relative inline-block text-left">
      <div>
        <BaseMenu.Button
          ref={trigger}
          className=" rounded-md bg-transparent text-gray-400 hover:text-gray-500  p-2 hover:bg-gray-100"
        >
          <DownloadIcon className="h-4 w-4 " aria-hidden="true" />
        </BaseMenu.Button>
      </div>
      <div ref={container} className="z-10">
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <BaseMenu.Items className="absolute z-10 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              <BaseMenu.Item>
                {({ active }) => (
                  <button
                    onClick={() => excelExport()}
                    className={`${
                      active ? "bg-indigo-600 text-white" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    Excel
                  </button>
                )}
              </BaseMenu.Item>
              <BaseMenu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-violet-500 text-white" : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    CSV
                  </button>
                )}
              </BaseMenu.Item>
            </div>
          </BaseMenu.Items>
        </Transition>
      </div>
    </BaseMenu>
  );
};
