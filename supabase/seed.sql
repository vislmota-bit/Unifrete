-- Seed data for Unifrete LMS development

-- Trilhas
INSERT INTO trilhas (id, titulo, descricao, diretoria, facilitador, xp_total, ativo) VALUES
  ('11111111-1111-1111-1111-111111111001', 'Onboarding frete.com', 'Sua jornada nos primeiros 30 dias na frete.com. Conheça a cultura, os produtos e as equipes.', NULL, 'Time de Gente e Gestão', 500, true),
  ('11111111-1111-1111-1111-111111111002', 'Fundamentos de Logística', 'Aprenda os conceitos essenciais do setor de logística e transporte de cargas.', 'Marketplace', 'Ana Rodrigues', 800, true),
  ('11111111-1111-1111-1111-111111111003', 'Tecnologia e Engenharia', 'Boas práticas de desenvolvimento, arquitetura e cultura de engenharia na frete.com.', 'Tecnologia', 'Carlos Mendes', 1200, true),
  ('11111111-1111-1111-1111-111111111004', 'Liderança e Gestão', 'Desenvolva suas habilidades de liderança e gestão de equipes de alta performance.', 'Gente e Gestão', 'Mariana Costa', 1000, true),
  ('11111111-1111-1111-1111-111111111005', 'Finanças para não-financeiros', 'Entenda os fundamentos de finanças aplicados ao contexto frete.com.', 'Fintech', 'Roberto Alves', 600, true),
  ('11111111-1111-1111-1111-111111111006', 'Produto e UX', 'Do problema à solução: como construímos produtos centrados no usuário.', 'Produto', 'Fernanda Lima', 900, true);

-- Módulos da trilha de Onboarding
INSERT INTO modulos (id, trilha_id, titulo, descricao, formato, xp, ordem, obrigatorio) VALUES
  ('22222222-2222-2222-2222-222222222001', '11111111-1111-1111-1111-111111111001', 'Bem-vindo à frete.com', 'Conheça nossa história, missão e valores.', 'video', 50, 1, true),
  ('22222222-2222-2222-2222-222222222002', '11111111-1111-1111-1111-111111111001', 'Nossa Cultura', 'Os princípios que guiam nosso jeito de trabalhar.', 'pdf', 50, 2, true),
  ('22222222-2222-2222-2222-222222222003', '11111111-1111-1111-1111-111111111001', 'Produtos e Serviços', 'Entenda o portfólio completo da frete.com.', 'video', 100, 3, true),
  ('22222222-2222-2222-2222-222222222004', '11111111-1111-1111-1111-111111111001', 'Ferramentas do dia a dia', 'Slack, Notion, Jira e outras ferramentas que usamos.', 'pdf', 100, 4, false),
  ('22222222-2222-2222-2222-222222222005', '11111111-1111-1111-1111-111111111001', 'Podcast: Conversa com o CEO', 'Ouça a visão e os desafios da frete.com diretamente do CEO.', 'podcast', 200, 5, false);

-- Módulos de Logística
INSERT INTO modulos (id, trilha_id, titulo, descricao, formato, xp, ordem, obrigatorio) VALUES
  ('22222222-2222-2222-2222-222222222011', '11111111-1111-1111-1111-111111111002', 'O mercado de fretes no Brasil', 'Panorama do setor logístico nacional.', 'video', 100, 1, true),
  ('22222222-2222-2222-2222-222222222012', '11111111-1111-1111-1111-111111111002', 'Tipos de carga e modais', 'Rodoviário, ferroviário, aéreo e marítimo.', 'pdf', 100, 2, false),
  ('22222222-2222-2222-2222-222222222013', '11111111-1111-1111-1111-111111111002', 'Regulamentação e ANTT', 'Normas e regulações do setor.', 'pdf', 150, 3, false),
  ('22222222-2222-2222-2222-222222222014', '11111111-1111-1111-1111-111111111002', 'Precificação de fretes', 'Como funcionam os preços e variáveis do mercado.', 'video', 200, 4, false),
  ('22222222-2222-2222-2222-222222222015', '11111111-1111-1111-1111-111111111002', 'Podcast: Tendências de Logística', 'As principais tendências para os próximos anos.', 'podcast', 250, 5, false);

-- Módulos de Tecnologia
INSERT INTO modulos (id, trilha_id, titulo, descricao, formato, xp, ordem, obrigatorio) VALUES
  ('22222222-2222-2222-2222-222222222021', '11111111-1111-1111-1111-111111111003', 'Arquitetura de microsserviços', 'Como nossa stack é organizada.', 'video', 150, 1, false),
  ('22222222-2222-2222-2222-222222222022', '11111111-1111-1111-1111-111111111003', 'Boas práticas de código', 'Clean code, testes e revisão de código.', 'video', 150, 2, false),
  ('22222222-2222-2222-2222-222222222023', '11111111-1111-1111-1111-111111111003', 'Segurança e compliance', 'LGPD e práticas de segurança.', 'pdf', 200, 3, true),
  ('22222222-2222-2222-2222-222222222024', '11111111-1111-1111-1111-111111111003', 'Observabilidade e monitoramento', 'Como garantimos a saúde dos sistemas.', 'video', 300, 4, false),
  ('22222222-2222-2222-2222-222222222025', '11111111-1111-1111-1111-111111111003', 'On-call e gestão de incidentes', 'Processos para lidar com incidentes em produção.', 'pdf', 400, 5, false);

-- Novidades
INSERT INTO novidades (titulo, descricao, categoria, tempo_leitura_min, destaque, autor) VALUES
  ('frete.com conquista novo recorde de fretes em maio', 'O mês de maio foi histórico para a plataforma, com crescimento de 34% no volume de fretes processados.', 'interno', 3, true, 'Comunicação frete.com'),
  ('Nova funcionalidade: rastreamento em tempo real', 'Lançamos o rastreamento em tempo real para todos os fretes realizados pela plataforma.', 'interno', 2, true, 'Produto frete.com'),
  ('Mercado de logística cresce 15% no Q1 2025', 'Dados do setor mostram crescimento robusto da logística brasileira no primeiro trimestre.', 'logistica', 5, false, 'Editoria Logística'),
  ('ANTT publica novas normas para transportadoras', 'Regulamentação atualizada traz mudanças importantes para o setor.', 'regulatorio', 4, false, 'Editoria Regulatório'),
  ('Como construímos nosso sistema de precificação dinâmica', 'O time de Tecnologia compartilha os bastidores da nossa engine de preços.', 'tech', 8, true, 'Time Tech frete.com'),
  ('Benefícios atualizados para 2025', 'Confira as novidades no pacote de benefícios dos colaboradores frete.com.', 'rh', 3, false, 'Gente e Gestão'),
  ('Tendências de e-commerce e logística para o segundo semestre', 'Um olhar sobre o que esperar do mercado nos próximos meses.', 'mercado', 6, false, 'Editoria Mercado'),
  ('Programa de desenvolvimento de lideranças: inscrições abertas', 'Vagas abertas para o próximo ciclo do programa de liderança frete.com.', 'rh', 2, false, 'Gente e Gestão');
