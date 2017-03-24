import * as fs from "fs"
import debugCreator = require("debug")
const debug = debugCreator("rime.writer.json")

export function JsonWriter(path): (_: any) => void {
  return function (data) {
    debug("Write to " + path)
    fs.writeFile(path, JSON.stringify(data.data), err => {
      if (err) {
        debug(err)
      }
    })
  }
}