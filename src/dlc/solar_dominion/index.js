/**
 * Runewarden DLC 2 — Solar Dominion (태양 지배령)
 * 진입점: 모든 DLC 2 데이터를 한 곳에서 export
 */

export { SOLAR_CARDS }   from './cards.js';
export { SOLAR_WARDENS } from './wardens.js';
export { SOLAR_RELICS }  from './relics.js';
export { SOLAR_MAPS }    from './maps.js';
export { SOLAR_EVENTS }  from './events.js';

/** DLC 2 메타 정보 */
export const SOLAR_DOMINION_META = {
  id:        'solar_dominion',
  name:      'Solar Dominion',
  nameKo:    '태양 지배령',
  version:   '1.0.0',
  steamAppId: 0,
};
