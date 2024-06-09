import express, { Request, Response } from "express";

interface functions {
  [key: string]: Function;
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
      const { name, args } = req.body;

      let response = await this.runFunction(name, args);
      res.send(response);
    });

    return router;
  }

  registerFunction(func: Function, name?: string) {
    let functionName = name || func.name;

    if (!functionName || !functionName.trim()) {
      throw new Error(
        "Function name not found. If you are using lambda function, please provide an explict name.",
      );
    }

    if (typeof this.functions[functionName] === "function") {
      throw new Error("Function already exist.");
    }

    if (typeof func !== "function") {
      throw new Error("Expected function as parameter.");
    }

    this.functions[functionName] = func;
  }

  private async runFunction(name: string, args: Array<any>) {
    try {
      let func = this.functions[name];

      if (typeof func !== "function") {
        return {
          status: "invalid",
          error: "Function not found.",
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
