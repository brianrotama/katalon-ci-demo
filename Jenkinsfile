pipeline {
  agent {
    docker {
      image 'image mcr.microsoft.com/playwright:v1.57.0-jammy'
      args '--ipc=host'
    }
  }

  environment {
    GSHEET_URL = credentials('GSHEET_URL')
  }

  stages {
    stage('Clean Workspace') {
      steps {
        deleteDir()
      }
    }

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Run Playwright Tests') {
      steps {
        sh 'npx playwright test'
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true
    }
  }
}