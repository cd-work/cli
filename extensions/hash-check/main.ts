import { walk, exists } from "https://deno.land/std@0.143.0/fs/mod.ts"
import { crypto } from "https://deno.land/std@0.143.0/crypto/mod.ts"
import { encode } from "https://deno.land/std@0.143.0/encoding/hex.ts"

const enum PackageType {
  PackageLock,
  YarnLock,
  Python,
  Csharp,
}

type PackageDescriptor = {
  name: string,
  version: string,
  ecosystem: string,
}

type PackageHashes = {
  name: string,
  version: string,
  ecosystem: string,
  hashes: FileHash[]
}

type FileHash = {
  path: string,
  hash: string,
}

////////////////////////////////////////////////////////////////////////////////
// Utility functions
////////////////////////////////////////////////////////////////////////////////

// Detect package type from the environment.
async function detectPackageType(): Promise<PackageType> {
  if (await exists("yarn.lock")) {
    return PackageType.YarnLock
  } else if (await exists("package.lock")) {
    return PackageType.PackageLock
  } else {
    throw "Couldn't determine package type"
  }
}

// Read the lockfile for the detected ecosystem and return a list of package descriptors.
// The package descriptors are extracted via the `parse_lockfile` extension API.
//
// deno-lint-ignore require-await
async function readLockfile(packageType: PackageType): Promise<PackageDescriptor[]> {
  if (packageType == PackageType.YarnLock) { 
    // return await Deno.core.opAsync("parse_lockfile", "package.json", "yarn")
    return [
      { name: "react", version: "16.13.0", ecosystem: "npm" }
    ]
  } else if (packageType == PackageType.PackageLock) {
    // return await Deno.core.opAsync("parse_lockfile", "package.json", "npm")
    return [
      { name: "react", version: "16.13.0", ecosystem: "npm" }
    ]
  } else {
    throw "Unimplemented"
  }
}

// Compute the SHA-256 hash for a single file.
async function hashFile(path: string): Promise<string> {
  const buf = await Deno.readFile(path)
  const digest = await crypto.subtle.digest("SHA-256", buf)
  return new TextDecoder().decode(encode(new Uint8Array(digest)))
}

// Recursively compute the SHA-256 hash for all the files in the specified directory.
async function* getHashesInPath(path: string) {
  for await (const entry of walk(path)) {
    if (entry.isDirectory) {
      continue
    }
    const hash = await hashFile(entry.path)
    yield [entry.path, hash]
  }
}

// Given a package type, parse the lockfile to get the list of dependencies, then
// crawl the dependency installation directory (e.g. `node_modules`) to retrieve
// all the pertinent hashes.
async function getHashesForPackages(packageType: PackageType): Promise<PackageHashes[]> {
  const packages = await readLockfile(packageType)

  if (packageType == PackageType.PackageLock || packageType == PackageType.YarnLock) {
    const hashes = []
    for (const pkg of packages) {
      hashes.push({
        name: pkg.name,
        version: pkg.version,
        ecosystem: pkg.ecosystem,
        hashes: await getHashesForPackageJS(pkg)
      })
    }
    return hashes
  } else {
    throw "Unimplemented"
  }
}

////////////////////////////////////////////////////////////////////////////////
// JavaScript
////////////////////////////////////////////////////////////////////////////////

async function getHashesForPackageJS(pkg: PackageDescriptor): Promise<FileHash[]> {
  const hashes = []

  for await (const [path, hash] of getHashesInPath('node_modules/' + pkg.name)) {
    hashes.push({
      path: path,
      hash: hash,
    })
  }

  return hashes
}

////////////////////////////////////////////////////////////////////////////////
// Main
////////////////////////////////////////////////////////////////////////////////

const packageType = await detectPackageType()
const hashes = await getHashesForPackages(packageType)

console.log(hashes)
