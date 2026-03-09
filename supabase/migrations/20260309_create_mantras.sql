-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create mantras table
CREATE TABLE IF NOT EXISTS mantras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    sanskrit_text TEXT NOT NULL,
    transliteration TEXT,
    translation TEXT,
    benefits TEXT,
    deity TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    audio_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster pattern matching on slug
CREATE INDEX IF NOT EXISTS mantras_slug_idx ON mantras (slug);

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE mantras ENABLE ROW LEVEL SECURITY;

-- Allow public read access to categories and mantras
CREATE POLICY "Allow public read access on categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access on mantras" ON mantras FOR SELECT USING (true);
