import experiences from './experiences.json';
import projects from './projects.json';
import { Experience, Projects } from '@/types';

export const BaseCrudService = {
    getAll: async <T>(collection: 'experience' | 'projects'): Promise<{ items: T[] }> => {
        // Simulate async network request
        await new Promise((resolve) => setTimeout(resolve, 100));

        if (collection === 'experience') {
            return { items: experiences as unknown as T[] };
        }
        if (collection === 'projects') {
            return { items: projects as unknown as T[] };
        }
        return { items: [] };
    },
};
