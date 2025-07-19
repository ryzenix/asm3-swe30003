<template>
  <footer class="bg-white pt-10 pb-6 text-sm text-gray-700">
    <!-- Top highlights -->
    <div class="bg-[#e7f0fd] py-4 text-center text-sm text-gray-800 font-medium flex flex-wrap justify-around px-4">
      <div class="flex items-center gap-2">
        <i class="fas fa-shield-alt text-blue-600"></i>
        <span>Thuốc chính hãng đa dạng và chuyên sâu</span>
      </div>
      <div class="flex items-center gap-2">
        <i class="fas fa-undo-alt text-blue-600"></i>
        <span>Đổi trả trong 30 ngày kể từ ngày mua hàng</span>
      </div>
      <div class="flex items-center gap-2">
        <i class="fas fa-check-circle text-blue-600"></i>
        <span>Cam kết 100% chất lượng sản phẩm</span>
      </div>
      <div class="flex items-center gap-2">
        <i class="fas fa-truck text-blue-600"></i>
        <span>Miễn phí vận chuyển theo chính sách giao hàng</span>
      </div>
    </div>

    <!-- View store system -->
    <div class="bg-blue-600 text-white py-3 px-4 flex justify-between items-center flex-wrap">
      <div class="flex items-center gap-2">
        <i class="fas fa-map-marker-alt"></i>
        <span class="font-semibold">Xem hệ thống nhà thuốc trên toàn quốc</span>
      </div>
      <button class="bg-white text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-100 transition">
        Xem danh sách nhà thuốc
      </button>
    </div>

    <!-- Footer main columns -->
    <div class="container mx-auto px-4 mt-8 grid grid-cols-2 md:grid-cols-5 gap-6">
      <!-- Column 1 -->
      <div>
        <h3 class="font-semibold mb-2 text-gray-800">VỀ CHÚNG TÔI</h3>
        <ul class="space-y-1">
          <li><a href="#" class="hover:underline">Giới thiệu</a></li>
          <li><a href="#" class="hover:underline">Hệ thống cửa hàng</a></li>
          <li><a href="#" class="hover:underline">Giấy phép kinh doanh</a></li>
          <li><a href="#" class="hover:underline">Quy chế hoạt động</a></li>
          <li><a href="#" class="hover:underline">Chính sách đổi trả thuốc</a></li>
        </ul>
      </div>

      <!-- Column 2 -->
      <div>
        <h3 class="font-semibold mb-2 text-gray-800">DANH MỤC</h3>
        <ul class="space-y-1">
          <li><a href="#" class="hover:underline">Thực phẩm chức năng</a></li>
          <li><a href="#" class="hover:underline">Dược mỹ phẩm</a></li>
          <li><a href="#" class="hover:underline">Thuốc</a></li>
          <li><a href="#" class="hover:underline">Chăm sóc cá nhân</a></li>
          <li><a href="#" class="hover:underline">Tiêm chủng Long Châu</a></li>
        </ul>
      </div>

      <!-- Column 3 -->
      <div>
        <h3 class="font-semibold mb-2 text-gray-800">TÌM HIỂU THÊM</h3>
        <ul class="space-y-1">
          <li><a href="#" class="hover:underline">Góc sức khỏe</a></li>
          <li><a href="#" class="hover:underline">Tra cứu thuốc</a></li>
          <li><a href="#" class="hover:underline">Đội ngũ chuyên môn</a></li>
          <li><a href="#" class="hover:underline">Tin tức tuyển dụng</a></li>
          <li><a href="#" class="hover:underline">Tin tức sự kiện</a></li>
        </ul>
      </div>

      <!-- Column 4 -->
      <div>
        <h3 class="font-semibold mb-2 text-gray-800">TỔNG ĐÀI (8:00 - 22:00)</h3>
        <ul class="space-y-1">
          <li>Tư vấn mua hàng: <a href="#" class="text-blue-700 font-medium">18006928 (Nhánh 1)</a></li>
          <li>Trung tâm Vắc xin: <a href="#" class="text-blue-700 font-medium">18006928 (Nhánh 2)</a></li>
          <li>Góp ý, khiếu nại: <a href="#" class="text-blue-700 font-medium">18006928 (Nhánh 3)</a></li>
        </ul>
        <div class="mt-3">
          <h4 class="font-semibold mb-1">KẾT NỐI VỚI CHÚNG TÔI</h4>
          <div class="flex gap-3 text-xl text-blue-600">
            <i class="fab fa-facebook cursor-pointer hover:text-blue-800"></i>
            <i class="fab fa-zalo cursor-pointer"></i>
          </div>
        </div>
      </div>

      <!-- Column 5 -->
      <div class="text-center md:text-left">
        <h4 class="font-semibold mb-2">TẢI ỨNG DỤNG LONG CHÂU</h4>
        <img src="/img/app-qr.webp" alt="QR Code" class="w-24 mx-auto md:mx-0" />
        <p class="mt-2 text-xs text-gray-500">Scan QR để tải ngay</p>

        <div class="mt-4">
          <h4 class="font-semibold text-xs mb-2">HỖ TRỢ THANH TOÁN</h4>
          <div class="flex gap-1 flex-wrap">
            <img src="/img/visa.png" alt="Visa" class="h-6" />
            <img src="/img/mastercard.png" alt="Mastercard" class="h-6" />
            <img src="/img/applepay.png" alt="Apple Pay" class="h-6" />
            <!-- Add more logos -->
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup></script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
</style>