import { createEmptyRepositorySnapshot } from "../core/contracts.js";

export function createSidebarViewModel(snapshot = createEmptyRepositorySnapshot()) {
  return Object.freeze({
    title: "Git",
    subtitle: "Repository status",
    repository: snapshot,
    actions: Object.freeze([]),
  });
}
