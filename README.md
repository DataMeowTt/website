# Website Đặt sân 24/7 - nhóm thực hiện DeATuan

## Mô tả nghiệp vụ:

Hệ thống Datsan247 được phát triển nhằm hỗ trợ một số hoạt động bên lề thể thao tại sân tập. 
  - Đối với người tập, website hỗ trợ dịch vụ theo dõi và đặt chỗ/hẹn trước trực tuyến trước khi khách hàng đến sân.
  - Đối với quản trị viên (đơn vị quản lý sân bãi), đây là nền tảng quản lý số hóa các dịch vụ sân tập tại nhà thi đấu của họ, bao gồm các chức năng theo dõi, quản lý lịch đặt sân, doanh thu, kho hàng,... thay thế cho các hình thức sổ ghi chép truyền thống.  

### Dịch vụ cung cấp và đối tượng phục vụ:
- Chủ sân/Quản lý:
  - Nhập thông tin về nhà thi đấu/sân đấu quản lý
  - Cập nhật thông tin sân đấu
  - Cập nhật tình trạng sân đấu (trống lịch/ đã đặt trước/ dừng phục vụ)
  - Xem/Thu thập phản hồi, đánh giá từ khách hàng
  - Quản lý tài khoản khách hàng
  - Quản lý hoá đơn đặt sân/ dịch vụ sân
  - Quản lý sản phẩm dịch vụ tại sân (gồm: nhập hàng, bán lẻ và thanh toán)

- Khách hàng (người mua hàng):
  - Xem/Tìm kiếm vị trí, thông tin sân cầu 
  - Tra cứu/Theo dõi tình trạng sân theo khung giờ
  - Tạo lịch đặt sân & Thanh toán thông minh
  - Lựa chọn dịch vụ bổ sung (nước uống, dụng cụ,...)
  - Hỗ trợ khách hàng 24/7 (nhân viên tư vấn hoặc chatbox AI)
  - Trải nghiệm giải thi đấu mở rộng


## Cấu trúc mã nguồn:
```
@
├── Admin/       # Giao diện truy cập cho quản trị viên, hiển thị các tab quản lý
│
├── Frontend/    # Giao diện truy cập cho người dùng thông thường, hỗ trợ đặt sân trực tuyến
│
└── Backend/     # Logic Backend cho cả 2 mảng giao diện phía trên
```

## Cài đặt và demo

### Cài đặt local
- Trước khi thực hiện, tại mỗi folder, với mẫu file `.env.example`, đổi tên (hoặc sao chép) thành `.env`, điền một số trường thông tin còn thiếu (nếu có).
  - Thường thì sẽ còn thiếu địa chỉ `mongoDB_URI` bạn phải tự setup.
- Để cài đặt chạy local, ta sẽ khởi chạy 3 thành phần trên tại các cửa sổ terminal riêng biệt.
- Mặc định:
  - Backend: port 3000, yêu cầu `mongoDB_URI` (online hoặc local)
  - Frontend: port 5173
  - Backend: port 5174

#### Backend:
```
  cd Backend        # Di chuyển tới thư mục Backend
  npm install       # Cài đặt các thư viện cần thiết (chỉ cần chạy lần đầu tải về, hệ thống sẽ tự tải về một folder node_modules chứa dependencies cần thiết) 
  npm run start     # Khởi chạy chương trình (backend)
```

#### Frontend:
```
  cd Frontend       # Di chuyển tới thư mục Frontend
  npm install       # Cài đặt các thư viện cần thiết (chỉ cần chạy lần đầu tải về, hệ thống sẽ tự tải về một folder node_modules chứa dependencies cần thiết) 
  npm run start     # Khởi chạy chương trình (frontend)
```

#### Admin: (FE)
```
  cd Admin          # Di chuyển tới thư mục Admin
  npm install       # Cài đặt các thư viện cần thiết (chỉ cần chạy lần đầu tải về, hệ thống sẽ tự tải về một folder node_modules chứa dependencies cần thiết) 
  npm run start     # Khởi chạy chương trình (admin)
```

### Link deploy tham khảo 
Nền tảng thực hiện Deploy:
- Vercel: [Frontend](https://frontend-branch-datsan247.vercel.app) và [Admin](https://admin-branch-datsan247-1fhg.vercel.app)
- Railway: Backend và MongoDB

Tài khoản demo:
- Người dùng thông thường (Frontend) - có thể tự đăng ký trên giao diện website
  - Tên đăng nhập: viethung123
  - Mặt khẩu: Viethung123456@
- Quản trị viên (Admin) - cố định
  - Tên đăng nhập: Admin02
  - Mật khẩu: 123456
 
** Lưu ý: Nếu re-deploy lại dự án, hãy đảm bảo `enviroment variables` của Backend được thống nhất với tên miền của triển khai Frontend để vượt qua các lớp bảo mật cơ bản (CORS và CSRF). Cụ thể: 2 biến `FRONTEND_URL` và `ADMIN_URL`.

 ## Công nghệ sử dụng
 
 ### Framework:
- Backend:   Node ExpressJS
- Frontend:  ReactJS, áp dụng TailwindCSS
- Database:  MongoDB

### Kiến trúc:
- Backend: mô hình MVC và Middlewares Pattern
- FrontEnd: định hướng Container, phân tách giao diện UI và logic (gọi API)

### Kiểm thử (chưa hoàn thiện)
- Backend: Jest

## Contributor:
 - Trần Việt Hưng
 - Nguyễn Trường Sơn
 - Trần Anh Tuấn
 
Thực hiện dưới dạng bài tập lớn cuối kỳ môn Phát Triển Ứng Dụng Web 2526I_INT3306_1







