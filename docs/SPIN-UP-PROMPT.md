# Spin-Up Prompt: Integrated Manufacturing Decision System

## Purpose of this document

Use this prompt to rebuild the product as a production-quality, bilingual manufacturing decision system for an electric-vehicle business.

This is a business and acceptance specification, not a technology specification. The implementation team may choose and optimize any suitable architecture, programming languages, frameworks, visualization tools, data stores, AI services, deployment platforms, and testing tools available at the time of delivery. Technology choices must support the requirements below; they must not redefine, omit, or weaken them.

## 1. Product objective

Create one connected decision environment spanning the full manufacturing value stream:

1. Market demand
2. Production and personnel planning
3. Supplier and procurement management
4. Manufacturing execution
5. Quality management

The application must help users move from signals to decisions. It must combine operational data, visual analysis, forecasts, traceability, recommended actions, human approvals, and governance in a coherent experience.

Knowledge search and conversational assistance must be available as a global call-to-action from every page. It must not appear as a separate primary-navigation application.

## 2. Implementation freedom and non-negotiable contract

### The implementation team may optimize

- Application architecture and delivery model
- Frontend, backend, mobile, desktop, or web technologies
- Programming languages and frameworks
- Visualization and graph-rendering technology
- Storage, caching, state-management, and data-processing approaches
- AI model, provider, orchestration, and retrieval approach
- Hosting, infrastructure, observability, and deployment process
- Automated testing, quality gates, and developer tooling

### The implementation must preserve

- The business modules, workflows, terminology, and stage relationships in this document
- Drill-down and roll-up behavior across the specified business dimensions
- Historical data, predictions, and clear observed-versus-forecast distinctions
- Stateful decision actions such as reporting, assigning, reviewing, escalating, approving, and closing
- Strict English-only and Chinese-only experiences
- The interactive ontology, agent-management, and governance capabilities
- A useful offline or demonstration mode that does not depend on external services
- Responsive, accessible, secure, maintainable, and auditable behavior

Technology substitutions are acceptable only when the resulting product meets or exceeds every acceptance criterion.

## 3. Experience and information architecture

Use a clear enterprise interface with persistent access to the five operational modules. The visual design may follow any coherent design system, provided that it has strong hierarchy, accessible contrast, consistent interaction patterns, and works on desktop and smaller screens.

The primary operational flow must be visually organized as follows:

```text
                 Stage 1: Market Demand
                          |
            +-------------+-------------+
            |                           |
Stage 2: Production Planning   Stage 3: Suppliers
            |                           |
            +-------------+-------------+
                          |
          Stage 4: Manufacturing Execution
                          |
              Stage 5: Quality Management
```

Stage 1, Stage 4, and Stage 5 must be centered. Stage 5 must appear directly below Stage 4. Stages 2 and 3 must be parallel branches between Stage 1 and Stage 4.

The five operational modules are:

| Stage | Module | Required business outcome |
| --- | --- | --- |
| 1 | Market Demand | Understand demand, product mix, regional differences, historical movement, and forecast demand |
| 2 | Production Planning | Balance capacity, shifts, products, materials, and personnel; expose staffing and qualification gaps |
| 3 | Suppliers | Evaluate suppliers, procurement exposure, lead time, risk, quality, and recommended sourcing actions |
| 4 | Manufacturing Execution | Monitor live and historical production performance, identify bottlenecks, and support operational intervention |
| 5 | Quality Management | Investigate defects, assign ownership, escalate issues, record decisions, and verify closure |

Platform capabilities must be available through a secondary application layer that can be revealed or collapsed without competing with the main operational workflow:

- Ontology
- Agents / Digital Workforce
- Model Operations and Governance

## 4. Global Knowledge & Chat

Provide one persistent Knowledge & Chat call-to-action on every operational and platform page. Opening it must preserve the current page context so the user can ask about what they are viewing.

The assistant must support:

- Page-aware questions and explanations
- Suggested prompts relevant to the current module
- Knowledge lookup across the business ontology and synthetic operating data
- Evidence or source references where applicable
- A useful deterministic or locally available demonstration mode
- An optional connected AI mode when configured
- Graceful fallback when connected services are unavailable

