import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>LaunchKit</CardTitle>
          <CardDescription>Production-ready SaaS starter</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Are you ready?</p>
          <button className="w-full"><Link href="/login">Get Started</Link></button>
        </CardContent>
      </Card>
    </main>
  );
}
