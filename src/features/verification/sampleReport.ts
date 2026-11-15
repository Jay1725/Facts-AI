import type { VerificationReport } from './types';

// Illustration only: every claim, source and URL below is a placeholder.
// example.com is a reserved domain and nothing here reflects real research.
export const SAMPLE_REPORT: VerificationReport = {
  id: 'sample',
  isSample: true,
  submittedAt: '2026-11-10T09:30:00.000Z',
  submittedText:
    'Example text: The city council approved a new transit line last spring, the line serves 40,000 riders a day, and the project is funded entirely by federal grants.',
  summary:
    'This is an example of how a finished report is laid out. Five claims were compared against placeholder sources, one for each verdict type.',
  claims: [
    {
      id: 'sample-1',
      text: 'The city council approved a new transit line last spring.',
      verdict: 'CURRENT',
      explanation:
        'Example: two independent council records from the same period describe the approval, and both are consistent with the claim.',
      confidence: {
        level: 'high',
        reason: 'Two recent, independent sources describe the same event.',
      },
      supportingEvidence: ['Example: council minutes list the approval vote and the date it passed.'],
      contradictingEvidence: [],
      sources: [
        {
          title: 'Example source: council minutes archive',
          url: 'https://example.com/council-minutes',
          publishedAt: '2026-05-14T00:00:00.000Z',
        },
      ],
      suggestedCorrection: null,
    },
    {
      id: 'sample-2',
      text: 'The line serves 40,000 riders a day.',
      verdict: 'OUTDATED',
      explanation:
        'Example: the ridership figure matches an earlier annual report, but a newer report shows a higher number.',
      confidence: {
        level: 'medium',
        reason: 'The newer figure comes from a single transit agency report.',
      },
      supportingEvidence: ['Example: the earlier annual report gives 40,000 average daily riders.'],
      contradictingEvidence: ['Example: the most recent report lists a higher daily average.'],
      sources: [
        {
          title: 'Example source: transit agency annual report',
          url: 'https://example.com/transit-report',
          publishedAt: '2025-02-01T00:00:00.000Z',
        },
      ],
      suggestedCorrection: 'Example: state the most recent ridership figure and its reporting date.',
    },
    {
      id: 'sample-3',
      text: 'The project is funded entirely by federal grants.',
      verdict: 'INACCURATE',
      explanation:
        'Example: the funding statement shows the project also relies on a regional bond, so federal grants do not cover all of it.',
      confidence: {
        level: 'high',
        reason: 'The funding breakdown is stated directly in the official budget document.',
      },
      supportingEvidence: [],
      contradictingEvidence: ['Example: the official budget lists a regional bond as a major funding source.'],
      sources: [
        {
          title: 'Example source: official project budget',
          url: 'https://example.com/project-budget',
          publishedAt: null,
        },
      ],
      suggestedCorrection: 'Example: the project is funded by federal grants and a regional bond.',
    },
    {
      id: 'sample-4',
      text: 'Example: the line was ranked the best new transit project in the country.',
      verdict: 'UNSUPPORTED',
      explanation:
        'Example: no ranking that names this line could be found, so the claim cannot be established from the available research.',
      confidence: {
        level: 'low',
        reason: 'No matching ranking was found in the sources searched.',
      },
      supportingEvidence: [],
      contradictingEvidence: [],
      sources: [],
      suggestedCorrection: null,
    },
    {
      id: 'sample-5',
      text: 'Example: construction finished ahead of schedule.',
      verdict: 'NEEDS_REVIEW',
      explanation:
        'Example: one source reports an early finish for a section of the line, while another describes the full project as delayed.',
      confidence: {
        level: 'low',
        reason: 'Sources conflict and it is unclear which phase each one describes.',
      },
      supportingEvidence: ['Example: a progress update reports one section opened early.'],
      contradictingEvidence: ['Example: a later update reports the full line opening was delayed.'],
      sources: [
        {
          title: 'Example source: construction progress update',
          url: 'https://example.com/progress-update',
          publishedAt: '2026-03-02T00:00:00.000Z',
        },
      ],
      suggestedCorrection: null,
    },
  ],
};
