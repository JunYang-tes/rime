import { toErbi } from "./toErbi"
import { ToJson } from "./toJson"
import { IterableFlatify } from "pipe"
import { Parsed } from "../parser/Parser"
export const Convertors = {
  "json": new ToJson(),
  "none": d => d,
  "erbi": new IterableFlatify(toErbi)
}