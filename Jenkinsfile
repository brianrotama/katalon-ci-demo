pipeline {
  agent {
    docker {
      image 'mcr.microsoft.com/playwright:v1.57.0-jammy'
      args '--ipc=host'
    }
  }

  environment {
    GSHEET_URL = credentials('GSHEET_URL')
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

    stage('Debug ENV') {
      steps {
        sh '''
          echo "GSHEET_URL=$GSHEET_URL"
        '''
      }
    }

    stage('Install & Test') {
      steps {
        sh 'npm ci'
        sh 'npx playwright test'
      }
    }
  }
}