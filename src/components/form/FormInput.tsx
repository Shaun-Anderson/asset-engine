import { ReactNode } from "react";
import { FieldError, useController, UseControllerProps } from "react-hook-form";
interface InputProps<T>
  extends Omit<
    React.HTMLProps<HTMLInputElement>,
    "defaultValue" | "name" | "size"
  > {
  leadingIcon?: ReactNode;
  trailing?: ReactNode;
  rounded?: "xs" | "sm" | "md" | "lg";
  error?: FieldError;
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "default" | "flush";
  rtl?: boolean;
}

const getSize = (size: string) => {
  switch (size) {
    case "md":
      return "px-2 py-3";
    case "lg":
      return "px-3 py-4";
  }
};

interface FormInputProps<T> extends InputProps<T>, UseControllerProps<T> {}
export const FormInput = (props: FormInputProps<T>) => {
  const {
    field: { onChange, onBlur, name, value, ref },
  } = useController(props);
  return (
    <div className={props.className} hidden={props.hidden}>
      {props.label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {props.label}
        </label>
      )}
      <div
        className={`relative flex focus-within:z-10 ${props.label && "mt-1"}`}
      >
        {props.leadingIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none dark:text-white">
            {props.leadingIcon}
          </div>
        )}
        <input
          ref={ref}
          type={props.type}
          hidden={props.hidden}
          readOnly={props.readOnly}
          name={name}
          maxLength={props.maxLength}
          max={props.max}
          disabled={props.disabled}
          value={value}
          onBlur={props.onBlur}
          onChange={(event) => {
            if (props.onChange) props.onChange(event);
            if (props.type === "number") {
              const v =
                event.target.value === ""
                  ? undefined
                  : event.target.valueAsNumber;
              onChange(v);
            } else {
              onChange(event.target.value);
            }
          }}
          placeholder={props.placeholder}
          className={` grow ${
            props.variant == "default"
              ? "border border-gray-200 dark:border-zinc-800 focus:ring-indigo-500 focus:border-indigo-500 "
              : " bg-transparent focus:ring-transparent "
          }focus:outline-none focus:ring-1 ${
            props.rtl && "rtl-input"
          }  rounded-${props.rounded} ${
            props.leadingIcon ? "pl-8 pr-4" : "px-3"
          } text-sm w-full disabled:text-gray-100 disabled:bg-gray-50 dark:disabled:bg-gray-900 dark:bg-transparent  dark:text-white dark:placeholder-gray-600 ${getSize(
            props.size ?? "md"
          )}`}
        />
        {props.trailing && props.trailing}
      </div>
      {props.error && (
        <p className="text-xs text-rose-500 mt-2">{props.error?.message}</p>
      )}
    </div>
  );
};

FormInput.defaultProps = {
  rounded: "lg",
  size: "md",
  variant: "default",
  rtl: false,
};
