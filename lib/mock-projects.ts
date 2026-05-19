export interface MockProject {
  id: string
  name: string
  owned: boolean
}

export const MOCK_PROJECTS: MockProject[] = [
  { id: "1", name: "API Architecture", owned: true },
  { id: "2", name: "Frontend Redesign", owned: true },
  { id: "3", name: "Data Pipeline", owned: true },
  { id: "4", name: "Auth Service", owned: false },
  { id: "5", name: "Analytics Dashboard", owned: false },
]
