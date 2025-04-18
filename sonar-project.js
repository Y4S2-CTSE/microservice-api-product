const sonarqubeScanner = require('sonarqube-scanner').customScanner;

sonarqubeScanner({
  serverUrl: 'http://localhost:9000',
  token: process.env.SONAR_TOKEN,
  options: {
    'sonar.projectKey': 'microservice-api-product',
    'sonar.projectName': 'Product Microservice',
    'sonar.projectVersion': '1.0.0',
    'sonar.sources': '.',
    'sonar.exclusions': '**/node_modules/**,**/*.test.js',
    'sonar.test.inclusions': '**/*.test.js',
    'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
    'sonar.sourceEncoding': 'UTF-8'
  }
}, () => {
  console.log('Sonar analysis completed');
});