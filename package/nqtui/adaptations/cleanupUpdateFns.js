const cleanupUpdateArray = [];
export function queueCleanupUpdates(cleanupUpdateFn) {
    cleanupUpdateArray.push(cleanupUpdateFn);
}
export function updateMemoCleanups() {
    cleanupUpdateArray.forEach((cleanupUpdateFn) => cleanupUpdateFn());
    cleanupUpdateArray.length = 0;
}
