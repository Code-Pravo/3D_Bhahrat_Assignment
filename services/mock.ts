import { LATENCY_MAX, LATENCY_MIN } from "@/utils/constants";

/** Random simulated network latency between LATENCY_MIN and LATENCY_MAX. */
export function randomLatency(): number {
  return Math.round(LATENCY_MIN + Math.random() * (LATENCY_MAX - LATENCY_MIN));
}

/**
 * Wraps a synchronous resolver in a Promise with a simulated network delay,
 * mirroring the behaviour of a backend API call.
 */
export function simulate<T>(resolver: () => T, latency = randomLatency()): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    window.setTimeout(() => {
      try {
        resolve(resolver());
      } catch (error) {
        reject(error);
      }
    }, latency);
  });
}

/** Deterministic simulated failure used for invalid requests. */
export function notFound(resource: string, id: string): Error {
  return new Error(`Requested ${resource} "${id}" could not be found.`);
}

export class ServiceError extends Error {
  code: string;
  constructor(message: string, code = "SERVICE_ERROR") {
    super(message);
    this.name = "ServiceError";
    this.code = code;
  }
}
