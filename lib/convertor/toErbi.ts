import { Parsed } from "../parser/Parser"
import debugCreator = require("debug")
const debug = debugCreator("rime.main")
import fs = require("fs")
type map<T> = { [key: string]: T }
let erbiCode: map<Array<string>> = require("./code.js")  // JSON.parse(fs.readFileSync(`${__dirname}+/code.json`).toString())
function getCode(ch: string, codeLen: number) {
  let distinct: map<number> = {}
  let ret = (erbiCode[ch] || [])
    .filter(c => c[0] !== "i" && c.length >= codeLen)
    .map(c => c.substr(0, codeLen))
    .filter(c => {
      if (c in distinct) {
        return false;
      }
      distinct[c] = 1
      return true;
    })
  return ret
}
function cartier(...arg: Array<Array<string>>) {
  arg = arg.filter(a => a.length)
  if (arg.length === 0) {
    return []
  }
  let pointers: Array<number> = new Array<number>(arg.length).fill(0)
  let lens: Array<number> = new Array<number>(arg.length).fill(0)
    .map((e, i) => arg[i].length)
  let end = false
  let next = () => {
    let carry = 1
    for (let i = pointers.length - 1; i >= 0; i--) {
      if (pointers[i] + carry === lens[i]) {
        pointers[i] = 0
      } else {
        pointers[i] += 1
        carry = 0
        break;
      }
    }
    end = carry === 1
  }
  let oneRet = () => {
    let r = ""
    for (let i = 0; i < pointers.length; i++) {
      r += arg[i][pointers[i]]
    }
    return r
  }
  let ret: Array<string> = []
  while (!end) {
    ret.push(oneRet())
    if (ret.length > 20) {
      console.log(arg)
    }
    next()
  }
  return ret
}

export function toErbi(parsed: Parsed): Array<Parsed> {
  let converted: Parsed = {
    code: "",
    phrase: ""
  }
  let mapFn = (e: string) => ({
    code: e,
    phrase: parsed.phrase
  })


  switch (parsed.phrase.length) {
    case 2:
      {
        let first = getCode(parsed.phrase[0], 2)
        let second = getCode(parsed.phrase[1], 2)
        return cartier(first, second).map(mapFn)
      }
    case 3: {
      let first = getCode(parsed.phrase[0], 2)
      let second = getCode(parsed.phrase[1], 1)
      let thired = getCode(parsed.phrase[2], 1)
      return cartier(first, second, thired).map(mapFn)
    }
    case 4: {
      return cartier(
        getCode(parsed.phrase[0], 1),
        getCode(parsed.phrase[1], 1),
        getCode(parsed.phrase[2], 1),
        getCode(parsed.phrase[3], 1),
      ).map(mapFn)
    }
    default:
      let len = parsed.phrase.length
      return cartier(
        getCode(parsed.phrase[0], 1),
        getCode(parsed.phrase[1], 1),
        getCode(parsed.phrase[2], 1),
        getCode(parsed.phrase[len - 2], 1),
        getCode(parsed.phrase[len - 1], 1)
      ).map(mapFn)
  }
}