import { ReactNode } from "react";
import { FieldError, useController, UseControllerProps } from "react-hook-form";
import { useRanger } from "react-ranger";

interface InputProps<T>
  extends Omit<React.HTMLProps<HTMLInputElement>, "defaultValue" | "name"> {
  leadingIcon?: ReactNode;
  trailing?: ReactNode;
  rounded?: "xs" | "sm" | "md" | "lg";
  error?: FieldError;
}
interface FormRangeProps<T> extends InputProps<T>, UseControllerProps<T> {}
export const FormRange = (props: FormRangeProps<T>) => {
  const {
    field: { onChange, onBlur, name, value, ref },
  } = useController(props);

  const { getTrackProps, ticks, handles, segments } = useRanger({
    values: [value],
    onChange: (values) => {
      onChange(values[0]);
    },
    min: 1,
    max: 10,
    stepSize: 1,
    steps: Array.from({ length: 10 }, (_, i) => i + 1),
    ticks: Array.from({ length: 10 }, (_, i) => i + 1),
  });

  return (
    <div className={props.className + " mb-8"} hidden={props.hidden}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-2 "
      >
        {props.label}
      </label>
      <div
        {...getTrackProps({
          style: {
            height: "15px",
            background: "#ddd",
            borderRadius: "10px",
            paddingLeft: "50px",
          },
        })}
        className="mx-3"
      >
        {ticks.map(({ value, getTickProps }, index) => (
          <div
            {...getTickProps({
              style: {
                position: "absolute",
                fontSize: "0.6rem",
                color: "rgba(0, 0, 0, 0.5)",
                top: "100%",
                whiteSpace: "nowrap",
              },
            })}
            key={index}
            className="before: content-['0']"
          >
            <div
              style={{
                position: "absolute",
                fontSize: "0.6rem",
                color: "rgba(0, 0, 0, 0.5)",
                top: "100%",
                transform: "translate(-50%, 0.1rem)",
                whiteSpace: "nowrap",
              }}
            >
              {value === 10 ? "10+" : value}
            </div>
          </div>
        ))}
        {segments.map(({ getSegmentProps }, i) => (
          <div
            {...getSegmentProps()}
            key={i}
            className={`${i === 0 ? "bg-indigo-500" : ""} h-4 rounded-full`}
          ></div>
        ))}
        {handles.map(({ getHandleProps }, index) => (
          <button
            type="button"
            {...getHandleProps({
              style: {
                width: "24px",
                height: "24px",
                outline: "none",
                borderRadius: "100%",
                // background: "linear-gradient(to bottom, #eee 45%, #ddd 55%)",
                // border: "solid 1px #888",
              },
            })}
            className="bg-indigo-500 border-2 border-white"
            key={index}
          />
        ))}
      </div>

      {props.error && (
        <p className="text-xs text-rose-500 mt-2">{props.error?.message}</p>
      )}
    </div>
  );
};

FormRange.defaultProps = {
  rounded: "md",
};
