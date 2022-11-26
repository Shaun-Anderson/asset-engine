import { zodResolver } from "@hookform/resolvers/zod";
import { Expense, Invoice } from "@prisma/client";
import { IconPlus } from "@tabler/icons";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Accent } from "../../utils/color";
import { trpc } from "../../utils/trpc";
import { IconButton } from "../design-system";
import { FormInput } from "../form";

export const ExpenseAddForm = ({ invoiceId }: { invoiceId: string }) => {
  const schema = z.object({
    invoice_id: z.string(),
    description: z.string().min(1, { message: "Required" }),
    quantity: z.number(),
    cost: z.number(),
  });

  const ctx = trpc.useContext();
  const router = useRouter();

  const createMutation = trpc.useMutation(["expense.create"], {
    onSuccess: () => {
      reset();
      ctx.refetchQueries(["expense.getByInvoice"]);
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Expense>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: "",
      invoice_id: invoiceId,
    },
  });

  const submit = (data: Expense) => {
    console.log(data);
    createMutation.mutate({
      invoice_id: invoiceId,
      description: data.description,
      quantity: data.quantity,
      cost: data.cost,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(submit, (errors) => console.log(errors))}
      className="col-span-12 grid grid-cols-12 gap-1 my-1"
    >
      <FormInput
        placeholder="Description"
        variant="flush"
        control={control}
        name={`description`}
        className="col-span-6"
      />
      <FormInput
        control={control}
        variant="flush"
        placeholder="Quantity"
        type="number"
        rtl
        name={`quantity`}
        className="col-span-2"
      />
      <FormInput
        control={control}
        variant="flush"
        rtl
        placeholder="Cost"
        type="number"
        name={`cost`}
        className="col-span-3"
      />
      <button className="col-span-1 flex items-center px-2 py-1">
        <IconButton
          aria-label="Edit instruction"
          onClick={async (e) => {
            e.stopPropagation();
            // remove(index);
          }}
        >
          <IconPlus
            size={18} // set custom `width` and `height`
            stroke={2} // set `stroke-width`
            strokeLinejoin="miter" // override other SVG props
          />
        </IconButton>
      </button>
    </form>
  );
};
