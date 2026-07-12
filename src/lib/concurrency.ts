export class WorkloadBusyError extends Error {
  constructor(public readonly workload: string) {
    super(`${workload} is at capacity.`);
    this.name = "WorkloadBusyError";
  }
}

type GateState = { active: number };
const states = new Map<string, GateState>();

export async function withConcurrencyLimit<T>(workload: string, limit: number, task: () => Promise<T>): Promise<T> {
  const state = states.get(workload) ?? { active: 0 };
  states.set(workload, state);
  if (state.active >= limit) throw new WorkloadBusyError(workload);
  state.active += 1;
  try {
    return await task();
  } finally {
    state.active -= 1;
  }
}

export function resetConcurrencyLimitsForTests() {
  states.clear();
}
