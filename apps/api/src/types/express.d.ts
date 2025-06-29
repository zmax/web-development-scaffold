// 為了讓 TypeScript 知道我們正在擴充現有的模組，而不是建立一個新的，
// 我們需要至少一個 import 或 export 語句。
// 一個空的 export 就能達到這個目的。
export {};

declare global {
  namespace Express {
    // 擴充 Express 的 Request 介面，以包含 user 屬性
    interface Request {
      user?: { id: string };
    }
  }
}
