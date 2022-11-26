import { Transition, Dialog } from "@headlessui/react";
import { IconX } from "@tabler/icons";
import { Fragment } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
}
export const Modal = (props: React.PropsWithChildren<ModalProps>) => {
  const { isOpen, onClose, title, description, children } = props;
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-lg dark:text-white bg-white border dark:border-zinc-800 dark:bg-zinc-900 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-md font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    {title}
                  </Dialog.Title>
                  <div className=" ml-auto">
                    <button
                      className="relative rounded-md inline-flex items-center px-2 py-2 text-sm font-medium text-gray-400 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800"
                      onClick={onClose}
                    >
                      <IconX
                        size={18} // set custom `width` and `height`
                        stroke={1} // set `stroke-width`
                        strokeLinejoin="miter"
                      />
                    </button>
                  </div>
                </div>
                {description ? (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-zinc-300">
                      {description}
                    </p>
                  </div>
                ) : null}
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
