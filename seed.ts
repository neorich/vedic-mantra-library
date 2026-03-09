import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Use Service Key to bypass RLS entirely

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

const generateSlug = (title: string) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 10000)
}

const rawPrompts = [
    {
        title: 'Neon Cyberpunk Billboard',
        prompt_text: 'A cinematic wide shot of a rainy cyberpunk city street at night. The reflections of neon lights puddle on the wet asphalt. In the center, a highly detailed glowing neon billboard clearly reads "NANO" in bold magenta letters, and "BANANA 2" in bright yellow below it. Highly detailed, 8k resolution, photorealistic, volumetric fog, Kodak Portra 400.',
        category: 'Typography/Text',
        style_tags: ['cyberpunk', 'neon', 'cinematic', 'text-focused']
    },
    {
        title: 'Golden Hour Macro Dewdrop',
        prompt_text: 'Extreme macro photography of a single dew drop resting on a vibrant green fern leaf. The morning sun shines through the drop, creating a miniature inverted landscape reflection. Shot on Sony A7RV, 90mm macro lens, f/2.8, beautiful bokeh, flawless lighting, hyper-realistic.',
        category: 'Photography',
        style_tags: ['macro', 'nature', 'photorealistic', 'lighting']
    },
    {
        title: 'Isometric Cozy Developer Room',
        prompt_text: 'A highly detailed 3D isometric view of a cozy, dimly lit developer\'s bedroom. A glowing ultra-wide monitor displays lines of code, casting a soft blue light. A mechanical keyboard, a steaming mug of coffee, and a sleeping orange tabby cat on the bed. Rendered in Unreal Engine 5, ray tracing, cute, stylized but realistic lighting, octane render.',
        category: '3D Render',
        style_tags: ['isometric', 'cozy', 'unreal engine', 'detailed']
    },
    {
        title: 'Abstract Tech Startup Logo',
        prompt_text: 'A clean, minimalist vector logo design for a tech startup. The logo features a geometric combination of an infinity symbol and a banana, styled with a sleek gradient from electric blue to neon purple. Displayed on a pure white background, flat design, high quality, professional branding.',
        category: 'Logo/Icon',
        style_tags: ['vector', 'minimalist', 'branding', 'gradients']
    },
    {
        title: 'Epic Dragon at the Mountain Peak',
        prompt_text: 'An epic digital painting of a colossal, ancient black dragon perched atop a jagged, snow-capped mountain peak. The dragon breathes a stream of vibrant blue fire into a dark, stormy sky. Lightning flashes in the background. Concept art style, Greg Rutkowski, dramatic lighting, highly detailed scales, masterpiece.',
        category: 'Digital Art',
        style_tags: ['fantasy', 'dragon', 'concept art', 'epic']
    },
    {
        title: 'Vintage Diner Neon Sign',
        prompt_text: 'A classic 1950s American diner neon sign at night. The sign is shaped like a retro arrow pointing right, with the words "OPEN 24 HOURS" clearly written in warm white neon tubes. Below it, a smaller red neon sign says "MILKSHAKES & BURGERS". Authentic vintage feel, slightly weathered, glowing brilliantly against a dark starry sky.',
        category: 'Typography/Text',
        style_tags: ['retro', 'signage', 'typography', 'night']
    },
    {
        title: 'Cybernetic Human Portrait',
        prompt_text: 'A close-up studio portrait of a woman with subtle cybernetic implants on her jawline and temple. She has glowing amber eyes and short silver hair. She is wearing a high-tech matte black tactical jacket. Dramatic rim lighting with a blend of cyan and orange studio lights. Photorealistic skin texture, pores visible, 85mm lens.',
        category: 'Photography',
        style_tags: ['portrait', 'cyberpunk', 'realistic', 'sci-fi']
    },
    {
        title: 'Astronaut Discovering Alien Ruin',
        prompt_text: 'A cinematic shot from over the shoulder of an astronaut in a worn, dusty white spacesuit standing at the entrance of a massive, ancient alien temple built from glowing obsidian. Strange geometric green runes cover the temple walls. 70mm film, anamorphic lens flare, epic scale, tense atmosphere, Denis Villeneuve style.',
        category: 'Cinematic',
        style_tags: ['sci-fi', 'cinematic', 'epic', 'space']
    },
    {
        title: 'Lofi Girl Studying Rainy Window',
        prompt_text: '2D anime style illustration of a high school girl studying at her wooden desk by a large window. It is raining heavily outside, with raindrops streaking the glass. She wears over-ear headphones and a cozy oversized sweater. A small desk lamp illuminates her scattered sketchbooks. Studio Ghibli style, warm, nostalgic, lofi aesthetic.',
        category: 'Anime/Manga',
        style_tags: ['lofi', 'anime', 'rainy', 'cozy']
    },
    {
        title: 'Latte Art Coffee Cup',
        prompt_text: 'A top-down view of a freshly poured latte in a white ceramic mug resting on a rustic wooden table. The barista has flawlessly poured latte art that perfectly spells out the word "MORNING" in the foam. Highly realistic, intricate foam details, soft morning window light.',
        category: 'Typography/Text',
        style_tags: ['food', 'typography', 'realistic', 'coffee']
    },
    {
        title: 'Steampunk Airship Fleet',
        prompt_text: 'A breathtaking digital illustration of a fleet of massive steampunk airships flying through a dense sea of fluffy white clouds. The airships feature intricate bronze gears, giant canvas balloons, and glowing steam engines. Sunlight pierces through the clouds, casting god rays. Industrial revolution fantasy, incredibly detailed.',
        category: 'Digital Art',
        style_tags: ['steampunk', 'airships', 'fantasy', 'detailed']
    },
    {
        title: 'Tiny Terrarium World',
        prompt_text: 'A photorealistic 3D render of a small, enclosed glass terrarium sitting on a sunlit windowsill. Inside the terrarium is a micro-world featuring a tiny hobbit-like house, a miniature winding river with real-looking water, and incredibly detailed moss and tiny ferns. Macro photography style, depth of field, Octane Render, magical.',
        category: '3D Render',
        style_tags: ['macro', 'miniature', '3d', 'realistic']
    },
    {
        title: 'Bioluminescent Beach at Night',
        prompt_text: 'A stunning long-exposure photograph of a sandy beach at night. The waves crashing on the shore are glowing with bright blue bioluminescent phytoplankton. A clear night sky full of stars and the Milky Way galaxy spans across the top of the frame. Long exposure, smooth water, magical, National Geographic style.',
        category: 'Photography',
        style_tags: ['nature', 'night', 'bioluminescence', 'stars']
    },
    {
        title: 'Chalkboard Menu',
        prompt_text: 'A beautifully hand-drawn menu on a rustic black chalkboard outside a Parisian cafe. Written in flawless, elegant chalk lettering is the phrase "Crêpes du Jour" at the top. Below, clearly legible, are the menu items: "1. Nutella & Banana", "2. Lemon Sugar", "3. Savory Cheese". Highly detailed chalk texture, realistic smudges, daylight.',
        category: 'Typography/Text',
        style_tags: ['chalk', 'typography', 'realistic', 'cafe']
    },
    {
        title: '3D App Icon - Gaming',
        prompt_text: 'A modern, premium 3D iOS app icon for a gaming application. The icon features a stylized, glossy purple and cyan game controller set against a sleek dark frosted glass background (glassmorphism). Soft studio lighting, realistic reflections, rounded corners, Behance portfolio style.',
        category: 'Logo/Icon',
        style_tags: ['icon', '3d', 'glassmorphism', 'ui']
    },
    {
        title: 'Ethereal Forest Spirit',
        prompt_text: 'A highly detailed watercolor and ink illustration of an ethereal forest spirit. The spirit resembles a delicate human formed from glowing green vines, luminescent mushrooms, and soft white petals. It stands in a ray of moonlight in a dark, ancient forest. Studio Ghibli inspired, magical, peaceful, soft glowing light.',
        category: 'Anime/Manga',
        style_tags: ['watercolor', 'fantasy', 'spirit', 'magical']
    },
    {
        title: 'Vintage Sci-Fi Poster',
        prompt_text: 'A vintage 1970s sci-fi movie poster. At the top, bold retro futuristic typography reads "THE GALACTIC FRONTIER". Below it, a vibrant, painted illustration of a sleek silver rocket ship blasting off from a rocky red planet. Deep space background with swirling purple nebulas. Worn paper edges, vintage color palette, pulp art style.',
        category: 'Typography/Text',
        style_tags: ['retro', 'sci-fi', 'poster', 'typography']
    },
    {
        title: 'Glass Blown Octopus',
        prompt_text: 'A photorealistic macro shot of an intricate glass-blown octopus figurine sitting on a reflective black surface. The glass is primarily cobalt blue with swirling gold flakes inside the tentacles. Spotlights highlight the precise translucent reflections and refractions of the glass. 8k, highly detailed, smooth.',
        category: 'Photography',
        style_tags: ['macro', 'glass', 'art', 'realistic']
    },
    {
        title: 'Sprawling Cyberpunk Slums',
        prompt_text: 'An incredibly detailed, massive wide-angle rendering of a sprawling cyberpunk slum built vertically. Countless stacked shanties, glowing holographic signs, hanging cables, flying cars in the distant smog. Dystopian atmosphere, Blade Runner aesthetic, moody cyan and orange lighting, Octane render, highly complex.',
        category: '3D Render',
        style_tags: ['cyberpunk', 'cityscape', '3d', 'dystopian']
    },
    {
        title: 'Neon Samurai Silhouette',
        prompt_text: 'A striking minimalist digital artwork. The solid black silhouette of a samurai holding a katana stands in the foreground. Behind him is a massive, glowing, perfect circle resembling a neon red sun. The floor is a reflective wet surface that mirrors the glowing sun and silhouette. High contrast, bold colors, cinematic framing.',
        category: 'Digital Art',
        style_tags: ['minimalist', 'samurai', 'neon', 'silhouette']
    }
]

