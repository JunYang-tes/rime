import { Parsed } from "../parser/Parser"
import * as Pipe from "pipe"
type Map = { [key: string]: Array<string> }
export class ToJson extends Pipe.Pipe<Parsed, { total: number, data: Map }> {
  map: Map = {}
  total: 0
  constructor() {
    super()
    this.total = 0;
  }
  onData(data: Parsed): { total: number, data: Map } {
    this.total++
    if (data.phrase in this.map) {
      this.map[data.phrase].push(data.code)
    } else {
      this.map[data.phrase] = [data.code]
    }
    return null
  }
  onEnd() {
    this.out({ total: this.total, data: this.map })
    return true
  }
  async getResult() {
    return { total: this.total, data: this.map }
  }
}

