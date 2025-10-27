# Hướng dẫn Cài đặt PostgreSQL bằng Docker

## Cài đặt PostgreSQL

Sử dụng lệnh sau để chạy PostgreSQL trong Docker:

```bash
docker run --name postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=12345 \
  -e POSTGRES_DB=postgres \
  -p 5432:5432 \
  -d postgres
```

### Lấy địa chỉ IP của Container

Để lấy địa chỉ IP của container, sử dụng lệnh sau:

```bash
docker inspect -f "{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}" postgres
```

### Truy cập vào Container

Để truy cập vào container, sử dụng lệnh:

```bash
docker exec -it postgres bash
```

Sau đó, bạn có thể đăng nhập vào PostgreSQL bằng lệnh:

```bash
psql -U postgres
```

### Sử dụng Docker Compose

Nếu bạn muốn sử dụng Docker Compose, hãy chạy lệnh sau:

```bash
docker-compose up -d
```

## Mã trạng thái HTTP

Dưới đây là các mã trạng thái HTTP quy ước:

```txt
200 : GET thành công
201 : POST thành công (tạo mới)
202 : PUT/PATCH thành công (cập nhật)
204 : DELETE thành công (không trả dữ liệu)
400 : Kiểm tra tồn tại hay chưa
401 : ko co quyen truy cap
404 : Không tìm thấy
500 : Lỗi server
```
## Tài khoản admin
email: admin@example.com, pass: admin123