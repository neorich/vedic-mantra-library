import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Banana, Sparkles, Search, Zap, Image as ImageIcon, Type } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <Badge className="bg-zinc-900 border-zinc-800 text-yellow-500 hover:bg-zinc-900 px-4 py-1.5 rounded-full text-sm mx-auto inline-flex items-center mb-6 shadow-inner">
            <Sparkles className="w-4 h-4 mr-2" />
            Optimized for Gemini 3.1 Flash Image
          </Badge>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-500">
            The Ultimate <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Nano Banana 2</span> Prompt Library
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Discover, save, and share battle-tested prompts that produce stunning, hyper-realistic, and text-perfect results. Stop guessing and start generating.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/explore">
              <Button size="lg" className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-zinc-950 font-bold h-12 px-8 shadow-lg shadow-yellow-500/20 text-lg">
                <Search className="mr-2 h-5 w-5" /> Explore Prompts
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 h-12 px-8 text-lg">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="border-t border-zinc-800/50 bg-zinc-950/50 py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl flex flex-col items-center text-center hover:border-zinc-700 transition-colors">
            <div className="bg-yellow-500/10 p-4 rounded-full mb-6 relative group">
              <div className="absolute inset-0 bg-yellow-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <ImageIcon className="h-8 w-8 text-yellow-500 relative z-10" />
            </div>
            <h3 className="text-xl font-bold text-zinc-100 mb-3">Hyper-Realism</h3>
            <p className="text-zinc-400">Discover prompts tuned perfectly for Nano Banana 2's photorealistic engine and exact subject consistency.</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl flex flex-col items-center text-center hover:border-zinc-700 transition-colors">
            <div className="bg-orange-500/10 p-4 rounded-full mb-6 relative group">
              <div className="absolute inset-0 bg-orange-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <Type className="h-8 w-8 text-orange-500 relative z-10" />
            </div>
            <h3 className="text-xl font-bold text-zinc-100 mb-3">Flawless Text</h3>
            <p className="text-zinc-400">Master in-image text generation. Find prompts that render typography, signs, and infographics effortlessly.</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl flex flex-col items-center text-center hover:border-zinc-700 transition-colors">
            <div className="bg-blue-500/10 p-4 rounded-full mb-6 relative group">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <Zap className="h-8 w-8 text-blue-500 relative z-10" />
            </div>
            <h3 className="text-xl font-bold text-zinc-100 mb-3">Fork & Iterate</h3>
            <p className="text-zinc-400">Found a great starting point? Fork it to your private library, tweak it to perfection, and organize your toolkit.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 px-4 text-center text-zinc-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Banana className="h-4 w-4 text-yellow-500/50" />
          <span className="font-semibold">Nano Banana 2 Prompt Library</span>
        </div>
        <p>Built for the optimal Gemini 3.1 Flash Image workflow.</p>
      </footer>
    </div>
  )
}
