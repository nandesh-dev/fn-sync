import { Client, Server } from "../lib";
import express from "express";

const PORT = 3000;

const server = new Server();

async function demoFunction(this: any, messages: Array<string>) {
  console.log(
    "[Server Log] Hello from the server!\n" +
      "[Server Log] I also got these from the client:",
    messages,
  );

  console.log("[Server Log] I also got this context: ", this.context);

  return "Server is alive!";
}
server.registerFunction(demoFunction);
server.registerFunction(
  () => {
    console.log("[Client Log] version 2???");
  },
  { name: "demoFunction", version: 2 },
);

const client = new Client("http://localhost:" + PORT, { version: 2 });

let func = client.getFunction("demoFunction", { version: 1 });
client.setContext({ key: "This is the value of your global context" });

let messages = ["Hey!", "Hi..."];
func(messages).then((message) => {
  console.log(`[Client Log] Got this response from the server: ${message}`);
});

func = client.getFunction("demoFunction", { version: 2 });

func(messages);

let app = express();
app.use("/", server.useExpressRouter());
app.listen(PORT);
