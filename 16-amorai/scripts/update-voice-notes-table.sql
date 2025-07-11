-- 更新 voice_notes 表结构以支持总结和扩展功能
ALTER TABLE voice_notes 
DROP COLUMN IF EXISTS enhanced_text,
ADD COLUMN IF NOT EXISTS summary_text TEXT,
ADD COLUMN IF NOT EXISTS expanded_text TEXT;

-- 更新现有记录的字段（如果有的话）
UPDATE voice_notes 
SET summary_text = COALESCE(summary_text, ''),
    expanded_text = COALESCE(expanded_text, '')
WHERE summary_text IS NULL OR expanded_text IS NULL;
