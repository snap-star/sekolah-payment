module.exports = {
  branches: ['main', 'master'],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
        releaseRules: [
          { type: 'feat', release: 'minor' },
          { type: 'feature', release: 'minor' },
          { type: 'fix', release: 'patch' },
          { type: 'bugfix', release: 'patch' },
          { type: 'docs', release: 'patch' },
          { type: 'style', release: false },
          { type: 'refactor', release: 'patch' },
          { type: 'perf', release: 'patch' },
          { type: 'test', release: false },
          { type: 'build', release: 'patch' },
          { type: 'ci', release: false },
          { type: 'chore', release: 'patch' }
        ]
      }
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        presetConfig: {
          types: [
            { type: 'feat', section: '✨ New Features' },
            { type: 'feature', section: '✨ New Features' },
            { type: 'fix', section: '🐛 Bug Fixes' },
            { type: 'bugfix', section: '🐛 Bug Fixes' },
            { type: 'docs', section: '📝 Documentation' },
            { type: 'style', section: '🎨 Styling' },
            { type: 'refactor', section: '🔨 Code Refactoring' },
            { type: 'perf', section: '⚡ Performance Improvements' },
            { type: 'test', section: '🧪 Tests' },
            { type: 'build', section: '🛠️ Build System' },
            { type: 'ci', section: '🔄 CI/CD' },
            { type: 'chore', section: '🧹 Maintenance' }
          ]
        }
      }
    ],
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'frontend/sekolahpay-frontend/CHANGELOG.md',
        changelogTitle: '# Changelog - SekolahPay School Management System\n\nAll notable changes to this project will be documented in this file.\n\nThe format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),\nand this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).'
      }
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: false,
        pkgRoot: 'frontend/sekolahpay-frontend'
      }
    ],
    [
      '@semantic-release/git',
      {
        assets: [
          'frontend/sekolahpay-frontend/CHANGELOG.md',
          'frontend/sekolahpay-frontend/package.json',
          'backend/sekolahpay_server/composer.json'
        ],
        message: 'chore(release): ${nextRelease.version}\n\n${nextRelease.notes}'
      }
    ],
    [
      '@semantic-release/github',
      {
        assets: [
          {
            path: 'frontend/sekolahpay-frontend/.next/standalone',
            label: 'frontend-standalone',
            name: 'sekolahpay-frontend-standalone-${nextRelease.version}.tar.gz'
          }
        ],
        releaseName: 'SekolahPay v${nextRelease.version}',
        draft: false,
        prerelease: false
      }
    ]
  ]
};