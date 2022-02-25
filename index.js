const core = require('@actions/core');
const exec = require("@actions/exec");
const github = require("@actions/github");
const src = __dirname;
const messages = {};
messages.exceptList = 'target branch is in except list. Check was skipped';
messages.squash = 'Only 1 commit is possible in pull request. Please squash your commits';
messages.backport = 'source branch is backport. Check was skipped';

try {
    const targetBranch = github.context.payload.pull_request.base.ref
    const sourceBranch = github.context.payload.pull_request.head.ref
    const exceptBranches = core.getInput('except-branches').split(';');
    const commitsCount = Number.parseInt(core.getInput('commits-count'));

    if (sourceBranch.split("/").includes("backport")) {
        core.info(messages.backport);
        return
    }

    const pattern = exceptBranches.find((target) => target.match( (targetBranch).split("/")[0] ))
    if (pattern) {
        core.info(messages.exceptList);
    } else {
        getCommitsCount(sourceBranch, targetBranch)
            .then(currentCommitsCount => {
                if (currentCommitsCount > commitsCount) {
                    core.setFailed(messages.squash);
                }
            });
    }

} catch (error) {
    core.setFailed(error.message);
}

async function getCommitsCount(sourceBranch, targetBranch) {
    let out = '';
    let err = '';
    const options = {
        listeners: {
            stdout: (data) => {
                out += data.toString();
            },
            stderr: (data) => {
                err += data.toString();
            }
        },
    };
    core.info(src)
    await exec.exec(`${src}/commits-count.sh`, [sourceBranch, targetBranch], options);
    if (err) {
        core.setFailed(err);
    } else {
        return Number.parseInt(out.trim());
    }
}
