import { ACTIVE_TOUR_SEASON } from './config'
import { springTours } from './spring'
import { autumnTours } from './autumn'

const seasons = {
  spring: springTours,
  autumn: autumnTours
}

const selectedTours = seasons[ACTIVE_TOUR_SEASON] ?? []

const imageBase = `/imgs/tours/NatureTours/${ACTIVE_TOUR_SEASON}`

export const natureTours = selectedTours.map(tour => ({
  ...tour,
  image: tour.image ? `${imageBase}/${tour.image}` : '',
  header: tour.header ? `${imageBase}/${tour.header}` : '',
  headerMobile: tour.headerMobile
    ? `${imageBase}/${tour.headerMobile}`
    : `${imageBase}/${tour.header}`
}))