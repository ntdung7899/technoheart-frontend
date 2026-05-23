# Prompt dành cho AI hỗ trợ Frontend — Module 2 & 3

> Copy toàn bộ nội dung dưới đây và paste vào đầu conversation với AI (ChatGPT / Claude / Copilot Chat).

---

## ===== SYSTEM CONTEXT — DÁN VÀO ĐẦU CHAT =====

```
Bạn là AI hỗ trợ Frontend developer đang xây dựng App MeU — nền tảng MLM/affiliate commerce.

Backend API base URL: /api/v1.0
Auth: Bearer JWT token trong header Authorization
Response wrapper: { success, data, message } — data chứa kết quả

TECH STACK Frontend: [thay bằng stack thực tế của team, ví dụ: React Native / Next.js / Flutter]

---

PHẦN 1 — MODULE 2: HỆ THỐNG CẤP BẬC & THƯỞNG QUẢN TRỊ

Hệ thống có 5 cấp bậc affiliate:
- DDKD (Đại diện kinh doanh): 1.5% — điều kiện: VIP, teamPV ≥ 10.000, 2 nhánh
- G1 (Giám đốc khu vực): 4% — VVIP, teamPV ≥ 30.000, 2 nhánh DDKD
- G2 (Giám đốc vùng): 6.5% — VVIP, teamPV ≥ 120.000, 3 nhánh G1
- G3 (Đại sứ TH Quốc gia): 8% — VVIP, teamPV ≥ 500.000, 3 nhánh G2
- G4 (Đại sứ TH Toàn cầu): 9% — VVIP, teamPV ≥ 2.000.000, 5 nhánh phức hợp
- Danh hiệu BẢO LƯU VĨNH VIỄN, không bao giờ bị hạ cấp
- 1 PV = 26.000 VNĐ
- Matching bonus: nếu F1 đồng cấp, sponsor nhận thêm 20% trên management bonus của F1

PHẦN 2 — MODULE 3: HUB

Hub là trung tâm vận hành địa phương, 2 loại:
- FULL_HUB: 8.5% (2.5% royalty + 6% operation)
- VIRTUAL_HUB: 2.5% royalty only
- COMPANY_WAREHOUSE: kho tổng, fallback khi không có hub

Routing đơn hàng: exclusive area → nearest hub (50km) → company warehouse
SLA Hub: 30 phút phản hồi sau khi nhận đơn

PHẦN 3 — CÁC API MỚI VÀ THAY ĐỔI

=== USER APIS (đã có sẵn, URL GIỮ NGUYÊN, thêm logic mới) ===

POST /api/v1.0/affiliate/withdraw
→ Tạo yêu cầu rút tiền
→ THÊM MỚI: Chỉ hoạt động ngày 10–15 hàng tháng. Ngoài khung trả:
   { success: false, code: "WITHDRAWAL_CLOSED", nextOpenAt: "2026-06-10T00:00:00.000Z" }
→ FE phải: hiển thị countdown đến nextOpenAt nếu bị lỗi WITHDRAWAL_CLOSED
Body: { amount (PV), bankName, accountNumber, accountName }

GET /api/v1.0/affiliate/withdrawals
→ Danh sách yêu cầu rút tiền của user hiện tại
→ Response: { data: [ { id, affiliateId, amount, bankName, accountNumber, accountName, status, createdAt } ] }
→ status: PENDING | APPROVED | PAID | REJECTED | CANCELLED

DELETE /api/v1.0/affiliate/withdrawals/:id
→ Huỷ yêu cầu rút tiền (chỉ khi status = PENDING)
→ Trả lỗi { code: "CANNOT_CANCEL_WITHDRAWAL" } nếu không phải PENDING
→ Response: { data: { message, id } }

=== USER APIS MỚI HOÀN TOÀN ===

GET /api/v1.0/me/wallet
→ Số dư ví điện tử
→ Response: { data: { id, affiliateId, balance, lockedBalance, totalCredited, totalDebited, createdAt, updatedAt } }

GET /api/v1.0/me/wallet/transactions?page=1&limit=20&type=CREDIT&source=MANAGEMENT_BONUS
→ Lịch sử giao dịch ví
→ Response: { data: { rows: [...], count } }
→ Mỗi transaction: { id, type: CREDIT|DEBIT, amount, balanceBefore, balanceAfter, description, source, sourceId, createdAt }
→ source: MANAGEMENT_BONUS | MATCHING_BONUS | WITHDRAWAL | HUB_ROYALTY | HUB_OPERATION | COMMISSION | ADJUSTMENT

GET /api/v1.0/me/rank-snapshot?cycleId=<uuid>
→ Thông tin rank trong một chu kỳ (lấy cycleId từ /admin/payout-cycles hoặc lưu local)
→ Response: { data: { managementRankAchieved: "G1"|null, finalRankCode: "G1", teamPV: 35000, personalPV: 5000, qualifyingBranches: {...}, cycleId, membershipTier } }
→ finalRankCode: rank cao nhất từng đạt (bảo lưu vĩnh viễn)

GET /api/v1.0/me/pv-ledgers?page=1&limit=20&year=2026&month=5
→ Lịch sử PV tích lũy theo từng đơn hàng
→ Response: { data: { rows: [...], count } }
→ Mỗi item: { id, orderId, pvAmount, type: ORDER|ADJUSTMENT|CORRECTION, cycleYear, cycleMonth, note, createdAt }

GET /api/v1.0/me/management-bonus?page=1&limit=20&status=PENDING
→ Danh sách khoản thưởng quản trị
→ Mỗi item: { id, cycleId, rankCode, basePV, bonusRate, bonusAmount, isRetroactive, status, createdAt, updatedAt }
→ status: PENDING | PAID | CANCELLED

GET /api/v1.0/me/matching-bonus?page=1&limit=20
→ Danh sách khoản thưởng đồng cấp (20% của F1)
→ Mỗi item: { id, f1AffiliateId, cycleId, baseManagementBonusId, matchingRate, bonusAmount, status, createdAt, updatedAt }

=== HUB OPERATOR APIS (dành cho chủ Hub) ===

GET /api/v1.0/hub/orders?status=ASSIGNED&page=1&limit=20
→ Danh sách đơn hàng được routing đến Hub của tôi
→ Mỗi item: { id, orderId, hubId, routingStep, reason, status, assignedAt, timeoutAt, note, createdAt }
→ timeoutAt = assignedAt + 30 phút — FE cần hiển thị countdown
→ status: ASSIGNED | ACCEPTED | REJECTED | TIMEOUT | COMPLETED | CANCELLED

POST /api/v1.0/hub/orders/:id/accept
→ Xác nhận nhận đơn
→ Body: {} (không cần body)

POST /api/v1.0/hub/orders/:id/reject
→ Từ chối đơn
→ Body: { note: "Lý do từ chối" }

POST /api/v1.0/hub/orders/:id/complete
→ Xác nhận đã giao hàng thành công
→ Body: {}

GET /api/v1.0/hub/inventory?page=1&limit=20
→ Tồn kho của Hub
→ Mỗi item: { id, hubId, productId, quantity, reservedQty, updatedAt }
→ available = quantity - reservedQty (hàng khả dụng)

PUT /api/v1.0/hub/inventory/:productId
→ Cập nhật tồn kho
→ Body: { quantity: 45 }

---

CÁC LUẬT FE QUAN TRỌNG:

1. WITHDRAWAL_CLOSED: Khi POST /affiliate/withdraw trả code="WITHDRAWAL_CLOSED",
   đọc field nextOpenAt và hiển thị countdown đến thời điểm đó.
   Ví dụ: "Cổng rút tiền mở lại sau 25 ngày 14 giờ 32 phút"

2. RANK BADGE: managementRankAchieved có thể là null (chưa có rank). finalRankCode là rank bảo lưu.
   Hiển thị finalRankCode nếu managementRankAchieved trong chu kỳ hiện tại là null.

3. HUB TIMEOUT: Mỗi đơn ASSIGNED có timeoutAt. Tính countdown = timeoutAt - Date.now().
   Khi countdown = 0, reload danh sách đơn (đơn có thể đã TIMEOUT).

4. WALLET: balance là số VNĐ. type=CREDIT màu xanh, type=DEBIT màu đỏ.

5. BONUS STATUS BADGE:
   PENDING = vàng (đang chờ)
   PAID = xanh lá (đã nhận)
   CANCELLED = xám (đã huỷ)

6. WITHDRAWAL STATUS:
   PENDING = vàng (có nút Huỷ), APPROVED = xanh nhạt, PAID = xanh lá, REJECTED = đỏ, CANCELLED = xám
```

---

## ===== PROMPT MẪU THEO TỪNG TASK =====

### Task 1: Màn hình Ví (Wallet Screen)

```
Dựa vào context API ở trên, tôi cần build màn hình Ví điện tử cho App MeU.

Yêu cầu:
1. Hiển thị số dư từ GET /me/wallet — format tiền VNĐ (ví dụ: 15.000.000 ₫)
2. Nút "Rút tiền" → gọi POST /affiliate/withdraw
   - Nếu response trả code="WITHDRAWAL_CLOSED": hiển thị countdown đến nextOpenAt
     Ví dụ: "Cổng rút tiền mở lại: 10/06/2026 00:00 — còn 25 ngày 14 giờ"
   - Nếu thành công: show toast "Yêu cầu rút tiền đã gửi"
3. Tab "Lịch sử giao dịch": GET /me/wallet/transactions
   - CREDIT: icon mũi tên lên, màu xanh
   - DEBIT: icon mũi tên xuống, màu đỏ
   - Hiển thị description và source
4. Tab "Yêu cầu rút tiền": GET /affiliate/withdrawals
   - Badge màu theo status: PENDING=vàng, APPROVED=xanh nhạt, PAID=xanh lá, REJECTED=đỏ, CANCELLED=xám
   - Nút [Huỷ] hiện chỉ khi status=PENDING → DELETE /affiliate/withdrawals/:id
   - Nếu lỗi CANNOT_CANCEL_WITHDRAWAL: toast "Không thể huỷ yêu cầu này"

[Thêm yêu cầu kỹ thuật của team ở đây]
```

