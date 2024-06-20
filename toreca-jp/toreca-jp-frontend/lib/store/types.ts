

export interface Operation<T> {
  status: 'idle' | 'confirm' | 'busy' | 'finished' | 'succeeded' | 'failed'
  message?: string
  payload?: T
}