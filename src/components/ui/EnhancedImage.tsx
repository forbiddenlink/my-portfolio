'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'
import { easings } from '@/lib/easings'

interface EnhancedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  hoverScale?: number
  hoverRotate?: number
}

export function EnhancedImage({
  src,
  alt,
  width,
  height,
  className = '',
  hoverScale = 1.05,
  hoverRotate = 2
}: EnhancedImageProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: hoverScale }}
      transition={{
        duration: 0.4,
        ease: easings.imageHover,
      }}
    >
      <motion.div
        animate={{
          scale: isHovered ? 1.1 : 1,
          rotate: isHovered ? hoverRotate : 0,
        }}
        transition={{
          duration: 0.6,
          ease: easings.imageHover,
        }}
      >
        {width && height ? (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="w-full h-full object-cover"
          />
        ) : (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        )}
      </motion.div>
      
      {/* Subtle overlay on hover */}
      <motion.div
        className="absolute inset-0 bg-white pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

export function MagneticImage({
  src,
  alt,
  width,
  height,
  className = '',
  magneticStrength = 0.3
}: EnhancedImageProps & { magneticStrength?: number }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * magneticStrength
    const y = (e.clientY - rect.top - rect.height / 2) * magneticStrength
    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
    >
      {width && height ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-full object-cover"
        />
      ) : (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      )}
    </motion.div>
  )
}
