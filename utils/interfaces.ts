export interface PolicyVote {
  id: string;
  isFor: boolean;
}

// eslint-disable-next-line
export interface SwipeProps {}

export interface Vote {
  id: string;
  candidateId: string;
  policies: PolicyVote[];
  createdAt: string;
  updatedAt: string;
}

export interface CandidateScore {
  [candidateId: string]: number;
}

export interface VoteProps {
  params: {
    id: string;
  };
}

export interface RootLayoutProps {
  children: React.ReactNode;
}

// eslint-disable-next-line
export interface NotFoundProps {}

// eslint-disable-next-line
export interface RootProps {}

export interface TemplateProps {
  children: React.ReactNode;
}

export interface CandidateCardProps {
  candidateId: string;
  rank?: number;
  policies: PolicyVote[];
}

export interface Policy {
  id: string;
  theme: string;
  title: string;
  description: string;
  candidateId: string;
}

export interface SwipedPolicy {
  id: string;
  isFor: boolean;
}

export interface BestCandidate {
  id: string;
  name: string;
  slogan: string;
  sex: string;
}

export interface Gif {
  url: string;
  alt: string;
  candidateId?: string;
}

export interface LinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
}

// eslint-disable-next-line
export interface LoadingProps {}

export interface CandidateImage {
  image: {
    src: string;
    width: number;
    height: number;
  };
}

export interface CandidatesBubbleProps {
  className?: string;
}

export interface SceneWrapperProps {
  children: React.ReactElement;
}

export interface MatterSceneProps {
  className?: string;
}

export interface Candidate {
  id: string;
  profile: {
    name: string;
    party: string;
    slogan: string;
    age: number;
    sex: string;
    description: string;
  };
  image: {
    src: string;
    width: number;
    height: number;
  };
  gif: {
    directory: string;
    count: number;
  };
  badges: {
    src: string;
    width: number;
    height: number;
  }[];
  equivalent: {
    party: string;
  };
}

export interface ScoreTracker {
  [candidateId: string]: number;
}

export interface RateLimitTracker {
  count: number;
  expiresAt: number;
}

export interface CardStackProps {
  className?: string;
  onPercentageUpdate: (percentage: number) => void;
}

// eslint-disable-next-line
export interface AboutProps {}

// eslint-disable-next-line
export interface NoticeProps {}

export interface DrawerContent {
  title: string;
  description: string;
}
