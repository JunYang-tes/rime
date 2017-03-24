import Parser from "./BinFileParser"
import { Parsed, LibInfo } from "./Parser"
/**
 * A parser for Sougo cell words-libary
 * https://github.com/aboutstudy/scel2mmseg/blob/master/scel2mmseg.py
 */
export default class Scel extends Parser {
  encoding: string
  offsetPy = 0x1540
  offsetPhrase = 0x2628
  phraseRead = 0x2628
  pyTable: { [key: string]: string } = {}
  pinyin: string
  phrases: Array<string> = []
  frequency: Array<number> = []
  constructor(filepath: string) {
    super(filepath)
    this.encoding = "UTF-16LE"
  }
  protected async setOffsetPhrase() {
    let mask = await this.readByte(4)
    if (mask === 68) {
      this.offsetPhrase = 0x2628
    } else if (mask === 69) {
      this.offsetPhrase = 0x26c4
    }
    this.phraseRead = this.offsetPhrase
  }
  protected async parsePy() {
    let pos = this.offsetPy
    let magicNumber = await this.readUint32(pos)
    if (105922 != magicNumber) {
    //  console.log(magicNumber)
    }
    pos += 4
    let length = this.offsetPhrase - this.offsetPy
    while (pos < this.offsetPhrase) {
      let pyCode = await this.readUint16(pos)
      pos += 2
      let pyLen = await this.readUint16(pos)
      pos += 2
      let pyStr = await this.readString(pos, pyLen)
      pos += pyLen
      this.pyTable[pyCode] = pyStr
    }

  }
  async parse(): Promise<Parsed> {
    if (this.phraseRead === this.offsetPhrase) {
      await this.setOffsetPhrase()
      await this.parsePy()
    }
    if (this.phrases.length) {
      return new Promise<Parsed>(res => res({
        code: this.pinyin,
        phrase: this.phrases.pop()
      }))
    }
    else if (this.phraseRead < this.fileSize) {
      let phraseCount = await this.readUint16(this.phraseRead)
      this.phraseRead += 2
      let pyCount = (await this.readUint16(this.phraseRead)) / 2
      this.phraseRead += 2
      let py = ""
      while (pyCount--) {
        py += this.pyTable[await this.readUint16(this.phraseRead)]
        this.phraseRead += 2
      }
      this.pinyin = py
      while (phraseCount--) {
        let len = await this.readUint16(this.phraseRead)
        this.phraseRead += 2//14
        this.phrases.push(await this.readString(this.phraseRead, len))
        this.phraseRead += len
        this.phraseRead += 12
        // this.frequency.push(await this.readUint16(this.phraseRead))
        // this.phraseRead += 2
        // this.phraseRead += 10
      }
      return new Promise<Parsed>(res => {
        let p: Parsed = {
          code: py,
          phrase: this.phrases.pop()
        }
        res(p)
      })
    }

  }
  async getLibInfo(): Promise<LibInfo> {
    let reg = new RegExp("\0", "g")
    let info = {
      count: 100,
      name: (await this.readString(0x130, 0x338 - 0x130)).replace(reg, ""),
      type: (await this.readString(0x338, 0x540 - 0x338)).replace(reg, ""),
      description: (await this.readString(0x540, 0xd40 - 0x540)).replace(reg, ""),
      samplees: (await this.readString(0xd40, 0x1540 - 0xd40)).replace(reg, "")
    }
    return info
  }
  readString(offset: number, length: number) {
    return super.readString(offset, length, this.encoding)
  }
}