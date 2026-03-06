import type {
  BehaviorGraph,
  DiscoveredElement,
  DiscoveredForm,
  DiscoveredPage,
  UIState,
  Transition,
} from '@/types/discovery';

// Minimal, heuristic behavior graph builder for the MVP.
// Future iterations can plug in real probing plans and browser traces.

export interface BehaviorGraphBuilderInput {
  sessionId: string;
  pages: DiscoveredPage[];
  elements: DiscoveredElement[];
  forms: DiscoveredForm[];
}

export function buildBehaviorGraph(input: BehaviorGraphBuilderInput): BehaviorGraph {
  const { sessionId, pages, elements, forms } = input;

  const states: UIState[] = pages.map((page, index) => ({
    id: `state-${index}`,
    pageId: page.id,
    description: page.title || page.url,
    snapshotRef: undefined,
  }));

  const transitions: Transition[] = [];

  // Simple heuristic: every interactive element on a page becomes a self-transition on that page state.
  states.forEach((state) => {
    const pageElements = elements.filter((el) => el.pageId === state.pageId && el.isInteractive);

    pageElements.forEach((el, idx) => {
      transitions.push({
        id: `t-${state.id}-${idx}`,
        fromState: state.id,
        toState: state.id,
        trigger: {
          type: el.type === 'input' || el.type === 'textarea' ? 'change' : 'click',
          selector: el.selector,
          description: el.textContent,
        },
        preconditions: [],
        sideEffects: [],
      });
    });
  });

  const graph: BehaviorGraph = {
    id: `graph-${sessionId}`,
    sessionId,
    states,
    transitions,
    initialStateId: states[0]?.id,
  };

  return graph;
}

