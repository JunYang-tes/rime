import YamlWriter from "./Yaml"
import { Parsed } from "../parser/Parser"
import * as fs from "fs"
import * as path from "path"
let erbiWordLibInfo = {
  version: "0.1",
  sort: "original",
  columns: ["text", "code"],
  encoder: {
    exclude_patterns: ['^i.*$'],
    rules: [
      {
        length_equal: 2,
        formula: "AaAbBaBb"
      },
      {
        length_equal: 3,
        formula: "AaAbBaCa"
      },
      {
        length_in_range: [4, 10],
        formula: "AaBaCaZa"
      },
    ]
  }
}
export class ErbiWriter extends YamlWriter {
  fd: number
  constructor(yamlPath) {
    let name = path.parse(yamlPath).name
    super(yamlPath, Object.assign({ name }, erbiWordLibInfo))
    this.fd = fs.openSync(yamlPath, "a")
  }
  onData(d: Parsed) {
    fs.writeSync(this.fd, `${d.phrase}\t${d.code}\n`)
  }
}