import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register plugins once at app root
gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }
