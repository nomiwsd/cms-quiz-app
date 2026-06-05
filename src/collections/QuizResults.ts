import type { CollectionConfig, FieldHook } from 'payload'
import { encrypt, decrypt } from '../lib/encryption'

// Hook: runs before a QuizResult document is saved to the DB
// Encrypts the notes field so plain text never touches the database
const encryptNotes: FieldHook = ({ value }) => {
  if (!value || typeof value !== 'string') return value
  return encrypt(value)
}

// Hook: runs after a QuizResult document is read from the DB
// Decrypts the notes field back to readable text for the UI / admin
const decryptNotes: FieldHook = ({ value }) => {
  if (!value || typeof value !== 'string') return value
  return decrypt(value)
}

// QuizResults collection — stores quiz submissions
// Access is intentionally public so Server Actions can read/write
// without requiring the user to be logged in
export const QuizResults: CollectionConfig = {
  slug: 'quiz-results',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'score', 'resultLabel', 'submittedAt'],
    description: 'Quiz submissions. Notes field is Caesar-cipher encrypted at rest.',
  },
  access: {
    // Anyone can create a result (quiz submission from the frontend)
    create: () => true,
    // Anyone can read results (needed for the email lookup feature)
    read: () => true,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      required: false,
      index: true, // indexed for fast email lookup
    },
    {
      name: 'score',
      type: 'number',
      required: true,
      label: 'Total Score',
    },
    {
      name: 'resultLabel',
      type: 'text',
      required: true,
      label: 'Cosmic Animal Result',
    },
    {
      name: 'notes',
      type: 'textarea',
      required: false,
      label: 'User Notes',
      hooks: {
        // Encrypt before saving to DB
        beforeChange: [encryptNotes],
        // Decrypt when reading back from DB
        afterRead: [decryptNotes],
      },
    },
    {
      name: 'breakdown',
      type: 'json',
      required: false,
      label: 'Score Breakdown',
      admin: {
        description: 'Array of { questionId, questionText, selectedLabel, score }',
      },
    },
    {
      name: 'submittedAt',
      type: 'date',
      required: true,
      label: 'Submitted At',
      defaultValue: () => new Date().toISOString(),
      admin: {
        readOnly: true,
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
}
