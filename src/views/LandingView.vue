<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import {
  MessageCircle,
  Zap,
  Users,
  Pencil,
  BarChart3,
  Shield,
  Smartphone,
  ArrowRight,
} from 'lucide-vue-next'

let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
          observer?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
  )
  document.querySelectorAll('.reveal').forEach((el) => observer?.observe(el))
})

onUnmounted(() => observer?.disconnect())

const features = [
  {
    icon: Zap,
    title: 'Real-Time Messaging',
    description: 'Messages arrive instantly via Firebase Realtime Database. No polling, no delays.',
  },
  {
    icon: Users,
    title: 'Online Presence',
    description: 'See who\'s online with live indicators powered by onDisconnect handlers.',
  },
  {
    icon: Pencil,
    title: 'Typing Indicators',
    description: 'Know when someone is composing a message with debounced typing sync.',
  },
  {
    icon: BarChart3,
    title: 'Message Analytics',
    description: 'D3.js-powered bar charts visualize message frequency across 24 hours.',
  },
  {
    icon: Shield,
    title: 'Conversation Privacy',
    description: 'Security rules enforce that only participants can read their messages.',
  },
  {
    icon: Smartphone,
    title: 'Responsive Design',
    description: 'Sidebar collapses on mobile with native-feeling navigation and touch UI.',
  },
]

