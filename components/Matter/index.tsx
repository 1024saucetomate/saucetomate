import { cloneElement, lazy, Suspense } from "react";

import type { MatterSceneProps, SceneWrapperProps } from "@/utils/interfaces";

const CandidatesBubble = lazy(() => import("./scenes/CandidatesBubble"));

const SceneWrapper = ({ children, ...props }: Readonly<SceneWrapperProps>): JSX.Element => (
  <Suspense fallback={null}>{cloneElement(children, props)}</Suspense>
);

const Matter = {
  CandidatesBubble: ({ className }: MatterSceneProps): JSX.Element => (
    <SceneWrapper>
      <CandidatesBubble className={className} />
    </SceneWrapper>
  ),
};

export default Matter;
