debugger
const APP_CIRCLE_CI_URL = 'app.circleci.com'
const isCircleCIApp = ()=>{
    return window.location.host == APP_CIRCLE_CI_URL
}

if (isCircleCIApp()){
    // Logic for button
    let container = document.querySelector(".css-1p4cmro")
    const interval = setInterval(async ()=>{
        if (container){
            clearInterval(interval)
            await addButton()
            return
        }
        container = document.querySelector(".css-1p4cmro")
    }, 500)

    const addButton = ()=>{
        const divHtml = '<button aria-label="Rerun job" title="Rerun job" id="rerunJobButton" class="css-mexut9"><span>Rerun job</span></button>'
        const div = document.createElement('div')
        div.setHTML(divHtml)
        container.appendChild(div)

        const rerunJobButton = document.getElementById('rerunJobButton')
        rerunJobButton.addEventListener("click", async () => {
            const {token} = await chrome.storage.sync.get("token");
            const data = {...getDataFromUrl(), token, originUrl: window.location.href}
            await chrome.storage.sync.set(data)
            open(`https://circleci.com/extension-job-rerun-2023`)
        });
    }

    const getDataFromUrl = ()=>{
        let url = window.location.href
        const splitted = url.split('/')
        const jobNumber = splitted.at(-1)
        const workflowId = splitted.at(-3)
        return {
            workflowId, jobNumber
        }
    }
}

if (!isCircleCIApp()){
    // Logic for API calls
    const getJobUrl = async (workflowId, jobNumber, newWorkflowId, originUrl, token)=>{
        const workflowJobs = await getWorkflowJobs(workflowId, token)
        const oldJob = workflowJobs.find(job => job.job_number == jobNumber)
        const newWorkflowJobs = await getWorkflowJobs(newWorkflowId, token)
        const newJobNumber = newWorkflowJobs.find(job => job.name == oldJob.name).job_number
        
        let url = originUrl
        let index = url.match(/\/workflows/).index
        url = url.substring(0, index)
        url += `/workflows/${newWorkflowId}/jobs/${newJobNumber}`
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
        const {workflowId, jobNumber, token, originUrl} = await chrome.storage.sync.get(["workflowId", "jobNumber", "token", "originUrl"])
        const newWorkflowId = await newWorkflowForJob(workflowId, jobNumber, token);
        const jobUrl = await getJobUrl(workflowId, jobNumber, newWorkflowId, originUrl)
        window.location.href = jobUrl
    }
}