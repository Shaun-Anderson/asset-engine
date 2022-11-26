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

const WorklogPopoverForm = () => {
  const [timerObject, setTimerObject] = useRecoilState(timerObjectState);
  const resetTimerObject = useResetRecoilState(timerObjectState);

  const schema = z.object({
    description: z.string(),
    rate: z.number().optional(),
    client_id: z.string().optional(),
    recorded_at: z.date().optional(),
  });

  const { control, handleSubmit, reset } = useForm<Worklog>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: timerObject.description,
      rate: timerObject.rate,
      recorded_at: new Date(timerObject.recorded_at),
      client_id: timerObject.client_id,
    },
  });

  const ctx = trpc.useContext();
  const { data: clientData } = trpc.useQuery(["client.get"]);

  const [timerValue, setTimerValue] = useTimer();
  const [timerPaused, setTimerPause] = useTimerPause();
  const [timerRunning, setTimerRunning] = useTimerRunning();
  const timerRef = useRef<NodeJS.Timer>();

  const ToggleTimer = () => {
    if (!timerPaused) {
      clearInterval(timerRef.current);
    } else {
      setTimerRunning(true);
      timerRef.current = setInterval(() => {
        setTimerValue((prevTimeLeft: number) => {
          return prevTimeLeft + 1;
        });
      }, 1000);
    }
    setTimerPause(!timerPaused);
  };

  useEffect(() => {
    if (timerPaused) {
      clearInterval(timerRef.current);
    }
  }, [timerPaused]);

  const createMutation = trpc.useMutation(["worklog.create"], {
    onSuccess: () => {
      // router.push("/invoices");
      ctx.refetchQueries(["worklog.get"]);
      ctx.refetchQueries(["worklog.getByInvoice"]);
    },
  });

  const submit = async (data: Worklog) => {
    console.log(data);
    await createMutation.mutateAsync({
      description: data.description,
      value: timerValue,
      rate: data.rate ? (data.rate as number) : undefined,
      client_id: data.client_id ?? undefined,
      recorded_at: data.recorded_at,
    });
    setTimerRunning(false);
    setTimerPause(true);
    setTimerValue(0);
    resetTimerObject();
    reset();
    clearInterval(timerRef.current);
  };
  const dateTime = new Date(timerValue * 1000).toISOString();

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
            onChange={(value) =>
              setTimerObject({
                ...timerObject,
                description: value.currentTarget.value,
              })
            }
            placeholder="What are you up to?"
          />
          <FormSelect<Client, Worklog>
            data={clientData ?? []}
            name="client_id"
            control={control}
            onChange={(value) =>
              setTimerObject({ ...timerObject, client_id: value.id })
            }
            className="w-64"
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
          <FormInput
            leadingIcon={<IconCoin strokeWidth={1} size={18} />}
            type="number"
            control={control}
            name="rate"
            rounded="lg"
            placeholder="Rate/h"
            onChange={(event) =>
              setTimerObject({
                ...timerObject,
                rate:
                  event.currentTarget.value === ""
                    ? undefined
                    : event.currentTarget.valueAsNumber,
              })
            }
          />
          <div className="flex items-center justify-center text-white h-10 w-full">
            <span className=" mr-2 text-sm">
              {dateTime.substring(11, 13)}{" "}
              <span className="text-xs dark:text-zinc-600">H</span>
            </span>
            <span className=" mr-2 text-sm">
              {dateTime.substring(14, 16)}{" "}
              <span className="text-xs dark:text-zinc-600">M</span>
            </span>
            <span className=" text-sm">
              {dateTime.substring(17, 19)}{" "}
              <span className="text-xs dark:text-zinc-600">S</span>
            </span>
          </div>
          <div className="flex rounded-lg justify-between">
            <button
              type="button"
              onClick={() => ToggleTimer()}
              className={`rounded-md text-sm grow font-medium w-10 h-10 flex justify-center text-black dark:text-white  hover:bg-white hover:text-black  items-center
            `}
            >
              {timerPaused ? (
                <IconPlayerPlay strokeWidth={1} size={18} />
              ) : (
                <IconPlayerPause strokeWidth={1} size={18} />
              )}
            </button>
            <button
              disabled={!timerRunning}
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

export default WorklogPopoverForm;
