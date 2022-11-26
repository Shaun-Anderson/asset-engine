import { Fragment, ReactNode, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
// import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import {
  FieldError,
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";
import { IconCaretDown, IconCheck } from "@tabler/icons";

interface FormSelectProps<T, J extends FieldValues>
  extends UseControllerProps<J>,
    Omit<React.HTMLProps<HTMLInputElement>, "defaultValue" | "name" | "data"> {
  data: T[];
  labelProp: string;
  labelRender: (data: T) => ReactNode;
  valueRender: (data: T) => ReactNode;
  onChange?: (data: T) => void;
  valueProp: string;
  placeholder: string;
  error?: FieldError;
}

export function FormSelect<T, J extends FieldValues>(
  props: FormSelectProps<T, J>
) {
  const { data, className } = props;
  const {
    field: { onChange, onBlur, value, ref },
  } = useController(props);
  const [selected, setSelected] = useState<T>(data.find((x) => x.id == value));
  return (
    <div className={` cursor-pointer ${className}`}>
      <Listbox
        value={selected}
        onChange={(e) => {
          console.log(e);
          setSelected(e);
          if (props.onChange) props.onChange(e);
          onChange(e[props.valueProp] ?? undefined);
        }}
      >
        <div className="relative">
          <Listbox.Button className="relative w-full min-w-[100px] min-h-[46px] cursor-pointer rounded-lg bg-white  pl-3 py-2 pr-10 text-left border border-zinc-300 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm dark:text-white dark:bg-transparent dark:border-gray-800">
            <span className="block truncate">
              {selected ? props.valueRender(selected) : props.placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <IconCaretDown className="text-gray-300" size={18} stroke={1} />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 min-w-[200px] w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border dark:border-zinc-800 dark:bg-zinc-900 ">
              {data.map((item, personIdx) => (
                <Listbox.Option
                  key={personIdx}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active
                        ? "bg-emerald-100 text-emerald-900 dark:text-white dark:bg-zinc-800"
                        : "text-gray-900 dark:text-zinc-500"
                    }`
                  }
                  value={item}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected
                            ? "font-medium dak:text-white"
                            : "font-normal "
                        }`}
                      >
                        {props.labelRender(item)}
                        {/* {item[props.labelProp].toString()} */}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600 dark:text-white">
                          <IconCheck size={18} stroke={1} />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      {props.error && (
        <p className="text-xs text-rose-500 mt-2">{props.error?.message}</p>
      )}
    </div>
  );
}
