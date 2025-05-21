type Actions = {
  [key: string]: (...args: any[]) => any;
};

type Subscriber<A extends Actions = Actions> = (payload: {
  [K in keyof A]+?: Parameters<A[K]>;
}) => void;

class ActionEntity<A extends Actions = Actions> {
  actions: A;
  triggers: A;
  private subscribers: Array<Subscriber<A>> = [];

  constructor(actions: A) {
    const errorAndReturnFalse = () => {
      console.error("Directly modifying triggers and actions is not allowed!");

      return false;
    };
    const sharedHandler = {
      setPrototypeOf() {
        return errorAndReturnFalse();
      },
      preventExtensions() {
        return errorAndReturnFalse();
      },
      defineProperty() {
        return errorAndReturnFalse();
      },
      set() {
        return errorAndReturnFalse();
      },
      deleteProperty() {
        return errorAndReturnFalse();
      },
    };
    const notify = this.notify.bind(this);
    const triggersHandler = {
      ...sharedHandler,
      get(target: any, prop: any) {
        return function (...args: any[]) {
          const returnValue = target[prop](...args);
          notify(prop as keyof A, args as Parameters<A[keyof A]>);

          return returnValue;
        };
      },
    };
    const actionsHandler = {
      ...sharedHandler,
      get(target: any, prop: any) {
        return function (...args: any[]) {
          return target[prop](...args);
        };
      },
    };
    this.actions = new Proxy(actions, actionsHandler);
    this.triggers = new Proxy(actions, triggersHandler);
  }

  subscribe(subscriber: Subscriber<A>) {
    this.subscribers.push(subscriber);

    return () =>
      (this.subscribers = this.subscribers.filter(
        (_subscriber) => _subscriber !== subscriber,
      ));
  }

  private notify(action: keyof A, args: Parameters<A[typeof action]>) {
    this.subscribers.forEach((subscriber) =>
      subscriber({ [action]: args } as Parameters<Subscriber<A>>[0]),
    );
  }
}

export function adaptActionEntity<A extends Actions = Actions>(actions: A) {
  return new ActionEntity<A>(actions);
}

export function action<
  P extends Parameters<Subscriber>[0] = Parameters<Subscriber>[0],
>(payload: P) {
  return Object.keys(payload)[0] as keyof P;
}

export function args<
  P extends Parameters<Subscriber>[0] = Parameters<Subscriber>[0],
>(payload: P) {
  return Object.values(payload)[0] as Exclude<P[keyof P], undefined>;
}

type MachineConfig<S extends string = string, A extends any[] = any[]> = {
  [K in S]: (...args: A) => void;
};

export function machine<S extends string = string>(
  state: S,
  machineConfig: MachineConfig<S>,
): void;
export function machine<S extends string = string, A extends any[] = any[]>(
  state: S,
  args: A,
  machineConfig: MachineConfig<S, A>,
): void;
export function machine<S extends string = string, A extends any[] = any[]>(
  state: S,
  argsOrMachineConfig: A | MachineConfig<S, A>,
  machineConfig?: MachineConfig<S>,
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
