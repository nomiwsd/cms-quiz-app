import type { CollectionConfig } from 'payload'

// Questions collection — stores the 10 quiz questions
// Each question has 4 options with scores 0–3
// The 'order' field controls display sequence (1–10)
export const Questions: CollectionConfig = {
  slug: 'questions',
  admin: {
    useAsTitle: 'text',
    defaultColumns: ['text', 'order'],
    description: 'Quiz questions. Each must have exactly 4 options scored 0–3.',
  },
  fields: [
    {
      name: 'text',
      type: 'text',
      required: true,
      label: 'Question Text',
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      label: 'Display Order',
      admin: {
        description: 'Controls the question sequence (1–10)',
      },
    },
    {
      name: 'options',
      type: 'array',
      label: 'Answer Options',
      minRows: 4,
      maxRows: 4,
      admin: {
        description: 'Exactly 4 options required. Score range: 0 (lowest) to 3 (highest).',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Option Label',
        },
        {
          name: 'score',
          type: 'number',
          required: true,
          label: 'Score Value',
          min: 0,
          max: 3,
          admin: {
            description: 'Must be 0, 1, 2, or 3',
          },
        },
      ],
    },
  ],
}
