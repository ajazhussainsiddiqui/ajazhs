import type { ResumeData } from '@/lib/types';

export const STATIC_RESUME: ResumeData = {
    name: 'Ajaz Hussain Siddiqui',
    title: 'Machine Learning & AI Engineer skilled in PyTorch, Deep Learning, and Model Deployment.',
    contact: {
        email: 'ajaz.hs@outlook.com',
        github: "https://github.com/ajazhussainsiddiqui",
        location: 'India',
    },

    summary:
        'Final-year B.Tech student in Artificial Intelligence & Machine Learning at IKGPTU (Main Campus), seeking an internship in the field of Machine Learning. Passionate about building intelligent systems and real-world AI applications. Completed multiple certifications and solo projects across ML, robotics, and web-based AI systems.',

    experience: [],

    education: [
        {
            id: 'edu1',
            institution: 'I.K. Gujral Punjab Technical University, Jalandhar, Punjab.',
            degree: 'B.Tech.',
            fieldOfStudy: 'Artificial Intelligence & Machine Learning',
            startDate: '2022',
            endDate: '2026',
        },
    ],

    skills: {
        languages: [
            { id: 'l1', name: 'Python' },
            { id: 'l2', name: ' SQL' },
            { id: 'l3', name: 'scikit-learn' },
            { id: 'l4', name: 'PyTorch' },
        ],
        frameworks: [
            { id: 'f1', name: ' Machine Learning' },
            { id: 'f2', name: 'AI Algorithms' },
            { id: 'f3', name: 'DSA' },
            { id: 'f4', name: 'Generative AI' },
        ],
        tools: [
            { id: 't1', name: 'OpenCV' },
            { id: 't2', name: 'TTS' },
            { id: 't3', name: 'Supabase' },
            { id: 't4', name: 'Firebase' },
        ],
    },

    projects: [
        {
            id: 'proj1',
            name: 'AI-Powered 3 DOF Robotic Arm System',
            description: [
                'Built a robotic arm (3 DOF) from scratch using plastic materials, Arduino UNO, and servo motors.',
                'Integrated generative AI using Geminis API for interaction via speech, camera, and mechanical movement.',
                'Created a full-stack web interface for remote access and control (live camera feed, command input, real-time servo control).',
                'Used Python for control logic and MS Azure TTS for speech responses.'
            ],
        },
        {
            id: 'proj2',
            name: 'ML Model Implementation on Kaggle Datasets',
            description: [
                'Worked on several well-known ML datasets from Kaggle; implemented and evaluated models using scikit-learn, PyTorch, and pandas.',
                'Focused on optimizing model accuracy and improving interpretability.'
            ],
        },
    ],

    certificates: [
        {
            id: 'cert1',
            name: 'Supervised Machine Learning: Regression and Classification',
            issuer: 'DeepLearning.AI (Stanford University, via Coursera)',
            url: 'https://www.coursera.org/account/accomplishments/verify/E4EVV16WHAHO',
        },
        {
            id: 'cert2',
            name: 'Industrial Training & Internship on Machine Learning using Python',
            issuer: 'NIELIT Patna',
        },
    ],

    publications: [],

    hiddenSections: [],

    sectionOrder: ['summary', 'experience', 'projects', 'education', 'certificates', 'publications', 'skills'],

    resumeUrl: ''
};
