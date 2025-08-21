import { z } from 'zod';

export const RelationSchema = z.object({
  id: z.string(),
  type: z.enum(['pattern', 'workflow', 'tool', 'prompt', 'metric', 'risk']),
  weight: z.number().optional(),
});

export const PatternSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  phase: z.enum([
    'Ideation',
    'Scaffolding',
    'Coding',
    'Review',
    'Testing',
    'Deployment',
  ]),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  roi: z.number().min(0).max(10),
  steps: z.array(z.string()),
  bestPractices: z.array(z.string()),
  antiPatterns: z.array(z.string()).optional(),
  prompts: z.array(z.string()).optional(),
  tools: z.array(z.string()).optional(),
  metrics: z.array(z.string()).optional(),
  risks: z.array(z.string()).optional(),
  tags: z.array(z.string()),
  links: z.array(z.string()).optional(),
  relations: z.array(RelationSchema),
});

export const WorkflowSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  stages: z.array(
    z.object({
      name: z.string(),
      goals: z.array(z.string()),
      artifacts: z.array(z.string()).optional(),
    }),
  ),
  kpis: z.array(z.string()).optional(),
  tags: z.array(z.string()),
  relations: z.array(RelationSchema),
});

export const ToolSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  cost: z.string().optional(),
  url: z.string().optional(),
  strengths: z.array(z.string()),
  limits: z.array(z.string()),
  tags: z.array(z.string()),
  relations: z.array(RelationSchema),
});

export const PromptSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  useCases: z.array(z.string()),
  inputs: z.array(z.string()).optional(),
  outputs: z.array(z.string()).optional(),
  tags: z.array(z.string()),
  relations: z.array(RelationSchema),
});

export const MetricSchema = z.object({
  id: z.string(),
  name: z.string(),
  desc: z.string(),
  scale: z.enum(['ordinal', 'ratio', 'percent']),
  compute: z.string().optional(),
  tags: z.array(z.string()),
});

export const RiskSchema = z.object({
  id: z.string(),
  name: z.string(),
  mitigation: z.array(z.string()),
  severity: z.enum(['Low', 'Med', 'High']),
  tags: z.array(z.string()),
});

export const PlaybookSchema = z.object({
  version: z.string(),
  updatedAt: z.string(),
  patterns: z.array(PatternSchema),
  workflows: z.array(WorkflowSchema),
  tools: z.array(ToolSchema),
  prompts: z.array(PromptSchema),
  metrics: z.array(MetricSchema),
  risks: z.array(RiskSchema),
});

export type Relation = z.infer<typeof RelationSchema>;
export type Pattern = z.infer<typeof PatternSchema>;
export type Workflow = z.infer<typeof WorkflowSchema>;
export type Tool = z.infer<typeof ToolSchema>;
export type Prompt = z.infer<typeof PromptSchema>;
export type Metric = z.infer<typeof MetricSchema>;
export type Risk = z.infer<typeof RiskSchema>;
export type Playbook = z.infer<typeof PlaybookSchema>;
