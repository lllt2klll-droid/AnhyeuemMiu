# Quỳnh 20/10 — A Little Garden of Love 💐

> *“Có những bông hoa anh tặng em bằng đôi tay, có những bông hoa anh giữ lại bằng ký ức, và có những điều anh muốn nói với em bằng cả trái tim.”*

Một website quà tặng 3D tương tác đặc biệt nhân ngày Phụ nữ Việt Nam 20/10, dành riêng cho **Quỳnh**. Website tái hiện bó hoa kỷ niệm theo phong cách 3D Chibi nghệ thuật mềm mại, ấm áp và sống động với Three.js & React.

---

## ✨ Điểm nổi bật & Tính năng chính

- 🌸 **Bó hoa 3D tương tác 360°:** Tái hiện chính xác bố cục theo mẫu: Hoa hướng dương trung tâm, hoa loa kèn trắng thanh khiết, nụ loa kèn, hoa hồng đỏ tình yêu, hoa tulip xanh bình yên, tulip hồng dịu dàng, hoa cúc trắng nhỏ bình dị, cành lá bạch đàn (eucalyptus) và giấy gói nơ satin mềm mại.
- 💌 **Lá thư 3D riêng gửi Quỳnh:** Chạm vào chiếc nơ satin trên bó hoa hoặc nút trái tim để mở lá thư tay đầy cảm xúc kèm hiệu ứng pháo giấy; kéo phần đầu thư để xoay tự do trong không gian 3D.
- 🔍 **Khám phá từng bông hoa (Raycasting):** Chạm/click chính xác vào từng bông hoa trong không gian 3D để lắng nghe ý nghĩa và những lời nhắn nhủ chân thành gắn liền với kỷ niệm.
- ☀️ / 🌙 **Chuyển đổi Ngày & Đêm:** Hiệu ứng chuyển cảnh ánh sáng mượt mà từ bình minh ấm áp sang đêm trăng lãng mạn cùng những đốm sáng đom đóm bay lượn nhẹ nhàng.
- 🎶 **Giai điệu Music Box êm dịu:** Giai điệu nhẹ nhàng (sử dụng Web Audio API không phụ thuộc file mạng, mặc định tắt để không gây bất ngờ).
- 📱 **Tối ưu hiển thị Responsive & Cảm ứng:**
  - Hoạt động mượt mà trên điện thoại di động (vuốt 1 ngón để xoay, chụm 2 ngón để zoom).
  - Khóa góc xoay thông minh (không bị lật ngược hoặc xuyên lòng đất).
  - Tách biệt thao tác xoay và chạm để không vô tình mở bảng tin khi đang xoay hoa.
- 🔤 **Typography & Giao diện:** Thiết kế tối giản, tinh tế với font chữ **Quicksand** từ Google Fonts.

---

## 📂 Cấu trúc thư mục dự án

