/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: experience
 * Interface for Experience
 */
export interface Experience {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  title?: string;
  /** @wixFieldType text */
  organizationName?: string;
  /** @wixFieldType text */
  location?: string;
  /** @wixFieldType date */
  startDate?: Date | string;
  /** @wixFieldType date */
  endDate?: Date | string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  experienceType?: string;
  /** @wixFieldType url */
  link?: string;
}


/**
 * Collection ID: projects
 * Interface for Projects
 */
export interface Projects {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  projectName?: string;
  /** @wixFieldType text */
  projectDescription?: string;
  /** @wixFieldType text */
  projectType?: string;
  /** @wixFieldType url */
  githubLink?: string;
  /** @wixFieldType url */
  liveLink?: string;
  /** @wixFieldType image */
  mainScreenshot?: string;
  /** @wixFieldType text */
  techStack?: string;
  /** @wixFieldType text */
  architectureDetails?: string;
  /** @wixFieldType text */
  designDecisions?: string;
}
