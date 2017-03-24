require("debug").enable("rime.*")
/**
 * 
+-----------+           +-------------+           +----------------+
|           |   Parsed  |             |  Parsed   |                |
| Parser    +------------> Convertor  +----------->    Writer      |
|           |           |             |  any      |                |
+-----------+           +-------------+           +----------------+
 * 
 */
import ProgressBar = require("progress")
import debugCreator = require("debug")
const debug = debugCreator("rime.main")
import { Pipe } from "pipe"
import { Parsers } from "./parser"
import { Convertors } from "./convertor"
import { Writers } from "./writter"


function progress(source: { progress: () => number, total: () => number }) {
  let progressBar = new ProgressBar("Handing [:bar] :percent", {
    total: source.total(),
    incomplete: ' ',
    width: 20
  })
  let total = source.total();
  let last = 0
  return d => {
    progressBar.update(source.progress())
    if (progressBar.complete) {
      console.log('\n');
    }
    // debug("dd")
    return d
  }
}
function getOp(name: string) {
  let ret = process.argv.filter(o => o.startsWith(name))[0]
  return ret && ret.substring(name.length)
}
function showHelpAndExit() {
  console.log(`
Usage:${process.argv[0].indexOf("node") > 0 ? process.argv0[0] + ' ' + process.argv[1] : process.argv[0]} --from=<from> --to=<to> --cvt=[cvt] --src=<file> --out=<file>
--from can be:
  ${Object.keys(Parsers).join(' ')}
--cvt can be:
  ${Object.keys(Convertors).join(' ')}
  default is none
--to can be:
  ${Object.keys(Writers).join(' ')}`)
  process.exit(1)
}

function GetProcessPipe(): Pipe<any, any> {
  let Parser = Parsers[getOp("--from=")]
  let src = getOp("--src=")
  let dest = getOp("--out=")
  let writer = Writers[getOp("--to=")]
  if (!src || !dest || !Parser || !writer) {
    showHelpAndExit()
  }
  let cvt = Convertors[getOp("--cvt=")] || Convertors.none
  let source = new Parser(src)
  source
    .to(progress(source))
    .to(cvt)
    .to(writer(dest))
  return source
}

GetProcessPipe()
  .start()
  .then(() => {
    debug("Completed!")
  })
  .catch(err => {
    debug(err)
  })



// import JsonParser from "./parser/JsonParser"
// import { ToJson } from "./convertor/json"
// import { JsonWriter } from "./writter/json"
// import ErbiWriter from "./writter/Erbi"
// import Rime from "./parser/Rime"
// import erbi from "./convertor/erbi"
// function Erbi2Json() {

//   let p = new Rime("/home/jun/.config/ibus/rime/chaoqiang_erbi.dict.yaml")
//   p
//     .to(d => d.code && d.phrase && d.phrase.length === 1 && d)
//     .to(progress(p))
//     .to<{ total: number, data: {} }>(new ToJson)
//     .to(d => {
//       debug(`\ncollected:${d.total} words`)
//       return d.data;
//     })
//     .to(JsonWriter("./code.json"))
//     .start()
//     .catch(debug)
// }
// function extractErbiWordlib() {
//   let p = new Rime("/home/jun/.config/ibus/rime/chaoqiang_erbi.dict.yaml")
//   p.to(d => d.code && d.phrase && d.phrase.length > 1 && d)
//     .to(progress(p))
//     .to(new ErbiWriter("erbi-base.dict.yaml", Object.assign({
//       name: "erbi-base"
//     }, erbiWordLibInfo)))
//     .start()
//     .catch(debug)
// }

// function Json2Erbi() {
//   let pipe = new JsonParser("./code.json")
//   let writer = new ErbiWriter("erbi-char.yaml", Object.assign({ name: "erbi-char" }, erbiWordLibInfo))
//   pipe.to(progress(pipe))
//     .to<void>(writer)
//     .start()
//     .then(() => debug("Completed!"))
//     .catch(err => console.log("err", err))
// }

// function sougo2erbi(){

// }