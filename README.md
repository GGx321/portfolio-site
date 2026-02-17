# NYX Blockchain - Landing Page

Официальный лендинг NYX блокчейна с participation-программой.

## Технологии

- **Next.js 16** (App Router)
- **TypeScript**
- **TailwindCSS**
- **i18n** (Русский/English)

## Локальная разработка

### Требования

- Node.js 18+
- npm/yarn/pnpm

### Установка

```bash
# Клонировать репозиторий
git clone <repo-url>
cd loonix

# Установить зависимости
npm install

# Скопировать .env
cp .env.example .env

# Настроить переменные окружения
nano .env
```

### Конфигурация (.env)

```bash
NEXT_PUBLIC_SITE_URL="https://nyx-blockchain.info"
NEXT_PUBLIC_SITE_NAME="NYX"
NEXT_PUBLIC_TELEGRAM_BOT_URL="https://t.me/your_bot"
```

### Запуск

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

Сайт будет доступен на http://localhost:3000

---

## Деплой на VPS (Ubuntu 22.04)

### 0. Подключение к серверу

```bash
# Подключиться к VPS через SSH
ssh root@your-server-ip
# или
ssh user@your-server-ip

# Пример:
# ssh root@123.45.67.89
```

Замените `your-server-ip` на IP адрес вашего VPS.

### 1. Подготовка сервера

```bash
# Обновить систему
sudo apt update && sudo apt upgrade -y

# Установить необходимые пакеты
sudo apt install -y curl git ufw fail2ban

# Настроить firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

### 2. Установка Node.js

```bash
# Установить Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Проверить версию
node -v
npm -v
```

### 3. Установка PM2

```bash
# Установить PM2 глобально
sudo npm install -g pm2

# Настроить автозапуск
pm2 startup systemd
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER
```

### 4. Перенос проекта на сервер

> 💡 **Собираем локально:** Билдим проект на Mac и переносим готовый. Это быстрее и экономит ресурсы VPS.

**На сервере (создать директорию):**

```bash
cd /var/www
sudo mkdir nyx
sudo chown $USER:$USER nyx
```

**На вашем локальном компьютере:**

```bash
# Перейти в директорию проекта
cd /Users/alex/Projects/loonix

# Собрать production build локально
npm run build

# Перенести проект со сборкой на сервер
rsync -avz --progress \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='.env' \
  --exclude='*.log' \
  ./ user@your-server-ip:/var/www/nyx/

# Замените user@your-server-ip на свои данные
# Пример: rsync -avz ... root@123.45.67.89:/var/www/nyx/
```

**На сервере (установка и настройка):**

```bash
cd /var/www/nyx

# Установить только production зависимости (без devDependencies)
npm install --omit=dev

# Настроить .env
nano .env
```

**Конфигурация .env:**

```bash
NEXT_PUBLIC_SITE_URL="https://nyx-blockchain.info"
NEXT_PUBLIC_SITE_NAME="NYX"
NEXT_PUBLIC_TELEGRAM_BOT_URL="https://t.me/your_bot"
```

```bash
# Запустить через PM2 (билд уже готов с локальной машины)
pm2 start npm --name "nyx" -- start
pm2 save
```

### 5. Установка и настройка Nginx с SSL и защитой

```bash
# Установить Nginx
sudo apt install -y nginx

# Установить Certbot для SSL
sudo apt install -y certbot python3-certbot-nginx
```

**Создать конфиг Nginx:**

```bash
sudo nano /etc/nginx/sites-available/nyx
```

**Базовый конфиг (Certbot добавит SSL автоматически):**

```nginx
# Rate limiting зоны
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=api:10m rate=5r/s;
limit_conn_zone $binary_remote_addr zone=addr:10m;

