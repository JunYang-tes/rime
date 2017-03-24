import { Parsed } from "./Parser"
import { Pipe } from "pipe"
export type Parsers = {
  [key: string]: Parser
}
export interface Parser extends Pipe<any, Parsed> {
  new (file: String)
}


export const Parsers: { [key: string]: Parser } = {
  RimeErbi: require("./Rime").default,
  Json: require("./JsonParser").default,
  Scel: require("./Scel").default,
}
