node('dind-slave')  {
    def app

    stage('Clone repository') {
        /* Let's make sure we have the repository cloned to our workspace */

        checkout scm
    }

    stage('Build image') {
        /* This builds the actual image; synonymous to
         * docker build on the command line */

        app = docker.build("cmua/avartus:latest")
    }

    stage('Test image') {
        /* Ideally, we would run a test framework against our image.
         * For this example, we're using a Volkswagen-type approach ;-) */

        app.inside {
            sh 'echo "Tests passed"'
        }
    }

    stage('Push image') {
        /* Finally, we'll push the image with two tags:
         * First, the incremental build number from Jenkins
         * Second, the 'latest' tag.
         * Pushing multiple tags is cheap, as all the layers are reused. */
        docker.withRegistry('https://registry.cmu.edu.au', 'registryCredential') {
            app.push("${env.BUILD_NUMBER}")
            app.push("web")
        }
    }

    stage('Cleanup') {
        sh "for i in `docker ps -aq -f status=exited`; do docker rm -v \$i; done"
        sh "docker rmi \$(docker images -f dangling=true -q)"
    }

    def remote = [:]
    remote.name = 'k8s'
    remote.host = '192.168.68.85'
    remote.allowAnyHosts = true
    /* SSH to the kubernetes control plan, delete the pods, let the pos restart by k8s with new image
      https://github.com/jenkinsci/ssh-steps-plugin/blob/master/README.adoc
    */
    withCredentials([sshUserPrivateKey(credentialsId: 'coreos', keyFileVariable: 'identity', passphraseVariable: '', usernameVariable: 'userName')]) {
        remote.user = userName
        remote.identityFile = identity
        stage("'K8s'") {
            sshCommand remote: remote, command: '''/opt/bin/kubectl delete pods \$(/opt/bin/kubectl get pods | grep "avartus-web" | awk '{ print \$1 }')'''
            // writeFile file: 'k8s.sh', text: '''/opt/bin/kubectl delete pods \$(/opt/bin/kubectl get pods | grep "avartus-web" | awk '{ print $1 }')'''
            // sshScript remote: remote, script: "k8s.sh"
        }
    }
}
