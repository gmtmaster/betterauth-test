"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signUp } from "@/lib/auth-client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
    CardFooter,
    CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormField,
} from "@/components/ui/form";

import { PasswordInput } from "@/components/password-input";
import { LoadingButton } from "@/components/loading-button";

import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { GitHubIcon } from "@/components/icons/GitHubIcon";

// ----------- VALIDATION -----------
const schema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type Values = z.infer<typeof schema>;

export default function SignUpPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") ?? "/dashboard";

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<Values>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: Values) {
        setError(null);
        setLoading(true);

        const res = await signUp.email({
            name: values.name,
            email: values.email,
            password: values.password,
        });

        setLoading(false);

        if (res.error) {
            setError(res.error.message ?? "Something went wrong.");
        } else {
            router.push(redirect);
        }
    }

    async function handleSocial(provider: "google" | "github") {
        setError(null);
        setLoading(true);

        const res = await signUp.social({
            provider,
            callbackURL: redirect,
        });

        setLoading(false);
        if (res.error) setError(res.error.message ?? "Something went wrong.");
    }

    return (
        <main className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-xl">Create Account</CardTitle>
                    <CardDescription className="text-sm">
                        Create your account to access your dashboard
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {/* NAME */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* EMAIL */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="you@example.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* PASSWORD */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                placeholder="••••••••"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* ERROR */}
                            {error && (
                                <p className="text-red-500 text-sm">{error}</p>
                            )}

                            {/* SUBMIT */}
                            <LoadingButton
                                className="w-full font-bold"
                                loading={loading}
                                type="submit"
                            >
                                Create Account
                            </LoadingButton>

                            {/* SOCIAL LOGIN */}
                            <div className="space-y-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full gap-2"
                                    disabled={loading}
                                    onClick={() => handleSocial("google")}
                                >
                                    <GoogleIcon width="1em" height="1em" />
                                    Sign up with Google
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full gap-2"
                                    disabled={loading}
                                    onClick={() => handleSocial("github")}
                                >
                                    <GitHubIcon />
                                    Sign up with GitHub
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>

                <CardFooter className="justify-center text-sm text-muted-foreground">
                    Already have an account?
                    <a href="/sign-in" className="ml-1 underline text-primary">
                        Sign In
                    </a>
                </CardFooter>
            </Card>
        </main>
    );
}
