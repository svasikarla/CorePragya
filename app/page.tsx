
import { Button } from "@/components/ui/button"
import { ArrowRight, Brain, Map, FlashlightIcon as FlashCard, BarChart3, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-indigo-700" />
              <span className="inline-block font-playfair text-xl font-bold">CorePragya</span>
            </Link>
            <nav className="hidden gap-6 md:flex">
              <Link
                href="#features"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                How It Works
              </Link>
              <Link
                href="#testimonials"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Testimonials
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Login
              </Link>
              <Button asChild>
                <Link href="/login?tab=register">Start Free</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative">
          <div className="absolute inset-0 bg-[url('/Hero-image.jpg')] bg-cover bg-center opacity-5"></div>
          <div className="container relative py-24 md:py-32 lg:py-40">
            {/* Changed to grid layout with responsive columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Text content column */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-8">
                <div className="space-y-4">
                  <h1 className="font-playfair text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                    Unlock Deeper Understanding with CorePragya
                  </h1>
                  <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
                    Harness the power of AI and Knowledge to enhance your wisdom by retention and comprehension.
                  </p>
                </div>
                <div className="space-x-4">
                  <Button size="lg" className="bg-indigo-700 hover:bg-indigo-800" asChild>
                    <Link href="/login?tab=register">
                      Start Free <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </div>
              </div>
              
              {/* Image column */}
              <div className="w-full overflow-hidden rounded-lg border shadow-xl">
                <Image
                  src="/Hero-image.jpg"
                  width={1200}
                  height={600}
                  alt="CorePragya Dashboard"
                  className="w-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="bg-slate-50 py-20">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="font-playfair text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Core Features</h2>
              <p className="mx-auto mt-4 max-w-[700px] text-lg text-muted-foreground">
                Discover how CorePragya transforms your learning experience with these powerful tools.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center rounded-lg border bg-background p-6 text-center shadow-sm transition-all hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                  <Brain className="h-6 w-6 text-indigo-700" />
                </div>
                <h3 className="mt-4 font-playfair text-xl font-bold">AI-Powered Q&A Bot</h3>
                <p className="mt-2 text-muted-foreground">
                  Ask questions about any content and receive insightful, contextual answers instantly.
                </p>
              </div>
              <div className="flex flex-col items-center rounded-lg border bg-background p-6 text-center shadow-sm transition-all hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                  <Map className="h-6 w-6 text-indigo-700" />
                </div>
                <h3 className="mt-4 font-playfair text-xl font-bold">Concept Mapping</h3>
                <p className="mt-2 text-muted-foreground">
                  Visualize connections between ideas to deepen your understanding of complex topics.
                </p>
              </div>
              <div className="flex flex-col items-center rounded-lg border bg-background p-6 text-center shadow-sm transition-all hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                  <FlashCard className="h-6 w-6 text-indigo-700" />
                </div>
                <h3 className="mt-4 font-playfair text-xl font-bold">Auto Flashcard Generator</h3>
                <p className="mt-2 text-muted-foreground">
                  Transform your notes into effective flashcards for efficient, spaced repetition learning.
                </p>
              </div>
              <div className="flex flex-col items-center rounded-lg border bg-background p-6 text-center shadow-sm transition-all hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                  <BarChart3 className="h-6 w-6 text-indigo-700" />
                </div>
                <h3 className="mt-4 font-playfair text-xl font-bold">Reading Analytics</h3>
                <p className="mt-2 text-muted-foreground">
                  Track your reading habits and comprehension to optimize your learning journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="font-playfair text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="mx-auto mt-4 max-w-[700px] text-lg text-muted-foreground">
                Experience a seamless journey to enhanced learning with CorePragya.
              </p>
            </div>
            <div className="mx-auto max-w-4xl">
              <div className="relative">
                <div className="absolute left-8 top-0 h-full w-px bg-border md:left-1/2"></div>
                <div className="space-y-12">
                  <div className="relative md:flex md:items-center md:justify-between md:gap-8">
                    <div className="mb-8 flex md:mb-0 md:w-1/2 md:justify-end md:pr-8">
                      <div className="rounded-lg border bg-background p-6 shadow-sm md:max-w-md">
                        <h3 className="font-playfair text-xl font-bold">Upload Your Content</h3>
                        <p className="mt-2 text-muted-foreground">
                          Import articles, PDFs, notes, or any text-based content you want to study.
                        </p>
                      </div>
                    </div>
                    <div className="absolute left-0 top-6 flex h-16 w-16 items-center justify-center rounded-full border bg-background text-lg font-bold md:left-1/2 md:-ml-8">
                      1
                    </div>
                    <div className="md:w-1/2 md:pl-8"></div>
                  </div>
                  <div className="relative md:flex md:items-center md:justify-between md:gap-8">
                    <div className="mb-8 md:mb-0 md:w-1/2 md:pr-8"></div>
                    <div className="absolute left-0 top-6 flex h-16 w-16 items-center justify-center rounded-full border bg-background text-lg font-bold md:left-1/2 md:-ml-8">
                      2
                    </div>
                    <div className="md:w-1/2 md:pl-8">
                      <div className="rounded-lg border bg-background p-6 shadow-sm md:max-w-md">
                        <h3 className="font-playfair text-xl font-bold">AI Analysis</h3>
                        <p className="mt-2 text-muted-foreground">
                          Our AI processes your content, identifying key concepts, relationships, and knowledge gaps.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="relative md:flex md:items-center md:justify-between md:gap-8">
                    <div className="mb-8 flex md:mb-0 md:w-1/2 md:justify-end md:pr-8">
                      <div className="rounded-lg border bg-background p-6 shadow-sm md:max-w-md">
                        <h3 className="font-playfair text-xl font-bold">Interact & Learn</h3>
                        <p className="mt-2 text-muted-foreground">
                          Ask questions, explore concept maps, study flashcards, and track your progress.
                        </p>
                      </div>
                    </div>
                    <div className="absolute left-0 top-6 flex h-16 w-16 items-center justify-center rounded-full border bg-background text-lg font-bold md:left-1/2 md:-ml-8">
                      3
                    </div>
                    <div className="md:w-1/2 md:pl-8"></div>
                  </div>
                  <div className="relative md:flex md:items-center md:justify-between md:gap-8">
                    <div className="mb-8 md:mb-0 md:w-1/2 md:pr-8"></div>
                    <div className="absolute left-0 top-6 flex h-16 w-16 items-center justify-center rounded-full border bg-background text-lg font-bold md:left-1/2 md:-ml-8">
                      4
                    </div>
                    <div className="md:w-1/2 md:pl-8">
                      <div className="rounded-lg border bg-background p-6 shadow-sm md:max-w-md">
                        <h3 className="font-playfair text-xl font-bold">Deepen Understanding</h3>
                        <p className="mt-2 text-muted-foreground">
                          Review analytics, refine your approach, and achieve mastery of your subject matter.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="bg-slate-50 py-20">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="font-playfair text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                What Our Users Say
              </h2>
              <p className="mx-auto mt-4 max-w-[700px] text-lg text-muted-foreground">
                Discover how CorePragya has transformed learning experiences.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border bg-background p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <Image
                    src="/placeholder.svg?height=60&width=60"
                    width={60}
                    height={60}
                    alt="User Avatar"
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-bold">Sarah Johnson</h3>
                    <p className="text-sm text-muted-foreground">Medical Student</p>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">
                  "CorePragya has revolutionized how I study complex medical concepts. The concept mapping feature helps
                  me visualize connections I would have missed otherwise."
                </p>
              </div>
              <div className="rounded-lg border bg-background p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <Image
                    src="/placeholder.svg?height=60&width=60"
                    width={60}
                    height={60}
                    alt="User Avatar"
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-bold">David Chen</h3>
                    <p className="text-sm text-muted-foreground">Software Engineer</p>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">
                  "The AI-powered Q&A bot is like having a personal tutor available 24/7. It's helped me master new
                  programming languages in half the time."
                </p>
              </div>
              <div className="rounded-lg border bg-background p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <Image
                    src="/placeholder.svg?height=60&width=60"
                    width={60}
                    height={60}
                    alt="User Avatar"
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-bold">Maya Patel</h3>
                    <p className="text-sm text-muted-foreground">History Professor</p>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">
                  "The auto flashcard generator has transformed how I prepare my lectures. My students love using
                  CorePragya to study for exams."
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-indigo-700 py-20 text-white">
          <div className="container text-center">
            <h2 className="font-playfair text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Ready to Transform Your Learning?
            </h2>
            <p className="mx-auto mt-4 max-w-[700px] text-lg text-indigo-100">
              Join thousands of learners who have enhanced their knowledge retention and comprehension with CorePragya.
            </p>
            <Button size="lg" className="mt-8 bg-white text-indigo-700 hover:bg-indigo-50" asChild>
              <Link href="/login?tab=register">
                Start Free Today <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <p className="mt-4 text-sm text-indigo-200">No credit card required. 14-day free trial.</p>
          </div>
        </section>
      </main>
      <footer className="border-t bg-slate-50 py-12">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex flex-col items-center gap-4 md:items-start">
              <Link href="/" className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-indigo-700" />
                <span className="inline-block font-playfair text-xl font-bold">CorePragya</span>
              </Link>
              <p className="text-center text-sm text-muted-foreground md:text-left">
                Enhancing knowledge retention through AI and ancient wisdom.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-12 sm:grid-cols-3 md:gap-8 lg:grid-cols-5">
              <div className="flex flex-col gap-2">
                <h3 className="font-bold">Product</h3>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Features
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Pricing
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Integrations
                </Link>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-bold">Company</h3>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  About
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Careers
                </Link>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-bold">Resources</h3>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Documentation
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Guides
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Support
                </Link>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-bold">Legal</h3>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Cookie Policy
                </Link>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-bold">Contact</h3>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Email
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Twitter
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  LinkedIn
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} CorePragya. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}


