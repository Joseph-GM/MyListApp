// 지도 앱에서 "링크 복사"를 하면 장소명이나 줄바꿈이 URL과 함께 붙어서
// 저장되는 경우가 있어(예: "스타벅스 강남점\nhttps://naver.me/xxxxx"),
// 실제 URL만 뽑아내고 스킴이 빠져 있으면 https://를 붙여준다.
// naver.me / map.naver.com, maps.app.goo.gl / google.com/maps 같은
// 정상 공유 링크는 각 지도 앱이 iOS/Android에 유니버설 링크로 등록해 두기 때문에,
// 이렇게 정리된 URL을 그대로 열기만 해도 설치된 앱으로 자동 연결된다.
export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return trimmed;

  const match = trimmed.match(/https?:\/\/\S+/i);
  let candidate = (match ? match[0] : trimmed).trim();
  candidate = candidate.replace(/[)\].,'"]+$/, ''); // 복붙 시 붙는 꼬리 문자 제거

  if (!candidate) return candidate;
  return /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`;
}
