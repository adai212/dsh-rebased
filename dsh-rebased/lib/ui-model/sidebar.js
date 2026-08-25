import { createEmptyRepositorySnapshot } from "../core/contracts.js";

export function createSidebarViewModel(snapshot = createEmptyRepositorySnapshot()) {
  return Object.freeze({
    title: "Git",
    subtitle: "Framework ready",
    repository: snapshot,
    actions: Object.freeze([]),
  });
}