```text
Quynh-2010/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Tự động build và deploy lên GitHub Pages
├── public/                     # Tài nguyên tĩnh
├── src/
│   ├── components/             # Các React UI component
│   │   ├── BouquetCanvas.jsx   # Khởi tạo Three.js scene, camera, raycaster
│   │   ├── FlowerModal.jsx     # Thẻ hiển thị lời nhắn từng bông hoa
│   │   ├── LoveLetterModal.jsx # Tấm thiệp thư tay gửi Quỳnh (kèm confetti)
│   │   ├── OverlayUI.jsx       # Header, nút chuyển ngày/đêm, reset góc nhìn
│   │   └── AudioPlayer.jsx     # Nút bật/tắt giai điệu thư giãn
│   ├── data/
│   │   └── flowerMessages.js   # ⭐ NƠI CHỈNH SỬA TOÀN BỘ NỘI DUNG LỜI NHẮN & THƯ
│   ├── scene/                  # Khối dựng hình 3D Three.js
│   │   ├── materials.js        # Vật liệu MeshPhysicalMaterial (bóng mịn, clearcoat)
│   │   ├── geometryUtils.js    # Tạo hình cánh hoa bo tròn, uốn lượn Chibi
│   │   ├── createFlowers.js    # Dựng từng loài hoa (Hướng dương, Loa kèn, Hồng, Tulip...)
│   │   ├── createWrapping.js   # Giấy gói hoa xếp lớp & Nơ satin tương tác
│   │   ├── createBouquet.js    # Ghép toàn bộ bó hoa theo bố cục ảnh mẫu
│   │   ├── createLighting.js   # Hệ thống ánh sáng Ngày/Đêm & Hạt bụi sáng
│   │   └── cameraControls.js   # OrbitControls & Tween camera mượt mà
│   ├── styles/
│   │   └── main.css            # Toàn bộ CSS phong cách thiệp quà tặng
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 📝 Cách chỉnh sửa nội dung lời nhắn & thư tình

Bạn không cần phải tìm kiếm trong toàn bộ mã nguồn. Tất cả nội dung nằm gọn trong file:

👉 [`src/data/flowerMessages.js`](src/data/flowerMessages.js)

1. **Lời nhắn từng bông hoa:** Tìm đến đối tượng `FLOWER_MESSAGES`, bạn có thể sửa tiêu đề `name`, `subtitle`, `meaning` và đoạn tâm sự `content` cho:
   - `sunflower` (Hoa hướng dương)
   - `blue-tulip` (Tulip xanh)
   - `pink-tulip` (Tulip hồng)
   - `red-rose` (Hoa hồng đỏ)
   - `white-lily` (Hoa loa kèn trắng)
   - `small-white` (Hoa trắng nhỏ)
   - `green-leaf` (Lá xanh)
2. **Nội dung lá thư tay riêng:** Tìm đến đối tượng `LOVE_LETTER` để chỉnh sửa các đoạn văn trong mảng `paragraphs` và lời ký tặng `signature`.

---

## 🚀 Hướng dẫn cài đặt & Chạy trên máy cá nhân (Local)

### Yêu cầu:
- Đã cài đặt [Node.js](https://nodejs.org/) (phiên bản 18 trở lên).

### Các bước thực hiện:
```bash
# 1. Cài đặt các thư viện phụ thuộc
npm install

# 2. Khởi động môi trường phát triển local
npm run dev
```

Sau khi chạy lệnh, mở trình duyệt tại địa chỉ hiển thị trong terminal (thường là `http://localhost:5173`) để ngắm bó hoa.

---

## 🌐 Hướng dẫn Triển khai miễn phí lên GitHub Pages

Dự án đã được cấu hình đường dẫn tương đối (`base: './'`) và tích hợp sẵn **GitHub Actions**, cho phép bạn đưa website lên mạng chỉ trong 2 phút:

### Bước 1: Khởi tạo Git và đẩy code lên GitHub
1. Tạo một repository mới trên [GitHub](https://github.com/) (ví dụ đặt tên là `Quynh-2010`).
2. Mở terminal tại thư mục dự án và chạy các lệnh:
```bash
git init
git add .
git commit -m "feat: Quỳnh 20/10 - A Little Garden of Love 💐"
git branch -M main
git remote add origin https://github.com/<tai-khoan-cua-ban>/Quynh-2010.git
git push -u origin main
```

### Bước 2: Bật tính năng GitHub Pages
1. Truy cập vào repository của bạn trên GitHub.
2. Vào tab **Settings** (Cài đặt) > **Pages** ở thanh menu bên trái.
3. Ở mục **Build and deployment** > **Source**, chọn **GitHub Actions**.
4. GitHub Actions sẽ tự động kích hoạt workflow `.github/workflows/deploy.yml` để build và đưa website lên mạng.
5. Sau khoảng 1–2 phút, bạn sẽ nhận được đường link công khai dạng:
   `https://<tai-khoan-cua-ban>.github.io/Quynh-2010/`

Bây giờ bạn chỉ cần gửi link này cho Quỳnh để em ấy tự tay mở món quà! ❤️

---

## 🛠️ Công nghệ sử dụng
- **React 18** & **Vite**: Nền tảng ứng dụng hiện đại, tải siêu nhanh.
- **Three.js**: Dựng mô hình 3D, vật liệu vật lý chân thực (MeshPhysicalMaterial), bóng đổ và camera OrbitControls.
- **Canvas Confetti**: Hiệu ứng pháo hoa giấy rực rỡ khi mở thư.
- **Lucide Icons**: Bộ icon thanh lịch, sắc nét.
- **Quicksand Google Font**: Kiểu chữ tròn mềm, lãng mạn.
