export function userPointsKey(userId: string): string {
  return `user:points#${userId}`;
}

export function collectionSequenceKey(collectionId: string): string {
  return `collection:sequence#${collectionId}`;
}

export function collectionUserGachaKey(collectionId: string, userId: string): string {
  return `collection:user:gacha#${collectionId}#${userId}`;
}

export function collectionGachaLockKey(collectionId: string): string {
  return `collection:gacha:lock#${collectionId}`;
}

export function userPointExchangeKey(userId: string): string {
  return `user:point:exchange#${userId}`;
}
