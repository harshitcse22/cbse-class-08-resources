const promptCategories = [
  {
    label: 'Concept Learning',
    template: `Teach me the {{referenceObject.examSeoTitle}} {{referenceObject.subjectName}} chapter "{{referenceObject.title}}" from {{referenceObject.bookName}} in a simple and quick way.`,
  },
  {
    label: 'Practice Questions',
    template: `Generate practice questions from the {{referenceObject.title}} chapter of {{referenceObject.bookName}}, tailored for {{referenceObject.examSeoTitle}} in {{referenceObject.subjectName}}.`,
  },
  {
    label: 'Revision',
    template: `Generate a quick revision guide for the {{referenceObject.title}} chapter of {{referenceObject.bookName}}, tailored for {{referenceObject.examSeoTitle}} in {{referenceObject.subjectName}}.`,
  },
  {
    label: 'Find My Mistake',
    template: `A student has uploaded a screenshot/image of their solution for a question from the {{referenceObject.title}} chapter of {{referenceObject.bookName}}, for {{referenceObject.examSeoTitle}} {{referenceObject.subjectName}}.`,
  },
  {
    label: 'Exam Prep',
    template: `Generate an exam preparation guide for the {{referenceObject.title}} chapter of {{referenceObject.bookName}}, tailored for {{referenceObject.examSeoTitle}} in {{referenceObject.subjectName}}.`,
  },
]

export default promptCategories
