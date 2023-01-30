import * as core from '@actions/core';
import { getOctokit, context } from '@actions/github';

import { createBranch } from './create-branch';

async function run() {
  try {
    const prefix = core.getInput('prefix');
    const branch = core.getInput('branch');
    const sha = core.getInput('sha');
    const squads = core.getMultilineInput('squads');

    const currentVersion = branch.replace(/[a-z|-]/g, '');

    let areCreated = false;

    for (const squad of squads) {
      core.debug(`Creating branch ${branch}`);
      const newBranch = `${prefix}-${squad}-${currentVersion}`.toLowerCase();
      areCreated = areCreated || !!(await createBranch(getOctokit, context, newBranch, sha));
    }

    core.setOutput('created', Boolean(areCreated));
  } catch (error: any) {
    core.setFailed(error.message);
  }
}
run();
