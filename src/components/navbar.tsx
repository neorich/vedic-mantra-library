'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Banana, Search, Menu } from 'lucide-react'
import { useEffect, useState } from 'react'

export function Navbar() {
    const router = useRouter()
    const supabase = createClient()
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user) {
                setUser(session.user)
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single()
                setProfile(profileData)
            }
        }

        fetchUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single()
                    .then(({ data }) => setProfile(data))
            } else {
                setProfile(null)
            }
        })

        return () => subscription.unsubscribe()
    }, [supabase])

    const handleSignout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60">
            <div className="container mx-auto flex h-14 items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2 group">
                        <Banana className="h-6 w-6 text-yellow-400 group-hover:rotate-12 transition-transform" />
                        <span className="font-bold hidden sm:inline-block">Nano Banana 2</span>
                    </Link>
                    <div className="hidden md:flex gap-4 text-sm font-medium">
                        <Link href="/explore" className="text-zinc-400 hover:text-zinc-100 transition-colors">Explore</Link>
                        {user && (
                            <Link href="/dashboard" className="text-zinc-400 hover:text-zinc-100 transition-colors">Dashboard</Link>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/explore" className="hidden sm:flex text-zinc-400 hover:text-zinc-100">
                        <Search className="h-4 w-4" />
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-3">
                            <Link href="/prompts/new" className="hidden sm:block">
                                <Button variant="outline" size="sm" className="border-zinc-800 bg-zinc-900 hover:bg-zinc-800 hover:text-zinc-100">
                                    New Prompt
                                </Button>
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="relative h-8 w-8 rounded-full focus:outline-none">
                                    <Avatar className="h-8 w-8 border border-zinc-800">
                                        <AvatarImage src={profile?.avatar_url || ''} alt={profile?.username || user?.email} />
                                        <AvatarFallback className="bg-zinc-800 text-zinc-400">
                                            {profile?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 align-end bg-zinc-900 border-zinc-800 text-zinc-100" align="end">
                                    <DropdownMenuLabel className="font-normal border-b border-zinc-800 pb-2">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{profile?.username || 'User'}</p>
                                            <p className="text-xs leading-none text-zinc-500">{user?.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => router.push('/dashboard')} className="focus:bg-zinc-800 focus:text-zinc-100 cursor-pointer pt-2">
                                        Dashboard
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push('/prompts/new')} className="focus:bg-zinc-800 focus:text-zinc-100 cursor-pointer">
                                        Create Prompt
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-zinc-800" />
                                    <DropdownMenuItem
                                        onClick={handleSignout}
                                        className="focus:bg-zinc-800 focus:text-zinc-100 cursor-pointer text-red-500 focus:text-red-400"
                                    >
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Link href="/login">
                                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">Log in</Button>
                            </Link>
                            <Link href="/signup">
                                <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">Sign up</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
