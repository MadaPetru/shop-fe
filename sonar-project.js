const sonarqubeScanner = require('sonarqube-scanner');
sonarqubeScanner({
  serverUrl: 'http://192.168.0.106:9000',
  options : {
    'sonar.sources': '.',
    'sonar.inclusions' : './src/**', // Entry point of your code
    'sonar.login':'admin',
    'sonar.password':'password',
    'sonar.projectKey':'Gorrila-shop-fe'
  }
}, () => {});
