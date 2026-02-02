'use client';

import React, { useState } from 'react';
import type { ResumeData, SectionKey } from '@/lib/types';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { Github, Linkedin, Mail, Phone, Pencil, Loader2, Link as LinkIcon, Eye, MapPin, ExternalLink } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Badge } from './ui/badge';
import ResumeSection from './ResumeSection';
import { EditHeaderForm } from './forms/EditHeaderForm';
import { EditSummaryForm } from './forms/EditSummaryForm';
import { EditExperienceForm } from './forms/EditExperienceForm';
import { EditEducationForm } from './forms/EditEducationForm';
import { EditSkillsForm } from './forms/EditSkillsForm';
import { EditProjectsForm } from './forms/EditProjectsForm';
import { EditCertificatesForm } from './forms/EditCertificatesForm';
import { EditPublicationsForm } from './forms/EditPublicationsForm';
import { ManageSectionsForm } from './forms/ManageSectionsForm';
import type { updateResumeData as updateResumeDataType } from '@/components/ResumeLoader';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Contact } from '@/components/Contact';
import { Navigation } from './Navigation';

const ResumeHeader = ({ name, title, contact, avatarUrl, onEdit }: Pick<ResumeData, 'name' | 'title' | 'contact' | 'avatarUrl'> & { onEdit?: () => void }) => {
  const { user } = useAuth();
  const hasContactInfo = contact?.email || contact?.phone || contact?.linkedin || contact?.github || contact?.location;

  return (
    <header className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left mb-12 relative gap-8">
      {user && onEdit && (
        <Button variant="ghost" size="icon" onClick={onEdit} className="absolute top-0 right-0 m-2 shrink-0 z-10">
          <Pencil className="size-4" />
          <span className="sr-only">Edit Header</span>
        </Button>
      )}
      {avatarUrl && (
        <Avatar className="h-60 w-60 shrink-0">
          <AvatarImage src={avatarUrl} alt={name} data-ai-hint="professional headshot" />
        </Avatar>
      )}

      <div className="flex flex-col w-full">
        {name && <h1 className="text-6xl font-bold font-headline text-primary tracking-tight">{name}</h1>}
        {title && <h2 className="text-2xl font-light text-foreground/80 mt-2">{title}</h2>}

        {hasContactInfo && (
          <div className="mt-6 flex flex-wrap justify-center lg:justify-start items-center gap-x-6 gap-y-2 text-sm">
            {contact?.email && (
              <a href={`mailto:${contact.email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="size-4" />
                <span>{contact.email}</span>
              </a>
            )}
            {contact?.phone && (
              <a href={`tel:${contact.phone}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="size-4" />
                <span>{contact.phone}</span>
              </a>
            )}
            {contact?.website && (
              <a href={`https://${contact.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                <ExternalLink className="size-4" />
                <span>{contact.website}</span>
              </a>
            )}
            {contact?.linkedin && (
              <a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Linkedin className="size-4" />
                <span>LinkedIn</span>
              </a>
            )}
            {contact?.github && (
              <a href={`https://${contact.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Github className="size-4" />
                <span>GitHub</span>
              </a>
            )}
            {contact?.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4" />
                <span>{contact.location}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
};

interface ResumeProps {
  initialResumeData: ResumeData | null;
  updateResumeData: typeof updateResumeDataType;
}

export default function Resume({ initialResumeData, updateResumeData }: ResumeProps) {
  const [resume, setResume] = useState(initialResumeData);
  const { user } = useAuth();
  const { toast } = useToast();

  const [editingSection, setEditingSection] = useState<string | null>(null);

  React.useEffect(() => {
    setResume(initialResumeData);
  }, [initialResumeData]);

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
        toast({ title: 'Success', description: 'You have been logged out.' });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'Auth is not available.' });
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to log out.' });
    }
  };


  const handleSave = async (newData: Partial<ResumeData>) => {
    try {
      const updatedResume = await updateResumeData(newData);
      setResume(updatedResume);
      toast({ title: 'Success', description: 'Portfolio updated successfully.' });
    } catch (error) {
      console.error('Save error:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update portfolio.' });
    }
  };

  if (!resume) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  const isSectionHidden = (section: SectionKey) => {
    return resume.hiddenSections?.includes(section);
  }

  const orderedSections = resume.sectionOrder?.filter(section => !isSectionHidden(section)) || [];


  const sectionComponents: Record<SectionKey, React.ReactNode> = {
    summary: (
      <ResumeSection title="About Me" onEdit={() => setEditingSection('summary')} titleClassName="text-4xl">
        {resume.summary && <p className="text-foreground/80 text-lg text-center max-w-4xl mx-auto leading-relaxed whitespace-pre-wrap">{resume.summary}</p>}
      </ResumeSection>
    ),
    projects: (
      <ResumeSection title="My Work" onEdit={() => setEditingSection('projects')} titleClassName="text-4xl">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
          {(resume.projects || []).map((project) => (
            <div key={project.id} className="break-inside-avoid mb-4 group bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
              {project.imageUrl && (
                <div className="aspect-video bg-muted overflow-hidden">
                  <Image
                    src={project.imageUrl}
                    alt={project.name || 'Project image'}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint="abstract technology"
                  />
                </div>
              )}
              <div className="p-4 flex-grow flex flex-col">
                {project.name && <h3 className="text-xl font-bold font-headline mb-2 text-primary leading-tight">{project.name}</h3>}
                {project.description && project.description.length > 0 && (
                  <ul className="list-disc list-inside text-sm text-foreground/70 flex-grow mb-4 space-y-1">
                    {project.description.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
                <div className="flex gap-4 mt-auto pt-2">
                  {project.url && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium">
                      <LinkIcon className="size-4" />
                      Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                      <Github className="size-4" />
                      Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ResumeSection>
    ),
    skills: (
      <ResumeSection title="Skills" onEdit={() => setEditingSection('skills')} titleClassName="text-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {(Object.keys(resume.skills) as Array<keyof typeof resume.skills>).map((category) => {
            const displayNames: Record<string, string> = {
              frameworks: 'Concepts & Methodologies',
              tools: 'Tools & Platforms',
              languages: 'Languages & Frameworks'
            };
            const displayName = displayNames[category] || category;

            return (
              <div key={category} className="bg-card/50 border rounded-xl p-6 hover:border-primary/50 transition-colors duration-300">
                <h4 className="font-headline capitalize font-bold text-lg text-primary mb-4 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/60"></span>
                  {displayName}
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {resume.skills[category].map((skill) => (
                    <Badge key={skill.id} variant="secondary" className="text-sm py-1 px-3 font-normal bg-secondary/50 hover:bg-secondary border-transparent text-foreground/80 transition-colors">
                      {skill.name}
                      {skill.level && skill.level !== 'None' && (
                        <span className="text-muted-foreground/60 ml-1.5 text-xs">· {skill.level}</span>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ResumeSection>
    ),
    experience: (
      <ResumeSection title="Career Journey" onEdit={() => setEditingSection('experience')} titleClassName="text-4xl">
        <div className="max-w-4xl mx-auto border-l-2 border-primary/50 pl-7 space-y-12 relative">
          <div className="absolute -left-[11px] top-0 h-full w-0.5 "></div>
          {resume.experience.map((exp) => (
            <div key={exp.id} className="relative experience-item before:content-[''] before:absolute before:-left-[38px] before:top-1.5 before:h-4 before:w-4 before:rounded-full before:bg-primary before:border-2 before:border-background">
              {(exp.startDate || exp.endDate) && <p className="text-sm text-muted-foreground mb-1">{exp.startDate || ''} {exp.startDate && exp.endDate && '-'} {exp.endDate || ''}</p>}
              {exp.title && <h3 className="text-2xl font-bold font-headline text-primary">{exp.title}</h3>}
              {exp.company && (
                <p className="text-lg text-foreground/80 font-medium mb-3">
                  {exp.company}
                  {exp.location && <span className="text-muted-foreground"> / {exp.location}</span>}
                </p>
              )}
              {exp.description && exp.description.length > 0 && (
                <ul className="list-disc list-outside ml-5 space-y-1.5 text-foreground/70">
                  {exp.description.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </ResumeSection>
    ),
    education: (
      <ResumeSection title="Education" onEdit={() => setEditingSection('education')} titleClassName="text-4xl">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {resume.education.map((edu) => (
            <div key={edu.id} className="bg-card border rounded-lg p-6 shadow-sm">
              {(edu.startDate || edu.endDate) && <p className="text-sm text-muted-foreground mb-1">{edu.startDate || ''} {edu.startDate && edu.endDate && '-'} {edu.endDate || ''}</p>}
              {edu.degree && <h3 className="text-xl font-bold font-headline text-primary">{edu.degree}</h3>}
              {edu.fieldOfStudy && <p className="text-lg text-foreground/80 font-medium">{edu.fieldOfStudy}</p>}
              {edu.institution && <p className="text-md text-muted-foreground">{edu.institution}</p>}
            </div>
          ))}
        </div>
      </ResumeSection>
    ),
    certificates: (
      <ResumeSection title="Certifications" onEdit={() => setEditingSection('certificates')} titleClassName="text-4xl">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(resume.certificates || []).map((cert) => (
            <div key={cert.id} className="bg-card border rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
              {cert.name && <h3 className="text-lg font-bold font-headline text-primary">{cert.name}</h3>}
              {cert.issuer && <p className="text-md text-foreground/80 font-medium mt-1">{cert.issuer}</p>}
              {cert.date && <p className="text-sm text-muted-foreground mt-1">{cert.date}</p>}
              {cert.url && (
                <a href={cert.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-accent-foreground hover:underline mt-4 font-medium">
                  <LinkIcon className="size-4" />
                  Credential
                </a>
              )}
            </div>
          ))}
        </div>
      </ResumeSection>
    ),
    publications: (
      <ResumeSection title="Publications" onEdit={() => setEditingSection('publications')} titleClassName="text-4xl">
        <div className="max-w-4xl mx-auto space-y-6">
          {(resume.publications || []).map((pub) => (
            <div key={pub.id} className="bg-card border rounded-lg p-6 shadow-sm flex items-start gap-6">
              <div>
                {pub.date && <p className="text-sm text-muted-foreground">{pub.date}</p>}
                {pub.title && <h3 className="text-xl font-bold font-headline text-primary">{pub.title}</h3>}
                {pub.journal && <p className="text-md text-foreground/80 font-medium mt-1">{pub.journal}</p>}
                {pub.url && (
                  <a href={pub.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-accent-foreground hover:underline mt-2 font-medium">
                    <LinkIcon className="size-4" />
                    View Publication
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </ResumeSection>
    ),
  };

  // const orderedSections = resume.sectionOrder?.filter(section => !isSectionHidden(section)) || []; // Moved up

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navigation sectionOrder={orderedSections} hiddenSections={resume.hiddenSections || []} resumeUrl={resume.resumeUrl} />

      <main className="pt-24 pb-12 px-6 lg:px-12 max-w-5xl mx-auto w-full">
        {user && (
          <div className="flex justify-end mb-4 no-print">
            <Button onClick={() => setEditingSection('manageSections')} variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              Customize Sections
            </Button>
          </div>
        )}

        <ResumeHeader
          name={resume.name}
          title={resume.title}
          contact={resume.contact}
          avatarUrl={resume.avatarUrl}
          onEdit={() => setEditingSection('header')}
        />

        {orderedSections.map((section) => (
          <div key={section} id={section} className="mb-24 scroll-mt-24">
            {sectionComponents[section]}
          </div>
        ))}

        {user && (
          <>
            <ManageSectionsForm
              open={editingSection === 'manageSections'}
              setOpen={() => setEditingSection(null)}
              hiddenSections={resume.hiddenSections || []}
              sectionOrder={resume.sectionOrder || []}
              onSave={handleSave}
            />
            <EditHeaderForm
              open={editingSection === 'header'}
              setOpen={() => setEditingSection(null)}
              resumeData={{ name: resume.name, title: resume.title, contact: resume.contact, avatarUrl: resume.avatarUrl, resumeUrl: resume.resumeUrl }}
              onSave={handleSave}
            />
            <EditSummaryForm
              open={editingSection === 'summary'}
              setOpen={() => setEditingSection(null)}
              summary={resume.summary || ''}
              onSave={handleSave}
            />
            <EditExperienceForm
              open={editingSection === 'experience'}
              setOpen={() => setEditingSection(null)}
              experience={resume.experience}
              onSave={handleSave}
            />
            <EditProjectsForm
              open={editingSection === 'projects'}
              setOpen={() => setEditingSection(null)}
              projects={resume.projects || []}
              onSave={handleSave}
            />
            <EditEducationForm
              open={editingSection === 'education'}
              setOpen={() => setEditingSection(null)}
              education={resume.education}
              onSave={handleSave}
            />
            <EditCertificatesForm
              open={editingSection === 'certificates'}
              setOpen={() => setEditingSection(null)}
              certificates={resume.certificates || []}
              onSave={handleSave}
            />
            <EditPublicationsForm
              open={editingSection === 'publications'}
              setOpen={() => setEditingSection(null)}
              publications={resume.publications || []}
              onSave={handleSave}
            />
            <EditSkillsForm
              open={editingSection === 'skills'}
              setOpen={() => setEditingSection(null)}
              skills={resume.skills}
              onSave={handleSave}
            />
          </>
        )}

        <footer className="text-center text-sm text-muted-foreground pt-12 border-t mt-12">
          <Contact resumeUrl={resume.resumeUrl} />
          <div className='mt-10'></div>
          <p>&copy; {new Date().getFullYear()} {resume.name}. All Rights Reserved.</p>
          {!user && (
            <Link href="/login" className="hover:text-primary transition-colors text-foreground/50 mt-2 inline-block">
              Admin Login
            </Link>
          )}
        </footer>
      </main>
    </div>
  );
}
