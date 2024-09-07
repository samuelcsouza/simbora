-- public.device definition

-- Drop table

-- DROP TABLE public.device;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE public.device (
	"deviceId" uuid DEFAULT uuid_generate_v4() NOT NULL,
	"deviceName" varchar(50) NOT NULL,
	description varchar(500) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "PK_6fe2df6e1c34fc6c18c786ca26e" PRIMARY KEY ("deviceId")
);

create table public.observation (
	"observationId" uuid default uuid_generate_v4() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	value varchar(255),
	variable varchar(255),
	unit varchar(255),
	"deviceId" uuid,
	primary key ("observationId")
);

INSERT INTO public.device ("deviceId", "deviceName", description) VALUES('636b4c0f-4490-4213-ba53-db21b44c97b0'::uuid, 'device 1', 'device 1 description kkkk');
INSERT INTO public.device ("deviceId", "deviceName", description) VALUES('f65de111-18d2-4cfc-b367-80d208748490'::uuid, 'device 2', 'device 2 description kkkk');
INSERT INTO public.device ("deviceId", "deviceName", description) VALUES('e22c2e51-ed9f-4e7e-9c2b-e2afa0ad3003'::uuid, 'device 3', 'device 3 description kkkk');
