
import { appConfig } from "@/config/app.config";

interface TechStackItem {
  icon: string;
  name: string;
}

interface TechStackProps {
  technologies: TechStackItem[];
}

export const TechStack = ({ technologies }: TechStackProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="py-16 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900/80 dark:to-gray-900">
    <div className="container mx-auto px-4">
      {/* Technologies */}
      <div className="mb-12">
        <h3 className="text-sm font-medium text-gray-400 dark:text-gray-500 mb-6 text-center">Propulsé par</h3>
        <div className="flex flex-wrap gap-8 justify-center max-w-3xl mx-auto">
          {technologies.map((tech, index) => (
            <div key={index} className="group flex flex-col items-center transition-all duration-300">
              <div className="h-10 w-10 flex items-center justify-center mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2 group-hover:shadow-md transition-all">
                <img
                  src={tech.icon}
                  alt={tech.name}
                  className="max-h-6 max-w-6 object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                />
              </div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 group-hover:text-primary dark:group-hover:text-primary-foreground transition-colors">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Divider */}
      <div className="max-w-4xl mx-auto border-t border-gray-200 dark:border-gray-800 mb-8"></div>
      
      {/* Copyright */}
      <div className="text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
          <span className="font-medium">{appConfig.name}</span>
          <span className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded-full">v{appConfig.version}</span>
          <span>© {currentYear}</span>
        </p>
      </div>
    </div>
  </div>
  );
};
