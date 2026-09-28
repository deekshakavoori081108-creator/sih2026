import { v4 as uuidv4 } from 'uuid';
import { GameCompletionSchema } from '../schemas/validation.js';
import { query, queryOne } from '../services/db.js';
import { getGameChallenges } from '../data/seedGames.js';
import { getCuratedChapter } from '../data/seedStories.js';
import { generateStoryChapterWithGemini } from '../services/gemini.js';
export async function getChallenges(req, res) {
    try {
        const { category, gameType } = req.params;
        const decodedCategory = decodeURIComponent(category);
        const validGameTypes = ['TRIVIA', 'PUZZLE', 'WORD_CRYPT'];
        if (!validGameTypes.includes(gameType.toUpperCase())) {
            return res.status(400).json({ error: 'Invalid game type requested' });
        }
        const challenges = getGameChallenges(decodedCategory, gameType.toUpperCase());
        return res.json(challenges);
    }
    catch (error) {
        console.error('Error fetching challenges:', error);
        return res.status(500).json({ error: 'Failed to retrieve game challenges' });
    }
}
export async function completeLevel(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const validated = GameCompletionSchema.parse(req.body);
        const { category, gameType, score, timeSpentSeconds } = validated;
        // Calculate earned rewards
        const basePoints = Math.max(score, 50);
        const speedBonus = timeSpentSeconds < 60 ? 15 : 5;
        const earnedPoints = basePoints + speedBonus;
        const earnedXp = Math.round(earnedPoints * 1.5);
        // Update or insert into user_progress
        let progress = await queryOne('SELECT * FROM user_progress WHERE user_id = $1 AND category = $2 AND game_type = $3', [userId, category, gameType]);
        let newLevelsCompleted = 1;
        let newTotalXp = earnedXp;
        if (progress) {
            newLevelsCompleted = (progress.levels_completed || 0) + 1;
            newTotalXp = (progress.total_xp || 0) + earnedXp;
            await query(`
        UPDATE user_progress
        SET levels_completed = $1, total_xp = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
      `, [newLevelsCompleted, newTotalXp, progress.id]);
        }
        else {
            const progId = uuidv4();
            await query(`
        INSERT INTO user_progress (id, user_id, category, game_type, levels_completed, total_xp)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [progId, userId, category, gameType, 1, earnedXp]);
        }
        // Award reward points to user
        await query('UPDATE users SET reward_points = reward_points + $1 WHERE id = $2', [earnedPoints, userId]);
        const updatedUser = await queryOne('SELECT reward_points, current_streak FROM users WHERE id = $1', [userId]);
        // Dynamic Progression Rule: Every two (2) successfully completed mini-game levels unlocks a new serialized story chapter!
        let storyUnlocked = false;
        let unlockedChapterData = null;
        if (newLevelsCompleted % 2 === 0) {
            storyUnlocked = true;
            // Determine next chapter number
            const existingChapters = await query('SELECT chapter_number FROM unlocked_stories WHERE user_id = $1 AND topic = $2 ORDER BY chapter_number DESC', [userId, category]);
            const nextChapterNumber = existingChapters.length > 0 ? existingChapters[0].chapter_number + 1 : 1;
            // Try AI generation first with Gemini, else fallback to curated chapter
            let chapter = await generateStoryChapterWithGemini(category, nextChapterNumber);
            if (!chapter) {
                chapter = getCuratedChapter(category, nextChapterNumber);
            }
            // Check if already unlocked this exact chapter
            const alreadyUnlocked = await queryOne('SELECT id FROM unlocked_stories WHERE user_id = $1 AND topic = $2 AND chapter_number = $3', [userId, category, nextChapterNumber]);
            if (!alreadyUnlocked) {
                const storyId = uuidv4();
                await query(`
          INSERT INTO unlocked_stories (id, user_id, topic, chapter_number, title, content, cliffhanger_prompt)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
                    storyId,
                    userId,
                    category,
                    chapter.chapterNumber,
                    chapter.title,
                    chapter.narrativeText,
                    chapter.cliffhanger
                ]);
                unlockedChapterData = {
                    id: storyId,
                    chapterNumber: chapter.chapterNumber,
                    title: chapter.title,
                    topic: category,
                    cliffhanger: chapter.cliffhanger,
                    teaserForNextLevel: chapter.teaserForNextLevel
                };
            }
        }
        return res.json({
            message: 'Level completed successfully!',
            earnedPoints,
            earnedXp,
            newLevelsCompleted,
            totalRewardPoints: updatedUser?.reward_points || 0,
            currentStreak: updatedUser?.current_streak || 1,
            storyUnlocked,
            unlockedChapter: unlockedChapterData
        });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ error: error.errors[0]?.message || 'Validation error' });
        }
        console.error('Error completing level:', error);
        return res.status(500).json({ error: 'Server error processing level completion' });
    }
}
