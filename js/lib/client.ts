import axios from "axios";

export class Client {
  private url: string;
  private version: number;
  private context: any;

  constructor(url: string, { version = 1 }: { version?: number } = {}) {
    this.url = url;
    this.version = version;
  }

  setContext(context: any) {
    this.context = context;
  }
  getFunction(name: string, { version }: { version?: number } = {}) {
    return async (...args: Array<any>) => {
      let res = await axios.post(this.url, {
        name,
        version: version || this.version,
        args: args || [],
        context: this.context,
      });

      let data = res.data;

      switch (data.status) {
        case "success":
          return data.output;
        case "error":
          throw new Error(data.error);
        case "invalid":
          throw new Error(data.error);
      }
    };
  }
}
