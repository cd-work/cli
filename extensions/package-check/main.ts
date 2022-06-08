import { readLines } from "https://deno.land/std/io/buffer.ts";
import * as log from "https://deno.land/std/log/mod.ts";

let packages = []

for await (const line of readLines(Deno.stdin)) {
  packages.push(line)
}
