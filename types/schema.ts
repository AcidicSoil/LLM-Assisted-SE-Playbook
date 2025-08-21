import { z } from 'zod';

export const NodeSchema = z.object({
  id: z.string(),
  type: z.enum(['practice','pattern','anti_pattern','stage','artifact','metric','tool','concept','case_study']),
  title: z.string(),
  summary: z.string().optional(),
  detailsMD: z.string().optional(),
  tags: z.array(z.string()).default([]),
  roles: z.array(z.string()).default([]),
  stages: z.array(z.string()).default([]),
  inputs: z.array(z.string()).default([]),
  outputs: z.array(z.string()).default([]),
  impact: z.number().min(1).max(5).default(3),
  effort: z.number().min(1).max(5).default(3),
  difficulty: z.enum(['low','med','high']).default('med'),
  maturity: z.enum(['emerging','established','experimental']).default('emerging'),
  references: z.array(z.string()).default([]),
  sourcePath: z.string().optional(),
});
export type Node = z.infer<typeof NodeSchema>;

export const RelationSchema = z.object({
  id: z.string(),
  fromId: z.string(),
  toId: z.string(),
  kind: z.enum(['depends_on','enhances','conflicts_with','precedes','outputs','measures']),
  weight: z.number().optional(),
  evidence: z.string().optional(),
});
export type Relation = z.infer<typeof RelationSchema>;

export const DatasetSchema = z.object({
  nodes: z.array(NodeSchema),
  relations: z.array(RelationSchema),
  glossary: z.array(z.object({ term: z.string(), definition: z.string() })).optional(),
  sources: z.array(z.object({ id: z.string(), title: z.string(), url: z.string() })).optional(),
});
export type Dataset = z.infer<typeof DatasetSchema>;
