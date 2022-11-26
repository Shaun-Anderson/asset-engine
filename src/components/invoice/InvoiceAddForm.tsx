import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../../utils/trpc";
import {
  UseControllerProps,
  useFieldArray,
  useForm,
  UseFormSetValue,
} from "react-hook-form";
import { z } from "zod";
import { Expense, Invoice, Worklog } from "@prisma/client";
import { Form, FormSelect, FormSwitch } from "../form";
import { useRouter } from "next/router";
import { FormDatePicker } from "../form/FormDatePicker";
import { IconTrash } from "@tabler/icons";
import { renderTimerValue } from "../../utils/date";
import {
  Flex,
  IconButton,
  SelectItem,
  Text,
  Select,
  Grid,
  Box,
  Avatar,
  Heading,
  Card,
} from "../design-system";
import { TextField } from "../form/TextField";
import { Button } from "../Button";

type FormType = Invoice & { expenses: Expense[]; worklogs: Worklog[] };

const FeatureTitle = ({
  title,
  description,
  disabled,
}: {
  title: string;
  description: string;
  disabled?: boolean;
}) => (
  <Flex direction={"column"} gap={1} css={{ flexGrow: 1 }}>
    <Heading
      as="h4"
      size="1"
      // className={`text-sm font-medium leading-5 dark:text-white ${
      //   disabled ? "text-gray-300" : ""
      // }`}
    >
      {title}
    </Heading>
    <Text
      as="h5"
      size={2}
      className={` text-xs ${
        disabled ? "text-gray-300" : "text-gray-500"
      } mt-2`}
    >
      {description}
    </Text>
  </Flex>
);

export const InvoiceAddForm = () => {
  const { data: clientData } = trpc.useQuery(["client.get"]);

  const schema = z.object({
    due_date: z.date(),
    footer_message: z.string(),
    client_id: z.string({
      required_error: "Client is required",
    }),
    consume_worklogs: z.boolean(),
    expenses: z
      .object({
        description: z.string().min(1, { message: "Required" }),
        quantity: z.number(),
        cost: z.number(),
      })
      .array(),
    worklogs: z
      .object({
        id: z.string().min(1, { message: "Required" }),
        value: z.number(),
        rate: z.number(),
      })
      .array(),
  });

  const ctx = trpc.useContext();
  const router = useRouter();

  const createMutation = trpc.useMutation(["invoice.create"], {
    onSuccess: () => {
      router.push("/invoices");
      // ctx.refetchQueries(["client.get"]);
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      due_date: new Date(),
      consume_worklogs: false,
    },
  });

  const submit = (data: FormType) => {
    console.log(data);
    createMutation.mutate({
      ...data,
    });
  };

  const watchClientId = watch("client_id");

  return (
    <form
      onSubmit={handleSubmit(submit, (errors) => console.log(errors))}
      className="grid grid-cols-12 gap-2 dark:bg-zinc-900 p-4 rounded-lg"
    >
      <div className="col-span-12">
        <Select
          name="client_id"
          placeholder="Select a client"
          control={control}
        >
          {clientData?.map((client) => (
            <SelectItem key={client.id} value={client.id}>
              <Flex align={"center"} gap={2}>
                <Avatar />
                <Flex direction={"column"} gap={1}>
                  <Text variant={"inherit"}>{client.name} </Text>
                  {client.company && (
                    <Text size={2} variant={"inherit"}>
                      {client.company}
                    </Text>
                  )}
                </Flex>
              </Flex>
            </SelectItem>
          ))}
        </Select>
      </div>
      <TextField
        name="footer_message"
        label="Footer message"
        control={control}
        colSpan={12}
      />

      <FormDatePicker
        className="col-span-6"
        control={control}
        name="due_date"
      />
      {watchClientId && (
        <>
          <ExpenseList
            name="expenses"
            setValue={setValue}
            control={control}
            clientId={watchClientId}
          />
          <div className="flex gap-2 col-span-12">
            <FeatureTitle
              title={"Consume worklogs"}
              description={`While in draft mode automatically add all worklogs for ${
                clientData?.find((x) => x.id == watchClientId)?.name
              } that are not already attached to an invoice`}
            />
            <div>
              <FormSwitch
                control={control}
                name="consume_worklogs"
                size="large"
              />
            </div>
          </div>
        </>
      )}
      <button
        className="h-10 mt-10 col-span-12 pointer-events-auto rounded-md px-3 text-[0.8125rem] font-semibold leading-5 text-emerald-500 bg-emerald-100 hover:bg-emerald-100 dark:bg-emerald-900 dark:text-emerald-600 dark:hover:bg-emerald-800"
        type="submit"
      >
        Add
      </button>
    </form>
  );
};

