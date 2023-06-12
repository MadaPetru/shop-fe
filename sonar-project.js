const sonarqubeScanner = require('sonarqube-scanner');
sonarqubeScanner({
  serverUrl: 'http://192.168.0.106:9000',
  options : {
    'sonar.sources': '.',
    'sonar.inclusions' : './src/**', // Entry point of your code
    'sonar.token':'sqp_0dee97caca965cf5c3c2c24fe35ff324dd8907e4',
    'sonar.projectKey':'Gorrila-shop-fe'
  }
}, () => {});
