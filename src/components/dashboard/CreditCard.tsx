<Card
  className={cn(
    "backdrop-blur-sm cursor-pointer transition-all duration-300",
    "bg-primary/10 shadow-lg border border-primary/20 hover:shadow-xl",
    "dark:bg-primary/10 dark:border-primary/30 dark:shadow-primary/30 dark:hover:shadow-primary/50"
  )}
  onClick={() => navigate("/credits")}
>
  <CardHeader className="py-4">
    <div className="flex flex-row items-center justify-between">
      <CardTitle className="text-lg flex items-center gap-2">
        <div className={cn(
          "p-2 rounded-full",
          "bg-primary/20 text-primary",
          "dark:bg-primary/20 dark:text-primary"
        )}>
          <CreditCardIcon className="h-5 w-5" />
        </div>
        <span className="text-primary dark:text-primary">Crédits</span>
      </CardTitle>
      <Badge 
        variant="default"
        className={cn(
          "bg-primary px-3 py-1 flex items-center gap-1 text-white",
          "dark:bg-primary dark:text-white"
        )}
      >
        {getStatusIcon(tauxEndettement)}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center cursor-pointer">
              <span className="text-xs">{Math.round(tauxEndettement)}%</span>
            </div>
          </TooltipTrigger>
          <TooltipContent className="dark:bg-primary dark:text-white dark:border-primary">
            <p className="flex items-center gap-1">
              <Info className="h-4 w-4" />
              Taux d'endettement {currentView === "monthly" ? "mensuel" : "annuel"}
            </p>
          </TooltipContent>
        </Tooltip>
      </Badge>
    </div>
    <CardDescription className="text-primary/80 dark:text-primary/70">
      {currentView === "monthly" 
        ? `Total dû en ${currentMonthName}` 
        : `Total dû en ${currentYear}`}
    </CardDescription>
  </CardHeader>
  <CardContent className="pb-4">
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.p 
            className={cn(
              "text-xl font-bold leading-none",
              "text-primary dark:text-primary"
            )}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          >
            {Math.round(totalAmount).toLocaleString('fr-FR')} €
          </motion.p>
          <div className="absolute -inset-1 bg-primary/10 blur-md rounded-full opacity-0 dark:opacity-60" />
        </motion.div>
      </div>
    </div>
  </CardContent>
</Card>