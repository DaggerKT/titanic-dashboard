

# Titanic Dashboard
แดชบอร์ดวิเคราะห์ข้อมูล Titanic ด้วย React, Express, PostgreSQL และ Docker

---

## วิธีใช้งาน

### 1. รันบนเครื่อง (Local)
รันคำสั่งเดียวจบ:
```bash
bash start-all.sh
```
หรือถ้าต้องการรันทีละขั้นตอน:
1. ติดตั้ง dependencies:
   ```bash
   npm install
   cd backend && npm install
   ```
2. สร้างไฟล์ build ของ frontend:
   ```bash
   npm run build
   ```
3. รันทุก service:
   ```bash
   docker-compose up --build
   ```
4. เปิด [http://localhost](http://localhost) เพื่อใช้งาน

### 2. รันบน GitHub Codespaces (โชว์/ทดสอบ)
1. สร้าง Codespace จากหน้า repo
2. เปิด Terminal แล้วรัน:
   ```bash
   bash start-all.sh
   ```
3. เปิด Ports panel แล้วคลิก port 80 เพื่อ preview dashboard

### 3. CI/CD ด้วย GitHub Actions
ทุกครั้งที่ push ไป branch main จะมี workflow อัตโนมัติสำหรับ build และ push Docker image ไปที่ Docker Hub
- ดูสถานะ workflow: [GitHub Actions](https://github.com/DaggerKT/titanic-dashboard/actions)
- ดู image/tag: [Docker Hub](https://hub.docker.com/r/daagerk/titanic-dashboard/tags)

#### ตั้งค่า Secrets สำหรับ workflow
เพิ่ม Secrets ใน GitHub repository:
- `DOCKERHUB_USERNAME` = ชื่อผู้ใช้ Docker Hub
- `DOCKERHUB_TOKEN` = Access Token จาก Docker Hub (Read, Write, Delete)

---

## โครงสร้างโปรเจกต์
- `src/` - React frontend
- `backend/` - Express API
- `public/` - Static assets (Titanic Dataset.csv, etc.)
- `nginx.conf` - nginx reverse proxy config
- `docker-compose.yml` - Multi-service orchestration
- `start-all.sh` - สคริปต์รันทุกอย่าง

## ฟีเจอร์
- Dashboard กราฟและคอมเมนต์ (Ant Design, Recharts)
- Full-stack: React, Express, PostgreSQL
- Docker Compose deploy ง่าย
- Production-ready: nginx reverse proxy, static build, API proxy

## แก้ปัญหาเบื้องต้น
- ถ้าเจอ 403 Forbidden จาก nginx ให้เช็ค permission ในโฟลเดอร์ `dist/`
- ถ้า build ล้มเหลว (EACCES) ให้รัน:
  ```bash
  sudo chown -R $USER:$USER public/
  chmod -R a+r public/
  rm -rf dist
  npm run build
  ```
- ถ้า API error ให้ดู log backend และเช็ค database

## เทคโนโลยีที่ใช้
React, Vite, Express, PostgreSQL, Docker, nginx, Ant Design, Recharts
