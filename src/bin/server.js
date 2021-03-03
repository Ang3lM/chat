const app = require('../app.js');

app.set('port', process.env.PORT || 3000);
console.log(app.get('port'));

app.listen(app.get('port'), () => console.log(`Server running on http://localhost:${app.get('port')}`));