import type { ReactElement } from 'react';
import type { PlaneModelId } from '../planes';
import CessnaModel from '../PlaneModel';
import AirlinerModel from './AirlinerModel';
import Jumbo747Model from './Jumbo747Model';
import FighterModel from './FighterModel';
import StealthModel from './StealthModel';
import InterceptorModel from './InterceptorModel';
import WarthogModel from './WarthogModel';
import EagleModel from './EagleModel';
import BlackbirdModel from './BlackbirdModel';

const REGISTRY: Record<PlaneModelId, () => ReactElement> = {
  cessna: CessnaModel,
  airliner: AirlinerModel,
  jumbo: Jumbo747Model,
  falcon: FighterModel,
  raven: StealthModel,
  vortex: InterceptorModel,
  warthog: WarthogModel,
  eagle: EagleModel,
  blackbird: BlackbirdModel,
};

export function getPlaneModelComponent(id: PlaneModelId) {
  return REGISTRY[id];
}
