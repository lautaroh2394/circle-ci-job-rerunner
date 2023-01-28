let container = document.querySelector(".css-1p4cmro")
const interval = setInterval(()=>{
    if (container){
        clearInterval(interval)
        addButton()
        return
    }
    container = document.querySelector(".css-1p4cmro")
}, 2000)

const addButton = ()=>{
    const divHtml = '<button aria-label="Rerun job" title="Rerun job" id="rerunJobButton" class="css-mexut9"><span>Rerun job</span></button>'
    const div = document.createElement('div')
    div.setHTML(divHtml)
    container.appendChild(div)

    const rerunJobButton = document.getElementById('rerunJobButton')
    rerunJobButton.addEventListener("click", async () => {
        const {token} = await chrome.storage.sync.get("token");
        const data = {...getDataFromUrl(), token, originUrl: window.location.href}
        open(`https://circleci.com/extension-job-rerun-2023-123456789?${JSON.stringify(data)}`)
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