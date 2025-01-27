export type ActionError = { error: string }

export type ServerActionResponse<T = unknown> = ActionError | T | undefined;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isActionError = (error: any): error is ActionError => {
  return error && 'error' in error && error?.error;
}