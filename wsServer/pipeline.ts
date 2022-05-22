/* eslint-disable @typescript-eslint/no-explicit-any */
// client specific messages
// each client gets an individual instance
export function individualPipeline(ctx: any) {
  let idx = 0;
  const interval = setInterval(() => {
    ctx.send(`ping pong ${idx}`);
    idx++;
  }, 5000);
  return interval;
}

// braodcast messages
// one instance for all clients
export function broadcastPipeline(clients: any) {
  let idx = 0;
  const interval = setInterval(() => {
    for (const c of clients.values()) {
      c.send(`broadcast message ${idx}`);
    }
    idx++;
  }, 3000);
  return interval;
}
