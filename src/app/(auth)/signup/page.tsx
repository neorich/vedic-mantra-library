'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signup } from '@/app/(auth)/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function SignupPage() {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError(null)
        const result = await signup(formData)
        if (result?.error) {
            setError(result.error)
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-zinc-950">
            <Card className="w-full max-w-md border-zinc-800 bg-zinc-900 text-zinc-100">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-center">Sign up</CardTitle>
                    <CardDescription className="text-zinc-400 text-center">
                        Create an account to save and share Nano Banana 2 prompts
                    </CardDescription>
                </CardHeader>
                <form action={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="flex items-center gap-2 p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
                                <AlertCircle className="w-4 h-4 text-red-500" />
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-zinc-300">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="promptmaster99"
                                required
                                className="bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-blue-500"
                            />
                        </div>
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
                            {isLoading ? 'Signing up...' : 'Sign up'}
                        </Button>
                        <div className="text-center text-sm text-zinc-400">
                            Already have an account?{' '}
                            <Link href="/login" className="text-blue-400 hover:text-blue-300 underline underline-offset-4">
                                Log in
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
