"use client";  // MUST BE FIRST LINE, BEFORE ANY IMPORTS

import dynamic from 'next/dynamic'

const HebrewPuzzles = dynamic(() => import('@/components/hebrew-puzzles'), {
  ssr: false
})

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <HebrewPuzzles />
    </main>
  )
}
