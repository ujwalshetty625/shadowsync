pipeline {
  agent any

  options {
    timestamps()
  }

  environment {
    REGISTRY = "docker.io"
    REPO_PREFIX = "your-dockerhub-username/shadowsync"
    IMAGE_TAG = "${env.BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Docker Images') {
      steps {
        sh 'docker build -t $REPO_PREFIX-proxy:$IMAGE_TAG ./proxy'
        sh 'docker build -t $REPO_PREFIX-main-app:$IMAGE_TAG ./main-app'
        sh 'docker build -t $REPO_PREFIX-shadow-app:$IMAGE_TAG ./shadow-app'
        sh 'docker build -t $REPO_PREFIX-dashboard:$IMAGE_TAG ./dashboard'
      }
    }

    stage('Show Docker Images') {
      steps {
        sh 'docker images | grep shadowsync || true'
      }
    }

    stage('Run Containers Smoke Test') {
      steps {
        sh 'docker compose down || true'
        sh 'docker compose up -d --build'
        sh 'sleep 10'
        sh 'curl -f http://localhost:3000/health'
        sh 'curl -f http://localhost:5173'
      }
    }

    stage('Push Images (Optional)') {
      when {
        expression { return env.DOCKER_PUSH == 'true' }
      }
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
          sh 'docker push $REPO_PREFIX-proxy:$IMAGE_TAG'
          sh 'docker push $REPO_PREFIX-main-app:$IMAGE_TAG'
          sh 'docker push $REPO_PREFIX-shadow-app:$IMAGE_TAG'
          sh 'docker push $REPO_PREFIX-dashboard:$IMAGE_TAG'
        }
      }
    }

    stage('Deploy to Minikube (Optional)') {
      when {
        expression { return env.K8S_DEPLOY == 'true' }
      }
      steps {
        sh 'kubectl apply -f k8s/Deployment.yaml'
        sh 'kubectl apply -f k8s/Service.yaml'
        sh 'kubectl get pods'
        sh 'kubectl get services'
      }
    }
  }

  post {
    always {
      sh 'docker compose down || true'
    }
  }
}
