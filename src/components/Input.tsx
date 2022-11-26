import { ReactNode } from "react";
interface InputProps extends React.HTMLProps<HTMLInputElement> {
  leadingIcon?: ReactNode;
  trailing?: ReactNode;
  rounded?: "xs" | "sm" | "md" | "lg";
  variant?: "default" | "flush";
}
export const Input = ({
  rounded,
  className,
  value,
  name,
  disabled,
  onChange,
  leadingIcon,
  placeholder,
  trailing,
  label,
  defaultValue,
  variant,
}: InputProps) => {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className={`relative flex focus-within:z-10 ${label && "mt-1"}`}>
        {leadingIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leadingIcon}
          </div>
        )}
        <input
          name={name}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          placeholder={placeholder}
          className={`h-10 ${
            variant === "default"
              ? "border border-gray-200 dark:border-gray-800"
              : ""
          } grow  focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 block rounded-${rounded} ${
            leadingIcon ? "pl-8 pr-4" : "px-3"
          } text-sm w-full disabled:text-gray-100 disabled:bg-gray-50 dark:bg-transparent  dark:text-white dark:placeholder-gray-600`}
        />
        {trailing && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {trailing}
          </div>
        )}
      </div>
    </div>
  );
};

Input.defaultProps = {
  rounded: "md",
  variant: "default",
};
