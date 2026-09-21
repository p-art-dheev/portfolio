-- Run after schema.sql. Safe to re-run: upserts by slug / title.

insert into public.site_settings (
  id, name, domain, role, tagline, bio, college, branch, year, location, resume, avatars, socials, tech_stack
) values (
  1,
  'Pardheev',
  'pardheev.dev',
  'Full-Stack Developer',
  'Building thoughtful products from idea to interface.',
  $bio$Hey, I’m Pardheev Vatturu, a final-year student and developer. I like building things, mostly around full-stack development, AI and ML, and I enjoy learning by actually making stuff. Outside of tech, I like drawing realism, and digital art. Recently, I’ve started reading books on philosophy, psychology, self-help and productivity. I’m usually curious about random things and enjoy figuring out how they work. If you’re interested, feel free to check out some of the things I’ve built and written about here.$bio$,
  'Amrita Vishwa Vidyapeetham',
  'B.Tech Artificial Intelligence Engineering',
  '2023-2027',
  'Coimbatore, India',
  '/resume/resume.pdf',
  '["/avatars/avatar-default.png", "/avatars/avatar.jpg"]'::jsonb,
  '{"linkedin":"https://linkedin.com/in/pardheev-vatturu/","github":"https://github.com/p-art-dheev","email":"pardheev.vatturu1234@gmail.com"}'::jsonb,
  '[
    {"label":"TypeScript","icon":"typescript"},
    {"label":"Next.js","icon":"nextjs"},
    {"label":"React","icon":"react"},
    {"label":"Tailwind CSS","icon":"tailwindcss"},
    {"label":"Node.js","icon":"nodejs"},
    {"label":"PostgreSQL","icon":"postgresql"},
    {"label":"Git","icon":"git"},
    {"label":"GitHub","icon":"github"},
    {"label":"Python","icon":"python"},
    {"label":"HTML","icon":"html"},
    {"label":"CSS","icon":"css"},
    {"label":"JavaScript","icon":"javascript"},
    {"label":"NumPy","icon":"numpy"},
    {"label":"pandas","icon":"pandas"}
  ]'::jsonb
)
on conflict (id) do update set
  name = excluded.name,
  domain = excluded.domain,
  role = excluded.role,
  tagline = excluded.tagline,
  bio = excluded.bio,
  college = excluded.college,
  branch = excluded.branch,
  year = excluded.year,
  location = excluded.location,
  resume = excluded.resume,
  avatars = excluded.avatars,
  socials = excluded.socials,
  tech_stack = excluded.tech_stack;

insert into public.projects (slug, title, description, banner, tags, href, status, featured, published, sort_order)
values
  (
    'project-one',
    'Electricity Load Forecasting',
    'Forecasted electricity demand using 16 years of PJM hourly load data with time-series analysis and SARIMA/SETAR models.',
    '/projects/project-one/banner.png',
    array['Python', 'LSTM', 'Time Series Analysis'],
    null,
    'off',
    true,
    true,
    10
  ),
  (
    'project-two',
    'Aspect Based Sentiment Analysis',
    'Built a BERT-based NLP model to classify sentiment from abstract or context-rich text.',
    '/projects/project-two/banner.png',
    array['BERT', 'Transformers', 'NLP'],
    null,
    'off',
    true,
    true,
    20
  ),
  (
    'project-three',
    'Codeproctor',
    'Developed a web-based coding assessment platform for conducting and managing programming tests.',
    '/projects/project-three/1.png',
    array['Next.js', 'TypeScript', 'PostgreSQL'],
    null,
    'off',
    true,
    true,
    30
  ),
  (
    'project-four',
    'Meal Nutrition Optimizer',
    'Developed a nutrition-focused application that recommends meals based on individual calorie and nutritional requirements.',
    '/projects/project-four/banner.png',
    array['Python', 'FastAPI', 'React', 'PuLP'],
    'https://github.com/p-art-dheev/nutrition-based-meal-optimization',
    'Building',
    true,
    true,
    40
  )
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  banner = excluded.banner,
  tags = excluded.tags,
  href = excluded.href,
  status = excluded.status,
  featured = excluded.featured,
  published = excluded.published,
  sort_order = excluded.sort_order;

insert into public.artworks (title, image_url, alt, width, height, published, sort_order)
select * from (
  values
    ('Radha Krishna', '/artworks/011.jpeg', 'Pencil drawing of Radha and Krishna', 1024, 1280, true, 10),
    ('Thorfinn', '/artworks/021.jpeg', 'Watercolor portrait of Thorfinn', 1024, 1280, true, 20),
    ('Krishna', '/artworks/031.jpeg', 'Colored pencil portrait of Krishna', 1023, 1280, true, 30),
    ('Golden Retriever', '/artworks/041.jpeg', 'Digital painting of a golden retriever puppy', 1024, 1280, true, 40),
    ('Gaze', '/artworks/051.jpeg', 'Charcoal drawing of eyes with a red bindi', 1050, 720, true, 50),
    ('beluga', '/artworks/061.jpg', 'Ink sketch of a cat''s face', 1002, 1280, true, 60),
    ('Cradled', '/artworks/071.jpg', 'Pencil drawing of a newborn held in adult hands', 954, 1280, true, 70),
    ('Anime character', '/artworks/081.jpg', 'Pencil portrait of a young woman', 991, 561, true, 80),
    ('Eye', '/artworks/091.jpeg', 'Graphite drawing of an eye', 720, 894, true, 90),
    ('Ram and Bheem', '/artworks/101.jpg', 'Pencil drawing of two men', 780, 1040, true, 100),
    ('Who Wore It Better', '/artworks/111.jpg', 'Drawing of a tabby cat in sunglasses', 1180, 1280, true, 110),
    ('Ana De Armas', '/artworks/121.jpg', 'Realistic graphite portrait of a woman', 1024, 1280, true, 120)
) as v(title, image_url, alt, width, height, published, sort_order)
where not exists (
  select 1 from public.artworks a where a.title = v.title
);

insert into public.books (title, subtitle, author, cover_url, cover_alt, published, sort_order)
select * from (
  values
    ('Eat That Frog!', '21 Great Ways to Stop Procrastinating and Get More Done in Less Time', 'Brian Tracy', '/books/01.jpg', 'Eat That Frog! by Brian Tracy', true, 10),
    ('Atomic Habits', 'Tiny Changes, Remarkable Results', 'James Clear', '/books/02.jpg', 'Atomic Habits by James Clear', true, 20),
    ('The Courage to Be Disliked', 'A single book can change your life', 'Ichiro Kishimi and Fumitake Koga', '/books/03.jpg', 'The Courage to Be Disliked by Ichiro Kishimi and Fumitake Koga', true, 30),
    ('The Mountain Is You', 'Transforming Self-Sabotage into Self-Mastery', 'Brianna Wiest', '/books/04.jpg', 'The Mountain Is You by Brianna Wiest', true, 40),
    ('Man''s Search for Meaning', 'The classic tribute to hope from the Holocaust', 'Viktor E. Frankl', '/books/05.jpg', 'Man''s Search for Meaning by Viktor E. Frankl', true, 50)
) as v(title, subtitle, author, cover_url, cover_alt, published, sort_order)
where not exists (
  select 1 from public.books b where b.title = v.title
);
