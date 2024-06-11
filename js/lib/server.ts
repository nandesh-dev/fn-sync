import express, { Request, Response } from "express";

interface functions {
  [key: string]: {
    [key: string]: Function;
  };
}

export class Server {
  private functions: functions;

  constructor() {
    this.functions = {};
  }

  useExpressRouter() {
    let router = express.Router();

    router.use(express.json());
    router.post("/", async (req: Request, res: Response) => {
      const { name, args, version } = req.body;

      let response = await this.runFunction(name, version || 1, args);
      res.send(response);
    });

    return router;
  }

  registerFunction(
    func: Function,
    { version = 1, name }: { version?: number; name?: string } = {},
  ) {
    let functionName = name || func.name;

    if (!functionName || !functionName.trim()) {
      throw new Error(
        "Function name not found. If you are using lambda function, please provide an explict name.",
      );
    }

    if (!this.functions[version]) this.functions[version] = {};

    if (typeof this.functions[version][functionName] === "function") {
      throw new Error("Function already exist.");
    }

    if (typeof func !== "function") {
      throw new Error("Expected function as parameter.");
    }

    this.functions[version][functionName] = func;
  }

  private async runFunction(name: string, version: number, args: Array<any>) {
    try {
      if (!this.functions[version])
        return {
          status: "invalid",
          error: "Version not found.",
        };

      let func = this.functions[version][name];

      if (typeof func !== "function") {
        return {
          status: "invalid",
          error: "Function / version not found.",
        };
      }

      let output = await func(...args);

      return {
        status: "success",
        output,
      };
    } catch (error: any) {
      return {
        status: "error",
        error: error.message,
      };
    }
  }
}
