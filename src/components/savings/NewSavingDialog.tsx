<DialogContent 
  className={cn(
    "sm:max-w-[650px] w-full p-0 shadow-lg rounded-lg", // Suppression globale de l'espacement
    isTablet && "sm:max-w-[85%] w-[85%] overflow-y-auto",
     "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-transparent opacity-[0.01]",
      "dark:from-gray-500 dark:via-gray-600 dark:to-transparent dark:opacity-[0.015]",
    
  )}
>
  <div 
    ref={contentRef}
    className="relative flex flex-col pb-6 bg-gradient-to-br from-white via-emerald-50 to-emerald-100 p-6 rounded-lg" // Padding interne ajouté ici
  >
    {/* Background gradient */}
    <div className={cn(
      "absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-br",
      currentColors.gradientFrom,
      currentColors.gradientTo,
      currentColors.darkGradientFrom,
      currentColors.darkGradientTo
    )} />

    {/* Radial gradient */}
    <div className={cn(
      "absolute inset-0 pointer-events-none",
      "bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-transparent opacity-[0.01]",
      "dark:from-gray-500 dark:via-gray-600 dark:to-transparent dark:opacity-[0.015]"
    )} />
    
    {/* Dialog header */}
    <DialogHeader className="relative z-10 mb-4">
      <div className="flex items-center gap-3">
        <div className={cn("p-2.5 rounded-lg", currentColors.iconBg)}>
          {saving ? <EditIcon className="w-5 h-5" /> : <PlusCircleIcon className="w-5 h-5" />}
        </div>
        <DialogTitle className={cn("text-2xl font-bold", currentColors.headingText)}>
          {saving ? "Modifier un versement" : "Ajouter un versement"}
        </DialogTitle>
      </div>
      <div className="ml-[52px] mt-2">
        <DialogDescription className={cn("text-base", currentColors.descriptionText)}>
          {saving
            ? "Modifiez les informations de votre versement d'épargne."
            : "Ajoutez un nouveau versement mensuel facilement."}
        </DialogDescription>
      </div>
    </DialogHeader>

    {/* Saving form */}
    <div className="relative z-10 px-1">
      <SavingForm
        name={name}
        onNameChange={setName}
        domain={domain}
        onDomainChange={setDomain}
        amount={amount}
        onAmountChange={setAmount}
        description={description}
        onDescriptionChange={setDescription}
      />

      {/* Buttons */}
      <div className="flex justify-end mt-5 gap-3">
        <Button 
          variant="outline" 
          onClick={() => onOpenChange?.(false)}
        >
          Annuler
        </Button>
        <Button 
          onClick={handleSaveSaving}
          className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg"
        >
          {saving ? "Mettre à jour" : "Ajouter"}
        </Button>
      </div>
    </div>

    {/* Decorative icon */}
    <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-[0.03]">
      <PiggyBank className="w-full h-full" />
    </div>
  </div>
</DialogContent>
