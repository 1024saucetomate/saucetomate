import { all as getCandidates, fromId as getCandidateFromId } from "./methods/get/candidates";
import { fromId as getPolicyFromId, random as getRandomPolicies } from "./methods/get/policies";

export default class MockAPI {
  static get = {
    candidates: {
      all: getCandidates,
      id: getCandidateFromId,
    },
    policies: {
      random: getRandomPolicies,
      id: getPolicyFromId,
    },
  };
}
