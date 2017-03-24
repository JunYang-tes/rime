import { ErbiWriter } from "./Erbi"
import { JsonWriter } from "./json"
export const Writers = {
  json: JsonWriter,
  erbi: (file: string, ) => new ErbiWriter(file)
}