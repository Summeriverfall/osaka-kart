import http from "node:http";
import { handleStripe } from "./stripe-handler.mjs";

const port = Number(process.env.STRIPE_PAY_PORT || 8788);

const server = http.createServer(async (req, res) => {
  const handled = await handleStripe(req, res);
  if (handled) return;
  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not found");
});

server.listen(port, () => {
  console.log(`Stripe 收款服务：http://127.0.0.1:${port}/api/stripe/checkout`);
});
