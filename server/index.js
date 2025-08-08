const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
