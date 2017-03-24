import Parser from "./FileParser"
import { Parsed } from "./Parser"
import * as fs from "fs"
import debugCreator = require("debug")
const debug = debugCreator("rime")
abstract class LineBasedFileParser extends Parser {
  idx: 0
  lines: Array<string>
  constructor(filePath: string, encoding = "UTF-8") {
    super(filePath)
    debug("Open " + filePath)
    this.lines = fs.readFileSync(filePath, encoding).split("\n")
    if (!this.lines.length) {
      debug("No lines in file" + filePath)
    } else {
      debug("Lines:" + this.lines.length)
    }
    this.idx = 0
  }
  progress() {
    return this.idx / this.lines.length
  }
  total() {
    return this.lines.length
  }
  readLine(): Promise<string> {
    return new Promise<string>(res => {
      if (this.idx < this.lines.length) {
        let line = this.lines[this.idx++]
        res(line)
      } else {
        res(null)
      }

    })
    // return new Promise<string>(res => this.idx < this.lines.length ? res(this.lines[this.idx++]) : res(null))
  }
}
export default LineBasedFileParser