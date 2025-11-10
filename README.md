# Project README

Đây là file README cho dự án của bạn. Dưới đây là các hướng dẫn cơ bản để giúp bạn bắt đầu với dự án này.

## Bắt đầu

Để chạy dự án này trên máy của bạn, hãy làm theo các bước sau:
1. **Clone code:**
   ```bash
   git clone ...
   ```
2. **Cài đặt thư viện:**
   ```bash
   npm install
   ```
3. **Sao chép file môi trường mẫu:**
   ```bash
   cp .env.example .env
   ```
4. **Chạy JSON Server:**
   ```bash
   npm run json-server
   ```
    Đây sẽ là server backend giả lập chạy tại `http://localhost:3001`.
5. **Khởi động server phát triển:**
   ```bash
   npm run dev
   ```
    Đây sẽ là server phát triển frontend chạy tại `http://localhost:3000`.
6. **Mở trình duyệt của bạn:**
   Truy cập `http://localhost:3000` để xem ứng dụng.

## Các lệnh có sẵn
Trong thư mục dự án, bạn có thể chạy:
- `npm run dev`: Khởi động server phát triển.
- `npm run json-server`: Khởi động JSON Server cho backend giả lập.
- `npm run build`: Xây dựng ứng dụng cho môi trường production.
- `npm run lint`: Chạy công cụ kiểm tra chất lượng mã nguồn. (Sun* Lint)
- `npm test`: Chạy bộ kiểm thử sử dụng Jest.

## Cấu trúc dự án
- `src/`: Chứa mã nguồn của ứng dụng.
- `src/stores/`: Chứa các cửa hàng Zustand để quản lý trạng thái.
- `src/lib/api/`: Chứa cấu hình API và các hàm tiện ích.
- `src/types/`: Chứa các định nghĩa kiểu TypeScript.
- `src/database/`: Chứa file cơ sở dữ liệu giả lập cho JSON Server.
- `public/`: Chứa các tài nguyên tĩnh.

## Quy trình làm việc nhóm

1. Clone repository về máy local.
2. Tạo nhánh `dev` từ `main` để làm việc. (Cấu hình khi bắt đầu dự án)
3. Mỗi tính năng hoặc sửa lỗi, tạo nhánh mới từ `dev` với tên rõ ràng.
   - Nếu là tính năng mới thì đặt tên nhánh theo cú pháp: `feat/ten-tinh-nang`
   ```bash
   git checkout -b feat/ten-tinh-nang
   ```
   - Nếu là sửa lỗi thì đặt tên nhánh theo cú pháp: `fix/ten-loi`
   ```bash
   git checkout -b fix/ten-loi
   ```
   - Nếu là công việc chung thì đặt tên nhánh theo cú pháp: `chore/ten-cong-viec`
   ```bash
   git checkout -b chore/ten-cong-viec
   ```
4. Sau khi code xong thì kiểm tra Sun Lint trước khi commit:
   ```bash
   npm run lint
   ```
5. Commit và push nhánh của bạn lên remote repository.
6. Tạo Pull Request (PR) từ nhánh của bạn vào nhánh `dev`.
   Trong PR, mô tả rõ ràng những thay đổi bạn đã thực hiện và Evidence pass Sun* Lint check (Khi chạy lệnh lint sẽ có output tóm tắt như bên dưới):
   ```bash
   📊 Sun Lint Summary:
   Analysis completed in ...ms
   Files: ... | Total: ...
   Errors: ... Warnings: ...
   ```
7. Khi tạo PR:
   - GitHub Copilot sẽ tự review code.
   - Nếu Copilot có comment lỗi, cần đọc kỹ và: Sửa lại code nếu comment hợp lý. Hoặc, reply giải thích nếu Copilot hiểu sai. requirements.
   - Sau khi hoàn tất sửa code → push lại branch → PR tự động cập nhật.
8. Sau khi tạo PR thành công
   - Mỗi PR cần ít nhất 1 thành viên khác trong nhóm Approve trước khi merge. (đảm bảo code được kiểm tra chéo.)
   - Khi PR đã pass Sun Lint + Copilot review + có 1 approve*. → comment “READY” để báo cho trainer review.
9. PR chỉ được merge khi đủ 4 điều kiện sau:
   - ✅ Pass Sun* Lint (có evidence trong PR Description)
   - 🤖 Pass GitHub Copilot review hoặc có giải thích hợp lý
   - 👥 Có ít nhất 1 approve từ đồng đội
   - 🧑‍🏫 Trainer review và approve (sau comment “READY”)