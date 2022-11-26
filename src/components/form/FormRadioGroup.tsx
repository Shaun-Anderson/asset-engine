import { RadioGroup } from "@headlessui/react";
import { PropsWithChildren } from "react";
import { UseControllerProps, useController } from "react-hook-form";

interface FormRadioGroupProps<T> extends UseControllerProps<T> {
  label?: string
}
export const FormRadioGroup = (props: PropsWithChildren<FormRadioGroupProps<T>>) => {
  const {
    field: { onChange, onBlur, name, value, ref },
  } = useController(props);

  return (
    <RadioGroup value={value} onChange={onChange}>
      <RadioGroup.Label className="sr-only">{props.label}</RadioGroup.Label>
      <div className="space-y-2">
      {props.children}
      </div>
    </RadioGroup>
  );
};
