export const renderTimerValue = (data: number) => {
  if (!data) return null;
  const dateTime = new Date(data * 1000).toISOString();

  return (
    <div className="flex dark:text-white">
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
  );
};

export const formatCurrency = (data: number) =>
  new Intl.NumberFormat(navigator.language, {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
  }).format(data);

export const formatNumber = (data: number) =>
  new Intl.NumberFormat(navigator.language, {
    minimumFractionDigits: 2,
  }).format(data);
