pipeline {
  agent {
    docker {
      image 'mcr.microsoft.com/playwright:v1.57.0-jammy'
      args '--ipc=host'
    }
  }

  triggers {
    cron('H 1 * * *')
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

    // 🧪 TEST emailext (sementara)
    stage('Email Test') {
      steps {
        emailext(
          to: 'brian.mbee@gmail.com',
          subject: 'TEST EMAIL FROM PIPELINE',
          body: 'Kalau ini masuk, berarti emailext BERFUNGSI'
        )
      }
    }
  }

  post {
    success {
      emailext(
        to: 'brian.mbee@gmail.com',
        subject: "✅ SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
        body: """
Build SUCCESS 🎉

Job     : ${env.JOB_NAME}
Build   : #${env.BUILD_NUMBER}
Git Ref : ${params.GIT_REF}

Console:
${env.BUILD_URL}console
"""
      )
    }

    failure {
      emailext(
        to: 'brian.mbee@gmail.com',
        subject: "❌ FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
        body: """
Build FAILED ❌

Job     : ${env.JOB_NAME}
Build   : #${env.BUILD_NUMBER}
Git Ref : ${params.GIT_REF}

${env.BUILD_URL}console
"""
      )
    }
  }
}