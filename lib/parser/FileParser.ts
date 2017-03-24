import { Parsed, Parser } from "./Parser"
import * as fs from "fs"
abstract class FileParser extends Parser {
  originalFilePath: string
  fd: number
  fileSize: number
  constructor(filePath: string) {
    super()
    this.originalFilePath = filePath
    if (!fs.existsSync(filePath)) {
      throw new Error(`File ${filePath} not exits`)
    }
    this.fd = fs.openSync(this.originalFilePath, "r")
    this.fileSize = fs.statSync(this.originalFilePath).size
  }
}
export default FileParser