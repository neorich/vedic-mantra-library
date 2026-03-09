-- Seed script to expand high-intent categories
-- 1. Insert the new categories
INSERT INTO categories (name, slug, description, gradient_from, gradient_to)
VALUES
  ('Morning Chants', 'morning-chants', 'Start your day with high-vibration positive energy, clarity, and focus.', 'from-yellow-400', 'to-orange-500'),
  ('Wealth & Success', 'wealth-success', 'Ancient vibrations designed to attract abundance, financial stability, and remove career obstacles.', 'from-emerald-400', 'to-teal-500'),
  ('Protection', 'protection', 'Create a sacred shield of spiritual armor against negativity and ungrounded energies.', 'from-indigo-400', 'to-purple-500'),
  ('Obstacle Removal', 'obstacle-removal', 'Invoke the power to destroy blockages in your life path and guarantee smooth transitions.', 'from-red-400', 'to-rose-500')
ON CONFLICT (slug) DO NOTHING;

-- 2. Map existing mantras to these new categories (Example assignments based on common knowledge)
-- Note: A mantra can only have one primary category in the current schema. So instead of overwriting existing
-- primary categories like "Shiva", it's better to update mantras that might be uncategorized or better suited here,
-- OR we alter the schema. Since the user wants to keep it simple, we will just insert a few new example mantras for these!

-- Wait, the user has 50 mantras. Some might be perfect to move. Let's just create 4 brand new hyper-specific mantras for these categories to guarantee they are populated.

-- Let's define the new UUIDs for the categories to link them
DO $$
DECLARE
    morning_id uuid;
    wealth_id uuid;
    protection_id uuid;
    obstacle_id uuid;
BEGIN
    SELECT id INTO morning_id FROM categories WHERE slug = 'morning-chants';
    SELECT id INTO wealth_id FROM categories WHERE slug = 'wealth-success';
    SELECT id INTO protection_id FROM categories WHERE slug = 'protection';
    SELECT id INTO obstacle_id FROM categories WHERE slug = 'obstacle-removal';

    INSERT INTO mantras (title, slug, sanskrit_text, transliteration, translation, benefits, deity, category_id, pronunciation, source)
    VALUES
    (
        'Pratah Smarana Stotram',
        'pratah-smarana-stotram',
        'प्रातः स्मरामि हृदि संस्फुरदात्मतत्त्वम्',
        'prātaḥ smarāmi hṛdi saṃsphuradātmatattvam',
        'In the morning, I remember the true nature of the soul shining in my heart.',
        'Awakens spiritual consciousness immediately upon waking, ensuring a day of mindfulness and peace.',
        'Brahman',
        morning_id,
        'praa-tuh smuh-raa-mi hri-di suhm-sphu-ruhd-aat-muh-tuht-tvuhm',
        'Adi Shankaracharya'
    ),
    (
        'Kanakadhara Stotram',
        'kanakadhara-stotram',
        'अङ्गं हरेः पुलकभूषणमाश्रयन्ती',
        'aṅgaṃ hareḥ pulakabhūṣaṇamāśrayantī',
        'Oh Mother, just as the bee is attracted to the lotus, your gaze brings prosperity.',
        'Extremely powerful for alleviating severe financial debt and attracting unexpected wealth.',
        'Goddess Lakshmi',
        wealth_id,
        'uhng-guhm huh-reh pu-luh-kuh-bhoo-shuh-nuhm-aash-ruh-yuhn-tee',
        'Adi Shankaracharya'
    ),
    (
        'Narasimha Kavacham',
        'narasimha-kavacham',
        'नृसिंह कवचम् वक्ष्ये',
        'nṛsiṃha kavacam vakṣye',
        'I shall now recite the protective armor of Lord Narasimha.',
        'Forms an impenetrable spiritual shield. Highly recommended before travel or during times of deep anxiety.',
        'Narasimha',
        protection_id,
        'nri-sing-huh kuh-vuh-chuhm vuhk-shyeh',
        'Brahmanda Purana'
    ),
    (
        'Vakratunda Mahakaya',
        'vakratunda-mahakaya-seed',
        'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ',
        'vakratuṇḍa mahākāya sūryakoṭi samaprabha',
        'O Lord with the curved trunk and immense body, whose brilliance is equal to ten million suns.',
        'The absolute foundational mantra chanted before any new endeavor to ensure zero obstacles.',
        'Ganesha',
        obstacle_id,
        'vuh-kruh-toon-duh muh-haa-kaa-yuh soor-yuh-koh-ti suh-muh-pruh-bhuh',
        'Ganesha Purana'
    )
    ON CONFLICT (slug) DO NOTHING;
END $$;
