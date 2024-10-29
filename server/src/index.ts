import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000; 
import tripsRoute from './routes/trips'; 



app.use(cors());

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Yellow Taxi Trip API using Socrata');
});


app.use('/trips', tripsRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
