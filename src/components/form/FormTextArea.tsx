import { ReactNode } from "react";
import { FieldError, useController, UseControllerProps } from "react-hook-form";
interface InputProps<T>
  extends Omit<React.HTMLProps<HTMLTextAreaElement>, "defaultValue" | "name"> {
  leadingIcon?: ReactNode;
  trailing?: ReactNode;
  rounded?: "xs" | "sm" | "md" | "lg";
  error?: FieldError;
}
interface FormTextAreaProps<T> extends InputProps<T>, UseControllerProps<T> {}
export const FormTextArea = (props: FormTextAreaProps<T>) => {
  const {
    field: { onChange, onBlur, name, value, ref },
  } = useController(props);
  return (
    <div className={props.className} hidden={props.hidden}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {props.label}
      </label>
      <div
        className={`relative flex focus-within:z-10 ${props.label && "mt-1"}`}
      >
        {props.leadingIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {props.leadingIcon}
          </div>
        )}
        <textarea
          ref={ref}
          hidden={props.hidden}
          readOnly={props.readOnly}
          name={name}
          disabled={props.disabled}
          value={value}
          rows={2}
          onChange={(event) => {
            if (props.onChange) props.onChange(event);
            onChange(event.target.value);
          }}
          placeholder={props.placeholder}
          className={` border-2 grow border-gray-200 dark:border-gray-800 dark:bg-transparent dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500  rounded-${
            props.rounded
          } ${
            props.leadingIcon ? "pl-8 pr-4" : "px-3 py-3"
          } text-sm w-full disabled:text-gray-100 disabled:bg-gray-50`}
        />
        {props.trailing && props.trailing}
      </div>
      {props.error && (
        <p className="text-xs text-rose-500 mt-2">{props.error?.message}</p>
      )}
    </div>
  );
};

FormTextArea.defaultProps = {
  rounded: "md",
};
