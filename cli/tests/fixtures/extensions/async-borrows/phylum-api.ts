// This helper file wraps Deno.core.opAsync calls for ergonomics. There is no
// concept of injecting a module in Deno, so clients won't be able to use something
// like `import * as PhylumApi from 'phylum-api'` and will have to manually include
// this file instead.

export async function analyze(lockfile: string, project?: string, group?: string) {
  return await Deno.core.opAsync("analyze", lockfile, project, group)
}

export async function get_user_info() {
  return await Deno.core.opAsync("get_user_info")
}

export async function get_access_token(ignore_certs?: bool) {
  return await Deno.core.opAsync("get_access_token" ?? false)
}

export async function get_refresh_token() {
  return await Deno.core.opAsync("get_refresh_token")
}

export async function get_job_status(job_id?: string) {
  return await Deno.core.opAsync("get_job_status", job_id)
}

export async function get_project_details(project_name?: string) {
  return await Deno.core.opAsync("get_project_details", project_name)
}

export async function analyze_package(name: string, version: string, ecosystem: string) {
  return await Deno.core.opAsync("analyze_package", name, version, ecosystem)
}

export async function parse_lockfile(lockfile: string, lockfile_type: string) {
  return await Deno.core.opAsync("parse_lockfile", lockfile, lockfile_type)
}
