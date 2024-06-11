# Overview

fn-sync is a npm library that allows developers to register functions on the server and invoke them from the client.

# Installation

```bash
npm i fn-sync
```

# Usage

## Server Side

On the server side, you can register functions that you want to expose to clients. Here's how you can do it:

```javascript
import { Server } from "fn-sync";
import express from "express";

const PORT = 3000;

const server = new Server();

async function demoFunction(messages) {
  console.log(
    "[Server Log] Hello from the server!\n" +
      "[Server Log] I also got these from the client:",
    messages,
  );

  return "Server is alive!";
}

server.registerFunction(demoFunction);

//If you are using build tools use
//server.registerFunction(demoFunction, "demoFunction");

const app = express();
app.use("/", server.useExpressRouter());
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

## Client Side

On the client side, you can invoke the registered functions on the server. Here's how you can do it:

```javascript
import { Client } from "fn-sync";

const PORT = 3000;
const client = new Client(`http://localhost:${PORT}`);

const func = client.getFunction("demoFunction");
const messages = ["Hey!", "Hi..."];

func(messages).then((message) => {
  console.log(`[Client Log] Got this response from the server: ${message}`);
});
```

# Function Versions

You can have multiple versions of the function with the same name. The default version is 1.

## Server Side

On the server side, pass in the version ( a number ) while registering the function.

```javascript
server.registerFunction(demoFunction, { version: 2 });
```

## Client Side

On the client side, get the function with the desired version.

```javascript
let func = client.getFunction("demoFunction", { version: 2 });
```

# Support and Issues

For any support or to report issues, please visit the [GitHub repository](https://github.com/nandesh-dev/FnSync) of this library.

# License

This package is licensed under the [MIT](https://github.com/nandesh-dev/FnSync/blob/function-version/LICENSE.md) License.
