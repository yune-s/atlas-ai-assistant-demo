import knowledgeBase from "@/data/knowledge-base.json";

export type KnowledgeBase = typeof knowledgeBase;

export function getKnowledgeBase(): KnowledgeBase {
  return knowledgeBase;
}

export function getKnowledgeBaseText() {
  return JSON.stringify(knowledgeBase, null, 2);
}
