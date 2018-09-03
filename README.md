# TO-DO-LIST - NextJS 와 Redis 를 이용한

![to-do-list](https://d.pr/i/5VaxJQ+)

## 빌드, 실행방법

## 0. 준비작업

---

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

## 1. 프로젝트 빌드

---

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

## 3. 테스트

---

데이터베이스에 데이터가 없어야 합니다.

`npm run test`

## 문제해결 전략

## 1. 요구사항 파악

---

## 2. 기술 스택 모색

---

## 3. 고민한 것들과 해결방안

---

## 4. 개선할점
