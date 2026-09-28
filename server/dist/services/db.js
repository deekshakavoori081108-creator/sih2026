import pg from 'pg';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let isPostgres = false;
let pgPool = null;
let sqliteDb = null;
const databaseUrl = process.env.DATABASE_URL;
export async function initDb() {
    if (databaseUrl && databaseUrl.trim().length > 0) {
        try {
            console.log('Attempting connection to PostgreSQL...');
            pgPool = new pg.Pool({
                connectionString: databaseUrl,
                ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
                connectionTimeoutMillis: 3000
            });
            await pgPool.query('SELECT 1');
            isPostgres = true;
            console.log('✅ Connected to PostgreSQL database');
        }
        catch (err) {
            console.warn('⚠️ Could not connect to PostgreSQL, falling back to local SQLite:', err.message);
            pgPool = null;
            isPostgres = false;
        }
    }
    if (!isPostgres) {
        const dbPath = path.resolve(__dirname, '../../katha_yatra.db');
        sqliteDb = new Database(dbPath);
        sqliteDb.pragma('journal_mode = WAL');
        console.log(`✅ Using SQLite database at: ${dbPath}`);
    }
    await createTables();
}
async function createTables() {
    if (isPostgres && pgPool) {
        await pgPool.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          guardian_name VARCHAR(255) NOT NULL,
          guardian_id_type VARCHAR(50) NOT NULL,
          guardian_id_hash VARCHAR(255) NOT NULL,
          kyc_verified BOOLEAN DEFAULT TRUE,
          child_name VARCHAR(255) NOT NULL,
          child_age INT NOT NULL,
          reward_points INT DEFAULT 0,
          current_streak INT DEFAULT 0,
          last_login_date DATE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_preferences (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          preferred_category VARCHAR(100) NOT NULL,
          secondary_categories TEXT[] DEFAULT '{}',
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_progress (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          category VARCHAR(100) NOT NULL,
          game_type VARCHAR(50) NOT NULL,
          levels_completed INT DEFAULT 0,
          total_xp INT DEFAULT 0,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS unlocked_stories (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          topic VARCHAR(100) NOT NULL,
          chapter_number INT NOT NULL,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          cliffhanger_prompt TEXT NOT NULL,
          unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, topic, chapter_number)
      );

      CREATE TABLE IF NOT EXISTS premium_unlocks (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          module_type VARCHAR(50) NOT NULL,
          module_title VARCHAR(255) NOT NULL,
          points_spent INT NOT NULL,
          unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS streak_logs (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          log_date DATE NOT NULL,
          points_earned INT DEFAULT 0,
          UNIQUE(user_id, log_date)
      );
    `);
    }
    else if (sqliteDb) {
        sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          guardian_name TEXT NOT NULL,
          guardian_id_type TEXT NOT NULL,
          guardian_id_hash TEXT NOT NULL,
          kyc_verified INTEGER DEFAULT 1,
          child_name TEXT NOT NULL,
          child_age INTEGER NOT NULL,
          reward_points INTEGER DEFAULT 0,
          current_streak INTEGER DEFAULT 0,
          last_login_date TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_preferences (
          id TEXT PRIMARY KEY,
          user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
          preferred_category TEXT NOT NULL,
          secondary_categories TEXT DEFAULT '[]',
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_progress (
          id TEXT PRIMARY KEY,
          user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
          category TEXT NOT NULL,
          game_type TEXT NOT NULL,
          levels_completed INTEGER DEFAULT 0,
          total_xp INTEGER DEFAULT 0,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS unlocked_stories (
          id TEXT PRIMARY KEY,
          user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
          topic TEXT NOT NULL,
          chapter_number INTEGER NOT NULL,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          cliffhanger_prompt TEXT NOT NULL,
          unlocked_at TEXT DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, topic, chapter_number)
      );

      CREATE TABLE IF NOT EXISTS premium_unlocks (
          id TEXT PRIMARY KEY,
          user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
          module_type TEXT NOT NULL,
          module_title TEXT NOT NULL,
          points_spent INTEGER NOT NULL,
          unlocked_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS streak_logs (
          id TEXT PRIMARY KEY,
          user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
          log_date TEXT NOT NULL,
          points_earned INTEGER DEFAULT 0,
          UNIQUE(user_id, log_date)
      );
    `);
    }
}
export async function query(sqlText, params = []) {
    if (isPostgres && pgPool) {
        const res = await pgPool.query(sqlText, params);
        return res.rows;
    }
    else if (sqliteDb) {
        // Convert $1, $2 to ? for SQLite
        let sqliteSql = sqlText.replace(/\$(\d+)/g, '?');
        // Convert boolean inputs/outputs where necessary
        const convertedParams = params.map(p => {
            if (typeof p === 'boolean')
                return p ? 1 : 0;
            if (Array.isArray(p))
                return JSON.stringify(p);
            return p;
        });
        const isSelect = /^\s*(SELECT|PRAGMA)/i.test(sqliteSql);
        if (isSelect) {
            const stmt = sqliteDb.prepare(sqliteSql);
            const rows = stmt.all(...convertedParams);
            return rows.map((r) => {
                // parse JSON strings or boolean numbers if needed
                if (r && typeof r.kyc_verified === 'number') {
                    r.kyc_verified = Boolean(r.kyc_verified);
                }
                if (r && typeof r.secondary_categories === 'string') {
                    try {
                        r.secondary_categories = JSON.parse(r.secondary_categories);
                    }
                    catch {
                        // keep as is
                    }
                }
                return r;
            });
        }
        else {
            const stmt = sqliteDb.prepare(sqliteSql);
            const info = stmt.run(...convertedParams);
            return [{ ...info }];
        }
    }
    throw new Error('Database not initialized');
}
export async function queryOne(sqlText, params = []) {
    const rows = await query(sqlText, params);
    return rows.length > 0 ? rows[0] : null;
}
