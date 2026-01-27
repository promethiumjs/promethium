import { describe, it, expect, vi } from "vitest";
import { adaptMachine } from "./adaptMachine.js";

describe("adaptMachine", () => {
  it("should call the state function from the machine config", () => {
    const config = {
      idle: vi.fn(),
      running: vi.fn(),
    };

    adaptMachine("idle", config);
    expect(config.idle).toHaveBeenCalledTimes(1);
    expect(config.running).not.toHaveBeenCalled();

    adaptMachine("running", config);
    expect(config.running).toHaveBeenCalledTimes(1);
  });

  it("should call the state function with arguments", () => {
    const config = {
      idle: vi.fn(),
      running: vi.fn(() => {}),
    };

    adaptMachine("running", [10], config);
    expect(config.running).toHaveBeenCalledWith(10);
  });
});
