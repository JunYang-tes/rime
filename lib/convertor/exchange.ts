import { Parsed } from "../parser/Parser"
export default function exchange(d: Parsed): Parsed {
  return {
    ...d,
    code: d.phrase,
    phrase: d.code,
  }
}