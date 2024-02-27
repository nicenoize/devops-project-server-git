# devops-project-server-git
The code is based on the predefined TODO app (https://github.com/lucendio/lecture-devops-app)

This repo contains the server. In order to deploy it to Kubernetes either push to the production branch,
in order to deploy the trigger, on manually deploy by running the trigger from GCP.

Before deployment to the Kubernetes Cluster, some small tests will be performed. As soon as they succeed,
the repository will be containerized and deployed to the Kubernetes cluster.

The server routes will be available under http://www.devops-tutorial.site/api/

Here is an example request:

 '''import axios from "axios";

const options = {
  method: 'POST',
  url: 'http://www.devops-tutorial.site/api/signup',
  headers: {'Content-Type': 'application/json'},
  data: {name: 'testUser4', email: 'testEmail5@mail.de', password: 'test123'}
};

axios.request(options).then(function (response) {
  console.log(response.data);
}).catch(function (error) {
  console.error(error);
});
'''

redeploy
