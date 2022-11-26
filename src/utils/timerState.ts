import { atom } from "recoil";

const localStorageEffect =
  (key: string) =>
  ({ setSelf, onSet }: { setSelf: any; onSet: any }) => {
    if (typeof window !== "undefined") {
      const savedValue = localStorage.getItem(key);
      console.log(savedValue);
      if (savedValue != null) {
        setSelf(JSON.parse(savedValue));
      }

      onSet((newValue: any, _: any, isReset: any) => {
        isReset
          ? localStorage.removeItem(key)
          : localStorage.setItem(key, JSON.stringify(newValue));
      });
    }
  };

export const timerState = atom<number>({
  key: "timer",
  default: 0,
  effects: [localStorageEffect("_timer")],
});
export const timerRunState = atom<boolean>({
  key: "timer_run",
  default: false,
  effects: [localStorageEffect("_timer_run")],
});
export const timerPauseState = atom<boolean>({
  key: "timer_pause",
  default: true,
  effects: [localStorageEffect("_timer_pause")],
});
export const timerDescriptionState = atom<string>({
  key: "timer_description",
  default: "",
  effects: [localStorageEffect("_timer_description")],
});

export const timerObjectState = atom<{
  description: string;
  client_id: string | undefined;
  rate: number | undefined;
  recorded_at: Date;
}>({
  key: "timer_object",
  default: {
    description: "",
    client_id: undefined,
    rate: undefined,
    recorded_at: new Date(),
  },
  effects: [localStorageEffect("_timer_object")],
});
