import Link from "next/link";
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function CancelPage(){
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <XCircle className="h-6 w-6 text-red-600"/>
                    </div>
                    <CardTitle className="mt-4 text-2xl font-bold">
                        Payment Canceled
                    </CardTitle>
                    <CardDescription>
                        Your payment process was canceled. You have not been charged.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        If you changed your mind, you can always go back and complete your purchase.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button asChild className="w-full" variant='outline'>
                        <Link href='/pricing'>Back to Pricing</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}