-- Initial Database Schema.
-- Run when database up

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.highways (
	"highwayId" uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
	"highwayName" varchar(50) NOT NULL,
	description varchar(50) NOT NULL,
	"createdAt" timestamp DEFAULT NOW() NOT NULL
);

CREATE TABLE public.observations (
	"observationId" uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	incident varchar(50),
	distance varchar(50),
	direction varchar(50),
	city varchar(50),
	"highwayId" uuid
);

INSERT INTO public.highways ("highwayId", "highwayName", description) VALUES('636b4c0f-4490-4213-ba53-db21b44c97b0'::uuid, 'BR-381', 'Rod. Fernão Dias');
INSERT INTO public.highways ("highwayId", "highwayName", description) VALUES('f65de111-18d2-4cfc-b367-80d208748490'::uuid, 'MG-459', 'Rod. Juscelino Kubitschek de Oliveira');
INSERT INTO public.highways ("highwayId", "highwayName", description) VALUES('e22c2e51-ed9f-4e7e-9c2b-e2afa0ad3003'::uuid, 'BR-116', 'Rod. Presidente Dutra');
