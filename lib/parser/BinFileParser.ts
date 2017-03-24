import { Parsed, Parser } from "./Parser"
import * as fs from "fs"

abstract class BinaryFileParser extends Parser {
  originalFilePath: string
  fd: number
  fileSize: number
  position: number
  constructor(filePath: string) {
    super()
    this.originalFilePath = filePath
    if (!fs.existsSync(filePath)) {
      throw new Error(`File ${filePath} not exits`)
    }
    this.fd = fs.openSync(this.originalFilePath, "r")
    this.fileSize = fs.statSync(this.originalFilePath).size
  }
  protected read(offset: number, length: number): Promise<Buffer> {
    this.position = offset
    return new Promise<Buffer>((res, rej) => {
      let buffer = new Buffer(length)
      fs.read(this.fd, buffer, 0, length, offset, (err) => {
        if (err) {
          rej(err)
        } else {
          res(buffer)
        }
      })
    })
  }
  protected async readString(offset: number, length: number, encoding: string) {
    let buf = await this.read(offset, length)
    return buf.toString(encoding)
  }
  protected async readUint16(offset: number, le = true) {
    let buf = await this.read(offset, 2)
    return le ? buf.readUInt16LE(0) : buf.readUInt16BE(0)
  }
  protected async readUint32(offset: number, le = true) {
    let buf = await this.read(offset, 4)
    return le ? buf.readUInt32LE(0) : buf.readInt32BE(0)
  }
  protected async readByte(offset: number) {
    let buf = await this.read(offset, 1);
    return buf[0]
  }
  progress() {
    return this.position / this.fileSize
  }
  total() {
    return this.fileSize
  }
}
export default BinaryFileParser