const ExpenseList = (
  props: {
    clientId: string;
    setValue: UseFormSetValue<FormType>;
  } & UseControllerProps<T>
) => {
  const { data: worklogData } = trpc.useQuery([
    "worklog.getAvaliableForClient",
    { clientId: props.clientId },
  ]);

  const { control, setValue } = props;
  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "expenses", // unique name for your Field Array
  });
  const {
    fields: worklogFields,
    append: worklogsAppend,
    remove: worklogsRemove,
  } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "worklogs", // unique name for your Field Array
  });
  return (
    <Card colSpan={12} css={{ p: "$3" }}>
      <Heading size="1">Expenses</Heading>
      <div className="my-2 flex gap-2">
        <Button
          size={1}
          onClick={() => append({ description: "", quantity: 1 })}
          type="button"
        >
          Add manual
        </Button>
        <Button
          size={1}
          type="button"
          disabled={worklogData?.length === 0}
          onClick={() => worklogsAppend({ description: "", quantity: 1 })}
        >
          {" "}
          Add worklog ({worklogData?.length} avaliable)
        </Button>
      </div>

      <Grid columns={12} gap={2} gapY={2} css={{ marginBottom: "$1" }}>
        <Text colSpan={6} size={1}>
          Description
        </Text>
        <Text colSpan={2} size={1}>
          Quantity
        </Text>
        <Text colSpan={3} size={1}>
          Cost
        </Text>
      </Grid>
      {fields.length === 0 && worklogFields.length === 0 && (
        <div className="col-span-12 text-zinc-700 text-center text-xs my-4">
          No expenses
        </div>
      )}
      {worklogFields.map((field, index) => (
        <div key={index} className="col-span-12 grid grid-cols-12 gap-1 my-1 ">
          <FormSelect<Worklog, FormType>
            data={worklogData ?? []}
            name={`worklogs.${index}.id`}
            control={control}
            className="col-span-11"
            valueProp="id"
            labelProp="name"
            onChange={(e) => {
              setValue(`worklogs.${index}.value`, e.value);
              setValue(`worklogs.${index}.rate`, e.rate);
            }}
            // error={errors.client_id}
            placeholder="Select a client"
            labelRender={(data) => (
              <>
                <p>{data.description}</p>
                <div className="text-xs text-zinc-700">
                  {renderTimerValue(data.value)} @ {data.rate}/h
                </div>
              </>
            )}
            valueRender={(data) => (
              <>
                <p>{data.description}</p>
                <div className="text-xs text-zinc-700">
                  {renderTimerValue(data.value)} @ {data.rate}/h
                </div>
              </>
            )}
          />

          <span className="col-span-1 flex items-center">
            <IconButton
              aria-label="Edit instruction"
              onClick={async (e) => {
                e.stopPropagation();
                worklogsRemove(index);
              }}
            >
              <IconTrash
                size={18} // set custom `width` and `height`
                stroke={1} // set `stroke-width`
                strokeLinejoin="miter" // override other SVG props
              />
            </IconButton>
          </span>
        </div>
      ))}
      <Grid columns={12} gap={2} gapY={2}>
        {fields.map((field, index) => (
          <>
            <TextField
              name={`expenses.${index}.description`}
              colSpan={6}
              control={control}
            />
            <TextField
              name={`expenses.${index}.quantity`}
              className="col-span-2"
              placeholder="Qty"
              type="number"
              step=".01"
              control={control}
              colSpan={2}
            />
            <TextField
              name={`expenses.${index}.cost`}
              className="col-span-3"
              placeholder="Cost"
              type="number"
              step=".01"
              control={control}
              colSpan={3}
            />
            <Flex align={"center"} colSpan={1} justify="center">
              <IconButton
                color={"red"}
                aria-label="Edit instruction"
                onClick={async (e) => {
                  e.stopPropagation();
                  remove(index);
                }}
              >
                <IconTrash
                  size={18} // set custom `width` and `height`
                  stroke={1} // set `stroke-width`
                  strokeLinejoin="miter" // override other SVG props
                />
              </IconButton>
            </Flex>
          </>
        ))}
      </Grid>
    </Card>
  );
};
