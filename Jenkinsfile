pipeline {
  agent {
    docker {
      image 'mcr.microsoft.com/playwright:v1.57.0-jammy'
      args '--ipc=host'
    }
  }

  parameters {
    gitParameter(
      name: 'GIT_REF',
      type: 'PT_BRANCH_TAG',
      defaultValue: 'origin/main',
      branchFilter: 'origin/.*',
      tagFilter: 'v.*',
      sortMode: 'DESCENDING'
    )
  }

  environment {
    GSHEET_URL = credentials('GSHEET_URL')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
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