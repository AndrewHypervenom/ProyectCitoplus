PGDMP  "    %    
            |            dbsofcitusplus    16.3    16.3     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    69304    dbsofcitusplus    DATABASE     �   CREATE DATABASE dbsofcitusplus WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Colombia.1252';
    DROP DATABASE dbsofcitusplus;
                devsofcitusplus    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                pg_database_owner    false            �           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                   pg_database_owner    false    4            �            1259    69332    usuarios    TABLE     s  CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre_usuario character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    fecha_creacion timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso timestamp with time zone,
    estado boolean DEFAULT true,
    rol character varying(20) DEFAULT 'usuario'::character varying
);
    DROP TABLE public.usuarios;
       public         heap    postgres    false    4            �            1259    69331    usuarios_id_seq    SEQUENCE     �   CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.usuarios_id_seq;
       public          postgres    false    216    4            �           0    0    usuarios_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;
          public          postgres    false    215            �            1259    69363 
   visitantes    TABLE     5  CREATE TABLE public.visitantes (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    numero_identificacion character varying(50) NOT NULL,
    fecha_visita timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_salida timestamp with time zone,
    motivo character varying(255) NOT NULL,
    estado character varying(20) DEFAULT 'pendiente'::character varying,
    creado_por integer,
    CONSTRAINT chk_estado CHECK (((estado)::text = ANY ((ARRAY['pendiente'::character varying, 'autorizado'::character varying, 'en_progreso'::character varying, 'finalizado'::character varying, 'rechazado'::character varying, 'cancelado'::character varying, 'expirado'::character varying, 'bloqueado'::character varying, 'reprogramado'::character varying, 'sin_confirmar'::character varying])::text[])))
);
    DROP TABLE public.visitantes;
       public         heap    postgres    false    4            �            1259    69362    visitantes_id_seq    SEQUENCE     �   CREATE SEQUENCE public.visitantes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.visitantes_id_seq;
       public          postgres    false    218    4            �           0    0    visitantes_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.visitantes_id_seq OWNED BY public.visitantes.id;
          public          postgres    false    217                       2604    69335    usuarios id    DEFAULT     j   ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);
 :   ALTER TABLE public.usuarios ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    215    216            #           2604    69366    visitantes id    DEFAULT     n   ALTER TABLE ONLY public.visitantes ALTER COLUMN id SET DEFAULT nextval('public.visitantes_id_seq'::regclass);
 <   ALTER TABLE public.visitantes ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    217    218            �          0    69332    usuarios 
   TABLE DATA           l   COPY public.usuarios (id, nombre_usuario, password, fecha_creacion, ultimo_acceso, estado, rol) FROM stdin;
    public          postgres    false    216   �       �          0    69363 
   visitantes 
   TABLE DATA              COPY public.visitantes (id, nombre, numero_identificacion, fecha_visita, fecha_salida, motivo, estado, creado_por) FROM stdin;
    public          postgres    false    218          �           0    0    usuarios_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.usuarios_id_seq', 11, true);
          public          postgres    false    215            �           0    0    visitantes_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.visitantes_id_seq', 5, true);
          public          postgres    false    217            )           2606    69341 $   usuarios usuarios_nombre_usuario_key 
   CONSTRAINT     i   ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_nombre_usuario_key UNIQUE (nombre_usuario);
 N   ALTER TABLE ONLY public.usuarios DROP CONSTRAINT usuarios_nombre_usuario_key;
       public            postgres    false    216            +           2606    69339    usuarios usuarios_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.usuarios DROP CONSTRAINT usuarios_pkey;
       public            postgres    false    216            /           2606    69371    visitantes visitantes_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.visitantes
    ADD CONSTRAINT visitantes_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.visitantes DROP CONSTRAINT visitantes_pkey;
       public            postgres    false    218            '           1259    69380    idx_usuarios_rol    INDEX     D   CREATE INDEX idx_usuarios_rol ON public.usuarios USING btree (rol);
 $   DROP INDEX public.idx_usuarios_rol;
       public            postgres    false    216            ,           1259    69379    idx_visitantes_creado_por    INDEX     V   CREATE INDEX idx_visitantes_creado_por ON public.visitantes USING btree (creado_por);
 -   DROP INDEX public.idx_visitantes_creado_por;
       public            postgres    false    218            -           1259    69378    idx_visitantes_estado    INDEX     N   CREATE INDEX idx_visitantes_estado ON public.visitantes USING btree (estado);
 )   DROP INDEX public.idx_visitantes_estado;
       public            postgres    false    218            0           2606    69372 %   visitantes visitantes_creado_por_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.visitantes
    ADD CONSTRAINT visitantes_creado_por_fkey FOREIGN KEY (creado_por) REFERENCES public.usuarios(id);
 O   ALTER TABLE ONLY public.visitantes DROP CONSTRAINT visitantes_creado_por_fkey;
       public          postgres    false    218    216    4651            �   "  x�]��n�PE���z=��{ÿ́j�J51j��Ri�H�|}1-i�x�Z� >��ҧ���^1]kߵ��>i�����܉�|���k�ܾH�nW��B@b�4 �C�$X�	�@������%5��a��돀��TerA�˲�ϛI�9a�R��f�D~B�����|�m����WǅLO��x��.LCЅ��v3e�r����*)A_���{�������"�W�J>¹W:3gc�vd٪�dϥ����i����_<Z°�����!���5�q����\vLU�oG"h�      �   #  x���1N1Ek�)|��<���u�"����#�ac���9EnDA�#���I
B�RM���|���/�w����k4*	L
����8�5*ۀ��7�N`��Kzs�a��u;��r`P)6��[>�g R*�x�L�Xl[(�b�1���y`�wo�?���(���3�T��m��-ؓ��0"_z�����||ޤa����5��+߇�
�P[q�'�i]7BJ���_��.)��"��U*sQ�q �Zck[s���uZ8�k!l����!_�e)�"�'��uUUߵ%~�     