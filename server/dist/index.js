import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { initDb } from './services/db.js';
import { authMiddleware } from './middleware/authMiddleware.js';
import { register, login, getProfile, savePreferences } from './controllers/authController.js';
import { getChallenges, completeLevel } from './controllers/gameController.js';
import { getUnlockedStories, getStoryById, generateNextChapter } from './controllers/storyController.js';
import { getVaultModules, unlockModule } from './controllers/vaultController.js';
import { getParentAnalytics } from './controllers/parentController.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
// Rate limiter for AI story generation endpoint
const storyRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 15, // max 15 story generation requests per hour
    message: { error: 'Story generation rate limit reached. Please explore the library or play mini-games!' },
    standardHeaders: true,
    legacyHeaders: false
});
// --- Public Auth Routes ---
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
// --- User Profile & Preferences ---
app.get('/api/user/profile', authMiddleware, getProfile);
app.post('/api/user/preferences', authMiddleware, savePreferences);
// --- Games & Arcade Progression ---
app.get('/api/games/challenges/:category/:gameType', getChallenges);
app.post('/api/games/complete-level', authMiddleware, completeLevel);
// --- Story & Cliffhanger Reader ---
app.get('/api/story/unlocked', authMiddleware, getUnlockedStories);
app.get('/api/story/chapter/:storyId', authMiddleware, getStoryById);
app.post('/api/story/generate-next', authMiddleware, storyRateLimiter, generateNextChapter);
// --- Premium Learning Vault ---
app.get('/api/vault/modules', authMiddleware, getVaultModules);
app.post('/api/vault/unlock', authMiddleware, unlockModule);
// --- Parental Controls & Analytics ---
app.get('/api/parent/analytics', authMiddleware, getParentAnalytics);
// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        platform: 'Katha Yatra',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});
// Initialize database and start server
async function startServer() {
    try {
        await initDb();
        app.listen(PORT, () => {
            console.log(`🏰 Katha Yatra Server running with pride on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error('Fatal error starting server:', error);
        process.exit(1);
    }
}
startServer();
