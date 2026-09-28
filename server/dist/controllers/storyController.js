import { v4 as uuidv4 } from 'uuid';
import { StoryGenerateSchema } from '../schemas/validation.js';
import { query, queryOne } from '../services/db.js';
import { generateStoryChapterWithGemini } from '../services/gemini.js';
import { getCuratedChapter } from '../data/seedStories.js';
export async function getUnlockedStories(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const stories = await query(`
      SELECT id, topic, chapter_number, title, content, cliffhanger_prompt, unlocked_at
      FROM unlocked_stories
      WHERE user_id = $1
      ORDER BY topic ASC, chapter_number ASC
    `, [userId]);
        return res.json({ stories });
    }
    catch (error) {
        console.error('Error fetching unlocked stories:', error);
        return res.status(500).json({ error: 'Failed to fetch unlocked stories' });
    }
}
export async function getStoryById(req, res) {
    try {
        const userId = req.user?.userId;
        const { storyId } = req.params;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const story = await queryOne(`
      SELECT id, topic, chapter_number, title, content, cliffhanger_prompt, unlocked_at
      FROM unlocked_stories
      WHERE id = $1 AND user_id = $2
    `, [storyId, userId]);
        if (!story) {
            return res.status(404).json({ error: 'Story chapter not found or locked' });
        }
        // Fetch corresponding cultural context & choices from curated definition
        const curated = getCuratedChapter(story.topic, story.chapter_number);
        return res.json({
            story: {
                ...story,
                culturalContext: curated.culturalContext,
                teaserForNextLevel: curated.teaserForNextLevel,
                interactiveChoices: curated.interactiveChoices
            }
        });
    }
    catch (error) {
        console.error('Error fetching story detail:', error);
        return res.status(500).json({ error: 'Failed to fetch story details' });
    }
}
export async function generateNextChapter(req, res) {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const validated = StoryGenerateSchema.parse(req.body);
        const { topic, chapterNumber, previousSummary } = validated;
        // Check if chapter already exists
        const existing = await queryOne('SELECT id, title, content, cliffhanger_prompt FROM unlocked_stories WHERE user_id = $1 AND topic = $2 AND chapter_number = $3', [userId, topic, chapterNumber]);
        if (existing) {
            return res.json({
                message: 'Chapter already unlocked',
                chapter: existing
            });
        }
        // Generate dynamic chapter with Gemini AI, fallback to curated high-drama chapter
        let chapter = await generateStoryChapterWithGemini(topic, chapterNumber, previousSummary);
        if (!chapter) {
            chapter = getCuratedChapter(topic, chapterNumber);
        }
        const storyId = uuidv4();
        await query(`
      INSERT INTO unlocked_stories (id, user_id, topic, chapter_number, title, content, cliffhanger_prompt)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
            storyId,
            userId,
            topic,
            chapter.chapterNumber,
            chapter.title,
            chapter.narrativeText,
            chapter.cliffhanger
        ]);
        return res.status(201).json({
            message: 'New cliffhanger chapter generated!',
            chapter: {
                id: storyId,
                chapterNumber: chapter.chapterNumber,
                topic,
                title: chapter.title,
                content: chapter.narrativeText,
                cliffhanger_prompt: chapter.cliffhanger,
                culturalContext: chapter.culturalContext,
                teaserForNextLevel: chapter.teaserForNextLevel,
                interactiveChoices: chapter.interactiveChoices
            }
        });
    }
    catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ error: error.errors[0]?.message || 'Validation error' });
        }
        console.error('Error generating story chapter:', error);
        return res.status(500).json({ error: 'Server error generating story chapter' });
    }
}
