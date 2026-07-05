--
-- PostgreSQL database dump
--

\restrict Ac5gnRaWRZ10LyDebVndC8hh3C09mlUvJOuZSfF1YfrsYvgeRLsjrrK5zkicmr9

-- Dumped from database version 17.7 (Ubuntu 17.7-0ubuntu0.25.04.1)
-- Dumped by pg_dump version 17.7 (Ubuntu 17.7-0ubuntu0.25.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.portfolio_items DROP CONSTRAINT IF EXISTS portfolio_items_service_id_fkey;
ALTER TABLE IF EXISTS ONLY public.otp_codes DROP CONSTRAINT IF EXISTS otp_codes_admin_id_fkey;
ALTER TABLE IF EXISTS ONLY public.content_backups DROP CONSTRAINT IF EXISTS content_backups_admin_id_fkey;
ALTER TABLE IF EXISTS ONLY public.admins DROP CONSTRAINT IF EXISTS admins_created_by_admin_id_fkey;
DROP INDEX IF EXISTS public.ix_testimonials_order_index;
DROP INDEX IF EXISTS public.ix_team_members_order_index;
DROP INDEX IF EXISTS public.ix_services_order_index;
DROP INDEX IF EXISTS public.ix_portfolio_items_order_index;
DROP INDEX IF EXISTS public.ix_page_heroes_page_key;
DROP INDEX IF EXISTS public.ix_otp_codes_admin_id;
DROP INDEX IF EXISTS public.ix_hero_images_order_index;
DROP INDEX IF EXISTS public.ix_gallery_items_order_index;
DROP INDEX IF EXISTS public.ix_clients_order_index;
DROP INDEX IF EXISTS public.ix_client_logos_order_index;
DROP INDEX IF EXISTS public.ix_admins_email;
DROP INDEX IF EXISTS public.ix_about_stats_order_index;
DROP INDEX IF EXISTS public.ix_about_chips_order_index;
ALTER TABLE IF EXISTS ONLY public.visit_counter DROP CONSTRAINT IF EXISTS visit_counter_pkey;
ALTER TABLE IF EXISTS ONLY public.testimonials DROP CONSTRAINT IF EXISTS testimonials_pkey;
ALTER TABLE IF EXISTS ONLY public.team_members DROP CONSTRAINT IF EXISTS team_members_pkey;
ALTER TABLE IF EXISTS ONLY public.services DROP CONSTRAINT IF EXISTS services_pkey;
ALTER TABLE IF EXISTS ONLY public.portfolio_items DROP CONSTRAINT IF EXISTS portfolio_items_pkey;
ALTER TABLE IF EXISTS ONLY public.page_heroes DROP CONSTRAINT IF EXISTS page_heroes_pkey;
ALTER TABLE IF EXISTS ONLY public.otp_codes DROP CONSTRAINT IF EXISTS otp_codes_pkey;
ALTER TABLE IF EXISTS ONLY public.hero_settings DROP CONSTRAINT IF EXISTS hero_settings_pkey;
ALTER TABLE IF EXISTS ONLY public.hero_images DROP CONSTRAINT IF EXISTS hero_images_pkey;
ALTER TABLE IF EXISTS ONLY public.gallery_items DROP CONSTRAINT IF EXISTS gallery_items_pkey;
ALTER TABLE IF EXISTS ONLY public.content_backups DROP CONSTRAINT IF EXISTS content_backups_pkey;
ALTER TABLE IF EXISTS ONLY public.contact_messages DROP CONSTRAINT IF EXISTS contact_messages_pkey;
ALTER TABLE IF EXISTS ONLY public.contact_info_settings DROP CONSTRAINT IF EXISTS contact_info_settings_pkey;
ALTER TABLE IF EXISTS ONLY public.clients_settings DROP CONSTRAINT IF EXISTS clients_settings_pkey;
ALTER TABLE IF EXISTS ONLY public.clients DROP CONSTRAINT IF EXISTS clients_pkey;
ALTER TABLE IF EXISTS ONLY public.client_logos DROP CONSTRAINT IF EXISTS client_logos_pkey;
ALTER TABLE IF EXISTS ONLY public.alembic_version DROP CONSTRAINT IF EXISTS alembic_version_pkc;
ALTER TABLE IF EXISTS ONLY public.admins DROP CONSTRAINT IF EXISTS admins_pkey;
ALTER TABLE IF EXISTS ONLY public.about_stats DROP CONSTRAINT IF EXISTS about_stats_pkey;
ALTER TABLE IF EXISTS ONLY public.about_settings DROP CONSTRAINT IF EXISTS about_settings_pkey;
ALTER TABLE IF EXISTS ONLY public.about_chips DROP CONSTRAINT IF EXISTS about_chips_pkey;
ALTER TABLE IF EXISTS public.visit_counter ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.hero_settings ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.contact_info_settings ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.clients_settings ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.about_settings ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.visit_counter_id_seq;
DROP TABLE IF EXISTS public.visit_counter;
DROP TABLE IF EXISTS public.testimonials;
DROP TABLE IF EXISTS public.team_members;
DROP TABLE IF EXISTS public.services;
DROP TABLE IF EXISTS public.portfolio_items;
DROP TABLE IF EXISTS public.page_heroes;
DROP TABLE IF EXISTS public.otp_codes;
DROP SEQUENCE IF EXISTS public.hero_settings_id_seq;
DROP TABLE IF EXISTS public.hero_settings;
DROP TABLE IF EXISTS public.hero_images;
DROP TABLE IF EXISTS public.gallery_items;
DROP TABLE IF EXISTS public.content_backups;
DROP TABLE IF EXISTS public.contact_messages;
DROP SEQUENCE IF EXISTS public.contact_info_settings_id_seq;
DROP TABLE IF EXISTS public.contact_info_settings;
DROP SEQUENCE IF EXISTS public.clients_settings_id_seq;
DROP TABLE IF EXISTS public.clients_settings;
DROP TABLE IF EXISTS public.clients;
DROP TABLE IF EXISTS public.client_logos;
DROP TABLE IF EXISTS public.alembic_version;
DROP TABLE IF EXISTS public.admins;
DROP TABLE IF EXISTS public.about_stats;
DROP SEQUENCE IF EXISTS public.about_settings_id_seq;
DROP TABLE IF EXISTS public.about_settings;
DROP TABLE IF EXISTS public.about_chips;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: about_chips; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.about_chips (
    id uuid NOT NULL,
    text character varying(255) NOT NULL,
    order_index integer NOT NULL
);


--
-- Name: about_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.about_settings (
    id integer NOT NULL,
    heading character varying(255) NOT NULL,
    body text NOT NULL,
    history text,
    mission text,
    vision text,
    value text,
    image1 character varying(1024),
    image2 character varying(1024),
    image3 character varying(1024),
    image4 character varying(1024),
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: about_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.about_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: about_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.about_settings_id_seq OWNED BY public.about_settings.id;


--
-- Name: about_stats; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.about_stats (
    id uuid NOT NULL,
    value character varying(64) NOT NULL,
    label character varying(255) NOT NULL,
    order_index integer NOT NULL
);


--
-- Name: admins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admins (
    id uuid NOT NULL,
    email character varying(255) NOT NULL,
    hashed_password character varying(255) NOT NULL,
    full_name character varying(255),
    is_active boolean NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by_admin_id uuid,
    last_login_at timestamp with time zone
);


--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


--
-- Name: client_logos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.client_logos (
    id uuid NOT NULL,
    logo_url character varying(1024) NOT NULL,
    order_index integer NOT NULL
);


--
-- Name: clients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clients (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    order_index integer NOT NULL
);


--
-- Name: clients_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clients_settings (
    id integer NOT NULL,
    intro_text text NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: clients_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.clients_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: clients_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.clients_settings_id_seq OWNED BY public.clients_settings.id;


--
-- Name: contact_info_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_info_settings (
    id integer NOT NULL,
    phone character varying(64) NOT NULL,
    email character varying(255) NOT NULL,
    address text NOT NULL,
    hours character varying(255) NOT NULL,
    whatsapp character varying(64) NOT NULL,
    instagram_url character varying(1024),
    youtube_url character varying(1024),
    linkedin_url character varying(1024),
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: contact_info_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.contact_info_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contact_info_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.contact_info_settings_id_seq OWNED BY public.contact_info_settings.id;


--
-- Name: contact_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_messages (
    id uuid NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(64),
    service character varying(255),
    message text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    notified_studio boolean NOT NULL,
    notified_visitor boolean NOT NULL,
    is_read boolean NOT NULL
);


--
-- Name: content_backups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_backups (
    id uuid NOT NULL,
    admin_id uuid,
    snapshot jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: gallery_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gallery_items (
    id uuid NOT NULL,
    src character varying(1024) NOT NULL,
    category character varying(64) NOT NULL,
    order_index integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: hero_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hero_images (
    id uuid NOT NULL,
    image_url character varying(1024) NOT NULL,
    note text,
    order_index integer NOT NULL
);


--
-- Name: hero_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hero_settings (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    subtitle character varying(255) NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: hero_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.hero_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hero_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.hero_settings_id_seq OWNED BY public.hero_settings.id;


--
-- Name: otp_codes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.otp_codes (
    id uuid NOT NULL,
    admin_id uuid NOT NULL,
    code_hash character varying(64) NOT NULL,
    purpose character varying(32) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    attempts integer NOT NULL,
    consumed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: page_heroes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.page_heroes (
    id uuid NOT NULL,
    page_key character varying(32) NOT NULL,
    title text NOT NULL,
    image character varying(1024) NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: portfolio_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.portfolio_items (
    id uuid NOT NULL,
    title character varying(255) NOT NULL,
    image character varying(1024),
    video_url character varying(1024),
    bts_url character varying(1024),
    description text,
    link character varying(1024),
    service_id uuid,
    category character varying(255),
    order_index integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services (
    id uuid NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    image character varying(1024),
    extended_description text,
    order_index integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: team_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.team_members (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    role character varying(255) NOT NULL,
    bio text,
    photo character varying(1024),
    "position" character varying(32),
    order_index integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: testimonials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.testimonials (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    logo_src character varying(1024),
    quote text NOT NULL,
    order_index integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: visit_counter; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.visit_counter (
    id integer NOT NULL,
    count integer NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: visit_counter_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.visit_counter_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: visit_counter_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.visit_counter_id_seq OWNED BY public.visit_counter.id;


--
-- Name: about_settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_settings ALTER COLUMN id SET DEFAULT nextval('public.about_settings_id_seq'::regclass);


--
-- Name: clients_settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clients_settings ALTER COLUMN id SET DEFAULT nextval('public.clients_settings_id_seq'::regclass);


--
-- Name: contact_info_settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_info_settings ALTER COLUMN id SET DEFAULT nextval('public.contact_info_settings_id_seq'::regclass);


--
-- Name: hero_settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hero_settings ALTER COLUMN id SET DEFAULT nextval('public.hero_settings_id_seq'::regclass);


--
-- Name: visit_counter id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visit_counter ALTER COLUMN id SET DEFAULT nextval('public.visit_counter_id_seq'::regclass);


--
-- Data for Name: about_chips; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.about_chips (id, text, order_index) FROM stdin;
6fb71aa6-e3fc-4f40-b08d-22ff7df7184e	Photography	0
6c459b6f-c683-46e8-8575-d46f09eaa6a4	Video Production	1
186301d7-f64a-4c92-a8cb-c06a80d0062b	Live Streaming	2
63d6f8c2-ca4d-4bfd-85c4-089930cc48a4	Branding	3
7bb17440-85fd-4f56-8db0-987c0b98369c	Web Design	4
fa04150b-6940-43b2-94da-b9f88deba5ef	Documentary	5
\.


--
-- Data for Name: about_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.about_settings (id, heading, body, history, mission, vision, value, image1, image2, image3, image4, updated_at) FROM stdin;
1	Where Light Becomes Memory	Every frame is crafted with patience, emotion, and intent, turning ordinary scenes into cinematic moments that feel personal, timeless, and alive.	FLAT PRODUCTION LIMITED is a Rwandan-based company with 8 years of comprehensive experience and a full portfolio of services. Since 2018, we have delivered event live streaming and feed, photography and video production, web design, content creation, social media management, graphic design, printing, branding, event and entertainment coverage, and documentary production.	To transform ideas, emotions, and moments into unforgettable visuals and digital experiences that help people and brands connect with purpose.	To become East Africa's most trusted creative production partner for stories that shape culture, business growth, and meaningful human impact.	Authenticity, excellence, teamwork, and innovation guide everything we produce from live events and documentaries to digital campaigns and branding.	/photo3.jpg	/photo6.jpg	/live1.jpeg	/photo10.jpg	2026-07-05 19:25:42.400653+02
\.


--
-- Data for Name: about_stats; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.about_stats (id, value, label, order_index) FROM stdin;
f72e907c-07c1-4267-8d81-abccde3e3856	8+	Years Active	0
489a2124-319c-458c-b473-c1384c9f1349	200+	Projects Delivered	1
817dd496-49a3-4853-8b78-570805cef297	50+	Clients Served	2
\.


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.admins (id, email, hashed_password, full_name, is_active, created_at, created_by_admin_id, last_login_at) FROM stdin;
7efebef9-43b5-4f19-a95a-dd01abd15b53	louesauveur18@gmail.com	$2b$12$rWzlHU29PqUj6ksWXGsc/.eQbjb1hrXGcYFFDsAjCmLWWycWMeOGu	Studio Admin	t	2026-07-01 16:20:53.072295+02	\N	2026-07-05 19:25:42.290429+02
\.


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.alembic_version (version_num) FROM stdin;
60ab14ecbfb1
\.


--
-- Data for Name: client_logos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.client_logos (id, logo_url, order_index) FROM stdin;
e38109e6-7bd2-460e-8f69-2d2cc8c5fea7	/mtn.png	0
7f128bde-bd42-4bf3-94b6-54dc4c87a670	/engen.png	1
8162fad4-f077-44bc-b8cd-c6ff2ee4408a	/inyange.jpg	2
94b79bc9-aa51-4803-b351-de24f4010f29	/nbg.jpg	3
\.


--
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.clients (id, name, order_index) FROM stdin;
9f8d90d3-f81e-450e-9d64-dd3d09fd43b5	Corporate	0
ec909008-924a-4a84-a252-5d3d2774358a	Weddings	1
0842b658-d4e3-449f-aac1-af45a2c6d367	Events	2
87199958-8355-435e-ac1e-12720e3aa9d4	Non-profits	3
\.


--
-- Data for Name: clients_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.clients_settings (id, intro_text, updated_at) FROM stdin;
1	We work with brands, organizations, and creators who want visuals that feel sharp, memorable, and full of character. Every project is tailored to match your message, audience, and moment.	2026-07-05 19:25:42.464802+02
\.


--
-- Data for Name: contact_info_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contact_info_settings (id, phone, email, address, hours, whatsapp, instagram_url, youtube_url, linkedin_url, updated_at) FROM stdin;
1	+250 781 691 713	info@flatproduction.rw	TCB house, KN 4 Avenue, Kigali, Rwanda	Mon – Sat, 8:00 AM – 6:00 PM	250781691713	https://instagram.com	https://youtube.com	https://linkedin.com	2026-07-05 19:25:42.496227+02
\.


--
-- Data for Name: contact_messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contact_messages (id, full_name, email, phone, service, message, created_at, notified_studio, notified_visitor, is_read) FROM stdin;
\.


--
-- Data for Name: content_backups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.content_backups (id, admin_id, snapshot, created_at) FROM stdin;
\.


--
-- Data for Name: gallery_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.gallery_items (id, src, category, order_index, created_at) FROM stdin;
eae3227b-ba88-4709-9338-746b21bfea8f	/photo1.jpg	Advertising Photography	0	2026-07-05 19:25:42.485552+02
e2214105-e66f-470a-9227-543054598c5b	/photo2.jpg	Portrait Photography	1	2026-07-05 19:25:42.485552+02
684ee7d8-b4d6-4d93-ab3d-c51f1efa7de9	/photo3.jpg	Portrait Photography	2	2026-07-05 19:25:42.485552+02
a42b2e60-71e6-42e7-bea7-d2ab244a1515	/photo4.jpg	Event Photography	3	2026-07-05 19:25:42.485552+02
d563fadc-6e16-4e6a-a355-1d5d86396472	/photo5.jpg	Advertising Photography	4	2026-07-05 19:25:42.485552+02
ebeb0748-3cc5-407d-95d3-09a28115ce4e	/photo6.jpg	Event Photography	5	2026-07-05 19:25:42.485552+02
9ee0482e-cef4-4129-a99f-544fd12c3f49	/photo8.jpg	Event Photography	6	2026-07-05 19:25:42.485552+02
89b20ce0-3ed0-4440-9001-be662afd5eed	/photo9.jpg	Portrait Photography	7	2026-07-05 19:25:42.485552+02
3e0ea59b-3d70-4248-9871-389eaa6805f1	/photo10.jpg	Portrait Photography	8	2026-07-05 19:25:42.485552+02
4b954b9f-24e1-48fe-9da8-b630b681fd64	/photo12.jpg	Event Photography	9	2026-07-05 19:25:42.485552+02
8db36072-9586-40af-880e-74ed65ac0d8e	/photo14.jpg	Event Photography	10	2026-07-05 19:25:42.485552+02
efeb09e9-acf2-4a0b-9f98-3a0d688b2874	/live1.jpeg	Event Photography	11	2026-07-05 19:25:42.485552+02
a816e555-8d35-4c0e-ab17-5b5d9f04fb9f	/live2.jpeg	Event Photography	12	2026-07-05 19:25:42.485552+02
df0cb646-9842-4a3c-b7bc-00c6c737006b	/web.jpg	Advertising Photography	13	2026-07-05 19:25:42.485552+02
ce22e110-507a-42a3-8f19-57ee2d82d92e	/graphy33.jpg	Advertising Photography	14	2026-07-05 19:25:42.485552+02
fe697b9c-f86f-476e-9e2f-825ad7e8546c	/iwacu1.jpg	Event Photography	15	2026-07-05 19:25:42.485552+02
e7d0379e-4c87-48a2-b718-67de823b4370	/2I1A0386.JPG.jpeg	Behind The Scenes	16	2026-07-05 19:25:42.485552+02
ae4b5309-0cba-4463-838c-97ada4b6af3d	/2I1A0403.JPG.jpeg	Behind The Scenes	17	2026-07-05 19:25:42.485552+02
935233f3-c2aa-408d-92e4-284e7051f8aa	/2I1A0407.JPG.jpeg	Behind The Scenes	18	2026-07-05 19:25:42.485552+02
13a56b1f-c78a-4ae2-952f-1f02cbca9032	/2I1A0410.JPG.jpeg	Behind The Scenes	19	2026-07-05 19:25:42.485552+02
fbd5b417-1bae-4948-9966-ce5e84d1b5de	/MARR0034.JPG	Wedding Photography	20	2026-07-05 19:25:42.485552+02
a354266c-f184-414e-abb2-a6fd57e52464	/MARR0039.JPG	Wedding Photography	21	2026-07-05 19:25:42.485552+02
dd65876b-646d-4613-a29b-65dd5c39d1ac	/MARR0058.JPG	Wedding Photography	22	2026-07-05 19:25:42.485552+02
\.


--
-- Data for Name: hero_images; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hero_images (id, image_url, note, order_index) FROM stdin;
a4a8f22a-9f39-406d-a7c2-f308c472d883	/photo12.jpg	Cinematic light, real moments, and stories that linger.	0
924813e2-2e0a-45d7-9923-553e2feb11c6	/photo6.jpg	Live coverage shaped to feel immediate and polished.	1
bb915c6e-3ff5-4663-9b35-998820b82aa4	/photo3.jpg	Creative visuals built to make brands feel alive.	2
5f371e8a-d39f-4d1b-846f-29c4da74b3ab	/photo10.jpg	\N	3
936b1956-fd4d-4fd3-95f9-c1e159fb9e04	/photo5.jpg	\N	4
\.


--
-- Data for Name: hero_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hero_settings (id, title, subtitle, updated_at) FROM stdin;
1	Flat Productions	Creative Solutions	2026-07-05 19:25:42.387323+02
\.


--
-- Data for Name: otp_codes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.otp_codes (id, admin_id, code_hash, purpose, expires_at, attempts, consumed_at, created_at) FROM stdin;
\.


--
-- Data for Name: page_heroes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.page_heroes (id, page_key, title, image, updated_at) FROM stdin;
62b04c30-6b72-4768-9725-6aaa99f2bd44	about	Real Moments.\nBold Stories.\nTimeless Impact.	/photo12.jpg	2026-07-05 19:25:42.502672+02
6d1e1c47-f87e-4396-ab49-f226e7f57576	services	Creative services built to help your brand stand out.	/live2.jpeg	2026-07-05 19:25:42.502672+02
b64925ac-b1cf-4dcf-bb13-518dc0e2d3e7	portfolio	Our Work	/photo1.jpg	2026-07-05 19:25:42.502672+02
608d5678-39da-439a-b5d6-5398cd576594	gallery	Visual Stories	/photo3.jpg	2026-07-05 19:25:42.502672+02
f257fc21-21ab-410a-bea5-70251a8705e4	contact	Let's Create Something Extraordinary	/live2.jpeg	2026-07-05 19:25:42.502672+02
\.


--
-- Data for Name: portfolio_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.portfolio_items (id, title, image, video_url, bts_url, description, link, service_id, category, order_index, created_at, updated_at) FROM stdin;
b54a2936-7d60-4a43-9735-8132068a0313	Photography	/photo1.jpg	\N	\N	We capture stunning visuals that tell your unique story with precision and artistic flair.	#	\N	Photography	0	2026-07-05 19:25:42.444276+02	2026-07-05 19:25:42.444276+02
5807cf2a-c516-4407-91a1-a2ffae443ea2	Video Production	/2I1A0386.JPG.jpeg	https://youtu.be/RjXqY31jpy0	https://youtu.be/DHR85WBk4tY	We deliver high-end video production services tailored for commercials, events, and cinematic projects.	#	\N	Video Production	1	2026-07-05 19:25:42.444276+02	2026-07-05 19:25:42.444276+02
df51706a-332b-483b-8c5e-d5f1b706e199	Live Streaming	/2I1A0403.JPG.jpeg	https://youtu.be/de6oWk6vGlM	https://youtu.be/zWTFpxzQaes	We provide professional multi-camera live streaming solutions to connect you with a global audience instantly.	#	\N	Live Streaming	2	2026-07-05 19:25:42.444276+02	2026-07-05 19:25:42.444276+02
e38ca534-2f79-4ff8-aa2a-26c139c86793	Web & Digital	/web.jpg	\N	\N	We offer comprehensive digital strategies including web design, development, and online marketing solutions.	#	\N	Web & Digital	3	2026-07-05 19:25:42.444276+02	2026-07-05 19:25:42.444276+02
738ae041-a0e6-4c42-b0d7-403f05c468f8	Branding	/graphy33.jpg	\N	\N	We create memorable brand identities that resonate deeply with your target market and stand out.	#	\N	Branding	4	2026-07-05 19:25:42.444276+02	2026-07-05 19:25:42.444276+02
1722e149-43ec-4e33-ada4-97ec76d3de3e	Documentary	/photo12.jpg	\N	\N	We specialize in in-depth documentary filmmaking that brings important real-world stories to light.	#	\N	Documentary	5	2026-07-05 19:25:42.444276+02	2026-07-05 19:25:42.444276+02
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.services (id, title, description, image, extended_description, order_index, created_at, updated_at) FROM stdin;
e62bbb9b-d358-4e79-9a1a-21c7549168ef	PHOTOGRAPHY & VIDEO PRODUCTION	Delivering outstanding excellence in video production and photography: capturing moments, crafting stories, creating memories.	/photo1.jpg	From corporate events to weddings and product launches, we capture every visual moment with precision equipment and a storytelling eye. Our edits are polished, emotive, and built to work across every screen.	0	2026-07-05 19:25:42.432436+02	2026-07-05 19:25:42.432436+02
2be6606d-1ed7-4629-af16-b7a367e82058	LIVE STREAMING & FEED	Lets you interact with your audience in real time with a video feed, chat, reactions, and more.	/live1.jpeg	We deploy professional multi-camera streaming rigs for any scale of event — from intimate church services to large-scale conferences. Low-latency, stable, with dedicated technical support on-site.	1	2026-07-05 19:25:42.432436+02	2026-07-05 19:25:42.432436+02
7443c6ba-5468-4de1-9dd1-5e00c6452252	WEBSITE DESIGN	You are best in your work; let us help you show world your excellent achievements digitally.	/web.jpg	We build fast, clean, and modern websites that make your brand look credible online. Every site is mobile-optimized, SEO-ready, and designed to convert visitors into real clients.	2	2026-07-05 19:25:42.432436+02	2026-07-05 19:25:42.432436+02
2a03b70f-058b-424a-b3d4-892a37bc4d02	DESIGN - PRINTING & BRANDING	It's hard to build and easy to destroy by not branding your excellent work; we are here to express your great work through stunning branding.	/graphy33.jpg	Your brand should be recognizable everywhere. We create logos, typography systems, social graphics, and print-ready artwork that hold together across every touchpoint.	3	2026-07-05 19:25:42.432436+02	2026-07-05 19:25:42.432436+02
37f87349-38fc-4dd7-bf8c-8dc0df89d2e9	EVENT & ENTERTAINMENT	Here to help differentiate your event through outstanding creativity.	/photo5.jpg	Whether it's a concert, gala, or product launch, we capture the energy and emotion with high-quality cameras and a genuine eye for the moments your guests will remember.	4	2026-07-05 19:25:42.432436+02	2026-07-05 19:25:42.432436+02
2c521ba9-0248-43f1-9fe5-87e7b9956f73	DOCUMENTARY	A better way of storytelling through interviewing, research, reality filming, narration, and production excellence through experience.	/photo12.jpg	Documentaries require patience, curiosity, and craft. We combine deep research, on-location filming, and precise editing to produce pieces that feel honest and compelling.	5	2026-07-05 19:25:42.432436+02	2026-07-05 19:25:42.432436+02
\.


--
-- Data for Name: team_members; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.team_members (id, name, role, bio, photo, "position", order_index, created_at, updated_at) FROM stdin;
56487931-d704-4880-817f-d941754967e7	KADAffI PRO	Ceo & Founder	Leads the creative direction and keeps every project focused, sharp, and client-centered.	/kadaff.jpg	50% 18%	0	2026-07-05 19:25:42.477215+02	2026-07-05 19:25:42.477215+02
a6f21c61-61f1-4ef4-98ab-f111441538d0	Kelly	Graphics Designer	Shapes visual identities, layouts, and brand assets with a clean, modern style.	/ike.jpg	50% 20%	1	2026-07-05 19:25:42.477215+02	2026-07-05 19:25:42.477215+02
eb93fdd5-3229-4fe7-8415-d0ba327c2e45	Chancelline niyotugendana	Secretary & photographer	Keeps the studio organized while capturing moments with a calm eye for detail.	/chance.jpg	50% 22%	2	2026-07-05 19:25:42.477215+02	2026-07-05 19:25:42.477215+02
31703aa6-0c8e-4a97-b210-d7e5ec8172af	anura	Intern	Supports the team across shoots, edits, and day-to-day production work.	/chelsea.jpg	50% 18%	3	2026-07-05 19:25:42.477215+02	2026-07-05 19:25:42.477215+02
b2ff1584-f930-4932-a783-a5a4a2148d3a	ishimwe samuel kelly	GRAPHICS DESIGNER	Brings bold concepts to life through graphics, branding, and polished design details.	/onekelly.jpg	50% 20%	4	2026-07-05 19:25:42.477215+02	2026-07-05 19:25:42.477215+02
\.


--
-- Data for Name: testimonials; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.testimonials (id, name, logo_src, quote, order_index, created_at, updated_at) FROM stdin;
3f3d083d-41f6-476a-9ecb-cda3dadeec04	MTN Rwanda	/mtn.png	Flat Production delivered event visuals and digital storytelling that elevated our customer engagement campaigns.	0	2026-07-05 19:25:42.420802+02	2026-07-05 19:25:42.420802+02
289029a5-fb1d-4e12-908e-eee0a9d489e7	Engen Rwanda	/engen.png	Their livestream and content team managed high-pressure launches smoothly and produced quality media in real time.	1	2026-07-05 19:25:42.420802+02	2026-07-05 19:25:42.420802+02
ca97b258-7181-4e3b-8403-0a78b1dd7161	Inyange Industries	/inyange.jpg	From photography to post-production, they helped us communicate our brand story with clarity and premium quality.	2	2026-07-05 19:25:42.420802+02	2026-07-05 19:25:42.420802+02
619d3750-fbb3-4f6d-9a93-b0b932f2850d	NBG	/nbg.jpg	We trusted Flat Production for documentary storytelling and campaign content, and the outcome was impactful and authentic.	3	2026-07-05 19:25:42.420802+02	2026-07-05 19:25:42.420802+02
\.


--
-- Data for Name: visit_counter; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.visit_counter (id, count, updated_at) FROM stdin;
1	0	2026-07-05 19:01:45.007018+02
\.


--
-- Name: about_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.about_settings_id_seq', 1, false);


--
-- Name: clients_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.clients_settings_id_seq', 1, false);


--
-- Name: contact_info_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.contact_info_settings_id_seq', 1, false);


--
-- Name: hero_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.hero_settings_id_seq', 1, false);


--
-- Name: visit_counter_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.visit_counter_id_seq', 1, false);


--
-- Name: about_chips about_chips_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_chips
    ADD CONSTRAINT about_chips_pkey PRIMARY KEY (id);


--
-- Name: about_settings about_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_settings
    ADD CONSTRAINT about_settings_pkey PRIMARY KEY (id);


--
-- Name: about_stats about_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_stats
    ADD CONSTRAINT about_stats_pkey PRIMARY KEY (id);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: client_logos client_logos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.client_logos
    ADD CONSTRAINT client_logos_pkey PRIMARY KEY (id);


--
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- Name: clients_settings clients_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clients_settings
    ADD CONSTRAINT clients_settings_pkey PRIMARY KEY (id);


--
-- Name: contact_info_settings contact_info_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_info_settings
    ADD CONSTRAINT contact_info_settings_pkey PRIMARY KEY (id);


--
-- Name: contact_messages contact_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_pkey PRIMARY KEY (id);


--
-- Name: content_backups content_backups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_backups
    ADD CONSTRAINT content_backups_pkey PRIMARY KEY (id);


--
-- Name: gallery_items gallery_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gallery_items
    ADD CONSTRAINT gallery_items_pkey PRIMARY KEY (id);


--
-- Name: hero_images hero_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hero_images
    ADD CONSTRAINT hero_images_pkey PRIMARY KEY (id);


--
-- Name: hero_settings hero_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hero_settings
    ADD CONSTRAINT hero_settings_pkey PRIMARY KEY (id);


--
-- Name: otp_codes otp_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.otp_codes
    ADD CONSTRAINT otp_codes_pkey PRIMARY KEY (id);


--
-- Name: page_heroes page_heroes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_heroes
    ADD CONSTRAINT page_heroes_pkey PRIMARY KEY (id);


--
-- Name: portfolio_items portfolio_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portfolio_items
    ADD CONSTRAINT portfolio_items_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: team_members team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (id);


--
-- Name: testimonials testimonials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.testimonials
    ADD CONSTRAINT testimonials_pkey PRIMARY KEY (id);


--
-- Name: visit_counter visit_counter_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visit_counter
    ADD CONSTRAINT visit_counter_pkey PRIMARY KEY (id);


--
-- Name: ix_about_chips_order_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_about_chips_order_index ON public.about_chips USING btree (order_index);


--
-- Name: ix_about_stats_order_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_about_stats_order_index ON public.about_stats USING btree (order_index);


--
-- Name: ix_admins_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_admins_email ON public.admins USING btree (email);


--
-- Name: ix_client_logos_order_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_client_logos_order_index ON public.client_logos USING btree (order_index);


--
-- Name: ix_clients_order_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_clients_order_index ON public.clients USING btree (order_index);


--
-- Name: ix_gallery_items_order_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_gallery_items_order_index ON public.gallery_items USING btree (order_index);


--
-- Name: ix_hero_images_order_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_hero_images_order_index ON public.hero_images USING btree (order_index);


--
-- Name: ix_otp_codes_admin_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_otp_codes_admin_id ON public.otp_codes USING btree (admin_id);


--
-- Name: ix_page_heroes_page_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_page_heroes_page_key ON public.page_heroes USING btree (page_key);


--
-- Name: ix_portfolio_items_order_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_portfolio_items_order_index ON public.portfolio_items USING btree (order_index);


--
-- Name: ix_services_order_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_services_order_index ON public.services USING btree (order_index);


--
-- Name: ix_team_members_order_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_team_members_order_index ON public.team_members USING btree (order_index);


--
-- Name: ix_testimonials_order_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_testimonials_order_index ON public.testimonials USING btree (order_index);


--
-- Name: admins admins_created_by_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_created_by_admin_id_fkey FOREIGN KEY (created_by_admin_id) REFERENCES public.admins(id) ON DELETE SET NULL;


--
-- Name: content_backups content_backups_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_backups
    ADD CONSTRAINT content_backups_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.admins(id) ON DELETE SET NULL;


--
-- Name: otp_codes otp_codes_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.otp_codes
    ADD CONSTRAINT otp_codes_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.admins(id) ON DELETE CASCADE;


--
-- Name: portfolio_items portfolio_items_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portfolio_items
    ADD CONSTRAINT portfolio_items_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict Ac5gnRaWRZ10LyDebVndC8hh3C09mlUvJOuZSfF1YfrsYvgeRLsjrrK5zkicmr9

