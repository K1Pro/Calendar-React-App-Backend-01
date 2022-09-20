const app = require('./app')
const port = process.env.PORT || 8000;

app.listen(port, () => console.log("Barts server is running on port 8000"));
