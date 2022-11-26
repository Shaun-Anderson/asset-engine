export enum Accent {
  primary,
  danger,
  warning,
  success,
  default,
}
export const getColor = (color: Accent) => {
  switch (color) {
    case Accent.danger:
      return "text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900";
    case Accent.warning:
      return "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900";
    case Accent.primary:
      return "text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900";
    case Accent.success:
      return "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900";
  }
};
