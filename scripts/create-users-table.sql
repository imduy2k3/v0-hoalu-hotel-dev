-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'manager')),
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login_at TIMESTAMP
);

-- Insert default users
INSERT INTO users (username, email, full_name, role, password_hash, is_active) VALUES
('admin', 'admin@hoalucity.com', 'Quản trị viên', 'admin', 'admin123', true),
('manager1', 'manager1@hoalucity.com', 'Nguyễn Văn A', 'manager', 'manager123', true),
('manager2', 'manager2@hoalucity.com', 'Trần Thị B', 'manager', 'manager123', true)
ON CONFLICT (username) DO NOTHING;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
