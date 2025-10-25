import { Low } from 'lowdb'; import { JSONFile } from 'lowdb/node'; import { defaultData } from './schema.js';
import path from 'path'; import { fileURLToPath } from 'url'; const __dirname=path.dirname(fileURLToPath(import.meta.url));
const file=path.join(__dirname,'data.json'); const adapter=new JSONFile(file);
export const db=new Low(adapter, defaultData); await db.read(); db.data ||= structuredClone(defaultData); await db.write();