export type ApiSuccess<T> = {
  success: true;
  requestId: string;
  data: T;
};

export type ApiError = {
  success: false;
  requestId: string;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};
