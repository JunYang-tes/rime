import { Parsed, Parser } from "./Parser"
import * as fs from "fs"
import debugCreator = require("debug")
import path = require("path")
const debug = debugCreator("rime")
/**
 * {
 *     char:[code,...]
 * }
 * 
 * 
 */
class JsonParser extends Parser {
  data: { [key: string]: string[] }
  name: string
  keys: string[]
  idx: number
  constructor(filePath) {
    super()
    this.data = JSON.parse(fs.readFileSync(filePath).toString())
    this.name = path.parse(filePath).name
    this.keys = Object.keys(this.data)
    this.idx = 0
  }
  async getLibInfo() {
    return {
      name: this.name,
      count: this.keys.length
    }
  }
  async parse() {
    if (this.idx >= this.keys.length) {
      return null
    } else {
      let char = this.keys[this.idx++]
      let codes = this.data[char]
      if (codes.length === 1) {
        return {
          code: codes[0],
          phrase: char
        }
      } else if (codes.length > 1) {
        return codes.map(code => ({ code, phrase: char }))
      }
    }
  }
  progress() {
    return this.idx / this.keys.length
  }
  total() {
    return this.keys.length
  }
}
export default JsonParser