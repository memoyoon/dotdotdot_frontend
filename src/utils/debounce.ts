// Promise를 반환하는 함수도 허용하는 debounce (any 없음)
export function debounce<T extends unknown[]>(fn: (...args: T) => unknown, wait = 800) {
  let t: number | undefined;
  return (...args: T): void => {
    if (t !== undefined) window.clearTimeout(t);
    t = window.setTimeout(() => {
      // async 함수면 Promise가 돌아오므로, 의도적으로 기다리지 않고 무시
      void fn(...args);
    }, wait);
  };
}
