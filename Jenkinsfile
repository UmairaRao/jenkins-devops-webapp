pipeline {
    agent any

    environment {
        SELENIUM_IMAGE = 'jenkins-devops-selenium-tests'
        COMPOSE_PROJECT_NAME = 'jenkins-devops-webapp'
    }

    stages {
        stage('Code Build') {
            steps {
                checkout scm
                sh 'npm install'
            }
        }

        stage('Unit Testing') {
            steps {
                sh 'npm test'
            }
        }

        stage('Containerized Deployment') {
            steps {
                sh 'docker-compose down || true'
                sh 'docker-compose up --build -d'
                sh 'docker ps'
            }
        }

        stage('Containerized Selenium Testing') {
            steps {
                sh 'docker build -t $SELENIUM_IMAGE -f selenium/Dockerfile selenium'
                sh 'docker rm -f selenium-chrome || true'
                sh 'docker run -d --name selenium-chrome --network ${COMPOSE_PROJECT_NAME}_default selenium/standalone-chrome:latest'
                sh 'sleep 15'
                sh 'docker run --rm --network ${COMPOSE_PROJECT_NAME}_default -e APP_URL=http://webapp:3000 -e SELENIUM_REMOTE_URL=http://selenium-chrome:4444/wd/hub $SELENIUM_IMAGE'
            }
        }
    }

    post {
        always {
            sh 'docker rm -f selenium-chrome || true'
            sh 'docker-compose ps || true'
        }
    }
}
