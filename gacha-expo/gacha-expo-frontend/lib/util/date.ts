import { format, subDays } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

export function getJSTDateString(date?: Date): string {
  const now = date || new Date();
  const jstTime = utcToZonedTime(now, 'Asia/Tokyo');
  const formattedJstDate = format(jstTime, 'yyyy-MM-dd');
  return formattedJstDate;
}

export function getJSTYesterdayDateString(date?: Date): string {
  const now = date || new Date();
  const yesterday = subDays(now, 1);
  return getJSTDateString(yesterday);
}
