# Clone Deployment Guide - Babe Server (34.61.100.161)

Quick guide to deploy multiple instances of the loan application on the Babe server using the existing PostgreSQL container.

---

## Prerequisites

- Server IP: `34.61.100.161`
- Server User: `toxicgreys001`
- Existing PostgreSQL container: `loan-app-db` (already running)
- First instance already running: `loan-app` on port 5000
- Web root: `/var/www/html/loan-app`

---

## Step-by-Step Setup

### 1. Choose Your Configuration

Pick a name and port for your new instance:

| Instance Name | Subdomain | Port | Database | Web Root |
|--------------|-----------|------|----------|----------|
| loan-app | (existing) | 5000 | loan_db | /var/www/html/loan-app |
| **your-name** | **your-name.domain.com** | **5001** | **your_name_db** | **/var/www/html/your-name** |

> **Note**: Replace `your-name` with your actual instance name (e.g., `cash2`, `express2`, `splendor`)

---

### 2. Add DNS Record

Go to your domain registrar and add an A record:

```
Type: A
Name: your-name
Value: 34.61.100.161
TTL: 3600
```

Wait 5-30 minutes for DNS propagation.

---

### 3. Clone Repository

```bash
# SSH into the server
ssh toxicgreys001@34.61.100.161

# Navigate to web root
cd /var/www/html

# Clone the repository
git clone https://github.com/Pompompurin888k/loan-app.git your-name
cd your-name
```

---

### 4. Create Database in Existing Container

```bash
# Create new database
sudo docker exec -it loan-app-db psql -U loanuser -d loan_db << 'EOF'
CREATE DATABASE your_name_db;
EOF

# Grant schema permissions
sudo docker exec -it loan-app-db psql -U loanuser -d your_name_db << 'EOF'
GRANT ALL ON SCHEMA public TO loanuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO loanuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO loanuser;
EOF

# Initialize schema (make sure you're in the project directory)
cd /var/www/html/your-name
sudo docker exec -i loan-app-db psql -U loanuser -d your_name_db < postgres/init.sql

# Verify tables were created
sudo docker exec -it loan-app-db psql -U loanuser -d your_name_db -c "\dt"
```

**Expected output**: Should show 4 tables (users, loan_products, loan_applications, documents)

---

### 5. Setup Backend

```bash
cd /var/www/html/your-name/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create `.env` file:

```bash
cat > .env << 'EOF'
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_name_db
DB_USER=loanuser
DB_PASSWORD=loanpass123
JWT_SECRET=change-this-secret-key-your-name
PORT=5001
CORS_ORIGINS=https://your-name.domain.com,http://localhost:5173
EOF
```

> **Important**: Change `PORT=5001` to a unique port for each instance (5001, 5002, 5003, etc.)

---

### 6. Create Systemd Service

```bash
sudo tee /etc/systemd/system/your-name-backend.service > /dev/null << 'EOF'
[Unit]
Description=Your Name Loan Application Backend API
After=network.target

[Service]
Type=simple
User=toxicgreys001
WorkingDirectory=/var/www/html/your-name/backend
EnvironmentFile=/var/www/html/your-name/backend/.env
Environment="PATH=/var/www/html/your-name/backend/venv/bin"
ExecStart=/var/www/html/your-name/backend/venv/bin/python main.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable your-name-backend
sudo systemctl start your-name-backend
```

Verify it's running:

```bash
sudo systemctl status your-name-backend
sudo lsof -i :5001
```

---

### 7. Build Frontend

```bash
cd /var/www/html/your-name/frontend

cat > .env << 'EOF'
VITE_API_URL=https://your-name.domain.com
VITE_WEBHOOK_URL=https://n8n.xsis.online/webhook/your-name
EOF

