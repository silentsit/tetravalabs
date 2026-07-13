"use client"

import Image from "next/image"
import { useCallback, useRef, useState } from "react"

const ZOOM_LEVEL = 2.25
const LENS_SIZE = 128
const IMAGE_PADDING = 16

type Props = {
  src: string
  alt: string
  priority?: boolean
}

type ImageMetrics = {
  naturalWidth: number
  naturalHeight: number
}

type LensState = {
  x: number
  y: number
  offsetX: number
  offsetY: number
  renderWidth: number
  renderHeight: number
}

function getRenderedImageRect(
  containerWidth: number,
  containerHeight: number,
  imageWidth: number,
  imageHeight: number
) {
  const innerWidth = Math.max(containerWidth - IMAGE_PADDING * 2, 1)
  const innerHeight = Math.max(containerHeight - IMAGE_PADDING * 2, 1)
  const imageAspect = imageWidth / imageHeight
  const innerAspect = innerWidth / innerHeight

  if (imageAspect > innerAspect) {
    const width = innerWidth
    const height = innerWidth / imageAspect
    return {
      x: IMAGE_PADDING,
      y: IMAGE_PADDING + (innerHeight - height) / 2,
      width,
      height
    }
  }

  const height = innerHeight
  const width = innerHeight * imageAspect
  return {
    x: IMAGE_PADDING + (innerWidth - width) / 2,
    y: IMAGE_PADDING,
    width,
    height
  }
}

export function ProductImageZoom({ src, alt, priority = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [metrics, setMetrics] = useState<ImageMetrics | null>(null)
  const [active, setActive] = useState(false)
  const [lens, setLens] = useState<LensState | null>(null)

  const updateLens = useCallback(
    (clientX: number, clientY: number) => {
      const box = containerRef.current
      if (!box || !metrics) return

      const rect = box.getBoundingClientRect()
      const rendered = getRenderedImageRect(rect.width, rect.height, metrics.naturalWidth, metrics.naturalHeight)
      const half = LENS_SIZE / 2
      const pointerX = clientX - rect.left
      const pointerY = clientY - rect.top
      const relativeX = pointerX - rendered.x
      const relativeY = pointerY - rendered.y
      const clampedX = Math.max(0, Math.min(rendered.width, relativeX))
      const clampedY = Math.max(0, Math.min(rendered.height, relativeY))

      setLens({
        x: Math.max(half, Math.min(rect.width - half, pointerX)),
        y: Math.max(half, Math.min(rect.height - half, pointerY)),
        offsetX: clampedX * ZOOM_LEVEL - half,
        offsetY: clampedY * ZOOM_LEVEL - half,
        renderWidth: rendered.width,
        renderHeight: rendered.height
      })
    },
    [metrics]
  )

  const handleEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      setActive(true)
      updateLens(event.clientX, event.clientY)
    }
  }

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden ${active ? "cursor-none" : "cursor-zoom-in"}`}
      onMouseEnter={handleEnter}
      onMouseLeave={() => {
        setActive(false)
        setLens(null)
      }}
      onMouseMove={(event) => updateLens(event.clientX, event.clientY)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 1024px) 280px, 320px"
        className="object-contain p-4"
        draggable={false}
        onLoad={(event) => {
          const image = event.currentTarget
          setMetrics({
            naturalWidth: image.naturalWidth,
            naturalHeight: image.naturalHeight
          })
        }}
      />

      {active && lens ? (
        <div
          className="pointer-events-none absolute z-10 overflow-hidden rounded-full border-2 border-white bg-white shadow-[0_8px_24px_rgba(15,23,42,0.18)] ring-1 ring-[#CBD5E1]"
          style={{
            width: LENS_SIZE,
            height: LENS_SIZE,
            left: lens.x - LENS_SIZE / 2,
            top: lens.y - LENS_SIZE / 2
          }}
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            draggable={false}
            className="absolute max-w-none select-none"
            style={{
              width: lens.renderWidth * ZOOM_LEVEL,
              height: lens.renderHeight * ZOOM_LEVEL,
              left: -lens.offsetX,
              top: -lens.offsetY
            }}
          />
        </div>
      ) : null}
    </div>
  )
}
