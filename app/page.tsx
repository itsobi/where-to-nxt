import './globals.css';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignUpButton,
} from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { MessageCircle, Home, Globe, Loader } from 'lucide-react';
import Image from 'next/image';
import { redirect } from 'next/navigation';

export default async function LandingPage() {
  const { userId } = await auth();

  if (userId) {
    return redirect('/home');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Image src="/logo.svg" alt="Where to NXT?" width={40} height={40} />
            <span className="text-xl font-semibold italic">Where to NXT?</span>
          </div>
          <div className="flex items-center space-x-4">
            <ClerkLoaded>
              <SignInButton mode="modal">
                <Button variant="link">Log in</Button>
              </SignInButton>
            </ClerkLoaded>
            <ClerkLoading>
              <Loader className="flex justify-center w-full animate-spin" />
            </ClerkLoading>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
            <div className="space-y-8">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Share Your Travel Experiences
                <span className="text-primary-blue"> With the World</span>
              </h1>
              <p className="text-lg text-gray-600">
                Connect with fellow travelers, share your experiences, and
                discover your next destination. Join our community today!
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <ClerkLoaded>
                  <SignUpButton mode="modal">
                    <Button
                      variant={'default'}
                      className="w-full font-semibold"
                    >
                      Get Started
                    </Button>
                  </SignUpButton>
                </ClerkLoaded>
                <ClerkLoading>
                  <Loader className="flex justify-center animate-spin w-full" />
                </ClerkLoading>
              </div>

              <div className="relative block lg:hidden">
                <Image
                  unoptimized
                  src="/wtn.gif"
                  alt="Travel Destinations"
                  width={600}
                  height={400}
                  className="object-cover rounded w-full h-full"
                />
              </div>
            </div>
            <div className="relative hidden lg:block">
              <Image
                unoptimized
                src="/wtn.gif"
                alt="Travel Destinations"
                width={600}
                height={400}
                className="object-cover rounded"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Why Choose{' '}
              <span className="text-primary-blue italic">Where to NXT?</span>
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="p-6">
                <Home className="mb-4 h-8 w-8 text-primary-blue" />
                <h3 className="mb-2 text-xl font-semibold">
                  Find Your Community
                </h3>
                <p className="text-gray-600">
                  Connect with travelers who share your passion for exploration
                  and adventure.
                </p>
              </Card>
              <Card className="p-6">
                <MessageCircle className="mb-4 h-8 w-8 text-primary-blue" />
                <h3 className="mb-2 text-xl font-semibold">
                  Share Experiences
                </h3>
                <p className="text-gray-600">
                  Share your travel stories, tips, and recommendations with
                  fellow adventurers.
                </p>
              </Card>
              <Card className="p-6">
                <Globe className="mb-4 h-8 w-8 text-primary-blue" />
                <h3 className="mb-2 text-xl font-semibold">Discover Places</h3>
                <p className="text-gray-600">
                  Explore new destinations through the eyes of other travelers.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
          <Card className="bg-primary-blue p-8 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">
              Ready to Start Your Journey?
            </h2>
            <p className="mb-8 text-blue-100">
              Planning your next adventure or just daydreaming about new
              destinations?{' '}
              <span className="italic font-semibold">Where to NXT?</span> is the
              perfect place! 🌍
            </p>
            <ClerkLoaded>
              <SignUpButton mode="modal">
                <Button size="lg" variant="secondary" className="bg-white">
                  Create your account
                </Button>
              </SignUpButton>
            </ClerkLoaded>
            <ClerkLoading>
              <Loader className="flex justify-center w-full animate-spin" />
            </ClerkLoading>
          </Card>
        </section>
      </main>

      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()}{' '}
            <span className="italic font-semibold">Where to NXT?</span> All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
