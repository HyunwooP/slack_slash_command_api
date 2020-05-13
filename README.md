## SLACK API SERVER
```
2020.01.22
Author: 박현우
```

# Slash Command
* 유료 서비스인 슬랙의 제한 범위를 벗어나보자.
* 그것의 한계는 어디인가?

# 필독!!
* 기능을 추가하려면 consts에 해당 키워드와 설명을 적어주세요!!!!!!!!!!!!! (필수) * 

1. 시작하기
```
1. 본인만의 개인 슬랙 워크스페이스 및 App을 만든다.
	1-1. 슬랙 api 사이트에서 slash commands를 추가한다.
	1-2. interactive components에 Request URL 값을 해당 외부 도메인 입력한다.
	1-3. 입력 후, 슬랙 Client에 reinstall! (슬랙 환경 웹에서 함.)

2. token을 가져와서 사용한다. (OAuth & Permissions / OAuth Access Token)
```

2. HTTP 통신
```

1. 슬랙 Command input keyword
	1-1. keyword에 걸맞는 로직으로 사용자들에게 보여주자.
```

3. 프로젝트 구조
```
{
	index.js,
	src: {
		const: 상수 데이터 선언,
		modules: keyword별 Controller Module,
		util,
		message: 입력 받은 키워드를 정제,
		method: module을 알맞은 형태로 재정의 후 exports
	},
	etc: {
		babel
	}
}
```