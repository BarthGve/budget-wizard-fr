
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";

interface FeedbackPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const FeedbackPagination = ({
  page,
  totalPages,
  onPageChange,
}: FeedbackPaginationProps) => {
  return (
    <div className="mt-4 flex items-center justify-center">
      <Pagination>
        <Button
          variant="outline"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          Précédent
        </Button>
        <span className="mx-4">
          Page {page} sur {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
        >
          Suivant
        </Button>
      </Pagination>
    </div>
  );
};
