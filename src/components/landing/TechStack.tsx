
interface TechStackItem {
  icon: string;
  name: string;
}

interface TechStackProps {
  technologies: TechStackItem[];
}

export const TechStack = ({ technologies }: TechStackProps) => {
  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
      <div className="relative">
        <div className="flex space-x-12 animate-marquee">
          {technologies.map((tech, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <img
                src={tech.icon}
                alt={tech.name}
                className="h-12 w-12 object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all"
              />
              <span className="text-sm text-gray-500">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
