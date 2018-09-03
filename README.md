# TO-DO-LIST

## 빌드, 실행방법

### OS

windows subsystem for linux 를 이용한 ubuntu 16.04.4

### node version

v8.11.1

### npm

v6.1.0

`npm install`

### redis (windows 는 지원안함)

#### on debian

`sudo apt-get update && sudo apt-get install redis-server`

#### on mac

`brew install redis`

### redis run

### on debian

`redis-server`

### on mac

`launchctl load ~/Library/LaunchAgents/homebrew.mxcl.redis.plist`

### server run

`npm run dev`

### web browser

http://localhost:3000

### TEST

데이터베이스에 데이터가 없어야 합니다.

`npm run test`
