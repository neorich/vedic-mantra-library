'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { login } from '@/app/(auth)/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useSearchParams } from 'next/navigation'
import { AlertCircle } from 'lucide-react'

function LoginForm() {
    const searchParams = useSearchParams()
    const successMessage = searchParams.get('message')
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError(null)
        const result = await login(formData)
        if (result?.error) {
            setError(result.error)
            setIsLoading(false)
        }
    }

    return (
        <form action={handleSubmit}>
            <CardContent className="space-y-4">
                {successMessage && (
                    <div className="p-3 text-sm text-green-400 bg-green-400/10 border border-green-400/20 rounded-md">
                        {successMessage}
                    </div>
                )}
                {error && (
                    <div className="flex items-center gap-2 p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-md">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-zinc-300">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        className="bg-primary/5 border-primary/20 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50 transition-all rounded-xl"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-zinc-300">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="bg-primary/5 border-primary/20 text-foreground focus-visible:ring-primary/50 transition-all rounded-xl"
                    />
                </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
                <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-xl shadow-primary/20 rounded-full h-11"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Log in'}
                </Button>
                <div className="text-center text-sm text-zinc-400">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="text-primary hover:text-primary/80 font-semibold underline underline-offset-4">
                        Sign up
                    </Link>
                </div>
            </CardFooter>
        </form>
    )
}

export default function LoginPage() {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-yellow-500/10 blur-[100px] rounded-full pointer-events-none" />

            <Card className="w-full max-w-md glass border-primary/20 bg-background/50 text-foreground shadow-2xl relative z-10 rounded-[2.5rem]">
                <CardHeader className="space-y-2 mt-4 px-8">
                    <CardTitle className="text-3xl font-serif font-black tracking-tight text-center text-primary">Log in</CardTitle>
                    <CardDescription className="text-muted-foreground text-center font-serif italic text-base">
                        Enter your email and password to access your mantras
                    </CardDescription>
                </CardHeader>
                <Suspense fallback={<CardContent className="py-10 text-center text-zinc-500">Loading form...</CardContent>}>
                    <LoginForm />
                </Suspense>
            </Card>
        </div>
    )
}
