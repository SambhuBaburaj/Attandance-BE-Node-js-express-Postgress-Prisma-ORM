const { z } = require('zod');

const todoSchema = z.object({
  title: z
    .string({ message: 'Title is required' })
    .min(2, 'Title must be at least 2 characters'),
  isComplete: z.boolean().optional(),
});

module.exports = todoSchema;
