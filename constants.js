
var constants = {}

if(process.env.OPENSHIFT_APP_NAME){
  constants['url']  = 'mongodb://admin:JztGeYL2fzkX@557876a44382eca1f0000188-menmeni.rhcloud.com:58516/ninja';
  constants['port'] = process.env.OPENSHIFT_NODEJS_PORT
  constants['ip'] =  process.env.OPENSHIFT_NODEJS_IP
}
else{
	constants['url'] = 'mongodb://localhost:27017/ninja';
	constants['port'] = 8000;
	constants['ip'] = "localhost";
}

module.exports = constants;