pipeline {
  agent {
    docker {
      image 'mcr.microsoft.com/playwright:v1.57.0-jammy'
      args '--ipc=host'
    }
  }

  stages {
    stage('Checkout') {
      steps {
        checkout([
          $class: 'GitSCM',
          branches: [[name: params.GIT_REF]],
          userRemoteConfigs: [[
            url: 'https://github.com/brianrotama/playwright-ci-demo'
          ]]
        ])
      }
    }

    stage('Test') {
      steps {
        sh 'npm ci'
        sh 'npx playwright test'
      }
    }
  }
}