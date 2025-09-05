
import topics from './educationData.json';

export interface EducationTopic {
  slug: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  steps: string[];
  icon: string;
  color: string;
  iconColor: string;
  textColor: string;
}

export const educationTopics: EducationTopic[] = topics;
