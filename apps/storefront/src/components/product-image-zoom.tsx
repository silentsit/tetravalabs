"use client"

import Image from "next/image"
import { useRef, useState } from "react"

const ZOOM_LEVEL = 2

type Props = {
  src: string
  alt: string
  priority?: boolean
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function canHoverZoom() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches
}

export function ProductImageZoom({ src, alt, priority = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [active, setActive] = useState(false)

  const updateOrigin = (clientX: number, clientY: number) => {
    const box = containerRef.current
    const image = imageRef.current
    if (!box || !image) return

    const rect = box.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return

    const x = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100)
    const y = clamp(((clientY - rect.top) / rect.height) * 100, 0, 100)
    image.style.transformOrigin = `${x}% ${y}%`
  }

  const handleEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!canHoverZoom()) return
    updateOrigin(event.clientX, event.clientY)
    setActive(true)
  }

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden bg-[#F8FAFC] ${
        active ? "cursor-zoom-out" : "cursor-zoom-in"
      }`}
      onMouseEnter={handleEnter}
      onMouseLeave={() => {
        setActive(false)
        if (imageRef.current) imageRef.current.style.transformOrigin = "50% 50%"
      }}
      onMouseMove={(event) => {
        if (!active) return
        updateOrigin(event.clientX, event.clientY)
      }}
    >
      <Image
        ref={imageRef}
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 1024px) 280px, 320px"
        className="select-none object-contain p-4 transition-transform duration-150 ease-out"
        style={{ transform: active ? `scale(${ZOOM_LEVEL})` : "scale(1)" }}
        draggable={false}
      />
    </div>
  )
}
