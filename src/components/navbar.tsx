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
import { Sun, Search, Menu, BookOpen } from 'lucide-react'
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
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                            <Sun className="h-6 w-6 text-primary" />
                        </div>
                        <span className="font-bold text-lg hidden sm:inline-block">Vedic Mantras</span>
                    </Link>
                    <div className="hidden md:flex gap-6 text-sm font-medium">
                        <Link href="/explore" className="text-muted-foreground hover:text-primary transition-colors">Explore</Link>
                        <Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors">Categories</Link>
                        {user && (
                            <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">My Practice</Link>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/explore" className="hidden sm:flex text-muted-foreground hover:text-primary transition-colors">
                        <Search className="h-5 w-5" />
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger className="relative h-9 w-9 rounded-full focus:outline-none ring-offset-background transition-all hover:ring-2 hover:ring-primary/20">
                                    <Avatar className="h-9 w-9 border border-border">
                                        <AvatarImage src={profile?.avatar_url || ''} alt={profile?.username || user?.email} />
                                        <AvatarFallback className="bg-muted text-muted-foreground">
                                            {profile?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
                                    <DropdownMenuLabel className="font-normal border-b pb-2">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{profile?.username || 'Practitioner'}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => router.push('/dashboard')} className="cursor-pointer pt-2">
                                        My Practice
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={handleSignout}
                                        className="cursor-pointer text-red-500 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
                                    >
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Link href="/login">
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">Log in</Button>
                            </Link>
                            <Link href="/signup">
                                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5">Join Practice</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
