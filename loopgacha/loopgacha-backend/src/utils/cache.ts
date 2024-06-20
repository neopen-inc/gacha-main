import { Redis } from "ioredis";
import { collectionSequenceKey, collectionUserGachaKey, userPointsKey } from "../redis.key";
import { format, addDays } from 'date-fns';

export async function incrUserPoints(redis: Redis, userId: string, points: number) {
  return await redis.incrby(userPointsKey(userId), points);
}

export async function setUserPoints(redis: Redis, userId: string, points: number) {
  return await redis.set(userPointsKey(userId), points);
}

export async function setCollectionUserGacha(redis: Redis, collectionId: string, userId: string) {
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const content = format(tomorrow, 'yyyy-MM-dd HH:mm:ss');

  return await redis.set(collectionUserGachaKey(collectionId, userId), content, 'PX', 60 * 60 * 24 * 1000);
}

export async function getCollectionUserGacha(redis: Redis, collectionId: string, userId: string) {
  return await redis.get(collectionUserGachaKey(collectionId, userId));
}

export async function loadCardSequenceToRedis(redis: Redis, collectionId: string, sequenceIdList: string[]) {
  const sequenceKey = collectionSequenceKey(collectionId);
  await redis.del(sequenceKey);
  await redis.rpush(sequenceKey, ...sequenceIdList);
}
