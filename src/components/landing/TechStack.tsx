
import { appConfig } from "@/config/app.config";

interface TechStackItem {
  icon: string;
  name: string;
}

interface TechStackProps {
  technologies: TechStackItem[];
  appVersion?: string;
}

export const TechStack = ({ technologies, appVersion }: TechStackProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="py-4 bg-background dark:bg-background">
      <div className="container mx-auto px-4">
        {/* Technologies employées */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-6 text-center">
            <span className="inline-block grayscale opacity-60">🚀</span> Propulsé par
          </h3>
          <div className="flex flex-wrap gap-8 justify-center max-w-3xl mx-auto">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className="group flex flex-col items-center transition-all duration-300"
              >
                <div className="h-10 w-10 flex items-center justify-center mb-2 bg-card dark:bg-card rounded-lg shadow-sm p-2 group-hover:shadow-md transition-all">
                  <img
                    src={tech.icon}
                    alt={tech.name}
                    className="max-h-6 max-w-6 object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                  />
                </div>
                <span className="text-xs font-medium text-muted-foreground group-hover:text-primary dark:group-hover:text-primary-foreground transition-colors">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="max-w-4xl mx-auto border-t border-border mb-2"></div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <span className="font-medium text-foreground">{appConfig.name}</span>
            <span className="text-xs bg-muted px-2 py-1 rounded-full">
              v{appVersion || appConfig.version}
            </span>
            <span>© {currentYear}</span>
          </p>
        </div>
      </div>
    </div>
  );
};