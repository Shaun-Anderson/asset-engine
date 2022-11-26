import { Menu as BaseMenu, Transition } from "@headlessui/react";
import {
  FC,
  Fragment,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import { IconDotsVertical } from "@tabler/icons";
import { usePopper } from "../hooks/use-popper";

export const Menu: FC = (props: PropsWithChildren<{}>) => {
  const [trigger, container] = usePopper({
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
          className="inline-flex w-full justify-center rounded-md bg-transparent px-2 py-2 text-sm font-medium text-violet-200 hover:text-indigo-500 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          <IconDotsVertical className=" h-4 w-4 " aria-hidden="true" />
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
            <div className="px-1 py-1 ">{props.children}</div>
          </BaseMenu.Items>
        </Transition>
      </div>
    </BaseMenu>
  );
};
