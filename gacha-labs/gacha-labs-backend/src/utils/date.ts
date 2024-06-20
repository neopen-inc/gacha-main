import { format, subDays } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

export function formatJSTDateString(date?: Date): string {
  const now = date || new Date();
  const jstTime = utcToZonedTime(now, 'Asia/Tokyo');
  const formattedJstDate = format(jstTime, 'yyyy-MM-dd');
  return formattedJstDate;
}

export function formatJSTDatetimeString(date?: Date): string {
  const now = date || new Date();
  const jstTime = utcToZonedTime(now, 'Asia/Tokyo');
  const formattedJstDate = format(jstTime, 'yyyy-MM-dd HH:mm:ss');
  return formattedJstDate;
}

export function getTheDaybefore(date?: Date) {
  const theDay = date || new Date();
  return subDays(theDay, 1);
}
