import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../../utils/trpc";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Client, Worklog } from "@prisma/client";
import { FormDatePicker, FormInput, FormSelect } from "../form";
import {
  timerState,
  timerRunState,
  timerPauseState,
} from "../../utils/timerState";
import { useRecoilState } from "recoil";
import {
  IconCoin,
  IconDeviceFloppy,
  IconPlayerPause,
  IconPlayerPlay,
} from "@tabler/icons";
import { useEffect, useRef, useState } from "react";

export function useTimer() {
  const [isInitial, setIsInitial] = useState(true);
  const [darkModeStored, setDarkModeStored] = useRecoilState(timerState);

  useEffect(() => {
    setIsInitial(false);
  }, []);

  return [isInitial === true ? 0 : darkModeStored, setDarkModeStored] as const;
}
export function useTimerPause() {
  const [isInitial, setIsInitial] = useState(true);
  const [darkModeStored, setDarkModeStored] = useRecoilState(timerPauseState);

  useEffect(() => {
    setIsInitial(false);
  }, []);

  return [
    isInitial === true ? false : darkModeStored,
    setDarkModeStored,
  ] as const;
}
export function useTimerRunning() {
  const [isInitial, setIsInitial] = useState(true);
  const [darkModeStored, setDarkModeStored] = useRecoilState(timerRunState);

  useEffect(() => {
    setIsInitial(false);
  }, []);

  return [
    isInitial === true ? false : darkModeStored,
    setDarkModeStored,
  ] as const;
}

const WorklogForm = () => {
  const schema = z.object({
    description: z.string(),
    rate: z.number().optional(),
    client_id: z.string().optional(),
    recorded_at: z.date().optional(),
  });

  const { control, handleSubmit } = useForm<Worklog>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: "",
      rate: undefined,
      recorded_at: new Date(),
    },
  });

  const ctx = trpc.useContext();
  const { data: clientData } = trpc.useQuery(["client.get"]);

  // const [timerValue, setTimerValue] = useRecoilState(timerState);
  // const [timerPaused, setTimerPause] = useRecoilState(timerPauseState);
  // const [timerRunning, setTimerRunning] = useRecoilState(timerRunState);
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
    clearInterval(timerRef.current);
  };
  const dateTime = new Date(timerValue * 1000).toISOString();

  return (
    <>
      <form
        onSubmit={handleSubmit(submit, (errors) => console.log(errors))}
        className={`p-1 rounded-lg flex gap-2 justify-between dark:${
          timerRunning ? "bg-zinc-800" : "bg-zinc-900"
        }`}
      >
        <div className="grow flex flex-col gap-1">
          <FormInput
            control={control}
            name="description"
            rounded="lg"
            placeholder="What are you up to?"
          />
          <div className="flex gap-1">
            <FormSelect<Client, Worklog>
              data={clientData ?? []}
              name="client_id"
              control={control}
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
            <FormDatePicker
              // className="h-full"
              control={control}
              name="recorded_at"
            />
            <FormInput
              leadingIcon={<IconCoin strokeWidth={1} size={18} />}
              type="number"
              control={control}
              name="rate"
              rounded="lg"
              placeholder="Rate/h"
            />
          </div>
        </div>
        <div className="flex flex-col justify-around ">
          <div className=" flex items-center justify-center text-white h-10 w-32">
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
              className={`rounded-md text-sm font-medium w-10 h-10 flex justify-center text-black dark:text-white  hover:bg-white hover:text-black  items-center
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
              className={`rounded-md text-sm font-medium w-20 h-10 bg-rose-500  disabled:bg-rose-900 flex justify-center text-black  hover:bg-gradient-to-l hover:from-rose-800 items-center`}
            >
              <IconDeviceFloppy strokeWidth={1} size={18} className="mr-2" />
              Save
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default WorklogForm;
