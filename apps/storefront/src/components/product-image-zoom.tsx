"use client"

import Image from "next/image"
import { useCallback, useRef, useState } from "react"

const ZOOM_LEVEL = 2.4
const THUMB_SIZE = 72

type Props = {
  src: string
  alt: string
  priority?: boolean
}

type ZoomPos = {
  x: number
  y: number
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function canHoverZoom() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches
}

export function ProductImageZoom({ src, alt, priority = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const [pos, setPos] = useState<ZoomPos>({ x: 50, y: 50 })

  const updatePos = useCallback((clientX: number, clientY: number) => {
    const box = containerRef.current
    if (!box) return

    const rect = box.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return

    setPos({
      x: clamp(((clientX - rect.left) / rect.width) * 100, 0, 100),
      y: clamp(((clientY - rect.top) / rect.height) * 100, 0, 100)
    })
  }, [])

  const handleEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!canHoverZoom()) return
    setActive(true)
    updatePos(event.clientX, event.clientY)
  }

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden bg-[#F8FAFC] ${
        active ? "cursor-crosshair" : "cursor-zoom-in"
      }`}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setActive(false)}
      onMouseMove={(event) => {
        if (!active) return
        updatePos(event.clientX, event.clientY)
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 1024px) 280px, 320px"
        className={`object-contain p-4 transition-opacity duration-150 ${
          active ? "opacity-0" : "opacity-100"
        }`}
        draggable={false}
      />

      {active ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            draggable={false}
            aria-hidden
            className="product-image-zoom-layer pointer-events-none absolute max-w-none select-none object-contain p-0"
            style={{
              width: `${ZOOM_LEVEL * 100}%`,
              height: `${ZOOM_LEVEL * 100}%`,
              left: `${-pos.x * (ZOOM_LEVEL - 1)}%`,
              top: `${-pos.y * (ZOOM_LEVEL - 1)}%`
            }}
          />

          <div
            className="pointer-events-none absolute left-3 top-3 z-10 overflow-hidden rounded-lg border-2 border-[#0D9488] bg-white shadow-sm"
            style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
            aria-hidden
          >
            <Image
              src={src}
              alt=""
              fill
              sizes={`${THUMB_SIZE}px`}
              className="product-image-zoom-thumb object-contain p-1"
              draggable={false}
            />
          </div>
        </>
      ) : null}
    </div>
  )
}
