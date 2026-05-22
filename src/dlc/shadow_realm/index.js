/**
 * Runewarden DLC 1 — Shadow Realm
 * 진입점: 모든 DLC 데이터를 한 곳에서 export
 *
 * 사용법 (기본 데이터 파일에서 병합):
 *   import { SHADOW_CARDS, SHADOW_WARDENS, SHADOW_RELICS,
 *            SHADOW_MAPS, SHADOW_EVENTS } from '../dlc/shadow_realm/index.js';
 */

export { SHADOW_CARDS }   from './cards.js';
export { SHADOW_WARDENS } from './wardens.js';
export { SHADOW_RELICS }  from './relics.js';
export { SHADOW_MAPS }    from './maps.js';
export { SHADOW_EVENTS }  from './events.js';

/** DLC 메타 정보 */
export const SHADOW_REALM_META = {
  id:        'shadow_realm',
  name:      'Shadow Realm',
  nameKo:    '그림자 왕국',
  version:   '1.0.0',
  steamAppId: 0,   // Steam Partner에서 발급받은 DLC App ID로 교체
};
