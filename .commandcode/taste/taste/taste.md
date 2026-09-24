# Taste
- Prefers small, focused commits rather than large or bundled changes; when asked to push something, keep the change minimal and scoped to a single file. Confidence: 0.65
- Wants new branches/environments configured for parity with the existing working reference (e.g. `main`): mirror the same env vars and deploy settings even when some are unused, instead of trimming to the minimal set the agent recommends. Confidence: 0.6
- Prefers to keep changes confined to the working branch and leave shared/live production state (e.g. the main deployment) untouched unless they explicitly opt in to a shared-state change. Confidence: 0.5
- Will accept a trivial, effectively no-op commit (e.g. bumping a redeploy-trigger line) when the goal is just to push something to a branch, rather than requiring real code changes. Confidence: 0.5
- Writes terse, lowercase, fragmentary requests (often with typos) and expects the agent to infer the missing context and act rather than asking for a fully specified requirement. Confidence: 0.6
- Reports failures by pasting the raw error text or a screenshot rather than describing the problem, and expects the agent to locate the root cause and fix it. Confidence: 0.55
- Frequently checks back that earlier work was actually correct ("was it good from the start?") and expects a candid re-assessment, including acknowledging any earlier wrong answer. Confidence: 0.5
- Expects solutions to build on the infrastructure they already have configured (e.g., Upstash Redis set in their env vars) rather than adopting or assuming a new third-party endpoint/service the agent introduces. Confidence: 0.5
