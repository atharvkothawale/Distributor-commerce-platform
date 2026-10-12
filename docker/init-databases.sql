-- Initialize isolated databases for microservices
CREATE DATABASE commerce_auth;
CREATE DATABASE commerce_catalog;
CREATE DATABASE commerce_orders;

GRANT ALL PRIVILEGES ON DATABASE commerce_auth TO postgres;
GRANT ALL PRIVILEGES ON DATABASE commerce_catalog TO postgres;
GRANT ALL PRIVILEGES ON DATABASE commerce_orders TO postgres;
