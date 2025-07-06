/**
 * 代表公開的使用者資料，這是一個獨立的資料傳輸物件 (DTO)。
 * 它定義了應用程式各層之間（例如後端 API 和前端）的使用者資料契約。
 * 為了保持關注點分離，此型別不直接依賴於 Prisma 生成的型別。
 */
export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
