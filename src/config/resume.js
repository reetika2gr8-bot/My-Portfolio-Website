/**
 * RESUME — readable page + download.
 * Drop your PDF at public/assets/resume/resume.pdf (or change `pdf`).
 * If the file is missing the download button quietly says "PDF coming soon".
 */
export const RESUME = {
  pdf: 'assets/resume/resume.pdf',
  name: 'Reetika',
  headline: 'Designer — UX · Visual · Illustration',
  summary: 'Placeholder summary: two sentences about the kind of designer you are and what you are looking for.',
  sections: [
    {
      title: 'Experience',
      items: [
        { title: 'Role title — Company', meta: '20XX – Present', bullets: ['What you did and the impact.', 'Another achievement.'] },
        { title: 'Role title — Studio', meta: '20XX – 20XX', bullets: ['What you did and the impact.'] },
      ],
    },
    {
      title: 'Education',
      items: [{ title: 'Degree — Institution', meta: '20XX – 20XX', bullets: [] }],
    },
    {
      title: 'Skills',
      items: [{ title: '', meta: '', bullets: ['User research', 'Interaction design', 'Prototyping', 'Illustration', 'Figma', 'Procreate'] }],
    },
  ],
};
