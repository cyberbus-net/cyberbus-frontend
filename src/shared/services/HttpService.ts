import { getHttpBase } from "@utils/env";
import { CyberbusHttp } from "@cyberbus-net/cyberbus-js-client";

export const EMPTY_REQUEST = {
  state: "empty",
} as const;

export type EmptyRequestState = typeof EMPTY_REQUEST;

export const LOADING_REQUEST = {
  state: "loading",
} as const;

type LoadingRequestState = typeof LOADING_REQUEST;

export type FailedRequestState = {
  state: "failed";
  err: Error;
};

type SuccessRequestState<T> = {
  state: "success";
  data: T;
};

/**
 * Shows the state of an API request.
 *
 * Can be empty, loading, failed, or success
 */
export type RequestState<T> =
  | EmptyRequestState
  | LoadingRequestState
  | FailedRequestState
  | SuccessRequestState<T>;

export type WrappedCyberbusHttp = WrappedCyberbusHttpClient & {
  [K in keyof CyberbusHttp]: CyberbusHttp[K] extends (...args: any[]) => any
    ? ReturnType<CyberbusHttp[K]> extends Promise<infer U>
      ? (...args: Parameters<CyberbusHttp[K]>) => Promise<RequestState<U>>
      : (
          ...args: Parameters<CyberbusHttp[K]>
        ) => Promise<RequestState<CyberbusHttp[K]>>
    : CyberbusHttp[K];
};

class WrappedCyberbusHttpClient {
  rawClient: CyberbusHttp;

  constructor(client: CyberbusHttp) {
    this.rawClient = client;

    for (const key of Object.getOwnPropertyNames(
      Object.getPrototypeOf(this.rawClient),
    )) {
      if (key !== "constructor") {
        this[key] = async (...args) => {
          try {
            const res = await this.rawClient[key](...args);

            return {
              data: res,
              state: !(res === undefined || res === null) ? "success" : "empty",
            };
          } catch (error) {
            return {
              state: "failed",
              err: error,
            };
          }
        };
      }
    }
  }
}

export function wrapClient(client: CyberbusHttp) {
  // unfortunately, this verbose cast is necessary
  return new WrappedCyberbusHttpClient(
    client,
  ) as unknown as WrappedCyberbusHttp;
}

export class HttpService {
  static #_instance: HttpService;
  #client: WrappedCyberbusHttp;

  private constructor() {
    const lemmyHttp = new CyberbusHttp(getHttpBase());
    this.#client = wrapClient(lemmyHttp);
  }

  static get #Instance() {
    return this.#_instance ?? (this.#_instance = new this());
  }

  public static get client() {
    return this.#Instance.#client;
  }
}
