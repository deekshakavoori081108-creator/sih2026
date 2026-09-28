import { v4 as uuidv4 } from 'uuid';
import { VaultUnlockSchema } from '../schemas/validation.js';
import { query, queryOne } from '../services/db.js';
import { VAULT_MODULES } from '../data/seedVault.js';
export async function getVaultModules(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        // Fetch user unlocked modules
        const unlockedRecords = await query(`
      SELECT module_type, module_title, points_spent, unlocked_at
      FROM premium_unlocks
      WHERE user_id = $1
    `, [userId]);
        const unlockedTitles = new Set(unlockedRecords.map((r) => r.module_title));
        // Get current user points
        const user = await queryOne('SELECT reward_points FROM users WHERE id = $1', [userId]);
        const modulesWithStatus = VAULT_MODULES.map(mod => ({
            ...mod,
            isUnlocked: unlockedTitles.has(mod.title)
        }));
        return res.json({
            userPoints: user?.reward_points || 0,
            modules: modulesWithStatus
        });
    }
    catch (error) {
        console.error('Error fetching vault modules:', error);
        return res.status(500).json({ error: 'Failed to retrieve vault modules' });
    }
}
export async function unlockModule(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const validated = VaultUnlockSchema.parse(req.body);
        const { moduleId, moduleType, moduleTitle, pointsCost } = validated;
        // Check user points balance
        const user = await queryOne('SELECT reward_points FROM users WHERE id = $1', [userId]);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.reward_points < pointsCost) {
            return res.status(400).json({
                error: `Insufficient reward points. You need ${pointsCost} points, but currently have ${user.reward_points} points. Complete mini-games to earn points!`
            });
        }
        // Check if already unlocked
        const alreadyUnlocked = await queryOne(`
      SELECT id FROM premium_unlocks
      WHERE user_id = $1 AND module_title = $2
    `, [userId, moduleTitle]);
        if (alreadyUnlocked) {
            return res.status(400).json({ error: 'This premium module has already been unlocked!' });
        }
        // Deduct points
        const newPoints = user.reward_points - pointsCost;
        await query('UPDATE users SET reward_points = $1 WHERE id = $2', [newPoints, userId]);
        // Record unlock
        const unlockId = uuidv4();
        await query(`
      INSERT INTO premium_unlocks (id, user_id, module_type, module_title, points_spent)
      VALUES ($1, $2, $3, $4, $5)
    `, [unlockId, userId, moduleType, moduleTitle, pointsCost]);
        const targetModule = VAULT_MODULES.find(m => m.id === moduleId || m.title === moduleTitle);
        return res.json({
            message: `🎉 Successfully unlocked "${moduleTitle}"!`,
            newPointsBalance: newPoints,
            unlockedModule: targetModule
        });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ error: error.errors[0]?.message || 'Validation error' });
        }
        console.error('Error unlocking vault module:', error);
        return res.status(500).json({ error: 'Server error unlocking vault module' });
    }
}
