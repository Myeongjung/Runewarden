// DLC 소유 여부 레지스트리 — steam.isDlcOwned() 호출을 한 곳에서 관리
// 앱 초기화 시 registerDLC()로 등록, 이후 hasDLC()로 조회
const _owned = new Set();

export function registerDLC(id) { _owned.add(id); }
export function hasDLC(id)      { return _owned.has(id); }
export function clearDLCs()     { _owned.clear(); }
