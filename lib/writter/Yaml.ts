import * as yaml from "js-yaml"
import * as Pipe from "pipe"
import { Parsed } from "../parser/Parser"
import * as fs from "fs"
abstract class YamlWriter extends Pipe.Pipe<Parsed, void> {
  yamlPath: string
  constructor(yamlPath, wordlibInfo) {
    super()
    this.yamlPath = yamlPath
    fs.writeFileSync(
      yamlPath,
      `
#Yield by rime word-lib tool
---
${yaml.dump(wordlibInfo)}
...\n\n`
    )
  }
}
export default YamlWriter
