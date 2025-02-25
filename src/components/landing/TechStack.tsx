
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
    <div className="py-12 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="flex justify-end mb-12">
          <div className="flex flex-wrap gap-8 justify-end">
            {technologies.map((tech, index) => (
              <div key={index} className="flex flex-col items-center">
                <img
                  src={tech.icon}
                  alt={tech.name}
                  className="h-8 w-8 object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all"
                />
                <span className="text-xs text-gray-500 mt-1">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 border-t border-gray-200 pt-4">
          <p>
            {appConfig.name} © {currentYear} | Version {appConfig.version}
          </p>
        </div>
      </div>
    </div>
  );
};
