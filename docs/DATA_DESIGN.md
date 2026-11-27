# 데이터 설계

키 `small-steps.tasks.v1`의 값은 JSON 배열이다. 각 항목은 `{ "id": "UUID", "title": "할 일", "completed": false }`이다. 추가 순서를 유지하고 title은 앞뒤 공백을 제거한 1~100자다. 읽을 수 없는 JSON은 빈 목록으로 복구한다. 새 항목은 미완료 상태로 추가된다. 저장된 항목의 completed 값이 true일 때만 완료 상태로 읽으므로 기존 항목은 미완료 상태로 표시된다.
