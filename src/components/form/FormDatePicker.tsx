import { ReactNode } from "react";
import { FieldError, useController, UseControllerProps } from "react-hook-form";
import { DatePicker } from "../Datepicker";
interface InputProps
  extends Omit<
    React.HTMLProps<HTMLInputElement>,
    "defaultValue" | "name" | "size" | "onChange"
  > {
  leadingIcon?: ReactNode;
  trailing?: ReactNode;
  rounded?: "xs" | "sm" | "md" | "lg";
  error?: FieldError;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  onChange?: (date: Date) => void;
}

interface FormInputProps<T> extends InputProps, UseControllerProps<T> {}
export const FormDatePicker = (props: FormInputProps<T>) => {
  const {
    field: { onChange, name, value },
  } = useController(props);
  return (
    <div className={props.className} hidden={props.hidden}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {props.label}
      </label>
      <div
        className={`relative focus-within:z-10 ${
          props.label && "mt-1"
        } h-full w-full`}
      >
        <DatePicker
          className="col-span-6 h-full"
          date={value}
          onChange={(e) => {
            if (props.onChange) props.onChange(e);
            onChange(e);
          }}
        />
      </div>
      {props.error && (
        <p className="text-xs text-rose-500 mt-2">{props.error?.message}</p>
      )}
    </div>
  );
};

FormDatePicker.defaultProps = {
  rounded: "md",
  size: "md",
};
