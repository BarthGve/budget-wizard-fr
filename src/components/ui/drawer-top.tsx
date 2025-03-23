
import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/utils"

const DrawerTop = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
)
DrawerTop.displayName = "DrawerTop"

const DrawerTopTrigger = DrawerPrimitive.Trigger

const DrawerTopPortal = DrawerPrimitive.Portal

const DrawerTopClose = DrawerPrimitive.Close

const DrawerTopOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/80", className)}
    {...props}
  />
))
DrawerTopOverlay.displayName = DrawerPrimitive.Overlay.displayName

const DrawerTopContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerTopPortal>
    <DrawerTopOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex h-auto flex-col rounded-b-[10px] border bg-background",
        className
      )}
      {...props}
    >
      {children}
      <div className="mx-auto mb-4 h-2 w-[100px] rounded-full bg-muted" />
    </DrawerPrimitive.Content>
  </DrawerTopPortal>
))
DrawerTopContent.displayName = "DrawerTopContent"

const DrawerTopHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
    {...props}
  />
)
DrawerTopHeader.displayName = "DrawerTopHeader"

const DrawerTopFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
)
DrawerTopFooter.displayName = "DrawerTopFooter"

const DrawerTopTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DrawerTopTitle.displayName = DrawerPrimitive.Title.displayName

const DrawerTopDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DrawerTopDescription.displayName = DrawerPrimitive.Description.displayName

export {
  DrawerTop,
  DrawerTopPortal,
  DrawerTopOverlay,
  DrawerTopTrigger,
  DrawerTopClose,
  DrawerTopContent,
  DrawerTopHeader,
  DrawerTopFooter,
  DrawerTopTitle,
  DrawerTopDescription,
}
