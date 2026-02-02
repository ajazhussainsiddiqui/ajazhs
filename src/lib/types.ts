export interface Contact {
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  location?: string;
  website?: string;
}

export interface Experience {
  id: string;
  title?: string;
  company?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string[];
}

export interface Education {
  id: string;
  institution?: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
}

export interface Skill {
  id: string;
  name: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'None';
}

export interface Project {
  id: string;
  name?: string;
  description?: string[];
  url?: string;
  githubUrl?: string;
  imageUrl?: string;
}

export interface Certificate {
  id: string;
  name?: string;
  issuer?: string;
  date?: string;
  url?: string;
}

export interface Publication {
  id: string;
  title?: string;
  journal?: string;
  date?: string;
  url?: string;
}

export type SectionKey = 'summary' | 'experience' | 'projects' | 'education' | 'certificates' | 'publications' | 'skills';

export interface ResumeData {
  name?: string;
  title?: string;
  avatarUrl?: string;
  contact?: Contact;
  summary?: string;
  experience: Experience[];
  education: Education[];
  skills: {
    languages: Skill[];
    frameworks: Skill[];
    tools: Skill[];
  };
  projects: Project[];
  certificates: Certificate[];
  publications: Publication[];
  hiddenSections?: SectionKey[];
  sectionOrder?: SectionKey[];
  resumeUrl?: string;
}
