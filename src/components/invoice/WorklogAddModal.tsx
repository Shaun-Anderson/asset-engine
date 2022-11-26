import { zodResolver } from "@hookform/resolvers/zod";
import { Invoice } from "@prisma/client";
import { memo } from "react";
import { z } from "zod";
import { Modal } from "../Modal";
import { useForm } from "react-hook-form";
import { FormInput } from "../form";
import { trpc } from "../../utils/trpc";
import { renderTimerValue } from "../../utils/date";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  data: { invoice_id: string; client_id: string };
}

interface FormType {
  invoice_id: string;
  worklogs: string[];
}

export const WorklogAddModal = memo(function AddModal({
  isOpen,
  onClose,
  title,
  description,
  data,
}: ModalProps) {
  const schema = z.object({
    invoice_id: z.string(),
    worklogs: z.string().array().min(1, "Atleast 1 Worklog must be selected."),
  });

  const {
    control,
    handleSubmit,
    watch,
    register,
    reset,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: { ...data, worklogs: [] },
  });
  const ctx = trpc.useContext();

  const { data: worklogs, refetch } = trpc.useQuery([
    "worklog.getAvaliableForClient",
    { clientId: data.client_id },
  ]);

  const deleteMutation = trpc.useMutation(["invoice.insert_worklogs"], {
    onSuccess: () => {
      refetch();
      ctx.refetchQueries([
        "worklog.getByInvoice",
        { invoice_id: data.invoice_id },
      ]);
    },
  });

  const submit = (data: FormType) => {
    console.log(data);
    deleteMutation.mutate(data);
  };

  const watchWorklogs = watch("worklogs");

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
        <p>Add worklogs to this invoice</p>

        {worklogs?.length == 0 && (
          <p className="text-sm text-gray-400">No Worklogs found</p>
        )}

        <ul className="grid gap-6 w-full">
          {worklogs?.map((worklog) => (
            <li key={worklog.id}>
              <input
                type="checkbox"
                id={`worklog_${worklog.id}`}
                className="hidden peer"
                value={worklog.id}
                {...register("worklogs", { required: true })}
              />
              <label
                htmlFor={`worklog_${worklog.id}`}
                className="inline-flex justify-between items-center p-2 w-full text-gray-500 bg-white rounded-xl border border-gray-200 cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <div className="block">
                  <div className="w-full text-md font-semibold">
                    {worklog.description}
                  </div>
                  <div className="w-full text-sm flex">
                    {renderTimerValue(worklog.value)} @ {worklog.rate}/h
                  </div>
                </div>
              </label>
            </li>
          ))}
        </ul>
        {errors.worklogs && (
          <span className="text-rose-500 p-2">{errors.worklogs.message}</span>
        )}
        <button
          type="submit"
          disabled={watchWorklogs.length == 0}
          className="pointer-events-auto rounded-md my-4 py-2 px-3 text-[0.8125rem] font-semibold leading-5 text-emerald-500 bg-emerald-50 hover:bg-emerald-100"
        >
          Submit
        </button>
      </form>
    </Modal>
  );
});
