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
    GSHEET_WEBHOOK_URL = credentials('GSHEET_WEBHOOK_URL')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout([
          $class: 'GitSCM',
          branches: [[name: params.GIT_REF]],
          userRemoteConfigs: [[
            url: 'https://github.com/brianrotama/playwright-ci-demo'
          ]],
          extensions: [[
            $class: 'CloneOption',
            shallow: false,
            noTags: false
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