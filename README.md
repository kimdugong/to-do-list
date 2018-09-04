# TO-DO-LIST - NextJS 와 Redis 를 이용한

![to-do-list](https://d.pr/i/n7tVFY+)

## 빌드, 실행방법

## 0. 준비작업

### OS

windows subsystem for linux 를 이용한 ubuntu 16.04.4

### nodejs 설치

v8.11.1 node.js 설치

### npm

v6.1.0 npm 설치

`npm i -g npm@6.1.0`

### redis 설치 (windows 는 지원안함)

#### install redis on debian

`sudo apt-get update && sudo apt-get install redis-server`

#### install redis on mac

`brew install redis`

---

## 1. 프로젝트 빌드

### 프로젝트 다운로드

`git clone https://github.com/kimdugong/to-do-list.git`

### npm package 설치

`cd to-do-list`

`npm install`

## 2. 프로젝트 실행

### redis 실행

### running on debian

`redis-server`

### running on mac

`launchctl load ~/Library/LaunchAgents/homebrew.mxcl.redis.plist`

### web server 실행

`npm run dev`

### web browser

http://localhost:3000

---

## 3. 테스트

테스트시 데이터베이스에 데이터가 모두 삭제됩니다.

### web server 실행

`npm run dev`

### redis 실행

### running on debian

`redis-server`

### test 실행

`npm run test`

### test 목록

- 서버 응답 여부
- id: 1 데이터 삽입
- GET
  - 모든 데이터 패치
  - 특정 list 패치
  - 없는 id 패치
- POST
  - 새로운 list 삽입
  - list 업데이트
  - 참조가 걸린 list 완료 실패
  - 참조 list 완료
  - 참조가 걸린 list 완료 성공

## 문제해결 전략

## 1. 요구사항 파악

- 웹어플리케이션 구현
- REST API 를 사용하는 서버 구현
- 데이타베이스 설계
- 테스트 코드 작성

---

## 2. 기술 스택 모색

- In-memory db 는 어떤 것이 있는지 조사 - redis 사용
- 간단하게 구현 가능한 스타일 되어 있는 콤포넌트 조사 - react-semantic-ui 사용
- 서버와 프론트를 아우르는 프레임워크 조사 - NextJS 사용

---

## 3. 고민한 것들과 해결방안

- redis 의 대한 이해부족

in-memory db 를 사용하라고 해서 redis 라는 db 를 사용하기로 했는데 redis 를 이해하지 못한채 프로젝트를 시작하게 되었다. key-value 데이터에 맞춰 데이터를 모델링했는데 nosql 과 상이하여 특정 key 값을 찾거나 접근하지 못하는 바람에 만족하지 못하는 퍼포먼스의 결과물이 나왔다.

- Test code 작성 미흡

단위테스트 필수라고 써있는데 단위테스트를 학습한 적은 있지만 테스트 경험이 부족했다. 어떤 단위를 테스트로 잡고 작성해야 할지 고민을 많이했다. 결국 서버 사이드만 테스트 했다. 프론트사이드의 스냅샷 테스트나 성능 테스트는 구현하지 못했다.

---

## 4. 개선할점

1. 데이터베이스 구조 개선

- 첫 페이지 렌더링시 모든 데이터를 패치 -> 데이터를 페이지에 할당되는 데이터 만큼만 패치해오게 수정

- 모든 데이터를 패치하지 않을 시 -> 참조하기 검색시 쿼리로 데이터를 가져오게 수정

2. pub/sub 사용

- server 에서 결과 값을 내려주는 방식 -> 실시간으로 데이터 업데이트 되도록 수정

3. error handling

- 더 꼼꼼한 error handling 이 필요

---
