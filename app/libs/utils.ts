import dayjs from "dayjs";

export const formDateTimeToString = (date?: Date): string => {
  if (!date) {
    return "";
  }

  return dayjs(date).format("YYYY-MM-DD HH:mm");
};