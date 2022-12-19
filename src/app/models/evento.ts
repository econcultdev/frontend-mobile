export interface Evento {
    id: string;
    nombre: string;
    imagen: any[];
    imgUrl: string;
    fecha_inicio: Date;
    hora : string;
    aforo: string;
    direccion: string;
    precio:string;
    gratuito:boolean;
    resumen: string;
    link_externo: string;
    produccion: string;
    participantes: string;
    activo:boolean;
    createdAt: Date;
    updatedAt; Date;
    User:number;
    TipoEventoId:number;
    PaisId:number;
    ProvinciaId:number;
    CiudadId:number;
    weighted_tsv_search:string; //" tsvector,
    nombre_multi: JSON;
    direccion_multi: JSON;
    resumen_multi: JSON;
    produccion_multi: JSON;
    participantes_multi:JSON;
    like: boolean;

}
/*
"id" int4 NOT NULL DEFAULT nextval('"Eventos_id_seq"'::regclass),
  "nombre" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "imagen" text COLLATE "pg_catalog"."default",
  "fecha_inicio" timestamptz(6) NOT NULL,
  "fecha_fin" timestamptz(6) NOT NULL,
  "hora" varchar(100) COLLATE "pg_catalog"."default",
  "aforo" varchar(100) COLLATE "pg_catalog"."default",
  "direccion" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "precio" varchar(100) COLLATE "pg_catalog"."default",
  "gratuito" bool NOT NULL DEFAULT false,
  "resumen" text COLLATE "pg_catalog"."default",
  "link_externo" varchar(255) COLLATE "pg_catalog"."default",
  "produccion" text COLLATE "pg_catalog"."default",
  "participantes" text COLLATE "pg_catalog"."default",
  "activo" bool NOT NULL DEFAULT false,
  "createdAt" timestamptz(6) NOT NULL DEFAULT now(),
  "updatedAt" timestamptz(6) NOT NULL DEFAULT now(),
  "UserId" int4,
  "TipoEventoId" int4,
  "PaisId" int4,
  "ProvinciaId" int4,
  "CiudadId" int4,
  "weighted_tsv_search" tsvector,
  "nombre_multi" jsonb,
  "direccion_multi" jsonb,
  "resumen_multi" jsonb,
  "produccion_multi" jsonb,
  "participantes_multi" jsonb,
  */