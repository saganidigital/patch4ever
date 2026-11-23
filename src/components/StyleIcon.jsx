import {
  Award,
  BadgeCheck,
  Bike,
  CircleDot,
  Compass,
  Crosshair,
  Flame,
  Goal,
  HardHat,
  Layers,
  Medal,
  Music,
  Shield,
  Shirt,
  Smile,
  Sparkles,
  Swords,
  Tent,
  ThumbsUp,
  Trophy,
} from 'lucide-react'

const ICONS = {
  'circle-dot': CircleDot,
  trophy: Trophy,
  swords: Swords,
  goal: Goal,
  medal: Medal,
  crosshair: Crosshair,
  flame: Flame,
  shield: Shield,
  'thumbs-up': ThumbsUp,
  'badge-check': BadgeCheck,
  compass: Compass,
  award: Award,
  music: Music,
  smile: Smile,
  bike: Bike,
  tent: Tent,
  'hard-hat': HardHat,
  sparkles: Sparkles,
  shirt: Shirt,
  layers: Layers,
}

export default function StyleIcon({ name, className = 'size-4' }) {
  const Icon = ICONS[name] || Shield
  return <Icon className={className} aria-hidden="true" />
}