const techStack = [
  { name: 'Vue 3.6', detail: 'Composition API' },
  { name: 'TypeScript', detail: 'Strict mode' },
  { name: 'Firebase', detail: 'Auth + RTDB' },
  { name: 'D3.js', detail: 'Data visualization' },
  { name: 'Tailwind CSS', detail: 'v4 + shadcn-vue' },
  { name: 'Vite', detail: 'Build tooling' },
]
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-background">
    <!-- Animated mesh gradient background -->
    <div class="pointer-events-none fixed inset-0 overflow-hidden">
      <div class="mesh-blob mesh-blob-1" />
      <div class="mesh-blob mesh-blob-2" />
      <div class="mesh-blob mesh-blob-3" />
    </div>

    <!-- Grain overlay -->
    <div class="pointer-events-none fixed inset-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')" />

    <!-- Navigation -->
    <nav class="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
      <div class="flex items-center gap-2.5">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
          <MessageCircle class="h-4 w-4 text-background" />
        </div>
        <span class="text-sm font-semibold tracking-tight">Nestiom Chat</span>
      </div>
      <div class="flex items-center gap-3">
        <Button variant="ghost" size="sm" as-child>
          <RouterLink :to="{ name: 'login' }">Sign In</RouterLink>
        </Button>
        <Button size="sm" as-child>
          <RouterLink :to="{ name: 'register' }">
            Get Started
            <ArrowRight class="ml-1 h-3.5 w-3.5" />
          </RouterLink>
        </Button>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-20 md:pt-32">
      <div class="max-w-2xl">
        <div class="reveal">
          <div class="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
            <span class="relative flex h-2 w-2">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span class="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            Built with Firebase Realtime Database
          </div>

          <h1 class="text-4xl font-bold tracking-tight md:text-6xl">
            Chat in<br />
            <span class="text-muted-foreground/60">real time.</span>
          </h1>

          <p class="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            A full-featured messaging platform with live presence, typing indicators,
            and message analytics — all powered by a reactive Firebase backend.
          </p>

          <div class="mt-10 flex items-center gap-4">
            <Button size="lg" as-child>
              <RouterLink :to="{ name: 'register' }">
                Create Account
                <ArrowRight class="ml-1.5 h-4 w-4" />
              </RouterLink>
            </Button>
            <Button variant="outline" size="lg" as-child>
              <RouterLink :to="{ name: 'login' }">Sign In</RouterLink>
            </Button>
          </div>
        </div>
      </div>

      <!-- Hero visual — floating chat mockup -->
      <div class="reveal reveal-delay-1 mt-16 md:absolute md:right-6 md:top-28 md:mt-0 md:w-[340px]">
        <div class="rounded-2xl border bg-background/90 p-4 shadow-2xl shadow-foreground/5 backdrop-blur-md">
          <!-- Mock header -->
          <div class="flex items-center gap-3 border-b pb-3">
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold">AK</div>
            <div>
              <p class="text-sm font-medium">Ana Kovač</p>
              <p class="text-[11px] text-green-500">Online</p>
            </div>
          </div>
          <!-- Mock messages -->
          <div class="space-y-2.5 py-4">
            <div class="flex justify-start">
              <div class="max-w-[75%] rounded-2xl rounded-bl-md bg-muted px-3.5 py-2 text-xs">Hey! How's the project going?</div>
            </div>
            <div class="flex justify-end">
              <div class="max-w-[75%] rounded-2xl rounded-br-md bg-foreground px-3.5 py-2 text-xs text-background">Just finished the real-time sync</div>
            </div>
            <div class="flex justify-start">
              <div class="max-w-[75%] rounded-2xl rounded-bl-md bg-muted px-3.5 py-2 text-xs">That's amazing! Can I test it?</div>
            </div>
            <div class="flex justify-end">
              <div class="max-w-[75%] rounded-2xl rounded-br-md bg-foreground px-3.5 py-2 text-xs text-background">Open it in two tabs and try it!</div>
            </div>
            <!-- Typing indicator -->
            <div class="flex justify-start">
              <div class="flex items-center gap-1 rounded-2xl rounded-bl-md bg-muted px-4 py-2.5">
                <span class="typing-dot" />
                <span class="typing-dot" style="animation-delay: 0.15s" />
                <span class="typing-dot" style="animation-delay: 0.3s" />
              </div>
            </div>
          </div>
          <!-- Mock input -->
          <div class="flex items-center gap-2 border-t pt-3">
            <div class="flex-1 rounded-md border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground">Type a message...</div>
            <div class="flex h-7 w-7 items-center justify-center rounded-md bg-foreground">
              <ArrowRight class="h-3 w-3 text-background" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="relative z-10 mx-auto max-w-5xl px-6 py-24">
      <div class="reveal mb-14">
        <p class="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Features</p>
        <h2 class="text-2xl font-bold tracking-tight md:text-3xl">
          Everything you need<br />
          <span class="text-muted-foreground/60">for real-time communication.</span>
        </h2>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(feature, i) in features"
          :key="feature.title"
          class="reveal group rounded-xl border bg-background/70 p-5 backdrop-blur-sm hover:border-foreground/20 hover:shadow-lg hover:shadow-foreground/[0.02]"
          :style="{ transitionDelay: `${i * 80}ms` }"
        >
          <div class="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border bg-muted/50 transition-colors group-hover:bg-foreground group-hover:text-background">
            <component :is="feature.icon" class="h-4 w-4" />
          </div>
          <h3 class="mb-1.5 text-sm font-semibold">{{ feature.title }}</h3>
          <p class="text-xs leading-relaxed text-muted-foreground">{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- Tech Stack Section -->
    <section class="relative z-10 mx-auto max-w-5xl px-6 py-24">
      <div class="reveal mb-10">
        <p class="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Built with</p>
        <h2 class="text-2xl font-bold tracking-tight md:text-3xl">
          Modern stack,<br />
          <span class="text-muted-foreground/60">production patterns.</span>
        </h2>
      </div>

      <div class="reveal grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div
          v-for="tech in techStack"
          :key="tech.name"
          class="rounded-xl border bg-background/70 p-4 text-center backdrop-blur-sm transition-all hover:border-foreground/20"
        >
          <p class="text-sm font-semibold">{{ tech.name }}</p>
          <p class="mt-0.5 text-[11px] text-muted-foreground">{{ tech.detail }}</p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="relative z-10 mx-auto max-w-5xl px-6 py-16">
      <div class="reveal rounded-2xl border bg-foreground p-8 text-background md:p-12">
        <div class="mx-auto max-w-xl text-center">
          <h2 class="text-2xl font-bold tracking-tight md:text-3xl">Ready to try it?</h2>
          <p class="mt-3 text-sm leading-relaxed text-background/60">
            Register two accounts, open two browser tabs, and watch messages
            appear in real time. The bar chart updates live as you chat.
          </p>
          <div class="mt-8 flex items-center justify-center gap-4">
            <Button size="lg" variant="outline" class="border-background/20 bg-transparent text-background hover:bg-background/10" as-child>
              <RouterLink :to="{ name: 'login' }">Sign In</RouterLink>
            </Button>
            <Button size="lg" class="bg-background text-foreground hover:bg-background/90" as-child>
              <RouterLink :to="{ name: 'register' }">
                Create Account
                <ArrowRight class="ml-1.5 h-4 w-4" />
              </RouterLink>
            </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="relative z-10 mx-auto max-w-5xl px-6 py-12">
      <div class="flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
        <div class="flex items-center gap-2.5">
          <div class="flex h-6 w-6 items-center justify-center rounded-md bg-foreground">
            <MessageCircle class="h-3 w-3 text-background" />
          </div>
          <span class="text-xs font-medium text-muted-foreground">Nestiom Chat</span>
        </div>
        <p class="text-xs text-muted-foreground">
          Full Stack Developer Take-Home &middot; Vue 3 + Firebase + D3.js
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Reveal animations */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s ease-out, transform 0.7s ease-out;
}
.reveal.in-view {
  opacity: 1;
  transform: translateY(0);
}
.reveal-delay-1 { transition-delay: 200ms; }

/* Mesh gradient blobs */
.mesh-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.12;
}
.mesh-blob-1 {
  top: -10%;
  right: -5%;
  width: 500px;
  height: 500px;
  background: var(--color-primary);
  animation: drift1 20s ease-in-out infinite;
}
.mesh-blob-2 {
  bottom: 20%;
  left: -10%;
  width: 400px;
  height: 400px;
  background: hsl(217 91% 60%);
  animation: drift2 25s ease-in-out infinite;
}
.mesh-blob-3 {
  top: 40%;
  right: 20%;
  width: 300px;
  height: 300px;
  background: hsl(280 60% 60%);
  animation: drift3 22s ease-in-out infinite;
}

@keyframes drift1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-30px, 40px) scale(1.1); }
  66% { transform: translate(20px, -20px) scale(0.95); }
}
@keyframes drift2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(40px, -30px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(1.1); }
}
@keyframes drift3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-20px, -40px) scale(1.1); }
  66% { transform: translate(30px, 30px) scale(0.9); }
}

/* Typing animation */
.typing-dot {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: var(--color-muted-foreground);
  animation: typingBounce 1.2s ease-in-out infinite;
}
@keyframes typingBounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-4px); opacity: 1; }
}
</style>
