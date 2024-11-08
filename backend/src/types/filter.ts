export type SpineType =
  'DEFLECTION' |
  'INCLINE' |
  'TWIST' |
  'LATERAL_TILT'
export type PositionInSpace =
  'STANDING_ON_HANDS' |
  ' STANDING_ON_FEET' |
  'SITTING' |
  'LYING_ON_STOMACH' |
  'LYING_ON_BACK' |
  'LYING_ON_YOUR_SIDE' |
  'TURNED_OVER'
export type LoadAccents = 'STRENGTH' | 'FLEXIBILITY' | 'BALANCE'
export type Periphery = 'OPENING_HIP_JOINTS' | 'OPENING_SHOULDER_JOINTS'
export type Stars = 5 | 4 | 3 | 2 | 1

export type FilterParams = {
  name?: string;
  spine?: SpineType[];
  positionInSpace?: PositionInSpace[];
  loadAccent?: LoadAccents[];
  periphery?: Periphery[];
  stars?: Stars[];
  page?: number;
}

export type FilterReviews = {
  substring: string;
}