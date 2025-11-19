"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";

import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);

        const res = await signUp.email({
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
        });

        if (res.error) {
            setError(res.error.message ?? "Something went wrong.");
        } else {
            router.push("/dashboard");
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center p-4 bg-neutral-950">
            <Card className="w-full max-w-md text-white border-neutral-800 bg-neutral-900">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">Create Account</CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            name="name"
                            placeholder="Full Name"
                            required
                            className="bg-neutral-800 border-neutral-700"
                        />

                        <Input
                            name="email"
                            type="email"
                            placeholder="Email"
                            required
                            className="bg-neutral-800 border-neutral-700"
                        />

                        <Input
                            name="password"
                            type="password"
                            placeholder="Password"
                            minLength={8}
                            required
                            className="bg-neutral-800 border-neutral-700"
                        />

                        {error && (
                            <p className="text-red-500 text-sm">{error}</p>
                        )}

                        <Button
                            type="submit"
                            className="w-full font-medium"
                        >
                            Create Account
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="justify-center text-sm text-neutral-400">
                    Already have an account?
                    <a href="/sign-in" className="ml-1 text-white underline">
                        Sign In
                    </a>
                </CardFooter>
            </Card>
        </main>
    );
}
