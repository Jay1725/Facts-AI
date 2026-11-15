export const VERIFICATION_STAGES = [
  {
    id: 'input',
    label: 'Processing submitted information',
    description: 'Checking the format of your text or link.',
  },
  {
    id: 'claims',
    label: 'Identifying factual claims',
    description: 'Separating each checkable statement from the rest of the text.',
  },
  {
    id: 'planning',
    label: 'Planning research',
    description: 'Deciding which facts need live sources and which are stable.',
  },
  {
    id: 'search',
    label: 'Searching the web',
    description: 'Looking for current sources that confirm or contradict each claim.',
  },
  {
    id: 'evidence',
    label: 'Reviewing evidence',
    description: 'Reading retrieved pages for relevant facts and publication dates.',
  },
  {
    id: 'compare',
    label: 'Comparing sources',
    description: 'Checking where sources agree, disagree or are out of date.',
  },
  {
    id: 'report',
    label: 'Preparing verification results',
    description: 'Writing explanations, sources and suggested corrections.',
  },
] as const;

export type VerificationStageId = (typeof VERIFICATION_STAGES)[number]['id'];
