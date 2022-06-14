// import { readLines } from "https://deno.land/std/io/buffer.ts";
// import * as log from "https://deno.land/std/log/mod.ts";

// let packages = []
// 
// class PackageDescriptor {
//   name: string
//   version: string
//   package_type: string
// 
//   constructor(line: string) {
//     let fields = line.split(',')
//     if (fields.length != 3) {
//       throw new Error(`Could not parse line: ${line}`)
//     }
// 
//     [this.name, this.version, this.package_type] = fields
//   }
// }
// 
// for await (const line of readLines(Deno.stdin)) {
//   try {
//     packages.push(new PackageDescriptor(line))
//   } catch (e) {
//     Deno.core.print(e.message)
//   }
// }
// let r = await Deno.core.opAsync("submit_request", packages)
// Deno.core.print(r)

import { walk } from "https://deno.land/std@0.143.0/fs/mod.ts"
import { crypto } from "https://deno.land/std@0.143.0/crypto/mod.ts"
import { encode } from "https://deno.land/std@0.143.0/encoding/hex.ts"

async function hashFile(path: string): Promise<string> {
  let buf = await Deno.readFile(path)
  let digest = await crypto.subtle.digest("SHA-256", buf)
  return new TextDecoder().decode(encode(new Uint8Array(digest)))
}

for await (const entry of walk(".")) {
  if (!entry.isDirectory) {
    let hash = await hashFile(entry.path)
    console.log(`${entry.path}: ${hash}`)
  }
}
