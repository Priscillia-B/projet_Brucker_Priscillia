export interface DatabaseConfig {
  host: string;
  port: string;
  user: string;
  password: string;
  bdname: string;
}

export interface AppConfig {
  BDD: DatabaseConfig;
}

// Poussé sur github car pas important dans notre cas, mais normalement à ne pas faire (validé par le prof)
export const config: AppConfig = {
  BDD: {
    host: process.env.DB_HOST || "dpg-dbhlsh8n74is73edab2g-a.oregon-postgres.render.com",
    port: process.env.DB_PORT || "5432",
    user: process.env.DB_USER || "pollution_user",
    password: process.env.DB_PASSWORD || "BTtnhV8fWIFqmmMKyGV15WtVlxG5vrFn",
    bdname: process.env.DB_NAME || "pollution_db_stzv"
  }
};

export const { BDD } = config;
export default config;
