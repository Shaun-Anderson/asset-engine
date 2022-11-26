import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../../utils/trpc";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Client, Worklog } from "@prisma/client";
import { FormDatePicker, FormInput, FormSelect, FormTextArea } from "../form";
import {
  IconCoin,
  IconDeviceFloppy,
  IconPlayerPause,
  IconPlayerPlay,
} from "@tabler/icons";
import { useEffect, useRef } from "react";
import { useTimer, useTimerPause, useTimerRunning } from "../../hooks/timer";
import { useRecoilState, useResetRecoilState } from "recoil";
import { timerObjectState } from "../../utils/timerState";

function convertHMS(value: number): {
  seconds: number;
  minutes: number;
  hours: number;
} {
  const hours = Math.floor(value / 3600); // get hours
  const minutes = Math.floor((value - hours * 3600) / 60); // get minutes
  const seconds = value - hours * 3600 - minutes * 60; //  get seconds
  // add 0 if value < 10; Example: 2 => 02
  // if (hours < 10) {
  //   hours = "0" + hours;
  // }
  // if (minutes < 10) {
  //   minutes = "0" + minutes;
  // }
  // if (seconds < 10) {
  //   seconds = "0" + seconds;
  // }
  return { hours, minutes, seconds };
}

const WorklogPopoverEditForm = ({ worklog }: { worklog: Worklog }) => {
  const schema = z.object({
    description: z.string(),
    rate: z.number().optional(),
    client_id: z.string().optional(),
    recorded_at: z.date().optional(),
    hours: z.number(),
    minutes: z.number(),
    seconds: z.number(),
  });
  const splitValues = convertHMS(worklog.value);
  const { control, handleSubmit, reset } = useForm<
    Worklog & { seconds: number; minutes: number; hours: number }
  >({
    resolver: zodResolver(schema),
    defaultValues: {
      ...worklog,
      seconds: splitValues.seconds,
      minutes: splitValues.minutes,
      hours: splitValues.hours,
    },
  });

  const ctx = trpc.useContext();
  const { data: clientData } = trpc.useQuery(["client.get"]);

  const updateMutation = trpc.useMutation(["worklog.update"], {
    onSuccess: () => {
      // router.push("/invoices");
      ctx.refetchQueries(["worklog.get"]);
    },
  });

  const submit = async (data: Worklog) => {
    console.log(data);
    await updateMutation.mutateAsync({
      description: data.description,
      value: data.value,
      rate: data.rate ? (data.rate as number) : undefined,
      client_id: data.client_id ?? undefined,
      recorded_at: data.recorded_at,
    });
    reset();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(submit, (errors) => console.log(errors))}
        className={`p-1 rounded-lg flex gap-2 justify-between border-zinc-600 dark:bg-transparent`}
      >
        <div className="grow flex flex-col gap-1">
          <FormTextArea
            control={control}
            name="description"
            rounded="lg"
            placeholder="What are you up to?"
          />
          <FormSelect<Client, Worklog>
            data={clientData ?? []}
            name="client_id"
            control={control}
            // className="w-64"
            valueProp="id"
            labelProp="name"
            placeholder="Select a client"
            labelRender={(data) => (
              <>
                <p>{data.name}</p>
                <p className="text-xs text-zinc-700">{data.company}</p>
              </>
            )}
            valueRender={(data) => (
              <>
                <p>{data.name}</p>
                <p className="text-xs text-zinc-700">{data.company}</p>
              </>
            )}
          />
          <FormDatePicker control={control} name="recorded_at" />
          <FormInput
            leadingIcon={<IconCoin strokeWidth={1} size={18} />}
            type="number"
            control={control}
            name="rate"
            rounded="lg"
            placeholder="Rate/h"
          />
          <h4>Time values</h4>
          <div className="flex items-center gap-4 justify-center text-white w-full">
            <span className=" mr-2 text-sm flex gap-2 items-end">
              <FormInput name="hours" control={control} maxLength={2} />
              <span className="text-xs dark:text-zinc-600">H</span>
            </span>
            <span className=" mr-2 text-sm flex gap-2 items-end">
              <FormInput
                name="minutes"
                control={control}
                maxLength={2}
                max={60}
              />
              <span className="text-xs dark:text-zinc-600">M</span>
            </span>
            <span className=" text-sm flex gap-2 items-end">
              <FormInput
                name="seconds"
                control={control}
                maxLength={2}
                max={60}
              />
              <span className="text-xs dark:text-zinc-600">S</span>
            </span>
          </div>
          <div className="flex rounded-lg justify-between">
            <button
              type="submit"
              className={`rounded-md text-sm font-medium w-10 h-10 bg-emerald-900 dark:text-emerald-300 hover:disabled:text-emerald-300  disabled:bg-emerald-900/50 flex justify-center text-black hover:bg-emerald-800 hover:text-emerald-50 items-center`}
            >
              <IconDeviceFloppy strokeWidth={1} size={18} />
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default WorklogPopoverEditForm;
