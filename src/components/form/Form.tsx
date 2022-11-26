import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

interface FormProps {
  defaultValues: any;
  schema: Zod.AnyZodObject;
  children: JSX.Element | JSX.Element[];
  onSubmit: (e: any) => void;
  onError?: (e: any) => void;
}

function recursiveInjection(children, fn) {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child;
    }

    if (child.props.children) {
      child = React.cloneElement(child, {
        children: recursiveInjection(child.props.children, fn),
      });
    }

    return fn(child);
  });
}

const setChildren = (
  children: JSX.Element | JSX.Element[],
  methods: any
): JSX.Element | JSX.Element[] => {
  const newChildren = recursiveInjection(children, (child: JSX.Element) => {
    return child.props.name
      ? React.createElement(child.type, {
          ...{
            ...child.props,
            register: methods.register,
            errors: methods.formState.errors,
            key: child.props.name,
            watch: methods.watch,
            control: methods.control,
          },
        })
      : child;
  });
  return newChildren;
};

export const Form = ({
  defaultValues,
  schema,
  children,
  onSubmit,
  onError,
}: FormProps) => {
  const methods = useForm({ defaultValues, resolver: zodResolver(schema) });
  const { handleSubmit } = methods;
  const injectedChildren = setChildren(children, methods);
  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} style={{ width: "100%" }}>
      {injectedChildren}
    </form>
  );
};
