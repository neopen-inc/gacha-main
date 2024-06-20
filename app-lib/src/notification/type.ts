
export interface NotificationDisplayConfig {
  message: string
  shouldShow?: boolean
  severity?: 'success' | 'info' | 'warning' | 'error' | undefined
  displayMilliseconds?: number
};
