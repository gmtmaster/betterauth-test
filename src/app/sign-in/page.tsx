"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth-client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardHeader, CardContent, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

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

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().optional(),
});

type Values = z.infer<typeof schema>;

export default function SignInPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") ?? "/dashboard";

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<Values>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    async function onSubmit(values: Values) {
        setError(null);
        setLoading(true);

        const res = await signIn.email({
            email: values.email,
            password: values.password,
            rememberMe: values.rememberMe,
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

        const res = await signIn.social({
            provider,
            callbackURL: redirect,
        });

        setLoading(false);

        if (res.error) {
            setError(res.error.message ?? "Something went wrong.");
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-xl ">Sign In</CardTitle>
                    <CardDescription className="text-sm">
                        Enter your email and password to access your account
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="you@example.com"
                                                type="email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Password */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center">
                                            <FormLabel>Password</FormLabel>
                                            <a href="/forgot-password" className="ml-auto text-sm underline">
                                                Forgot?
                                            </a>
                                        </div>
                                        <FormControl>
                                            <PasswordInput placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Remember me */}
                            <FormField
                                control={form.control}
                                name="rememberMe"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className="text-sm">Remember me</FormLabel>
                                    </FormItem>
                                )}
                            />

                            {/* Error */}
                            {error && (
                                <p className="text-red-500 text-sm">{error}</p>
                            )}

                            {/* Submit */}
                            <LoadingButton className="w-full font-bold border-1 border-green-600" loading={loading} type="submit">
                                Sign In
                            </LoadingButton>

                            {/* Social Login */}
                            <div className="space-y-2 pt-2">
                                <Button
                                    variant="outline"
                                    className="w-full gap-2"
                                    disabled={loading}
                                    type="button"
                                    onClick={() => handleSocial("google")}
                                >
                                    <GoogleIcon width="1em" height="1em" /> Sign in with Google
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full gap-2"
                                    disabled={loading}
                                    type="button"
                                    onClick={() => handleSocial("github")}
                                >
                                    <GitHubIcon /> Sign in with GitHub
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>

                <CardFooter className="justify-center text-sm text-muted-foreground">
                    Don't have an account?
                    <a href="/sign-up" className="ml-1 underline text-primary">
                        Sign up
                    </a>
                </CardFooter>
            </Card>
        </main>
    );
}
