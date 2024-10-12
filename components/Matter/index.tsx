import { cloneElement, lazy, Suspense } from "react";

const CandidatesBubble = lazy(() => import("./scenes/CandidatesBubble"));

function SceneWrapper({ children, ...props }: Readonly<{ children: React.ReactElement }>) {
  return <Suspense>{cloneElement(children, props)}</Suspense>;
}

const Matter = {
  CandidatesBubble: (props: { className?: string }) => (
    <SceneWrapper>
      <CandidatesBubble {...props} />
    </SceneWrapper>
  ),
};

export default Matter;