---

### Task 2: Màn hình Rank & Thưởng

```
Dựa vào context API ở trên, tôi cần build màn hình "Quản trị & Thưởng" cho App MeU.

Yêu cầu:
1. Card rank hiện tại:
   - Gọi GET /me/rank-snapshot?cycleId=<cycleId chu kỳ hiện tại>
   - Hiển thị managementRankAchieved (hoặc finalRankCode nếu null)
   - Badge "Bảo lưu vĩnh viễn ✓"
   - Hiển thị teamPV (định dạng số có dấu phẩy)
   - Hiển thị Object.keys(qualifyingBranches).length — số nhánh đủ điều kiện

2. Tab "Thưởng quản trị": GET /me/management-bonus
   - Danh sách, mỗi item hiển thị: rankCode, bonusAmount (VNĐ), basePV, cycleId, status badge
   - Tổng đã nhận (filter status=PAID)

3. Tab "Thưởng đồng cấp": GET /me/matching-bonus
   - Danh sách, mỗi item: bonusAmount (VNĐ), matchingRate (20%), f1AffiliateId, status badge

4. Tab "Lịch sử PV": GET /me/pv-ledgers
   - Mỗi item: pvAmount, type (ORDER màu xanh / ADJUSTMENT màu vàng / CORRECTION màu cam), cycleYear/Month

[Thêm yêu cầu kỹ thuật của team ở đây]
```

---

