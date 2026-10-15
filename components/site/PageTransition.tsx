/// <reference types="react/canary" />
import { ViewTransition, type ReactNode } from "react";

/**
 * The move from one route to the next: the old screen fades, the new one
 * lifts in behind it.
 *
 * What animates is the browser's root snapshot — an image of the viewport,
 * nothing more. The first version named a wrapper around the whole page
 * instead, and that meant capturing the entire element: on the home page,
 * fifteen thousand pixels of DOM and two WebGL canvases, painted into a
 * texture before the navigation could even begin. Measured, it added up to
 * 600ms of delay and a 650ms frame on a throttled phone. The viewport is all
 * anyone sees mid-transition anyway.
 *
 * So the <ViewTransition> here wraps only a 1px marker. Its mounting and
 * unmounting is what tells React a transition is happening; the animation
 * itself is on ::view-transition-old/new(root) in globals.css, under "Page
 * transitions". In each page.tsx rather than a layout, because layouts
 * persist across navigations and enter/exit never fire there.
 *
 * Browsers without the View Transitions API simply swap the page.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <>
      <ViewTransition enter="page-mark" exit="page-mark" default="none">
        <span aria-hidden="true" className="page-mark" />
      </ViewTransition>
      {children}
    </>
  );
}
