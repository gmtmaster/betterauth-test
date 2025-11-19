"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { useEffect } from "react";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const router = useRouter();
    const { data: session, isPending } = useSession();

    useEffect(() => {
        if (!isPending && !session?.user) {
            router.push("/sign-in");
        }
    }, [isPending, session, router]);

    if (isPending)
        return (
            <main className="flex min-h-screen items-center justify-center text-white">
                Loading...
            </main>
        );

    if (!session?.user)
        return (
            <main className="flex min-h-screen items-center justify-center text-white">
                Redirecting...
            </main>
        );

    const { user } = session;

    return (
        <main className="flex min-h-screen items-center justify-center p-4 ">
            <Card className="w-full max-w-md text-black border-neutral-800 bg-white border-1 border-gray-400">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">
                        Dashboard
                    </CardTitle>
                </CardHeader>

                <CardContent className="text-center space-y-2">
                    <p>Welcome, <span className="font-semibold">{user.name}</span>!</p>
                    <p className="text-neutral-300">{user.email}</p>

                    <Button
                        onClick={() => signOut()}
                        className="w-full mt-4"
                        variant="default"
                    >
                        Sign Out
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
}
