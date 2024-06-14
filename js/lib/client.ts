import axios from "axios";

export class Client {
  private url: string;
  private version: number;

  constructor(url: string, { version = 1 }: { version?: number } = {}) {
    this.url = url;
    this.version = version;
  }

  getFunction(name: string, { version }: { version?: number } = {}) {
    return async (...args: Array<any>) => {
      let res = await axios.post(this.url, {
        name,
        version: version || this.version,
        args: args || [],
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
