import * as fs from "fs"

import * as Pipe from "pipe"
import debugCreator = require("debug")
const debug = debugCreator("rime")
export interface Parsed {
  original?: string,
  code: string,
  phrase: string,
  frequency?: number
}
export interface LibInfo {
  count?: number,
  name: string
}
function isParsed(p: Parsed | Parsed[]): p is Parsed {
  return "code" in p
}
export abstract class Parser extends Pipe.Source<Parsed> {
  abstract async parse(): Promise<Parsed | Parsed[]>
  abstract async getLibInfo(): Promise<LibInfo>
  async startPipe() {
    debug("Begin to parse")
    let p;
    while ((p = (await this.parse()))) {
      if (isParsed(p)) {
        this.out(p)
      } else {
        for (let t of p) {
          this.out(t)
        }
      }
    }
  }
  // async start() {
  //   debug("Begin to parse")
  //   let p;
  //   while ((p = (await this.parse()))) {
  //     this.out(p)
  //   }
  // }
  progress(): number {
    return 0
  }
  total(): number {
    return 1
  }
}