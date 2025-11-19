"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { User as UserIcon, ShieldIcon, MailIcon, CalendarDaysIcon } from "lucide-react";
import { format } from "date-fns";
import { UserAvatar } from "@/components/user-avatar";

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
            <main className="min-h-screen flex items-center justify-center">
                Loading...
            </main>
        );

    if (!session?.user)
        return (
            <main className="min-h-screen flex items-center justify-center">
                Redirecting...
            </main>
        );

    const { user } = session;

    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-12 space-y-8">
            {/* Header Section */}
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back! Here’s your account overview.
                </p>
            </div>

            {/* Email Verification Alert */}
            {!user.emailVerified && <EmailVerificationAlert />}

            {/* Profile Card */}
            <ProfileCard user={user} />

            {/* Sign Out button */}
            <Button variant="destructive" onClick={() => signOut()} className="mt-6">
                Sign Out
            </Button>
        </main>
    );
}

/* ------------------ PROFILE CARD ------------------ */

function ProfileCard({ user }: { user: any }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserIcon className="size-5" />
                    Profile Information
                </CardTitle>
                <CardDescription>Your account details and current status</CardDescription>
            </CardHeader>

            <CardContent>
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                    {/* Avatar + Role */}
                    <div className="flex flex-col items-center gap-3">
                        <UserAvatar
                            name={user.name}
                            image={user.image}
                            className="size-32 sm:size-24"
                        />

                        {user.role && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <ShieldIcon className="size-3" />
                                {user.role}
                            </Badge>
                        )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 space-y-4">
                        <div>
                            <h3 className="text-2xl font-semibold">{user.name}</h3>
                            <p className="text-muted-foreground">{user.email}</p>
                        </div>

                        {/* Member Since */}
                        {user.createdAt && (
                            <div className="space-y-1">
                                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                    <CalendarDaysIcon className="size-4" />
                                    Member Since
                                </div>
                                <p className="font-medium">
                                    {format(new Date(user.createdAt), "MMMM d, yyyy")}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

/* ------------------ EMAIL VERIFICATION ALERT ------------------ */

function EmailVerificationAlert() {
    return (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800/50 dark:bg-yellow-900/40">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <MailIcon className="size-5 text-yellow-700 dark:text-yellow-400" />
                    <span className="text-yellow-800 dark:text-yellow-200">
            Please verify your email address to unlock all features.
          </span>
                </div>

                <Button size="sm" variant="secondary" asChild>
                    <a href="/verify-email">Verify Email</a>
                </Button>
            </div>
        </div>
    );
}
