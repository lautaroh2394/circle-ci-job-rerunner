chrome.runtime.onMessage.addListener(async (message, sender, reply) => {
    debugger
    const token = await chrome.storage.sync.get("token");
    const {jobNumber, workflowId} = message
    const workflowJobs = await getWorkflowJobs(workflowId, token)
    const jobId = workflowJobs.find(job => job.number == jobNumber)
    const newWorkflowId = await createNewWorkflow(workflowId, jobId, token)
    return newWorkflowId
});

const getWorkflowJobs = async (workflowId, token)=>{
    const url = `https://circleci.com/api/v2/workflow/${workflowId}/job`
    const headers = new Headers()
    headers.append('Circle-Token', token)
    const res = await fetch(url, {method: 'get', headers})
    return (await res.json()).items
}

const createNewWorkflow = async (workflowId, jobId, token)=>{
    const url = `https://circleci.com/api/v2/workflow/${workflowId}/rerun`
    const headers = new Headers()
    headers.append('Circle-Token', token)
    headers.append('Content-Type', 'application/json')
    const body = {
        "enable_ssh": false,
        "from_failed": false,
        "jobs": [jobId],
        "sparse_tree": false
    }
    const res = await fetch(url, {method: 'post', headers, body})
    return (await res.json()).workflow_id
}