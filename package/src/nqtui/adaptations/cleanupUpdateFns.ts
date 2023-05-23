const cleanupUpdateArray: (() => void)[] = [];

export function queueCleanupUpdates(cleanupUpdateFn: () => void) {
  cleanupUpdateArray.push(cleanupUpdateFn);
}

export function updateMemoCleanups() {
  cleanupUpdateArray.forEach((cleanupUpdateFn) => cleanupUpdateFn());
  cleanupUpdateArray.length = 0;
}
