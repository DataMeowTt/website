import dotenv from 'dotenv';
import path from 'path';
import { app } from '../../index.js';
import * as db from './db.js';
import supertest from 'supertest';
import http from 'http';

export default async function setup() {
  console.log('--- Global Setup ---');
  dotenv.config({ path: path.join(process.cwd(), '.env.test') });
  console.log("Đây là path", path.join(process.cwd(), '.env.test'));

  await db.connect();

  const port = process.env.PORT; 
  const server = http.createServer(app);

  await new Promise(resolve => {
    server.listen(port, () => {
      console.log(`Test: Server chạy trên cổng ${port}`);
      resolve();
    });
  });

  global.__TEST_SERVER__ = server;
  global.request = supertest(app);
}