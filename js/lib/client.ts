import axios from "axios";

export class Client {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  getFunction(name: string) {
    return async (...args: Array<any>) => {
      let res = await axios.post(this.url, {
        name,
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
