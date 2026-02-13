# How to Reset PostgreSQL Password on Windows

## Method 1: Using pgAdmin (If installed)
1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click on "Login/Group Roles" → "postgres"
4. Go to "Definition" tab
5. Enter a new password
6. Click Save

## Method 2: Using psql Command Line
1. Open Command Prompt as Administrator
2. Navigate to PostgreSQL bin folder (usually: `C:\Program Files\PostgreSQL\{version}\bin`)
3. Run: `psql -U postgres`
4. If it asks for password and you don't know it, you need to edit `pg_hba.conf` first

## Method 3: Edit pg_hba.conf (If you forgot password)
1. Find `pg_hba.conf` file (usually in: `C:\Program Files\PostgreSQL\{version}\data\pg_hba.conf`)
2. Open as Administrator
3. Change this line:
   ```
   host    all             all             127.0.0.1/32            scram-sha-256
   ```
   to:
   ```
   host    all             all             127.0.0.1/32            trust
   ```
4. Restart PostgreSQL service:
   - Open Services (Win + R, type `services.msc`)
   - Find "postgresql-x64-{version}"
   - Right-click → Restart
5. Now connect without password and reset it:
   ```
   psql -U postgres
   ALTER USER postgres PASSWORD 'your_new_password';
   ```
6. Change `pg_hba.conf` back to `scram-sha-256`
7. Restart PostgreSQL service again

## After Getting the Password
Update your `.env` file:
```
DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@localhost:5432/technoheart?schema=public"
```
