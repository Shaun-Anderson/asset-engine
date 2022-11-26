import {
  IconHourglass,
  IconHourglassEmpty,
  IconPlayerPause,
  IconPlayerPlay,
} from "@tabler/icons";
import { useEffect, useRef } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import {
  timerState,
  timerRunState,
  timerPauseState,
} from "../utils/timerState";
import { trpc } from "../utils/trpc";
import Popover from "./Popover";
import WorklogPopoverForm from "./worklog/WorklogPopoverForm";

const Timer = () => {
  const [timerValue, setTimerValue] = useRecoilState(timerState);
  const [timerRunning, setTimerRunning] = useRecoilState(timerRunState);
  const [timerPaused, setTimerPause] = useRecoilState(timerPauseState);
  const timerRef = useRef<any>();
  const reset = useResetRecoilState(timerState);
  const ctx = trpc.useContext();

  const createMutation = trpc.useMutation(["worklog.create"], {
    onSuccess: () => {
      // router.push("/invoices");
      ctx.refetchQueries(["worklog.get"]);
    },
  });

  useEffect(() => {
    if (!timerPaused) {
      timerRef.current = setInterval(() => {
        setTimerValue((prevTimeLeft) => {
          return prevTimeLeft + 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (timerPaused) {
      clearInterval(timerRef.current);
    }
  }, [timerPaused]);

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

  const dateTime = new Date(timerValue * 1000).toISOString();
  return (
    <div className="my-auto">
      <Popover
        buttonNode={
          <div
            className={`flex flex-col gap-4 ${
              timerPaused ? "bg-gray-900" : "bg-indigo-600"
            }  rounded-full px-1 py-4 justify-center items-center my-auto transition-all ease-in-out w-10 ${
              timerPaused ? "scale-95" : "scale-100"
            } `}
          >
            {/* <IconHourglassEmpty size={18} /> */}
            {timerRunning && (
              <div className="text-white">
                <span className="block text-sm">
                  {dateTime.substring(11, 13)}{" "}
                  <span className="text-xs">H</span>
                </span>
                <span className="block text-sm">
                  {dateTime.substring(14, 16)}{" "}
                  <span className="text-xs">M</span>
                </span>
                <span className="block text-sm">
                  {dateTime.substring(17, 19)}{" "}
                  <span className="text-xs">S</span>
                </span>
              </div>
            )}
            {timerRunning ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  ToggleTimer();
                }}
                className="text-white"
              >
                {timerPaused ? (
                  <IconPlayerPlay strokeWidth={1} size={18} />
                ) : (
                  <IconPlayerPause size={18} />
                )}
              </button>
            ) : (
              <div className="text-white cursor-pointer">
                <IconHourglassEmpty size={18} stroke={1} />
              </div>
            )}
          </div>
        }
      >
        <div className="min-w-[200px] border-2 rounded-lg border-gray-800 bg-gray-900">
          <WorklogPopoverForm />
        </div>
      </Popover>
    </div>
  );
};

export default Timer;