server {
    listen 80;
    server_name nyx-blockchain.info www.nyx-blockchain.info;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:;" always;

    # Rate limiting
    limit_req zone=general burst=20 nodelay;
    limit_conn addr 10;

    # Client body size limit
    client_body_timeout 10s;
    client_header_timeout 10s;
    client_max_body_size 1m;

    # Блокировка нежелательных методов
    if ($request_method !~ ^(GET|POST|HEAD)$) {
        return 405;
    }

    # Блокировка подозрительных User-Agent (кроме популярных поисковиков)
    if ($http_user_agent ~* "(semrush|ahrefs|majestic)") {
        return 403;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # API endpoints с более строгим rate limit
    location /api/ {
        limit_req zone=api burst=10 nodelay;
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Активировать конфиг:**

```bash
# Включить конфиг
sudo ln -s /etc/nginx/sites-available/nyx /etc/nginx/sites-enabled/

# Проверить конфигурацию
sudo nginx -t

# Перезапустить Nginx
sudo systemctl restart nginx
```

### 6. Получить SSL сертификат

```bash
# Получить SSL сертификат (Certbot обновит конфиг автоматически)
sudo certbot --nginx -d nyx-blockchain.info -d www.nyx-blockchain.info

# Настроить автообновление сертификата
sudo certbot renew --dry-run
```

Certbot автоматически:
- Добавит SSL сертификаты
- Создаст редирект с HTTP на HTTPS
- Настроит SSL параметры

Готово! 🎉

### 7. Настройка Fail2Ban (защита от брутфорса)

```bash
# Создать фильтр для Nginx
sudo nano /etc/fail2ban/filter.d/nginx-rate-limit.conf
```

```ini
[Definition]
failregex = limiting requests, excess:.* by zone.*client: <HOST>
ignoreregex =
```

```bash
# Создать jail для Nginx
sudo nano /etc/fail2ban/jail.local
```

```ini
[nginx-rate-limit]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 5
findtime = 600
bantime = 3600

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 3
findtime = 600
bantime = 3600
```

```bash
# Перезапустить Fail2Ban
sudo systemctl restart fail2ban

# Проверить статус
sudo fail2ban-client status
```

### 8. Мониторинг и логи

```bash
# Логи PM2
pm2 logs nyx
pm2 monit

# Логи Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Системные ресурсы
pm2 status
htop
```

### 9. Обновление проекта

**На локальном компьютере:**

```bash
# Перейти в директорию проекта
cd /Users/alex/Projects/loonix

# Собрать обновленную версию
npm run build

# Перенести обновления со сборкой на сервер
rsync -avz --progress \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='.env' \
  --exclude='*.log' \
  ./ user@your-server-ip:/var/www/nyx/
```

**На сервере:**

```bash
cd /var/www/nyx

# Установить новые зависимости (если появились)
npm install --omit=dev

# Перезапустить приложение
pm2 restart nyx
```

**Одной командой (после npm run build локально):**

```bash
# С локального компьютера
rsync -avz --progress \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='.env' \
  ./ user@your-server-ip:/var/www/nyx/ \
  && ssh user@your-server-ip "cd /var/www/nyx && npm install --omit=dev && pm2 restart nyx"
```

---

## Полезные команды PM2

```bash
# Статус процессов
pm2 status

# Перезапустить приложение
pm2 restart nyx

# Остановить приложение
pm2 stop nyx

# Удалить из PM2
pm2 delete nyx

# Просмотр логов
pm2 logs nyx --lines 100

# Мониторинг в реальном времени
pm2 monit

# Сохранить конфигурацию
pm2 save

# Очистить логи
pm2 flush
```

---

## Проверка безопасности

После деплоя проверьте:

1. **SSL/TLS**: https://www.ssllabs.com/ssltest/analyze.html?d=nyx-blockchain.info
2. **Security Headers**: https://securityheaders.com/?q=nyx-blockchain.info
3. **DDoS защита**: Попробуйте отправить несколько быстрых запросов подряд
4. **Rate Limiting**: Убедитесь, что получаете 429 ошибку при превышении лимита

---

## Структура проекта

```
loonix/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React компоненты
│   │   └── sections/     # Секции лендинга
│   ├── i18n/             # Переводы (ru/en)
│   ├── config/           # Конфигурация
│   └── lib/              # Утилиты
├── public/               # Статические файлы
├── .env                  # Переменные окружения
├── ecosystem.config.js   # PM2 конфигурация
└── package.json
```

---

## Поддержка

Домен: **nyx-blockchain.info**  
Telegram Bot: Указать в `.env`

---

## Лицензия

Proprietary
