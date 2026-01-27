export type MachineConfig<
  S extends string = string,
  A extends any[] = any[]
> = {
  [K in S]: (...args: A) => void;
};

export function adaptMachine<S extends string = string>(
  state: S,
  machineConfig: MachineConfig<S>
): void;
export function adaptMachine<
  S extends string = string,
  A extends any[] = any[]
>(state: S, args: A, machineConfig: MachineConfig<S, A>): void;
export function adaptMachine<
  S extends string = string,
  A extends any[] = any[]
>(
  state: S,
  argsOrMachineConfig: A | MachineConfig<S, A>,
  machineConfig?: MachineConfig<S>
): void {
  const argsPresent = Array.isArray(argsOrMachineConfig);
  if (argsPresent) {
    if (machineConfig) {
      machineConfig[state](...argsOrMachineConfig);
    }
  } else {
    (argsOrMachineConfig as any)[state]();
  }
}
