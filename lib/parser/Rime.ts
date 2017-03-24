import LineBasedFileParser from "./LineBasedFileParser"
import { LibInfo, Parsed } from "./Parser"
import debugCreator = require("debug")
const debug = debugCreator("rime")
export default class Rime extends LineBasedFileParser {
  inDataArea: boolean
  constructor(filePath: string) {
    super(filePath)
    this.inDataArea = false;
  }
  getLibInfo(): Promise<LibInfo> {
    return new Promise<LibInfo>(res => res({
      name: "test"
    }))
  }
  async parse(): Promise<Parsed> {
    if (!this.inDataArea) {
      debug("Skip info area")
      let line = await super.readLine()
      while ((line = await super.readLine())) {
        debug(line)
        if (line.indexOf("...") > -1) {
          await super.readLine() //drop empty line
          this.inDataArea = true
          break;
        }
      }
    }

    let line = await super.readLine()

    if (line) {
      let [phrase, code] = line.split(/\s/)
      return {
        code,
        phrase
      }
    }
  }
}