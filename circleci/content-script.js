const getJobUrl = async (workflowId, jobNumber, newWorkflowId, originUrl, token)=>{
    const workflowJobs = await getWorkflowJobs(workflowId, token)
    const oldJob = workflowJobs.find(job => job.job_number == jobNumber)
    const newWorkflowJobs = await getWorkflowJobs(newWorkflowId, token)
    const newJobNumber = newWorkflowJobs.find(job => job.name == oldJob.name).job_number
    
    let url = originUrl
    let index = url.match(/\/workflows/).index
    url = url.substring(0, index)
    url += `/workflows/${workflowId}/jobs/${newJobNumber}`
    return url
}

const getDataFromUrl = ()=>{
    let params = decodeURI(window.location.href.split('?')[1])
    return JSON.parse(params)
}

const newWorkflowForJob = async (workflowId, jobNumber, token)=>{
    const workflowJobs = await getWorkflowJobs(workflowId, token)
    const jobId = workflowJobs.find(job => job.job_number == jobNumber).id
    const newWorkflowId = await createNewWorkflow(workflowId, jobId, token)
    return newWorkflowId
}

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
    const res = await fetch(url, {method: 'post', headers, body: JSON.stringify(body)})
    return (await res.json()).workflow_id
}
document.body.setHTML('Loading...')
document.onreadystatechange = async ()=>{
    const {workflowId, jobNumber, token, originUrl} = getDataFromUrl()
    const newWorkflowId = await newWorkflowForJob(workflowId, jobNumber, token);
    const jobUrl = await getJobUrl(workflowId, jobNumber, newWorkflowId, originUrl)
    window.location.href = jobUrl
}