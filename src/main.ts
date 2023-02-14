import * as core from '@actions/core'
import {context, getOctokit} from '@actions/github'

import {createBranch} from './create-branch'

async function run() {
  try {
    const prefix = core.getInput('prefix')
    const branch = core.getInput('branch')
    const sha = core.getInput('sha')
    const squads = core.getMultilineInput('squads')
    const token = core.getInput('GITHUB_TOKEN')

    const currentVersion = branch.replace(/[a-z|-]/g, '')

    let areCreated = false

    for (const squad of squads) {
      core.debug(`Creating branch ${branch}`)
      const newBranch = `${prefix}-${squad}-${currentVersion}`.toLowerCase()
      const toolkit = getOctokit(token)
      const created = await createBranch(toolkit, context, newBranch, sha)
      areCreated = areCreated || Boolean(created)
    }

    core.setOutput('created', Boolean(areCreated))
  } catch (error: any) {
    core.setFailed(error.message)
  }
}
run()