npm install
npm run build
```

---

### 8. Deploy Frontend

```bash
sudo mkdir -p /var/www/html/your-name-web
sudo cp -r dist/* /var/www/html/your-name-web/
sudo chown -R www-data:www-data /var/www/html/your-name-web
```

---

### 9. Configure Nginx

```bash
sudo tee /etc/nginx/sites-available/your-name.domain.com > /dev/null << 'EOF'
server {
    server_name your-name.domain.com;

    root /var/www/html/your-name-web;
    index index.html;

    # API endpoints - proxy to backend
    location /api/ {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /docs {
        proxy_pass http://localhost:5001/docs;
    }

    location /redoc {
        proxy_pass http://localhost:5001/redoc;
    }

    location /health {
        proxy_pass http://localhost:5001/health;
    }

    # Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";

    listen 80;
}
EOF

sudo ln -sf /etc/nginx/sites-available/your-name.domain.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### 10. Get SSL Certificate

```bash
sudo certbot --nginx -d your-name.domain.com
```

---

## Verification

```bash
# Check backend
sudo systemctl status your-name-backend
curl https://your-name.domain.com/health

# Check frontend
curl -I https://your-name.domain.com

# Check database
sudo docker exec -it loan-app-db psql -U loanuser -d your_name_db -c "SELECT COUNT(*) FROM loan_products;"

# Test application
# Visit: https://your-name.domain.com
```

---

## Quick Reference

### Port Assignments

Keep track of your instances:

| Instance | Port | Database | Status |
|----------|------|----------|--------|
| loan-app | 5000 | loan_db | ✅ Running |
| your-name | 5001 | your_name_db | 🆕 New |
| instance-3 | 5002 | instance3_db | 📝 Future |

### Database Container Info

```bash
# List all databases in the container
sudo docker exec -it loan-app-db psql -U loanuser -d loan_db -c "\l"

# Connect to a specific database
sudo docker exec -it loan-app-db psql -U loanuser -d your_name_db

# Check container status
sudo docker ps | grep loan-app-db
```

### Common Commands

```bash
# Restart backend
sudo systemctl restart your-name-backend

# View logs
sudo journalctl -u your-name-backend -f

# Update frontend
cd /var/www/html/your-name/frontend
npm run build
sudo cp -r dist/* /var/www/html/your-name-web/

# Update from GitHub
cd /var/www/html/your-name
git pull
# Then rebuild frontend and restart backend
```

---

## Troubleshooting

### Backend won't start

```bash
# Check logs
sudo journalctl -u your-name-backend -n 50

# Common issues:
# 1. Port already in use - change PORT in .env
# 2. Database doesn't exist - run step 4 again
# 3. Missing dependencies - run pip install -r requirements.txt
```

### Frontend shows 502 Bad Gateway

```bash
# Backend not running
sudo systemctl status your-name-backend

# Wrong port in Nginx config
sudo nano /etc/nginx/sites-available/your-name.domain.com
# Make sure proxy_pass uses the correct port (5001, 5002, etc.)
```

### Database connection failed

```bash
# Check if container is running
sudo docker ps | grep loan-app-db

# Check if database exists
sudo docker exec -it loan-app-db psql -U loanuser -d loan_db -c "\l" | grep your_name_db

# Test connection
sudo docker exec -it loan-app-db psql -U loanuser -d your_name_db -c "SELECT 1;"
```

### Application submission fails

```bash
# Check backend logs for errors
sudo journalctl -u your-name-backend -n 50

# Verify database tables exist
sudo docker exec -it loan-app-db psql -U loanuser -d your_name_db -c "\dt"

# Check if users are being created (should auto-create on first application)
sudo docker exec -it loan-app-db psql -U loanuser -d your_name_db -c "SELECT id, email, first_name, last_name FROM users;"

# Check loan applications
sudo docker exec -it loan-app-db psql -U loanuser -d your_name_db -c "SELECT id, user_id, amount, status FROM loan_applications;"
```

---

## Notes

- **Auto-User Creation**: Users are automatically created from loan application forms (no manual user creation needed!)
- **Database naming**: Use underscores (`your_name_db`), not hyphens
- **Port numbers**: Each instance needs a unique port (5000, 5001, 5002, etc.)
- **Shared PostgreSQL**: All instances use the same `loan-app-db` container but different databases
- **Webhook URLs**: Each instance can have its own webhook endpoint
- **Phone Validation**: Login page validates phone numbers in format: +263 77 123 4567
- **Environment Variables**: Webhook URL is configurable via `.env` file

---

## Server-Specific Information

### PostgreSQL Container Details

```bash
Container Name: loan-app-db
Image: postgres:15-alpine
Port: 5432
User: loanuser
Password: loanpass123
```

### File Structure

```
/var/www/html/
├── loan-app/              # First instance (port 5000)
│   ├── backend/
│   ├── frontend/
│   └── postgres/
├── your-name/             # New instance (port 5001)
│   ├── backend/
│   ├── frontend/
│   └── postgres/
└── your-name-web/         # Nginx web root for new instance
```

---

## Next Instance

To add another instance, repeat these steps with:
- New name (e.g., `instance3`)
- New port (e.g., `5002`)
- New database (e.g., `instance3_db`)
- New subdomain (e.g., `instance3.domain.com`)

All instances will share the same PostgreSQL container (`loan-app-db`) but use separate databases.

---

Happy deploying! 🚀