The choice of AI provider or model is intentionally unspecified. Any credentials must be protected behind an appropriate secure boundary and must never be exposed to an untrusted client.

## 5. Cross-module analytical behavior

### 5.1 Visualization requirement

Every page with meaningful quantitative, temporal, categorical, relational, or geographic data must include an appropriate visualization. Choose the clearest form for the decision being supported, such as a trend, comparison, distribution, composition, heat map, process flow, network graph, or KPI summary.

Visualizations must:

- Be responsive and readable
- Include labels, units, legends, and accessible descriptions
- Show useful empty, loading, error, and no-result states
- Support interaction when it improves a decision
- Coordinate with filters and detail views
- Avoid decoration that does not improve interpretation

No particular visualization library or rendering technique is mandated.

### 5.2 Historical data and prediction

Every time-based analytical view must include historical observations and at least two future periods of prediction. Historical and predicted values must be visibly different through line treatment, color, shading, labels, or another accessible encoding.

The data model must explicitly distinguish observed and predicted values using semantic metadata appropriate to the selected technology. Tooltips, tables, exports, and summaries must preserve that distinction.

Forecasts may be synthetic in the demonstration product, but they must be plausible, internally consistent, and clearly described as predictions rather than actual results.

### 5.3 Drill-down and aggregate-up

Users must be able to move down into detail and aggregate back up without losing context. Each module must provide a visible hierarchy control, breadcrumbs or equivalent context, a clear reset path, and metrics recalculated for the selected scope.

Required dimensional hierarchies:

| Module | Required hierarchy |
| --- | --- |
| Market Demand | Region → vehicle model → week |
| Production Planning | Date → shift → vehicle model |
| Suppliers | Category → supplier → month |
| Manufacturing Execution | Operating status → station, with an extensible plant → line → shift → station model |
| Quality Management | Severity → station → vehicle model |
| Ontology | Entity type → entity |
| Agents | Team → model type → agent |
| Model Operations | Business module → model type → agent |

Changing the selected scope must update KPIs, charts, tables, recommendations, and assistant context consistently. Aggregation must be mathematically valid for each metric; percentages and rates must be recomputed from their components rather than blindly summed or averaged.

## 6. Module requirements

### 6.1 Market Demand

Provide:

- KPI summaries for demand, growth, mix, and forecast change
- Historical demand trends with predicted periods
- Region and vehicle-model comparisons
- Drill-down from region to model to week and roll-up to each parent level
- Clear identification of demand anomalies and their likely planning impact
- Decision actions such as generating a demand report, flagging an anomaly, and sending a scenario to planning

### 6.2 Production and Personnel Planning

Provide:

- Production requirements by date, shift, and vehicle model
- Historical plan-versus-actual performance and predicted capacity or output
- Capacity, utilization, material, and staffing views
- Scenario comparison and recommendation support
- Drill-down from date to shift to vehicle model and roll-up to summary levels

Personnel planning is a required part of production planning. For every relevant production assignment, show:

- Role required
- Headcount required, available, and missing
- Skills required
- Qualifications or certifications required
- Current coverage and gaps
- Recommended staffing, training, reassignment, or escalation action

Users must be able to report a staffing issue, assign an owner, request training or reassignment, escalate a qualification gap, and record a planning decision.

### 6.3 Suppliers and Procurement

Provide:

- Supplier performance, lead-time, quality, delivery, cost, and risk indicators
- Historical trends and predicted risk or delivery performance
- Category-to-supplier-to-month drill-down and roll-up
- A ranked supplier comparison and explainable recommended actions
- Procurement exposure and material availability impact

Users must be able to initiate and complete a procurement review, report a concern, assign an owner, escalate risk, approve or reject a recommendation, and record the rationale. Completed decisions must remain visible in the appropriate activity history.

### 6.4 Manufacturing Execution

Provide:

- Current production status, throughput, downtime, cycle time, and utilization
- Historical operating trends with predicted output, utilization, or risk
- Status-to-station drill-down, plus a data model that can extend through plant, line, shift, and station
- Bottleneck and exception identification
- Contextual recommendations for operational response

Users must be able to report an issue, acknowledge an alert, assign an owner, escalate a production risk, apply an authorized override where appropriate, and record the operational decision.

### 6.5 Quality Management

Provide:

- Defect, severity, station, model, trend, and closure metrics
- Historical quality trends with predicted defect or risk periods
- Severity-to-station-to-model drill-down and roll-up
- Pareto, distribution, trend, and process-oriented visual analysis where appropriate
- Traceability from quality issues to production, supplier, and ontology context

Users must be able to create a report, assign an owner, escalate an issue, change status, add a decision note, and close an issue. These actions must update the current state, timeline, counts, and activity history.

## 7. Platform applications

### 7.1 Ontology

Create an ontology explorer with an interactive relationship graph, not only cards or a list.

It must support:

- Nodes and labeled relationships
- Multiple entity types, visually distinguishable without relying only on color
- Pan, zoom, focus, selection, and neighbor highlighting
- Search and entity-type filtering
- Entity-type-to-entity drill-down and roll-up
- A detail view for the selected entity
- Links to relevant operational context
- A visible legend and accessible non-graph alternative

Populate the ontology with a meaningful connected model covering at least vehicles, parts, suppliers, plants, lines, stations, processes, quality issues, people or roles, and agents.

### 7.2 Agents / Digital Workforce

Provide:

- Agent status, team, model type, business purpose, and recent activity
- Historical activity or performance with predicted workload, capacity, or risk
- Team-to-model-type-to-agent drill-down and roll-up
- Controls to inspect, pause, resume, assign, or escalate agent work as authorized
- Clear human ownership and accountability

### 7.3 Model Operations and Governance

Provide:

- Business-module, model-type, and agent views
- Historical service, quality, cost, or risk metrics with predictions
- Business-module-to-model-type-to-agent drill-down and roll-up
- Version, status, owner, review state, and deployment context
- Controls to report, assign, approve, reject, escalate, pause, or record a governance decision as authorized
- An auditable activity history

## 8. Stateful decision workflows

Buttons must perform meaningful state changes; they must not be decorative.

At minimum, the product must support these reusable decision concepts where relevant:

- Report
- Assign
- Review
- Recommend
- Approve or reject
- Escalate
- Acknowledge
- Override
- Add decision note
- Close or reopen
- Export or share a decision record

Each action must provide appropriate confirmation, authorization handling, status feedback, and error recovery. Successful actions must update the visible data and append a timestamped activity entry containing the action, subject, prior and new state, rationale when required, and responsible actor.

For a demonstration build, state may be stored using any appropriate local, embedded, or service-based mechanism, but it must survive normal navigation and remain internally consistent. A production implementation should use durable persistence and authorization appropriate to its operating environment.

## 9. Language requirements

Provide complete English and Simplified Chinese experiences.

- In English mode, no Chinese may appear in navigation, content, data labels, actions, tooltips, errors, empty states, accessibility text, or assistant responses.
- In Chinese mode, no English may appear in those same surfaces, except unavoidable proper nouns, approved trademarks, or universally accepted technical identifiers.
- Language switching must update the entire visible experience immediately and consistently.
- User-generated business content may retain its source language only when translation would alter or misrepresent the original record; clearly identify such exceptions.
- The data and content model must support language-specific labels and descriptions rather than relying on partial interface translation.

Add automated or repeatable checks that detect accidental cross-language leakage.

## 10. Synthetic demonstration data

Create enough coherent synthetic data to exercise every visualization, hierarchy, state transition, language mode, and forecast. The data may be generated, embedded, loaded from files, or served by a local or remote service; no storage format is prescribed.

Recommended minimum coverage:

- 12 or more weekly demand observations per region and vehicle model, plus at least 2 predicted weeks
- 14 or more days of planning history across at least 3 shifts and 3 vehicle models, plus predicted periods
- 6 or more suppliers across multiple categories and 12 or more monthly observations, plus predicted periods
- 8 or more manufacturing stations with multiple operating states and time-series history, plus predicted periods
- 12 or more quality issues across multiple severities, stations, models, owners, and workflow states
- 25 or more ontology entities with meaningful typed relationships
- 8 or more agents across multiple teams and model types
- 8 or more governed model or service records across multiple business modules
- Historical activity records for reports, assignments, reviews, escalations, approvals, overrides, and closures

Synthetic records must be referentially coherent across modules. For example, a supplier, part, station, model, quality issue, role, or agent referenced in one module should resolve to the same business entity elsewhere.

## 11. Quality, security, and operability

Regardless of technology choice, the delivered application must:

- Be straightforward to install, configure, run, test, and deploy
- Include a reproducible local demonstration mode
- Protect secrets and sensitive configuration
- Validate inputs and handle failed operations safely
- Preserve auditability for business decisions
- Meet reasonable accessibility and responsive-design standards
- Avoid preventable performance problems in charts, graph exploration, filters, and large lists
- Include automated checks appropriate to the selected technology
- Pass all documented static analysis, tests, packaging, and production-build checks

Include concise documentation for:

- Architecture and major technology decisions
- Local startup and production deployment
- Configuration and optional connected-service setup
- Synthetic data generation or reset
- Business dimensions, metrics, and forecast semantics
- Test and quality commands
- Known limitations and extension points

## 12. Acceptance scenarios

The rebuild is complete only when all of the following can be demonstrated:

1. A user can navigate all five operational modules and reveal or collapse the three platform applications.
2. The visual stage map centers Stages 1, 4, and 5, with Stage 5 directly below Stage 4 and Stages 2 and 3 in parallel.
3. Knowledge & Chat is available from every page as a call-to-action and is not a separate primary-navigation destination.
4. Every page with meaningful data contains a decision-relevant visualization.
5. Every time-series visualization shows historical observations and at least two clearly differentiated predicted periods.
6. Every required dimension supports drill-down and roll-up, and all dependent KPIs, charts, tables, and recommendations recalculate correctly.
7. Production planning identifies required roles, skills, qualifications, headcount coverage, and staffing gaps.
8. Supplier, manufacturing, quality, personnel, agent, and governance actions make visible state changes and produce auditable activity records.
9. The ontology page presents a usable interactive relationship graph with filtering, selection, relationship exploration, and an accessible alternative.
10. English mode contains no unintended Chinese, and Chinese mode contains no unintended English.
11. The complete experience remains useful without external AI or business-system connectivity.
12. Optional connected services fail gracefully and do not expose credentials.
13. Synthetic data is coherent across modules and is sufficient to exercise all required states and analytical levels.
14. The application is responsive, accessible, and usable on the supported form factors.
15. All documented quality checks and production packaging steps succeed.

## 13. Recommended delivery sequence

The delivery sequence is flexible, but a practical order is:

1. Define the shared business ontology, dimensions, metrics, language content, forecast semantics, and action states.
2. Establish the application shell, navigation, language switching, stage map, global Knowledge & Chat entry point, and platform-layer reveal behavior.
3. Build coherent synthetic data and validate cross-module references.
4. Implement operational modules, visualizations, forecasts, and dimensional drill behavior.
5. Implement personnel planning and stateful decision workflows.
6. Implement the ontology, agents, and governance applications.
7. Add offline assistant behavior and optional connected-service adapters.
8. Verify language isolation, accessibility, responsiveness, audit history, failure states, and all acceptance scenarios.

The implementer may change this sequence when another approach is more effective, provided that the final product satisfies the complete business contract.

## 14. Explicitly outside the core demonstration scope

Unless separately requested, the core demonstration does not require:

- Live ERP, MES, PLM, supplier, identity, or human-resources integrations
- Real procurement commitments or automated production control
- Production-grade single sign-on or role administration
- Legally binding electronic approvals
- A specific cloud, hosting provider, database, framework, AI vendor, or visualization library

Design the boundaries so these capabilities can be added later without rewriting the business model or user workflows.
