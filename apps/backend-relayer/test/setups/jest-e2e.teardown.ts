/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export default async () => {
  const container = (global as any).__PG_CONTAINER__;
  if (container) {
    await container.stop();
  }
};
