pipeline {
  agent {
    docker {
      image 'mcr.microsoft.com/playwright:v1.42.0-jammy'
      args '--ipc=host'
    }
  }

  environment {
    GSHEET_URL = credentials('GSHEET_URL')
  }

  stages {
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