# Clone Deployment Guide

Quick guide to deploy a new instance of the loan application on the same server.
---

## Prerequisites

- Server IP: `34.68.192.163`
- Domain: `xsis.online`
- Existing PostgreSQL container: `concierge_postgres`
- First instance already running on port 5000

---

## Step-by-Step Setup

### 1. Choose Your Configuration

Pick a name and port for your new instance:

| Instance Name | Subdomain | Port | Database | Web Root |
|--------------|-----------|------|----------|----------|
| loan-app | express.xsis.online | 5000 | loan_db | /var/www/loan-app |
| splendor | splendor.xsis.online | 5001 | splendor_db | /var/www/splendor |
| **your-name** | **your-name.xsis.online** | **5002** | **your-name_db** | **/var/www/your-name** |

---

### 2. Add DNS Record

Go to your domain registrar and add an A record:

```
Type: A
Name: your-name
Value: 34.68.192.163
TTL: 3600
```

Wait 5-30 minutes for DNS propagation.

---

### 3. Clone Repository

```bash
cd ~
git clone https://github.com/Pompompurin888k/loan-app.git your-name
cd your-name
```

---

### 4. Create Database

```bash
# Create database
docker exec -i concierge_postgres psql -U concierge_user -d concierge_db << 'EOF'
CREATE DATABASE your_name_db;
GRANT ALL PRIVILEGES ON DATABASE your_name_db TO loanuser;
EOF

# Grant schema permissions
docker exec -i concierge_postgres psql -U concierge_user -d your_name_db << 'EOF'
GRANT ALL ON SCHEMA public TO loanuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO loanuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO loanuser;
EOF

# Initialize schema
docker exec -i concierge_postgres psql -U loanuser -d your_name_db < ~/your-name/postgres/init.sql
```

---

### 5. Create Test User

```bash
docker exec -i concierge_postgres psql -U loanuser -d your_name_db << 'EOF'
INSERT INTO users (email, password, first_name, last_name, phone, address)
VALUES ('test@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYfQC.OwJIq', 'Test', 'User', '+263712345678', 'Test Address');
EOF
```

---

### 6. Setup Backend

```bash
cd ~/your-name/backend
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
PORT=5002
CORS_ORIGINS=https://your-name.xsis.online,http://localhost:5173
EOF
```

---

### 7. Create Systemd Service

```bash
sudo tee /etc/systemd/system/your-name-backend.service > /dev/null << 'EOF'
[Unit]
Description=Your Name Loan Application Backend API
After=network.target

[Service]
Type=simple
User=HP
WorkingDirectory=/home/HP/your-name/backend
EnvironmentFile=/home/HP/your-name/backend/.env
Environment="PATH=/home/HP/your-name/backend/venv/bin"
ExecStart=/home/HP/your-name/backend/venv/bin/python main.py
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
sudo lsof -i :5002
```

---

### 8. Build Frontend

```bash
cd ~/your-name/frontend

cat > .env << 'EOF'
VITE_API_URL=https://your-name.xsis.online
VITE_WEBHOOK_URL=https://n8n.xsis.online/webhook/your-name
EOF

npm install
npm run build
```

---

### 9. Deploy Frontend

```bash
sudo mkdir -p /var/www/your-name
sudo cp -r dist/* /var/www/your-name/
sudo chown -R www-data:www-data /var/www/your-name
```

---

### 10. Configure Nginx

```bash
sudo tee /etc/nginx/sites-available/your-name.xsis.online > /dev/null << 'EOF'
server {
    server_name your-name.xsis.online;

    root /var/www/your-name;
    index index.html;

    # API endpoints - proxy to backend
    location /api/ {
        proxy_pass http://localhost:5002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /docs {
        proxy_pass http://localhost:5002/docs;
    }

    location /redoc {
        proxy_pass http://localhost:5002/redoc;
    }

    location /health {
        proxy_pass http://localhost:5002/health;
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

sudo ln -sf /etc/nginx/sites-available/your-name.xsis.online /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### 11. Get SSL Certificate

```bash
sudo certbot --nginx -d your-name.xsis.online
```

---

## Verification

```bash
# Check backend
sudo systemctl status your-name-backend
curl https://your-name.xsis.online/health

# Check frontend
curl -I https://your-name.xsis.online

# Test application
# Visit: https://your-name.xsis.online
```

---

## Quick Reference

### Port Assignments

Keep track of your instances:

| Instance | Port | Database | Status |
|----------|------|----------|--------|
| loan-app | 5000 | loan_db | ✅ Running |
| splendor | 5001 | splendor_db | ✅ Running |
| your-name | 5002 | your_name_db | 🆕 New |

### Common Commands

```bash
# Restart backend
sudo systemctl restart your-name-backend

# View logs
sudo journalctl -u your-name-backend -f

# Update frontend
cd ~/your-name/frontend
npm run build
sudo cp -r dist/* /var/www/your-name/

# Update from GitHub
cd ~/your-name
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
sudo nano /etc/nginx/sites-available/your-name.xsis.online
# Make sure proxy_pass uses the correct port
```

### Application submission fails

```bash
# No test user in database
docker exec -i concierge_postgres psql -U loanuser -d your_name_db -c "SELECT * FROM users;"

# If empty, run step 5 again
```

---

## Notes

- **Database naming**: Use underscores (`your_name_db`), not hyphens
- **Port numbers**: Each instance needs a unique port (5000, 5001, 5002, etc.)
- **Webhook URLs**: Each instance can have its own webhook endpoint
- **Test user password**: `password` (already hashed in the INSERT command)

---

## Next Instance

To add another instance, just repeat these steps with:
- New name (e.g., `instance3`)
- New port (e.g., `5003`)
- New database (e.g., `instance3_db`)
- New subdomain (e.g., `instance3.xsis.online`)

Happy deploying! 🚀