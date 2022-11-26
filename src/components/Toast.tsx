import { Transition } from "@headlessui/react";
import { IconCheck } from "@tabler/icons";
import { ReactNode } from "react";
import { Accent } from "../utils/color";

interface ToastProps {
  text: string;
  visible: boolean;
  accent?: Accent;
  icon: ReactNode;
}

export const getColor = (color: Accent) => {
  switch (color) {
    case Accent.danger:
      return "text-rose-500 bg-white";
    case Accent.warning:
      return "text-amber-500 bg-white";
    case Accent.primary:
      return "text-indigo-500 bg-white";
    case Accent.success:
      return "bg-emerald-400 text-white";
    case Accent.default:
      return "bg-white";
  }
};

export const Toast = (props: ToastProps) => {
  const { visible, text, accent, icon } = props;
  return (
    <Transition
      appear
      show={visible}
      enter="transition-opacity duration-150"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        className={` px-6 py-4 shadow-xl flex items-center rounded-md ${getColor(
          accent ?? Accent.default
        )}`}
      >
        {icon && icon}
        {text}
      </div>
    </Transition>
  );
};

Toast.defaultProps = {
  accent: Accent.default,
};
