
export interface Experience {
    _id: string;
    title: string;
    organizationName: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    location?: string;
}

export interface Projects {
    _id: string;
    projectName: string;
    projectType?: string;
    projectDescription?: string;
    links?: string[];
    image?: string;
    githubLink?: string;
    liveLink?: string;
    mainScreenshot?: string;
    techStack?: string;
    architectureDetails?: string;
    designDecisions?: string;
}
