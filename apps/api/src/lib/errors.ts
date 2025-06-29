/**
 * 基礎的 HTTP 錯誤類別
 */
export class HttpError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    // 確保原型鏈正確
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * 400 Bad Request
 */
export class BadRequestError extends HttpError {
  constructor(message = '不正確的請求') {
    super(400, message);
  }
}

/**
 * 401 Unauthorized
 */
export class UnauthorizedError extends HttpError {
  constructor(message = '未經授權') {
    super(401, message);
  }
}

/**
 * 404 Not Found
 */
export class NotFoundError extends HttpError {
  constructor(message = '找不到資源') {
    super(404, message);
  }
}

/**
 * 409 Conflict
 */
export class ConflictError extends HttpError {
  constructor(message = '資源衝突') {
    super(409, message);
  }
}
