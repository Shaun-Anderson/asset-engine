import { zodResolver } from "@hookform/resolvers/zod";
import { Instruction, Invoice } from "@prisma/client";
import { memo } from "react";
import { z } from "zod";
import { Modal } from "../Modal";
import { useForm } from "react-hook-form";
import { FormInput } from "../form";
import { trpc } from "../../utils/trpc";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  data: Instruction;
  recipeId: string;
}

export const DeleteModal = memo(function AddModal({
  isOpen,
  onClose,
  title,
  description,
  data,
  invoiceId,
}: ModalProps) {
  const schema = z.object({
    id: z.string(),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Invoice>({
    resolver: zodResolver(schema),
    defaultValues: data,
  });
  const ctx = trpc.useContext();

  const deleteMutation = trpc.useMutation(["invoice.delete"], {
    onSuccess: () => {
      ctx.refetchQueries(["invoice.get"]);
    },
  });

  const submit = (data: Invoice) => {
    console.log(data);
    deleteMutation.mutate({ id: data.id });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
    >
      <form
        className="flex flex-col gap-4 text-[0.8125rem]"
        onSubmit={handleSubmit(submit, (errors) => console.log(errors))}
      >
        <FormInput name="recipeId" control={control} readOnly hidden />
        <p>Are you sure you want to delete this invoice?</p>
        <button
          type="submit"
          className="pointer-events-auto rounded-md my-4 py-2 px-3 text-[0.8125rem] font-semibold leading-5 text-emerald-500 bg-emerald-50 hover:bg-emerald-100"
        >
          Submit
        </button>
      </form>
    </Modal>
  );
});
