import { MongoClient } from "../../../deps.ts";
import log from "./logger.ts";
import settings from "./settings.ts";

const { dbName, mongoUrl } = settings;

/**
 * Reusable database connection
 */
class Database {
  public client: MongoClient;
  constructor(public dbName: string, public url: string) {
    this.dbName = dbName;
    this.url = url;
    this.client = {} as MongoClient;
  }
  connect() {
    log.info("Database connecting...");
    const client = new MongoClient();
    client.connectWithUri(this.url);
    this.client = client;
    log.info("Database connected!");
  }
  get getDatabase() {
    return this.client.database(this.dbName);
  }
}

const db = new Database(dbName, mongoUrl);
db.connect();

export default db;
