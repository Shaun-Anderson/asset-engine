import { Switch as BaseSwitch } from "@headlessui/react";
import { useState } from "react";

interface SwitchProps<T>
  extends Omit<React.HTMLProps<HTMLButtonElement>, "size"> {
  size: "small" | "large";
  disabled?: boolean;
  enabled: boolean;
}
export const Switch = (props: SwitchProps<T>) => {
  const [enabled, setEnabled] = useState(props.enabled);
  const switchSize = props.size === "large" ? "h-6 w-11" : "h-5 w-10";
  const controlSize = props.size === "large" ? "h-4 w-4" : "h-3 w-3";
  return (
    <BaseSwitch
      // name={name}
      disabled={props.disabled}
      onBlur={props.onBlur}
      onChange={setEnabled}
      checked={props.enabled}
      className={`${
        props.enabled ? "bg-indigo-600" : "bg-gray-200"
      } relative inline-flex ${switchSize} items-center rounded-full disabled:bg-gray-100 disabled:border disabled:border-gray-200`}
    >
      <span className="sr-only">Enable notifications</span>
      <span
        className={`transform transition ease-in-out duration-200 ${
          props.enabled ? "translate-x-6" : "translate-x-1"
        } inline-block ${controlSize} transform rounded-full bg-white`}
      />
    </BaseSwitch>
  );
};
