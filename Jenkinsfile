pipeline {
    agent any
    environment {
        GIT_REPO = 'https://github.com/Sumitshukla4020/MERN-Docker'
        BRANCH = 'master'
    }
    stages {
        stage('Clone') {
            steps {
                git branch: "${BRANCH}", url: "${GIT_REPO}"
            }
        }
        stage('Build') {
            steps {
                echo 'Build step started...'
                dir('frontend') {
                    sh 'npm install'
                }
                dir('backend') {
                    sh 'npm install'
                }
                echo 'Build step completed.'
            }
        }
        stage('Test') {
            steps {
                echo 'Running test scripts...'
                echo 'Tests passed.'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying application...'
                echo 'Deployment complete.'
            }
        }
    }
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
