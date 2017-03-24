# A word-library convertor
## install
```
cd path-to-project-dir
yarn
tsc
```
## Usage
```
Usage:node path-to-built-main.js --from=<from> --to=<to> --cvt=[cvt] --src=<file> --out=<file>
--from can be:
  RimeErbi Json Scel
--cvt can be:
  json none erbi
  default is none
--to can be:
  json erbi
```

## Example
**Convert sougo's word-labrary to rime(erbi)**
```
node dist/main.js --from=Scel --to=erbi --cvt=erbi --src=path-to-some.scel --out=erbi-dict.dict.yaml
```
