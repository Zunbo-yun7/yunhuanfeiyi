import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const EXIT_ANIMATIONS = [
  'exit-fade-up',
  'exit-dissolve',
  'exit-split',
  'exit-vortex',
  'exit-shutter',
  'exit-glow-burst',
  'exit-wave',
  'exit-iris',
  'exit-slide',
  'exit-flip',
]

function createParticles() {
  const container = document.getElementById('preLoaderParticles')
  if (!container) return
  const count = 18
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div')
    p.className = 'pre-loader-particle'
    p.style.left = `${Math.random() * 100}%`
    p.style.animationDuration = `${4 + Math.random() * 4}s`
    p.style.animationDelay = `${Math.random() * 4}s`
    p.style.opacity = `${0.3 + Math.random() * 0.5}`
    const size = 2 + Math.random() * 3
    p.style.width = `${size}px`
    p.style.height = `${size}px`
    container.appendChild(p)
  }
}

function hidePreloader() {
  const preloader = document.getElementById('preLoader')
  const progress = document.getElementById('preLoaderProgress')
  const percent = document.getElementById('preLoaderPercent')

  if (!preloader || !progress || !percent) return

  createParticles()

  let currentProgress = 0
  const interval = setInterval(() => {
    currentProgress += Math.random() * 15 + 5
    if (currentProgress >= 100) {
      currentProgress = 100
      clearInterval(interval)
      setTimeout(() => {
        const exitClass = EXIT_ANIMATIONS[Math.floor(Math.random() * EXIT_ANIMATIONS.length)]
        preloader.classList.add(exitClass)
        const onEnd = () => {
          preloader.style.display = 'none'
          preloader.removeEventListener('animationend', onEnd)
        }
        preloader.addEventListener('animationend', onEnd)
        setTimeout(() => {
          if (preloader.style.display !== 'none') {
            preloader.style.display = 'none'
          }
        }, 1200)
      }, 300)
    }
    progress.style.width = `${Math.min(currentProgress, 100)}%`
    percent.textContent = `${Math.floor(Math.min(currentProgress, 100))}%`
  }, 80)
}

function initSmoothScroll() {
  if (typeof window === 'undefined') return () => {}

  let targetScroll = window.scrollY
  let currentScroll = window.scrollY
  let momentum = 0
  let rafId: number | null = null
  let isAnimating = false

  const ease = 0.1
  const friction = 0.93

  const maxScroll = () =>
    Math.max(0, document.documentElement.scrollHeight - window.innerHeight)

  const animate = () => {
    if (Math.abs(momentum) > 0.3) {
      targetScroll = Math.max(0, Math.min(targetScroll + momentum, maxScroll()))
      momentum *= friction
    } else {
      momentum = 0
    }

    const diff = targetScroll - currentScroll
    currentScroll += diff * ease

    if (Math.abs(diff) < 0.3 && Math.abs(momentum) < 0.3) {
      currentScroll = targetScroll
      window.scrollTo(0, currentScroll)
      isAnimating = false
      return
    }

    window.scrollTo(0, currentScroll)
    rafId = requestAnimationFrame(animate)
  }

  const onWheel = (e: WheelEvent) => {
    if (window.innerWidth < 1024) return
    e.preventDefault()

    const delta = e.deltaY * (e.deltaMode === 1 ? 16 : 1)
    targetScroll = Math.max(0, Math.min(targetScroll + delta, maxScroll()))
    momentum = momentum * 0.4 + delta * 0.12

    if (!isAnimating) {
      isAnimating = true
      currentScroll = window.scrollY
      rafId = requestAnimationFrame(animate)
    }
  }

  let syncTimeout: number | null = null
  const onScroll = () => {
    if (isAnimating) return
    if (syncTimeout) clearTimeout(syncTimeout)
    syncTimeout = window.setTimeout(() => {
      targetScroll = window.scrollY
      currentScroll = window.scrollY
    }, 50)
  }

  const onResize = () => {
    targetScroll = Math.min(targetScroll, maxScroll())
  }

  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)

  return () => {
    window.removeEventListener('wheel', onWheel)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
    if (rafId) cancelAnimationFrame(rafId)
  }
}

function RootApp() {
  useEffect(() => {
    const cleanupSmoothScroll = initSmoothScroll()

    const timer = setTimeout(() => {
      hidePreloader()
    }, 600)

    return () => {
      clearTimeout(timer)
      cleanupSmoothScroll()
    }
  }, [])

  return (
    <StrictMode>
      <App />
    </StrictMode>
  )
}

createRoot(document.getElementById('root')!).render(<RootApp />)