### Task 3: Dashboard Hub Operator

```
Dựa vào context API ở trên, tôi cần build màn hình quản lý Hub cho chủ Hub.

Yêu cầu:
1. Tab "Đơn chờ xử lý" (status=ASSIGNED):
   - GET /hub/orders?status=ASSIGNED
   - Mỗi đơn hiển thị: địa chỉ giao hàng, tổng tiền
   - COUNTDOWN đến timeoutAt: "Còn X phút Y giây để phản hồi"
     Tính: Math.max(0, new Date(timeoutAt).getTime() - Date.now())
     Cập nhật mỗi giây với setInterval
     Khi countdown = 0: reload danh sách đơn
   - Nút [Nhận đơn] → POST /hub/orders/:id/accept
   - Nút [Từ chối] → mở modal nhập lý do → POST /hub/orders/:id/reject

2. Tab "Đang giao" (status=ACCEPTED):
   - GET /hub/orders?status=ACCEPTED
   - Nút [Hoàn thành giao hàng] → POST /hub/orders/:id/complete

3. Tab "Tồn kho":
   - GET /hub/inventory
   - Highlight đỏ nếu (quantity - reservedQty) <= 0 — không còn hàng khả dụng
   - Inline edit → PUT /hub/inventory/:productId với body { quantity: <số mới> }

[Thêm yêu cầu kỹ thuật của team ở đây]
```

---

### Task 4: Form rút tiền với countdown

```
Dựa vào context API ở trên, tôi cần build component WithdrawalForm cho App MeU.

Logic xử lý:
1. Khi user submit form, gọi POST /api/v1.0/affiliate/withdraw
   Body: { amount (số PV), bankName, accountNumber, accountName }

2. Nếu response.data.code === "WITHDRAWAL_CLOSED":
   - Đọc response.data.nextOpenAt (ISO string timestamp)
   - Tính countdown: nextOpenAt - Date.now()
   - Hiển thị: "Cổng rút tiền đóng. Mở lại sau: [DD ngày HH giờ MM phút SS giây]"
   - Cập nhật mỗi giây
   - Ẩn nút submit, hiện nút "Nhắc tôi khi cổng mở" (nếu có push notification)

3. Nếu thành công (status 201):
   - Toast "Yêu cầu rút tiền đã được gửi thành công"
   - Refresh danh sách GET /affiliate/withdrawals

5. Huỷ yêu cầu:
   - Chỉ hiện nút [Huỷ] khi status=PENDING
   - Gọi DELETE /api/v1.0/affiliate/withdrawals/:id
   - Confirm dialog trước khi huỷ
   - Nếu thành công: toast "Đã huỷ yêu cầu rút tiền", cập nhật status → CANCELLED

4. Field amount: nhập số PV, hiển thị thêm = amount × 26.000 VNĐ bên dưới
   Ví dụ: "100 PV = 2.600.000 ₫"

[Framework của team: React Native / Next.js / Flutter — thay vào đây]
```

---

### Task 5: Admin — Quản lý Withdrawal Requests

```
Dựa vào context API ở trên, tôi cần build trang admin quản lý yêu cầu rút tiền.

API dùng: GET + PATCH /admin/affiliate/withdrawals và /admin/affiliate/withdrawals/:id

Luồng duyệt:
PENDING → [Duyệt] → APPROVED
APPROVED → [Thanh toán] → PAID (tự động trừ ví user)
Bất kỳ → [Từ chối] → REJECTED

Lưu ý:
- Khi PATCH status=PAID: backend tự động debitWallet của affiliate
  Nếu ví không đủ: backend trả { code: "INSUFFICIENT_BALANCE" }
  FE phải hiển thị: "Số dư ví của user không đủ để thanh toán"

Columns bảng: Họ tên, Email, Số tài khoản, Ngân hàng, Số tiền (PV), Status badge, Ngày tạo, Actions

[Thêm yêu cầu kỹ thuật của team ở đây]
```

