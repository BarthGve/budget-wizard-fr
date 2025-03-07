
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FeedbackDetailsDialog } from "@/components/admin/FeedbackDetailsDialog";
import { FeedbackHeader } from "@/components/admin/feedback-header/FeedbackHeader";
import { FeedbackContent } from "@/components/admin/feedback-content/FeedbackContent";
import { useFeedbacks } from "@/hooks/useFeedbacks";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const AdminFeedbacks = () => {
  const {
    page,
    setPage,
    view,
    setView,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    selectedFeedback,
    setSelectedFeedback,
    filteredFeedbacks,
    totalPages,
    isLoading,
    handleStatusUpdate,
    deleteFeedback,
    approveFeedback,
    unapproveFeedback,
    handleDragEnd,
    refetch
  } = useFeedbacks();
  
  const queryClient = useQueryClient();

  // Set up real-time subscription to feedback changes
  useEffect(() => {
    const channel = supabase
      .channel("feedbacks-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "feedbacks",
        },
        () => {
          void queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
          void queryClient.invalidateQueries({ queryKey: ["pending-feedbacks-count"] });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const content = (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Feedbacks</h1>
        <p className="text-muted-foreground">
          Gérez les retours des utilisateurs
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <FeedbackHeader
            view={view}
            onViewChange={setView}
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <FeedbackContent
                view={view}
                feedbacks={filteredFeedbacks}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                onViewDetails={setSelectedFeedback}
                onStatusUpdate={handleStatusUpdate}
                onDelete={deleteFeedback}
                onApprove={approveFeedback}
                onUnapprove={unapproveFeedback}
                onDragEnd={handleDragEnd}
              />
            )}
          </CardContent>
        </Card>
      </motion.div>

      <FeedbackDetailsDialog
        feedback={selectedFeedback}
        onOpenChange={() => setSelectedFeedback(null)}
      />
    </motion.div>
  );

  return <DashboardLayout>{content}</DashboardLayout>;
};

export default AdminFeedbacks;
