import { Popover as BasePopover, Transition } from "@headlessui/react";
import { IconChevronDown } from "@tabler/icons";
import { Fragment, ReactNode, useState } from "react";
import { usePopper } from "react-popper";

interface PopoverProps extends React.PropsWithChildren {
  buttonNode: ReactNode;
}
const Popover: React.FC<PopoverProps> = (props) => {
  const { buttonNode, children } = props;
  const [referenceElement, setReferenceElement] = useState();
  const [popperElement, setPopperElement] = useState();
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "right",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 20],
        },
      },
    ],
  });
  return (
    <BasePopover>
      {({ open }) => (
        <>
          <BasePopover.Button as="div" ref={setReferenceElement}>
            {buttonNode}
          </BasePopover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 "
            enterTo="opacity-100 "
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 "
            leaveTo="opacity-0"
          >
            <BasePopover.Panel
              ref={setPopperElement}
              style={styles.popper}
              {...attributes.popper}
              className="z-20"
            >
              {({ close }) => (
                <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  {children}
                </div>
              )}
            </BasePopover.Panel>
          </Transition>
        </>
      )}
    </BasePopover>
  );
};
export default Popover;