async function seed() {
    console.log('Fetching users directly via Admin API...')

    // Get users directly bypassing RLS
    const { data: { users }, error } = await supabase.auth.admin.listUsers()

    let assigneeId: string

    if (!users || users.length === 0) {
        console.log('No users found. Creating a raw user via Admin API to assign prompts...')
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email: 'system@nanobanana.com',
            password: 'SecurePassword123!',
            email_confirm: true
        })

        if (createError || !newUser.user) {
            console.error('Failed to create default user:', createError)
            process.exit(1)
        }

        assigneeId = newUser.user.id

        // Ensure profile exists 
        await supabase.from('profiles').upsert({
            id: assigneeId,
            username: 'System'
        })
    } else {
        // Just pick a random existing user
        assigneeId = users[Math.floor(Math.random() * users.length)].id
        console.log(`Found existing users. Assigning prompts to user: ${assigneeId}`)
    }

    console.log(`Seeding ${rawPrompts.length} prompts...`)

    const formattedPrompts = rawPrompts.map(p => ({
        ...p,
        user_id: assigneeId,
        slug: generateSlug(p.title),
        visibility: 'public',
        votes: Math.floor(Math.random() * 50) + 5 // pre-seed with random upvotes
    }))

    // Use Service Role to force insert and bypass RLS
    const { error: insertError } = await supabase.from('prompts').insert(formattedPrompts)

    if (insertError) {
        console.error('Error inserting prompts:', insertError)
    } else {
        console.log('Successfully seeded all prompts! ✅')
    }
}

seed()
