import { AsyncLocalStorage } from "async_hooks";

export const init = () => {
  const storage = new AsyncLocalStorage();
  console.log({ storage });
  return storage;
};

export const getStorage = () => {
  assert(storage, "storage not initialized");
  return storage;
};
