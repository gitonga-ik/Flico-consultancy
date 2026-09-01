import { createClient } from "redis";

const rclient = createClient({
  url: "redis://localhost:6379",
});
rclient.on("error", (err) => console.log("Redis Client Error", err));

await rclient.connect();

export default rclient;
