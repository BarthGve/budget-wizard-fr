
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CalendarDays, CalendarRange } from "lucide-react";
import { motion } from "framer-motion";

interface RecurringExpensesSummaryCardsProps {
  monthlyTotal: number;
  quarterlyTotal: number;
  yearlyTotal: number;
}

export const RecurringExpensesSummaryCards = ({
  monthlyTotal,
  quarterlyTotal,
  yearlyTotal
}: RecurringExpensesSummaryCardsProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.9,
      rotateX: 20,
      z: -50
    },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateX: 0,
      z: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: i * 0.1
      }
    })
  };

  return (
    <motion.div 
      className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {[
        {
          title: "Mensuel",
          value: monthlyTotal,
          Icon: Calendar,
          index: 0
        },
        {
          title: "Trimestriel",
          value: quarterlyTotal,
          Icon: CalendarDays,
          index: 1
        },
        {
          title: "Annuel",
          value: yearlyTotal,
          Icon: CalendarRange,
          index: 2
        }
      ].map(({ title, value, Icon, index }) => (
        <motion.div
          key={title}
          custom={index}
          variants={cardVariants}
          whileHover={{
            scale: 1.03,
            rotateX: 5,
            z: 20,
            boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
            transition: { duration: 0.3 }
          }}
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px"
          }}
        >
          <Card className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-md dark:bg-gray-800 transform-gpu">
            <CardHeader className="py-[16px]">
              <div className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl md:text-2xl text-white">{title}</CardTitle>
                <Icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <CardDescription className="text-sm md:text-base text-white">Total des charges {title.toLowerCase()}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg md:text-xl text-white font-bold">{Math.round(value)} €</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};