---

### Task 6: Admin — Payout Cycle Management

```
Dựa vào context API ở trên, tôi cần build trang admin quản lý chu kỳ chi trả.

APIs:
- GET /admin/payout-cycles — danh sách chu kỳ
- POST /admin/payout-cycles — tạo chu kỳ mới: { year: 2026, month: 5 }
- PUT /admin/payout-cycles/:id — đổi status

Quy trình hàng tháng (hiển thị dạng timeline/stepper):
Bước 1: Tạo chu kỳ mới (POST) → tự động status=OPEN (idempotent: trùng year/month trả về cycle cũ)
Bước 2: Trigger tính rank (POST /admin/rank-calculation/run với { cycleId })
Bước 3: Chuyển sang PROCESSING (PUT status=PROCESSING)
Bước 4: Duyệt và chi trả bonus ngày 10–15
   - Thưởng quản trị: PUT /admin/management-bonus/:id với { status: "PAID" }
   - Thưởng đồng cấp: PUT /admin/matching-bonus/:id với { status: "PAID" }
   - Rút tiền: PATCH /admin/affiliate/withdrawals/:id với { status: "PAID" }
Bước 5: Đóng chu kỳ (PUT status=CLOSED)

[Thêm yêu cầu kỹ thuật của team ở đây]
```

---

## ===== LỖI API CẦN XỬ LÝ =====

| Code lỗi | HTTP | Ý nghĩa | FE xử lý |
|---|---|---|---|
| `WITHDRAWAL_CLOSED` | 400 | Ngoài cửa sổ rút tiền | Hiển thị countdown đến `nextOpenAt` |
| `NO_OPEN_CYCLE` | 400 | Chưa có chu kỳ mở | Thông báo "Hệ thống chưa mở cổng tháng này" |
| `INSUFFICIENT_BALANCE` | 400 | Số dư ví không đủ | Thông báo số dư hiện tại |
| `AFFILIATE_NOT_FOUND` | 404 | Chưa đăng ký affiliate | Redirect màn hình đăng ký affiliate |
| `WITHDRAWAL_REQUEST_NOT_FOUND` | 404 | Không tìm thấy yêu cầu | Toast lỗi |
| `PERMISSION_DENIED` | 403 | Không phải của user này | Toast lỗi |
| `CANNOT_CANCEL_WITHDRAWAL` | 400 | Không ở trạng thái PENDING | Toast "Không thể huỷ yêu cầu này" |

---

## ===== FORMAT HIỂN THỊ =====

```javascript
// Format VNĐ
const formatVND = (amount) => 
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
// → "15.000.000 ₫"

// Format PV
const formatPV = (pv) => `${pv.toLocaleString('vi-VN')} PV`;
// → "35.000 PV"

// PV → VNĐ
const pvToVnd = (pv) => pv * 26000;

// Countdown từ timestamp
const getCountdown = (isoTimestamp) => {
  const diff = Math.max(0, new Date(isoTimestamp).getTime() - Date.now());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds, total: diff };
};

// Status badge color
const statusColor = {
  PENDING: '#F59E0B',    // vàng
  APPROVED: '#3B82F6',   // xanh dương
  PAID: '#10B981',       // xanh lá
  REJECTED: '#EF4444',   // đỏ
  CANCELLED: '#6B7280',  // xám
  REJECTED: '#EF4444',   // đỏ (đã có ở trên, dùng chung)
};

// Rank display
const rankDisplay = {
  DDKD: { label: 'Đại diện kinh doanh', color: '#8B5CF6' },
  G1:   { label: 'Giám đốc khu vực',    color: '#3B82F6' },
  G2:   { label: 'Giám đốc vùng',       color: '#06B6D4' },
  G3:   { label: 'Đại sứ TH Quốc gia',  color: '#F59E0B' },
  G4:   { label: 'Đại sứ TH Toàn cầu',  color: '#EF4444' },
};
```
