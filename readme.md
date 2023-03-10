# Circle CI Job rerunner
![rerun button](assets/rerun_job_button.png)

This is a simple extension for Chrome that adds a button in CircleCI UI to easily rerun a job using the API.
Due to CORS restrictions we need to make the API calls from the site `circleci.com` (not `app.circleci.com`), thats why when clicking the new button a tab for `circleci.com/...` is opened.

---
### How to install
 1- Download this repo

 2- Go to Chrome settings, select the extensions menu
 
 ![extensions menu](assets/install_1.png)

 3- You will be redirected to the extensions page. On the right upper corner set the developer mode}

 ![developer mode](assets/install_2.png)
 
 4- You can load de extension selecting this option. Just choose the folder that contains this repo.

 ![developer mode](assets/install_3.png)

---
### How to configure
You need to configure your personal api token. You can follow this [guide](https://circleci.com/docs/managing-api-tokens/#creating-a-personal-api-token) to get it

To configure it you just right click the extension in the toolbar, select 'options' and input it:
![click extension options ](assets/save_token_1.png)
![click options ](assets/save_token_2.png)
![input token](assets/save_token_3.png)

---
### TODO's:
 - `app.circleci.com` is a SPA and the extension does not register, for example, when we change from the pipelines view to a particular job's view. The temporary fix is to just reload the page.
 - Refactor code to be more readable
 - Publish to the chrome web store