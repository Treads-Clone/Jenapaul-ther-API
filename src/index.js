import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config.js';
import cors from 'cors';

import v1 from './routes/v1/index.js';
import './core/database.js';
import morgan from 'morgan';

const app = express();
const port = process.env.PORT || 8080

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

app.use('/v1', cors() ,v1);

app.listen(port, () => console.log(`Server running on port: http://localhost:${port}`))

// import express from 'express';
// import bodyParser from 'body-parser';

// import v1 from './routes/v1/index.js';  // Ensure this is importing the correct index route
// import homeRouter from './routes/v1/homeRoutes.js';
// import accountRouter from './routes/v1/accountRoutes.js';
// import threadPostRouter from './routes/v1/threadpostRoutes.js';

// const app = express();
// const PORT = 3000;

// app.use(bodyParser.json());

// app.use('/v1', v1);  // Namespace v1 for version control

// // Enable other routers as needed
// // app.use('/', homeRouter);
// // app.use('/', accountRouter);

// // Mount threadpostRouter on a specific route
// app.use('/threads', threadPostRouter);

// app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));
