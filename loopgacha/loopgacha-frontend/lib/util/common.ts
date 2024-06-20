
export const isOperationFailed = (operations: { status: string }[]): boolean => {
  return operations.some((operation) => operation.status === 'failed');
}
export const isOperationSucceeded = (operations: { status: string }[]): boolean => {
  return operations.some((operation) => operation.status === 'succeeded');
}
