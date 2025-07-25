import sqlite3 from 'sqlite3';
import { OTPRepository } from '@/domain/repositories/otp-repository';
import { Otp } from '@/domain/entities/otp';

interface OTPRow {
  id: string;
  token: string;
  created_at: string;
  expires_at: string;
  is_used: number;
}

export class SQLiteOTPRepository implements OTPRepository {
  private db: sqlite3.Database;

  constructor(dbPath: string) {
    this.db = new sqlite3.Database(dbPath);
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS otps (
        id TEXT PRIMARY KEY,
        token TEXT UNIQUE NOT NULL,
        created_at DATETIME NOT NULL,
        expires_at DATETIME NOT NULL,
        is_used BOOLEAN DEFAULT FALSE
      )
    `;

    this.db.run(createTableSQL, (err: Error | null) => {
      if (err) {
        console.error('Error creating table:', err);
      }
    });
  }

  async create(otp: Otp): Promise<Otp> {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO otps (id, token, created_at, expires_at, is_used)
        VALUES (?, ?, ?, ?, ?)
      `;
      
      this.db.run(sql, [
        otp.id,
        otp.token,
        otp.createdAt.toISOString(),
        otp.expiresAt.toISOString(),
        otp.isUsed ? 1 : 0
      ], function(err: Error | null) {
        if (err) {
          reject(err);
        } else {
          resolve(otp);
        }
      });
    });
  }

  async findByToken(token: string): Promise<Otp | null> {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM otps WHERE token = ?';
      
      this.db.get(sql, [token], (err: Error | null, row: OTPRow | undefined) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          resolve({
            id: row.id,
            token: row.token,
            createdAt: new Date(row.created_at),
            expiresAt: new Date(row.expires_at),
            isUsed: Boolean(row.is_used)
          });
        }
      });
    });
  }

  async markAsUsed(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE otps SET is_used = 1 WHERE id = ?';
      
      this.db.run(sql, [id], function(err: Error | null) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async deleteExpired(): Promise<void> {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM otps WHERE expires_at < ?';
      const now = new Date().toISOString();
      
      this.db.run(sql, [now], function(err: Error | null) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  close(): void {
    this.db.close();
  }
} 