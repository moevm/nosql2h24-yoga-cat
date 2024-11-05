export type SpineType =
    'DEFLECTION' |
    'INCLINE' |
    'TWIST' |
    'LATERAL_TILT'
export type PositionInSpace =
    'STANDING_ON_HANDS' |
    'STANDING_ON_FEET' |
    'SITTING' |
    'LYING_ON_STOMACH' |
    'LYING_ON_BACK' |
    'LYING_ON_YOUR_SIDE' |
    'TURNED_OVER'
export type LoadAccents = 'STRENGTH' | 'FLEXIBILITY' | 'BALANCE'
export type Periphery = 'OPENING_HIP_JOINTS' | 'OPENING_SHOULDER_JOINTS'
export type Stars = 5 | 4 | 3 | 2 | 1
export type Properties = {
  spine: { key: SpineType, value: boolean, title: string }[],
  positionInSpace: { key: PositionInSpace, value: boolean, title: string }[],
  loadAccent: { key: LoadAccents, value: boolean, title: string }[],
  periphery: { key: Periphery, value: boolean, title: string }[],
  stars?: {key: Stars, value: boolean}[]
}
export type Exercise = {
  _id: string,
  img: string,
  title: string,
  description: string,
  technique: string,
  contraindications: string[],
  benefit: string[],
  rating: number,
  properties: Properties
}
