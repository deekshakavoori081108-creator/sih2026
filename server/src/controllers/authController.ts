import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { KycRegisterSchema, LoginSchema, UserPreferencesSchema } from '../schemas/validation.js';
import { query, queryOne } from '../services/db.js';
import { getCuratedChapter } from '../data/seedStories.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-katha-yatra-jwt-key-2026-production';

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

export async function register(req: Request, res: Response) {
  try {
    const validated = KycRegisterSchema.parse(req.body);
    const email = validated.email.toLowerCase().trim();

    // Check if user already exists
    const existing = await queryOne('SELECT id FROM users WHERE email = $1', [email]);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email address already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(validated.password, salt);

    // Hash Guardian Government ID for secure KYC verification record
    const idHash = crypto.createHash('sha256').update(validated.guardianIdNumber).digest('hex');
    const maskedId = `***-***-${validated.guardianIdNumber.slice(-4)}`;

    const userId = uuidv4();
    const today = getTodayString();

    // Welcome bonus reward points (100) + Day 1 streak
    await query(`
      INSERT INTO users (
        id, email, password_hash, guardian_name, guardian_id_type, guardian_id_hash,
        kyc_verified, child_name, child_age, reward_points, current_streak, last_login_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `, [
      userId,
      email,
      passwordHash,
      validated.guardianName,
      validated.guardianIdType,
      idHash,
      true, // kyc_verified
      validated.childName,
      validated.childAge,
      100, // starting bonus reward points
      1,   // starting streak
      today
    ]);

    // Create default preferences
    const prefId = uuidv4();
    await query(`
      INSERT INTO user_preferences (id, user_id, preferred_category, secondary_categories)
      VALUES ($1, $2, $3, $4)
    `, [prefId, userId, 'Ramayana & Epics', ['Indus Valley Civilization', 'Space Exploration']]);

    // Record Day 1 streak log
    const streakLogId = uuidv4();
    await query(`
      INSERT INTO streak_logs (id, user_id, log_date, points_earned)
      VALUES ($1, $2, $3, $4)
    `, [streakLogId, userId, today, 25]);

    // Pre-unlock starter Chapter 1 so child has an immediate immersive story
    const starterChapter = getCuratedChapter('Ramayana & Epics', 1);
    const storyId = uuidv4();
    await query(`
      INSERT INTO unlocked_stories (id, user_id, topic, chapter_number, title, content, cliffhanger_prompt)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      storyId,
      userId,
      starterChapter.topic,
      starterChapter.chapterNumber,
      starterChapter.title,
      starterChapter.narrativeText,
      starterChapter.cliffhanger
    ]);

    // Issue JWT
    const token = jwt.sign(
      {
        userId,
        email,
        guardianName: validated.guardianName,
        childName: validated.childName,
        kycVerified: true
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'KYC verified and account created successfully!',
      token,
      user: {
        id: userId,
        email,
        guardianName: validated.guardianName,
        guardianIdType: validated.guardianIdType,
        maskedId,
        kycVerified: true,
        childName: validated.childName,
        childAge: validated.childAge,
        rewardPoints: 100,
        currentStreak: 1,
        preferredCategory: 'Ramayana & Epics'
      }
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0]?.message || 'Validation error' });
    }
    console.error('Error during registration:', error);
    return res.status(500).json({ error: 'Server error during KYC registration' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const validated = LoginSchema.parse(req.body);
    const email = validated.email.toLowerCase().trim();

    const user = await queryOne('SELECT * FROM users WHERE email = $1', [email]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(validated.password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Handle streak calculation
    const today = getTodayString();
    const yesterday = getYesterdayString();
    let updatedStreak = user.current_streak || 1;

    if (user.last_login_date === yesterday) {
      // Successive day login -> increment streak!
      updatedStreak += 1;
      await query(
        'UPDATE users SET current_streak = $1, last_login_date = $2, reward_points = reward_points + 20 WHERE id = $3',
        [updatedStreak, today, user.id]
      );
      // Log streak
      const logId = uuidv4();
      try {
        await query(
          'INSERT INTO streak_logs (id, user_id, log_date, points_earned) VALUES ($1, $2, $3, $4)',
          [logId, user.id, today, 20]
        );
      } catch {
        // ignore duplicate entry for same day
      }
    } else if (user.last_login_date !== today) {
      // Streak broken or first day after gap -> reset to 1
      updatedStreak = 1;
      await query(
        'UPDATE users SET current_streak = 1, last_login_date = $1 WHERE id = $2',
        [today, user.id]
      );
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        guardianName: user.guardian_name,
        childName: user.child_name,
        kycVerified: Boolean(user.kyc_verified)
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Fetch user preferences
    const pref = await queryOne('SELECT * FROM user_preferences WHERE user_id = $1', [user.id]);

    return res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        email: user.email,
        guardianName: user.guardian_name,
        guardianIdType: user.guardian_id_type,
        kycVerified: Boolean(user.kyc_verified),
        childName: user.child_name,
        childAge: user.child_age,
        rewardPoints: user.reward_points,
        currentStreak: updatedStreak,
        preferredCategory: pref ? pref.preferred_category : 'Ramayana & Epics'
      }
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0]?.message || 'Validation error' });
    }
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Server error during login' });
  }
}

export async function getProfile(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Omit guardian_id_hash per KYC Privacy RLS rules
    const user = await queryOne(`
      SELECT id, email, guardian_name, guardian_id_type, kyc_verified,
             child_name, child_age, reward_points, current_streak, last_login_date, created_at
      FROM users WHERE id = $1
    `, [userId]);

    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    const preferences = await queryOne('SELECT * FROM user_preferences WHERE user_id = $1', [userId]);
    const progressList = await query('SELECT * FROM user_progress WHERE user_id = $1', [userId]);
    const unlockedStories = await query('SELECT id, topic, chapter_number, title, unlocked_at FROM unlocked_stories WHERE user_id = $1 ORDER BY chapter_number ASC', [userId]);
    const premiumUnlocks = await query('SELECT * FROM premium_unlocks WHERE user_id = $1', [userId]);

    // Calculate total levels completed across games
    const totalLevelsCompleted = progressList.reduce((sum, p) => sum + (p.levels_completed || 0), 0);
    const totalXp = progressList.reduce((sum, p) => sum + (p.total_xp || 0), 0);

    return res.json({
      user: {
        ...user,
        kycVerified: Boolean(user.kyc_verified),
        totalLevelsCompleted,
        totalXp,
        preferences: preferences || {
          preferredCategory: 'Ramayana & Epics',
          secondaryCategories: ['Indus Valley Civilization', 'Space Exploration']
        },
        unlockedStoriesCount: unlockedStories.length,
        premiumUnlocksCount: premiumUnlocks.length
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ error: 'Server error fetching user profile' });
  }
}

export async function savePreferences(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const validated = UserPreferencesSchema.parse(req.body);

    const existing = await queryOne('SELECT id FROM user_preferences WHERE user_id = $1', [userId]);
    if (existing) {
      await query(`
        UPDATE user_preferences
        SET preferred_category = $1, secondary_categories = $2, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $3
      `, [validated.preferredCategory, validated.secondaryCategories, userId]);
    } else {
      const id = uuidv4();
      await query(`
        INSERT INTO user_preferences (id, user_id, preferred_category, secondary_categories)
        VALUES ($1, $2, $3, $4)
      `, [id, userId, validated.preferredCategory, validated.secondaryCategories]);
    }

    return res.json({ message: 'Preferences updated successfully', preferences: validated });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0]?.message || 'Validation error' });
    }
    console.error('Error saving preferences:', error);
    return res.status(500).json({ error: 'Server error saving preferences' });
  }
}
