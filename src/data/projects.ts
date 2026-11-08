export const projects: {
  name: string
  category: string
  description: string
  tech: string[]
  status: string
  github?: string
  demo?: string
  thumb?: string
}[] = [
  {
    name: '1Percent Zone',
    category: 'Web Development',
    description: 'A digital gaming top-up store where customers can browse game services, check offers, and start an order.',
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
    status: 'Showcase',
    demo: '', // Add the live website URL here when it is ready.
    thumb: './projects/1percent-zone.png',
  },
]

export const projectCategories = ['Web Development']
