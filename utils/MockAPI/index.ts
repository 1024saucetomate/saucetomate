import { all as getCandidates, fromId as getCandidateFromId, randomGIF } from "./methods/get/candidates";
import { fromId as getPolicyFromId, random as getRandomPolicies } from "./methods/get/policies";

export default class MockAPI {
  static get = {
    candidates: {
      all: getCandidates,
      fromId: getCandidateFromId,
      randomGIF,
    },
    policies: {
      random: getRandomPolicies,
      fromId: getPolicyFromId,
    },
  };
}
