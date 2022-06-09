// import { readLines } from "https://deno.land/std/io/buffer.ts";
// import * as log from "https://deno.land/std/log/mod.ts";

let packages = []

class PackageDescriptor {
  name: string
  version: string
  package_type: string

  constructor(line: string) {
    let fields = line.split(',')
    if (fields.length != 3) {
      throw new Error(`Could not parse line: ${line}`)
    }

    [this.name, this.version, this.package_type] = fields
  }
}

Deno.core.print('a')

for await (const line of readLines(Deno.stdin)) {
  try {
    packages.push(new PackageDescriptor(line))
  } catch (e) {
    Deno.core.print(e.message)
    // log.error(e.message)
  }
}
Deno.core.print('b')

// log.info(packages)

let r = await Deno.core.opAsync("submit_request", packages)
Deno.core.print(r)
