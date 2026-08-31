export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export const MILESTONE_PRESETS = [
  'Team Mobilization',
  'Site Survey',
  'Work Start',
  'Equipment Delivery',
  'Installation Complete',
  'Testing & Commissioning',
  'Final Handover',
];

export const DEFAULT_MILESTONES: Milestone[] = [
  'Team Mobilization',
  'Site Survey',
  'Work Start',
  'Testing & Commissioning',
  'Final Handover',
].map((title, index) => ({
  id: `default-milestone-${index + 1}`,
  title,
  completed: false,
}));
