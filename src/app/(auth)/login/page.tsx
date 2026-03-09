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
                        className="bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-blue-500"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-zinc-300">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="bg-zinc-950 border-zinc-800 text-zinc-100 focus-visible:ring-blue-500"
                    />
                </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
                <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Log in'}
                </Button>
                <div className="text-center text-sm text-zinc-400">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="text-blue-400 hover:text-blue-300 underline underline-offset-4">
                        Sign up
                    </Link>
                </div>
            </CardFooter>
        </form>
    )
}

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-zinc-950">
            <Card className="w-full max-w-md border-zinc-800 bg-zinc-900 text-zinc-100">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-center">Log in</CardTitle>
                    <CardDescription className="text-zinc-400 text-center">
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
