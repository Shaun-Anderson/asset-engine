import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import {
  timerState,
  timerPauseState,
  timerRunState,
} from "../utils/timerState";

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
