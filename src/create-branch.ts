import {Context} from '@actions/github/lib/context'
import {GitHub} from '@actions/github/lib/utils'

export async function createBranch(
  toolkit: InstanceType<typeof GitHub>,
  context: Context,
  branch: string,
  sha?: string
) {
  branch = branch.replace('refs/heads/', '')
  const ref = `refs/heads/${branch}`

  // throws HttpError if branch already exists.
  try {
    await toolkit.rest.repos.getBranch({
      ...context.repo,
      branch
    })
  } catch (error: any) {
    if (error.name === 'HttpError' && error.status === 404) {
      const resp = await toolkit.rest.git.createRef({
        ref,
        sha: sha || context.sha,
        ...context.repo
      })

      return resp?.data?.ref === ref
    } else {
      throw Error(error)
    }
  }
}

function githubToken(): string {
  const token = process.env.GITHUB_TOKEN
  if (!token)
    throw ReferenceError('No token defined in the environment variables')
  return token
}
