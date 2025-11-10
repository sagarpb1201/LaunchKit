import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function SuccessPage({searchParams,}:{searchParams: { [key:string]: string | string[] | undefined};}){
    const session_id=searchParams?.session_id ?? '';

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4'>
          <Card className='w-full max-w-md text-center'>
            <CardHeader>
              <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100'>
                <CheckCircle className='h-6 w-6 text-green-600'/>
              </div>
              <CardTitle className='mt-4 text-2xl font-bold'>Payment Successful!</CardTitle>
            <CardDescription>
              Thank you for subscribing to LaunchXKit. Your account is now active.
            </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                You can now access all the premium features. A confirmation email has been sent to you.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className='w-full'>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
    )
}